import { factorOverBase, gcd, integerSqrt, isPerfectSquare, modPow } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

function primesThrough(limit: bigint): bigint[] {
  const primes: bigint[] = [];
  for (let value = 2n; value <= limit; value += 1n) {
    if (primes.every((prime) => value % prime !== 0n)) primes.push(value);
  }
  return primes;
}

interface Relation {
  x: bigint;
  value: bigint;
  exponents: readonly number[];
}

export const quadraticSieveLab = defineLab({
  id: "lab-3-7-2-mini-crivo-quadratico",
  anchor: "sec-3-7-2",
  title: "Mini-crivo quadrático: de relações ao fator",
  duration: "Seção 3.7.2 · 20–30 min",
  tags: ["section:3.7.2", "crivo-quadratico", "algebra-linear"],
  html: [
    '<p class="lab-intro">Colete valores \\(Q(x)=x^2-N\\) suaves, converta expoentes em paridades e procure uma combinação de pelo menos duas relações cujo produto seja quadrado.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Composto \\(N\\)<input data-n value="1073" inputmode="numeric"></label>',
    '<label>Limite \\(B\\)<input data-b value="19" inputmode="numeric"></label>',
    '<label>Janela de x<input data-window value="60" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Crivar e combinar</button><button type="button" data-expand>Ampliar janela</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">O exemplo 1073=29·37 encontra uma dependência entre Q(35)=152 e Q(41)=608: nenhum dos dois é quadrado, mas o produto é.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const nInput = tools.q<HTMLInputElement>("[data-n]");
    const bInput = tools.q<HTMLInputElement>("[data-b]");
    const windowInput = tools.q<HTMLInputElement>("[data-window]");
    const run = () => {
      const nRead = readBigInt(nInput, "N", { min: 15n, max: 10000000n });
      const bRead = readBigInt(bInput, "B", { min: 3n, max: 47n });
      const windowRead = readBigInt(windowInput, "janela", { min: 5n, max: 160n });
      if (!nRead.ok || !bRead.ok || !windowRead.ok) {
        tools.feedback(!nRead.ok ? nRead.message : !bRead.ok ? bRead.message : !windowRead.ok ? windowRead.message : "Entrada inválida.", "warning");
        return;
      }
      const candidatePrimes = primesThrough(bRead.value);
      const directFactor = candidatePrimes.find((prime) => prime < nRead.value && nRead.value % prime === 0n);
      if (directFactor) {
        tools.outputText("A divisão pela base já encontrou " + directFactor + " · " + nRead.value / directFactor + " = " + nRead.value + ".");
        tools.feedback("Fator próprio encontrado antes da coleta de relações.", "success");
        return;
      }
      const base = candidatePrimes.filter((prime) => (
        prime === 2n || modPow(nRead.value, (prime - 1n) / 2n, prime) === 1n
      ));
      let start = integerSqrt(nRead.value);
      if (start * start < nRead.value) start += 1n;
      const relations: Relation[] = [];
      for (let offset = 0n; offset < windowRead.value; offset += 1n) {
        const x = start + offset;
        const value = x * x - nRead.value;
        if (value <= 0n) continue;
        const factored = factorOverBase(value, base);
        if (factored.remainder === 1n) relations.push({ x, value, exponents: factored.exponents });
      }
      const usable = relations.slice(0, 18);
      let solution: { mask: number; x: bigint; y: bigint; factor: bigint; product: bigint } | undefined;
      for (let mask = 1; mask < 2 ** usable.length && !solution; mask += 1) {
        if ((mask & (mask - 1)) === 0) continue;
        const totals = base.map(() => 0);
        let xProduct = 1n;
        let product = 1n;
        usable.forEach((relation, index) => {
          if ((mask & (1 << index)) === 0) return;
          xProduct = xProduct * relation.x % nRead.value;
          product *= relation.value;
          relation.exponents.forEach((exponent, column) => { totals[column] = (totals[column] ?? 0) + exponent; });
        });
        if (totals.some((exponent) => exponent % 2 !== 0) || !isPerfectSquare(product)) continue;
        const y = integerSqrt(product) % nRead.value;
        const factor = gcd(xProduct - y, nRead.value);
        if (factor > 1n && factor < nRead.value) solution = { mask, x: xProduct, y, factor, product };
      }
      const rows = relations.map((relation, index) => [
        String(index),
        String(relation.x),
        String(relation.value),
        relation.exponents.map((exponent, column) => exponent ? base[column] + "^" + exponent : "").filter(Boolean).join(" · ") || "1",
        relation.exponents.map((exponent) => String(exponent % 2)).join(""),
      ]);
      const nodes: Node[] = [
        element("p", "Base {" + base.join(", ") + "}; " + relations.length + " relação(ões) suave(s) na janela."),
        table("Relações coletadas", ["id", "x", "Q(x)", "fatoração", "vetor mod 2"], rows),
      ];
      if (solution) {
        const selected = usable.map((_, index) => index).filter((index) => (solution!.mask & (1 << index)) !== 0);
        nodes.push(element("p", "Dependência {" + selected.join(", ") + "}: x=" + solution.x + ", y=√" + solution.product + " mod N=" + solution.y + "; mdc(x−y,N)=" + solution.factor + "."));
        tools.feedback("Fatoração: " + solution.factor + " · " + nRead.value / solution.factor + " = " + nRead.value + ".", "success");
      } else {
        nodes.push(element("p", "Nenhuma dependência não trivial foi encontrada entre as primeiras " + usable.length + " relações."));
        tools.feedback("Aumente B ou a janela para coletar mais relações.", "warning");
      }
      tools.outputNodes(...nodes);
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-expand]"), "click", (() => { windowInput.value = String(Math.min(160, Number(windowInput.value || 0) + 30)); run(); }) as EventListener);
    run();
  },
});
