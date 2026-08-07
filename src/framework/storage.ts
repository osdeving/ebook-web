import type { ReaderPreferences } from "./types";

const SCHEMA_VERSION = 1;

export interface SafeStorage<T> {
  readonly available: boolean;
  readonly key: string;
  load(): T;
  save(value: T): boolean;
  clear(): boolean;
}

export interface StorageEnvelope<T> {
  schema: number;
  value: T;
}

export function defaultPreferences(): ReaderPreferences {
  const appliedTheme = typeof document !== "undefined"
    ? document.documentElement.dataset.theme
    : undefined;
  const theme = appliedTheme === "dark" || appliedTheme === "light"
    ? appliedTheme
    : typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  return {
    theme,
    scale: 1,
    layers: ["explanation", "lab", "practice", "history", "reading"],
    bookmarks: [],
    notes: {},
    progress: {},
  };
}

function localStorageAvailable(): boolean {
  try {
    const probe = "__ebook_web_probe__";
    localStorage.setItem(probe, probe);
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function createSafeStorage<T>(
  key: string,
  fallback: () => T,
  validate: (candidate: unknown, fallbackValue: T) => T,
): SafeStorage<T> {
  const available = localStorageAvailable();
  let memoryValue = fallback();

  return {
    available,
    key,
    load(): T {
      if (!available) return memoryValue;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback();
        const envelope = JSON.parse(raw) as StorageEnvelope<unknown>;
        if (envelope.schema !== SCHEMA_VERSION) return fallback();
        memoryValue = validate(envelope.value, fallback());
        return memoryValue;
      } catch {
        return memoryValue;
      }
    },
    save(value: T): boolean {
      memoryValue = value;
      if (!available) return false;
      try {
        localStorage.setItem(key, JSON.stringify({ schema: SCHEMA_VERSION, value }));
        return true;
      } catch {
        return false;
      }
    },
    clear(): boolean {
      memoryValue = fallback();
      if (!available) return false;
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
  };
}

export function validatePreferences(
  candidate: unknown,
  fallback: ReaderPreferences = defaultPreferences(),
): ReaderPreferences {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return fallback;
  const value = candidate as Partial<ReaderPreferences>;
  const layerNames = new Set(fallback.layers);
  const layers = Array.isArray(value.layers)
    ? value.layers.filter((layer): layer is ReaderPreferences["layers"][number] => (
        typeof layer === "string" && layerNames.has(layer as ReaderPreferences["layers"][number])
      ))
    : fallback.layers;
  const bookmarks = Array.isArray(value.bookmarks)
    ? [...new Set(value.bookmarks.filter((id): id is string => typeof id === "string"))]
    : [];
  const notes = value.notes && typeof value.notes === "object" && !Array.isArray(value.notes)
    ? Object.fromEntries(Object.entries(value.notes).filter(([id, note]) => (
        id.length > 0 && typeof note === "string"
      )))
    : {};
  const progress = value.progress && typeof value.progress === "object" && !Array.isArray(value.progress)
    ? Object.fromEntries(Object.entries(value.progress).filter(([id, state]) => (
        id.length > 0 && (state === "started" || state === "completed")
      ))) as ReaderPreferences["progress"]
    : {};

  return {
    theme: value.theme === "dark" || value.theme === "light" ? value.theme : fallback.theme,
    scale: Number.isFinite(value.scale) ? Math.min(1.2, Math.max(0.88, Number(value.scale))) : 1,
    layers,
    bookmarks,
    notes,
    progress,
    lastSection: typeof value.lastSection === "string" ? value.lastSection : undefined,
    sourceHash: typeof value.sourceHash === "string" ? value.sourceHash : undefined,
  };
}
