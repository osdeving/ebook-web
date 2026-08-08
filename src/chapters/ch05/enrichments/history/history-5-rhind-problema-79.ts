import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyRhindProblem79: EnrichmentDefinition = Object.freeze({
  id: "history-5-rhind-problema-79",
  layer: "history",
  anchor: "sec-5-1-3",
  title: "Problema 79 do Papiro de Rhind: potências de sete em uma escola de escribas",
  kicker: "História · c. 1550 a.C.",
  duration: "11 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Muito antes da notação de expoentes e da fórmula moderna da soma geométrica, um exercício egípcio organizava cinco quantidades sucessivas multiplicadas por sete.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>O objeto material</h4>
        <article class="timeline-card"><span class="timeline-label">c. 1550 a.C.</span><h5>Ahmose copia uma coleção de problemas</h5><p>O Papiro Matemático de Rhind, hoje dividido em seções no British Museum, é descrito pelo museu como provável texto de ensino para escribas. Reúne 84 problemas, tabelas e procedimentos envolvendo frações, áreas, volumes e operações.</p></article>
        <article class="timeline-card"><span class="timeline-label">1858–1865</span><h5>Rhind adquire; o museu incorpora</h5><p>Alexander Henry Rhind adquiriu o papiro em Tebas por volta de 1858, segundo o registro curatorial, e o British Museum o comprou em 1865. Fragmentos que ajudam a preencher uma lacuna foram identificados depois em Nova York.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>O problema combinatório</h4>
        <article class="timeline-card"><span class="timeline-label">Problema 79</span><h5>Casas, gatos, ratos, espelta e hekat</h5><p>A tradução de Chace lista 7 casas, 49 gatos, 343 ratos, 2401 unidades de espelta e 16807 hekat. São cinco potências sucessivas de sete, somadas para produzir 19607.</p></article>
        <article class="timeline-card"><span class="timeline-label">Leitura moderna</span><h5>Uma progressão, não ainda o teorema binomial</h5><p>Hoje reconhecemos \(7+7^2+7^3+7^4+7^5\) como soma geométrica. Isso não autoriza atribuir ao escriba nossa notação ou uma fórmula geral: a fonte preserva um procedimento numérico concreto, e a generalização é nossa lente.</p></article>
      </section>
    </div>
    <p class="source-note"><strong>Princípio historiográfico.</strong> Distinguir “o texto calcula este caso” de “o autor conhecia nosso teorema geral” evita transformar semelhança matemática em afirmação histórica sem evidência.</p>
    <ul class="source-links">
      <li><a href="https://www.britishmuseum.org/collection/object/Y_EA10057" target="_blank" rel="noopener noreferrer">Papiro Matemático de Rhind, EA10057 — British Museum</a></li>
      <li><a href="https://en.wikisource.org/wiki/Page:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf/128" target="_blank" rel="noopener noreferrer">Problema 79 na edição de Chace (1927)</a></li>
      <li><a href="https://en.wikisource.org/wiki/File:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf" target="_blank" rel="noopener noreferrer">Fac-símile, tradução e comentário completos — domínio público</a></li>
    </ul>`),
  tags: ["história", "combinatória", "Papiro de Rhind", "progressão geométrica"],
});
