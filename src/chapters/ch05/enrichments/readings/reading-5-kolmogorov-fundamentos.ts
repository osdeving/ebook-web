import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingKolmogorov: EnrichmentDefinition = Object.freeze({
  id: "reading-5-kolmogorov-fundamentos",
  layer: "reading",
  anchor: "sec-5-3-1",
  title: "Os axiomas de probabilidade no texto de Kolmogorov",
  kicker: "Roteiro de leitura · 1933/1956",
  duration: "65–100 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Leia apenas a abertura, os axiomas e a interpretação empírica. O objetivo é reconhecer a estrutura usada no capítulo e entender por que espaços infinitos exigem uma condição além da aditividade finita.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1933</span><span class="reading-level">Documento</span></div><h4>A edição alemã</h4><p>Confira folha de rosto, sumário e as páginas iniciais de <em>Grundbegriffe</em>. Registre como Kolmogorov nomeia conjunto básico, sistema de conjuntos e função de probabilidade. Compare a ordem da exposição com a Seção 5.3.1.</p><a href="https://books.google.com/books/about/Grundbegriffe_der_Wahrscheinlichkeitsrec.html?id=ob4rAAAAYAAJ" target="_blank" rel="noopener noreferrer">Abrir o exemplar digitalizado</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Tradução</span><span class="reading-level">Axiomática</span></div><h4><em>Foundations of the Theory of Probability</em></h4><p>Na tradução inglesa, leia Capítulo I, §§1–2. Reescreva cada axioma com a notação do ebook. Depois derive \(P(\varnothing)=0\), \(P(A^c)=1-P(A)\) e monotonicidade sem acrescentar novos postulados.</p><a href="https://cml.rhul.ac.uk/resources/fop/index.htm" target="_blank" rel="noopener noreferrer">Acessar a cópia na Royal Holloway</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Faça uma folha de duas partes: uma prova curta das três consequências e um exemplo em que aditividade enumerável controla uma sequência infinita de eventos. Marque quais detalhes o modelo discreto finito deixa invisíveis.</p>`),
  tags: ["leitura", "Kolmogorov", "axiomas", "probabilidade"],
});
