import { mod } from "./math.mts";
import { defineLab, makeElement, readInteger } from "./runtime.mts";

type Operation = "add" | "subtract" | "multiply";

export const modularClockLab = defineLab({
  id: "lab-1-3-relogio-modular",
  anchor: "def-1-congruence",
  title: "Relógio de aritmética modular",
  duration: "Seção 1.3 · 7–12 min",
  tags: ["section:1.3", "congruencia", "residuos", "aritmetica-modular"],
  html: `
    <p class="lab-intro">Escolha um módulo e opere com dois inteiros — positivos ou negativos. O relógio marca os representantes de \(a\), \(b\) e do resultado. Para manipular sem digitar, selecione qual operando editar e clique em uma casa.</p>
    <form data-form>
      <div class="lab-controls">
        <label>Módulo \(m\)
          <input type="number" min="2" max="60" step="1" value="12" data-modulus>
        </label>
        <label>Inteiro \(a\)
          <input type="number" min="-1000000" max="1000000" step="1" value="17" data-a>
        </label>
        <label>Operação
          <select data-operation>
            <option value="add">somar</option>
            <option value="subtract">subtrair</option>
            <option value="multiply">multiplicar</option>
          </select>
        </label>
        <label>Inteiro \(b\)
          <input type="number" min="-1000000" max="1000000" step="1" value="9" data-b>
        </label>
        <label>Cliques no relógio alteram
          <select data-click-target aria-label="Escolher operando alterado ao clicar no relógio">
            <option value="a">o operando a</option>
            <option value="b">o operando b</option>
          </select>
        </label>
      </div>
      <div class="lab-actions">
        <button type="submit">Calcular resíduos</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
    </form>
    <div class="lab-residue-wheel" data-wheel role="list" aria-label="Classes de resíduos módulo doze"></div>
    <div class="lab-legend" aria-label="Legenda"><span data-kind="a">● a</span><span data-kind="b">● b</span><span data-kind="result">● resultado</span></div>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Interpretação: números congruentes não são iguais como inteiros; são equivalentes depois que escolhemos o módulo. Reduzir antes ou depois da operação conduz à mesma classe.</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const modulusInput = tools.q<HTMLInputElement>("[data-modulus]");
    const aInput = tools.q<HTMLInputElement>("[data-a]");
    const bInput = tools.q<HTMLInputElement>("[data-b]");
    const operationInput = tools.q<HTMLSelectElement>("[data-operation]");
    const clickTarget = tools.q<HTMLSelectElement>("[data-click-target]");
    const wheel = tools.q<HTMLElement>("[data-wheel]");

    const read = () => {
      const modulus = readInteger(modulusInput, "O módulo", { min: 2n, max: 60n });
      const a = readInteger(aInput, "a", { min: -1_000_000n, max: 1_000_000n });
      const b = readInteger(bInput, "b", { min: -1_000_000n, max: 1_000_000n });
      const invalid = [modulus, a, b].find((result) => !result.ok);
      if (invalid && !invalid.ok) {
        tools.feedback(invalid.message, "warning");
        return null;
      }
      if (!modulus.ok || !a.ok || !b.ok) return null;
      return { modulus: modulus.value, a: a.value, b: b.value };
    };

    const calculate = (announce = true) => {
      const values = read();
      if (!values) return;
      const { modulus, a, b } = values;
      const operation = operationInput.value as Operation;
      const rawResult = operation === "add" ? a + b : operation === "subtract" ? a - b : a * b;
      const aResidue = mod(a, modulus);
      const bResidue = mod(b, modulus);
      const result = mod(rawResult, modulus);
      const symbol = operation === "add" ? "+" : operation === "subtract" ? "-" : "\\cdot";

      wheel.replaceChildren(...Array.from({ length: Number(modulus) }, (_, residue) => {
        const button = makeElement("button", String(residue), "lab-residue-cell");
        button.type = "button";
        button.dataset.residue = String(residue);
        button.setAttribute("role", "listitem");
        const kinds: string[] = [];
        if (BigInt(residue) === aResidue) {
          button.classList.add("is-a");
          kinds.push("a");
        }
        if (BigInt(residue) === bResidue) {
          button.classList.add("is-b");
          kinds.push("b");
        }
        if (BigInt(residue) === result) {
          button.classList.add("is-result");
          kinds.push("resultado");
        }
        button.setAttribute("aria-label", `Resíduo ${residue}${kinds.length ? `; representa ${kinds.join(", ")}` : ""}`);
        return button;
      }));
      wheel.setAttribute("aria-label", `Classes de resíduos módulo ${modulus}; a está em ${aResidue}, b em ${bResidue}, resultado em ${result}`);
      tools.outputMath(
        `Reduza primeiro: \\(${a}\\equiv${aResidue}\\pmod{${modulus}}\\) e \\(${b}\\equiv${bResidue}\\pmod{${modulus}}\\). `
        + `Então \\(${aResidue}${symbol}${bResidue}\\equiv${result}\\pmod{${modulus}}\\). `
        + `Reduza depois: \\(${rawResult}\\equiv${result}\\pmod{${modulus}}\\).`,
      );
      tools.feedback(`Resultado marcado na classe ${result} módulo ${modulus}.`, "success", announce);
    };

    tools.on(form, "submit", (event) => {
      event.preventDefault();
      calculate();
    });
    tools.qa<HTMLInputElement | HTMLSelectElement>("[data-modulus], [data-a], [data-b], [data-operation]").forEach((control) => {
      tools.on(control, "change", () => calculate(false));
    });
    tools.on(wheel, "click", (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-residue]");
      if (!button) return;
      const target = clickTarget.value === "a" ? aInput : bInput;
      target.value = button.dataset.residue ?? "0";
      calculate(false);
      tools.feedback(`O operando ${clickTarget.value} foi movido para a classe ${target.value}.`, "success");
    });
    tools.on(tools.q("[data-reset]"), "click", () => {
      modulusInput.value = "12";
      aInput.value = "17";
      bInput.value = "9";
      operationInput.value = "add";
      clickTarget.value = "a";
      calculate(false);
      tools.feedback("Relógio módulo 12 restaurado.");
      modulusInput.focus();
    });
    calculate(false);
  },
});
