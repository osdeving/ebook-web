import { describe, expect, it } from "vitest";
import {
  collectSourceCrossReferences,
  resolveSourceCrossReference,
} from "./cross-references.mjs";

describe("referencias cruzadas da camada-fonte", () => {
  it("coleta somente links marcados explicitamente", () => {
    const links = collectSourceCrossReferences(`
      <p><a data-source-xref href="#prop-1-4">Proposição 1.4</a></p>
      <p><a href="https://example.org">Fonte externa</a></p>
    `);
    expect(links).toEqual([{ href: "#prop-1-4", label: "Proposição 1.4" }]);
  });

  it("resolve destinos no mesmo capitulo e entre capitulos", () => {
    expect(resolveSourceCrossReference("ch02", "#prop-2-41")).toEqual({
      kind: "chapter",
      slug: "ch02",
      id: "prop-2-41",
      pathname: "/chapters/ch02/",
    });
    expect(resolveSourceCrossReference("ch02", "../ch01/#thm-1-24")).toEqual({
      kind: "chapter",
      slug: "ch01",
      id: "thm-1-24",
      pathname: "/chapters/ch01/",
    });
  });

  it("distingue paginas locais, URLs externas e links invalidos", () => {
    expect(resolveSourceCrossReference("ch02", "../../references/#ref-38")).toEqual({
      kind: "local-page",
      pathname: "/references/",
      id: "ref-38",
    });
    expect(resolveSourceCrossReference("ch02", "https://example.org/#item").kind).toBe("external");
    expect(resolveSourceCrossReference("ch02", "../ch01/")).toEqual({
      kind: "invalid",
      reason: "fragmento ausente",
    });
  });
});
