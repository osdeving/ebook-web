# Arquitetura

O framework segue uma regra simples: **o texto traduzido é fonte; tudo que o
enriquece é uma camada acoplada por âncora**.

```text
src/
├── chapters/
│   ├── index.ts                  # índice dos capítulos publicados
│   └── ch02/
│       ├── chapter.ts            # amarração das camadas ao manifesto
│       ├── source/sections/      # somente a tradução
│       └── enrichments/
│           ├── explanations/     # desenvolvimento didático
│           ├── labs/             # experiências manipuláveis
│           ├── practices/        # exercícios e geradores
│           ├── history/          # contexto histórico
│           └── readings/         # fontes e “para saber mais”
├── components/                   # casca Astro reutilizável
├── content/                      # glossário, símbolos, rotas e bibliografia
├── framework/                    # registro, montagem e comportamento
├── lib/discovery.ts              # índices e relações derivados no build
├── styles/                       # folhas por responsabilidade
└── pages/                        # rotas, sem conteúdo editorial
```

## Camadas

1. **Source** — seções HTML na ordem original. Slots vazios marcam lugares em
   que uma camada editorial pode aparecer. Alterar esta camada exige atualizar
   explicitamente seu hash de preservação.
2. **Enrichment** — módulos pequenos, autocontidos e removíveis. O manifesto
   informa onde entram; eles não reescrevem o source.
3. **Framework** — valida contratos, monta os módulos, renderiza KaTeX e cuida
   de estado local, acessibilidade, impressão e navegação.
4. **Shell** — componentes Astro compõem página, sumário e índice de capítulos.
5. **Delivery** — build estático e workflow oficial do GitHub Pages.

## Descoberta e estudo

O build deriva do HTML confiável um índice global e um grafo leve de relações.
O primeiro alimenta busca, glossário e rotas; o segundo oferece prévias de
links e relações inversas. Nenhum desses artefatos reescreve a camada-fonte.

Progresso, marcadores, notas e preferências são mantidos no armazenamento local
do navegador e vinculados ao hash da fonte. O service worker salva o shell e as
rotas publicadas para leitura offline, sem transmitir esses dados pessoais.

## Fronteiras

- HTML editorial é código confiável do repositório, nunca entrada de usuário.
- Notas do leitor são texto e devem entrar no DOM com `textContent`.
- Um recurso não consulta arquivos internos de outro tipo. Compartilhamento
  passa por `enrichments/shared` ou por APIs do framework.
- CSS de um tipo usa sua classe raiz (`.explanation`, `.lab`, `.practice`,
  `.history`, `.reading`) e não depende da posição no capítulo.
- O registro é declarativo. Importar um módulo não deve alterar `window` nem
  montar UI sozinho.

## Fluxo de montagem

O build lê o manifesto do capítulo, concatena as seções-fonte em ordem e emite
slots estáveis. No navegador, o registrador associa cada enriquecimento ao slot
ou à âncora declarada. Falha em um item é isolada e registrada sem impedir a
leitura do texto.
