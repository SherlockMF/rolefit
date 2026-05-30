import { z } from "zod";
import { optimizeResumeRequestSchema } from "./resume-optimization";
import { diagnoseResponseSchema } from "./diagnose";

export const refineRewriteSuggestionSchema = z.object({
  original: z.string(),
  optimized: z.string(),
  reason: z.string(),
  interviewRisk: z.string().optional(),
});

export const interviewQuestionSchema = z.object({
  question: z.string(),
  relatedBullet: z.string(),
  suggestedAnswerOutline: z.string(),
});

export const refineResponseSchema = z.object({
  optimizedResumeHuman: z.string(),
  optimizedResumeAts: z.string(),
  rewriteSuggestionsFinal: z.array(refineRewriteSuggestionSchema),
  interviewQuestions: z.array(interviewQuestionSchema),
  applicationStrategy: z
    .object({
      worthApplying: z.enum(["high", "medium", "low"]),
      reason: z.string(),
    })
    .optional(),
});

export type RefineResponse = z.infer<typeof refineResponseSchema>;

export const refineRequestSchema = optimizeResumeRequestSchema.extend({
  diagnose: diagnoseResponseSchema,
  followUpAnswers: z.record(z.string(), z.string()),
  skipFollowUp: z.boolean().optional(),
});

export type RefineRequest = z.infer<typeof refineRequestSchema>;
