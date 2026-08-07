import type { APIRoute } from "astro";
import { chapters } from "../chapters";
import glossary from "../content/glossary.json";
import paths from "../content/learning-paths.json";
import references from "../content/references.json";
import symbols from "../content/symbols.json";
import { buildSearchIndex } from "../lib/discovery";

export const prerender = true;

export const GET: APIRoute = () => new Response(
  JSON.stringify(buildSearchIndex(chapters, references, glossary, symbols, paths)),
  {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  },
);
