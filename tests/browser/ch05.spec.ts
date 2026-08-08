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

test("o capítulo 5 publica fonte, exercícios e todas as camadas", async ({ page }) => {
  const errors = watchBrowserErrors(page);
  await page.goto("/");
  await expect(page.locator(".chapter-card")).toHaveCount(5);
  await expect(page.getByRole("heading", { name: "Combinatória, probabilidade e teoria da informação" })).toBeVisible();

  await page.goto("/chapters/ch05/");
  await waitForReader(page);
  const shell = page.locator('[data-chapter-id="ch05"]');
  await expect(shell).toHaveAttribute("data-source-hash", /^[a-f0-9]{64}$/);
  await expect(page.getByRole("heading", { level: 1, name: "Combinatória, probabilidade e teoria da informação" })).toBeVisible();
  await expect(page.locator("[data-reader-toc] a")).toHaveCount(27);
  await expect(page.locator(".exercise[id^='exercicio-5-']")).toHaveCount(60);
  await expect(page.locator("[id^='practice-solution-5-']")).toHaveCount(60);

  const layers = await page.locator("[data-enrichment-id]").evaluateAll((items) => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      const layer = item.getAttribute("data-layer") ?? "unknown";
      counts[layer] = (counts[layer] ?? 0) + 1;
    }
    return { total: items.length, counts };
  });
  expect(layers).toEqual({
    total: 138,
    counts: { explanation: 40, lab: 9, practice: 60, history: 11, reading: 18 },
  });

  const malformedSolutions = await page.locator("[id^='practice-solution-5-']").evaluateAll((solutions) =>
    solutions.flatMap((solution) => {
      const hints = solution.querySelectorAll(".solution-hint").length;
      const reveal = solution.querySelector(".solution-reveal > summary")?.textContent?.trim();
      return hints < 2 || hints > 3 || reveal !== "Ver solução completa"
        ? [{ id: solution.id, hints, reveal }]
        : [];
    }),
  );
  expect(malformedSolutions).toEqual([]);
  expect(await page.locator("aside[data-layer='lab'] [data-output]").evaluateAll((outputs) =>
    outputs.every((output) => Boolean(output.textContent?.trim())),
  )).toBe(true);
  expect(await page.evaluate(() => {
    const ids = [...document.querySelectorAll<HTMLElement>("[id]")].map(({ id }) => id);
    return ids.length - new Set(ids).size;
  })).toBe(0);
  expect(await page.locator(".katex").count()).toBeGreaterThan(2_500);
  await expect(page.locator("svg .katex")).toHaveCount(0);
  expect(await page.locator("#fig-5-1 svg text, #fig-5-2 svg text").evaluateAll((labels) =>
    labels.every((label) => {
      const box = (label as SVGGraphicsElement).getBBox();
      return box.width > 0 && box.height > 0;
    }),
  )).toBe(true);
  await expect(page.locator("#fig-5-2 svg text").filter({ hasText: "1/24" })).toHaveCount(2);

  const sourceParagraph = page.locator("#sec-5-1 > p").first();
  const sourceText = await sourceParagraph.textContent();
  const sourceHash = await shell.getAttribute("data-source-hash");
  await page.getByRole("button", { name: "Só o texto" }).click();
  await expect(page.locator("[data-enrichment-id]:visible")).toHaveCount(0);
  await expect(sourceParagraph).toHaveText(sourceText ?? "");
  await expect(shell).toHaveAttribute("data-source-hash", sourceHash ?? "");
  expect(errors).toEqual([]);
});

test("solução programável, laboratório, história e leitura aceitam deep link", async ({ page }) => {
  const errors = watchBrowserErrors(page);

  await page.goto("/chapters/ch05/#practice-solution-5-42");
  await waitForReader(page);
  const solution = page.locator("#practice-solution-5-42");
  await expect(solution).toBeVisible();
  await expect(solution.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(solution.locator(".solution-hint")).toHaveCount(3);
  await expect(solution).toContainText("function rhoDlp");

  await page.goto("/chapters/ch05/#lab-5-5-rho-pollard");
  await waitForReader(page);
  const lab = page.locator("#lab-5-5-rho-pollard");
  await expect(lab.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(lab.locator("[data-output]")).toContainText("Logaritmo encontrado: t = 3351");
  await lab.getByLabel("Alvo h").fill("4");
  await lab.getByRole("button", { name: "Procurar colisão" }).click();
  await expect(lab.locator("[data-output]")).toContainText("Logaritmo encontrado");

  await page.goto("/chapters/ch05/#history-5-rhind-problema-79");
  await waitForReader(page);
  await expect(page.locator("#history-5-rhind-problema-79 > details")).toHaveAttribute("open", "");

  await page.goto("/chapters/ch05/#reading-5-shannon-dois-artigos");
  await waitForReader(page);
  const reading = page.locator("#reading-5-shannon-dois-artigos");
  await expect(reading.locator(":scope > details")).toHaveAttribute("open", "");
  expect(await reading.locator("a[target='_blank']").count()).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test("capítulo 5, cards e retorno à biblioteca cabem em 320 px", async ({ page }) => {
  const errors = watchBrowserErrors(page);
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/chapters/ch05/#lab-5-5-rho-pollard");
  await waitForReader(page);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const overflowingCards = await page.locator(".supplement__summary").evaluateAll((summaries) =>
    summaries.flatMap((summary) => {
      const heading = summary.querySelector<HTMLElement>(".supplement__heading");
      if (!heading) return [summary.textContent?.trim() ?? "Cabeçalho sem título"];
      const summaryBox = summary.getBoundingClientRect();
      const headingBox = heading.getBoundingClientRect();
      return summary.scrollWidth > summary.clientWidth
        || headingBox.left < summaryBox.left
        || headingBox.right > summaryBox.right
        ? [summary.textContent?.trim() ?? "Card sem nome"]
        : [];
    }),
  );
  expect(overflowingCards).toEqual([]);

  const home = page.locator(".mobile-bar").getByRole("link", { name: "Voltar à biblioteca" });
  await expect(home).toBeVisible();
  await home.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Explore o conteúdo de forma dinâmica." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
