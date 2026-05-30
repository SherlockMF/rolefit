/**
 * 浏览器端文件解析：PDF / DOCX → 纯文本。
 * 仅在客户端调用（"use client"）。
 */

export type ParseResult = {
  text: string;
  filename: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function assertSize(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("文件超过 10 MB，请压缩或粘贴文本");
  }
}

function cleanupText(raw: string): string {
  return raw
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

let cachedWorkerUrl: string | null = null;

async function ensurePdfWorker(
  pdfjs: typeof import("pdfjs-dist"),
): Promise<void> {
  if (cachedWorkerUrl) {
    pdfjs.GlobalWorkerOptions.workerSrc = cachedWorkerUrl;
    return;
  }
  // 用版本号匹配的 CDN worker，避免与 Next.js bundler 的 worker 路径冲突
  const version = pdfjs.version;
  cachedWorkerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  pdfjs.GlobalWorkerOptions.workerSrc = cachedWorkerUrl;
}

export async function parsePdf(file: File): Promise<ParseResult> {
  assertSize(file);

  const pdfjs = await import("pdfjs-dist");
  await ensurePdfWorker(pdfjs);

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;

  const lines: string[] = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();

    let lastY: number | null = null;
    let lineBuf: string[] = [];

    for (const item of content.items as Array<{
      str: string;
      transform?: number[];
    }>) {
      const y = item.transform?.[5] ?? null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
        lines.push(lineBuf.join(""));
        lineBuf = [];
      }
      lineBuf.push(item.str);
      lastY = y;
    }
    if (lineBuf.length) lines.push(lineBuf.join(""));
    lines.push("");
  }

  return {
    text: cleanupText(lines.join("\n")),
    filename: file.name,
  };
}

export async function parseDocx(file: File): Promise<ParseResult> {
  assertSize(file);

  const mammoth = await import("mammoth");
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });

  return {
    text: cleanupText(result.value ?? ""),
    filename: file.name,
  };
}

export async function parseResumeFile(file: File): Promise<ParseResult> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    return parsePdf(file);
  }
  if (
    name.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return parseDocx(file);
  }
  if (name.endsWith(".doc")) {
    throw new Error("旧版 .doc 暂不支持，请另存为 .docx 或 PDF");
  }
  if (name.endsWith(".txt") || name.endsWith(".md")) {
    const text = await file.text();
    return { text: cleanupText(text), filename: file.name };
  }
  throw new Error("仅支持 PDF / DOCX / TXT / MD 文件");
}
