import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";
import { mountSourcePermalinks } from "./permalinks";

describe("permalinks da camada-fonte", () => {
  beforeEach(() => {
    const { document } = parseHTML(`
      <html><body><article id="chapter">
        <aside class="semantic proposition" id="prop-1-4">
          <span class="semantic-label">Proposição</span><span class="semantic-title">1.4</span>
        </aside>
        <div class="exercise" id="exercicio-1-1"><span class="exercise-number">1.1.</span> Enunciado</div>
        <div class="algorithm" id="algorithm-1"><h4>Algoritmo rápido</h4></div>
        <div class="equation" id="eq-1-1"><span class="equation-number">(1.1)</span> x=y</div>
        <figure id="fig-1-1"><figcaption>Figura 1.1</figcaption></figure>
        <div class="table-wrap"><table id="tab-1-1"><caption>Tabela 1.1</caption></table></div>
      </article></body></html>
    `);
    vi.stubGlobal("document", document);
  });

  it("cria um link acessivel por alvo sem alterar textContent", () => {
    const chapter = document.querySelector<HTMLElement>("#chapter")!;
    const sourceText = chapter.textContent;
    const cleanup = mountSourcePermalinks(chapter);
    const links = Array.from(chapter.querySelectorAll<HTMLAnchorElement>("[data-source-permalink]"));

    expect(links).toHaveLength(6);
    expect(chapter.textContent).toBe(sourceText);
    expect(links.every((link) => link.textContent === "")).toBe(true);
    expect(chapter.querySelector('[data-source-permalink="prop-1-4"]')?.getAttribute("aria-label"))
      .toBe("Link permanente para Proposição 1.4");
    expect(chapter.querySelector('[data-source-permalink="tab-1-1"]')?.getAttribute("href"))
      .toBe("#tab-1-1");
    expect(chapter.querySelector('[data-source-permalink="algorithm-1"]')?.getAttribute("aria-label"))
      .toBe("Link permanente para Algoritmo rápido");
    expect(chapter.querySelector("table > [data-source-permalink]")).toBeNull();

    cleanup();
    expect(chapter.querySelectorAll("[data-source-permalink]")).toHaveLength(0);
    expect(chapter.textContent).toBe(sourceText);
  });
});
