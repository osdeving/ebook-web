import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyAlbertiDisksAndRotors: EnrichmentDefinition = Object.freeze({
  id: "history-1-alberti-discos-e-rotores",
  layer: "history",
  anchor: "sec-1-6",
  title: "Alberti: quando o alfabeto passou a se mover",
  kicker: "História · artefatos criptográficos",
  duration: "7 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O disco de Leon Battista Alberti não é apenas uma roda bonita. Ele materializa duas mudanças conceituais: a substituição pode variar durante a mensagem, e um mecanismo pode coordenar essa variação entre remetente e destinatário.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>O artefato renascentista</h4>
        <article class="timeline-card">
          <time>1466–1467</time>
          <h5>Uma encomenda e um tratado</h5>
          <p>Segundo a documentação apresentada pela Carnegie Mellon University, Alberti compôs <em>De componendis cifris</em> a pedido de Leonardo Dati. O texto descreve dois discos concêntricos com alfabetos que podem ser alinhados em posições diferentes.</p>
        </article>
        <article class="timeline-card">
          <time>Operação</time>
          <h5>Mudar a correspondência</h5>
          <p>Ao girar o disco móvel e indicar uma nova posição, a mesma letra do texto claro pode receber símbolos distintos em trechos diferentes. Com isso, as frequências deixam de ser transportadas por uma única permutação durante toda a mensagem.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>O que a comparação com rotores ensina</h4>
        <article class="timeline-card">
          <time>Séculos depois</time>
          <h5>Movimento a cada letra</h5>
          <p>Máquinas de rotores automatizam a mudança de alfabetos: a posição interna avança conforme se tecla. Algumas delas, como variantes militares da Enigma, acrescentam circuitos, vários rotores, anéis, painéis de conexão e procedimentos de chave que não existem no disco de Alberti.</p>
        </article>
        <article class="timeline-card">
          <time>Continuidade conceitual</time>
          <h5>Estado compartilhado</h5>
          <p>Nos dois casos, decifrar depende de reproduzir a sequência de estados do mecanismo. Essa é uma semelhança estrutural fecunda; não é prova de uma linha direta, sem intermediários, entre o artefato do século XV e cada máquina do século XX.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> O tratado e o disco de Alberti datam da década de 1460 e articulam substituições que podem mudar ao longo de uma mensagem.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> O disco pode ser lido como ancestral conceitual das máquinas de rotores porque introduz estado mecânico variável. “Ancestral” aqui descreve uma família de ideias, não uma genealogia tecnológica completa.</div>
    <ul class="source-links">
      <li><a href="https://www.library.cmu.edu/about/news/2023-01/Alberti-La-Cifra" target="_blank" rel="noopener noreferrer">Alberti’s <em>La Cifra</em> — Carnegie Mellon University Libraries</a></li>
      <li><a href="https://www.une.edu.au/info-for/visitors/museums/museum-of-antiquities/codebreaker-challenge/alberti-cipher" target="_blank" rel="noopener noreferrer">Alberti Cipher — University of New England Museum of Antiquities</a></li>
      <li><a href="https://www.tnmoc.org/bh-2-the-enigma-machine" target="_blank" rel="noopener noreferrer">The Enigma Machine — The National Museum of Computing</a></li>
    </ul>`),
  tags: ["história", "Alberti", "polialfabética", "rotores"],
});
