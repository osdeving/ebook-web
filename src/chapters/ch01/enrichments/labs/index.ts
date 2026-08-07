import type { EnrichmentDefinition } from "../../../../framework/types";
import { affineCipherLab } from "./affine-cipher-lab";
import { caesarWheelLab } from "./caesar-wheel-lab";
import { extendedEuclidLab } from "./extended-euclid-lab";
import { fastPowerLab } from "./fast-power-lab";
import { frequencyAnalysisLab } from "./frequency-analysis-lab";
import { integratedMissionLab } from "./integrated-mission-lab";
import { keyStrategyLab } from "./key-strategy-lab";
import { modularClockLab } from "./modular-clock-lab";
import { primitiveRootsLab } from "./primitive-roots-lab";
import { toyBlockLab } from "./toy-block-lab";
import "./labs.css";

// @ebook-imports
// @ebook-exports
export {
  affineCipherLab,
  caesarWheelLab,
  extendedEuclidLab,
  fastPowerLab,
  frequencyAnalysisLab,
  integratedMissionLab,
  keyStrategyLab,
  modularClockLab,
  primitiveRootsLab,
  toyBlockLab,
};

export const labs: readonly EnrichmentDefinition[] = [
  caesarWheelLab,
  frequencyAnalysisLab,
  extendedEuclidLab,
  modularClockLab,
  fastPowerLab,
  primitiveRootsLab,
  affineCipherLab,
  toyBlockLab,
  keyStrategyLab,
  integratedMissionLab,
  // @ebook-items
];
