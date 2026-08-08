import { seededRandom } from "../shared/math";
import { defineLab, node, readInteger, table } from "../shared/lab-runtime";

function numbers(value: string): number[] {
  return value.split(/[;,\s]+/).filter(Boolean).map(Number);
}

export const expectationSimulatorLab = defineLab({
  id: "lab-5-3-esperanca-em-acao",
  anchor: "sec-5-3-5",
  title: "Esperança em ação: média teórica e trajetória aleatória",
  duration: "Seções 5.3.4–5.3.5 · 10–15 min",
  tags: ["section:5.3", "variavel-aleatoria", "esperanca", "simulacao"],
  html: [
    '<p class="lab-intro">Defina uma variável aleatória discreta. O laboratório normaliza os pesos, separa a contribuição de cada valor e acompanha a média amostral em vários instantes.</p>',
    '<form data-form><div class="lab-controls lab-controls--stacked">',
    '<label>Valores de X, separados por vírgula<input data-values value="-1, 4"></label>',
    '<label>Pesos ou probabilidades correspondentes<input data-probabilities value="0.790527, 0.209473"></label>',
    '</div><div class="lab-controls">',
    '<label>Número de repetições<input data-trials type="number" min="10" max="200000" value="10000"></label>',
    '<label>Semente<input data-seed type="number" min="0" max="4294967295" value="34"></label>',
    '</div><div class="lab-actions"><button type="submit">Calcular e simular</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Valor esperado e médias simuladas"></div>',
    '<p class="lab-note">Valor esperado não é promessa de um resultado individual. Ele descreve a média ponderada do modelo e emerge empiricamente apenas em muitas repetições sob hipóteses estáveis.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const valuesInput = tools.q<HTMLInputElement>("[data-values]");
    const probabilitiesInput = tools.q<HTMLInputElement>("[data-probabilities]");
    const trialsInput = tools.q<HTMLInputElement>("[data-trials]");
    const seedInput = tools.q<HTMLInputElement>("[data-seed]");

    const run = (report = true) => {
      const values = numbers(valuesInput.value);
      const weights = numbers(probabilitiesInput.value);
      const trials = readInteger(trialsInput, "Repetições", { min: 10, max: 200000 });
      const seed = readInteger(seedInput, "Semente", { min: 0, max: 4294967295 });
      if (values.length === 0 || values.length !== weights.length || values.some((value) => !Number.isFinite(value))) {
        if (report) tools.feedback("Forneça listas numéricas não vazias com o mesmo comprimento.", "error");
        return;
      }
      if (weights.some((value) => !Number.isFinite(value) || value < 0)) {
        if (report) tools.feedback("Os pesos precisam ser números não negativos.", "error");
        return;
      }
      if (!trials.ok || !seed.ok) {
        if (report) tools.feedback(!trials.ok ? trials.message : seed.ok ? "" : seed.message, "error");
        return;
      }
      const total = weights.reduce((sum, value) => sum + value, 0);
      if (total <= 0) {
        if (report) tools.feedback("Ao menos um peso precisa ser positivo.", "error");
        return;
      }
      const probabilities = weights.map((value) => value / total);
      const expected = values.reduce((sum, value, index) => sum + value * probabilities[index]!, 0);
      const cumulative: number[] = [];
      probabilities.reduce((sum, probability, index) => {
        cumulative[index] = sum + probability;
        return cumulative[index]!;
      }, 0);
      const random = seededRandom(seed.value);
      const checkpoints = new Set([10, 100, 1000, 10000, trials.value].filter((value) => value <= trials.value));
      const path: string[][] = [];
      let sum = 0;
      const observed = new Array(values.length).fill(0) as number[];
      for (let count = 1; count <= trials.value; count += 1) {
        const draw = random();
        let index = cumulative.findIndex((limit) => draw < limit);
        if (index < 0) index = cumulative.length - 1;
        observed[index] = (observed[index] ?? 0) + 1;
        sum += values[index]!;
        if (checkpoints.has(count)) path.push([String(count), (sum / count).toFixed(6), (sum / count - expected).toFixed(6)]);
      }
      tools.output(
        node("p", "\\(E(X)=\\sum_x x\\Pr(X=x)\\) = " + expected.toFixed(6) + "."),
        table("Contribuições à esperança", ["x", "probabilidade", "x · p", "frequência observada"], values.map((value, index) => [
          String(value),
          probabilities[index]!.toFixed(6),
          (value * probabilities[index]!).toFixed(6),
          observed[index] + " / " + trials.value,
        ])),
        table("Convergência da média amostral", ["repetições", "média", "erro frente a E(X)"], path),
      );
      if (report) {
        tools.feedback(
          Math.abs(total - 1) > 1e-9
            ? "Pesos normalizados para soma 1; simulação concluída."
            : "Distribuição e trajetória simuladas.",
          Math.abs(total - 1) > 1e-9 ? "warning" : "success",
        );
      }
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
