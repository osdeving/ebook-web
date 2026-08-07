import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyAlKindiFrequencies: EnrichmentDefinition = Object.freeze({
  id: "history-1-al-kindi-frequencias",
  layer: "history",
  anchor: "sec-1-1-1",
  title: "Al-Kindi e a passagem do segredo para a estatística",
  kicker: "História · criptoanálise",
  duration: "7 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Uma substituição monoalfabética esconde quais símbolos representam quais letras, mas não destrói todos os hábitos da língua. A tradição associada a al-Kindi tornou essa sobra de estrutura um método de investigação.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Contexto documentado</h4>
        <article class="timeline-card">
          <time>Século IX</time>
          <h5>Um ambiente de tradução e análise textual</h5>
          <p>Yaʿqūb ibn Isḥāq al-Kindi trabalhou no mundo intelectual abássida, no qual matemática, filosofia, linguística e tradução se encontravam. Um tratado preservado e atribuído a ele descreve como comparar a incidência dos símbolos de um criptograma com a incidência esperada das letras de uma língua.</p>
        </article>
        <article class="timeline-card">
          <time>Procedimento</time>
          <h5>Contar, propor, testar</h5>
          <p>O método não se encerra ao identificar o símbolo mais frequente. Frequências sugerem correspondências; padrões de repetição, palavras curtas e combinações plausíveis confirmam ou rejeitam cada hipótese. É uma investigação iterativa, não uma simples consulta a uma tabela.</p>
        </article>
      </section>
      <section class="history-track history-track--open">
        <h4>Limites que importam</h4>
        <article class="timeline-card">
          <time>Dependência da língua</time>
          <h5>Não existe frequência universal</h5>
          <p>Árabe, português e inglês distribuem letras de maneiras distintas. Tema, autor, gênero, ortografia e tamanho da amostra também mudam o perfil. Uma cifra curta pode se afastar bastante da média de um corpus.</p>
        </article>
        <article class="timeline-card">
          <time>Dependência do sistema</time>
          <h5>A técnica explora uma invariância específica</h5>
          <p>Numa substituição fixa, todas as ocorrências de uma letra seguem juntas para o mesmo símbolo. Substituições homofônicas e polialfabéticas dispersam esse sinal; substituições poligráficas clássicas também reorganizam padrões ao operar sobre grupos de letras. A evolução das cifras e a da criptoanálise avançam em resposta uma à outra, embora cada sistema tenha motivações históricas mais amplas.</p>
        </article>
      </section>
    </div>
    <div class="source-note"><strong>Fato documentado.</strong> A fonte museológica universitária descreve o tratado atribuído a al-Kindi como o relato detalhado mais antigo preservado desse tipo de análise.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Chamá-lo de início da “criptoanálise científica” é uma síntese historiográfica útil, não a prova de que ninguém antes contou símbolos. O que sobreviveu no registro e o que primeiro ocorreu não são necessariamente a mesma coisa.</div>
    <ul class="source-links">
      <li><a href="https://www.une.edu.au/info-for/visitors/museums/museum-of-antiquities/codebreaker-challenge/alberti-cipher" target="_blank" rel="noopener noreferrer">Codebreaker Challenge: al-Kindi, frequências e Alberti — University of New England</a></li>
    </ul>`),
  tags: ["história", "al-Kindi", "análise de frequência"],
});
