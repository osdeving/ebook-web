import { expect, test, type Page } from "@playwright/test";

const waitForReader = async (page: Page) => {
  await expect.poll(
    () => page.locator("html").getAttribute("data-reader-ready"),
    { timeout: 45_000 },
  ).toBe("true");
};

test("um deep link reativa a camada oculta e abre o complemento", async ({ page }) => {
  await page.goto("/chapters/ch02/");
  await waitForReader(page);
  await page.getByRole("button", { name: "Só o texto" }).click();

  const target = page.locator("#exp-2-1-public-private-key");
  await expect(target).toBeHidden();

  await page.goto("/chapters/ch02/#exp-2-1-public-private-key");
  await waitForReader(page);

  await expect(target).toBeVisible();
  await expect(target.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(page.locator('[data-layer-toggle="explanation"]')).toBeChecked();
});

test("alvos semanticos recebem destaque sem depender de JavaScript editorial", async ({ page }) => {
  await page.goto("/chapters/ch02/#prop-2-41");
  await waitForReader(page);
  const target = page.locator("#prop-2-41");

  await expect(target).toBeVisible();
  await expect(target).toHaveCSS("outline-style", "solid");
  await expect(target).toHaveCSS("outline-width", "3px");
});

test("o runtime oferece permalink acessivel sem acrescentar texto ao alvo", async ({ page }) => {
  await page.goto("/chapters/ch02/");
  await waitForReader(page);
  const target = page.locator("#prop-2-41");
  const permalink = target.locator(':scope > [data-source-permalink="prop-2-41"]');

  await expect(permalink).toBeVisible();
  await expect(permalink).toHaveText("");
  await expect(permalink).toHaveAttribute("aria-label", "Link permanente para Proposição 2.41");
  await permalink.click();
  await expect(page).toHaveURL(/#prop-2-41$/);
});

test("referências cruzadas alcançam tabelas e resultados de outro capítulo", async ({ page }) => {
  await page.goto("/chapters/ch02/");
  await waitForReader(page);

  await expect(page.locator('a[data-source-xref][href="#tab-2-4"]')).toHaveCount(1);
  await expect(page.locator("#tab-2-4")).toHaveCount(1);

  const crossChapter = page.locator('a[data-source-xref][href="../ch01/#theorem-1-24"]').first();
  await expect(crossChapter).toBeVisible();
  await crossChapter.click();
  await waitForReader(page);
  await expect(page).toHaveURL(/\/chapters\/ch01\/#theorem-1-24$/);
  await expect(page.locator("#theorem-1-24")).toBeVisible();
});

test("a bibliografia global oferece fragmento estavel e destino externo verificado", async ({ page }) => {
  await page.goto("/references/#ref-38");
  const target = page.locator("#ref-38");

  await expect(target).toBeVisible();
  await expect(target).toHaveCSS("outline-style", "solid");
  await expect(target.locator(".bibliography-number")).toHaveAttribute("href", "#ref-38");
  await expect(target.locator(".bibliography-link")).toHaveAttribute(
    "href",
    "https://doi.org/10.1109/TIT.1976.1055638",
  );
  await expect(target.locator(".bibliography-link")).toHaveAttribute("rel", "noopener noreferrer");
});

test("a bibliografia filtra as 150 entradas sem perder seus fragmentos", async ({ page }) => {
  await page.goto("/references/");
  const entries = page.locator("[data-reference-entry]");
  const search = page.locator("[data-reference-search]");

  await expect(entries).toHaveCount(150);
  await search.fill("Diffie");
  await expect(page.locator("[data-reference-status]")).not.toHaveText("0 referências");
  expect(await entries.filter({ visible: true }).count()).toBeGreaterThan(0);

  await search.fill("consulta-sem-correspondencia-ebook");
  await expect(page.locator("[data-reference-status]")).toHaveText("0 referências encontradas");
});

test("os exercícios completos e suas soluções possuem deep links independentes", async ({ page }) => {
  await page.goto("/chapters/ch02/");
  await waitForReader(page);

  await expect(page.locator(".exercise[id^='exercicio-2-']")).toHaveCount(41);
  await expect(page.locator("[id^='practice-solution-2-']")).toHaveCount(39);
  await expect(page.locator("#practice-solution-2-1, #practice-solution-2-2")).toHaveCount(0);
  await page.getByRole("button", { name: "Só o texto" }).click();

  const solution = page.locator("#practice-solution-2-3");
  await expect(solution).toBeHidden();
  await page.goto("/chapters/ch02/#practice-solution-2-3");
  await waitForReader(page);
  await expect(solution).toBeVisible();
  await expect(solution.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(page.locator('[data-layer-toggle="practice"]')).toBeChecked();
});

test("o capítulo 1 publica 50 exercícios e preserva a tarefa de campo sem solução", async ({ page }) => {
  await page.goto("/chapters/ch01/");
  await waitForReader(page);

  await expect(page.locator(".exercise[id^='exercicio-1-']")).toHaveCount(50);
  await expect(page.locator("[id^='practice-solution-1-']")).toHaveCount(49);
  await expect(page.locator("#practice-solution-1-39")).toHaveCount(0);
  await expect(page.locator("#exercicio-1-39")).toContainText("trabalho de 2 a 5 páginas");

  const definition = page.locator("#def-1-divisibility");
  const permalink = definition.locator(':scope > [data-source-permalink="def-1-divisibility"]');
  await expect(permalink).toBeVisible();
  await expect(permalink).toHaveAttribute("aria-label", /Link permanente/);

  const reference = page.locator('a[data-source-xref][href="../../references/#ref-38"]').first();
  await expect(reference).toBeVisible();
});

test("um deep link abre uma solução do capítulo 1 mesmo após o preset de texto", async ({ page }) => {
  await page.goto("/chapters/ch01/");
  await waitForReader(page);
  await page.getByRole("button", { name: "Só o texto" }).click();

  const solution = page.locator("#practice-solution-1-50");
  await expect(solution).toBeHidden();
  await page.goto("/chapters/ch01/#practice-solution-1-50");
  await waitForReader(page);
  await expect(solution).toBeVisible();
  await expect(solution.locator(":scope > details")).toHaveAttribute("open", "");
  await expect(page.locator('[data-layer-toggle="practice"]')).toBeChecked();
});
