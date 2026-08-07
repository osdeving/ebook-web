import {
  defineEnrichment, LAB_KICKER as supplement, initialise, polyDegree, polyDivide,
  polyString, q, setFeedback, setOutput
} from "../shared";

export const quotientLab = defineEnrichment({
    id: "lab-2-10-2-classes-polinomiais",
    layer: "lab",
    anchor: "#exp-2-10-2-bem-definido",
    title: "Classes de polinômios e representantes",
    kicker: supplement,
    meta: "Seção 2.10.2 · intermediário · 7–9 min",
    html: `
      <p class="lab-intro">Trabalhe em F₂[x]/(x³+x+1). Dividir pelo módulo fornece o representante de grau menor que 3. Este laboratório compara os restos para testar se dois representantes pertencem à mesma classe; esse teste, sozinho, não demonstra que todas as operações no quociente são bem definidas.</p>
      <div class="lab-controls">
        <label>Polinômio a
          <select data-polynomial>
            <option value="19">x⁴+x+1</option>
            <option value="29">x⁴+x³+x²+1</option>
            <option value="22">x⁴+x²+x</option>
          </select>
        </label>
      </div>
      <div class="lab-actions">
        <button type="button" data-reduce>Reduzir módulo m</button>
        <button type="button" data-equivalent>Trocar de representante</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const modulus = 0b1011;
      const selected = () => Number(q(root, "[data-polynomial]").value);
      q(root, "[data-reduce]").addEventListener("click", () => {
        const polynomial = selected();
        const division = polyDivide(polynomial, modulus);
        setOutput(root, `<ol class="lab-steps">
          <li>a=${polyString(polynomial)}.</li>
          <li>a=(${polyString(modulus)})(${polyString(division.quotient)})+(${polyString(division.remainder)}).</li>
          <li>Logo, a≡<strong>${polyString(division.remainder)}</strong> módulo ${polyString(modulus)}.</li>
        </ol>`);
        setFeedback(root, `O resto tem grau ${polyDegree(division.remainder)}, menor que 3.`, "success");
      });
      q(root, "[data-equivalent]").addEventListener("click", () => {
        const polynomial = selected();
        const alternative = (polynomial ^ (modulus << 1)) >>> 0;
        const first = polyDivide(polynomial, modulus).remainder;
        const second = polyDivide(alternative, modulus).remainder;
        setOutput(root, `<p>Some m·x ao representante:</p>
          <p>${polyString(polynomial)} + (${polyString(modulus)})x = ${polyString(alternative)} em F₂[x].</p>
          <p>Os dois restos são ${polyString(first)} e ${polyString(second)}. Portanto representam a mesma classe.</p>`);
        setFeedback(root, first === second ? "Os dois polinômios têm o mesmo resto e representam a mesma classe." : "Os restos divergiram; verifique a conta.", first === second ? "success" : "warning");
      });
      q(root, "[data-polynomial]").addEventListener("change", () => {
        setOutput(root, "");
        setFeedback(root, "Novo polinômio selecionado.");
      });
      q(root, "[data-reset]").addEventListener("click", () => {
        q(root, "[data-polynomial]").value = "19";
        setOutput(root, "");
        setFeedback(root, "Laboratório reiniciado.");
      });
    })
  });
