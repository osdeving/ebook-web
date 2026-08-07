import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingFips: EnrichmentDefinition = Object.freeze({
  id: "reading-4-fips-186-evolucao",
  layer: "reading",
  anchor: "sec-4-3",
  title: "FIPS 186: leia a mudança entre 1994 e 2023",
  kicker: "Roteiro de leitura · NIST",
  duration: "45–70 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Em vez de tratar “DSA” e “DSS” como sinônimos eternos, compare a primeira edição e a revisão vigente.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Arquivo</span><span class="reading-level">1994</span></div><h4>FIPS 186 original</h4><p>Leia objetivo, aplicações e parâmetros do DSA. Registre tamanhos, hash associado e exigências sobre o segredo efêmero.</p><a href="https://csrc.nist.gov/pubs/fips/186/final" target="_blank" rel="noopener noreferrer">Abrir página histórica do NIST</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Vigente</span><span class="reading-level">2023</span></div><h4>FIPS 186-5</h4><p>Leia o resumo de mudanças e o sumário. Liste os algoritmos especificados para geração atual e descubra onde o documento trata assinaturas DSA legadas.</p><a href="https://csrc.nist.gov/pubs/fips/186-5/final" target="_blank" rel="noopener noreferrer">Abrir FIPS 186-5 e errata</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Contexto</span><span class="reading-level">Institucional</span></div><h4>Anúncio de 20 de maio de 1994</h4><p>Observe como o NIST explicava ao público a diferença entre assinatura e confidencialidade no lançamento do padrão.</p><a href="https://www.nist.gov/news-events/news/1994/05/nist-announces-digital-signature-standard-computer-security" target="_blank" rel="noopener noreferrer">Ler anúncio do NIST</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Escreva uma nota de migração curta: “um sistema que gera DSA hoje deve…; assinaturas antigas devem…”. Apoie cada frase em uma seção do padrão, sem extrapolar para requisitos jurídicos.</p>`),
  tags: ["leitura", "DSA", "DSS", "FIPS 186-5", "NIST"],
});
