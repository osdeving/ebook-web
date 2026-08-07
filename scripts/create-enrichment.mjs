#!/usr/bin/env node

import {
  access,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { constants } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";

const TYPES = Object.freeze({
  explanation: {
    directory: "explanations",
    prefix: "exp-",
    exportName: "explanations",
    label: "Explicação",
  },
  lab: {
    directory: "labs",
    prefix: "lab-",
    exportName: "labs",
    label: "Laboratório",
  },
  practice: {
    directory: "practices",
    prefix: "practice-",
    exportName: "practices",
    label: "Prática",
  },
  history: {
    directory: "history",
    prefix: "history-",
    exportName: "historyItems",
    label: "História",
  },
  reading: {
    directory: "readings",
    prefix: "reading-",
    exportName: "readingItems",
    label: "Para saber mais",
  },
});

function usage() {
  return `Uso:
  npm run new:enrichment -- \\
    --chapter ch03 \\
    --type explanation \\
    --id exp-3-1-ideia-central \\
    --anchor sec-3-1 \\
    --title "A ideia central em câmera lenta"

Tipos: ${Object.keys(TYPES).join(", ")}`;
}

function readArgs(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token?.startsWith("--")) throw new Error(`Argumento inesperado: ${token}`);
    const equals = token.indexOf("=");
    if (equals > 2) {
      values.set(token.slice(2, equals), token.slice(equals + 1));
      continue;
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Falta um valor para ${token}.`);
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

async function listFiles(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = resolve(root, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(path));
    else result.push(path);
  }
  return result;
}

async function readEnrichmentMetadata(root) {
  const metadata = { ids: new Map(), anchors: new Map(), files: new Map() };
  if (!await exists(root)) return metadata;
  for (const path of await listFiles(root)) {
    if (![".ts", ".json"].includes(extname(path))) continue;
    collectMetadata(path, await readFile(path, "utf8"), metadata);
  }
  return metadata;
}

function collectMetadata(path, source, metadata) {
  if (extname(path) === ".json") {
    let parsed;
    try { parsed = JSON.parse(source); } catch { return; }
    const visit = (value) => {
      if (Array.isArray(value)) return value.forEach(visit);
      if (!value || typeof value !== "object") return;
      if (typeof value.id === "string") {
        addOccurrence(metadata.ids, normalizeRegisteredId(value.id, path), path);
      }
      if (typeof value.anchor === "string") addOccurrence(metadata.anchors, value.anchor, path);
      if (typeof value.file === "string") metadata.files.set(value.file, path);
      Object.values(value).forEach(visit);
    };
    visit(parsed);
    return;
  }

  for (const match of source.matchAll(/\bid\s*:\s*["']([^"']+)["']/g)) {
    addOccurrence(metadata.ids, normalizeRegisteredId(match[1], path), path);
  }
  for (const match of source.matchAll(/\banchor\s*:\s*["']([^"']+)["']/g)) {
    addOccurrence(metadata.anchors, match[1], path);
  }
}

function normalizeRegisteredId(id, path) {
  const portablePath = path.split("\\").join("/");
  return portablePath.includes("/enrichments/practices/") && !id.startsWith("practice-")
    ? `practice-${id}`
    : id;
}

function addOccurrence(map, key, value) {
  const values = map.get(key) ?? [];
  values.push(value);
  map.set(key, values);
}

function toSymbol(id) {
  const symbol = id.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
  return /^[a-zA-Z_$]/.test(symbol) ? symbol : `enrichment${symbol}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inferSection(anchor) {
  if (/^sec-[a-z0-9-]+$/i.test(anchor)) return anchor;
  const match = anchor.match(/^(?:slot-)?(?:exp|lab|practice|history|reading)-(\d+(?:-\d+)*)/);
  return match ? `sec-${match[1]}` : "chapter";
}

function staticTemplate({ id, type, anchor, title, symbol, label }) {
  const bodyByType = {
    history: `<ol class="history-timeline">
          <li class="history-timeline__item">
            <time class="history-timeline__date">Data ou período</time>
            <p>Desenvolva aqui o contexto histórico e registre as fontes em <code>credits.md</code>.</p>
          </li>
        </ol>`,
    reading: `<div class="reading-grid">
          <article class="reading-card">
            <h4>Próximo passo</h4>
            <p>Explique por que esta fonte ajuda e qual pré-requisito o leitor precisa.</p>
            <a href="https://example.org" rel="noopener noreferrer">Abrir fonte</a>
          </article>
        </div>`,
  };
  return `import { trustedHtml } from "../../../../framework/trusted-html";
import type { EnrichmentDefinition } from "../../../../framework/types";

export const ${symbol}: EnrichmentDefinition = Object.freeze({
  id: ${JSON.stringify(id)},
  layer: ${JSON.stringify(type)},
  anchor: ${JSON.stringify(anchor)},
  title: ${JSON.stringify(title)},
  kicker: ${JSON.stringify(label)},
  collapsible: true,
  content: trustedHtml(String.raw\`
        <p class="supplement-lead">Apresente em uma frase o que este complemento acrescenta.</p>
        ${bodyByType[type]}
      \`),
});
`;
}

function labTemplate({ id, anchor, title, symbol, label }) {
  return `import { trustedHtml } from "../../../../framework/trusted-html";
import type { EnrichmentDefinition, EnrichmentMountContext } from "../../../../framework/types";

export const ${symbol}: EnrichmentDefinition = Object.freeze({
  id: ${JSON.stringify(id)},
  layer: "lab",
  anchor: ${JSON.stringify(anchor)},
  title: ${JSON.stringify(title)},
  kicker: ${JSON.stringify(label)},
  collapsible: true,
  content: trustedHtml(String.raw\`
        <p class="lab-intro">Diga o que o leitor deve variar e o que precisa observar.</p>
        <div class="lab-controls" data-interactive-only>
          <label>Valor
            <input type="number" value="1" data-lab-value>
          </label>
        </div>
        <div class="lab-result" role="status" aria-live="polite" data-lab-result></div>
      \`),
  initialize({ host }: EnrichmentMountContext) {
    const input = host.querySelector<HTMLInputElement>("[data-lab-value]");
    const output = host.querySelector<HTMLElement>("[data-lab-result]");
    if (!input || !output) return;
    const render = () => { output.textContent = \`Valor atual: \${input.value}\`; };
    input.addEventListener("input", render);
    render();
    return () => input.removeEventListener("input", render);
  },
});
`;
}

function practiceTemplate({ id, anchor, title, symbol, label }) {
  return `import { trustedHtml } from "../../../../framework/trusted-html";
import type { EnrichmentDefinition, EnrichmentMountContext } from "../../../../framework/types";

export const ${symbol}: EnrichmentDefinition = Object.freeze({
  id: ${JSON.stringify(id)},
  layer: "practice",
  anchor: ${JSON.stringify(anchor)},
  title: ${JSON.stringify(title)},
  kicker: ${JSON.stringify(label)},
  collapsible: true,
  content: trustedHtml(String.raw\`
        <div class="practice-widget">
          <p class="practice-prompt">Escreva aqui uma pergunta que verifique uma ideia por vez.</p>
          <label class="practice-input-label">Sua resposta
            <input class="practice-input" type="text" data-practice-answer>
          </label>
          <div class="practice-actions" data-interactive-only>
            <button type="button" data-practice-check>Verificar</button>
          </div>
          <p class="practice-feedback" role="status" aria-live="polite" data-practice-feedback></p>
          <details class="practice-solution"><summary>Ver resolução comentada</summary><div><p>Desenvolva a solução passo a passo.</p></div></details>
        </div>
      \`),
  initialize({ host }: EnrichmentMountContext) {
    const answer = host.querySelector<HTMLInputElement>("[data-practice-answer]");
    const check = host.querySelector<HTMLButtonElement>("[data-practice-check]");
    const feedback = host.querySelector<HTMLElement>("[data-practice-feedback]");
    if (!answer || !check || !feedback) return;
    const verify = () => {
      feedback.textContent = answer.value.trim()
        ? "Implemente aqui o critério e um feedback que explique o raciocínio."
        : "Escreva uma resposta antes de verificar.";
    };
    check.addEventListener("click", verify);
    return () => check.removeEventListener("click", verify);
  },
});
`;
}

function explanationTemplate(title) {
  return `<div class="explanation-body">
  <p class="supplement-lead">${escapeHtml(title)}</p>
  <div class="mental-model">
    <strong>Intuição.</strong> Comece por uma imagem mental antes da notação.
  </div>
  <div class="slow-steps">
    <div class="step">
      <span class="step-tag definition">Definição</span>
      <p>Apresente o objeto matemático e o significado de cada símbolo.</p>
    </div>
    <div class="step">
      <span class="step-tag manipulation">Manipulação</span>
      <p>Mostre uma transformação por vez e diga por que ela é válida.</p>
    </div>
  </div>
  <div class="quick-check">
    <strong>Cheque rápido.</strong> Inclua um exemplo numérico pequeno.
  </div>
</div>
`;
}

function updateIndex(source, { id, symbol, exportName }) {
  if (source.includes(`./${id}`) || new RegExp(`\\b${symbol}\\b`).test(
    source.replace(new RegExp(`export const ${exportName}[\\s\\S]*`, "m"), ""),
  )) {
    throw new Error(`O índice já registra ${id}.`);
  }
  const importLine = `import { ${symbol} } from "./${id}";`;

  if (source.includes("// @ebook-imports") && source.includes("// @ebook-items")) {
    return source
      .replace("// @ebook-imports", `${importLine}\n// @ebook-imports`)
      .replace("// @ebook-exports", `export { ${symbol} };\n// @ebook-exports`)
      .replace("  // @ebook-items", `  ${symbol},\n  // @ebook-items`);
  }

  const arrayPattern = new RegExp(
    `(export const ${exportName}[^=]*=\\s*\\[)([\\s\\S]*?)(\\n\\];)`,
  );
  if (!arrayPattern.test(source)) {
    throw new Error(`Não foi possível localizar o array ${exportName} em index.ts.`);
  }
  const withItem = source.replace(arrayPattern, (_, opening, items, closing) => {
    const separator = items.trim() ? "" : "\n";
    return `${opening}${items}${separator}  ${symbol},${closing}`;
  });
  const exportPosition = withItem.indexOf(`export const ${exportName}`);
  return `${importLine}\n${withItem.slice(0, exportPosition)}export { ${symbol} };\n\n${withItem.slice(exportPosition)}`;
}

async function writeTransaction(entries) {
  const staged = [];
  try {
    for (const [path, content] of entries) {
      const temporary = resolve(dirname(path), `.${basename(path)}.${process.pid}.${staged.length}.tmp`);
      await writeFile(temporary, content, { encoding: "utf8", flag: "wx" });
      staged.push([temporary, path]);
    }
    for (const [temporary, path] of staged) await rename(temporary, path);
  } catch (error) {
    await Promise.all(staged.map(([temporary]) => rm(temporary, { force: true })));
    throw error;
  }
}

async function main() {
  const args = readArgs(process.argv.slice(2));
  const allowedArgs = new Set(["chapter", "type", "id", "anchor", "title"]);
  for (const key of args.keys()) {
    if (!allowedArgs.has(key)) throw new Error(`Opção desconhecida: --${key}.\n${usage()}`);
  }
  const chapter = args.get("chapter");
  const type = args.get("type");
  const id = args.get("id");
  const anchor = args.get("anchor");
  const title = args.get("title");
  if (!chapter || !type || !id || !anchor || !title?.trim()) throw new Error(usage());
  if (!/^ch\d{2,}$/.test(chapter)) throw new Error('O capítulo deve seguir o formato "ch03".');
  if (!(type in TYPES)) throw new Error(`Tipo inválido: ${type}.\n${usage()}`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error("O ID aceita apenas letras minúsculas, números e hífens.");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(anchor)) throw new Error("A âncora deve ser um ID DOM sem #, espaços ou seletores.");
  if (!id.startsWith(TYPES[type].prefix)) throw new Error(`O ID de ${type} deve começar com ${TYPES[type].prefix}.`);

  const projectRoot = resolve(import.meta.dirname, "..");
  const chapterRoot = resolve(projectRoot, "src", "chapters", chapter);
  const enrichmentsRoot = resolve(chapterRoot, "enrichments");
  if (!await exists(resolve(chapterRoot, "manifest.json"))) {
    throw new Error(`Capítulo inexistente: src/chapters/${chapter}. Use new:chapter primeiro.`);
  }

  const metadata = await readEnrichmentMetadata(enrichmentsRoot);
  const globalIds = new Map();
  const chaptersRoot = resolve(projectRoot, "src", "chapters");
  for (const entry of await readdir(chaptersRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const chapterMetadata = await readEnrichmentMetadata(
      resolve(chaptersRoot, entry.name, "enrichments"),
    );
    for (const [registeredId, paths] of chapterMetadata.ids) {
      const occurrences = globalIds.get(registeredId) ?? [];
      occurrences.push(...paths);
      globalIds.set(registeredId, occurrences);
    }
  }
  if (globalIds.has(id)) {
    throw new Error(`ID global duplicado: ${id} já aparece em ${globalIds.get(id).join(", ")}.`);
  }

  // Vários recursos podem consumir a mesma âncora. O que deve ser único é o
  // alvo no DOM: uma seção/slot da fonte ou o host de um enriquecimento.
  const sourceFiles = (await listFiles(resolve(chapterRoot, "source", "sections")))
    .filter((path) => extname(path) === ".html");
  let sourceAnchorCount = 0;
  const escapedAnchor = anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const idPattern = new RegExp(`\\bid\\s*=\\s*["']${escapedAnchor}["']`, "g");
  for (const path of sourceFiles) {
    const html = await readFile(path, "utf8");
    sourceAnchorCount += [...html.matchAll(idPattern)].length;
  }
  const enrichmentAnchorCount = metadata.ids.get(anchor)?.length ?? 0;
  const anchorTargets = sourceAnchorCount + enrichmentAnchorCount;
  if (anchorTargets === 0) {
    throw new Error(`Âncora inexistente: #${anchor}. Crie o alvo na fonte ou registre primeiro o enriquecimento anterior.`);
  }
  if (anchorTargets > 1) {
    throw new Error(`Âncora ambígua: #${anchor} resolve para ${anchorTargets} alvos. IDs DOM devem ser únicos.`);
  }

  const config = TYPES[type];
  const targetDirectory = resolve(enrichmentsRoot, config.directory);
  const extension = type === "explanation" ? ".html" : ".ts";
  const fileName = `${id}${extension}`;
  const targetPath = resolve(targetDirectory, fileName);
  if (await exists(targetPath) || metadata.files.has(fileName)) {
    throw new Error(`Arquivo duplicado: ${fileName}.`);
  }

  if (type === "explanation") {
    const catalogPath = resolve(targetDirectory, "catalog.json");
    if (!await exists(catalogPath)) throw new Error("catalog.json ausente; regenere o scaffold do capítulo.");
    const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
    if (!Array.isArray(catalog)) throw new Error("catalog.json precisa conter um array.");
    const order = catalog.reduce((highest, item) => Math.max(highest, Number(item?.order) || 0), -1) + 1;
    catalog.push({
      id,
      type: "explanation",
      layer: "explanation",
      kind: "explanation",
      tag: config.label,
      title,
      section: inferSection(anchor),
      anchor,
      slot: `#${anchor}`,
      file: fileName,
      order,
    });
    await writeTransaction([
      [targetPath, explanationTemplate(title)],
      [catalogPath, `${JSON.stringify(catalog, null, 2)}\n`],
    ]);
  } else {
    const indexPath = resolve(targetDirectory, "index.ts");
    if (!await exists(indexPath)) throw new Error(`Índice ausente: ${indexPath}.`);
    const symbol = toSymbol(id);
    const index = updateIndex(await readFile(indexPath, "utf8"), {
      id,
      symbol,
      exportName: config.exportName,
    });
    const templateArgs = { id, type, anchor, title, symbol, label: config.label };
    const moduleSource = type === "lab"
      ? labTemplate(templateArgs)
      : type === "practice"
        ? practiceTemplate(templateArgs)
        : staticTemplate(templateArgs);
    await writeTransaction([
      [targetPath, moduleSource],
      [indexPath, index],
    ]);
  }

  console.log(`Recurso criado (${config.label}): src/chapters/${chapter}/enrichments/${config.directory}/${fileName}.`);
  console.log(`Âncora: #${anchor}. Próximo passo: desenvolva o conteúdo e rode npm run validate.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
