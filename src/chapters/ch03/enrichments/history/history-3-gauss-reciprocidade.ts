import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyGaussReciprocity: EnrichmentDefinition = Object.freeze({
  id: "history-3-gauss-reciprocidade",
  layer: "history",
  anchor: "sec-3-9",
  title: "Gauss e a reciprocidade quadrática",
  kicker: "História · resíduos quadráticos",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A lei da reciprocidade quadrática não surgiu pronta nem pertence a uma única pessoa. Sua forma e sua prova condensam uma sequência de observações de Euler, formulações de Legendre e demonstrações de Gauss.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Antes da prova</h4>
        <article class="timeline-card">
          <time>Século XVIII</time>
          <h5>Euler reconhece padrões</h5>
          <p>O estudo de quando uma congruência \(x^2\equiv a\pmod p\) tem solução produziu regularidades que relacionavam dois primos. Euler obteve casos e conjecturas próximas da lei completa.</p>
        </article>
        <article class="timeline-card">
          <time>1785</time>
          <h5>Legendre formula a reciprocidade</h5>
          <p>Adrien-Marie Legendre apresentou a lei em notação precursora do símbolo hoje associado a seu nome e propôs uma demonstração. A argumentação, porém, dependia de um passo não demonstrado sobre primos em progressões.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>Gauss faz do teorema um eixo</h4>
        <article class="timeline-card">
          <time>1796</time>
          <h5>Primeira prova registrada por Gauss</h5>
          <p>Gauss anotou em seu diário a demonstração ainda jovem. Ele voltaria ao resultado repetidas vezes, produzindo várias provas que iluminam conexões diferentes — contagem, formas quadráticas e somas de Gauss.</p>
        </article>
        <article class="timeline-card">
          <time>1801</time>
          <h5><em>Disquisitiones Arithmeticae</em></h5>
          <p>A primeira edição publicada organiza a aritmética de congruências e apresenta a lei como “teorema fundamental”. Para primos ímpares distintos, o sinal em

          \[\left(\frac pq\right)\left(\frac qp\right)=(-1)^{(p-1)(q-1)/4}\]

          concentra toda a assimetria: ele é negativo somente quando ambos são \(3\pmod4\).</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> Legendre publicou a formulação antes da prova completa de Gauss; Gauss registrou sua primeira prova em 1796 e publicou tratamento sistemático em 1801. O fac-símile ligado é uma edição de 1863 das obras de Gauss, não a impressão física de 1801.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> As muitas provas não são redundância ornamental. Elas explicam por que a reciprocidade aparece em problemas distintos e por que computar símbolos de Legendre/Jacobi pode ser feito por reduções sucessivas, sem extrair raízes.</div>
    <ul class="source-links">
      <li><a href="https://gdz.sub.uni-goettingen.de/id/PPN235993352" target="_blank" rel="noopener noreferrer">Gauss, <em>Disquisitiones Arithmeticae</em> — fac-símile da SUB Göttingen</a></li>
      <li><a href="https://dlmf.nist.gov/27.9" target="_blank" rel="noopener noreferrer">NIST DLMF §27.9 — símbolos e lei da reciprocidade</a></li>
    </ul>`),
  tags: ["história", "Gauss", "Legendre", "reciprocidade quadrática"],
});
