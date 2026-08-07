import { defineEnrichment, readingCard } from "../shared";

export const readingComputationalTools = defineEnrichment({
      id: "reading-computational-tools",
      layer: "reading",
      anchor: "sec-2-10-4",
      kicker: "Para continuar explorando",
      title: "Ferramentas abertas para experimentar estruturas finitas",
      meta: "Software educacional · documentação oficial",
      html: `<div class="reading-grid">
        ${readingCard({ badge: "Visualização", title: "CrypTool", why: "Reúne visualizações de algoritmos e protocolos criptográficos, inclusive troca de chaves, para continuar a exploração além dos exemplos pequenos desta página.", href: "https://www.cryptool.org/en/functions/", source: "site oficial", level: "Iniciante" })}
        ${readingCard({ badge: "Álgebra computacional", title: "Tutorial do SageMath", why: "Apresenta computação aberta com grupos, anéis, polinômios e corpos finitos; é uma ponte natural entre as contas manuais e experimentos maiores.", href: "https://doc.sagemath.org/html/en/tutorial/index.html", source: "documentação do SageMath", level: "Intermediário" })}
      </div>`
    });
