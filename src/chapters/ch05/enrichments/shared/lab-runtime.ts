import { renderMath } from "../../../../framework/math";
import { trustedHtml } from "../../../../framework/trusted-html";
import type { EnrichmentDefinition, EnrichmentMountContext } from "../../../../framework/types";

export type FeedbackTone = "info" | "success" | "warning" | "error";

export interface LabTools {
  root: HTMLElement;
  q<T extends Element>(selector: string): T;
  on(target: EventTarget, event: string, listener: EventListener): void;
  feedback(message: string, tone?: FeedbackTone): void;
  output(...nodes: Node[]): void;
  reset(form: HTMLFormElement): void;
}

interface LabDefinition {
  id: string;
  anchor: string;
  title: string;
  duration: string;
  tags: readonly string[];
  html: string;
  setup(tools: LabTools): void;
}

export function defineLab(definition: LabDefinition): EnrichmentDefinition {
  if (!definition.id.startsWith("lab-5-")) throw new Error("ID inválido de laboratório.");
  return Object.freeze({
    id: definition.id,
    layer: "lab",
    anchor: definition.anchor,
    title: definition.title,
    kicker: "Laboratório interativo",
    duration: definition.duration,
    collapsible: true,
    content: trustedHtml(definition.html),
    tags: Object.freeze(["lab", ...definition.tags]),
    initialize(context: EnrichmentMountContext) {
      if (context.host.dataset.ch05LabReady === "true") return;
      context.host.dataset.ch05LabReady = "true";
      const root = context.body;
      const cleanups: Array<() => void> = [];
      const initial = new Map<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, {
        value: string;
        checked?: boolean;
        selectedIndex?: number;
      }>();
      root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input,textarea,select").forEach((control) => {
        initial.set(control, {
          value: control.value,
          checked: control.tagName === "INPUT" ? (control as HTMLInputElement).checked : undefined,
          selectedIndex: control.tagName === "SELECT" ? (control as HTMLSelectElement).selectedIndex : undefined,
        });
      });
      root.querySelectorAll(".lab-controls").forEach((item) => item.setAttribute("data-lab-controls", ""));
      root.querySelectorAll(".lab-actions").forEach((item) => item.setAttribute("data-lab-actions", ""));
      root.querySelectorAll(".lab-result").forEach((item) => item.setAttribute("data-lab-output", ""));
      root.querySelectorAll("button").forEach((button) => button.classList.add("supplement__action"));

      const q = <T extends Element>(selector: string): T => {
        const found = root.querySelector<T>(selector);
        if (!found) throw new Error("Controle ausente em " + definition.id + ": " + selector);
        return found;
      };
      const tools: LabTools = {
        root,
        q,
        on(target, event, listener) {
          target.addEventListener(event, listener);
          cleanups.push(() => target.removeEventListener(event, listener));
        },
        feedback(message, tone = "info") {
          const target = q<HTMLElement>("[data-feedback]");
          target.textContent = message;
          target.dataset.tone = tone;
        },
        output(...nodes) {
          const target = q<HTMLElement>("[data-output]");
          target.replaceChildren(...nodes);
          renderMath(target);
        },
        reset(form) {
          if (typeof form.reset === "function") form.reset();
          initial.forEach((state, control) => {
            if (!form.contains(control)) return;
            if (control.tagName === "SELECT") {
              const select = control as HTMLSelectElement;
              Array.from(select.options).forEach((option) => {
                option.selected = option.value === state.value;
              });
            } else {
              control.value = state.value;
            }
            if (control.tagName === "INPUT" && state.checked !== undefined) {
              (control as HTMLInputElement).checked = state.checked;
            }
          });
          q<HTMLElement>("[data-output]").replaceChildren();
          const status = q<HTMLElement>("[data-feedback]");
          status.textContent = "Valores iniciais restaurados.";
          status.dataset.tone = "info";
        },
      };
      definition.setup(tools);
      renderMath(root);
      return () => {
        cleanups.reverse().forEach((cleanup) => cleanup());
        delete context.host.dataset.ch05LabReady;
      };
    },
  });
}

export function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (className) item.className = className;
  return item;
}

export function table(caption: string, headings: readonly string[], rows: readonly (readonly string[])[]): HTMLDivElement {
  const wrap = node("div", undefined, "lab-table-wrap");
  const data = node("table", undefined, "lab-table");
  data.append(node("caption", caption));
  const head = node("thead");
  const header = node("tr");
  headings.forEach((value) => {
    const cell = node("th", value);
    cell.scope = "col";
    header.append(cell);
  });
  head.append(header);
  const body = node("tbody");
  rows.forEach((values) => {
    const row = node("tr");
    values.forEach((value, index) => {
      const cell = node(index === 0 ? "th" : "td", value);
      if (index === 0) cell.setAttribute("scope", "row");
      row.append(cell);
    });
    body.append(row);
  });
  data.append(head, body);
  wrap.append(data);
  return wrap;
}

export function readInteger(
  input: HTMLInputElement,
  label: string,
  bounds: { min?: number; max?: number } = {},
): { ok: true; value: number } | { ok: false; message: string } {
  if (input.value.trim() === "") return { ok: false, message: label + " precisa ser preenchido." };
  const value = Number(input.value);
  if (!Number.isSafeInteger(value)) return { ok: false, message: label + " precisa ser um inteiro seguro." };
  if (bounds.min !== undefined && value < bounds.min) return { ok: false, message: label + " precisa ser pelo menos " + bounds.min + "." };
  if (bounds.max !== undefined && value > bounds.max) return { ok: false, message: label + " precisa ser no máximo " + bounds.max + "." };
  return { ok: true, value };
}
