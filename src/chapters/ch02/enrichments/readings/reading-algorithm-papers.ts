import { defineEnrichment, readingCard } from "../shared";

export const readingAlgorithmPapers = defineEnrichment({
      id: "reading-algorithm-papers",
      layer: "reading",
      anchor: "sec-2-9",
      kicker: "Para saber mais",
      title: "Os algoritmos nos artigos que os apresentaram",
      meta: "Elgamal · Pohlig–Hellman",
      html: `<div class="reading-grid">
        ${readingCard({ badge: "Artigo original", title: "A Public Key Cryptosystem and a Signature Scheme Based on Discrete Logarithms", why: "Mostra como Elgamal transforma o mecanismo de Diffie–Hellman num criptossistema probabilístico e num esquema de assinatura.", href: "https://people.csail.mit.edu/alinush/6.857-spring-2015/papers/elgamal.pdf", source: "PDF espelhado pelo MIT", level: "Intermediário" })}
        ${readingCard({ badge: "Artigo original", title: "An Improved Algorithm for Computing Logarithms over GF(p)", why: "É a fonte histórica do algoritmo que explora a fatoração da ordem do grupo e explica sua importância criptográfica.", href: "https://www-ee.stanford.edu/~hellman/publications/28.pdf", source: "PDF em Stanford", level: "Avançado" })}
      </div>`
    });
