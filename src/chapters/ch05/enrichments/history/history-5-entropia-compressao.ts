import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyEntropyCompression: EnrichmentDefinition = Object.freeze({
  id: "history-5-entropia-compressao",
  layer: "history",
  anchor: "sec-5-6-3",
  title: "Da entropia à compressão: Shannon, Huffman, Ziv e Lempel",
  kicker: "História · 1948–1978",
  duration: "12 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Entropia não é um algoritmo de compressão. Ela estabelece uma escala e um limite; códigos concretos precisam transformar probabilidades ou repetições observadas em representações decodificáveis.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Do limite ao código</h4>
        <article class="timeline-card"><time>1948</time><h5>Shannon relaciona informação e comprimento médio</h5><p>Para fontes probabilísticas, o teorema de codificação de fonte liga a entropia à taxa atingível por compressão sem perdas em blocos longos. Símbolos raros carregam mais surpresa e, idealmente, recebem descrições mais longas.</p></article>
        <article class="timeline-card"><time>1952</time><h5>Huffman constrói códigos de redundância mínima</h5><p>David Huffman apresenta um procedimento ótimo para códigos de prefixo símbolo a símbolo com probabilidades dadas. Combinar repetidamente os pesos menores produz uma árvore cuja profundidade determina o comprimento de cada palavra-código.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>Aprender a estrutura da sequência</h4>
        <article class="timeline-card"><time>1977</time><h5>Ziv e Lempel propõem compressão universal sequencial</h5><p>O algoritmo explora trechos já vistos sem exigir que transmissor e receptor conheçam previamente a distribuição da fonte. Ponteiros e comprimentos substituem repetições por referências ao passado.</p></article>
        <article class="timeline-card"><time>1978</time><h5>Uma segunda construção organiza frases</h5><p>A versão de 1978 constrói incrementalmente um dicionário de frases. As duas ideias deram origem a muitas variantes práticas, mas o ponto conceitual comum é aprender regularidade durante a leitura da própria sequência.</p></article>
      </section>
    </div>
    <p class="source-note"><strong>Conexão com criptografia.</strong> Redundância ajuda a comprimir e também ajuda a reconhecer texto correto em criptoanálise. Já um criptograma bem protegido deve esconder esses padrões; comprimir antes de cifrar e autenticar exige ainda considerar metadados e canais laterais.</p>
    <ul class="source-links">
      <li><a href="https://doi.org/10.1002/j.1538-7305.1948.tb01338.x" target="_blank" rel="noopener noreferrer">Shannon — teoria matemática da comunicação (1948)</a></li>
      <li><a href="https://doi.org/10.1109/JRPROC.1952.273898" target="_blank" rel="noopener noreferrer">Huffman — códigos de redundância mínima (1952)</a></li>
      <li><a href="https://www.itsoc.org/publications/papers/a-universal-algorithm-for-sequential-data-compression" target="_blank" rel="noopener noreferrer">Ziv e Lempel — artigo de 1977 na IEEE Information Theory Society</a></li>
      <li><a href="https://doi.org/10.1109/TIT.1978.1055934" target="_blank" rel="noopener noreferrer">Ziv e Lempel — codificação de taxa variável (1978)</a></li>
    </ul>`),
  tags: ["história", "entropia", "compressão", "Huffman", "Lempel–Ziv"],
});
