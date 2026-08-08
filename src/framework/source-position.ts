const EXCLUDED_SOURCE_TEXT = [
  '[data-origin="editorial"]',
  '[data-section-tools]',
  '[data-source-permalink]',
  '[data-backlinks-for]',
  '[data-study-progress-kind]',
  '[data-text-bookmark-anchor]',
  '[data-ink-note-anchor]',
  '.katex',
  'a',
  'button',
  'input',
  'select',
  'svg',
  'script',
  'style',
  'textarea',
].join(',');

export interface SourcePosition {
  sectionId: string;
  offset: number;
}

export interface SourceSelection extends SourcePosition {
  quote: string;
  rect: DOMRect;
}

export function sourceSelection(article: HTMLElement): SourceSelection | undefined {
  const selection = document.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount !== 1) return;
  const range = selection.getRangeAt(0);
  const startSection = sourceSection(article, range.startContainer);
  const endSection = sourceSection(article, range.endContainer);
  if (!startSection || startSection !== endSection || excludedBoundary(range.startContainer) || excludedBoundary(range.endContainer)) return;
  const offset = sourceOffset(startSection, range.startContainer, range.startOffset);
  const quote = selection.toString().replace(/\s+/g, ' ').trim();
  if (offset === undefined || !quote) return;
  const rect = range.getBoundingClientRect();
  if (!Number.isFinite(rect.left) || !Number.isFinite(rect.top)) return;
  return {
    sectionId: startSection.id,
    offset,
    quote: quote.length > 280 ? quote.slice(0, 279) + '…' : quote,
    rect,
  };
}

export function sourcePositionFromPoint(
  article: HTMLElement,
  clientX: number,
  clientY: number,
): SourcePosition | undefined {
  if (pointInsideExcludedGeometry(article, clientX, clientY)) return;
  const pointDocument = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  const caret = pointDocument.caretPositionFromPoint?.(clientX, clientY);
  const legacyMethod = Reflect.get(document, 'caret' + 'RangeFromPoint');
  const range = caret || typeof legacyMethod !== 'function'
    ? undefined
    : legacyMethod.call(document, clientX, clientY) as Range | null;
  const container = caret?.offsetNode ?? range?.startContainer;
  const boundaryOffset = caret?.offset ?? range?.startOffset;
  if (!container || boundaryOffset === undefined || excludedBoundary(container)) return;
  const section = sourceSection(article, container);
  if (!section) return;
  const offset = sourceOffset(section, container, boundaryOffset);
  return offset === undefined ? undefined : { sectionId: section.id, offset };
}

export function placeSourceAnchor(
  article: HTMLElement,
  position: SourcePosition,
  anchor: HTMLElement,
): boolean {
  const section = article.querySelector<HTMLElement>('#' + cssEscape(position.sectionId));
  if (!section) return false;
  const nodes = sourceTextNodes(section);
  const total = nodes.reduce((sum, node) => sum + node.data.length, 0);
  if (position.offset < 0 || position.offset > total || !nodes.length) return false;
  let traversed = 0;
  let target = nodes[nodes.length - 1]!;
  let offset = target.data.length;
  for (const node of nodes) {
    const end = traversed + node.data.length;
    if (position.offset <= end) {
      target = node;
      offset = Math.max(0, position.offset - traversed);
      break;
    }
    traversed = end;
  }
  const parent = target.parentNode;
  if (!parent) return false;
  const boundary = Math.min(offset, target.data.length);
  const following = target.nextSibling;
  const remainder = document.createTextNode(target.data.slice(boundary));
  target.data = target.data.slice(0, boundary);
  parent.insertBefore(anchor, following);
  parent.insertBefore(remainder, following);
  return true;
}

export function sourceSectionLabel(article: HTMLElement, sectionId: string): string {
  const section = article.querySelector<HTMLElement>('#' + cssEscape(sectionId));
  return section?.querySelector<HTMLElement>('h2, h3')?.textContent?.trim() ?? sectionId;
}

function sourceSection(article: HTMLElement, node: Node): HTMLElement | undefined {
  const element = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
  const section = element?.closest<HTMLElement>('section[id]');
  return section && article.contains(section) ? section : undefined;
}

function sourceOffset(section: HTMLElement, container: Node, boundaryOffset: number): number | undefined {
  const nodes = sourceTextNodes(section);
  if (container.nodeType === Node.TEXT_NODE) {
    let offset = 0;
    for (const node of nodes) {
      if (node === container) return offset + Math.min(Math.max(boundaryOffset, 0), node.data.length);
      offset += node.data.length;
    }
    return;
  }
  if (container.nodeType !== Node.ELEMENT_NODE) return;
  const element = container as Element;
  const children = Array.from(element.childNodes);
  const following = children[boundaryOffset];
  if (following) {
    const nextText = nodes.find((node) => following === node || following.contains(node));
    if (nextText) return nodes.slice(0, nodes.indexOf(nextText)).reduce((sum, node) => sum + node.data.length, 0);
  }
  const preceding = children[Math.max(0, boundaryOffset - 1)];
  if (!preceding) return 0;
  const previousNodes = nodes.filter((node) => preceding === node || preceding.contains(node));
  const previous = previousNodes.at(-1);
  if (!previous) return;
  return nodes.slice(0, nodes.indexOf(previous)).reduce((sum, node) => sum + node.data.length, 0) + previous.data.length;
}

function sourceTextNodes(section: HTMLElement): Text[] {
  const nodes: Text[] = [];
  const showText = typeof NodeFilter === 'undefined' ? 4 : NodeFilter.SHOW_TEXT;
  const walker = document.createTreeWalker(section, showText);
  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE && !excludedBoundary(current)) nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

function excludedBoundary(node: Node): boolean {
  const element = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
  return Boolean(element?.closest(EXCLUDED_SOURCE_TEXT));
}

function pointInsideExcludedGeometry(article: HTMLElement, clientX: number, clientY: number): boolean {
  for (const element of article.querySelectorAll<HTMLElement>('.katex, svg')) {
    if (typeof element.getClientRects !== 'function') continue;
    for (const rect of element.getClientRects()) {
      if (rect.width > 0 && rect.height > 0
        && clientX >= rect.left && clientX <= rect.right
        && clientY >= rect.top && clientY <= rect.bottom) return true;
    }
  }
  return false;
}

function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, (character) => '\\' + character);
}
