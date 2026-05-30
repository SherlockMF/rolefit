"use client";

import type { DiagnoseResponse } from "@/lib/types/diagnose";
import type { RefineResponse } from "@/lib/types/refine";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BulletOptimizePanelProps {
  diagnose: DiagnoseResponse;
  refine?: RefineResponse | null;
}

export function BulletOptimizePanel({
  diagnose,
  refine,
}: BulletOptimizePanelProps) {
  const finalItems = refine?.rewriteSuggestionsFinal;

  return (
    <div className="space-y-6">
      {finalItems && finalItems.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            以下为结合你的补充信息后生成的终稿改写（含修改理由与面试风险）。
          </p>
          {finalItems.map((item, index) => (
            <Card key={index} className="border-border/80 shadow-none">
              <CardContent className="space-y-3 pt-6">
                <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-start">
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      原始表达
                    </p>
                    <p className="text-sm leading-relaxed">{item.original}</p>
                  </div>
                  <ArrowRight className="mx-auto hidden size-4 text-muted-foreground md:block md:mt-6" />
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      优化表达
                    </p>
                    <p className="text-sm leading-relaxed">{item.optimized}</p>
                  </div>
                </div>
                <p className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">修改理由：</span>
                  {item.reason}
                </p>
                {item.interviewRisk && (
                  <div className="flex flex-wrap items-start gap-2">
                    <Badge variant="outline" className="text-amber-800 dark:text-amber-200">
                      面试风险
                    </Badge>
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      {item.interviewRisk}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <>
          <Card className="border-border/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">诊断阶段改写建议</CardTitle>
              <CardDescription>
                完成下方「量化追问」并生成终稿后，将显示结合你真实数据的最终版本
              </CardDescription>
            </CardHeader>
          </Card>
          {diagnose.rewriteSuggestions.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg border border-border/80 bg-muted/10 p-4 space-y-3"
            >
              <p className="text-xs font-medium text-muted-foreground">
                经历片段 {index + 1}
              </p>
              <p className="text-sm">{item.original}</p>
              {item.issues.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium">问题</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {item.issues.map((issue, i) => (
                      <li key={i}>· {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {item.followUpQuestions.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium">待补充追问</p>
                  <ul className="text-xs text-sky-800 dark:text-sky-200 space-y-1">
                    {item.followUpQuestions.map((q, i) => (
                      <li key={i}>? {q}</li>
                    ))}
                  </ul>
                </div>
              )}
              {item.optimizedConservative && (
                <div>
                  <p className="mb-1 text-xs font-medium">保守优化预览</p>
                  <p className="text-sm">{item.optimizedConservative}</p>
                </div>
              )}
              {item.interviewRisk && (
                <div className="flex flex-wrap items-start gap-2">
                  <Badge variant="outline" className="text-amber-800">
                    面试风险
                  </Badge>
                  <p className="text-xs text-amber-800">{item.interviewRisk}</p>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
