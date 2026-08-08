import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";
import { mountStudyProgress } from "./study-progress";
import type { ReaderPreferences } from "./types";

describe("progresso de estudo", () => {
  beforeEach(() => {
    const { document, window } = parseHTML(`
      <html><body>
        <div data-study-progress-summary>
          <span data-progress-sections></span><progress data-progress-sections-meter></progress>
          <span data-progress-exercises></span><progress data-progress-exercises-meter></progress>
          <span data-progress-active></span>
        </div>
        <main id="article">
          <section id="sec-1"><h2>Seção</h2><div class="enrichment-section-tools"></div>
            <div class="exercise" id="exercicio-1"><p>Questão</p></div>
          </section>
        </main>
      </body></html>
    `);
    vi.stubGlobal("document", document);
    vi.stubGlobal("window", window);
  });

  it("cicla entre em andamento, concluído e não iniciado", () => {
    const preferences: ReaderPreferences = {
      theme: "light",
      scale: 1,
      layers: [],
      bookmarks: [],
      textBookmarks: [],
      inkNotes: [],
      notes: {},
      progress: {},
    };
    const persist = vi.fn();
    const article = document.querySelector<HTMLElement>("#article")!;
    const cleanup = mountStudyProgress({ article, preferences, persist, announce: vi.fn() });
    const button = article.querySelector<HTMLButtonElement>('[data-study-progress-id="exercicio-1"]')!;

    button.click();
    expect(preferences.progress["exercicio-1"]).toBe("started");
    button.click();
    expect(preferences.progress["exercicio-1"]).toBe("completed");
    expect(document.querySelector("[data-progress-exercises]")?.textContent).toBe("1/1");
    button.click();
    expect(preferences.progress["exercicio-1"]).toBeUndefined();
    expect(persist).toHaveBeenCalledTimes(3);
    cleanup();
  });
});
