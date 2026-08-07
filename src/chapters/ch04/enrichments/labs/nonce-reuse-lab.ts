import {
  gcd,
  isPrime,
  mod,
  modPow,
  solveLinearCongruence,
} from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

export const nonceReuseLab = defineLab({
  id: "lab-4-3-reuso-de-nonce",
  anchor: "sec-4-3",
  title: "Autópsia de um nonce reutilizado",
  duration: "Seção 4.3 · 20–25 min",
  tags: ["section:4.3", "ataque", "nonce", "ElGamal"],
  html: [
    '<p class="lab-intro">Duas assinaturas exibem o mesmo S₁. Resolva a congruência que recupera candidatos a k e deixe a chave pública selecionar o segredo correto.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Primo \\(p\\)<input data-p value="348149" inputmode="numeric"></label>',
    '<label>Base \\(g\\)<input data-g value="113459" inputmode="numeric"></label>',
    '<label>Chave pública \\(A\\)<input data-a value="185149" inputmode="numeric"></label>',
    '<label>\\(D\\)<input data-d1 value="153405" inputmode="numeric"></label>',
    '<label>\\(D\\prime\\)<input data-d2 value="127561" inputmode="numeric"></label>',
    '<label>\\(S_1\\) repetido<input data-s1 value="208913" inputmode="numeric"></label>',
    '<label>\\(S_2\\)<input data-s2 value="209176" inputmode="numeric"></label>',
    '<label>\\(S_2\\prime\\)<input data-s2b value="217800" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Recuperar nonce e chave</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Resultados da recuperação por nonce repetido"></div>',
    '<p class="lab-note">O solucionador limita módulos e número de classes para manter a página responsiva. Ele também trata coeficientes não invertíveis, detalhe essencial neste exemplo.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const selectors = ["p", "g", "a", "d1", "d2", "s1", "s2", "s2b"] as const;
    const inputs = Object.fromEntries(
      selectors.map((name) => [name, tools.q<HTMLInputElement>("[data-" + name + "]")]),
    ) as Record<(typeof selectors)[number], HTMLInputElement>;

    const run = (report = true) => {
      const parsed = selectors.map((name) => readBigInt(inputs[name], name, {
        min: name === "p" ? 3n : 0n,
        max: 2000000n,
      }));
      const failure = parsed.find((item) => !item.ok);
      if (failure && !failure.ok) tools.feedback(failure.message, "warning");
      if (!parsed.every((item) => item.ok)) return;
      const [p, g, publicKey, firstDocument, secondDocument, first, second, secondPrime] =
        parsed.map((item) => item.ok ? item.value : 0n) as [
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
        ];
      if (!isPrime(p)) {
        tools.feedback("p precisa ser primo para modelar o grupo de ElGamal.", "warning");
        return;
      }
      if ([g, publicKey, first].some((value) => value < 1n || value >= p)) {
        tools.feedback("g, A e S₁ precisam estar no intervalo de 1 a p−1.", "warning");
        return;
      }
      const modulus = p - 1n;
      const coefficient = mod(second - secondPrime, modulus);
      const result = mod(firstDocument - secondDocument, modulus);
      const candidateCount = gcd(coefficient, modulus);
      if (candidateCount > 1000n) {
        tools.feedback("A congruência geraria mais de 1000 classes; escolha um exemplo menor.", "warning");
        return;
      }
      const nonceCandidates = solveLinearCongruence(coefficient, result, modulus);
      const validNonces = nonceCandidates.filter((candidate) =>
        gcd(candidate, modulus) === 1n && modPow(g, candidate, p) === mod(first, p)
      );
      const rows: string[][] = nonceCandidates.map((candidate) => [
        String(candidate),
        String(gcd(candidate, modulus)),
        String(modPow(g, candidate, p)),
        validNonces.includes(candidate) ? "compatível" : "descartar",
      ]);
      const keyCandidates: bigint[] = [];
      for (const nonce of validNonces) {
        const keyRight = mod(firstDocument - nonce * second, modulus);
        const keyCount = gcd(first, modulus);
        if (keyCount > 1000n) continue;
        for (const candidate of solveLinearCongruence(first, keyRight, modulus)) {
          if (modPow(g, candidate, p) === mod(publicKey, p)) keyCandidates.push(candidate);
        }
      }
      tools.outputNodes(
        element("p", "Congruência observável: " + coefficient + "·k ≡ " + result + " (mod " + modulus + ")."),
        table("Classes candidatas ao nonce", ["k", "mdc(k,p−1)", "g^k mod p", "teste"], rows),
        element("p", keyCandidates.length
          ? "Chave privada compatível com A: a = " + keyCandidates.join(", ") + "."
          : "Nenhuma chave privada compatível foi encontrada."),
      );
      if (report) {
        tools.feedback(
          keyCandidates.length ? "Reutilização confirmada; a chave privada foi recuperada." : "Os dados não formam o padrão esperado.",
          keyCandidates.length ? "warning" : "info",
        );
      }
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      tools.resetForm(form);
      run(false);
    }) as EventListener);
    run(false);
  },
});
