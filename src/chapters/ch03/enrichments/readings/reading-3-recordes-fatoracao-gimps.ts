import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingFactoringRecordsAndGimps: EnrichmentDefinition = Object.freeze({
  id: "reading-3-recordes-fatoracao-gimps",
  layer: "reading",
  anchor: "sec-3-7-3",
  title: "Como ler um recorde: fatoração não é descoberta de primo",
  kicker: "Roteiro de leitura · registros atuais",
  duration: "45–75 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Números com milhões de algarismos e módulos RSA com centenas de dígitos aparecem juntos em notícias, mas registram tarefas computacionais diferentes. Este roteiro foi conferido em <time datetime="2026-08-07">7 de agosto de 2026</time>.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Fatoração</span><span class="reading-level">RSA-240/250</span></div>
        <h4>Leia um relatório de campanha GNFS</h4>
        <p>Na tabela de custos, separe seleção de polinômios, crivagem, filtragem, álgebra linear e raiz quadrada. Confirme os fatores multiplicando-os ou usando um certificado independente; não use apenas o número de dígitos como medida de custo.</p>
        <a href="https://arxiv.org/abs/2006.06197" target="_blank" rel="noopener noreferrer">Abrir o relatório de RSA-240 e RSA-250</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Primalidade</span><span class="reading-level">GIMPS</span></div>
        <h4>Leia o registro oficial de um primo de Mersenne</h4>
        <p>O GIMPS lista \(2^{136279841}-1\), com 41.024.320 algarismos, como o 52º primo de Mersenne conhecido, descoberto por Luke Durant em 12 de outubro de 2024. Procure no comunicado como o teste foi verificado de modo independente.</p>
        <a href="https://www.mersenne.org/primes/?press=M136279841" target="_blank" rel="noopener noreferrer">Abrir o comunicado oficial do GIMPS</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">Proveniência</span><span class="reading-level">Institucional</span></div>
        <h4>Compare relatório e notícia</h4>
        <p>A notícia do Inria sobre RSA-240 registra escala e participantes; o artigo registra parâmetros reprodutíveis. Anote o que cada gênero comunica bem e o que só a fonte técnica permite conferir.</p>
        <a href="https://www.inria.fr/en/computation-record-computer-security" target="_blank" rel="noopener noreferrer">Ler o registro institucional do Inria</a>
      </article>
    </div>
    <div class="watch-out-inline"><strong>Duas tarefas.</strong> Para RSA-250, conhece-se um composto e procuram-se seus fatores. Para um candidato de Mersenne, conhece-se a expressão do número e testa-se se ele é primo. O segundo ser muito maior não significa que se fatorou um inteiro daquele tamanho.</div>
    <div class="source-note"><strong>Fato documentado.</strong> O relatório de 2020 fornece as fatorações de RSA-240 (795 bits) e RSA-250 (829 bits). O site oficial do GIMPS, consultado na data acima, apresenta \(M_{136279841}\) como seu recorde corrente.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> “Recorde” só é uma comparação válida depois de fixar a tarefa, a família de números, o modelo de custo e a forma de verificação. Trate listas vivas como dados datados, não como fatos eternos.</div>
    <ul class="source-links">
      <li><a href="https://www.mersenne.org/primes/" target="_blank" rel="noopener noreferrer">Lista oficial de primos de Mersenne conhecidos</a></li>
    </ul>`),
  tags: ["leitura", "recordes", "RSA-250", "GIMPS"],
});
