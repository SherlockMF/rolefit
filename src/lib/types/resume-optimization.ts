import { z } from "zod";

export const optimizeResumeRequestSchema = z.object({
  originalResumeText: z.string().min(50, "简历内容至少需要 50 个字符"),
  targetJobDescription: z.string().min(30, "岗位 JD 至少需要 30 个字符"),
  currentRole: z.string().min(2, "当前身份至少 2 个字符").max(50),
  targetRole: z.string().min(2, "目标岗位至少 2 个字符").max(50),
  targetCompany: z.string().max(100).optional(),
  targetIndustry: z.string().max(100).optional(),
  language: z.literal("zh-CN"),
});

export type OptimizeResumeRequest = z.infer<typeof optimizeResumeRequestSchema>;

export const keywordAnalysisSchema = z.object({
  matched: z.array(z.string()),
  missing: z.array(z.string()),
  suggested: z.array(z.string()),
});

export type KeywordAnalysis = z.infer<typeof keywordAnalysisSchema>;

export const historyMetaSchema = z.object({
  currentRole: z.string().optional(),
  targetRole: z.string(),
  targetCompany: z.string().optional(),
  targetIndustry: z.string().optional(),
});

export type HistoryMeta = z.infer<typeof historyMetaSchema>;

/** @deprecated 使用 DiagnoseResponse + RefineResponse */
export const rewriteSuggestionSchema = z.object({
  original: z.string(),
  optimized: z.string(),
  reason: z.string(),
});

export const optimizeResumeResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  matchSummary: z.string(),
  strengths: z.array(z.string()),
  issues: z.array(z.string()),
  careerChangeRisks: z.array(z.string()),
  hrEvaluation: z.string(),
  keywords: keywordAnalysisSchema,
  rewriteSuggestions: z.array(rewriteSuggestionSchema),
  optimizedResume: z.string(),
});

export type OptimizeResumeResponse = z.infer<
  typeof optimizeResumeResponseSchema
>;
