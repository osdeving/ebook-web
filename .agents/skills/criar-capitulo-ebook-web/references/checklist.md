# Checklist de capítulo

## Antes de editar

- [ ] Li `AGENTS.md` e os contratos em `docs/`.
- [ ] Inspecionei `git status --short --branch`.
- [ ] Delimitei se o trabalho cria, migra ou amplia um capítulo.
- [ ] Registrei o hash de base antes de decompor um HTML existente.

## Fonte preservada

- [ ] Há um arquivo por seção em `source/sections/`.
- [ ] `manifest.json#sourceOrder` corresponde à leitura original; `chapter.ts`
      deriva essa ordem sem manter uma segunda lista.
- [ ] Título, numeração, exemplos, equações e prosa continuam equivalentes.
- [ ] O source contém somente tradução e slots editoriais vazios.
- [ ] IDs de seção e itens do sumário coincidem.
- [ ] Revisei a saída de `source:hash` antes de usar `--write`.
- [ ] `sourceHash` e `textLength` representam o source revisado.

## Enriquecimentos

- [ ] Cada item está na pasta de seu tipo e registrado no índice local.
- [ ] IDs são globais, estáveis, em kebab-case e têm o prefixo correto.
- [ ] Cada âncora existe uma vez e representa uma relação estável.
- [ ] Remover o item não remove nem reescreve tradução.
- [ ] Imports não montam UI nem alteram globais.
- [ ] HTML confiável é local; dados do leitor usam `textContent`.
- [ ] Controles têm rótulo, teclado, feedback e reinício quando aplicável.
- [ ] Fórmulas e conteúdo gerado passam pelo renderizador matemático.
- [ ] CSS novo está na folha do componente/tipo e usa tokens existentes.

## Créditos

- [ ] Cada recurso externo aponta para a página original.
- [ ] Autor, título, licença, alterações e data de acesso estão registrados.
- [ ] Imagens e textos de terceiros não foram tratados como MIT por engano.

## Validação e entrega

- [ ] `npm run validate:content`
- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run test:browser`
- [ ] Testei camadas, links diretos, KaTeX, teclado, móvel, escuro e impressão.
- [ ] O console do navegador não contém erros.
- [ ] `git diff --check` está limpo.
- [ ] Não incluí `dist/`, PDF-fonte, segredo nem estado do leitor.
- [ ] O handoff informa hash, tamanho, créditos, testes e pendências.
