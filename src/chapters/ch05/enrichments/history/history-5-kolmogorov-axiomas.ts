import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyKolmogorov: EnrichmentDefinition = Object.freeze({
  id: "history-5-kolmogorov-axiomas",
  layer: "history",
  anchor: "sec-5-3-1",
  title: "Kolmogorov põe a probabilidade sobre conjuntos",
  kicker: "História · 1933",
  duration: "10 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Moedas, urnas e jogos já eram calculados havia séculos. O passo de 1933 foi oferecer uma fundação capaz de tratar, na mesma linguagem, experimentos finitos, sequências infinitas e variáveis aleatórias.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Antes dos axiomas</h4>
        <article class="timeline-card"><span class="timeline-label">Problemas concretos</span><h5>Contagem e simetria sustentam os primeiros modelos</h5><p>Em espaços finitos equiprováveis, probabilidade podia ser calculada como casos favoráveis sobre casos possíveis. A técnica é poderosa, mas pressupõe que “casos” e “equiprobabilidade” já estejam bem definidos.</p></article>
        <article class="timeline-card"><span class="timeline-label">Séculos XIX–XX</span><h5>Medida fornece a infraestrutura</h5><p>Teoria dos conjuntos e integração permitiram tratar comprimentos, áreas e massas abstratamente. Eventos poderiam então ser conjuntos mensuráveis, e probabilidade, uma medida normalizada.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>O livro de 1933</h4>
        <article class="timeline-card"><time>1933</time><h5><em>Grundbegriffe der Wahrscheinlichkeitsrechnung</em></h5><p>Andrei Kolmogorov apresenta um espaço de resultados, uma família de eventos e uma função de probabilidade não negativa, normalizada e aditiva. A continuidade/adição enumerável permite controlar limites de sequências de eventos.</p></article>
        <article class="timeline-card"><span class="timeline-label">No capítulo</span><h5>O caso discreto preserva a arquitetura</h5><p>Quando \(\Omega\) é finito ou enumerável, somas substituem integrais e todos os subconjuntos usuais podem servir de eventos. Ainda assim, união, complemento, condicional e independência já são operações dentro da estrutura axiomática.</p></article>
      </section>
    </div>
    <p class="source-note"><strong>Escala da leitura.</strong> O capítulo trabalha no regime discreto e não exige teoria da medida. A fonte histórica mostra de onde vem a arquitetura; não é pré-requisito para resolver os exercícios elementares.</p>
    <ul class="source-links">
      <li><a href="https://books.google.com/books/about/Grundbegriffe_der_Wahrscheinlichkeitsrec.html?id=ob4rAAAAYAAJ" target="_blank" rel="noopener noreferrer">Kolmogorov — edição alemã de 1933, exemplar da Universidade da Virgínia</a></li>
      <li><a href="https://cml.rhul.ac.uk/resources/fop/index.htm" target="_blank" rel="noopener noreferrer">Tradução inglesa hospedada pela Royal Holloway, University of London</a></li>
      <li><a href="https://bookstore.ams.org/CHEL/23" target="_blank" rel="noopener noreferrer">Registro da edição inglesa — American Mathematical Society</a></li>
    </ul>`),
  tags: ["história", "Kolmogorov", "axiomas", "probabilidade"],
});
