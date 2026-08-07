export function mod(value: bigint, modulus: bigint): bigint {
  if (modulus <= 0n) throw new RangeError("O módulo precisa ser positivo.");
  const residue = value % modulus;
  return residue < 0n ? residue + modulus : residue;
}

export function gcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export function extendedGcd(left: bigint, right: bigint): [bigint, bigint, bigint] {
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
  if (oldR < 0n) return [-oldR, -oldS, -oldT];
  return [oldR, oldS, oldT];
}

export function modInverse(value: bigint, modulus: bigint): bigint {
  const [divisor, coefficient] = extendedGcd(mod(value, modulus), modulus);
  if (divisor !== 1n) throw new RangeError("O inverso modular não existe.");
  return mod(coefficient, modulus);
}

export function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (exponent < 0n) throw new RangeError("O expoente precisa ser não negativo.");
  if (modulus <= 0n) throw new RangeError("O módulo precisa ser positivo.");
  let result = 1n % modulus;
  let factor = mod(base, modulus);
  let power = exponent;
  while (power > 0n) {
    if (power & 1n) result = (result * factor) % modulus;
    factor = (factor * factor) % modulus;
    power >>= 1n;
  }
  return result;
}

export function isPrime(value: bigint): boolean {
  if (value < 2n) return false;
  if (value % 2n === 0n) return value === 2n;
  for (let divisor = 3n; divisor * divisor <= value; divisor += 2n) {
    if (value % divisor === 0n) return false;
  }
  return true;
}

export function solveLinearCongruence(
  coefficient: bigint,
  result: bigint,
  modulus: bigint,
): readonly bigint[] {
  const divisor = gcd(coefficient, modulus);
  if (mod(result, divisor) !== 0n) return [];
  const reducedModulus = modulus / divisor;
  const first = mod(
    modInverse(coefficient / divisor, reducedModulus) * (result / divisor),
    reducedModulus,
  );
  const solutions: bigint[] = [];
  for (let index = 0n; index < divisor; index += 1n) {
    solutions.push(first + index * reducedModulus);
  }
  return Object.freeze(solutions);
}

export function discreteLogBruteForce(
  base: bigint,
  target: bigint,
  modulus: bigint,
  order: bigint,
): bigint | undefined {
  let current = 1n;
  for (let exponent = 0n; exponent < order; exponent += 1n) {
    if (current === mod(target, modulus)) return exponent;
    current = (current * mod(base, modulus)) % modulus;
  }
  return undefined;
}
