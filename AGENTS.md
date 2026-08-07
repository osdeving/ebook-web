# Constituição operacional do Ebook Web

## Identidade

- Este repositório é o framework **Ebook Web**, independente do pré-livro
  LaTeX que pode existir no diretório pai.
- Não editar `../livro/`, ROADMAP, Atlas ou fontes LaTeX como consequência de
  uma tarefa deste projeto.
- `src/chapters/*/source/` contém o texto traduzido preservado. Recursos
  didáticos e visuais pertencem a `enrichments/`, nunca ao source.

## Início de sessão

1. Executar `git status --short --branch` e `git log -3 --oneline` neste repo.
2. Ler `docs/README.md` e `docs/architecture.md`.
3. Para criar ou migrar capítulo, usar a skill
   `.agents/skills/criar-capitulo-ebook-web/SKILL.md`.

## Contratos

- Um capítulo é descoberto por seu manifesto e deve ter slug único.
- Um enriquecimento montável segue `EnrichmentDefinition` e declara `id`,
  `layer`, `anchor`, `title` e `content`. `type` e `section` são metadados
  exclusivos do catálogo de explicações.
- IDs e alvos de âncora são globais e estáveis. Vários recursos podem consumir
  o mesmo alvo; o DOM não pode conter dois alvos com o mesmo ID.
- Importar um módulo não pode montar interface nem alterar `window`.
- Entrada do leitor vai ao DOM como texto. `innerHTML` só recebe HTML editorial
  versionado, conforme `docs/content-contract.md`.
- CSS usa tokens e a folha de seu componente; não adicionar um novo monólito.
- O preset "Só o texto" deve remover visualmente todos os enriquecimentos sem
  perder nenhum trecho-fonte.

## Validação proporcional

```bash
npm run validate:content
npm run check
npm test
npm run build
npm run test:browser
```

Ao alterar apenas um módulo, começar por seu teste unitário. Antes de publicar,
executar a sequência completa. Nunca atualizar o hash da fonte só para fazer um
teste passar: primeiro revisar e justificar a diferença textual.

## Git e publicação

- O repositório remoto e o GitHub Pages pertencem a este diretório aninhado.
- Não versionar PDFs de origem em `sources/`.
- Não incluir segredos, notas locais do leitor ou saídas `dist/`.
- Publicação em `main` aciona `.github/workflows/pages.yml`.
