import { defineEnrichment, escapeHtml, normalizeText, renderMath } from "../shared";

const glossaryTerms: Array<[string, string]> = [
    ["Alçapão", "Informação secreta adicional que torna viável inverter uma função que, sem ela, é difícil de inverter."],
    ["Ordem de um elemento", String.raw`Menor inteiro positivo \(n\) para o qual \(g^n=e\), a identidade do grupo.`],
    ["Raiz primitiva", "Elemento cujas potências percorrem todo o grupo multiplicativo do corpo finito."],
    ["PLD", String.raw`Problema de encontrar \(x\) quando \(g\) e \(g^x\) são conhecidos dentro de um grupo finito.`],
    ["PDH", String.raw`Problema de calcular \(g^{ab}\) a partir de \(g^a\) e \(g^b\).`],
    ["Unidade", "Elemento de um anel que possui inverso multiplicativo."],
    ["Divisor de zero", "Elemento não nulo que, multiplicado por outro não nulo, produz zero."],
    ["Irredutível", String.raw`No contexto \(F[x]\), com \(F\) corpo, polinômio não constante que não se fatora como produto de dois polinômios de grau positivo.`],
    ["Ordem lisa", "Ordem cuja fatoração contém somente fatores primos relativamente pequenos."],
    ["Representante", "Um elemento escolhido para escrever concretamente uma classe de equivalência."]
  ];

export const readingGlossary = defineEnrichment({
    id: "reading-glossary",
    layer: "reading",
    anchor: "sec-2-5",
    kicker: "Glossário de apoio",
    title: "Dez termos para consultar sem sair da leitura",
    meta: "Busca local · definições curtas",
    html: `
      <div class="glossary-widget">
        <label class="supplement-search-label">Filtrar termos <input type="search" data-glossary-search placeholder="Ex.: ordem, inverso, PLD"></label>
        <dl class="glossary-list">
          ${glossaryTerms.map(([term, definition]) => `<div data-glossary-entry data-search="${escapeHtml(normalizeText(`${term} ${definition}`))}"><dt>${term}</dt><dd>${definition}</dd></div>`).join("")}
        </dl>
        <p class="empty-state" data-glossary-empty hidden>Nenhum termo corresponde à busca.</p>
      </div>`,
    init(root) {
      const search: any = root.querySelector("[data-glossary-search]");
      const entries: any[] = [...root.querySelectorAll("[data-glossary-entry]")];
      const empty: any = root.querySelector("[data-glossary-empty]");
      search?.addEventListener("input", () => {
        const needle = normalizeText(search.value);
        let visible = 0;
        entries.forEach((entry) => {
          const show = !needle || entry.dataset.search.includes(needle);
          entry.hidden = !show;
          if (show) visible += 1;
        });
        empty.hidden = visible !== 0;
      });
      renderMath(root);
    }
  });
