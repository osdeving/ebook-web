import { readingPrimarySources } from "./reading-primary-sources";
import { readingDhToday } from "./reading-dh-today";
import { readingAlgorithmPapers } from "./reading-algorithm-papers";
import { readingComputationalTools } from "./reading-computational-tools";
import { readingExportControlsResearchKit } from "./reading-export-controls-research-kit";
import { readingConceptMap } from "./reading-concept-map";
import { readingGlossary } from "./reading-glossary";
import type { EnrichmentItem } from "../shared/types";

export { readingPrimarySources, readingDhToday, readingAlgorithmPapers, readingComputationalTools, readingExportControlsResearchKit, readingConceptMap, readingGlossary };

export const readingItems: readonly EnrichmentItem[] = [
  readingPrimarySources,
  readingDhToday,
  readingAlgorithmPapers,
  readingComputationalTools,
  readingExportControlsResearchKit,
  readingConceptMap,
  readingGlossary,
];
