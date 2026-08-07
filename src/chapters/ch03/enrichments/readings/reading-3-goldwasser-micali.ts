import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingGoldwasserMicali: EnrichmentDefinition = Object.freeze({
  id: "reading-3-goldwasser-micali",
  layer: "reading",
  anchor: "sec-3-10",
  title: "Goldwasser–Micali: da residuosidade a um jogo de segurança",
  kicker: "Roteiro de leitura · artigo fundador",
  duration: "90–140 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O artigo é historicamente importante por duas razões inseparáveis: dá uma construção probabilística concreta e muda a linguagem usada para afirmar que uma cifração é segura.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Primeira passagem</span><span class="reading-level">25 min</span></div>
        <h4>Motivação e adversário</h4>
        <p>Leia resumo, introdução e a discussão de “informação parcial”. Sem entrar ainda na construção, escreva quem escolhe as chaves, o que é público, que recursos limitam o adversário e qual vantagem seria proibida.</p>
        <a href="https://doi.org/10.1145/800070.802212" target="_blank" rel="noopener noreferrer">Abrir a versão da STOC 1982 na ACM</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Construção</span><span class="reading-level">35 min</span></div>
        <h4>Um bit por classe de residuosidade</h4>
        <p>Reconstrua geração, cifração e decifração. Para cada bit, identifique onde entra aleatoriedade nova. Prove a correção usando símbolos de Legendre/Jacobi e explique por que conhecer a fatoração muda o teste disponível ao destinatário.</p>
        <a href="https://www.sciencedirect.com/science/article/pii/0022000084900709" target="_blank" rel="noopener noreferrer">Abrir a versão ampliada no JCSS</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Redução</span><span class="reading-level">30–60 min</span></div>
        <h4>Da quebra ao problema difícil</h4>
        <p>Faça um diagrama: instância de residuosidade → chave/texto cifrado simulado → saída do adversário → resposta à instância. Marque exatamente onde a hipótese é usada e que distribuição precisa permanecer indistinguível.</p>
      </article>
    </div>
    <h4>Questão de síntese</h4>
    <p>O esquema expande muito a mensagem, pois cifra bits individualmente. Explique por que isso não diminui sua importância teórica: a meta do artigo é demonstrar que a definição é alcançável sob uma hipótese explícita.</p>
    <div class="source-note"><strong>Fato documentado.</strong> A primeira versão foi publicada na STOC 1982; a versão ampliada, no JCSS em 1984. O resumo desta última anuncia um novo modelo probabilístico e a ocultação de toda informação parcial computável.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Ler apenas o esquema perde metade da contribuição. A construção é o exemplo; a definição e a redução são a tecnologia intelectual reutilizável.</div>
    <ul class="source-links">
      <li><a href="https://people.csail.mit.edu/joanne/shafi-pubs.html" target="_blank" rel="noopener noreferrer">Lista de publicações de Shafi Goldwasser — MIT CSAIL</a></li>
    </ul>`),
  tags: ["leitura", "Goldwasser–Micali", "residuosidade quadrática", "redução"],
});
