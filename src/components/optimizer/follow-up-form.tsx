"use client";

import { useMemo } from "react";
import type { DiagnoseResponse } from "@/lib/types/diagnose";
import { buildFollowUpFields } from "@/lib/optimizer/follow-up-questions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NO_DATA = "暂无精确数据";

interface FollowUpFormProps {
  diagnose: DiagnoseResponse;
  answers: Record<string, string>;
  onAnswersChange: (answers: Record<string, string>) => void;
  onSubmit: () => void;
  onSkip: () => void;
  loading?: boolean;
}

export function FollowUpForm({
  diagnose,
  answers,
  onAnswersChange,
  onSubmit,
  onSkip,
  loading,
}: FollowUpFormProps) {
  const fields = useMemo(
    () => buildFollowUpFields(diagnose),
    [diagnose],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof fields>();
    fields.forEach((f) => {
      const list = map.get(f.group) ?? [];
      list.push(f);
      map.set(f.group, list);
    });
    return Array.from(map.entries());
  }, [fields]);

  const setAnswer = (id: string, value: string) => {
    onAnswersChange({ ...answers, [id]: value });
  };

  const fillNoData = (id: string) => {
    setAnswer(id, NO_DATA);
  };

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-medium">量化追问</CardTitle>
        <CardDescription>
          补充真实数据后，AI 才能写出有说服力、且经得起面试追问的 bullet。
          没有精确数字可填「暂无精确数据」或使用区间（如 10+、约 20%）。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {groups.map(([group, groupFields]) => (
          <div key={group} className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">{group}</h4>
            {groupFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Label htmlFor={field.id} className="text-sm leading-relaxed">
                    {field.label}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => fillNoData(field.id)}
                    disabled={loading}
                  >
                    暂无数据
                  </Button>
                </div>
                <Textarea
                  id={field.id}
                  placeholder="例如：覆盖 3 个部门、周期缩短约 15%、样本量 200+…"
                  value={answers[field.id] ?? ""}
                  onChange={(e) => setAnswer(field.id, e.target.value)}
                  disabled={loading}
                  className="min-h-[72px] resize-y text-sm"
                />
              </div>
            ))}
          </div>
        ))}

        <div className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
          <Button type="button" onClick={onSubmit} disabled={loading} size="lg">
            {loading ? "生成终稿中…" : "生成优化终稿"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={loading}
          >
            跳过追问，生成保守版
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
