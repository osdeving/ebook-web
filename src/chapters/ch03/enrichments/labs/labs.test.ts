import { describe, expect, it } from "vitest";
import katex from "katex";
import { parseHTML } from "linkedom";
import { parseFragment } from "parse5";
import { labs } from "./index";

describe("catálogo de laboratórios do capítulo 3", () => {
  it("registra treze experiências declarativas com IDs únicos", () => {
    expect(labs).toHaveLength(13);
    expect(new Set(labs.map(({ id }) => id)).size).toBe(13);
    expect(labs.every(({ id }) => id.startsWith("lab-3-"))).toBe(true);
    expect(labs.every(({ layer }) => layer === "lab")).toBe(true);
    expect(labs.every(({ anchor, content, initialize }) => (
      anchor.length > 0
      && typeof content === "string"
      && typeof initialize === "function"
    ))).toBe(true);
  });

  it("mantém a variedade algorítmica planejada", () => {
    const ids = new Set(labs.map(({ id }) => id));
    [
      "lab-3-2-rsa-workbench",
      "lab-3-4-miller-rabin",
      "lab-3-5-pollard-p-menos-1",
      "lab-3-7-2-mini-crivo-quadratico",
      "lab-3-8-calculo-de-indices",
      "lab-3-9-jacobi-e-reciprocidade",
      "lab-3-10-goldwasser-micali",
    ].forEach((id) => expect(ids.has(id)).toBe(true));
  });

  it("mantém HTML, controles e expressões KaTeX válidos", () => {
    labs.forEach((lab) => {
      const html = String(lab.content);
      const parseErrors: string[] = [];
      parseFragment(html, { onParseError: ({ code }) => parseErrors.push(code) });
      expect(parseErrors, lab.id).toEqual([]);

      const { document } = parseHTML("<html><body>" + html + "</body></html>");
      expect([...document.querySelectorAll("input")].every((input) => input.closest("label")), lab.id).toBe(true);
      expect(document.querySelectorAll("[data-output]"), lab.id).toHaveLength(1);
      expect(document.querySelectorAll('[data-feedback][role="status"]'), lab.id).toHaveLength(1);
      expect([...document.querySelectorAll("button")].every((button) => button.type === "submit" || button.type === "button"), lab.id).toBe(true);

      const text = document.body.textContent;
      const expressions = [
        ...text.matchAll(/\\\(([\s\S]*?)\\\)/g),
        ...text.matchAll(/\\\[([\s\S]*?)\\\]/g),
      ];
      expressions.forEach((match) => {
        expect(() => katex.renderToString(match[1]!, { throwOnError: true, strict: "error" }), lab.id)
          .not.toThrow();
      });
    });
  });
});
