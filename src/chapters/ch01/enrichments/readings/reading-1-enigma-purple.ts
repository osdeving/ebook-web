import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingEnigmaPurple: EnrichmentDefinition = Object.freeze({
  id: "reading-1-enigma-purple",
  layer: "reading",
  anchor: "sec-1-6",
  title: "Duas máquinas, dois problemas de reconstrução",
  kicker: "Para saber mais · Segunda Guerra Mundial",
  duration: "40–90 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Leia Enigma e PURPLE em paralelo para observar como configuração, procedimentos e organização humana podem importar tanto quanto o princípio matemático de uma máquina.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Monografia histórica</span><span class="reading-level">Intermediário</span></div>
        <h4><em>Solving the Enigma</em></h4>
        <p>A publicação histórica da NSA oferece uma narrativa técnica acessível. Marque as contribuições polonesas, as mudanças operacionais alemãs e os diferentes recursos usados pelos Aliados.</p>
        <a href="https://www.nsa.gov/portals/75/documents/about/cryptologic-heritage/historical-figures-publications/publications/wwii/solving_enigma.pdf" target="_blank" rel="noopener noreferrer">Abrir o PDF no acervo da NSA</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Exposição museológica</span><span class="reading-level">Iniciante</span></div>
        <h4>The MAGIC of PURPLE</h4>
        <p>A exposição explica como uma equipe inferiu a lógica funcional do sistema diplomático japonês e construiu máquinas análogas. Leia procurando evidências de cooperação entre análise linguística e engenharia.</p>
        <a href="https://www.nsa.gov/History/National-Cryptologic-Museum/Exhibits-Artifacts/Exhibit-View/Article/2718925/the-magic-of-purple/" target="_blank" rel="noopener noreferrer">Visitar a exposição do National Cryptologic Museum</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Arquivo de museu</span><span class="reading-level">Intermediário</span></div>
        <h4>Gordon Welchman e Bletchley Park</h4>
        <p>Use o documento do museu para inserir as ideias técnicas numa organização: recrutamento, redes de comunicação, máquinas e fluxo de informação.</p>
        <a href="https://bletchleypark.org.uk/wp-content/uploads/record_attachments/1839.pdf" target="_blank" rel="noopener noreferrer">Abrir o documento de Bletchley Park</a>
      </article>
    </div>`),
  tags: ["leituras", "Enigma", "PURPLE", "Segunda Guerra"],
});
