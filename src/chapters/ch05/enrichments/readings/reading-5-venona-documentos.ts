import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingVenona: EnrichmentDefinition = Object.freeze({
  id: "reading-5-venona-documentos",
  layer: "reading",
  anchor: "sec-5-6-1",
  title: "VENONA: ler a falha de reutilização nas fontes desclassificadas",
  kicker: "Roteiro de leitura · arquivo NSA",
  duration: "80–120 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Este é um estudo técnico de documentação histórica, não uma investigação biográfica. Mantenha o foco em material de chave, profundidades, etapas de análise e limites do que cada documento permite concluir.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Monografia</span><span class="reading-level">Orientação</span></div><h4><em>The VENONA Story</em></h4><p>Leia as partes que descrevem o sistema soviético e a produção duplicada de material de one-time pad. Faça um fluxograma entre mensagem, código, aditivo, transmissão, interceptação e exploração criptanalítica.</p><a href="https://www.nsa.gov/portals/75/documents/about/cryptologic-heritage/historical-figures-publications/publications/coldwar/venona_story.pdf" target="_blank" rel="noopener noreferrer">Abrir monografia da NSA</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Arquivo</span><span class="reading-level">Primária</span></div><h4>Traduções e materiais liberados</h4><p>Escolha duas traduções da mesma categoria no catálogo. Leia cabeçalho, notas do tradutor e marcas de incerteza. Não trate texto reconstruído entre colchetes como se fosse leitura direta sem ambiguidade.</p><a href="https://www.nsa.gov/Helpful-Links/NSA-FOIA/Declassification-Transparency-Initiatives/Historical-Releases/Venona/lang/en/" target="_blank" rel="noopener noreferrer">Explorar a coleção VENONA</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Demonstração</span><span class="reading-level">Algébrica</span></div><h4>Por que a chave desaparece</h4><p>Com alfabeto aditivo, derive \(C_1-C_2=(M_1+K)-(M_2+K)=M_1-M_2\). Repita em bits com XOR. Liste o que a equação revela imediatamente e o que ainda depende de redundância, contexto e hipótese linguística.</p><a href="https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/cryptologic-quarterly/the_sting.pdf" target="_blank" rel="noopener noreferrer">Ler um estudo criptológico desclassificado</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Produza uma nota de incidente com causa raiz, condição matemática violada, evidência documental, impacto e controles preventivos. Termine com a frase precisa: “VENONA não quebra o teorema do OTP porque…”.</p>`),
  tags: ["leitura", "VENONA", "one-time pad", "documentos desclassificados"],
});
