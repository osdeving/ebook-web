import type { EnrichmentDefinition } from "../../../../framework/types";
import { readingBayes } from "./reading-5-bayes-ensaio-1763";
import { readingBrentCycles } from "./reading-5-brent-ciclos";
import { readingCollisions } from "./reading-5-colisoes-paralelas";
import { readingOperationalEntropy } from "./reading-5-entropia-operacional";
import { readingHellmanTradeoff } from "./reading-5-hellman-tempo-memoria";
import { readingHuffman } from "./reading-5-huffman-codigos";
import { readingKolmogorov } from "./reading-5-kolmogorov-fundamentos";
import { readingLempelZiv } from "./reading-5-lempel-ziv";
import { readingMonteCarlo } from "./reading-5-monte-carlo-fontes";
import { readingNistRandomness } from "./reading-5-nist-aleatoriedade";
import { readingPNP } from "./reading-5-p-np-fontes";
import { readingPollard } from "./reading-5-pollard-originais";
import { readingRhindProblem79 } from "./reading-5-rhind-problema-79";
import { readingShannon } from "./reading-5-shannon-dois-artigos";
import { readingShannonEnglish } from "./reading-5-shannon-ingles-1951";
import { readingVenona } from "./reading-5-venona-documentos";
import { readingVernamOtp } from "./reading-5-vernam-one-time-pad";
import { readingVigenereKasiski } from "./reading-5-vigenere-kasiski-fontes";

export const readingItems: EnrichmentDefinition[] = [
  readingRhindProblem79,
  readingVigenereKasiski,
  readingKolmogorov,
  readingBayes,
  readingMonteCarlo,
  readingNistRandomness,
  readingCollisions,
  readingHellmanTradeoff,
  readingPollard,
  readingBrentCycles,
  readingShannon,
  readingVernamOtp,
  readingVenona,
  readingShannonEnglish,
  readingHuffman,
  readingLempelZiv,
  readingOperationalEntropy,
  readingPNP,
];
