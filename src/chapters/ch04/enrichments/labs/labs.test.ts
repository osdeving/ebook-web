import { describe, expect, it } from "vitest";
import katex from "katex";
import { parseHTML } from "linkedom";
import { parseFragment } from "parse5";
import { labs } from "./index";

describe("catálogo de laboratórios do capítulo 4", () => {
  it("registra cinco experiências declarativas com IDs únicos", () => {
    expect(labs).toHaveLength(5);
    expect(new Set(labs.map(({ id }) => id)).size).toBe(5);
    expect(labs.every(({ id }) => id.startsWith("lab-4-"))).toBe(true);
    expect(labs.every(({ layer }) => layer === "lab")).toBe(true);
    expect(labs.every(({ initialize }) => typeof initialize === "function")).toBe(true);
  });

  it("mantém HTML, rótulos, reinício e expressões KaTeX válidos", () => {
    labs.forEach((lab) => {
      const html = String(lab.content);
      const parseErrors: string[] = [];
      parseFragment(html, { onParseError: ({ code }) => parseErrors.push(code) });
      expect(parseErrors, lab.id).toEqual([]);
      const { document } = parseHTML("<html><body>" + html + "</body></html>");
      expect([...document.querySelectorAll("input,textarea")].every((input) => input.closest("label")), lab.id).toBe(true);
      expect(document.querySelectorAll("[data-output]"), lab.id).toHaveLength(1);
      expect(document.querySelectorAll('[data-output][role="region"][aria-label]'), lab.id).toHaveLength(1);
      expect(document.querySelectorAll('[data-feedback][role="status"]'), lab.id).toHaveLength(1);
      expect(document.querySelectorAll("[data-reset]"), lab.id).toHaveLength(1);
      expect([...document.querySelectorAll("button")].every((button) => button.type === "submit" || button.type === "button"), lab.id).toBe(true);
      const text = document.body.textContent;
      const expressions = [
        ...text.matchAll(/\\\(([\s\S]*?)\\\)/g),
        ...text.matchAll(/\\\[([\s\S]*?)\\\]/g),
      ];
      expressions.forEach((match) => {
        expect(() => katex.renderToString(match[1]!, { throwOnError: true, strict: "error" }), lab.id).not.toThrow();
      });
    });
  });
});
