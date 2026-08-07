import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyIdentityPrivacy: EnrichmentDefinition = Object.freeze({
  id: "history-4-assinatura-identidade-privacidade",
  layer: "history",
  anchor: "sec-4-1",
  title: "Da chave à identidade — e da identidade à privacidade",
  kicker: "História · confiança e assinaturas cegas",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A verificação pública resolveu apenas parte do problema social da assinatura. Restavam duas perguntas opostas: como provar de quem é a chave e como obter uma autorização sem revelar tudo ao signatário?</p>
    <div class="timeline">
      <article class="timeline-card"><time>Década de 1980</time><h4>Chaum e as assinaturas cegas</h4><p>David Chaum descreveu um protocolo em que uma mensagem é cegada antes da assinatura e descegada depois. A ideia sustenta formas de pagamento eletrônico nas quais a instituição autoriza uma unidade sem poder ligar emissão e gasto.</p></article>
      <article class="timeline-card"><time>Infraestruturas de chave pública</time><h4>Certificar o vínculo</h4><p>Certificados e autoridades passaram a transportar afirmações assinadas sobre chaves: identidade, finalidade, validade e emissor. A assinatura de um documento depende, então, de uma cadeia de decisões de confiança.</p></article>
      <article class="timeline-card"><time>2006</time><h4>NIST organiza as garantias</h4><p>A SP 800-89 separa validade dos parâmetros, validade aritmética da chave pública, prova de posse da chave privada e garantia sobre a identidade do dono. A decomposição mostra por que “a conta bateu” é só uma etapa.</p></article>
    </div>
    <ul class="source-links">
      <li><a href="https://chaum.com/security-without-identification/" target="_blank" rel="noopener noreferrer">David Chaum — explicação histórica e artigo ligado</a></li>
      <li><a href="https://csrc.nist.gov/pubs/sp/800/89/final" target="_blank" rel="noopener noreferrer">NIST SP 800-89 — garantias para aplicações de assinatura</a></li>
    </ul>`),
  tags: ["história", "identidade", "PKI", "assinatura cega"],
});
