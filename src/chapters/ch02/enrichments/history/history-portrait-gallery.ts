import { defineEnrichment } from "../shared";

const portraitBase = `${import.meta.env.BASE_URL}assets/portraits/`;

export const historyPortraitGallery = defineEnrichment({
      id: "history-portrait-gallery",
      layer: "history",
      anchor: "sec-2-4",
      kicker: "Complemento editorial · Pessoas",
      title: "Três rostos, três papéis diferentes",
      meta: "Retratos com licenças abertas e créditos completos",
      html: `
        <div class="portrait-grid">
          <figure class="portrait-card">
            <img src="${portraitBase}whitfield-diffie.webp" alt="Retrato de Whitfield Diffie, de cabelos brancos compridos e barba branca" loading="lazy" width="480" height="480">
            <figcaption><strong>Whitfield Diffie</strong><span>Coautor do artigo de 1976 e do acordo de chaves hoje chamado Diffie–Hellman.</span><small>Derivado por recorte e conversão de <a href="https://commons.wikimedia.org/wiki/File:Whitfield_Diffie_Royal_Society.jpg" target="_blank" rel="noopener noreferrer">foto de Duncan Hull / The Royal Society</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="license noopener noreferrer">CC BY-SA 4.0</a></small></figcaption>
          </figure>
          <figure class="portrait-card">
            <img src="${portraitBase}ralph-merkle.webp" alt="Retrato de Ralph Merkle em ambiente externo" loading="lazy" width="480" height="480">
            <figcaption><strong>Ralph Merkle</strong><span>Autor dos quebra-cabeças de Merkle, proposta aberta de estabelecimento de chave com vantagem quadrática de trabalho.</span><small>Derivado por recorte e conversão de <a href="https://commons.wikimedia.org/wiki/File:Ralph_Merkle.png" target="_blank" rel="noopener noreferrer">foto de David Orban</a> · <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="license noopener noreferrer">CC BY 2.0</a></small></figcaption>
          </figure>
          <figure class="portrait-card">
            <img src="${portraitBase}taher-elgamal.webp" alt="Retrato de Taher Elgamal usando óculos" loading="lazy" width="480" height="480">
            <figcaption><strong>Taher Elgamal</strong><span>Autor, em 1985, de uma cifração probabilística e de um esquema de assinatura baseados em logaritmos discretos.</span><small>Derivado por recorte e conversão de <a href="https://commons.wikimedia.org/wiki/File:Taher_Elgamal_it-sa_2010.jpg" target="_blank" rel="noopener noreferrer">foto de Alexander Klink</a> · <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="license noopener noreferrer">CC BY 3.0</a></small></figcaption>
          </figure>
        </div>
        <p class="asset-credit-link">Arquivos, transformações e links diretos de licença: <a href="${portraitBase}CREDITS.md" target="_blank" rel="noopener noreferrer">CREDITS.md</a>.</p>`
    });
