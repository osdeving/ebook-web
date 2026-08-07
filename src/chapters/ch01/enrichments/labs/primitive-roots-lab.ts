import { gcd, mod, multiplicativeOrder, powMod, primeFactors } from "./math.mts";
import { defineLab, makeElement, makeTable, readInteger } from "./runtime.mts";

const PRIMES = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

export const primitiveRootsLab = defineLab({
  id: "lab-1-5-raizes-primitivas",
  anchor: "def-1-order-mod-p",
  title: "Órbitas, ordens e raízes primitivas",
  duration: "Seção 1.5 · 10–16 min",
  tags: ["section:1.5", "ordem", "potencias", "raiz-primitiva", "corpo-finito"],
  html: `
    <p class="lab-intro">Escolha \(g\in\mathbb F_p^*\) e acompanhe \(1,g,g^2,\ldots\) até a órbita voltar a 1. Uma raiz primitiva visita todos os \(p-1\) resíduos não nulos antes de fechar o ciclo.</p>
    <form data-form>
      <div class="lab-controls">
        <label>Primo \(p\)
          <select data-prime>${PRIMES.map((prime) => `<option value="${prime}"${prime === 29 ? " selected" : ""}>${prime}</option>`).join("")}</select>
        </label>
        <label>Base \(g\)
          <input type="number" min="1" max="46" step="1" value="2" data-base>
        </label>
      </div>
      <div class="lab-actions">
        <button type="submit">Preparar órbita</button>
        <button type="button" data-next>Próxima potência</button>
        <button type="button" data-finish>Fechar ciclo</button>
        <button type="button" data-criterion>Aplicar critério rápido</button>
        <button type="button" data-list>Listar todas as raízes</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
    </form>
    <div class="lab-wheel" data-wheel role="list" aria-label="Resíduos não nulos módulo vinte e nove"></div>
    <p class="lab-orbit" data-orbit>Nenhuma potência revelada.</p>
    <div class="lab-result" data-output aria-live="polite"></div>
    <p class="lab-interpretation">Interpretação: “ordem” mede o comprimento do ciclo multiplicativo. O critério rápido evita listar o ciclo inteiro: basta testar um expoente para cada divisor primo de \(p-1\).</p>
    <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
  setup(tools) {
    const form = tools.q<HTMLFormElement>("[data-form]");
    const primeInput = tools.q<HTMLSelectElement>("[data-prime]");
    const baseInput = tools.q<HTMLInputElement>("[data-base]");
    const wheel = tools.q<HTMLElement>("[data-wheel]");
    const orbitLabel = tools.q<HTMLElement>("[data-orbit]");
    let prime = 29n;
    let base = 2n;
    let order = multiplicativeOrder(base, prime) ?? 0n;
    let visible = 0;
    let powers: bigint[] = [];

    const computePowers = () => {
      powers = [1n];
      let current = 1n;
      for (let exponent = 1n; exponent <= order; exponent += 1n) {
        current = mod(current * base, prime);
        powers.push(current);
      }
    };

    const render = () => {
      const visited = new Set(powers.slice(0, visible + 1).map(String));
      wheel.replaceChildren(...Array.from({ length: Number(prime - 1n) }, (_, index) => {
        const residue = index + 1;
        const button = makeElement("button", String(residue), "lab-wheel-cell");
        button.type = "button";
        button.dataset.baseCandidate = String(residue);
        button.setAttribute("role", "listitem");
        button.setAttribute("aria-label", `Usar ${residue} como base${visited.has(String(residue)) ? "; já visitado pela órbita atual" : ""}`);
        if (visited.has(String(residue))) button.classList.add("is-visited");
        if (BigInt(residue) === base) button.classList.add("is-target");
        return button;
      }));
      wheel.setAttribute("aria-label", `Resíduos não nulos módulo ${prime}; ${visited.size} visitado(s) pela base ${base}`);
      const shown = powers.slice(0, visible + 1);
      orbitLabel.textContent = shown.map((value, exponent) => `${base}^${exponent}≡${value}`).join(" → ") || "Nenhuma potência revelada.";
      if (visible >= Number(order)) {
        tools.outputMath(
          `A órbita voltou a 1 em \\(g^{${order}}\\). Logo \\(\\operatorname{ord}_{${prime}}(${base})=${order}\\). `
          + (order === prime - 1n ? `Como a ordem é \\(p-1=${prime - 1n}\\), ${base} é raiz primitiva.` : `${base} gera apenas ${order} dos ${prime - 1n} elementos.`),
        );
      } else {
        tools.outputText(`${visible} multiplicação(ões) revelada(s); o ciclo completo tem ordem ${order}.`);
      }
    };

    const prepare = () => {
      prime = BigInt(primeInput.value);
      const baseResult = readInteger(baseInput, "A base", { min: 1n, max: prime - 1n });
      if (!baseResult.ok) {
        tools.feedback(baseResult.message, "warning");
        return false;
      }
      base = baseResult.value;
      if (gcd(base, prime) !== 1n) {
        tools.feedback("A base precisa ser não nula módulo p.", "warning");
        return false;
      }
      order = multiplicativeOrder(base, prime) ?? 0n;
      visible = 0;
      computePowers();
      render();
      tools.feedback(`Órbita preparada; a primeira posição é g⁰=1.`, "success");
      return true;
    };

    tools.on(form, "submit", (event) => {
      event.preventDefault();
      prepare();
    });
    tools.on(primeInput, "change", () => {
      baseInput.max = String(Number(primeInput.value) - 1);
      if (Number(baseInput.value) >= Number(primeInput.value)) baseInput.value = "2";
      prepare();
    });
    tools.on(wheel, "click", (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-base-candidate]");
      if (!button) return;
      baseInput.value = button.dataset.baseCandidate ?? "2";
      prepare();
      tools.feedback(`Base ${baseInput.value} escolhida diretamente na roda.`, "success");
    });
    tools.on(tools.q("[data-next]"), "click", () => {
      if (visible < Number(order)) {
        visible += 1;
        render();
        tools.feedback(visible === Number(order) ? "O ciclo fechou em 1." : `Potência ${visible} revelada.`, visible === Number(order) ? "success" : "info");
      } else tools.feedback("A órbita já está completa.", "info");
    });
    tools.on(tools.q("[data-finish]"), "click", () => {
      visible = Number(order);
      render();
      tools.feedback("Órbita completa exibida.", "success");
    });
    tools.on(tools.q("[data-criterion]"), "click", () => {
      const factors = primeFactors(prime - 1n);
      const rows = factors.map((factor) => {
        const exponent = (prime - 1n) / factor;
        const value = powMod(base, exponent, prime);
        return [String(factor), String(exponent), String(value), value === 1n ? "falha: ordem menor" : "passa"];
      });
      tools.outputNodes(makeTable(
        `Critério de raiz primitiva para g=${base} módulo ${prime}`,
        ["q primo em p−1", "(p−1)/q", "g^((p−1)/q) mod p", "leitura"],
        rows,
      ));
      tools.feedback(rows.every((row) => row[3] === "passa") ? "Todos os testes passaram: a base é primitiva." : "Um resultado 1 certifica que a ordem é menor que p−1.", rows.every((row) => row[3] === "passa") ? "success" : "warning");
    });
    tools.on(tools.q("[data-list]"), "click", () => {
      const roots = Array.from({ length: Number(prime - 1n) }, (_, index) => BigInt(index + 1))
        .filter((candidate) => multiplicativeOrder(candidate, prime) === prime - 1n);
      tools.outputText(`Raízes primitivas de F_${prime}: ${roots.join(", ")}. Há ${roots.length} delas.`);
      tools.feedback("Lista produzida por verificação direta das ordens.", "success");
    });
    tools.on(tools.q("[data-reset]"), "click", () => {
      primeInput.value = "29";
      baseInput.value = "2";
      baseInput.max = "28";
      prepare();
      tools.feedback("Caso p=29, g=2 restaurado.");
      baseInput.focus();
    });
    computePowers();
    render();
  },
});
