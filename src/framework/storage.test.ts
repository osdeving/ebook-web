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

  it("valida marcadores de trecho e rascunhos sem perder preferências antigas", () => {
    const fallback = defaultPreferences();
    const value = validatePreferences({
      ...fallback,
      textBookmarks: [{
        id: "trecho-1",
        sectionId: "sec-1-1",
        offset: 42,
        quote: "um trecho selecionado",
        createdAt: "2026-08-07T20:00:00.000Z",
      }, {
        id: "invalido",
        sectionId: "sec-1-1",
        offset: -1,
        quote: "",
        createdAt: "agora",
      }],
      inkNotes: [{
        id: "tinta-1",
        sectionId: "sec-1-1",
        offset: 80,
        label: "Conta auxiliar",
        createdAt: "2026-08-07T20:01:00.000Z",
        strokes: [{ color: "#126e82", size: 3, points: [[0.1, 0.2, 0.5], [0.3, 0.4, 0.8]] }],
      }],
    }, fallback);
    expect(value.textBookmarks).toEqual([expect.objectContaining({ id: "trecho-1", offset: 42 })]);
    expect(value.inkNotes).toEqual([expect.objectContaining({ id: "tinta-1", offset: 80 })]);
    expect(validatePreferences({ ...fallback, textBookmarks: undefined, inkNotes: undefined }, fallback)).toMatchObject({
      textBookmarks: [],
      inkNotes: [],
    });
  });

  it("descarta IDs locais duplicados antes de restaurar âncoras no DOM", () => {
    const fallback = defaultPreferences();
    const textBookmark = {
      id: "trecho-repetido",
      sectionId: "sec-1-1",
      offset: 12,
      quote: "primeiro trecho",
      createdAt: "2026-08-07T20:00:00.000Z",
    };
    const inkNote = {
      id: "tinta-repetida",
      sectionId: "sec-1-1",
      offset: 20,
      label: "Primeiro rascunho",
      createdAt: "2026-08-07T20:01:00.000Z",
      strokes: [{ color: "#126e82", size: 3, points: [[0.1, 0.2, 0.5] as const] }],
    };
    const value = validatePreferences({
      ...fallback,
      textBookmarks: [textBookmark, { ...textBookmark, quote: "duplicado" }],
      inkNotes: [inkNote, { ...inkNote, label: "Duplicado" }],
    }, fallback);

    expect(value.textBookmarks).toEqual([textBookmark]);
    expect(value.inkNotes).toEqual([inkNote]);
  });
});
