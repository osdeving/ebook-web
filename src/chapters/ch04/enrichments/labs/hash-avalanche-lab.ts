import { defineLab, element, table } from "../shared/lab-runtime";

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function differentBits(left: Uint8Array, right: Uint8Array): number {
  let count = 0;
  for (let index = 0; index < left.length; index += 1) {
    let value = left[index]! ^ right[index]!;
    while (value) {
      count += value & 1;
      value >>>= 1;
    }
  }
  return count;
}

function equalBytes(left: Uint8Array, right: Uint8Array): boolean {
  return left.length === right.length && left.every((byte, index) => byte === right[index]);
}

async function sha256(message: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(message);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(digest);
}

export const hashAvalancheLab = defineLab({
  id: "lab-4-1-avalanche-hash",
  anchor: "sec-4-1",
  title: "Microscópio de hash: um byte, outro digest",
  duration: "Seção 4.1 · 8–12 min",
  tags: ["section:4.1", "hash", "integridade"],
  html: [
    '<p class="lab-intro">Compare SHA-256 de dois documentos quase iguais. O navegador calcula o hash localmente; o texto não é enviado a nenhum serviço.</p>',
    '<form data-form><div class="lab-controls lab-controls--stacked">',
    '<label>Documento A<textarea data-a rows="3">Autorizo a transferência de 100 reais.</textarea></label>',
    '<label>Documento B<textarea data-b rows="3">Autorizo a transferência de 900 reais.</textarea></label>',
    '</div><div class="lab-actions">',
    '<button type="submit">Comparar digests</button>',
    '<button type="button" data-copy>Igualar B a A</button>',
    '<button type="button" data-reset>Reiniciar</button>',
    '</div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Resultados da comparação de hashes"></div>',
    '<p class="lab-note">Avalanche é uma observação visual útil, mas não prova sozinha resistência a colisões ou segurança de um esquema de assinatura.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const left = tools.q<HTMLTextAreaElement>("[data-a]");
    const right = tools.q<HTMLTextAreaElement>("[data-b]");

    const run = async (report = true) => {
      if (!globalThis.crypto?.subtle) {
        if (report) tools.feedback("Este navegador não disponibiliza Web Crypto.", "error");
        return;
      }
      const encoder = new TextEncoder();
      const leftBytes = encoder.encode(left.value);
      const rightBytes = encoder.encode(right.value);
      const [leftDigest, rightDigest] = await Promise.all([sha256(left.value), sha256(right.value)]);
      const distance = differentBits(leftDigest, rightDigest);
      const sameBytes = equalBytes(leftBytes, rightBytes);
      const sameDigest = distance === 0;
      const summary = element(
        "p",
        sameBytes
          ? "Os documentos são idênticos em bytes e os digests coincidem."
          : sameDigest
            ? "Os documentos diferem em bytes, mas os digests coincidiram; isso seria uma colisão."
            : distance + " dos 256 bits diferem entre os dois digests.",
      );
      tools.outputNodes(
        summary,
        table("SHA-256 dos documentos", ["entrada", "bytes UTF-8", "digest hexadecimal"], [
          ["A", String(leftBytes.length), bytesToHex(leftDigest)],
          ["B", String(rightBytes.length), bytesToHex(rightDigest)],
        ]),
      );
      if (report) {
        tools.feedback(
          sameBytes
            ? "Digests iguais para entradas iguais."
            : sameDigest
              ? "Colisão detectada: não conclua que as entradas são idênticas."
              : "A alteração foi amplificada pelo hash.",
          sameDigest && !sameBytes ? "warning" : sameBytes ? "info" : "success",
        );
      }
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      void run();
    }) as EventListener);
    tools.on(tools.q("[data-copy]"), "click", (() => {
      right.value = left.value;
      void run();
    }) as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      tools.resetForm(form);
      void run(false);
    }) as EventListener);
    void run(false);
  },
});
