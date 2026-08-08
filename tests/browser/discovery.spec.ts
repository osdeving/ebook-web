import { expect, test, type Page } from "@playwright/test";

const waitForReader = async (page: Page) => {
  await expect.poll(
    () => page.locator("html").getAttribute("data-reader-ready"),
    { timeout: 45_000 },
  ).toBe("true");
};

test("a capa e as páginas de descoberta navegam e filtram sem erros", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");
  await expect(page.locator(".chapter-card")).toHaveCount(5);
  const navigation = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(navigation.getByRole("link", { name: "Busca global" })).toHaveAttribute("href", "/search/");
  await expect(navigation.getByRole("link", { name: "Glossário" })).toHaveAttribute("href", "/glossary/");
  await expect(navigation.getByRole("link", { name: "Rotas de estudo" })).toHaveAttribute("href", "/study/");
  await expect(page.locator(".library-tool-card")).toHaveCount(4);

  await page.goto("/search/");
  const searchStatus = page.locator("[data-global-search-status]");
  const searchQuery = page.locator("[data-global-search-query]");
  await expect(searchStatus).toContainText("itens indexados");
  await searchQuery.fill("inverso modular");
  await expect(page).toHaveURL(/\?q=inverso\+modular$/);
  await expect(page.locator(".global-search-result").first()).toBeVisible();
  await page.locator("[data-global-search-kind]").selectOption("source");
  await page.locator("[data-global-search-chapter]").selectOption("ch01");
  const sourceResults = page.locator(".global-search-result");
  expect(await sourceResults.count()).toBeGreaterThan(0);
  for (const meta of await sourceResults.locator(".global-search-result__meta").allTextContents()) {
    expect(meta).toContain("Capítulo 1");
  }
  await searchQuery.fill("");
  await expect(page).toHaveURL(/\/search\/$/);

  await page.goto("/glossary/");
  await expect(page.locator("[data-glossary-status]")).toHaveText("213 itens");
  await page.locator("[data-glossary-query]").fill("inverso");
  await page.locator("[data-glossary-chapter]").selectOption("ch01");
  await expect(page.locator("[data-glossary-status]")).toHaveText("3 itens");
  await expect(page.locator("#term-inverso-modular")).toBeVisible();
  await page.getByRole("link", { name: "Link permanente para Inverso modular" }).click();
  await expect(page).toHaveURL(/#term-inverso-modular$/);
  await expect(page.locator("#term-inverso-modular")).toBeFocused();

  await page.goto("/study/");
  await expect(page.locator("[data-study-path]")).toHaveCount(11);
  await page.locator("[data-path-goal]").selectOption("algoritmos");
  await page.locator("[data-path-duration]").selectOption("medium");
  await expect(page.locator("[data-path-status]")).toHaveText("1 rota");
  const path = page.locator("#path-ataques-logaritmo-discreto");
  const summary = path.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(path.locator("details")).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(path.locator("details")).not.toHaveAttribute("open", "");

  expect(errors).toEqual([]);
});

test("progresso, prévias, backlinks e dicas funcionam com teclado e persistem", async ({ page }) => {
  await page.goto("/chapters/ch01/#sec-1-1");
  await waitForReader(page);

  const progress = page.locator('#sec-1-1 [data-study-progress-kind="section"]');
  await progress.click();
  await page.keyboard.press("Enter");
  await expect(progress).toHaveAttribute("data-progress-state", "completed");
  await expect(progress).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem("ebook-web.ch01.reader.v1") ?? "{}");
    return stored.value?.progress?.["sec-1-1"];
  })).toBe("completed");

  const crossReference = page.locator('#sec-1-1 a[data-source-xref][href="#fig-1-1"]').first();
  await crossReference.scrollIntoViewIfNeeded();
  await crossReference.evaluate((element) => (element as HTMLElement).focus({ preventScroll: true }));
  const preview = page.locator("#source-xref-preview");
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute("role", "tooltip");
  await expect(preview.locator("a, button")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(preview).toBeHidden();
  await expect(crossReference).toBeFocused();

  const backlinks = page.locator('[data-backlinks-for="fig-1-1"]');
  await backlinks.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(backlinks).toHaveAttribute("open", "");
  await expect(backlinks.locator("a")).toHaveCount(3);
  await page.keyboard.press("Enter");
  await expect(backlinks).not.toHaveAttribute("open", "");

  await page.goto("/chapters/ch01/#practice-solution-1-1");
  await waitForReader(page);
  const solution = page.locator("#practice-solution-1-1");
  await expect(solution.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(solution.locator(".solution-hint")).toHaveCount(3);
  const firstHint = solution.locator(".solution-hint").first();
  await firstHint.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(firstHint).toHaveAttribute("open", "");
  await expect(solution.locator(".solution-reveal")).not.toHaveAttribute("open", "");

  await page.goto("/study/");
  await expect(page.locator("#path-comecando-do-zero [data-path-completed]")).toHaveText("1");
  await expect(page.locator('#path-comecando-do-zero [data-step-href="chapters/ch01/#sec-1-1"]')).toHaveClass(/is-completed/);
});

test("as páginas globais cabem em 375 px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ["/", "/search/", "/glossary/", "/study/"]) {
    await page.goto(route);
    await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("manifesto e instalação offline incluem o leitor completo desde a primeira carga", async ({ page, context }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");
  const manifest = await page.evaluate(async () => fetch("/manifest.webmanifest").then((response) => response.json()));
  expect(manifest).toMatchObject({
    id: "./",
    start_url: "./",
    scope: "./",
    display: "standalone",
    lang: "pt-BR",
  });
  expect(manifest.icons).toHaveLength(3);
  expect(manifest.shortcuts).toHaveLength(4);
  expect(manifest.shortcuts).toEqual(expect.arrayContaining([
    expect.objectContaining({ name: "Abrir capítulo 5", url: "chapters/ch05/" }),
  ]));

  const iconSizes = await page.evaluate(async () => Promise.all(
    ["/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-512.png"].map((src) => new Promise<[number, number]>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve([image.naturalWidth, image.naturalHeight]);
      image.onerror = reject;
      image.src = src;
    })),
  ));
  expect(iconSizes).toEqual([[192, 192], [512, 512], [512, 512]]);

  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const cached = await page.evaluate(async () => {
    const cache = await caches.open("ebook-web-v7");
    return (await cache.keys()).map(({ url }) => url);
  });
  expect(cached.length).toBeGreaterThan(70);
  expect(cached.some((url) => url.includes("ReaderRuntime"))).toBe(true);
  expect(cached.some((url) => /\/chapter\.[^/]+\.js$/.test(url))).toBe(true);
  expect(cached.some((url) => url.endsWith(".woff2"))).toBe(true);
  expect(cached.some((url) => url.endsWith("/chapters/ch03/"))).toBe(true);
  expect(cached.some((url) => url.endsWith("/chapters/ch04/"))).toBe(true);
  expect(cached.some((url) => url.endsWith("/chapters/ch05/"))).toBe(true);

  await context.setOffline(true);
  await page.goto("/chapters/ch01/?offline=1#sec-1-3");
  await waitForReader(page);
  await expect(page.locator("#sec-1-3")).toBeVisible();
  expect(await page.locator(".katex").count()).toBeGreaterThan(500);

  await page.goto("/chapters/ch01/?offline=1#exp-1-3-inverso-via-bezout");
  await waitForReader(page);
  const explanation = page.locator("#exp-1-3-inverso-via-bezout");
  await expect(explanation.locator(":scope > details")).toHaveAttribute("open", "");
  expect(await explanation.locator(".katex").count()).toBeGreaterThan(0);

  await page.goto("/chapters/ch03/?offline=1#practice-solution-3-40");
  await waitForReader(page);
  await expect(page.locator(".exercise[id^='exercicio-3-']")).toHaveCount(43);
  await expect(page.locator("[id^='practice-solution-3-']")).toHaveCount(43);
  const ch03Solution = page.locator("#practice-solution-3-40");
  await expect(ch03Solution.locator(":scope > details")).toHaveAttribute("open", "");
  expect(await ch03Solution.locator(".katex").count()).toBeGreaterThan(0);

  await page.goto("/chapters/ch05/?offline=1#lab-5-5-rho-pollard");
  await waitForReader(page);
  await expect(page.locator(".exercise[id^='exercicio-5-']")).toHaveCount(60);
  await expect(page.locator("[id^='practice-solution-5-']")).toHaveCount(60);
  const ch05Lab = page.locator("#lab-5-5-rho-pollard");
  await expect(ch05Lab.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(ch05Lab.locator("[data-output]")).toContainText("Logaritmo encontrado: t = 3351");

  await page.goto("/search/?q=inverso");
  await expect(page).toHaveTitle(/Busca global/);
  await expect(page.locator(".global-search-result").first()).toBeVisible();

  await page.goto("/endereco-nao-salvo/");
  await expect(page.getByRole("heading", { name: "O que já foi aberto continua por aqui." })).toBeVisible();

  await context.setOffline(false);
  await page.goto("/search/?q=privacidade");
  await expect(page).toHaveTitle(/Busca global/);
  await expect.poll(() => page.evaluate(async () => {
    const cache = await caches.open("ebook-web-v7");
    return (await cache.keys()).some(({ url }) => new URL(url).search.length > 0);
  })).toBe(false);
  expect(errors).toEqual([]);
});
