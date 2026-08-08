import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyPollardRho: EnrichmentDefinition = Object.freeze({
  id: "history-5-pollard-rho",
  layer: "history",
  anchor: "sec-5-5",
  title: "Por que a letra grega rô batizou o método de Pollard",
  kicker: "História · 1975–1978",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O nome “rô” não é uma sigla. Ele descreve o desenho de uma órbita em um conjunto finito: uma cauda seguida por um ciclo, como a letra grega \(\rho\).</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Primeira aplicação</h4>
        <article class="timeline-card"><time>1975</time><h5>Fatoração com memória pequena</h5><p>J. M. Pollard publicou um método Monte Carlo para encontrar fatores. Iterar uma função módulo o inteiro produz uma sequência que acaba repetindo; comparar pontos da órbita permite converter uma coincidência módulo de um fator em um máximo divisor comum não trivial.</p></article>
        <article class="timeline-card"><span class="timeline-label">Forma</span><h5>Cauda mais ciclo</h5><p>Qualquer função em um conjunto finito gera, a partir de um ponto inicial, uma sequência eventualmente periódica. O diagrama tem uma haste e um laço. A imagem explica o nome e antecipa por que algoritmos de detecção de ciclo podem substituir uma grande tabela.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>Transferência da ideia</h4>
        <article class="timeline-card"><time>1978</time><h5>Rô chega aos logaritmos discretos</h5><p>Pollard adaptou caminhadas pseudoaleatórias à computação de índices módulo \(p\). Em vez de guardar todos os elementos vistos, acompanha estados com representações algébricas conhecidas; uma colisão fornece uma congruência para o logaritmo.</p></article>
        <article class="timeline-card"><span class="timeline-label">Legado</span><h5>A memória vira parte da análise</h5><p>O método evidencia uma dimensão que a notação de tempo pode esconder. Dois algoritmos com cerca de \(\sqrt{N}\) passos podem ter perfis muito diferentes se um exige uma tabela de tamanho \(\sqrt{N}\) e o outro usa apenas alguns estados.</p></article>
      </section>
    </div>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1007/BF01933667" target="_blank" rel="noopener noreferrer">Pollard — método Monte Carlo para fatoração (1975)</a></li>
      <li><a href="https://doi.org/10.1090/S0025-5718-1978-0491431-9" target="_blank" rel="noopener noreferrer">Pollard — métodos Monte Carlo para índices módulo p (1978)</a></li>
    </ul>`),
  tags: ["história", "Pollard", "rô", "detecção de ciclos"],
});
