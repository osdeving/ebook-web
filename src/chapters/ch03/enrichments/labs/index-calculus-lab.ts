import { factorOverBase, isPrime, mod, modPow } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

const factorBase = [2n, 3n, 5n, 7n];

function bruteLog(base: bigint, target: bigint, prime: bigint): bigint | undefined {
  let value = 1n;
  const normalizedTarget = mod(target, prime);
  for (let exponent = 0n; exponent < prime - 1n; exponent += 1n) {
    if (value === normalizedTarget) return exponent;
    value = value * base % prime;
  }
  return undefined;
}

function multiplicativeOrder(base: bigint, prime: bigint): bigint {
  const normalizedBase = mod(base, prime);
  if (normalizedBase === 0n) return 0n;
  let value = 1n;
  for (let order = 1n; order < prime; order += 1n) {
    value = value * normalizedBase % prime;
    if (value === 1n) return order;
  }
  return 0n;
}

export const indexCalculusLab = defineLab({
  id: "lab-3-8-calculo-de-indices",
  anchor: "sec-3-8",
  title: "Cálculo de índices em um corpo pequeno",
  duration: "Seção 3.8 · 15–22 min",
  tags: ["section:3.8", "logaritmo-discreto", "base-de-fatores"],
  html: [
    '<p class="lab-intro">Para tornar cada etapa verificável, o laboratório obtém os logaritmos da base por busca exaustiva. Depois executa a etapa característica do cálculo de índices: suavizar \\(h g^k\\) e reconstruir o logaritmo do alvo.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Primo \\(p\\)<input data-p value="101" inputmode="numeric"></label>',
    '<label>Gerador \\(g\\)<input data-g value="2" inputmode="numeric"></label>',
    '<label>Alvo \\(h\\)<input data-h value="37" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Executar logaritmo individual</button><button type="button" data-new>Usar alvo 73</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">No algoritmo real, os logaritmos da base vêm de muitas relações e álgebra linear; a busca exaustiva aqui é apenas um instrumento de conferência para o grupo minúsculo.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const pInput = tools.q<HTMLInputElement>("[data-p]");
    const gInput = tools.q<HTMLInputElement>("[data-g]");
    const hInput = tools.q<HTMLInputElement>("[data-h]");
    const run = () => {
      const pRead = readBigInt(pInput, "p", { min: 11n, max: 499n });
      const gRead = readBigInt(gInput, "g", { min: 2n });
      const hRead = readBigInt(hInput, "h", { min: 1n });
      if (!pRead.ok || !gRead.ok || !hRead.ok) { tools.feedback(!pRead.ok ? pRead.message : !gRead.ok ? gRead.message : !hRead.ok ? hRead.message : "Entrada inválida.", "warning"); return; }
      if (!isPrime(pRead.value)) {
        tools.feedback("p precisa ser primo para que o grupo tenha ordem p−1 e a aritmética ocorra em um corpo.", "warning");
        return;
      }
      if (multiplicativeOrder(gRead.value, pRead.value) !== pRead.value - 1n) {
        tools.feedback("g precisa ter ordem p−1, isto é, gerar todo o grupo multiplicativo.", "warning");
        return;
      }
      const normalizedTarget = mod(hRead.value, pRead.value);
      if (normalizedTarget === 0n) {
        tools.feedback("h precisa representar um elemento não nulo módulo p.", "warning");
        return;
      }
      const logs = factorBase.map((prime) => bruteLog(gRead.value, prime, pRead.value));
      if (logs.some((value) => value === undefined)) {
        tools.outputText("g não alcança todos os elementos da base {2,3,5,7}; escolha um gerador do grupo.");
        tools.feedback("A base de fatores ficou fora do subgrupo gerado por g.", "warning");
        return;
      }
      let shifted = normalizedTarget;
      let found: { k: bigint; value: bigint; exponents: readonly number[] } | undefined;
      for (let k = 0n; k < pRead.value - 1n; k += 1n) {
        const factored = factorOverBase(shifted, factorBase);
        if (factored.remainder === 1n) { found = { k, value: shifted, exponents: factored.exponents }; break; }
        shifted = shifted * gRead.value % pRead.value;
      }
      if (!found) { tools.outputText("Nenhum deslocamento suave apareceu."); tools.feedback("Troque a base de fatores ou os parâmetros.", "warning"); return; }
      const sum = found.exponents.reduce((total, exponent, index) => total + BigInt(exponent) * logs[index]!, 0n);
      const recovered = mod(sum - found.k, pRead.value - 1n);
      const direct = bruteLog(gRead.value, normalizedTarget, pRead.value);
      tools.outputNodes(
        table("Logaritmos pré-calculados da base", ["elemento", "log_g"], factorBase.map((prime, index) => [String(prime), String(logs[index])])),
        element("p", "h·g^" + found.k + " ≡ " + found.value + " = " + found.exponents.map((exponent, index) => exponent ? factorBase[index] + "^" + exponent : "").filter(Boolean).join("·") + "."),
        element("p", "Logo log_g(h) ≡ Σ eᵢlog_g(pᵢ)−k ≡ " + recovered + " (mod " + (pRead.value - 1n) + "). Conferência direta: " + direct + "."),
      );
      const verified = direct === recovered && modPow(gRead.value, recovered, pRead.value) === normalizedTarget;
      tools.feedback(verified ? "Logaritmo reconstruído e conferido." : "A reconstrução não coincidiu com a conferência direta.", verified ? "success" : "warning");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-new]"), "click", (() => { hInput.value = "73"; run(); }) as EventListener);
    run();
  },
});
