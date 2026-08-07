import { gcd, isPrime, jacobiSymbol, mod, modPow } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

export const goldwasserMicaliLab = defineLab({
  id: "lab-3-10-goldwasser-micali",
  anchor: "sec-3-10",
  title: "Goldwasser–Micali: uma mensagem, muitos criptogramas",
  duration: "Seção 3.10 · 15–22 min",
  tags: ["section:3.10", "goldwasser-micali", "cifragem-probabilistica"],
  html: [
    '<p class="lab-intro">Cifre uma sequência de bits com escolhas frescas de r. Depois compare o conjunto completo de saídas possíveis para 0 e 1 e confira que as classes não se misturam.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Primo \\(p\\)<input data-p value="7" inputmode="numeric"></label>',
    '<label>Primo \\(q\\)<input data-q value="11" inputmode="numeric"></label>',
    '<label>Não resíduo \\(a\\)<input data-a value="6" inputmode="numeric"></label>',
    '<label>Bits da mensagem<input data-message value="10110" pattern="[01]+"></label>',
    '<label>Deslocamento de r<input data-start value="3" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Cifrar e decifrar</button><button type="button" data-reroll>Trocar todas as aleatoriedades</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">Os parâmetros são minúsculos para permitir enumeração. Em cada fator, a chave privada testa residuacidade; o símbolo de Jacobi público vale 1 nas duas classes.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const pInput = tools.q<HTMLInputElement>("[data-p]");
    const qInput = tools.q<HTMLInputElement>("[data-q]");
    const aInput = tools.q<HTMLInputElement>("[data-a]");
    const messageInput = tools.q<HTMLInputElement>("[data-message]");
    const startInput = tools.q<HTMLInputElement>("[data-start]");
    const run = () => {
      const pRead = readBigInt(pInput, "p", { min: 3n, max: 97n });
      const qRead = readBigInt(qInput, "q", { min: 3n, max: 97n });
      const aRead = readBigInt(aInput, "a", { min: 2n });
      const startRead = readBigInt(startInput, "deslocamento", { min: 0n });
      if (!pRead.ok || !qRead.ok || !aRead.ok || !startRead.ok) {
        tools.feedback(!pRead.ok ? pRead.message : !qRead.ok ? qRead.message : !aRead.ok ? aRead.message : !startRead.ok ? startRead.message : "Entrada inválida.", "warning");
        return;
      }
      const message = messageInput.value.trim();
      if (!/^[01]{1,24}$/.test(message) || !isPrime(pRead.value) || !isPrime(qRead.value) || pRead.value === qRead.value) {
        tools.feedback("Use primos distintos e uma mensagem de 1 a 24 bits.", "warning");
        return;
      }
      const n = pRead.value * qRead.value;
      const a = mod(aRead.value, n);
      const nonResidueP = modPow(a, (pRead.value - 1n) / 2n, pRead.value) === pRead.value - 1n;
      const nonResidueQ = modPow(a, (qRead.value - 1n) / 2n, qRead.value) === qRead.value - 1n;
      if (jacobiSymbol(a, n) !== 1 || !nonResidueP || !nonResidueQ) {
        tools.feedback("a deve ter Jacobi 1 e ser não resíduo tanto módulo p quanto módulo q.", "warning");
        return;
      }
      const units: bigint[] = [];
      for (let value = 1n; value < n; value += 1n) if (gcd(value, n) === 1n) units.push(value);
      const rows = [...message].map((bit, index) => {
        const r = units[Number((startRead.value + BigInt(index)) % BigInt(units.length))]!;
        const square = r * r % n;
        const cipher = bit === "1" ? square * a % n : square;
        const residueP = modPow(cipher, (pRead.value - 1n) / 2n, pRead.value) === 1n;
        const decoded = residueP ? "0" : "1";
        return [String(index), bit, String(r), String(cipher), String(jacobiSymbol(cipher, n)), decoded];
      });
      const zeroSet = new Set(units.map((r) => String(r * r % n)));
      const oneSet = new Set(units.map((r) => String(r * r % n * a % n)));
      const overlap = [...zeroSet].filter((value) => oneSet.has(value));
      const decoded = rows.map((row) => row[5]).join("");
      tools.outputNodes(
        element("p", "N=" + n + "; saídas distintas para 0: " + zeroSet.size + "; para 1: " + oneSet.size + "; interseção: " + overlap.length + "."),
        table("Cifragem bit a bit", ["i", "bit", "r", "c", "Jacobi(c,N)", "decifrado"], rows),
      );
      tools.feedback(decoded === message ? "Mensagem recuperada: " + decoded + ". Troque r e veja os criptogramas mudarem." : "A decifragem falhou.", decoded === message ? "success" : "error");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-reroll]"), "click", (() => {
      const startRead = readBigInt(startInput, "deslocamento", { min: 0n });
      if (!startRead.ok) { tools.feedback(startRead.message, "warning"); return; }
      startInput.value = String(startRead.value + 7n);
      run();
    }) as EventListener);
    run();
  },
});
