const CACHE = 'ml-recall-v18b-20260819';
const CORE = [
  './', './index.html', './styles.css?v=18', './app.js?v=18', './question-bank.js?v=18',
  './course-math-v13.js?v=18', './pca-fix-v17.js?v=18', './formula-safety-v18.js?v=18',
  './lazy-katex-v18.js?v=18', './math-mode.js?v=18', './why-context-v13.js?v=18', './interaction-v16.js?v=18',
  './manifest.webmanifest?v=18', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('ml-recall-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', event => { if (event.data === 'SKIP_WAITING') self.skipWaiting(); });

async function networkFirst(req){
  try{
    const fresh=await fetch(req);
    if(fresh?.ok){const cache=await caches.open(CACHE);cache.put(req,fresh.clone());}
    return fresh;
  }catch{
    return (await caches.match(req,{ignoreSearch:false})) || (req.mode==='navigate' ? await caches.match('./index.html') : Response.error());
  }
}
async function cacheFirst(req){
  const cached=await caches.match(req,{ignoreSearch:false});
  if(cached)return cached;
  try{
    const fresh=await fetch(req);
    if(fresh && (fresh.ok||fresh.type==='opaque')){const cache=await caches.open(CACHE);cache.put(req,fresh.clone());}
    return fresh;
  }catch{return Response.error();}
}

self.addEventListener('fetch', event => {
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===self.location.origin){
    // Navigation stays network-first so a new build is discovered quickly. All
    // versioned JS/CSS/assets are cache-first for instant PWA response after install.
    event.respondWith(req.mode==='navigate' ? networkFirst(req) : cacheFirst(req));
    return;
  }
  if(url.hostname==='cdn.jsdelivr.net')event.respondWith(cacheFirst(req));
});
