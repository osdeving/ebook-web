import { gcd, inverseMod, mod } from "./math.mts";

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function asciiLetterIndex(character: string): number | null {
  const normalized = character.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  if (!/^[A-Z]$/.test(normalized)) return null;
  return normalized.charCodeAt(0) - 65;
}

export function shiftText(text: string, shift: number): string {
  return [...text].map((character) => {
    const index = asciiLetterIndex(character);
    if (index === null) return character;
    const transformed = Number(mod(BigInt(index + shift), 26n));
    const letter = ALPHABET[transformed] ?? "";
    return character === character.toLowerCase() ? letter.toLowerCase() : letter;
  }).join("");
}

export function affineText(
  text: string,
  multiplier: number,
  displacement: number,
  decrypt = false,
): string | null {
  if (gcd(BigInt(multiplier), 26n) !== 1n) return null;
  const inverse = inverseMod(BigInt(multiplier), 26n);
  if (inverse === null) return null;
  return [...text].map((character) => {
    const index = asciiLetterIndex(character);
    if (index === null) return character;
    const transformed = decrypt
      ? mod(inverse * (BigInt(index) - BigInt(displacement)), 26n)
      : mod(BigInt(multiplier * index + displacement), 26n);
    const letter = ALPHABET[Number(transformed)] ?? "";
    return character === character.toLowerCase() ? letter.toLowerCase() : letter;
  }).join("");
}

export function letterCounts(text: string): number[] {
  const counts = Array.from({ length: 26 }, () => 0);
  [...text].forEach((character) => {
    const index = asciiLetterIndex(character);
    if (index !== null) counts[index] = (counts[index] ?? 0) + 1;
  });
  return counts;
}

// Perfil em inglês usado pelo texto-fonte do capítulo (Tabela 1.3), normalizado.
const ENGLISH_FREQUENCIES = [
  8.15, 1.44, 2.76, 3.79, 13.11, 2.92, 1.99, 5.26, 6.35, 0.13, 0.42, 3.39, 2.54,
  7.10, 8.00, 1.98, 0.12, 6.83, 6.10, 10.47, 2.46, 0.92, 1.54, 0.17, 1.98, 0.08,
];

export interface ShiftCandidate {
  shift: number;
  score: number;
  plaintext: string;
}

/** Ordena chaves de César por distância qui-quadrado ao perfil em inglês. */
export function rankCaesarShifts(ciphertext: string): ShiftCandidate[] {
  const counts = letterCounts(ciphertext);
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) return [];
  return Array.from({ length: 26 }, (_, shift) => {
    let score = 0;
    for (let plainIndex = 0; plainIndex < 26; plainIndex += 1) {
      const observed = counts[(plainIndex + shift) % 26] ?? 0;
      const expected = total * (ENGLISH_FREQUENCIES[plainIndex] ?? 0) / 100;
      score += (observed - expected) ** 2 / Math.max(expected, 0.0001);
    }
    return { shift, score, plaintext: shiftText(ciphertext, -shift) };
  }).sort((left, right) => left.score - right.score);
}
