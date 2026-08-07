import {
  defineEnrichment, LAB_KICKER as supplement, crtPair, initialise, mod,
  q, qa, setFeedback, setOutput
} from "../shared";

export const rootsLab = defineEnrichment({
    id: "lab-2-8-1-quatro-raizes",
    layer: "lab",
    anchor: "#exp-2-8-1-quatro-combinacoes",
    title: "As quatro raízes de 4 módulo 77",
    kicker: supplement,
    meta: "Seção 2.8.1 · iniciante · 5–7 min",
    html: `
      <p class="lab-intro">Como 77=7·11, combine uma raiz módulo 7 com uma raiz módulo 11. Aqui 4 tem raízes ±2 em cada primo.</p>
      <fieldset class="lab-choice-grid">
        <legend>Escolha um par local</legend>
        <button type="button" data-combo="2,2">x≡2 mod 7; x≡2 mod 11</button>
        <button type="button" data-combo="2,9">x≡2 mod 7; x≡−2≡9 mod 11</button>
        <button type="button" data-combo="5,2">x≡−2≡5 mod 7; x≡2 mod 11</button>
        <button type="button" data-combo="5,9">x≡−2≡5 mod 7; x≡−2≡9 mod 11</button>
      </fieldset>
      <div class="lab-result" data-output></div>
      <p data-found>Nenhuma raiz global calculada.</p>
      <div class="lab-actions"><button type="button" class="secondary" data-reset>Reiniciar</button></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const found = new Set<number>();
      const renderFound = () => {
        q(root, "[data-found]").textContent = found.size ? `Raízes encontradas: ${[...found].sort((a, b) => a - b).join(", ")}.` : "Nenhuma raiz global calculada.";
      };
      qa(root, "[data-combo]").forEach((button) => button.addEventListener("click", () => {
        const [rp, rq] = button.dataset.combo.split(",").map(BigInt);
        const solution = crtPair(rp, 7n, rq, 11n);
        const check = mod(solution.value * solution.value, 77n);
        found.add(Number(solution.value));
        setOutput(root, `<p>TCR(${rp} mod 7, ${rq} mod 11) = <strong>${solution.value}</strong> mod 77. Verificação: ${solution.value}² mod 77 = ${check}.</p>`);
        renderFound();
        setFeedback(root, check === 4n ? "A combinação local produziu uma raiz global válida." : "A verificação falhou.", check === 4n ? "success" : "warning");
      }));
      q(root, "[data-reset]").addEventListener("click", () => {
        found.clear();
        setOutput(root, "");
        renderFound();
        setFeedback(root, "Laboratório reiniciado.");
      });
    })
  });
