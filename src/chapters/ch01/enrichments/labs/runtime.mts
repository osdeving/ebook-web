import { renderMath } from "../../../../framework/math";
import { trustedHtml } from "../../../../framework/trusted-html";
import type {
  EnrichmentDefinition,
  EnrichmentMountContext,
} from "../../../../framework/types";

export type FeedbackTone = "info" | "success" | "warning" | "error";

export interface LabTools {
  readonly context: EnrichmentMountContext;
  readonly root: HTMLElement;
  q<T extends Element>(selector: string): T;
  qa<T extends Element>(selector: string): T[];
  on<K extends keyof HTMLElementEventMap>(
    target: EventTarget,
    event: K,
    listener: (event: HTMLElementEventMap[K]) => void,
  ): void;
  feedback(message: string, tone?: FeedbackTone, announce?: boolean): void;
  outputText(message: string): void;
  outputMath(message: string): void;
  outputNodes(...nodes: Node[]): void;
  clearOutput(): void;
  renderMath(node?: HTMLElement): void;
}

interface LabDefinition {
  id: `lab-${string}`;
  anchor: string;
  title: string;
  duration: string;
  html: string;
  tags: readonly string[];
  initiallyOpen?: boolean;
  setup(tools: LabTools): void;
}

/**
 * Adapta os laboratórios do capítulo ao contrato único de enriquecimentos.
 * A importação é puramente declarativa; DOM e listeners só surgem no mount.
 */
export function defineLab(definition: LabDefinition): EnrichmentDefinition {
  return Object.freeze({
    id: definition.id,
    layer: "lab",
    anchor: definition.anchor,
    title: definition.title,
    kicker: "Laboratório interativo",
    duration: definition.duration,
    collapsible: true,
    initiallyOpen: definition.initiallyOpen ?? false,
    content: trustedHtml(definition.html),
    tags: Object.freeze(["lab", ...definition.tags]),
    initialize(context: EnrichmentMountContext) {
      if (context.host.dataset.ch01LabReady === "true") return;
      context.host.dataset.ch01LabReady = "true";

      const cleanups: Array<() => void> = [];
      const root = context.body;
      root.querySelectorAll(".lab-controls").forEach((element) => {
        element.setAttribute("data-lab-controls", "");
      });
      root.querySelectorAll(".lab-actions").forEach((element) => {
        element.setAttribute("data-lab-actions", "");
      });
      root.querySelectorAll(".lab-result").forEach((element) => {
        element.setAttribute("data-lab-output", "");
      });
      root.querySelectorAll("button").forEach((button) => {
        button.classList.add("supplement__action");
      });

      const query = <T extends Element>(selector: string): T => {
        const element = root.querySelector<T>(selector);
        if (!element) throw new Error(`Controle ausente em ${definition.id}: ${selector}`);
        return element;
      };

      const output = () => query<HTMLElement>("[data-output]");
      const tools: LabTools = {
        context,
        root,
        q: query,
        qa: <T extends Element>(selector: string) => [...root.querySelectorAll<T>(selector)],
        on(target, event, listener) {
          const handler = listener as EventListener;
          target.addEventListener(event, handler);
          cleanups.push(() => target.removeEventListener(event, handler));
        },
        feedback(message, tone = "info", shouldAnnounce = true) {
          const target = query<HTMLElement>("[data-feedback]");
          target.textContent = message;
          target.dataset.tone = tone;
          if (shouldAnnounce) context.announce(message);
        },
        outputText(message) {
          output().textContent = message;
        },
        outputMath(message) {
          const target = output();
          target.textContent = message;
          renderMath(target);
        },
        outputNodes(...nodes) {
          output().replaceChildren(...nodes);
        },
        clearOutput() {
          output().replaceChildren();
        },
        renderMath(node = root) {
          renderMath(node);
        },
      };

      definition.setup(tools);
      renderMath(root);

      return () => {
        cleanups.reverse().forEach((cleanup) => cleanup());
        delete context.host.dataset.ch01LabReady;
      };
    },
  });
}

export function makeElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}

export function makeTable(
  captionText: string,
  headings: readonly string[],
  rows: readonly (readonly string[])[],
): HTMLDivElement {
  const wrap = makeElement("div", undefined, "lab-table-wrap");
  const table = makeElement("table", undefined, "lab-table");
  const caption = makeElement("caption", captionText);
  const thead = makeElement("thead");
  const headerRow = makeElement("tr");
  headings.forEach((heading) => {
    const cell = makeElement("th", heading);
    cell.scope = "col";
    headerRow.append(cell);
  });
  thead.append(headerRow);
  const tbody = makeElement("tbody");
  rows.forEach((row) => {
    const tableRow = makeElement("tr");
    row.forEach((value) => tableRow.append(makeElement("td", value)));
    tbody.append(tableRow);
  });
  table.append(caption, thead, tbody);
  wrap.append(table);
  return wrap;
}

export function readInteger(
  input: HTMLInputElement,
  label: string,
  bounds: { min?: bigint; max?: bigint } = {},
): { ok: true; value: bigint } | { ok: false; message: string } {
  const raw = input.value.trim();
  if (!/^[+-]?\d+$/.test(raw)) {
    return { ok: false, message: `${label} precisa ser um número inteiro.` };
  }
  const value = BigInt(raw);
  if (bounds.min !== undefined && value < bounds.min) {
    return { ok: false, message: `${label} precisa ser pelo menos ${bounds.min}.` };
  }
  if (bounds.max !== undefined && value > bounds.max) {
    return { ok: false, message: `${label} precisa ser no máximo ${bounds.max}.` };
  }
  return { ok: true, value };
}
