const CACHE = 'ml-recall-v11-20260817';
const CORE = [
  './', './index.html', './styles.css?v=10', './app.js?v=10', './question-bank.js?v=10', './math-mode.js?v=11',
  './manifest.webmanifest?v=11', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('ml-recall-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => { if (event.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) { const cache = await caches.open(CACHE); cache.put(req, fresh.clone()); }
        return fresh;
      } catch (e) {
        const cached = await caches.match(req, {ignoreSearch:false});
        if (cached) return cached;
        if (req.mode === 'navigate') return (await caches.match('./index.html')) || Response.error();
        return Response.error();
      }
    })());
    return;
  }
  if (url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        if (fresh && (fresh.ok || fresh.type === 'opaque')) { const cache = await caches.open(CACHE); cache.put(req, fresh.clone()); }
        return fresh;
      } catch (e) { return cached || Response.error(); }
    })());
  }
});