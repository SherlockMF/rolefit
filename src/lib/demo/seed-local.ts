import type { Application } from "@/lib/storage/applications";
import type { HistoryRecord } from "@/lib/storage/history";
import type { ResumeVersion } from "@/lib/storage/versions";
import {
  buildDemoApplication,
  buildDemoBundle,
  buildDemoHistoryRecord,
  buildDemoVersion,
  type DemoBundle,
} from "@/lib/demo/scenario";

const KEYS = {
  history: "resume-optimizer-history",
  versions: "resume-optimizer-versions",
  applications: "resume-optimizer-applications",
} as const;

function readJson<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

function upsertById<T extends { id: string }>(items: T[], item: T): T[] {
  return [item, ...items.filter((x) => x.id !== item.id)];
}

/** 写入完整演示：历史（含诊断/终稿/extras）、版本、投递看板 */
export function seedDemoLocalStorage(): DemoBundle {
  const bundle = buildDemoBundle();
  const history = buildDemoHistoryRecord(bundle);
  const version = buildDemoVersion(bundle);
  const application = buildDemoApplication(bundle);

  writeJson(KEYS.history, upsertById(readJson<HistoryRecord>(KEYS.history), history));
  writeJson(KEYS.versions, upsertById(readJson<ResumeVersion>(KEYS.versions), version));
  writeJson(
    KEYS.applications,
    upsertById(readJson<Application>(KEYS.applications), application),
  );

  return bundle;
}
