# Contrato do conteúdo

## Camada-fonte

- Preservar título, ordem, numeração, exemplos, equações e texto da tradução.
- Usar um arquivo por seção, em `source/sections/`.
- Manter a ordem somente em `manifest.json#sourceOrder`; `chapter.ts` carrega o
  diretório por glob e não repete a lista em imports manuais.
- Não inserir explicações, chamadas, exercícios extras ou links externos no
  texto. Usar slots editoriais vazios e módulos de enriquecimento.
- Registrar no manifesto o SHA-256 do texto normalizado e sua contagem de
  caracteres. `npm run validate:content` deve falhar se houver desvio silencioso.

Normalização significa: juntar as seções na ordem do manifesto, descartar nós
editoriais, obter `textContent`, colapsar espaços Unicode e aparar as pontas.

## Enriquecimentos

Todo item declara no mínimo:

```ts
{
  id: "exp-3-1-intuicao",
  layer: "explanation",
  anchor: "sec-3-1",
  title: "Por que este passo funciona?",
  content: trustedHtml(fragmentoLocalRevisado)
}
```

Esse é o contrato `EnrichmentDefinition`. `type`, `section`, `slot`, `file` e
`order` não são exigidos pelo runtime: são metadados do catálogo de
explicações, usados para localizar os fragmentos HTML e manter sua ordem
editorial.

IDs são globais, estáveis, escritos em kebab-case e prefixados pelo tipo. Uma
âncora deve resolver para exatamente um elemento, mas pode ser consumida por
vários recursos; o runtime preserva a ordem de registro nesse caso. Cada
módulo pode ser desligado sem alterar a tradução. Elementos interativos
precisam de nome acessível, feedback em `role="status"`, botão de reinício e
comportamento de teclado.

O leitor oferece três presets reais: "Só o texto", "Leitura guiada" e
"Explorar tudo". Eles alteram apenas elementos `data-origin="editorial"`; a
camada-fonte nunca depende dessas regras.

## Matemática

KaTeX é carregado localmente pelo bundle. Delimitadores válidos são `\(...\)`
e `\[...\]`; conteúdo gerado também passa pelo renderizador. Exemplos devem
usar números pequenos, mostrar as etapas e distinguir definição, manipulação e
teorema quando isso ajudar quem possui pouca base matemática.

## Segurança editorial

Arquivos HTML de `source` e `enrichments` são tratados como conteúdo confiável
e passam por revisão no Git. Dados criados pelo leitor nunca usam `innerHTML`.
