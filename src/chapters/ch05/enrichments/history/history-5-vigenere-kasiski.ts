import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyVigenereKasiski: EnrichmentDefinition = Object.freeze({
  id: "history-5-vigenere-kasiski",
  layer: "history",
  anchor: "sec-5-2-1",
  title: "Da tabela de Vigenère ao teste de repetições de Kasiski",
  kicker: "História · 1586–1863",
  duration: "10 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A cifra e sua criptoanálise nasceram em livros separados por quase três séculos. Ler os dois documentos evita uma narrativa enganosa: uma construção não traz consigo, automaticamente, a linguagem estatística que acabará por quebrá-la.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Construir e descrever</h4>
        <article class="timeline-card"><time>1586</time><h5>Vigenère publica o <em>Traicté des chiffres</em></h5><p>O tratado de Blaise de Vigenère reúne vários modos de escrita secreta e tabelas de alfabetos deslocados. O objeto histórico é mais amplo que a cifra periódica hoje batizada com seu nome; por isso, “cifra de Vigenère” é uma etiqueta moderna útil, mas não um resumo fiel do livro inteiro.</p></article>
        <article class="timeline-card"><span class="timeline-label">Chave repetida</span><h5>A conveniência introduz estrutura</h5><p>Repetir uma palavra-chave transforma uma sequência potencialmente longa de deslocamentos em um padrão periódico. Essa periodicidade é operacionalmente prática e, ao mesmo tempo, cria classes de posições cifradas pelo mesmo deslocamento.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>Medir e atacar</h4>
        <article class="timeline-card"><time>1863</time><h5>Kasiski publica um método sistemático</h5><p>Em <em>Die Geheimschriften und die Dechiffrir-Kunst</em>, Friedrich Wilhelm Kasiski organiza a busca por repetições e suas distâncias. Fatores comuns dessas distâncias sugerem o período da chave; conhecido o período, o problema se decompõe em várias cifras monoalfabéticas.</p></article>
        <article class="timeline-card"><span class="timeline-label">No capítulo</span><h5>Repetição vira evidência, não certeza</h5><p>Uma sequência repetida pode ocorrer por acaso. O valor do teste está em acumular indícios: comprimentos, múltiplas distâncias, divisores comuns e frequências por coluna. A criptoanálise aqui é uma inferência estatística, não uma regra infalível.</p></article>
      </section>
    </div>
    <p class="source-note"><strong>Cuidado historiográfico.</strong> O nome moderno da cifra comprime uma família de técnicas. Os fac-símiles abaixo permitem conferir o que os autores efetivamente publicaram, em vez de projetar a descrição escolar atual sobre os textos antigos.</p>
    <ul class="source-links">
      <li><a href="https://donum.uliege.be/handle/2268.1/9711" target="_blank" rel="noopener noreferrer">Vigenère — edição de 1586 digitalizada pela Universidade de Liège</a></li>
      <li><a href="https://books.google.de/books?hl=de&amp;id=I1PgeY9uJ08C" target="_blank" rel="noopener noreferrer">Kasiski — livro de 1863, exemplar da Biblioteca Nacional Austríaca</a></li>
      <li><a href="https://katalog.slub-dresden.de/id/0-1476519498" target="_blank" rel="noopener noreferrer">Registro bibliográfico institucional da SLUB Dresden</a></li>
    </ul>`),
  tags: ["história", "Vigenère", "Kasiski", "criptoanálise"],
});
