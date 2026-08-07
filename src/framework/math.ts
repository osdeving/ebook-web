import renderMathInElement from "katex/contrib/auto-render";
import { listen, queryAll } from "./dom";

export interface MathRendererOptions {
  root?: HTMLElement;
  copySelector?: string;
}

export function renderMath(root: HTMLElement = document.body): void {
  renderMathInElement(root, {
    delimiters: [
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
    strict: false,
    trust: false,
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
  });
}

async function copyText(value: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function mountEquationCopy(root: HTMLElement = document.body): () => void {
  const cleanups = queryAll<HTMLElement>(".equation[data-tex]", root).map((box) => {
    if (box.querySelector(":scope > .copy-equation")) return undefined;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-equation";
    button.textContent = "⧉";
    button.setAttribute("aria-label", "Copiar fórmula em LaTeX");
    button.title = "Copiar LaTeX";
    box.append(button);
    return listen(button, "click", async () => {
      const copied = await copyText(box.dataset.tex ?? box.textContent?.trim() ?? "");
      button.textContent = copied ? "✓" : "!";
      window.setTimeout(() => { button.textContent = "⧉"; }, 1200);
    });
  });
  return () => cleanups.forEach((cleanup) => cleanup?.());
}

export function initializeMath(options: MathRendererOptions = {}): () => void {
  const root = options.root ?? document.body;
  renderMath(root);
  return mountEquationCopy(root);
}
