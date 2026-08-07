import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";
import { initializeMath, renderMath } from "./math";

describe("renderização matemática progressiva", () => {
  beforeEach(() => {
    const { document, window } = parseHTML(`
      <html><body><article id="reader">
        <p id="source">\\(a+b\\)</p>
        <aside class="supplement"><details><div id="editorial" data-enrichment-body>\\(x^2\\)</div></details></aside>
      </article></body></html>
    `);
    vi.stubGlobal("document", document);
    vi.stubGlobal("window", window);
    vi.stubGlobal("Node", window.Node);
    vi.stubGlobal("navigator", { clipboard: undefined });
  });

  it("renderiza a fonte de imediato e deixa complemento fechado para depois", () => {
    const reader = document.querySelector<HTMLElement>("#reader")!;
    const editorial = document.querySelector<HTMLElement>("#editorial")!;
    const cleanup = initializeMath({ root: reader });
    expect(document.querySelectorAll("#source .katex")).toHaveLength(1);
    expect(editorial.querySelectorAll(".katex")).toHaveLength(0);
    expect(editorial.textContent).toContain("\\(x^2\\)");

    renderMath(editorial);
    expect(editorial.querySelectorAll(".katex")).toHaveLength(1);
    cleanup();
  });
});
