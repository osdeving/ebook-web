import {
  defineEnrichment, LAB_KICKER as supplement, discreteLog, escapeHtml, initialise,
  mod, parseInteger, powMod, q, setFeedback,
  setOutput, tableHtml
} from "../shared";

export const diffieHellmanLab = defineEnrichment({
    id: "lab-2-3-dh-eva",
    layer: "lab",
    anchor: "#exp-2-3-dh-step-by-step",
    title: "Diffie–Hellman com as visões de Alice, Bob e Eva",
    kicker: supplement,
    meta: "Seção 2.3 · iniciante · 6–9 min",
    html: `
      <p class="lab-intro">O canal usa o primo 23 e a base 5. Os parâmetros são pequenos para que Eva consiga demonstrar um ataque por enumeração.</p>
      <div class="lab-controls">
        <label>Segredo de Alice, <var>a</var>
          <input type="number" min="1" max="21" step="1" value="3" data-a>
        </label>
        <label>Segredo de Bob, <var>b</var>
          <input type="number" min="1" max="21" step="1" value="7" data-b>
        </label>
      </div>
      <div class="lab-actions">
        <button type="button" data-exchange>Realizar a troca</button>
        <button type="button" data-eve>Eva ataca o grupo pequeno</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      const parameters = () => {
        const readSecret = (input: HTMLInputElement, label: string) => {
          const result = parseInteger(input.value, { min: 1n, max: 21n, label });
          if (!result.ok) setFeedback(root, result.message, "warning");
          return result;
        };
        const aResult = readSecret(q(root, "[data-a]"), "O segredo de Alice");
        const bResult = readSecret(q(root, "[data-b]"), "O segredo de Bob");
        if (!aResult.ok || !bResult.ok) return null;
        const a = aResult.value;
        const b = bResult.value;
        const p = 23n;
        const g = 5n;
        const A = powMod(g, a, p);
        const B = powMod(g, b, p);
        const aliceKey = powMod(B, a, p);
        const bobKey = powMod(A, b, p);
        return { a, b, p, g, A, B, aliceKey, bobKey };
      };
      q(root, "[data-exchange]").addEventListener("click", () => {
        const values = parameters();
        if (!values) return;
        const { a, b, p, g, A, B, aliceKey, bobKey } = values;
        setOutput(root, tableHtml("O que cada participante calcula", ["Participante", "Valor privado", "Valor enviado", "Chave obtida"], [
          ["Alice", `a=${a}`, `A=${g}^${a} mod ${p}=${A}`, `B^a mod p=${aliceKey}`],
          ["Bob", `b=${b}`, `B=${g}^${b} mod ${p}=${B}`, `A^b mod p=${bobKey}`],
          ["Eva", "—", `observa A=${A} e B=${B}`, "ainda não calculada"]
        ]));
        setFeedback(root, aliceKey === bobKey ? `As duas contas chegaram à chave ${aliceKey}.` : "Algo deu errado nas contas.", aliceKey === bobKey ? "success" : "warning");
      });
      q(root, "[data-eve]").addEventListener("click", () => {
        const values = parameters();
        if (!values) return;
        const { p, g, A, B, aliceKey } = values;
        const recoveredA = discreteLog(g, A, p, p - 1n);
        const recoveredKey = recoveredA === null ? null : powMod(B, recoveredA, p);
        const trail = [];
        let value = 1n;
        for (let exponent = 0n; exponent <= (recoveredA ?? 0n); exponent += 1n) {
          trail.push(`${g}^${exponent}→${value}`);
          value = mod(value * g, p);
        }
        setOutput(root, `<p><strong>Visão de Eva:</strong> ${escapeHtml(trail.join(", "))}.</p>
          <p>Ela encontra a=${recoveredA} e calcula B^a mod ${p}=${recoveredKey}. A chave correta era ${aliceKey}.</p>`);
        setFeedback(root, "O ataque funciona porque há apenas 22 expoentes possíveis. Em grupos criptográficos, esse espaço é gigantesco.", "warning");
      });
      q(root, "[data-reset]").addEventListener("click", () => {
        q(root, "[data-a]").value = "3";
        q(root, "[data-b]").value = "7";
        setOutput(root, "");
        setFeedback(root, "Laboratório reiniciado.");
      });
    })
  });
