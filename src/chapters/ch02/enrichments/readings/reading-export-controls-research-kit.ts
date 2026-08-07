import { defineEnrichment, readingCard } from "../shared";

export const readingExportControlsResearchKit = defineEnrichment({
      id: "reading-export-controls-research-kit",
      layer: "reading",
      anchor: "exercicio-2-2",
      kicker: "Roteiro de pesquisa",
      title: "Como investigar o exercício sobre controles de exportação",
      meta: "Fontes oficiais atuais · verificado em agosto de 2026",
      html: `<p class="supplement-lead">Este exercício mistura história, política pública e direito vigente. Em vez de oferecer uma resposta congelada, o roteiro abaixo separa as perguntas e aponta para fontes governamentais que podem ser verificadas na data da pesquisa.</p>
        <ol class="research-steps">
          <li><strong>Delimite o período.</strong> Construa uma coluna para o início dos anos 1990, outra para a mudança de 1996 e uma terceira para as regras atuais.</li>
          <li><strong>Separe regimes.</strong> Não trate ITAR e EAR como sinônimos; investigue quais itens permanecem sob jurisdição militar e quais passaram ao controle comercial.</li>
          <li><strong>Defina os verbos.</strong> Consulte as definições oficiais de exportação, reexportação, transferência e publicação antes de analisar sala de aula, código-fonte ou download.</li>
          <li><strong>Registre a data.</strong> Normas e orientações mudam. Anote a data de acesso e a versão de cada página.</li>
          <li><strong>Argumente com ressalvas.</strong> Diferencie a descrição histórica do capítulo de uma opinião jurídica sobre um caso concreto.</li>
        </ol>
        <div class="reading-grid">
          ${readingCard({ badge: "Orientação oficial", title: "BIS — Encryption Controls", why: "Apresenta o fluxo atual para determinar jurisdição, classificação, exceções e relatórios de itens com criptografia.", href: "https://www.bis.gov/learn-support/encryption-controls?id=1160", source: "Bureau of Industry and Security", level: "Intermediário" })}
          ${readingCard({ badge: "Regulamento", title: "EAR Part 734", why: "Contém o escopo e as definições regulatórias, inclusive a seção dedicada à exportação de código-fonte e código-objeto criptográfico.", href: "https://www.bis.gov/regulations/ear/734", source: "texto oficial do EAR", level: "Avançado" })}
          ${readingCard({ badge: "Orientação oficial", title: "Itens de criptografia não sujeitos ao EAR", why: "Explica condições associadas a material publicamente disponível, código-fonte aberto e software de mercado de massa.", href: "https://www.bis.gov/learn-support/encryption-controls/encryption-items-not-subject-to-ear", source: "BIS", level: "Avançado" })}
        </div>
        <div class="watch-out-inline"><strong>Nota.</strong> Este roteiro é material didático, não aconselhamento jurídico. A resposta deve citar as regras vigentes na data da pesquisa e não presumir que a descrição histórica do PDF continua sendo a classificação atual.</div>`
    });
