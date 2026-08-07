import { factorOverBase } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

function primesThrough(limit: bigint): bigint[] {
  const primes: bigint[] = [];
  for (let value = 2n; value <= limit; value += 1n) {
    if (primes.every((prime) => value % prime !== 0n || value === prime)) primes.push(value);
  }
  return primes;
}

export const smoothnessLab = defineLab({
  id: "lab-3-7-1-explorador-de-suavidade",
  anchor: "sec-3-7-1",
  title: "Explorador de números B-suaves",
  duration: "Seção 3.7.1 · 10–15 min",
  tags: ["section:3.7.1", "suavidade", "base-de-fatores"],
  html: [
    '<p class="lab-intro">Cole uma lista de inteiros e mova o limite B. A tabela separa a fatoração sobre a base do cofator que ficou de fora.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Valores separados por vírgula<input data-values value="60, 84, 97, 121, 143, 2310"></label>',
    '<label>Limite \\(B\\)<input data-b value="7" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Classificar valores</button><button type="button" data-grow>Aumentar B para 13</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">Um cofator 1 significa suavidade completa. Para uma entrada negativa, classificamos o valor absoluto e registramos o fator −1. O mesmo número pode mudar de classe sem mudar de fatoração: apenas B mudou.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const valuesInput = tools.q<HTMLInputElement>("[data-values]");
    const bInput = tools.q<HTMLInputElement>("[data-b]");
    const run = () => {
      const bRead = readBigInt(bInput, "B", { min: 2n, max: 97n });
      const pieces = valuesInput.value.split(",").map((value) => value.trim()).filter(Boolean);
      if (!bRead.ok || pieces.length === 0 || pieces.length > 30 || pieces.some((value) => !/^-?\d+$/.test(value))) {
        tools.feedback(!bRead.ok ? bRead.message : "Forneça entre 1 e 30 inteiros separados por vírgula.", "warning");
        return;
      }
      const base = primesThrough(bRead.value);
      const rows = pieces.map((raw) => {
        const value = BigInt(raw);
        if (value === 0n) return [raw, "—", "—", "zero não é suave"];
        const result = factorOverBase(value, base);
        const positivePart = base.map((prime, index) => result.exponents[index] ? prime + "^" + result.exponents[index] : "")
          .filter(Boolean).join(" · ") || "1";
        const factorization = value < 0n ? positivePart === "1" ? "−1" : "−1 · " + positivePart : positivePart;
        return [raw, factorization, String(result.remainder), result.remainder === 1n ? "B-suave" : "não B-suave"];
      });
      const hits = rows.filter((row) => row[3] === "B-suave").length;
      tools.outputNodes(
        element("p", "Base de fatores: {" + base.join(", ") + "}. Sucessos: " + hits + "/" + rows.length + "."),
        table("Decomposição sobre a base", ["valor", "parte suave", "cofator", "classe"], rows),
      );
      tools.feedback(hits + " valor(es) são " + bRead.value + "-suaves.", hits ? "success" : "info");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-grow]"), "click", (() => { bInput.value = "13"; run(); }) as EventListener);
    run();
  },
});
