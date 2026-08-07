import type { EnrichmentDefinition } from "../../../../framework/types";
import { historyTwoRsaDiscoveries } from "./history-3-duas-descobertas-rsa";
import { historyRsaToPkcs } from "./history-3-rsa-pkcs";
import { historyCarmichaelKorselt } from "./history-3-carmichael-korselt";
import { historyMillerRabinAks } from "./history-3-miller-rabin-aks";
import { historyPollardSpecialMethods } from "./history-3-pollard-metodos-especiais";
import { historyFermatDixonQuadraticSieve } from "./history-3-fermat-dixon-crivo-quadratico";
import { historyNfsDistributedFactoring } from "./history-3-nfs-fatoracao-distribuida";
import { historyGaussReciprocity } from "./history-3-gauss-reciprocidade";
import { historyGoldwasserMicaliSecurity } from "./history-3-goldwasser-micali-seguranca";

// @ebook-imports
// @ebook-exports
export const historyItems: EnrichmentDefinition[] = [
  historyTwoRsaDiscoveries,
  historyRsaToPkcs,
  historyCarmichaelKorselt,
  historyMillerRabinAks,
  historyPollardSpecialMethods,
  historyFermatDixonQuadraticSieve,
  historyNfsDistributedFactoring,
  historyGaussReciprocity,
  historyGoldwasserMicaliSecurity,
  // @ebook-items
];
