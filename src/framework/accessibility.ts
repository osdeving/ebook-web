import { getFocusable, listen, queryAll } from "./dom";

/** Mantem o teclado dentro de uma superficie modal enquanto ela esta aberta. */
export function createFocusTrap(root: HTMLElement): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const focusable = getFocusable(root);
    if (!focusable.length) {
      event.preventDefault();
      root.focus();
      return;
    }
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
}

/**
 * Abre um complemento apontado por hash, inclusive quando o alvo esta dentro
 * de mais de um `details`. Todos os ancestrais sao abertos de fora para dentro.
 */
export function resolveHashTarget(root: ParentNode = document): HTMLElement | null {
  if (!location.hash) return null;
  let id = location.hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* Mantem o hash literal. */ }
  return root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
}

export function revealHash(root: ParentNode = document, focus = false): void {
  const target = resolveHashTarget(root);
  if (!target) return;
  const ancestors = queryAll<HTMLDetailsElement>("details", root)
    .filter((details) => (
      details === target
      || details.contains(target)
      || details.parentElement === target
    ))
    .sort((a, b) => a.contains(b) ? -1 : b.contains(a) ? 1 : 0);
  ancestors.forEach((details) => { details.open = true; });
  target.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  if (focus) {
    const focusTarget = target.matches("a,button,input,summary,[tabindex]")
      ? target
      : target.querySelector<HTMLElement>("a,button,input,summary,[tabindex]");
    focusTarget?.focus({ preventScroll: true });
  }
}

/**
 * Sincroniza apenas os paineis irmaos de primeiro nivel. O teste do elemento
 * que disparou o evento impede que um `details` de solucao, dica ou fonte
 * aninhado feche o complemento pai.
 */
export function mountExclusiveSupplementDetails(root: HTMLElement): () => void {
  return listen(root, "toggle", ((event: Event) => {
    const panel = event.target;
    if (!(panel instanceof HTMLDetailsElement) || !panel.open) return;
    if (!panel.matches(".supplement > .supplement__panel")) return;
    const supplement = panel.parentElement;
    const region = supplement?.parentElement;
    if (!supplement || !region) return;
    for (const sibling of Array.from(region.children)) {
      if (sibling === supplement || !sibling.classList.contains("supplement")) continue;
      const siblingPanel = sibling.querySelector<HTMLDetailsElement>(":scope > .supplement__panel");
      if (siblingPanel) siblingPanel.open = false;
    }
  }) as EventListener, true);
}

export function prefersReducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
