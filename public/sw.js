const CACHE_NAME = "qlcv-admin-cache-v3";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.svg"
];

// Install Event - cache the core shell
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - clean up old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Stale-while-revalidate strategy for dynamic assets
self.addEventListener("fetch", (e) => {
  // Avoid caching non-HTTP/S requests (e.g. extension scripts, vercel telemetry)
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Network-First with cache fallback for navigation requests to ensure fresh content
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(e.request);
        })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate)
        fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, networkResponse);
            });
          }
        }).catch(() => { /* ignore offline fetch errors */ });
        return cachedResponse;
      }

      return fetch(e.request).then((networkResponse) => {
        // Cache new successful requests
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
