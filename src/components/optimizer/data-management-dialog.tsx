"use client";

import { useRef, useState } from "react";
import { Database, Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  downloadBackup,
  estimateStorageBytes,
  formatStorageSize,
  importBackup,
  isStorageNearLimit,
} from "@/lib/storage/backup";

interface DataManagementDialogProps {
  onChanged?: () => void;
  /** 侧栏窄列：仅图标 + 短文案 */
  compact?: boolean;
}

export function DataManagementDialog({
  onChanged,
  compact,
}: DataManagementDialogProps) {
  const [open, setOpen] = useState(false);
  const [merge, setMerge] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bytes = estimateStorageBytes();
  const nearLimit = isStorageNearLimit();

  const handleImport = async (file: File) => {
    setError(null);
    setMessage(null);
    const text = await file.text();
    const result = importBackup(text, { merge });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMessage(
      `已导入：${result.counts.history} 条历史、${result.counts.versions} 个版本、${result.counts.applications} 条投递`,
    );
    onChanged?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant={compact ? "outline" : "ghost"}
            size="sm"
            type="button"
            className={compact ? "h-7 gap-1 px-2 text-xs" : undefined}
            title="数据管理"
          />
        }
      >
        <Database className="size-3.5 shrink-0" />
        {compact ? "数据" : "数据管理"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>本地数据管理</DialogTitle>
          <DialogDescription>
            数据保存在浏览器 localStorage，清除站点数据会丢失。建议定期导出备份。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm">
            当前占用：<strong>{formatStorageSize(bytes)}</strong>
            {nearLimit && (
              <span className="ml-2 text-destructive">（接近建议上限 4MB）</span>
            )}
          </p>
          {nearLimit && (
            <Alert variant="destructive">
              <AlertDescription>
                存储空间较大，请导出备份后清理旧历史，或删除不需要的版本/投递记录。
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={downloadBackup}>
              <Download className="size-3.5" />
              导出 JSON 备份
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-3.5" />
              导入备份
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImport(file);
                e.target.value = "";
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="merge-backup"
              checked={merge}
              onCheckedChange={(c) => setMerge(c === true)}
            />
            <Label htmlFor="merge-backup" className="text-sm font-normal">
              导入时与现有记录合并（按 id），不勾选则覆盖
            </Label>
          </div>
          {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
