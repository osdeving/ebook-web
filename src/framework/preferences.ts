import { listen, queryAll } from "./dom";
import type { ReaderPreferences } from "./types";

export interface PreferenceControllerOptions {
  preferences: ReaderPreferences;
  persist(): void;
  announce(message: string): void;
}

export function mountPreferences(options: PreferenceControllerOptions): () => void {
  const root = document.documentElement;
  const cleanups: Array<() => void> = [];

  const applyTheme = () => {
    root.dataset.theme = options.preferences.theme;
    try { localStorage.setItem("ebook-web.theme", options.preferences.theme); }
    catch { /* o tema continua válido apenas nesta sessão */ }
  };
  const applyScale = () => {
    const scale = Math.min(1.2, Math.max(0.88, options.preferences.scale));
    options.preferences.scale = scale;
    root.style.setProperty("--reader-scale", scale.toFixed(2));
  };
  const toggleTheme = () => {
    options.preferences.theme = options.preferences.theme === "dark" ? "light" : "dark";
    applyTheme();
    options.persist();
    options.announce(`Tema ${options.preferences.theme === "dark" ? "escuro" : "claro"} ativado.`);
  };

  applyTheme();
  applyScale();

  queryAll<HTMLElement>("[data-reader-theme]").forEach((button) => {
    cleanups.push(listen(button, "click", toggleTheme));
  });
  queryAll<HTMLElement>("[data-reader-font-down]").forEach((button) => {
    cleanups.push(listen(button, "click", () => {
      options.preferences.scale -= 0.06;
      applyScale();
      options.persist();
    }));
  });
  queryAll<HTMLElement>("[data-reader-font-up]").forEach((button) => {
    cleanups.push(listen(button, "click", () => {
      options.preferences.scale += 0.06;
      applyScale();
      options.persist();
    }));
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}
