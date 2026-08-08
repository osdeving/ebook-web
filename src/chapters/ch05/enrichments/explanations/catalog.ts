import rawCatalog from "./catalog.json";

export interface ExplanationCatalogItem {
  id: string;
  type: "explanation";
  layer: "explanation";
  kind: "explanation";
  tag: string;
  title: string;
  section: string;
  anchor: string;
  slot: string;
  file: string;
  order: number;
}

export const explanationCatalog = Object.freeze(
  rawCatalog as ExplanationCatalogItem[],
);
