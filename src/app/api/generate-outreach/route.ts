import { NextResponse } from "next/server";
import { generateOutreach } from "@/lib/ai/generate-extras";
import { outreachRequestSchema } from "@/lib/types/extras";

export const maxDuration = 90;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = outreachRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "请求参数无效", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const result = await generateOutreach(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "服务器内部错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
