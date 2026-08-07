import {
  defineEnrichment, LAB_KICKER as supplement, initialise, inverseMod, mod,
  powMod, q, setFeedback, setOutput
} from "../shared";

export const bsgsLab = defineEnrichment({
    id: "lab-2-7-baby-giant",
    layer: "lab",
    anchor: "#exp-2-7-algebra-da-colisao",
    title: "Passos de bebê e passos de gigante",
    kicker: supplement,
    meta: "Seção 2.7 · intermediário · 9–12 min",
    html: `
      <p class="lab-intro">Resolva 2^x=21 módulo 29. A ordem de 2 é N=28 e n=⌈√N⌉=6. Procuraremos uma colisão entre 2^r e 21·(2⁻⁶)^q.</p>
      <div class="lab-grid lab-grid-two">
        <div class="lab-table-wrap">
          <table class="lab-table"><caption>Passos de bebê</caption><thead><tr><th scope="col">r</th><th scope="col">2^r mod 29</th></tr></thead><tbody data-baby></tbody></table>
        </div>
        <div class="lab-table-wrap">
          <table class="lab-table"><caption>Passos de gigante</caption><thead><tr><th scope="col">q</th><th scope="col">21·(2⁻⁶)^q mod 29</th></tr></thead><tbody data-giant></tbody></table>
        </div>
      </div>
      <div class="lab-actions">
        <button type="button" data-next>Próximo passo</button>
        <button type="button" data-auto>Completar tabelas</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const p = 29n;
      const g = 2n;
      const h = 21n;
      const n = 6n;
      const giantFactor = inverseMod(powMod(g, n, p), p);
      let state: {
        phase: "baby" | "giant";
        index: bigint;
        babies: Map<string, bigint>;
        done: boolean;
      };
      const reset = () => {
        state = { phase: "baby", index: 0n, babies: new Map<string, bigint>(), done: false };
        q(root, "[data-baby]").replaceChildren();
        q(root, "[data-giant]").replaceChildren();
        setOutput(root, `<p>Fator gigante: (2⁶)⁻¹ mod 29 = ${giantFactor}. Armazenamento previsto: cerca de 2·6 entradas, em vez de percorrer até 28 potências.</p>`);
        setFeedback(root, "Comece construindo os passos de bebê.");
      };
      const addRow = (body: HTMLElement, first: bigint, second: bigint) => {
        const row = document.createElement("tr");
        const a = document.createElement("td");
        const b = document.createElement("td");
        a.textContent = first.toString();
        b.textContent = second.toString();
        row.append(a, b);
        body.append(row);
      };
      const next = () => {
        if (state.done) return;
        if (state.phase === "baby") {
          const r = state.index;
          const value = powMod(g, r, p);
          state.babies.set(value.toString(), r);
          addRow(q(root, "[data-baby]"), r, value);
          state.index += 1n;
          setFeedback(root, `Passo de bebê r=${r}: valor ${value}.`);
          if (state.index === n) {
            state.phase = "giant";
            state.index = 0n;
            setFeedback(root, "Lista de bebês pronta. Agora procure um valor repetido na lista gigante.");
          }
          return;
        }
        const giantIndex = state.index;
        const value = mod(h * powMod(giantFactor, giantIndex, p), p);
        addRow(q(root, "[data-giant]"), giantIndex, value);
        const babyIndex = state.babies.get(value.toString());
        if (babyIndex !== undefined) {
          const x = giantIndex * n + babyIndex;
          state.done = true;
          setOutput(root, `<ol class="lab-steps">
            <li>Colisão: 2^${babyIndex} = 21·(2⁻⁶)^${giantIndex} = ${value} módulo 29.</li>
            <li>Multiplicando por 2^(6·${giantIndex}): 2^(6·${giantIndex}+${babyIndex}) = 21.</li>
            <li>x = 6·${giantIndex}+${babyIndex} = <strong>${x}</strong>; verificação: 2^${x} mod 29 = ${powMod(g, x, p)}.</li>
          </ol>`);
          setFeedback(root, `Colisão encontrada; x=${x}.`, "success");
          return;
        }
        state.index += 1n;
        setFeedback(root, `Passo gigante q=${giantIndex}: valor ${value}; ainda não há colisão.`);
        if (state.index === n) {
          state.done = true;
          setFeedback(root, "Nenhuma colisão foi encontrada nos limites previstos.", "warning");
        }
      };
      q(root, "[data-next]").addEventListener("click", next);
      q(root, "[data-auto]").addEventListener("click", () => {
        let guard = 0;
        while (!state.done && guard < 20) {
          next();
          guard += 1;
        }
      });
      q(root, "[data-reset]").addEventListener("click", reset);
      reset();
    })
  });
