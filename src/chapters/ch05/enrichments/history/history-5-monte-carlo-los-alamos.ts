import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyMonteCarlo: EnrichmentDefinition = Object.freeze({
  id: "history-5-monte-carlo-los-alamos",
  layer: "history",
  anchor: "sec-5-3-3",
  title: "Monte Carlo: amostras, computadores e Los Alamos",
  kicker: "História · anos 1940–1949",
  duration: "11 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Métodos aleatórios existiam antes dos computadores eletrônicos, mas a combinação de amostragem estatística, problemas físicos de grande escala e máquinas programáveis transformou Monte Carlo em uma família geral de algoritmos.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Da pergunta ao método</h4>
        <article class="timeline-card"><span class="timeline-label">Anos 1940</span><h5>Ulam propõe experimentar estatisticamente</h5><p>Relatos retrospectivos de Los Alamos associam Stanisław Ulam à ideia de substituir uma enumeração intratável por muitas histórias aleatórias simuladas. O ponto não era “jogar dados” por si só, mas estimar uma quantidade por frequências e médias controladas.</p></article>
        <article class="timeline-card"><span class="timeline-label">Nome</span><h5>Metropolis sugere “Monte Carlo”</h5><p>Nicholas Metropolis vinculou o nome ao célebre cassino. A metáfora sobreviveu porque capta a aparência do procedimento, embora o trabalho matemático decisivo esteja em escolher a distribuição, o estimador e um limite de erro.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>Da máquina ao artigo</h4>
        <article class="timeline-card"><span class="timeline-label">ENIAC</span><h5>Simulações passam a explorar computação eletrônica</h5><p>As primeiras experiências em Los Alamos usaram o ENIAC para transportar partículas por sequências pseudoaleatórias de eventos. Repetir trajetórias em escala fazia do computador um laboratório numérico.</p></article>
        <article class="timeline-card"><time>1949</time><h5>Metropolis e Ulam apresentam o método</h5><p>O artigo no <em>Journal of the American Statistical Association</em> descreve a abordagem e suas aplicações. No capítulo, o mesmo desenho lógico aparece em algoritmos que podem errar com probabilidade limitada e reduzem essa probabilidade por repetição independente.</p></article>
      </section>
    </div>
    <p class="source-note"><strong>Como ler a história.</strong> Os detalhes de origem são reconstruídos em memórias posteriores. Por isso, distinguimos o artigo contemporâneo de 1949 dos relatos institucionais retrospectivos de Metropolis, Anderson e Eckhardt.</p>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1080/01621459.1949.10483310" target="_blank" rel="noopener noreferrer">Metropolis e Ulam — “The Monte Carlo Method” (1949)</a></li>
      <li><a href="https://mcnp.lanl.gov/pdf_files/Article_1987_LAS_Metropolis_125--130.pdf" target="_blank" rel="noopener noreferrer">Nicholas Metropolis — “The Beginning of the Monte Carlo Method” (1987)</a></li>
      <li><a href="https://mcnp.lanl.gov/pdf_files/Article_1987_LAS_Eckhardt_131--141.pdf" target="_blank" rel="noopener noreferrer">Roger Eckhardt — “Stan Ulam, John von Neumann, and the Monte Carlo Method” (1987)</a></li>
      <li><a href="https://mcnp.lanl.gov/reference_collection.html" target="_blank" rel="noopener noreferrer">Coleção histórica do método Monte Carlo — Los Alamos National Laboratory</a></li>
      <li><a href="https://mcnp.lanl.gov/pdf_files/Article_1986_LAS_Anderson_96--108.pdf" target="_blank" rel="noopener noreferrer">H. L. Anderson — retrospectiva sobre Metropolis, Monte Carlo e MANIAC</a></li>
    </ul>`),
  tags: ["história", "Monte Carlo", "Los Alamos", "algoritmos probabilísticos"],
});
