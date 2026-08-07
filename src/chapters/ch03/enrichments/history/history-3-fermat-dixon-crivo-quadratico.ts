import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyFermatDixonQuadraticSieve: EnrichmentDefinition = Object.freeze({
  id: "history-3-fermat-dixon-crivo-quadratico",
  layer: "history",
  anchor: "sec-3-7-2",
  title: "De Fermat ao crivo quadrático: relações, não milagres",
  kicker: "História · fatoração geral",
  duration: "10 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Três séculos de fatoração podem ser lidos como refinamentos de uma mesma meta: construir uma congruência de quadrados \(x^2\equiv y^2\pmod n\) sem cair nos casos triviais \(x\equiv\pm y\).</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Uma diferença de quadrados</h4>
        <article class="timeline-card">
          <time>Século XVII</time>
          <h5>Fermat aproxima-se de \(\sqrt n\)</h5>
          <p>Escrever \(n=x^2-y^2=(x-y)(x+y)\) funciona bem quando os fatores estão próximos. O método busca \(x\geq\lceil\sqrt n\rceil\) até que \(x^2-n\) seja quadrado. Sua limitação já sugere a pergunta seguinte: e se combinássemos várias quase-relações?</p>
        </article>
        <article class="timeline-card">
          <time>1981</time>
          <h5>Dixon sistematiza quadrados aleatórios</h5>
          <p>John D. Dixon coleta resíduos que se fatoram sobre uma base pequena de primos. Vetores de paridades transformam produtos de relações em álgebra linear sobre \(\mathbf F_2\); uma dependência produz os dois quadrados congruentes.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>O crivo escolhe melhor as relações</h4>
        <article class="timeline-card">
          <time>1981–1984</time>
          <h5>Pomerance criva valores de \(Q(x)=x^2-n\)</h5>
          <p>Carl Pomerance percebeu que não era necessário testar e fatorar cada valor isoladamente. Para cada primo da base, as raízes de \(Q(x)\equiv0\pmod p\) indicam progressões a marcar; o crivo identifica coletivamente os candidatos suaves.</p>
        </article>
        <article class="timeline-card">
          <time>Resultado</time>
          <h5>Um algoritmo geral subexponencial</h5>
          <p>O crivo quadrático não requer uma forma especial dos fatores. Durante parte da década de 1980 tornou-se o método de referência para inteiros gerais de porte médio, até a ascensão do crivo do corpo de números.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> O artigo de Dixon de 1981 provou um tempo esperado subexponencial para seu método. Pomerance situa sua ideia do crivo quadrático no começo de 1981 e publicou a descrição nos anais da EUROCRYPT 1984.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> O avanço crucial não foi abandonar Fermat, mas industrializar sua congruência: substituir uma tentativa perfeita por muitas relações imperfeitas, depois combinadas por álgebra linear.</div>
    <ul class="source-links">
      <li><a href="https://pages.cs.wisc.edu/~cs812-1/dixon.pdf" target="_blank" rel="noopener noreferrer">J. D. Dixon, <em>Asymptotically Fast Factorization of Integers</em> (1981)</a></li>
      <li><a href="https://math.dartmouth.edu/~carlp/PDF/paper52.pdf" target="_blank" rel="noopener noreferrer">Carl Pomerance, <em>The Quadratic Sieve Factoring Algorithm</em></a></li>
      <li><a href="https://www.ams.org/notices/199612/pomerance.pdf" target="_blank" rel="noopener noreferrer">Carl Pomerance, <em>A Tale of Two Sieves</em> — AMS</a></li>
    </ul>`),
  tags: ["história", "Fermat", "Dixon", "crivo quadrático"],
});
