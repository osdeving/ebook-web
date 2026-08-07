import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyKerckhoffsVernamShannon: EnrichmentDefinition = Object.freeze({
  id: "history-1-kerckhoffs-vernam-shannon",
  layer: "history",
  anchor: "example-1-34",
  title: "De Kerckhoffs a Shannon: sistema público, chave secreta",
  kicker: "História · princípios e teoria",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Três marcos, separados por décadas, ajudam a entender por que a criptografia moderna publica algoritmos, concentra o segredo na chave e avalia segurança com modelos explícitos.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Projeto e mecanismo</h4>
        <article class="timeline-card">
          <time>1883</time>
          <h5>Auguste Kerckhoffs</h5>
          <p>Em <em>La Cryptographie militaire</em>, Kerckhoffs enumera requisitos para cifras militares. Entre eles está a ideia de que o sistema não deveria depender de segredo permanente e poderia cair nas mãos do adversário sem se tornar inútil. O texto nasceu no contexto de comunicações militares, não de software aberto.</p>
        </article>
        <article class="timeline-card">
          <time>1918–1919</time>
          <h5>Gilbert Vernam</h5>
          <p>A patente de Vernam descreve um sistema telegráfico que combina sinais da mensagem e de uma fita de chave. Seu mecanismo eletromecânico antecede a linguagem abstrata de bits e XOR usada no capítulo, embora a operação binária seja a ponte matemática natural entre os dois.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>Teoria matemática</h4>
        <article class="timeline-card">
          <time>1949</time>
          <h5>Claude Shannon</h5>
          <p>Shannon publica uma teoria probabilística de sistemas secretos: mensagens, chaves e criptogramas são variáveis sujeitas a distribuições, e segurança pode ser definida pela informação que a observação do criptograma fornece sobre a mensagem.</p>
        </article>
        <article class="timeline-card">
          <time>Sigilo perfeito</time>
          <h5>Condições, não magia</h5>
          <p>A cifra de uso único alcança sigilo perfeito quando a chave é verdadeiramente aleatória, tem o tamanho adequado, permanece secreta e nunca é reutilizada. Remover uma dessas condições produz outro sistema, com outra alegação de segurança.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> O ensaio de Kerckhoffs, a patente de Vernam e o artigo de Shannon estão disponíveis em reproduções digitais diretamente consultáveis.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> O chamado “princípio de Kerckhoffs” é uma formulação moderna extraída de uma lista histórica mais extensa; a cifra de uso único teórica também não deve ser retroprojetada integralmente sobre todo equipamento chamado Vernam. A continuidade está nas ideias, não numa identidade perfeita de objetos.</div>
    <ul class="source-links">
      <li><a href="https://gallica.bnf.fr/ark:/12148/bd6t57758983" target="_blank" rel="noopener noreferrer">Auguste Kerckhoffs, <em>La Cryptographie militaire</em> (1883) — Gallica/BnF</a></li>
      <li><a href="https://patents.google.com/patent/US1310719A/en" target="_blank" rel="noopener noreferrer">Gilbert S. Vernam, US Patent 1,310,719 — Secret Signaling System</a></li>
      <li><a href="https://doi.org/10.1002/j.1538-7305.1949.tb00928.x" target="_blank" rel="noopener noreferrer">Claude E. Shannon, “Communication Theory of Secrecy Systems” (1949)</a></li>
    </ul>`),
  tags: ["história", "Kerckhoffs", "Vernam", "Shannon"],
});
