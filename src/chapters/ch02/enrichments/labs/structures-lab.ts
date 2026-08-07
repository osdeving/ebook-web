import {
  defineEnrichment, LAB_KICKER as supplement, initialise, q, qa,
  setFeedback, setOutput
} from "../shared";

export const structuresLab = defineEnrichment({
    id: "lab-2-10-1-grupo-anel-corpo",
    layer: "lab",
    anchor: "#exp-2-10-1-teste-do-corpo",
    title: "Qual é a estrutura mais forte?",
    kicker: supplement,
    meta: "Seção 2.10.1 · iniciante · 6–8 min",
    html: `
      <p class="lab-intro">Classifique o sistema pela estrutura mais forte apresentada no capítulo. “Grupo” aqui significa que apenas uma operação está em jogo.</p>
      <div class="lab-controls">
        <label>Sistema
          <select data-scenario>
            <option value="z-add">Inteiros com a adição</option>
            <option value="z6">Z/6 com adição e multiplicação</option>
            <option value="f5">F₅ com adição e multiplicação</option>
            <option value="f5-star">{1,2,3,4} módulo 5 com multiplicação</option>
          </select>
        </label>
      </div>
      <fieldset class="lab-choice-grid">
        <legend>Estrutura mais forte neste enunciado</legend>
        <button type="button" data-answer="group">Grupo</button>
        <button type="button" data-answer="ring">Anel</button>
        <button type="button" data-answer="field">Corpo</button>
      </fieldset>
      <div class="lab-actions">
        <button type="button" class="secondary" data-hint>Mostrar teste decisivo</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const scenarios: Record<string, { answer: string; name: string; hint: string; explanation: string }> = {
        "z-add": {
          answer: "group",
          name: "os inteiros com adição",
          hint: "Há identidade 0 e cada a tem inverso −a; o enunciado fornece somente uma operação.",
          explanation: "É um grupo abeliano sob a adição. Não estamos classificando aqui a estrutura de anel dos inteiros, porque o cartão ofereceu apenas +."
        },
        z6: {
          answer: "ring",
          name: "Z/6",
          hint: "Procure o inverso multiplicativo de 2 e observe que 2·3=0 módulo 6.",
          explanation: "É um anel, mas não um corpo: 2 e 3 são não nulos e seu produto é zero; além disso, 2 não possui inverso."
        },
        f5: {
          answer: "field",
          name: "F₅",
          hint: "Teste 1,2,3,4: cada resíduo não nulo possui um inverso módulo 5.",
          explanation: "É um corpo. Os inversos são 1⁻¹=1, 2⁻¹=3, 3⁻¹=2 e 4⁻¹=4."
        },
        "f5-star": {
          answer: "group",
          name: "F₅* sob multiplicação",
          hint: "O conjunto tem apenas uma operação indicada e todo elemento possui inverso multiplicativo.",
          explanation: "É um grupo multiplicativo de ordem 4. Não contém o zero e não foi apresentada uma operação de adição."
        }
      };
      const current = () => scenarios[String(q(root, "[data-scenario]").value)]!;
      qa(root, "[data-answer]").forEach((button) => button.addEventListener("click", () => {
        const scenario = current();
        const correct = button.dataset.answer === scenario.answer;
        setOutput(root, correct ? `<p>${scenario.explanation}</p>` : "");
        setFeedback(root, correct ? `Correto: ${scenario.name}.` : "Ainda não. Verifique quantas operações foram fornecidas e se todo elemento não nulo possui inverso multiplicativo.", correct ? "success" : "warning");
      }));
      q(root, "[data-hint]").addEventListener("click", () => {
        setOutput(root, `<p><strong>Pista:</strong> ${current().hint}</p>`);
        setFeedback(root, "Use o teste decisivo antes de responder.");
      });
      q(root, "[data-scenario]").addEventListener("change", () => {
        setOutput(root, "");
        setFeedback(root, "Novo sistema selecionado.");
      });
      q(root, "[data-reset]").addEventListener("click", () => {
        q(root, "[data-scenario]").value = "z-add";
        setOutput(root, "");
        setFeedback(root, "Laboratório reiniciado.");
      });
    })
  });
