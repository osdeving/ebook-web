import { listen, queryOptional } from "./dom";

export interface ProgressOptions {
  article: HTMLElement;
  initialSection?: string;
  onSectionChange?(sectionId: string): void;
}

export function mountReadingProgress(options: ProgressOptions): () => void {
  const bar = queryOptional<HTMLElement>("[data-reader-progress]");
  const backTop = queryOptional<HTMLElement>("[data-reader-back-top]");
  const sections = Array.from(options.article.querySelectorAll<HTMLElement>("section[id]"));
  let frame = 0;
  let current = "";

  const update = (saveSection = true) => {
    frame = 0;
    // O denominador pertence exclusivamente ao artigo. Toolbars e drawers
    // expansivos nao alteram o progresso de leitura.
    const start = options.article.getBoundingClientRect().top + scrollY;
    const end = start + options.article.scrollHeight - innerHeight;
    const distance = Math.max(1, end - start);
    const percent = Math.min(100, Math.max(0, ((scrollY - start) / distance) * 100));
    if (bar) bar.style.width = `${percent}%`;
    backTop?.classList.toggle("visible", scrollY > 900);

    const threshold = Math.min(innerHeight * 0.32, 260);
    const section = sections
      .filter((candidate) => candidate.getBoundingClientRect().top <= threshold)
      .at(-1) ?? sections[0];
    if (section && section.id !== current) {
      current = section.id;
      if (saveSection) options.onSectionChange?.(current);
      syncToc(current);
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => update(true));
  };
  const cleanups = [
    listen(window, "scroll", schedule, { passive: true }),
    listen(window, "resize", schedule, { passive: true }),
  ];
  mountResume(options.article, options.initialSection);
  update(false);
  return () => {
    cleanups.forEach((cleanup) => cleanup());
    if (frame) cancelAnimationFrame(frame);
  };
}

function mountResume(article: HTMLElement, sectionId?: string): void {
  const host = queryOptional<HTMLElement>("[data-reader-resume]");
  const button = host?.querySelector<HTMLButtonElement>("[data-reader-resume-button]");
  const label = host?.querySelector<HTMLElement>("[data-reader-resume-label]");
  if (!host || !button || !sectionId || location.hash) return;
  const section = article.querySelector<HTMLElement>(`#${CSS.escape(sectionId)}`);
  if (!section) return;
  const title = section.querySelector("h2, h3")?.textContent?.trim() ?? sectionId;
  if (label) label.textContent = title;
  host.hidden = false;
  button.addEventListener("click", () => {
    history.pushState(history.state, "", `#${sectionId}`);
    section.scrollIntoView({ block: "start", behavior: "smooth" });
    host.hidden = true;
  }, { once: true });
}

function syncToc(sectionId: string): void {
  document.querySelectorAll<HTMLAnchorElement>("[data-reader-toc] a[href^='#']").forEach((link) => {
    const active = link.hash.slice(1) === sectionId;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
