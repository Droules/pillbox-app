const CACHE_NAME = 'pillbox-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.svg', './icon-512.svg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => {
    if (r) {
      fetch(e.request).then(nr => { if (nr.ok) caches.open(CACHE_NAME).then(c => c.put(e.request, nr)); }).catch(() => {});
      return r;
    }
    return fetch(e.request).then(nr => {
      if (nr.ok) { const c2 = nr.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, c2)); }
      return nr;
    });
  }));
});
