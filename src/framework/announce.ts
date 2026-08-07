import { queryOptional } from "./dom";

export function createAnnouncer(selector = "[data-reader-live]"): (message: string) => void {
  const live = queryOptional<HTMLElement>(selector);
  return (message: string) => {
    if (!live) return;
    live.textContent = "";
    requestAnimationFrame(() => { live.textContent = message; });
  };
}
