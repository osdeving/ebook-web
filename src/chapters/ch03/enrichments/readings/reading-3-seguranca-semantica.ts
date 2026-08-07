import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingSemanticSecurity: EnrichmentDefinition = Object.freeze({
  id: "reading-3-seguranca-semantica",
  layer: "reading",
  anchor: "sec-3-10",
  title: "Segurança semântica: da frase ao experimento",
  kicker: "Roteiro de leitura · definições modernas",
  duration: "75–120 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">“O texto cifrado não revela informação” parece claro até tentarmos quantificar “informação”, “revela” e o poder de quem observa. Este roteiro faz a travessia entre a definição por simulação e o jogo de indistinguibilidade.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Origem</span><span class="reading-level">Goldwasser–Micali</span></div>
        <h4>Informação parcial e simulador</h4>
        <p>Na versão de 1984, identifique a função \(f(m)\) que representa informação sobre a mensagem e compare um adversário que vê o texto cifrado com um procedimento que não o vê. Anote todas as quantificações: mensagens, funções e algoritmos eficientes.</p>
        <a href="https://www.sciencedirect.com/science/article/pii/0022000084900709" target="_blank" rel="noopener noreferrer">Abrir o artigo fundador no JCSS</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Formulação atual</span><span class="reading-level">Boneh–Shoup, cap. 11</span></div>
        <h4>Indistinguibilidade e CPA em chave pública</h4>
        <p>Leia as definições de esquema, correção e jogo CPA nas páginas do capítulo 11. Explique por que, em chave pública, o adversário já pode cifrar mensagens por conta própria e por que segurança semântica implica a noção CPA apresentada.</p>
        <a href="https://toc.cryptobook.us/book.pdf#page=467" target="_blank" rel="noopener noreferrer">Abrir <em>A Graduate Course in Applied Cryptography</em></a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Teste negativo</span><span class="reading-level">15 min</span></div>
        <h4>Por que cifração determinística falha</h4>
        <p>Dadas duas mensagens \(m_0,m_1\), descreva um adversário que calcula as duas cifras com a chave pública e compara com o desafio. Depois localize exatamente qual passo deixa de funcionar quando a cifração usa aleatoriedade fresca.</p>
      </article>
    </div>
    <h4>Vocabulário mínimo a produzir</h4>
    <ol>
      <li>Parâmetro de segurança e algoritmo eficiente.</li>
      <li>Função desprezível e vantagem do adversário.</li>
      <li>Experimento real, experimento ideal/simulador e indistinguibilidade.</li>
      <li>Modelo de ataque: passivo, CPA e CCA não são sinônimos.</li>
    </ol>
    <div class="source-note"><strong>Fato documentado.</strong> Goldwasser e Micali introduziram o modelo probabilístico e a ocultação de informação parcial. O texto aberto de Boneh e Shoup apresenta uma formulação contemporânea em jogos e explica a relação particular entre segurança semântica e CPA no cenário de chave pública.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A equivalência de formulações é uma ferramenta pedagógica: a simulação esclarece “não aprender nada”; o jogo de dois desafios costuma tornar reduções e cálculos de vantagem mais manejáveis.</div>`),
  tags: ["leitura", "segurança semântica", "CPA", "indistinguibilidade"],
});
