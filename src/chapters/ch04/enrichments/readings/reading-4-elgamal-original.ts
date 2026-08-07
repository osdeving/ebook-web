import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingElgamalOriginal: EnrichmentDefinition = Object.freeze({
  id: "reading-4-elgamal-original",
  layer: "reading",
  anchor: "sec-4-3",
  title: "ElGamal no artigo de 1985",
  kicker: "Roteiro de leitura · fonte primária",
  duration: "35–55 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O artigo tem apenas quatro páginas e permite comparar diretamente a cifra probabilística com a assinatura baseada no mesmo problema de logaritmo discreto.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Mapa</span><span class="reading-level">1985</span></div><h4>Duas construções, um problema difícil</h4><p>Identifique em cada construção a chave permanente e a escolha efêmera. Marque onde o autor exige que o inteiro aleatório seja relativamente primo a p−1.</p><a href="https://doi.org/10.1109/TIT.1985.1057074" target="_blank" rel="noopener noreferrer">Abrir registro e acesso pelo DOI</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Deduza</span><span class="reading-level">Álgebra</span></div><h4>Reconstrua a verificação</h4><p>Sem copiar o livro, derive o cancelamento do expoente secreto. Use uma cor para congruências módulo p e outra para congruências módulo p−1.</p></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Critique</span><span class="reading-level">Segurança</span></div><h4>Faça perguntas atuais</h4><p>Que noção de falsificação está explícita? Como a mensagem é representada? Que garantias são exigidas do gerador de nonce? Trate ausências como contexto histórico, não como defeito pessoal do autor.</p></article>
    </div>
    <div class="source-note"><strong>Direitos.</strong> O artigo é publicado pela IEEE e pode exigir acesso institucional; esta leitura contém somente paráfrase e link para o registro original.</div>`),
  tags: ["leitura", "ElGamal", "artigo original", "IEEE"],
});
