import { renderMath } from "../../../../framework/math";
import { trustedHtml } from "../../../../framework/trusted-html";
import type {
  EnrichmentDefinition,
  EnrichmentMountContext,
} from "../../../../framework/types";

export type FeedbackTone = "info" | "success" | "warning" | "error";

export interface LabTools {
  root: HTMLElement;
  context: EnrichmentMountContext;
  q<T extends Element>(selector: string): T;
  qa<T extends Element>(selector: string): T[];
  on(target: EventTarget, event: string, listener: EventListener): void;
  feedback(message: string, tone?: FeedbackTone): void;
  outputText(message: string): void;
  outputNodes(...nodes: Node[]): void;
  renderMath(node?: HTMLElement): void;
  resetForm(form: HTMLFormElement): void;
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
  if (!definition.id.startsWith("lab-4-")) throw new Error("ID inválido de laboratório.");
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
      if (context.host.dataset.ch04LabReady === "true") return;
      context.host.dataset.ch04LabReady = "true";
      const root = context.body;
      const cleanups: Array<() => void> = [];
      const initialControls = new Map<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
        { value: string; checked?: boolean; selectedIndex?: number }
      >();
      root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        "input,textarea,select",
      ).forEach((control) => {
        initialControls.set(control, {
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
        const item = root.querySelector<T>(selector);
        if (!item) throw new Error("Controle ausente em " + definition.id + ": " + selector);
        return item;
      };
      const tools: LabTools = {
        root,
        context,
        q,
        qa: <T extends Element>(selector: string) => [...root.querySelectorAll<T>(selector)],
        on(target, event, listener) {
          target.addEventListener(event, listener);
          cleanups.push(() => target.removeEventListener(event, listener));
        },
        feedback(message, tone = "info") {
          const target = q<HTMLElement>("[data-feedback]");
          target.textContent = message;
          target.dataset.tone = tone;
        },
        outputText(message) {
          q<HTMLElement>("[data-output]").textContent = message;
        },
        outputNodes(...nodes) {
          q<HTMLElement>("[data-output]").replaceChildren(...nodes);
        },
        renderMath(node = root) {
          renderMath(node);
        },
        resetForm(form) {
          if (typeof form.reset === "function") {
            form.reset();
          }
          initialControls.forEach((state, control) => {
            if (!form.contains(control)) return;
            control.value = state.value;
            if (control.tagName === "INPUT" && state.checked !== undefined) {
              (control as HTMLInputElement).checked = state.checked;
            }
            if (control.tagName === "SELECT" && state.selectedIndex !== undefined) {
              (control as HTMLSelectElement).selectedIndex = state.selectedIndex;
            }
          });
          q<HTMLElement>("[data-output]").replaceChildren();
          const feedback = q<HTMLElement>("[data-feedback]");
          feedback.textContent = "Valores iniciais restaurados.";
          feedback.dataset.tone = "info";
        },
      };
      definition.setup(tools);
      renderMath(root);
      return () => {
        cleanups.reverse().forEach((cleanup) => cleanup());
        delete context.host.dataset.ch04LabReady;
      };
    },
  });
}

export function readBigInt(
  input: HTMLInputElement,
  label: string,
  bounds: { min?: bigint; max?: bigint } = {},
): { ok: true; value: bigint } | { ok: false; message: string } {
  const raw = input.value.trim();
  if (!/^[+-]?\d+$/.test(raw)) return { ok: false, message: label + " precisa ser um inteiro." };
  const value = BigInt(raw);
  if (bounds.min !== undefined && value < bounds.min) {
    return { ok: false, message: label + " precisa ser pelo menos " + bounds.min + "." };
  }
  if (bounds.max !== undefined && value > bounds.max) {
    return { ok: false, message: label + " precisa ser no máximo " + bounds.max + "." };
  }
  return { ok: true, value };
}

export function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export function table(
  caption: string,
  headings: readonly string[],
  rows: readonly (readonly string[])[],
): HTMLDivElement {
  const wrap = element("div", undefined, "lab-table-wrap");
  const node = element("table", undefined, "lab-table");
  node.append(element("caption", caption));
  const head = element("thead");
  const headerRow = element("tr");
  headings.forEach((value) => {
    const cell = element("th", value);
    cell.setAttribute("scope", "col");
    headerRow.append(cell);
  });
  head.append(headerRow);
  const body = element("tbody");
  rows.forEach((values) => {
    const row = element("tr");
    values.forEach((value, index) => {
      const cell = element(index === 0 ? "th" : "td", value);
      if (index === 0) cell.setAttribute("scope", "row");
      row.append(cell);
    });
    body.append(row);
  });
  node.append(head, body);
  wrap.append(node);
  return wrap;
}
