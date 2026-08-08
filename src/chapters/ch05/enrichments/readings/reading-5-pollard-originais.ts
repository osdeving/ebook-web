import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingPollard: EnrichmentDefinition = Object.freeze({
  id: "reading-5-pollard-originais",
  layer: "reading",
  anchor: "sec-5-5-2",
  title: "A mesma órbita em dois problemas de Pollard",
  kicker: "Roteiro de leitura · artigos de 1975 e 1978",
  duration: "75–110 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Os dois artigos usam caminhadas e coincidências, mas extraem informações algébricas diferentes. A comparação revela o núcleo abstrato do método rô.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1975</span><span class="reading-level">Fatoração</span></div><h4><em>A Monte Carlo method for factorization</em></h4><p>Identifique a função iterada, os dois pontos comparados e o papel do máximo divisor comum. Faça uma tabela de três iterações para um inteiro pequeno e marque a primeira coincidência módulo de um fator.</p><a href="https://doi.org/10.1007/BF01933667" target="_blank" rel="noopener noreferrer">Abrir o artigo na BIT/Springer</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1978</span><span class="reading-level">Log discreto</span></div><h4><em>Monte Carlo methods for index computation</em></h4><p>Localize a partição do grupo e as atualizações dos expoentes conhecidos. Quando dois estados do grupo coincidem, escreva a congruência entre os expoentes e compare-a com a derivação da Seção 5.5.2.</p><a href="https://doi.org/10.1090/S0025-5718-1978-0491431-9" target="_blank" rel="noopener noreferrer">Abrir o artigo na AMS</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Preencha um quadro com seis linhas: conjunto de estados, função de iteração, informação carregada, evento de colisão, equação extraída e condição de falha. Finalize comparando tempo esperado e memória com uma busca que armazena todos os estados.</p>`),
  tags: ["leitura", "Pollard", "fatoração", "logaritmo discreto"],
});
