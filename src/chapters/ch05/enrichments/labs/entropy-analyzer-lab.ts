import { defineLab, node, readInteger, table } from "../shared/lab-runtime";

function normalize(value: string): string[] {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()
    .split(/[^a-z]+/).filter(Boolean);
}

export const entropyAnalyzerLab = defineLab({
  id: "lab-5-6-entropia-ngramas",
  anchor: "sec-5-6-2",
  title: "Lupa de entropia: surpresa, n-gramas e redundância",
  duration: "Seções 5.6.2–5.6.3 · 12–18 min",
  tags: ["section:5.6", "entropia", "redundancia", "ngramas"],
  html: [
    '<p class="lab-intro">Cole um texto e transforme frequências em informação. Compare letras e n-gramas, observe a contribuição \\(-p\\log_2p\\) de cada símbolo e escolha se espaços podem ou não ser atravessados.</p>',
    '<form data-form><div class="lab-controls lab-controls--stacked">',
    '<label>Corpus<textarea data-text rows="7">TO BE OR NOT TO BE THAT IS THE QUESTION WHETHER TIS NOBLER IN THE MIND TO SUFFER</textarea></label>',
    '</div><div class="lab-controls">',
    '<label>Tamanho n<input data-n type="number" min="1" max="5" value="1"></label>',
    '<label><span>Atravessar fronteiras de palavras</span><input data-cross type="checkbox"></label>',
    '</div><div class="lab-actions"><button type="submit">Medir entropia</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Análise de entropia do texto"></div>',
    '<p class="lab-note">A estimativa é empírica e enviesada em amostras pequenas. Entropia de n-gramas por letra não é uma constante universal do idioma: depende do corpus e da normalização.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const textInput = tools.q<HTMLTextAreaElement>("[data-text]");
    const nInput = tools.q<HTMLInputElement>("[data-n]");
    const crossInput = tools.q<HTMLInputElement>("[data-cross]");

    const run = (report = true) => {
      const nRead = readInteger(nInput, "n", { min: 1, max: 5 });
      if (!nRead.ok) {
        if (report) tools.feedback(nRead.message, "error");
        return;
      }
      const words = normalize(textInput.value);
      const sources = crossInput.checked ? [words.join("")] : words;
      const counts = new Map<string, number>();
      let total = 0;
      sources.forEach((source) => {
        for (let index = 0; index + nRead.value <= source.length; index += 1) {
          const gram = source.slice(index, index + nRead.value);
          counts.set(gram, (counts.get(gram) ?? 0) + 1);
          total += 1;
        }
      });
      if (total === 0) {
        if (report) tools.feedback("O corpus não contém amostras longas o bastante para esse n.", "error");
        return;
      }
      const rows = [...counts].map(([gram, count]) => {
        const probability = count / total;
        return {
          gram,
          count,
          probability,
          contribution: -probability * Math.log2(probability),
        };
      }).sort((left, right) => right.count - left.count || left.gram.localeCompare(right.gram));
      const entropy = rows.reduce((sum, row) => sum + row.contribution, 0);
      const maximumPerGram = nRead.value * Math.log2(26);
      const redundancy = 1 - entropy / maximumPerGram;
      tools.output(
        node("p", "\\(H=-\\sum_g p_g\\log_2p_g\\) = " + entropy.toFixed(6) + " bits por n-grama."),
        node("p", "Por letra: " + (entropy / nRead.value).toFixed(6) + " bits; redundância frente ao alfabeto uniforme: " + (100 * redundancy).toFixed(2) + "%."),
        node("p", total + " ocorrências, " + rows.length + " n-gramas distintos."),
        table("N-gramas mais frequentes", ["n-grama", "contagem", "p", "−p log₂ p"], rows.slice(0, 20).map((row) => [
          row.gram,
          String(row.count),
          row.probability.toFixed(6),
          row.contribution.toFixed(6),
        ])),
      );
      if (report) tools.feedback("Distribuição empírica recalculada localmente.", "success");
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
