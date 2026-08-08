import { describe, expect, it } from "vitest";
import katex from "katex";
import { parseHTML } from "linkedom";
import { parseFragment } from "parse5";
import { practices } from ".";

function assertStrictMath(html: string, id: string): void {
  const parseErrors: string[] = [];
  parseFragment(html, { onParseError: ({ code }) => parseErrors.push(code) });
  expect(parseErrors, id).toEqual([]);

  const { document } = parseHTML("<html><body>" + html + "</body></html>");
  document.querySelectorAll("pre, code").forEach((node) => node.remove());
  const text = document.body.textContent;
  const expressions = [
    ...text.matchAll(/\\\(([\s\S]*?)\\\)/g),
    ...text.matchAll(/\\\[([\s\S]*?)\\\]/g),
  ];

  expressions.forEach((match) => {
    expect(() => katex.renderToString(match[1]!, {
      throwOnError: true,
      strict: "error",
    }), id + ": " + match[1]).not.toThrow();
  });

  const residue = text
    .replace(/\\\([\s\S]*?\\\)/g, "")
    .replace(/\\\[[\s\S]*?\\\]/g, "");
  expect(residue, id).not.toMatch(/\\(?:[A-Za-z]+|[\(\)\[\]])/);
  expect(residue, id).not.toMatch(/\((?:[A-ZnNpqrijkstuxy]|[^()]*[_^=<>][^()]*)\)/);
}

describe("soluções do capítulo 5", () => {
  it("cobre os 60 exercícios com IDs e âncoras estáveis", () => {
    expect(practices).toHaveLength(60);
    expect(new Set(practices.map(({ id }) => id)).size).toBe(60);
    expect(practices.map(({ anchor }) => anchor)).toEqual(
      Array.from({ length: 60 }, (_, index) => "exercicio-5-" + (index + 1)),
    );
  });

  it("usa HTML válido e somente matemática KaTeX explícita e estrita", () => {
    practices.forEach((practice) => {
      const html = String(practice.content);
      expect(html, practice.id).not.toMatch(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/);
      assertStrictMath(html, practice.id);
    });
  });

  it("oferece duas ou três dicas graduais e uma solução integral", () => {
    practices.forEach((practice) => {
      const { document } = parseHTML("<html><body>" + String(practice.content) + "</body></html>");
      const hintCount = document.querySelectorAll(".solution-hint").length;
      expect(hintCount, practice.id).toBeGreaterThanOrEqual(2);
      expect(hintCount, practice.id).toBeLessThanOrEqual(3);
      expect(document.querySelectorAll(".solution-reveal"), practice.id).toHaveLength(1);
      expect(document.querySelector(".solution-reveal")?.textContent.length, practice.id).toBeGreaterThan(180);
    });
  });

  it("registra explicitamente exercícios experimentais e erratas editoriais", () => {
    const exercise50 = practices.find(({ anchor }) => anchor === "exercicio-5-50");
    const exercise60 = practices.find(({ anchor }) => anchor === "exercicio-5-60");
    expect(String(exercise50?.content)).toContain("Errata matemática");
    expect(String(exercise60?.content)).toContain("parte genuinamente experimental");
  });

  it("entrega os artefatos textuais e executáveis pedidos", () => {
    const byExercise = (exercise: string) =>
      String(practices.find((practice) => practice.anchor === "exercicio-" + exercise.replace(".", "-"))?.content);
    expect(byExercise("5.2")).toContain("Uma rima possível");
    expect(byExercise("5.16")).toContain("Texto claro integral recuperado");
    expect(byExercise("5.16")).toContain("we were all going direct the other way");
    expect(byExercise("5.42")).toContain("function rhoDlp");
    expect(byExercise("5.44")).toContain("function rhoFactor");
    expect(byExercise("5.56")).toContain("\\ln u\\le u-1");
    expect(byExercise("5.60")).toContain("H(L^2)/2");
    expect(byExercise("5.4")).toContain("A₁A₂B₁B₂");
    expect(byExercise("5.18")).toContain("11, 151, 186");
    expect(byExercise("5.18")).toContain("0,079640");
    expect(byExercise("5.23")).toContain("Hipóteses de domínio");
    expect(byExercise("5.44")).toContain("N=15");
    expect(byExercise("5.60")).toContain('[..."abcdefghijklmnopqrstuvwxyz"]');
  });

  it("reserva duas dicas apenas aos seis exercícios realmente curtos", () => {
    const counts = practices.map((practice) => {
      const { document } = parseHTML("<html><body>" + String(practice.content) + "</body></html>");
      return document.querySelectorAll(".solution-hint").length;
    });
    expect(counts.filter((count) => count === 3)).toHaveLength(54);
    expect(counts.filter((count) => count === 2)).toHaveLength(6);
  });

  it("não deixa whitespace residual nos HTMLs editoriais", () => {
    practices.forEach((practice) => {
      expect(String(practice.content), practice.id).not.toMatch(/[ \t]+$/m);
    });
  });
});
