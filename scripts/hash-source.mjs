#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { normalizeHtmlText, sha256 } from "./lib/content-integrity.mjs";

const args = process.argv.slice(2);
const chapterIndex = args.indexOf("--chapter");
const slug = chapterIndex >= 0 ? args[chapterIndex + 1] : undefined;
const shouldWrite = args.includes("--write");

if (!slug || !/^ch\d{2,}$/.test(slug)) {
  console.error("Uso: npm run source:hash -- --chapter ch03 [--write]");
  process.exit(1);
}

const chapterRoot = resolve(import.meta.dirname, "..", "src", "chapters", slug);
const manifestPath = resolve(chapterRoot, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const html = (
  await Promise.all(
    manifest.sourceOrder.map((path) => readFile(resolve(chapterRoot, path), "utf8")),
  )
).join("\n");
const text = normalizeHtmlText(html);
const sourceHash = sha256(text);

console.log(`${slug}: ${text.length} caracteres`);
console.log(`SHA-256: ${sourceHash}`);

if (shouldWrite) {
  manifest.sourceHash = sourceHash;
  manifest.textLength = text.length;
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log("Manifesto atualizado. Revise o diff antes de confirmar a mudança.");
} else {
  console.log("Nada foi alterado. Use --write somente após revisar o source.");
}
