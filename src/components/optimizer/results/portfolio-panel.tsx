"use client";

import { useCallback, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PortfolioResponse } from "@/lib/types/extras";
import type { DiagnoseResponse } from "@/lib/types/diagnose";

interface PortfolioPanelProps {
  originalResumeText: string;
  targetRole: string;
  diagnose: DiagnoseResponse;
  followUpAnswers?: Record<string, string>;
  cached?: PortfolioResponse;
  onCached: (data: PortfolioResponse) => void;
  extrasBlocked?: boolean;
  onAcquire?: () => boolean;
  onRelease?: () => void;
}

export function PortfolioPanel(props: PortfolioPanelProps) {
  const [data, setData] = useState<PortfolioResponse | null>(props.cached ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    if (props.extrasBlocked || (props.onAcquire && !props.onAcquire())) return;
    setLoading(true);
    setError(null);
    try {
      const suggestions = props.diagnose.rewriteSuggestions.map((s) => ({
        original: s.original,
        optimized: s.optimizedConservative,
      }));
      const res = await fetch("/api/generate-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalResumeText: props.originalResumeText,
          targetRole: props.targetRole,
          rewriteSuggestions: suggestions,
          followUpAnswers: props.followUpAnswers,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "生成失败");
      setData(json as PortfolioResponse);
      props.onCached(json as PortfolioResponse);
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
            将核心经历扩展为 2–3 个项目 case，可用于面试附件或 Notion
          </p>
          <Button onClick={fetchPortfolio} disabled={props.extrasBlocked}>
            生成作品集
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
    if (!data || !confirmed) return;
    const blob = new Blob([data.portfolioMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "作品集.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          请核对所有项目与数据真实性后再用于投递或面试。
        </AlertDescription>
      </Alert>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="portfolio-confirm"
            checked={confirmed}
            onCheckedChange={(c) => setConfirmed(c === true)}
          />
          <Label htmlFor="portfolio-confirm" className="text-xs font-normal">
            我已核对项目与数据真实性
          </Label>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={fetchPortfolio} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            重新生成
          </Button>
          <Button variant="outline" size="sm" onClick={download} disabled={!data || !confirmed}>
            <Download />
            下载 Markdown
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data?.projectTitles && (
        <Card className="border-border/80 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">包含项目</CardTitle>
            <CardDescription>{data.projectTitles.join(" · ")}</CardDescription>
          </CardHeader>
        </Card>
      )}
      <Textarea
        readOnly
        value={data?.portfolioMarkdown ?? ""}
        className="min-h-[400px] font-mono text-sm"
      />
    </div>
  );
}
