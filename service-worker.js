const CACHE_NAME = "signature-tool-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

function updateCache(request, response) {
  if (!response || response.status !== 200 || response.type !== "basic") {
    return Promise.resolve(response);
  }

  const cloned = response.clone();
  return caches.open(CACHE_NAME).then((cache) => {
    cache.put(request, cloned);
    return response;
  });
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (!isSameOrigin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => updateCache("./index.html", response))
        .catch(() => caches.match("./index.html")),
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => updateCache(event.request, response))
      .catch(() => caches.match(event.request)),
  );
});
