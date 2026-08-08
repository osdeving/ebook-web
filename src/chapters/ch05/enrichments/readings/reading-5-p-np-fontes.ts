import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingPNP: EnrichmentDefinition = Object.freeze({
  id: "reading-5-p-np-fontes",
  layer: "reading",
  anchor: "sec-5-7",
  title: "P, NP e reduções nas fontes fundadoras",
  kicker: "Roteiro de leitura · Cook, Karp e Clay",
  duration: "100–150 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Não tente dominar todas as provas em uma leitura. Siga uma única ideia — transformar instâncias eficientemente — desde a formulação lógica até a rede de problemas combinatórios.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1971</span><span class="reading-level">Fundacional</span></div><h4>Cook e procedimentos de demonstração</h4><p>Leia o resumo e a definição de redução por máquina de consulta. Depois siga o esqueleto da codificação de uma computação em fórmula. Liste o que precisa ter tamanho polinomial.</p><a href="https://doi.org/10.1145/800157.805047" target="_blank" rel="noopener noreferrer">Abrir o artigo original na ACM</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1972</span><span class="reading-level">Combinatória</span></div><h4>Karp e a cadeia de reduções</h4><p>Escolha dois problemas da lista e redesenhe a direção das reduções. Escreva a consequência correta de cada seta: qual algoritmo hipotético resolveria qual problema? Não inverta a implicação.</p><a href="https://doi.org/10.1007/978-1-4684-2001-2_9" target="_blank" rel="noopener noreferrer">Abrir o capítulo original na Springer</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Oficial</span><span class="reading-level">Problema aberto</span></div><h4>Descrição de Stephen Cook para o Clay</h4><p>Leia a formulação formal e as consequências listadas. Confira na página institucional o estado do problema. Separe “não se conhece algoritmo polinomial” de “provou-se que não existe”.</p><a href="https://www.claymath.org/wp-content/uploads/2022/06/pvsnp.pdf" target="_blank" rel="noopener noreferrer">Abrir a descrição oficial em PDF</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Monte um grafo dirigido com SAT, três problemas de Karp e um problema criptográfico do livro. Rotule apenas arestas para as quais você possui uma redução citável. Acrescente um parágrafo explicando por que NP-completude de pior caso não garante, por si só, uma primitiva criptográfica segura em casos médios.</p>`),
  tags: ["leitura", "P versus NP", "reduções", "NP-completude"],
});
