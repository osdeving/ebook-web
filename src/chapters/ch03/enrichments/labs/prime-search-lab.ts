import { millerRabinRound } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

const smallPrimes = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
const bases = [2n, 3n, 5n, 7n, 11n];

function probablePrime(value: bigint): { accepted: boolean; reason: string } {
  if (value === 2n || value === 3n) return { accepted: true, reason: "primo pequeno" };
  if (value < 2n || value % 2n === 0n) return { accepted: false, reason: "divisível por 2" };
  const divisor = smallPrimes.find((prime) => value !== prime && value % prime === 0n);
  if (divisor) return { accepted: false, reason: "divisível por " + divisor };
  let tested = 0;
  for (const base of bases) {
    if (base >= value - 1n) continue;
    tested += 1;
    if (millerRabinRound(value, base).witness) return { accepted: false, reason: "MR: base " + base + " testemunha" };
  }
  return { accepted: true, reason: "passou por " + tested + (tested === 1 ? " base" : " bases") };
}

export const primeSearchLab = defineLab({
  id: "lab-3-4-busca-de-primos",
  anchor: "sec-3-4-1",
  title: "Orçamento de busca por um primo provável",
  duration: "Seções 3.4.1–3.4.2 · 12–18 min",
  tags: ["section:3.4", "primos", "densidade"],
  html: [
    '<p class="lab-intro">Parta de um inteiro ímpar, elimine divisores pequenos e aplique Miller–Rabin. O rastro separa filtros baratos da evidência probabilística final.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Candidato inicial<input data-start value="1000001" inputmode="numeric"></label>',
    '<label>Máximo de candidatos<input data-count value="60" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Procurar próximo primo provável</button><button type="button" data-random>Usar início de 20 bits</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">As bases fixas deste laboratório servem aos valores pequenos permitidos aqui. Geração criptográfica real usa fonte aleatória apropriada, parâmetros e conjuntos de bases auditados.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const startInput = tools.q<HTMLInputElement>("[data-start]");
    const countInput = tools.q<HTMLInputElement>("[data-count]");
    const run = () => {
      const startRead = readBigInt(startInput, "início", { min: 3n, max: 1000000000000n });
      const countRead = readBigInt(countInput, "quantidade", { min: 1n, max: 300n });
      if (!startRead.ok || !countRead.ok) { tools.feedback(!startRead.ok ? startRead.message : !countRead.ok ? countRead.message : "Entrada inválida.", "warning"); return; }
      let candidate = startRead.value % 2n === 0n ? startRead.value + 1n : startRead.value;
      const rows: string[][] = [];
      let found: bigint | undefined;
      for (let index = 0n; index < countRead.value; index += 1n, candidate += 2n) {
        const result = probablePrime(candidate);
        rows.push([String(index + 1n), String(candidate), result.reason]);
        if (result.accepted) { found = candidate; break; }
      }
      const expected = Math.log(Number(startRead.value > 3n ? startRead.value : 3n)) / 2;
      tools.outputNodes(
        element("p", "Heurística entre ímpares: cerca de ln(X)/2 ≈ " + expected.toFixed(2) + " candidatos por primo."),
        table("Candidatos examinados", ["tentativa", "n", "filtro/resultado"], rows),
      );
      tools.feedback(found ? "Primeiro primo provável encontrado: " + found + "." : "Nenhum candidato passou no orçamento escolhido.", found ? "success" : "warning");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-random]"), "click", (() => {
      const offset = BigInt(Math.floor(Math.random() * 524288));
      startInput.value = String(524289n + offset | 1n);
      run();
    }) as EventListener);
    run();
  },
});
