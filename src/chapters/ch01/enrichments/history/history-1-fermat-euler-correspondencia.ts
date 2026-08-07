import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyFermatEulerCorrespondence: EnrichmentDefinition = Object.freeze({
  id: "history-1-fermat-euler-correspondencia",
  layer: "history",
  anchor: "theorem-1-24",
  title: "De uma carta de Fermat à função de Euler",
  kicker: "História · circulação de teoremas",
  duration: "7 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Teoremas não chegam ao mundo já embalados com o nome e a prova dos livros didáticos. O resultado hoje chamado pequeno teorema de Fermat circulou por carta; a linguagem que o generaliza foi organizada mais tarde por Euler.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>O episódio de Fermat</h4>
        <article class="timeline-card">
          <time>18 de outubro de 1640</time>
          <h5>Carta a Bernard Frénicle de Bessy</h5>
          <p>Fermat enuncia, em forma equivalente, que para primo \(p\) e \(a\) não divisível por \(p\), o número \(a^{p-1}-1\) é divisível por \(p\). A carta anuncia que havia uma demonstração, mas não a apresenta ali.</p>
        </article>
        <article class="timeline-card">
          <time>Problema documental</time>
          <h5>Correspondência reconstruída</h5>
          <p>Parte da troca com Frénicle não sobreviveu de maneira simples e completa. Historiadores recompõem a sequência comparando cópias, respostas e edições. Por isso é prudente distinguir a data de um enunciado conservado da data de uma primeira prova publicada.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>A reorganização de Euler</h4>
        <article class="timeline-card">
          <time>Século XVIII</time>
          <h5>Contar os invertíveis</h5>
          <p>Euler investigou sistematicamente resíduos e introduziu uma antecessora da notação para a quantidade que hoje escrevemos \(\varphi(n)\): o número de classes coprimas com \(n\). A congruência \(a^{\varphi(n)}\equiv1\pmod n\), para \(\gcd(a,n)=1\), coloca o caso primo numa estrutura maior.</p>
        </article>
        <article class="timeline-card">
          <time>Retrospecto</time>
          <h5>Os nomes estabilizam a memória</h5>
          <p>“Pequeno teorema de Fermat” e “teorema de Euler” são rótulos retrospectivos. Eles ajudam a navegar a matemática, mas não devem ser confundidos com uma cronologia completa de todas as pessoas que formularam, provaram ou generalizaram resultados relacionados.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> A carta de 1640 contém o enunciado de Fermat; estudos históricos discutem a reconstrução dessa correspondência. A função totiente moderna consolidou-se a partir do trabalho de Euler e de notação posterior.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A passagem de Fermat a Euler mostra uma mudança de pergunta: de uma regularidade para módulo primo para a estrutura do grupo de unidades módulo um inteiro qualquer.</div>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1016/0315-0860(91)90371-4" target="_blank" rel="noopener noreferrer">Colin R. Fletcher, reconstrução da correspondência Frénicle–Fermat (1991)</a></li>
      <li><a href="https://digitalcommons.tacoma.uw.edu/ias_pub/853/" target="_blank" rel="noopener noreferrer">Erik R. Tou, “The Totient Function” — University of Washington Tacoma</a></li>
    </ul>`),
  tags: ["história", "Fermat", "Euler", "totiente"],
});
