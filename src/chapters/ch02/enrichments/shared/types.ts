import type { EnrichmentDefinition, EnrichmentLayer } from "../../../../framework/types";

export type EnrichmentItem = EnrichmentDefinition;

export interface EnrichmentModule {
  id: string;
  layer: Extract<EnrichmentLayer, "lab" | "practice" | "history" | "reading">;
  anchor: string;
  kicker: string;
  title: string;
  meta: string;
  html: string;
  init?: (root: HTMLElement) => void | (() => void);
  tags?: readonly string[];
}

export interface PracticeChoice {
  value: string;
  label: string;
}

export interface PracticeConfig {
  id: string;
  anchor: string;
  title: string;
  prompt: string;
  choices?: PracticeChoice[];
  inputmode?: string;
  placeholder?: string;
  check: (answer: string) => boolean;
  correctFeedback: string;
  /** HTML editorial estático. A resposta do leitor não é exposta para evitar interpolação insegura. */
  wrongFeedback: () => string;
  hints: string[];
  solution: string;
  meta?: string;
}

export interface GeneratedProblem {
  prompt: string;
  answer: string;
  hints: string[];
  correctFeedback: string;
  wrongFeedback: string;
  solution: string;
}

export interface GeneratedPracticeConfig {
  id: string;
  anchor: string;
  title: string;
  intro?: string;
  build: (seed: number) => GeneratedProblem;
}
