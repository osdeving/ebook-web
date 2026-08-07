import { gcd, isPrime, modInverse, modPow, trialFactor } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

export const rsaMalleabilityLab = defineLab({
  id: "lab-3-3-maleabilidade-rsa",
  anchor: "sec-3-3",
  title: "Ataque guiado à maleabilidade do RSA cru",
  duration: "Seção 3.3 · 12–18 min",
  tags: ["section:3.3", "rsa", "maleabilidade", "cca"],
  html: [
    '<p class="lab-intro">O laboratório simula um oráculo didático para mostrar a álgebra do ataque. Você verá que multiplicar o criptograma por \\(r^e\\) multiplica a mensagem decifrada por r.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Semiprimo \\(N\\)<input data-n value="3233" inputmode="numeric"></label>',
    '<label>Expoente \\(e\\)<input data-e value="17" inputmode="numeric"></label>',
    '<label>Mensagem \\(m\\)<input data-m value="65" inputmode="numeric"></label>',
    '<label>Máscara \\(r\\)<input data-r value="2" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Executar ataque</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">O oráculo existe apenas para tornar o fluxo visível. Em sistemas reais, respostas de erro, tempo ou formato já podem funcionar como informação parcial.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const input = (name: string) => tools.q<HTMLInputElement>("[data-" + name + "]");
    const run = () => {
      const nRead = readBigInt(input("n"), "N", { min: 15n, max: 100000000n });
      const eRead = readBigInt(input("e"), "e", { min: 2n });
      const mRead = readBigInt(input("m"), "m", { min: 0n });
      const rRead = readBigInt(input("r"), "r", { min: 2n });
      const failure = [nRead, eRead, mRead, rRead].find((item) => !item.ok);
      if (failure && !failure.ok) { tools.feedback(failure.message, "warning"); return; }
      if (!nRead.ok || !eRead.ok || !mRead.ok || !rRead.ok) return;
      const factor = trialFactor(nRead.value);
      if (!factor || factor === nRead.value) { tools.feedback("Use um semiprimo pequeno que o simulador consiga fatorar.", "warning"); return; }
      const q = nRead.value / factor;
      if (factor === q || !isPrime(factor) || !isPrime(q)) {
        tools.feedback("N precisa ser o produto de dois primos distintos; caso contrário, a fórmula usada para φ(N) não vale.", "warning");
        return;
      }
      const phi = (factor - 1n) * (q - 1n);
      if (gcd(eRead.value, phi) !== 1n || gcd(rRead.value, nRead.value) !== 1n) {
        tools.feedback("e precisa ser invertível módulo φ(N) e r precisa ser invertível módulo N.", "warning");
        return;
      }
      const d = modInverse(eRead.value, phi);
      const m = mRead.value % nRead.value;
      const c = modPow(m, eRead.value, nRead.value);
      const mask = modPow(rRead.value, eRead.value, nRead.value);
      const altered = c * mask % nRead.value;
      const oracle = modPow(altered, d, nRead.value);
      const recovered = oracle * modInverse(rRead.value, nRead.value) % nRead.value;
      tools.outputNodes(
        element("p", "O simulador usa os fatores apenas para representar o oráculo; o atacante usa somente valores públicos e a resposta."),
        table("Fluxo do ataque", ["etapa", "valor", "leitura"], [
          ["Criptograma observado", String(c), "m^e mod N"],
          ["Máscara pública", String(mask), "r^e mod N"],
          ["Consulta alterada", String(altered), "c·r^e mod N"],
          ["Resposta do oráculo", String(oracle), "m·r mod N"],
          ["Remoção da máscara", String(recovered), "(m·r)·r⁻¹ mod N"],
        ]),
      );
      tools.feedback(recovered === m ? "A mensagem foi recuperada sem consultar a decifragem de c." : "O ataque não fechou.", recovered === m ? "success" : "error");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    run();
  },
});
