import { crtPair, isPrime, mod } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

function roots(value: bigint, modulus: bigint): bigint[] {
  const result: bigint[] = [];
  const residue = mod(value, modulus);
  for (let candidate = 0n; candidate < modulus; candidate += 1n) {
    if (candidate * candidate % modulus === residue) result.push(candidate);
  }
  return result;
}

export const rootsPqLab = defineLab({
  id: "lab-3-1-raizes-pq",
  anchor: "sec-3-1",
  title: "Quatro raízes, duas escolhas de sinal",
  duration: "Seção 3.1 · 10–15 min",
  tags: ["section:3.1", "crt", "raizes-quadradas"],
  html: [
    '<p class="lab-intro">Escolha dois primos pequenos e um valor. O laboratório resolve a equação em cada fator, combina todas as escolhas pelo TCR e confere cada raiz módulo \\(N=pq\\).</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Primo \\(p\\)<input data-p value="11" inputmode="numeric"></label>',
    '<label>Primo \\(q\\)<input data-q value="19" inputmode="numeric"></label>',
    '<label>Valor \\(a\\)<input data-a value="9" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Combinar raízes</button><button type="button" data-example>Restaurar exemplo</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">Experimente um valor que não seja quadrado em um dos fatores: a ausência local de raiz impede qualquer raiz global.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const pInput = tools.q<HTMLInputElement>("[data-p]");
    const qInput = tools.q<HTMLInputElement>("[data-q]");
    const aInput = tools.q<HTMLInputElement>("[data-a]");
    const run = () => {
      const pRead = readBigInt(pInput, "p", { min: 3n, max: 199n });
      const qRead = readBigInt(qInput, "q", { min: 3n, max: 199n });
      const aRead = readBigInt(aInput, "a");
      if (!pRead.ok || !qRead.ok || !aRead.ok) {
        tools.feedback(!pRead.ok ? pRead.message : !qRead.ok ? qRead.message : !aRead.ok ? aRead.message : "Entrada inválida.", "warning");
        return;
      }
      const { value: p } = pRead;
      const { value: q } = qRead;
      if (p === q) {
        tools.feedback("Escolha módulos distintos para observar quatro combinações.", "warning");
        return;
      }
      if (!isPrime(p) || !isPrime(q)) {
        tools.feedback("p e q precisam ser primos distintos para que o experimento aplique o caso descrito.", "warning");
        return;
      }
      const rp = roots(aRead.value, p);
      const rq = roots(aRead.value, q);
      if (rp.length === 0 || rq.length === 0) {
        tools.outputText("Não há raiz global: raízes módulo p = [" + rp.join(", ") + "]; raízes módulo q = [" + rq.join(", ") + "].");
        tools.feedback("A obstrução em um único fator já decide a equação.", "warning");
        return;
      }
      const modulus = p * q;
      const combined = [...new Set(rp.flatMap((left) => rq.map((right) => crtPair(left, p, right, q).toString())))]
        .map(BigInt)
        .sort((left, right) => left < right ? -1 : 1);
      const grid = table(
        "Combinações locais e raízes globais",
        ["raiz mod p", "raiz mod q", "raiz mod N", "conferência"],
        rp.flatMap((left) => rq.map((right) => {
          const root = crtPair(left, p, right, q);
          return [String(left), String(right), String(root), String(root * root % modulus)];
        })),
      );
      const summary = element("p", "N = " + modulus + "; raízes distintas: " + combined.join(", ") + ".");
      tools.outputNodes(summary, grid);
      tools.feedback(combined.length + " raiz(es) reconstruída(s) e conferida(s).", "success");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-example]"), "click", (() => {
      pInput.value = "11"; qInput.value = "19"; aInput.value = "9"; run(); pInput.focus();
    }) as EventListener);
    run();
  },
});
