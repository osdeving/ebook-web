import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingOrigins: EnrichmentDefinition = Object.freeze({
  id: "reading-4-origens-assinatura-rsa",
  layer: "reading",
  anchor: "sec-4-1",
  title: "Duas fontes fundadoras: chave pública e RSA",
  kicker: "Roteiro de leitura · artigos originais",
  duration: "70–100 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Leia os textos como documentos históricos: registre o que já aparece em 1976/1978 e o que só seria formalizado ou padronizado depois.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1976</span><span class="reading-level">Conceitual</span></div><h4>Diffie–Hellman, seções I–III</h4><p>Marque as passagens que separam autenticação de privacidade e descrevem uma assinatura publicamente verificável. Compare a terminologia do artigo com os quatro algoritmos usados hoje.</p><a href="https://ee.stanford.edu/~hellman/publications/24.pdf" target="_blank" rel="noopener noreferrer">Abrir PDF em Stanford</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1978</span><span class="reading-level">Algébrico</span></div><h4>Rivest–Shamir–Adleman</h4><p>Leia o resumo, a seção sobre assinaturas e o apêndice de implementação. Identifique onde aparece a potência privada, como o texto trata resumo de mensagem e quais afirmações de segurança ainda não usam um jogo formal.</p><a href="https://people.csail.mit.edu/rivest/pubs/RSA78.pdf" target="_blank" rel="noopener noreferrer">Abrir artigo no MIT</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Faça uma tabela com três colunas: afirmação histórica, formulação atual e camada necessária na prática. Inclua ao menos “chave pública”, “assinatura”, “hash” e “identidade do dono da chave”.</p>`),
  tags: ["leitura", "Diffie–Hellman", "RSA", "fontes primárias"],
});
