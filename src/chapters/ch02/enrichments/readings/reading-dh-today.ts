import { defineEnrichment, readingCard } from "../shared";

export const readingDhToday = defineEnrichment({
      id: "reading-dh-today",
      layer: "reading",
      anchor: "sec-2-3",
      kicker: "Para saber mais · contexto atual",
      title: "Do protocolo didático à engenharia de chaves",
      meta: "Normas modernas · verificado em agosto de 2026",
      html: `<p class="supplement-lead">O protocolo do capítulo apresenta o núcleo matemático. Sistemas reais acrescentam autenticação, validação de chaves públicas, derivação de chaves, escolha cuidadosa de grupos e resistência a ataques de implementação.</p>
        <div class="reading-grid">
          ${readingCard({ badge: "Recomendação", title: "NIST SP 800-56A Rev. 3", why: "Especifica esquemas de estabelecimento de chaves baseados em logaritmos discretos em corpos finitos e curvas elípticas. Serve para ver quais camadas de engenharia cercam a igualdade matemática.", href: "https://csrc.nist.gov/pubs/sp/800/56/a/r3/final", source: "NIST", level: "Avançado" })}
          ${readingCard({ badge: "Padrão Internet", title: "RFC 7919 — grupos FFDHE", why: "Mostra grupos finitos nomeados, negociação de parâmetros e considerações de segurança para Diffie–Hellman efêmero em TLS.", href: "https://www.rfc-editor.org/info/rfc7919/", source: "RFC Editor", level: "Avançado" })}
        </div>
        <div class="watch-out-inline"><strong>Limite didático.</strong> Os números pequenos dos laboratórios tornam cada conta visível; eles não são parâmetros seguros e não devem ser copiados para software criptográfico.</div>`
    });
