import { extendedEuclidTrace, inverseMod } from "./math.mts";
import { defineLab, makeElement, makeTable, readInteger } from "./runtime.mts";

export const extendedEuclidLab = defineLab({
  id: "lab-1-2-euclides-estendido",
  anchor: "example-1-10",
  title: "Euclides estendido, linha por linha",
  duration: "Seção 1.2 · 10–15 min",
  tags: ["section:1.2", "mdc", "bezout", "inverso-modular"],
  html: `
    <p class="lab-intro">Cada resto carrega um certificado: \(r_i=x_i a+y_i b\). Avance uma divisão por vez para ver o mdc e os coeficientes de Bézout nascerem juntos; se o mdc for 1, transforme o certificado em um inverso modular.</p>
    <form data-form>
      <div class="lab-controls">
        <label>Inteiro \(a\)
          <input type="number" min="1" max="1000000000" step="1" value="252" data-a>
        </label>
        <label>Inteiro \(b\)
          <input type="number" min="1" max="1000000000" step="1" value="198" data-b>
        </label>
      </div>
      <div class="lab-actions">
        <button type="submit">Preparar algoritmo</button>
        <button type="button" data-next>Próxima divisão</button>
        <button type="button" data-finish>Mostrar todas</button>
        <button type="button" data-inverse>Interpretar como inverso</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
    </form>
    <div data-table></div>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Interpretação: o algoritmo não “adivinha” os coeficientes. Eles sofrem as mesmas subtrações que os restos, preservando a identidade de Bézout em cada linha.</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const aInput = tools.q<HTMLInputElement>("[data-a]");
    const bInput = tools.q<HTMLInputElement>("[data-b]");
    const tableHost = tools.q<HTMLElement>("[data-table]");
    let trace = extendedEuclidTrace(252n, 198n);
    let visible = 2;
    let a = 252n;
    let b = 198n;

    const render = () => {
      const shown = trace.slice(0, visible);
      const table = makeTable(
        "Restos e coeficientes de Bézout",
        ["i", "Divisão", "rᵢ", "xᵢ", "yᵢ", "Certificado"],
        shown.map((row) => [
          String(row.index),
          row.division,
          String(row.remainder),
          String(row.x),
          String(row.y),
          `${row.remainder} = (${row.x})·${a} + (${row.y})·${b}`,
        ]),
      );
      tableHost.replaceChildren(table);
      const complete = visible >= trace.length;
      if (complete) {
        const bezout = trace.at(-2);
        if (bezout) {
          tools.outputMath(
            `Conclusão: \\(\\gcd(${a},${b})=${bezout.remainder}\\) e \\(${bezout.remainder}=(${bezout.x})\\cdot${a}+(${bezout.y})\\cdot${b}\\).`,
          );
        }
      } else {
        tools.outputText(`Próxima etapa disponível: ${trace[visible]?.division ?? "encerrar o algoritmo"}.`);
      }
    };

    const prepare = () => {
      const aResult = readInteger(aInput, "a", { min: 1n, max: 1_000_000_000n });
      const bResult = readInteger(bInput, "b", { min: 1n, max: 1_000_000_000n });
      if (!aResult.ok || !bResult.ok) {
        tools.feedback(!aResult.ok ? aResult.message : !bResult.ok ? bResult.message : "Entrada inválida.", "warning");
        return false;
      }
      a = aResult.value;
      b = bResult.value;
      trace = extendedEuclidTrace(a, b);
      visible = Math.min(2, trace.length);
      render();
      tools.feedback("Algoritmo preparado. Avance pelas divisões usando o botão ou a tecla Enter sobre ele.", "success");
      return true;
    };

    tools.on(form, "submit", (event) => {
      event.preventDefault();
      prepare();
    });
    tools.on(tools.q("[data-next]"), "click", () => {
      if (visible < trace.length) {
        visible += 1;
        render();
        tools.feedback(
          visible === trace.length ? "O resto zero encerrou o algoritmo; a linha anterior contém o mdc." : `Linha ${visible - 1} revelada.`,
          visible === trace.length ? "success" : "info",
        );
      } else {
        tools.feedback("Todas as divisões já estão visíveis.", "info");
      }
    });
    tools.on(tools.q("[data-finish]"), "click", () => {
      visible = trace.length;
      render();
      tools.feedback("Cálculo completo exibido.", "success");
    });
    tools.on(tools.q("[data-inverse]"), "click", () => {
      visible = trace.length;
      render();
      const inverse = inverseMod(a, b);
      if (inverse === null) {
        tools.feedback(`Como mdc(${a}, ${b}) não é 1, a não possui inverso módulo b.`, "warning");
        return;
      }
      const note = makeElement("p", `Leitura modular: a·(${inverse}) ≡ 1 (mod b). Assim, ${inverse} é o representante entre 0 e ${b - 1n} do inverso de ${a} módulo ${b}.`);
      tools.q<HTMLElement>("[data-output]").append(note);
      tools.feedback(`Inverso modular encontrado: ${inverse}.`, "success");
    });
    tools.on(tools.q("[data-reset]"), "click", () => {
      aInput.value = "252";
      bInput.value = "198";
      prepare();
      tools.feedback("Exemplo 252 e 198 restaurado.");
      aInput.focus();
    });
    render();
  },
});
