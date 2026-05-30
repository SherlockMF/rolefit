import { z } from "zod";
import { listAll as listHistory, type HistoryRecord } from "@/lib/storage/history";
import { listVersions, type ResumeVersion } from "@/lib/storage/versions";
import { listApplications, type Application } from "@/lib/storage/applications";
import {
  isBrowser,
  notifyStorageQuota,
  safeSetItem,
} from "@/lib/storage/helpers";

const BACKUP_VERSION = 1;
const WARN_BYTES = 4 * 1024 * 1024;

/** 单条记录至少要有 id + createdAt 才被视作可恢复条目 */
const itemSchema = z
  .object({ id: z.string().min(1), createdAt: z.string().optional() })
  .passthrough();

const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  history: z.array(itemSchema),
  versions: z.array(itemSchema),
  applications: z.array(itemSchema),
});

export interface BackupBundle {
  version: 1;
  exportedAt: string;
  history: HistoryRecord[];
  versions: ResumeVersion[];
  applications: Application[];
}

const KEYS = {
  history: "resume-optimizer-history",
  versions: "resume-optimizer-versions",
  applications: "resume-optimizer-applications",
} as const;

export function buildBackupBundle(): BackupBundle {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    history: listHistory(),
    versions: listVersions(),
    applications: listApplications(),
  };
}

export function downloadBackup(): void {
  if (!isBrowser()) return;
  const bundle = buildBackupBundle();
  const json = JSON.stringify(bundle, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `resume-optimizer-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function estimateStorageBytes(): number {
  if (!isBrowser()) return 0;
  let total = 0;
  for (const key of Object.values(KEYS)) {
    const raw = localStorage.getItem(key);
    if (raw) total += new Blob([raw]).size;
  }
  return total;
}

export function isStorageNearLimit(): boolean {
  return estimateStorageBytes() >= WARN_BYTES;
}

export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export type ImportResult =
  | { ok: true; counts: { history: number; versions: number; applications: number } }
  | { ok: false; error: string };

export function importBackup(
  json: string,
  options: { merge: boolean },
): ImportResult {
  if (!isBrowser()) return { ok: false, error: "仅支持浏览器环境" };
  try {
    const parsed = backupSchema.safeParse(JSON.parse(json));
    if (!parsed.success) {
      return { ok: false, error: "备份文件格式无效" };
    }
    const data = parsed.data;

    const write = (
      key: string,
      items: { id: string }[],
      merge: boolean,
    ): { ok: boolean; reason?: "quota" | "unknown" } => {
      let payload: { id: string }[];
      if (merge) {
        let existing: { id: string }[] = [];
        try {
          const raw = JSON.parse(localStorage.getItem(key) ?? "[]");
          if (Array.isArray(raw)) existing = raw as { id: string }[];
        } catch {
          existing = [];
        }
        const map = new Map(existing.map((x) => [x.id, x]));
        for (const item of items) map.set(item.id, item);
        payload = [...map.values()];
      } else {
        payload = items;
      }
      const result = safeSetItem(key, JSON.stringify(payload));
      return result;
    };

    const results = [
      write(KEYS.history, data.history, options.merge),
      write(KEYS.versions, data.versions, options.merge),
      write(KEYS.applications, data.applications, options.merge),
    ];

    const quotaFailure = results.find((r) => !r.ok && r.reason === "quota");
    if (quotaFailure) {
      notifyStorageQuota();
      return { ok: false, error: "本地存储空间不足，导入未完成。请清理后重试。" };
    }
    if (results.some((r) => !r.ok)) {
      return { ok: false, error: "写入本地存储时出错，请重试" };
    }

    return {
      ok: true,
      counts: {
        history: data.history.length,
        versions: data.versions.length,
        applications: data.applications.length,
      },
    };
  } catch {
    return { ok: false, error: "无法解析 JSON 文件" };
  }
}
