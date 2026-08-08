import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingVigenereKasiski: EnrichmentDefinition = Object.freeze({
  id: "reading-5-vigenere-kasiski-fontes",
  layer: "reading",
  anchor: "sec-5-2-1",
  title: "Vigenère e Kasiski nos fac-símiles originais",
  kicker: "Roteiro de leitura · fontes primárias",
  duration: "55–85 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A meta não é ler dois livros inteiros em francês e alemão antigos. Use índices, tabelas, exemplos e diagramas para distinguir o artefato histórico da versão condensada apresentada no capítulo.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1586</span><span class="reading-level">Exploratória</span></div><h4>Vigenère, <em>Traicté des chiffres</em></h4><p>Percorra o registro e o fac-símile da Universidade de Liège. Localize tabelas de alfabetos e observe quantos procedimentos o tratado reúne. Anote três diferenças entre o livro e a cifra periódica definida na Seção 5.2.</p><a href="https://donum.uliege.be/handle/2268.1/9711" target="_blank" rel="noopener noreferrer">Abrir a digitalização institucional</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1863</span><span class="reading-level">Técnica</span></div><h4>Kasiski, <em>Die Geheimschriften</em></h4><p>Busque as páginas com sequências repetidas e decomposição de distâncias. Reconstrua um único exemplo: repetição observada, distância, fatores candidatos e hipótese sobre o comprimento da chave.</p><a href="https://books.google.de/books?hl=de&amp;id=I1PgeY9uJ08C" target="_blank" rel="noopener noreferrer">Abrir o exemplar da Biblioteca Nacional Austríaca</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Catálogo</span><span class="reading-level">Bibliográfica</span></div><h4>Conferir a identidade da obra</h4><p>Use o registro da SLUB Dresden para conferir autor, título, editora, local e data. Essa etapa simples evita citar uma reimpressão moderna como se fosse o exemplar de 1863.</p><a href="https://katalog.slub-dresden.de/id/0-1476519498" target="_blank" rel="noopener noreferrer">Consultar o catálogo da SLUB</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Entregue uma página com duas colunas, “construção” e “ataque”. Em cada uma, inclua uma imagem ou número de página do fac-símile, uma paráfrase sua e a ideia matemática correspondente no capítulo. Não trate uma repetição isolada como prova do período.</p>`),
  tags: ["leitura", "Vigenère", "Kasiski", "fontes primárias"],
});
