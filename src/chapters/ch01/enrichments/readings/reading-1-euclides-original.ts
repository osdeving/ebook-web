import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingEuclidOriginal: EnrichmentDefinition = Object.freeze({
  id: "reading-1-euclides-original",
  layer: "reading",
  anchor: "theorem-1-7",
  title: "Ler Euclides sem fingir que é pseudocódigo",
  kicker: "Para saber mais · história da matemática",
  duration: "25–45 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O objetivo não é procurar símbolos modernos no texto antigo, e sim reconhecer o invariante do mdc em outra linguagem matemática.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Texto histórico</span><span class="reading-level">Intermediário</span></div>
        <h4><em>Elementos</em>, Livro VII, proposições 1–3</h4>
        <p>Compare a subtração recíproca com a divisão com resto do capítulo. Tente marcar, em cada etapa, qual medida comum permanece possível e onde o processo termina.</p>
        <a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVII/bookVII.html" target="_blank" rel="noopener noreferrer">Abrir a edição comentada de David Joyce</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Biografia crítica</span><span class="reading-level">Iniciante</span></div>
        <h4>Euclid of Alexandria — MacTutor</h4>
        <p>Leia para entender o que se sabe, o que se infere e o que permanece incerto sobre Euclides e a composição dos <em>Elementos</em>. Isso evita tratar um nome autoral como se fosse um diário biográfico completo.</p>
        <a href="https://mathshistory.st-andrews.ac.uk/Biographies/Euclid/" target="_blank" rel="noopener noreferrer">Ler no MacTutor</a>
      </article>
    </div>`),
  tags: ["leituras", "Euclides", "mdc", "história da matemática"],
});
