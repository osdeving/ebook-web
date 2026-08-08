import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyPNP: EnrichmentDefinition = Object.freeze({
  id: "history-5-p-np-cook-karp",
  layer: "history",
  anchor: "sec-5-7",
  title: "Cook, Karp e a linguagem da NP-completude",
  kicker: "História · 1971–hoje",
  duration: "12 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A pergunta “é fácil verificar, mas difícil encontrar?” tornou-se uma teoria quando reduções permitiram ligar milhares de problemas sem precisar comparar algoritmos caso a caso.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Concentrar a dificuldade</h4>
        <article class="timeline-card"><time>1971</time><h5>Cook liga computações a fórmulas</h5><p>Stephen Cook mostrou que a computação de uma máquina não determinística limitada por tempo polinomial pode ser codificada em um problema proposicional. Em terminologia atual, a satisfatibilidade booleana é NP-completa.</p></article>
        <article class="timeline-card"><span class="timeline-label">Ideia-chave</span><h5>Redução é uma transferência de algoritmo</h5><p>Se uma instância de \(A\) pode ser transformada eficientemente em uma instância de \(B\), um algoritmo eficiente para \(B\) resolveria também \(A\). A redução preserva a pergunta relevante sem afirmar que os problemas “se parecem”.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>Espalhar a classificação</h4>
        <article class="timeline-card"><time>1972</time><h5>Karp conecta problemas combinatórios</h5><p>Richard Karp aplicou reduções a uma coleção de problemas de grafos, cobertura, particionamento e programação. A lista mostrou que a dificuldade não era uma peculiaridade da lógica: a mesma estrutura aparecia em campos diferentes.</p></article>
        <article class="timeline-card"><span class="timeline-label">2000–hoje</span><h5>P versus NP permanece em aberto</h5><p>O Clay Mathematics Institute incluiu P versus NP entre os Problemas do Milênio. A classificação NP-completa não prova que um problema exige tempo exponencial; ela diz que um algoritmo polinomial para qualquer NP-completo daria algoritmos polinomiais para todos os problemas de NP.</p></article>
      </section>
    </div>
    <p class="source-note"><strong>Conexão criptográfica.</strong> “O problema é NP-completo”, sozinho, não é uma hipótese criptográfica pronta: criptografia exige casos médios, distribuições de instâncias, parâmetros e vantagens adversariais. A teoria de pior caso é um mapa essencial, mas não substitui essas definições.</p>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1145/800157.805047" target="_blank" rel="noopener noreferrer">Cook — artigo original de 1971 na ACM</a></li>
      <li><a href="https://doi.org/10.1007/978-1-4684-2001-2_9" target="_blank" rel="noopener noreferrer">Karp — “Reducibility among Combinatorial Problems” (1972)</a></li>
      <li><a href="https://www.claymath.org/millennium/p-vs-np/" target="_blank" rel="noopener noreferrer">P versus NP — página oficial do Clay Mathematics Institute</a></li>
    </ul>`),
  tags: ["história", "P versus NP", "Cook", "Karp", "NP-completude"],
});
