import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingMonteCarlo: EnrichmentDefinition = Object.freeze({
  id: "reading-5-monte-carlo-fontes",
  layer: "reading",
  anchor: "sec-5-3-3",
  title: "Monte Carlo: artigo fundador e memórias de laboratório",
  kicker: "Roteiro de leitura · 1949 e retrospectivas LANL",
  duration: "70–105 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Compare uma apresentação contemporânea do método com relatos escritos décadas depois. Eles respondem a perguntas diferentes: o artigo justifica uma técnica; as memórias reconstroem pessoas, máquinas e decisões.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1949</span><span class="reading-level">Matemática</span></div><h4>Metropolis e Ulam</h4><p>Leia resumo, introdução e um exemplo. Para cada um, identifique: espaço amostral, amostragem, variável medida, média calculada e fonte de erro. Marque onde o texto discute eficiência em vez de apenas correção.</p><a href="https://doi.org/10.1080/01621459.1949.10483310" target="_blank" rel="noopener noreferrer">Abrir o artigo no periódico</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Arquivo LANL</span><span class="reading-level">Histórica</span></div><h4>Metropolis e Eckhardt em retrospecto</h4><p>Compare as memórias de Metropolis e Eckhardt. Registre quais fatos vêm de experiência pessoal, onde os relatos convergem e quais pontos são apoiados por documentos ou resultados técnicos.</p><a href="https://mcnp.lanl.gov/pdf_files/Article_1987_LAS_Metropolis_125--130.pdf" target="_blank" rel="noopener noreferrer">Ler a retrospectiva de Metropolis</a><a href="https://mcnp.lanl.gov/pdf_files/Article_1987_LAS_Eckhardt_131--141.pdf" target="_blank" rel="noopener noreferrer">Ler a retrospectiva de Eckhardt</a><a href="https://mcnp.lanl.gov/reference_collection.html" target="_blank" rel="noopener noreferrer">Explorar a coleção do LANL</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1986</span><span class="reading-level">Computacional</span></div><h4>Anderson: ENIAC, Metropolis e MANIAC</h4><p>Mapeie o fluxo de uma simulação: estado inicial, números pseudoaleatórios, transição, parada e agregação. Depois compare esse fluxo com um algoritmo de Monte Carlo do capítulo.</p><a href="https://mcnp.lanl.gov/pdf_files/Article_1986_LAS_Anderson_96--108.pdf" target="_blank" rel="noopener noreferrer">Abrir a retrospectiva institucional</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Faça um diagrama que separe três camadas: modelo probabilístico, gerador de amostras e decisão/estimativa final. Acrescente uma caixa “amplificação” mostrando o que muda quando a execução independente é repetida \(k\) vezes.</p>`),
  tags: ["leitura", "Monte Carlo", "Los Alamos", "história da computação"],
});
