import { describe, expect, it } from "vitest";
import katex from "katex";
import { parseHTML } from "linkedom";
import { parseFragment } from "parse5";
import { historyItems } from "./history";
import { readingItems } from "./readings";

describe("histórias e leituras do capítulo 5", () => {
  const items = [...historyItems, ...readingItems];

  it("registra onze histórias e dezoito roteiros sem IDs duplicados", () => {
    expect(historyItems).toHaveLength(11);
    expect(readingItems).toHaveLength(18);
    expect(new Set(items.map(({ id }) => id)).size).toBe(29);
    expect(historyItems.every(({ layer, id }) => layer === "history" && id.startsWith("history-5-"))).toBe(true);
    expect(readingItems.every(({ layer, id }) => layer === "reading" && id.startsWith("reading-5-"))).toBe(true);
    expect(items.every(({ collapsible }) => collapsible)).toBe(true);
  });

  it("mantém HTML, matemática e links externos acessíveis", () => {
    for (const item of items) {
      const html = String(item.content);
      const parseErrors: string[] = [];
      parseFragment(html, { onParseError: ({ code }) => parseErrors.push(code) });
      expect(parseErrors, item.id).toEqual([]);

      const { document } = parseHTML("<html><body>" + html + "</body></html>");
      expect(document.body.textContent.length, item.id).toBeGreaterThan(350);
      const links = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="https://"]')];
      expect(links.length, item.id).toBeGreaterThan(0);
      for (const link of links) {
        expect(link.target, item.id + ": " + link.href).toBe("_blank");
        expect(link.rel.split(/\s+/), item.id + ": " + link.href).toContain("noopener");
        expect(link.rel.split(/\s+/), item.id + ": " + link.href).toContain("noreferrer");
      }

      const text = document.body.textContent;
      const expressions = [
        ...text.matchAll(/\\\(([\s\S]*?)\\\)/g),
        ...text.matchAll(/\\\[([\s\S]*?)\\\]/g),
      ];
      for (const match of expressions) {
        expect(() => katex.renderToString(match[1]!, {
          throwOnError: true,
          strict: "error",
        }), item.id + ": " + match[1]).not.toThrow();
      }
    }
  });

  it("usa time apenas para anos parseáveis e rótulos neutros nos demais cartões", () => {
    const html = historyItems.map(({ content }) => String(content)).join("");
    const { document } = parseHTML("<html><body>" + html + "</body></html>");
    const times = [...document.querySelectorAll("time")];
    expect(times).toHaveLength(17);
    expect(times.every((item) => /^\d{4}$/.test(item.textContent ?? ""))).toBe(true);
    expect(document.querySelectorAll(".timeline-label")).toHaveLength(27);
  });
});
