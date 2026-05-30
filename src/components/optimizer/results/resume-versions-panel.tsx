"use client";

import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResumeVersionsPanelProps {
  humanVersion: string;
  atsVersion: string;
  onHumanChange: (v: string) => void;
  onAtsChange: (v: string) => void;
}

export function ResumeVersionsPanel({
  humanVersion,
  atsVersion,
  onHumanChange,
  onAtsChange,
}: ResumeVersionsPanelProps) {
  if (!humanVersion && !atsVersion) {
    return (
      <Card className="border-border/80 shadow-none">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          生成终稿后可在此编辑「人工阅读版」与「ATS 投递版」。
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-medium">优化版简历</CardTitle>
        <CardDescription>
          人工版适合 HR 浏览；ATS 版关键词密集、无复杂排版，适合系统解析
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default" className="border-amber-200/80 bg-amber-50/50">
          <AlertCircle className="text-amber-600" />
          <AlertTitle className="text-amber-900">真实性提醒</AlertTitle>
          <AlertDescription className="text-amber-800/90">
            投递前请逐项核对公司、项目、时间与量化数据，确保面试时可解释。
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="human">
          <TabsList>
            <TabsTrigger value="human">人工阅读版</TabsTrigger>
            <TabsTrigger value="ats">ATS 投递版</TabsTrigger>
          </TabsList>
          <TabsContent value="human" className="mt-4 space-y-2">
            <Label htmlFor="resume-human">Markdown 格式</Label>
            <Textarea
              id="resume-human"
              value={humanVersion}
              onChange={(e) => onHumanChange(e.target.value)}
              className="min-h-[360px] resize-y font-mono text-sm leading-relaxed"
            />
          </TabsContent>
          <TabsContent value="ats" className="mt-4 space-y-2">
            <Label htmlFor="resume-ats">纯文本 · 关键词优化</Label>
            <Textarea
              id="resume-ats"
              value={atsVersion}
              onChange={(e) => onAtsChange(e.target.value)}
              className="min-h-[360px] resize-y font-mono text-sm leading-relaxed"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
