export function markdownToPrintHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const parts: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      parts.push("</ul>");
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      parts.push("<br/>");
      continue;
    }
    if (trimmed.startsWith("## ")) {
      closeList();
      parts.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      closeList();
      parts.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        parts.push("<ul>");
        inList = true;
      }
      parts.push(`<li>${escapeHtml(trimmed.slice(2))}</li>`);
      continue;
    }
    closeList();
    parts.push(`<p>${escapeHtml(trimmed)}</p>`);
  }
  closeList();
  return parts.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const PRINT_STYLES = `
@page { size: A4; margin: 2cm; }
body {
  font-family: "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
  font-size: 12pt;
  line-height: 1.65;
  color: #111;
  max-width: 18cm;
  margin: 0 auto;
}
h1 { font-size: 16pt; margin: 0 0 1em; font-weight: 600; }
h2 { font-size: 13pt; margin: 1.2em 0 0.5em; font-weight: 600; }
h3 { font-size: 12pt; margin: 1em 0 0.4em; font-weight: 600; }
p { margin: 0.4em 0; }
ul { margin: 0.4em 0 0.8em 1.2em; padding: 0; }
li { margin: 0.25em 0; }
`;
