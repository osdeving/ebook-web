import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyBayesPrice: EnrichmentDefinition = Object.freeze({
  id: "history-5-bayes-price",
  layer: "history",
  anchor: "sec-5-3-2",
  title: "Bayes, Price e a publicação de uma ideia póstuma",
  kicker: "História · 1763",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O ensaio associado ao nome de Bayes chegou à Royal Society depois da morte do autor. A história da fórmula é, portanto, também uma história de edição, comunicação científica e interpretação.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>O documento</h4>
        <article class="timeline-card"><time>1763</time><h5>Richard Price comunica o manuscrito</h5><p>O artigo aparece nas <em>Philosophical Transactions</em> como obra do falecido Thomas Bayes, apresentada por Richard Price em carta a John Canton. Price preparou o material para publicação e escreveu uma introdução que explica por que julgava o problema importante.</p></article>
        <article class="timeline-card"><span class="timeline-label">Problema inverso</span><h5>Do efeito observado à chance desconhecida</h5><p>O texto investiga como raciocinar sobre uma probabilidade desconhecida depois de observar sucessos e fracassos. Esse sentido “inverso” distingue o problema de simplesmente calcular a frequência de resultados quando a probabilidade já é conhecida.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>A leitura moderna</h4>
        <article class="timeline-card"><span class="timeline-label">Hoje</span><h5>A fórmula escolar é uma peça, não o ensaio inteiro</h5><p>A identidade \(P(A\mid B)=P(B\mid A)P(A)/P(B)\) decorre das definições de probabilidade condicional. O trabalho histórico vai além dessa rearrumação: ele propõe uma maneira de atualizar incerteza sobre um parâmetro a partir de dados.</p></article>
        <article class="timeline-card"><span class="timeline-label">Na criptografia</span><h5>Evidência altera plausibilidades</h5><p>Frequências de letras, falhas observadas e hipóteses sobre chaves podem ser organizadas como evidência condicional. O alerta permanece: a conclusão depende tanto do modelo e das probabilidades iniciais quanto dos dados observados.</p></article>
      </section>
    </div>
    <p class="source-note"><strong>Questão de autoria.</strong> Dizer apenas “Bayes publicou” apaga o papel editorial de Price. O cabeçalho e a carta introdutória do artigo original tornam essa mediação explícita.</p>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1098/rstl.1763.0053" target="_blank" rel="noopener noreferrer">Bayes, comunicado por Price — artigo original na Royal Society</a></li>
      <li><a href="https://commons.wikimedia.org/wiki/File:An_Essay_towards_Solving_a_Problem_in_the_Doctrine_of_Chances._By_the_Late_Rev._Mr._Bayes,_F._R._S._Communicated_by_Mr._Price,_in_a_Letter_to_John_Canton,_A._M._F._R._S._(IA_paper-doi-10_1098_rstl_1763_0053).pdf" target="_blank" rel="noopener noreferrer">Fac-símile de domínio público no Wikimedia Commons</a></li>
    </ul>`),
  tags: ["história", "Bayes", "Richard Price", "probabilidade condicional"],
});
