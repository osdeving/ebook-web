import { expect, test } from "@playwright/test";

test("a biblioteca hidrata a ilha React e apresenta o catálogo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Explore o conteúdo de forma dinâmica." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Logaritmos discretos e Diffie–Hellman" })).toBeVisible();
  await expect(page.getByText("48 explicações")).toBeVisible();
  const total = await page.locator(".chapter-card").count();
  await page.locator(".library-filters select").selectOption("lab");
  const filtered = await page.locator(".chapter-card").count();
  expect(filtered).toBeGreaterThan(0);
  await expect(page.getByRole("status")).toHaveText(`${filtered} de ${total}`);
});

test("o capítulo monta 120 recursos, KaTeX e âncoras únicas", async ({ page }) => {
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));
  await page.goto("/chapters/ch02/");
  await expect.poll(
    () => page.locator("html").getAttribute("data-reader-ready"),
    { timeout: 20_000 },
  ).toBe("true");
  await expect(page.locator("[data-enrichment-id]")).toHaveCount(120);
  expect(await page.locator(".katex").count()).toBeGreaterThan(500);
  expect(await page.evaluate(() => {
    const ids = [...document.querySelectorAll<HTMLElement>("[id]")].map(({ id }) => id);
    return ids.length - new Set(ids).size;
  })).toBe(0);
  expect(errors).toEqual([]);

  const canvasHasInk = await page.locator("#powersPlot").evaluate((node: HTMLCanvasElement) => {
    const context = node.getContext("2d");
    if (!context || node.width === 0 || node.height === 0) return false;
    return context.getImageData(0, 0, node.width, node.height).data.some((value) => value !== 0);
  });
  expect(canvasHasInk).toBe(true);
});

test("as camadas podem ser removidas sem remover a tradução", async ({ page }) => {
  await page.goto("/chapters/ch02/");
  await expect(page.locator("[data-enrichment-id]")).toHaveCount(120);
  const sourceText = await page.locator("#sec-2-1 > p").first().textContent();
  await page.getByRole("button", { name: "Só o texto" }).click();
  await expect(page.locator("[data-enrichment-id]:visible")).toHaveCount(0);
  await expect(page.locator("#sec-2-1 > p").first()).toHaveText(sourceText ?? "");
});

test("o modo só texto e o tema persistem após recarregar", async ({ page }) => {
  await page.goto("/chapters/ch02/");
  await page.getByRole("button", { name: "Só o texto" }).click();
  await page.locator("[data-reader-theme]").first().click();
  const theme = await page.locator("html").getAttribute("data-theme");
  await page.reload();
  await expect.poll(
    () => page.locator("html").getAttribute("data-reader-ready"),
    { timeout: 20_000 },
  ).toBe("true");
  await expect(page.locator("[data-enrichment-id]:visible")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme ?? "dark");
});

test("armazenamento bloqueado não impede matemática nem interatividade", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Storage blocked", "SecurityError");
      },
    });
  });
  await page.goto("/chapters/ch02/");
  await expect.poll(
    () => page.locator("html").getAttribute("data-reader-ready"),
    { timeout: 20_000 },
  ).toBe("true");
  expect(await page.locator(".katex").count()).toBeGreaterThan(500);
  await expect(page.locator("[data-enrichment-id]")).toHaveCount(120);
});

test("o menu móvel fica fora da navegação quando fechado", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/chapters/ch02/");
  const sidebar = page.locator("[data-reader-sidebar]");
  await expect(sidebar).toHaveAttribute("inert", "");
  await expect(sidebar).toHaveAttribute("aria-hidden", "true");
  await page.locator("[data-reader-menu]").click();
  await expect(sidebar).not.toHaveAttribute("inert", "");
  await expect(page.locator("[data-reader-menu]")).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(sidebar).toHaveAttribute("inert", "");
});

test("o leitor oferece retorno acessível à biblioteca no desktop e no mobile", async ({ page }) => {
  await page.goto("/chapters/ch01/");
  const desktopHome = page.locator("[data-reader-sidebar]").getByRole("link", { name: "Voltar à biblioteca" });
  await expect(desktopHome).toBeVisible();
  await expect(desktopHome).toHaveAttribute("href", "/");

  await page.setViewportSize({ width: 320, height: 720 });
  const mobileHome = page.locator(".mobile-bar").getByRole("link", { name: "Voltar à biblioteca" });
  await expect(mobileHome).toBeVisible();
  await mobileHome.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Explore o conteúdo de forma dinâmica." })).toBeVisible();
});

test("cabeçalhos dos cards não criam coluna implícita nem vazam no mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/chapters/ch01/#lab-1-2-euclides-estendido");
  await expect.poll(
    () => page.locator("html").getAttribute("data-reader-ready"),
    { timeout: 20_000 },
  ).toBe("true");

  const lab = page.locator("#lab-1-2-euclides-estendido");
  await expect(lab).toBeVisible();
  expect(await lab.locator(".supplement__summary > .supplement__duration").count()).toBe(0);
  await expect(lab.locator(".supplement__heading > .supplement__duration"))
    .toHaveText("Seção 1.2 · 10–15 min");

  const layout = await lab.evaluate((card) => {
    const summary = card.querySelector<HTMLElement>(".supplement__summary")!;
    const heading = card.querySelector<HTMLElement>(".supplement__heading")!;
    const title = card.querySelector<HTMLElement>(".supplement__title")!;
    const summaryBox = summary.getBoundingClientRect();
    const headingBox = heading.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    return {
      cardFits: card.scrollWidth <= card.clientWidth,
      summaryFits: summary.scrollWidth <= summary.clientWidth,
      headingFits: headingBox.left >= summaryBox.left && headingBox.right <= summaryBox.right,
      titleFits: titleBox.left >= headingBox.left && titleBox.right <= headingBox.right,
    };
  });
  expect(layout).toEqual({
    cardFits: true,
    summaryFits: true,
    headingFits: true,
    titleFits: true,
  });

  const overflowingCards = await page.locator(".supplement__summary").evaluateAll((summaries) => (
    summaries.flatMap((summary) => {
      const heading = summary.querySelector<HTMLElement>(".supplement__heading");
      if (!heading) return [summary.textContent?.trim() ?? "Cabeçalho sem título"];
      const summaryBox = summary.getBoundingClientRect();
      const headingBox = heading.getBoundingClientRect();
      const overflows = summary.scrollWidth > summary.clientWidth
        || headingBox.left < summaryBox.left
        || headingBox.right > summaryBox.right;
      return overflows ? [summary.textContent?.trim() ?? "Card sem nome"] : [];
    })
  ));
  expect(overflowingCards).toEqual([]);
});

test("entradas decimais recebem feedback em vez de lançar RangeError", async ({ page }) => {
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));
  await page.goto("/chapters/ch02/");
  const lab = page.locator("#lab-2-3-dh-eva");
  await lab.locator("summary").click();
  await lab.locator("[data-a]").fill("3.5");
  await lab.locator("[data-exchange]").click();
  await expect(lab.locator("[data-feedback]")).toContainText("inteiro");
  expect(errors).toEqual([]);
});

test("a impressão remove controles fixos e libera o overflow", async ({ page }) => {
  await page.goto("/chapters/ch02/");
  await page.locator("[data-reader-focus]").click();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("[data-reader-focus-exit]")).toHaveCSS("display", "none");
  await expect(page.locator("body")).toHaveCSS("overflow", "visible");
});
