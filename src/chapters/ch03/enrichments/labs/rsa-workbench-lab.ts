import { gcd, isPrime, modInverse, modPow } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

export const rsaWorkbenchLab = defineLab({
  id: "lab-3-2-rsa-workbench",
  anchor: "sec-3-2",
  title: "Bancada RSA: gere, cifre e confira",
  duration: "Seção 3.2 · 15–20 min",
  tags: ["section:3.2", "rsa", "chaves"],
  html: [
    '<p class="lab-intro">Faça cada dependência da chave aparecer. Os limites pequenos são deliberados: servem para enxergar a aritmética, nunca para oferecer segurança.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Primo \\(p\\)<input data-p value="61" inputmode="numeric"></label>',
    '<label>Primo \\(q\\)<input data-q value="53" inputmode="numeric"></label>',
    '<label>Expoente \\(e\\)<input data-e value="17" inputmode="numeric"></label>',
    '<label>Mensagem \\(m\\)<input data-m value="65" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Executar ciclo RSA</button><button type="button" data-nonunit>Testar mensagem divisível por p</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">Depois de conferir o exemplo, altere e para um valor que compartilhe fator com φ(N) e observe por que a chave privada deixa de existir.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const inputs = {
      p: tools.q<HTMLInputElement>("[data-p]"),
      q: tools.q<HTMLInputElement>("[data-q]"),
      e: tools.q<HTMLInputElement>("[data-e]"),
      m: tools.q<HTMLInputElement>("[data-m]"),
    };
    const run = () => {
      const pRead = readBigInt(inputs.p, "p", { min: 3n, max: 10000n });
      const qRead = readBigInt(inputs.q, "q", { min: 3n, max: 10000n });
      const eRead = readBigInt(inputs.e, "e", { min: 2n });
      const mRead = readBigInt(inputs.m, "m", { min: 0n });
      const failure = [pRead, qRead, eRead, mRead].find((item) => !item.ok);
      if (failure && !failure.ok) { tools.feedback(failure.message, "warning"); return; }
      if (!pRead.ok || !qRead.ok || !eRead.ok || !mRead.ok) return;
      const p = pRead.value;
      const q = qRead.value;
      if (!isPrime(p) || !isPrime(q) || p === q) {
        tools.feedback("p e q precisam ser primos distintos neste laboratório.", "warning");
        return;
      }
      const n = p * q;
      const phi = (p - 1n) * (q - 1n);
      if (gcd(eRead.value, phi) !== 1n) {
        tools.outputText("mdc(e, φ(N)) = " + gcd(eRead.value, phi) + "; não existe inverso para e.");
        tools.feedback("Escolha e coprimo com φ(N).", "warning");
        return;
      }
      const m = mRead.value % n;
      const d = modInverse(eRead.value, phi);
      const c = modPow(m, eRead.value, n);
      const recovered = modPow(c, d, n);
      const rows = [
        ["Estrutura", "N = p·q", String(n)],
        ["Totiente", "φ(N) = (p−1)(q−1)", String(phi)],
        ["Inverso", "ed ≡ 1 (mod φ(N))", "d = " + d],
        ["Cifragem", "c = m^e mod N", String(c)],
        ["Decifragem", "c^d mod N", String(recovered)],
        ["Cheque local", "m mod p / m mod q", (m % p) + " / " + (m % q)],
      ];
      tools.outputNodes(
        element("p", "Chave pública (" + n + ", " + eRead.value + "); expoente privado d = " + d + "."),
        table("Rastro completo", ["etapa", "regra", "resultado"], rows),
      );
      tools.feedback(recovered === m ? "A mensagem voltou corretamente, inclusive se não for unidade." : "A conferência falhou.", recovered === m ? "success" : "error");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-nonunit]"), "click", (() => { inputs.m.value = inputs.p.value; run(); }) as EventListener);
    run();
  },
});
