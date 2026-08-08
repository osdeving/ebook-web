import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingShannon: EnrichmentDefinition = Object.freeze({
  id: "reading-5-shannon-dois-artigos",
  layer: "reading",
  anchor: "sec-5-6-1",
  title: "Dois Shannon: canal e sistema de sigilo",
  kicker: "Roteiro de leitura · 1948–1949",
  duration: "90–130 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Leia trechos selecionados dos dois artigos e acompanhe a migração das mesmas ferramentas — probabilidades, logaritmos, entropia e redundância — entre comunicação e criptografia.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1948</span><span class="reading-level">Informação</span></div><h4><em>A Mathematical Theory of Communication</em></h4><p>Leia a introdução, a derivação das propriedades da medida de informação e a discussão de fontes discretas. Para cada propriedade, dê um exemplo binário. Depois localize a diferença entre entropia máxima e entropia real de uma fonte.</p><a href="https://www.nokia.com/bell-labs/claude-shannon/assets/images/discoveries/1948-04-21-a-mathematical-theory-of-communication-parts-I-and%E2%80%93carousel-01.pdf" target="_blank" rel="noopener noreferrer">Abrir o artigo integral no arquivo Nokia Bell Labs</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1949</span><span class="reading-level">Criptografia</span></div><h4><em>Communication Theory of Secrecy Systems</em></h4><p>Leia a introdução e as partes sobre sigilo perfeito, equivocation e distância de unicidade. Separe com cores as afirmações probabilísticas, algébricas e operacionais. Onde o texto usa redundância da linguagem?</p><a href="https://doi.org/10.1002/j.1538-7305.1949.tb00928.x" target="_blank" rel="noopener noreferrer">Abrir o artigo no Bell System Technical Journal</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Arquivo</span><span class="reading-level">Contexto</span></div><h4>Shannon na IEEE Information Theory Society</h4><p>Use a página institucional para montar uma cronologia mínima. Trate biografia como contexto, não como substituto para as definições nos artigos.</p><a href="https://www.itsoc.org/about/shannon" target="_blank" rel="noopener noreferrer">Consultar o arquivo institucional</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Construa um mapa com quatro nós — incerteza, redundância, canal e criptograma — e conecte cada aresta a uma seção ou página dos artigos. Inclua uma frase distinguindo sigilo perfeito de dificuldade computacional.</p>`),
  tags: ["leitura", "Shannon", "teoria da informação", "sigilo perfeito"],
});
