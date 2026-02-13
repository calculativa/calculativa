const CACHE_NAME = 'calculativa-v1';
const urlsToCache = [
  // Raíz
  './',
  './index.html',
  './manifest.json',
  
  // CSS global
  './assets/css/styles.css',
  './assets/css/calculadora.css',
  './assets/css/hub.css',
  './assets/css/menu-carreras.css',
  
  // JS global
  './assets/js/theme.js',
  './assets/js/slidebar.js',
  './assets/js/favoritos.js',
  './assets/js/notification.js',
  './assets/js/search.js',
  
  // Imágenes globales
  './assets/img/Logo-Circular.png',
  './assets/img/ubicacion.png',
  './assets/logos/logo-isfd-bv-100x100.png',
  './assets/logos/logo-isfd-ituzaingo-100x100.png',
  './assets/logos/logo-isfd-jme-100x100.png',
  './assets/logos/logo-isfd-mburucuya-100x100.png',
  './assets/logos/logo-isfd-mercedes-100x100.png',
  './assets/logos/logo-isfd-sl-100x100.png',
  './assets/logos/logo-isfd-goya-100x100.png',
  
  // PÁGINAS HTML
  './instituciones/isfd-bella-vista/index.html',
  './instituciones/isfd-bella-vista/menu-carreras.html',
  './instituciones/isfd-bella-vista/carreras/informatica.html',
  
  // CSS específico de instituciones
  './instituciones/isfd-bella-vista/assets-intituciones/css/styles.css',
  
  // JS específico de instituciones
  './instituciones/isfd-bella-vista/assets-intituciones/js/favoritos.js',
  './instituciones/isfd-bella-vista/assets-intituciones/js/notification.js',
  './instituciones/isfd-bella-vista/assets-intituciones/js/search.js',
  './instituciones/isfd-bella-vista/assets-intituciones/js/slidebar.js',
  './instituciones/isfd-bella-vista/assets-intituciones/js/theme.js',
  
  // Logos específicos de instituciones
  './instituciones/isfd-bella-vista/assets-intituciones/logos/logo-isfd-bv-100x100.png',
  
  // Recursos de la calculadora (carreras)
  './instituciones/isfd-bella-vista/carreras/informatica/assetscarreras/js/theme.js',
  './instituciones/isfd-bella-vista/carreras/informatica/assetscarreras/logos/favicon.ico',
  './instituciones/isfd-bella-vista/carreras/informatica/assetscarreras/logos/android-chrome-192x192.png',
  './instituciones/isfd-bella-vista/carreras/informatica/assetscarreras/logos/android-chrome-512x512.png',
  './instituciones/isfd-bella-vista/carreras/informatica/assetscarreras/logos/apple-touch-icon.png',
  './instituciones/isfd-bella-vista/carreras/informatica/assetscarreras/logos/favicon-16x16.png',
  './instituciones/isfd-bella-vista/carreras/informatica/assetscarreras/logos/favicon-32x32.png'
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cacheando TODOS los recursos...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Devuelve desde caché
        }
        return fetch(event.request).then(networkResponse => {
          // Opcional: guardar en caché lo nuevo
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
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