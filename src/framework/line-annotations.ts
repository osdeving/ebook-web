import { listen } from './dom';
import { mountInkNoteDialog, type InkNoteDraft } from './ink-note-dialog';
import {
  placeSourceAnchor,
  sourcePositionFromPoint,
  sourceSectionLabel,
  sourceSelection,
  type SourcePosition,
  type SourceSelection,
} from './source-position';
import type { ReaderInkNote, ReaderPreferences, ReaderTextBookmark } from './types';

export interface LineAnnotationsOptions {
  article: HTMLElement;
  preferences: ReaderPreferences;
  persist(): void;
  persistNow?(): boolean;
  announce(message: string): void;
}

export function mountLineAnnotations(options: LineAnnotationsOptions): () => void {
  const cleanups: Array<() => void> = [];
  const selectionToolbar = createSelectionToolbar();
  const bookmarkSelection = selectionToolbar.querySelector<HTMLButtonElement>('[data-save-text-bookmark]')!;
  const inkSelection = selectionToolbar.querySelector<HTMLButtonElement>('[data-start-ink-from-selection]')!;
  document.body.append(selectionToolbar);
  cleanups.push(() => selectionToolbar.remove());

  const picker = createInkPicker();
  const pickerCancel = picker.querySelector<HTMLButtonElement>('[data-cancel-ink-picker]')!;
  document.body.append(picker);
  cleanups.push(() => picker.remove());

  const modeButton = document.querySelector<HTMLButtonElement>('[data-ink-note-mode]');
  let activeSelection: SourceSelection | undefined;
  let pendingInkPosition: SourcePosition | undefined;
  let pickingInkAnchor = false;
  let selectionFrame = 0;

  const editor = mountInkNoteDialog({
    announce: options.announce,
    save(draft, note) {
      const savedTarget = saveInkNote(options, draft, pendingInkPosition, note);
      if (!savedTarget) return false;
      const anchorId = savedTarget.dataset.inkNoteAnchor;
      pendingInkPosition = undefined;
      restoreAnchors(options);
      renderLineAnnotationLists(options);
      return anchorId
        ? document.querySelector<HTMLElement>('[data-ink-note-anchor="' + cssEscape(anchorId) + '"]') ?? savedTarget
        : savedTarget;
    },
    remove(note) {
      const previous = options.preferences.inkNotes;
      options.preferences.inkNotes = options.preferences.inkNotes.filter(({ id }) => id !== note.id);
      document.querySelector('[data-ink-note-anchor="' + cssEscape(note.id) + '"]')?.remove();
      if (!persistExplicitly(options)) {
        options.preferences.inkNotes = previous;
        restoreAnchors(options);
        renderLineAnnotationLists(options);
        return false;
      }
      renderLineAnnotationLists(options);
      options.announce('Rascunho removido.');
      return true;
    },
  });
  cleanups.push(() => editor.destroy());

  const cancelPicker = () => {
    pickingInkAnchor = false;
    picker.hidden = true;
    document.body.classList.remove('reader-picking-ink-anchor');
    modeButton?.setAttribute('aria-pressed', 'false');
  };
  const beginPicker = () => {
    cancelPicker();
    pickingInkAnchor = true;
    picker.hidden = false;
    document.body.classList.add('reader-picking-ink-anchor');
    modeButton?.setAttribute('aria-pressed', 'true');
    document.querySelector<HTMLButtonElement>('[data-reader-drawer-close]')?.click();
    options.announce('Modo rascunho ativado. Toque ou clique na linha onde a taxinha deve ficar.');
  };

  cleanups.push(listen(modeButton ?? document.body, 'click', () => {
    if (!modeButton) return;
    if (pickingInkAnchor) cancelPicker();
    else beginPicker();
  }));
  cleanups.push(listen(pickerCancel, 'click', () => {
    cancelPicker();
    focusVisible(modeButton, document.querySelector<HTMLElement>('[data-reader-drawer-open]'));
    options.announce('Criação de rascunho cancelada.');
  }));

  const syncSelectionToolbar = () => {
    window.cancelAnimationFrame(selectionFrame);
    selectionFrame = window.requestAnimationFrame(() => {
      const candidate = sourceSelection(options.article);
      if (!candidate || pickingInkAnchor) {
        selectionToolbar.hidden = true;
        activeSelection = undefined;
        return;
      }
      activeSelection = candidate;
      positionSelectionToolbar(selectionToolbar, candidate.rect);
      selectionToolbar.hidden = false;
    });
  };
  cleanups.push(() => window.cancelAnimationFrame(selectionFrame));
  cleanups.push(listen(document, 'selectionchange', syncSelectionToolbar));
  cleanups.push(listen(window, 'scroll', () => { selectionToolbar.hidden = true; }, { passive: true }));
  cleanups.push(listen(window, 'resize', () => { selectionToolbar.hidden = true; }));
  cleanups.push(listen(selectionToolbar, 'pointerdown', ((event: PointerEvent) => event.preventDefault()) as EventListener));

  const markActiveSelection = () => {
    if (!activeSelection) return;
    if (!saveTextBookmark(options, activeSelection)) return;
    selectionToolbar.hidden = true;
    document.getSelection()?.removeAllRanges();
    activeSelection = undefined;
    renderLineAnnotationLists(options);
  };
  const inkFromActiveSelection = () => {
    if (!activeSelection) return;
    const position = { sectionId: activeSelection.sectionId, offset: activeSelection.offset };
    pendingInkPosition = position;
    selectionToolbar.hidden = true;
    document.getSelection()?.removeAllRanges();
    activeSelection = undefined;
    editor.open(undefined, sourceFocusTarget(options.article, position));
  };
  cleanups.push(listen(bookmarkSelection, 'click', markActiveSelection));
  cleanups.push(listen(inkSelection, 'click', inkFromActiveSelection));

  cleanups.push(listen(options.article, 'click', ((event: MouseEvent) => {
    const target = event.target as Element;
    const inkPin = target.closest<HTMLElement>('[data-ink-note-anchor]');
    if (inkPin?.dataset.inkNoteAnchor) {
      const note = options.preferences.inkNotes.find(({ id }) => id === inkPin.dataset.inkNoteAnchor);
      if (note) editor.open(note, inkPin);
      return;
    }
    if (!pickingInkAnchor) return;
    if (target.closest('button, a, input, select, textarea, .katex, svg, [data-origin="editorial"]')) {
      options.announce('Escolha uma linha do texto-fonte, fora de links e controles.');
      return;
    }
    const position = sourcePositionFromPoint(options.article, event.clientX, event.clientY);
    if (!position) {
      options.announce('Não foi possível ancorar nessa posição. Tente tocar diretamente sobre uma linha de texto.');
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    pendingInkPosition = position;
    cancelPicker();
    editor.open(undefined, sourceElementFocusTarget(target, options.article, position));
  }) as EventListener, true));

  cleanups.push(listen(document, 'click', ((event: MouseEvent) => {
    const target = event.target as Element;
    const textJump = target.closest<HTMLButtonElement>('[data-text-bookmark-link]');
    if (textJump?.dataset.textBookmarkLink) {
      jumpToAnchor('text-bookmark', textJump.dataset.textBookmarkLink);
      return;
    }
    const inkJump = target.closest<HTMLButtonElement>('[data-ink-note-link]');
    if (inkJump?.dataset.inkNoteLink) {
      jumpToAnchor('ink-note', inkJump.dataset.inkNoteLink);
      return;
    }
    const removeText = target.closest<HTMLButtonElement>('[data-remove-text-bookmark]');
    if (removeText?.dataset.removeTextBookmark) {
      const previous = options.preferences.textBookmarks;
      options.preferences.textBookmarks = options.preferences.textBookmarks.filter(({ id }) => id !== removeText.dataset.removeTextBookmark);
      document.querySelector('[data-text-bookmark-anchor="' + cssEscape(removeText.dataset.removeTextBookmark) + '"]')?.remove();
      if (!persistExplicitly(options)) {
        options.preferences.textBookmarks = previous;
        restoreAnchors(options);
        renderLineAnnotationLists(options);
        return;
      }
      renderLineAnnotationLists(options);
      options.announce('Marcador de trecho removido.');
      return;
    }
    const removeInk = target.closest<HTMLButtonElement>('[data-remove-ink-note]');
    if (removeInk?.dataset.removeInkNote) {
      const note = options.preferences.inkNotes.find(({ id }) => id === removeInk.dataset.removeInkNote);
      if (!note || !window.confirm('Apagar este rascunho à mão?')) return;
      const previous = options.preferences.inkNotes;
      options.preferences.inkNotes = options.preferences.inkNotes.filter(({ id }) => id !== note.id);
      document.querySelector('[data-ink-note-anchor="' + cssEscape(note.id) + '"]')?.remove();
      if (!persistExplicitly(options)) {
        options.preferences.inkNotes = previous;
        restoreAnchors(options);
        renderLineAnnotationLists(options);
        return;
      }
      renderLineAnnotationLists(options);
      options.announce('Rascunho removido.');
    }
  }) as EventListener));

  cleanups.push(listen(document, 'keydown', ((event: KeyboardEvent) => {
    if (event.key === 'Escape' && pickingInkAnchor) {
      cancelPicker();
      focusVisible(modeButton, document.querySelector<HTMLElement>('[data-reader-drawer-open]'));
      return;
    }
    if (!activeSelection || !event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) return;
    if (event.code === 'KeyM') {
      event.preventDefault();
      markActiveSelection();
    } else if (event.code === 'KeyR') {
      event.preventDefault();
      inkFromActiveSelection();
    }
  }) as EventListener));

  restoreAnchors(options);
  renderLineAnnotationLists(options);
  return () => {
    cancelPicker();
    cleanups.reverse().forEach((cleanup) => cleanup());
  };
}

export function renderLineAnnotationLists(options: LineAnnotationsOptions): void {
  const textHost = document.querySelector<HTMLElement>('[data-text-bookmark-list]');
  const inkHost = document.querySelector<HTMLElement>('[data-ink-note-list]');
  const validText = options.preferences.textBookmarks.filter(({ sectionId, id }) => (
    options.article.querySelector('#' + cssEscape(sectionId))
    && document.querySelector('[data-text-bookmark-anchor="' + cssEscape(id) + '"]')
  ));
  const validInk = options.preferences.inkNotes.filter(({ sectionId, id }) => (
    options.article.querySelector('#' + cssEscape(sectionId))
    && document.querySelector('[data-ink-note-anchor="' + cssEscape(id) + '"]')
  ));
  options.preferences.textBookmarks = validText;
  options.preferences.inkNotes = validInk;
  if (textHost) renderTextBookmarks(textHost, validText, options.article);
  if (inkHost) renderInkNotes(inkHost, validInk, options.article);
  updateBookmarkCount(options);
}

export function updateBookmarkCount(options: LineAnnotationsOptions): void {
  const count = document.querySelector<HTMLElement>('[data-bookmark-count]');
  if (count) count.textContent = String(
    options.preferences.bookmarks.length
    + options.preferences.textBookmarks.length
    + options.preferences.inkNotes.length,
  );
}

function saveTextBookmark(options: LineAnnotationsOptions, selection: SourceSelection): boolean {
  if (options.preferences.textBookmarks.length >= 100) {
    options.announce('O limite de 100 marcadores de trecho neste capítulo foi atingido.');
    return false;
  }
  const duplicate = options.preferences.textBookmarks.find(({ sectionId, offset }) => (
    sectionId === selection.sectionId && Math.abs(offset - selection.offset) <= 1
  ));
  if (duplicate) {
    jumpToAnchor('text-bookmark', duplicate.id);
    options.announce('Este ponto já está marcado.');
    return true;
  }
  const bookmark: ReaderTextBookmark = {
    id: localId(),
    sectionId: selection.sectionId,
    offset: selection.offset,
    quote: selection.quote,
    createdAt: new Date().toISOString(),
  };
  const marker = createTextMarker(bookmark);
  if (!placeSourceAnchor(options.article, bookmark, marker)) {
    options.announce('Não foi possível salvar esse ponto. Tente selecionar outra linha.');
    return false;
  }
  options.preferences.textBookmarks.push(bookmark);
  if (!persistExplicitly(options)) {
    options.preferences.textBookmarks = options.preferences.textBookmarks.filter(({ id }) => id !== bookmark.id);
    marker.remove();
    return false;
  }
  options.announce('Trecho adicionado aos marcadores.');
  return true;
}

function saveInkNote(
  options: LineAnnotationsOptions,
  draft: InkNoteDraft,
  position: SourcePosition | undefined,
  existing?: ReaderInkNote,
): HTMLElement | false {
  if (existing) {
    const previousLabel = existing.label;
    const previousStrokes = existing.strokes;
    existing.label = draft.label;
    existing.strokes = draft.strokes;
    const pin = document.querySelector<HTMLElement>('[data-ink-note-anchor="' + cssEscape(existing.id) + '"]');
    pin?.setAttribute('aria-label', 'Abrir rascunho: ' + existing.label);
    pin?.setAttribute('title', existing.label);
    if (!persistExplicitly(options)) {
      existing.label = previousLabel;
      existing.strokes = previousStrokes;
      pin?.setAttribute('aria-label', 'Abrir rascunho: ' + previousLabel);
      pin?.setAttribute('title', previousLabel);
      return false;
    }
    options.announce('Rascunho atualizado.');
    return pin ?? sourceFocusTarget(options.article, existing);
  }
  if (!position) return false;
  if (options.preferences.inkNotes.length >= 20) {
    options.announce('O limite de 20 rascunhos neste capítulo foi atingido.');
    return false;
  }
  const note: ReaderInkNote = {
    id: localId(),
    sectionId: position.sectionId,
    offset: position.offset,
    label: draft.label,
    createdAt: new Date().toISOString(),
    strokes: draft.strokes,
  };
  const pin = createInkPin(note);
  if (!placeSourceAnchor(options.article, note, pin)) {
    options.announce('Não foi possível colocar a taxinha nessa linha.');
    return false;
  }
  options.preferences.inkNotes.push(note);
  if (!persistExplicitly(options)) {
    options.preferences.inkNotes = options.preferences.inkNotes.filter(({ id }) => id !== note.id);
    pin.remove();
    return false;
  }
  options.announce('Rascunho salvo como uma taxinha na linha.');
  return pin;
}

function restoreAnchors(options: LineAnnotationsOptions): void {
  options.article.querySelectorAll('[data-text-bookmark-anchor], [data-ink-note-anchor]').forEach((element) => element.remove());
  options.preferences.textBookmarks = options.preferences.textBookmarks.filter((bookmark) => (
    placeSourceAnchor(options.article, bookmark, createTextMarker(bookmark))
  ));
  options.preferences.inkNotes = options.preferences.inkNotes.filter((note) => {
    const pin = createInkPin(note);
    return placeSourceAnchor(options.article, note, pin);
  });
}

function createTextMarker(bookmark: ReaderTextBookmark): HTMLSpanElement {
  const marker = document.createElement('span');
  marker.id = 'reader-text-bookmark-' + bookmark.id;
  marker.className = 'text-bookmark-marker';
  marker.dataset.textBookmarkAnchor = bookmark.id;
  marker.tabIndex = -1;
  marker.setAttribute('aria-label', 'Ponto marcado: ' + bookmark.quote);
  marker.title = 'Trecho marcado';
  return marker;
}

function createInkPin(note: ReaderInkNote): HTMLButtonElement {
  const pin = document.createElement('button');
  pin.id = 'reader-ink-note-' + note.id;
  pin.type = 'button';
  pin.className = 'ink-note-pin';
  pin.dataset.inkNoteAnchor = note.id;
  pin.setAttribute('aria-label', 'Abrir rascunho: ' + note.label);
  pin.title = note.label;
  return pin;
}

function createSelectionToolbar(): HTMLDivElement {
  const toolbar = document.createElement('div');
  toolbar.className = 'line-selection-toolbar';
  toolbar.hidden = true;
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Ações para o trecho selecionado');
  const bookmark = document.createElement('button');
  bookmark.type = 'button';
  bookmark.dataset.saveTextBookmark = '';
  bookmark.setAttribute('aria-keyshortcuts', 'Alt+Shift+M');
  bookmark.title = 'Marcar trecho (Alt+Shift+M)';
  bookmark.textContent = '☆ Marcar trecho';
  const ink = document.createElement('button');
  ink.type = 'button';
  ink.dataset.startInkFromSelection = '';
  ink.setAttribute('aria-keyshortcuts', 'Alt+Shift+R');
  ink.title = 'Criar rascunho (Alt+Shift+R)';
  ink.textContent = '✎ Rascunho';
  toolbar.append(bookmark, ink);
  return toolbar;
}

function createInkPicker(): HTMLDivElement {
  const picker = document.createElement('div');
  picker.className = 'ink-anchor-picker';
  picker.hidden = true;
  picker.setAttribute('role', 'status');
  const text = document.createElement('span');
  text.textContent = 'Toque ou clique na linha onde ficará a taxinha.';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.dataset.cancelInkPicker = '';
  cancel.textContent = 'Cancelar';
  picker.append(text, cancel);
  return picker;
}

function positionSelectionToolbar(toolbar: HTMLElement, rect: DOMRect): void {
  toolbar.style.left = Math.max(8, Math.min(window.innerWidth - 220, rect.left + rect.width / 2 - 105)) + 'px';
  const above = rect.top - 52;
  const preferred = above > 8 ? above : rect.bottom + 10;
  toolbar.style.top = Math.max(8, Math.min(window.innerHeight - 58, preferred)) + 'px';
}

function renderTextBookmarks(host: HTMLElement, bookmarks: readonly ReaderTextBookmark[], article: HTMLElement): void {
  host.replaceChildren();
  if (!bookmarks.length) {
    host.append(empty('Selecione um trecho do texto para marcar a linha exata.'));
    return;
  }
  const list = document.createElement('ul');
  list.className = 'bookmark-list bookmark-list--text';
  for (const bookmark of bookmarks) {
    const item = document.createElement('li');
    item.className = 'bookmark-list__item bookmark-list__item--stacked';
    const jump = document.createElement('button');
    jump.type = 'button';
    jump.className = 'bookmark-list__link bookmark-list__link--quote';
    jump.dataset.textBookmarkLink = bookmark.id;
    const quote = document.createElement('span');
    quote.textContent = '“' + bookmark.quote + '”';
    const context = document.createElement('small');
    context.textContent = sourceSectionLabel(article, bookmark.sectionId) + ' · ' + formatDate(bookmark.createdAt);
    jump.append(quote, context);
    item.append(jump, removeButton('Remover marcador de trecho', 'removeTextBookmark', bookmark.id));
    list.append(item);
  }
  host.append(list);
}

function renderInkNotes(host: HTMLElement, notes: readonly ReaderInkNote[], article: HTMLElement): void {
  host.replaceChildren();
  if (!notes.length) {
    host.append(empty('Ative “Rascunho em uma linha” para escrever com caneta, toque ou mouse.'));
    return;
  }
  const list = document.createElement('ul');
  list.className = 'bookmark-list bookmark-list--ink';
  for (const note of notes) {
    const item = document.createElement('li');
    item.className = 'bookmark-list__item bookmark-list__item--stacked';
    const jump = document.createElement('button');
    jump.type = 'button';
    jump.className = 'bookmark-list__link bookmark-list__link--quote';
    jump.dataset.inkNoteLink = note.id;
    const title = document.createElement('span');
    title.textContent = '📌 ' + note.label;
    const context = document.createElement('small');
    context.textContent = sourceSectionLabel(article, note.sectionId) + ' · ' + formatDate(note.createdAt);
    jump.append(title, context);
    item.append(jump, removeButton('Apagar rascunho ' + note.label, 'removeInkNote', note.id));
    list.append(item);
  }
  host.append(list);
}

function removeButton(label: string, datasetKey: 'removeTextBookmark' | 'removeInkNote', id: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'bookmark-list__remove';
  button.dataset[datasetKey] = id;
  button.setAttribute('aria-label', label);
  button.textContent = '×';
  return button;
}

function jumpToAnchor(kind: 'text-bookmark' | 'ink-note', id: string): void {
  document.querySelector<HTMLButtonElement>('[data-reader-drawer-close]')?.click();
  const marker = document.querySelector<HTMLElement>('[data-' + kind + '-anchor="' + cssEscape(id) + '"]');
  if (!marker) return;
  marker.scrollIntoView({ block: 'center', behavior: 'smooth' });
  marker.focus({ preventScroll: true });
  marker.classList.remove('is-highlighted');
  requestAnimationFrame(() => marker.classList.add('is-highlighted'));
  window.setTimeout(() => marker.classList.remove('is-highlighted'), 1800);
}

function empty(message: string): HTMLParagraphElement {
  const paragraph = document.createElement('p');
  paragraph.className = 'enrichment-empty';
  paragraph.textContent = message;
  return paragraph;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? 'salvo localmente' : date.toLocaleDateString('pt-BR');
}

function persistExplicitly(options: LineAnnotationsOptions): boolean {
  if (options.persistNow) return options.persistNow();
  options.persist();
  return true;
}

function sourceFocusTarget(article: HTMLElement, position: SourcePosition): HTMLElement {
  const section = article.querySelector<HTMLElement>('#' + cssEscape(position.sectionId));
  const target = section?.querySelector<HTMLElement>('h2, h3') ?? section ?? article;
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
  return target;
}

function sourceElementFocusTarget(target: Element, article: HTMLElement, position: SourcePosition): HTMLElement {
  const block = target.closest<HTMLElement>('p, li, blockquote, figcaption, td, th, h2, h3, h4, pre');
  if (!block || !article.contains(block)) return sourceFocusTarget(article, position);
  if (!block.hasAttribute('tabindex')) block.tabIndex = -1;
  return block;
}

function focusVisible(...candidates: Array<HTMLElement | null | undefined>): void {
  const target = candidates.find((candidate) => {
    if (!candidate?.isConnected || candidate.closest('[hidden], [inert]')) return false;
    return typeof candidate.getClientRects !== 'function' || candidate.getClientRects().length > 0;
  });
  target?.focus({ preventScroll: true });
}

function localId(): string {
  return globalThis.crypto?.randomUUID?.() ?? (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
}

function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, (character) => '\\' + character);
}
