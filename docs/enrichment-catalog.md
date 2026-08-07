# Catálogo de recursos

Cada tipo mora em sua própria pasta e tem um índice local. Novos tipos podem
ser adicionados ao registro sem mudar os capítulos já existentes.

| Tipo | Prefixo | Finalidade | Forma típica |
|---|---|---|---|
| Explicação | `exp-` | desacelerar uma ideia ou expressão | painel colapsável |
| Laboratório | `lab-` | manipular parâmetros e observar invariantes | ilha interativa |
| Prática | `practice-` | testar compreensão com feedback | exercício fixo ou gerado |
| História | `history-` | situar pessoas, datas e decisões | dossiê colapsável |
| Leitura | `reading-` | glossário, mapa, fontes e próximos passos | painel de referência |

Um capítulo não precisa usar todos. Prefira poucos itens com função didática
clara a elementos decorativos. O seletor de camadas permite ler somente a
tradução ou combinar as camadas pelos presets "Só o texto", "Leitura guiada"
e "Explorar tudo".

## Gerador

Todos os comandos recebem `chapter`, `type`, `id`, `anchor` e `title`. A
âncora é um ID DOM sem `#`. O gerador faz toda a validação antes de escrever,
recusa ID ou nome de arquivo já registrado e exige que a âncora resolva para um
único alvo. IDs de enriquecimento são verificados em todos os capítulos.
Vários recursos podem consumir a mesma âncora; o que não pode existir são dois
elementos com o mesmo ID no DOM.

```bash
# Explicação: cria HTML e atualiza catalog.json
npm run new:enrichment -- --chapter ch03 --type explanation \
  --id exp-3-1-intuicao --anchor sec-3-1 \
  --title "Intuição antes da fórmula"

# Laboratório: cria uma ilha TypeScript com ciclo initialize/cleanup
npm run new:enrichment -- --chapter ch03 --type lab \
  --id lab-3-1-parametros --anchor exp-3-1-intuicao \
  --title "Experimente os parâmetros"

# Prática: cria pergunta, feedback acessível e resolução colapsável
npm run new:enrichment -- --chapter ch03 --type practice \
  --id practice-3-1-checagem --anchor lab-3-1-parametros \
  --title "Cheque sua compreensão"

# História: cria um módulo de conteúdo editorial
npm run new:enrichment -- --chapter ch03 --type history \
  --id history-3-1-contexto --anchor practice-3-1-checagem \
  --title "Como esta ideia surgiu"

# Para saber mais: cria um módulo de referências comentadas
npm run new:enrichment -- --chapter ch03 --type reading \
  --id reading-3-1-fontes --anchor history-3-1-contexto \
  --title "Fontes e próximos passos"
```

Explicações usam `catalog.json` + `import.meta.glob`, pois são fragmentos HTML
editoriais. Os outros quatro tipos usam um módulo por recurso e um índice local
com imports explícitos. Edite o arquivo criado; não cole o conteúdo no índice.

## Contrato em código

Todo item montável implementa `EnrichmentDefinition` e declara, no mínimo,
`id`, `layer`, `anchor`, `title` e `content`. Campos como `type`, `section`,
`slot`, `file` e `order` pertencem somente ao catálogo de explicações; eles
ajudam a gestão editorial e são convertidos para o contrato do runtime pelo
índice local.
