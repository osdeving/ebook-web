import { listen } from "./dom";
import type { ReaderPreferences } from "./types";

export interface StudyProgressOptions {
  article: HTMLElement;
  preferences: ReaderPreferences;
  persist(): void;
  announce(message: string): void;
}

type ProgressState = ReaderPreferences["progress"][string];

export function mountStudyProgress(options: StudyProgressOptions): () => void {
  const cleanups: Array<() => void> = [];
  const injected: HTMLElement[] = [];
  const sections = Array.from(options.article.querySelectorAll<HTMLElement>("section[id]"));
  const exercises = Array.from(options.article.querySelectorAll<HTMLElement>(".exercise[id]"));
  const items = [...sections, ...exercises];

  for (const item of items) {
    if (!item.id) continue;
    const kind = item.matches(".exercise") ? "exercise" : "section";
    const button = createToggle(item.id, kind, options.preferences.progress[item.id]);
    cleanups.push(listen(button, "click", () => {
      const current = options.preferences.progress[item.id];
      const next: ProgressState | undefined = current === "started"
        ? "completed"
        : current === "completed"
          ? undefined
          : "started";
      if (next) options.preferences.progress[item.id] = next;
      else delete options.preferences.progress[item.id];
      syncToggle(button, kind, next);
      options.persist();
      renderDashboard(options, sections, exercises);
      options.announce(progressAnnouncement(kind, next));
    }));

    if (kind === "section") {
      const tools = item.querySelector<HTMLElement>(":scope > .enrichment-section-tools");
      if (tools) tools.prepend(button);
      else item.querySelector("h2, h3")?.after(button);
      injected.push(button);
    } else {
      const wrapper = document.createElement("div");
      wrapper.className = "exercise-progress";
      wrapper.dataset.origin = "editorial";
      wrapper.dataset.screenOnly = "";
      wrapper.append(button);
      item.prepend(wrapper);
      injected.push(wrapper);
    }
  }

  const clear = document.querySelector<HTMLButtonElement>("[data-study-progress-clear]");
  if (clear) cleanups.push(listen(clear, "click", () => {
    if (!Object.keys(options.preferences.progress).length) return;
    if (!window.confirm("Limpar o progresso marcado neste capítulo?")) return;
    options.preferences.progress = {};
    for (const button of options.article.querySelectorAll<HTMLButtonElement>("[data-study-progress-id]")) {
      syncToggle(button, button.dataset.studyProgressKind === "exercise" ? "exercise" : "section", undefined);
    }
    options.persist();
    renderDashboard(options, sections, exercises);
    options.announce("Progresso do capítulo removido.");
  }));

  renderDashboard(options, sections, exercises);
  return () => {
    cleanups.reverse().forEach((cleanup) => cleanup());
    injected.forEach((node) => node.remove());
  };
}

function createToggle(id: string, kind: "section" | "exercise", state?: ProgressState): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "study-progress-toggle";
  button.dataset.studyProgressId = id;
  button.dataset.studyProgressKind = kind;
  syncToggle(button, kind, state);
  return button;
}

function syncToggle(button: HTMLButtonElement, kind: "section" | "exercise", state?: ProgressState): void {
  button.dataset.progressState = state ?? "idle";
  button.setAttribute("aria-pressed", String(state === "completed"));
  if (kind === "exercise") {
    button.textContent = state === "completed" ? "✓ Concluído" : state === "started" ? "◐ Tentando" : "○ Não iniciado";
    button.setAttribute("aria-label", state === "completed"
      ? "Exercício concluído; ativar para limpar o estado"
      : state === "started"
        ? "Exercício em tentativa; ativar para marcar como concluído"
        : "Marcar exercício como em tentativa");
  } else {
    button.textContent = state === "completed" ? "✓ Concluída" : state === "started" ? "◐ Em leitura" : "○ Marcar leitura";
    button.setAttribute("aria-label", state === "completed"
      ? "Seção concluída; ativar para limpar o estado"
      : state === "started"
        ? "Seção em leitura; ativar para marcar como concluída"
        : "Marcar seção como em leitura");
  }
}

function renderDashboard(
  options: StudyProgressOptions,
  sections: readonly HTMLElement[],
  exercises: readonly HTMLElement[],
): void {
  const host = document.querySelector<HTMLElement>("[data-study-progress-summary]");
  if (!host) return;
  const sectionCompleted = count(sections, options.preferences.progress, "completed");
  const exerciseCompleted = count(exercises, options.preferences.progress, "completed");
  const sectionStarted = count(sections, options.preferences.progress, "started");
  const exerciseStarted = count(exercises, options.preferences.progress, "started");
  setText(host, "[data-progress-sections]", `${sectionCompleted}/${sections.length}`);
  setText(host, "[data-progress-exercises]", `${exerciseCompleted}/${exercises.length}`);
  setText(host, "[data-progress-active]", `${sectionStarted + exerciseStarted}`);
  syncProgress(host, "[data-progress-sections-meter]", sectionCompleted, sections.length);
  syncProgress(host, "[data-progress-exercises-meter]", exerciseCompleted, exercises.length);
}

function count(items: readonly HTMLElement[], progress: ReaderPreferences["progress"], state: ProgressState): number {
  return items.filter((item) => progress[item.id] === state).length;
}

function setText(root: ParentNode, selector: string, value: string): void {
  const node = root.querySelector<HTMLElement>(selector);
  if (node) node.textContent = value;
}

function syncProgress(root: ParentNode, selector: string, value: number, max: number): void {
  const meter = root.querySelector<HTMLProgressElement>(selector);
  if (!meter) return;
  meter.max = Math.max(1, max);
  meter.value = value;
}

function progressAnnouncement(kind: "section" | "exercise", state?: ProgressState): string {
  const subject = kind === "exercise" ? "Exercício" : "Seção";
  if (state === "completed") return `${subject} marcado como concluído.`;
  if (state === "started") return `${subject} marcado como em andamento.`;
  return `Progresso do ${subject.toLocaleLowerCase("pt-BR")} removido.`;
}
