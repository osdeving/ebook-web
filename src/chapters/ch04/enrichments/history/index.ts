import type { EnrichmentDefinition } from "../../../../framework/types";
import { historyElgamalDsa } from "./history-4-elgamal-dsa-fips";
import { historyIdentityPrivacy } from "./history-4-assinatura-identidade-privacidade";
import { historyNonce } from "./history-4-nonce-de-aleatorio-a-deterministico";
import { historyRsaPss } from "./history-4-rsa-papel-ao-pss";
import { historySignatureSecurity } from "./history-4-nascimento-seguranca-assinaturas";

export const historyItems: EnrichmentDefinition[] = [
  historySignatureSecurity,
  historyIdentityPrivacy,
  historyRsaPss,
  historyElgamalDsa,
  historyNonce,
];
