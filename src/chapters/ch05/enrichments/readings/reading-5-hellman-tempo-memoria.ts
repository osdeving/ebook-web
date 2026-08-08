import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingHellmanTradeoff: EnrichmentDefinition = Object.freeze({
  id: "reading-5-hellman-tempo-memoria",
  layer: "reading",
  anchor: "sec-5-4",
  title: "Hellman: pagar antes, guardar menos, buscar depois",
  kicker: "Roteiro de leitura · trade-off tempo–memória, 1980",
  duration: "75–110 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Ataques não são ordenados apenas pelo tempo de uma execução. Pré-computação, memória, número de alvos e probabilidade de sucesso podem ser trocados entre si.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1980</span><span class="reading-level">Criptoanálise</span></div><h4><em>A Cryptanalytic Time–Memory Trade-Off</em></h4><p>Leia resumo e Seções I–II. Desenhe uma cadeia da função de redução e cifração, indicando apenas início e fim armazenados. Na busca, mostre por que o alvo é avançado até possivelmente atingir uma ponta de cadeia.</p><a href="https://ee.stanford.edu/~hellman/publications/36.pdf" target="_blank" rel="noopener noreferrer">Abrir PDF no arquivo de Hellman em Stanford</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Parâmetros</span><span class="reading-level">Análise</span></div><h4>Separar os custos</h4><p>Extraia \(N\), número de cadeias, comprimento, memória, pré-computação e tempo online. Marque onde fusões reduzem cobertura e por que múltiplas tabelas usam funções de redução diferentes.</p><a href="https://doi.org/10.1109/TIT.1980.1056220" target="_blank" rel="noopener noreferrer">Abrir registro do artigo pelo DOI</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Monte uma planilha simbólica com custos offline, online, memória e sucesso. Compare três extremos: busca exaustiva, tabela completa e trade-off. Declare o cenário de múltiplos alvos em que a pré-computação pode ser amortizada.</p>`),
  tags: ["leitura", "Hellman", "tempo–memória", "pré-computação"],
});
