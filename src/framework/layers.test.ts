import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseHTML } from "linkedom";
import { mountLayers } from "./layers";
import type { ReaderPreferences } from "./types";

describe("controle de camadas", () => {
  beforeEach(() => {
    const { document, window } = parseHTML(`
      <html><body>
        <label><input type="checkbox" data-layer-toggle="practice"></label>
        <main id="article"><aside data-layer="practice"></aside></main>
      </body></html>
    `);
    vi.stubGlobal("document", document);
    vi.stubGlobal("CustomEvent", window.CustomEvent);
  });

  it("reativa e persiste uma camada solicitada por deep link", () => {
    const article = document.querySelector<HTMLElement>("#article")!;
    const practice = article.querySelector<HTMLElement>("[data-layer=\"practice\"]")!;
    const toggle = document.querySelector<HTMLInputElement>("[data-layer-toggle=\"practice\"]")!;
    const preferences: ReaderPreferences = {
      theme: "light",
      scale: 1,
      layers: [],
      bookmarks: [],
      notes: {},
      progress: {},
    };
    const persist = vi.fn();
    const controller = mountLayers({
      root: article,
      preferences,
      persist,
      announce: vi.fn(),
    });

    expect(practice.hidden).toBe(true);
    expect(toggle.checked).toBe(false);

    controller.ensure("practice");

    expect(practice.hidden).toBe(false);
    expect(toggle.checked).toBe(true);
    expect(preferences.layers).toEqual(["practice"]);
    expect(persist).toHaveBeenCalledOnce();
    controller.destroy();
  });
});
