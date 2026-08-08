import { defineLab, node, readInteger, table } from "../shared/lab-runtime";

function scientificFromLog(log10: number): string {
  if (log10 < 15) return Math.round(10 ** log10).toLocaleString("pt-BR");
  const exponent = Math.floor(log10);
  const mantissa = 10 ** (log10 - exponent);
  return mantissa.toFixed(3) + " × 10^" + exponent;
}

function duration(logSeconds: number): string {
  if (logSeconds < -3) return (10 ** (logSeconds + 6)).toFixed(3) + " μs";
  if (logSeconds < 0) return (10 ** (logSeconds + 3)).toFixed(3) + " ms";
  if (logSeconds < Math.log10(60)) return (10 ** logSeconds).toFixed(3) + " s";
  if (logSeconds < Math.log10(3600)) return (10 ** logSeconds / 60).toFixed(3) + " min";
  if (logSeconds < Math.log10(31557600)) return (10 ** logSeconds / 3600).toFixed(3) + " h";
  const logYears = logSeconds - Math.log10(31557600);
  return scientificFromLog(logYears) + " anos";
}

export const complexityGrowthLab = defineLab({
  id: "lab-5-7-escala-complexidade",
  anchor: "sec-5-7",
  title: "Lupa de complexidade: bits, operações e eras",
  duration: "Seção 5.7 · 10–15 min",
  tags: ["section:5.7", "complexidade", "p", "np", "tamanho-de-entrada"],
  html: [
    '<p class="lab-intro">Compare custos em função do comprimento binário n, não do valor do inteiro. Um certificado rapidamente verificável não fornece, por si só, um algoritmo rápido para encontrá-lo.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Tamanho da entrada n (bits)<input data-bits type="number" min="1" max="1024" value="128"></label>',
    '<label>Operações por segundo<input data-rate type="number" min="1" max="1000000000000000000" value="1000000000"></label>',
    '</div><div class="lab-actions"><button type="submit">Comparar crescimentos</button><button type="button" data-64>64 bits</button><button type="button" data-128>128 bits</button><button type="button" data-256>256 bits</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Comparação de ordens de complexidade"></div>',
    '<p class="lab-note">A tabela compara formas de crescimento abstratas. Constantes, memória, paralelismo e estrutura do problema importam na prática; P versus NP pergunta pela existência de algoritmos polinomiais no pior caso.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const bitsInput = tools.q<HTMLInputElement>("[data-bits]");
    const rateInput = tools.q<HTMLInputElement>("[data-rate]");

    const run = (report = true) => {
      const bits = readInteger(bitsInput, "n", { min: 1, max: 1024 });
      const rate = rateInput.value.trim() === "" ? Number.NaN : Number(rateInput.value);
      if (!bits.ok) {
        if (report) tools.feedback(bits.message, "error");
        return;
      }
      if (!Number.isFinite(rate) || rate < 1 || rate > 1e18) {
        if (report) tools.feedback("A taxa precisa estar entre 1 e 10^18 operações por segundo.", "error");
        return;
      }
      const n = bits.value;
      const logRate = Math.log10(rate);
      const costs = [
        { label: "linear n", log: Math.log10(n), role: "leitura da entrada" },
        { label: "quadrático n²", log: 2 * Math.log10(n), role: "comparar todos os pares" },
        { label: "cúbico n³", log: 3 * Math.log10(n), role: "exemplo de verificação polinomial" },
        { label: "raiz do espaço 2^(n/2)", log: n * Math.log10(2) / 2, role: "colisão ou busca tipo birthday" },
        { label: "exaustivo 2^n", log: n * Math.log10(2), role: "enumerar todos os candidatos binários" },
      ];
      const represented = n * Math.log10(2);
      tools.output(
        node("p", "Uma entrada de " + n + " bits pode representar cerca de " + scientificFromLog(represented) + " valores distintos."),
        table("Custo idealizado à taxa informada", ["crescimento", "operações", "tempo", "leitura"], costs.map((cost) => [
          cost.label,
          scientificFromLog(cost.log),
          duration(cost.log - logRate),
          cost.role,
        ])),
        node("p", "\\(n^3\\) permanece polinomial; \\(2^n\\) dobra a cada bit adicional. A pergunta P = NP não é resolvida por esta visualização."),
      );
      if (report) tools.feedback("Escalas recalculadas para " + n + " bits.", "success");
    };

    const setBits = (value: string) => {
      bitsInput.value = value;
      run();
    };
    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-64]"), "click", (() => setBits("64")) as EventListener);
    tools.on(tools.q("[data-128]"), "click", (() => setBits("128")) as EventListener);
    tools.on(tools.q("[data-256]"), "click", (() => setBits("256")) as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      tools.reset(form);
      run(false);
    }) as EventListener);
    run(false);
  },
});
