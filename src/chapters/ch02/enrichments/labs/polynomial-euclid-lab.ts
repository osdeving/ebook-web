import {
  defineEnrichment, LAB_KICKER as supplement, initialise, polyExtendedGcd,
  polyMultiply, polyString, q, setFeedback, setOutput
} from "../shared";

export const polynomialEuclidLab = defineEnrichment({
    id: "lab-2-10-3-euclides-polinomial",
    layer: "lab",
    anchor: "#exp-2-10-3-euclides-bezout",
    title: "Euclides e Bézout em F₂[x]",
    kicker: supplement,
    meta: "Seção 2.10.3 · intermediário · 8–12 min",
    html: `
      <p class="lab-intro">Calcule o mdc de a=x³+x+1 e b=x²+1. Cada clique acrescenta uma divisão com resto; ao final, a substituição reversa aparece como identidade de Bézout.</p>
      <div class="lab-table-wrap">
        <table class="lab-table"><caption>Divisões do algoritmo de Euclides</caption><thead><tr><th scope="col">Dividendo</th><th scope="col">Divisor</th><th scope="col">Quociente</th><th scope="col">Resto</th></tr></thead><tbody data-steps></tbody></table>
      </div>
      <div class="lab-actions">
        <button type="button" data-next>Próxima divisão</button>
        <button type="button" data-all>Completar algoritmo</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const a = 0b1011;
      const b = 0b0101;
      const result = polyExtendedGcd(a, b);
      let index = 0;
      const finish = () => {
        const check = (polyMultiply(a, result.s) ^ polyMultiply(b, result.t)) >>> 0;
        setOutput(root, `<p><strong>mdc:</strong> ${polyString(result.gcd)}.</p>
          <p><strong>Bézout:</strong> (${polyString(a)})(${polyString(result.s)}) + (${polyString(b)})(${polyString(result.t)}) = ${polyString(check)}.</p>`);
        setFeedback(root, check === result.gcd ? "A combinação de Bézout foi verificada." : "A verificação da combinação falhou.", check === result.gcd ? "success" : "warning");
      };
      const next = () => {
        if (index >= result.steps.length) {
          finish();
          return;
        }
        const step = result.steps[index];
        if (!step) {
          finish();
          return;
        }
        const row = document.createElement("tr");
        [step.dividend, step.divisor, step.quotient, step.remainder].forEach((value) => {
          const cell = document.createElement("td");
          cell.textContent = polyString(value);
          row.append(cell);
        });
        q(root, "[data-steps]").append(row);
        index += 1;
        if (index === result.steps.length) finish();
        else setFeedback(root, `Divisão ${index} registrada; o grau do resto diminuiu.`);
      };
      const reset = () => {
        index = 0;
        q(root, "[data-steps]").replaceChildren();
        setOutput(root, "");
        setFeedback(root, "Comece pela divisão de a por b.");
      };
      q(root, "[data-next]").addEventListener("click", next);
      q(root, "[data-all]").addEventListener("click", () => {
        while (index < result.steps.length) next();
      });
      q(root, "[data-reset]").addEventListener("click", reset);
      reset();
    })
  });
