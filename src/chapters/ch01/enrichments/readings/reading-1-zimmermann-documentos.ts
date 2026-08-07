import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingZimmermannDocuments: EnrichmentDefinition = Object.freeze({
  id: "reading-1-zimmermann-documentos",
  layer: "reading",
  anchor: "sec-1-6",
  title: "Dossiê Zimmermann: mensagem, versão e efeito",
  kicker: "Para saber mais · documentos da Primeira Guerra",
  duration: "35–70 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Leia o caso em três planos: o documento, a operação britânica e a interpretação do efeito político. Não use um único plano como resposta para os outros.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Documentos digitalizados</span><span class="reading-level">Iniciante</span></div>
        <h4>Zimmermann Telegram — American Originals</h4>
        <p>Compare imagem, transcrição e tradução. Pergunte qual versão cada pessoa viu e que etapas existem entre a interceptação cifrada e o texto publicado.</p>
        <a href="https://www.archives.gov/exhibits/american_originals/zimm1.html" target="_blank" rel="noopener noreferrer">Abrir os documentos no U.S. National Archives</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Ensaio arquivístico</span><span class="reading-level">Intermediário</span></div>
        <h4>The Zimmermann Telegram</h4>
        <p>O ensaio do <em>Prologue</em> reconstrói transmissão, decifração, divulgação e recepção com imagens de arquivo. Use a cronologia para testar afirmações causais.</p>
        <a href="https://www.archives.gov/publications/prologue/2016/winter/zimmermann-telegram" target="_blank" rel="noopener noreferrer">Ler o ensaio do National Archives</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">História governamental</span><span class="reading-level">Intermediário</span></div>
        <h4>The Zimmermann Telegram and Room 40</h4>
        <p>A perspectiva britânica detalha o dilema entre explorar a mensagem e esconder a capacidade de interceptação. Compare seus focos com os do arquivo norte-americano.</p>
        <a href="https://history.blog.gov.uk/2017/01/16/the-zimmermann-telegram-and-room-40/" target="_blank" rel="noopener noreferrer">Ler no History of Government</a>
      </article>
    </div>`),
  tags: ["leituras", "Zimmermann", "documentos", "Room 40"],
});
