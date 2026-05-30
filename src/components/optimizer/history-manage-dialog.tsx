"use client";

import { useState } from "react";
import { Pin, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  listAll,
  togglePin,
  remove,
  HISTORY_LIMITS,
  type HistoryRecord,
} from "@/lib/storage/history";

interface HistoryManageDialogProps {
  onChanged: () => void;
  compact?: boolean;
}

export function HistoryManageDialog({
  onChanged,
  compact,
}: HistoryManageDialogProps) {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    setRecords(listAll());
    onChanged();
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setRecords(listAll());
      setError(null);
    }
  };

  const handlePin = (id: string) => {
    const { error: pinError } = togglePin(id);
    if (pinError) {
      setError(pinError);
      return;
    }
    setError(null);
    refresh();
  };

  const handleRemove = (id: string) => {
    remove(id);
    refresh();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            type="button"
            className={compact ? "h-7 px-2 text-xs" : undefined}
            title="管理全部历史"
          />
        }
      >
        {compact ? "全部" : "管理全部"}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>历史记录管理</DialogTitle>
          <DialogDescription>
            最多保存 {HISTORY_LIMITS.MAX_RECORDS} 条；置顶最多{" "}
            {HISTORY_LIMITS.MAX_PINNED} 条，侧栏固定展示{" "}
            {HISTORY_LIMITS.VISIBLE_SLOTS} 条
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <ul className="space-y-2">
          {records.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted-foreground">
              暂无记录
            </li>
          ) : (
            records.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString("zh-CN")}
                    {r.matchScore != null && ` · 匹配 ${r.matchScore}`}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant={r.pinned ? "default" : "ghost"}
                    size="icon-sm"
                    onClick={() => handlePin(r.id)}
                    title={r.pinned ? "取消置顶" : "置顶保留"}
                  >
                    <Pin className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemove(r.id)}
                    title="删除"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
