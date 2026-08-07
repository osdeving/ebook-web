import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyZimmermannRoom40: EnrichmentDefinition = Object.freeze({
  id: "history-1-zimmermann-room-40",
  layer: "history",
  anchor: "sec-1-6",
  title: "O telegrama Zimmermann: decifrar não bastava",
  kicker: "História · inteligência e diplomacia",
  duration: "8 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O caso Zimmermann mostra que a utilidade de uma mensagem decifrada depende de muito mais que álgebra ou linguística: é preciso autenticar o conteúdo, proteger a fonte e decidir quando a vantagem política supera o risco de revelar capacidades de inteligência.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Da interceptação à leitura</h4>
        <article class="timeline-card">
          <time>16 de janeiro de 1917</time>
          <h5>Uma proposta secreta</h5>
          <p>O ministro alemão Arthur Zimmermann enviou instruções diplomáticas propondo cooperação com o México caso a guerra com os Estados Unidos se concretizasse. A mensagem transitou por canais que os britânicos conseguiam observar.</p>
        </article>
        <article class="timeline-card">
          <time>Room 40</time>
          <h5>Código, cifras e fragmentos de conhecimento</h5>
          <p>A unidade criptanalítica naval britânica trabalhou com livros de códigos e material já recuperado. A leitura não apareceu de uma única adivinhação: combinou interceptações, versões da mensagem e conhecimento acumulado sobre sistemas alemães.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>Da leitura ao uso político</h4>
        <article class="timeline-card">
          <time>Problema de divulgação</time>
          <h5>Como provar sem expor a origem?</h5>
          <p>Publicar diretamente a interceptação poderia denunciar o acesso britânico às comunicações e criar questões diplomáticas sobre o canal usado. Agentes britânicos obtiveram no México uma versão que permitia construir uma história de origem mais segura para a divulgação.</p>
        </article>
        <article class="timeline-card">
          <time>1º de março de 1917</time>
          <h5>O telegrama chega ao público</h5>
          <p>A imprensa norte-americana publicou o conteúdo; Zimmermann depois reconheceu sua autenticidade. A revelação fortaleceu a opinião favorável à entrada na guerra, ao lado de fatores como a retomada da guerra submarina irrestrita. Os Estados Unidos declararam guerra em abril.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> Arquivos nacionais preservam a mensagem, traduções e o contexto de interceptação e divulgação.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Dizer que o telegrama “levou os Estados Unidos à guerra” simplifica uma decisão multicausal. É mais preciso dizer que sua publicação alterou o ambiente político num momento em que outros acontecimentos já pressionavam a neutralidade.</div>
    <ul class="source-links">
      <li><a href="https://www.archives.gov/publications/prologue/2016/winter/zimmermann-telegram" target="_blank" rel="noopener noreferrer">The Zimmermann Telegram — U.S. National Archives</a></li>
      <li><a href="https://www.archives.gov/exhibits/american_originals/zimm1.html" target="_blank" rel="noopener noreferrer">Telegrama, tradução e documentos digitalizados — U.S. National Archives</a></li>
      <li><a href="https://history.blog.gov.uk/2017/01/16/the-zimmermann-telegram-and-room-40/" target="_blank" rel="noopener noreferrer">The Zimmermann Telegram and Room 40 — History of Government</a></li>
    </ul>`),
  tags: ["história", "Zimmermann", "Room 40", "Primeira Guerra"],
});
