import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingModularArithmeticReference: EnrichmentDefinition = Object.freeze({
  id: "reading-1-aritmetica-modular-referencia",
  layer: "reading",
  anchor: "def-1-congruence",
  title: "Referências para congruências, totiente e raízes primitivas",
  kicker: "Para saber mais · consulta matemática",
  duration: "20–45 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Use estas páginas como referência consultável, não como leitura linear obrigatória. Elas ajudam a conferir notação, hipóteses e relações entre funções aritméticas.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Referência institucional</span><span class="reading-level">Avançado</span></div>
        <h4>NIST DLMF, §27.2</h4>
        <p>A <em>Digital Library of Mathematical Functions</em> reúne definições e identidades de teoria multiplicativa dos números, com referências bibliográficas. Consulte-a ao relacionar totiente, ordens e outras funções aritméticas.</p>
        <a href="https://dlmf.nist.gov/27.2" target="_blank" rel="noopener noreferrer">Abrir a seção 27.2 do DLMF</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Documentação</span><span class="reading-level">Intermediário</span></div>
        <h4>Referência matemática do SageMath</h4>
        <p>Procure “finite rings”, “modular integer” e “primitive root” para ver como objetos abstratos ganham operações verificáveis. A documentação também explicita tipos e exceções que uma calculadora simples costuma esconder.</p>
        <a href="https://doc.sagemath.org/html/en/reference/" target="_blank" rel="noopener noreferrer">Pesquisar na referência do SageMath</a>
      </article>
    </div>`),
  tags: ["leituras", "DLMF", "congruências", "referência"],
});
