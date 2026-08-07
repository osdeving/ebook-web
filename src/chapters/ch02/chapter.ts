import { explanations } from "./enrichments/explanations";
import { labs } from "./enrichments/labs";
import { practices } from "./enrichments/practices";
import { historyItems } from "./enrichments/history";
import { readingItems } from "./enrichments/readings";
import { initializeChapter } from "./runtime";
import manifest from "./manifest";

const sourceModules = import.meta.glob("./source/sections/*.html", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const sourceSections = manifest.sourceOrder.map((file) => {
  const html = sourceModules[`./${file}`];
  if (typeof html !== "string") throw new Error(`Seção-fonte ausente: ${file}`);
  const id = file.slice(file.lastIndexOf("/") + 1).replace(/\.html$/, "");
  return Object.freeze({ id, file, html });
});

export const chapter = Object.freeze({
  ...manifest,
  sourceSections: Object.freeze(sourceSections),
  enrichments: Object.freeze([
    ...explanations,
    ...labs,
    ...practices,
    ...historyItems,
    ...readingItems,
  ]),
  initialize: initializeChapter,
});

export default chapter;
