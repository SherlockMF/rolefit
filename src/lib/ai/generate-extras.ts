import { createLLMClient } from "@/lib/ai/client";
import { parseAiJson } from "@/lib/ai/extract-json";
import {
  buildOutreachPrompt,
  buildPortfolioPrompt,
  buildTranslatePrompt,
} from "@/lib/ai/prompts-extras";
import {
  outreachResponseSchema,
  portfolioResponseSchema,
  translateResponseSchema,
  type OutreachRequest,
  type OutreachResponse,
  type PortfolioRequest,
  type PortfolioResponse,
  type TranslateRequest,
  type TranslateResponse,
} from "@/lib/types/extras";

async function callJson<T>(
  system: string,
  user: string,
  schema: { safeParse: (v: unknown) => { success: boolean; data?: T; error?: { issues: Array<{ message: string }> } } },
): Promise<T> {
  const client = createLLMClient();
  const raw = await client.complete(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { temperature: 0.4, maxTokens: 6000, jsonMode: true },
  );
  return parseAiJson(raw, schema);
}

export async function generateOutreach(
  input: OutreachRequest,
): Promise<OutreachResponse> {
  const { system, user } = buildOutreachPrompt(input);
  return callJson(system, user, outreachResponseSchema);
}

export async function translateResume(
  input: TranslateRequest,
): Promise<TranslateResponse> {
  const { system, user } = buildTranslatePrompt(input);
  return callJson(system, user, translateResponseSchema);
}

export async function generatePortfolio(
  input: PortfolioRequest,
): Promise<PortfolioResponse> {
  const { system, user } = buildPortfolioPrompt(input);
  return callJson(system, user, portfolioResponseSchema);
}
