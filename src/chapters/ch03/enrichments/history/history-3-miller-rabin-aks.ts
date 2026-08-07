import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyMillerRabinAks: EnrichmentDefinition = Object.freeze({
  id: "history-3-miller-rabin-aks",
  layer: "history",
  anchor: "sec-3-4",
  title: "De Miller–Rabin a AKS: três sentidos de “eficiente”",
  kicker: "História · testes de primalidade",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Entre 1976 e 2004, testes de primalidade ajudaram a separar três perguntas que parecem iguais à primeira vista: existe um algoritmo polinomial? ele depende de uma conjectura? ele é o que se usa na prática?</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Da hipótese à probabilidade</h4>
        <article class="timeline-card">
          <time>1976</time>
          <h5>Miller: determinístico, mas condicional</h5>
          <p>Gary Miller analisou um teste baseado em testemunhas fortes e demonstrou tempo polinomial sob uma forma da hipótese de Riemann estendida. A contribuição estabelece que uma lista suficientemente curta de bases basta se essa hipótese analítica for verdadeira.</p>
        </article>
        <article class="timeline-card">
          <time>1980</time>
          <h5>Rabin: incondicional, mas aleatorizado</h5>
          <p>Michael Rabin escolheu as bases ao acaso e obteve um algoritmo probabilístico sem depender daquela conjectura. Para um composto ímpar, a fração de bases que enganam o teste é no máximo \(1/4\); repetir com escolhas independentes reduz exponencialmente a probabilidade de erro.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>O marco teórico</h4>
        <article class="timeline-card">
          <time>2002–2004</time>
          <h5>Agrawal, Kayal e Saxena: PRIMES is in P</h5>
          <p>O algoritmo AKS explora a identidade polinomial \((X+a)^n\equiv X^n+a\pmod n\), verificada em quocientes adequados. O anúncio de 2002 e o artigo de 2004 deram o primeiro teste geral, determinístico, incondicional e de tempo polinomial.</p>
        </article>
        <article class="timeline-card">
          <time>Hoje</time>
          <h5>Importância teórica não é liderança prática</h5>
          <p>AKS resolve uma classificação de complexidade; Miller–Rabin continua muito mais simples e rápido em rotinas usuais de geração de primos, frequentemente combinado com divisão por primos pequenos e testes adicionais.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> Miller publicou o resultado condicional em 1976; Rabin publicou a versão probabilística incondicional em 1980; Agrawal, Kayal e Saxena publicaram no <em>Annals of Mathematics</em>, em 2004, um teste determinístico polinomial incondicional.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A sequência não é uma simples substituição de algoritmos “piores” por “melhores”. Cada resultado otimiza uma dimensão diferente: hipótese matemática, tipo de erro, garantia assintótica e custo concreto.</div>
    <ul class="source-links">
      <li><a href="https://www.cs.cmu.edu/~glmiller/Publications/Papers/RiemannsHypothesisandTestsforPrimality.pdf" target="_blank" rel="noopener noreferrer">Gary L. Miller — artigo de 1976 (CMU)</a></li>
      <li><a href="https://www.sciencedirect.com/science/article/pii/0022314X80900840" target="_blank" rel="noopener noreferrer">Michael O. Rabin — artigo de 1980</a></li>
      <li><a href="https://repository.ias.ac.in/122755/" target="_blank" rel="noopener noreferrer">Agrawal, Kayal e Saxena — registro institucional do artigo AKS</a></li>
    </ul>`),
  tags: ["história", "Miller–Rabin", "AKS", "primalidade"],
});
