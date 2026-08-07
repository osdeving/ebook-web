import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyGoldwasserMicaliSecurity: EnrichmentDefinition = Object.freeze({
  id: "history-3-goldwasser-micali-seguranca",
  layer: "history",
  anchor: "sec-3-10",
  title: "Goldwasser–Micali e a virada para definições de segurança",
  kicker: "História · criptografia moderna",
  duration: "10 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">No começo da criptografia de chave pública, era tentador avaliar um esquema procurando ataques conhecidos. Goldwasser e Micali mudaram a pergunta: qual informação um adversário eficiente deveria ser incapaz de obter?</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Um novo modelo</h4>
        <article class="timeline-card">
          <time>STOC 1982</time>
          <h5>Cifração probabilística</h5>
          <p>Shafi Goldwasser e Silvio Micali propuseram que cifrar a mesma mensagem várias vezes deveria produzir textos cifrados diferentes. A aleatoriedade deixa de ser um detalhe de implementação e passa a integrar a definição do algoritmo.</p>
        </article>
        <article class="timeline-card">
          <time>JCSS 1984</time>
          <h5>“Nenhuma informação parcial”</h5>
          <p>A versão ampliada formaliza a ideia de que observar o texto cifrado não deve ajudar um adversário de tempo polinomial a computar nenhuma informação sobre a mensagem além do que já podia obter sem ele. Esse é o núcleo da segurança semântica.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>A teoria dos números vira hipótese de segurança</h4>
        <article class="timeline-card">
          <time>Construção</time>
          <h5>Residuosidade quadrática</h5>
          <p>No esquema GM, cada bit é codificado por um elemento escolhido aleatoriamente de uma de duas classes módulo um inteiro composto. Distinguir as classes sem a fatoração do módulo é ligado ao problema da residuosidade quadrática.</p>
        </article>
        <article class="timeline-card">
          <time>Legado</time>
          <h5>Construção, adversário e redução</h5>
          <p>Uma prova passa a ter três peças visíveis: a experiência que define segurança, a hipótese computacional e uma redução mostrando como um adversário bem-sucedido resolveria o problema presumidamente difícil. Esse vocabulário estrutura a criptografia teórica contemporânea.</p>
        </article>
      </section>
    </div>
    <div class="watch-out-inline"><strong>Não confunda.</strong> “A fatoração parece difícil” não prova automaticamente segurança semântica para RSA textual. Uma prova precisa ligar um jogo de segurança a uma hipótese precisa e incluir o esquema de codificação.</div>
    <div class="source-note"><strong>Fato documentado.</strong> O trabalho apareceu nos anais da STOC de 1982 e em versão ampliada no <em>Journal of Computer and System Sciences</em> em 1984. Ele apresenta cifração probabilística e uma formulação rigorosa de ocultação de informação parcial.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> A principal ruptura histórica não é apenas um novo criptossistema. É a mudança de critério: de “ninguém que conhecemos quebrou” para “todo adversário dentro de um modelo teria de superar uma hipótese explicitada”.</div>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1145/800070.802212" target="_blank" rel="noopener noreferrer">Goldwasser e Micali — artigo da STOC 1982</a></li>
      <li><a href="https://www.sciencedirect.com/science/article/pii/0022000084900709" target="_blank" rel="noopener noreferrer">Goldwasser e Micali — versão do JCSS (1984)</a></li>
      <li><a href="https://amturing.acm.org/award_winners/micali_9954407.cfm" target="_blank" rel="noopener noreferrer">ACM — contexto histórico do Prêmio Turing</a></li>
    </ul>`),
  tags: ["história", "Goldwasser–Micali", "segurança semântica", "residuosidade quadrática"],
});
