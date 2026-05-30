"use client";

import { useCallback, useState } from "react";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TranslateResponse } from "@/lib/types/extras";

interface EnglishResumePanelProps {
  optimizedResumeHuman: string;
  targetRole: string;
  targetJobDescription: string;
  targetCompany?: string;
  cached?: TranslateResponse;
  onCached: (data: TranslateResponse) => void;
  extrasBlocked?: boolean;
  onAcquire?: () => boolean;
  onRelease?: () => void;
}

export function EnglishResumePanel(props: EnglishResumePanelProps) {
  const [data, setData] = useState<TranslateResponse | null>(props.cached ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranslate = useCallback(async () => {
    if (props.extrasBlocked || (props.onAcquire && !props.onAcquire())) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/translate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optimizedResumeHuman: props.optimizedResumeHuman,
          targetRole: props.targetRole,
          targetJobDescription: props.targetJobDescription,
          targetCompany: props.targetCompany,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "生成失败");
      setData(json as TranslateResponse);
      props.onCached(json as TranslateResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "未知错误");
    } finally {
      setLoading(false);
      props.onRelease?.();
    }
  }, [props]);

  if (!data && !loading) {
    return (
      <Card className="border-border/80 shadow-none">
        <CardContent className="py-10 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            生成本地化英文简历与 LinkedIn Headline / About（非直译）
          </p>
          <Button onClick={fetchTranslate} disabled={props.extrasBlocked}>
            生成英文版
          </Button>
          {props.extrasBlocked && (
            <p className="mt-2 text-xs text-muted-foreground">其他 AI 功能生成中，请稍候</p>
          )}
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    );
  }

  const download = () => {
    if (!data) return;
    const blob = new Blob(
      [
        `# English Resume\n\n${data.englishResume}\n\n## LinkedIn\n${data.linkedinHeadline}\n\n${data.linkedinAbout}`,
      ],
      { type: "text/markdown" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-english.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" size="sm" onClick={fetchTranslate} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
          重新生成
        </Button>
        <Button variant="outline" size="sm" onClick={download} disabled={!data}>
          <Download />
          下载英文版
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data?.actionVerbsUsed && (
        <div className="flex flex-wrap gap-2">
          {data.actionVerbsUsed.map((v) => (
            <Badge key={v} variant="outline">
              {v}
            </Badge>
          ))}
        </div>
      )}
      <Field label="English Resume" value={data?.englishResume ?? ""} rows={14} />
      <Field label="LinkedIn Headline" value={data?.linkedinHeadline ?? ""} rows={2} />
      <Field label="LinkedIn About" value={data?.linkedinAbout ?? ""} rows={6} />
    </div>
  );
}

function Field({ label, value, rows }: { label: string; value: string; rows: number }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea readOnly value={value} className="font-mono text-sm" rows={rows} />
    </div>
  );
}
