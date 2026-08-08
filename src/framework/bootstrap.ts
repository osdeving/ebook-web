import { mountExclusiveSupplementDetails, resolveHashTarget, revealHash } from "./accessibility";
import { createAnnouncer } from "./announce";
import { mountBacklinks } from "./backlinks";
import { mountCrossReferencePreviews } from "./cross-reference-previews";
import { mountDrawer } from "./drawer";
import { listen, queryOptional, queryRequired } from "./dom";
import { mountLayers } from "./layers";
import { initializeMath } from "./math";
import { mountEnrichments } from "./mount";
import { mountNavigation } from "./navigation";
import { mountNotesAndBookmarks } from "./notes-bookmarks";
import { mountSourcePermalinks } from "./permalinks";
import { mountPreferences } from "./preferences";
import { mountPrint } from "./print";
import { mountReadingProgress } from "./progress";
import { mountSearch } from "./search";
import { mountStudyProgress } from "./study-progress";
import { createSafeStorage, defaultPreferences, validatePreferences } from "./storage";
import {
  ENRICHMENT_LAYERS,
  type Disposable,
  type EnrichmentDefinition,
  type EnrichmentLayer,
  type ReaderDiscoveryData,
  type ReaderRuntimeOptions,
} from "./types";

export interface BootstrapReaderOptions extends ReaderRuntimeOptions {
  enrichments?: readonly EnrichmentDefinition[];
  discovery?: ReaderDiscoveryData;
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
  let sourceStateChanged = false;
  if (options.sourceHash && preferences.sourceHash !== options.sourceHash) {
    preferences.bookmarks = preferences.bookmarks.filter((id) => article.querySelector(`#${CSS.escape(id)}`));
    // Marcadores de linha e rascunhos usam deslocamentos no texto renderizado.
    // Uma nova fonte pode deslocá-los para outra frase, portanto é mais seguro
    // invalidá-los do que exibir uma taxinha em uma posição enganosa.
    preferences.textBookmarks = [];
    preferences.inkNotes = [];
    preferences.notes = Object.fromEntries(Object.entries(preferences.notes).filter(([id]) => article.querySelector(`#${CSS.escape(id)}`)));
    preferences.progress = Object.fromEntries(Object.entries(preferences.progress).filter(([id]) => article.querySelector(`#${CSS.escape(id)}`)));
    preferences.lastSection = undefined;
    preferences.sourceHash = options.sourceHash;
    sourceStateChanged = true;
  }
  let persistTimer = 0;
  let storageFailureAnnounced = false;
  const savePreferences = () => {
    const saved = storage.save(preferences);
    if (!saved && storage.available && !storageFailureAnnounced) {
      storageFailureAnnounced = true;
      announce("O armazenamento do navegador está cheio ou indisponível. A última alteração ainda não foi salva.");
    } else if (saved) {
      storageFailureAnnounced = false;
    }
    return saved || !storage.available;
  };
  const persistNow = () => {
    window.clearTimeout(persistTimer);
    persistTimer = 0;
    return savePreferences();
  };
  const persist = () => {
    window.clearTimeout(persistTimer);
    persistTimer = window.setTimeout(() => {
      persistTimer = 0;
      savePreferences();
    }, 160);
  };
  if (sourceStateChanged) persistNow();
  cleanups.push(listen(window, "pagehide", () => { persistNow(); }));
  cleanups.push(listen(document, "visibilitychange", () => {
    if (document.visibilityState === "hidden") persistNow();
  }));
  cleanups.push(() => { persistNow(); });

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

  const backlinksCleanup = safeMount("backlinks", () => mountBacklinks({
    article,
    backlinks: options.discovery?.backlinks ?? {},
  }));
  if (backlinksCleanup) cleanups.push(backlinksCleanup);

  const layerController = safeMount("layers", () => mountLayers({ root: article, preferences, persist, announce }));
  if (layerController) cleanups.push(() => layerController.destroy());
  const ensureLayer = (layer: EnrichmentLayer) => {
    if (layerController) {
      layerController.ensure(layer);
      return;
    }
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
    safeMount("notes-bookmarks", () => mountNotesAndBookmarks({ article, preferences, persist, persistNow, announce })),
    safeMount("study-progress", () => mountStudyProgress({ article, preferences, persist, announce })),
    safeMount("permalinks", () => mountSourcePermalinks(article)),
    safeMount("cross-reference-previews", () => mountCrossReferencePreviews({
      article,
      previews: options.discovery?.previews ?? {},
    })),
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
      const revealCurrentHash = () => {
        const target = resolveHashTarget(article);
        const layer = target
          ?.closest<HTMLElement>("[data-origin=\"editorial\"][data-layer]")
          ?.dataset.layer;
        if (layer && ENRICHMENT_LAYERS.includes(layer as EnrichmentLayer)) {
          ensureLayer(layer as EnrichmentLayer);
        }
        revealHash(article);
      };
      const cleanup = listen(window, "hashchange", revealCurrentHash);
      requestAnimationFrame(revealCurrentHash);
      return cleanup;
    }),
  ].filter((cleanup): cleanup is () => void => Boolean(cleanup));
  cleanups.push(...featureCleanups);

  document.documentElement.dataset.readerReady = "true";
  const resetButton = queryOptional<HTMLButtonElement>("[data-reader-reset]");
  if (resetButton) cleanups.push(listen(resetButton, "click", () => {
    if (!window.confirm("Redefinir camadas, marcadores, rascunhos, notas e progresso deste capítulo?")) return;
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
