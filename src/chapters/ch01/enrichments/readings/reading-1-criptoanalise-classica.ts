import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingClassicalCryptanalysis: EnrichmentDefinition = Object.freeze({
  id: "reading-1-criptoanalise-classica",
  layer: "reading",
  anchor: "sec-1-1-1",
  title: "Da análise de frequência ao experimento",
  kicker: "Para saber mais · criptoanálise",
  duration: "20–40 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">As duas leituras se complementam: uma situa historicamente a análise de frequência; a outra permite observar, em ferramentas abertas, como cifras clássicas deixam rastros.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Museu universitário</span><span class="reading-level">Iniciante</span></div>
        <h4>Codebreaker Challenge: al-Kindi e Alberti</h4>
        <p>Use esta síntese para localizar a passagem entre contagem de letras, cifras polialfabéticas e discos cifrantes. Ela também oferece uma cronologia institucionalmente curada para conferir afirmações históricas.</p>
        <a href="https://www.une.edu.au/info-for/visitors/museums/museum-of-antiquities/codebreaker-challenge/alberti-cipher" target="_blank" rel="noopener noreferrer">Ler na University of New England</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Software educacional</span><span class="reading-level">Prático</span></div>
        <h4>CrypTool: cifras clássicas e visualizações</h4>
        <p>Depois de resolver uma substituição à mão, explore as funções do projeto para comparar ataques, distribuições e transformações. O ganho está em variar rapidamente textos e chaves sem perder a interpretação matemática.</p>
        <a href="https://www.cryptool.org/en/functions/" target="_blank" rel="noopener noreferrer">Explorar as funções do CrypTool</a>
      </article>
    </div>
    <div class="watch-out-inline"><strong>Boa prática.</strong> Ferramenta não substitui argumento: registre qual característica do criptograma cada teste explora e por que ela deveria sobreviver à cifra.</div>`),
  tags: ["leituras", "criptoanálise", "frequência", "ferramentas"],
});
