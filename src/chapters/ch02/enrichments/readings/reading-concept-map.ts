import { defineEnrichment } from "../shared";


export const readingConceptMap = defineEnrichment({
    id: "reading-concept-map",
    layer: "reading",
    anchor: "sec-2-2",
    kicker: "Mapa conceitual",
    title: "Como as ideias do capítulo dependem umas das outras",
    meta: "Navegação por conceitos",
    html: `
      <nav class="concept-map" aria-label="Dependências entre conceitos do capítulo">
        <div class="concept-branches" aria-label="Problemas computacionais de base">
          <a href="#sec-2-2" class="concept-node concept-node--origin"><strong>PLD</strong><span>recuperar o expoente; base dos algoritmos de ataque estudados</span></a>
          <a href="#sec-2-3" class="concept-node concept-node--origin"><strong>PDH</strong><span>calcular g<sup>ab</sup>; problema diretamente ligado à segurança básica do acordo</span></a>
        </div>
        <div class="concept-branches">
          <a href="#sec-2-3" class="concept-node"><strong>Diffie–Hellman</strong><span>sua segurança básica é formulada pelo PDH, não apenas pelo PLD</span></a>
          <a href="#sec-2-4" class="concept-node"><strong>Elgamal</strong><span>transforma o segredo em mascaramento</span></a>
          <a href="#sec-2-6" class="concept-node"><strong>Complexidade</strong><span>mede o custo dos ataques</span></a>
          <a href="#sec-2-7" class="concept-node"><strong>Shanks</strong><span>troca tempo por memória</span></a>
        </div>
        <div class="concept-bridge"><span>Teoria de grupos</span><span>TCR</span></div>
        <div class="concept-branches">
          <a href="#sec-2-9" class="concept-node"><strong>Pohlig–Hellman</strong><span>decompõe pela ordem e recompõe por TCR</span></a>
          <a href="#sec-2-10" class="concept-node"><strong>Corpos finitos</strong><span>ampliam o cenário algébrico</span></a>
        </div>
      </nav>`
  });
