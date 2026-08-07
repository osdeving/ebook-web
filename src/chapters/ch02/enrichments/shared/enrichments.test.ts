import { describe, expect, it } from "vitest";
import { historyItems } from "../history";
import { labs } from "../labs";
import { practices } from "../practices";
import { readingItems } from "../readings";
import { parseInteger } from "./math-bigint";

const editorialText = (item: (typeof labs)[number]): string => {
  expect(typeof item.content).toBe("string");
  return item.content as string;
};

describe("catálogo modular do capítulo 2", () => {
  it("preserva todos os recursos e IDs únicos", () => {
    expect(labs).toHaveLength(14);
    expect(practices).toHaveLength(10);
    expect(historyItems).toHaveLength(2);
    expect(readingItems).toHaveLength(7);

    const all = [...labs, ...practices, ...historyItems, ...readingItems];
    expect(new Set(all.map(({ id }) => id)).size).toBe(33);
    expect(all.every(({ anchor }) => anchor.length > 0)).toBe(true);
    expect(all.every(({ content }) => typeof content === "string")).toBe(true);
  });

  it("registra as correções didáticas auditadas", () => {
    const byId = new Map(
      [...labs, ...practices, ...historyItems, ...readingItems].map((item) => [item.id, item])
    );
    expect(editorialText(byId.get("lab-2-1-chaves-alcapao")!)).toContain("exige duas multiplicações modulares");
    expect(editorialText(byId.get("lab-2-6-corrida-complexidade")!)).toContain("se encontram em \\(k=256\\)");
    expect(editorialText(byId.get("lab-2-10-2-classes-polinomiais")!)).toContain("compara os restos");
    expect(editorialText(byId.get("practice-2-8-crt")!)).toContain("continue somando");
    expect(editorialText(byId.get("reading-concept-map")!)).toContain("segurança básica é formulada pelo PDH");
    expect(editorialText(byId.get("reading-glossary")!)).toContain("No contexto \\(F[x]\\)");
    expect(editorialText(byId.get("practice-2-5-axioms")!)).toContain("No anel \\(\\mathbb Z/6\\mathbb Z\\)");
    expect(editorialText(byId.get("history-portrait-gallery")!)).toContain('rel="license noopener noreferrer"');
  });
});

describe("validação de entradas inteiras", () => {
  it("rejeita decimais, notação exponencial e vazios antes de BigInt", () => {
    expect(parseInteger("3.5").ok).toBe(false);
    expect(parseInteger("1e3").ok).toBe(false);
    expect(parseInteger("").ok).toBe(false);
  });

  it("aceita inteiros dentro dos limites", () => {
    expect(parseInteger("-7")).toEqual({ ok: true, value: -7n });
    expect(parseInteger("23", { min: 1n, max: 30n })).toEqual({ ok: true, value: 23n });
    expect(parseInteger("31", { max: 30n }).ok).toBe(false);
  });
});
