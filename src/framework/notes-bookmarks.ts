import { listen } from "./dom";
import type { ReaderPreferences } from "./types";

export interface NotesBookmarksOptions {
  article: HTMLElement;
  preferences: ReaderPreferences;
  persist(): void;
  announce(message: string): void;
}

export function mountNotesAndBookmarks(options: NotesBookmarksOptions): () => void {
  const cleanups: Array<() => void> = [];
  const sections = Array.from(options.article.querySelectorAll<HTMLElement>("section[id]"));

  for (const section of sections) {
    const heading = section.querySelector<HTMLElement>("h2, h3");
    if (!heading || section.querySelector(":scope > .enrichment-section-tools")) continue;
    const tools = document.createElement("div");
    tools.className = "enrichment-section-tools";
    tools.dataset.sectionTools = section.id;

    const bookmark = document.createElement("button");
    bookmark.type = "button";
    bookmark.className = "enrichment-bookmark-toggle";
    bookmark.dataset.bookmarkSection = section.id;
    bookmark.setAttribute("aria-label", `Marcar ${heading.textContent?.trim() ?? "seção"}`);

    const noteButton = document.createElement("button");
    noteButton.type = "button";
    noteButton.className = "enrichment-note-toggle";
    noteButton.textContent = "Nota local";

    const panel = createNotePanel(section.id, options, cleanups);
    noteButton.setAttribute("aria-controls", panel.id);
    noteButton.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    cleanups.push(listen(bookmark, "click", () => {
      const bookmarks = new Set(options.preferences.bookmarks);
      const adding = !bookmarks.has(section.id);
      if (adding) bookmarks.add(section.id);
      else bookmarks.delete(section.id);
      options.preferences.bookmarks = [...bookmarks];
      syncBookmark(bookmark, adding);
      options.persist();
      renderBookmarkList(options);
      options.announce(adding ? "Seção adicionada aos marcadores." : "Seção removida dos marcadores.");
    }));
    cleanups.push(listen(noteButton, "click", () => {
      panel.hidden = !panel.hidden;
      noteButton.setAttribute("aria-expanded", String(!panel.hidden));
      if (!panel.hidden) panel.querySelector<HTMLTextAreaElement>("textarea")?.focus();
    }));

    tools.append(bookmark, noteButton, panel);
    heading.after(tools);
    syncBookmark(bookmark, options.preferences.bookmarks.includes(section.id));
  }

  renderBookmarkList(options);
  cleanups.push(listen(document, "click", ((event: Event) => {
    const target = event.target as Element;
    const link = target.closest<HTMLAnchorElement>("[data-bookmark-link]");
    if (link) document.querySelector<HTMLElement>(link.hash)?.scrollIntoView({ block: "start" });
    const remove = target.closest<HTMLButtonElement>("[data-remove-bookmark]");
    if (remove?.dataset.removeBookmark) {
      options.preferences.bookmarks = options.preferences.bookmarks.filter((id) => id !== remove.dataset.removeBookmark);
      options.persist();
      renderBookmarkList(options);
      const toggle = options.article.querySelector<HTMLButtonElement>(`[data-bookmark-section="${CSS.escape(remove.dataset.removeBookmark)}"]`);
      if (toggle) syncBookmark(toggle, false);
    }
  }) as EventListener));

  return () => cleanups.reverse().forEach((cleanup) => cleanup());
}

function createNotePanel(
  sectionId: string,
  options: NotesBookmarksOptions,
  cleanups: Array<() => void>,
): HTMLElement {
  const panel = document.createElement("div");
  panel.className = "notes-panel";
  panel.id = `reader-note-${sectionId}`;
  const label = document.createElement("label");
  label.textContent = "Sua nota privada neste navegador";
  const textarea = document.createElement("textarea");
  textarea.rows = 4;
  textarea.maxLength = 4000;
  textarea.value = options.preferences.notes[sectionId] ?? "";
  label.append(textarea);
  const footer = document.createElement("div");
  footer.className = "notes-panel__actions";
  const status = document.createElement("span");
  status.className = "notes-panel__status";
  status.textContent = textarea.value ? "Nota salva localmente" : "";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "Apagar nota";
  footer.append(status, remove);
  panel.append(label, footer);

  let timer = 0;
  cleanups.push(listen(textarea, "input", () => {
    window.clearTimeout(timer);
    status.textContent = "Salvando…";
    timer = window.setTimeout(() => {
      const value = textarea.value.trim();
      if (value) options.preferences.notes[sectionId] = value;
      else delete options.preferences.notes[sectionId];
      options.persist();
      status.textContent = value ? "Nota salva localmente" : "";
    }, 220);
  }));
  cleanups.push(() => window.clearTimeout(timer));
  cleanups.push(listen(remove, "click", () => {
    if (!textarea.value && !options.preferences.notes[sectionId]) return;
    if (!window.confirm("Apagar esta nota local?")) return;
    textarea.value = "";
    delete options.preferences.notes[sectionId];
    options.persist();
    status.textContent = "Nota apagada";
  }));
  return panel;
}

function syncBookmark(button: HTMLButtonElement, marked: boolean): void {
  button.setAttribute("aria-pressed", String(marked));
  button.textContent = marked ? "★ Marcado" : "☆ Marcar";
}

function renderBookmarkList(options: NotesBookmarksOptions): void {
  const host = document.querySelector<HTMLElement>("[data-bookmark-list]");
  const count = document.querySelector<HTMLElement>("[data-bookmark-count]");
  const valid = options.preferences.bookmarks.filter((id) => options.article.querySelector(`#${CSS.escape(id)}`));
  options.preferences.bookmarks = valid;
  if (count) count.textContent = String(valid.length);
  if (!host) return;
  host.replaceChildren();
  if (!valid.length) {
    const empty = document.createElement("p");
    empty.className = "enrichment-empty";
    empty.textContent = "Nenhuma seção marcada ainda.";
    host.append(empty);
    return;
  }
  const list = document.createElement("ul");
  list.className = "bookmark-list";
  for (const id of valid) {
    const section = options.article.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    const item = document.createElement("li");
    item.className = "bookmark-list__item";
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.dataset.bookmarkLink = "";
    link.className = "bookmark-list__link";
    link.textContent = section?.querySelector("h2, h3")?.textContent?.trim() ?? id;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.removeBookmark = id;
    remove.setAttribute("aria-label", `Remover marcador ${link.textContent}`);
    remove.textContent = "×";
    item.append(link, remove);
    list.append(item);
  }
  host.append(list);
}
