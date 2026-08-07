import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingDlmfQuadraticReciprocity: EnrichmentDefinition = Object.freeze({
  id: "reading-3-dlmf-reciprocidade",
  layer: "reading",
  anchor: "sec-3-9",
  title: "Reciprocidade quadrática em duas notações",
  kicker: "Roteiro de leitura · DLMF e Gauss",
  duration: "50–80 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A DLMF oferece uma referência moderna, hiperligada e verificável; o fac-símile de Gauss mostra como o resultado foi organizado antes da notação atual. Ler ambos impede que familiaridade tipográfica seja confundida com simplicidade histórica.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Referência moderna</span><span class="reading-level">20 min</span></div>
        <h4>DLMF §27.9</h4>
        <p>Comece pelas definições dos símbolos de Legendre e Jacobi. Em seguida derive os quatro casos da lei a partir do expoente \((p-1)(q-1)/4\) e acrescente as leis suplementares para \(-1\) e \(2\).</p>
        <a href="https://dlmf.nist.gov/27.9" target="_blank" rel="noopener noreferrer">Abrir NIST DLMF §27.9</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Fonte histórica</span><span class="reading-level">Exploratória</span></div>
        <h4><em>Disquisitiones Arithmeticae</em></h4>
        <p>Na seção IV, procure “residua” e “non-residua” e reconheça os enunciados antes de tentar seguir a prova latina. Registre quais convenções modernas — símbolo, congruência, expoentes — condensam frases inteiras do texto.</p>
        <a href="https://gdz.sub.uni-goettingen.de/id/PPN235993352" target="_blank" rel="noopener noreferrer">Abrir o fac-símile da SUB Göttingen</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Algoritmo</span><span class="reading-level">25 min</span></div>
        <h4>Transforme o teorema em cálculo</h4>
        <p>Calcule \(\left(\frac{12345}{65537}\right)\) por fatoração ingênua e depois por reciprocidade e reduções. Liste cada troca de numerador e denominador e o sinal produzido. Repita com símbolo de Jacobi composto e explique por que valor \(1\) não certifica resíduo.</p>
      </article>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> A DLMF é uma publicação de referência do NIST e registra as fórmulas com definições interligadas. O item da Göttingen é uma digitalização de edição de 1863 das obras de Gauss; o tratado original foi publicado em 1801.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A comparação deixa visível um papel da notação: o símbolo de Legendre não é só abreviação, mas uma interface que permite converter um teorema estrutural em algoritmo recursivo.</div>`),
  tags: ["leitura", "DLMF", "Gauss", "reciprocidade quadrática"],
});
