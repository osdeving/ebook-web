import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingGmr: EnrichmentDefinition = Object.freeze({
  id: "reading-4-seguranca-gmr",
  layer: "reading",
  anchor: "sec-4-1",
  title: "Como nasceu o ataque adaptativo de mensagem escolhida",
  kicker: "Leitura avançada · Goldwasser–Micali–Rivest",
  duration: "50–80 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O artigo é denso; a meta aqui não é reproduzir toda a construção, mas entender com precisão o problema que ela resolve.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Passo 1</span><span class="reading-level">Resumo</span></div><h4>Leia o abstract como contrato</h4><p>Sublinhe quem escolhe as mensagens, quando as escolhas ocorrem e qual assinatura adicional o adversário tenta produzir.</p><a href="https://people.csail.mit.edu/silvio/Selected%20Scientific%20Papers/Digital%20Signatures/A_Digital_Signature_Scheme_Secure_Against_Adaptive_Chosen-Message_Attack.pdf" target="_blank" rel="noopener noreferrer">Abrir versão hospedada no MIT</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Passo 2</span><span class="reading-level">Modelo</span></div><h4>Separe ataque e falsificação</h4><p>Faça um diagrama com geração de chaves, consultas do adversário e saída final. Marque por que a mensagem forjada precisa ser nova.</p></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Passo 3</span><span class="reading-level">Comparação</span></div><h4>Volte aos Exercícios 4.7 e 4.8</h4><p>Classifique a construção de documento aleatório e a extração por nonce repetido: em qual delas o adversário obtém uma assinatura? Em qual ele recupera a chave?</p></article>
    </div>
    <div class="source-note"><strong>Direitos.</strong> O artigo é protegido pela SIAM; o ebook apenas aponta para a cópia disponibilizada na página acadêmica de Silvio Micali e oferece perguntas próprias.</div>`),
  tags: ["leitura", "segurança formal", "GMR", "mensagem escolhida"],
});
