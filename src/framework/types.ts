export const ENRICHMENT_LAYERS = [
  "explanation",
  "lab",
  "practice",
  "history",
  "reading",
] as const;

export type EnrichmentLayer = (typeof ENRICHMENT_LAYERS)[number];
export type EnrichmentPosition = "before" | "after" | "append" | "prepend";
export type EnrichmentPresentation = "panel" | "inline";

export interface TocItem {
  id: string;
  number: string;
  title: string;
  depth?: 1 | 2 | 3;
}

export interface ChapterMeta {
  slug: string;
  number: string;
  title: string;
  shortTitle?: string;
  eyebrow?: string;
  description: string;
  sourceHash?: string;
  textLength?: number;
  sourceNote?: string;
  badges?: readonly string[];
  toc: readonly TocItem[];
}

export interface ChapterSourceSection {
  id: string;
  file: string;
  html: string;
}

export interface ChapterDefinition extends ChapterMeta {
  sourceSections: readonly ChapterSourceSection[];
  enrichments: readonly EnrichmentDefinition[];
  initialize?: (article: HTMLElement) => void | EnrichmentCleanup;
}

/**
 * HTML que atravessou o pipeline editorial confiavel do projeto.
 *
 * Este tipo nao sanitiza nada em tempo de execucao. Ele torna a fronteira
 * visivel em revisoes: apenas arquivos locais, versionados e validados podem
 * ser convertidos por `trustedHtml`. Conteudo de usuario ou de rede nunca
 * deve chegar a este tipo.
 */
export type TrustedHtml = string & { readonly __trustedHtml: unique symbol };

export type EnrichmentContent =
  | TrustedHtml
  | ((context: EnrichmentMountContext) => Node | DocumentFragment);

export interface EnrichmentDefinition {
  id: string;
  layer: EnrichmentLayer;
  anchor: string;
  position?: EnrichmentPosition;
  presentation?: EnrichmentPresentation;
  title: string;
  kicker?: string;
  duration?: string;
  collapsible?: boolean;
  initiallyOpen?: boolean;
  content: EnrichmentContent;
  initialize?: EnrichmentInitializer;
  tags?: readonly string[];
}

export interface EnrichmentMountContext {
  definition: EnrichmentDefinition;
  chapterRoot: HTMLElement;
  host: HTMLElement;
  body: HTMLElement;
  announce(message: string): void;
}

export type EnrichmentCleanup = () => void;
export type EnrichmentInitializer = (
  context: EnrichmentMountContext,
) => void | EnrichmentCleanup | Promise<void | EnrichmentCleanup>;

export interface ReaderPreferences {
  theme: "light" | "dark";
  scale: number;
  layers: EnrichmentLayer[];
  bookmarks: string[];
  notes: Record<string, string>;
  progress: Record<string, "started" | "completed">;
  lastSection?: string;
  sourceHash?: string;
}

export interface ReaderRuntimeOptions {
  chapterId: string;
  sourceHash?: string;
  articleSelector?: string;
  mainSelector?: string;
  sidebarSelector?: string;
  mobileQuery?: string;
  storagePrefix?: string;
}

export interface ReaderTargetPreview {
  title: string;
  kind: string;
  excerpt: string;
  href: string;
}

export interface ReaderBacklink {
  href: string;
  label: string;
  chapter: string;
  context: string;
}

export interface ReaderDiscoveryData {
  previews: Record<string, ReaderTargetPreview>;
  backlinks: Record<string, ReaderBacklink[]>;
}

export interface Disposable {
  destroy(): void;
}
