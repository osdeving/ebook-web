import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingOperationalEntropy: EnrichmentDefinition = Object.freeze({
  id: "reading-5-entropia-operacional",
  layer: "reading",
  anchor: "sec-5-6-2",
  title: "Quando “entropia” vira requisito de uma fonte",
  kicker: "Roteiro de leitura · NIST SP 800-90B e IR 8427",
  duration: "60–95 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A entropia de Shannon mede incerteza média. Sistemas criptográficos frequentemente precisam controlar o resultado mais previsível; o NIST usa min-entropia para esse fim. O nome compartilhado não torna as medidas intercambiáveis.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">SP 800-90B</span><span class="reading-level">Fonte</span></div><h4>Modelo, estimativa e testes de saúde</h4><p>Leia as Seções 2 e 3 e o aviso de errata na página da publicação. Identifique fonte de ruído, condicionamento, trajetórias IID/não IID, estimativa inicial e testes contínuos. Qual parte é uma hipótese sobre o processo físico?</p><a href="https://csrc.nist.gov/pubs/sp/800/90/b/final" target="_blank" rel="noopener noreferrer">Abrir SP 800-90B e errata</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">IR 8427</span><span class="reading-level">Min-entropia</span></div><h4>A hipótese de entropia plena</h4><p>Leia o resumo e a definição operacional de cadeia de entropia plena. Compare \(H(X)\), a entropia média do capítulo, com \(H_\infty(X)=-\log_2\max_x P(X=x)\). Calcule ambas para uma moeda com probabilidade \(0{,}9\) de cara.</p><a href="https://csrc.nist.gov/pubs/ir/8427/final" target="_blank" rel="noopener noreferrer">Abrir NIST IR 8427</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Escreva uma ficha de ameaça para uma fonte hipotética de bits: adversário, variáveis ambientais, dependências temporais, evento mais provável, condicionamento e reação a falhas. Não conclua “segura” apenas porque uma amostra passou por testes estatísticos.</p>`),
  tags: ["leitura", "entropia", "min-entropia", "NIST"],
});
