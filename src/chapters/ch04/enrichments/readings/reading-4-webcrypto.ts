import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingWebCrypto: EnrichmentDefinition = Object.freeze({
  id: "reading-4-webcrypto-assinar-verificar",
  layer: "reading",
  anchor: "sec-4-2",
  title: "Da fórmula à API: assinatura no Web Cryptography",
  kicker: "Leitura técnica · padrão Web",
  duration: "40–70 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O laboratório do capítulo usa aritmética pequena para revelar etapas. Uma API real deve esconder a chave e exigir algoritmos completos, sem expor operações RSA arbitrárias.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Contrato</span><span class="reading-level">W3C</span></div><h4>SubtleCrypto.sign e verify</h4><p>Leia entradas, formatos de assinatura e algoritmos aceitos. Note que a API recebe nomes como RSA-PSS e parâmetros como saltLength, não “elevar ao expoente privado”.</p><a href="https://www.w3.org/TR/2017/REC-WebCryptoAPI-20170126/#SubtleCrypto-method-sign" target="_blank" rel="noopener noreferrer">Abrir método sign no padrão</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Chaves</span><span class="reading-level">W3C</span></div><h4>Geração, uso e exportabilidade</h4><p>Compare keyUsages de sign e verify e a marca extractable. Explique por que limitar operações permitidas é parte da segurança da interface.</p><a href="https://www.w3.org/TR/2017/REC-WebCryptoAPI-20170126/#dfn-CryptoKey" target="_blank" rel="noopener noreferrer">Abrir definição de CryptoKey</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Experimento</span><span class="reading-level">Local</span></div><h4>Teste orientado</h4><p>Gere RSA-PSS, assine bytes UTF-8, verifique, altere um byte e repita. Nunca persista uma chave privada real em código-fonte ou copie o laboratório didático como implementação de produção.</p></article>
    </div>`),
  tags: ["leitura", "Web Crypto", "RSA-PSS", "implementação"],
});
