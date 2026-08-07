import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyNfsDistributedFactoring: EnrichmentDefinition = Object.freeze({
  id: "history-3-nfs-fatoracao-distribuida",
  layer: "history",
  anchor: "sec-3-7-3",
  title: "NFS: de uma ideia algébrica a campanhas distribuídas",
  kicker: "História · recordes de fatoração",
  duration: "10 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O crivo do corpo de números (NFS) mudou tanto a assíntota da fatoração geral quanto a engenharia dos recordes: relações podem ser procuradas em muitas máquinas, enquanto outras fases exigem memória, rede e coordenação concentradas.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Do caso especial ao algoritmo geral</h4>
        <article class="timeline-card">
          <time>Fim da década de 1980</time>
          <h5>Pollard propõe um crivo algébrico</h5>
          <p>John Pollard concebeu uma forma inicial para números de formato especial. Em vez de procurar suavidade apenas entre inteiros, o método relaciona fatorações em dois lados — um racional e outro em um anel de números algébricos.</p>
        </article>
        <article class="timeline-card">
          <time>1990–1993</time>
          <h5>A forma geral amadurece</h5>
          <p>O trabalho de vários pesquisadores transformou a ideia no GNFS, aplicável sem exigir uma expressão especial para \(n\). O volume <em>The Development of the Number Field Sieve</em> preserva essa transição e os artigos fundadores.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>Fatorar vira um projeto computacional</h4>
        <article class="timeline-card">
          <time>2009–2010</time>
          <h5>RSA-768</h5>
          <p>Uma colaboração internacional fatorou um módulo RSA de 768 bits. A coleta de relações foi amplamente distribuída; filtragem, álgebra linear esparsa e extração das raízes exigiram fases especializadas. O relatório foi publicado em 2010.</p>
        </article>
        <article class="timeline-card">
          <time>2019–2020</time>
          <h5>RSA-240 e RSA-250</h5>
          <p>O mesmo ecossistema algorítmico e de software alcançou 795 bits para RSA-240 e, depois, 829 bits para RSA-250. O relatório detalha seleção de polinômios, crivagem, matrizes e custo de máquina, evitando reduzir o feito a um único “tempo de execução”.</p>
        </article>
      </section>
    </div>
    <div class="watch-out-inline"><strong>Escala não é só CPU.</strong> Comparar recordes exige distinguir horas de núcleo, tempo de calendário, hardware, software, armazenamento e custo da álgebra linear. Um total distribuído não equivale ao tempo que uma máquina comum levaria.</div>
    <div class="source-note"><strong>Fato documentado.</strong> Os relatórios de RSA-768 e RSA-240/RSA-250 descrevem campanhas GNFS colaborativas e publicam fatores verificáveis. O repositório oficial do CADO-NFS, mantido no Inria, disponibiliza a implementação usada nessa linhagem de experimentos.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Recordes de fatoração são experimentos científicos: além de confirmar a vulnerabilidade de um tamanho, eles testam modelos de custo, novas heurísticas e a capacidade de coordenar estágios muito diferentes.</div>
    <ul class="source-links">
      <li><a href="https://link.springer.com/book/10.1007/BFb0091534" target="_blank" rel="noopener noreferrer"><em>The Development of the Number Field Sieve</em> (1993)</a></li>
      <li><a href="https://ir.cwi.nl/pub/16870" target="_blank" rel="noopener noreferrer">Relatório institucional da fatoração de RSA-768 — CWI</a></li>
      <li><a href="https://arxiv.org/abs/2006.06197" target="_blank" rel="noopener noreferrer">Relatório de RSA-240 e RSA-250</a></li>
      <li><a href="https://gitlab.inria.fr/cado-nfs/cado-nfs" target="_blank" rel="noopener noreferrer">CADO-NFS — repositório oficial no Inria</a></li>
    </ul>`),
  tags: ["história", "NFS", "RSA-768", "fatoração distribuída"],
});
