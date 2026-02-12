const CACHE_NAME = 'calculativa-v1';
const urlsToCache = [
  '/2-Calculativa/',
  '/2-Calculativa/index.html',
  '/2-Calculativa/assets/css/styles.css',
  '/2-Calculativa/assets/css/calculadora.css',
  '/2-Calculativa/assets/css/hub.css',
  '/2-Calculativa/assets/css/menu-carreras.css',
  '/2-Calculativa/assets/js/theme.js',
  '/2-Calculativa/assets/js/slidebar.js',
  '/2-Calculativa/assets/js/favoritos.js',
  '/2-Calculativa/assets/js/notification.js',
  '/2-Calculativa/assets/js/search.js',
  '/2-Calculativa/assets/img/Logo-Circular.png'
  // Agrega aquí todos los CSS/JS/imágenes críticas
];

// Instalación: guardar archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Interceptar peticiones: servir desde caché si está disponible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Limpiar cachés viejas al activar
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que Chrome muestre su propio banner
  e.preventDefault();
  // Guardar el evento para usarlo después
  deferredPrompt = e;
  // Mostrar tu botón personalizado
  document.getElementById('install-button').style.display = 'block';
});

document.getElementById('install-button').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  // Mostrar el cuadro de diálogo de instalación
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`Usuario ${outcome === 'accepted' ? 'instaló' : 'canceló'}`);
  deferredPrompt = null;
  document.getElementById('install-button').style.display = 'none';
});

// Si la app ya está instalada, ocultar el botón
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA instalada');
  deferredPrompt = null;
  document.getElementById('install-button').style.display = 'none';
});