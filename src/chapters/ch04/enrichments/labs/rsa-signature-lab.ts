import { gcd, isPrime, modInverse, modPow } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

export const rsaSignatureLab = defineLab({
  id: "lab-4-2-rsa-assinatura",
  anchor: "sec-4-2",
  title: "Bancada RSA: assinar, verificar e forjar o modelo cru",
  duration: "Seção 4.2 · 15–20 min",
  tags: ["section:4.2", "RSA", "assinatura"],
  html: [
    '<p class="lab-intro">Acompanhe a chave privada, a assinatura e o teste público. Depois inverta a ordem do jogo para observar por que RSA sem codificação admite uma forja existencial.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Primo \\(p\\)<input data-p value="541" inputmode="numeric"></label>',
    '<label>Primo \\(q\\)<input data-q value="1223" inputmode="numeric"></label>',
    '<label>Expoente \\(e\\)<input data-e value="159853" inputmode="numeric"></label>',
    '<label>Documento \\(D\\)<input data-d value="630579" inputmode="numeric"></label>',
    '</div><div class="lab-actions">',
    '<button type="submit">Assinar e verificar</button>',
    '<button type="button" data-forge>Forjar escolhendo S primeiro</button>',
    '<button type="button" data-reset>Reiniciar</button>',
    '</div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Resultados da bancada RSA"></div>',
    '<p class="lab-note">Parâmetros pequenos são deliberadamente inseguros. O laboratório expõe a primitiva matemática, não implementa RSA-PSS.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const pInput = tools.q<HTMLInputElement>("[data-p]");
    const qInput = tools.q<HTMLInputElement>("[data-q]");
    const eInput = tools.q<HTMLInputElement>("[data-e]");
    const documentInput = tools.q<HTMLInputElement>("[data-d]");

    const read = (): [bigint, bigint, bigint, bigint] | undefined => {
      const values = [
        readBigInt(pInput, "p", { min: 3n, max: 100000n }),
        readBigInt(qInput, "q", { min: 3n, max: 100000n }),
        readBigInt(eInput, "e", { min: 2n }),
        readBigInt(documentInput, "D", { min: 0n }),
      ];
      const failure = values.find((item) => !item.ok);
      if (failure && !failure.ok) tools.feedback(failure.message, "warning");
      if (!values.every((item) => item.ok)) return;
      return values.map((item) => item.ok ? item.value : 0n) as [bigint, bigint, bigint, bigint];
    };

    const run = (report = true) => {
      const values = read();
      if (!values) return;
      const [p, q, e, rawDocument] = values;
      if (!isPrime(p) || !isPrime(q) || p === q) {
        tools.feedback("p e q precisam ser primos distintos.", "warning");
        return;
      }
      const modulus = p * q;
      const phi = (p - 1n) * (q - 1n);
      if (gcd(e, phi) !== 1n) {
        tools.feedback("e precisa ser coprimo com φ(N).", "warning");
        return;
      }
      const document = rawDocument % modulus;
      const privateExponent = modInverse(e, phi);
      const signature = modPow(document, privateExponent, modulus);
      const recovered = modPow(signature, e, modulus);
      tools.outputNodes(
        element("p", "Chave pública (N, e) = (" + modulus + ", " + e + "); chave privada d = " + privateExponent + "."),
        table("Rastro da assinatura RSA", ["etapa", "operação", "resultado"], [
          ["Representar", "D mod N", String(document)],
          ["Assinar", "D^d mod N", String(signature)],
          ["Verificar", "S^e mod N", String(recovered)],
          ["Decidir", "comparar com D", recovered === document ? "ACEITA" : "REJEITA"],
        ]),
      );
      if (report) tools.feedback("Assinatura honesta verificada.", "success");
    };

    const forge = () => {
      const values = read();
      if (!values) return;
      const [p, q, e] = values;
      if (!isPrime(p) || !isPrime(q) || p === q) {
        tools.feedback("Use primos distintos para formar N.", "warning");
        return;
      }
      const modulus = p * q;
      const chosenSignature = 42n % modulus;
      const inducedDocument = modPow(chosenSignature, e, modulus);
      documentInput.value = String(inducedDocument);
      tools.outputNodes(
        element("p", "Eva escolheu S = " + chosenSignature + " sem conhecer d."),
        table("Forja existencial do RSA cru", ["passo", "cálculo", "valor"], [
          ["1", "escolher S", String(chosenSignature)],
          ["2", "D = S^e mod N", String(inducedDocument)],
          ["3", "verificar S sobre D", "ACEITA por construção"],
        ]),
      );
      tools.feedback("Par válido fabricado sem a chave privada: falta uma codificação segura.", "warning");
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-forge]"), "click", forge as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      tools.resetForm(form);
      run(false);
    }) as EventListener);
    run(false);
  },
});
