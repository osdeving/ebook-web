export interface IntegerBounds {
  min?: bigint;
  max?: bigint;
  label?: string;
}

export type IntegerReadResult =
  | { ok: true; value: bigint }
  | { ok: false; message: string };

const INTEGER_PATTERN = /^[+-]?\d+$/;

/**
 * Valida a escrita inteira antes de chamar BigInt. Isso evita que campos
 * vazios, decimais ou notação exponencial virem exceções de conversão.
 */
export const parseInteger = (
  rawValue: unknown,
  { min, max, label = "O valor" }: IntegerBounds = {}
): IntegerReadResult => {
  const raw = String(rawValue ?? "").trim();
  if (!INTEGER_PATTERN.test(raw)) {
    return { ok: false, message: `${label} precisa ser um número inteiro.` };
  }

  const value = BigInt(raw);
  if (min !== undefined && value < min) {
    return { ok: false, message: `${label} precisa ser pelo menos ${min}.` };
  }
  if (max !== undefined && value > max) {
    return { ok: false, message: `${label} precisa ser no máximo ${max}.` };
  }
  return { ok: true, value };
};

export const mod = (value: bigint, modulus: bigint): bigint => {
  const residue = value % modulus;
  return residue >= 0n ? residue : residue + modulus;
};

export const gcd = (left: bigint, right: bigint): bigint => {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
};

export const extendedGcd = (left: bigint, right: bigint) => {
  let oldR = left;
  let r = right;
  let oldS = 1n;
  let s = 0n;
  let oldT = 0n;
  let t = 1n;
  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t];
  }
  return { gcd: oldR, x: oldS, y: oldT };
};

export const inverseMod = (value: bigint, modulus: bigint): bigint => {
  const result = extendedGcd(mod(value, modulus), modulus);
  if (result.gcd !== 1n) throw new Error("O inverso modular não existe.");
  return mod(result.x, modulus);
};

export const powMod = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
  if (modulus <= 0n) throw new Error("O módulo deve ser positivo.");
  let power = exponent;
  let factor = mod(base, modulus);
  if (power < 0n) {
    factor = inverseMod(factor, modulus);
    power = -power;
  }
  let result = 1n;
  while (power > 0n) {
    if (power & 1n) result = mod(result * factor, modulus);
    factor = mod(factor * factor, modulus);
    power >>= 1n;
  }
  return result;
};

export const discreteLog = (
  base: bigint,
  target: bigint,
  modulus: bigint,
  limit: bigint
): bigint | null => {
  let value = 1n;
  for (let exponent = 0n; exponent < limit; exponent += 1n) {
    if (value === mod(target, modulus)) return exponent;
    value = mod(value * base, modulus);
  }
  return null;
};

export const orderMod = (
  value: bigint,
  modulus: bigint,
  limit = modulus
): bigint | null => {
  let current = 1n;
  for (let exponent = 1n; exponent <= limit; exponent += 1n) {
    current = mod(current * value, modulus);
    if (current === 1n) return exponent;
  }
  return null;
};

export const crtPair = (a: bigint, m: bigint, b: bigint, n: bigint) => {
  if (gcd(m, n) !== 1n) throw new Error("Os módulos precisam ser coprimos.");
  const inverse = inverseMod(m, n);
  const multiplier = mod((b - a) * inverse, n);
  return {
    value: mod(a + m * multiplier, m * n),
    multiplier,
    inverse,
    modulus: m * n
  };
};

export const factorInteger = (value: bigint): Array<[number, number]> => {
  let remaining = Number(value);
  const factors: Array<[number, number]> = [];
  for (let prime = 2; prime * prime <= remaining; prime += 1) {
    let exponent = 0;
    while (remaining % prime === 0) {
      remaining /= prime;
      exponent += 1;
    }
    if (exponent) factors.push([prime, exponent]);
  }
  if (remaining > 1) factors.push([remaining, 1]);
  return factors;
};
