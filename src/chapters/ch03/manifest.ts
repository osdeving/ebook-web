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

export const manifest = Object.freeze(rawManifest as ChapterManifest);
export default manifest;
