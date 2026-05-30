import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  url: z.string().url(),
});

const MAX_BYTES = 8 * 1024;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 防 SSRF：
 * - 仅允许 http(s)
 * - 屏蔽 localhost / 内网保留段 / 链路本地 / IPv6 私有地址
 * - 拒绝 file: / ftp: / data: 等非 http 协议
 */
function isPublicHttpUrl(raw: string): { ok: true; url: URL } | { ok: false; reason: string } {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: "URL 解析失败" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: "仅支持 http / https 链接" };
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host === "0.0.0.0") {
    return { ok: false, reason: "不允许抓取本地地址" };
  }
  // IPv6 loopback / 私有 / 链路本地（fe80:: / fc00:: / fd00::）
  if (host === "::1" || /^\[?fe80/i.test(host) || /^\[?f[cd][0-9a-f]{2}/i.test(host)) {
    return { ok: false, reason: "不允许抓取内网地址" };
  }
  // IPv4 私有 / 链路本地 / loopback
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = v4.slice(1).map((n) => Number(n));
    if (
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a === 0
    ) {
      return { ok: false, reason: "不允许抓取内网地址" };
    }
  }
  return { ok: true, url };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "请输入有效的 URL" }, { status: 400 });
    }

    const guard = isPublicHttpUrl(parsed.data.url);
    if (!guard.ok) {
      return NextResponse.json({ error: guard.reason }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(guard.url, {
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ResumeOptimizer/1.0; +https://localhost)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: `抓取失败 (${res.status})，请改用手动粘贴` },
        { status: 502 },
      );
    }

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES * 4) {
      return NextResponse.json(
        { error: "页面过大，请改用手动粘贴 JD" },
        { status: 413 },
      );
    }

    const html = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    let text = stripHtml(html);
    if (text.length > MAX_BYTES) {
      text = `${text.slice(0, MAX_BYTES)}…`;
    }
    if (text.length < 30) {
      return NextResponse.json(
        { error: "未能提取有效文本，请改用手动粘贴" },
        { status: 422 },
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "请求超时，请改用手动粘贴"
        : "抓取失败，请改用手动粘贴";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
