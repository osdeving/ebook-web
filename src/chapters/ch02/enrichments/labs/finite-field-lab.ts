import {
  defineEnrichment, LAB_KICKER as supplement, gf2Multiply, initialise, polyString,
  q, setFeedback, setOutput, tableHtml
} from "../shared";

export const finiteFieldLab = defineEnrichment({
    id: "lab-2-10-4-corpo-finito",
    layer: "lab",
    anchor: "#exp-2-10-4-irredutivel-produz-corpo",
    title: "Construtor do corpo F₈",
    kicker: supplement,
    meta: "Seção 2.10.4 · intermediário · 9–12 min",
    html: `
      <p class="lab-intro">Use F₂[x]/(x³+x+1). Os oito elementos são os polinômios de grau menor que 3, e a relação x³=x+1 reduz os produtos.</p>
      <div class="lab-controls">
        <label>Elemento a <select data-a></select></label>
        <label>Elemento b <select data-b></select></label>
      </div>
      <div class="lab-actions">
        <button type="button" data-calculate>Somar, multiplicar e inverter</button>
        <button type="button" data-cycle>Gerar potências de a</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const elements = Array.from({ length: 8 }, (_, value) => value);
      const options = elements.map((value) => `<option value="${value}">${polyString(value)}</option>`).join("");
      q(root, "[data-a]").innerHTML = options;
      q(root, "[data-b]").innerHTML = options;
      q(root, "[data-a]").value = "2";
      q(root, "[data-b]").value = "5";
      const inverse = (value: number): number | null => value === 0 ? null : elements.slice(1).find((candidate) => gf2Multiply(value, candidate) === 1) ?? null;
      q(root, "[data-calculate]").addEventListener("click", () => {
        const a = Number(q(root, "[data-a]").value);
        const b = Number(q(root, "[data-b]").value);
        const sum = a ^ b;
        const product = gf2Multiply(a, b);
        const inverseA = inverse(a);
        setOutput(root, tableHtml("Operações em F₈", ["Operação", "Resultado"], [
          [`(${polyString(a)}) + (${polyString(b)})`, polyString(sum)],
          [`(${polyString(a)}) · (${polyString(b)})`, polyString(product)],
          [`(${polyString(a)})⁻¹`, inverseA === null ? "não existe para zero" : polyString(inverseA)]
        ]));
        setFeedback(root, inverseA === null ? "O zero é o único elemento sem inverso multiplicativo." : `Verificação: a·a⁻¹=${polyString(gf2Multiply(a, inverseA))}.`, inverseA === null ? "warning" : "success");
      });
      q(root, "[data-cycle]").addEventListener("click", () => {
        const a = Number(q(root, "[data-a]").value);
        if (a === 0) {
          setOutput(root, "<p>As potências positivas de zero permanecem zero; escolha um elemento não nulo para explorar F₈*.</p>");
          setFeedback(root, "O grupo multiplicativo exclui o zero.", "warning");
          return;
        }
        const powers = [];
        let value = 1;
        for (let exponent = 1; exponent <= 8; exponent += 1) {
          value = gf2Multiply(value, a);
          powers.push({ exponent, value });
          if (value === 1) break;
        }
        setOutput(root, tableHtml(`Potências de ${polyString(a)}`, ["Expoente", "Valor"], powers.map((entry) => [String(entry.exponent), polyString(entry.value)])));
        const order = powers.length;
        setFeedback(root, order === 7 ? `A ordem é 7: ${polyString(a)} é primitivo e gera todos os elementos não nulos.` : `A ordem é ${order}, que divide |F₈*|=7.`, order === 7 ? "success" : "info");
      });
      q(root, "[data-reset]").addEventListener("click", () => {
        q(root, "[data-a]").value = "2";
        q(root, "[data-b]").value = "5";
        setOutput(root, "");
        setFeedback(root, "Laboratório reiniciado.");
      });
    })
  });
