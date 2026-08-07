import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingRfc6979: EnrichmentDefinition = Object.freeze({
  id: "reading-4-rfc6979-nonce-deterministico",
  layer: "reading",
  anchor: "sec-4-3",
  title: "RFC 6979: nonce determinístico sem nonce público",
  kicker: "Roteiro de leitura · implementação",
  duration: "45–75 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Leia para desfazer uma confusão comum: determinístico significa reproduzível pelo dono da chave, não previsível por quem só conhece a chave pública.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Motivação</span><span class="reading-level">Seção 1</span></div><h4>Que falha a RFC remove?</h4><p>Liste as propriedades exigidas do nonce aleatório e explique por que testá-las depois da assinatura é difícil.</p><a href="https://www.rfc-editor.org/rfc/rfc6979.html#section-1" target="_blank" rel="noopener noreferrer">Abrir introdução</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Construção</span><span class="reading-level">Seção 3</span></div><h4>HMAC-DRBG local</h4><p>Siga como chave privada e hash da mensagem alimentam uma nova instância. Marque rejeição de candidatos fora do intervalo e por que não se deve simplesmente reduzir bits módulo q.</p><a href="https://www.rfc-editor.org/rfc/rfc6979.html#section-3" target="_blank" rel="noopener noreferrer">Abrir geração determinística</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Vetores</span><span class="reading-level">Apêndice A</span></div><h4>Teste reprodutível</h4><p>Escolha um vetor DSA e confira pelo menos k e os dois componentes da assinatura em uma biblioteca confiável. Vetores são uma vantagem operacional da derivação determinística.</p><a href="https://www.rfc-editor.org/rfc/rfc6979.html#appendix-A" target="_blank" rel="noopener noreferrer">Abrir vetores de teste</a></article>
    </div>`),
  tags: ["leitura", "RFC 6979", "nonce", "DSA", "ECDSA"],
});
