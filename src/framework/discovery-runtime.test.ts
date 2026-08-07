import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";
import { mountBacklinks } from "./backlinks";
import { mountCrossReferencePreviews } from "./cross-reference-previews";

describe("descoberta durante a leitura", () => {
  beforeEach(() => {
    const { document, window } = parseHTML(`
      <html><body><article id="chapter">
        <section id="sec-1"><h2>Primeira seção</h2><p>Veja a <a data-source-xref href="#prop-1">Proposição 1</a> e a <a data-source-xref href="../../references/#ref-7">referência 7</a>.</p></section>
        <aside class="semantic proposition" id="prop-1"><span class="semantic-label">Proposição 1.</span><p>Se \\(N=pq\\), então há um resultado.</p></aside>
      </article></body></html>
    `);
    Object.defineProperty(window.HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ top: 30, bottom: 50, left: 20, right: 80, width: 60, height: 20, x: 20, y: 30, toJSON() {} }),
    });
    vi.stubGlobal("document", document);
    vi.stubGlobal("window", window);
    vi.stubGlobal("Node", window.Node);
    vi.stubGlobal("innerWidth", 1024);
    vi.stubGlobal("innerHeight", 768);
    vi.stubGlobal("CSS", { escape: (value: string) => value });
  });

  it("monta relações inversas editoriais e as remove sem tocar no alvo", () => {
    const article = document.querySelector<HTMLElement>("#chapter")!;
    const cleanup = mountBacklinks({
      article,
      backlinks: {
        "prop-1": [{ href: "#sec-1", label: "Primeira seção", chapter: "ch01", context: "Veja a Proposição 1." }],
      },
    });
    const details = article.querySelector<HTMLElement>('[data-backlinks-for="prop-1"]')!;
    expect(details.dataset.origin).toBe("editorial");
    expect(details.dataset.layer).toBe("reading");
    expect(details.textContent).toContain("Usado em 1 passagem");
    expect(details.querySelector("a")?.getAttribute("href")).toBe("#sec-1");
    cleanup();
    expect(article.querySelector("[data-backlinks-for]")).toBeNull();
  });

  it("renderiza matemática nas prévias acionadas por teclado e mouse sem duplicá-la", () => {
    const article = document.querySelector<HTMLElement>("#chapter")!;
    const [semanticLink, referenceLink] = Array.from(article.querySelectorAll<HTMLAnchorElement>("a[data-source-xref]"));
    const cleanup = mountCrossReferencePreviews({
      article,
      previews: {
        "#prop-1": { href: "#prop-1", kind: "Proposição", title: "Proposição 1", excerpt: "Se \\(N=pq\\), então há um resultado." },
        "../../references/#ref-7": {
          href: "../../references/#ref-7",
          kind: "Referência",
          title: "Referência 7",
          excerpt: "Uma análise do problema \\(x^2\\equiv a\\pmod N\\).",
        },
      },
    });
    semanticLink!.dispatchEvent(new window.Event("focus"));
    const preview = document.querySelector<HTMLElement>("#source-xref-preview")!;
    expect(preview.hidden).toBe(false);
    expect(preview.getAttribute("role")).toBe("tooltip");
    expect(preview.textContent).toContain("Proposição 1");
    expect(preview.querySelectorAll(".katex")).toHaveLength(1);
    expect(preview.textContent).not.toContain("\\(");
    expect(semanticLink!.getAttribute("href")).toBe("#prop-1");
    expect(semanticLink!.getAttribute("aria-describedby")).toBe(preview.id);

    referenceLink!.dispatchEvent(new window.Event("pointerenter"));
    expect(preview.textContent).toContain("Referência 7");
    expect(preview.querySelectorAll(".katex")).toHaveLength(1);
    expect(preview.textContent).not.toContain("\\(");
    expect(semanticLink!.hasAttribute("aria-describedby")).toBe(false);
    expect(referenceLink!.getAttribute("aria-describedby")).toBe(preview.id);

    referenceLink!.dispatchEvent(new window.Event("pointerenter"));
    expect(preview.querySelectorAll(".katex")).toHaveLength(1);
    cleanup();
    expect(document.querySelector("#source-xref-preview")).toBeNull();
    expect(referenceLink!.hasAttribute("aria-describedby")).toBe(false);
  });
});
