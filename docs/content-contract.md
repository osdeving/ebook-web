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
editoriais, remover a marcação HTML preservando as fronteiras de texto usadas
pelos hashes já registrados, decodificar entidades, colapsar espaços Unicode e
aparar as pontas. Trocar esse algoritmo exige uma migração explícita de todos os
hashes, nunca uma atualização isolada para fazer a validação passar.

## Referências cruzadas

Alvos presentes no site usam IDs estáveis e links nativos. Ao tornar uma
menção já existente clicável dentro de `source/`, preserve exatamente seu texto
visível e marque o invólucro:

```html
<a data-source-xref href="#prop-2-41">Proposição 2.41</a>
```

No mesmo capítulo use `#id`. Entre capítulos, prefira caminhos relativos como
`../ch01/#thm-1-24`, que continuam corretos sob o `base` do GitHub Pages. Uma
menção cujo alvo ainda não foi publicado permanece como texto simples. O
validador rejeita links marcados para capítulos ou IDs inexistentes e também
rejeita URLs externas com `data-source-xref`.

O normalizador ignora apenas o invólucro `a[data-source-xref]`, nunca seu
conteúdo. Assim, adicionar navegação não justifica trocar o hash da fonte. Links
externos continuam sendo material editorial e pertencem a um enriquecimento de
leitura, não ao source.

No navegador, o framework acrescenta um permalink vazio a todo alvo com ID que
seja bloco semântico, exercício, equação, figura ou tabela. O símbolo é gerado
por CSS e o nome vem de `aria-label`; portanto essa conveniência não acrescenta
caracteres ao `textContent` da fonte. Não grave manualmente esse controle nos
fragmentos HTML.

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

Por padrão, o item é montado como painel. Links editoriais curtos, como uma
versão online anexada a uma entrada bibliográfica, podem declarar
`presentation: "inline"`; eles continuam pertencendo a uma camada, recebem
`data-origin="editorial"` e desaparecem no preset “Só o texto”.

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
