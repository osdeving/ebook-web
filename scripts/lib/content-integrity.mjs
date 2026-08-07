import { createHash } from "node:crypto";

export function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, digits) =>
      String.fromCodePoint(Number.parseInt(digits, 16)),
    )
    .replace(/&#(\d+);/g, (_, digits) => String.fromCodePoint(Number(digits)));
}

export function normalizeHtmlText(html) {
  // Links cruzados sao estrutura de navegacao, nao texto editorial. Remover
  // somente o invólucro marcado antes da normalizacao permite tornar uma
  // mencao existente clicavel sem deslocar pontuacao no hash legado. Links
  // comuns continuam seguindo exatamente o comportamento anterior.
  const withoutSourceCrossReferenceWrappers = html.replace(
    /<a\b(?=[^>]*\bdata-source-xref(?:\s|=|>))[^>]*>([\s\S]*?)<\/a\s*>/gi,
    "$1",
  );
  const withoutComments = withoutSourceCrossReferenceWrappers.replace(/<!--[\s\S]*?-->/g, "");
  const tagBoundary = "\u0000";
  const withoutTags = withoutComments.replace(
    /<(?:[A-Za-z][^>]*|\/[A-Za-z][^>]*|![^>]*|\?[^>]*)>/g,
    tagBoundary,
  );

  return withoutTags
    .split(tagBoundary)
    .map((text) => decodeHtmlEntities(text).replace(/\s+/gu, " ").trim())
    .filter(Boolean)
    .join(" ");
}

export function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
