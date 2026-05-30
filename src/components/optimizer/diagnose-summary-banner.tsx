"use client";

import type { DiagnoseResponse } from "@/lib/types/diagnose";
import { AlertTriangle, CheckCircle2, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const worthStyles = {
  high: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-rose-200 bg-rose-50 text-rose-800",
} as const;

const worthLabel = { high: "建议投递", medium: "谨慎投递", low: "不建议主投" };

interface DiagnoseSummaryBannerProps {
  data: DiagnoseResponse;
}

export function DiagnoseSummaryBanner({ data }: DiagnoseSummaryBannerProps) {
  const w = data.applicationStrategy.worthApplying;

  return (
    <div className="rounded-xl border border-border/80 bg-background p-4 sm:p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-14 flex-col items-center justify-center rounded-xl border bg-muted/40">
            <span className="text-2xl font-semibold tabular-nums">
              {data.overallScore}
            </span>
            <span className="text-[10px] text-muted-foreground">综合分</span>
          </div>
          <div>
            <p className="text-sm font-medium flex items-center gap-1.5">
              <Target className="size-3.5" />
              JD 匹配 {data.jdMatch.overall} · 关键词 {data.jdMatch.keywordCoverage}%
            </p>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground line-clamp-2">
              {data.matchSummary}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={worthStyles[w]}>
          {worthLabel[w]}
        </Badge>
      </div>
      {data.jdMatch.priorityFixes[0] && (
        <p className="mt-3 flex gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 shrink-0 text-foreground/60 mt-0.5" />
          优先改：{data.jdMatch.priorityFixes[0]}
        </p>
      )}
      {data.careerChangeRisks[0] && (
        <p className="mt-2 flex gap-2 text-xs text-amber-800 dark:text-amber-200">
          <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
          {data.careerChangeRisks[0]}
        </p>
      )}
    </div>
  );
}
