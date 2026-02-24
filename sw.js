const CACHE_NAME = 'calculativa-0.2.10'; // Subimos a v6 para limpiar la caché anterior

// 1. EL NÚCLEO (App Shell) - Solo lo esencial y que sabemos que existe
const urlsToCache = [
  // Raíz y Configuración
  './',
  './manifest.json',
  
  // Páginas Base (Asegúrate de que estas rutas sean exactas)
  './instituciones/isfd-bella-vista/index.html',
  './instituciones/isfd-bella-vista/menu-carreras.html',
  './instituciones/isfd-bella-vista/carreras/informatica.html',
  
  // CSS Globales
  './assets/css/styles.css',
  './assets/css/calculadora.css',
  './assets/css/hub.css',
  './assets/css/menu-carreras.css',
  './assets/css/material-icons.css',
  
  // JS Globales (¡Aquí está el cerebro de la app!)
  './assets/js/theme.js',
  './assets/js/slidebar.js',
  './assets/js/favoritos.js',
  './assets/js/notification.js',
  './assets/js/search.js',
  './assets/js/motor-correlativas.js',
  './assets/js/pwa-update.js',
  
  // Fuentes Locales (Para los íconos offline)
  './assets/fonts/material-symbols-rounded.woff2',
  './assets/fonts/material-symbols-outlined.woff2',
  
  // Imágenes Principales Críticas
  './assets/img/Logo-Circular.png',
  './assets/logos/isfd-bella-vista/logo-principal.png'
];

// 2. INSTALACIÓN (Descarga el Núcleo)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Instalando PWA y cacheando archivos base...');
        
        // MAGIA ANTI-BUCLES: Convierte los enlaces en peticiones estrictas 
        // que obligan al navegador a ignorar su memoria temporal (cache: 'reload')
        const peticionesEstrictas = urlsToCache.map(url => new Request(url, { cache: 'reload' }));
        
        return cache.addAll(peticionesEstrictas);
      })
      .catch(err => {
        console.error('❌ Falló la instalación del caché:', err);
      })
  );
});

// 3. INTERCEPTOR (Magia del Caché Dinámico)
self.addEventListener('fetch', event => {
  // Ignoramos peticiones que no sean GET (como envíos de formularios) o que sean de extensiones de Chrome
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // A) Si el archivo ya está en el caché (¡Funciona offline!), lo devuelve inmediatamente
        if (response) {
          return response; 
        }
        
        // B) Si NO está en el caché, lo busca en internet
        return fetch(event.request).then(networkResponse => {
          // Si la respuesta de internet es válida, la clonamos y LA GUARDAMOS EN CACHÉ para la próxima vez
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        }).catch(() => {
          // C) OPCIONAL: Aquí podrías devolver una página genérica de "Sin conexión" si quisieras en el futuro
          console.log('Fallo de red al intentar obtener:', event.request.url);
        });
      })
  );
});

// 4. LIMPIEZA (Elimina versiones viejas cuando actualizas la app)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Eliminando versión vieja del caché:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Reclama el control de las pestañas abiertas inmediatamente
  event.waitUntil(self.clients.claim());
});

// 5. ESCUCHAR ÓRDENES DEL USUARIO
// Esto permite que el botón "Actualizar" de la web despierte al SW que está esperando
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});