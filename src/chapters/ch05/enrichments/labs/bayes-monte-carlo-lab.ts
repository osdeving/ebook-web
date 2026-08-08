import { seededRandom } from "../shared/math";
import { defineLab, node, readInteger, table } from "../shared/lab-runtime";

function readRate(input: HTMLInputElement, label: string): { ok: true; value: number } | { ok: false; message: string } {
  if (input.value.trim() === "") return { ok: false, message: label + " precisa ser preenchida." };
  const value = Number(input.value);
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    return { ok: false, message: label + " precisa estar entre 0 e 100%." };
  }
  return { ok: true, value: value / 100 };
}

export const bayesMonteCarloLab = defineLab({
  id: "lab-5-3-bayes-monte-carlo",
  anchor: "sec-5-3-2",
  title: "Atualizador de Bayes: do teste positivo à causa provável",
  duration: "Seções 5.3.2–5.3.3 · 12–18 min",
  tags: ["section:5.3", "bayes", "monte-carlo", "condicional"],
  html: [
    '<p class="lab-intro">Um teste pode ser muito sensível e ainda produzir maioria de falsos positivos quando a condição é rara. Compare o cálculo exato com uma população sintética reprodutível.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Prevalência (%)<input data-prior type="number" min="0" max="100" step="0.01" value="1"></label>',
    '<label>Sensibilidade (%)<input data-sensitivity type="number" min="0" max="100" step="0.01" value="95"></label>',
    '<label>Especificidade (%)<input data-specificity type="number" min="0" max="100" step="0.01" value="90"></label>',
    '<label>População simulada<input data-size type="number" min="100" max="100000" step="100" value="10000"></label>',
    '<label>Semente<input data-seed type="number" min="0" max="4294967295" value="2025"></label>',
    '</div><div class="lab-actions"><button type="submit">Atualizar e simular</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Posterior de Bayes e simulação"></div>',
    '<p class="lab-note">A simulação serve como verificação do modelo, não como substituta da fórmula. Mudar a prevalência altera o posterior mesmo quando o instrumento permanece idêntico.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const priorInput = tools.q<HTMLInputElement>("[data-prior]");
    const sensitivityInput = tools.q<HTMLInputElement>("[data-sensitivity]");
    const specificityInput = tools.q<HTMLInputElement>("[data-specificity]");
    const sizeInput = tools.q<HTMLInputElement>("[data-size]");
    const seedInput = tools.q<HTMLInputElement>("[data-seed]");

    const run = (report = true) => {
      const prior = readRate(priorInput, "Prevalência");
      const sensitivity = readRate(sensitivityInput, "Sensibilidade");
      const specificity = readRate(specificityInput, "Especificidade");
      const size = readInteger(sizeInput, "População", { min: 100, max: 100000 });
      const seed = readInteger(seedInput, "Semente", { min: 0, max: 4294967295 });
      const invalid = [prior, sensitivity, specificity, size, seed].find((item) => !item.ok);
      if (invalid && !invalid.ok) {
        if (report) tools.feedback(invalid.message, "error");
        return;
      }
      if (!prior.ok || !sensitivity.ok || !specificity.ok || !size.ok || !seed.ok) return;
      const falsePositiveRate = 1 - specificity.value;
      const positiveRate = sensitivity.value * prior.value + falsePositiveRate * (1 - prior.value);
      const posterior = positiveRate === 0 ? Number.NaN : sensitivity.value * prior.value / positiveRate;
      const random = seededRandom(seed.value);
      let truePositive = 0;
      let falsePositive = 0;
      let trueNegative = 0;
      let falseNegative = 0;
      for (let index = 0; index < size.value; index += 1) {
        const condition = random() < prior.value;
        const positive = condition ? random() < sensitivity.value : random() < falsePositiveRate;
        if (condition && positive) truePositive += 1;
        else if (condition) falseNegative += 1;
        else if (positive) falsePositive += 1;
        else trueNegative += 1;
      }
      const simulatedPosterior = truePositive + falsePositive === 0
        ? Number.NaN
        : truePositive / (truePositive + falsePositive);
      const exact = Number.isNaN(posterior) ? "indefinido (nenhum positivo possível)" : (100 * posterior).toFixed(3) + "%";
      const simulated = Number.isNaN(simulatedPosterior) ? "indefinido" : (100 * simulatedPosterior).toFixed(3) + "%";
      tools.output(
        node("p", "\\(\\Pr(A\\mid +)=\\frac{\\Pr(+\\mid A)\\Pr(A)}{\\Pr(+)}\\) = " + exact + "."),
        node("p", "Estimativa Monte Carlo entre os positivos: " + simulated + "."),
        table("Matriz observada na simulação", ["estado", "teste positivo", "teste negativo"], [
          ["condição presente", String(truePositive), String(falseNegative)],
          ["condição ausente", String(falsePositive), String(trueNegative)],
        ]),
      );
      if (report) tools.feedback("Posterior exato e amostra reprodutível calculados.", "success");
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      tools.reset(form);
      run(false);
    }) as EventListener);
    run(false);
  },
});
