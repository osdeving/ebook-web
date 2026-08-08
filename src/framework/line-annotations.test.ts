import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { mountLineAnnotations } from './line-annotations';
import { defaultPreferences } from './storage';

describe('marcadores de trecho e rascunhos ancorados', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('restaura vários pontos locais e atualiza suas listas sem alterar o texto', () => {
    const { document, window } = parseHTML(`
      <html><body>
        <main><article id="reader"><section id="sec-1"><h2>Seção um</h2><p>Alfa beta gama.</p></section></article></main>
        <button data-ink-note-mode></button><button data-reader-drawer-close></button>
        <span data-bookmark-count></span><div data-text-bookmark-list></div><div data-ink-note-list></div>
      </body></html>
    `);
    Object.assign(window, {
      requestAnimationFrame: (callback: FrameRequestCallback) => { callback(0); return 1; },
      cancelAnimationFrame: () => undefined,
    });
    vi.stubGlobal('document', document);
    vi.stubGlobal('window', window);
    vi.stubGlobal('Node', window.Node);
    vi.stubGlobal('NodeFilter', window.NodeFilter);
    vi.stubGlobal('CSS', { escape: (value: string) => value });
    vi.stubGlobal('requestAnimationFrame', window.requestAnimationFrame);
    const preferences = defaultPreferences();
    preferences.bookmarks = ['sec-1'];
    preferences.textBookmarks = [{
      id: 'texto-1',
      sectionId: 'sec-1',
      offset: 13,
      quote: 'beta gama',
      createdAt: '2026-08-07T20:00:00.000Z',
    }];
    preferences.inkNotes = [{
      id: 'tinta-1',
      sectionId: 'sec-1',
      offset: 18,
      label: 'Conta auxiliar',
      createdAt: '2026-08-07T20:01:00.000Z',
      strokes: [{ color: '#126e82', size: 3, points: [[0.1, 0.2, 0.5]] }],
    }];
    const article = document.querySelector<HTMLElement>('#reader')!;
    const sourceText = article.textContent;

    const destroy = mountLineAnnotations({
      article,
      preferences,
      persist: vi.fn(),
      announce: vi.fn(),
    });

    expect(article.textContent).toBe(sourceText);
    expect(article.querySelector('[data-text-bookmark-anchor="texto-1"]')).not.toBeNull();
    expect(article.querySelector('[data-ink-note-anchor="tinta-1"]')).not.toBeNull();
    expect(document.querySelector('[data-text-bookmark-list]')?.textContent).toContain('beta gama');
    expect(document.querySelector('[data-ink-note-list]')?.textContent).toContain('Conta auxiliar');
    expect(document.querySelector('[data-bookmark-count]')?.textContent).toBe('3');

    destroy();
    expect(document.querySelector('.line-selection-toolbar')).toBeNull();
    expect(document.querySelector('.ink-note-dialog')).toBeNull();
  });
});
