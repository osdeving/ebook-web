import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historySignatureSecurity: EnrichmentDefinition = Object.freeze({
  id: "history-4-nascimento-seguranca-assinaturas",
  layer: "history",
  anchor: "sec-4-1",
  title: "Da possibilidade de assinar à definição de falsificação",
  kicker: "História · 1976–1988",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Em pouco mais de uma década, “assinatura digital” deixou de ser uma capacidade imaginada para se tornar um objeto com adversário e condição de vitória formalmente descritos.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Construir</h4>
        <article class="timeline-card"><time>1976</time><h5>Diffie e Hellman formulam a direção</h5><p><em>New Directions in Cryptography</em> descreveu a criptografia de chave pública e apontou autenticação e assinaturas como aplicações centrais. O texto antecede um esquema prático completo, mas fixa a mudança conceitual: verificação pode ser pública sem tornar pública a capacidade de assinar.</p></article>
        <article class="timeline-card"><time>1977–1978</time><h5>RSA fornece uma construção pública</h5><p>Rivest, Shamir e Adleman apresentaram uma função com alçapão que servia tanto à confidencialidade quanto à assinatura em seu modelo original. A circulação aberta permitiu testar não apenas a correção da congruência, mas os limites do esquema cru.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>Definir segurança</h4>
        <article class="timeline-card"><time>1984–1988</time><h5>Goldwasser, Micali e Rivest formalizam o adversário</h5><p>O trabalho publicado em 1988 formulou segurança contra ataque adaptativo de mensagem escolhida: mesmo obtendo assinaturas de mensagens selecionadas ao longo do ataque, o adversário não deve forjar uma assinatura para uma mensagem adicional.</p></article>
        <article class="timeline-card"><time>Depois</time><h5>Correção deixa de ser sinônimo de segurança</h5><p>A distinção tornou possível comparar esquemas pelaquilo que impedem. Uma equação que sempre aceita assinaturas honestas prova correção; excluir falsificações requer um jogo, uma hipótese e uma redução.</p></article>
      </section>
    </div>
    <ul class="source-links">
      <li><a href="https://ee.stanford.edu/~hellman/publications/24.pdf" target="_blank" rel="noopener noreferrer">Diffie e Hellman — artigo de 1976 (Stanford)</a></li>
      <li><a href="https://people.csail.mit.edu/rivest/pubs/RSA78.pdf" target="_blank" rel="noopener noreferrer">Rivest, Shamir e Adleman — artigo original (MIT)</a></li>
      <li><a href="https://people.csail.mit.edu/silvio/Selected%20Scientific%20Papers/Digital%20Signatures/A_Digital_Signature_Scheme_Secure_Against_Adaptive_Chosen-Message_Attack.pdf" target="_blank" rel="noopener noreferrer">Goldwasser, Micali e Rivest — artigo de 1988 (MIT)</a></li>
    </ul>`),
  tags: ["história", "assinaturas", "segurança", "EUF-CMA"],
});
