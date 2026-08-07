import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";
import { trustedHtml } from "./trusted-html";

vi.mock("./math", () => ({ renderMath: vi.fn() }));

import { mountEnrichments } from "./mount";

describe("montagem de enriquecimentos", () => {
  beforeEach(() => {
    const { document, window } = parseHTML(`
      <html><body><article id="chapter"><span id="slot-reference"></span></article></body></html>
    `);
    vi.stubGlobal("document", document);
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

    mounted.destroy();
    expect(chapterRoot.querySelector("#reading-ref-38-online")).toBeNull();
  });
});
