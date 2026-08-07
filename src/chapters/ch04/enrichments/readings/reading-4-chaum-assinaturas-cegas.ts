import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingBlindSignatures: EnrichmentDefinition = Object.freeze({
  id: "reading-4-chaum-assinaturas-cegas",
  layer: "reading",
  anchor: "sec-4-1",
  title: "Chaum: assinatura cega e pagamento não rastreável",
  kicker: "Roteiro de leitura · privacidade",
  duration: "35–60 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Parta da analogia do envelope com papel-carbono e depois identifique quais propriedades precisam coexistir em um sistema de dinheiro eletrônico.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Primária</span><span class="reading-level">1982/1983</span></div><h4>Blind Signatures for Untraceable Payments</h4><p>Distinga cegamento, assinatura, descegamento e verificação. Pergunte o que o banco sabe na retirada e o que aprende no depósito.</p><a href="https://chaum.com/security-without-identification/" target="_blank" rel="noopener noreferrer">Abrir texto e referência no site do autor</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Ameaça</span><span class="reading-level">Protocolo</span></div><h4>Privacidade versus gasto duplo</h4><p>Explique por que esconder a ligação não pode permitir copiar uma moeda indefinidamente. Localize no texto o mecanismo que trata reutilização.</p></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Transferência</span><span class="reading-level">Reflexão</span></div><h4>Voto cego não é só dinheiro cego</h4><p>Liste propriedades adicionais de uma eleição: elegibilidade, unicidade, sigilo, auditabilidade, resistência à coerção. Uma primitiva útil não resolve automaticamente o sistema inteiro.</p></article>
    </div>
    <div class="source-note"><strong>Direitos.</strong> O material de Chaum é ligado, não reproduzido. A explicação e as perguntas deste painel são redação editorial própria.</div>`),
  tags: ["leitura", "Chaum", "assinatura cega", "privacidade"],
});
