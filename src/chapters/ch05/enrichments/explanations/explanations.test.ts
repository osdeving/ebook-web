import { describe, expect, it } from "vitest";
import katex from "katex";
import { parseHTML } from "linkedom";
import { parseFragment } from "parse5";
import { explanationCatalog, explanations } from ".";

describe("explicações lentas do capítulo 5", () => {
  it("registra quarenta módulos em catálogo estável", () => {
    expect(explanationCatalog).toHaveLength(40);
    expect(explanations).toHaveLength(40);
    expect(new Set(explanations.map(({ id }) => id)).size).toBe(40);
    expect(explanations.every(({ id }) => id.startsWith("exp-5-"))).toBe(true);
  });

  it("mantém HTML válido, conteúdo substancial e KaTeX estrito", () => {
    explanations.forEach((explanation) => {
      const html = String(explanation.content);
      const parseErrors: string[] = [];
      parseFragment(html, { onParseError: ({ code }) => parseErrors.push(code) });
      expect(parseErrors, explanation.id).toEqual([]);
      const { document } = parseHTML("<html><body>" + html + "</body></html>");
      expect(document.body.textContent.length, explanation.id).toBeGreaterThan(320);
      const text = document.body.textContent;
      const expressions = [
        ...text.matchAll(/\\\(([\s\S]*?)\\\)/g),
        ...text.matchAll(/\\\[([\s\S]*?)\\\]/g),
      ];
      expressions.forEach((match) => {
        expect(() => katex.renderToString(match[1]!, {
          throwOnError: true,
          strict: "error",
        }), explanation.id + ": " + match[1]).not.toThrow();
      });
      const residue = text
        .replace(/\\\([\s\S]*?\\\)/g, "")
        .replace(/\\\[[\s\S]*?\\\]/g, "");
      expect(residue, explanation.id).not.toMatch(/\\(?:[A-Za-z]+|[\(\)\[\]])/);
    });
  });

  it("consolida as erratas verificadas sem alterar a camada-fonte", () => {
    const panel = explanations.find(({ id }) => id === "exp-5-erratas-editoriais");
    const html = String(panel?.content);
    expect(html).toContain("Proposição 5.44");
    expect(html).toContain("\\log_g(h)");
    expect(html).toContain("\\mathcal M^+");
    expect(html).toContain("Exercício 5.50");
    expect(html).toContain("-\\sum_i");
    expect(html).toContain("Exercício 5.51");
    expect(html).toContain("etapa [2]");
    expect(html).toContain("Sete diferenças");
    expect(html).toContain("106 das 546");
    expect(html).toContain("63 das 260");
    expect(html).toContain("i=238");
    expect(html).toContain("Teorema 5.61");
    expect(html).toContain("\\mathrm{FNP}");
    expect(html).toContain("Exemplo 5.57");
    expect(html).toContain("Exercício 5.53");
    expect(html).toContain("Figura 5.2");
  });
});
