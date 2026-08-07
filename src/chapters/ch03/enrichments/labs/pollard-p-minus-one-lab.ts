import { gcd, modPow } from "../shared/math";
import { defineLab, element, readBigInt, table } from "../shared/lab-runtime";

export const pollardPMinusOneLab = defineLab({
  id: "lab-3-5-pollard-p-menos-1",
  anchor: "sec-3-5",
  title: "Pollard p−1: veja o mdc se abrir",
  duration: "Seção 3.5 · 12–18 min",
  tags: ["section:3.5", "fatoracao", "pollard"],
  html: [
    '<p class="lab-intro">Eleve a base sucessivamente por 2,3,…,B, sempre módulo N. O expoente acumulado é B!; a tabela mostra quando \\(a^{B!}-1\\) passa a compartilhar um fator não trivial com N.</p>',
    '<form data-form><div class="lab-controls">',
    '<label>Composto \\(N\\)<input data-n value="299" inputmode="numeric"></label>',
    '<label>Base \\(a\\)<input data-a value="2" inputmode="numeric"></label>',
    '<label>Limite \\(B\\)<input data-b value="12" inputmode="numeric"></label>',
    '</div><div class="lab-actions"><button type="submit">Executar estágio 1</button><button type="button" data-hard>Exemplo que falha com B pequeno</button></div></form>',
    '<div class="lab-result" data-output aria-live="polite"></div>',
    '<p class="lab-note">O primeiro fator de 299 é 13 e 13−1=12 é muito suave. Compare com um fator cujo p−1 contenha um primo maior que B.</p>',
    '<p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>',
  ].join(""),
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const nInput = tools.q<HTMLInputElement>("[data-n]");
    const aInput = tools.q<HTMLInputElement>("[data-a]");
    const bInput = tools.q<HTMLInputElement>("[data-b]");
    const run = () => {
      const nRead = readBigInt(nInput, "N", { min: 4n, max: 1000000000000n });
      const aRead = readBigInt(aInput, "a", { min: 2n });
      const bRead = readBigInt(bInput, "B", { min: 2n, max: 100n });
      if (!nRead.ok || !aRead.ok || !bRead.ok) { tools.feedback(!nRead.ok ? nRead.message : !aRead.ok ? aRead.message : !bRead.ok ? bRead.message : "Entrada inválida.", "warning"); return; }
      const immediate = gcd(aRead.value, nRead.value);
      if (immediate > 1n && immediate < nRead.value) { tools.outputText("A base já compartilha o fator próprio " + immediate + " com N."); tools.feedback("Fator encontrado antes das potências.", "success"); return; }
      if (immediate === nRead.value) { tools.outputText("mdc(a,N)=N não fornece um fator próprio."); tools.feedback("Escolha uma base que não seja múltipla de N.", "warning"); return; }
      let value = aRead.value % nRead.value;
      const rows: string[][] = [];
      let factor: bigint | undefined;
      for (let step = 2n; step <= bRead.value; step += 1n) {
        value = modPow(value, step, nRead.value);
        const divisor = gcd(value - 1n, nRead.value);
        rows.push([String(step), String(value), String(divisor), divisor > 1n && divisor < nRead.value ? "fator próprio" : divisor === nRead.value ? "ordens colidiram" : "continuar"]);
        if (divisor > 1n && divisor < nRead.value) { factor = divisor; break; }
      }
      tools.outputNodes(
        element("p", factor ? "Encontramos " + factor + " · " + nRead.value / factor + " = " + nRead.value + "." : "Nenhum fator próprio apareceu até B=" + bRead.value + "."),
        table("Potências acumuladas", ["j", "a^(j!) mod N", "mdc(valor−1,N)", "estado"], rows),
      );
      tools.feedback(factor ? "A suavidade de p−1 foi explorada com sucesso." : "Aumente B ou mude de método; este resultado não prova primalidade.", factor ? "success" : "warning");
    };
    tools.on(form, "submit", ((event: Event) => { event.preventDefault(); run(); }) as EventListener);
    tools.on(tools.q("[data-hard]"), "click", (() => { nInput.value = "2021"; aInput.value = "2"; bInput.value = "7"; run(); }) as EventListener);
    run();
  },
});
