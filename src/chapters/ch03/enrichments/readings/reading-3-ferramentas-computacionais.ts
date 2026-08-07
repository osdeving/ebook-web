import type { EnrichmentDefinition } from "../../../../framework/types";
import { trustedHtml } from "../../../../framework/trusted-html";

export const readingComputationalTools: EnrichmentDefinition = Object.freeze({
  id: "reading-3-ferramentas-computacionais",
  layer: "reading",
  anchor: "sec-3-7",
  title: "Sage, PARI/GP e CADO-NFS: três escalas de experimento",
  kicker: "Roteiro de leitura · ferramentas",
  duration: "60–120 min",
  collapsible: true,
  content: trustedHtml(String.raw`
    <p class="supplement-lead">As três ferramentas se sobrepõem, mas não têm o mesmo papel. Sage favorece exploração matemática integrada; PARI/GP expõe rotinas de teoria dos números com baixo atrito; CADO-NFS é um sistema especializado para campanhas de NFS.</p>
    <div class="reading-grid">
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">SageMath</span><span class="reading-level">Exploração</span></div>
        <h4>Objetos fatorados, provas e backends</h4>
        <p>Leia a documentação de <code>factor</code> e do objeto <code>Factorization</code>. Descubra quando a saída é uma prova, um resultado provável ou uma chamada a software externo. Compare <code>is_prime</code> e <code>is_pseudoprime</code> antes de confiar em um experimento.</p>
        <a href="https://doc.sagemath.org/html/en/reference/structure/sage/structure/factorization.html" target="_blank" rel="noopener noreferrer">Abrir a referência de fatoração do SageMath</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">PARI/GP</span><span class="reading-level">Laboratório numérico</span></div>
        <h4>Consulte contratos, não apenas nomes</h4>
        <p>No índice do manual, procure <code>factorint</code>, <code>isprime</code>, <code>ispseudoprime</code> e <code>kronecker</code>. Para cada função, registre limite, opção que muda o algoritmo e sentido exato do retorno.</p>
        <a href="https://pari.math.u-bordeaux.fr/pub/pari/manuals/2.18.0/users.pdf" target="_blank" rel="noopener noreferrer">Abrir o manual oficial do PARI/GP 2.18</a>
      </article>
      <article class="reading-card">
        <div class="reading-card-top"><span class="reading-badge">CADO-NFS</span><span class="reading-level">Especializado</span></div>
        <h4>Leia o pipeline antes de executar</h4>
        <p>Mapeie seleção de polinômios, crivagem, filtragem, álgebra linear e raiz quadrada para diretórios e parâmetros do projeto. Comece apenas com exemplos didáticos: uma execução séria exige estimar CPU, RAM, armazenamento e arquivos intermediários.</p>
        <a href="https://gitlab.inria.fr/cado-nfs/cado-nfs" target="_blank" rel="noopener noreferrer">Abrir o repositório oficial do CADO-NFS no Inria</a>
      </article>
    </div>
    <h4>Experimento comparável</h4>
    <p>Escolha três inteiros pequenos: um com fator pequeno, um com \(p-1\) suave e um semiprimo equilibrado. Em cada ambiente, registre algoritmo escolhido, tempo, evidência de correção e versão. O objetivo não é disputar velocidade, mas descobrir decisões automáticas escondidas por uma chamada simples.</p>
    <div class="watch-out-inline"><strong>Limite de uso.</strong> Um comando que gera ou fatora inteiros para estudo não é, por si só, uma implementação criptográfica segura. Aleatoriedade, tempo constante, descarte de segredos e validação de parâmetros exigem contratos próprios.</div>
    <div class="source-note"><strong>Fato documentado.</strong> Os links levam à documentação oficial do SageMath, ao manual distribuído pelo projeto PARI/GP da Université de Bordeaux e ao repositório oficial do CADO-NFS hospedado pelo Inria.</div>
    <div class="source-note"><strong>Interpretação editorial.</strong> Ferramentas ensinam melhor quando tornam o algoritmo mais visível, não quando substituem a pergunta matemática por uma saída. Versionar o experimento é parte da explicação.</div>
    <ul class="source-links">
      <li><a href="https://doc.sagemath.org/html/en/reference/interfaces/sage/interfaces/ecm.html" target="_blank" rel="noopener noreferrer">Interface ECM no SageMath</a></li>
      <li><a href="https://cado-nfs.gitlabpages.inria.fr/building.html" target="_blank" rel="noopener noreferrer">Instruções oficiais de compilação do CADO-NFS</a></li>
    </ul>`),
  tags: ["leitura", "SageMath", "PARI/GP", "CADO-NFS"],
});
