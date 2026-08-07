import { trustedHtml } from "../../../../framework/trusted-html";
import type { EnrichmentDefinition, EnrichmentMountContext } from "../../../../framework/types";
import type { EnrichmentModule } from "./types";

/**
 * Adapta o formato editorial compacto usado pelos capítulos ao contrato único
 * do framework. O resultado já pode entrar diretamente no registro global.
 */
export const defineEnrichment = (module: EnrichmentModule): EnrichmentDefinition => {
  const section = module.meta.match(/Seção\s+([^·]+)/i)?.[1]?.trim()
    ?? module.anchor.match(/(?:sec|exp)-(\d+(?:-\d+)*)/)?.[1]
    ?? "chapter";

  return Object.freeze({
    id: module.id,
    layer: module.layer,
    anchor: module.anchor,
    title: module.title,
    kicker: module.kicker,
    duration: module.meta,
    collapsible: true,
    content: trustedHtml(module.html),
    initialize: module.init
      ? ({ host }: EnrichmentMountContext) => module.init?.(host)
      : undefined,
    tags: Object.freeze([module.layer, `section:${section}`, ...(module.tags ?? [])])
  });
};
