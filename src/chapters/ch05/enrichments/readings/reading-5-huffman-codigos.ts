import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingHuffman: EnrichmentDefinition = Object.freeze({
  id: "reading-5-huffman-codigos",
  layer: "reading",
  anchor: "sec-5-6-3",
  title: "Huffman: construir uma árvore de redundância mínima",
  kicker: "Roteiro de leitura · artigo de 1952",
  duration: "65–95 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O artigo não parte de bytes ou arquivos. Ele resolve um problema limpo: dado um conjunto finito de mensagens com probabilidades conhecidas, construir um código de prefixo com comprimento médio mínimo.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1952</span><span class="reading-level">Algoritmo</span></div><h4><em>A Method for the Construction of Minimum-Redundancy Codes</em></h4><p>Leia as restrições derivadas e o procedimento binário. Marque por que dois símbolos menos prováveis podem ser postos como irmãos mais profundos e por que sua soma transforma o problema em uma instância menor.</p><a href="https://doi.org/10.1109/JRPROC.1952.273898" target="_blank" rel="noopener noreferrer">Abrir o artigo pelo DOI</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Reconstrução</span><span class="reading-level">Cálculo</span></div><h4>Uma árvore completa à mão</h4><p>Use probabilidades \((0{,}40,0{,}20,0{,}15,0{,}15,0{,}10)\). Registre cada fusão, desenhe a árvore, atribua bits e calcule o comprimento médio. Verifique que nenhum código é prefixo de outro.</p><a href="https://explore.openaire.eu/search/publication?pid=10.1109%2Fjrproc.1952.273898" target="_blank" rel="noopener noreferrer">Consultar metadados e resumo no OpenAIRE</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Compare comprimento médio, entropia da fonte e um código fixo. Explique por que trocar arbitrariamente 0 e 1 em qualquer nó não altera o custo, mas trocar profundidades entre símbolos com probabilidades diferentes pode alterá-lo.</p>`),
  tags: ["leitura", "Huffman", "compressão", "códigos de prefixo"],
});
