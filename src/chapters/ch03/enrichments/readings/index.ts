import type { EnrichmentDefinition } from "../../../../framework/types";
import { readingRsaOriginal } from "./reading-3-rsa-original";
import { readingRsaStandards } from "./reading-3-rsa-padroes";
import { readingGchqPublicKeyHistory } from "./reading-3-gchq";
import { readingNistPrimalityKeygen } from "./reading-3-nist-primalidade-keygen";
import { readingMillerRabinAks } from "./reading-3-miller-rabin-aks";
import { readingCarmichaelKorselt } from "./reading-3-carmichael-korselt";
import { readingPollardMethods } from "./reading-3-pollard";
import { readingQuadraticAndNumberFieldSieves } from "./reading-3-qs-nfs";
import { readingFactoringRecordsAndGimps } from "./reading-3-recordes-fatoracao-gimps";
import { readingHandbookAppliedCryptography } from "./reading-3-hac";
import { readingDlmfQuadraticReciprocity } from "./reading-3-dlmf-reciprocidade";
import { readingGoldwasserMicali } from "./reading-3-goldwasser-micali";
import { readingSemanticSecurity } from "./reading-3-seguranca-semantica";
import { readingComputationalTools } from "./reading-3-ferramentas-computacionais";

// @ebook-imports
// @ebook-exports
export const readingItems: EnrichmentDefinition[] = [
  readingRsaOriginal,
  readingRsaStandards,
  readingGchqPublicKeyHistory,
  readingNistPrimalityKeygen,
  readingMillerRabinAks,
  readingCarmichaelKorselt,
  readingPollardMethods,
  readingQuadraticAndNumberFieldSieves,
  readingFactoringRecordsAndGimps,
  readingHandbookAppliedCryptography,
  readingDlmfQuadraticReciprocity,
  readingGoldwasserMicali,
  readingSemanticSecurity,
  readingComputationalTools,
  // @ebook-items
];
