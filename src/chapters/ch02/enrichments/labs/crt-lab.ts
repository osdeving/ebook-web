import {
  defineEnrichment, LAB_KICKER as supplement, crtPair, gcd, initialise,
  mod, parseInteger, q, qa, setFeedback,
  setOutput
} from "../shared";

export const crtLab = defineEnrichment({
    id: "lab-2-8-relogios-tcr",
    layer: "lab",
    anchor: "#exp-2-8-construir-solucao",
    title: "Relógios e construção do TCR",
    kicker: supplement,
    meta: "Seção 2.8 · iniciante · 8–10 min",
    html: `
      <p class="lab-intro">Escolha dois relógios coprimos. O controle percorre os inteiros e os mostradores informam os dois resíduos.</p>
      <div class="lab-controls">
        <label>x ≡ <input type="number" step="1" value="2" data-a aria-label="Primeiro resíduo"> mod <input type="number" min="2" max="30" step="1" value="3" data-m aria-label="Primeiro módulo"></label>
        <label>x ≡ <input type="number" step="1" value="4" data-b aria-label="Segundo resíduo"> mod <input type="number" min="2" max="30" step="1" value="5" data-n aria-label="Segundo módulo"></label>
      </div>
      <label class="lab-range-label">Testar x=<output data-x-output>0</output>
        <input type="range" min="0" max="29" value="0" data-x aria-label="Valor de x a testar">
      </label>
      <div class="lab-clock-row" data-clocks aria-live="polite"></div>
      <div class="lab-actions">
        <button type="button" data-solve>Construir a solução</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const read = () => {
        const mResult = parseInteger(q(root, "[data-m]").value, { min: 2n, max: 30n, label: "O primeiro módulo" });
        const nResult = parseInteger(q(root, "[data-n]").value, { min: 2n, max: 30n, label: "O segundo módulo" });
        const aResult = parseInteger(q(root, "[data-a]").value, { label: "O primeiro resíduo" });
        const bResult = parseInteger(q(root, "[data-b]").value, { label: "O segundo resíduo" });
        const invalid = [mResult, nResult, aResult, bResult].find((result) => !result.ok);
        if (invalid && !invalid.ok) {
          setFeedback(root, invalid.message, "warning");
          return null;
        }
        if (!mResult.ok || !nResult.ok || !aResult.ok || !bResult.ok) return null;
        const m = mResult.value;
        const n = nResult.value;
        const a = mod(aResult.value, m);
        const b = mod(bResult.value, n);
        return { a, m, b, n };
      };
      const configureRange = () => {
        const values = read();
        if (!values) return;
        const { m, n } = values;
        const slider = q(root, "[data-x]");
        const maximum = Number(2n * m * n - 1n);
        slider.max = String(maximum);
        if (Number(slider.value) > maximum) slider.value = "0";
        updateClocks();
      };
      const updateClocks = () => {
        const values = read();
        if (!values) return;
        const { a, m, b, n } = values;
        const xResult = parseInteger(q(root, "[data-x]").value, { min: 0n, label: "x" });
        if (!xResult.ok) {
          setFeedback(root, xResult.message, "warning");
          return;
        }
        const x = xResult.value;
        const left = mod(x, m);
        const right = mod(x, n);
        const leftOk = left === a;
        const rightOk = right === b;
        q(root, "[data-x-output]").textContent = x.toString();
        q(root, "[data-clocks]").innerHTML = `
          <span class="lab-clock ${leftOk ? "is-match" : ""}">Relógio mod ${m}: ${left} ${leftOk ? "✓" : `≠ ${a}`}</span>
          <span class="lab-clock ${rightOk ? "is-match" : ""}">Relógio mod ${n}: ${right} ${rightOk ? "✓" : `≠ ${b}`}</span>`;
        setFeedback(root, leftOk && rightOk ? `x=${x} satisfaz as duas congruências.` : "Mova x até os dois relógios exibirem ✓.", leftOk && rightOk ? "success" : "info");
      };
      q(root, "[data-solve]").addEventListener("click", () => {
        const values = read();
        if (!values) return;
        const { a, m, b, n } = values;
        if (gcd(m, n) !== 1n) {
          setOutput(root, "");
          setFeedback(root, `mdc(${m},${n})=${gcd(m, n)}. Este construtor exige módulos coprimos.`, "warning");
          return;
        }
        const solution = crtPair(a, m, b, n);
        q(root, "[data-x]").value = solution.value.toString();
        setOutput(root, `<ol class="lab-steps">
          <li>Escreva x=${a}+${m}t.</li>
          <li>Como ${m}⁻¹ mod ${n}=${solution.inverse}, temos t=(${b}−${a})·${solution.inverse} mod ${n}=${solution.multiplier}.</li>
          <li>x=${a}+${m}·${solution.multiplier}=<strong>${solution.value}</strong> módulo ${solution.modulus}.</li>
        </ol>`);
        updateClocks();
      });
      q(root, "[data-x]").addEventListener("input", updateClocks);
      qa(root, "[data-a], [data-b], [data-m], [data-n]").forEach((input) => input.addEventListener("change", configureRange));
      q(root, "[data-reset]").addEventListener("click", () => {
        q(root, "[data-a]").value = "2";
        q(root, "[data-m]").value = "3";
        q(root, "[data-b]").value = "4";
        q(root, "[data-n]").value = "5";
        q(root, "[data-x]").value = "0";
        setOutput(root, "");
        configureRange();
        setFeedback(root, "Laboratório reiniciado.");
      });
      configureRange();
    })
  });
