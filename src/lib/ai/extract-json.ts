export function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

export function parseAiJson<T>(
  raw: string,
  schema: { safeParse: (v: unknown) => { success: boolean; data?: T; error?: { issues: Array<{ message: string }> } } },
): T {
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(raw));
  } catch {
    throw new Error("AI 返回的内容无法解析为 JSON，请重试");
  }

  const result = schema.safeParse(parsed);
  if (!result.success || result.data === undefined) {
    const msg = result.error?.issues.map((i) => i.message).join("; ") ?? "未知";
    throw new Error(`AI 返回结构不符合预期: ${msg}`);
  }
  return result.data;
}
