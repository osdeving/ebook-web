#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const sourcePath = path.resolve(
  projectRoot,
  process.argv[2] ?? "sources/extracted/references/references.txt",
);
const outputPath = path.resolve(
  projectRoot,
  process.argv[3] ?? "src/content/references.json",
);
const shouldResolve = process.argv.includes("--resolve");

const raw = await readFile(sourcePath, "utf8");
const entries = parseReferences(raw);
if (entries.length !== 150 || entries.some(({ number }, index) => number !== index + 1)) {
  throw new Error(`Bibliografia incompleta ou fora de ordem: ${entries.length} itens.`);
}

applyCuratedLinks(entries);
if (shouldResolve) await resolveMissingLinks(entries);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");

const explicit = entries.filter(({ linkSource }) => linkSource === "book").length;
const curated = entries.filter(({ linkSource }) => linkSource === "curated").length;
const resolved = entries.filter(({ linkSource }) => linkSource === "crossref").length;
console.log(
  `Referências migradas: ${entries.length}; ${explicit} URLs do livro; ` +
  `${curated} links editoriais; ${resolved} DOIs validados.`,
);

function parseReferences(value) {
  const normalized = value
    .replace(/\r/g, "")
    .replace(/\f/g, "\n")
    .replace(/[ﬀﬁﬂﬃﬄ]/g, (ligature) => ({
      "ﬀ": "ff",
      "ﬁ": "fi",
      "ﬂ": "fl",
      "ﬃ": "ffi",
      "ﬄ": "ffl",
    })[ligature]);
  const lines = normalized.split("\n");
  const entries = [];
  let current;

  const flush = () => {
    if (!current) return;
    const joined = current.lines
      .join("\n")
      .replace(/-\n\s*/g, "")
      .replace(/\n\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const { citation, url } = splitExplicitUrl(joined);
    entries.push({
      number: current.number,
      citation,
      ...(url ? { url, linkSource: "book" } : {}),
    });
  };

  for (const line of lines) {
    const start = line.match(/^\s*\[(\d+)]\s*(.*)$/);
    if (start) {
      flush();
      current = { number: Number(start[1]), lines: [start[2]] };
      continue;
    }
    if (!current || isPageFurniture(line)) continue;
    current.lines.push(line.trim());
  }
  flush();
  return entries;
}

function isPageFurniture(line) {
  const text = line.trim();
  return !text ||
    /^References\s+\d+$/.test(text) ||
    /^\d+\s+References$/.test(text) ||
    /^© Springer/.test(text) ||
    /^J\. Hoffstein et al\./.test(text) ||
    /^Undergraduate Texts/.test(text);
}

function splitExplicitUrl(value) {
  const match = value.match(/(?:https?:\/\/|(?:crypto\.)?stanford\.edu\/|www\.)/i);
  if (!match || match.index === undefined) return { citation: value };
  const rawUrl = value.slice(match.index).replace(/\s+/g, "").replace(/[.,;]+$/, "");
  const url = (/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`)
    .replace(/^http:\/\//i, "https://");
  return { citation: value.slice(0, match.index).trim(), url };
}

function applyCuratedLinks(references) {
  const curated = new Map([
    [42, "https://www.cs.miami.edu/home/burt/manuscripts/crypto_for_intelligence/ellis.pdf"],
    [35, "https://www.cambridge.org/core/books/the-higher-arithmetic/DDEFF69B28C5E3D66C228102D920F566"],
    [38, "https://doi.org/10.1109/TIT.1976.1055638"],
    [52, "https://global.oup.com/academic/product/an-introduction-to-the-theory-of-numbers-9780199219865"],
    [55, "https://doi.org/10.1007/3-540-36563-X_9"],
    [56, "https://eprint.iacr.org/2005/274.pdf"],
    [59, "https://doi.org/10.1007/978-1-4757-2103-4"],
    [63, "https://www.simonandschuster.com/books/The-Codebreakers/David-Kahn/9780684831305"],
    [66, "https://www.informit.com/store/art-of-computer-programming-volume-2-seminumerical-9780133488807"],
    [100, "https://www.wiley-vch.de/en/areas-interest/mathematics-statistics/mathematics-16ma/number-theory-16mac/an-introduction-to-the-theory-of-numbers-978-0-471-62546-9"],
    [101, "https://ntru.org/f/tr/tr004v2.pdf"],
    [102, "https://ntru.org/f/tr/tr012v2.pdf"],
    [111, "https://www.pearson.com/en-us/subject-catalog/p/elementary-number-theory-and-its-applications/P200000006235"],
    [137, "https://www.math.brown.edu/johsilve/frint.html"],
    [139, "https://www.penguinrandomhouse.com/books/168002/the-code-book-by-simon-singh/"],
    [142, "https://www.secg.org/SEC2-Ver-1.0.pdf"],
  ]);
  const replacedBookLinks = new Set([42, 55, 56, 101, 102, 142]);
  for (const reference of references) {
    const url = curated.get(reference.number);
    if (!url || (reference.url && !replacedBookLinks.has(reference.number))) continue;
    reference.url = url;
    reference.linkSource = "curated";
    if (reference.number === 55) reference.doi = "10.1007/3-540-36563-X_9";
    else delete reference.doi;
  }
}

async function resolveMissingLinks(references) {
  const pending = references.filter(({ url }) => !url);
  const concurrency = 2;
  let cursor = 0;

  const worker = async () => {
    while (cursor < pending.length) {
      const entry = pending[cursor++];
      const resolved = await lookupCrossref(entry);
      if (resolved) Object.assign(entry, resolved);
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
}

async function lookupCrossref(entry) {
  const endpoint = new URL("https://api.crossref.org/works");
  endpoint.searchParams.set("query.bibliographic", entry.citation);
  endpoint.searchParams.set("rows", "1");
  endpoint.searchParams.set("select", "DOI,title,published");
  endpoint.searchParams.set("mailto", "osdeving@users.noreply.github.com");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        headers: { "User-Agent": "ebook-web-reference-resolver/0.1 (mailto:osdeving@users.noreply.github.com)" },
      });
      if (response.status === 429 || response.status >= 500) {
        await delay(400 * (attempt + 1));
        continue;
      }
      if (!response.ok) return undefined;
      const item = (await response.json()).message?.items?.[0];
      const title = item?.title?.[0];
      const doi = item?.DOI;
      await delay(80);
      if (!title || !doi || !isStrongMatch(entry.citation, title, item.published)) return undefined;
      return {
        url: `https://doi.org/${doi}`,
        doi,
        linkSource: "crossref",
      };
    } catch {
      await delay(250 * (attempt + 1));
    }
  }
  return undefined;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isStrongMatch(citation, title, published) {
  const titleTokens = meaningfulTokens(title);
  const citationTokens = new Set(meaningfulTokens(citation));
  if (titleTokens.length < 3) return false;
  const coverage = titleTokens.filter((token) => citationTokens.has(token)).length / titleTokens.length;
  const year = published?.["date-parts"]?.[0]?.[0];
  const yearMatches = !year || citation.includes(String(year));
  return coverage >= 0.82 && yearMatches;
}

function meaningfulTokens(value) {
  const stopWords = new Set(["a", "an", "and", "as", "by", "for", "from", "in", "of", "on", "the", "to", "with"]);
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.filter((token) => token.length > 1 && !stopWords.has(token)) ?? [];
}
