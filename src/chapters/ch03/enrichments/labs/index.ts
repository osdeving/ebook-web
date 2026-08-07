import type { EnrichmentDefinition } from "../../../../framework/types";
import { differenceSquaresLab } from "./difference-squares-lab";
import { goldwasserMicaliLab } from "./goldwasser-micali-lab";
import { indexCalculusLab } from "./index-calculus-lab";
import { jacobiLab } from "./jacobi-lab";
import { millerRabinLab } from "./miller-rabin-lab";
import { phiFactorLab } from "./phi-factor-lab";
import { pollardPMinusOneLab } from "./pollard-p-minus-one-lab";
import { primeSearchLab } from "./prime-search-lab";
import { quadraticSieveLab } from "./quadratic-sieve-lab";
import { rootsPqLab } from "./roots-pq-lab";
import { rsaMalleabilityLab } from "./rsa-malleability-lab";
import { rsaWorkbenchLab } from "./rsa-workbench-lab";
import { smoothnessLab } from "./smoothness-lab";
import "./labs.css";

export const labs: readonly EnrichmentDefinition[] = [
  rootsPqLab,
  rsaWorkbenchLab,
  phiFactorLab,
  rsaMalleabilityLab,
  millerRabinLab,
  primeSearchLab,
  pollardPMinusOneLab,
  differenceSquaresLab,
  smoothnessLab,
  quadraticSieveLab,
  indexCalculusLab,
  jacobiLab,
  goldwasserMicaliLab,
];

export {
  differenceSquaresLab,
  goldwasserMicaliLab,
  indexCalculusLab,
  jacobiLab,
  millerRabinLab,
  phiFactorLab,
  pollardPMinusOneLab,
  primeSearchLab,
  quadraticSieveLab,
  rootsPqLab,
  rsaMalleabilityLab,
  rsaWorkbenchLab,
  smoothnessLab,
};
