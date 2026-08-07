#!/usr/bin/env node

import { access, mkdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

function readArgs(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token?.startsWith("--")) continue;
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Falta um valor para ${token}.`);
    }
    values.set(token.slice(2), value);
    index += 1;
  }
  return values;
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const args = readArgs(process.argv.slice(2));
const slug = args.get("slug");
const numberText = args.get("number");
const title = args.get("title");

if (!slug || !numberText || !title) {
  console.error(
    'Uso: npm run new:chapter -- --slug ch03 --number 3 --title "Título"',
  );
  process.exit(1);
}

if (!/^ch\d{2,}$/.test(slug)) {
  throw new Error('O slug deve seguir o formato "ch03".');
}

const chapterNumber = Number(numberText);
if (!Number.isSafeInteger(chapterNumber) || chapterNumber < 1) {
  throw new Error("O número do capítulo deve ser um inteiro positivo.");
}

const root = resolve(import.meta.dirname, "..");
const chapterRoot = resolve(root, "src", "chapters", slug);
if (await exists(chapterRoot)) {
  throw new Error(`O capítulo ${slug} já existe.`);
}

const sectionId = `sec-${chapterNumber}-1`;
const directories = [
  "source/sections",
  "enrichments/explanations",
  "enrichments/labs",
  "enrichments/practices",
  "enrichments/history",
  "enrichments/readings",
];

await Promise.all(
  directories.map((directory) =>
    mkdir(resolve(chapterRoot, directory), { recursive: true }),
  ),
);

const manifest = {
  slug,
  number: String(chapterNumber),
  title,
  shortTitle: title,
  eyebrow: `Capítulo ${chapterNumber}`,
  description: "",
  sourceHash: "PENDING",
  textLength: 0,
  toc: [
    {
      id: sectionId,
      number: `${chapterNumber}.1`,
      title: "Primeira seção",
      depth: 1,
    },
  ],
  sourceOrder: [`source/sections/${sectionId}.html`],
};

const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
const sectionHtml = `<section id="${sectionId}" data-layer="source">
  <h2>${chapterNumber}.1 Primeira seção</h2>
  <p>Substitua este parágrafo pela tradução preservada.</p>
</section>
`;

const chapterTs = `import manifest from "./manifest";
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
  const modulePath = \`./\${file}\`;
  const html = sourceModules[modulePath];
  if (typeof html !== "string") {
    throw new Error(\`Seção-fonte ausente ou fora do glob: \${file}\`);
  }
  const id = file.split("/").at(-1)?.replace(/\\.html$/, "");
  if (!id) throw new Error(\`Nome de seção inválido: \${file}\`);
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
`;

const manifestTs = `import rawManifest from "./manifest.json";

export interface ChapterManifest {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  sourceHash: string;
  textLength: number;
  toc: ReadonlyArray<{ id: string; number: string; title: string; depth: 1 | 2 | 3 }>;
  sourceOrder: readonly string[];
}

export const manifest = Object.freeze(rawManifest as ChapterManifest);
export default manifest;
`;

const emptyIndex = (name) => `import type { EnrichmentDefinition } from "../../../../framework/types";

// @ebook-imports
// @ebook-exports
export const ${name}: EnrichmentDefinition[] = [
  // @ebook-items
];
`;

const explanationCatalogTs = `import rawCatalog from "./catalog.json";

export interface ExplanationCatalogItem {
  id: string;
  type: "explanation";
  layer: "explanation";
  kind: "explanation";
  tag: string;
  title: string;
  section: string;
  anchor: string;
  slot: string;
  file: string;
  order: number;
}

export const explanationCatalog = Object.freeze(
  rawCatalog as ExplanationCatalogItem[],
);
`;

const explanationIndex = `import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";
import { explanationCatalog } from "./catalog";

const htmlModules = import.meta.glob("./*.html", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export const explanationEntries = explanationCatalog.map((item) => {
  const html = htmlModules[\`./\${item.file}\`];
  if (typeof html !== "string") throw new Error(\`HTML ausente para \${item.id}\`);
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
`;

const credits = `# Créditos do ${title}

Registre aqui a origem do texto, imagens, dados, fontes e licenças.
`;

await Promise.all([
  writeFile(resolve(chapterRoot, "manifest.json"), manifestJson, "utf8"),
  writeFile(resolve(chapterRoot, "manifest.ts"), manifestTs, "utf8"),
  writeFile(resolve(chapterRoot, "chapter.ts"), chapterTs, "utf8"),
  writeFile(
    resolve(chapterRoot, "source", "sections", `${sectionId}.html`),
    sectionHtml,
    "utf8",
  ),
  writeFile(
    resolve(chapterRoot, "enrichments", "explanations", "catalog.json"),
    "[]\n",
    "utf8",
  ),
  writeFile(
    resolve(chapterRoot, "enrichments", "explanations", "catalog.ts"),
    explanationCatalogTs,
    "utf8",
  ),
  writeFile(
    resolve(chapterRoot, "enrichments", "explanations", "index.ts"),
    explanationIndex,
    "utf8",
  ),
  ...[
    ["labs", "labs"],
    ["practices", "practices"],
    ["history", "historyItems"],
    ["readings", "readingItems"],
  ].map(
    ([kind, exportName]) =>
      writeFile(
        resolve(chapterRoot, "enrichments", kind, "index.ts"),
        emptyIndex(exportName),
        "utf8",
      ),
  ),
  writeFile(resolve(chapterRoot, "credits.md"), credits, "utf8"),
]);

console.log(`Capítulo criado em src/chapters/${slug}.`);
console.log("Próximo passo: substitua e revise a fonte; depois rode npm run source:hash -- --chapter " + slug + " --write.");
