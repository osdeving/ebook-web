import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingGchqPublicKeyHistory: EnrichmentDefinition = Object.freeze({
  id: "reading-3-gchq",
  layer: "reading",
  anchor: "sec-3-2",
  title: "Arquivo institucional: a cronologia britânica da chave pública",
  kicker: "Roteiro de leitura · GCHQ",
  duration: "25–40 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Uma fonte institucional sobre trabalho antes secreto exige leitura em duas camadas: o que o órgão afirma documentalmente e como essa narrativa se relaciona com o registro científico público.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Perfil</span><span class="reading-level">10 min</span></div>
        <h4>James Ellis</h4>
        <p>Extraia quatro datas: entrada no GCHQ, concepção da “cifração não secreta”, descoberta matemática de Cocks e divulgação pública. Repare que a página distingue conceber a arquitetura de produzir uma realização concreta.</p>
        <a href="https://www.gchq.gov.uk/person/james-ellis" target="_blank" rel="noopener noreferrer">Ler o perfil oficial de James Ellis</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Contexto</span><span class="reading-level">10 min</span></div>
        <h4>Pessoas do passado do GCHQ</h4>
        <p>Localize Ellis no panorama institucional. Pergunte que critérios determinam quem recebe um perfil e quais documentos primários desclassificados seriam necessários para confirmar detalhes técnicos além da síntese biográfica.</p>
        <a href="https://www.gchq.gov.uk/section/history/people-from-our-past" target="_blank" rel="noopener noreferrer">Abrir a coleção histórica do GCHQ</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Contraponto</span><span class="reading-level">10 min</span></div>
        <h4>Compare com o artigo público</h4>
        <p>Leia apenas introdução e bibliografia do artigo RSA de 1978. Compare as redes de citação possíveis em uma descoberta aberta com as de um memorando classificado.</p>
        <a href="https://people.csail.mit.edu/rivest/pubs/RSA78.pdf" target="_blank" rel="noopener noreferrer">Abrir o artigo RSA</a>
      </article>
    </div>
    <h4>Perguntas de crítica documental</h4>
    <ol>
      <li>Que afirmações a página do GCHQ sustenta diretamente e quais detalhes técnicos ela apenas resume?</li>
      <li>Como o sigilo altera revisão por pares, terminologia, prioridade pública e impacto tecnológico?</li>
      <li>Por que “descoberta anterior” não implica que a equipe do MIT conhecesse o trabalho britânico?</li>
    </ol>
    <div class="source-note"><strong>Fato documentado.</strong> O próprio GCHQ informa que Ellis concebeu a ideia, Cocks desenvolveu a construção em 1973, Williamson trabalhou em troca de chaves e o feito só foi anunciado publicamente em 1997.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A fonte é indispensável para a cronologia, mas continua sendo uma narrativa institucional retrospectiva. Sua melhor leitura é em conjunto com publicações abertas e, quando disponíveis, documentos desclassificados.</div>`),
  tags: ["leitura", "GCHQ", "James Ellis", "história da criptografia"],
});
