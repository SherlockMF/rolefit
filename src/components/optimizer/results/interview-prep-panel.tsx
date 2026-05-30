"use client";

import type { RefineResponse } from "@/lib/types/refine";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InterviewPrepPanelProps {
  refine: RefineResponse | null;
}

export function InterviewPrepPanel({ refine }: InterviewPrepPanelProps) {
  if (!refine) {
    return (
      <Card className="border-border/80 shadow-none">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          完成「生成优化终稿」后，将基于你的简历生成面试追问预测与回答提纲。
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        以下问题可能来自 HR / 面试官对你简历内容的追问。请结合真实经历准备回答。
      </p>
      {refine.interviewQuestions.map((item, i) => (
        <Card key={i} className="border-border/80 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{item.question}</CardTitle>
            <CardDescription>关联：{item.relatedBullet}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">回答提纲：</span>
              {item.suggestedAnswerOutline}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
