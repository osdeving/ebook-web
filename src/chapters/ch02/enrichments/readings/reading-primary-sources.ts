import { defineEnrichment, readingCard } from "../shared";

export const readingPrimarySources = defineEnrichment({
      id: "reading-primary-sources",
      layer: "reading",
      anchor: "sec-2-1",
      kicker: "Para saber mais",
      title: "Fontes originais e arquivos históricos",
      meta: "Artigos originais · arquivos históricos",
      html: `<div class="reading-grid">
        ${readingCard({ badge: "Artigo original", title: "New Directions in Cryptography", why: "O texto de 1976 introduz a visão pública de chave pública, assinatura digital e o acordo que hoje leva os nomes Diffie–Hellman.", href: "https://ee.stanford.edu/~hellman/publications/24.pdf", source: "PDF em Stanford", level: "Intermediário" })}
        ${readingCard({ badge: "Artigo original", title: "Secure Communications Over Insecure Channels", why: "Permite acompanhar a formulação dos quebra-cabeças de Merkle e entender a vantagem quadrática que motivou o trabalho inicial.", href: "https://www.ralphmerkle.com/1974/PuzzlesAsPublished.pdf", source: "PDF de Ralph Merkle", level: "Intermediário" })}
        ${readingCard({ badge: "História institucional", title: "James Ellis e a cifração não secreta", why: "O GCHQ apresenta a trilha de pesquisa que permaneceu classificada e só foi reconhecida publicamente décadas depois.", href: "https://www.gchq.gov.uk/person/james-ellis", source: "página do GCHQ", level: "Iniciante" })}
        ${readingCard({ badge: "Perfil histórico", title: "Ralph Merkle", why: "O Computer History Museum contextualiza a recepção inicial de suas ideias e sua colaboração com Diffie e Hellman.", href: "https://computerhistory.org/profile/ralph-merkle/", source: "perfil do CHM", level: "Iniciante" })}
      </div>`
    });
