import { describe, expect, it } from "vitest";
import { affineText, rankCaesarShifts, shiftText } from "./classical.mts";
import { labs } from "./index";
import {
  extendedEuclidTrace,
  fastPowerTrace,
  inverseMod,
  multiplicativeOrder,
  powMod,
} from "./math.mts";
import { decryptToyBlock, encryptToyBlock } from "./toy-block-lab";

describe("matemática dos laboratórios do capítulo 1", () => {
  it("mantém os certificados de Bézout em cada linha", () => {
    const trace = extendedEuclidTrace(252n, 198n);
    trace.forEach((row) => {
      expect(row.x * 252n + row.y * 198n).toBe(row.remainder);
    });
    expect(trace.at(-2)?.remainder).toBe(18n);
    expect(inverseMod(5n, 26n)).toBe(21n);
    expect(inverseMod(6n, 26n)).toBeNull();
  });

  it("reproduz a exponenciação rápida do Exemplo 1.18", () => {
    const trace = fastPowerTrace(3n, 218n, 1000n);
    expect(trace).toHaveLength(8);
    expect(trace.at(-1)?.accumulatorAfter).toBe(489n);
    expect(powMod(7n, 13n, 23n)).toBe(20n);
  });

  it("calcula ordens multiplicativas", () => {
    expect(multiplicativeOrder(2n, 29n)).toBe(28n);
    expect(multiplicativeOrder(4n, 29n)).toBe(14n);
  });
});

describe("cifras clássicas dos laboratórios", () => {
  it("faz ida e volta em César e na cifra afim", () => {
    const message = "Attack at dawn!";
    expect(shiftText(shiftText(message, 5), -5)).toBe(message);
    const encrypted = affineText(message, 5, 8);
    expect(encrypted).not.toBeNull();
    expect(affineText(encrypted ?? "", 5, 8, true)).toBe(message);
    expect(affineText(message, 2, 8)).toBeNull();
  });

  it("encontra a chave do caso estatístico preparado", () => {
    const plaintext = "THE BEST CRYPTANALYST TESTS A PATTERN BEFORE TRUSTING A GUESS LETTER FREQUENCIES HELP BUT CONTEXT DECIDES";
    const ciphertext = shiftText(plaintext, 7);
    expect(rankCaesarShifts(ciphertext).at(0)?.shift).toBe(7);
  });
});

describe("cifra de bloco didática", () => {
  it("é invertível para todos os bytes em várias chaves", () => {
    [0, 1, 37, 179, 255].forEach((key) => {
      for (let message = 0; message < 256; message += 1) {
        const encrypted = encryptToyBlock(message, key).ciphertext;
        expect(decryptToyBlock(encrypted, key)).toBe(message);
      }
    });
  });
});

describe("catálogo de laboratórios do capítulo 1", () => {
  it("registra dez módulos declarativos, acessíveis e com IDs únicos", () => {
    expect(labs).toHaveLength(10);
    expect(new Set(labs.map(({ id }) => id)).size).toBe(10);
    expect(labs.every(({ id }) => id.startsWith("lab-"))).toBe(true);
    expect(labs.every(({ layer }) => layer === "lab")).toBe(true);
    expect(labs.every(({ anchor, content, initialize }) => anchor.length > 0 && typeof content === "string" && typeof initialize === "function")).toBe(true);
  });
});
