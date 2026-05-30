import { diagnoseResume } from "@/lib/ai/diagnose-resume";
import type { OptimizeResumeRequest } from "@/lib/types/resume-optimization";
import type { OptimizeResumeResponse } from "@/lib/types/resume-optimization";

/** @deprecated 请使用 diagnoseResume + refineResume */
export async function optimizeResume(
  input: OptimizeResumeRequest,
): Promise<OptimizeResumeResponse> {
  const diagnose = await diagnoseResume(input);
  return {
    overallScore: diagnose.overallScore,
    matchSummary: diagnose.matchSummary,
    strengths: diagnose.strengths,
    issues: diagnose.issues,
    careerChangeRisks: diagnose.careerChangeRisks,
    hrEvaluation: diagnose.hrEvaluation,
    keywords: diagnose.keywords,
    rewriteSuggestions: diagnose.rewriteSuggestions.map((s) => ({
      original: s.original,
      optimized: s.optimizedConservative ?? s.original,
      reason: s.issues.join("；"),
    })),
    optimizedResume: "请使用新版向导流程生成优化简历。",
  };
}
