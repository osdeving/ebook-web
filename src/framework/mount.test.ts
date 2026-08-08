import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";
import { trustedHtml } from "./trusted-html";

vi.mock("./math", () => ({ renderMath: vi.fn() }));

import { mountEnrichments } from "./mount";
import { renderMath } from "./math";

describe("montagem de enriquecimentos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const { document, window } = parseHTML(`
      <html><body><article id="chapter"><span id="slot-reference"></span></article></body></html>
    `);
    vi.stubGlobal("document", document);
    vi.stubGlobal("window", window);
    vi.stubGlobal("CustomEvent", window.CustomEvent);
  });

  it("monta links editoriais inline sem criar um painel", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({
      chapterRoot,
      definitions: [{
        id: "reading-ref-38-online",
        layer: "reading",
        anchor: "slot-reference",
        presentation: "inline",
        title: "Versão online da referência 38",
        content: trustedHtml('<a href="https://example.org" rel="noopener noreferrer">Fonte online</a>'),
      }],
    });

    const host = chapterRoot.querySelector<HTMLElement>("#reading-ref-38-online")!;
    expect(host.tagName).toBe("SPAN");
    expect(host.dataset.origin).toBe("editorial");
    expect(host.dataset.layer).toBe("reading");
    expect(host.dataset.enrichmentTitle).toBe("Versão online da referência 38");
    expect(host.querySelector("details")).toBeNull();
    expect(host.querySelector("a")?.textContent).toBe("Fonte online");
    expect(renderMath).toHaveBeenCalledOnce();

    mounted.destroy();
    expect(chapterRoot.querySelector("#reading-ref-38-online")).toBeNull();
  });

  it("adia a matemática de painéis fechados até a primeira abertura", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({
      chapterRoot,
      definitions: [{
        id: "exp-lenta",
        layer: "explanation",
        anchor: "slot-reference",
        title: "Explicação lenta",
        content: trustedHtml("<p>\\(a+b\\)</p>"),
      }],
    });
    const panel = chapterRoot.querySelector<HTMLDetailsElement>("#exp-lenta details")!;
    expect(renderMath).not.toHaveBeenCalled();
    panel.open = true;
    panel.dispatchEvent(new window.Event("toggle"));
    expect(renderMath).toHaveBeenCalledOnce();
    panel.dispatchEvent(new window.Event("toggle"));
    expect(renderMath).toHaveBeenCalledOnce();
    mounted.destroy();
  });

  it("agrupa duração e título sem criar uma coluna implícita no cabeçalho", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({
      chapterRoot,
      definitions: [{
        id: "lab-com-duracao",
        layer: "lab",
        anchor: "slot-reference",
        title: "Euclides estendido, linha por linha",
        duration: "Seção 1.2 · 10–15 min",
        content: trustedHtml("<p>Laboratório.</p>"),
      }],
    });

    const summary = chapterRoot.querySelector<HTMLElement>("#lab-com-duracao summary")!;
    const heading = summary.querySelector<HTMLElement>(".supplement__heading")!;
    expect(summary.children).toHaveLength(1);
    expect(heading.querySelector(".supplement__title")?.textContent)
      .toBe("Euclides estendido, linha por linha");
    expect(heading.querySelector(".supplement__duration")?.textContent)
      .toBe("Seção 1.2 · 10–15 min");

    mounted.destroy();
  });
});
