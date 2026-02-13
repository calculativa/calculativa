const CACHE_NAME = 'calculativa-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/styles.css',
  './assets/css/calculadora.css',
  './assets/css/hub.css',
  './assets/css/menu-carreras.css',
  './assets/js/theme.js',
  './assets/js/slidebar.js',
  './assets/js/favoritos.js',
  './assets/js/notification.js',
  './assets/js/search.js',
  './assets/img/Logo-Circular.png',
  './assets/logos/logo-isfd-bv-100x100.png',
  './assets/logos/logo-isfd-ituzaingo-100x100.png',
  './assets/logos/logo-isfd-jme-100x100.png',
  './assets/logos/logo-isfd-mburucuya-100x100.png',
  './assets/logos/logo-isfd-mercedes-100x100.png',
  './assets/logos/logo-isfd-sl-100x100.png',
  './assets/logos/logo-isfd-goya-100x100.png',
  './assets/img/ubicacion.png'
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cacheando recursos...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Limpiar cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Eliminando caché viejo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});