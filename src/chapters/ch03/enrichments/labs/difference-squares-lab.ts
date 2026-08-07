import { gcd, integerSqrt, isPerfectSquare } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

export const differenceSquaresLab = defineLab({
  id: "lab-3-6-diferenca-de-quadrados",
  anchor: "sec-3-6",
  title: "Caminhe entre quadrados até separar os fatores",
  duration: "Seção 3.6 · 10–15 min",
  tags: ["section:3.6", "fermat", "congruencia-de-quadrados"],
  html: [
    '<p class="lab-intro">Comece em \\(a=\\lceil\\sqrt N\\rceil\\) e teste se \\(a^2-N\\) é quadrado. O número de passos torna visível a vantagem de fatores próximos.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Ímpar composto \\(N\\)<input data-n value="5959" inputmode="numeric"></label>',
    '<label>Máximo de passos<input data-limit value="200" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Procurar diferença</button><button type="button" data-far>Usar fatores desequilibrados</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const nInput = tools.q<HTMLInputElement>("[data-n]");
    const limitInput = tools.q<HTMLInputElement>("[data-limit]");
    const run = () => {
      const nRead = readBigInt(nInput, "N", { min: 9n, max: 1000000000000000n });
      const limitRead = readBigInt(limitInput, "limite", { min: 1n, max: 10000n });
      if (!nRead.ok || !limitRead.ok) { tools.feedback(!nRead.ok ? nRead.message : !limitRead.ok ? limitRead.message : "Entrada inválida.", "warning"); return; }
      if (nRead.value % 2n === 0n) { tools.outputText("N é par: 2 é um fator, sem precisar de diferença de quadrados."); tools.feedback("Fator 2 encontrado.", "success"); return; }
      let a = integerSqrt(nRead.value);
      if (a * a < nRead.value) a += 1n;
      const rows: string[][] = [];
      let found: { a: bigint; b: bigint; step: bigint } | undefined;
      for (let step = 0n; step < limitRead.value; step += 1n, a += 1n) {
        const square = a * a - nRead.value;
        const b = integerSqrt(square);
        if (step < 18n || isPerfectSquare(square)) rows.push([String(step), String(a), String(square), isPerfectSquare(square) ? String(b) : "—"]);
        if (isPerfectSquare(square)) { found = { a, b, step }; break; }
      }
      const nodes: Node[] = [table("Busca por b² = a²−N", ["passo", "a", "a²−N", "b"], rows)];
      if (found) {
        const left = gcd(found.a - found.b, nRead.value);
        const right = gcd(found.a + found.b, nRead.value);
        nodes.unshift(element("p", "N = (" + found.a + "−" + found.b + ")(" + found.a + "+" + found.b + ") = " + left + " · " + right + "."));
        const proper = left > 1n && left < nRead.value && right > 1n && right < nRead.value;
        tools.feedback(proper ? "Fatoração própria encontrada em " + (found.step + 1n) + " tentativa(s)." : "A representação encontrada é trivial (1·N) e não fornece fator próprio.", proper ? "success" : "warning");
      } else {
        nodes.unshift(element("p", "Nenhuma diferença de quadrados apareceu no orçamento."));
        tools.feedback("Fatores distantes exigem uma caminhada maior.", "warning");
      }
      tools.outputNodes(...nodes);
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-far]"), "click", (() => { nInput.value = "101909"; limitInput.value = "60"; run(); }) as EventListener);
    run();
  },
});
