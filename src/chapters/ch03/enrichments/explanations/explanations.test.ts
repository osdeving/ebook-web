import { describe, expect, it } from "vitest";
import { explanationCatalog, explanationEntries, explanations } from "./index";

describe("catálogo de explicações do capítulo 3", () => {
  it("registra 53 painéis com IDs, ordens e arquivos únicos", () => {
    expect(explanationCatalog).toHaveLength(53);
    expect(explanationEntries).toHaveLength(53);
    expect(explanations).toHaveLength(53);
    expect(new Set(explanationCatalog.map(({ id }) => id)).size).toBe(53);
    expect(new Set(explanationCatalog.map(({ order }) => order)).size).toBe(53);
    expect(new Set(explanationCatalog.map(({ file }) => file)).size).toBe(53);
  });

  it("mantém a nota de erratas ligada ao bloco de exercícios", () => {
    expect(explanationCatalog.find(({ id }) => id === "exp-3-exercicios-erratas-verificadas"))
      .toMatchObject({ anchor: "exercicios-ch03", section: "exercicios-ch03", order: 52 });
  });
});
