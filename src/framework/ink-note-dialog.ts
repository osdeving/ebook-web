import { listen } from './dom';
import type { ReaderInkNote, ReaderInkPoint, ReaderInkStroke } from './types';

export interface InkNoteDraft {
  label: string;
  strokes: ReaderInkStroke[];
}

export interface InkNoteDialogOptions {
  announce(message: string): void;
  save(draft: InkNoteDraft, note?: ReaderInkNote): boolean | HTMLElement;
  remove(note: ReaderInkNote): boolean;
}

export interface InkNoteDialogController {
  open(note?: ReaderInkNote, returnFocus?: HTMLElement): void;
  destroy(): void;
}

export function mountInkNoteDialog(options: InkNoteDialogOptions): InkNoteDialogController {
  const cleanups: Array<() => void> = [];
  const dialog = document.createElement('dialog');
  dialog.className = 'ink-note-dialog';
  dialog.setAttribute('aria-labelledby', 'ink-note-dialog-title');

  const shell = document.createElement('div');
  shell.className = 'ink-note-dialog__shell';
  const header = document.createElement('header');
  header.className = 'ink-note-dialog__header';
  const heading = document.createElement('div');
  const eyebrow = document.createElement('span');
  eyebrow.className = 'ink-note-dialog__eyebrow';
  eyebrow.textContent = 'Rascunho local';
  const title = document.createElement('h2');
  title.id = 'ink-note-dialog-title';
  title.textContent = 'Anotação à mão';
  heading.append(eyebrow, title);
  const close = button('Fechar', 'ink-note-dialog__close');
  close.setAttribute('aria-label', 'Fechar rascunho');
  header.append(heading, close);

  const description = document.createElement('p');
  description.className = 'ink-note-dialog__description';
  description.textContent = 'Escreva com caneta, toque ou mouse. O desenho fica somente neste navegador.';

  const label = document.createElement('label');
  label.className = 'ink-note-dialog__label';
  label.textContent = 'Nome do rascunho';
  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.maxLength = 80;
  labelInput.placeholder = 'Ex.: conta auxiliar';
  label.append(labelInput);

  const canvasFrame = document.createElement('div');
  canvasFrame.className = 'ink-note-canvas-frame';
  const canvas = document.createElement('canvas');
  canvas.className = 'ink-note-canvas';
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Área de desenho do rascunho');
  canvasFrame.append(canvas);

  const tools = document.createElement('div');
  tools.className = 'ink-note-dialog__tools';
  const colorLabel = document.createElement('label');
  colorLabel.textContent = 'Cor';
  const color = document.createElement('input');
  color.type = 'color';
  color.value = '#126e82';
  colorLabel.append(color);
  const sizeLabel = document.createElement('label');
  sizeLabel.textContent = 'Espessura';
  const size = document.createElement('input');
  size.type = 'range';
  size.min = '1';
  size.max = '12';
  size.step = '1';
  size.value = '3';
  sizeLabel.append(size);
  const undo = button('Desfazer');
  const clear = button('Limpar');
  tools.append(colorLabel, sizeLabel, undo, clear);

  const footer = document.createElement('footer');
  footer.className = 'ink-note-dialog__footer';
  const status = document.createElement('p');
  status.className = 'ink-note-dialog__status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const deleteButton = button('Apagar rascunho', 'enrichment-button enrichment-button--danger');
  const actions = document.createElement('div');
  actions.className = 'ink-note-dialog__actions';
  const cancel = button('Cancelar', 'enrichment-button');
  const save = button('Salvar rascunho', 'enrichment-button enrichment-button--primary');
  actions.append(cancel, save);
  footer.append(status, deleteButton, actions);
  shell.append(header, description, label, canvasFrame, tools, footer);
  dialog.append(shell);
  document.body.append(dialog);

  let currentNote: ReaderInkNote | undefined;
  let working: ReaderInkStroke[] = [];
  let activePointer: number | undefined;
  let returnFocus: HTMLElement | undefined;

  const render = () => renderCanvas(canvas, working);
  const resize = () => resizeCanvas(canvas, render);
  const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(resize);
  resizeObserver?.observe(canvasFrame);
  cleanups.push(() => resizeObserver?.disconnect());
  cleanups.push(listen(window, 'resize', resize));

  const finishPointer = (event: PointerEvent) => {
    if (activePointer !== event.pointerId) return;
    activePointer = undefined;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    status.textContent = 'Traço adicionado.';
  };
  cleanups.push(listen(canvas, 'pointerdown', ((event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    if (working.length >= 40) {
      status.textContent = 'Limite de 40 traços atingido. Desfaça ou limpe antes de continuar.';
      return;
    }
    const point = canvasPoint(canvas, event);
    if (!point) return;
    activePointer = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
    working.push({
      color: color.value,
      size: Number(size.value),
      points: [point],
    });
    render();
  }) as EventListener));
  cleanups.push(listen(canvas, 'pointermove', ((event: PointerEvent) => {
    if (activePointer !== event.pointerId) return;
    event.preventDefault();
    const stroke = working.at(-1);
    const point = canvasPoint(canvas, event);
    if (!stroke || !point) return;
    const previous = stroke.points.at(-1);
    if (previous && Math.hypot(point[0] - previous[0], point[1] - previous[1]) < 0.0025) return;
    if (stroke.points.length < 120) stroke.points.push(point);
    else stroke.points[stroke.points.length - 1] = point;
    render();
  }) as EventListener));
  cleanups.push(listen(canvas, 'pointerup', finishPointer as EventListener));
  cleanups.push(listen(canvas, 'pointercancel', finishPointer as EventListener));

  const closeDialog = () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    focusAfterDialog(returnFocus);
  };
  cleanups.push(listen(close, 'click', closeDialog));
  cleanups.push(listen(cancel, 'click', closeDialog));
  cleanups.push(listen(dialog, 'cancel', ((event: Event) => {
    event.preventDefault();
    closeDialog();
  }) as EventListener));
  cleanups.push(listen(undo, 'click', () => {
    if (!working.length) return;
    working.pop();
    status.textContent = 'Último traço removido.';
    render();
  }));
  cleanups.push(listen(clear, 'click', () => {
    if (!working.length) return;
    working = [];
    status.textContent = 'Área limpa.';
    render();
  }));
  cleanups.push(listen(save, 'click', () => {
    const draftLabel = labelInput.value.trim();
    if (!draftLabel) {
      status.textContent = 'Dê um nome curto ao rascunho.';
      labelInput.focus();
      return;
    }
    if (!working.length) {
      status.textContent = 'Faça ao menos um traço antes de salvar.';
      canvas.focus();
      return;
    }
    const saved = options.save({ label: draftLabel, strokes: cloneStrokes(working) }, currentNote);
    if (saved) {
      if (saved instanceof HTMLElement) returnFocus = saved;
      closeDialog();
    } else status.textContent = 'Não foi possível salvar no armazenamento local. Libere espaço e tente novamente.';
  }));
  cleanups.push(listen(deleteButton, 'click', () => {
    if (!currentNote || !window.confirm('Apagar este rascunho à mão?')) return;
    if (options.remove(currentNote)) closeDialog();
    else status.textContent = 'Não foi possível apagar no armazenamento local. Tente novamente.';
  }));

  return {
    open(note, focusTarget) {
      currentNote = note;
      returnFocus = focusTarget;
      working = cloneStrokes(note?.strokes ?? []);
      labelInput.value = note?.label ?? 'Meu rascunho';
      deleteButton.hidden = !note;
      status.textContent = note ? 'Rascunho aberto para edição.' : 'Pronto para desenhar.';
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      requestAnimationFrame(() => {
        resize();
        labelInput.focus();
        labelInput.select();
      });
    },
    destroy() {
      cleanups.reverse().forEach((cleanup) => cleanup());
      dialog.remove();
    },
  };
}

function button(text: string, className = ''): HTMLButtonElement {
  const element = document.createElement('button');
  element.type = 'button';
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function cloneStrokes(strokes: readonly ReaderInkStroke[]): ReaderInkStroke[] {
  return strokes.map((stroke) => ({
    color: stroke.color,
    size: stroke.size,
    points: stroke.points.map((point) => [point[0], point[1], point[2]] as ReaderInkPoint),
  }));
}

function canvasPoint(canvas: HTMLCanvasElement, event: PointerEvent): ReaderInkPoint | undefined {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = clamp((event.clientX - rect.left) / rect.width);
  const y = clamp((event.clientY - rect.top) / rect.height);
  const pressure = event.pressure > 0 ? clamp(event.pressure) : 0.5;
  return [round(x), round(y), round(pressure)];
}

function resizeCanvas(canvas: HTMLCanvasElement, render: () => void): void {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * ratio);
  const height = Math.round(rect.height * ratio);
  if (canvas.width === width && canvas.height === height) return;
  canvas.width = width;
  canvas.height = height;
  render();
}

function renderCanvas(canvas: HTMLCanvasElement, strokes: readonly ReaderInkStroke[]): void {
  const context = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  if (!context || !rect.width || !rect.height) return;
  const ratio = canvas.width / rect.width || 1;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const stroke of strokes) {
    const points = stroke.points;
    if (!points.length) continue;
    if (points.length === 1) {
      context.beginPath();
      context.fillStyle = stroke.color;
      context.arc(points[0]![0] * rect.width, points[0]![1] * rect.height, stroke.size / 2, 0, Math.PI * 2);
      context.fill();
      continue;
    }
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1]!;
      const point = points[index]!;
      context.beginPath();
      context.strokeStyle = stroke.color;
      context.lineWidth = stroke.size * (0.65 + point[2] * 0.7);
      context.moveTo(previous[0] * rect.width, previous[1] * rect.height);
      context.lineTo(point[0] * rect.width, point[1] * rect.height);
      context.stroke();
    }
  }
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function round(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

function focusAfterDialog(preferred?: HTMLElement): void {
  const candidates = [
    preferred,
    document.querySelector<HTMLElement>('[data-reader-drawer-open]'),
    document.querySelector<HTMLElement>('[data-reader-main] h1'),
  ];
  const target = candidates.find((candidate) => {
    if (!candidate?.isConnected || candidate.closest('[hidden], [inert]')) return false;
    return typeof candidate.getClientRects !== 'function' || candidate.getClientRects().length > 0;
  });
  if (!target) return;
  if (!target.hasAttribute('tabindex') && !/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
    target.tabIndex = -1;
  }
  const rect = target.getBoundingClientRect();
  const insideViewport = rect.bottom > 0 && rect.right > 0
    && rect.top < window.innerHeight && rect.left < window.innerWidth;
  if (!insideViewport) target.scrollIntoView({ block: 'nearest' });
  target.focus({ preventScroll: true });
}
