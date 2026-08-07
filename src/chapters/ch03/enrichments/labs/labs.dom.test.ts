import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";

vi.mock("../../../../framework/math", () => ({ renderMath: vi.fn() }));

import { mountEnrichments } from "../../../../framework/mount";
import { labs } from "./index";

describe("laboratórios interativos do capítulo 3", () => {
  beforeEach(() => {
    const markup = [
      '<html><body><article id="chapter">',
      '<span id="sec-3-1"></span>',
      '<span id="sec-3-2"></span>',
      '<span id="prop-3-2"></span>',
      '<span id="sec-3-3"></span>',
      '<span id="sec-3-4"></span>',
      '<span id="sec-3-4-1"></span>',
      '<span id="sec-3-5"></span>',
      '<span id="sec-3-6"></span>',
      '<span id="sec-3-7-1"></span>',
      '<span id="sec-3-7-2"></span>',
      '<span id="sec-3-8"></span>',
      '<span id="sec-3-9"></span>',
      '<span id="sec-3-10"></span>',
      "</article></body></html>",
    ].join("");
    const { document, window } = parseHTML(markup);
    vi.stubGlobal("document", document);
    vi.stubGlobal("CustomEvent", window.CustomEvent);
    vi.stubGlobal("Event", window.Event);
  });

  it("monta os treze módulos sem falhas de inicialização", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });
    const trigger = (id: string, values: Record<string, string>, button: string) => {
      const lab = chapterRoot.querySelector<HTMLElement>(id)!;
      Object.entries(values).forEach(([name, value]) => { lab.querySelector<HTMLInputElement>("[data-" + name + "]")!.value = value; });
      lab.querySelector<HTMLButtonElement>(button)!.click();
    };
    trigger("#lab-3-2-rsa-workbench", { p: "61", q: "53", e: "17", m: "65" }, "[data-nonunit]");
    trigger("#lab-3-7-2-mini-crivo-quadratico", { n: "1073", b: "19", window: "30" }, "[data-expand]");
    trigger("#lab-3-10-goldwasser-micali", { p: "7", q: "11", a: "6", message: "10110", start: "3" }, "[data-reroll]");

    expect(mounted.roots).toHaveLength(13);
    expect(chapterRoot.querySelectorAll('[data-state="error"]')).toHaveLength(0);
    expect(chapterRoot.querySelectorAll("[data-output]")).toHaveLength(13);
    expect(chapterRoot.querySelectorAll('[role="status"]')).toHaveLength(13);

    expect(chapterRoot.querySelector("#lab-3-2-rsa-workbench")?.textContent).toContain("Chave pública (3233, 17)");
    expect(chapterRoot.querySelector("#lab-3-7-2-mini-crivo-quadratico")?.textContent).toContain("29 · 37 = 1073");
    expect(chapterRoot.querySelector("#lab-3-10-goldwasser-micali")?.textContent).toContain("Mensagem recuperada: 10110");

    const expectedResults: Record<string, string> = {
      "lab-3-1-raizes-pq": "4 raiz(es) reconstruída(s)",
      "lab-3-2-rsa-workbench": "A mensagem voltou corretamente",
      "lab-3-2-phi-fatora": "Primos distintos recuperados exatamente",
      "lab-3-3-maleabilidade-rsa": "A mensagem foi recuperada",
      "lab-3-4-miller-rabin": "testemunha forte",
      "lab-3-4-busca-de-primos": "1000003",
      "lab-3-5-pollard-p-menos-1": "suavidade de p−1",
      "lab-3-6-diferenca-de-quadrados": "Fatoração própria encontrada",
      "lab-3-7-1-explorador-de-suavidade": "2 valor(es) são 7-suaves",
      "lab-3-7-2-mini-crivo-quadratico": "29 · 37 = 1073",
      "lab-3-8-calculo-de-indices": "Logaritmo reconstruído e conferido",
      "lab-3-9-jacobi-e-reciprocidade": "Jacobi −1",
      "lab-3-10-goldwasser-micali": "Mensagem recuperada: 10110",
    };
    Object.entries(expectedResults).forEach(([id, text]) => {
      const lab = chapterRoot.querySelector<HTMLElement>("#" + id)!;
      expect(lab.textContent, id).toContain(text);
      expect(lab.querySelector<HTMLElement>("[data-feedback]")?.dataset.tone, id).toBe("success");
    });
    expect([...chapterRoot.querySelectorAll(".lab-table tbody tr")].every((row) => (
      row.firstElementChild?.tagName === "TH"
      && row.firstElementChild.getAttribute("scope") === "row"
    ))).toBe(true);

    mounted.destroy();
    expect(chapterRoot.querySelectorAll("[data-enrichment-id]")).toHaveLength(0);
  });

  it("recalcula RSA e Jacobi depois de alterar entradas", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });
    const rsa = chapterRoot.querySelector<HTMLElement>("#lab-3-2-rsa-workbench")!;
    rsa.querySelector<HTMLInputElement>("[data-p]")!.value = "61";
    rsa.querySelector<HTMLInputElement>("[data-q]")!.value = "53";
    rsa.querySelector<HTMLInputElement>("[data-e]")!.value = "17";
    rsa.querySelector<HTMLInputElement>("[data-m]")!.value = "65";
    rsa.querySelector<HTMLButtonElement>("[data-nonunit]")!.click();
    expect(rsa.textContent).toContain("A mensagem voltou corretamente");

    const jacobi = chapterRoot.querySelector<HTMLElement>("#lab-3-9-jacobi-e-reciprocidade")!;
    jacobi.querySelector<HTMLButtonElement>("[data-ambiguous]")!.click();
    expect(jacobi.textContent).toContain("(2/15) = 1");
    expect(jacobi.textContent).toContain("quadrado possível");

    mounted.destroy();
  });

  it("rejeita parâmetros fora das hipóteses sem exceções nem falsos fatores", async () => {
    const chapterRoot = document.querySelector<HTMLElement>("#chapter")!;
    const mounted = await mountEnrichments({ chapterRoot, definitions: labs });
    const submit = (lab: HTMLElement) => {
      lab.querySelector<HTMLFormElement>("form")!
        .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    };

    const roots = chapterRoot.querySelector<HTMLElement>("#lab-3-1-raizes-pq")!;
    roots.querySelector<HTMLInputElement>("[data-p]")!.value = "9";
    roots.querySelector<HTMLInputElement>("[data-q]")!.value = "15";
    submit(roots);
    expect(roots.querySelector("[data-feedback]")?.textContent).toContain("precisam ser primos distintos");
    roots.querySelector<HTMLInputElement>("[data-p]")!.value = "11";
    roots.querySelector<HTMLInputElement>("[data-q]")!.value = "19";
    roots.querySelector<HTMLInputElement>("[data-a]")!.value = "-2";
    submit(roots);
    expect(roots.querySelector("[data-feedback]")?.textContent).toContain("4 raiz(es) reconstruída(s)");

    const phi = chapterRoot.querySelector<HTMLElement>("#lab-3-2-phi-fatora")!;
    phi.querySelector<HTMLInputElement>("[data-phi]")!.value = "não inteiro";
    phi.querySelector<HTMLButtonElement>("[data-perturb]")!.click();
    expect(phi.querySelector("[data-feedback]")?.textContent).toContain("precisa ser um inteiro");

    const malleability = chapterRoot.querySelector<HTMLElement>("#lab-3-3-maleabilidade-rsa")!;
    malleability.querySelector<HTMLInputElement>("[data-n]")!.value = "45";
    submit(malleability);
    expect(malleability.querySelector("[data-feedback]")?.textContent).toContain("dois primos distintos");

    const millerRabin = chapterRoot.querySelector<HTMLElement>("#lab-3-4-miller-rabin")!;
    millerRabin.querySelector<HTMLInputElement>("[data-n]")!.value = "3";
    millerRabin.querySelector<HTMLInputElement>("[data-a]")!.value = "11";
    submit(millerRabin);
    expect(millerRabin.textContent).toContain("N−1 = 2^1 · 1");
    millerRabin.querySelector<HTMLInputElement>("[data-n]")!.value = "5";
    millerRabin.querySelector<HTMLInputElement>("[data-a]")!.value = "5";
    submit(millerRabin);
    expect(millerRabin.querySelector("[data-feedback]")?.textContent).not.toContain("Composição certificada");

    const primeSearch = chapterRoot.querySelector<HTMLElement>("#lab-3-4-busca-de-primos")!;
    primeSearch.querySelector<HTMLInputElement>("[data-start]")!.value = "5";
    primeSearch.querySelector<HTMLInputElement>("[data-count]")!.value = "1";
    submit(primeSearch);
    expect(primeSearch.textContent).toContain("passou por 2 bases");

    const pollard = chapterRoot.querySelector<HTMLElement>("#lab-3-5-pollard-p-menos-1")!;
    pollard.querySelector<HTMLInputElement>("[data-a]")!.value = "299";
    submit(pollard);
    expect(pollard.querySelector("[data-feedback]")?.textContent).toContain("não seja múltipla de N");

    const difference = chapterRoot.querySelector<HTMLElement>("#lab-3-6-diferenca-de-quadrados")!;
    difference.querySelector<HTMLInputElement>("[data-n]")!.value = "101";
    difference.querySelector<HTMLInputElement>("[data-limit]")!.value = "50";
    submit(difference);
    expect(difference.querySelector("[data-feedback]")?.textContent).toContain("representação encontrada é trivial");

    const smoothness = chapterRoot.querySelector<HTMLElement>("#lab-3-7-1-explorador-de-suavidade")!;
    smoothness.querySelector<HTMLInputElement>("[data-values]")!.value = "-60, -1, 0";
    submit(smoothness);
    expect(smoothness.textContent).toContain("−1 · 2^2 · 3^1 · 5^1");
    expect(smoothness.querySelector("[data-feedback]")?.textContent).toContain("2 valor(es) são 7-suaves");

    const quadraticSieve = chapterRoot.querySelector<HTMLElement>("#lab-3-7-2-mini-crivo-quadratico")!;
    quadraticSieve.querySelector<HTMLInputElement>("[data-n]")!.value = "15";
    submit(quadraticSieve);
    expect(quadraticSieve.textContent).toContain("3 · 5 = 15");

    const indexCalculus = chapterRoot.querySelector<HTMLElement>("#lab-3-8-calculo-de-indices")!;
    indexCalculus.querySelector<HTMLInputElement>("[data-p]")!.value = "15";
    submit(indexCalculus);
    expect(indexCalculus.querySelector("[data-feedback]")?.textContent).toContain("p precisa ser primo");

    const gm = chapterRoot.querySelector<HTMLElement>("#lab-3-10-goldwasser-micali")!;
    gm.querySelector<HTMLInputElement>("[data-start]")!.value = "9007199254740993";
    gm.querySelector<HTMLButtonElement>("[data-reroll]")!.click();
    expect(gm.querySelector<HTMLInputElement>("[data-start]")!.value).toBe("9007199254741000");

    expect(chapterRoot.querySelectorAll('[data-state="error"]')).toHaveLength(0);
    mounted.destroy();
  });
});
