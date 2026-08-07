import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingCarmichaelKorselt: EnrichmentDefinition = Object.freeze({
  id: "reading-3-carmichael-korselt",
  layer: "reading",
  anchor: "sec-3-4",
  title: "Carmichael por dentro: fonte, critério e prova",
  kicker: "Roteiro de leitura · pseudoprimos",
  duration: "45–75 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Este roteiro combina um artigo histórico muito curto com uma exposição moderna. A meta é provar o critério de Korselt e usá-lo como ferramenta, não apenas memorizar a lista \(561,1105,1729,\ldots\).</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Fonte de 1899</span><span class="reading-level">Curta</span></div>
        <h4>Korselt, <em>Problème chinois</em></h4>
        <p>Localize a condição envolvendo cada \(p-1\) e o caráter livre de quadrados. Mesmo que o francês e a notação sejam pouco familiares, identifique o formato “se e somente se” e confirme que o texto não apresenta um exemplo explícito.</p>
        <a href="https://oeis.org/w/images/3/3b/Probl%C3%A8me_chinois.pdf" target="_blank" rel="noopener noreferrer">Abrir o fac-símile do artigo</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Prova moderna</span><span class="reading-level">Intermediário</span></div>
        <h4>Keith Conrad: Carmichael numbers and Korselt’s criterion</h4>
        <p>Leia a prova nas duas direções. Na suficiência, explicite onde entram Fermat e o teorema chinês dos restos. Na necessidade, acompanhe por que um quadrado primo dividindo \(n\) criaria uma base que contradiz a congruência universal.</p>
        <a href="https://kconrad.math.uconn.edu/blurbs/ugradnumthy/carmichaelkorselt.pdf" target="_blank" rel="noopener noreferrer">Abrir as notas na University of Connecticut</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Aplicação</span><span class="reading-level">20 min</span></div>
        <h4>Certifique três casos à mão</h4>
        <p>Use apenas fatoração e divisibilidade para decidir se \(561\), \(1105\) e \(1729\) são Carmichael. Depois construa um composto livre de quadrados que falhe exatamente uma condição \(p-1\mid n-1\).</p>
      </article>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> Korselt publicou o critério em 1899; Carmichael publicou exemplos e propriedades no início do século XX. A nota de Keith Conrad, hospedada pela UConn, fornece uma prova contemporânea completa.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A leitura revela por que a deficiência do teste de Fermat é estrutural. Trocar a base não resolve o problema quando o composto satisfaz simultaneamente as congruências em todos os seus fatores.</div>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1080/00029890.1912.11997658" target="_blank" rel="noopener noreferrer">R. D. Carmichael — artigo de 1912</a></li>
    </ul>`),
  tags: ["leitura", "Carmichael", "Korselt", "teste de Fermat"],
});
