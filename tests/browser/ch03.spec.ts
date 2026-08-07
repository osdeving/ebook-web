import { expect, test, type Page } from "@playwright/test";

const waitForReader = async (page: Page) => {
  await expect.poll(
    () => page.locator("html").getAttribute("data-reader-ready"),
    { timeout: 45_000 },
  ).toBe("true");
};

const watchBrowserErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
};

test("a biblioteca e o leitor publicam o capítulo 3 completo sem alterar a fonte", async ({ page }) => {
  const errors = watchBrowserErrors(page);

  await page.goto("/");
  await expect(page.locator(".chapter-card")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Fatoração de inteiros e RSA" })).toBeVisible();

  await page.goto("/chapters/ch03/");
  await waitForReader(page);

  const shell = page.locator('[data-chapter-id="ch03"]');
  await expect(shell).toHaveAttribute("data-source-hash", /^[a-f0-9]{64}$/);
  await expect(page.getByRole("heading", { level: 1, name: "Fatoração de inteiros e RSA" })).toBeVisible();
  await expect(page.locator("[data-reader-toc] a")).toHaveCount(16);
  await expect(page.locator('[data-reader-toc] a[href="#sec-3-10"]')).toContainText("3.10");

  const layerCounts = await page.locator("[data-enrichment-id]").evaluateAll((items) => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      const layer = item.getAttribute("data-layer") ?? "unknown";
      counts[layer] = (counts[layer] ?? 0) + 1;
    }
    return { total: items.length, counts };
  });
  expect(layerCounts.counts.explanation).toBeGreaterThanOrEqual(52);
  expect(layerCounts.counts.lab).toBe(13);
  expect(layerCounts.counts.history).toBe(9);
  expect(layerCounts.counts.reading).toBeGreaterThanOrEqual(14);
  expect(layerCounts.counts.practice).toBe(43);
  expect(layerCounts.total).toBe(Object.values(layerCounts.counts).reduce((sum, count) => sum + count, 0));
  await expect(page.locator(".exercise[id^='exercicio-3-']")).toHaveCount(43);
  await expect(page.locator("[id^='practice-solution-3-']")).toHaveCount(43);

  const malformedSolutions = await page.locator("[id^='practice-solution-3-']").evaluateAll((solutions) =>
    solutions.flatMap((solution) => {
      const hints = solution.querySelectorAll(".solution-hint").length;
      const reveal = solution.querySelector(".solution-reveal > summary")?.textContent?.trim();
      return hints < 2 || hints > 3 || reveal !== "Ver solução completa"
        ? [{ id: solution.id, hints, reveal }]
        : [];
    }),
  );
  expect(malformedSolutions).toEqual([]);

  const labInitializationFailures = await page.locator('aside[data-layer="lab"]').evaluateAll((labs) =>
    labs.flatMap((lab) => {
      const feedback = lab.querySelector<HTMLElement>("[data-feedback]")?.textContent?.trim() ?? "";
      return !feedback || /precisa ser um inteiro/i.test(feedback)
        ? [{ id: lab.id, feedback }]
        : [];
    }),
  );
  expect(labInitializationFailures).toEqual([]);

  expect(await page.evaluate(() => {
    const ids = [...document.querySelectorAll<HTMLElement>("[id]")].map(({ id }) => id);
    return ids.length - new Set(ids).size;
  })).toBe(0);
  expect(await page.locator(".katex").count()).toBeGreaterThan(2_500);

  const sourceParagraph = page.locator("#sec-3-1 > p").first();
  const sourceText = await sourceParagraph.textContent();
  const sourceHash = await shell.getAttribute("data-source-hash");
  await page.getByRole("button", { name: "Só o texto" }).click();
  await expect(page.locator("[data-enrichment-id]:visible")).toHaveCount(0);
  await expect(sourceParagraph).toHaveText(sourceText ?? "");
  await expect(shell).toHaveAttribute("data-source-hash", sourceHash ?? "");
  expect(errors).toEqual([]);
});

test("soluções, leituras e laboratórios do capítulo 3 aceitam deep link e teclado", async ({ page }) => {
  const errors = watchBrowserErrors(page);

  await page.goto("/chapters/ch03/");
  await waitForReader(page);
  await page.getByRole("button", { name: "Só o texto" }).click();
  await expect(page.locator("#practice-solution-3-40")).toBeHidden();

  await page.goto("/chapters/ch03/#practice-solution-3-40");
  await waitForReader(page);
  const solution = page.locator("#practice-solution-3-40");
  await expect(solution).toBeVisible();
  await expect(solution.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(page.locator('[data-layer-toggle="practice"]')).toBeChecked();
  await expect(solution.locator(".solution-hint")).toHaveCount(3);
  await expect(solution).toContainText("omitindo");
  const firstHint = solution.locator(".solution-hint").first();
  await firstHint.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(firstHint).toHaveAttribute("open", "");
  await expect(solution.locator(".solution-reveal")).not.toHaveAttribute("open", "");

  await page.goto("/chapters/ch03/#reading-3-rsa-original");
  await waitForReader(page);
  const reading = page.locator("#reading-3-rsa-original");
  await expect(reading).toBeVisible();
  await expect(reading.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(page.locator('[data-layer-toggle="reading"]')).toBeChecked();
  await expect(reading.getByRole("link", { name: /MIT CSAIL/ })).toHaveAttribute("rel", "noopener noreferrer");

  await page.goto("/chapters/ch03/#lab-3-2-rsa-workbench");
  await waitForReader(page);
  const lab = page.locator("#lab-3-2-rsa-workbench");
  await expect(lab.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(lab).toContainText("Chave pública (3233, 17)");
  await expect(lab.locator("[data-feedback]")).toContainText("A mensagem voltou corretamente");
  await lab.getByRole("button", { name: "Testar mensagem divisível por p" }).click();
  await expect(lab.locator("[data-feedback]")).toContainText("A mensagem voltou corretamente");
  expect(errors).toEqual([]);
});

test("permalinks, prévias, backlinks e progresso funcionam no capítulo 3", async ({ page }) => {
  const errors = watchBrowserErrors(page);
  await page.goto("/chapters/ch03/#prop-3-48");
  await waitForReader(page);

  const target = page.locator("#prop-3-48");
  const permalink = target.locator(':scope > [data-source-permalink="prop-3-48"]');
  await expect(permalink).toBeVisible();
  await expect(permalink).toHaveAttribute("aria-label", "Link permanente para Proposição 3.48");

  const crossReference = page.locator('a[data-source-xref][href="#prop-3-48"]').first();
  await crossReference.scrollIntoViewIfNeeded();
  await crossReference.evaluate((element) => (element as HTMLElement).focus({ preventScroll: true }));
  const preview = page.locator("#source-xref-preview");
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute("role", "tooltip");
  await expect(preview.locator("a, button")).toHaveCount(0);
  expect(await preview.locator(".katex").count()).toBeGreaterThan(0);
  await expect(preview).not.toContainText("\\(");
  await page.keyboard.press("Escape");
  await expect(preview).toBeHidden();
  await expect(crossReference).toBeFocused();

  const bibliographyReference = page.locator('a[data-source-xref][href="../../references/#ref-28"]').first();
  await expect(bibliographyReference).toHaveAttribute("href", "../../references/#ref-28");
  await bibliographyReference.hover();
  await expect(preview).toBeVisible();
  await expect(preview.locator("[data-xref-preview-kind]")).toHaveText("Referência");
  await expect(preview).toContainText("Referência 28");

  const backlinks = page.locator('[data-backlinks-for="prop-3-48"]');
  const backlinksSummary = backlinks.locator("summary");
  await backlinksSummary.focus();
  await expect(backlinksSummary).toBeFocused();
  if (!await backlinks.evaluate((details: HTMLDetailsElement) => details.open)) {
    await backlinksSummary.press("Enter");
  }
  await expect(backlinks).toHaveAttribute("open", "");
  await backlinksSummary.press("Enter");
  await expect(backlinks).not.toHaveAttribute("open", "");
  await backlinksSummary.press("Enter");
  await expect(backlinks).toHaveAttribute("open", "");
  await expect(backlinks.locator("a")).toHaveCount(5);

  const internalTargets = await page.locator('a[data-source-xref][href^="#"]').evaluateAll((links) =>
    links.flatMap((link) => {
      const href = link.getAttribute("href") ?? "";
      return href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1))) ? [href] : [];
    }),
  );
  expect(internalTargets).toEqual([]);

  const progress = page.locator('#sec-3-7-2 [data-study-progress-kind="section"]');
  await progress.click();
  await page.keyboard.press("Enter");
  await expect(progress).toHaveAttribute("data-progress-state", "completed");
  await expect.poll(() => page.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem("ebook-web.ch03.reader.v1") ?? "{}");
    return stored.value?.progress?.["sec-3-7-2"];
  })).toBe("completed");

  await page.goto("/study/");
  await expect(page.locator("[data-study-path]")).toHaveCount(10);
  await expect(page.locator('#path-primos-e-fatoracao [data-step-href="chapters/ch03/#sec-3-7-2"]')).toHaveClass(/is-completed/);
  expect(errors).toEqual([]);
});

test("busca, glossário e rotas descobrem o conteúdo do capítulo 3", async ({ page }) => {
  const errors = watchBrowserErrors(page);

  await page.goto("/search/");
  await expect(page.locator("[data-global-search-status]")).toContainText("itens indexados");
  await page.locator("[data-global-search-query]").fill("fatoração");
  await page.locator("[data-global-search-kind]").selectOption("source");
  await page.locator("[data-global-search-chapter]").selectOption("ch03");
  const results = page.locator(".global-search-result");
  expect(await results.count()).toBeGreaterThan(0);
  for (const meta of await results.locator(".global-search-result__meta").allTextContents()) {
    expect(meta).toContain("Capítulo 3");
  }
  await expect(results.first().getByRole("link")).toHaveAttribute("href", /\/chapters\/ch03\/#/);

  await page.goto("/glossary/");
  await expect(page.locator("[data-glossary-status]")).toHaveText("172 itens");
  await page.locator("[data-glossary-chapter]").selectOption("ch03");
  await expect(page.locator("[data-glossary-status]")).toHaveText("51 itens");
  const wrongChapter = await page.locator("[data-glossary-item]").evaluateAll((items) =>
    items.filter((item) => !item.hasAttribute("hidden") && item.getAttribute("data-chapter") !== "ch03").map(({ id }) => id),
  );
  expect(wrongChapter).toEqual([]);

  await page.goto("/study/");
  await expect(page.locator("[data-path-status]")).toHaveText("10 rotas");
  await expect(page.locator("[data-study-path]")).toHaveCount(10);
  expect(await page.locator('[data-step-href*="chapters/ch03/"]').count()).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test("o capítulo 3 cabe em 375 px e mantém tabelas largas em rolagem interna", async ({ page }) => {
  const errors = watchBrowserErrors(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/chapters/ch03/");
  await waitForReader(page);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const sidebar = page.locator("[data-reader-sidebar]");
  await expect(sidebar).toHaveAttribute("inert", "");
  await page.locator("[data-reader-menu]").click();
  await expect(sidebar).not.toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(sidebar).toHaveAttribute("inert", "");

  await page.goto("/chapters/ch03/#practice-solution-3-34");
  await waitForReader(page);
  await expect(page.locator("#practice-solution-3-34 > details")).toHaveAttribute("open", "");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator("#practice-solution-3-34 .table-wrap").evaluateAll((tables) =>
    tables.some((table) => table.scrollWidth > table.clientWidth),
  )).toBe(true);

  await page.goto("/chapters/ch03/#reading-3-rsa-original");
  await waitForReader(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
