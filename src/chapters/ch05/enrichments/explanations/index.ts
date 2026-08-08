import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";
import { explanationCatalog } from "./catalog";

const htmlModules = import.meta.glob("./*.html", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export const explanationEntries = explanationCatalog.map((item) => {
  const html = htmlModules[`./${item.file}`];
  if (typeof html !== "string") throw new Error(`HTML ausente para ${item.id}`);
  return Object.freeze({ ...item, html });
});

export const explanations: EnrichmentDefinition[] = explanationEntries.map((item) => ({
  id: item.id,
  layer: "explanation",
  anchor: item.anchor,
  title: item.title,
  kicker: item.tag,
  collapsible: true,
  content: trustedHtml(item.html),
  tags: [item.kind, item.section],
}));

export { explanationCatalog };
