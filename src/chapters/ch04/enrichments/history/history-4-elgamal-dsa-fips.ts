import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyElgamalDsa: EnrichmentDefinition = Object.freeze({
  id: "history-4-elgamal-dsa-fips",
  layer: "history",
  anchor: "sec-4-3",
  title: "ElGamal, DSA e três décadas de padrão federal",
  kicker: "História · 1985–2023",
  duration: "10 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">DSA não surgiu isolado: ele reorganiza ideias de assinaturas baseadas em logaritmo discreto para produzir componentes menores e virou o centro de um padrão que continuou mudando.</p>
    <div class="timeline">
      <article class="timeline-card"><time>1985</time><h4>ElGamal publica cifra e assinatura</h4><p>O artigo na <em>IEEE Transactions on Information Theory</em> propõe construções baseadas na dificuldade do logaritmo discreto. A assinatura usa um segredo de longa duração e um inteiro aleatório novo a cada documento.</p></article>
      <article class="timeline-card"><time>1991–1994</time><h4>Proposta e publicação do DSS</h4><p>O Digital Signature Algorithm foi proposto pelo governo dos Estados Unidos em 1991; o NIST publicou o FIPS 186 em 19 de maio de 1994. A comunicação institucional da época destaca integridade, identidade do signatário e ausência de confidencialidade.</p></article>
      <article class="timeline-card"><time>2013</time><h4>FIPS 186-4 reúne DSA, RSA e ECDSA</h4><p>Revisões incorporaram outros algoritmos e novos tamanhos e procedimentos. O padrão passou a ser uma família de técnicas de assinatura, não apenas sinônimo do DSA original.</p></article>
      <article class="timeline-card"><time>2023</time><h4>FIPS 186-5 retira DSA da geração</h4><p>A revisão atual especifica RSA, ECDSA e EdDSA; o DSA já não integra os algoritmos para gerar novas assinaturas. O capítulo permanece valioso para entender a álgebra que também ilumina esquemas relacionados.</p></article>
    </div>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1109/TIT.1985.1057074" target="_blank" rel="noopener noreferrer">ElGamal — DOI do artigo original</a></li>
      <li><a href="https://csrc.nist.gov/pubs/fips/186/final" target="_blank" rel="noopener noreferrer">NIST — FIPS 186 de 1994</a></li>
      <li><a href="https://csrc.nist.gov/pubs/fips/186-5/final" target="_blank" rel="noopener noreferrer">NIST — FIPS 186-5 de 2023</a></li>
    </ul>`),
  tags: ["história", "ElGamal", "DSA", "NIST"],
});
