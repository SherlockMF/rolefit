"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsibleInputSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  resumePreview?: string;
  jdPreview?: string;
}

export function CollapsibleInputSection({
  collapsed,
  onToggle,
  children,
  resumePreview,
  jdPreview,
}: CollapsibleInputSectionProps) {
  if (!collapsed) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-xl border border-border/80 bg-muted/20">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">已填写</span>
          {resumePreview && (
            <span className="ml-2">简历：{resumePreview.slice(0, 36)}…</span>
          )}
          {jdPreview && (
            <span className="ml-2">JD：{jdPreview.slice(0, 28)}…</span>
          )}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onToggle}>
          <ChevronDown className="size-3.5" />
          展开编辑
        </Button>
      </div>
    </div>
  );
}

export function CollapseToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  if (!collapsed) {
    return (
      <Button type="button" variant="ghost" size="sm" onClick={onToggle} className="mb-2">
        <ChevronUp className="size-3.5" />
        收起输入区
      </Button>
    );
  }
  return null;
}
