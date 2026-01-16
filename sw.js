/* ========================================== */
/* SERVICE WORKER - DISABLED */
/* ========================================== */

// Service worker disabled - no caching
// This allows for immediate updates during development

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Service Worker: Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // No caching - always fetch from network
  event.respondWith(fetch(event.request));
});

