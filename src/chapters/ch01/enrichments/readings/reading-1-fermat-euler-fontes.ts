import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingFermatEulerSources: EnrichmentDefinition = Object.freeze({
  id: "reading-1-fermat-euler-fontes",
  layer: "reading",
  anchor: "theorem-1-24",
  title: "Como um enunciado vira tradição matemática",
  kicker: "Para saber mais · Fermat e Euler",
  duration: "30–60 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Este par de leituras acompanha dois trabalhos históricos diferentes: reconstruir uma correspondência incompleta e seguir a transformação da função totiente ao longo das notações.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Artigo de história</span><span class="reading-level">Avançado</span></div>
        <h4>A correspondência Frénicle–Fermat de 1640</h4>
        <p>Fletcher mostra como historiadores relacionam cartas, cópias e respostas para reconstruir uma sequência documental. Leia sobretudo para entender por que “Fermat escreveu em 1640” ainda requer aparato crítico.</p>
        <a href="https://doi.org/10.1016/0315-0860(91)90371-4" target="_blank" rel="noopener noreferrer">Abrir o registro do artigo em <em>Historia Mathematica</em></a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Exposição histórica</span><span class="reading-level">Intermediário</span></div>
        <h4>Math Origins: The Totient Function</h4>
        <p>J. J. Tou acompanha as formulações de Euler e a notação que culminou em \(\varphi\). Compare as expressões históricas com a definição por classes invertíveis usada no capítulo.</p>
        <a href="https://digitalcommons.tacoma.uw.edu/ias_pub/853/" target="_blank" rel="noopener noreferrer">Ler no repositório da University of Washington Tacoma</a>
      </article>
    </div>`),
  tags: ["leituras", "Fermat", "Euler", "historiografia"],
});
