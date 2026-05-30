import { z } from "zod";
import { keywordAnalysisSchema, optimizeResumeRequestSchema } from "./resume-optimization";

export const dimensionScoreSchema = z.object({
  dimension: z.string(),
  score: z.number().min(0).max(100),
  reason: z.string(),
});

export const jdMatchSchema = z.object({
  overall: z.number().min(0).max(100),
  keywordCoverage: z.number().min(0).max(100),
  capabilityGaps: z.array(z.string()),
  priorityFixes: z.array(z.string()),
});

export const atsCheckItemSchema = z.object({
  item: z.string(),
  status: z.enum(["pass", "warn", "fail"]),
  suggestion: z.string().optional(),
});

export const diagnoseRewriteSuggestionSchema = z.object({
  id: z.string(),
  original: z.string(),
  issues: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  optimizedConservative: z.string().optional(),
  interviewRisk: z.string().optional(),
});

export const diagnoseResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  matchSummary: z.string(),
  strengths: z.array(z.string()),
  issues: z.array(z.string()),
  careerChangeRisks: z.array(z.string()),
  hrEvaluation: z.string(),
  dimensionScores: z.array(dimensionScoreSchema),
  jdMatch: jdMatchSchema,
  keywords: keywordAnalysisSchema,
  atsChecklist: z.array(atsCheckItemSchema),
  lowValuePatterns: z.array(z.string()),
  rewriteSuggestions: z.array(diagnoseRewriteSuggestionSchema),
  followUpQuestionsGlobal: z.array(z.string()),
  applicationStrategy: z.object({
    worthApplying: z.enum(["high", "medium", "low"]),
    reason: z.string(),
  }),
});

export type DiagnoseResponse = z.infer<typeof diagnoseResponseSchema>;
export type DiagnoseRewriteSuggestion = z.infer<
  typeof diagnoseRewriteSuggestionSchema
>;

export const diagnoseRequestSchema = optimizeResumeRequestSchema;

export type DiagnoseRequest = z.infer<typeof diagnoseRequestSchema>;
