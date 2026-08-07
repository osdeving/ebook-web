import { keyLab } from "./key-lab";
import { discreteLogLab } from "./discrete-log-lab";
import { diffieHellmanLab } from "./diffie-hellman-lab";
import { elgamalLab } from "./elgamal-lab";
import { groupLab } from "./group-lab";
import { complexityLab } from "./complexity-lab";
import { bsgsLab } from "./baby-step-giant-step-lab";
import { crtLab } from "./crt-lab";
import { rootsLab } from "./roots-lab";
import { pohligHellmanLab } from "./pohlig-hellman-lab";
import { structuresLab } from "./structures-lab";
import { quotientLab } from "./quotient-lab";
import { polynomialEuclidLab } from "./polynomial-euclid-lab";
import { finiteFieldLab } from "./finite-field-lab";

export { keyLab, discreteLogLab, diffieHellmanLab, elgamalLab, groupLab, complexityLab, bsgsLab, crtLab, rootsLab, pohligHellmanLab, structuresLab, quotientLab, polynomialEuclidLab, finiteFieldLab };

import type { EnrichmentItem } from "../shared/types";

export const labs: readonly EnrichmentItem[] = [
  keyLab,
  discreteLogLab,
  diffieHellmanLab,
  elgamalLab,
  groupLab,
  complexityLab,
  bsgsLab,
  crtLab,
  rootsLab,
  pohligHellmanLab,
  structuresLab,
  quotientLab,
  polynomialEuclidLab,
  finiteFieldLab,
];
