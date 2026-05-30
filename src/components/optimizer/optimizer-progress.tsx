"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const DIAGNOSE_STEPS = [
  "解析简历与 JD…",
  "计算岗位匹配度…",
  "扫描 ATS 风险…",
  "生成追问与改写建议…",
];

const REFINE_STEPS = [
  "整合追问回答…",
  "生成双版本简历…",
  "预测面试追问…",
  "完成终稿校验…",
];

interface OptimizerProgressProps {
  active: boolean;
  mode: "diagnose" | "refine";
}

export function OptimizerProgress({ active, mode }: OptimizerProgressProps) {
  const steps = mode === "diagnose" ? DIAGNOSE_STEPS : REFINE_STEPS;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [active, steps.length]);

  if (!active) return null;

  const progress = ((index + 1) / steps.length) * 85;

  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{steps[index]}</span>
        <span className="text-xs text-muted-foreground">请勿关闭页面</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}
