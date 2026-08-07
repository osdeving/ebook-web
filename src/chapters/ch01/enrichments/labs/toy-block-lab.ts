import { defineLab, makeElement, makeTable, readInteger } from "./runtime.mts";

export interface ToyRound {
  round: number;
  left: number;
  right: number;
  subkey: number;
  f: number;
  nextLeft: number;
  nextRight: number;
}

function roundFunction(right: number, key: number, round: number): number {
  const subkey = (key >> ((round * 2) % 8)) & 0xf;
  return (((right * 5 + subkey + round) & 0xf) ^ ((right << 1) & 0xf)) & 0xf;
}

export function encryptToyBlock(value: number, key: number): { ciphertext: number; rounds: ToyRound[] } {
  let left = (value >> 4) & 0xf;
  let right = value & 0xf;
  const rounds: ToyRound[] = [];
  for (let round = 0; round < 4; round += 1) {
    const subkey = (key >> ((round * 2) % 8)) & 0xf;
    const f = roundFunction(right, key, round);
    const nextLeft = right;
    const nextRight = left ^ f;
    rounds.push({ round: round + 1, left, right, subkey, f, nextLeft, nextRight });
    [left, right] = [nextLeft, nextRight];
  }
  return { ciphertext: (left << 4) | right, rounds };
}

export function decryptToyBlock(value: number, key: number): number {
  let left = (value >> 4) & 0xf;
  let right = value & 0xf;
  for (let round = 3; round >= 0; round -= 1) {
    const previousRight = left;
    const previousLeft = right ^ roundFunction(previousRight, key, round);
    [left, right] = [previousLeft, previousRight];
  }
  return (left << 4) | right;
}

function bits(value: number): string {
  return value.toString(2).padStart(8, "0");
}

function nibble(value: number): string {
  return value.toString(2).padStart(4, "0");
}

function hamming(left: number, right: number): number {
  return [...bits(left ^ right)].filter((bit) => bit === "1").length;
}

export const toyBlockLab = defineLab({
  id: "lab-1-7-3-bloco-feistel",
  anchor: "sec-1-7-3",
  title: "Avalanche em um bloco Feistel de brinquedo",
  duration: "Seção 1.7.3 · 10–15 min",
  tags: ["section:1.7.3", "cifra-de-bloco", "feistel", "avalanche", "bits"],
  html: `
    <p class="lab-intro">Divida um byte em duas metades e atravesse quatro rodadas Feistel. Depois altere um único bit do texto claro e compare os textos cifrados. Esta construção foi criada apenas para visualizar estrutura e <strong>não oferece segurança</strong>.</p>
    <form data-form>
      <div class="lab-controls">
        <label>Bloco claro (0–255)
          <input type="number" min="0" max="255" step="1" value="65" data-message>
        </label>
        <label>Chave de brinquedo (0–255)
          <input type="number" min="0" max="255" step="1" value="179" data-key>
        </label>
      </div>
      <fieldset class="lab-bit-picker">
        <legend>Bit do texto claro a inverter</legend>
        ${Array.from({ length: 8 }, (_, bit) => `<button type="button" data-bit="${bit}"${bit === 0 ? " aria-pressed=\"true\"" : " aria-pressed=\"false\""}>${bit}</button>`).join("")}
      </fieldset>
      <div class="lab-actions">
        <button type="submit">Executar quatro rodadas</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
    </form>
    <div data-table></div>
    <div class="lab-avalanche" data-avalanche role="img" aria-label="Comparação binária ainda não calculada"></div>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Interpretação: uma rede Feistel é invertível mesmo quando a função de rodada não é. Difusão observada em um exemplo não demonstra segurança; cifras reais exigem muito mais análise, rodadas e tamanhos de bloco.</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const messageInput = tools.q<HTMLInputElement>("[data-message]");
    const keyInput = tools.q<HTMLInputElement>("[data-key]");
    const tableHost = tools.q<HTMLElement>("[data-table]");
    const avalanche = tools.q<HTMLElement>("[data-avalanche]");
    let selectedBit = 0;

    const run = (announce = true) => {
      const messageResult = readInteger(messageInput, "O bloco", { min: 0n, max: 255n });
      const keyResult = readInteger(keyInput, "A chave", { min: 0n, max: 255n });
      if (!messageResult.ok || !keyResult.ok) {
        tools.feedback(!messageResult.ok ? messageResult.message : !keyResult.ok ? keyResult.message : "Entrada inválida.", "warning", announce);
        return;
      }
      const message = Number(messageResult.value);
      const key = Number(keyResult.value);
      const flipped = message ^ (1 << (7 - selectedBit));
      const originalRun = encryptToyBlock(message, key);
      const flippedRun = encryptToyBlock(flipped, key);
      const recovered = decryptToyBlock(originalRun.ciphertext, key);
      tableHost.replaceChildren(makeTable(
        "Rodadas do bloco original",
        ["Rodada", "L", "R", "subchave", "F(R)", "novo L", "novo R"],
        originalRun.rounds.map((round) => [
          String(round.round), nibble(round.left), nibble(round.right), nibble(round.subkey),
          nibble(round.f), nibble(round.nextLeft), nibble(round.nextRight),
        ]),
      ));

      const distance = hamming(originalRun.ciphertext, flippedRun.ciphertext);
      const rows = [
        ["Original", bits(message), bits(originalRun.ciphertext)],
        [`Bit ${selectedBit} invertido`, bits(flipped), bits(flippedRun.ciphertext)],
        ["Diferença", "        ", [...bits(originalRun.ciphertext ^ flippedRun.ciphertext)].map((bit) => bit === "1" ? "▲" : "·").join("")],
      ];
      avalanche.replaceChildren(makeTable("Efeito de alterar um bit", ["Caso", "Texto claro", "Texto cifrado"], rows));
      avalanche.setAttribute("aria-label", `O texto cifrado original é ${bits(originalRun.ciphertext)}; após inverter o bit ${selectedBit}, é ${bits(flippedRun.ciphertext)}; ${distance} de 8 bits mudaram.`);
      const summary = makeElement("p", `Cifrado: ${originalRun.ciphertext} (${bits(originalRun.ciphertext)}). Inverter um bit alterou ${distance} de 8 bits na saída. Decifrar com as rodadas inversas recuperou ${recovered}.`);
      const caveat = makeElement("p", distance === 0
        ? "Este caso expõe uma fraqueza extrema do brinquedo: a alteração desapareceu."
        : "Repita com outros blocos e chaves: a distância varia, pois uma única observação não caracteriza a cifra.");
      tools.outputNodes(summary, caveat);
      tools.feedback(`Quatro rodadas concluídas; decifração ${recovered === message ? "confirmada" : "falhou"}.`, recovered === message ? "success" : "error", announce);
    };

    tools.on(form, "submit", (event) => {
      event.preventDefault();
      run();
    });
    tools.on(tools.q(".lab-bit-picker"), "click", (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-bit]");
      if (!button) return;
      selectedBit = Number(button.dataset.bit);
      tools.qa<HTMLButtonElement>("[data-bit]").forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
      run(false);
      tools.feedback(`Bit ${selectedBit} selecionado para o experimento de avalanche.`, "info");
    });
    tools.on(tools.q("[data-reset]"), "click", () => {
      messageInput.value = "65";
      keyInput.value = "179";
      selectedBit = 0;
      tools.qa<HTMLButtonElement>("[data-bit]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.bit === "0")));
      run(false);
      tools.feedback("Bloco, chave e bit de demonstração restaurados.");
      messageInput.focus();
    });
    run(false);
  },
});
