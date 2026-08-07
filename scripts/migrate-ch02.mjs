#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, readdir, mkdir, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_SOURCE_HASH = "9549dad63a65f11aaf9684c4054eee392aca59f4de1c6c9a634c601e9f0db653";
const EXPECTED_TEXT_LENGTH = 118_229;
const EXPECTED_SECTION_IDS = [
  "sec-2-1",
  "sec-2-2",
  "sec-2-3",
  "sec-2-4",
  "sec-2-5",
  "sec-2-6",
  "sec-2-7",
  "sec-2-8",
  "sec-2-8-1",
  "sec-2-9",
  "sec-2-10",
  "sec-2-10-1",
  "sec-2-10-2",
  "sec-2-10-3",
  "sec-2-10-4",
  "exercicios",
];
const EXPECTED_EXPLANATION_COUNT = 48;

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const chapterRoot = path.join(projectRoot, "src", "chapters", "ch02");
const sourceDirectory = path.join(chapterRoot, "source", "sections");
const explanationsDirectory = path.join(chapterRoot, "enrichments", "explanations");
const isolatedLegacyPath = path.resolve(
  projectRoot,
  "sources",
  "legacy",
  "ch02-traduzido.html",
);
const parentLegacyPath = path.resolve(projectRoot, "..", "ch02-traduzido.html");
const defaultLegacyPath = existsSync(isolatedLegacyPath)
  ? isolatedLegacyPath
  : parentLegacyPath;
const legacyPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : defaultLegacyPath;

if (!existsSync(legacyPath)) {
  fail(`HTML legado nao encontrado: ${legacyPath}\nPasse o caminho como primeiro argumento.`);
}

const legacyHtml = await readFile(legacyPath, "utf8");
const article = findFirstElement(legacyHtml, "article", (openingTag) =>
  hasClass(openingTag, "reader"),
);
if (!article) fail("Nao foi encontrado article.reader no HTML legado.");

const originalSourceText = normalizeHtmlText(removeEditorialElements(article.outerHtml));
assertSourceIntegrity("HTML legado", originalSourceText);

const toc = extractToc(legacyHtml);
const sections = [];
const explanationCatalog = [];
const explanationBodies = new Map();

for (const sectionId of EXPECTED_SECTION_IDS) {
  const section = findFirstElement(article.outerHtml, "section", (openingTag) =>
    getAttribute(openingTag, "id") === sectionId,
  );
  if (!section) fail(`Secao esperada ausente: ${sectionId}`);

  const extracted = extractExplanations(section.outerHtml, sectionId);
  sections.push({
    id: sectionId,
    file: `source/sections/${sectionId}.html`,
    html: cleanGeneratedHtml(extracted.sourceHtml),
  });
  explanationCatalog.push(
    ...extracted.catalog.map((entry, index) => ({
      ...entry,
      order: explanationCatalog.length + index,
    })),
  );
  for (const [id, body] of extracted.bodies) explanationBodies.set(id, body);
}

if (explanationCatalog.length !== EXPECTED_EXPLANATION_COUNT) {
  fail(
    `Quantidade inesperada de explicacoes: ${explanationCatalog.length}; ` +
      `esperado ${EXPECTED_EXPLANATION_COUNT}.`,
  );
}
if (new Set(explanationCatalog.map(({ id }) => id)).size !== explanationCatalog.length) {
  fail("Ha IDs duplicados no catalogo de explicacoes.");
}

const generatedSourceText = normalizeHtmlText(sections.map(({ html }) => html).join("\n"));
assertSourceIntegrity("secoes modulares", generatedSourceText);
if (generatedSourceText !== originalSourceText) {
  fail("O texto modular difere do texto-fonte, embora hash e tamanho tenham sido aceitos.");
}

await mkdir(sourceDirectory, { recursive: true });
await mkdir(explanationsDirectory, { recursive: true });
await removeStaleHtmlFiles(sourceDirectory, new Set(sections.map(({ id }) => `${id}.html`)));
await removeStaleHtmlFiles(
  explanationsDirectory,
  new Set(explanationCatalog.map(({ file }) => file)),
);

for (const section of sections) {
  await writeFile(path.join(chapterRoot, section.file), section.html, "utf8");
}
for (const entry of explanationCatalog) {
  await writeFile(
    path.join(explanationsDirectory, entry.file),
    cleanGeneratedHtml(explanationBodies.get(entry.id)),
    "utf8",
  );
}

const manifest = {
  slug: "ch02",
  number: "2",
  title: "Logaritmos discretos e Diffie–Hellman",
  shortTitle: "Logaritmos discretos",
  eyebrow: "Capítulo 2 · tradução para português",
  description:
    "Da ideia de chave pública aos grupos, algoritmos de logaritmo discreto, anéis de polinômios e corpos finitos.",
  sourceHash: EXPECTED_SOURCE_HASH,
  textLength: EXPECTED_TEXT_LENGTH,
  toc,
  sourceOrder: sections.map(({ file }) => file),
};

await writeJson(path.join(chapterRoot, "manifest.json"), manifest);
await writeFile(path.join(chapterRoot, "manifest.ts"), generateManifestModule(), "utf8");
await writeJson(path.join(explanationsDirectory, "catalog.json"), explanationCatalog);
await writeFile(
  path.join(explanationsDirectory, "catalog.ts"),
  generateExplanationCatalogModule(),
  "utf8",
);
await writeFile(
  path.join(explanationsDirectory, "index.ts"),
  generateExplanationIndexModule(),
  "utf8",
);
await writeFile(path.join(chapterRoot, "chapter.ts"), generateChapterModule(), "utf8");

const writtenSectionText = normalizeHtmlText(
  (
    await Promise.all(
      manifest.sourceOrder.map((relativeFile) => readFile(path.join(chapterRoot, relativeFile), "utf8")),
    )
  ).join("\n"),
);
assertSourceIntegrity("arquivos gravados", writtenSectionText);

console.log(
  [
    `Migracao concluida a partir de ${legacyPath}`,
    `- ${sections.length} secoes em source/sections`,
    `- ${explanationCatalog.length} explicacoes em enrichments/explanations`,
    `- texto normalizado: ${writtenSectionText.length} caracteres`,
    `- SHA-256: ${sha256(writtenSectionText)}`,
  ].join("\n"),
);

function extractExplanations(sectionHtml, sectionId) {
  const bodies = new Map();
  const catalog = [];
  let sourceHtml = "";
  let cursor = 0;

  while (true) {
    const details = findFirstElement(
      sectionHtml,
      "details",
      (openingTag) => hasClass(openingTag, "explanation"),
      cursor,
    );
    if (!details) break;

    const id = getAttribute(details.openingTag, "id");
    if (!id) fail(`Explicacao sem id na secao ${sectionId}.`);
    const summary = findFirstElement(details.outerHtml, "summary");
    const body = findFirstElement(details.outerHtml, "div", (openingTag) =>
      hasClass(openingTag, "explanation-body"),
    );
    if (!summary || !body) fail(`Estrutura incompleta na explicacao ${id}.`);

    const tagElement = findFirstElement(summary.outerHtml, "span", (openingTag) =>
      hasClass(openingTag, "explanation-kicker"),
    );
    const titleElement = findFirstElement(summary.outerHtml, "span", (openingTag) =>
      hasClass(openingTag, "explanation-title"),
    );
    const tag = tagElement ? normalizeHtmlText(tagElement.innerHtml) : "Explicacao";
    const title = titleElement ? normalizeHtmlText(titleElement.innerHtml) : "";
    if (!title) fail(`Titulo ausente na explicacao ${id}.`);

    const slotId = `slot-${id}`;
    sourceHtml += sectionHtml.slice(cursor, details.start);
    sourceHtml += `<span id="${slotId}" data-enrichment-slot="${id}"></span>`;
    cursor = details.end;

    const file = `${id}.html`;
    bodies.set(id, body.outerHtml);
    catalog.push({
      id,
      type: "explanation",
      layer: "explanation",
      kind: "explanation",
      tag,
      title,
      section: sectionId,
      anchor: slotId,
      slot: `[data-enrichment-slot="${id}"]`,
      file,
    });
  }

  sourceHtml += sectionHtml.slice(cursor);
  return { sourceHtml, bodies, catalog };
}

function extractToc(html) {
  const tocElement = findFirstElement(html, "ol", (openingTag) =>
    hasClass(openingTag, "toc"),
  );
  if (!tocElement) fail("Sumario ol.toc ausente no HTML legado.");

  const items = [];
  const itemPattern = /<li\b[^>]*>[\s\S]*?<\/li>/gi;
  for (const match of tocElement.innerHtml.matchAll(itemPattern)) {
    const itemHtml = match[0];
    const openingTag = itemHtml.match(/^<li\b[^>]*>/i)?.[0] ?? "<li>";
    const href = itemHtml.match(/<a\b[^>]*href=["']#([^"']+)["']/i)?.[1];
    const numberElement = findFirstElement(itemHtml, "span", (tag) =>
      hasClass(tag, "toc-num"),
    );
    const spans = findAllTopLevelElements(itemHtml, "span");
    const titleElement = spans.find(({ openingTag: tag }) => !hasClass(tag, "toc-num"));
    if (!href || !numberElement || !titleElement) fail(`Item de sumario invalido: ${itemHtml}`);
    items.push({
      id: href,
      number: normalizeHtmlText(numberElement.innerHtml),
      title: normalizeHtmlText(titleElement.innerHtml),
      depth: hasClass(openingTag, "sub") ? 2 : 1,
    });
  }

  const ids = items.map(({ id }) => id);
  if (ids.join("\n") !== EXPECTED_SECTION_IDS.join("\n")) {
    fail(`A ordem do sumario nao corresponde as secoes esperadas: ${ids.join(", ")}`);
  }
  return items;
}

function findFirstElement(html, tagName, predicate = () => true, fromIndex = 0) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  pattern.lastIndex = fromIndex;
  let openingMatch;
  while ((openingMatch = pattern.exec(html))) {
    if (!predicate(openingMatch[0])) continue;
    return readBalancedElement(html, openingMatch.index, tagName);
  }
  return null;
}

function findAllTopLevelElements(html, tagName) {
  const elements = [];
  let cursor = 0;
  while (true) {
    const element = findFirstElement(html, tagName, () => true, cursor);
    if (!element) return elements;
    elements.push(element);
    cursor = element.end;
  }
}

function readBalancedElement(html, start, tagName) {
  const tokenPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  tokenPattern.lastIndex = start;
  let depth = 0;
  let token;
  let openingTag = "";
  let openingEnd = -1;

  while ((token = tokenPattern.exec(html))) {
    const isClosing = /^<\//.test(token[0]);
    if (!isClosing) {
      if (depth === 0) {
        openingTag = token[0];
        openingEnd = tokenPattern.lastIndex;
      }
      depth += 1;
    } else {
      depth -= 1;
      if (depth === 0) {
        const end = tokenPattern.lastIndex;
        return {
          start,
          end,
          openingTag,
          outerHtml: html.slice(start, end),
          innerHtml: html.slice(openingEnd, token.index),
        };
      }
    }
  }
  fail(`Elemento <${tagName}> iniciado em ${start} nao foi fechado.`);
}

function removeEditorialElements(html) {
  let result = html;
  const editorialPattern = /<([a-z][a-z0-9:-]*)\b[^>]*\bdata-origin=["']editorial["'][^>]*>/i;
  while (true) {
    const match = editorialPattern.exec(result);
    if (!match) return result;
    const element = readBalancedElement(result, match.index, match[1]);
    result = result.slice(0, element.start) + result.slice(element.end);
  }
}

function normalizeHtmlText(html) {
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

function cleanGeneratedHtml(html) {
  return `${String(html)
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .join("\n")
    .trim()}\n`;
}

function decodeHtmlEntities(value) {
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

function getAttribute(openingTag, attributeName) {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = openingTag.match(
    new RegExp(`\\b${escapedName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i"),
  );
  return match ? decodeHtmlEntities(match[2]) : null;
}

function hasClass(openingTag, className) {
  return (getAttribute(openingTag, "class") ?? "").split(/\s+/).includes(className);
}

function assertSourceIntegrity(label, text) {
  const actualHash = sha256(text);
  if (text.length !== EXPECTED_TEXT_LENGTH || actualHash !== EXPECTED_SOURCE_HASH) {
    fail(
      `${label} nao preserva a fonte. ` +
        `Obtido ${text.length} caracteres e ${actualHash}; ` +
        `esperado ${EXPECTED_TEXT_LENGTH} e ${EXPECTED_SOURCE_HASH}.`,
    );
  }
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

async function removeStaleHtmlFiles(directory, expectedFiles) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".html") && !expectedFiles.has(entry.name)) {
      await unlink(path.join(directory, entry.name));
    }
  }
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function generateManifestModule() {
  return `import rawManifest from "./manifest.json";\n\n` +
    `export interface ChapterManifest {\n` +
    `  slug: string;\n` +
    `  number: string;\n` +
    `  title: string;\n` +
    `  shortTitle: string;\n` +
    `  eyebrow: string;\n` +
    `  description: string;\n` +
    `  sourceHash: string;\n` +
    `  textLength: number;\n` +
    `  toc: ReadonlyArray<{ id: string; number: string; title: string; depth: 1 | 2 | 3 }>;\n` +
    `  sourceOrder: readonly string[];\n` +
    `}\n\n` +
    `function defineManifest(value: ChapterManifest): Readonly<ChapterManifest> {\n` +
    `  if (!value.slug || !value.title || value.sourceOrder.length === 0) {\n` +
    `    throw new Error("Manifesto de capitulo invalido");\n` +
    `  }\n` +
    `  return Object.freeze(value);\n` +
    `}\n\n` +
    `export const manifest = defineManifest(rawManifest as ChapterManifest);\n` +
    `export default manifest;\n`;
}

function generateExplanationCatalogModule() {
  return `import rawCatalog from "./catalog.json";\n\n` +
    `export interface ExplanationCatalogItem {\n` +
    `  id: string;\n` +
    `  type: "explanation";\n` +
    `  layer: "explanation";\n` +
    `  kind: "explanation";\n` +
    `  tag: string;\n` +
    `  title: string;\n` +
    `  section: string;\n` +
    `  anchor: string;\n` +
    `  slot: string;\n` +
    `  file: string;\n` +
    `  order: number;\n` +
    `}\n\n` +
    `export const explanationCatalog = Object.freeze(\n` +
    `  rawCatalog as ExplanationCatalogItem[],\n` +
    `);\n`;
}

function generateExplanationIndexModule() {
  return `import type { EnrichmentDefinition } from "../../../../framework/types";\n` +
    `import { trustedHtml } from "../../../../framework/trusted-html";\n` +
    `import { explanationCatalog } from "./catalog";\n\n` +
    `const htmlModules = import.meta.glob("./*.html", {\n` +
    `  eager: true,\n` +
    `  query: "?raw",\n` +
    `  import: "default",\n` +
    `}) as Record<string, string>;\n\n` +
    `export const explanationEntries = explanationCatalog.map((item) => {\n` +
    `  const html = htmlModules[\`./\${item.file}\`];\n` +
    `  if (typeof html !== "string") throw new Error(\`HTML ausente para \${item.id}\`);\n` +
    `  return Object.freeze({ ...item, html });\n` +
    `});\n\n` +
    `export const explanations: EnrichmentDefinition[] = explanationEntries.map((item) => ({\n` +
    `  id: item.id,\n` +
    `  layer: "explanation",\n` +
    `  anchor: item.anchor,\n` +
    `  title: item.title,\n` +
    `  kicker: item.tag,\n` +
    `  collapsible: true,\n` +
    `  content: trustedHtml(item.html),\n` +
    `  tags: [item.kind, item.section],\n` +
    `}));\n\n` +
    `export { explanationCatalog };\n`;
}

function generateChapterModule() {
  return `import { explanations } from "./enrichments/explanations";\n` +
    `import { labs } from "./enrichments/labs";\n` +
    `import { practices } from "./enrichments/practices";\n` +
    `import { historyItems } from "./enrichments/history";\n` +
    `import { readingItems } from "./enrichments/readings";\n` +
    `import { initializeChapter } from "./runtime";\n` +
    `import manifest from "./manifest";\n\n` +
    `const sourceModules = import.meta.glob("./source/sections/*.html", {\n` +
    `  eager: true,\n` +
    `  query: "?raw",\n` +
    `  import: "default",\n` +
    `}) as Record<string, string>;\n\n` +
    `const sourceSections = manifest.sourceOrder.map((file) => {\n` +
    `  const html = sourceModules[\`./\${file}\`];\n` +
    `  if (typeof html !== "string") throw new Error(\`Seção-fonte ausente: \${file}\`);\n` +
    `  const id = file.slice(file.lastIndexOf("/") + 1).replace(/\\.html$/, "");\n` +
    `  return Object.freeze({ id, file, html });\n` +
    `});\n\n` +
    `export const chapter = Object.freeze({\n` +
    `  ...manifest,\n` +
    `  sourceSections: Object.freeze(sourceSections),\n` +
    `  enrichments: Object.freeze([\n` +
    `    ...explanations,\n` +
    `    ...labs,\n` +
    `    ...practices,\n` +
    `    ...historyItems,\n` +
    `    ...readingItems,\n` +
    `  ]),\n` +
    `  initialize: initializeChapter,\n` +
    `});\n\n` +
    `export default chapter;\n`;
}

function fail(message) {
  throw new Error(`[migrate-ch02] ${message}`);
}
