import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyEnigmaPurpleTeams: EnrichmentDefinition = Object.freeze({
  id: "history-1-enigma-purple-equipes",
  layer: "history",
  anchor: "sec-1-6",
  title: "Enigma e PURPLE: sistemas quebrados por equipes",
  kicker: "História · Segunda Guerra Mundial",
  duration: "9 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Narrativas de “um gênio que quebrou uma máquina” são memoráveis e quase sempre inadequadas. Enigma e PURPLE foram famílias operacionais mutáveis; atacá-las exigiu matemática, linguística, engenharia, interceptação, erro adversário e organização em escala.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Enigma: cooperação antes e durante a guerra</h4>
        <article class="timeline-card">
          <time>Década de 1930</time>
          <h5>O trabalho polonês</h5>
          <p>Marian Rejewski, Jerzy Różycki e Henryk Zygalski, no Biuro Szyfrów, combinaram matemática, material obtido por inteligência e exploração de procedimentos para reconstruir aspectos da Enigma militar e criar métodos e máquinas de ataque.</p>
        </article>
        <article class="timeline-card">
          <time>Julho de 1939 em diante</time>
          <h5>Transferência e escala</h5>
          <p>Às vésperas da guerra, os poloneses compartilharam resultados com britânicos e franceses. Em Bletchley Park, equipes ampliaram e adaptaram o trabalho conforme redes, rotores e procedimentos mudavam. Alan Turing e Gordon Welchman tiveram papéis centrais, mas dentro de uma infraestrutura coletiva.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>PURPLE: reconstruir sem capturar a máquina</h4>
        <article class="timeline-card">
          <time>1939–1940</time>
          <h5>O SIS norte-americano</h5>
          <p>A equipe do Signal Intelligence Service, associada a William Friedman e com contribuições decisivas de especialistas como Genevieve Grotjan, analisou o sistema diplomático japonês chamado PURPLE pelos Estados Unidos.</p>
        </article>
        <article class="timeline-card">
          <time>Engenharia analítica</time>
          <h5>Uma máquina análoga construída a partir do tráfego</h5>
          <p>Os analistas inferiram o comportamento lógico a partir de mensagens interceptadas e construíram equipamentos que reproduziam a função criptográfica relevante. Não precisaram começar com uma máquina japonesa capturada sobre a mesa.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> A contribuição polonesa precedeu a operação de Bletchley Park e foi compartilhada em 1939; a exploração de PURPLE resultou do trabalho de uma equipe multidisciplinar do SIS.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Colocar os casos lado a lado não os torna tecnicamente iguais. A comparação destaca um padrão organizacional: sistemas reais mudam, e a criptoanálise bem-sucedida é uma atividade contínua, coletiva e apoiada em informação operacional.</div>
    <ul class="source-links">
      <li><a href="https://www.nsa.gov/portals/75/documents/about/cryptologic-heritage/historical-figures-publications/publications/wwii/solving_enigma.pdf" target="_blank" rel="noopener noreferrer">Solving the Enigma — National Security Agency</a></li>
      <li><a href="https://bletchleypark.org.uk/wp-content/uploads/record_attachments/1839.pdf" target="_blank" rel="noopener noreferrer">Gordon Welchman e o contexto de Bletchley Park — arquivo do museu</a></li>
      <li><a href="https://www.nsa.gov/History/National-Cryptologic-Museum/Exhibits-Artifacts/Exhibit-View/Article/2718925/the-magic-of-purple/" target="_blank" rel="noopener noreferrer">The MAGIC of PURPLE — National Cryptologic Museum</a></li>
    </ul>`),
  tags: ["história", "Enigma", "PURPLE", "equipes"],
});
