# ADR 0001 — Astro como casca e React como ilha

Status: aceito em 2026-08-07.

## Contexto

Um ebook é predominantemente texto semântico, fórmulas, tabelas e figuras. Ele
também pode conter laboratórios, exercícios gerados, anotações e filtros. Uma
SPA React para toda a página enviaria JavaScript para trechos que não precisam
dele e tornaria impressão, leitura sem JavaScript e preservação do texto mais
frágeis. HTML monolítico, por outro lado, já deixou difícil incluir o próximo
capítulo e testar cada responsabilidade.

## Decisão

Usar Astro em saída estática. Componentes Astro montam o livro e não enviam um
runtime ao navegador por padrão. TypeScript implementa o núcleo progressivo e
React fica disponível para ilhas com estado local relevante. Cada ilha escolhe
quando hidratar; o texto-fonte continua HTML legível e independente.

A decisão acompanha a documentação oficial sobre
[islands](https://docs.astro.build/en/concepts/islands/),
[integração React](https://docs.astro.build/en/guides/integrations-guide/react/)
e [deploy no GitHub Pages](https://docs.astro.build/en/guides/deploy/github/).

## Consequências

- O conteúdo principal aparece e imprime mesmo se o JavaScript falhar.
- Um laboratório pode evoluir em isolamento e carregar só quando necessário.
- Todo recurso precisa declarar um `id`, uma camada e uma âncora estável.
- React não é obrigatório para recursos simples; componentes Astro e pequenos
  controladores TypeScript continuam sendo a opção de menor custo.
- O build gera arquivos estáticos compatíveis com GitHub Pages.
