import { listen } from "./dom";
import type { ReaderTargetPreview } from "./types";

export interface CrossReferencePreviewOptions {
  article: HTMLElement;
  previews: Record<string, ReaderTargetPreview>;
}

export function mountCrossReferencePreviews(options: CrossReferencePreviewOptions): () => void {
  const links = Array.from(options.article.querySelectorAll<HTMLAnchorElement>("a[data-source-xref][href]"));
  if (!links.length) return () => undefined;

  const popover = createPopover();
  const kind = popover.querySelector<HTMLElement>("[data-xref-preview-kind]")!;
  const title = popover.querySelector<HTMLElement>("[data-xref-preview-title]")!;
  const excerpt = popover.querySelector<HTMLElement>("[data-xref-preview-excerpt]")!;
  document.body.append(popover);

  let active: HTMLAnchorElement | undefined;
  let hideTimer = 0;
  let lastPointerType = "mouse";
  let armedTouchLink: HTMLAnchorElement | undefined;

  const cancelHide = () => window.clearTimeout(hideTimer);
  const hide = (restoreFocus = false) => {
    cancelHide();
    popover.hidden = true;
    active?.removeAttribute("aria-describedby");
    if (restoreFocus) active?.focus({ preventScroll: true });
    active = undefined;
    armedTouchLink = undefined;
  };
  const scheduleHide = () => {
    cancelHide();
    hideTimer = window.setTimeout(() => {
      if (!popover.matches(":hover") && !popover.contains(document.activeElement)) hide();
    }, 180);
  };
  const show = (link: HTMLAnchorElement) => {
    cancelHide();
    const preview = options.previews[link.getAttribute("href") ?? ""] ?? previewFromPage(link);
    if (!preview) return;
    active?.removeAttribute("aria-describedby");
    active = link;
    kind.textContent = preview.kind;
    title.textContent = preview.title;
    excerpt.textContent = preview.excerpt;
    link.setAttribute("aria-describedby", popover.id);
    popover.hidden = false;
    positionPopover(popover, link);
  };

  const cleanups: Array<() => void> = [];
  for (const link of links) {
    cleanups.push(
      listen(link, "pointerdown", ((event: PointerEvent) => { lastPointerType = event.pointerType; }) as EventListener),
      listen(link, "pointerenter", () => show(link)),
      listen(link, "pointerleave", scheduleHide),
      listen(link, "focus", () => show(link)),
      listen(link, "blur", scheduleHide),
      listen(link, "click", ((event: MouseEvent) => {
        if (lastPointerType !== "touch" && lastPointerType !== "pen") return;
        if (armedTouchLink === link && !popover.hidden) return;
        event.preventDefault();
        armedTouchLink = link;
        show(link);
      }) as EventListener),
    );
  }
  cleanups.push(
    listen(popover, "pointerenter", cancelHide),
    listen(popover, "pointerleave", scheduleHide),
    listen(document, "pointerdown", ((event: PointerEvent) => {
      const target = event.target as Node;
      if (!popover.hidden && !popover.contains(target) && !active?.contains(target)) hide();
    }) as EventListener),
    listen(document, "keydown", ((event: KeyboardEvent) => {
      if (event.key === "Escape" && !popover.hidden) {
        event.preventDefault();
        hide(true);
      }
    }) as EventListener),
    listen(window, "resize", () => active && positionPopover(popover, active), { passive: true }),
    listen(window, "scroll", () => {
      if (!popover.hidden) hide();
    }, { passive: true }),
  );

  return () => {
    cancelHide();
    cleanups.reverse().forEach((cleanup) => cleanup());
    active?.removeAttribute("aria-describedby");
    popover.remove();
  };
}

function createPopover(): HTMLElement {
  const root = document.createElement("aside");
  root.id = "source-xref-preview";
  root.className = "xref-preview";
  root.dataset.origin = "editorial";
  root.dataset.screenOnly = "";
  root.setAttribute("role", "tooltip");
  root.hidden = true;
  const kind = document.createElement("span");
  kind.className = "xref-preview__kind";
  kind.dataset.xrefPreviewKind = "";
  const title = document.createElement("strong");
  title.className = "xref-preview__title";
  title.dataset.xrefPreviewTitle = "";
  const excerpt = document.createElement("p");
  excerpt.className = "xref-preview__excerpt";
  excerpt.dataset.xrefPreviewExcerpt = "";
  const touchHelp = document.createElement("span");
  touchHelp.className = "xref-preview__touch-help";
  touchHelp.textContent = "Em telas de toque, toque novamente para abrir.";
  root.append(kind, title, excerpt, touchHelp);
  return root;
}

function previewFromPage(link: HTMLAnchorElement): ReaderTargetPreview | undefined {
  if (!link.hash || new URL(link.href).pathname !== location.pathname) return undefined;
  const target = document.getElementById(decodeFragment(link.hash.slice(1)));
  if (!target) return undefined;
  const semantic = target.querySelector<HTMLElement>(".semantic-label")?.textContent?.trim();
  const heading = target.querySelector<HTMLElement>(".semantic-title, h2, h3, .exercise-number, figcaption, caption")?.textContent?.replace(/\s+/gu, " ").trim();
  return {
    kind: semantic ?? "Referência interna",
    title: heading || link.textContent?.trim() || target.id,
    excerpt: truncate(target.textContent?.replace(/\s+/gu, " ").trim() ?? ""),
    href: link.getAttribute("href") ?? link.href,
  };
}

function positionPopover(popover: HTMLElement, link: HTMLAnchorElement): void {
  const anchor = link.getBoundingClientRect();
  const margin = 12;
  const width = Math.min(390, innerWidth - margin * 2);
  popover.style.width = `${width}px`;
  popover.style.left = `${Math.max(margin, Math.min(anchor.left, innerWidth - width - margin))}px`;
  const measured = popover.getBoundingClientRect();
  const below = anchor.bottom + margin;
  const above = anchor.top - measured.height - margin;
  popover.style.top = `${below + measured.height <= innerHeight || above < margin ? below : above}px`;
}

function decodeFragment(value: string): string {
  try { return decodeURIComponent(value); }
  catch { return value; }
}

function truncate(value: string, limit = 280): string {
  return value.length <= limit ? value : `${value.slice(0, limit).trim()}…`;
}
