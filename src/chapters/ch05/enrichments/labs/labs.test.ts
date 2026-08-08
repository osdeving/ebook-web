import { describe, expect, it } from "vitest";
import katex from "katex";
import { parseHTML } from "linkedom";
import { parseFragment } from "parse5";
import { labs } from ".";

describe("laboratórios do capítulo 5", () => {
  it("registra nove experiências com IDs e âncoras estáveis", () => {
    expect(labs).toHaveLength(9);
    expect(new Set(labs.map(({ id }) => id)).size).toBe(9);
    expect(labs.every(({ id }) => id.startsWith("lab-5-"))).toBe(true);
    expect(labs.map(({ anchor }) => anchor)).toEqual([
      "sec-5-1",
      "sec-5-2",
      "sec-5-3-2",
      "sec-5-3-5",
      "sec-5-4-1",
      "sec-5-5-2",
      "sec-5-6-1",
      "sec-5-6-2",
      "sec-5-7",
    ]);
  });

  it("mantém HTML válido, controles rotulados e regiões acessíveis", () => {
    labs.forEach((lab) => {
      const html = String(lab.content);
      const parseErrors: string[] = [];
      parseFragment(html, { onParseError: ({ code }) => parseErrors.push(code) });
      expect(parseErrors, lab.id).toEqual([]);
      const { document } = parseHTML("<html><body>" + html + "</body></html>");
      expect(document.querySelectorAll("form"), lab.id).toHaveLength(1);
      expect(document.querySelectorAll("label").length, lab.id).toBeGreaterThanOrEqual(2);
      expect(document.querySelectorAll("button").length, lab.id).toBeGreaterThanOrEqual(2);
      expect(document.querySelectorAll('[data-output][role="region"][aria-label]'), lab.id).toHaveLength(1);
      expect(document.querySelectorAll('[data-feedback][role="status"][aria-live="polite"]'), lab.id).toHaveLength(1);
      expect(document.querySelectorAll("[data-reset]"), lab.id).toHaveLength(1);
      const text = document.body.textContent;
      const expressions = [
        ...text.matchAll(/\\\(([\s\S]*?)\\\)/g),
        ...text.matchAll(/\\\[([\s\S]*?)\\\]/g),
      ];
      expressions.forEach((match) => {
        expect(() => katex.renderToString(match[1]!, {
          throwOnError: true,
          strict: "error",
        }), lab.id + ": " + match[1]).not.toThrow();
      });
    });
  });

  it("não monta interface nem exige DOM durante a importação", () => {
    expect(labs.every(({ initialize }) => typeof initialize === "function")).toBe(true);
    expect(labs.every(({ content }) => String(content).includes("data-output"))).toBe(true);
  });
});
