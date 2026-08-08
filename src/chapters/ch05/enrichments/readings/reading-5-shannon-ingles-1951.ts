import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingShannonEnglish: EnrichmentDefinition = Object.freeze({
  id: "reading-5-shannon-ingles-1951",
  layer: "reading",
  anchor: "sec-5-6-3",
  title: "Shannon mede o inglês pedindo previsões",
  kicker: "Roteiro de leitura · Bell Labs, 1951",
  duration: "60–90 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Frequência de letras mede apenas uma camada da língua. Shannon explora o conhecimento implícito de falantes para estimar quanto o contexto reduz a incerteza do próximo caractere.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1951</span><span class="reading-level">Experimento</span></div><h4><em>Prediction and Entropy of Printed English</em></h4><p>Leia método, tabelas e discussão. Reconstrua o jogo de adivinhação: o participante propõe letras em ordem, o experimentador informa a posição da correta, e o número de tentativas alimenta limites de entropia.</p><a href="https://www.nokia.com/bell-labs/publications-and-media/publications/prediction-and-entropy-of-printed-english/" target="_blank" rel="noopener noreferrer">Abrir registro institucional do Bell Labs</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Fac-símile</span><span class="reading-level">Dados</span></div><h4>Auditar uma tabela</h4><p>No PDF do periódico, escolha uma tabela e registre amostra, unidade, limite inferior e superior. Diga quais dependências do inglês ela capta e quais características de gênero, época ou participante podem limitar a generalização.</p><a href="https://doi.org/10.1002/j.1538-7305.1951.tb01366.x" target="_blank" rel="noopener noreferrer">Abrir artigo pelo DOI</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Faça uma versão pequena do experimento em português com 100–200 caracteres. Guarde texto, palpites e regra de pontuação. Compare qualitativamente ordem zero (frequências isoladas) e contexto, sem apresentar a amostra curta como estimativa confiável da língua.</p>`),
  tags: ["leitura", "Shannon", "linguagem natural", "redundância"],
});
