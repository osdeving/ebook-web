import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";

vi.mock("../../../../framework/math", () => ({ renderMath: vi.fn() }));

import { mountEnrichments } from "../../../../framework/mount";
import { labs } from "./index";

describe("laboratórios interativos do capítulo 4", () => {
  beforeEach(() => {
    const { document, window } = parseHTML(
      '<html><body><article id="chapter"><span id="sec-4-1"></span><span id="sec-4-2"></span><span id="sec-4-3"></span></article></body></html>',
    );
    vi.stubGlobal("document", document);
    vi.stubGlobal("CustomEvent", window.CustomEvent);
    vi.stubGlobal("Event", window.Event);
  });

  it("monta, calcula os exemplos e remove listeners", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });
    expect(mounted.roots).toHaveLength(5);
    expect(chapterRoot.querySelector("#lab-4-2-rsa-assinatura")?.textContent).toContain("206484");
    expect(chapterRoot.querySelector("#lab-4-3-elgamal-assinatura")?.textContent).toContain("(3534, 5888)");
    expect(chapterRoot.querySelector("#lab-4-3-reuso-de-nonce")?.textContent).toContain("a = 72729");
    expect(chapterRoot.querySelector("#lab-4-3-bancada-dsa")?.textContent).toContain("(444, 56)");
    expect([...chapterRoot.querySelectorAll<HTMLElement>("[data-feedback]")].every((item) => item.textContent === "")).toBe(true);
    expect(chapterRoot.querySelectorAll('[data-state="error"]')).toHaveLength(0);
    mounted.destroy();
    expect(chapterRoot.querySelectorAll("[data-enrichment-id]")).toHaveLength(0);
  });

  it("demonstra forja, adulteração e reinício por controles de teclado/click", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });
    const rsa = chapterRoot.querySelector<HTMLElement>("#lab-4-2-rsa-assinatura")!;
    rsa.querySelector<HTMLButtonElement>("[data-forge]")!.click();
    expect(rsa.textContent).toContain("Par válido fabricado");
    const elgamal = chapterRoot.querySelector<HTMLElement>("#lab-4-3-elgamal-assinatura")!;
    elgamal.querySelector<HTMLButtonElement>("[data-tamper]")!.click();
    expect(elgamal.textContent).toContain("A alteração do documento foi detectada");
    const dsa = chapterRoot.querySelector<HTMLElement>("#lab-4-3-bancada-dsa")!;
    dsa.querySelector<HTMLButtonElement>("[data-tamper]")!.click();
    expect(dsa.textContent).toContain("A adulteração foi detectada");
    dsa.querySelector<HTMLInputElement>("[data-d]")!.value = "999";
    dsa.querySelector<HTMLButtonElement>("[data-reset]")!.click();
    expect(dsa.querySelector<HTMLInputElement>("[data-d]")!.value).toBe("244");
    mounted.destroy();
  });

  it("rejeita parâmetros fora do grupo antes de apresentar resultados criptográficos", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });
    const submit = (lab: HTMLElement) => {
      lab.querySelector<HTMLFormElement>("form")!
        .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    };
    const elgamal = chapterRoot.querySelector<HTMLElement>("#lab-4-3-elgamal-assinatura")!;
    elgamal.querySelector<HTMLInputElement>("[data-g]")!.value = "6961";
    submit(elgamal);
    expect(elgamal.querySelector("[data-feedback]")?.textContent).toContain("não nulo");

    const nonce = chapterRoot.querySelector<HTMLElement>("#lab-4-3-reuso-de-nonce")!;
    nonce.querySelector<HTMLInputElement>("[data-p]")!.value = "15";
    submit(nonce);
    expect(nonce.querySelector("[data-feedback]")?.textContent).toContain("p precisa ser primo");

    mounted.destroy();
  });
});
