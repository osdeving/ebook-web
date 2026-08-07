import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingRsaOriginal: EnrichmentDefinition = Object.freeze({
  id: "reading-3-rsa-original",
  layer: "reading",
  anchor: "sec-3-2",
  title: "Ler o artigo RSA de 1978 com olhos de hoje",
  kicker: "Roteiro de leitura · artigo original",
  duration: "45–70 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O artigo de Rivest, Shamir e Adleman é curto o bastante para leitura integral. O roteiro abaixo preserva o contexto de 1978 sem projetar sobre ele toda a teoria de segurança criada depois.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Passo 1</span><span class="reading-level">10 min</span></div>
        <h4>Problema e promessa</h4>
        <p>Leia o resumo e as seções I–II. Liste separadamente as propriedades desejadas para sigilo, para autenticação e para assinatura. Observe como o texto apresenta uma chave de cifração pública e uma chave de decifração privada.</p>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Passo 2</span><span class="reading-level">20 min</span></div>
        <h4>A construção aritmética</h4>
        <p>Nas seções III–V, reconstrua a escolha de \(p,q,n,e,d\). Marque onde entra a função de Euler e compare \(ed\equiv1\pmod{\varphi(n)}\) com a formulação moderna que também pode usar \(\lambda(n)\). Refaça o pequeno exemplo numérico.</p>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Passo 3</span><span class="reading-level">20–40 min</span></div>
        <h4>Eficiência e segurança</h4>
        <p>Leia as seções VI–IX. Separe cada afirmação em três classes: algoritmo explicitado, estimativa de custo e conjectura de segurança. Preste atenção à exponenciação por quadrados sucessivos e às sugestões de ataques.</p>
      </article>
    </div>
    <h4>Perguntas para anotar</h4>
    <ol>
      <li>Quais operações o artigo prova serem inversas e quais implicações de segurança apenas sugere?</li>
      <li>Por que o exemplo \(p=47,q=59\) é didático, mas não representa um parâmetro seguro?</li>
      <li>Onde a representação da mensagem fica subespecificada em comparação com um padrão contemporâneo?</li>
    </ol>
    <div class="source-note"><strong>Fato documentado.</strong> O texto foi publicado na <em>Communications of the ACM</em>, volume 21, número 2, em fevereiro de 1978, e descreve tanto cifração quanto assinatura usando a mesma estrutura algébrica.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Leia-o como nascimento público de uma construção, não como manual atual. Sua clareza matemática é duradoura; seus parâmetros, codificações e argumentos informais de segurança precisam ser complementados por resultados posteriores.</div>
    <ul class="source-links">
      <li><a href="https://people.csail.mit.edu/rivest/pubs/RSA78.pdf" target="_blank" rel="noopener noreferrer">Abrir o artigo no repositório de Ronald Rivest — MIT CSAIL</a></li>
    </ul>`),
  tags: ["leitura", "RSA", "artigo original"],
});
