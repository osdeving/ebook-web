import { parseHTML } from "linkedom";

const CHAPTER_PATH = /\/chapters\/(ch\d{2,})\/?$/;
const LOCAL_ORIGIN = "https://ebook-web.invalid";

/**
 * Coleta apenas links editoriais explicitamente marcados. Links externos de
 * leituras e URLs comuns nao fazem parte do contrato de referencias cruzadas.
 */
export function collectSourceCrossReferences(html) {
  const { document } = parseHTML(`<main data-cross-reference-root>${html}</main>`);
  return Array.from(document.querySelectorAll("a[data-source-xref]")).map((link) => ({
    href: link.getAttribute("href")?.trim() ?? "",
    label: link.textContent?.replace(/\s+/gu, " ").trim() ?? "",
  }));
}

/**
 * Resolve uma URL como ela sera interpretada na rota estatica do capitulo.
 * Caminhos relativos preservam automaticamente o `base` do GitHub Pages.
 */
export function resolveSourceCrossReference(fromSlug, href) {
  if (!href) return { kind: "invalid", reason: "href vazio" };

  let url;
  try {
    url = new URL(href, `${LOCAL_ORIGIN}/chapters/${fromSlug}/`);
  } catch {
    return { kind: "invalid", reason: "href invalido" };
  }

  if (url.origin !== LOCAL_ORIGIN) {
    return { kind: "external", href: url.href };
  }

  let id = url.hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* Mantem o fragmento literal. */ }
  if (!id) return { kind: "invalid", reason: "fragmento ausente" };

  const chapter = url.pathname.match(CHAPTER_PATH)?.[1];
  if (chapter) return { kind: "chapter", slug: chapter, id, pathname: url.pathname };
  return { kind: "local-page", pathname: url.pathname, id };
}
