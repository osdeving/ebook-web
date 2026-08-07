import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingAssurances: EnrichmentDefinition = Object.freeze({
  id: "reading-4-nist-garantias-assinatura",
  layer: "reading",
  anchor: "sec-4-1",
  title: "Além da congruência: garantias sobre chave e identidade",
  kicker: "Roteiro de leitura · NIST SP 800-89",
  duration: "45–65 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A recomendação decompõe a confiança em verificações menores. Use-a para auditar a analogia do anel de sinete apresentada no capítulo.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Mapa</span><span class="reading-level">Seções 3–5</span></div><h4>Quatro garantias distintas</h4><p>Defina com suas palavras: validade dos parâmetros de domínio, validade da chave pública, posse da chave privada e identidade do dono.</p><a href="https://doi.org/10.6028/NIST.SP.800-89" target="_blank" rel="noopener noreferrer">Abrir publicação oficial pelo DOI</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Cenário</span><span class="reading-level">Aplicado</span></div><h4>Atualização de software</h4><p>Para a atualização descrita na Observação 4.1, associe cada garantia a uma etapa: fabricação, inclusão da chave inicial, rotação, assinatura do pacote e verificação.</p></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">Limite</span><span class="reading-level">Crítico</span></div><h4>Validade não é autorização eterna</h4><p>Acrescente expiração, revogação, finalidade da chave e carimbo de tempo. Diga quais decisões são matemáticas e quais dependem de política.</p></article>
    </div>`),
  tags: ["leitura", "NIST", "PKI", "identidade", "garantia"],
});
