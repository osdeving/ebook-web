import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingCryptographicStandards: EnrichmentDefinition = Object.freeze({
  id: "reading-1-padroes-criptograficos",
  layer: "reading",
  anchor: "sec-1-7-3",
  title: "Do AES à geração de bits aleatórios",
  kicker: "Para saber mais · padrões atuais",
  duration: "45–90 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O texto do capítulo oferece os conceitos; estas publicações mostram como parâmetros e componentes são especificados para uso técnico. Leia-as como normas de escopo definido, não como tutoriais de implementação improvisada.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Padrão NIST</span><span class="reading-level">Intermediário</span></div>
        <h4>FIPS 197 — Advanced Encryption Standard</h4>
        <p>Confirme diretamente o tamanho do bloco, os tamanhos de chave e a transformação do AES. É um bom exercício de separar os parâmetros fixos do algoritmo das escolhas feitas pelo protocolo que o utiliza.</p>
        <a href="https://csrc.nist.gov/pubs/fips/197/final" target="_blank" rel="noopener noreferrer">Consultar o FIPS 197</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Recomendação NIST</span><span class="reading-level">Avançado</span></div>
        <h4>SP 800-57 Part 1 Rev. 5</h4>
        <p>Use as tabelas de força de segurança para entender por que “bits de chave” e “bits de segurança” não são automaticamente iguais e como períodos de proteção afetam escolhas.</p>
        <a href="https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final" target="_blank" rel="noopener noreferrer">Abrir a recomendação de gestão de chaves</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Padrão de aleatoriedade</span><span class="reading-level">Avançado</span></div>
        <h4>SP 800-90A Rev. 1 e SP 800-90C</h4>
        <p>A Parte A especifica geradores determinísticos; a Parte C os situa em construções completas de geração de bits aleatórios. Leia para mapear fonte de entropia, estado interno, instanciação e nova semeadura.</p>
        <a href="https://csrc.nist.gov/pubs/sp/800/90/a/r1/final" target="_blank" rel="noopener noreferrer">Consultar a SP 800-90A Rev. 1</a>
        <a href="https://csrc.nist.gov/pubs/sp/800/90/c/final" target="_blank" rel="noopener noreferrer">Consultar a SP 800-90C</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Padrão Internet</span><span class="reading-level">Intermediário</span></div>
        <h4>RFC 4086 — Randomness Requirements for Security</h4>
        <p>O RFC discute fontes, mistura e falhas recorrentes. Use-o para analisar por que relógio, identificador de processo ou saída estatisticamente “bonita” podem não oferecer surpresa contra um atacante.</p>
        <a href="https://www.rfc-editor.org/info/rfc4086/" target="_blank" rel="noopener noreferrer">Abrir o RFC 4086</a>
      </article>
    </div>
    <div class="watch-out-inline"><strong>Atualidade.</strong> Requisitos normativos podem mudar. Confira sempre o status e a data da publicação antes de usá-la para uma decisão de engenharia.</div>`),
  tags: ["leituras", "NIST", "AES", "aleatoriedade", "RFC"],
});
