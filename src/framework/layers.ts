import { ENRICHMENT_LAYERS, type EnrichmentLayer, type ReaderPreferences } from "./types";
import { dispatch, listen, queryAll } from "./dom";

const PRESETS: Record<string, readonly EnrichmentLayer[]> = {
  source: [],
  guided: ["explanation", "practice"],
  explore: ENRICHMENT_LAYERS,
};

export interface LayerOptions {
  root: HTMLElement;
  preferences: ReaderPreferences;
  persist(): void;
  announce(message: string): void;
}

export interface LayerController {
  ensure(layer: EnrichmentLayer): void;
  destroy(): void;
}

export function mountLayers(options: LayerOptions): LayerController {
  const cleanups: Array<() => void> = [];
  const active = new Set(options.preferences.layers);

  const apply = (persist = true) => {
    ENRICHMENT_LAYERS.forEach((layer) => {
      const visible = active.has(layer);
      options.root.querySelectorAll<HTMLElement>(`[data-layer="${layer}"]`).forEach((item) => {
        item.hidden = !visible;
      });
      queryAll<HTMLInputElement>(`[data-layer-toggle="${layer}"]`).forEach((input) => { input.checked = visible; });
      const count = options.root.querySelectorAll(`[data-layer="${layer}"]`).length;
      queryAll<HTMLElement>(`[data-layer-count="${layer}"]`).forEach((label) => { label.textContent = String(count); });
    });
    options.preferences.layers = [...active];
    if (persist) options.persist();
    syncPresets(active);
    dispatch("ebook:layers-change", { layers: [...active] }, options.root);
  };

  queryAll<HTMLInputElement>("[data-layer-toggle]").forEach((input) => {
    cleanups.push(listen(input, "change", () => {
      const layer = input.dataset.layerToggle as EnrichmentLayer;
      if (!ENRICHMENT_LAYERS.includes(layer)) return;
      if (input.checked) active.add(layer);
      else active.delete(layer);
      apply();
      options.announce(`Camada ${input.checked ? "ativada" : "ocultada"}.`);
    }));
  });
  queryAll<HTMLButtonElement>("[data-layer-preset]").forEach((button) => {
    cleanups.push(listen(button, "click", () => {
      const layers = PRESETS[button.dataset.layerPreset ?? ""];
      if (!layers) return;
      active.clear();
      layers.forEach((layer) => active.add(layer));
      apply();
      options.announce(`Modo de leitura ${button.textContent?.trim() ?? "selecionado"}.`);
    }));
  });
  apply(false);
  return {
    ensure(layer) {
      if (active.has(layer)) return;
      active.add(layer);
      apply();
    },
    destroy() {
      cleanups.forEach((cleanup) => cleanup());
    },
  };
}

function syncPresets(active: ReadonlySet<EnrichmentLayer>): void {
  queryAll<HTMLButtonElement>("[data-layer-preset]").forEach((button) => {
    const expected = PRESETS[button.dataset.layerPreset ?? ""] ?? [];
    const selected = expected.length === active.size && expected.every((layer) => active.has(layer));
    button.setAttribute("aria-pressed", String(selected));
    button.classList.toggle("is-active", selected);
  });
}
