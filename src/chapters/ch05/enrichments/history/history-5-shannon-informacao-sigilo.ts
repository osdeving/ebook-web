import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyShannon: EnrichmentDefinition = Object.freeze({
  id: "history-5-shannon-informacao-sigilo",
  layer: "history",
  anchor: "sec-5-6-1",
  title: "Shannon: comunicação, entropia e sigilo no mesmo programa",
  kicker: "História · 1945–1949",
  duration: "12 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Em poucos anos, Claude Shannon deu forma matemática a duas perguntas vizinhas: quanto uma fonte produz de informação e quanto um criptograma revela sobre sua mensagem.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Informação em um canal</h4>
        <article class="timeline-card"><time>1948</time><h5>Uma teoria matemática da comunicação</h5><p>Shannon define uma medida logarítmica de incerteza, estuda fontes, ruído, codificação e capacidade de canal. A entropia surge como consequência de propriedades desejáveis da medida, não apenas como uma fórmula isolada.</p></article>
        <article class="timeline-card"><span class="timeline-label">Consequência</span><h5>Redundância torna-se mensurável</h5><p>Se uma fonte usa símbolos de modo desigual ou com dependências, sua entropia fica abaixo do máximo. Essa diferença permite compressão; em criptanálise, também representa estrutura que um adversário pode explorar.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>Informação em um criptograma</h4>
        <article class="timeline-card"><span class="timeline-label">1945 → 1949</span><h5>Um relatório confidencial é publicado</h5><p>O artigo de 1949 informa que seu material aparecera primeiro em um relatório confidencial de 1945, depois desclassificado. Ele trata sistemas de sigilo com ferramentas probabilísticas e algébricas, aproximando criptografia e teoria da informação.</p></article>
        <article class="timeline-card"><span class="timeline-label">Sigilo perfeito</span><h5>Nenhuma atualização após observar o criptograma</h5><p>Na formulação probabilística, o criptograma não altera a distribuição da mensagem: para todo par relevante, \(P(M=m\mid C=c)=P(M=m)\). É uma garantia absoluta do modelo, distinta de “nenhum ataque eficiente é conhecido”.</p></article>
      </section>
    </div>
    <p class="source-note"><strong>Duas noções de segurança.</strong> Sigilo perfeito limita informação mesmo contra poder computacional ilimitado; segurança computacional admite informação em princípio, mas torna sua extração inviável dentro de recursos definidos.</p>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1002/j.1538-7305.1948.tb01338.x" target="_blank" rel="noopener noreferrer">Shannon — “A Mathematical Theory of Communication” (1948)</a></li>
      <li><a href="https://doi.org/10.1002/j.1538-7305.1949.tb00928.x" target="_blank" rel="noopener noreferrer">Shannon — “Communication Theory of Secrecy Systems” (1949)</a></li>
      <li><a href="https://www.itsoc.org/about/shannon" target="_blank" rel="noopener noreferrer">Arquivo institucional sobre Shannon — IEEE Information Theory Society</a></li>
    </ul>`),
  tags: ["história", "Shannon", "entropia", "sigilo perfeito"],
});
