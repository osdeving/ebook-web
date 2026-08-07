export const modNumber = (a: number, n: number): number => ((a % n) + n) % n;

export const powModNumber = (base: number, exponent: number, modulus: number): number => {
  let b = BigInt(base);
  let e = BigInt(exponent);
  const m = BigInt(modulus);
  let result = 1n;
  b %= m;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return Number(result);
};

export const inverseModNumber = (a: number, n: number): number | null => {
  let oldR = a;
  let r = n;
  let oldS = 1;
  let s = 0;
  while (r !== 0) {
    const quotient = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }
  return oldR === 1 ? modNumber(oldS, n) : null;
};
