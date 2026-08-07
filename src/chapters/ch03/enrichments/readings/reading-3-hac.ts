import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingHandbookAppliedCryptography: EnrichmentDefinition = Object.freeze({
  id: "reading-3-hac",
  layer: "reading",
  anchor: "sec-3-2",
  title: "HAC como mapa de consulta para o capítulo",
  kicker: "Roteiro de leitura · handbook aberto",
  duration: "90 min ou consulta",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead"><em>Handbook of Applied Cryptography</em>, de Menezes, van Oorschot e Vanstone, é mais útil como referência navegável do que como leitura linear. Seus algoritmos numerados e notas bibliográficas permitem cruzar teoria dos números, RSA e implementação.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Fundamentos</span><span class="reading-level">Capítulos 2–3</span></div>
        <h4>Aritmética e problemas de referência</h4>
        <p>Use o capítulo 2 para revisar congruências, símbolos e corpos finitos. No capítulo 3, compare as definições formais de fatoração e RSA problem; registre cuidadosamente quais reduções são conhecidas e quais equivalências não são afirmadas.</p>
        <a href="https://cacr.uwaterloo.ca/hac/about/chap3.pdf" target="_blank" rel="noopener noreferrer">Abrir o capítulo 3</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Parâmetros</span><span class="reading-level">Capítulo 4</span></div>
        <h4>Primos e geração de parâmetros</h4>
        <p>Procure Miller–Rabin, geração de primos e métodos de fatoração. Para cada algoritmo, anote entrada, tipo de resposta, probabilidade de erro e dependência da estrutura do número.</p>
        <a href="https://cacr.uwaterloo.ca/hac/about/chap4.pdf" target="_blank" rel="noopener noreferrer">Abrir o capítulo 4</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">RSA aplicado</span><span class="reading-level">Capítulos 8, 11 e 14</span></div>
        <h4>Cifração, assinatura e implementação</h4>
        <p>Compare a descrição de RSA para cifração e assinatura; depois siga as otimizações CRT no capítulo 14. Pergunte que ataques e contramedidas surgem apenas quando se considera a implementação.</p>
        <a href="https://cacr.uwaterloo.ca/hac/about/chap8.pdf" target="_blank" rel="noopener noreferrer">Abrir o capítulo 8</a>
      </article>
    </div>
    <h4>Como usar sem congelar o tempo</h4>
    <p>O HAC captura o estado da arte de meados dos anos 1990. Use definições, provas e bibliografias; para tamanhos de chave, esquemas recomendados e estado de ataques, confronte padrões atuais. Uma boa anotação sempre registra “resultado matemático” separado de “recomendação operacional”.</p>
    <div class="source-note"><strong>Fato documentado.</strong> O Centre for Applied Cryptographic Research da University of Waterloo hospeda legalmente os capítulos, com permissão da CRC Press, e identifica a obra publicada em 1996.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A força do livro está na topologia: ele mostra onde cada resultado vive e aponta à literatura primária. Sua idade é uma vantagem histórica e uma limitação normativa ao mesmo tempo.</div>
    <ul class="source-links">
      <li><a href="https://cacr.uwaterloo.ca/hac/index.html" target="_blank" rel="noopener noreferrer">Página oficial do HAC — downloads e condições de uso</a></li>
    </ul>`),
  tags: ["leitura", "HAC", "referência", "RSA"],
});
