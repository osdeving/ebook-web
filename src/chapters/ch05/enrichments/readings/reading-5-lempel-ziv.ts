import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingLempelZiv: EnrichmentDefinition = Object.freeze({
  id: "reading-5-lempel-ziv",
  layer: "reading",
  anchor: "sec-5-6-3",
  title: "Lempel–Ziv: comprimir sem receber a distribuição pronta",
  kicker: "Roteiro de leitura · 1977–1978",
  duration: "90–130 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Huffman supõe pesos de símbolos disponíveis; os artigos de Ziv e Lempel atacam sequências cuja estrutura precisa ser descoberta durante a codificação.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1977</span><span class="reading-level">Janela</span></div><h4>Algoritmo universal sequencial</h4><p>Leia resumo, definição de complexidade e descrição operacional. Em uma frase curta repetitiva, marque a janela anterior, a maior correspondência e o próximo símbolo. O que decodificador precisa conservar?</p><a href="https://www.itsoc.org/publications/papers/a-universal-algorithm-for-sequential-data-compression" target="_blank" rel="noopener noreferrer">Abrir registro na IEEE Information Theory Society</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1978</span><span class="reading-level">Dicionário</span></div><h4>Frases e codificação de taxa variável</h4><p>Siga o parsing incremental de uma mesma sequência. Liste frases novas e o par índice–símbolo que as representa. Compare a memória compartilhada implícita com a janela do artigo anterior.</p><a href="https://doi.org/10.1109/TIT.1978.1055934" target="_blank" rel="noopener noreferrer">Abrir o artigo de 1978 pelo DOI</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Comparação</span><span class="reading-level">Conceitual</span></div><h4>Probabilidades versus recorrências</h4><p>Escolha uma sequência com frequências equilibradas, mas blocos repetidos. Compare o que uma codificação símbolo a símbolo vê com o que um dicionário de frases vê. Não confunda “universal” com ótimo para toda entrada finita.</p><a href="https://doi.org/10.1109/TIT.1977.1055714" target="_blank" rel="noopener noreferrer">Abrir metadados do artigo de 1977</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Entregue os dois parsings da mesma cadeia e um quadro de estado do decodificador. Acrescente uma nota sobre por que compressão remove redundância útil à criptoanálise, mas tamanho comprimido ainda pode revelar informação.</p>`),
  tags: ["leitura", "Lempel–Ziv", "compressão universal", "dicionário"],
});
