import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyNonce: EnrichmentDefinition = Object.freeze({
  id: "history-4-nonce-aleatorio-deterministico",
  layer: "history",
  anchor: "sec-4-3",
  title: "O nonce: de sorteio externo a derivação determinística",
  kicker: "História · engenharia criptográfica",
  duration: "8 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">As fórmulas de ElGamal e DSA já mostram que repetir ou revelar o nonce expõe a chave. O desafio histórico foi transformar “escolha um aleatório novo” em um procedimento implementável e testável.</p>
    <div class="history-tracks">
      <section class="history-track"><h4>Nonce aleatório</h4>
        <article class="timeline-card"><h5>Uma exigência forte sobre o gerador</h5><p>Cada assinatura requer um valor uniforme, secreto e independente. Falha de entropia, repetição acidental, estado clonado ou vazamento lateral podem introduzir relações algébricas entre assinaturas.</p></article>
        <article class="timeline-card"><h5>O problema é observável tarde demais</h5><p>Em vários esquemas, o nonce não é transmitido, mas determina o primeiro componente da assinatura. Quando dois componentes se repetem, o dano à chave pode já estar completo.</p></article>
      </section>
      <section class="history-track history-track--open"><h4>RFC 6979, 2013</h4>
        <article class="timeline-card"><h5>Derivar de chave e mensagem</h5><p>Thomas Pornin especificou o uso determinístico de DSA e ECDSA: uma construção HMAC-DRBG recebe a chave privada e o hash da mensagem, vinculando o nonce a essa combinação. A mesma combinação é reprodutível; hashes de mensagem diferentes alimentam estados distintos.</p></article>
        <article class="timeline-card"><h5>Compatibilidade externa</h5><p>A assinatura resultante continua compatível com verificadores DSA/ECDSA comuns; a mudança ocorre somente no modo de escolher o segredo efêmero. Determinístico não significa público: sem a chave privada, o nonce continua imprevisível.</p></article>
      </section>
    </div>
    <ul class="source-links"><li><a href="https://www.rfc-editor.org/rfc/rfc6979.html" target="_blank" rel="noopener noreferrer">RFC 6979 — uso determinístico de DSA e ECDSA</a></li></ul>`),
  tags: ["história", "nonce", "RFC 6979", "implementação"],
});
