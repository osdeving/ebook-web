import { isPrime, mod, modInverse, modPow } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

export const dsaWorkbenchLab = defineLab({
  id: "lab-4-3-bancada-dsa",
  anchor: "sec-4-3",
  title: "Bancada DSA: subgrupo, assinatura e verificação",
  duration: "Seção 4.3 · 18–25 min",
  tags: ["section:4.3", "DSA", "subgrupo"],
  html: [
    '<p class="lab-intro">Veja o representante g^k módulo p ser reduzido módulo q, depois acompanhe como V₁ e V₂ recompõem o mesmo elemento do subgrupo.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Primo \\(p\\)<input data-p value="22531" inputmode="numeric"></label>',
    '<label>Primo \\(q\\)<input data-q value="751" inputmode="numeric"></label>',
    '<label>Elemento \\(g\\)<input data-g value="4488" inputmode="numeric"></label>',
    '<label>Segredo \\(a\\)<input data-a value="674" inputmode="numeric"></label>',
    '<label>Documento \\(D\\)<input data-d value="244" inputmode="numeric"></label>',
    '<label>Nonce \\(k\\)<input data-k value="574" inputmode="numeric"></label>',
    '</div><div class="lab-actions">',
    '<button type="submit">Executar DSA</button>',
    '<button type="button" data-tamper>Alterar S₂ e verificar</button>',
    '<button type="button" data-reset>Reiniciar</button>',
    '</div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Resultados da bancada DSA"></div>',
    '<p class="lab-note">Este é o DSA didático do capítulo. FIPS 186-5 já não especifica DSA para gerar novas assinaturas; os valores também são muito pequenos.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const inputs = {
      p: tools.q<HTMLInputElement>("[data-p]"),
      q: tools.q<HTMLInputElement>("[data-q]"),
      g: tools.q<HTMLInputElement>("[data-g]"),
      a: tools.q<HTMLInputElement>("[data-a]"),
      d: tools.q<HTMLInputElement>("[data-d]"),
      k: tools.q<HTMLInputElement>("[data-k]"),
    };
    let last: { p: bigint; q: bigint; g: bigint; publicKey: bigint; document: bigint; first: bigint; second: bigint } | undefined;

    const verify = (
      p: bigint,
      q: bigint,
      g: bigint,
      publicKey: bigint,
      document: bigint,
      first: bigint,
      second: bigint,
    ) => {
      if (first <= 0n || first >= q || second <= 0n || second >= q) return;
      const inverse = modInverse(second, q);
      const firstExponent = mod(document * inverse, q);
      const secondExponent = mod(first * inverse, q);
      const representative = modPow(g, firstExponent, p) * modPow(publicKey, secondExponent, p) % p;
      return {
        inverse,
        firstExponent,
        secondExponent,
        representative,
        projected: representative % q,
      };
    };

    const run = (report = true) => {
      const parsed = [
        readBigInt(inputs.p, "p", { min: 3n, max: 500000n }),
        readBigInt(inputs.q, "q", { min: 2n, max: 100000n }),
        readBigInt(inputs.g, "g", { min: 2n }),
        readBigInt(inputs.a, "a", { min: 1n }),
        readBigInt(inputs.d, "D", { min: 0n }),
        readBigInt(inputs.k, "k", { min: 1n }),
      ];
      const failure = parsed.find((item) => !item.ok);
      if (failure && !failure.ok) tools.feedback(failure.message, "warning");
      if (!parsed.every((item) => item.ok)) return;
      const [p, q, rawG, rawA, rawDocument, rawK] = parsed.map(
        (item) => item.ok ? item.value : 0n,
      ) as [bigint, bigint, bigint, bigint, bigint, bigint];
      const g = mod(rawG, p);
      const a = mod(rawA, q);
      const document = mod(rawDocument, q);
      const k = mod(rawK, q);
      if (!isPrime(p) || !isPrime(q) || (p - 1n) % q !== 0n) {
        tools.feedback("p e q devem ser primos e q precisa dividir p−1.", "warning");
        return;
      }
      if (g === 1n || modPow(g, q, p) !== 1n) {
        tools.feedback("g precisa ter ordem q (neste caso, g ≠ 1 e g^q = 1 mod p).", "warning");
        return;
      }
      if (a === 0n || k === 0n) {
        tools.feedback("a e k precisam ser não nulos módulo q.", "warning");
        return;
      }
      const publicKey = modPow(g, a, p);
      const rawFirst = modPow(g, k, p);
      const first = rawFirst % q;
      if (first === 0n) {
        tools.feedback("S₁ saiu zero; escolha outro k.", "warning");
        return;
      }
      const second = mod((document + a * first) * modInverse(k, q), q);
      if (second === 0n) {
        tools.feedback("S₂ saiu zero; escolha outro k.", "warning");
        return;
      }
      const trace = verify(p, q, g, publicKey, document, first, second);
      if (!trace) return;
      last = { p, q, g, publicKey, document, first, second };
      tools.outputNodes(
        element("p", "Chave pública A = " + publicKey + "; assinatura (S₁,S₂) = (" + first + ", " + second + ")."),
        table("Rastro completo do DSA", ["etapa", "módulo", "resultado"], [
          ["R = g^k", String(p), String(rawFirst)],
          ["S₁ = R mod q", String(q), String(first)],
          ["S₂", String(q), String(second)],
          ["V₁ = D·S₂^−1", String(q), String(trace.firstExponent)],
          ["V₂ = S₁·S₂^−1", String(q), String(trace.secondExponent)],
          ["g^V₁ A^V₂", String(p), String(trace.representative)],
          ["projeção final", String(q), String(trace.projected)],
        ]),
      );
      if (report) {
        tools.feedback(trace.projected === first ? "A projeção final recuperou S₁: assinatura aceita." : "A conferência falhou.", trace.projected === first ? "success" : "error");
      }
    };

    const tamper = () => {
      if (!last) {
        tools.feedback("Primeiro produza uma assinatura.", "warning");
        return;
      }
      const changed = mod(last.second + 1n, last.q) || 1n;
      const trace = verify(last.p, last.q, last.g, last.publicKey, last.document, last.first, changed);
      if (!trace) return;
      tools.outputNodes(
        element("p", "S₂ mudou de " + last.second + " para " + changed + "; mensagem e chave ficaram iguais."),
        table("Verificação adulterada", ["quantidade", "valor", "comparação"], [
          ["S₁ esperado", String(last.first), "referência"],
          ["projeção obtida", String(trace.projected), trace.projected === last.first ? "igual" : "diferente"],
          ["decisão", trace.projected === last.first ? "ACEITA" : "REJEITA", "resultado"],
        ]),
      );
      tools.feedback(trace.projected === last.first ? "A alteração coincidiu por acaso; teste outro valor." : "A adulteração foi detectada.", trace.projected === last.first ? "warning" : "success");
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-tamper]"), "click", tamper as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      last = undefined;
      tools.resetForm(form);
      run(false);
    }) as EventListener);
    run(false);
  },
});
