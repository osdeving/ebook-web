import { listen, queryAll, queryOptional } from "./dom";
import type { DrawerController } from "./drawer";
import { renderMath } from "./math";

export interface PrintOptions {
  drawer?: DrawerController;
}

export function mountPrint(options: PrintOptions = {}): () => void {
  let openBefore: HTMLDetailsElement[] = [];
  const prepare = () => {
    options.drawer?.close(false);
    openBefore = queryAll<HTMLDetailsElement>("details[open]");
    queryAll<HTMLDetailsElement>("main details:not([hidden])").forEach((details) => { details.open = true; });
    queryAll<HTMLElement>("[data-enrichment-body]").forEach((body) => {
      if (body.dataset.mathRendered === "true") return;
      renderMath(body);
      body.dataset.mathRendered = "true";
    });
    document.body.classList.add("is-printing");
  };
  const restore = () => {
    const originallyOpen = new Set(openBefore);
    queryAll<HTMLDetailsElement>("main details").forEach((details) => { details.open = originallyOpen.has(details); });
    document.body.classList.remove("is-printing");
    openBefore = [];
  };
  const beforeCleanup = listen(window, "beforeprint", prepare);
  const afterCleanup = listen(window, "afterprint", restore);
  const button = queryOptional<HTMLButtonElement>("[data-reader-print]");
  const clickCleanup = button ? listen(button, "click", () => {
    prepare();
    requestAnimationFrame(() => window.print());
  }) : undefined;
  return () => {
    beforeCleanup();
    afterCleanup();
    clickCleanup?.();
  };
}
