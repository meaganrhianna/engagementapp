const CACHE_NAME = 'engagement-toolkit-v1';
const urlsToCache = [
  './',
  './index.html',
  './results.html',
  './styles/styles.css',
  './js/logic.js',
  './manifest.json',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/images/favicon.ico'
];


// Install the service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch files from cache first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
