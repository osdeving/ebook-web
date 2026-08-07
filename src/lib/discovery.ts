import { parseHTML } from "linkedom";
import type {
  ChapterDefinition,
  EnrichmentLayer,
  ReaderBacklink as BacklinkRecord,
  ReaderDiscoveryData as ChapterDiscoveryData,
  ReaderTargetPreview as TargetPreview,
} from "../framework/types";

export type SearchKind =
  | "section"
  | "definition"
  | "theorem"
  | "proposition"
  | "corollary"
  | "example"
  | "remark"
  | "exercise"
  | "equation"
  | "figure"
  | "table"
  | "algorithm"
  | "proof"
  | "enrichment"
  | "reference"
  | "glossary"
  | "symbol"
  | "path";

export interface SearchEntry {
  id: string;
  title: string;
  excerpt: string;
  searchText: string;
  kind: SearchKind;
  kindLabel: string;
  href: string;
  chapter?: string;
  chapterLabel?: string;
  layer?: EnrichmentLayer;
}

export interface ReferenceRecord {
  number: number;
  citation: string;
  url?: string;
  doi?: string;
}

export interface GlossaryRecord {
  id: string;
  term: string;
  aliases: string[];
  definition: string;
  category: string;
  chapter: string;
  href: string;
}

export interface SymbolRecord {
  id: string;
  symbol: string;
  meaning: string;
  href: string;
  chapter: string;
}

export interface LearningPathRecord {
  id: string;
  title: string;
  tagline: string;
  description: string;
  level: string;
  duration: string;
  goal: string;
  steps: Array<{ title: string; why: string; href: string; type: string }>;
}

interface IndexedTarget extends TargetPreview {
  key: string;
}

interface LinkOrigin {
  rawHref: string;
  targetKey: string;
  sourceChapter: string;
  sourceId: string;
  sourceTitle: string;
  context: string;
}

const SOURCE_TARGET_SELECTOR = [
  "section[id]",
  ".semantic[id]",
  ".algorithm[id]",
  ".proof[id]",
  ".exercise[id]",
  ".equation[id]",
  ".numbered-equation[id]",
  "figure[id]",
  ".figure[id]",
  ".table-wrap[id]",
  "table[id]",
].join(",");

export function normalizeDiscoveryText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

export function buildSearchIndex(
  chapters: readonly ChapterDefinition[],
  references: readonly ReferenceRecord[],
  glossary: readonly GlossaryRecord[],
  symbols: readonly SymbolRecord[],
  paths: readonly LearningPathRecord[],
): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const chapter of chapters) {
    for (const source of chapter.sourceSections) {
      const document = parseFragment(source.html);
      for (const node of document.querySelectorAll<HTMLElement>(SOURCE_TARGET_SELECTOR)) {
        const id = node.id;
        if (!id) continue;
        const descriptor = describeSourceNode(node);
        const text = compactText(node.textContent ?? "");
        entries.push({
          id: `${chapter.slug}-${id}`,
          title: descriptor.title,
          excerpt: excerpt(text),
          searchText: normalizeDiscoveryText(`${descriptor.title} ${text}`),
          kind: descriptor.kind,
          kindLabel: descriptor.kindLabel,
          href: `chapters/${chapter.slug}/#${id}`,
          chapter: chapter.slug,
          chapterLabel: `Capítulo ${chapter.number}`,
        });
      }
    }
    for (const enrichment of chapter.enrichments) {
      const rawContent = typeof enrichment.content === "string"
        ? compactText(parseFragment(enrichment.content).body.textContent ?? "")
        : "";
      entries.push({
        id: `${chapter.slug}-${enrichment.id}`,
        title: enrichment.title,
        excerpt: excerpt(rawContent || `Recurso da camada ${layerLabel(enrichment.layer)}.`),
        searchText: normalizeDiscoveryText([
          enrichment.title,
          rawContent,
          ...(enrichment.tags ?? []),
        ].join(" ")),
        kind: "enrichment",
        kindLabel: layerLabel(enrichment.layer),
        href: `chapters/${chapter.slug}/#${enrichment.id}`,
        chapter: chapter.slug,
        chapterLabel: `Capítulo ${chapter.number}`,
        layer: enrichment.layer,
      });
    }
  }

  for (const reference of references) {
    entries.push({
      id: `reference-${reference.number}`,
      title: `Referência ${reference.number}`,
      excerpt: reference.citation,
      searchText: normalizeDiscoveryText(`${reference.number} ${reference.citation} ${reference.doi ?? ""}`),
      kind: "reference",
      kindLabel: "Referência",
      href: `references/#ref-${reference.number}`,
    });
  }
  for (const term of glossary) {
    entries.push({
      id: `glossary-${term.id}`,
      title: term.term,
      excerpt: term.definition,
      searchText: normalizeDiscoveryText(`${term.term} ${term.aliases.join(" ")} ${term.definition} ${term.category}`),
      kind: "glossary",
      kindLabel: "Glossário",
      href: `glossary/#term-${term.id}`,
      chapter: term.chapter,
    });
  }
  for (const symbol of symbols) {
    entries.push({
      id: `symbol-${symbol.id}`,
      title: symbol.symbol,
      excerpt: symbol.meaning,
      searchText: normalizeDiscoveryText(`${symbol.symbol} ${symbol.meaning}`),
      kind: "symbol",
      kindLabel: "Símbolo",
      href: `glossary/#symbol-${symbol.id}`,
      chapter: symbol.chapter,
    });
  }
  for (const path of paths) {
    entries.push({
      id: `path-${path.id}`,
      title: path.title,
      excerpt: path.description,
      searchText: normalizeDiscoveryText(`${path.title} ${path.tagline} ${path.description} ${path.steps.map(({ title, why }) => `${title} ${why}`).join(" ")}`),
      kind: "path",
      kindLabel: "Rota de estudo",
      href: `study/#path-${path.id}`,
    });
  }
  return deduplicate(entries, (entry) => `${entry.kind}:${entry.href}`);
}

export function buildDiscoveryData(
  chapters: readonly ChapterDefinition[],
  references: readonly ReferenceRecord[],
): { chapters: Record<string, ChapterDiscoveryData>; referenceBacklinks: Record<string, BacklinkRecord[]> } {
  const targets = new Map<string, IndexedTarget>();
  const origins: LinkOrigin[] = [];

  for (const chapter of chapters) {
    for (const source of chapter.sourceSections) {
      const document = parseFragment(source.html);
      for (const node of document.querySelectorAll<HTMLElement>(SOURCE_TARGET_SELECTOR)) {
        if (!node.id) continue;
        const descriptor = describeSourceNode(node);
        targets.set(`${chapter.slug}#${node.id}`, {
          key: `${chapter.slug}#${node.id}`,
          title: descriptor.title,
          kind: descriptor.kindLabel,
          excerpt: excerpt(compactText(node.textContent ?? "")),
          href: `#${node.id}`,
        });
      }
      for (const link of document.querySelectorAll<HTMLAnchorElement>("a[data-source-xref][href]")) {
        const rawHref = link.getAttribute("href") ?? "";
        const targetKey = resolveTargetKey(chapter.slug, rawHref);
        if (!targetKey) continue;
        const origin = closestMeaningfulOrigin(link);
        const sourceId = origin?.id || source.id;
        const sourceTitle = origin ? describeSourceNode(origin).title : `Seção ${source.id}`;
        origins.push({
          rawHref,
          targetKey,
          sourceChapter: chapter.slug,
          sourceId,
          sourceTitle,
          context: excerpt(compactText(link.parentElement?.textContent ?? link.textContent ?? ""), 180),
        });
      }
    }
    for (const enrichment of chapter.enrichments) {
      targets.set(`${chapter.slug}#${enrichment.id}`, {
        key: `${chapter.slug}#${enrichment.id}`,
        title: enrichment.title,
        kind: layerLabel(enrichment.layer),
        excerpt: `Recurso editorial da camada ${layerLabel(enrichment.layer).toLocaleLowerCase("pt-BR")}.`,
        href: `#${enrichment.id}`,
      });
    }
  }
  for (const reference of references) {
    targets.set(`references#ref-${reference.number}`, {
      key: `references#ref-${reference.number}`,
      title: `Referência ${reference.number}`,
      kind: "Referência",
      excerpt: reference.citation,
      href: `../../references/#ref-${reference.number}`,
    });
  }

  const chapterData: Record<string, ChapterDiscoveryData> = Object.fromEntries(
    chapters.map((chapter) => [chapter.slug, { previews: {}, backlinks: {} }]),
  );
  const referenceBacklinks: Record<string, BacklinkRecord[]> = {};

  for (const origin of origins) {
    const preview = targets.get(origin.targetKey);
    const current = chapterData[origin.sourceChapter];
    if (preview && current) current.previews[origin.rawHref] = preview;

    const [targetArea, targetId] = splitTargetKey(origin.targetKey);
    if (!targetId || !targetArea) continue;
    const record: BacklinkRecord = {
      href: targetArea === origin.sourceChapter
        ? `#${origin.sourceId}`
        : `../${origin.sourceChapter}/#${origin.sourceId}`,
      label: origin.sourceTitle,
      chapter: origin.sourceChapter,
      context: origin.context,
    };
    if (targetArea === "references") {
      const list = referenceBacklinks[targetId] ??= [];
      pushUniqueBacklink(list, record);
    } else {
      const targetChapter = chapterData[targetArea];
      if (!targetChapter) continue;
      const list = targetChapter.backlinks[targetId] ??= [];
      pushUniqueBacklink(list, record);
    }
  }

  return { chapters: chapterData, referenceBacklinks };
}

function parseFragment(html: string): Document {
  return parseHTML(`<!doctype html><html><body>${html}</body></html>`).document as unknown as Document;
}

function compactText(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

function excerpt(value: string, limit = 280): string {
  const text = compactText(value);
  if (text.length <= limit) return text;
  const slice = text.slice(0, limit + 1);
  const boundary = slice.lastIndexOf(" ");
  const proseBoundary = boundary > limit * 0.65 ? boundary : limit;
  const safeBoundary = mathSafeBoundary(text, proseBoundary);
  return `${text.slice(0, safeBoundary).trim()}…`;
}

/**
 * Não deixa o resumo terminar dentro de um delimitador reconhecido pelo KaTeX.
 * Quando o alvo começa pela própria expressão (como uma equação numerada),
 * preserva a primeira fórmula inteira; nos demais casos, encerra antes dela.
 */
function mathSafeBoundary(value: string, preferredBoundary: number): number {
  let cursor = 0;
  while (cursor < preferredBoundary) {
    const inlineStart = value.indexOf("\\(", cursor);
    const displayStart = value.indexOf("\\[", cursor);
    const starts = [inlineStart, displayStart].filter((index) => index >= 0);
    if (!starts.length) return preferredBoundary;
    const start = Math.min(...starts);
    if (start >= preferredBoundary) return preferredBoundary;
    const close = value.startsWith("\\(", start) ? "\\)" : "\\]";
    const endStart = value.indexOf(close, start + 2);
    if (endStart < 0) return start;
    const end = endStart + close.length;
    // Equações numeradas trazem um prefixo curto como "(3.12)" antes de `\[`.
    if (end > preferredBoundary) return start <= 48 ? end : start;
    cursor = end;
  }
  return preferredBoundary;
}

function describeSourceNode(node: HTMLElement): { title: string; kind: SearchKind; kindLabel: string } {
  if (node.matches(".exercise")) {
    const number = compactText(node.querySelector(".exercise-number")?.textContent ?? node.id.replace("exercicio-", ""));
    return { title: `Exercício ${number.replace(/\.$/u, "")}`, kind: "exercise", kindLabel: "Exercício" };
  }
  if (node.matches(".algorithm")) {
    const title = compactText(node.querySelector("h3, h4, strong")?.textContent ?? node.id);
    return { title, kind: "algorithm", kindLabel: "Algoritmo" };
  }
  if (node.matches(".semantic")) {
    const label = compactText(node.querySelector(".semantic-label")?.textContent ?? "Resultado");
    const explicitTitle = compactText(node.querySelector(".semantic-title")?.textContent ?? "");
    const namedTerm = compactText(node.querySelector("p strong")?.textContent ?? "");
    const title = [label, explicitTitle || namedTerm].filter(Boolean).join(" · ");
    return { title, kind: semanticKind(node), kindLabel: label };
  }
  if (node.matches(".equation, .numbered-equation")) {
    const number = compactText(node.querySelector(".equation-number")?.textContent ?? node.id);
    return { title: `Equação ${number}`, kind: "equation", kindLabel: "Equação" };
  }
  if (node.matches("figure, .figure")) {
    const caption = compactText(node.querySelector("figcaption")?.textContent ?? node.id);
    return { title: caption, kind: "figure", kindLabel: "Figura" };
  }
  if (node.matches(".table-wrap, table")) {
    const caption = compactText(node.querySelector("caption")?.textContent ?? node.id);
    return { title: caption, kind: "table", kindLabel: "Tabela" };
  }
  const heading = compactText(node.querySelector("h2, h3")?.textContent ?? node.id);
  return { title: heading, kind: "section", kindLabel: "Seção" };
}

function semanticKind(node: HTMLElement): SearchKind {
  if (node.classList.contains("definition")) return "definition";
  if (node.classList.contains("theorem")) return "theorem";
  if (node.classList.contains("proposition")) return "proposition";
  if (node.classList.contains("corollary")) return "corollary";
  if (node.classList.contains("example")) return "example";
  if (node.classList.contains("proof")) return "proof";
  return "remark";
}

function layerLabel(layer: EnrichmentLayer): string {
  return ({
    explanation: "Explicação",
    lab: "Laboratório",
    practice: "Prática",
    history: "História",
    reading: "Leitura",
  } as const)[layer];
}

function closestMeaningfulOrigin(link: HTMLAnchorElement): HTMLElement | null {
  return link.closest<HTMLElement>(".exercise[id], .semantic[id], .algorithm[id], section[id], figure[id], .table-wrap[id]");
}

function resolveTargetKey(sourceChapter: string, href: string): string | undefined {
  if (href.startsWith("#")) return `${sourceChapter}${href}`;
  const chapter = href.match(/(?:^|\/)chapters\/(ch\d+)\/#([^?#]+)/u)
    ?? href.match(/\.\.\/(ch\d+)\/#([^?#]+)/u);
  if (chapter?.[1] && chapter[2]) return `${chapter[1]}#${decodeFragment(chapter[2])}`;
  const reference = href.match(/(?:^|\/)references\/#(ref-\d+)/u);
  if (reference?.[1]) return `references#${reference[1]}`;
  return undefined;
}

function decodeFragment(fragment: string): string {
  try { return decodeURIComponent(fragment); }
  catch { return fragment; }
}

function splitTargetKey(key: string): [string | undefined, string | undefined] {
  const index = key.indexOf("#");
  return index < 0 ? [undefined, undefined] : [key.slice(0, index), key.slice(index + 1)];
}

function pushUniqueBacklink(list: BacklinkRecord[], record: BacklinkRecord): void {
  if (!list.some((candidate) => candidate.href === record.href && candidate.chapter === record.chapter)) {
    list.push(record);
  }
}

function deduplicate<T>(items: readonly T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}
