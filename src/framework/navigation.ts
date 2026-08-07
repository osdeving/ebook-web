import { createFocusTrap, prefersReducedMotion } from "./accessibility";
import { getFocusable, listen, queryOptional, setInert } from "./dom";

export interface NavigationOptions {
  sidebar: HTMLElement;
  main: HTMLElement;
  mobileQuery?: string;
  announce(message: string): void;
}

export interface NavigationController {
  closeMenu(restoreFocus?: boolean): void;
  closeFocusMode(): void;
  destroy(): void;
}

export function mountNavigation(options: NavigationOptions): NavigationController {
  const media = matchMedia(options.mobileQuery ?? "(max-width: 980px)");
  const body = document.body;
  const menuButton = queryOptional<HTMLButtonElement>("[data-reader-menu]");
  const backdrop = queryOptional<HTMLButtonElement>("[data-reader-menu-backdrop]");
  const focusButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-reader-focus]"));
  const focusExit = queryOptional<HTMLButtonElement>("[data-reader-focus-exit]");
  const cleanups: Array<() => void> = [];
  let priorMenuFocus: HTMLElement | null = null;
  let priorFocusModeFocus: HTMLElement | null = null;

  const menuOpen = () => media.matches && body.classList.contains("menu-open") && !body.classList.contains("focus-mode");
  const sync = () => {
    if (!media.matches || body.classList.contains("focus-mode")) body.classList.remove("menu-open");
    const open = menuOpen();
    menuButton?.setAttribute("aria-expanded", String(open));
    if (backdrop) backdrop.hidden = !open;
    setInert(options.main, open);
    if (media.matches) setInert(options.sidebar, !open);
    else setInert(options.sidebar, false);
    const focusMode = body.classList.contains("focus-mode");
    focusButtons.forEach((button) => button.setAttribute("aria-pressed", String(focusMode)));
  };

  const closeMenu = (restoreFocus = false) => {
    const wasOpen = menuOpen();
    body.classList.remove("menu-open");
    sync();
    if (wasOpen && restoreFocus) priorMenuFocus?.focus();
    priorMenuFocus = null;
  };

  const openMenu = () => {
    if (!media.matches || body.classList.contains("focus-mode")) return;
    priorMenuFocus = document.activeElement instanceof HTMLElement ? document.activeElement : menuButton;
    body.classList.add("menu-open");
    sync();
    requestAnimationFrame(() => getFocusable(options.sidebar)[0]?.focus());
  };

  const closeFocusMode = () => {
    if (!body.classList.contains("focus-mode")) return;
    body.classList.remove("focus-mode");
    sync();
    priorFocusModeFocus?.focus();
    priorFocusModeFocus = null;
    options.announce("Modo de foco encerrado.");
  };

  const toggleFocusMode = () => {
    const entering = !body.classList.contains("focus-mode");
    if (entering) {
      priorFocusModeFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      closeMenu(false);
      body.classList.add("focus-mode");
      options.announce("Modo de foco ativado.");
      requestAnimationFrame(() => focusExit?.focus());
    } else closeFocusMode();
    sync();
  };

  if (menuButton) cleanups.push(listen(menuButton, "click", () => menuOpen() ? closeMenu(true) : openMenu()));
  if (backdrop) cleanups.push(listen(backdrop, "click", () => closeMenu(true)));
  cleanups.push(listen(options.sidebar, "keydown", createFocusTrap(options.sidebar)));
  cleanups.push(listen(options.sidebar, "click", ((event: Event) => {
    if ((event.target as Element).closest("a[href]")) closeMenu(false);
  }) as EventListener));
  focusButtons.forEach((button) => cleanups.push(listen(button, "click", toggleFocusMode)));
  if (focusExit) cleanups.push(listen(focusExit, "click", closeFocusMode));
  cleanups.push(listen(document, "keydown", (event) => {
    if (event.key !== "Escape") return;
    if (menuOpen()) closeMenu(true);
    else closeFocusMode();
  }));
  const onMediaChange = () => sync();
  media.addEventListener("change", onMediaChange);
  cleanups.push(() => media.removeEventListener("change", onMediaChange));

  const backTop = queryOptional<HTMLButtonElement>("[data-reader-back-top]");
  if (backTop) cleanups.push(listen(backTop, "click", () => {
    scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }));
  sync();

  return {
    closeMenu,
    closeFocusMode,
    destroy: () => cleanups.reverse().forEach((cleanup) => cleanup()),
  };
}
