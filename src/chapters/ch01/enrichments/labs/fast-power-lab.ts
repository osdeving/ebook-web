import { fastPowerTrace } from "./math.mts";
import { defineLab, makeTable, readInteger } from "./runtime.mts";

export const fastPowerLab = defineLab({
  id: "lab-1-3-2-exponenciacao-rapida",
  anchor: "algorithm-1-fast-powering",
  title: "Quadrar, escolher, multiplicar",
  duration: "Seção 1.3.2 · 10–14 min",
  tags: ["section:1.3.2", "exponenciacao-rapida", "algoritmo", "binario"],
  html: `
    <p class="lab-intro">Escreva \(g^A\bmod N\) e revele um bit do expoente por vez. Cada linha mostra a potência obtida por quadratura e decide, pelo bit, se ela entra no acumulador.</p>
    <form data-form>
      <div class="lab-controls">
        <label>Base \(g\)
          <input type="number" min="-1000000000" max="1000000000" step="1" value="3" data-base>
        </label>
        <label>Expoente \(A\)
          <input type="number" min="0" max="1000000000" step="1" value="218" data-exponent>
        </label>
        <label>Módulo \(N\)
          <input type="number" min="2" max="1000000000" step="1" value="1000" data-modulus>
        </label>
      </div>
      <div class="lab-actions">
        <button type="submit">Preparar bits</button>
        <button type="button" data-next>Processar próximo bit</button>
        <button type="button" data-finish>Executar tudo</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
    </form>
    <p class="lab-bit-string" data-binary></p>
    <div data-table></div>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Interpretação: dobrar o tamanho do expoente acrescenta aproximadamente um bit — e, portanto, apenas uma nova quadratura e talvez uma multiplicação. É por isso que expoentes enormes continuam tratáveis.</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const baseInput = tools.q<HTMLInputElement>("[data-base]");
    const exponentInput = tools.q<HTMLInputElement>("[data-exponent]");
    const modulusInput = tools.q<HTMLInputElement>("[data-modulus]");
    const binary = tools.q<HTMLElement>("[data-binary]");
    const tableHost = tools.q<HTMLElement>("[data-table]");
    let base = 3n;
    let exponent = 218n;
    let modulus = 1000n;
    let trace = fastPowerTrace(base, exponent, modulus);
    let visible = 0;

    const render = () => {
      const bits = exponent.toString(2);
      binary.textContent = `Expansão binária: ${exponent} = (${bits})₂. A leitura algorítmica abaixo começa pelo bit menos significativo, à direita.`;
      const rows = trace.slice(0, visible).map((step) => [
        String(step.bitIndex),
        String(step.bit),
        String(step.factorBefore),
        String(step.accumulatorBefore),
        step.bit === 1 ? `${step.accumulatorBefore}·${step.factorBefore} mod ${modulus}` : "bit 0: não multiplicar",
        String(step.accumulatorAfter),
      ]);
      tableHost.replaceChildren(makeTable(
        "Quadraturas sucessivas e acumulação",
        ["i", "bit Aᵢ", "g^(2ⁱ) mod N", "acumulador antes", "decisão", "depois"],
        rows,
      ));
      if (visible === trace.length) {
        const result = trace.at(-1)?.accumulatorAfter ?? 1n % modulus;
        const popcount = [...bits].filter((bit) => bit === "1").length;
        const optimizedMultiplications = Math.max(bits.length - 1, 0) + Math.max(popcount - 1, 0);
        const naive = exponent > 0n ? exponent - 1n : 0n;
        tools.outputMath(
          `Resultado: \\(${base}^{${exponent}}\\equiv${result}\\pmod{${modulus}}\\). `
          + `Organizando as potências como no capítulo, são ${Math.max(bits.length - 1, 0)} quadraturas e ${Math.max(popcount - 1, 0)} multiplicações entre fatores: ${optimizedMultiplications} no total, contra ${naive} multiplicações da repetição ingênua.`,
        );
      } else {
        tools.outputText(trace.length === 0
          ? `Expoente zero: por convenção, o resultado é 1 módulo ${modulus}.`
          : `${trace.length - visible} bit(s) ainda não processado(s).`);
      }
    };

    const prepare = () => {
      const baseResult = readInteger(baseInput, "A base", { min: -1_000_000_000n, max: 1_000_000_000n });
      const exponentResult = readInteger(exponentInput, "O expoente", { min: 0n, max: 1_000_000_000n });
      const modulusResult = readInteger(modulusInput, "O módulo", { min: 2n, max: 1_000_000_000n });
      const invalid = [baseResult, exponentResult, modulusResult].find((result) => !result.ok);
      if (invalid && !invalid.ok) {
        tools.feedback(invalid.message, "warning");
        return false;
      }
      if (!baseResult.ok || !exponentResult.ok || !modulusResult.ok) return false;
      base = baseResult.value;
      exponent = exponentResult.value;
      modulus = modulusResult.value;
      trace = fastPowerTrace(base, exponent, modulus);
      visible = 0;
      render();
      tools.feedback(`Preparados ${trace.length} bit(s). Revele a execução passo a passo.`, "success");
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
        tools.feedback(visible === trace.length ? "Último bit processado; resultado conferido." : `Bit ${visible - 1} processado.`, visible === trace.length ? "success" : "info");
      } else {
        tools.feedback("Não há outros bits a processar.", "info");
      }
    });
    tools.on(tools.q("[data-finish]"), "click", () => {
      visible = trace.length;
      render();
      tools.feedback("Exponenciação rápida concluída.", "success");
    });
    tools.on(tools.q("[data-reset]"), "click", () => {
      baseInput.value = "3";
      exponentInput.value = "218";
      modulusInput.value = "1000";
      prepare();
      tools.feedback("Exemplo 1.18 restaurado.");
      baseInput.focus();
    });
    render();
  },
});
