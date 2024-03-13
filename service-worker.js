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
    // Tentative de récupérer la ressource à partir du réseau
    fetch(event.request)
      .then(function(response) {
        // Si la réponse est valide, la mettre en cache pour une utilisation ultérieure
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
        // Si la récupération à partir du réseau échoue, renvoyer la version mise en cache
        return caches.match(event.request);
      })
  );
});
