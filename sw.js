/* NeverLeft service worker — bump SHELL_CACHE after deploy when shell assets change */
const SHELL_CACHE = 'neverleft-shell-v1';
const FONT_CACHE = 'neverleft-fonts-v1';

const PRECACHE_URLS = [
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/sw.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (
              (key.startsWith('neverleft-shell-') && key !== SHELL_CACHE) ||
              (key.startsWith('neverleft-fonts-') && key !== FONT_CACHE)
            ) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(SHELL_CACHE).then((cache) => {
              cache.put('/index.html', copy);
            });
          }
          return response;
        })
        .catch(() =>
          caches.match('/index.html').then((r) => r || new Response('Offline', { status: 503 }))
        )
    );
    return;
  }

  if (
    request.method === 'GET' &&
    (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(request))
      )
    );
    return;
  }

  if (request.method === 'GET' && url.origin === self.location.origin) {
    if (url.pathname === '/sw.js' || url.pathname === '/manifest.json') {
      return;
    }
    event.respondWith(
      caches.open(SHELL_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok && response.type === 'basic') {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
      )
    );
  }
});
