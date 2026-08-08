import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingRhindProblem79: EnrichmentDefinition = Object.freeze({
  id: "reading-5-rhind-problema-79",
  layer: "reading",
  anchor: "sec-5-1-3",
  title: "Auditar o Problema 79 do Papiro de Rhind",
  kicker: "Roteiro de leitura · objeto, fac-símile e tradução",
  duration: "55–85 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Trabalhe em três camadas: o objeto catalogado, a imagem do documento e a tradução comentada. Cada camada responde a perguntas diferentes e tem limites próprios.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Museu</span><span class="reading-level">Proveniência</span></div><h4>EA10057 no British Museum</h4><p>Registre número de inventário, datação, material, dimensões, aquisição e descrição curatorial. Localize a observação de que o papiro provavelmente servia ao ensino de escribas e separe dado material de interpretação institucional.</p><a href="https://www.britishmuseum.org/collection/object/Y_EA10057" target="_blank" rel="noopener noreferrer">Abrir registro do objeto</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1927</span><span class="reading-level">Tradução</span></div><h4>Chace, Problema 79</h4><p>Leia a página 112 da edição (página digital 128). Transcreva as cinco linhas numéricas, confira o total por adição e reproduza o procedimento alternativo que multiplica 2801 por 7.</p><a href="https://en.wikisource.org/wiki/Page:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf/128" target="_blank" rel="noopener noreferrer">Abrir diretamente o Problema 79</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Lente atual</span><span class="reading-level">Demonstração</span></div><h4>Generalizar sem retroprojetar</h4><p>Expresse a lista como \(7^1,7^2,7^3,7^4,7^5\), derive a soma finita \(7(7^5-1)/(7-1)\) e verifique 19607. Depois escreva uma frase dizendo apenas o que a fonte demonstra e outra identificando sua reformulação moderna.</p><a href="https://en.wikisource.org/wiki/File:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf" target="_blank" rel="noopener noreferrer">Consultar o volume completo em domínio público</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Entregue uma ficha com quatro blocos: metadados do objeto, transcrição numérica, solução do documento e generalização moderna. Em cada afirmação histórica, indique qual dos três materiais a sustenta.</p>`),
  tags: ["leitura", "Papiro de Rhind", "Problema 79", "progressão geométrica"],
});
