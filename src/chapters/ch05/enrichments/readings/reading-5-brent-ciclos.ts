import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingBrentCycles: EnrichmentDefinition = Object.freeze({
  id: "reading-5-brent-ciclos",
  layer: "reading",
  anchor: "sec-5-5-1",
  title: "Detectar ciclos: do passo duplo ao agrupamento de Brent",
  kicker: "Roteiro de leitura · algoritmo e implementação",
  duration: "60–95 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A formulação abstrata do rô separa duas tarefas: gerar uma órbita e detectar que ela entrou em ciclo. Trocar o detector pode mudar constantes e o custo de operações caras sem alterar a heurística de aniversário.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Rô</span><span class="reading-level">Base</span></div><h4>O detector usado por Pollard</h4><p>No artigo de 1975, localize a comparação de estados em velocidades diferentes. Para uma órbita com cauda \(\mu\) e ciclo \(\lambda\), simule tartaruga e lebre até o primeiro encontro e conte avaliações da função.</p><a href="https://doi.org/10.1007/BF01933667" target="_blank" rel="noopener noreferrer">Abrir artigo de Pollard</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1980</span><span class="reading-level">Melhoria</span></div><h4>Brent agrupa passos e MDCs</h4><p>Leia a descrição do algoritmo melhorado e siga os intervalos de tamanho crescente. Identifique onde avaliações, comparações e máximos divisores comuns são agrupados; esses custos não são equivalentes em uma implementação real.</p><a href="https://maths-people.anu.edu.au/~brent/pd/rpb051i.pdf" target="_blank" rel="noopener noreferrer">Abrir artigo no arquivo do autor, ANU</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Auditoria</span><span class="reading-level">Histórica</span></div><h4>Nomear com cautela</h4><p>A tradição chama o passo duplo de algoritmo de Floyd, mas a atribuição impressa é indireta. Ao citar, diferencie a técnica, seu uso por Pollard e a variante publicada por Brent.</p><a href="https://doi.org/10.1007/BF01933190" target="_blank" rel="noopener noreferrer">Consultar o registro editorial de Brent</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Implemente em pseudocódigo os dois detectores com contadores separados para avaliações de \(f\), comparações e MDCs. Teste três funções pequenas com caudas e ciclos conhecidos e explique qual contador domina no rô de fatoração.</p>`),
  tags: ["leitura", "Brent", "detecção de ciclos", "Pollard rô"],
});
