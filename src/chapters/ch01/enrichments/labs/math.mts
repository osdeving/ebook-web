export function mod(value: bigint, modulus: bigint): bigint {
  if (modulus <= 0n) throw new Error("O módulo precisa ser positivo.");
  const residue = value % modulus;
  return residue >= 0n ? residue : residue + modulus;
}

export function gcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export interface EuclidRow {
  index: number;
  remainder: bigint;
  x: bigint;
  y: bigint;
  quotient: bigint | null;
  division: string;
}

/** Produz cada resto junto de sua identidade rᵢ=xᵢa+yᵢb. */
export function extendedEuclidTrace(a: bigint, b: bigint): EuclidRow[] {
  if (a <= 0n || b <= 0n) throw new Error("Use dois inteiros positivos.");
  const rows: EuclidRow[] = [
    { index: 0, remainder: a, x: 1n, y: 0n, quotient: null, division: "valor inicial a" },
    { index: 1, remainder: b, x: 0n, y: 1n, quotient: null, division: "valor inicial b" },
  ];
  let oldR = a;
  let r = b;
  let oldX = 1n;
  let x = 0n;
  let oldY = 0n;
  let y = 1n;
  let index = 2;
  while (r !== 0n) {
    const quotient = oldR / r;
    const nextR = oldR - quotient * r;
    const nextX = oldX - quotient * x;
    const nextY = oldY - quotient * y;
    rows.push({
      index,
      remainder: nextR,
      x: nextX,
      y: nextY,
      quotient,
      division: `${oldR} = ${quotient}·${r} + ${nextR}`,
    });
    [oldR, r] = [r, nextR];
    [oldX, x] = [x, nextX];
    [oldY, y] = [y, nextY];
    index += 1;
  }
  return rows;
}

export function inverseMod(value: bigint, modulus: bigint): bigint | null {
  const trace = extendedEuclidTrace(mod(value, modulus), modulus);
  const bezout = trace.at(-2);
  if (!bezout || bezout.remainder !== 1n) return null;
  return mod(bezout.x, modulus);
}

export interface PowerStep {
  bitIndex: number;
  bit: 0 | 1;
  factorBefore: bigint;
  accumulatorBefore: bigint;
  accumulatorAfter: bigint;
  factorAfter: bigint;
}

/** Quadratura e multiplicação, lendo o expoente do bit menos significativo. */
export function fastPowerTrace(base: bigint, exponent: bigint, modulus: bigint): PowerStep[] {
  if (exponent < 0n) throw new Error("O expoente precisa ser não negativo.");
  if (modulus <= 1n) throw new Error("O módulo precisa ser maior que 1.");
  let power = exponent;
  let factor = mod(base, modulus);
  let accumulator = 1n;
  let bitIndex = 0;
  const steps: PowerStep[] = [];
  if (power === 0n) return steps;
  while (power > 0n) {
    const bit = Number(power & 1n) as 0 | 1;
    const accumulatorBefore = accumulator;
    const factorBefore = factor;
    if (bit === 1) accumulator = mod(accumulator * factor, modulus);
    factor = mod(factor * factor, modulus);
    steps.push({
      bitIndex,
      bit,
      factorBefore,
      accumulatorBefore,
      accumulatorAfter: accumulator,
      factorAfter: factor,
    });
    power >>= 1n;
    bitIndex += 1;
  }
  return steps;
}

export function powMod(base: bigint, exponent: bigint, modulus: bigint): bigint {
  const trace = fastPowerTrace(base, exponent, modulus);
  return trace.at(-1)?.accumulatorAfter ?? mod(1n, modulus);
}

export function primeFactors(value: bigint): bigint[] {
  let remaining = value;
  const factors: bigint[] = [];
  for (let candidate = 2n; candidate * candidate <= remaining; candidate += 1n) {
    if (remaining % candidate !== 0n) continue;
    factors.push(candidate);
    while (remaining % candidate === 0n) remaining /= candidate;
  }
  if (remaining > 1n) factors.push(remaining);
  return factors;
}

export function multiplicativeOrder(value: bigint, prime: bigint): bigint | null {
  if (gcd(value, prime) !== 1n) return null;
  let current = 1n;
  for (let exponent = 1n; exponent < prime; exponent += 1n) {
    current = mod(current * value, prime);
    if (current === 1n) return exponent;
  }
  return null;
}
