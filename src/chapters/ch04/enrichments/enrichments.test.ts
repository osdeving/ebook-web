import { describe, expect, it } from "vitest";
import katex from "katex";
import { parseHTML } from "linkedom";
import { parseFragment } from "parse5";
import { explanations } from "./explanations";
import { historyItems } from "./history";
import { labs } from "./labs";
import { practices } from "./practices";
import { readingItems } from "./readings";

const all = [...explanations, ...labs, ...practices, ...historyItems, ...readingItems];

describe("enriquecimentos do capítulo 4", () => {
  it("registra 48 recursos com IDs globais únicos", () => {
    expect(explanations).toHaveLength(18);
    expect(labs).toHaveLength(5);
    expect(practices).toHaveLength(11);
    expect(historyItems).toHaveLength(5);
    expect(readingItems).toHaveLength(9);
    expect(all).toHaveLength(48);
    expect(new Set(all.map(({ id }) => id)).size).toBe(48);
    expect(all.every(({ anchor }) => ["sec-4-1", "sec-4-2", "sec-4-3", ...Array.from({ length: 11 }, (_, index) => "exercicio-4-" + (index + 1))].includes(anchor))).toBe(true);
  });

  it("mantém HTML editorial válido e matemática KaTeX estrita", () => {
    all.forEach((item) => {
      const html = String(item.content);
      expect(html, item.id).not.toMatch(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/);
      const parseErrors: string[] = [];
      parseFragment(html, { onParseError: ({ code }) => parseErrors.push(code) });
      expect(parseErrors, item.id).toEqual([]);
      const { document } = parseHTML("<html><body>" + html + "</body></html>");
      const text = document.body.textContent;
      const expressions = [
        ...text.matchAll(/\\\(([\s\S]*?)\\\)/g),
        ...text.matchAll(/\\\[([\s\S]*?)\\\]/g),
      ];
      const residue = text
        .replace(/\\\([\s\S]*?\\\)/g, "")
        .replace(/\\\[[\s\S]*?\\\]/g, "");
      expect(residue, item.id).not.toMatch(/\\[\(\)\[\]]/);
      expressions.forEach((match) => {
        expect(() => katex.renderToString(match[1]!, {
          throwOnError: true,
          strict: "error",
        }), item.id).not.toThrow();
      });
      document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]').forEach((link) => {
        expect(link.rel.split(/\s+/), item.id).toContain("noopener");
        expect(link.rel.split(/\s+/), item.id).toContain("noreferrer");
      });
    });
  });

  it("oferece ajuda graduada e solução integral para os onze exercícios", () => {
    practices.forEach((practice) => {
      const { document } = parseHTML("<html><body>" + String(practice.content) + "</body></html>");
      const hintCount = document.querySelectorAll(".solution-hint").length;
      expect(hintCount, practice.id).toBeGreaterThanOrEqual(2);
      expect(hintCount, practice.id).toBeLessThanOrEqual(3);
      expect(document.querySelectorAll(".solution-reveal"), practice.id).toHaveLength(1);
      expect(document.querySelector(".solution-reveal")?.textContent.length, practice.id).toBeGreaterThan(250);
    });
  });

  it("mantém histórias e leituras apoiadas por fontes externas", () => {
    historyItems.forEach((item) => {
      const { document } = parseHTML("<html><body>" + String(item.content) + "</body></html>");
      expect(document.querySelectorAll('a[href^="https://"]').length, item.id).toBeGreaterThan(0);
    });
    readingItems.forEach((item) => {
      const { document } = parseHTML("<html><body>" + String(item.content) + "</body></html>");
      expect(document.querySelectorAll('a[href^="https://"]').length, item.id).toBeGreaterThan(0);
      expect(document.querySelectorAll(".reading-card").length, item.id).toBeGreaterThanOrEqual(2);
    });
  });

  it("documenta as três erratas impressas sem contaminar outras explicações", () => {
    const errata = explanations.find(({ id }) => id === "exp-4-3-errata-exemplo-4-8");
    expect(errata?.title).toContain("Três");
    const errataHtml = String(errata?.content);
    expect(errataHtml).toContain("A quantidade pública é \\(A\\)");
    expect(errataHtml).toContain("2727\\bmod443=69");
    expect(errataHtml).toContain("2717\\bmod443=59");
    expect(errataHtml).toContain("343+242\\cdot59");

    const reduction = explanations.find(({ id }) => id === "exp-4-3-reducao-dois-estagios");
    expect(String(reduction?.content)).toContain("\\(g^k\\bmod p=2717\\)");
    expect(String(reduction?.content)).not.toContain("\\(g^k\\bmod p=2727\\)");
  });
});
