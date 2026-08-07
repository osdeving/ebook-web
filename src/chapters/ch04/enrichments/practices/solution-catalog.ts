import rawCatalog from "./solution-catalog.json";

export interface ExerciseSolutionCatalogItem {
  id: string;
  layer: "practice";
  exercise: string;
  anchor: string;
  title: string;
  file: string;
  order: number;
}

export const exerciseSolutionCatalog = Object.freeze(
  rawCatalog as ExerciseSolutionCatalogItem[],
);
