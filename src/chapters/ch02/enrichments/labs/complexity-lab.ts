import {
  defineEnrichment, LAB_KICKER as supplement, initialise, q, setFeedback,
  setOutput
} from "../shared";

export const complexityLab = defineEnrichment({
    id: "lab-2-6-corrida-complexidade",
    layer: "lab",
    anchor: "#exp-2-6-tres-regimes-de-tempo",
    title: "Corrida de crescimento em função dos bits",
    kicker: supplement,
    meta: "Seção 2.6 · iniciante · 5–8 min",
    html: `
      <p class="lab-intro">Mova o tamanho da entrada. As barras usam escala logarítmica; a tabela textual informa os valores aproximados sem depender do comprimento visual. Neste recorte, \\(2^{\\sqrt{k}}\\) ainda fica abaixo de \\(k^2\\); isso não contradiz sua natureza subexponencial: as duas curvas se encontram em \\(k=256\\), e depois \\(2^{\\sqrt{k}}\\) supera qualquer potência fixa de \\(k\\).</p>
      <label class="lab-range-label">Tamanho da entrada: <output data-k-output>12</output> bits
        <input type="range" min="4" max="40" value="12" step="1" data-k aria-label="Tamanho da entrada em bits">
      </label>
      <div class="lab-bars" data-bars role="img" aria-label="Comparação entre custos quadrático, subexponencial e exponencial">
        <div class="lab-bar-row" data-kind="poly"><span>k²</span><span class="lab-bar-track"><span class="lab-bar-fill"></span></span><output></output></div>
        <div class="lab-bar-row" data-kind="sub"><span>2^√k</span><span class="lab-bar-track"><span class="lab-bar-fill"></span></span><output></output></div>
        <div class="lab-bar-row" data-kind="exp"><span>2^k</span><span class="lab-bar-track"><span class="lab-bar-fill"></span></span><output></output></div>
      </div>
      <div class="lab-result" data-output></div>
      <div class="lab-actions"><button type="button" class="secondary" data-reset>Reiniciar</button></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const formatApprox = (value: number) => value >= 1e9 ? value.toExponential(3) : Math.round(value).toLocaleString("pt-BR");
      const update = () => {
        const k = Number(q(root, "[data-k]").value);
        q(root, "[data-k-output]").textContent = String(k);
        const values = {
          poly: k ** 2,
          sub: 2 ** Math.sqrt(k),
          exp: 2 ** k
        };
        const maximumLog = Math.log10(values.exp);
        Object.entries(values).forEach(([kind, value]) => {
          const row = q(root, `[data-kind="${kind}"]`);
          const percent = Math.max(3, (Math.log10(Math.max(1, value)) / maximumLog) * 100);
          q(row, ".lab-bar-fill").style.width = `${percent}%`;
          q(row, "output").textContent = formatApprox(value);
          row.setAttribute("aria-label", `${q(row, "span").textContent}: aproximadamente ${formatApprox(value)} operações`);
        });
        const candidates = 1n << BigInt(k);
        const seconds = Number(candidates) / 1e9;
        setOutput(root, `<p>Uma entrada de ${k} bits pode representar ${candidates.toLocaleString("pt-BR")} candidatos. A 10⁹ tentativas por segundo, enumerá-los uma vez levaria aproximadamente ${seconds < 1 ? seconds.toFixed(6) : seconds.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} segundo(s).</p>`);
        setFeedback(root, `Ao acrescentar um bit, 2^k dobra; k² cresce bem menos.`, "info");
      };
      q(root, "[data-k]").addEventListener("input", update);
      q(root, "[data-reset]").addEventListener("click", () => {
        q(root, "[data-k]").value = "12";
        update();
        setFeedback(root, "Laboratório reiniciado.");
      });
      update();
    })
  });
