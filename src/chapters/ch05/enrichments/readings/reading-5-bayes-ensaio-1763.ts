import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingBayes: EnrichmentDefinition = Object.freeze({
  id: "reading-5-bayes-ensaio-1763",
  layer: "reading",
  anchor: "sec-5-3-2",
  title: "Ler Bayes antes de transformar seu nome em fórmula",
  kicker: "Roteiro de leitura · Royal Society, 1763",
  duration: "45–70 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Comece pelo enquadramento de Price e só depois entre nas proposições. O exercício é acompanhar a pergunta histórica, não reescrever todo o ensaio em notação moderna.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Metadados</span><span class="reading-level">10 min</span></div><h4>Cabeçalho e comunicação</h4><p>Na página da Royal Society, registre autoria, comunicador, periódico, volume e páginas. No fac-símile, leia o título completo e o início da carta de Richard Price. Quem apresenta o manuscrito e qual problema ele atribui ao texto?</p><a href="https://doi.org/10.1098/rstl.1763.0053" target="_blank" rel="noopener noreferrer">Abrir o registro da Royal Society</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Proposições</span><span class="reading-level">35–60 min</span></div><h4>Do experimento à probabilidade desconhecida</h4><p>No fac-símile, siga a definição do experimento geométrico e as primeiras proposições. Desenhe a configuração, nomeie o evento observado e diga qual quantidade desconhecida está sendo inferida.</p><a href="https://commons.wikimedia.org/wiki/File:An_Essay_towards_Solving_a_Problem_in_the_Doctrine_of_Chances._By_the_Late_Rev._Mr._Bayes,_F._R._S._Communicated_by_Mr._Price,_in_a_Letter_to_John_Canton,_A._M._F._R._S._(IA_paper-doi-10_1098_rstl_1763_0053).pdf" target="_blank" rel="noopener noreferrer">Abrir o fac-símile de domínio público</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Escreva quatro parágrafos curtos: pergunta direta, pergunta inversa, papel dos dados e papel da hipótese inicial. Termine explicando por que a identidade de probabilidade condicional do capítulo é necessária, mas não resume sozinha o programa inferencial do ensaio.</p>`),
  tags: ["leitura", "Bayes", "Richard Price", "probabilidade"],
});
