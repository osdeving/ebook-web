import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";

vi.mock("../../../../framework/math", () => ({ renderMath: vi.fn() }));

import { mountEnrichments } from "../../../../framework/mount";
import { labs } from ".";

describe("interações dos laboratórios do capítulo 5", () => {
  beforeEach(() => {
    const anchors = [
      "sec-5-1",
      "sec-5-2",
      "sec-5-3-2",
      "sec-5-3-5",
      "sec-5-4-1",
      "sec-5-5-2",
      "sec-5-6-1",
      "sec-5-6-2",
      "sec-5-7",
    ].map((id) => '<span id="' + id + '"></span>').join("");
    const { document, window } = parseHTML('<html><body><article id="chapter">' + anchors + "</article></body></html>");
    vi.stubGlobal("document", document);
    vi.stubGlobal("CustomEvent", window.CustomEvent);
    vi.stubGlobal("Event", window.Event);
    vi.stubGlobal("HTMLInputElement", window.HTMLInputElement);
    vi.stubGlobal("HTMLSelectElement", window.HTMLSelectElement);
    vi.stubGlobal("HTMLTextAreaElement", window.HTMLTextAreaElement);
  });

  it("monta as nove experiências e calcula os exemplos silenciosamente", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });
    expect(mounted.roots).toHaveLength(9);
    expect(chapterRoot.querySelector("#lab-5-1-bancada-contagem")?.textContent).toContain("720");
    expect(chapterRoot.querySelector("#lab-5-4-paradoxo-aniversario")?.textContent).toContain("0.507297");
    expect(chapterRoot.querySelector("#lab-5-5-rho-pollard")?.textContent).toContain("Logaritmo encontrado: t = 3351");
    expect(chapterRoot.querySelector("#lab-5-2-vigenere-e-kasiski")?.textContent).toContain("IC por período e por coluna");
    expect(chapterRoot.querySelector("#lab-5-6-sigilo-perfeito")?.textContent).toContain("Sigilo perfeito");
    expect([...chapterRoot.querySelectorAll<HTMLElement>("[data-feedback]")].every((item) => item.textContent === "")).toBe(true);
    mounted.destroy();
    expect(chapterRoot.querySelectorAll("[data-enrichment-id]")).toHaveLength(0);
  });

  it("responde a presets, submissão e reset sem compartilhar estado", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });
    const secrecy = chapterRoot.querySelector<HTMLElement>("#lab-5-6-sigilo-perfeito")!;
    secrecy.querySelector<HTMLButtonElement>("[data-bias]")!.click();
    expect(secrecy.textContent).toContain("Há vazamento");
    secrecy.querySelector<HTMLButtonElement>("[data-reset]")!.click();
    expect(secrecy.querySelector<HTMLInputElement>("[data-key]")!.value).toBe("0.5");
    expect(secrecy.textContent).toContain("Sigilo perfeito");

    const complexity = chapterRoot.querySelector<HTMLElement>("#lab-5-7-escala-complexidade")!;
    complexity.querySelector<HTMLButtonElement>("[data-256]")!.click();
    expect(complexity.textContent).toContain("256 bits");

    const counting = chapterRoot.querySelector<HTMLElement>("#lab-5-1-bancada-contagem")!;
    counting.querySelector<HTMLInputElement>("[data-r]")!.value = "12";
    counting.querySelector<HTMLFormElement>("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(counting.querySelector("[data-feedback]")?.textContent).toContain("não pode exceder");
    counting.querySelector<HTMLButtonElement>("[data-reset]")!.click();
    expect(counting.querySelector<HTMLInputElement>("[data-r]")!.value).toBe("3");

    counting.querySelector<HTMLInputElement>("[data-r]")!.value = "";
    counting.querySelector<HTMLFormElement>("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(counting.querySelector("[data-feedback]")?.textContent).toContain("precisa ser preenchido");

    const bayes = chapterRoot.querySelector<HTMLElement>("#lab-5-3-bayes-monte-carlo")!;
    bayes.querySelector<HTMLInputElement>("[data-prior]")!.value = "";
    bayes.querySelector<HTMLFormElement>("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(bayes.querySelector("[data-feedback]")?.textContent).toContain("precisa ser preenchida");

    secrecy.querySelector<HTMLInputElement>("[data-message]")!.value = "";
    secrecy.querySelector<HTMLFormElement>("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(secrecy.querySelector("[data-feedback]")?.textContent).toContain("precisa ser preenchida");

    const vigenere = chapterRoot.querySelector<HTMLElement>("#lab-5-2-vigenere-e-kasiski")!;
    vigenere.querySelector<HTMLTextAreaElement>("[data-message]")!.value = "ABCxxxABCyyyABC";
    vigenere.querySelector<HTMLInputElement>("[data-key]")!.value = "A";
    vigenere.querySelector<HTMLFormElement>("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(vigenere.textContent).toContain("ABC: 6, 12, 6");

    const rho = chapterRoot.querySelector<HTMLElement>("#lab-5-5-rho-pollard")!;
    const submitRho = () => rho.querySelector<HTMLFormElement>("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    rho.querySelector<HTMLInputElement>("[data-p]")!.value = "7";
    rho.querySelector<HTMLInputElement>("[data-g]")!.value = "2";
    rho.querySelector<HTMLInputElement>("[data-h]")!.value = "4";
    rho.querySelector<HTMLInputElement>("[data-limit]")!.value = "100";
    submitRho();
    expect(rho.textContent).toContain("Logaritmo encontrado: t = 2");
    expect(rho.textContent).toContain("Ordem de g: 3");

    rho.querySelector<HTMLInputElement>("[data-h]")!.value = "3";
    submitRho();
    expect(rho.querySelector("[data-feedback]")?.textContent).toContain("não pertence ao subgrupo");

    rho.querySelector<HTMLInputElement>("[data-p]")!.value = "10007";
    rho.querySelector<HTMLInputElement>("[data-g]")!.value = "5";
    rho.querySelector<HTMLInputElement>("[data-h]")!.value = "9047";
    rho.querySelector<HTMLInputElement>("[data-limit]")!.value = "5000";
    submitRho();
    expect(rho.textContent).toContain("Logaritmo encontrado: t = 632");
    expect(rho.textContent).toContain("baby-step–giant-step");
    mounted.destroy();
  });
});
