# Ferramentas de estudo e descoberta

Estas ferramentas ficam fora de `source/`. Elas podem evoluir sem alterar o
texto traduzido nem seu hash.

## Dados editoriais

- `src/content/glossary.json` registra termo, aliases, definição curta,
  categoria, capítulo e primeiro destino no texto.
- `src/content/symbols.json` faz o mesmo para notação.
- `src/content/learning-paths.json` descreve percursos ordenados. Cada etapa
  deve apontar para uma âncora já publicada.
- `src/content/references.json` permanece a fonte única da bibliografia.

`src/lib/discovery.ts` lê esses catálogos, capítulos e enriquecimentos durante
o build. Ele emite o índice de `/search-index.json`, prévias de referências
cruzadas e relações inversas. Texto recebido da rede ou do leitor nunca entra
como HTML nesse processo.

## Estado local

O leitor guarda progresso por ID estável nos mesmos registros locais que
camadas, notas e marcadores. Há três granularidades de anotação: uma seção
inteira, um trecho selecionado e um rascunho vetorial preso a uma posição do
texto. O rascunho aceita caneta, toque e mouse; traços e pressão ficam em
coordenadas normalizadas para sobreviver à mudança de tela.
Com um trecho selecionado, `Alt+Shift+M` cria um marcador e `Alt+Shift+R`
abre o rascunho sem exigir que a seleção seja refeita com o mouse.

Uma seção ou exercício percorre os estados “não iniciado”, “em andamento” e
“concluído”. Quando o hash da fonte muda, IDs que deixaram de existir são
descartados. Marcadores de trecho e rascunhos, que dependem de deslocamentos
textuais, são invalidados para não reaparecerem na frase errada. Nenhum dado
sai do navegador.

## Offline e instalação

`public/manifest.webmanifest` descreve o aplicativo e `public/sw.js` mantém um
cache versionado das páginas essenciais. Navegações preferem a rede e usam o
cache quando ela falha; arquivos estáticos usam a cópia local enquanto uma
atualização é buscada. O fallback `/offline/` explica por que uma rota ainda
não visitada não abriu.

Ao mudar a estratégia de cache, altere `CACHE_VERSION` e teste tanto a primeira
instalação quanto uma atualização com um service worker anterior. Referências
técnicas: [guia de instalação de PWA da MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
e [ciclo de vida de service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

## Validação mínima

Além da sequência geral do repositório, confira:

1. busca com e sem acentos, filtros e consulta vinda por `?q=`;
2. todos os destinos do glossário e das rotas;
3. persistência e limpeza do progresso;
4. vários marcadores de trecho, rascunho por caneta/toque/mouse, reabertura da
   taxinha e restauração depois de recarregar;
5. prévia por mouse, foco e toque, além do segundo toque para navegar;
6. manifesto, ícones, escopo sob o `BASE_URL`, atualização e fallback offline;
7. layouts em 375 px, tema escuro, impressão e navegação só por teclado.
