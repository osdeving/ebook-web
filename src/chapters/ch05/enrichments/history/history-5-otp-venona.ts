import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const historyOtpVenona: EnrichmentDefinition = Object.freeze({
  id: "history-5-otp-venona",
  layer: "history",
  anchor: "sec-5-6-1",
  title: "One-time pad: da patente à lição operacional do VENONA",
  kicker: "História · 1917–1995",
  duration: "13 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">O one-time pad ocupa um lugar incomum: seu sigilo perfeito pode ser provado, mas sua segurança operacional pode ruir por uma única decisão logística — repetir material de chave.</p>
    <div class="history-tracks">
      <section class="history-track">
        <h4>Construção e prova</h4>
        <article class="timeline-card"><span class="timeline-label">1917–1919</span><h5>Vernam automatiza a combinação de sinais</h5><p>Gilbert Vernam desenvolveu para telegrafia um sistema que combinava impulsos da mensagem e de uma fita cifrante. A patente de 1919 descreve o mecanismo elétrico; a página histórica da NSA credita Joseph Mauborgne pela forma aperfeiçoada com chave aleatória usada uma única vez.</p></article>
        <article class="timeline-card"><time>1949</time><h5>Shannon formaliza a garantia</h5><p>Com chave uniforme, independente, tão longa quanto a mensagem e jamais reutilizada, observar o criptograma não muda as probabilidades das mensagens. A prova é matemática, mas cada adjetivo da hipótese precisa sobreviver à implementação.</p></article>
      </section>
      <section class="history-track history-track--open">
        <h4>Falha de operação</h4>
        <article class="timeline-card"><span class="timeline-label">1943–1980</span><h5>VENONA explora tráfego soviético</h5><p>O Signal Intelligence Service dos Estados Unidos iniciou o programa que depois recebeu o nome VENONA. A história institucional da NSA relata como criptanalistas exploraram comunicações diplomáticas e de espionagem soviéticas protegidas por aditivos de one-time pad.</p></article>
        <article class="timeline-card"><time>1995</time><h5>As traduções começam a ser desclassificadas</h5><p>A reutilização de páginas de chave criou “profundidades”: ao combinar dois criptogramas produzidos com o mesmo aditivo, a chave se cancela e resta uma relação entre mensagens. As liberações públicas permitem estudar o efeito sem confundir a falha de uso com uma refutação do teorema de sigilo perfeito.</p></article>
      </section>
    </div>
    <p class="source-note"><strong>Lição de engenharia.</strong> Segurança demonstrável é uma implicação: se as hipóteses forem satisfeitas, a propriedade segue. VENONA mostra por que geração, distribuição, inventário, sincronização e destruição de chaves fazem parte do sistema criptográfico.</p>
    <ul class="source-links">
      <li><a href="https://patents.google.com/patent/US1310719A/en" target="_blank" rel="noopener noreferrer">Patente US 1,310,719 de Gilbert Vernam</a></li>
      <li><a href="https://www.nsa.gov/press-room/digital-media-center/biographies/biography-view-page/article/3903416/mg-joseph-o-mauborgne-usa/" target="_blank" rel="noopener noreferrer">Joseph Mauborgne — Cryptologic Hall of Honor da NSA</a></li>
      <li><a href="https://www.nsa.gov/portals/75/documents/about/cryptologic-heritage/historical-figures-publications/publications/coldwar/venona_story.pdf" target="_blank" rel="noopener noreferrer">A história do VENONA — publicação institucional da NSA</a></li>
      <li><a href="https://www.nsa.gov/Helpful-Links/NSA-FOIA/Declassification-Transparency-Initiatives/Historical-Releases/Venona/lang/en/" target="_blank" rel="noopener noreferrer">Coleção de traduções e documentos VENONA desclassificados</a></li>
    </ul>`),
  tags: ["história", "one-time pad", "VENONA", "reutilização de chave"],
});
