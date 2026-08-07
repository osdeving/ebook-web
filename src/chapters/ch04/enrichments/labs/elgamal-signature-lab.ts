import { gcd, isPrime, mod, modInverse, modPow } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

interface SignatureState {
  p: bigint;
  g: bigint;
  publicKey: bigint;
  document: bigint;
  first: bigint;
  second: bigint;
}

export const elgamalSignatureLab = defineLab({
  id: "lab-4-3-elgamal-assinatura",
  anchor: "sec-4-3",
  title: "ElGamal em duas linhas de aritmética",
  duration: "Seção 4.3 · 15–20 min",
  tags: ["section:4.3", "ElGamal", "nonce"],
  html: [
    '<p class="lab-intro">Assine um documento e acompanhe quais operações ocorrem módulo p e quais ocorrem módulo p−1. Depois altere apenas o documento e observe a rejeição.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Primo \\(p\\)<input data-p value="6961" inputmode="numeric"></label>',
    '<label>Gerador \\(g\\)<input data-g value="437" inputmode="numeric"></label>',
    '<label>Segredo \\(a\\)<input data-a value="6104" inputmode="numeric"></label>',
    '<label>Documento \\(D\\)<input data-d value="5584" inputmode="numeric"></label>',
    '<label>Nonce \\(k\\)<input data-k value="4451" inputmode="numeric"></label>',
    '</div><div class="lab-actions">',
    '<button type="submit">Assinar e verificar</button>',
    '<button type="button" data-tamper>Verificar D + 1</button>',
    '<button type="button" data-reset>Reiniciar</button>',
    '</div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Resultados da assinatura ElGamal"></div>',
    '<p class="lab-note">O gerador não é certificado pelo laboratório. Os limites pequenos servem à aritmética didática, não à segurança.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const inputs = {
      p: tools.q<HTMLInputElement>("[data-p]"),
      g: tools.q<HTMLInputElement>("[data-g]"),
      a: tools.q<HTMLInputElement>("[data-a]"),
      d: tools.q<HTMLInputElement>("[data-d]"),
      k: tools.q<HTMLInputElement>("[data-k]"),
    };
    let state: SignatureState | undefined;

    const run = (report = true) => {
      const parsed = [
        readBigInt(inputs.p, "p", { min: 3n, max: 100000n }),
        readBigInt(inputs.g, "g", { min: 2n }),
        readBigInt(inputs.a, "a", { min: 1n }),
        readBigInt(inputs.d, "D", { min: 0n }),
        readBigInt(inputs.k, "k", { min: 2n }),
      ];
      const failure = parsed.find((item) => !item.ok);
      if (failure && !failure.ok) tools.feedback(failure.message, "warning");
      if (!parsed.every((item) => item.ok)) return;
      const [p, rawG, rawA, rawDocument, k] = parsed.map(
        (item) => item.ok ? item.value : 0n,
      ) as [bigint, bigint, bigint, bigint, bigint];
      if (!isPrime(p)) {
        tools.feedback("p precisa ser primo.", "warning");
        return;
      }
      const exponentModulus = p - 1n;
      if (gcd(k, exponentModulus) !== 1n || k >= p) {
        tools.feedback("k precisa satisfazer 1 < k < p e mdc(k,p−1)=1.", "warning");
        return;
      }
      const g = mod(rawG, p);
      if (g === 0n) {
        tools.feedback("g precisa representar um elemento não nulo módulo p.", "warning");
        return;
      }
      const a = mod(rawA, exponentModulus);
      const document = mod(rawDocument, exponentModulus);
      const publicKey = modPow(g, a, p);
      const inverse = modInverse(k, exponentModulus);
      const first = modPow(g, k, p);
      const second = mod((document - a * first) * inverse, exponentModulus);
      const left = modPow(publicKey, first, p) * modPow(first, second, p) % p;
      const right = modPow(g, document, p);
      state = { p, g, publicKey, document, first, second };
      tools.outputNodes(
        element("p", "Chave pública A = " + publicKey + "; assinatura (S₁,S₂) = (" + first + ", " + second + ")."),
        table("Dois módulos, um teste", ["quantidade", "módulo", "resultado"], [
          ["S₁ = g^k", String(p), String(first)],
          ["k^−1", String(exponentModulus), String(inverse)],
          ["S₂", String(exponentModulus), String(second)],
          ["A^S₁ S₁^S₂", String(p), String(left)],
          ["g^D", String(p), String(right)],
        ]),
      );
      if (report) {
        tools.feedback(left === right ? "Os lados coincidem: assinatura aceita." : "Os lados divergem.", left === right ? "success" : "error");
      }
    };

    const tamper = () => {
      if (!state) {
        tools.feedback("Primeiro produza uma assinatura.", "warning");
        return;
      }
      const changed = mod(state.document + 1n, state.p - 1n);
      const left = modPow(state.publicKey, state.first, state.p) * modPow(state.first, state.second, state.p) % state.p;
      const right = modPow(state.g, changed, state.p);
      tools.outputNodes(
        element("p", "A assinatura foi mantida, mas D mudou de " + state.document + " para " + changed + "."),
        table("Teste após adulteração", ["lado", "valor", "decisão"], [
          ["assinatura", String(left), left === right ? "igual" : "diferente"],
          ["documento alterado", String(right), left === right ? "igual" : "diferente"],
          ["verificador", "comparação", left === right ? "ACEITA" : "REJEITA"],
        ]),
      );
      tools.feedback(left === right ? "Colisão inesperada neste exemplo." : "A alteração do documento foi detectada.", left === right ? "warning" : "success");
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-tamper]"), "click", tamper as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      state = undefined;
      tools.resetForm(form);
      run(false);
    }) as EventListener);
    run(false);
  },
});
