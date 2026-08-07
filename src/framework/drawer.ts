import { createFocusTrap } from "./accessibility";
import { getFocusable, listen, queryOptional, setInert } from "./dom";

export interface DrawerOptions {
  drawer: HTMLElement;
  main: HTMLElement;
  sidebar?: HTMLElement | null;
  mobileQuery?: string;
  announce(message: string): void;
}

export interface DrawerController {
  open(): void;
  close(restoreFocus?: boolean): void;
  isOpen(): boolean;
  destroy(): void;
}

export function mountDrawer(options: DrawerOptions): DrawerController {
  const media = matchMedia(options.mobileQuery ?? "(max-width: 760px)");
  const openButton = queryOptional<HTMLButtonElement>("[data-reader-drawer-open]");
  const closeButton = options.drawer.querySelector<HTMLButtonElement>("[data-reader-drawer-close]");
  const backdrop = queryOptional<HTMLButtonElement>("[data-reader-drawer-backdrop]");
  const cleanups: Array<() => void> = [];
  const priorBackgroundState = new Map<HTMLElement, { inert: boolean; ariaHidden: string | null }>();
  let priorFocus: HTMLElement | null = null;

  const isOpen = () => document.body.classList.contains("reader-drawer-open");
  const sync = () => {
    if (!media.matches) document.body.classList.remove("reader-drawer-open");
    const open = media.matches && isOpen();
    openButton?.setAttribute("aria-expanded", String(open));
    if (backdrop) backdrop.hidden = !open;
    if (media.matches) {
      setInert(options.drawer, !open);
      setBackgroundInert(open);
      options.drawer.toggleAttribute("role", open);
      if (open) {
        options.drawer.setAttribute("role", "dialog");
        options.drawer.setAttribute("aria-modal", "true");
      } else {
        options.drawer.removeAttribute("role");
        options.drawer.removeAttribute("aria-modal");
      }
    } else {
      setInert(options.drawer, false);
      setBackgroundInert(false);
      options.drawer.removeAttribute("role");
      options.drawer.removeAttribute("aria-modal");
    }
  };
  const setBackgroundInert = (makeInert: boolean) => {
    if (!makeInert) {
      for (const [element, previous] of priorBackgroundState) {
        element.inert = previous.inert;
        if (previous.ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", previous.ariaHidden);
      }
      priorBackgroundState.clear();
      return;
    }
    let branch: HTMLElement = options.drawer;
    while (branch.parentElement) {
      const parent = branch.parentElement;
      for (const sibling of Array.from(parent.children)) {
        if (!(sibling instanceof HTMLElement) || sibling === branch) continue;
        // O backdrop precisa continuar clicavel para fechar o dialogo.
        if (sibling.matches("[data-reader-drawer-backdrop]")) continue;
        if (!priorBackgroundState.has(sibling)) {
          priorBackgroundState.set(sibling, {
            inert: sibling.inert,
            ariaHidden: sibling.getAttribute("aria-hidden"),
          });
        }
        setInert(sibling, true);
      }
      branch = parent;
      if (parent === document.body) break;
    }
  };
  const open = () => {
    if (!media.matches) return;
    priorFocus = document.activeElement instanceof HTMLElement ? document.activeElement : openButton;
    document.body.classList.add("reader-drawer-open");
    sync();
    requestAnimationFrame(() => (closeButton ?? getFocusable(options.drawer)[0])?.focus());
  };
  const close = (restoreFocus = true) => {
    const wasOpen = isOpen();
    document.body.classList.remove("reader-drawer-open");
    sync();
    if (wasOpen && restoreFocus) priorFocus?.focus();
    priorFocus = null;
  };

  if (openButton) cleanups.push(listen(openButton, "click", open));
  if (closeButton) cleanups.push(listen(closeButton, "click", () => close(true)));
  if (backdrop) cleanups.push(listen(backdrop, "click", () => close(true)));
  cleanups.push(listen(options.drawer, "keydown", createFocusTrap(options.drawer)));
  cleanups.push(listen(document, "keydown", (event) => {
    if (event.key === "Escape" && isOpen()) close(true);
  }));
  const mediaChange = () => sync();
  media.addEventListener("change", mediaChange);
  cleanups.push(() => media.removeEventListener("change", mediaChange));
  sync();

  return {
    open,
    close,
    isOpen,
    destroy: () => {
      setBackgroundInert(false);
      cleanups.reverse().forEach((cleanup) => cleanup());
    },
  };
}
