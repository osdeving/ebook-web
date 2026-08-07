import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingMillerRabinAks: EnrichmentDefinition = Object.freeze({
  id: "reading-3-miller-rabin-aks",
  layer: "reading",
  anchor: "sec-3-4",
  title: "Três artigos, três garantias de primalidade",
  kicker: "Roteiro de leitura · Miller, Rabin e AKS",
  duration: "90–150 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Leia os três trabalhos pela garantia que cada um compra e pelo preço que paga. O objetivo não é acompanhar toda a análise na primeira passagem, mas não misturar hipótese, aleatoriedade e complexidade.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">1976</span><span class="reading-level">Avançado</span></div>
        <h4>Gary Miller</h4>
        <p>Leia o resumo, a introdução e o enunciado do teorema principal. Circule toda ocorrência da hipótese de Riemann estendida. Identifique por que verificar uma faixa limitada de testemunhas produz um teste determinístico sob essa hipótese.</p>
        <a href="https://www.cs.cmu.edu/~glmiller/Publications/Papers/RiemannsHypothesisandTestsforPrimality.pdf" target="_blank" rel="noopener noreferrer">Abrir o artigo no site do autor — CMU</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">1980</span><span class="reading-level">Intermediário</span></div>
        <h4>Michael Rabin</h4>
        <p>Acompanhe a transformação do teste em algoritmo aleatorizado. Reescreva a garantia de erro após \(t\) rodadas independentes e explique por que encontrar uma testemunha prova composição, enquanto não encontrá-la apenas sustenta “provavelmente primo”.</p>
        <a href="https://www.sciencedirect.com/science/article/pii/0022314X80900840" target="_blank" rel="noopener noreferrer">Abrir o registro e o artigo no Journal of Number Theory</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">2004</span><span class="reading-level">Avançado</span></div>
        <h4>Agrawal, Kayal e Saxena</h4>
        <p>Leia a introdução e o algoritmo antes das provas. Relacione cada etapa a uma obstrução: potências perfeitas, ordem de \(n\) módulo \(r\), fatores pequenos e a identidade polinomial truncada.</p>
        <a href="https://repository.ias.ac.in/122755/" target="_blank" rel="noopener noreferrer">Abrir o registro institucional do artigo AKS</a>
      </article>
    </div>
    <h4>Quadro comparativo a preencher</h4>
    <p>Para cada artigo, anote: determinístico ou probabilístico; condicional ou incondicional; erro unilateral ou nenhum erro; limite assintótico; provável uso prático. A última coluna deve ser inferida com cuidado — o melhor marco de complexidade não é automaticamente a implementação mais rápida.</p>
    <div class="source-note"><strong>Fato documentado.</strong> Os três trabalhos são fontes originais: Miller (JCSS, 1976), Rabin (JNT, 1980) e Agrawal–Kayal–Saxena (Annals, 2004).</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Juntos, eles são um exercício sobre vocabulário de algoritmos. “Polinomial”, “rápido”, “sem conjecturas” e “erro desprezível” respondem a perguntas diferentes.</div>`),
  tags: ["leitura", "Miller–Rabin", "AKS", "complexidade"],
});
