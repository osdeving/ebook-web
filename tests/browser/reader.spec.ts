import { expect, test } from "@playwright/test";

test("a biblioteca hidrata a ilha React e apresenta o catálogo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "O rigor do texto. As possibilidades da web." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Logaritmos discretos e Diffie–Hellman" })).toBeVisible();
  await expect(page.getByText("48 explicações")).toBeVisible();
  const total = await page.locator(".chapter-card").count();
  await page.locator(".library-filters select").selectOption("lab");
  const filtered = await page.locator(".chapter-card").count();
  expect(filtered).toBeGreaterThan(0);
  await expect(page.getByRole("status")).toHaveText(`${filtered} de ${total}`);
});

test("o capítulo monta 81 recursos, KaTeX e âncoras únicas", async ({ page }) => {
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));
  await page.goto("/chapters/ch02/");
  await expect.poll(
    () => page.locator("html").getAttribute("data-reader-ready"),
    { timeout: 20_000 },
  ).toBe("true");
  await expect(page.locator("[data-enrichment-id]")).toHaveCount(81);
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
  await expect(page.locator("[data-enrichment-id]")).toHaveCount(81);
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
  await expect(page.locator("[data-enrichment-id]")).toHaveCount(81);
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
