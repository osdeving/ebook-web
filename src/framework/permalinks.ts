const PERMALINK_TARGETS = [
  ".semantic[id]",
  ".algorithm[id]",
  ".proof[id]",
  ".exercise[id]",
  ".equation[id]",
  ".numbered-equation[id]",
  ".figure[id]",
  "figure[id]",
  ".table-wrap[id]",
  "table[id]",
].join(", ");

/**
 * Acrescenta controles de permalink sem inserir texto na camada-fonte.
 * O simbolo visivel vem de CSS; `aria-label` fornece o nome acessivel.
 */
export function mountSourcePermalinks(root: HTMLElement): () => void {
  const links: HTMLAnchorElement[] = [];
  const placements = new Set<HTMLElement>();

  for (const target of Array.from(root.querySelectorAll<HTMLElement>(PERMALINK_TARGETS))) {
    if (!target.id || root.querySelector(`[data-source-permalink="${cssEscape(target.id)}"]`)) continue;

    const link = document.createElement("a");
    link.className = "source-permalink";
    link.href = `#${target.id}`;
    link.dataset.sourcePermalink = target.id;
    link.dataset.screenOnly = "";
    const label = describeTarget(target);
    link.setAttribute("aria-label", `Link permanente para ${label}`);
    link.title = `Link permanente para ${label}`;

    const placement = target.matches("table") && target.parentElement
      ? target.parentElement
      : target;
    placement.classList.add("has-source-permalink");
    placements.add(placement);
    if (placement === target) target.prepend(link);
    else target.before(link);
    links.push(link);
  }

  return () => {
    links.forEach((link) => link.remove());
    placements.forEach((placement) => placement.classList.remove("has-source-permalink"));
  };
}

function describeTarget(target: HTMLElement): string {
  const semanticLabel = target.querySelector<HTMLElement>(".semantic-label")?.textContent?.trim();
  const semanticTitle = target.querySelector<HTMLElement>(".semantic-title")?.textContent?.trim();
  const visibleLabel = [semanticLabel, semanticTitle].filter(Boolean).join(" ")
    || target.querySelector<HTMLElement>(
      ".exercise-number, .equation-number, figcaption, caption, h3, h4",
    )?.textContent?.replace(/\s+/gu, " ").trim();
  return visibleLabel || target.id;
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`);
}
