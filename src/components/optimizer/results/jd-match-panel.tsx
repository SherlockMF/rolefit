"use client";

import type { DiagnoseResponse } from "@/lib/types/diagnose";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JdMatchPanelProps {
  data: DiagnoseResponse;
}

function KeywordGroup({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: "matched" | "missing" | "suggested";
}) {
  const styles = {
    matched:
      "border-emerald-200/80 bg-emerald-50/80 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
    missing:
      "border-rose-200/80 bg-rose-50/80 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
    suggested:
      "border-sky-200/80 bg-sky-50/80 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((kw) => (
            <Badge
              key={kw}
              variant="outline"
              className={`font-normal ${styles[variant]}`}
            >
              {kw}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function JdMatchPanel({ data }: JdMatchPanelProps) {
  const { jdMatch, keywords } = data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/80 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">岗位匹配度</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {jdMatch.overall}
              <span className="text-base font-normal text-muted-foreground">
                /100
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">关键词覆盖率</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {jdMatch.keywordCoverage}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">能力缺口</CardTitle>
          <CardDescription>JD 要求但简历未充分覆盖</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {jdMatch.capabilityGaps.map((g, i) => (
              <li key={i}>· {g}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">优先修改项</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
            {jdMatch.priorityFixes.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-medium">ATS 关键词</CardTitle>
          <CardDescription>请仅补充你真实具备的能力</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <KeywordGroup label="已匹配" items={keywords.matched} variant="matched" />
          <KeywordGroup label="缺失" items={keywords.missing} variant="missing" />
          <KeywordGroup
            label="建议补充"
            items={keywords.suggested}
            variant="suggested"
          />
        </CardContent>
      </Card>
    </div>
  );
}
