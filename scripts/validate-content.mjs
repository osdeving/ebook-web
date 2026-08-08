#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import { basename, resolve, relative } from "node:path";
import { normalizeHtmlText, sha256 } from "./lib/content-integrity.mjs";
import {
  collectSourceCrossReferences,
  resolveSourceCrossReference,
} from "./lib/cross-references.mjs";

const projectRoot = resolve(import.meta.dirname, "..");
const chaptersRoot = resolve(projectRoot, "src", "chapters");
const errors = [];
const reports = [];
const globalSlugs = new Map();
const globalNumbers = new Map();
const globalEnrichmentIds = new Map();
const chapterTargets = new Map();
const sourceCrossReferences = [];
const localPageTargets = await loadLocalPageTargets();

for (const entry of await readdir(chaptersRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const chapterRoot = resolve(chaptersRoot, entry.name);
  const manifestPath = resolve(chapterRoot, "manifest.json");
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    errors.push(`${entry.name}: manifesto ausente ou inválido (${error.message}).`);
    continue;
  }

  if (manifest.slug !== entry.name) {
    errors.push(`${entry.name}: slug do manifesto deve ser igual ao nome da pasta (${manifest.slug}).`);
  }
  registerGlobal(globalSlugs, manifest.slug, entry.name, "slug de capítulo");
  registerGlobal(globalNumbers, String(manifest.number), entry.name, "número de capítulo");

  try {
    const credits = await readFile(resolve(chapterRoot, "credits.md"), "utf8");
    if (!credits.trim()) errors.push(`${manifest.slug}: credits.md está vazio.`);
  } catch {
    errors.push(`${manifest.slug}: credits.md ausente.`);
  }

  const sourceFiles = [];
  const sourceOrder = Array.isArray(manifest.sourceOrder) ? manifest.sourceOrder : [];
  const seenSourcePaths = new Set();
  for (const sourcePath of sourceOrder) {
    if (typeof sourcePath !== "string" || !sourcePath.startsWith("source/sections/")) {
      errors.push(`${manifest.slug}: caminho-fonte fora de source/sections: ${String(sourcePath)}.`);
      continue;
    }
    if (seenSourcePaths.has(sourcePath)) {
      errors.push(`${manifest.slug}: sourceOrder contém caminho duplicado: ${sourcePath}.`);
      continue;
    }
    seenSourcePaths.add(sourcePath);
    const absoluteSourcePath = resolve(chapterRoot, sourcePath);
    const confinedPath = relative(chapterRoot, absoluteSourcePath);
    if (!confinedPath || confinedPath.startsWith("..")) {
      errors.push(`${manifest.slug}: caminho-fonte escapa da pasta do capítulo: ${sourcePath}.`);
      continue;
    }
    try {
      sourceFiles.push({
        path: sourcePath,
        html: await readFile(absoluteSourcePath, "utf8"),
      });
    } catch {
      errors.push(`${manifest.slug}: arquivo-fonte ausente: ${sourcePath}.`);
    }
  }
  if (sourceOrder.length === 0 || sourceFiles.length === 0) {
    errors.push(`${manifest.slug}: sourceOrder está vazio.`);
    continue;
  }
  for (const htmlFile of await walk(resolve(chapterRoot, "source", "sections"), ".html")) {
    const registeredPath = relative(chapterRoot, htmlFile).split("\\").join("/");
    if (!seenSourcePaths.has(registeredPath)) {
      errors.push(`${manifest.slug}: seção-fonte não registrada em sourceOrder: ${registeredPath}.`);
    }
  }

  const normalized = normalizeHtmlText(sourceFiles.map(({ html }) => html).join("\n"));
  const actualHash = sha256(normalized);
  if (manifest.sourceHash === "PENDING" || !manifest.sourceHash) {
    errors.push(
      `${manifest.slug}: hash pendente; registre ${actualHash} e ${normalized.length} caracteres após revisar o source.`,
    );
  } else if (actualHash !== manifest.sourceHash || normalized.length !== manifest.textLength) {
    errors.push(
      `${manifest.slug}: source alterado; obtido ${normalized.length}/${actualHash}, ` +
        `esperado ${manifest.textLength}/${manifest.sourceHash}.`,
    );
  }

  const sourceIds = collectAttributeValues(
    sourceFiles.map(({ html }) => html).join("\n"),
    "id",
  );
  reportDuplicates(manifest.slug, sourceIds, "ID no source");

  const tocIds = (manifest.toc ?? []).map(({ id }) => id);
  for (const id of tocIds) {
    if (!sourceIds.includes(id)) errors.push(`${manifest.slug}: item do sumário sem seção #${id}.`);
  }

  const explanationCatalogPath = resolve(
    chapterRoot,
    "enrichments",
    "explanations",
    "catalog.json",
  );
  let explanations = [];
  try {
    explanations = JSON.parse(await readFile(explanationCatalogPath, "utf8"));
  } catch {
    // Capítulos novos podem começar sem explicações.
  }

  const enrichmentIds = [];
  const anchors = [];
  const explanationFiles = new Set();
  for (const item of explanations) {
    enrichmentIds.push(item.id);
    anchors.push(item.anchor);
    if (typeof item.id !== "string" || !item.id.startsWith("exp-")) {
      errors.push(`${manifest.slug}: ID de explicação inválido: ${String(item.id)}.`);
    }
    if (!sourceIds.includes(item.anchor)) {
      errors.push(`${manifest.slug}: âncora de explicação ausente: #${item.anchor}.`);
    }
    if (!sourceIds.includes(item.section)) {
      errors.push(`${manifest.slug}: seção de explicação ausente: #${item.section}.`);
    }
    if (typeof item.file !== "string" || item.file.includes("/") || item.file.includes("..")) {
      errors.push(`${manifest.slug}: arquivo de explicação inválido em ${item.id}.`);
      continue;
    }
    explanationFiles.add(item.file);
    try {
      await readFile(resolve(chapterRoot, "enrichments", "explanations", item.file));
    } catch {
      errors.push(`${manifest.slug}: HTML da explicação ${item.id} está ausente.`);
    }
  }

  const explanationsRoot = resolve(chapterRoot, "enrichments", "explanations");
  for (const htmlFile of await walk(explanationsRoot, ".html")) {
    if (!explanationFiles.has(basename(htmlFile))) {
      errors.push(`${manifest.slug}: HTML de explicação não registrado: ${basename(htmlFile)}.`);
    }
  }
  try {
    const explanationIndex = await readFile(resolve(explanationsRoot, "index.ts"), "utf8");
    if (!explanationIndex.includes("./catalog")) {
      errors.push(`${manifest.slug}: índice de explicações não importa o catálogo.`);
    }
  } catch {
    errors.push(`${manifest.slug}: índice de explicações ausente.`);
  }

  const moduleKinds = new Map([
    ["labs", "lab-"],
    ["practices", "practice-"],
    ["history", "history-"],
    ["readings", "reading-"],
  ]);
  for (const [kind, prefix] of moduleKinds) {
    const kindRoot = resolve(chapterRoot, "enrichments", kind);
    let indexSource = "";
    try {
      indexSource = await readFile(resolve(kindRoot, "index.ts"), "utf8");
    } catch {
      errors.push(`${manifest.slug}: índice ausente em enrichments/${kind}.`);
      continue;
    }
    if (kind === "practices") {
      let solutionCatalog = [];
      const solutionCatalogPath = resolve(kindRoot, "solution-catalog.json");
      let solutionCatalogSource;
      try {
        solutionCatalogSource = await readFile(solutionCatalogPath, "utf8");
      } catch {
        if (indexSource.includes("./solutions")) {
          errors.push(`${manifest.slug}: practices/solution-catalog.json ausente.`);
        }
      }
      if (solutionCatalogSource !== undefined) {
        try {
          solutionCatalog = JSON.parse(solutionCatalogSource);
        } catch {
          errors.push(`${manifest.slug}: practices/solution-catalog.json contém JSON inválido.`);
        }
        if (!Array.isArray(solutionCatalog)) {
          errors.push(`${manifest.slug}: practices/solution-catalog.json precisa conter um array.`);
          solutionCatalog = [];
        }
      }

      const solutionFiles = new Set();
      const solutionOrders = new Set();
      const solutionsRoot = resolve(kindRoot, "solutions");
      for (const item of solutionCatalog) {
        if (!item || typeof item !== "object") {
          errors.push(`${manifest.slug}: entrada inválida em practices/solution-catalog.json.`);
          continue;
        }
        if (typeof item.id !== "string" || !item.id.startsWith("practice-")) {
          errors.push(`${manifest.slug}: ID de solução inválido: ${String(item.id)}.`);
        } else {
          enrichmentIds.push(item.id);
        }
        if (item.layer !== "practice") {
          errors.push(`${manifest.slug}: solução ${String(item.id)} deve usar layer practice.`);
        }
        if (typeof item.exercise !== "string" || !item.exercise.trim()) {
          errors.push(`${manifest.slug}: exercício ausente na solução ${String(item.id)}.`);
        }
        if (typeof item.anchor !== "string" || !item.anchor.trim()) {
          errors.push(`${manifest.slug}: âncora ausente na solução ${String(item.id)}.`);
        } else {
          anchors.push(item.anchor);
        }
        if (typeof item.title !== "string" || !item.title.trim()) {
          errors.push(`${manifest.slug}: título ausente na solução ${String(item.id)}.`);
        }
        if (!Number.isSafeInteger(item.order) || item.order < 0) {
          errors.push(`${manifest.slug}: ordem inválida na solução ${String(item.id)}.`);
        } else if (solutionOrders.has(item.order)) {
          errors.push(`${manifest.slug}: ordem de solução duplicada: ${item.order}.`);
        } else {
          solutionOrders.add(item.order);
        }
        if (
          typeof item.file !== "string"
          || !item.file.endsWith(".html")
          || item.file.includes("/")
          || item.file.includes("..")
        ) {
          errors.push(`${manifest.slug}: arquivo de solução inválido em ${String(item.id)}.`);
          continue;
        }
        if (solutionFiles.has(item.file)) {
          errors.push(`${manifest.slug}: arquivo de solução duplicado: ${item.file}.`);
          continue;
        }
        solutionFiles.add(item.file);
        try {
          await readFile(resolve(solutionsRoot, item.file), "utf8");
        } catch {
          errors.push(`${manifest.slug}: HTML da solução ${String(item.id)} está ausente.`);
        }
      }
      for (const htmlFile of await walk(solutionsRoot, ".html")) {
        const catalogFile = relative(solutionsRoot, htmlFile).split("\\").join("/");
        if (!solutionFiles.has(catalogFile)) {
          errors.push(`${manifest.slug}: HTML de solução não registrado: ${catalogFile}.`);
        }
      }
    }
    const practiceInfrastructure = new Set([
      resolve(kindRoot, "solution-catalog.ts"),
      resolve(kindRoot, "solutions.ts"),
    ]);
    const moduleFiles = (await walk(kindRoot, ".ts")).filter(
      (file) => (
        basename(file) !== "index.ts"
        && !(
          kind === "practices"
          && practiceInfrastructure.has(file)
        )
        && !file.endsWith(".test.ts")
      ),
    );
    for (const file of moduleFiles) {
      const source = await readFile(file, "utf8");
      const moduleName = `./${basename(file, ".ts")}`;
      if (!indexSource.includes(`"${moduleName}"`) && !indexSource.includes(`'${moduleName}'`)) {
        errors.push(`${manifest.slug}: módulo não registrado em ${kind}/index.ts: ${moduleName}.`);
      }
      const idMatches = [...source.matchAll(/\bid\s*:\s*["']([^"']+)["']/g)];
      if (idMatches.length !== 1) {
        errors.push(
          `${manifest.slug}: ${relative(projectRoot, file)} deve declarar exatamente um ID literal; encontrados ${idMatches.length}.`,
        );
        continue;
      }
      let id = idMatches[0][1];
      if (kind === "practices" && !id.startsWith(prefix)) id = `${prefix}${id}`;
      if (!id.startsWith(prefix)) {
        errors.push(`${manifest.slug}: ${id} não usa o prefixo ${prefix}.`);
      }
      enrichmentIds.push(id);
      for (const match of source.matchAll(/\banchor\s*:\s*["']#?([^"']+)["']/g)) {
        anchors.push(match[1]);
      }
    }
  }

  const allModuleFiles = await walk(resolve(chapterRoot, "enrichments"), ".ts");
  for (const file of allModuleFiles) {
    const source = await readFile(file, "utf8");
    if (/window\.Ch02Enrichment|window\.Ch02/.test(source)) {
      errors.push(`${manifest.slug}: API global legada em ${relative(projectRoot, file)}.`);
    }
  }

  reportDuplicates(manifest.slug, enrichmentIds, "ID de enriquecimento");
  for (const id of new Set(enrichmentIds)) {
    registerGlobal(globalEnrichmentIds, id, manifest.slug, "ID global de enriquecimento");
  }
  const availableAnchors = new Set([...sourceIds, ...enrichmentIds]);
  chapterTargets.set(manifest.slug, availableAnchors);
  for (const anchor of new Set(anchors)) {
    if (!availableAnchors.has(anchor)) {
      errors.push(`${manifest.slug}: enriquecimento aponta para âncora ausente #${anchor}.`);
    }
  }
  for (const sourceFile of sourceFiles) {
    for (const reference of collectSourceCrossReferences(sourceFile.html)) {
      sourceCrossReferences.push({
        ...reference,
        fromSlug: manifest.slug,
        sourcePath: sourceFile.path,
      });
    }
  }

  reports.push({
    slug: manifest.slug,
    sections: sourceFiles.length,
    textLength: normalized.length,
    sourceHash: actualHash,
    explanations: explanations.length,
    enrichments: new Set(enrichmentIds).size,
  });
}

await validateDiscoveryTargets();

for (const reference of sourceCrossReferences) {
  const location = `${reference.fromSlug}: ${reference.sourcePath}`;
  if (!reference.label) {
    errors.push(`${location}: link cruzado sem texto acessível (${reference.href || "href ausente"}).`);
  }
  const target = resolveSourceCrossReference(reference.fromSlug, reference.href);
  if (target.kind === "invalid") {
    errors.push(`${location}: link cruzado inválido (${target.reason}): ${reference.href || "<vazio>"}.`);
    continue;
  }
  if (target.kind === "external") {
    errors.push(
      `${location}: data-source-xref aceita apenas navegação interna; ` +
        `mova o link externo para um enriquecimento de leitura (${reference.href}).`,
    );
    continue;
  }
  if (target.kind === "local-page") {
    const targets = localPageTargets.get(target.pathname);
    if (!targets) {
      errors.push(`${location}: link cruzado aponta para página local desconhecida ${target.pathname}.`);
    } else if (!targets.has(target.id)) {
      errors.push(`${location}: link cruzado aponta para alvo ausente ${target.pathname}#${target.id}.`);
    }
    continue;
  }
  const targets = chapterTargets.get(target.slug);
  if (!targets) {
    errors.push(`${location}: link cruzado aponta para capítulo inexistente ${target.slug}.`);
  } else if (!targets.has(target.id)) {
    errors.push(`${location}: link cruzado aponta para alvo ausente ${target.slug}#${target.id}.`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

for (const report of reports) {
  console.log(
    `${report.slug}: ${report.sections} seções, ${report.textLength} caracteres, ` +
      `${report.explanations} explicações, ${report.enrichments} enriquecimentos, ` +
      `SHA-256 ${report.sourceHash}`,
  );
}

function collectAttributeValues(html, name) {
  const values = [];
  const expression = new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "gis");
  for (const match of html.matchAll(expression)) values.push(match[2]);
  return values;
}

function reportDuplicates(slug, values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) errors.push(`${slug}: ${label} duplicado: ${value}.`);
    seen.add(value);
  }
}

function registerGlobal(registry, value, owner, label) {
  if (value === undefined || value === null || String(value).trim() === "") {
    errors.push(`${owner}: ${label} ausente.`);
    return;
  }
  const key = String(value);
  const previousOwner = registry.get(key);
  if (previousOwner && previousOwner !== owner) {
    errors.push(`${owner}: ${label} duplicado (${key}), já usado por ${previousOwner}.`);
    return;
  }
  registry.set(key, owner);
}

async function loadLocalPageTargets() {
  const targets = new Map();
  try {
    const references = JSON.parse(
      await readFile(resolve(projectRoot, "src", "content", "references.json"), "utf8"),
    );
    if (Array.isArray(references)) {
      targets.set(
        "/references/",
        new Set([
          "bibliography-title",
          ...references
            .filter(({ number }) => Number.isSafeInteger(number) && number > 0)
            .map(({ number }) => `ref-${number}`),
        ]),
      );
    }
  } catch {
    // A bibliografia global e opcional em instalações que usam apenas capítulos.
  }
  return targets;
}

async function validateDiscoveryTargets() {
  const catalogs = [
    { file: "glossary.json", label: "glossário", expand: (items) => items },
    { file: "symbols.json", label: "símbolos", expand: (items) => items },
    {
      file: "learning-paths.json",
      label: "rotas de estudo",
      expand: (paths) => paths.flatMap((path) => (
        Array.isArray(path?.steps)
          ? path.steps.map((step, index) => ({
              ...step,
              id: `${String(path.id ?? "rota desconhecida")}/etapa-${index + 1}`,
            }))
          : []
      )),
    },
  ];

  for (const catalog of catalogs) {
    let parsed;
    try {
      parsed = JSON.parse(
        await readFile(resolve(projectRoot, "src", "content", catalog.file), "utf8"),
      );
    } catch (error) {
      errors.push(`${catalog.label}: catálogo ausente ou inválido (${error.message}).`);
      continue;
    }
    if (!Array.isArray(parsed)) {
      errors.push(`${catalog.label}: catálogo precisa conter um array.`);
      continue;
    }
    for (const item of catalog.expand(parsed)) {
      const owner = `${catalog.label}: ${String(item?.id ?? "entrada sem ID")}`;
      if (typeof item?.href !== "string") {
        errors.push(`${owner}: href ausente.`);
        continue;
      }
      const match = /^chapters\/(ch\d{2,})\/#([^#]+)$/.exec(item.href);
      if (!match) {
        errors.push(`${owner}: destino deve usar chapters/chNN/#alvo (${item.href}).`);
        continue;
      }
      const [, slug, encodedId] = match;
      let id;
      try {
        id = decodeURIComponent(encodedId);
      } catch {
        errors.push(`${owner}: fragmento inválido em ${item.href}.`);
        continue;
      }
      if (typeof item.chapter === "string" && item.chapter !== slug) {
        errors.push(`${owner}: chapter ${item.chapter} diverge do destino ${slug}.`);
      }
      const targets = chapterTargets.get(slug);
      if (!targets) {
        errors.push(`${owner}: capítulo de destino inexistente ${slug}.`);
      } else if (!targets.has(id)) {
        errors.push(`${owner}: alvo ausente ${slug}#${id}.`);
      }
    }
  }
}

async function walk(root, extension) {
  const files = [];
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const path = resolve(root, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path, extension)));
    else if (entry.name.endsWith(extension)) files.push(path);
  }
  return files;
}
