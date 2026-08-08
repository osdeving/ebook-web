import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyCollisions: EnrichmentDefinition = Object.freeze({
  id: "history-5-colisoes-engenharia",
  layer: "history",
  anchor: "sec-5-4-2",
  title: "Do limite do aniversário à engenharia de colisões",
  kicker: "História · 1994–hoje",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A ordem de grandeza \(\sqrt{N}\) deixa de ser uma curiosidade quando o espaço de saídas tem tamanho \(N\): ela passa a orientar tamanhos de resumo, memória, paralelismo e vida útil de sistemas criptográficos.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Transformar a estimativa em ataque</h4>
        <article class="timeline-card"><time>1994</time><h5>van Oorschot e Wiener paralelizam a busca</h5><p>O trabalho sobre busca paralela de colisões mostra como organizar muitas caminhadas pseudoaleatórias e registrar apenas pontos distinguidos. A raiz quadrada continua governando o número de passos, mas a engenharia distribui o trabalho e reduz o armazenamento por processador.</p></article>
        <article class="timeline-card"><span class="timeline-label">Trade-off</span><h5>Tempo, memória e comunicação se separam</h5><p>Contar avaliações da função é só o começo. Em uma implementação paralela importam também coordenação, largura de banda, detecção de ciclos e a chance de duas caminhadas se fundirem sem produzir a colisão desejada.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>Transformar o ataque em requisito</h4>
        <article class="timeline-card"><span class="timeline-label">Padrões</span><h5>“n bits” não significam n bits contra colisões</h5><p>Para uma função ideal com saída de \(n\) bits, o limite de aniversário sugere cerca de \(2^{n/2}\) avaliações para colisões genéricas. Padrões modernos separam resistência a colisão de resistência à pré-imagem justamente porque os custos genéricos são diferentes.</p></article>
        <article class="timeline-card"><span class="timeline-label">Projeto</span><h5>O modelo ideal é uma linha de base</h5><p>O teorema probabilístico descreve funções com comportamento aleatório. Uma função concreta pode ter estrutura explorável e ataques melhores; por isso, o limite do aniversário não certifica um algoritmo, apenas fornece a referência que ele precisa alcançar.</p></article>
      </section>
    </div>
    <ul class="source-links">
      <li><a href="https://www.scs.carleton.ca/~paulv/papers/acmccs94.pdf" target="_blank" rel="noopener noreferrer">van Oorschot e Wiener — artigo sobre busca paralela de colisões</a></li>
      <li><a href="https://csrc.nist.gov/glossary/term/Collision_resistance" target="_blank" rel="noopener noreferrer">Definição institucional de resistência a colisão — NIST</a></li>
      <li><a href="https://doi.org/10.6028/NIST.FIPS.180-4" target="_blank" rel="noopener noreferrer">FIPS 180-4 — padrão de funções hash do NIST</a></li>
    </ul>`),
  tags: ["história", "colisões", "paradoxo do aniversário", "hash"],
});
