import { describe, expect, it } from "vitest";
import {
  crtPair,
  extendedGcd,
  factorOverBase,
  gcd,
  integerSqrt,
  isPerfectSquare,
  isPrime,
  jacobiSymbol,
  millerRabinRound,
  mod,
  modInverse,
  modPow,
  trialFactor,
} from "./math";

describe("aritmética pura do capítulo 3", () => {
  it("calcula módulo, MDC, Bézout, inverso e potência com BigInt", () => {
    expect(mod(-2n, 7n)).toBe(5n);
    expect(gcd(240n, 46n)).toBe(2n);
    const bezout = extendedGcd(240n, 46n);
    expect(240n * bezout.x + 46n * bezout.y).toBe(bezout.gcd);
    expect(modInverse(17n, 3120n)).toBe(2753n);
    expect(modPow(4n, 13n, 497n)).toBe(445n);
    expect(modPow(17n, -1n, 43n)).toBe(38n);
  });

  it("extrai raízes inteiras e detecta quadrados perfeitos sem Number", () => {
    expect(integerSqrt(0n)).toBe(0n);
    expect(integerSqrt(15n)).toBe(3n);
    expect(integerSqrt(16n)).toBe(4n);
    expect(integerSqrt(10n ** 40n + 123n)).toBe(10n ** 20n);
    expect(isPerfectSquare(15241578750190521n)).toBe(true);
    expect(isPerfectSquare(15241578750190522n)).toBe(false);
    expect([2n, 3n, 97n].every(isPrime)).toBe(true);
    expect([1n, 4n, 561n].some(isPrime)).toBe(false);
  });

  it("recombina resíduos e calcula símbolos de Jacobi", () => {
    expect(crtPair(2n, 3n, 3n, 5n)).toBe(8n);
    expect(jacobiSymbol(1001n, 9907n)).toBe(-1);
    expect(jacobiSymbol(19n, 45n)).toBe(1);
    expect(jacobiSymbol(9n, 15n)).toBe(0);
  });

  it("expõe toda a cadeia de uma rodada de Miller–Rabin", () => {
    const composite = millerRabinRound(561n, 2n);
    expect(composite.witness).toBe(true);
    expect(composite.values.length).toBeGreaterThan(0);
    const probablePrime = millerRabinRound(101n, 2n);
    expect(probablePrime.witness).toBe(false);
    expect(millerRabinRound(3n, 11n)).toMatchObject({ base: 2n, witness: false });
  });

  it("fatora sobre uma base e encontra divisores pequenos", () => {
    expect(factorOverBase(2n ** 5n * 3n ** 2n * 7n, [2n, 3n, 5n])).toEqual({
      exponents: [5, 2, 0],
      remainder: 7n,
    });
    expect(trialFactor(12_191n)).toBe(73n);
    expect(trialFactor(101n)).toBeUndefined();
  });
});
