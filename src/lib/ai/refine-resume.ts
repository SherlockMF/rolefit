import { createLLMClient } from "@/lib/ai/client";
import { parseAiJson } from "@/lib/ai/extract-json";
import { normalizeRefineResponse } from "@/lib/ai/normalize";
import { buildRefinePrompt } from "@/lib/ai/prompts";
import {
  refineResponseSchema,
  type RefineRequest,
  type RefineResponse,
} from "@/lib/types/refine";

export async function refineResume(input: RefineRequest): Promise<RefineResponse> {
  const client = createLLMClient();
  const { system, user } = buildRefinePrompt(input);

  const raw = await client.complete(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { temperature: 0.35, maxTokens: 8000, jsonMode: true },
  );

  const parsed = parseAiJson(raw, refineResponseSchema);
  return normalizeRefineResponse(parsed);
}
