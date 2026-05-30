"use client";

import { useCallback, useState } from "react";
import { Copy, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OutreachResponse } from "@/lib/types/extras";
import type { OptimizeResumeRequest } from "@/lib/types/resume-optimization";

interface OutreachPanelProps {
  formData: OptimizeResumeRequest;
  resumeSummary: string;
  cached?: OutreachResponse;
  onCached: (data: OutreachResponse) => void;
  extrasBlocked?: boolean;
  onAcquire?: () => boolean;
  onRelease?: () => void;
}

export function OutreachPanel({
  formData,
  resumeSummary,
  cached,
  onCached,
  extrasBlocked,
  onAcquire,
  onRelease,
}: OutreachPanelProps) {
  const [data, setData] = useState<OutreachResponse | null>(cached ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOutreach = useCallback(async () => {
    if (extrasBlocked || (onAcquire && !onAcquire())) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          resumeSummary,
          platform: "all",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "生成失败");
      setData(json as OutreachResponse);
      onCached(json as OutreachResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "未知错误");
    } finally {
      setLoading(false);
      onRelease?.();
    }
  }, [formData, resumeSummary, onCached, extrasBlocked, onAcquire, onRelease]);

  const copy = (text?: string) => {
    if (text) navigator.clipboard.writeText(text);
  };

  if (!data && !loading) {
    return (
      <Card className="border-border/80 shadow-none">
        <CardContent className="py-10 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            生成 Boss 打招呼、LinkedIn 私信与邮件模板
          </p>
          <Button onClick={fetchOutreach} disabled={extrasBlocked}>
            生成投递话术
          </Button>
          {extrasBlocked && (
            <p className="mt-2 text-xs text-muted-foreground">其他 AI 功能生成中，请稍候</p>
          )}
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={fetchOutreach} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
          重新生成
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Tabs defaultValue="boss">
        <TabsList>
          <TabsTrigger value="boss">Boss 直聘</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="email">邮件</TabsTrigger>
        </TabsList>
        <TabsContent value="boss" className="mt-4 space-y-2">
          <CopyField label="打招呼" value={data?.bossGreeting} onCopy={copy} />
        </TabsContent>
        <TabsContent value="linkedin" className="mt-4 space-y-2">
          <CopyField label="私信 / 连接请求" value={data?.linkedinMessage} onCopy={copy} />
        </TabsContent>
        <TabsContent value="email" className="mt-4 space-y-2">
          <CopyField label="主题" value={data?.emailSubject} onCopy={copy} />
          <CopyField label="正文" value={data?.emailBody} onCopy={copy} multiline />
        </TabsContent>
      </Tabs>
      {data?.tips && data.tips.length > 0 && (
        <Card className="border-border/80 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">平台提示</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              {data.tips.map((t, i) => (
                <li key={i}>· {t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CopyField({
  label,
  value,
  onCopy,
  multiline,
}: {
  label: string;
  value?: string;
  onCopy: (t?: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Button type="button" variant="ghost" size="sm" onClick={() => onCopy(value)}>
          <Copy className="size-3.5" />
          复制
        </Button>
      </div>
      {multiline ? (
        <Textarea readOnly value={value ?? ""} className="min-h-[120px] text-sm" />
      ) : (
        <Textarea readOnly value={value ?? ""} className="min-h-[72px] text-sm" />
      )}
    </div>
  );
}