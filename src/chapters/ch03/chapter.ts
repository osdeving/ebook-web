import manifest from "./manifest";
import { explanations } from "./enrichments/explanations";
import { labs } from "./enrichments/labs";
import { practices } from "./enrichments/practices";
import { historyItems } from "./enrichments/history";
import { readingItems } from "./enrichments/readings";

const sourceModules = import.meta.glob("./source/sections/*.html", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const sourceSections = manifest.sourceOrder.map((file) => {
  const modulePath = `./${file}`;
  const html = sourceModules[modulePath];
  if (typeof html !== "string") {
    throw new Error(`Seção-fonte ausente ou fora do glob: ${file}`);
  }
  const id = file.split("/").at(-1)?.replace(/\.html$/, "");
  if (!id) throw new Error(`Nome de seção inválido: ${file}`);
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
});

export default chapter;
