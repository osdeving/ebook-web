import {
  defineEnrichment, LAB_KICKER as supplement, initialise, q, setFeedback,
  setOutput, tableHtml
} from "../shared";

export const groupLab = defineEnrichment({
    id: "lab-2-5-axiomas-ordem",
    layer: "lab",
    anchor: "#exp-2-5-element-order-cycle",
    title: "Inspetor de axiomas e ordem de um elemento",
    kicker: supplement,
    meta: "Seção 2.5 · iniciante · 8–10 min",
    html: `
      <p class="lab-intro">O inspetor testa todos os pares e trios de um conjunto pequeno. Quando uma lei falha, ele mostra um contraexemplo em vez de apenas marcar “errado”.</p>
      <div class="lab-controls">
        <label>Sistema
          <select data-scenario>
            <option value="z7-add">Z/7 com adição</option>
            <option value="u8-mul">Unidades {1,3,5,7} módulo 8 com multiplicação</option>
            <option value="nonzero8-mul">Resíduos {1,…,7} módulo 8 com multiplicação</option>
            <option value="z6-sub">Z/6 com subtração</option>
          </select>
        </label>
        <label>Elemento a explorar
          <select data-element></select>
        </label>
      </div>
      <div class="lab-actions">
        <button type="button" data-test>Testar os axiomas</button>
        <button type="button" class="secondary" data-reset>Reiniciar</button>
      </div>
      <div class="lab-result" data-output></div>
      <p class="lab-feedback" data-feedback role="status" aria-live="polite"></p>`,
    init: initialise((root) => {
      interface Scenario {
        label: string;
        set: number[];
        symbol: string;
        operation: (a: number, b: number) => number;
      }
      const scenarios: Record<string, Scenario> = {
        "z7-add": {
          label: "Z/7 com adição",
          set: [0, 1, 2, 3, 4, 5, 6],
          symbol: "+",
          operation: (a: number, b: number) => (a + b) % 7
        },
        "u8-mul": {
          label: "Unidades módulo 8",
          set: [1, 3, 5, 7],
          symbol: "×",
          operation: (a: number, b: number) => (a * b) % 8
        },
        "nonzero8-mul": {
          label: "Resíduos não nulos módulo 8",
          set: [1, 2, 3, 4, 5, 6, 7],
          symbol: "×",
          operation: (a: number, b: number) => (a * b) % 8
        },
        "z6-sub": {
          label: "Z/6 com subtração",
          set: [0, 1, 2, 3, 4, 5],
          symbol: "−",
          operation: (a: number, b: number) => ((a - b) % 6 + 6) % 6
        }
      };
      const current = (): Scenario => scenarios[String(q(root, "[data-scenario]").value)]!;
      const fillElements = () => {
        const scenario = current();
        const select = q(root, "[data-element]");
        select.innerHTML = scenario.set.map((value) => `<option value="${value}">${value}</option>`).join("");
        select.value = String(scenario.set[Math.min(1, scenario.set.length - 1)]);
      };
      const inspect = (scenario: Scenario) => {
        const members = new Set(scenario.set);
        let closureFailure: [number, number, number] | null = null;
        let associativityFailure: [number, number, number, number, number] | null = null;
        for (const a of scenario.set) {
          for (const b of scenario.set) {
            const result = scenario.operation(a, b);
            if (!members.has(result) && !closureFailure) closureFailure = [a, b, result];
            for (const c of scenario.set) {
              const left = scenario.operation(scenario.operation(a, b), c);
              const right = scenario.operation(a, scenario.operation(b, c));
              if (left !== right && !associativityFailure) associativityFailure = [a, b, c, left, right];
            }
          }
        }
        const identity = scenario.set.find((candidate) => scenario.set.every((a) =>
          scenario.operation(candidate, a) === a && scenario.operation(a, candidate) === a));
        let inverseFailure = null;
        if (identity !== undefined) {
          inverseFailure = scenario.set.find((a) => !scenario.set.some((b) =>
            scenario.operation(a, b) === identity && scenario.operation(b, a) === identity));
        }
        return { closureFailure, associativityFailure, identity, inverseFailure };
      };
      q(root, "[data-test]").addEventListener("click", () => {
        const scenario = current();
        const report = inspect(scenario);
        const rows: unknown[][] = [];
        rows.push(["Fechamento", report.closureFailure ? "Falha" : "Vale", report.closureFailure
          ? `${report.closureFailure[0]} ${scenario.symbol} ${report.closureFailure[1]} = ${report.closureFailure[2]}, fora do conjunto`
          : "Todo resultado permaneceu no conjunto"]);
        rows.push(["Associatividade", report.associativityFailure ? "Falha" : "Vale", report.associativityFailure
          ? `(${report.associativityFailure[0]} ${scenario.symbol} ${report.associativityFailure[1]}) ${scenario.symbol} ${report.associativityFailure[2]} = ${report.associativityFailure[3]}, mas o outro agrupamento dá ${report.associativityFailure[4]}`
          : "Todos os trios produziram o mesmo resultado nos dois agrupamentos"]);
        rows.push(["Identidade", report.identity === undefined ? "Falha" : "Vale", report.identity === undefined
          ? "Nenhum elemento funciona dos dois lados"
          : `A identidade é ${report.identity}`]);
        rows.push(["Inversos", report.identity === undefined || report.inverseFailure !== undefined ? "Falha" : "Vale", report.identity === undefined
          ? "Sem identidade não se pode definir o inverso do grupo"
          : report.inverseFailure !== undefined ? `${report.inverseFailure} não possui inverso no conjunto` : "Todo elemento possui inverso"]);

        const isGroup = !report.closureFailure && !report.associativityFailure && report.identity !== undefined && report.inverseFailure === undefined;
        let cycleHtml = "";
        if (isGroup) {
          const element = Number(q(root, "[data-element]").value);
          let value = report.identity!;
          const cycle: number[] = [];
          for (let exponent = 1; exponent <= scenario.set.length + 1; exponent += 1) {
            value = scenario.operation(value, element);
            cycle.push(value);
            if (value === report.identity) {
              cycleHtml = `<p><strong>Ciclo de ${element}:</strong> ${cycle.join(" → ")}. Ordem=${exponent}; |G|=${scenario.set.length}; ${scenario.set.length} é divisível por ${exponent}.</p>`;
              break;
            }
          }
        }
        setOutput(root, tableHtml(`Teste de ${scenario.label}`, ["Lei", "Resultado", "Evidência"], rows) + cycleHtml);
        setFeedback(root, isGroup ? "As quatro verificações passaram; agora a ordem do elemento aparece como o retorno à identidade." : "Uma única lei que falha já impede que o sistema seja um grupo.", isGroup ? "success" : "warning");
      });
      q(root, "[data-scenario]").addEventListener("change", () => {
        fillElements();
        setOutput(root, "");
        setFeedback(root, "Sistema alterado; execute novamente os testes.");
      });
      q(root, "[data-reset]").addEventListener("click", () => {
        q(root, "[data-scenario]").value = "z7-add";
        fillElements();
        setOutput(root, "");
        setFeedback(root, "Laboratório reiniciado.");
      });
      fillElements();
    })
  });
