import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingNistPrimalityKeygen: EnrichmentDefinition = Object.freeze({
  id: "reading-3-nist-primalidade-keygen",
  layer: "reading",
  anchor: "sec-3-4",
  title: "Como um padrão transforma “escolha primos” em procedimento",
  kicker: "Roteiro de leitura · NIST",
  duration: "55–90 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Em uma demonstração, basta tomar primos distintos \(p\) e \(q\). Em um sistema, é preciso dizer como gerar candidatos, quantos testes executar, quais tamanhos aceitar e que relações evitar. FIPS 186-5 e SP 800-56B Rev. 2 tornam esses requisitos auditáveis.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">FIPS 186-5</span><span class="reading-level">Apêndice A</span></div>
        <h4>Primos prováveis e demonstráveis</h4>
        <p>Leia primeiro A.1 e o apêndice B referenciado. Monte uma tabela com os caminhos de geração admitidos, as fontes de aleatoriedade, os testes de primalidade e as informações que podem servir como evidência de geração.</p>
        <a href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf" target="_blank" rel="noopener noreferrer">Abrir o PDF oficial de FIPS 186-5</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">SP 800-56B</span><span class="reading-level">Seção 6</span></div>
        <h4>Par de chaves e garantias</h4>
        <p>Procure os requisitos para módulo, expoente público, fatores e validação. Marque quais condições atendem à correção algébrica e quais mitigam classes de ataque ou asseguram força mínima.</p>
        <a href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-56Br2.pdf" target="_blank" rel="noopener noreferrer">Abrir SP 800-56B Rev. 2</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Estado</span><span class="reading-level">Metadados</span></div>
        <h4>Verifique vigência e erratas</h4>
        <p>Antes de citar um padrão, consulte sua página de publicação. Ela registra substituições, notas de planejamento e arquivos corrigidos; um PDF salvo localmente não informa sozinho se continua atual.</p>
        <a href="https://csrc.nist.gov/pubs/sp/800/56/b/r2/final" target="_blank" rel="noopener noreferrer">Consultar a ficha atual de SP 800-56B Rev. 2</a>
      </article>
    </div>
    <h4>Checklist produzido pela leitura</h4>
    <ol>
      <li>Entropia e processo de geração dos candidatos.</li>
      <li>Critério para aceitar primalidade provável ou comprovada.</li>
      <li>Comprimento e relação entre os fatores; cálculo e validação dos expoentes.</li>
      <li>Teste de consistência da chave antes do uso.</li>
    </ol>
    <div class="source-note"><strong>Fato documentado.</strong> FIPS 186-5 foi publicado em 2023; seu Apêndice A trata da geração de primos para RSA. A página do NIST registra SP 800-56B Rev. 2, de 2019, como reafirmada vigente em 6 de janeiro de 2026.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Esses documentos não ensinam apenas “mais passos”. Eles mostram a distância entre existência matemática e geração controlada de uma instância, com requisitos capazes de ser testados por outra equipe.</div>`),
  tags: ["leitura", "NIST", "primalidade", "geração de chaves"],
});
