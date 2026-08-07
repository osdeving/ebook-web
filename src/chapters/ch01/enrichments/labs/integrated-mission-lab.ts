import { affineText } from "./classical.mts";
import { fastPowerTrace, inverseMod } from "./math.mts";
import { defineLab, makeElement, makeTable, readInteger } from "./runtime.mts";

const MISSION_PLAINTEXT = "ENCONTRO AS NOVE";
const MISSION_CIPHERTEXT = affineText(MISSION_PLAINTEXT, 5, 8) ?? "";

export const integratedMissionLab = defineLab({
  id: "lab-1-missao-integrada",
  anchor: "exercicios",
  title: "Missão integrada: da congruência ao canal seguro",
  duration: "Síntese do capítulo · 15–22 min",
  tags: ["section:exercises", "sintese", "desafio", "cifra-afim", "exponenciacao", "hibrida"],
  html: `
    <p class="lab-intro">Complete três decisões encadeadas. Nenhuma etapa exige tentativa de campo: você usará Bézout para inverter uma cifra, quadratura e multiplicação para obter um código e a distinção entre chaves para escolher o transporte.</p>
    <div class="lab-progress" aria-label="Progresso da missão"><span data-progress-bar></span><strong data-progress-label>0 de 3 etapas</strong></div>
    <section class="lab-card" aria-labelledby="mission-stage-1-title">
      <h4 id="mission-stage-1-title">1. Abrir o bilhete afim</h4>
      <p>Bilhete: <code>${MISSION_CIPHERTEXT}</code>. A regra de cifração foi \(c\equiv5p+8\pmod{26}\). Encontre \(5^{-1}\pmod{26}\).</p>
      <label>Inverso de 5 módulo 26
        <input type="number" min="0" max="25" step="1" data-inverse-answer>
      </label>
      <div class="lab-actions"><button type="button" data-check-inverse>Conferir e decifrar</button></div>
      <p data-stage-status="1" role="status"></p>
    </section>
    <section class="lab-card" aria-labelledby="mission-stage-2-title">
      <h4 id="mission-stage-2-title">2. Calcular o código modular</h4>
      <p>O bilhete pede o código \(7^{13}\bmod23\). Use \(13=(1101)_2=8+4+1\); reduza depois de cada produto.</p>
      <label>Valor do código
        <input type="number" min="0" max="22" step="1" data-power-answer disabled>
      </label>
      <div class="lab-actions"><button type="button" data-check-power disabled>Conferir cálculo</button></div>
      <div data-power-trace></div>
      <p data-stage-status="2" role="status"></p>
    </section>
    <section class="lab-card" aria-labelledby="mission-stage-3-title">
      <h4 id="mission-stage-3-title">3. Escolher o envio</h4>
      <p>Alice publicou uma chave autenticada. Bob enviará um arquivo grande e ainda não compartilha segredo com ela. Qual arquitetura resolve os dois papéis?</p>
      <fieldset class="lab-choice-grid" data-plan-fieldset disabled>
        <label><input type="radio" name="mission-plan" value="symmetric" disabled> Somente simétrica</label>
        <label><input type="radio" name="mission-plan" value="asymmetric" disabled> Somente assimétrica</label>
        <label><input type="radio" name="mission-plan" value="hybrid" disabled> Híbrida</label>
      </fieldset>
      <div class="lab-actions"><button type="button" data-check-plan disabled>Finalizar missão</button></div>
      <p data-stage-status="3" role="status"></p>
    </section>
    <div class="lab-actions"><button type="button" class="secondary" data-reset>Reiniciar missão</button></div>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Síntese: a matemática fornece transformações eficientes e suas inversas; o projeto criptográfico decide quem recebe cada informação e qual ferramenta assume cada papel.</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const inverseAnswer = tools.q<HTMLInputElement>("[data-inverse-answer]");
    const powerAnswer = tools.q<HTMLInputElement>("[data-power-answer]");
    const powerButton = tools.q<HTMLButtonElement>("[data-check-power]");
    const planButton = tools.q<HTMLButtonElement>("[data-check-plan]");
    const planInputs = tools.qa<HTMLInputElement>('input[name="mission-plan"]');
    const progressBar = tools.q<HTMLElement>("[data-progress-bar]");
    const progressLabel = tools.q<HTMLElement>("[data-progress-label]");
    const traceHost = tools.q<HTMLElement>("[data-power-trace]");
    let completed = 0;

    const status = (stage: number, message: string, success: boolean) => {
      const target = tools.q<HTMLElement>(`[data-stage-status="${stage}"]`);
      target.textContent = message;
      target.dataset.tone = success ? "success" : "warning";
    };
    const updateProgress = () => {
      progressBar.style.width = `${completed * 100 / 3}%`;
      progressLabel.textContent = `${completed} de 3 etapa${completed === 1 ? "" : "s"}`;
    };
    const unlockPower = () => {
      powerAnswer.disabled = false;
      powerButton.disabled = false;
    };
    const unlockPlan = () => {
      planInputs.forEach((input) => { input.disabled = false; });
      tools.q<HTMLFieldSetElement>("[data-plan-fieldset]").disabled = false;
      planButton.disabled = false;
    };

    const checkInverse = () => {
      const answer = readInteger(inverseAnswer, "O inverso", { min: 0n, max: 25n });
      const correct = inverseMod(5n, 26n) ?? -1n;
      if (!answer.ok || answer.value !== correct) {
        status(1, "Ainda não. Procure uma identidade 5x+26y=1; depois reduza x entre 0 e 25.", false);
        tools.feedback(answer.ok ? "O inverso proposto não produz resto 1." : answer.message, "warning");
        return;
      }
      const plaintext = affineText(MISSION_CIPHERTEXT, 5, 8, true) ?? "";
      status(1, `Correto: 5·${correct}=105≡1. O bilhete diz “${plaintext}”.`, true);
      if (completed < 1) completed = 1;
      unlockPower();
      updateProgress();
      tools.feedback("Primeira etapa concluída; o cálculo modular foi liberado.", "success");
      powerAnswer.focus();
    };

    const checkPower = () => {
      const answer = readInteger(powerAnswer, "O código", { min: 0n, max: 22n });
      const trace = fastPowerTrace(7n, 13n, 23n);
      const correct = trace.at(-1)?.accumulatorAfter ?? 1n;
      traceHost.replaceChildren(makeTable(
        "Conferência por bits, do menos significativo ao mais significativo",
        ["i", "bit", "7^(2ⁱ) mod 23", "acumulador"],
        trace.map((step) => [String(step.bitIndex), String(step.bit), String(step.factorBefore), String(step.accumulatorAfter)]),
      ));
      if (!answer.ok || answer.value !== correct) {
        status(2, "O valor não confere. Use a tabela revelada e multiplique apenas as linhas cujo bit vale 1.", false);
        tools.feedback(answer.ok ? "Revise as reduções módulo 23." : answer.message, "warning");
        return;
      }
      status(2, `Correto: 7¹³≡${correct} (mod 23).`, true);
      if (completed < 2) completed = 2;
      unlockPlan();
      updateProgress();
      tools.feedback("Segunda etapa concluída; escolha agora a arquitetura do envio.", "success");
      planInputs[0]?.focus();
    };

    const checkPlan = () => {
      const selected = planInputs.find((input) => input.checked)?.value;
      if (selected !== "hybrid") {
        status(3, selected === "symmetric"
          ? "A cifra simétrica serve ao arquivo, mas Bob ainda não possui a chave compartilhada."
          : selected === "asymmetric"
            ? "A chave pública resolve o início, mas não é a ferramenta apropriada para todo o arquivo."
            : "Escolha um dos três planos.", false);
        tools.feedback("Separe estabelecimento de chave e cifração em massa.", "warning");
        return;
      }
      status(3, "Correto: cifre uma chave de sessão para Alice e use essa chave no arquivo.", true);
      completed = 3;
      updateProgress();
      const heading = makeElement("h4", "Missão concluída");
      const summary = makeElement("p", "Você encadeou Bézout, uma inversa afim, exponenciação rápida e uma arquitetura híbrida. Código final: 20 — encontro às nove.");
      tools.outputNodes(heading, summary);
      tools.feedback("As três etapas foram concluídas.", "success");
    };

    tools.on(tools.q("[data-check-inverse]"), "click", checkInverse);
    tools.on(powerButton, "click", checkPower);
    tools.on(planButton, "click", checkPlan);
    tools.on(inverseAnswer, "keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        checkInverse();
      }
    });
    tools.on(powerAnswer, "keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        checkPower();
      }
    });
    tools.on(tools.q("[data-reset]"), "click", () => {
      completed = 0;
      inverseAnswer.value = "";
      powerAnswer.value = "";
      powerAnswer.disabled = true;
      powerButton.disabled = true;
      planInputs.forEach((input) => {
        input.checked = false;
        input.disabled = true;
      });
      tools.q<HTMLFieldSetElement>("[data-plan-fieldset]").disabled = true;
      planButton.disabled = true;
      traceHost.replaceChildren();
      tools.qa<HTMLElement>("[data-stage-status]").forEach((target) => {
        target.textContent = "";
        delete target.dataset.tone;
      });
      tools.clearOutput();
      updateProgress();
      tools.feedback("Missão reiniciada na etapa de Bézout.");
      inverseAnswer.focus();
    });
    updateProgress();
  },
});
