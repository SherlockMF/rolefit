import { z } from "zod";
import { optimizeResumeRequestSchema } from "./resume-optimization";

export const outreachResponseSchema = z.object({
  bossGreeting: z.string().optional(),
  linkedinMessage: z.string().optional(),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  tips: z.array(z.string()),
});

export type OutreachResponse = z.infer<typeof outreachResponseSchema>;

export const outreachRequestSchema = optimizeResumeRequestSchema.extend({
  resumeSummary: z.string().min(20),
  platform: z.enum(["boss", "linkedin", "email", "all"]).default("all"),
});

export type OutreachRequest = z.infer<typeof outreachRequestSchema>;

export const translateResponseSchema = z.object({
  englishResume: z.string(),
  linkedinHeadline: z.string(),
  linkedinAbout: z.string(),
  actionVerbsUsed: z.array(z.string()),
});

export type TranslateResponse = z.infer<typeof translateResponseSchema>;

export const translateRequestSchema = z.object({
  optimizedResumeHuman: z.string().min(50),
  targetRole: z.string(),
  targetJobDescription: z.string().min(30),
  targetCompany: z.string().optional(),
});

export type TranslateRequest = z.infer<typeof translateRequestSchema>;

export const portfolioResponseSchema = z.object({
  portfolioMarkdown: z.string(),
  projectTitles: z.array(z.string()),
});

export type PortfolioResponse = z.infer<typeof portfolioResponseSchema>;

export const portfolioRequestSchema = z.object({
  originalResumeText: z.string().min(50),
  targetRole: z.string(),
  rewriteSuggestions: z.array(
    z.object({
      original: z.string(),
      optimized: z.string().optional(),
    }),
  ),
  followUpAnswers: z.record(z.string(), z.string()).optional(),
});

export type PortfolioRequest = z.infer<typeof portfolioRequestSchema>;
