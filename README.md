# Ebook Web

Framework modular para transformar capítulos matemáticos em experiências web
ricas sem misturar o texto traduzido com explicações, laboratórios, práticas,
história ou leituras complementares.

O projeto nasceu de um capítulo sobre criptografia de chave pública e foi
extraído para um repositório independente. A primeira implementação preserva a
tradução como uma camada verificável e monta os demais recursos por âncoras.

- **Leitura publicada:** <https://osdeving.github.io/ebook-web/>
- **Código-fonte:** <https://github.com/osdeving/ebook-web>

## Começar

Requer Node.js 22.12 ou superior.

```bash
npm install
npm run dev
```

Validação completa:

```bash
npm run validate
npm run build
npm run test:browser
```

Novo capítulo:

```bash
npm run new:chapter -- --slug ch03 --number 3 --title "Título do capítulo"
```

Novo recurso editorial:

```bash
npm run new:enrichment -- --chapter ch03 --type explanation \
  --id exp-3-1-intuicao --anchor sec-3-1 --title "Intuição passo a passo"
```

## O que é modular

- texto-fonte por seção, com hash contra alterações silenciosas;
- cinco registros independentes: explicações, laboratórios, práticas, história
  e leituras;
- componentes Astro para a página e ilhas React somente onde há estado;
- runtime dividido em armazenamento, matemática, montagem, navegação,
  acessibilidade, progresso, notas e impressão;
- referências cruzadas e permalinks estáveis para resultados, equações,
  exercícios e bibliografia;
- busca global, glossário de conceitos e símbolos, prévias de links e relações
  inversas gerados a partir do conteúdo publicado;
- rotas guiadas, acompanhamento local de seções e exercícios e pistas graduais;
- instalação como aplicativo web e leitura offline das rotas essenciais;
- CSS por tokens, estrutura e tipo de recurso;
- índice automático de capítulos e manifestos versionados;
- build estático e publicação automática no GitHub Pages.

Consulte o [índice da documentação](docs/README.md), especialmente
[Arquitetura](docs/architecture.md) e
[Adicionar um capítulo](docs/add-chapter.md).

## Conteúdo e licença

O código do framework usa a licença MIT. Textos, traduções e recursos de
terceiros não são automaticamente relicenciados; veja
[CONTENT_LICENSE.md](CONTENT_LICENSE.md) e os créditos de cada capítulo.
