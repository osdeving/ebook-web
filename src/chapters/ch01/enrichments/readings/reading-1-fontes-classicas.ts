import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingClassicalSources: EnrichmentDefinition = Object.freeze({
  id: "reading-1-fontes-classicas",
  layer: "reading",
  anchor: "sec-1-1",
  title: "César e Alberti nas fontes",
  kicker: "Para saber mais · fontes históricas",
  duration: "15–30 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Comece pelo testemunho antigo e depois compare-o com um objeto renascentista documentado. O percurso ajuda a distinguir uma cifra fixa de um mecanismo que muda de alfabeto.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Fonte antiga</span><span class="reading-level">Intermediário</span></div>
        <h4>Suetônio, <em>Divus Julius</em>, capítulo 56</h4>
        <p>Leia o parágrafo sobre cartas reservadas e observe exatamente o que ele afirma: um exemplo de troca entre letras. É o melhor antídoto contra transformar uma evidência curta numa biografia inteira da “cifra de César”.</p>
        <a href="https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.02.0132%3Alife%3Djul.%3Achapter%3D56" target="_blank" rel="noopener noreferrer">Abrir no Perseus Digital Library</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Acervo universitário</span><span class="reading-level">Iniciante</span></div>
        <h4>Alberti’s <em>La Cifra</em></h4>
        <p>A Carnegie Mellon apresenta a edição rara do tratado e contextualiza a encomenda, a datação e o disco cifrante. Leia para ver como um artefato físico incorpora uma regra criptográfica variável.</p>
        <a href="https://www.library.cmu.edu/about/news/2023-01/Alberti-La-Cifra" target="_blank" rel="noopener noreferrer">Visitar o acervo da CMU</a>
      </article>
    </div>`),
  tags: ["leituras", "fontes primárias", "César", "Alberti"],
});
