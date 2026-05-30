/**
 * Mock LLM 响应 — 统一来自 demo/scenario，保证与示例表单、本地种子一致。
 */
import {
  buildDemoDiagnose,
  buildDemoExtras,
  buildDemoRefine,
} from "@/lib/demo/scenario";

export const MOCK_DIAGNOSE = buildDemoDiagnose();
export const MOCK_REFINE = buildDemoRefine();

const extras = buildDemoExtras();

export const MOCK_OUTREACH = extras.outreach!;
export const MOCK_TRANSLATE = extras.english!;
export const MOCK_PORTFOLIO = extras.portfolio!;
