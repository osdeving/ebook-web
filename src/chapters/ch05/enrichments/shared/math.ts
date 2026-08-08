export function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

export function factorial(n: number): bigint {
  let value = 1n;
  for (let k = 2n; k <= BigInt(n); k += 1n) value *= k;
  return value;
}

export function choose(n: number, r: number): bigint {
  const k = Math.min(r, n - r);
  if (k < 0) return 0n;
  let value = 1n;
  for (let j = 1; j <= k; j += 1) value = value * BigInt(n - k + j) / BigInt(j);
  return value;
}

export function permutation(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  let value = 1n;
  for (let j = 0; j < r; j += 1) value *= BigInt(n - j);
  return value;
}

export function formatInteger(value: bigint): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}
