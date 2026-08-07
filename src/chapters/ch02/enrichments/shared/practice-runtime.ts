import { escapeHtml, normalizeText, renderMath } from "./dom";
import { defineEnrichment } from "./definition";
import { hashSeed } from "./random";
import type {
  EnrichmentItem,
  GeneratedPracticeConfig,
  GeneratedProblem,
  PracticeConfig
} from "./types";

const practiceHtml = (config: PracticeConfig): string => {
  const choices = config.choices?.map((choice, index) => `
    <label class="practice-choice">
      <input type="radio" name="answer-${escapeHtml(config.id)}" value="${escapeHtml(choice.value)}">
      <span><strong>${String.fromCharCode(65 + index)}.</strong> ${choice.label}</span>
    </label>`).join("") ?? "";
  const answerControl = config.choices
    ? `<div class="practice-choices">${choices}</div>`
    : `<label class="practice-input-label">Sua resposta
        <input class="practice-input" name="answer-${escapeHtml(config.id)}" inputmode="${config.inputmode || "text"}" autocomplete="off" placeholder="${escapeHtml(config.placeholder || "Digite aqui")}">
      </label>`;
  return `
    <form class="practice-widget" data-practice="${escapeHtml(config.id)}" novalidate>
      <div class="practice-prompt">${config.prompt}</div>
      ${answerControl}
      <div class="practice-actions">
        <button type="submit" class="supplement-button supplement-button--primary">Verificar</button>
        <button type="button" class="supplement-button" data-practice-hint>Quero uma pista</button>
        <button type="button" class="supplement-button" data-practice-reset>Recomeçar</button>
      </div>
      <div class="practice-hints" aria-label="Pistas graduais">
        ${config.hints.map((hint, index) => `<div class="practice-hint" data-hint="${index}" hidden><strong>Pista ${index + 1}.</strong> ${hint}</div>`).join("")}
      </div>
      <div class="practice-feedback" data-practice-feedback aria-live="polite"></div>
      <details class="practice-solution">
        <summary>Ver solução comentada</summary>
        <div>${config.solution}</div>
      </details>
      <label class="practice-save"><input type="checkbox" data-practice-save> Guardar o estado desta prática apenas neste navegador</label>
    </form>`;
};

const practiceInit = (config: PracticeConfig) => (root: HTMLElement): void => {
  const form: any = root.querySelector(".practice-widget");
  if (!form) return;
  const feedback: any = form.querySelector("[data-practice-feedback]");
  const hintButton: any = form.querySelector("[data-practice-hint]");
  const resetButton: any = form.querySelector("[data-practice-reset]");
  const save: any = form.querySelector("[data-practice-save]");
  const storageKey = `ch02.practice.${config.id}`;
  let hintIndex = 0;

  const getAnswer = (): string => {
    if (config.choices) return form.querySelector(`input[name="answer-${CSS.escape(config.id)}"]:checked`)?.value ?? "";
    return form.querySelector(`input[name="answer-${CSS.escape(config.id)}"]`)?.value ?? "";
  };
  const setAnswer = (answer: string): void => {
    if (config.choices) {
      const radio: any = [...form.querySelectorAll(`input[name="answer-${CSS.escape(config.id)}"]`)]
        .find((input: any) => input.value === answer);
      if (radio) radio.checked = true;
    } else {
      const input: any = form.querySelector(`input[name="answer-${CSS.escape(config.id)}"]`);
      if (input) input.value = answer;
    }
  };
  const persist = (solved = false): void => {
    if (!save.checked) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answer: getAnswer(), hintIndex, solved }));
    } catch { /* armazenamento é opcional */ }
  };

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (stored) {
      save.checked = true;
      setAnswer(stored.answer || "");
      hintIndex = Math.min(config.hints.length, Number(stored.hintIndex) || 0);
      for (let i = 0; i < hintIndex; i += 1) form.querySelector(`[data-hint="${i}"]`)?.removeAttribute("hidden");
      if (stored.solved) {
        feedback.className = "practice-feedback is-correct";
        feedback.textContent = "Resposta correta restaurada deste navegador.";
      }
    }
  } catch { /* estado inválido é ignorado */ }

  hintButton?.addEventListener("click", () => {
    if (hintIndex >= config.hints.length) {
      feedback.className = "practice-feedback is-neutral";
      feedback.textContent = "Todas as pistas já estão visíveis. A solução comentada continua recolhida abaixo.";
      return;
    }
    form.querySelector(`[data-hint="${hintIndex}"]`)?.removeAttribute("hidden");
    hintIndex += 1;
    persist(false);
    feedback.className = "practice-feedback is-neutral";
    feedback.textContent = `Pista ${hintIndex} revelada.`;
  });

  form.addEventListener("submit", (event: Event) => {
    event.preventDefault();
    const answer = getAnswer();
    if (!answer) {
      feedback.className = "practice-feedback is-wrong";
      feedback.textContent = "Escolha ou digite uma resposta antes de verificar.";
      return;
    }
    const correct = config.check(answer);
    feedback.className = `practice-feedback ${correct ? "is-correct" : "is-wrong"}`;
    feedback.innerHTML = correct
      ? `<strong>Correto.</strong> ${config.correctFeedback}`
      : `<strong>Ainda não.</strong> ${config.wrongFeedback()}`;
    renderMath(feedback);
    persist(correct);
  });

  resetButton?.addEventListener("click", () => {
    form.reset();
    hintIndex = 0;
    form.querySelectorAll("[data-hint]").forEach((hint: HTMLElement) => hint.setAttribute("hidden", ""));
    feedback.className = "practice-feedback";
    feedback.textContent = "";
    try { localStorage.removeItem(storageKey); } catch { /* opcional */ }
  });
  save?.addEventListener("change", () => {
    if (save.checked) persist(false);
    else try { localStorage.removeItem(storageKey); } catch { /* opcional */ }
  });
  renderMath(root);
};

export const makePractice = (config: PracticeConfig): EnrichmentItem => defineEnrichment({
  id: `practice-${config.id}`,
  layer: "practice",
  anchor: config.anchor,
  kicker: "Prática adicional",
  title: config.title,
  meta: config.meta || "Pistas graduais · solução comentada",
  html: practiceHtml(config),
  init: practiceInit(config)
});

export const makeGeneratedPractice = (config: GeneratedPracticeConfig): EnrichmentItem => defineEnrichment({
  id: `practice-${config.id}`,
  layer: "practice",
  anchor: config.anchor,
  kicker: "Prática gerada",
  title: config.title,
  meta: "Nova instância por semente · cálculo passo a passo",
  html: `
    <div class="generated-practice" data-generated-practice="${escapeHtml(config.id)}">
      <div class="seed-row">
        <label>Semente <input data-seed value="${escapeHtml(config.id)}-1" autocomplete="off"></label>
        <button type="button" class="supplement-button" data-new-seed>Gerar outra</button>
      </div>
      ${config.intro ? `<p class="generated-practice__intro">${config.intro}</p>` : ""}
      <div data-generated-prompt></div>
      <label class="practice-input-label">Sua resposta
        <input class="practice-input" data-generated-answer inputmode="numeric" autocomplete="off">
      </label>
      <div class="practice-actions">
        <button type="button" class="supplement-button supplement-button--primary" data-generated-check>Verificar</button>
        <button type="button" class="supplement-button" data-generated-hint>Mostrar próxima pista</button>
      </div>
      <div data-generated-hints></div>
      <div class="practice-feedback" data-generated-feedback aria-live="polite"></div>
      <details class="practice-solution"><summary>Ver solução desta instância</summary><div data-generated-solution></div></details>
    </div>`,
  init(root) {
    const widget: any = root.querySelector("[data-generated-practice]");
    if (!widget) return;
    const seedInput: any = widget.querySelector("[data-seed]");
    const answer: any = widget.querySelector("[data-generated-answer]");
    const prompt: any = widget.querySelector("[data-generated-prompt]");
    const hints: any = widget.querySelector("[data-generated-hints]");
    const feedback: any = widget.querySelector("[data-generated-feedback]");
    const solution: any = widget.querySelector("[data-generated-solution]");
    let problem: GeneratedProblem;
    let hintIndex = 0;

    const render = (): void => {
      problem = config.build(hashSeed(seedInput.value));
      hintIndex = 0;
      answer.value = "";
      prompt.innerHTML = problem.prompt;
      hints.innerHTML = problem.hints.map((hint, index) => `<div class="practice-hint" data-dynamic-hint="${index}" hidden><strong>Pista ${index + 1}.</strong> ${hint}</div>`).join("");
      solution.innerHTML = problem.solution;
      feedback.textContent = "";
      feedback.className = "practice-feedback";
      renderMath(root);
    };
    widget.querySelector("[data-new-seed]").addEventListener("click", () => {
      seedInput.value = `${config.id}-${Math.random().toString(36).slice(2, 8)}`;
      render();
    });
    seedInput.addEventListener("change", render);
    widget.querySelector("[data-generated-check]").addEventListener("click", () => {
      const correct = normalizeText(answer.value) === normalizeText(problem.answer);
      feedback.className = `practice-feedback ${correct ? "is-correct" : "is-wrong"}`;
      feedback.innerHTML = correct
        ? `<strong>Correto.</strong> ${problem.correctFeedback}`
        : `<strong>Ainda não.</strong> ${problem.wrongFeedback}`;
    });
    widget.querySelector("[data-generated-hint]").addEventListener("click", () => {
      const hint = hints.querySelector(`[data-dynamic-hint="${hintIndex}"]`);
      if (hint) {
        hint.hidden = false;
        hintIndex += 1;
        feedback.className = "practice-feedback is-neutral";
        feedback.textContent = `Pista ${hintIndex} revelada.`;
      } else {
        feedback.className = "practice-feedback is-neutral";
        feedback.textContent = "Todas as pistas desta instância já estão visíveis.";
      }
    });
    render();
  }
});
