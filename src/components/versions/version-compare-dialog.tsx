"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { compareVersions, type ResumeVersion } from "@/lib/storage/versions";

interface VersionCompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versionIdA: string | null;
  versionIdB: string | null;
}

export function VersionCompareDialog({
  open,
  onOpenChange,
  versionIdA,
  versionIdB,
}: VersionCompareDialogProps) {
  const result =
    versionIdA && versionIdB ? compareVersions(versionIdA, versionIdB) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>版本对比</DialogTitle>
          <DialogDescription>
            {result
              ? `匹配分差：${result.scoreDiff > 0 ? "+" : ""}${result.scoreDiff}`
              : "请选择两个版本"}
          </DialogDescription>
        </DialogHeader>
        {result && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-4">
              <p className="mb-2 text-sm font-medium">关键词差异</p>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <KeywordBlock
                  title={`仅 ${result.a.label} 覆盖`}
                  items={result.keywordDiff.onlyInA}
                />
                <KeywordBlock
                  title={`仅 ${result.b.label} 覆盖`}
                  items={result.keywordDiff.onlyInB}
                />
              </div>
              {result.keywordDiff.sharedMissing.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1 text-xs text-muted-foreground">双方仍缺失</p>
                  <div className="flex flex-wrap gap-1">
                    {result.keywordDiff.sharedMissing.map((k) => (
                      <Badge key={k} variant="outline">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <VersionColumn title={result.a.label} version={result.a} />
              <VersionColumn title={result.b.label} version={result.b} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function KeywordBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return (
      <div>
        <p className="text-muted-foreground">{title}</p>
        <p className="mt-1 text-muted-foreground">无</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-muted-foreground">{title}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {items.map((k) => (
          <Badge key={k} variant="secondary">
            {k}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function VersionColumn({
  title,
  version,
}: {
  title: string;
  version: ResumeVersion;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-border/80 p-4">
      <h3 className="font-medium">{title}</h3>
      <dl className="space-y-1 text-sm text-muted-foreground">
        <div>
          <dt className="inline">岗位：</dt>
          <dd className="inline text-foreground">{version.targetRole}</dd>
        </div>
        {version.matchScore != null && (
          <div>
            <dt className="inline">匹配分：</dt>
            <dd className="inline text-foreground">{version.matchScore}</dd>
          </div>
        )}
      </dl>
      {version.applicationReason && (
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">投递建议</p>
          <p className="text-sm leading-relaxed">{version.applicationReason}</p>
        </div>
      )}
      <div>
        <p className="mb-1 text-xs font-medium text-muted-foreground">简历摘要</p>
        <pre className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs leading-relaxed">
          {version.summary}
        </pre>
      </div>
    </div>
  );
}
