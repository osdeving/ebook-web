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
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, "");
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
