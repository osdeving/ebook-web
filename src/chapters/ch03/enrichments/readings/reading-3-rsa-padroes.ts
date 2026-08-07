import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingRsaStandards: EnrichmentDefinition = Object.freeze({
  id: "reading-3-rsa-padroes",
  layer: "reading",
  anchor: "sec-3-2",
  title: "RSA de padrão: primitivas, codificação e validação",
  kicker: "Roteiro de leitura · RFC 8017",
  duration: "60–100 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A RFC 8017 é deliberadamente precisa. Em vez de lê-la em linha reta, acompanhe uma operação do formato de chave até a codificação e a validação final.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Mapa</span><span class="reading-level">Essencial</span></div>
        <h4>Seções 3–5: tipos e primitivas</h4>
        <p>Identifique chave pública, chave privada de dois primos e forma multiprimo. Depois compare RSAEP/RSADP e RSASP1/RSAVP1: a exponenciação parece igual, mas domínio, papel e tratamento de erro são distintos.</p>
        <a href="https://www.ietf.org/rfc/rfc8017.html#section-3" target="_blank" rel="noopener noreferrer">Abrir na representação das chaves</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Cifração</span><span class="reading-level">Seção 7</span></div>
        <h4>OAEP e o legado v1.5</h4>
        <p>Siga EME-OAEP byte por byte: rótulo, <em>seed</em>, funções de máscara e verificações. Em seguida leia a advertência operacional de RSAES-PKCS1-v1_5. Pergunte que diferença de erro poderia se tornar observável.</p>
        <a href="https://www.ietf.org/rfc/rfc8017.html#section-7" target="_blank" rel="noopener noreferrer">Abrir os esquemas de cifração</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Assinatura</span><span class="reading-level">Seção 8</span></div>
        <h4>PSS não é “cifrar o hash”</h4>
        <p>Marque o sal, a função de máscara e as condições de verificação em EMSA-PSS. Compare com EMSA-PKCS1-v1_5 e note por que uma assinatura é um esquema completo, não apenas a primitiva RSASP1.</p>
        <a href="https://www.ietf.org/rfc/rfc8017.html#section-8" target="_blank" rel="noopener noreferrer">Abrir os esquemas de assinatura</a>
      </article>
    </div>
    <h4>Produto da leitura</h4>
    <p>Desenhe uma pilha de quatro níveis: representação de octetos ↔ inteiro; primitiva RSA; codificação; API/protocolo. Para cada nível, anote uma condição que deve ser validada e um erro que não pode vazar por tempo ou mensagem.</p>
    <div class="source-note"><strong>Fato documentado.</strong> A RFC 8017, PKCS #1 v2.2, foi publicada pelo IETF em novembro de 2016 e substitui a RFC 3447. Ela inclui OAEP, PSS e os esquemas legados v1.5.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> O documento é mais útil quando lido como composição de contratos. Misturar primitiva com esquema é justamente o atalho conceitual que leva ao chamado “textbook RSA”.</div>`),
  tags: ["leitura", "RSA", "RFC 8017", "PKCS #1"],
});
