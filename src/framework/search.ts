import { normalizeText, listen, queryOptional } from "./dom";
import { revealHash } from "./accessibility";
import type { EnrichmentLayer } from "./types";

interface SearchEntry {
  id: string;
  title: string;
  text: string;
  normalized: string;
  layer: EnrichmentLayer | "source";
}

export interface SearchOptions {
  article: HTMLElement;
  ensureLayer(layer: EnrichmentLayer): void;
}

export function mountSearch(options: SearchOptions): () => void {
  const input = queryOptional<HTMLInputElement>("[data-reader-search]");
  const results = queryOptional<HTMLElement>("[data-reader-search-results]");
  const status = queryOptional<HTMLElement>("[data-reader-search-status]");
  if (!input || !results) return () => undefined;
  let entries = buildIndex(options.article);
  let timer = 0;

  const run = () => {
    const query = normalizeText(input.value);
    results.replaceChildren();
    if (query.length < 2) {
      if (status) status.textContent = "Digite ao menos duas letras.";
      return;
    }
    entries = buildIndex(options.article);
    const matches = entries.filter((entry) => entry.normalized.includes(query)).slice(0, 20);
    if (status) status.textContent = `${matches.length} resultado${matches.length === 1 ? "" : "s"}.`;
    for (const entry of matches) {
      const link = document.createElement("a");
      link.href = `#${entry.id}`;
      link.className = "enrichment-search__result";
      link.dataset.searchLayer = entry.layer;
      const title = document.createElement("strong");
      title.className = "enrichment-search__result-title";
      title.textContent = entry.title;
      const excerpt = document.createElement("span");
      excerpt.className = "enrichment-search__result-excerpt";
      excerpt.textContent = excerptAround(entry.text, input.value);
      link.append(title, excerpt);
      results.append(link);
    }
  };
  const inputCleanup = listen(input, "input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(run, 120);
  });
  const clickCleanup = listen(results, "click", ((event: Event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
    if (!link) return;
    event.preventDefault();
    const layer = link.dataset.searchLayer as EnrichmentLayer | "source";
    if (layer !== "source") options.ensureLayer(layer);
    history.pushState(history.state, "", link.hash);
    requestAnimationFrame(() => revealHash(options.article, true));
  }) as EventListener);
  return () => {
    inputCleanup();
    clickCleanup();
    window.clearTimeout(timer);
  };
}

function buildIndex(article: HTMLElement): SearchEntry[] {
  const entries: SearchEntry[] = [];
  article.querySelectorAll<HTMLElement>("section[id], [data-enrichment-id][id]").forEach((node) => {
    const text = node.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const title = node.dataset.enrichmentTitle
      ?? node.querySelector("h2, h3, .supplement__title")?.textContent?.trim()
      ?? node.id;
    const layer = (node.dataset.layer as EnrichmentLayer | undefined) ?? "source";
    entries.push({ id: node.id, title, text, normalized: normalizeText(text), layer });
  });
  return entries;
}

function excerptAround(text: string, rawQuery: string): string {
  const index = normalizeText(text).indexOf(normalizeText(rawQuery));
  const start = Math.max(0, index - 72);
  const end = Math.min(text.length, Math.max(index, 0) + rawQuery.length + 110);
  return `${start ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}
