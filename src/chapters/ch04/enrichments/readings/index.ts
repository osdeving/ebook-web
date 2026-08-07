import type { EnrichmentDefinition } from "../../../../framework/types";
import { readingBlindSignatures } from "./reading-4-chaum-assinaturas-cegas";
import { readingElgamalOriginal } from "./reading-4-elgamal-original";
import { readingFips } from "./reading-4-fips-186";
import { readingGmr } from "./reading-4-seguranca-gmr";
import { readingAssurances } from "./reading-4-nist-garantias";
import { readingOrigins } from "./reading-4-origens-chave-publica-rsa";
import { readingRfc6979 } from "./reading-4-rfc6979";
import { readingRsaPss } from "./reading-4-rsa-pss-rfc8017";
import { readingWebCrypto } from "./reading-4-webcrypto";

export const readingItems: EnrichmentDefinition[] = [
  readingOrigins,
  readingGmr,
  readingAssurances,
  readingBlindSignatures,
  readingRsaPss,
  readingWebCrypto,
  readingElgamalOriginal,
  readingFips,
  readingRfc6979,
];
