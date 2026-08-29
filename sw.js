const CACHE = "helloworld-static-v12";
const ASSETS = [
  "./", "./index.html", "./app.html", "./manifest.webmanifest", "./sw.js",
  "./css/style.css",
  "./js/app.js", "./js/config.js",
  "./js/languages/kiosk.js",
  "./js/generated/app.bundle.js", "./data/generated/id.js", "./data/generated/vi.js",
  "./js/services/data-loader.js", "./js/services/history.js", "./js/services/translator.js",
  "./data/indonesia.json", "./data/vietnam.json", "./icons/icon-192.png", "./icons/icon-512.png",
  "./indonesia/index.html", "./vietnam/index.html"
];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("./index.html") : Response.error())));
});
