import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingPollardMethods: EnrichmentDefinition = Object.freeze({
  id: "reading-3-pollard",
  layer: "reading",
  anchor: "sec-3-5",
  title: "Pollard em três movimentos: p − 1, rho e ECM",
  kicker: "Roteiro de leitura · fatoração especial",
  duration: "75–120 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Os textos originais são compactos e recompensam uma leitura com lápis. Em cada método, procure a propriedade do fator \(p\) que faz o mdc deixar de ser trivial.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">1974</span><span class="reading-level">Intermediário</span></div>
        <h4>Pollard \(p-1\)</h4>
        <p>Reconstrua um expoente \(M=\operatorname{mmc}(1,2,\ldots,B)\). Se \(p-1\mid M\), use Fermat para justificar \(p\mid a^M-1\). Em seguida explique por que \(\gcd(a^M-1,n)\) pode ser \(1\), \(p\) ou \(n\).</p>
        <a href="https://doi.org/10.1017/S0305004100049252" target="_blank" rel="noopener noreferrer">Abrir o artigo no Cambridge Philosophical Society</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">1975</span><span class="reading-level">Intermediário</span></div>
        <h4>Pollard rho</h4>
        <p>Leia as equações (1)–(4) do original. Simule \(x\mapsto x^2+1\pmod n\) com duas velocidades. O ciclo observado módulo \(n\) não é o objeto central: importa uma colisão módulo do fator desconhecido.</p>
        <a href="https://pages.cs.wisc.edu/~cs812-1/pollardrho.pdf" target="_blank" rel="noopener noreferrer">Abrir uma cópia acadêmica do artigo original</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">1987</span><span class="reading-level">Avançado</span></div>
        <h4>Lenstra ECM</h4>
        <p>Leia introdução e seção 2. Anote a analogia com \(p-1\): qual grupo é usado, qual ordem precisa ser suave e por que variar a curva cria novas chances sem variar o fator \(p\)?</p>
        <a href="https://annals.math.princeton.edu/1987/126-3/p09" target="_blank" rel="noopener noreferrer">Abrir o artigo no Annals of Mathematics</a>
      </article>
    </div>
    <h4>Experimento de leitura</h4>
    <p>Escolha dois semiprimos de tamanho parecido: um com fator \(p\) tal que \(p-1\) seja \(B\)-suave, outro sem essa propriedade. Antes de executar qualquer código, preveja qual método deve separar os casos e qual depende sobretudo do tamanho de \(p\).</p>
    <div class="source-note"><strong>Fato documentado.</strong> As publicações originais datam de 1974 (\(p-1\)), 1975 (rho) e 1987 (ECM). O artigo de Lenstra explicita a substituição do grupo multiplicativo por grupos de curvas elípticas.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A sequência ensina a procurar “estrutura explorável” antes de recorrer a um método geral caro. Também mostra por que o tamanho total do módulo é uma medida incompleta da dificuldade de fatoração.</div>`),
  tags: ["leitura", "Pollard", "rho", "ECM"],
});
