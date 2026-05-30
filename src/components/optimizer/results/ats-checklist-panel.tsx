"use client";

import type { DiagnoseResponse } from "@/lib/types/diagnose";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AtsChecklistPanelProps {
  data: DiagnoseResponse;
}

const statusConfig = {
  pass: {
    icon: CheckCircle2,
    label: "通过",
    className: "text-emerald-600",
  },
  warn: {
    icon: AlertTriangle,
    label: "注意",
    className: "text-amber-600",
  },
  fail: {
    icon: XCircle,
    label: "需改进",
    className: "text-rose-600",
  },
} as const;

export function AtsChecklistPanel({ data }: AtsChecklistPanelProps) {
  const passCount = data.atsChecklist.filter((i) => i.status === "pass").length;

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-medium">ATS 兼容性检测</CardTitle>
        <CardDescription>
          通过 {passCount} / {data.atsChecklist.length} 项 ·
          建议同时准备「人工阅读版」与「ATS 投递版」
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.atsChecklist.map((item, i) => {
          const cfg = statusConfig[item.status];
          const Icon = cfg.icon;
          return (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-border/60 p-3"
            >
              <Icon className={`size-4 shrink-0 mt-0.5 ${cfg.className}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{item.item}</p>
                  <span className={`text-xs ${cfg.className}`}>{cfg.label}</span>
                </div>
                {item.suggestion && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.suggestion}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
