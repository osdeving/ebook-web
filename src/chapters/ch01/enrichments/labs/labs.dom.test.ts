import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";

vi.mock("../../../../framework/math", () => ({ renderMath: vi.fn() }));

import { mountEnrichments } from "../../../../framework/mount";
import { labs } from "./index";

describe("montagem dos laboratórios do capítulo 1", () => {
  beforeEach(() => {
    const { document, window } = parseHTML(`
      <html><body><article id="chapter">
        <span id="fig-1-1"></span>
        <span id="tab-1-3"></span>
        <span id="example-1-10"></span>
        <span id="def-1-congruence"></span>
        <span id="algorithm-1-fast-powering"></span>
        <span id="def-1-order-mod-p"></span>
        <span id="sec-1-3-1"></span>
        <span id="sec-1-7-3"></span>
        <span id="remark-1-35"></span>
        <span id="exercicios"></span>
      </article></body></html>
    `);
    vi.stubGlobal("document", document);
    vi.stubGlobal("CustomEvent", window.CustomEvent);
  });

  it("inicializa os dez módulos e limpa listeners e hosts", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });

    expect(mounted.roots).toHaveLength(10);
    expect(chapterRoot.querySelectorAll('[data-state="error"]')).toHaveLength(0);
    expect(chapterRoot.querySelectorAll("[data-reset]")).toHaveLength(10);
    expect(chapterRoot.querySelectorAll('[role="status"]')).toHaveLength(13);

    mounted.destroy();
    expect(chapterRoot.querySelectorAll("[data-enrichment-id]")).toHaveLength(0);
  });

  it("executa a primeira etapa da missão por teclado e libera a seguinte", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });
    const mission = chapterRoot.querySelector<HTMLElement>("#lab-1-missao-integrada")!;
    const inverse = mission.querySelector<HTMLInputElement>("[data-inverse-answer]")!;
    inverse.value = "21";
    const keyboardEvent = new document.defaultView!.Event("keydown", { bubbles: true });
    Object.defineProperty(keyboardEvent, "key", { value: "Enter" });
    inverse.dispatchEvent(keyboardEvent);

    expect(mission.querySelector<HTMLInputElement>("[data-power-answer]")?.disabled).toBe(false);
    expect(mission.querySelector('[data-stage-status="1"]')?.textContent).toContain("Correto");
    mounted.destroy();
  });
});
