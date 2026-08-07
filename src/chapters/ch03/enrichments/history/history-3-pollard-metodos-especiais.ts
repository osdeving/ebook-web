import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyPollardSpecialMethods: EnrichmentDefinition = Object.freeze({
  id: "history-3-pollard-metodos-especiais",
  layer: "history",
  anchor: "sec-3-5",
  title: "Pollard e a arte de procurar fatores vulneráveis",
  kicker: "História · fatoração especial",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Nem todo algoritmo de fatoração mede dificuldade apenas pelo tamanho de \(n\). Os métodos de John Pollard mostraram como explorar propriedades do fator escondido — mesmo sem conhecê-lo.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Duas ideias de Pollard</h4>
        <article class="timeline-card">
          <time>1974</time>
          <h5>O método \(p-1\)</h5>
          <p>Se \(p\mid n\) e \(p-1\) é produto de potências de primos pequenos, pode-se escolher um expoente \(M\) múltiplo de \(p-1\). Então \(a^M\equiv1\pmod p\), e \(\gcd(a^M-1,n)\) pode revelar \(p\). O algoritmo não precisa saber antecipadamente qual é o fator.</p>
        </article>
        <article class="timeline-card">
          <time>1975</time>
          <h5>O método rho</h5>
          <p>Uma iteração pseudoaleatória módulo \(n\) também ocorre módulo de cada fator \(p\). Colisões aparecem após cerca de \(\sqrt p\) passos pelo paradoxo do aniversário; um mdc converte a colisão invisível módulo \(p\) em fator visível de \(n\).</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>Uma família de vulnerabilidades</h4>
        <article class="timeline-card">
          <time>1987</time>
          <h5>Lenstra troca um grupo por muitas curvas</h5>
          <p>O método de curvas elípticas substitui o grupo multiplicativo de ordem \(p-1\) por grupos de pontos cujas ordens variam com a curva escolhida. Mesmo se \(p-1\) não for suave, alguma curva pode ter ordem suave e expor \(p\).</p>
        </article>
        <article class="timeline-card">
          <time>Consequência para chaves</time>
          <h5>O menor fator pode dominar o risco</h5>
          <p>Rho e ECM têm custo ligado principalmente ao tamanho do fator procurado, não só ao número total de algarismos de \(n\). Um módulo enorme com um fator relativamente pequeno continua sendo uma escolha ruim.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> Pollard publicou o método \(p-1\) em 1974 e o método rho em 1975; Lenstra publicou o método de curvas elípticas em 1987, descrevendo-o como uma variação que troca a ordem fixa \(p-1\) por ordens de curvas.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Chamamos esses métodos de “especiais” porque sua vantagem depende da anatomia de um fator. Eles não invalidam a análise dos métodos gerais; mostram por que a geração de chaves também precisa evitar instâncias acidentalmente fáceis.</div>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1017/S0305004100049252" target="_blank" rel="noopener noreferrer">J. M. Pollard, <em>Theorems on factorization and primality testing</em> (1974)</a></li>
      <li><a href="https://doi.org/10.1007/BF01933667" target="_blank" rel="noopener noreferrer">J. M. Pollard, <em>A Monte Carlo method for factorization</em> (1975)</a></li>
      <li><a href="https://annals.math.princeton.edu/1987/126-3/p09" target="_blank" rel="noopener noreferrer">H. W. Lenstra Jr., <em>Factoring integers with elliptic curves</em> (1987)</a></li>
    </ul>`),
  tags: ["história", "Pollard", "fatoração", "ECM"],
});
