import type { HistoryMeta } from "@/lib/types/resume-optimization";
import type {
  OutreachResponse,
  PortfolioResponse,
  TranslateResponse,
} from "@/lib/types/extras";

export interface HistoryExtras {
  outreach?: OutreachResponse;
  english?: TranslateResponse;
  portfolio?: PortfolioResponse;
}

export function buildMetaFromInputs(inputs: {
  currentRole: string;
  targetRole: string;
  targetCompany?: string;
  targetIndustry?: string;
}): HistoryMeta {
  return {
    currentRole: inputs.currentRole,
    targetRole: inputs.targetRole,
    targetCompany: inputs.targetCompany || undefined,
    targetIndustry: inputs.targetIndustry || undefined,
  };
}

export function buildVersionLabel(meta: HistoryMeta): string {
  const parts = [meta.targetCompany, meta.targetRole].filter(Boolean);
  return parts.join(" · ") || meta.targetRole;
}

/** 浏览器是否可用（含 SSR 守卫） */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export type StorageWriteResult = { ok: true } | { ok: false; reason: "quota" | "unknown" };

/**
 * 统一的 localStorage 写入入口：
 * - SSR 期直接返回 ok
 * - QuotaExceededError 与其它异常分别返回，调用方可据此提示用户
 * - 失败时不会抛出，避免 setState 时崩溃 UI
 */
export function safeSetItem(key: string, value: string): StorageWriteResult {
  if (!isBrowser()) return { ok: true };
  try {
    localStorage.setItem(key, value);
    return { ok: true };
  } catch (error) {
    const isQuota =
      (typeof DOMException !== "undefined" &&
        error instanceof DOMException &&
        (error.name === "QuotaExceededError" ||
          error.name === "NS_ERROR_DOM_QUOTA_REACHED")) ||
      (error instanceof Error && /quota/i.test(error.message));
    if (typeof console !== "undefined") {
      console.warn("[storage] setItem 失败", key, error);
    }
    return { ok: false, reason: isQuota ? "quota" : "unknown" };
  }
}

let lastQuotaNotice = 0;
const QUOTA_NOTICE_INTERVAL = 60_000;

/** quota 失败时弹一个温和提示，最多每分钟一次，避免连环 alert */
export function notifyStorageQuota(): void {
  if (!isBrowser()) return;
  const now = Date.now();
  if (now - lastQuotaNotice < QUOTA_NOTICE_INTERVAL) return;
  lastQuotaNotice = now;
  try {
    window.alert(
      "浏览器本地存储空间不足，最新一次保存可能未生效。建议在「数据管理」里导出备份后删除部分历史。",
    );
  } catch {
    /* noop */
  }
}
