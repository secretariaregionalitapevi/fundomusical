/* Cache mínimo, auditável, sem qualquer dado financeiro ou sessão. */
const CACHE = 'fundo-musical-shell-v2';
const STATIC = new Set([
  '/offline.html',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png',
]);
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([...STATIC])));
  // Sem skipWaiting: evita substituir o worker durante uma sessão aberta.
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('fundo-musical-') && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || request.method !== 'GET') return;
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname === '/admin' ||
    url.pathname.startsWith('/admin/') ||
    url.searchParams.has('_rsc') ||
    request.headers.has('RSC')
  ) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }
  if (request.mode === 'navigate') {
    // Documentos nunca são armazenados. Só o fallback neutro pré-auditado.
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(
        async () => (await caches.match('/offline.html')) || Response.error(),
      ),
    );
    return;
  }
  if (STATIC.has(url.pathname) && !url.search) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
  }
  // Não há cache de chunks arbitrários, localStorage, sync ou fila de pagamento.
});
