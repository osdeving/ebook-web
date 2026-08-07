export function mod(value: bigint, modulus: bigint): bigint {
  if (modulus <= 0n) throw new RangeError("O módulo deve ser positivo.");
  const result = value % modulus;
  return result >= 0n ? result : result + modulus;
}

export function gcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export function extendedGcd(left: bigint, right: bigint): {
  gcd: bigint;
  x: bigint;
  y: bigint;
} {
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
  if (oldR < 0n) return { gcd: -oldR, x: -oldS, y: -oldT };
  return { gcd: oldR, x: oldS, y: oldT };
}

export function modInverse(value: bigint, modulus: bigint): bigint {
  const result = extendedGcd(mod(value, modulus), modulus);
  if (result.gcd !== 1n) throw new RangeError("O inverso modular não existe.");
  return mod(result.x, modulus);
}

export function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus <= 0n) throw new RangeError("O módulo deve ser positivo.");
  if (exponent < 0n) return modPow(modInverse(base, modulus), -exponent, modulus);
  let factor = mod(base, modulus);
  let power = exponent;
  let result = 1n % modulus;
  while (power > 0n) {
    if (power & 1n) result = (result * factor) % modulus;
    factor = (factor * factor) % modulus;
    power >>= 1n;
  }
  return result;
}

export function integerSqrt(value: bigint): bigint {
  if (value < 0n) throw new RangeError("A raiz inteira exige entrada não negativa.");
  if (value < 2n) return value;
  let estimate = 1n << (BigInt(value.toString(2).length) + 1n >> 1n);
  while (true) {
    const next = (estimate + value / estimate) >> 1n;
    if (next >= estimate) return estimate;
    estimate = next;
  }
}

export function isPerfectSquare(value: bigint): boolean {
  if (value < 0n) return false;
  const root = integerSqrt(value);
  return root * root === value;
}

export function isPrime(value: bigint): boolean {
  if (value < 2n) return false;
  if (value % 2n === 0n) return value === 2n;
  for (let divisor = 3n; divisor * divisor <= value; divisor += 2n) {
    if (value % divisor === 0n) return false;
  }
  return true;
}

export function crtPair(
  firstResidue: bigint,
  firstModulus: bigint,
  secondResidue: bigint,
  secondModulus: bigint,
): bigint {
  if (gcd(firstModulus, secondModulus) !== 1n) {
    throw new RangeError("Os módulos do CRT devem ser coprimos.");
  }
  const correction = mod(
    (secondResidue - firstResidue) * modInverse(firstModulus, secondModulus),
    secondModulus,
  );
  return mod(firstResidue + correction * firstModulus, firstModulus * secondModulus);
}

export function jacobiSymbol(numerator: bigint, denominator: bigint): -1 | 0 | 1 {
  if (denominator <= 0n || denominator % 2n === 0n) {
    throw new RangeError("O denominador do símbolo de Jacobi deve ser ímpar e positivo.");
  }
  let a = mod(numerator, denominator);
  let n = denominator;
  let sign = 1;
  while (a !== 0n) {
    while (a % 2n === 0n) {
      a /= 2n;
      const residue = n % 8n;
      if (residue === 3n || residue === 5n) sign = -sign;
    }
    [a, n] = [n, a];
    if (a % 4n === 3n && n % 4n === 3n) sign = -sign;
    a %= n;
  }
  return n === 1n ? sign as -1 | 1 : 0;
}

export interface MillerRabinRound {
  base: bigint;
  d: bigint;
  s: number;
  values: readonly bigint[];
  witness: boolean;
}

export function millerRabinRound(value: bigint, requestedBase: bigint): MillerRabinRound {
  if (value < 3n || value % 2n === 0n) {
    throw new RangeError("A rodada de Miller–Rabin exige um inteiro ímpar maior que 2.");
  }
  if (value === 3n) {
    return { base: 2n, d: 1n, s: 1, values: Object.freeze([2n]), witness: false };
  }
  let d = value - 1n;
  let s = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    s += 1;
  }
  const base = 2n + mod(requestedBase - 2n, value - 3n);
  const values: bigint[] = [modPow(base, d, value)];
  if (values[0] === 1n || values[0] === value - 1n) {
    return { base, d, s, values: Object.freeze(values), witness: false };
  }
  for (let index = 1; index < s; index += 1) {
    values.push(values.at(-1)! ** 2n % value);
    if (values.at(-1) === value - 1n) {
      return { base, d, s, values: Object.freeze(values), witness: false };
    }
  }
  return { base, d, s, values: Object.freeze(values), witness: true };
}

export function factorOverBase(value: bigint, primeBase: readonly bigint[]): {
  exponents: readonly number[];
  remainder: bigint;
} {
  if (value === 0n) throw new RangeError("Zero não possui fatoração suave finita.");
  let remainder = value < 0n ? -value : value;
  const exponents = primeBase.map((prime) => {
    if (prime < 2n) throw new RangeError("A base de fatores deve conter primos positivos.");
    let exponent = 0;
    while (remainder % prime === 0n) {
      remainder /= prime;
      exponent += 1;
    }
    return exponent;
  });
  return { exponents: Object.freeze(exponents), remainder };
}

export function trialFactor(value: bigint, limit = 100_000n): bigint | undefined {
  const n = value < 0n ? -value : value;
  if (n < 4n) return undefined;
  if (n % 2n === 0n) return 2n;
  const maximum = integerSqrt(n) < limit ? integerSqrt(n) : limit;
  for (let divisor = 3n; divisor <= maximum; divisor += 2n) {
    if (n % divisor === 0n) return divisor;
  }
  return undefined;
}
