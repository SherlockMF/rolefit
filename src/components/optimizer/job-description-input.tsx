"use client";

import { useState } from "react";
import { Link2, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function JobDescriptionInput({
  value,
  onChange,
  disabled,
}: JobDescriptionInputProps) {
  const [jdUrl, setJdUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!jdUrl.trim()) return;
    setFetching(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/fetch-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jdUrl.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "抓取失败");
      onChange(json.text as string);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "抓取失败");
    } finally {
      setFetching(false);
    }
  };

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">目标岗位 JD</CardTitle>
        <CardDescription>
          粘贴招聘描述，或粘贴招聘页链接后抓取（部分站点可能失败，请改用手动粘贴）。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <Label htmlFor="jd-url" className="text-xs text-muted-foreground">
              招聘页链接（选填）
            </Label>
            <Input
              id="jd-url"
              placeholder="https://..."
              value={jdUrl}
              onChange={(e) => setJdUrl(e.target.value)}
              disabled={disabled || fetching}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-6"
            onClick={handleFetch}
            disabled={disabled || fetching || !jdUrl.trim()}
          >
            {fetching ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Link2 className="size-3.5" />
            )}
            抓取 JD
          </Button>
        </div>
        {fetchError && <p className="text-xs text-destructive">{fetchError}</p>}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            disabled={disabled || !value}
          >
            <Trash2 className="size-3.5" />
            清空
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="jd-text" className="sr-only">
            岗位 JD
          </Label>
          <Textarea
            id="jd-text"
            placeholder="请粘贴目标岗位的 JD…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="min-h-[180px] resize-y text-sm leading-relaxed"
          />
        </div>
      </CardContent>
    </Card>
  );
}
