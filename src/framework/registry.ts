import type { EnrichmentDefinition, EnrichmentLayer } from "./types";

export class EnrichmentRegistry {
  readonly #items = new Map<string, EnrichmentDefinition>();

  register(...definitions: EnrichmentDefinition[]): this {
    for (const definition of definitions) {
      validateDefinition(definition);
      if (this.#items.has(definition.id)) {
        throw new Error(`Enriquecimento duplicado: ${definition.id}`);
      }
      this.#items.set(definition.id, Object.freeze({ ...definition }));
    }
    return this;
  }

  get(id: string): EnrichmentDefinition | undefined {
    return this.#items.get(id);
  }

  all(): EnrichmentDefinition[] {
    return [...this.#items.values()];
  }

  byLayer(layer: EnrichmentLayer): EnrichmentDefinition[] {
    return this.all().filter((item) => item.layer === layer);
  }

  get size(): number {
    return this.#items.size;
  }
}

function validateDefinition(definition: EnrichmentDefinition): void {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(definition.id)) {
    throw new Error(`ID de enriquecimento invalido: ${definition.id}`);
  }
  if (!definition.anchor.trim()) throw new Error(`Ancora ausente em ${definition.id}`);
  if (!definition.title.trim()) throw new Error(`Titulo ausente em ${definition.id}`);
}
