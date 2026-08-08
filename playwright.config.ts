import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser",
  fullyParallel: true,
  // Cada leitor monta milhares de fórmulas e centenas de painéis. Um worker
  // no runner de Pages evita que capítulos pesados disputem CPU e excedam
  // timeouts sem relação com o comportamento testado.
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4322",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "node scripts/serve-static.mjs --directory dist --port 4322",
    url: "http://127.0.0.1:4322",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
