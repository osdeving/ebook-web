import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingPrimesInData: EnrichmentDefinition = Object.freeze({
  id: "reading-1-primos-em-dados",
  layer: "reading",
  anchor: "theorem-1-20",
  title: "Primos além da lista do livro",
  kicker: "Para saber mais · dados e conjecturas",
  duration: "20–40 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Uma base de dados de primos é mais útil quando provoca perguntas: como o registro foi certificado, qual forma algébrica permite o teste e que diferença existe entre encontrar um número provável e provar primalidade?</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Base especializada</span><span class="reading-level">Iniciante</span></div>
        <h4>The PrimePages</h4>
        <p>Explore listas, glossário e páginas sobre testes de primalidade curadas por Chris Caldwell. Escolha um primo recordista e investigue por que sua forma permite busca e certificação eficientes.</p>
        <a href="https://t5k.org/" target="_blank" rel="noopener noreferrer">Explorar o PrimePages</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">História da matemática</span><span class="reading-level">Iniciante</span></div>
        <h4>MacTutor: índice de tópicos em teoria dos números</h4>
        <p>Use o índice para reconstruir uma linha histórica de Euclides, Fermat e Euler sem supor que as definições modernas existiram sempre na mesma forma.</p>
        <a href="https://mathshistory.st-andrews.ac.uk/HistTopics/category-number-theory/" target="_blank" rel="noopener noreferrer">Ler o panorama do MacTutor</a>
      </article>
    </div>
    <div class="watch-out-inline"><strong>Distinção importante.</strong> “Maior primo conhecido” é um recorde contingente e datado; a infinitude dos primos é um teorema.</div>`),
  tags: ["leituras", "primos", "dados", "primalidade"],
});
