const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  'arrivee_depot.html',
  'controle_paniers.html',
  'css/styleHome.css',
  'script.js',
  'map.html',
  'deuxieme_ecran.html',
  'index.html',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseClone);
            });
          return response;
        }
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
