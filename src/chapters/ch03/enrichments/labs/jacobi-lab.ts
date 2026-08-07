import { mod } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

function jacobiTrace(numerator: bigint, denominator: bigint): { result: -1 | 0 | 1; rows: string[][] } {
  let a = mod(numerator, denominator);
  let n = denominator;
  let sign = 1;
  const rows: string[][] = [["início", String(a), String(n), "+1"]];
  while (a !== 0n) {
    while (a % 2n === 0n) {
      a /= 2n;
      const residue = n % 8n;
      const flips = residue === 3n || residue === 5n;
      if (flips) sign = -sign;
      rows.push(["retira fator 2; n mod 8 = " + residue, String(a), String(n), sign > 0 ? "+1" : "−1"]);
    }
    const oldA = a;
    a = n;
    n = oldA;
    const flips = a % 4n === 3n && n % 4n === 3n;
    if (flips) sign = -sign;
    rows.push(["reciprocidade" + (flips ? " (troca sinal)" : ""), String(a), String(n), sign > 0 ? "+1" : "−1"]);
    a %= n;
    rows.push(["redução do numerador", String(a), String(n), sign > 0 ? "+1" : "−1"]);
  }
  return { result: n === 1n ? sign as -1 | 1 : 0, rows };
}

export const jacobiLab = defineLab({
  id: "lab-3-9-jacobi-e-reciprocidade",
  anchor: "sec-3-9",
  title: "Símbolo de Jacobi pelo algoritmo de Euclides",
  duration: "Seção 3.9 · 12–18 min",
  tags: ["section:3.9", "jacobi", "reciprocidade-quadratica"],
  html: [
    '<p class="lab-intro">Acompanhe retiradas de fatores 2, trocas por reciprocidade e reduções por resto. Nenhuma fatoração do denominador é usada.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Numerador \\(a\\)<input data-a value="1001" inputmode="numeric"></label>',
    '<label>Denominador ímpar \\(N\\)<input data-n value="9907" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Calcular símbolo</button><button type="button" data-ambiguous>Exemplo Jacobi 1 sem raiz</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">No exemplo ambíguo, (2/15)=1, mas os quadrados módulo 15 são 0,1,4,6,9,10; 2 não aparece.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const aInput = tools.q<HTMLInputElement>("[data-a]");
    const nInput = tools.q<HTMLInputElement>("[data-n]");
    const run = () => {
      const aRead = readBigInt(aInput, "a");
      const nRead = readBigInt(nInput, "N", { min: 3n, max: 1000000000000000n });
      if (!aRead.ok || !nRead.ok) { tools.feedback(!aRead.ok ? aRead.message : !nRead.ok ? nRead.message : "Entrada inválida.", "warning"); return; }
      if (nRead.value % 2n === 0n) { tools.feedback("O denominador de Jacobi precisa ser positivo e ímpar.", "warning"); return; }
      const trace = jacobiTrace(aRead.value, nRead.value);
      tools.outputNodes(
        element("p", "Resultado: (" + aRead.value + "/" + nRead.value + ") = " + trace.result + "."),
        table("Redução sem fatorar N", ["operação", "a", "N", "sinal"], trace.rows),
      );
      tools.feedback(trace.result === 1 ? "Jacobi 1: quadrado possível, mas não garantido para N composto." : trace.result === -1 ? "Jacobi −1: não pode ser quadrado módulo N." : "Jacobi 0: a e N compartilham fator.", "success");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-ambiguous]"), "click", (() => { aInput.value = "2"; nInput.value = "15"; run(); }) as EventListener);
    run();
  },
});
