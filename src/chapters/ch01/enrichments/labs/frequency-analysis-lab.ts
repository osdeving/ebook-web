import { letterCounts, rankCaesarShifts, shiftText } from "./classical.mts";
import { defineLab, makeElement, makeTable } from "./runtime.mts";

const DEMO_PLAINTEXT = "THE BEST CRYPTANALYST TESTS A PATTERN BEFORE TRUSTING A GUESS. LETTER FREQUENCIES HELP, BUT CONTEXT DECIDES.";
const DEMO_CIPHERTEXT = shiftText(DEMO_PLAINTEXT, 7);

export const frequencyAnalysisLab = defineLab({
  id: "lab-1-1-1-detetive-frequencias",
  anchor: "tab-1-3",
  title: "Detetive de frequências",
  duration: "Seção 1.1.1 · 10–15 min",
  tags: ["section:1.1.1", "criptoanalise", "frequencia", "qui-quadrado"],
  html: `
    <p class="lab-intro">Cole um texto cifrado por deslocamento ou use o caso preparado. O analisador conta letras, compara cada uma das 26 rotações ao perfil em inglês da Tabela 1.3 e ordena hipóteses. A melhor pontuação é uma pista estatística, não uma prova.</p>
    <form data-form>
      <label class="lab-text-label">Texto cifrado
        <textarea rows="5" data-ciphertext spellcheck="false">${DEMO_CIPHERTEXT}</textarea>
      </label>
      <div class="lab-actions">
        <button type="submit">Contar e classificar</button>
        <button type="button" class="secondary" data-reset>Reiniciar caso</button>
      </div>
    </form>
    <div class="lab-frequency-chart" data-chart role="img" aria-label="Contagem de letras; execute a análise para preencher o gráfico"></div>
    <div data-candidates></div>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Interpretação: textos curtos, nomes próprios e linguagem incomum desviam do perfil esperado. Uma análise responsável combina frequência, padrões repetidos e sentido linguístico.</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const ciphertext = tools.q<HTMLTextAreaElement>("[data-ciphertext]");
    const chart = tools.q<HTMLElement>("[data-chart]");
    const candidates = tools.q<HTMLElement>("[data-candidates]");
    let ranked = rankCaesarShifts(ciphertext.value);

    const showCandidate = (shift: number) => {
      const candidate = ranked.find((item) => item.shift === shift);
      if (!candidate) return;
      const heading = makeElement("p", `Hipótese: a cifração avançou ${shift} posição(ões).`);
      const plain = makeElement("pre", candidate.plaintext, "lab-cipher-output");
      plain.setAttribute("aria-label", `Texto decifrado candidato: ${candidate.plaintext}`);
      tools.outputNodes(heading, plain);
      tools.feedback(`Hipótese de chave ${shift} aplicada. Leia o resultado: a estatística precisa do seu julgamento.`, "info");
    };

    const analyze = () => {
      const counts = letterCounts(ciphertext.value);
      const total = counts.reduce((sum, count) => sum + count, 0);
      if (total < 8) {
        chart.replaceChildren();
        candidates.replaceChildren();
        tools.clearOutput();
        tools.feedback("Forneça ao menos oito letras. Com muito pouco texto, o ranking não é informativo.", "warning");
        return;
      }
      const maximum = Math.max(...counts, 1);
      chart.replaceChildren(...counts.map((count, index) => {
        const column = makeElement("span", undefined, "lab-frequency-column");
        const bar = makeElement("span", undefined, "lab-frequency-bar");
        bar.style.height = `${Math.max(2, 100 * count / maximum)}%`;
        bar.title = `${String.fromCharCode(65 + index)}: ${count}`;
        const label = makeElement("small", String.fromCharCode(65 + index));
        column.append(bar, label);
        return column;
      }));
      chart.setAttribute(
        "aria-label",
        counts.map((count, index) => `${String.fromCharCode(65 + index)}: ${count}`).join(", "),
      );

      ranked = rankCaesarShifts(ciphertext.value);
      const top = ranked.slice(0, 5);
      const table = makeTable(
        "Cinco deslocamentos mais próximos do perfil esperado",
        ["Posição", "Chave", "Distância χ²", "Amostra"],
        top.map((candidate, index) => [
          String(index + 1),
          String(candidate.shift),
          candidate.score.toFixed(2),
          candidate.plaintext.slice(0, 42),
        ]),
      );
      const actions = makeElement("div", undefined, "lab-actions");
      top.forEach((candidate, index) => {
        const button = makeElement("button", `Testar chave ${candidate.shift}`);
        button.type = "button";
        button.dataset.candidateShift = String(candidate.shift);
        if (index > 0) button.classList.add("secondary");
        actions.append(button);
      });
      candidates.replaceChildren(table, actions);
      const first = top[0];
      if (first) showCandidate(first.shift);
      tools.feedback(
        total < 40
          ? `Foram contadas ${total} letras. O texto é curto; trate o ranking como uma pista fraca.`
          : `Foram contadas ${total} letras e 26 chaves. Compare as primeiras hipóteses antes de decidir.`,
        total < 40 ? "warning" : "success",
      );
    };

    tools.on(form, "submit", (event) => {
      event.preventDefault();
      analyze();
    });
    tools.on(candidates, "click", (event) => {
      const target = (event.target as Element).closest<HTMLButtonElement>("[data-candidate-shift]");
      if (target) showCandidate(Number(target.dataset.candidateShift));
    });
    tools.on(tools.q("[data-reset]"), "click", () => {
      ciphertext.value = DEMO_CIPHERTEXT;
      analyze();
      tools.feedback("Caso de demonstração restaurado. A chave correta está entre as hipóteses calculadas.");
      ciphertext.focus();
    });
    analyze();
  },
});
