import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";
import { exerciseSolutionCatalog } from "./solution-catalog";

const htmlModules = import.meta.glob("./solutions/*.html", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export const exerciseSolutions: EnrichmentDefinition[] = exerciseSolutionCatalog.map((item) => {
  const html = htmlModules[`./solutions/${item.file}`];
  if (typeof html !== "string") throw new Error(`Solução ausente para ${item.exercise}`);
  return Object.freeze({
    id: item.id,
    layer: "practice",
    anchor: item.anchor,
    title: item.title,
    kicker: "Solução comentada",
    collapsible: true,
    content: trustedHtml(html),
    tags: ["solution", `exercise:${item.exercise}`],
  });
});
