import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingRsaPss: EnrichmentDefinition = Object.freeze({
  id: "reading-4-rsa-pss-rfc8017",
  layer: "reading",
  anchor: "sec-4-2",
  title: "RSA-PSS na RFC 8017: da mensagem à decisão",
  kicker: "Roteiro de leitura · padrão IETF",
  duration: "55–90 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Siga uma assinatura de fora para dentro. A nomenclatura da RFC impede que primitiva e esquema sejam confundidos.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Primitiva</span><span class="reading-level">Seção 5.2</span></div><h4>RSASP1 e RSAVP1</h4><p>Anote domínio, saída e cada condição de erro. Observe que nenhuma delas, isoladamente, recebe um documento arbitrário.</p><a href="https://www.rfc-editor.org/rfc/rfc8017.html#section-5.2" target="_blank" rel="noopener noreferrer">Abrir primitivas de assinatura</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Esquema</span><span class="reading-level">Seção 8.1</span></div><h4>RSASSA-PSS</h4><p>Siga conversões octeto–inteiro, codificação EMSA-PSS, primitiva e retorno. No verificador, liste todas as razões de rejeição.</p><a href="https://www.rfc-editor.org/rfc/rfc8017.html#section-8.1" target="_blank" rel="noopener noreferrer">Abrir RSASSA-PSS</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Codificação</span><span class="reading-level">Seção 9.1</span></div><h4>EMSA-PSS por bytes</h4><p>Localize hash da mensagem, sal, MGF, máscara de bits e byte final. Desenhe o bloco codificado com seus comprimentos.</p><a href="https://www.rfc-editor.org/rfc/rfc8017.html#section-9.1" target="_blank" rel="noopener noreferrer">Abrir EMSA-PSS</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Explique em cinco linhas por que escolher uma assinatura aleatória S e calcular S^e não costuma produzir uma codificação PSS aceita.</p>`),
  tags: ["leitura", "RSA-PSS", "RFC 8017", "IETF"],
});
