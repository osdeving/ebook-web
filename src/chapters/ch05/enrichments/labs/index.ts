import type { EnrichmentDefinition } from "../../../../framework/types";
import { bayesMonteCarloLab } from "./bayes-monte-carlo-lab";
import { birthdayCollisionLab } from "./birthday-collision-lab";
import { complexityGrowthLab } from "./complexity-growth-lab";
import { countingWorkbenchLab } from "./counting-workbench-lab";
import { entropyAnalyzerLab } from "./entropy-analyzer-lab";
import { expectationSimulatorLab } from "./expectation-simulator-lab";
import { perfectSecrecyLab } from "./perfect-secrecy-lab";
import { pollardRhoFactorLab } from "./pollard-rho-factor-lab";
import { vigenereWorkbenchLab } from "./vigenere-workbench-lab";
import "./labs.css";

export const labs: readonly EnrichmentDefinition[] = [
  countingWorkbenchLab,
  vigenereWorkbenchLab,
  bayesMonteCarloLab,
  expectationSimulatorLab,
  birthdayCollisionLab,
  pollardRhoFactorLab,
  perfectSecrecyLab,
  entropyAnalyzerLab,
  complexityGrowthLab,
];

export {
  bayesMonteCarloLab,
  birthdayCollisionLab,
  complexityGrowthLab,
  countingWorkbenchLab,
  entropyAnalyzerLab,
  expectationSimulatorLab,
  perfectSecrecyLab,
  pollardRhoFactorLab,
  vigenereWorkbenchLab,
};
