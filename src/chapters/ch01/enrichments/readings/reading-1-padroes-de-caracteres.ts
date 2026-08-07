import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingCharacterStandards: EnrichmentDefinition = Object.freeze({
  id: "reading-1-padroes-de-caracteres",
  layer: "reading",
  anchor: "def-1-encoding-scheme",
  title: "De caracteres a números: dois padrões, duas épocas",
  kicker: "Para saber mais · codificação",
  duration: "25–50 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Codificar uma mensagem exige uma convenção compartilhada antes de qualquer cifra. ASCII e Unicode mostram como essa convenção cresceu de um repertório limitado para uma arquitetura global de caracteres.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Padrão histórico</span><span class="reading-level">Intermediário</span></div>
        <h4>RFC 20 — ASCII format for Network Interchange</h4>
        <p>O documento de 1969 permite ver uma tabela de sete bits no contexto inicial das redes. Escolha uma palavra e separe claramente caractere, código numérico e sequência de bits.</p>
        <a href="https://www.rfc-editor.org/info/rfc20/" target="_blank" rel="noopener noreferrer">Abrir o RFC 20 no RFC Editor</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Padrão atual</span><span class="reading-level">Intermediário</span></div>
        <h4>Latest Unicode Standard</h4>
        <p>Use a página de versão para acessar o padrão vigente e seus anexos. Investigue a diferença entre ponto de código, unidade de codificação e glifo — três noções que não devem ser tratadas como sinônimas.</p>
        <a href="https://www.unicode.org/versions/latest/" target="_blank" rel="noopener noreferrer">Consultar a versão atual do Unicode</a>
      </article>
    </div>
    <div class="watch-out-inline"><strong>Codificação não é segurança.</strong> Conhecer UTF-8 ou Base64 permite interpretar bytes; não fornece uma chave nem uma propriedade de confidencialidade.</div>`),
  tags: ["leituras", "ASCII", "Unicode", "codificação"],
});
