import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { placeSourceAnchor, sourcePositionFromPoint, sourceSectionLabel } from './source-position';

describe('posições persistentes no texto-fonte', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('ignora conteúdo editorial ao calcular e restaurar um deslocamento', () => {
    const { document, window } = parseHTML(`
      <html><body><article id="reader">
        <section id="sec-1"><h2>Seção um</h2><p>Alfa beta.</p>
          <aside data-origin="editorial"><p>Texto que não pertence à fonte.</p></aside>
          <p>Gama delta.</p>
        </section>
      </article></body></html>
    `);
    vi.stubGlobal('document', document);
    vi.stubGlobal('window', window);
    vi.stubGlobal('Node', window.Node);
    vi.stubGlobal('NodeFilter', window.NodeFilter);
    vi.stubGlobal('CSS', { escape: (value: string) => value });
    const article = document.querySelector<HTMLElement>('#reader')!;
    const secondParagraphText = document.querySelectorAll('p')[2]!.firstChild!;
    Object.defineProperty(document, 'caretPositionFromPoint', {
      configurable: true,
      value: () => ({ offsetNode: secondParagraphText, offset: 4 }),
    });

    const position = sourcePositionFromPoint(article, 20, 20);
    expect(position).toMatchObject({ sectionId: 'sec-1' });
    document.querySelector<HTMLElement>('[data-origin="editorial"] p')!.textContent = 'Um complemento editorial muito maior que o anterior.';
    const marker = document.createElement('span');
    marker.dataset.textBookmarkAnchor = 'teste';
    expect(placeSourceAnchor(article, position!, marker)).toBe(true);
    expect(marker.parentElement?.textContent).toBe('Gama delta.');
    expect(marker.previousSibling?.textContent).toBe('Gama');
    expect(marker.nextSibling?.textContent).toBe(' delta.');
    expect(sourceSectionLabel(article, 'sec-1')).toBe('Seção um');
  });

  it('não ancora controles, links, fórmulas renderizadas nem texto SVG', () => {
    const { document, window } = parseHTML(`
      <html><body><article id="reader"><section id="sec-1"><h2>Seção</h2><p>
        Texto <a href="#alvo">ligado</a>
        <span class="katex"><span class="katex-html">x + y</span></span>
        <svg><text>rótulo</text></svg>
      </p></section></article></body></html>
    `);
    vi.stubGlobal('document', document);
    vi.stubGlobal('window', window);
    vi.stubGlobal('Node', window.Node);
    vi.stubGlobal('NodeFilter', window.NodeFilter);
    vi.stubGlobal('CSS', { escape: (value: string) => value });
    const article = document.querySelector<HTMLElement>('#reader')!;
    const boundaries = [
      document.querySelector('a')!.firstChild!,
      document.querySelector('.katex-html')!.firstChild!,
      document.querySelector('svg text')!.firstChild!,
    ];

    for (const boundary of boundaries) {
      Object.defineProperty(document, 'caretPositionFromPoint', {
        configurable: true,
        value: () => ({ offsetNode: boundary, offset: 1 }),
      });
      expect(sourcePositionFromPoint(article, 20, 20)).toBeUndefined();
    }
  });
});
