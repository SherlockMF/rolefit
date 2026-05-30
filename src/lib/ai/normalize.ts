import type { DiagnoseResponse } from "@/lib/types/diagnose";
import type { RefineResponse } from "@/lib/types/refine";

const DEFAULT_DIMENSIONS = [
  "岗位匹配度",
  "成果量化程度",
  "表达专业度",
  "结构清晰度",
  "ATS友好度",
  "可信度",
  "差异化",
  "可读性",
];

/** 修补 LLM 偶发缺字段 / 缺 id，降低 Zod 失败率 */
export function normalizeDiagnoseResponse(
  raw: DiagnoseResponse,
): DiagnoseResponse {
  const dimensionScores =
    raw.dimensionScores?.length >= 6
      ? raw.dimensionScores
      : DEFAULT_DIMENSIONS.map((dimension) => ({
          dimension,
          score: raw.overallScore ?? 60,
          reason: "基于综合诊断估算",
        }));

  const rewriteSuggestions = (raw.rewriteSuggestions ?? []).map((s, i) => ({
    ...s,
    id: s.id || `b${i + 1}`,
    issues: s.issues ?? [],
    followUpQuestions: s.followUpQuestions ?? [],
  }));

  return {
    ...raw,
    dimensionScores,
    rewriteSuggestions,
    followUpQuestionsGlobal: raw.followUpQuestionsGlobal ?? [],
    lowValuePatterns: raw.lowValuePatterns ?? [],
    atsChecklist: raw.atsChecklist ?? [],
    jdMatch: {
      overall: raw.jdMatch?.overall ?? raw.overallScore ?? 60,
      keywordCoverage: raw.jdMatch?.keywordCoverage ?? 50,
      capabilityGaps: raw.jdMatch?.capabilityGaps ?? [],
      priorityFixes: raw.jdMatch?.priorityFixes ?? [],
    },
    keywords: raw.keywords ?? { matched: [], missing: [], suggested: [] },
    applicationStrategy: raw.applicationStrategy ?? {
      worthApplying: "medium" as const,
      reason: "请结合 JD 与自身经历判断是否投递",
    },
  };
}

export function normalizeRefineResponse(raw: RefineResponse): RefineResponse {
  return {
    ...raw,
    rewriteSuggestionsFinal: raw.rewriteSuggestionsFinal ?? [],
    interviewQuestions: raw.interviewQuestions ?? [],
    optimizedResumeHuman: raw.optimizedResumeHuman ?? "",
    optimizedResumeAts: raw.optimizedResumeAts ?? raw.optimizedResumeHuman ?? "",
  };
}
