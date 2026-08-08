import type { EnrichmentDefinition } from "../../../../framework/types";
import { historyBayesPrice } from "./history-5-bayes-price";
import { historyCollisions } from "./history-5-colisoes-engenharia";
import { historyEntropyCompression } from "./history-5-entropia-compressao";
import { historyKolmogorov } from "./history-5-kolmogorov-axiomas";
import { historyMonteCarlo } from "./history-5-monte-carlo-los-alamos";
import { historyOtpVenona } from "./history-5-otp-venona";
import { historyPNP } from "./history-5-p-np-cook-karp";
import { historyPollardRho } from "./history-5-pollard-rho";
import { historyRhindProblem79 } from "./history-5-rhind-problema-79";
import { historyShannon } from "./history-5-shannon-informacao-sigilo";
import { historyVigenereKasiski } from "./history-5-vigenere-kasiski";

export const historyItems: EnrichmentDefinition[] = [
  historyRhindProblem79,
  historyVigenereKasiski,
  historyKolmogorov,
  historyBayesPrice,
  historyMonteCarlo,
  historyCollisions,
  historyPollardRho,
  historyShannon,
  historyOtpVenona,
  historyEntropyCompression,
  historyPNP,
];
