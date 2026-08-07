import type { ReaderBacklink } from "./types";

export interface BacklinkOptions {
  article: HTMLElement;
  backlinks: Record<string, ReaderBacklink[]>;
}

/** Acrescenta relações inversas como conteúdo editorial removível. */
export function mountBacklinks(options: BacklinkOptions): () => void {
  const roots: HTMLElement[] = [];
  for (const [targetId, records] of Object.entries(options.backlinks)) {
    if (!records.length) continue;
    const target = options.article.querySelector<HTMLElement>(`#${CSS.escape(targetId)}`);
    if (!target) continue;

    const details = document.createElement("details");
    details.className = "source-backlinks";
    details.dataset.origin = "editorial";
    details.dataset.layer = "reading";
    details.dataset.backlinksFor = targetId;
    const summary = document.createElement("summary");
    summary.textContent = `Usado em ${records.length} ${records.length === 1 ? "passagem" : "passagens"}`;
    const list = document.createElement("ul");
    for (const record of records) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = record.href;
      link.textContent = record.label;
      const context = document.createElement("span");
      context.textContent = record.context;
      item.append(link, context);
      list.append(item);
    }
    details.append(summary, list);
    target.append(details);
    roots.push(details);
  }
  return () => roots.forEach((root) => root.remove());
}
