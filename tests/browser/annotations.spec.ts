import { expect, test, type Locator, type Page } from "@playwright/test";

const waitForReader = async (page: Page) => {
  await expect.poll(
    () => page.locator("html").getAttribute("data-reader-ready"),
    { timeout: 45_000 },
  ).toBe("true");
};

async function selectSourceText(target: Locator, start = 0, length = 32) {
  await target.evaluate((element, selection) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const node = walker.nextNode();
    if (!(node instanceof Text)) throw new Error("Parágrafo sem texto selecionável.");
    const range = document.createRange();
    const from = Math.min(selection.start, Math.max(0, node.data.length - 1));
    const to = Math.min(node.data.length, from + selection.length);
    range.setStart(node, from);
    range.setEnd(node, to);
    const active = document.getSelection();
    active?.removeAllRanges();
    active?.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
  }, { start, length });
}

test("vários marcadores de linha e um rascunho à mão persistem no ponto exato", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/chapters/ch01/");
  await waitForReader(page);

  const paragraphs = page.locator("#sec-1-1 > p");
  await selectSourceText(paragraphs.nth(0), 10, 38);
  const toolbar = page.locator(".line-selection-toolbar");
  await expect(toolbar).toBeVisible();
  await toolbar.getByRole("button", { name: "Marcar trecho" }).click();

  await selectSourceText(paragraphs.nth(1), 8, 36);
  await expect(toolbar).toBeVisible();
  await toolbar.getByRole("button", { name: "Marcar trecho" }).click();
  await expect(page.locator("[data-text-bookmark-anchor]")).toHaveCount(2);

  await selectSourceText(paragraphs.nth(2), 12, 34);
  await expect(toolbar).toBeVisible();
  await toolbar.getByRole("button", { name: "Rascunho" }).click();

  const dialog = page.locator("dialog.ink-note-dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Nome do rascunho").fill("Conta de verificação");
  const canvas = dialog.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Canvas do rascunho sem dimensões.");
  await page.mouse.move(box.x + 45, box.y + 90);
  await page.mouse.down();
  await page.mouse.move(box.x + 105, box.y + 145, { steps: 8 });
  await page.mouse.move(box.x + 165, box.y + 82, { steps: 8 });
  await page.mouse.up();
  await dialog.getByRole("button", { name: "Salvar rascunho" }).click();

  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.activeElement?.closest("#sec-1-1")?.id)).toBe("sec-1-1");
  await expect(page.locator("[data-ink-note-anchor]")).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem("ebook-web.ch01.reader.v1") ?? "{}");
    return {
      text: stored.value?.textBookmarks?.length ?? 0,
      ink: stored.value?.inkNotes?.length ?? 0,
      hasDrawnStroke: (stored.value?.inkNotes?.[0]?.strokes?.[0]?.points?.length ?? 0) >= 3,
    };
  })).toEqual({ text: 2, ink: 1, hasDrawnStroke: true });

  await page.reload();
  await waitForReader(page);
  await expect(page.locator("[data-text-bookmark-anchor]")).toHaveCount(2);
  const pin = page.locator("[data-ink-note-anchor]");
  await expect(pin).toHaveCount(1);
  await expect(pin).toHaveAttribute("aria-label", "Abrir rascunho: Conta de verificação");
  await pin.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Nome do rascunho")).toHaveValue("Conta de verificação");
  expect(await canvas.evaluate((node: HTMLCanvasElement) => {
    const context = node.getContext("2d");
    if (!context || !node.width || !node.height) return false;
    return context.getImageData(0, 0, node.width, node.height).data.some((value) => value !== 0);
  })).toBe(true);

  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("atalho de teclado persiste o marcador mesmo ao fechar a aba imediatamente", async ({ context }) => {
  const first = await context.newPage();
  await first.goto("/chapters/ch01/");
  await waitForReader(first);
  await selectSourceText(first.locator("#sec-1-1 > p").first(), 4, 34);
  await expect(first.locator(".line-selection-toolbar")).toBeVisible();
  await first.keyboard.press("Alt+Shift+M");
  await expect(first.locator("[data-text-bookmark-anchor]")).toHaveCount(1);
  await first.close();

  const second = await context.newPage();
  await second.goto("/chapters/ch01/");
  await waitForReader(second);
  await expect(second.locator("[data-text-bookmark-anchor]")).toHaveCount(1);
  await second.close();
});

test("falha de quota mantém o rascunho aberto e não anuncia um salvamento falso", async ({ page }) => {
  await page.goto("/chapters/ch01/");
  await waitForReader(page);
  await selectSourceText(page.locator("#sec-1-1 > p").nth(2), 5, 28);
  await page.locator(".line-selection-toolbar").getByRole("button", { name: "Rascunho" }).click();

  const dialog = page.locator("dialog.ink-note-dialog");
  await dialog.getByLabel("Nome do rascunho").fill("Conta sem espaço");
  const canvas = dialog.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Canvas do rascunho sem dimensões.");
  await page.mouse.move(box.x + 30, box.y + 40);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 110, { steps: 5 });
  await page.mouse.up();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("quota cheia", "QuotaExceededError");
    };
  });
  await dialog.getByRole("button", { name: "Salvar rascunho" }).click();

  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[role='status']")).toContainText("Não foi possível salvar");
  await expect(page.locator("[data-reader-live]")).toContainText("ainda não foi salva");
  await expect(page.locator("[data-ink-note-anchor]")).toHaveCount(0);
});

test("mudança do hash apaga e persiste posições que poderiam apontar para outra frase", async ({ page }) => {
  await page.goto("/chapters/ch01/");
  await waitForReader(page);
  const sourceHash = await page.locator("[data-chapter-id='ch01']").getAttribute("data-source-hash");
  await page.evaluate(() => {
    localStorage.setItem("ebook-web.ch01.reader.v1", JSON.stringify({
      schema: 1,
      value: {
        theme: "light",
        scale: 1,
        layers: ["explanation", "lab", "practice", "history", "reading"],
        bookmarks: [],
        textBookmarks: [{
          id: "posição-antiga",
          sectionId: "sec-1-1",
          offset: 10,
          quote: "posição antiga",
          createdAt: "2026-08-07T20:00:00.000Z",
        }],
        inkNotes: [{
          id: "tinta-antiga",
          sectionId: "sec-1-1",
          offset: 20,
          label: "Rascunho antigo",
          createdAt: "2026-08-07T20:00:00.000Z",
          strokes: [{ color: "#126e82", size: 3, points: [[0.1, 0.2, 0.5]] }],
        }],
        notes: {},
        progress: {},
        sourceHash: "hash-antigo",
      },
    }));
  });
  await page.reload();
  await waitForReader(page);

  await expect(page.locator("[data-text-bookmark-anchor], [data-ink-note-anchor]")).toHaveCount(0);
  expect(await page.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem("ebook-web.ch01.reader.v1") ?? "{}");
    return {
      text: stored.value?.textBookmarks?.length,
      ink: stored.value?.inkNotes?.length,
      sourceHash: stored.value?.sourceHash,
    };
  })).toEqual({ text: 0, ink: 0, sourceHash });
});

test("seletor de linha rejeita geometricamente fórmulas KaTeX e desenhos SVG", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/chapters/ch05/");
  await waitForReader(page);
  await page.getByRole("button", { name: "Ajustar leitura" }).click();
  await page.locator(".bookmark-panel > summary").click();
  await page.locator("[data-ink-note-mode]").click();

  for (const target of [page.locator("#sec-5-1 .katex").first(), page.locator("#fig-5-1 svg")]) {
    await target.scrollIntoViewIfNeeded();
    const box = await target.boundingBox();
    if (!box) throw new Error("Alvo matemático sem dimensões.");
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.locator("dialog.ink-note-dialog")).not.toBeVisible();
    await expect(page.locator("[data-reader-live]")).toHaveText(/Não foi possível ancorar|Escolha uma linha/);
  }
  await expect(page.locator(".ink-anchor-picker")).toBeVisible();

  const sourceLine = page.locator("#sec-5-5-2 > p").first();
  await sourceLine.scrollIntoViewIfNeeded();
  await sourceLine.click({ position: { x: 18, y: 12 } });
  const dialog = page.locator("dialog.ink-note-dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Nome do rascunho").fill("Via seletor");
  const canvas = dialog.locator("canvas");
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) throw new Error("Canvas do seletor sem dimensões.");
  await page.mouse.move(canvasBox.x + 25, canvasBox.y + 35);
  await page.mouse.down();
  await page.mouse.move(canvasBox.x + 95, canvasBox.y + 85, { steps: 5 });
  await page.mouse.up();
  await dialog.getByRole("button", { name: "Salvar rascunho" }).click();
  const focusedPin = page.locator("[data-ink-note-anchor]:focus");
  await expect(focusedPin).toHaveCount(1);
  expect(await focusedPin.evaluate((pin) => {
    const rect = pin.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
  })).toBe(true);
});

test("nota textual pendente é descarregada antes de a aba fechar", async ({ context }) => {
  const first = await context.newPage();
  await first.goto("/chapters/ch01/");
  await waitForReader(first);
  await first.locator("#sec-1-1 .enrichment-note-toggle").click();
  await first.locator("#reader-note-sec-1-1 textarea").fill("Nota escrita imediatamente antes de fechar");
  await first.close();

  const second = await context.newPage();
  await second.goto("/chapters/ch01/");
  await waitForReader(second);
  await second.locator("#sec-1-1 .enrichment-note-toggle").click();
  await expect(second.locator("#reader-note-sec-1-1 textarea")).toHaveValue("Nota escrita imediatamente antes de fechar");
  await second.close();
});
