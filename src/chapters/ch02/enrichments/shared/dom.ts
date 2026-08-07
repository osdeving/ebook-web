import { renderMath as renderFrameworkMath } from "../../../../framework/math";

export const q = (root: ParentNode, selector: string): any => root.querySelector(selector);

export const qa = (root: ParentNode, selector: string): any[] => [
  ...root.querySelectorAll(selector)
];

export const escapeHtml = (value: unknown): string => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export const normalizeText = (value: unknown): string => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim()
  .toLowerCase()
  .replace(/\s+/g, " ");

export const setFeedback = (
  root: ParentNode,
  message: string,
  tone: "info" | "success" | "warning" = "info"
): void => {
  const feedback = q(root, "[data-feedback]");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.dataset.tone = tone;
};

export const setOutput = (root: ParentNode, html: string): void => {
  const output = q(root, "[data-output]");
  if (!output) return;
  output.innerHTML = html;
  renderFrameworkMath(output);
};

export const renderMath = (root: HTMLElement): void => {
  renderFrameworkMath(root);
};
