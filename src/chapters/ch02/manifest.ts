import rawManifest from "./manifest.json";

export interface ChapterManifest {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  sourceHash: string;
  textLength: number;
  toc: ReadonlyArray<{ id: string; number: string; title: string; depth: 1 | 2 | 3 }>;
  sourceOrder: readonly string[];
}

function defineManifest(value: ChapterManifest): Readonly<ChapterManifest> {
  if (!value.slug || !value.title || value.sourceOrder.length === 0) {
    throw new Error("Manifesto de capitulo invalido");
  }
  return Object.freeze(value);
}

export const manifest = defineManifest(rawManifest as ChapterManifest);
export default manifest;
