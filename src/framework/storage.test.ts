import { describe, expect, it } from "vitest";
import { defaultPreferences, validatePreferences } from "./storage";

describe("preferências do leitor", () => {
  it("preserva uma lista de camadas vazia como modo só texto", () => {
    const fallback = defaultPreferences();
    expect(validatePreferences({ ...fallback, layers: [] }, fallback).layers).toEqual([]);
  });

  it("usa o tema de fallback quando o estado salvo não traz um tema válido", () => {
    const fallback = { ...defaultPreferences(), theme: "dark" as const };
    expect(validatePreferences({ ...fallback, theme: "desconhecido" }, fallback).theme).toBe("dark");
  });

  it("mantém apenas estados de progresso reconhecidos", () => {
    const fallback = defaultPreferences();
    const value = validatePreferences({
      ...fallback,
      progress: { secao: "started", exercicio: "completed", invalido: "feito" },
    }, fallback);
    expect(value.progress).toEqual({ secao: "started", exercicio: "completed" });
  });
});
