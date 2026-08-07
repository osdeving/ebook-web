import type { EnrichmentDefinition } from "../../../../framework/types";
import { dsaWorkbenchLab } from "./dsa-workbench-lab";
import { elgamalSignatureLab } from "./elgamal-signature-lab";
import { hashAvalancheLab } from "./hash-avalanche-lab";
import { nonceReuseLab } from "./nonce-reuse-lab";
import { rsaSignatureLab } from "./rsa-signature-lab";
import "./labs.css";

export const labs: readonly EnrichmentDefinition[] = [
  hashAvalancheLab,
  rsaSignatureLab,
  elgamalSignatureLab,
  nonceReuseLab,
  dsaWorkbenchLab,
];

export {
  dsaWorkbenchLab,
  elgamalSignatureLab,
  hashAvalancheLab,
  nonceReuseLab,
  rsaSignatureLab,
};
