import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingPublicKeyOrigins: EnrichmentDefinition = Object.freeze({
  id: "reading-1-chave-publica-origens",
  layer: "reading",
  anchor: "sec-1-7-6",
  title: "Chave pública: publicação aberta e trabalho antes sigiloso",
  kicker: "Para saber mais · origens",
  duration: "45–90 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A história da chave pública tem pelo menos duas cronologias: quando ideias foram concebidas e quando puderam ser publicadas e verificadas por uma comunidade aberta.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Artigo original</span><span class="reading-level">Intermediário</span></div>
        <h4>Diffie e Hellman, <em>New Directions in Cryptography</em> (1976)</h4>
        <p>Leia a introdução e as seções de distribuição de chaves para ver quais problemas os autores formulam antes de apresentar o mecanismo. O artigo também articula a ideia de assinatura digital.</p>
        <a href="https://ee.stanford.edu/~hellman/publications/24.pdf" target="_blank" rel="noopener noreferrer">Abrir o PDF hospedado por Stanford</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">História institucional</span><span class="reading-level">Iniciante</span></div>
        <h4>James Ellis — GCHQ</h4>
        <p>A página descreve o trabalho britânico então classificado sobre “cifração não secreta”. Compare cuidadosamente data de concepção, realização matemática e divulgação pública.</p>
        <a href="https://www.gchq.gov.uk/person/james-ellis" target="_blank" rel="noopener noreferrer">Ler o perfil histórico do GCHQ</a>
      </article>
    </div>
    <div class="watch-out-inline"><strong>Limite conceitual.</strong> Chave pública resolve o problema de distribuir um segredo de outra maneira, mas não autentica sozinha a identidade associada a uma chave.</div>`),
  tags: ["leituras", "chave pública", "Diffie–Hellman", "James Ellis"],
});
