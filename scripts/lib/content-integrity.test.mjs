import { describe, expect, it } from "vitest";
import { normalizeHtmlText } from "./content-integrity.mjs";

describe("normalizacao da camada-fonte", () => {
  it("ignora o invólucro de links cruzados sem deslocar pontuacao", () => {
    const plain = "<p>Veja a Proposição 2.41; compare [38], e resolva (Exercício 2.3(a)).</p>";
    const linked = `<p>Veja a <a data-source-xref href="#prop-2-41">Proposição 2.41</a>; compare <a href="../../references/#ref-38" data-source-xref>[38]</a>, e resolva (<a data-source-xref="exercise:2.3.a" href="#exercicio-2-3-a">Exercício 2.3(a)</a>).</p>`;

    expect(normalizeHtmlText(linked)).toBe(normalizeHtmlText(plain));
  });

  it("nao muda silenciosamente a normalizacao de links comuns", () => {
    const linked = '<p>Leia <a href="https://example.org">a fonte</a>.</p>';
    expect(normalizeHtmlText(linked)).toBe("Leia a fonte .");
  });
});
