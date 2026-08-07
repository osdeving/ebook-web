import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyCarmichaelKorselt: EnrichmentDefinition = Object.freeze({
  id: "history-3-carmichael-korselt",
  layer: "history",
  anchor: "sec-3-4",
  title: "Korselt antes de Carmichael",
  kicker: "História · pseudoprimos",
  duration: "7 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Os números hoje chamados de Carmichael ilustram um padrão recorrente na matemática: a caracterização estrutural pode aparecer antes do primeiro exemplo explícito.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>A caracterização</h4>
        <article class="timeline-card">
          <time>1899</time>
          <h5>Korselt descreve exatamente os impostores de Fermat</h5>
          <p>Alwin Korselt observou que um inteiro composto \(n\) satisfaz \(a^{n-1}\equiv1\pmod n\) para todo \(a\) coprimo com \(n\) precisamente quando \(n\) é livre de quadrados e, para cada primo \(p\mid n\), vale \(p-1\mid n-1\). Essa condição transforma muitos testes em uma pergunta sobre os fatores de \(n\).</p>
        </article>
        <article class="timeline-card">
          <time>Um detalhe decisivo</time>
          <h5>O artigo não exibe um exemplo</h5>
          <p>O pequeno texto de Korselt formula o critério, mas não produz um inteiro composto que o satisfaça. A existência concreta ainda precisava ser demonstrada.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>Os exemplos</h4>
        <article class="timeline-card">
          <time>1910–1912</time>
          <h5>Carmichael encontra e estuda \(561\)</h5>
          <p>Robert D. Carmichael publicou exemplos, começando por \(561=3\cdot11\cdot17\). O critério verifica-se de imediato: o número é livre de quadrados e \(2,10,16\) dividem \(560\).</p>
        </article>
        <article class="timeline-card">
          <time>Terminologia posterior</time>
          <h5>O nome preserva uma parte da história</h5>
          <p>“Número de Carmichael” tornou-se o termo usual, enquanto a equivalência estrutural é lembrada como critério de Korselt. Os dois nomes apontam para contribuições diferentes.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> O artigo de Korselt é de 1899 e o de Carmichael aqui ligado, de 1912. A verificação de \(561\) usa apenas a condição divisível do critério de Korselt.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> O episódio aconselha separar “quem caracterizou”, “quem encontrou exemplos” e “cujo nome prevaleceu”. E, matematicamente, explica por que repetir o teste de Fermat com mais bases não derrota um número de Carmichael.</div>
    <ul class="source-links">
      <li><a href="https://oeis.org/w/images/3/3b/Probl%C3%A8me_chinois.pdf" target="_blank" rel="noopener noreferrer">Alwin Korselt, <em>Problème chinois</em> (1899) — fac-símile</a></li>
      <li><a href="https://doi.org/10.1080/00029890.1912.11997658" target="_blank" rel="noopener noreferrer">R. D. Carmichael, <em>On Composite Numbers P which Satisfy the Fermat Congruence</em> (1912)</a></li>
      <li><a href="https://kconrad.math.uconn.edu/blurbs/ugradnumthy/carmichaelkorselt.pdf" target="_blank" rel="noopener noreferrer">Keith Conrad — exposição matemática na University of Connecticut</a></li>
    </ul>`),
  tags: ["história", "Carmichael", "Korselt", "primalidade"],
});
