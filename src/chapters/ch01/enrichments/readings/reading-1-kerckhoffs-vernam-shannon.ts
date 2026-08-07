import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingKerckhoffsVernamShannon: EnrichmentDefinition = Object.freeze({
  id: "reading-1-kerckhoffs-vernam-shannon",
  layer: "reading",
  anchor: "example-1-34",
  title: "Três fontes para a segurança moderna",
  kicker: "Para saber mais · textos originais",
  duration: "60–120 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Este percurso vai de critérios de projeto a um mecanismo de telecomunicação e, por fim, a uma teoria probabilística. Leia procurando também as diferenças de vocabulário entre as épocas.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Original digitalizado</span><span class="reading-level">Avançado</span></div>
        <h4>Kerckhoffs, <em>La Cryptographie militaire</em> (1883)</h4>
        <p>Examine a lista completa de requisitos, não apenas a sentença modernamente isolada como “princípio de Kerckhoffs”. O contexto mostra preocupações com uso, portabilidade e operação militar.</p>
        <a href="https://gallica.bnf.fr/ark:/12148/bd6t57758983" target="_blank" rel="noopener noreferrer">Abrir o original na Gallica/BnF</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Patente</span><span class="reading-level">Intermediário</span></div>
        <h4>Vernam, <em>Secret Signaling System</em></h4>
        <p>Observe os diagramas e traduza mentalmente a combinação de impulsos para a operação binária estudada no capítulo. Anote também quais partes mecânicas não aparecem no modelo abstrato.</p>
        <a href="https://patents.google.com/patent/US1310719A/en" target="_blank" rel="noopener noreferrer">Consultar a patente US 1,310,719</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Artigo original</span><span class="reading-level">Avançado</span></div>
        <h4>Shannon, <em>Communication Theory of Secrecy Systems</em></h4>
        <p>Leia as definições antes dos teoremas. O salto decisivo é formular o que o adversário observa e medir a informação restante, tornando “seguro” uma propriedade demonstrável sob hipóteses explícitas.</p>
        <a href="https://doi.org/10.1002/j.1538-7305.1949.tb00928.x" target="_blank" rel="noopener noreferrer">Abrir o registro DOI do artigo de 1949</a>
      </article>
    </div>`),
  tags: ["leituras", "Kerckhoffs", "Vernam", "Shannon"],
});
