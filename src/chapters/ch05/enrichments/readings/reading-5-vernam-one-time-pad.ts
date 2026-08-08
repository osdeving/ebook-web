import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingVernamOtp: EnrichmentDefinition = Object.freeze({
  id: "reading-5-vernam-one-time-pad",
  layer: "reading",
  anchor: "sec-5-6-1",
  title: "Do relé de Vernam às hipóteses do one-time pad",
  kicker: "Roteiro de leitura · patente e arquivo NSA",
  duration: "55–85 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">A patente descreve uma máquina; o teorema descreve uma distribuição. Coloque os dois lado a lado e descubra quais decisões transformam o dispositivo em um one-time pad com sigilo perfeito.</p>
    <div class="reading-grid">
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">US 1,310,719</span><span class="reading-level">Patente</span></div><h4><em>Secret signaling system</em></h4><p>Leia objetivo, diagramas e reivindicações iniciais. Identifique mensagem, impulsos cifrantes, operação de combinação e processo inverso. A patente exige que a fita seja uniforme, tão longa quanto a mensagem e usada apenas uma vez?</p><a href="https://patents.google.com/patent/US1310719A/en" target="_blank" rel="noopener noreferrer">Abrir patente e desenhos</a></article>
      <article class="reading-card"><div class="reading-card-top"><span class="reading-badge">1919</span><span class="reading-level">Contexto</span></div><h4>O papel de Joseph Mauborgne</h4><p>Leia a biografia institucional e confronte sua afirmação sobre o aperfeiçoamento do sistema com o documento de patente. Separe invenção do mecanismo, escolha de chave aleatória e regra de uso único.</p><a href="https://www.nsa.gov/press-room/digital-media-center/biographies/biography-view-page/article/3903416/mg-joseph-o-mauborgne-usa/" target="_blank" rel="noopener noreferrer">Abrir Cryptologic Hall of Honor da NSA</a></article>
    </div>
    <h4>Produto da leitura</h4><p>Desenhe um contrato de segurança com quatro pré-condições: distribuição, independência, comprimento e descarte da chave. Para cada uma, invente uma violação e calcule ou explique a informação que pode vazar.</p>`),
  tags: ["leitura", "Vernam", "Mauborgne", "one-time pad", "patente"],
});
