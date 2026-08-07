import { escapeHtml } from "./dom";

export const tableHtml = (
  caption: string,
  headings: unknown[],
  rows: unknown[][]
): string => `
  <div class="lab-table-wrap">
    <table class="lab-table supplement-lab__table">
      <caption>${escapeHtml(caption)}</caption>
      <thead><tr>${headings.map((heading) => `<th scope="col">${escapeHtml(heading)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  </div>`;

export const readingCard = ({
  badge,
  title,
  why,
  href,
  source,
  level
}: Record<"badge" | "title" | "why" | "href" | "source" | "level", string>): string => `
  <article class="reading-card">
    <div class="reading-card-top"><span class="reading-badge">${badge}</span><span class="reading-level">${level}</span></div>
    <h4>${title}</h4>
    <p>${why}</p>
    <a href="${href}" target="_blank" rel="noopener noreferrer" hreflang="en">Abrir ${source}<span class="sr-only"> em nova aba</span></a>
  </article>`;
