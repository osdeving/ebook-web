import { mountExclusiveSupplementDetails, revealHash } from "./accessibility";
import { createAnnouncer } from "./announce";
import { mountDrawer } from "./drawer";
import { listen, queryOptional, queryRequired } from "./dom";
import { mountLayers } from "./layers";
import { initializeMath } from "./math";
import { mountEnrichments } from "./mount";
import { mountNavigation } from "./navigation";
import { mountNotesAndBookmarks } from "./notes-bookmarks";
import { mountPreferences } from "./preferences";
import { mountPrint } from "./print";
import { mountReadingProgress } from "./progress";
import { mountSearch } from "./search";
import { createSafeStorage, defaultPreferences, validatePreferences } from "./storage";
import type { Disposable, EnrichmentDefinition, EnrichmentLayer, ReaderRuntimeOptions } from "./types";

export interface BootstrapReaderOptions extends ReaderRuntimeOptions {
  enrichments?: readonly EnrichmentDefinition[];
}

/**
 * Inicializa o leitor por modulos independentes. Uma falha em busca, notas ou
 * outro recurso nao impede o texto, a navegacao basica nem os demais modulos.
 * Nenhuma API e anexada a `window`.
 */
export async function bootstrapReader(options: BootstrapReaderOptions): Promise<Disposable> {
  const cleanups: Array<() => void> = [];
  const announce = createAnnouncer();
  const article = queryRequired<HTMLElement>(options.articleSelector ?? "[data-reader-content]");
  const main = queryRequired<HTMLElement>(options.mainSelector ?? "[data-reader-main]");
  const sidebar = queryRequired<HTMLElement>(options.sidebarSelector ?? "[data-reader-sidebar]");
  const storage = createSafeStorage(
    `${options.storagePrefix ?? "ebook-web"}.${options.chapterId}.reader.v1`,
    defaultPreferences,
    validatePreferences,
  );
  const preferences = storage.load();
  if (options.sourceHash && preferences.sourceHash !== options.sourceHash) {
    preferences.bookmarks = preferences.bookmarks.filter((id) => article.querySelector(`#${CSS.escape(id)}`));
    preferences.notes = Object.fromEntries(Object.entries(preferences.notes).filter(([id]) => article.querySelector(`#${CSS.escape(id)}`)));
    preferences.lastSection = undefined;
    preferences.sourceHash = options.sourceHash;
  }
  let persistTimer = 0;
  const persist = () => {
    window.clearTimeout(persistTimer);
    persistTimer = window.setTimeout(() => storage.save(preferences), 160);
  };
  cleanups.push(() => {
    window.clearTimeout(persistTimer);
    storage.save(preferences);
  });

  const safeMount = <T>(name: string, factory: () => T): T | undefined => {
    try { return factory(); }
    catch (error) {
      console.error(`[ebook-web] modulo ${name} indisponivel`, error);
      return undefined;
    }
  };

  let mounted: Awaited<ReturnType<typeof mountEnrichments>> | undefined;
  try {
    mounted = await mountEnrichments({
      chapterRoot: article,
      definitions: options.enrichments ?? [],
      announce,
    });
    cleanups.push(() => mounted?.destroy());
  } catch (error) {
    console.error("[ebook-web] modulo enrichments indisponivel", error);
  }

  const preferenceCleanup = safeMount("preferences", () => mountPreferences({ preferences, persist, announce }));
  if (preferenceCleanup) cleanups.push(preferenceCleanup);

  const navigation = safeMount("navigation", () => mountNavigation({
    sidebar,
    main,
    mobileQuery: options.mobileQuery,
    announce,
  }));
  if (navigation) cleanups.push(() => navigation.destroy());

  const drawerElement = queryOptional<HTMLElement>("[data-reader-drawer]");
  const drawer = drawerElement ? safeMount("drawer", () => mountDrawer({
    drawer: drawerElement,
    main,
    sidebar,
    announce,
  })) : undefined;
  if (drawer) cleanups.push(() => drawer.destroy());

  const layerCleanup = safeMount("layers", () => mountLayers({ root: article, preferences, persist, announce }));
  if (layerCleanup) cleanups.push(layerCleanup);
  const ensureLayer = (layer: EnrichmentLayer) => {
    if (!preferences.layers.includes(layer)) {
      preferences.layers.push(layer);
      article.querySelectorAll<HTMLElement>(`[data-layer="${layer}"]`).forEach((item) => { item.hidden = false; });
      document.querySelectorAll<HTMLInputElement>(`[data-layer-toggle="${layer}"]`).forEach((input) => { input.checked = true; });
      persist();
    }
  };

  const featureCleanups = [
    safeMount("math", () => initializeMath({ root: article })),
    safeMount("details", () => mountExclusiveSupplementDetails(article)),
    safeMount("notes-bookmarks", () => mountNotesAndBookmarks({ article, preferences, persist, announce })),
    safeMount("progress", () => mountReadingProgress({
      article,
      initialSection: preferences.lastSection,
      onSectionChange: (sectionId) => {
        preferences.lastSection = sectionId;
        persist();
      },
    })),
    safeMount("search", () => mountSearch({ article, ensureLayer })),
    safeMount("print", () => mountPrint({ drawer })),
    safeMount("hash", () => {
      const cleanup = listen(window, "hashchange", () => revealHash(article));
      requestAnimationFrame(() => revealHash(article));
      return cleanup;
    }),
  ].filter((cleanup): cleanup is () => void => Boolean(cleanup));
  cleanups.push(...featureCleanups);

  document.documentElement.dataset.readerReady = "true";
  const resetButton = queryOptional<HTMLButtonElement>("[data-reader-reset]");
  if (resetButton) cleanups.push(listen(resetButton, "click", () => {
    if (!window.confirm("Redefinir camadas, marcadores, notas e progresso deste capítulo?")) return;
    storage.clear();
    location.reload();
  }));
  if (!storage.available) announce("Preferências e notas ficarão disponíveis apenas nesta sessão.");
  return {
    destroy() {
      cleanups.reverse().forEach((cleanup) => {
        try { cleanup(); } catch (error) { console.error("[ebook-web] falha ao encerrar modulo", error); }
      });
      document.documentElement.removeAttribute("data-reader-ready");
    },
  };
}
