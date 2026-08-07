import { useMemo, useState } from "react";

export interface ChapterSummary {
  slug: string;
  number: string;
  title: string;
  description: string;
  href: string;
  sections: number;
  counts: Record<"explanation" | "lab" | "practice" | "history" | "reading", number>;
}

interface Props {
  chapters: ChapterSummary[];
}

const layerLabels = {
  explanation: "explicações",
  lab: "laboratórios",
  practice: "práticas",
  history: "histórias",
  reading: "leituras",
} as const;

export default function ChapterLibrary({ chapters }: Props) {
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<keyof typeof layerLabels | "all">("all");
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return chapters.filter((chapter) => {
      const textMatches = !normalized || `${chapter.title} ${chapter.description}`
        .toLocaleLowerCase("pt-BR")
        .includes(normalized);
      const layerMatches = layer === "all" || chapter.counts[layer] > 0;
      return textMatches && layerMatches;
    });
  }, [chapters, layer, query]);

  return (
    <section className="library-browser" aria-labelledby="library-title">
      <div className="library-browser__heading">
        <div>
          <p className="library-kicker">Biblioteca</p>
          <h2 id="library-title">Capítulos publicados</h2>
        </div>
        <p role="status">{visible.length} de {chapters.length}</p>
      </div>
      <div className="library-filters">
        <label>
          <span>Buscar</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Título ou assunto"
          />
        </label>
        <label>
          <span>Recurso</span>
          <select value={layer} onChange={(event) => setLayer(event.target.value as typeof layer)}>
            <option value="all">Todos</option>
            {Object.entries(layerLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="chapter-grid">
        {visible.map((chapter) => (
          <article className="chapter-card" key={chapter.slug}>
            <span className="chapter-card__number">{chapter.number}</span>
            <div>
              <p className="library-kicker">Capítulo {chapter.number}</p>
              <h3><a href={chapter.href}>{chapter.title}</a></h3>
              <p>{chapter.description}</p>
              <ul aria-label="Recursos disponíveis">
                <li>{chapter.sections} seções</li>
                {Object.entries(chapter.counts).map(([kind, count]) => (
                  <li key={kind}>{count} {layerLabels[kind as keyof typeof layerLabels]}</li>
                ))}
              </ul>
            </div>
            <a className="chapter-card__open" href={chapter.href}>Abrir capítulo <span aria-hidden="true">→</span></a>
          </article>
        ))}
      </div>
      {visible.length === 0 ? <p className="library-empty">Nenhum capítulo corresponde a esses filtros.</p> : null}
    </section>
  );
}
