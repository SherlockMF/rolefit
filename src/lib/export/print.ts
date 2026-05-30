"use client";

import { markdownToPrintHtml, PRINT_STYLES } from "@/lib/export/markdown-html";

export function buildPrintDocumentHtml(content: string, title: string): string {
  const body = markdownToPrintHtml(content);
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>${escapeAttr(title)}</title>
<style>${PRINT_STYLES}</style></head><body><h1>${escapeAttr(title)}</h1>${body}</body></html>`;
}

export function openResumePrintWindow(content: string, title = "优化简历") {
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  win.document.write(buildPrintDocumentHtml(content, title));
  win.document.close();
  win.focus();
  win.print();
}

function escapeAttr(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
