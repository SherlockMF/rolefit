import { NextResponse } from "next/server";
import { diagnoseResume } from "@/lib/ai/diagnose-resume";
import { diagnoseRequestSchema } from "@/lib/types/diagnose";

/** @deprecated 请使用 /api/diagnose-resume + /api/refine-resume */
export const maxDuration = 90;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = diagnoseRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "请求参数无效",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const result = await diagnoseResume(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "服务器内部错误";
    console.error("[optimize-resume]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
