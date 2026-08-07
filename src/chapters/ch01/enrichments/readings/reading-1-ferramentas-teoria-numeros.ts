import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingNumberTheoryTools: EnrichmentDefinition = Object.freeze({
  id: "reading-1-ferramentas-teoria-numeros",
  layer: "reading",
  anchor: "algorithm-1-fast-powering",
  title: "Duas bancadas abertas para teoria dos números",
  kicker: "Para continuar explorando · software",
  duration: "30–60 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Depois das contas manuais, use software para formular conjecturas, testar casos e medir custo — sempre preservando exemplos pequenos cuja resposta você consegue verificar sozinho.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Álgebra computacional</span><span class="reading-level">Intermediário</span></div>
        <h4>Tutorial oficial do SageMath</h4>
        <p>É a melhor entrada para inteiros, congruências, fatoração e estruturas algébricas numa sintaxe próxima da matemática. Refaça a exponenciação modular do capítulo e compare o resultado com uma implementação sua.</p>
        <a href="https://doc.sagemath.org/html/en/tutorial/index.html" target="_blank" rel="noopener noreferrer">Abrir o tutorial do SageMath</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Teoria dos números</span><span class="reading-level">Intermediário</span></div>
        <h4>PARI/GP: documentação e ambiente no navegador</h4>
        <p>O PARI/GP é especializado em computação aritmética. Consulte a documentação para saber exatamente o contrato de cada função e use o ambiente web para experimentos sem instalação.</p>
        <a href="https://pari.math.u-bordeaux.fr/doc.html" target="_blank" rel="noopener noreferrer">Consultar a documentação do PARI/GP</a>
        <a href="https://pari.math.u-bordeaux.fr/gp.html" target="_blank" rel="noopener noreferrer">Abrir o PARI/GP no navegador</a>
      </article>
    </div>
    <div class="watch-out-inline"><strong>Regra de laboratório.</strong> Primeiro estime, depois execute, por fim explique qualquer diferença. Uma saída numérica sem interpretação não é uma prova.</div>`),
  tags: ["leituras", "SageMath", "PARI/GP", "computação"],
});
