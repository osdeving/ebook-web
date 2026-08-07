import { gcd, millerRabinRound } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

export const millerRabinLab = defineLab({
  id: "lab-3-4-miller-rabin",
  anchor: "sec-3-4",
  title: "Miller–Rabin: acompanhe cada quadrado",
  duration: "Seção 3.4 · 12–18 min",
  tags: ["section:3.4", "primalidade", "miller-rabin"],
  html: [
    '<p class="lab-intro">Decomponha \\(N-1=2^s d\\) e veja a cadeia \\(a^d,a^{2d},a^{4d},\\ldots\\). Uma base pode aceitar um composto; várias bases revelam como a confiança se acumula.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Ímpar \\(N\\)<input data-n value="561" inputmode="numeric"></label>',
    '<label>Base \\(a\\)<input data-a value="2" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Executar uma rodada</button><button type="button" data-suite>Testar bases 2, 3, 5, 7, 11</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const nInput = tools.q<HTMLInputElement>("[data-n]");
    const aInput = tools.q<HTMLInputElement>("[data-a]");
    const read = () => {
      const nRead = readBigInt(nInput, "N", { min: 3n, max: 1000000000000n });
      const aRead = readBigInt(aInput, "a", { min: 2n });
      if (!nRead.ok || !aRead.ok) { tools.feedback(!nRead.ok ? nRead.message : !aRead.ok ? aRead.message : "Entrada inválida.", "warning"); return; }
      if (nRead.value % 2n === 0n) { tools.outputText("N é par e maior que 2: já é composto."); tools.feedback("Fator 2 encontrado.", "success"); return; }
      const divisor = gcd(aRead.value, nRead.value);
      if (divisor > 1n && divisor < nRead.value) {
        tools.outputText("mdc(a,N) = " + divisor + ": a própria base revelou um fator próprio.");
        tools.feedback("Composição certificada antes da cadeia.", "success");
        return;
      }
      const round = millerRabinRound(nRead.value, aRead.value);
      tools.outputNodes(
        element("p", "N−1 = 2^" + round.s + " · " + round.d + "; base normalizada = " + round.base + "."),
        table("Cadeia de quadrados", ["índice", "expoente", "resíduo"], round.values.map((value, index) => [
          String(index),
          String(round.d * (1n << BigInt(index))),
          String(value),
        ])),
      );
      tools.feedback(round.witness ? "A base é testemunha forte: N é composto." : "A base passou; N é apenas primo provável para esta rodada.", round.witness ? "success" : "info");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); read(); }) as EventListener);
    tools.on(tools.q("[data-suite]"), "click", (() => {
      const nRead = readBigInt(nInput, "N", { min: 3n, max: 1000000000000n });
      if (!nRead.ok || nRead.value % 2n === 0n) { read(); return; }
      const rows = [2n, 3n, 5n, 7n, 11n].map((base) => {
        const divisor = gcd(base, nRead.value);
        if (divisor > 1n && divisor < nRead.value) return [String(base), "fator " + divisor, "composto"];
        const round = millerRabinRound(nRead.value, base);
        return [String(round.base), round.values.join(" → "), round.witness ? "testemunha" : "passou"];
      });
      tools.outputNodes(table("Conjunto de bases", ["base", "cadeia", "resultado"], rows));
      const found = rows.some((row) => row[2] !== "passou");
      tools.feedback(found ? "Ao menos uma base certificou composição." : "Todas passaram: aumentou a evidência, não surgiu uma prova.", found ? "success" : "info");
    }) as EventListener);
    read();
  },
});
