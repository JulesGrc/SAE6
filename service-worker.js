const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  'arrivee_depot.html',
  'controle_paniers.html',
  'retour_jardins.html',
  'css/styleHome.css',
  'script.js',
  // Ajoutez ici tous les autres fichiers que vous souhaitez mettre en cache
];

self.addEventListener('install', function(event) {
  // Installation du service worker et mise en cache des ressources
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Interception des requêtes réseau
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Si la ressource est présente dans le cache, on la renvoie
        if (response) {
          return response;
        }

        // Sinon, on effectue la requête réseau normalement
        return fetch(event.request);
      })
  );
});
