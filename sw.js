const CACHE = "semester1-v1";
const ASSETS = ["./", "index.html", "styles.css", "app.js", "config.js", "events.json", "manifest.webmanifest"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith("events.json")) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request, {ignoreSearch: true})));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
});
