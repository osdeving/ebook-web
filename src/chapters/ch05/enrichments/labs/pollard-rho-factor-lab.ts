import { gcd } from "../shared/math";
import { defineLab, node, readInteger, table } from "../shared/lab-runtime";

interface RhoState {
  x: bigint;
  alpha: bigint;
  beta: bigint;
}

function modulo(value: bigint, modulus: bigint): bigint {
  const result = value % modulus;
  return result < 0n ? result + modulus : result;
}

function powMod(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = 1n;
  let factor = modulo(base, modulus);
  let power = exponent;
  while (power > 0n) {
    if (power & 1n) result = result * factor % modulus;
    factor = factor * factor % modulus;
    power >>= 1n;
  }
  return result;
}

function extendedGcd(a: bigint, b: bigint): { gcd: bigint; x: bigint } {
  let oldR = a;
  let r = b;
  let oldS = 1n;
  let s = 0n;
  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }
  return { gcd: oldR, x: oldS };
}

function isPrime(value: number): boolean {
  if (value < 2 || value % 1 !== 0) return false;
  if (value % 2 === 0) return value === 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function distinctPrimeFactors(value: bigint): bigint[] {
  let remaining = value;
  let divisor = 2n;
  const factors: bigint[] = [];
  while (divisor * divisor <= remaining) {
    if (remaining % divisor === 0n) {
      factors.push(divisor);
      while (remaining % divisor === 0n) remaining /= divisor;
    }
    divisor = divisor === 2n ? 3n : divisor + 2n;
  }
  if (remaining > 1n) factors.push(remaining);
  return factors;
}

function multiplicativeOrder(base: bigint, prime: bigint): bigint {
  let order = prime - 1n;
  distinctPrimeFactors(order).forEach((factor) => {
    while (order % factor === 0n && powMod(base, order / factor, prime) === 1n) {
      order /= factor;
    }
  });
  return order;
}

function babyStepGiantStep(
  base: bigint,
  target: bigint,
  prime: bigint,
  bound: bigint,
): bigint | undefined {
  const width = BigInt(Math.ceil(Math.sqrt(Number(bound))));
  const babies = new Map<string, bigint>();
  let value = 1n;
  for (let index = 0n; index < width; index += 1n) {
    if (!babies.has(value.toString())) babies.set(value.toString(), index);
    value = value * base % prime;
  }
  const stride = powMod(powMod(base, width, prime), prime - 2n, prime);
  let giant = target;
  for (let block = 0n; block <= width; block += 1n) {
    const within = babies.get(giant.toString());
    if (within !== undefined) {
      const exponent = block * width + within;
      if (exponent < bound) return exponent;
    }
    giant = giant * stride % prime;
  }
  return undefined;
}

export const pollardRhoFactorLab = defineLab({
  id: "lab-5-5-rho-pollard",
  anchor: "sec-5-5-2",
  title: "Rô de Pollard para logaritmos discretos",
  duration: "Seção 5.5.2 · 15–22 min",
  tags: ["section:5.5", "pollard-rho", "logaritmo-discreto", "colisao"],
  html: [
    '<p class="lab-intro">Resolva \\(g^t=h\\pmod p\\) seguindo a função por três intervalos de <a href="#eq-5-41" data-source-xref>(5.41)</a>. Cada ponto carrega expoentes conhecidos \\(x=g^\\alpha h^\\beta\\); uma colisão produz uma congruência linear para \\(t\\) módulo \\(\\operatorname{ord}_p(g)\\).</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Primo p<input data-p type="number" min="5" max="99999989" value="5011"></label>',
    '<label>Base g<input data-g type="number" min="1" value="2"></label>',
    '<label>Alvo h<input data-h type="number" min="1" value="2495"></label>',
    '<label>Limite de iterações<input data-limit type="number" min="1" max="100000" value="5000"></label>',
    '</div><div class="lab-actions"><button type="submit">Procurar colisão</button><button type="button" data-reset>Reiniciar</button></div></form>',
    '<div class="lab-result" data-output role="region" aria-label="Trajetória do rô para logaritmo discreto"></div>',
    '<p class="lab-note">Quando o coeficiente não é invertível módulo a ordem de g, surgem várias classes. O laboratório testa cada uma quando são poucas e usa baby-step–giant-step dentro da família quando são muitas; não há corte silencioso. Se h estiver fora do subgrupo gerado por g, o logaritmo não existe.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const pInput = tools.q<HTMLInputElement>("[data-p]");
    const gInput = tools.q<HTMLInputElement>("[data-g]");
    const hInput = tools.q<HTMLInputElement>("[data-h]");
    const limitInput = tools.q<HTMLInputElement>("[data-limit]");

    const run = (report = true) => {
      const pRead = readInteger(pInput, "p", { min: 5, max: 99999989 });
      const gRead = readInteger(gInput, "g", { min: 1, max: 99999988 });
      const hRead = readInteger(hInput, "h", { min: 1, max: 99999988 });
      const limitRead = readInteger(limitInput, "Limite", { min: 1, max: 100000 });
      const invalid = [pRead, gRead, hRead, limitRead].find((item) => !item.ok);
      if (invalid && !invalid.ok) {
        if (report) tools.feedback(invalid.message, "error");
        return;
      }
      if (!pRead.ok || !gRead.ok || !hRead.ok || !limitRead.ok) return;
      if (!isPrime(pRead.value)) {
        if (report) tools.feedback("p precisa ser primo para este modelo em Fp*.", "error");
        return;
      }
      if (gRead.value >= pRead.value || hRead.value >= pRead.value) {
        if (report) tools.feedback("g e h precisam estar entre 1 e p−1.", "error");
        return;
      }
      const p = BigInt(pRead.value);
      const g = BigInt(gRead.value);
      const h = BigInt(hRead.value);
      const order = multiplicativeOrder(g, p);
      if (powMod(h, order, p) !== 1n) {
        if (report) tools.feedback("h não pertence ao subgrupo gerado por g; o logaritmo não existe.", "error");
        return;
      }
      const step = (state: RhoState): RhoState => {
        if (3n * state.x < p) {
          return { x: g * state.x % p, alpha: (state.alpha + 1n) % order, beta: state.beta };
        }
        if (3n * state.x < 2n * p) {
          return { x: state.x * state.x % p, alpha: 2n * state.alpha % order, beta: 2n * state.beta % order };
        }
        return { x: h * state.x % p, alpha: state.alpha, beta: (state.beta + 1n) % order };
      };
      let tortoise: RhoState = { x: 1n, alpha: 0n, beta: 0n };
      let hare: RhoState = { ...tortoise };
      let iteration = 0;
      const rows: string[][] = [];
      do {
        iteration += 1;
        tortoise = step(tortoise);
        hare = step(step(hare));
        if (iteration <= 20 || tortoise.x === hare.x || iteration === limitRead.value) {
          rows.push([
            String(iteration),
            tortoise.x.toString(),
            hare.x.toString(),
            tortoise.alpha + ", " + tortoise.beta,
            hare.alpha + ", " + hare.beta,
          ]);
        }
      } while (tortoise.x !== hare.x && iteration < limitRead.value);

      if (tortoise.x !== hare.x) {
        tools.output(
          node("p", "Nenhuma colisão antes do limite."),
          table("Tartaruga e lebre", ["i", "xᵢ", "yᵢ", "(αᵢ, βᵢ)", "(γᵢ, δᵢ)"], rows),
        );
        if (report) tools.feedback("Aumente o limite ou escolha outros parâmetros.", "warning");
        return;
      }

      const u = modulo(tortoise.alpha - hare.alpha, order);
      const v = modulo(hare.beta - tortoise.beta, order);
      const divisor = gcd(v, order);
      const candidates: bigint[] = [];
      let logarithm: bigint | undefined;
      let validation = "a congruência não possui classe compatível";
      if (u % divisor === 0n) {
        const reducedV = v / divisor;
        const reducedU = u / divisor;
        const reducedOrder = order / divisor;
        const inverse = modulo(extendedGcd(reducedV, reducedOrder).x, reducedOrder);
        const base = reducedU * inverse % reducedOrder;
        if (divisor <= 10000n) {
          validation = "verificação direta das " + divisor + " classes";
          for (let index = 0n; index < divisor; index += 1n) {
            const candidate = base + index * reducedOrder;
            candidates.push(candidate);
            if (powMod(g, candidate, p) === h) logarithm = candidate;
          }
        } else {
          validation = "baby-step–giant-step entre " + divisor + " classes";
          const firstPower = powMod(g, base, p);
          const target = h * powMod(firstPower, p - 2n, p) % p;
          const classGenerator = powMod(g, reducedOrder, p);
          const classIndex = babyStepGiantStep(classGenerator, target, p, divisor);
          if (classIndex !== undefined) {
            const candidate = base + classIndex * reducedOrder;
            candidates.push(candidate);
            if (powMod(g, candidate, p) === h) logarithm = candidate;
          }
        }
      }
      const summary = logarithm === undefined
        ? "A colisão não forneceu uma classe verificada nesta execução."
        : "Logaritmo encontrado: t = " + logarithm + ".";
      tools.output(
        node("p", summary),
        node("p", "\\(" + v + "t\\equiv" + u + "\\pmod{" + order + "}\\), com mdc " + divisor + "."),
        node("p", "Ordem de g: " + order + "; " + validation + "."),
        table("Tartaruga e lebre", ["i", "xᵢ", "yᵢ", "(αᵢ, βᵢ)", "(γᵢ, δᵢ)"], rows),
      );
      if (report) tools.feedback(summary, logarithm === undefined ? "warning" : "success");
    };

    tools.on(form, "submit", ((event: Event) => {
      event.preventDefault();
      run();
    }) as EventListener);
    tools.on(tools.q("[data-reset]"), "click", (() => {
      tools.reset(form);
      run(false);
    }) as EventListener);
    run(false);
  },
});
