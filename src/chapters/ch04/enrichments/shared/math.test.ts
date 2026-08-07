import { describe, expect, it } from "vitest";
import {
  discreteLogBruteForce,
  gcd,
  mod,
  modInverse,
  modPow,
  solveLinearCongruence,
} from "./math";

describe("aritmética dos laboratórios do capítulo 4", () => {
  it("reproduz os resultados centrais dos exercícios", () => {
    expect(modInverse(159853n, 659880n)).toBe(561517n);
    expect(modPow(630579n, 561517n, 661643n)).toBe(206484n);
    expect(modPow(876453n, 87953n, 1562501n)).toBe(772481n);
    expect(modPow(437n, 6104n, 6961n)).toBe(2065n);
  });

  it("resolve congruências com coeficiente não invertível", () => {
    expect(gcd(-8624n, 348148n)).toBe(4n);
    expect(solveLinearCongruence(-8624n, 25844n, 348148n)).toEqual([
      59623n,
      146660n,
      233697n,
      320734n,
    ]);
  });

  it("encontra o logaritmo discreto do exercício 4.11", () => {
    expect(discreteLogBruteForce(21947n, 31377n, 103687n, 1571n)).toBe(602n);
    expect(mod(-1n, 7n)).toBe(6n);
  });
});
