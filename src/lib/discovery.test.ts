import { describe, expect, it } from "vitest";
import { buildDiscoveryData, buildSearchIndex, normalizeDiscoveryText } from "./discovery";
import type { ChapterDefinition } from "../framework/types";

const chapter = {
  slug: "ch01",
  number: "1",
  title: "Teste",
  description: "Teste",
  toc: [],
  sourceSections: [{
    id: "sec-1",
    file: "sec-1.html",
    html: `<section id="sec-1"><h2>Álgebra modular</h2><p>Veja a <a data-source-xref href="#def-1">definição</a> e <a data-source-xref href="../../references/#ref-2">[2]</a>.</p><aside class="semantic definition" id="def-1"><span class="semantic-label">Definição</span><p>Uma <strong>unidade</strong> possui inverso.</p></aside></section>`,
  }],
  enrichments: [],
} satisfies ChapterDefinition;

const longFormula = `\\[${"a+b=".repeat(80)}c\\]`;

describe("discovery", () => {
  it("normaliza diacríticos e espaços para busca", () => {
    expect(normalizeDiscoveryText("  Álgebra\nMÓDULAR ")).toBe("algebra modular");
  });

  it("indexa seções, alvos semânticos e referências", () => {
    const entries = buildSearchIndex([chapter], [{ number: 2, citation: "Uma referência" }], [], [], []);
    expect(entries.some(({ href }) => href === "chapters/ch01/#def-1")).toBe(true);
    expect(entries.some(({ href }) => href === "references/#ref-2")).toBe(true);
  });

  it("produz prévias e backlinks sem duplicar origens", () => {
    const data = buildDiscoveryData([chapter], [{ number: 2, citation: "Uma referência" }]);
    expect(data.chapters.ch01?.previews["#def-1"]?.title).toContain("Definição");
    expect(data.chapters.ch01?.backlinks["def-1"]).toHaveLength(1);
    expect(data.referenceBacklinks["ref-2"]).toHaveLength(1);
  });

  it("não corta uma prévia dentro dos delimitadores matemáticos", () => {
    const chapterWithLongMath = {
      ...chapter,
      sourceSections: [{
        id: "sec-math",
        file: "sec-math.html",
        html: `<section id="sec-math"><p><a data-source-xref href="#eq-long">equação</a></p><div class="equation" id="eq-long"><span class="equation-number">(T)</span>${longFormula}</div></section>`,
      }],
    } satisfies ChapterDefinition;
    const preview = buildDiscoveryData([chapterWithLongMath], []).chapters.ch01?.previews["#eq-long"];
    expect(preview?.excerpt).toContain(longFormula);
    expect(preview?.excerpt.match(/\\\[/gu)).toHaveLength(1);
    expect(preview?.excerpt.match(/\\\]/gu)).toHaveLength(1);
  });
});
