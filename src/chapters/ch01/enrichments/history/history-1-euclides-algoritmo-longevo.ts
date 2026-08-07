import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyEuclidLongLivedAlgorithm: EnrichmentDefinition = Object.freeze({
  id: "history-1-euclides-algoritmo-longevo",
  layer: "history",
  anchor: "theorem-1-7",
  title: "Euclides: o que permaneceu e o que mudou",
  kicker: "História · algoritmos",
  duration: "6 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">É comum chamar o procedimento do mdc de “algoritmo mais antigo ainda em uso”. A frase capta uma continuidade extraordinária, desde que não esconda as diferenças entre o texto geométrico antigo e uma implementação contemporânea.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Nos <em>Elementos</em></h4>
        <article class="timeline-card">
          <time>Por volta de 300 a.C.</time>
          <h5>Livro VII, proposições 1–3</h5>
          <p>O texto associado a Euclides trata números como grandezas e emprega a subtração recíproca: retira-se repetidamente o menor do maior até revelar uma medida comum. As proposições distinguem casos e estendem o procedimento a mais de dois números.</p>
        </article>
        <article class="timeline-card">
          <time>Estrutura</time>
          <h5>Uma quantidade preservada</h5>
          <p>Subtrair um múltiplo de um número do outro não altera os divisores comuns. Essa é exatamente a invariância que sustenta a versão moderna: \(\gcd(a,b)=\gcd(b,a-qb)\).</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>No algoritmo moderno</h4>
        <article class="timeline-card">
          <time>Compressão aritmética</time>
          <h5>A divisão substitui muitas subtrações</h5>
          <p>Em vez de retirar \(b\) de \(a\) uma vez por etapa, calculamos de uma só vez \(a=qb+r\). O resto \(r\) é o efeito acumulado de \(q\) subtrações, e a próxima chamada usa \((b,r)\).</p>
        </article>
        <article class="timeline-card">
          <time>Notação e máquina</time>
          <h5>O mesmo invariante, outro artefato</h5>
          <p>Pseudocódigo, custo em bits e operadores de resto pertencem a uma linguagem muito posterior. O parentesco não está na aparência das linhas, mas na regra que preserva o conjunto dos divisores comuns enquanto reduz o problema.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> O Livro VII preserva um procedimento de subtração recíproca para encontrar a maior medida comum.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Dizer que executamos “o mesmo algoritmo” significa reconhecer seu núcleo matemático. Não significa atribuir a Euclides a notação modular, a divisão de inteiros implementada em computadores ou a análise moderna de complexidade.</div>
    <ul class="source-links">
      <li><a href="https://mathcs.clarku.edu/~djoyce/java/elements/bookVII/bookVII.html" target="_blank" rel="noopener noreferrer">Euclides, Livro VII, com comentários de David E. Joyce — Clark University</a></li>
      <li><a href="https://mathshistory.st-andrews.ac.uk/Biographies/Euclid/" target="_blank" rel="noopener noreferrer">Euclid of Alexandria — MacTutor History of Mathematics</a></li>
    </ul>`),
  tags: ["história", "Euclides", "algoritmos"],
});
