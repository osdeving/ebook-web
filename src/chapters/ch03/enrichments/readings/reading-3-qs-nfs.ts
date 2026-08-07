import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingQuadraticAndNumberFieldSieves: EnrichmentDefinition = Object.freeze({
  id: "reading-3-qs-nfs",
  layer: "reading",
  anchor: "sec-3-7",
  title: "Dos quadrados aleatórios aos dois lados do NFS",
  kicker: "Roteiro de leitura · crivos de fatoração",
  duration: "120–180 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A melhor forma de enxergar QS e NFS é seguir o mesmo esqueleto em cada texto: produzir relações suaves, montar uma dependência linear e extrair uma congruência de quadrados.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Base</span><span class="reading-level">Dixon, 1981</span></div>
        <h4>Quadrados aleatórios e paridades</h4>
        <p>Leia o algoritmo antes da análise assintótica. Converta cada fatoração suave em um vetor de expoentes módulo 2 e explique por que mais relações que primos na base garantem uma dependência.</p>
        <a href="https://pages.cs.wisc.edu/~cs812-1/dixon.pdf" target="_blank" rel="noopener noreferrer">Abrir o artigo de Dixon</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Crivo</span><span class="reading-level">Pomerance</span></div>
        <h4>QS: selecionar suavidade em lote</h4>
        <p>Compare o teste individual de valores com o uso das raízes de \(Q(x)\equiv0\pmod p\). Faça um esquema das etapas e marque quais podem ser paralelizadas e qual produz a matriz binária.</p>
        <a href="https://math.dartmouth.edu/~carlp/PDF/paper52.pdf" target="_blank" rel="noopener noreferrer">Abrir o artigo do crivo quadrático</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Generalização</span><span class="reading-level">NFS</span></div>
        <h4>Dois anéis, uma relação comum</h4>
        <p>No volume histórico do NFS, comece pela introdução editorial e pelo manuscrito de Pollard. Identifique o homomorfismo que conecta o lado algébrico ao racional e por que ambos precisam produzir normas suaves.</p>
        <a href="https://link.springer.com/book/10.1007/BFb0091534" target="_blank" rel="noopener noreferrer">Abrir <em>The Development of the Number Field Sieve</em></a>
      </article>
    </div>
    <h4>Uma única tabela para os três métodos</h4>
    <p>Preencha as colunas “objeto amostrado”, “noção de suavidade”, “estrutura da relação”, “campo da álgebra linear” e “extração final”. A semelhança entre as linhas é tão instrutiva quanto a diferença assintótica.</p>
    <div class="source-note"><strong>Fato documentado.</strong> Dixon publicou em 1981 um método aleatorizado com análise subexponencial; Pomerance publicou o QS nos anais da EUROCRYPT 1984; o volume de 1993 reúne o desenvolvimento do NFS especial e geral.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> QS e NFS não são caixas-pretas desconexas. Ambos tornam rara suavidade útil em relações abundantes e resolvem a combinação por álgebra linear; o NFS muda o universo algébrico onde essas relações são colhidas.</div>
    <ul class="source-links">
      <li><a href="https://www.ams.org/notices/199612/pomerance.pdf" target="_blank" rel="noopener noreferrer">Pomerance, <em>A Tale of Two Sieves</em> — panorama autoral na AMS</a></li>
    </ul>`),
  tags: ["leitura", "crivo quadrático", "NFS", "fatoração"],
});
