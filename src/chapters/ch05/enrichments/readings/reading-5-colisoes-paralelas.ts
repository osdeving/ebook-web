import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingCollisions: EnrichmentDefinition = Object.freeze({
  id: "reading-5-colisoes-paralelas",
  layer: "reading",
  anchor: "sec-5-4-2",
  title: "Colisões: do teorema ao orçamento de segurança",
  kicker: "Roteiro de leitura · artigo e padrão",
  duration: "60–90 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Leia em duas escalas: primeiro a busca genérica em uma função ideal; depois as propriedades que um padrão exige de funções concretas.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1994</span><span class="reading-level">Algorítmica</span></div><h4>van Oorschot–Wiener</h4><p>Leia a introdução, a ideia de pontos distinguidos e a análise de paralelismo. Desenhe duas caminhadas que se fundem. Quais estados são armazenados? Que trabalho pode ser distribuído? Onde aparece a ordem \(\sqrt{N}\)?</p><a href="https://www.scs.carleton.ca/~paulv/papers/acmccs94.pdf" target="_blank" rel="noopener noreferrer">Abrir manuscrito na Carleton University</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">NIST</span><span class="reading-level">Terminologia</span></div><h4>Resistência a colisão</h4><p>Leia a definição do glossário e siga a referência normativa. Compare “encontrar quaisquer \(x\ne y\) com o mesmo resumo” com pré-imagem e segunda pré-imagem; não misture seus custos genéricos.</p><a href="https://csrc.nist.gov/glossary/term/Collision_resistance" target="_blank" rel="noopener noreferrer">Abrir o glossário do NIST</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">FIPS 180-4</span><span class="reading-level">Padrão</span></div><h4>Comprimentos de saída</h4><p>Localize a família de algoritmos e seus tamanhos de resumo. Para cada tamanho \(n\), registre a linha de base genérica de colisão \(2^{n/2}\) e explique por que isso não é uma prova de segurança do algoritmo concreto.</p><a href="https://doi.org/10.6028/NIST.FIPS.180-4" target="_blank" rel="noopener noreferrer">Abrir FIPS 180-4</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Escreva um memorando de escolha de parâmetros com três colunas: objetivo, ataque genérico e custo esperado. Inclua colisão, pré-imagem e memória da busca; marque explicitamente toda hipótese de “função ideal”.</p>`),
  tags: ["leitura", "colisões", "hash", "NIST"],
});
