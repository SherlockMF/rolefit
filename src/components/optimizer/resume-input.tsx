"use client";

import { useRef, useState } from "react";
import { FileText, FileUp, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseResumeFile } from "@/lib/file-parsers";

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ResumeInput({ value, onChange, disabled }: ResumeInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedFilename, setParsedFilename] = useState<string | null>(null);

  const handleSelectFile = () => {
    setParseError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // 允许重复选择同一文件
    if (!file) return;

    setParsing(true);
    setParseError(null);
    setParsedFilename(null);

    try {
      const result = await parseResumeFile(file);
      if (!result.text.trim()) {
        throw new Error("解析后未获取到文本，可能是扫描件 / 图片型 PDF");
      }
      onChange(result.text);
      setParsedFilename(result.filename);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "文件解析失败");
    } finally {
      setParsing(false);
    }
  };

  const handleClear = () => {
    onChange("");
    setParsedFilename(null);
    setParseError(null);
  };

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">简历输入</CardTitle>
        <CardDescription>
          粘贴或上传中文简历。我们会按你设置的「当前 → 目标角色」做转译与重写。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectFile}
            disabled={disabled || parsing}
          >
            {parsing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <FileUp className="size-3.5" />
            )}
            {parsing ? "解析中…" : "上传 PDF / DOCX"}
          </Button>
          <span className="text-xs text-muted-foreground">
            支持 .pdf / .docx / .txt / .md，单文件 ≤ 10 MB
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={disabled || (!value && !parsedFilename)}
            className="ml-auto"
          >
            <Trash2 className="size-3.5" />
            清空
          </Button>
        </div>

        {parsedFilename && !parseError && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-200/80 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            <FileText className="size-3.5" />
            已解析：{parsedFilename}
            <span className="text-emerald-700/70">
              （可在下方继续编辑文本）
            </span>
          </div>
        )}

        {parseError && (
          <Alert variant="destructive">
            <AlertDescription>{parseError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="resume-text" className="sr-only">
            简历正文
          </Label>
          <Textarea
            id="resume-text"
            placeholder={`请粘贴你的中文简历，或点上方按钮上传 PDF / DOCX。

张三 | 城市规划师
XX 规划设计院 | 20XX - 至今
- 负责片区城市设计及控规编制...
- 开展人口与产业调研...
- 协调多部门推进项目落地...`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="min-h-[260px] resize-y font-mono text-sm leading-relaxed"
          />
        </div>
      </CardContent>
    </Card>
  );
}
