import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyTwoRsaDiscoveries: EnrichmentDefinition = Object.freeze({
  id: "history-3-duas-descobertas-rsa",
  layer: "history",
  anchor: "sec-3-2",
  title: "Duas descobertas do RSA — e duas cronologias",
  kicker: "História · chave pública",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A origem do RSA não cabe em uma única data. Uma cronologia acompanha trabalho sigiloso no Reino Unido; outra, a publicação aberta que tornou o método examinável, citável e reutilizável.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>No CESG/GCHQ</h4>
        <article class="timeline-card">
          <time>1969–1974</time>
          <h5>Ellis formula o problema; Cocks encontra uma construção</h5>
          <p>James Ellis concebeu a possibilidade de “cifração não secreta”. Clifford Cocks obteve em 1973 uma construção baseada em exponenciação modular e fatoração, matematicamente equivalente ao núcleo depois conhecido como RSA. Malcolm Williamson desenvolveu depois uma forma de acordo de chaves.</p>
        </article>
        <article class="timeline-card">
          <time>Até 1997</time>
          <h5>Conhecimento classificado</h5>
          <p>Esses resultados permaneceram sob sigilo governamental. Por isso não circularam como artigos públicos, não entraram na literatura acadêmica da década de 1970 e não puderam orientar a implementação civil naquele momento.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>Na comunidade aberta</h4>
        <article class="timeline-card">
          <time>1976–1977</time>
          <h5>Um problema público leva a uma solução pública</h5>
          <p>O artigo de Diffie e Hellman tornou explícita a busca por criptografia de chave pública. No MIT, Ronald Rivest, Adi Shamir e Leonard Adleman procuraram uma função de mão única com alçapão e chegaram ao esquema apresentado em 1977.</p>
        </article>
        <article class="timeline-card">
          <time>Fevereiro de 1978</time>
          <h5>O artigo na <em>Communications of the ACM</em></h5>
          <p>A publicação descreveu geração de chaves, cifração, decifração, assinaturas e a implementação por exponenciação repetida. A circulação aberta permitiu crítica, padronização e uma longa sequência de resultados sobre ataques e modelos de segurança.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> O GCHQ registra Ellis, Cocks e Williamson como autores de trabalho classificado anterior; o artigo de Rivest, Shamir e Adleman foi publicado abertamente em 1978. “Anterior” aqui qualifica a data do trabalho, não uma transmissão entre as equipes: a descoberta do MIT foi independente.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Há duas noções legítimas de prioridade: conceber primeiro e estabelecer primeiro um resultado no registro público. Para compreender o impacto científico do RSA, as duas importam, mas não são intercambiáveis.</div>
    <ul class="source-links">
      <li><a href="https://www.gchq.gov.uk/person/james-ellis" target="_blank" rel="noopener noreferrer">GCHQ — perfil institucional de James Ellis</a></li>
      <li><a href="https://www.gchq.gov.uk/information/shaun_wylie" target="_blank" rel="noopener noreferrer">GCHQ — perfil de Shaun Wylie, com a data das propostas de Ellis</a></li>
      <li><a href="https://people.csail.mit.edu/rivest/pubs/RSA78.pdf" target="_blank" rel="noopener noreferrer">Rivest, Shamir e Adleman — artigo original (MIT)</a></li>
    </ul>`),
  tags: ["história", "RSA", "GCHQ", "chave pública"],
});
