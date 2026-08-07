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
});
