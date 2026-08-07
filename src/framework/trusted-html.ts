import type { TrustedHtml } from "./types";

/**
 * Marca HTML editorial local como confiavel.
 *
 * Boundary de seguranca:
 * - permitido: fragmentos locais do repositorio, revisados e validados no build;
 * - proibido: notas do leitor, query string, resposta de API ou qualquer input
 *   que nao seja controlado pelo pipeline editorial;
 * - para dados variaveis use `textContent` ou uma fabrica DOM.
 */
export function trustedHtml(localEditorialHtml: string): TrustedHtml {
  return localEditorialHtml as TrustedHtml;
}

export function setTrustedHtml(target: Element, html: TrustedHtml): void {
  target.innerHTML = html;
}
