import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

export interface ExportMeta {
  targetRole?: string;
  targetCompany?: string;
  candidateName?: string;
}

export async function exportDocx(
  markdown: string,
  meta?: ExportMeta,
): Promise<Blob> {
  const children: Paragraph[] = [];

  if (meta?.targetCompany || meta?.targetRole) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: [meta.targetCompany, meta.targetRole].filter(Boolean).join(" · "),
            bold: true,
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      }),
    );
  }

  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      children.push(new Paragraph({ text: "" }));
      continue;
    }
    if (trimmed.startsWith("## ")) {
      children.push(
        new Paragraph({
          text: trimmed.slice(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        }),
      );
    } else if (trimmed.startsWith("### ")) {
      children.push(
        new Paragraph({
          text: trimmed.slice(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 180, after: 80 },
        }),
      );
    } else if (trimmed.startsWith("- ")) {
      children.push(
        new Paragraph({
          text: trimmed.slice(2),
          bullet: { level: 0 },
        }),
      );
    } else {
      children.push(new Paragraph({ text: trimmed }));
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  return Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
