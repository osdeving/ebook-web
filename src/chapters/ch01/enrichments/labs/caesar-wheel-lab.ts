import { ALPHABET, shiftText } from "./classical.mts";
import { defineLab, makeElement } from "./runtime.mts";

export const caesarWheelLab = defineLab({
  id: "lab-1-1-roda-cesar",
  anchor: "fig-1-1",
  title: "Gire a roda de César",
  duration: "Seção 1.1 · 6–10 min",
  tags: ["section:1.1", "cifra-de-cesar", "substituicao"],
  html: `
    <p class="lab-intro">A roda transforma uma regra verbal em uma função concreta. Mova a chave, observe cada correspondência e teste uma frase sua. Acentos são reduzidos à letra latina correspondente; espaços e pontuação são preservados.</p>
    <form data-form>
      <div class="lab-controls">
        <label>Operação
          <select data-mode aria-label="Escolher entre cifrar e decifrar">
            <option value="encrypt">Cifrar</option>
            <option value="decrypt">Decifrar</option>
          </select>
        </label>
        <label class="lab-range-label">Chave de deslocamento: <output data-shift-output>5</output>
          <input type="range" min="0" max="25" step="1" value="5" data-shift aria-label="Chave de deslocamento de zero a vinte e cinco">
        </label>
      </div>
      <label class="lab-text-label">Mensagem
        <textarea rows="3" data-message spellcheck="false">Enemy falling back.</textarea>
      </label>
      <div class="lab-actions">
        <button type="submit" data-run>Aplicar a roda</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
    </form>
    <div class="lab-alphabet" role="group" aria-label="Correspondências entre os alfabetos">
      <div><strong>Entrada</strong><span data-input-alphabet></span></div>
      <div><strong>Saída</strong><span data-output-alphabet></span></div>
    </div>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Interpretação: todas as letras percorrem a mesma distância. Por isso, a distribuição de frequências apenas muda de rótulo — uma pista que o próximo laboratório explorará.</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const shift = tools.q<HTMLInputElement>("[data-shift]");
    const shiftOutput = tools.q<HTMLOutputElement>("[data-shift-output]");
    const mode = tools.q<HTMLSelectElement>("[data-mode]");
    const message = tools.q<HTMLTextAreaElement>("[data-message]");
    const inputAlphabet = tools.q<HTMLElement>("[data-input-alphabet]");
    const outputAlphabet = tools.q<HTMLElement>("[data-output-alphabet]");

    const renderAlphabets = () => {
      const key = Number(shift.value);
      const effectiveShift = mode.value === "encrypt" ? key : -key;
      shiftOutput.textContent = String(key);
      inputAlphabet.textContent = ALPHABET;
      outputAlphabet.textContent = shiftText(ALPHABET, effectiveShift);
      outputAlphabet.setAttribute(
        "aria-label",
        [...ALPHABET].map((letter) => `${letter} vira ${shiftText(letter, effectiveShift)}`).join(", "),
      );
    };

    const run = (announce = true) => {
      renderAlphabets();
      const key = Number(shift.value);
      const effectiveShift = mode.value === "encrypt" ? key : -key;
      const result = shiftText(message.value, effectiveShift);
      const formula = makeElement(
        "p",
        mode.value === "encrypt"
          ? `Regra usada: \\(c\\equiv p+${key}\\pmod{26}\\).`
          : `Regra usada: \\(p\\equiv c-${key}\\pmod{26}\\).`,
      );
      const transformed = makeElement("pre", result, "lab-cipher-output");
      transformed.setAttribute("aria-label", `Resultado: ${result}`);
      tools.outputNodes(formula, transformed);
      tools.renderMath(tools.q<HTMLElement>("[data-output]"));
      tools.feedback(
        key === 0
          ? "Com chave zero, cada letra permanece no lugar: é a transformação identidade."
          : `${mode.value === "encrypt" ? "Cifração" : "Decifração"} concluída com deslocamento ${key}.`,
        key === 0 ? "warning" : "success",
        announce,
      );
    };

    tools.on(form, "submit", (event) => {
      event.preventDefault();
      run();
    });
    tools.on(shift, "input", () => run(false));
    tools.on(mode, "change", () => run(false));
    tools.on(tools.q("[data-reset]"), "click", () => {
      shift.value = "5";
      mode.value = "encrypt";
      message.value = "Enemy falling back.";
      run(false);
      tools.feedback("Roda reiniciada no deslocamento 5 usado pelo exemplo do capítulo.");
      message.focus();
    });
    run(false);
  },
});
