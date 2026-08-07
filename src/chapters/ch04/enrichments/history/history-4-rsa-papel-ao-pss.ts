import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyRsaPss: EnrichmentDefinition = Object.freeze({
  id: "history-4-rsa-do-papel-ao-pss",
  layer: "history",
  anchor: "sec-4-2",
  title: "RSA: da potência simétrica ao esquema PSS",
  kicker: "História · primitiva e codificação",
  duration: "8 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O RSA de 1978 tornou visível uma operação elegante; duas décadas de criptoanálise e teoria deixaram claro que uma assinatura prática precisava especificar também como a mensagem entra nessa operação.</p>
    <div class="timeline">
      <article class="timeline-card"><time>1978</time><h4>O artigo RSA</h4><p>A publicação trata cifração e assinatura com potências inversas e já discute aplicar uma função de resumo antes de assinar. A formulação tem enorme valor histórico e didático, mas antecede as definições e codificações modernas.</p></article>
      <article class="timeline-card"><time>1996</time><h4>Bellare e Rogaway apresentam PSS</h4><p>O trabalho de segurança exata descreveu o Probabilistic Signature Scheme: uma codificação aleatorizada cujo argumento relaciona uma falsificação à inversão da primitiva RSA no modelo estudado.</p></article>
      <article class="timeline-card"><time>2016</time><h4>PKCS #1 v2.2 na RFC 8017</h4><p>O padrão separa representação de dados, primitivas RSA, métodos de codificação e esquemas completos. RSASSA-PSS combina EMSA-PSS com RSASP1/RSAVP1 e detalha todas as condições de rejeição.</p></article>
    </div>
    <div class="source-note"><strong>Leitura histórica responsável.</strong> “RSA assina elevando ao expoente privado” descreve o núcleo algébrico, não uma receita de implementação. A especificação moderna inclui codificação, hashes, sal, comprimentos e validações.</div>
    <ul class="source-links">
      <li><a href="https://people.csail.mit.edu/rivest/pubs/RSA78.pdf" target="_blank" rel="noopener noreferrer">Artigo RSA (MIT)</a></li>
      <li><a href="https://web.cs.ucdavis.edu/~rogaway/papers/exact.pdf" target="_blank" rel="noopener noreferrer">Bellare–Rogaway — segurança exata e PSS</a></li>
      <li><a href="https://www.rfc-editor.org/rfc/rfc8017.html#section-8.1" target="_blank" rel="noopener noreferrer">RFC 8017 — RSASSA-PSS</a></li>
    </ul>`),
  tags: ["história", "RSA", "PSS", "padronização"],
});
