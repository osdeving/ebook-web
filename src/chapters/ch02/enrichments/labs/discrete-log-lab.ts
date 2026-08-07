import {
  defineEnrichment, LAB_KICKER as supplement, initialise, mod, orderMod,
  q, setFeedback, setOutput
} from "../shared";

export const discreteLogLab = defineEnrichment({
    id: "lab-2-2-roda-pld",
    layer: "lab",
    anchor: "#exp-2-2-log-mod-p-minus-one",
    title: "Roda de potências e caça ao PLD",
    kicker: supplement,
    meta: "Seção 2.2 · iniciante · 7–10 min",
    html: `
      <p class="lab-intro">Avance uma potência por vez. A roda marca os resíduos visitados e a trilha textual mantém a mesma informação disponível sem depender da posição visual.</p>
      <div class="lab-controls">
        <label>Caso de estudo
          <select data-preset>
            <option value="11,2,7">p=11, g=2, h=7 — solução existente</option>
            <option value="13,2,11">p=13, g=2, h=11 — ciclo maior</option>
            <option value="7,2,3">p=7, g=2, h=3 — h fora do subgrupo</option>
          </select>
        </label>
      </div>
      <div class="lab-wheel" data-wheel role="list" aria-label="Resíduos não nulos do módulo escolhido"></div>
      <p class="lab-equivalent" data-sequence>Nenhuma potência calculada ainda.</p>
      <div class="lab-actions">
        <button type="button" data-step>Próxima potência</button>
        <button type="button" data-complete>Completar a busca</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      let state: { exponent: bigint; value: bigint; sequence: string[]; done: boolean };
      const readPreset = (): [bigint, bigint, bigint] => {
        const values = String(q(root, "[data-preset]").value).split(",");
        return [BigInt(values[0]!), BigInt(values[1]!), BigInt(values[2]!)];
      };
      const renderWheel = () => {
        const [p, , h] = readPreset();
        const wheel = q(root, "[data-wheel]");
        wheel.replaceChildren();
        for (let residue = 1n; residue < p; residue += 1n) {
          const cell = document.createElement("span");
          cell.className = "lab-wheel-cell";
          cell.setAttribute("role", "listitem");
          cell.dataset.residue = residue.toString();
          cell.textContent = residue.toString();
          cell.setAttribute("aria-label", `Resíduo ${residue}${residue === h ? ", alvo h" : ""}`);
          if (residue === h) cell.classList.add("is-target");
          wheel.append(cell);
        }
      };
      const reset = () => {
        state = { exponent: 0n, value: 1n, sequence: [], done: false };
        renderWheel();
        q(root, "[data-sequence]").textContent = "Nenhuma potência calculada ainda.";
        setOutput(root, "");
        setFeedback(root, "Comece por g¹.");
      };
      const step = () => {
        if (state.done) return;
        const [p, g, h] = readPreset();
        state.exponent += 1n;
        state.value = mod(state.value * g, p);
        state.sequence.push(`g^${state.exponent}=${state.value}`);
        const cell = q(root, `[data-residue="${state.value}"]`);
        if (cell) cell.classList.add("is-visited");
        q(root, "[data-sequence]").textContent = `Trilha: ${state.sequence.join("; ")}.`;
        if (state.value === h) {
          state.done = true;
          const order = orderMod(g, p, p - 1n);
          setOutput(root, `<p><strong>Encontrado:</strong> log<sub>${g}</sub>(${h}) = ${state.exponent} módulo ${order}.</p>`);
          setFeedback(root, `O alvo apareceu na potência ${state.exponent}.`, "success");
        } else if (state.value === 1n) {
          state.done = true;
          const order = state.exponent;
          setOutput(root, `<p>O ciclo fechou depois de ${order} passo(s), sem visitar h=${h}. Portanto h não pertence ao subgrupo gerado por g=${g}.</p>`);
          setFeedback(root, "Nem toda base alcança todo resíduo não nulo.", "warning");
        } else {
          setFeedback(root, `Passo ${state.exponent}: o resíduo atual é ${state.value}.`);
        }
      };
      q(root, "[data-step]").addEventListener("click", step);
      q(root, "[data-complete]").addEventListener("click", () => {
        let guard = 0;
        while (!state.done && guard < 100) {
          step();
          guard += 1;
        }
      });
      q(root, "[data-preset]").addEventListener("change", reset);
      q(root, "[data-reset]").addEventListener("click", reset);
      reset();
    })
  });
