/* Ebook Web: shell offline conservador e atualização transparente. */
const CACHE_VERSION = "ebook-web-v5";
const BASE = new URL("./", self.location.href);
const CORE = [
  "./",
  "./chapters/ch01/",
  "./chapters/ch02/",
  "./chapters/ch03/",
  "./references/",
  "./search/",
  "./glossary/",
  "./study/",
  "./search-index.json",
  "./offline/",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./assets/portraits/whitfield-diffie.webp",
  "./assets/portraits/ralph-merkle.webp",
  "./assets/portraits/taher-elgamal.webp",
].map((path) => new URL(path, BASE).href);

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const pending = [...CORE];
    const visited = new Set();

    while (pending.length) {
      const batch = pending.splice(0);
      await Promise.allSettled(batch.map(async (url) => {
        if (visited.has(url)) return;
        visited.add(url);
        const response = await fetch(url, { cache: "reload" });
        if (!response.ok) return;
        await cache.put(url, response.clone());

        const contentType = response.headers.get("content-type") || "";
        if (!/text\/html|text\/css|javascript/.test(contentType)) return;
        const content = await response.text();
        for (const resource of discoverResources(content, url, contentType)) {
          if (!visited.has(resource)) pending.push(resource);
        }
      }));
    }
  })());
});

function discoverResources(content, parentUrl, contentType) {
  const candidates = [];
  const collect = (pattern, group = 1) => {
    for (const match of content.matchAll(pattern)) candidates.push(match[group]);
  };

  if (contentType.includes("text/html")) {
    collect(/(?:src|href|component-url|renderer-url)=["']([^"'#]+)["']/gi);
  } else if (contentType.includes("text/css")) {
    collect(/url\(\s*["']?([^"')]+)["']?\s*\)/gi);
  } else {
    collect(/["'`](\.{1,2}\/[^"'`?#]+\.(?:css|js|mjs|woff2?|png|jpe?g|svg|webp))["'`]/gi);
    collect(/["'`](_astro\/[^"'`?#]+\.(?:css|js|mjs|woff2?|png|jpe?g|svg|webp))["'`]/gi);
  }

  return [...new Set(candidates.flatMap((candidate) => {
    try {
      const context = candidate.startsWith("_astro/") ? BASE : parentUrl;
      const resolved = new URL(candidate, context);
      resolved.hash = "";
      return resolved.origin === self.location.origin && resolved.pathname.startsWith(BASE.pathname) ? [resolved.href] : [];
    } catch {
      return [];
    }
  }))];
}

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith("ebook-web-") && name !== CACHE_VERSION).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cacheKey = new URL(request.url);
          cacheKey.search = "";
          await (await caches.open(CACHE_VERSION)).put(cacheKey.href, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request, { ignoreSearch: true }))
          || (await caches.match(new URL("./offline/", BASE).href))
          || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    const network = fetch(request).then(async (response) => {
      if (response.ok) await (await caches.open(CACHE_VERSION)).put(request, response.clone());
      return response;
    }).catch(() => undefined);
    return cached || (await network) || Response.error();
  })());
});
