# Adicionar um capítulo

## Caminho curto

```bash
npm run new:chapter -- --slug ch03 --number 3 --title "Título do capítulo"
npm run dev
npm run source:hash -- --chapter ch03 --write
npm run validate
```

O gerador cria manifesto, seções e índices de enriquecimento. Depois:

1. Coloque somente a tradução em `src/chapters/ch03/source/sections/`.
2. Defina a ordem e o sumário em `manifest.json`. `chapter.ts` descobre os
   arquivos com `import.meta.glob` e monta as seções estritamente na ordem de
   `sourceOrder`; não crie um segundo array ou imports manuais.
3. Revise a fonte lado a lado com o documento de origem.
4. Somente depois da revisão, registre hash e tamanho com
   `npm run source:hash -- --chapter ch03 --write` e confira o diff.
5. Adicione recursos com `npm run new:enrichment`; o gerador atualiza o
   catálogo ou índice local sem centralizar tudo em `chapter.ts`.
6. Confira os presets "Só o texto", "Leitura guiada" e "Explorar tudo".
7. Execute `npm run validate`, `npm run build` e `npm run test:browser`.

## Adicionar o primeiro enriquecimento

```bash
npm run new:enrichment -- \
  --chapter ch03 \
  --type explanation \
  --id exp-3-1-ideia-central \
  --anchor sec-3-1 \
  --title "A ideia central em câmera lenta"
```

O comando cria o fragmento HTML e inclui sua entrada em
`enrichments/explanations/catalog.json`. Laboratórios, práticas, história e
leituras criam um módulo TypeScript e são acrescentados ao `index.ts` do tipo.
Consulte [Catálogo de recursos](enrichment-catalog.md) para os cinco exemplos.

Para uma execução assistida, invoque a skill
`$criar-capitulo-ebook-web` existente em `.agents/skills/`.
