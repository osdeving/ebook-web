import type { EnrichmentDefinition } from "../../../../framework/types";
import { readingClassicalSources } from "./reading-1-fontes-classicas";
import { readingClassicalCryptanalysis } from "./reading-1-criptoanalise-classica";
import { readingEuclidOriginal } from "./reading-1-euclides-original";
import { readingNumberTheoryTools } from "./reading-1-ferramentas-teoria-numeros";
import { readingModularArithmeticReference } from "./reading-1-aritmetica-modular-referencia";
import { readingPrimesInData } from "./reading-1-primos-em-dados";
import { readingFermatEulerSources } from "./reading-1-fermat-euler-fontes";
import { readingCryptologicArchives } from "./reading-1-arquivos-criptologicos";
import { readingZimmermannDocuments } from "./reading-1-zimmermann-documentos";
import { readingEnigmaPurple } from "./reading-1-enigma-purple";
import { readingCharacterStandards } from "./reading-1-padroes-de-caracteres";
import { readingKerckhoffsVernamShannon } from "./reading-1-kerckhoffs-vernam-shannon";
import { readingCryptographicStandards } from "./reading-1-padroes-criptograficos";
import { readingPublicKeyOrigins } from "./reading-1-chave-publica-origens";

// @ebook-imports
// @ebook-exports
export const readingItems: EnrichmentDefinition[] = [
  readingClassicalSources,
  readingClassicalCryptanalysis,
  readingEuclidOriginal,
  readingNumberTheoryTools,
  readingModularArithmeticReference,
  readingPrimesInData,
  readingFermatEulerSources,
  readingCryptologicArchives,
  readingZimmermannDocuments,
  readingEnigmaPurple,
  readingCharacterStandards,
  readingKerckhoffsVernamShannon,
  readingCryptographicStandards,
  readingPublicKeyOrigins,
  // @ebook-items
];
