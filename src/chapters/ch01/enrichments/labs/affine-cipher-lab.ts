import { affineText, ALPHABET } from "./classical.mts";
import { gcd, inverseMod } from "./math.mts";
import { defineLab, makeElement, readInteger } from "./runtime.mts";

export const affineCipherLab = defineLab({
  id: "lab-1-3-1-cifra-afim",
  anchor: "sec-1-3-1",
  title: "Da cifra de deslocamento à cifra afim",
  duration: "Seção 1.3.1 · 8–14 min",
  tags: ["section:1.3.1", "cifra-afim", "inverso-modular", "substituicao"],
  html: `
    <p class="lab-intro">Amplie \(c\equiv p+k\pmod{26}\) para \(c\equiv ap+b\pmod{26}\). O multiplicador \(a\) precisa ser invertível módulo 26; escolha um valor que não seja coprimo com 26 para observar exatamente onde a decifração quebra.</p>
    <form data-form>
      <div class="lab-controls">
        <label>Multiplicador \(a\)
          <input type="number" min="0" max="25" step="1" value="5" data-a>
        </label>
        <label>Deslocamento \(b\)
          <input type="number" min="0" max="25" step="1" value="8" data-b>
        </label>
        <label>Operação
          <select data-mode>
            <option value="encrypt">Cifrar</option>
            <option value="decrypt">Decifrar</option>
          </select>
        </label>
      </div>
      <label class="lab-text-label">Mensagem
        <textarea rows="3" data-message spellcheck="false">ENCONTRO AS NOVE</textarea>
      </label>
      <div class="lab-actions">
        <button type="submit">Aplicar transformação</button>
        <button type="button" data-swap>Usar resultado na operação inversa</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
    </form>
    <div class="lab-alphabet" role="group" aria-label="Alfabeto afim">
      <div><strong>Claro</strong><span>${ALPHABET}</span></div>
      <div><strong>Cifrado</strong><span data-mapping></span></div>
    </div>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Interpretação: o deslocamento de César é o caso \(a=1\). Quando \(\gcd(a,26)&gt;1\), letras distintas colidem; uma função que perdeu informação não pode ser desfeita.</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const aInput = tools.q<HTMLInputElement>("[data-a]");
    const bInput = tools.q<HTMLInputElement>("[data-b]");
    const mode = tools.q<HTMLSelectElement>("[data-mode]");
    const message = tools.q<HTMLTextAreaElement>("[data-message]");
    const mapping = tools.q<HTMLElement>("[data-mapping]");
    let lastResult = "";

    const run = (announce = true) => {
      const aResult = readInteger(aInput, "a", { min: 0n, max: 25n });
      const bResult = readInteger(bInput, "b", { min: 0n, max: 25n });
      if (!aResult.ok || !bResult.ok) {
        tools.feedback(!aResult.ok ? aResult.message : !bResult.ok ? bResult.message : "Entrada inválida.", "warning", announce);
        return;
      }
      const a = Number(aResult.value);
      const b = Number(bResult.value);
      const commonDivisor = gcd(aResult.value, 26n);
      const encryptedAlphabet = affineText(ALPHABET, a, b);
      mapping.textContent = encryptedAlphabet ?? "— transformação não injetiva —";
      if (commonDivisor !== 1n || encryptedAlphabet === null) {
        const collisions = Array.from({ length: 26 }, (_, index) => (a * index + b) % 26);
        const distinct = new Set(collisions).size;
        tools.outputMath(`Como \\(\\gcd(${a},26)=${commonDivisor}\\), apenas ${distinct} letras cifradas distintas aparecem. Não existe \\(a^{-1}\\pmod{26}\\), portanto não há decifração única.`);
        tools.feedback(`Multiplicador inválido para uma cifra: ${26 - distinct} entradas colidem com outras.`, "warning", announce);
        lastResult = "";
        return;
      }
      const result = affineText(message.value, a, b, mode.value === "decrypt");
      if (result === null) return;
      lastResult = result;
      const inverse = inverseMod(aResult.value, 26n);
      const explanation = makeElement(
        "p",
        mode.value === "encrypt"
          ? `Cifração: \\(c\\equiv${a}p+${b}\\pmod{26}\\).`
          : `Decifração: \\(p\\equiv${inverse}(c-${b})\\pmod{26}\\), pois \\(${a}^{-1}\\equiv${inverse}\\pmod{26}\\).`,
      );
      const transformed = makeElement("pre", result, "lab-cipher-output");
      transformed.setAttribute("aria-label", `Resultado: ${result}`);
      tools.outputNodes(explanation, transformed);
      tools.renderMath(tools.q<HTMLElement>("[data-output]"));
      tools.feedback(`Transformação afim ${mode.value === "encrypt" ? "aplicada" : "invertida"} sem colisões.`, "success", announce);
    };

    tools.on(form, "submit", (event) => {
      event.preventDefault();
      run();
    });
    tools.qa<HTMLInputElement | HTMLSelectElement>("[data-a], [data-b], [data-mode]").forEach((control) => {
      tools.on(control, "change", () => run(false));
    });
    tools.on(tools.q("[data-swap]"), "click", () => {
      if (!lastResult) {
        tools.feedback("Produza primeiro um resultado com um multiplicador invertível.", "warning");
        return;
      }
      message.value = lastResult;
      mode.value = mode.value === "encrypt" ? "decrypt" : "encrypt";
      run();
      message.focus();
    });
    tools.on(tools.q("[data-reset]"), "click", () => {
      aInput.value = "5";
      bInput.value = "8";
      mode.value = "encrypt";
      message.value = "ENCONTRO AS NOVE";
      run(false);
      tools.feedback("Cifra afim a=5, b=8 restaurada.");
      message.focus();
    });
    run(false);
  },
});
