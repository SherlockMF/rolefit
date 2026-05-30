"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { downloadBlob, exportDocx, type ExportMeta } from "@/lib/export/docx";
import { buildPrintDocumentHtml, openResumePrintWindow } from "@/lib/export/print";

interface DownloadButtonProps {
  content: string;
  atsContent?: string;
  meta?: ExportMeta;
  filename?: string;
  atsFilename?: string;
}

function downloadText(text: string, name: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function DownloadButton({
  content,
  atsContent,
  meta,
  filename = "优化简历-人工阅读版.md",
  atsFilename = "优化简历-ATS投递版.txt",
}: DownloadButtonProps) {
  const [docxLoading, setDocxLoading] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const printTitle = meta?.targetCompany
    ? `${meta.targetCompany} - ${meta.targetRole ?? "简历"}`
    : "优化简历";

  const handleDownloadHuman = () => {
    if (!content.trim()) return;
    downloadText(content, filename);
  };

  const handleDownloadAts = () => {
    if (!atsContent?.trim()) return;
    downloadText(atsContent, atsFilename);
  };

  const handleDocx = async () => {
    if (!content.trim()) return;
    setDocxLoading(true);
    try {
      const blob = await exportDocx(content, meta);
      const name = meta?.targetCompany
        ? `简历-${meta.targetCompany}-${meta.targetRole ?? "岗位"}.docx`
        : "优化简历.docx";
      downloadBlob(blob, name);
    } finally {
      setDocxLoading(false);
    }
  };

  const handlePrintPdf = () => {
    if (!content.trim()) return;
    setPrintOpen(true);
  };

  const confirmPrint = () => {
    openResumePrintWindow(content, printTitle);
    setPrintOpen(false);
  };

  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-medium">导出简历</CardTitle>
        <CardDescription>
          Markdown / Word / 打印 PDF（浏览器另存为 PDF）
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleDownloadHuman} disabled={!content.trim()}>
          <Download className="size-4" />
          下载 Markdown
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleDownloadAts}
          disabled={!atsContent?.trim()}
        >
          <Download className="size-4" />
          下载 ATS 版
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleDocx}
          disabled={!content.trim() || docxLoading}
        >
          {docxLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FileText className="size-4" />
          )}
          下载 Word
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handlePrintPdf}
          disabled={!content.trim()}
        >
          <FileText className="size-4" />
          打印 / 导出 PDF
        </Button>
      </CardContent>

      <Dialog open={printOpen} onOpenChange={setPrintOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>打印预览</DialogTitle>
            <DialogDescription>
              确认版式后点击「开始打印」，在系统对话框中选择「另存为 PDF」。
            </DialogDescription>
          </DialogHeader>
          <div
            className="rounded-md border border-border bg-white p-6 text-black text-sm leading-relaxed [&_h2]:mt-4 [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{
              __html: buildPrintDocumentHtml(content, printTitle).match(
                /<body>([\s\S]*)<\/body>/,
              )?.[1] ?? content,
            }}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPrintOpen(false)}>
              取消
            </Button>
            <Button type="button" onClick={confirmPrint}>
              开始打印
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
