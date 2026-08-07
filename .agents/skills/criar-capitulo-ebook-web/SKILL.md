---
name: criar-capitulo-ebook-web
description: Cria ou migra capítulos matemáticos no framework Ebook Web, separando tradução-fonte de explicações, laboratórios, práticas, história e leituras. Use ao adicionar `src/chapters/chNN`, decompor um HTML monolítico, alterar manifestos ou enriquecer um capítulo sem quebrar o hash da camada-fonte.
---

# Criar capítulo de Ebook Web

Preserve a tradução como camada verificável e componha todo material adicional
por âncoras. Produza módulos pequenos, acessíveis e removíveis; nunca faça um
enriquecimento depender de uma alteração textual silenciosa no source.

## Preparar o trabalho

1. Trabalhe a partir da raiz do repositório `ebook-web`.
2. Leia `AGENTS.md`, `docs/architecture.md`, `docs/content-contract.md` e
   `docs/add-chapter.md`.
3. Execute `git status --short --branch` e preserve alterações alheias.
4. Delimite o capítulo e os tipos de enriquecimento pedidos.
5. Abra [o checklist](references/checklist.md) e use-o como critério de pronto.

## Escolher o fluxo

- Para um capítulo novo, gere o esqueleto com:

  ```bash
  npm run new:chapter -- --slug ch03 --number 3 --title "Título do capítulo"
  ```

- Para migrar um HTML monolítico, identifique primeiro a região que representa
  exclusivamente o texto traduzido e calcule uma linha de base normalizada.
  Separe-a por seção sem reescrever título, ordem, numeração, exemplos,
  equações ou prosa. Extraia explicações e widgets para `enrichments/`.
- Para ampliar um capítulo existente, não regenere o esqueleto. Edite somente
  o índice e os módulos do tipo solicitado; toque no source apenas quando o
  usuário pedir correção da tradução.

## Montar a camada-fonte

1. Crie um arquivo HTML por seção em
   `src/chapters/<slug>/source/sections/`.
2. Mantenha `manifest.json.sourceOrder` na ordem exata de leitura. Ele é a
   única fonte de verdade: `chapter.ts` resolve os arquivos automaticamente
   pelo glob e não deve repetir a lista.
3. Mantenha o sumário do manifesto coerente com IDs reais das seções.
4. Insira apenas slots editoriais vazios quando precisar de um ponto local:

   ```html
   <span
     id="slot-exp-3-1-intuicao"
     data-enrichment-slot="exp-3-1-intuicao"
     aria-hidden="true"></span>
   ```

5. Não coloque explicações, links externos, exercícios extras, chamadas ou
   metadados visíveis em `source/`.
6. Calcule o hash sem escrever:

   ```bash
   npm run source:hash -- --chapter ch03
   ```

7. Revise o texto e o diff. Só depois registre o valor deliberadamente:

   ```bash
   npm run source:hash -- --chapter ch03 --write
   ```

Nunca use `--write` apenas para silenciar `validate:content`. Se o hash mudou
sem uma edição-fonte intencional, restaure a equivalência textual e investigue.

## Adicionar enriquecimentos

Gere o arquivo e seu registro com o comando abaixo; depois substitua o conteúdo
didático do modelo:

```bash
npm run new:enrichment -- \
  --chapter ch03 \
  --type explanation \
  --id exp-3-1-ideia-central \
  --anchor sec-3-1 \
  --title "A ideia central em câmera lenta"
```

Use exatamente uma pasta e um índice por tipo:

| Tipo | Prefixo | Pasta |
|---|---|---|
| explicação | `exp-` | `enrichments/explanations/` |
| laboratório | `lab-` | `enrichments/labs/` |
| prática | `practice-` | `enrichments/practices/` |
| história | `history-` | `enrichments/history/` |
| leitura | `reading-` | `enrichments/readings/` |

Siga [os contratos e modelos](references/contracts.md). Para cada item:

1. Escolha um ID global, estável, em kebab-case e com o prefixo do tipo.
2. Aponte para uma âncora existente e inequívoca. Prefira um slot para posição
   local; use uma seção ou outro enriquecimento apenas quando a relação for
   conceitualmente estável.
3. Registre o módulo no `index.ts` do próprio tipo e deixe `chapter.ts` apenas
   como amarração das coleções.
4. Coloque utilidades compartilhadas em `enrichments/shared/` ou no framework,
   nunca por importação interna entre tipos.
5. Evite efeitos colaterais no import: não altere `window` e não monte DOM antes
   de `initialize`.
6. Use `textContent` para dados do leitor. Passe a `trustedHtml` apenas HTML
   editorial local e versionado.
7. Faça a experiência funcionar por teclado, dê nome acessível aos controles,
   anuncie feedback em `role="status"` e ofereça reinício quando houver estado.
8. Renderize matemática com `\(...\)` e `\[...\]`. Em explicações, desacelere
   as expressões e diferencie definição, manipulação e teorema quando útil.

## Registrar fontes e créditos

Registre em `src/chapters/<slug>/credits.md`, ou no arquivo de créditos já
adotado pelo capítulo, cada texto, imagem, dado ou fonte externa com autor,
título/descrição, página original, licença e link direto, alterações e data de
acesso. Confirme a licença na origem; uma página de resultados de busca não é
fonte. Mantenha conteúdo de terceiros fora da licença MIT do framework.

## Validar em camadas

Execute primeiro a validação de conteúdo, depois a técnica:

```bash
npm run validate:content
npm run check
npm test
npm run build
npm run test:browser
```

No navegador, confira no mínimo:

- índice e rota do capítulo;
- sumário, âncoras e link direto para um enriquecimento;
- presets “Só o texto”, “Leitura guiada” e “Explorar tudo”, além dos seletores
  individuais de camada;
- KaTeX sem erro e conteúdo gerado renderizado;
- abrir/fechar, teclado, feedback, reinício e persistência;
- viewport móvel, tema escuro e impressão;
- console sem erros.

Se uma validação falhar, corrija a causa e repita o comando afetado antes da
sequência completa. Relate hash, contagem de caracteres, build e testes reais;
não trate um build bem-sucedido como revisão matemática ou editorial.

## Encerrar

Revise `git diff --check`, confirme que `dist/`, PDFs de origem, segredos e
estado local do leitor não entraram no commit, e registre no handoff:

- capítulo e módulos criados ou alterados;
- hash e tamanho da camada-fonte;
- créditos adicionados;
- comandos executados e resultados;
- pendências matemáticas, editoriais ou de navegador.
