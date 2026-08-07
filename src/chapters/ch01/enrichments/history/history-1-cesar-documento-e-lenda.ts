import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyCaesarDocumentAndLegend: EnrichmentDefinition = Object.freeze({
  id: "history-1-cesar-documento-e-lenda",
  layer: "history",
  anchor: "sec-1-1",
  title: "César entre documento e cena literária",
  kicker: "História · leitura crítica das fontes",
  duration: "6 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A cifra de deslocamento é uma excelente porta de entrada para a criptografia, mas seu nome moderno costuma condensar evidência antiga, tradição escolar e muita imaginação posterior. Separar essas camadas é parte do trabalho histórico.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>O que a fonte antiga permite afirmar</h4>
        <article class="timeline-card">
          <time>Século I a.C.</time>
          <h5>As cartas de César</h5>
          <p>Júlio César viveu num mundo em que mensageiros transportavam documentos físicos. Uma carta interceptada podia ser lida sem deixar vestígio, de modo que transformar a escrita antes do envio tinha valor operacional.</p>
        </article>
        <article class="timeline-card">
          <time>Início do século II d.C.</time>
          <h5>O relato de Suetônio</h5>
          <p>Na biografia de César, Suetônio informa que certas cartas confidenciais eram escritas por um método que tornava as palavras ininteligíveis e explica a troca tomando <em>D</em> no lugar de <em>A</em>. Isso corresponde ao deslocamento de três posições na convenção alfabética usual.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>O que exige cautela</h4>
        <article class="timeline-card">
          <time>Distância documental</time>
          <h5>Suetônio não foi testemunha</h5>
          <p>O biógrafo escreveu gerações depois de César. Seu testemunho é valioso, mas não funciona como um manual militar contemporâneo nem prova que toda mensagem de campanha empregasse o mesmo deslocamento.</p>
        </article>
        <article class="timeline-card">
          <time>Tradição moderna</time>
          <h5>Uma família inteira recebeu um nome</h5>
          <p>Hoje chamamos de “cifra de César” qualquer deslocamento fixo do alfabeto. O registro antigo sustenta um caso particular; a generalização para todas as chaves é uma abstração matemática posterior.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> Suetônio descreve a substituição de uma letra pela que está três posições adiante em cartas reservadas.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A cena de batalha usada para abrir o capítulo é ficção pedagógica, não reconstituição documental. Ela torna visível um problema real — comunicar sob risco de interceptação — sem pretender registrar um episódio específico.</div>
    <ul class="source-links">
      <li><a href="https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.02.0132%3Alife%3Djul.%3Achapter%3D56" target="_blank" rel="noopener noreferrer">Suetônio, <em>Divus Julius</em>, 56 — Perseus Digital Library</a></li>
      <li><a href="https://atlas.perseus.tufts.edu/library/urn:cts:latinLit:phi1348.abo011/" target="_blank" rel="noopener noreferrer">Registro bibliográfico e edições de <em>Divus Julius</em> — Scaife/Perseus</a></li>
    </ul>`),
  tags: ["história", "César", "fontes primárias"],
});
