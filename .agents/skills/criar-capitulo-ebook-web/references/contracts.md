# Modelos dos contratos

Use estes modelos como forma mínima. Copie a estrutura, não os IDs nem o
conteúdo de exemplo.

## Seção-fonte com slot vazio

```html
<section id="sec-3-1" data-layer="source">
  <h2>3.1 Título preservado</h2>
  <p>Texto da tradução preservada.</p>
  <span
    id="slot-exp-3-1-ideia-central"
    data-enrichment-slot="exp-3-1-ideia-central"
    aria-hidden="true"></span>
</section>
```

O slot não pode ter texto visível. O hash é calculado do `textContent`
normalizado de todas as seções na ordem do manifesto.

## Explicação estática

Arquivo `enrichments/explanations/exp-3-1-ideia-central.html`:

```html
<div class="explanation-body">
  <div class="mental-model">
    <p>Comece pela intuição em linguagem simples.</p>
  </div>
  <div class="slow-steps">
    <div class="step">
      <span class="step-tag definition">Definição</span>
      <p>Apresente o objeto e a notação.</p>
    </div>
    <div class="step">
      <span class="step-tag manipulation">Manipulação</span>
      <p>Mostre a conta sem saltos: \(2+3=5\).</p>
    </div>
  </div>
  <div class="quick-check"><p>Confira com números pequenos.</p></div>
</div>
```

Entrada correspondente em `catalog.json`:

```json
{
  "id": "exp-3-1-ideia-central",
  "type": "explanation",
  "layer": "explanation",
  "kind": "explanation",
  "tag": "Explicação",
  "title": "Entendendo a ideia central",
  "section": "sec-3-1",
  "anchor": "slot-exp-3-1-ideia-central",
  "slot": "[data-enrichment-slot=\"exp-3-1-ideia-central\"]",
  "file": "exp-3-1-ideia-central.html",
  "order": 0
}
```

Mantenha o carregamento dos arquivos HTML no índice da pasta, por
`import.meta.glob`, e converta-os em `EnrichmentDefinition` com `trustedHtml`.

## Módulo estático em TypeScript

```ts
import { trustedHtml } from "../../../../framework/trusted-html";
import type { EnrichmentDefinition } from "../../../../framework/types";

export const historyExample: EnrichmentDefinition = Object.freeze({
  id: "history-3-1-contexto",
  layer: "history",
  anchor: "sec-3-1",
  title: "Como esta ideia surgiu",
  kicker: "História",
  collapsible: true,
  content: trustedHtml(`
    <p>Contexto editorial apoiado por fontes registradas nos créditos.</p>
  `),
  tags: ["history", "section:3.1"],
});
```

Exporte o módulo no `index.ts` do tipo e inclua-o na coleção daquele índice.

## Interatividade

Use `initialize(context)` somente quando o item tiver estado ou eventos:

```ts
initialize({ host, announce }) {
  const button = host.querySelector<HTMLButtonElement>("[data-run]");
  const output = host.querySelector<HTMLElement>("[data-output]");
  if (!button || !output) return;

  const run = () => {
    output.textContent = "Resultado calculado.";
    announce("Resultado atualizado.");
  };

  button.addEventListener("click", run);
  return () => button.removeEventListener("click", run);
}
```

No HTML, use `type="button"`, nome acessível, saída com `role="status"` e um
controle explícito de reinício. Não use `innerHTML` para respostas do leitor.

## Créditos

```md
- **Autor ou instituição.** *Título ou descrição*. Página original:
  <https://example.org/original>. Licença: [nome e link direto]. Alterações:
  recorte e conversão para WebP. Acesso em: AAAA-MM-DD.
```

Se não houver licença clara, não incorpore o recurso. Prefira criar um link
editorial para a página original.
