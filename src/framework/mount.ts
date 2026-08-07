import { cssEscape, dispatch } from "./dom";
import { renderMath } from "./math";
import { setTrustedHtml } from "./trusted-html";
import type {
  EnrichmentCleanup,
  EnrichmentDefinition,
  EnrichmentMountContext,
} from "./types";

export interface MountOptions {
  chapterRoot: HTMLElement;
  definitions: readonly EnrichmentDefinition[];
  announce?: (message: string) => void;
}

export interface MountedEnrichments {
  roots: HTMLElement[];
  destroy(): void;
}

export async function mountEnrichments(options: MountOptions): Promise<MountedEnrichments> {
  const roots: HTMLElement[] = [];
  const cleanups: EnrichmentCleanup[] = [];
  const tails = new Map<string, HTMLElement>();
  const announce = options.announce ?? (() => undefined);

  for (const definition of options.definitions) {
    const anchor = resolveAnchor(options.chapterRoot, definition.anchor);
    if (!anchor) {
      console.warn(`[ebook-web] ancora nao encontrada para ${definition.id}: ${definition.anchor}`);
      continue;
    }
    const host = createHost(definition);
    const body = host.querySelector<HTMLElement>("[data-enrichment-body]");
    if (!body) throw new Error(`Corpo editorial ausente em ${definition.id}`);
    const context: EnrichmentMountContext = {
      definition,
      chapterRoot: options.chapterRoot,
      host,
      body,
      announce,
    };
    if (typeof definition.content === "string") {
      setTrustedHtml(body, definition.content);
    } else {
      body.append(definition.content(context));
    }
    insertAt(host, anchor, definition.position ?? "after", tails, definition.anchor);
    const panel = host.querySelector<HTMLDetailsElement>(":scope > .supplement__panel");
    let mathRendered = false;
    const renderBodyMath = () => {
      if (mathRendered || body.dataset.mathRendered === "true") {
        mathRendered = true;
        return;
      }
      renderMath(body);
      body.dataset.mathRendered = "true";
      mathRendered = true;
    };
    if (!panel || panel.open) {
      renderBodyMath();
    } else {
      const renderWhenOpened = () => {
        if (!panel.open) return;
        renderBodyMath();
        panel.removeEventListener("toggle", renderWhenOpened);
      };
      panel.addEventListener("toggle", renderWhenOpened);
      cleanups.push(() => panel.removeEventListener("toggle", renderWhenOpened));
    }
    roots.push(host);
    try {
      const cleanup = await definition.initialize?.(context);
      if (cleanup) cleanups.push(cleanup);
    } catch (error) {
      host.dataset.state = "error";
      const message = document.createElement("p");
      message.className = "supplement__error";
      message.textContent = "Este recurso interativo não pode ser iniciado agora.";
      body.prepend(message);
      console.error(`[ebook-web] falha ao iniciar ${definition.id}`, error);
    }
  }

  dispatch("ebook:enrichments-mounted", { count: roots.length }, options.chapterRoot);
  return {
    roots,
    destroy() {
      cleanups.reverse().forEach((cleanup) => cleanup());
      roots.forEach((root) => root.remove());
    },
  };
}

function resolveAnchor(root: HTMLElement, anchor: string): HTMLElement | null {
  if (anchor.startsWith("#") || anchor.startsWith("[") || anchor.startsWith(".")) {
    return root.querySelector<HTMLElement>(anchor);
  }
  return root.querySelector<HTMLElement>(`#${cssEscape(anchor)}`);
}

function createHost(definition: EnrichmentDefinition): HTMLElement {
  if (definition.presentation === "inline") {
    const host = document.createElement("span");
    decorateHost(host, definition, `enrichment-inline enrichment-inline--${definition.layer}`);
    const body = document.createElement("span");
    body.className = "enrichment-inline__body";
    body.dataset.enrichmentBody = "";
    host.append(body);
    return host;
  }

  const host = document.createElement("aside");
  decorateHost(host, definition, `supplement supplement--${definition.layer}`);

  if (definition.collapsible === false) {
    host.innerHTML = headerMarkup(definition, false) + '<div class="supplement__body" data-enrichment-body></div>';
    return host;
  }

  const panel = document.createElement("details");
  panel.className = "supplement__panel";
  panel.open = Boolean(definition.initiallyOpen);
  panel.innerHTML = headerMarkup(definition, true) + '<div class="supplement__body" data-enrichment-body></div>';
  host.append(panel);
  return host;
}

function decorateHost(
  host: HTMLElement,
  definition: EnrichmentDefinition,
  className: string,
): void {
  host.id = definition.id;
  host.className = className;
  host.dataset.enrichmentId = definition.id;
  host.dataset.enrichmentTitle = definition.title;
  host.dataset.layer = definition.layer;
  host.dataset.origin = "editorial";
}

function headerMarkup(definition: EnrichmentDefinition, summary: boolean): string {
  const wrapper = summary ? "summary" : "header";
  const duration = definition.duration
    ? `<span class="supplement__duration">${escapeText(definition.duration)}</span>`
    : "";
  return `<${wrapper} class="supplement__${summary ? "summary" : "header"}">
    <span class="supplement__heading">
      <span class="supplement__kicker">${escapeText(definition.kicker ?? layerLabel(definition.layer))}</span>
      <span class="supplement__title">${escapeText(definition.title)}</span>
    </span>
    ${duration}
  </${wrapper}>`;
}

function insertAt(
  host: HTMLElement,
  anchor: HTMLElement,
  position: EnrichmentDefinition["position"],
  tails: Map<string, HTMLElement>,
  tailKey: string,
): void {
  if (position === "append") anchor.append(host);
  else if (position === "prepend") anchor.prepend(host);
  else if (position === "before") anchor.before(host);
  else {
    const tail = tails.get(tailKey) ?? anchor;
    tail.after(host);
    tails.set(tailKey, host);
  }
}

function layerLabel(layer: EnrichmentDefinition["layer"]): string {
  return ({
    explanation: "Explicação",
    lab: "Laboratório",
    practice: "Prática",
    history: "História",
    reading: "Para saber mais",
  } as const)[layer];
}

function escapeText(value: string): string {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML;
}
