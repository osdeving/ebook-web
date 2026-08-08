import { choose, formatInteger, permutation } from "../shared/math";
import { defineLab, node, readInteger, table } from "../shared/lab-runtime";

function power(base: number, exponent: number): bigint {
  return BigInt(base) ** BigInt(exponent);
}

export const countingWorkbenchLab = defineLab({
  id: "lab-5-1-bancada-contagem",
  anchor: "sec-5-1",
  title: "Bancada de contagem: ordem, reposição e binômio",
  duration: "Seção 5.1 · 10–15 min",
  tags: ["section:5.1", "contagem", "combinacoes", "binomio"],
  html: [
    '<p class="lab-intro">Mude uma hipótese de cada vez e veja por que “escolher” não determina uma fórmula: ordem e reposição fazem parte do modelo. A tabela final mostra a mesma combinação dentro do triângulo de Pascal.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Modelo<select data-mode><option value="arrange" selected>Ordenar r entre n</option><option value="choose">Escolher r entre n</option><option value="repeat">Sequência de r, com reposição</option><option value="multiset">Multiconjunto de r tipos entre n</option></select></label>',
    '<label>Número de tipos n<input data-n type="number" min="1" max="200" value="10" inputmode="numeric"></label>',
    '<label>Número de posições r<input data-r type="number" min="0" max="50" value="3" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Contar</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Resultado da contagem"></div>',
    '<p class="lab-note">Experimente manter n e r fixos e percorrer os quatro modelos. A diferença não é notacional: ela registra quais resultados o experimento considera distintos.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const mode = tools.q<HTMLSelectElement>("[data-mode]");
    const nInput = tools.q<HTMLInputElement>("[data-n]");
    const rInput = tools.q<HTMLInputElement>("[data-r]");

    const run = (report = true) => {
      const nRead = readInteger(nInput, "n", { min: 1, max: 200 });
      const rRead = readInteger(rInput, "r", { min: 0, max: 50 });
      if (!nRead.ok || !rRead.ok) {
        if (report) tools.feedback(!nRead.ok ? nRead.message : rRead.ok ? "" : rRead.message, "error");
        return;
      }
      const n = nRead.value;
      const r = rRead.value;
      let value = 0n;
      let formula = "";
      let interpretation = "";
      if (mode.value === "arrange") {
        if (r > n) {
          if (report) tools.feedback("Sem reposição, r não pode exceder n.", "error");
          return;
        }
        value = permutation(n, r);
        formula = "\\(P(n,r)=n!/(n-r)!\\)";
        interpretation = "A ordem distingue resultados e nenhum tipo se repete.";
      } else if (mode.value === "choose") {
        if (r > n) {
          if (report) tools.feedback("Ao escolher sem reposição, r não pode exceder n.", "error");
          return;
        }
        value = choose(n, r);
        formula = "\\(\\binom nr=n!/[r!(n-r)!]\\)";
        interpretation = "A ordem foi esquecida e não há repetição.";
      } else if (mode.value === "repeat") {
        value = power(n, r);
        formula = "\\(n^r\\)";
        interpretation = "Cada uma das r posições recebe independentemente um dos n tipos.";
      } else {
        value = choose(n + r - 1, r);
        formula = "\\(\\binom{n+r-1}{r}\\)";
        interpretation = "Só as multiplicidades importam; estrelas e barras codifica o resultado.";
      }
      const rows: string[][] = [];
      const pascalN = Math.min(n, 12);
      for (let j = 0; j <= pascalN; j += 1) {
        rows.push([String(j), formatInteger(choose(pascalN, j))]);
      }
      tools.output(
        node("p", formula + " = " + formatInteger(value)),
        node("p", interpretation),
        table("Linha n = " + pascalN + " do triângulo de Pascal", ["j", "C(n,j)"], rows),
      );
      if (report) tools.feedback("Hipóteses aplicadas e contagem recalculada.", "success");
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
