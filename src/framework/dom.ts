export type Cleanup = () => void;

export function queryRequired<T extends Element>(
  selector: string,
  root: ParentNode = document,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Elemento obrigatorio ausente: ${selector}`);
  return element;
}

export function queryOptional<T extends Element>(
  selector: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector<T>(selector);
}

export function queryAll<T extends Element>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`);
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

export function isVisible(element: HTMLElement): boolean {
  return !element.hidden && element.getClientRects().length > 0;
}

export function getFocusable(root: ParentNode): HTMLElement[] {
  return queryAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), details > summary, [tabindex]:not([tabindex="-1"])',
    root,
  ).filter(isVisible);
}

export function listen<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean,
): Cleanup;
export function listen<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  listener: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean,
): Cleanup;
export function listen<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean,
): Cleanup;
export function listen(
  target: EventTarget,
  type: string,
  listener: EventListener,
  options?: AddEventListenerOptions | boolean,
): Cleanup;
export function listen(
  target: EventTarget,
  type: string,
  listener: EventListener,
  options?: AddEventListenerOptions | boolean,
): Cleanup {
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}

export function composeCleanup(...cleanups: Array<Cleanup | undefined>): Cleanup {
  return () => {
    for (const cleanup of cleanups.reverse()) cleanup?.();
  };
}

export function afterPaint(callback: () => void): number {
  return requestAnimationFrame(() => requestAnimationFrame(callback));
}

export function setInert(element: HTMLElement | null, value: boolean): void {
  if (!element) return;
  element.inert = value;
  if (value) element.setAttribute("aria-hidden", "true");
  else element.removeAttribute("aria-hidden");
}

export function dispatch<T>(name: string, detail: T, target: EventTarget = document): void {
  target.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}
