import { integerSqrt, isPerfectSquare, isPrime } from "../shared/math";
import { defineLab, readBigInt } from "../shared/lab-runtime";

export const phiFactorLab = defineLab({
  id: "lab-3-2-phi-fatora",
  anchor: "prop-3-2",
  title: "Transforme φ(N) numa fatoração",
  duration: "Seção 3.2 · 8–12 min",
  tags: ["section:3.2", "rsa", "fatoracao"],
  html: [
    '<p class="lab-intro">Dado um semiprimo \\(N=pq\\) e seu totiente, reconstrua a soma, o discriminante e os dois fatores. Modifique φ para ver as verificações falharem.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Módulo \\(N\\)<input data-n value="3233" inputmode="numeric"></label>',
    '<label>Totiente \\(\\varphi(N)\\)<input data-phi value="3120" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Recuperar fatores</button><button type="button" data-perturb>Perturbar φ em 1</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const nInput = tools.q<HTMLInputElement>("[data-n]");
    const phiInput = tools.q<HTMLInputElement>("[data-phi]");
    const run = () => {
      const nRead = readBigInt(nInput, "N", { min: 4n });
      const phiRead = readBigInt(phiInput, "φ(N)", { min: 1n });
      if (!nRead.ok || !phiRead.ok) { tools.feedback(!nRead.ok ? nRead.message : !phiRead.ok ? phiRead.message : "Entrada inválida.", "warning"); return; }
      const sum = nRead.value - phiRead.value + 1n;
      const delta = sum * sum - 4n * nRead.value;
      if (delta < 0n || !isPerfectSquare(delta)) {
        tools.outputMath("\\(p+q=N-\\varphi(N)+1=" + sum + "\\), mas \\(\\Delta=(p+q)^2-4N=" + delta + "\\) não é quadrado não negativo.");
        tools.feedback("Os dados não descrevem um produto de dois inteiros com esse totiente.", "warning");
        return;
      }
      const root = integerSqrt(delta);
      if ((sum - root) % 2n !== 0n) {
        tools.outputText("O discriminante é quadrado, mas as raízes da quadrática não são inteiras.");
        tools.feedback("Paridades incompatíveis.", "warning");
        return;
      }
      const p = (sum - root) / 2n;
      const q = (sum + root) / 2n;
      tools.outputMath("\\(p+q=" + sum + "\\), \\(\\Delta=" + delta + "=" + root + "^2\\). Os candidatos são \\(p=(" + sum + "-" + root + ")/2=" + p + "\\) e \\(q=" + q + "\\). Cheque: \\(pq=" + p * q + "\\).");
      const valid = p !== q && isPrime(p) && isPrime(q) && p * q === nRead.value;
      tools.feedback(valid ? "Primos distintos recuperados exatamente." : "A quadrática tem raízes inteiras, mas elas não são dois primos distintos; os dados não certificam o caso RSA.", valid ? "success" : "warning");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-perturb]"), "click", (() => {
      const phiRead = readBigInt(phiInput, "φ(N)", { min: 1n });
      if (!phiRead.ok) { tools.feedback(phiRead.message, "warning"); return; }
      phiInput.value = String(phiRead.value + 1n);
      run();
    }) as EventListener);
    run();
  },
});
