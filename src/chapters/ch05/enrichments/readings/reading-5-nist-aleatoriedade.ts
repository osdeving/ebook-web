import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingNistRandomness: EnrichmentDefinition = Object.freeze({
  id: "reading-5-nist-aleatoriedade",
  layer: "reading",
  anchor: "sec-5-3-4",
  title: "Probabilidade no papel, bits aleatórios no sistema",
  kicker: "Roteiro de leitura · NIST SP 800-90",
  duration: "50–80 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">Uma variável aleatória é um objeto do modelo; um gerador de bits é um componente de sistema. Este roteiro usa documentos do NIST para impedir que as duas camadas sejam confundidas.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">SP 800-90A</span><span class="reading-level">Construção</span></div><h4>Geradores determinísticos</h4><p>Leia resumo, escopo e o modelo funcional da Rev. 1. Liste entradas, estado interno e saídas de um DRBG. Onde entra entropia externa e em que sentido a saída continua sendo produzida deterministicamente?</p><a href="https://csrc.nist.gov/pubs/sp/800/90/a/r1/final" target="_blank" rel="noopener noreferrer">Abrir SP 800-90A Rev. 1</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">CAVP</span><span class="reading-level">Validação</span></div><h4>Vetores de teste não criam aleatoriedade</h4><p>Leia a observação do programa de validação sobre vetores de teste. Explique por que reproduzir exatamente uma saída esperada é útil para conferir implementação, mas não demonstra imprevisibilidade da fonte usada em produção.</p><a href="https://csrc.nist.gov/Projects/Cryptographic-Algorithm-Validation-Program/Random-Number-Generators" target="_blank" rel="noopener noreferrer">Consultar testes de DRBG do NIST</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Construa uma tabela com “modelo probabilístico”, “fonte de entropia”, “condicionamento”, “DRBG” e “teste de implementação”. Para cada linha, escreva o que ela garante e uma garantia que ela não oferece.</p>`),
  tags: ["leitura", "NIST", "DRBG", "aleatoriedade"],
});
