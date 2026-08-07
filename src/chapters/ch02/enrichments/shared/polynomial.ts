export const polyDegree = (value: number): number => {
  const polynomial = value >>> 0;
  return polynomial === 0 ? -1 : 31 - Math.clz32(polynomial);
};

export const polyMultiply = (left: number, right: number): number => {
  let a = left >>> 0;
  let b = right >>> 0;
  let result = 0;
  while (b) {
    if (b & 1) result ^= a;
    a <<= 1;
    b >>>= 1;
  }
  return result >>> 0;
};

export const polyDivide = (dividend: number, divisor: number) => {
  const denominator = divisor >>> 0;
  if (!denominator) throw new Error("Não é possível dividir pelo polinômio zero.");
  let quotient = 0;
  let remainder = dividend >>> 0;
  const denominatorDegree = polyDegree(denominator);
  while (remainder && polyDegree(remainder) >= denominatorDegree) {
    const shift = polyDegree(remainder) - denominatorDegree;
    quotient ^= 1 << shift;
    remainder ^= denominator << shift;
  }
  return { quotient: quotient >>> 0, remainder: remainder >>> 0 };
};

export const polyExtendedGcd = (left: number, right: number) => {
  let oldR = left >>> 0;
  let r = right >>> 0;
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;
  const steps = [];
  while (r) {
    const division = polyDivide(oldR, r);
    steps.push({ dividend: oldR, divisor: r, ...division });
    [oldR, r] = [r, division.remainder];
    [oldS, s] = [s, (oldS ^ polyMultiply(division.quotient, s)) >>> 0];
    [oldT, t] = [t, (oldT ^ polyMultiply(division.quotient, t)) >>> 0];
  }
  return { gcd: oldR, s: oldS >>> 0, t: oldT >>> 0, steps };
};

export const polyString = (value: number): string => {
  const polynomial = value >>> 0;
  if (!polynomial) return "0";
  const terms: string[] = [];
  for (let exponent = polyDegree(polynomial); exponent >= 0; exponent -= 1) {
    if (!((polynomial >>> exponent) & 1)) continue;
    if (exponent === 0) terms.push("1");
    else if (exponent === 1) terms.push("x");
    else terms.push(`x^${exponent}`);
  }
  return terms.join(" + ");
};

export const gf2Multiply = (
  left: number,
  right: number,
  modulus = 0b1011,
  degree = 3
): number => {
  let a = left >>> 0;
  let b = right >>> 0;
  let result = 0;
  const highBit = 1 << degree;
  const mask = highBit - 1;
  while (b) {
    if (b & 1) result ^= a;
    b >>>= 1;
    a <<= 1;
    if (a & highBit) a ^= modulus;
  }
  return result & mask;
};
