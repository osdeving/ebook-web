import { defineEnrichment } from "../shared";


export const historyPublicKeyTwoTracks = defineEnrichment({
      id: "history-public-key-two-tracks",
      layer: "history",
      anchor: "exp-2-1-public-private-key",
      kicker: "Complemento editorial · História",
      title: "Duas trilhas para uma revolução criptográfica",
      meta: "Linha do tempo · fontes institucionais e artigos originais",
      html: String.raw`
        <p class="supplement-lead">A história da chave pública não é uma fila simples de descobertas. Parte do trabalho ocorreu sob sigilo governamental; outra parte nasceu em pesquisa aberta e pôde ser publicada, discutida e transformada numa área acadêmica.</p>
        <div class="history-tracks" aria-label="Linha do tempo em duas trilhas">
          <section class="history-track">
            <h4>Trabalho então sigiloso</h4>
            <article class="timeline-card"><time>Fim dos anos 1960</time><h5>James Ellis</h5><p>Formula no GCHQ a possibilidade de uma “cifração não secreta”: a regra usada para proteger poderia ser pública sem tornar pública a informação necessária para desfazê-la.</p></article>
            <article class="timeline-card"><time>1973–1974</time><h5>Clifford Cocks e Malcolm Williamson</h5><p>Cocks encontra uma realização baseada em aritmética que antecipa a ideia do RSA; Williamson desenvolve um mecanismo de estabelecimento de segredo aparentado ao que depois seria conhecido publicamente como Diffie–Hellman.</p></article>
            <article class="timeline-card"><time>1997</time><h5>Reconhecimento público</h5><p>O trabalho do GCHQ é revelado publicamente. Essa divulgação tardia ajuda a explicar por que a cronologia de invenção e a cronologia de publicação não coincidem.</p></article>
          </section>
          <section class="history-track history-track--open">
            <h4>Pesquisa aberta</h4>
            <article class="timeline-card"><time>1974–1978</time><h5>Ralph Merkle: proposta e publicação</h5><p>Desenvolve os “quebra-cabeças de Merkle”, um método de estabelecer uma chave por canal aberto com vantagem de trabalho para os participantes legítimos; o artigo aparece em 1978.</p></article>
            <article class="timeline-card"><time>1976</time><h5>Diffie e Hellman</h5><p>Publicam <em>New Directions in Cryptography</em>, sistematizando chave pública, assinaturas digitais e um método prático de acordo de chaves.</p></article>
            <article class="timeline-card"><time>1978</time><h5>Pohlig e Hellman: algoritmo de ataque</h5><p>Publicam um algoritmo para calcular logaritmos discretos que explora a fatoração da ordem do grupo. Trata-se de um algoritmo para resolver o PLD, não de um novo sistema criptográfico.</p></article>
            <article class="timeline-card"><time>1985</time><h5>Elgamal: criptossistema e assinatura</h5><p>Taher Elgamal publica separadamente uma cifração probabilística e um esquema de assinatura, ambos baseados na estrutura algébrica associada a Diffie–Hellman.</p></article>
          </section>
        </div>
        <div class="source-note"><strong>Por que mostrar duas trilhas?</strong> Para distinguir três coisas: ter uma ideia, construir um método e conseguir publicá-lo para que outras pessoas o verifiquem e desenvolvam.</div>
        <div class="source-note"><strong>Precisão bibliográfica.</strong> O texto traduzido afirma que o artigo de Merkle apareceu em 1982. A cópia da publicação original ligada abaixo identifica <em>Communications of the ACM</em>, abril de 1978. A tradução permanece intocada; esta linha do tempo segue a data impressa no artigo e registra a divergência em vez de corrigi-la silenciosamente.</div>
        <ul class="source-links">
          <li><a href="https://www.gchq.gov.uk/person/james-ellis" target="_blank" rel="noopener noreferrer">James Ellis — GCHQ</a></li>
          <li><a href="https://computerhistory.org/profile/ralph-merkle/" target="_blank" rel="noopener noreferrer">Ralph Merkle — Computer History Museum</a></li>
          <li><a href="https://ee.stanford.edu/~hellman/publications/24.pdf" target="_blank" rel="noopener noreferrer">Artigo de Diffie e Hellman, 1976</a></li>
        </ul>`
    });
