import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyRsaToPkcs: EnrichmentDefinition = Object.freeze({
  id: "history-3-rsa-pkcs",
  layer: "history",
  anchor: "sec-3-2",
  title: "Do artigo RSA ao PKCS #1",
  kicker: "História · padronização",
  duration: "8 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O RSA do livro é uma estrutura matemática. O RSA que trafega em protocolos precisa ainda especificar como representar mensagens, inserir aleatoriedade, codificar assinaturas e rejeitar entradas inválidas.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Da construção ao formato</h4>
        <article class="timeline-card">
          <time>1978</time>
          <h5>O artigo apresenta os primitivos</h5>
          <p>Rivest, Shamir e Adleman descrevem a transformação \(m\mapsto m^e\bmod n\), sua inversão e aplicações a sigilo e assinatura. O texto já discute converter mensagens em blocos numéricos, mas não contém os mecanismos de codificação probabilística hoje associados a uma API de RSA.</p>
        </article>
        <article class="timeline-card">
          <time>Década de 1990</time>
          <h5>PKCS #1 fixa convenções interoperáveis</h5>
          <p>A RSA Laboratories publicou o PKCS #1 como parte da família <em>Public-Key Cryptography Standards</em>. O documento reuniu representações de chaves, primitivas e esquemas de codificação para que implementações independentes falassem o mesmo idioma.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>Revisão sob ataque</h4>
        <article class="timeline-card">
          <time>1998–2002</time>
          <h5>Novas análises mudam as recomendações</h5>
          <p>Resultados sobre decifração adaptativa mostraram que pequenos sinais de erro em implementações do preenchimento v1.5 podiam virar um oráculo. Versões posteriores incorporaram OAEP para cifração e PSS para assinatura, esquemas concebidos com objetivos de segurança explícitos.</p>
        </article>
        <article class="timeline-card">
          <time>2016</time>
          <h5>PKCS #1 v2.2 torna-se RFC 8017</h5>
          <p>A versão atual consolidada foi publicada pelo IETF como RFC informativa. Ela distingue com cuidado primitivas RSA, esquemas de cifração, esquemas de assinatura, codificação e sintaxe ASN.1.</p>
        </article>
      </section>
    </div>
    <div class="watch-out-inline"><strong>Lição técnica.</strong> “Aplicar RSA” não é sinônimo de elevar diretamente uma mensagem ao expoente. O RSA sem codificação adequada é determinístico, maleável e inadequado para uso geral.</div>
    <div class="source-note"><strong>Fato documentado.</strong> A RFC 8017, publicada em novembro de 2016, especifica RSAES-OAEP, RSAES-PKCS1-v1_5, RSASSA-PSS e RSASSA-PKCS1-v1_5 e substitui a RFC 3447.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A passagem artigo → padrão mostra que segurança aplicada não emerge apenas do teorema central: ela depende também de representação, aleatoriedade, mensagens de erro e comportamento de implementação.</div>
    <ul class="source-links">
      <li><a href="https://people.csail.mit.edu/rivest/pubs/RSA78.pdf" target="_blank" rel="noopener noreferrer">Artigo RSA de 1978 — cópia dos autores no MIT</a></li>
      <li><a href="https://www.ietf.org/rfc/rfc8017.html" target="_blank" rel="noopener noreferrer">IETF RFC 8017 — PKCS #1 v2.2</a></li>
    </ul>`),
  tags: ["história", "RSA", "PKCS #1", "padrões"],
});
