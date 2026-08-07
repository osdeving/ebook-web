import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "ebook-web";
const productionBase = repository.endsWith(".github.io") ? "/" : `/${repository}`;

export default defineConfig({
  site: process.env.SITE_URL ?? "https://osdeving.github.io",
  base: process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS ? productionBase : "/"),
  output: "static",
  trailingSlash: "always",
  integrations: [react()],
  vite: {
    build: {
      sourcemap: true,
    },
  },
});
