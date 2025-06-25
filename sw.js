// Service Worker para CREINFOR
// Versión del cache - cambiar para forzar actualización
const CACHE_NAME = 'creinfor-v1.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/bootstrap.min.css',
  '/css/animate.min.css',
  '/css/font-awesome.min.css',
  '/css/lightbox.css',
  '/css/responsive.css',
  '/css/presets/preset1.css',
  '/js/main.js',
  '/js/jquery.js',
  '/js/bootstrap.min.js',
  '/js/wow.min.js',
  '/js/lightbox.min.js',
  '/js/smoothscroll.js',
  '/images/logo.png',
  '/images/favicon.ico',
  '/images/slider/1.webp',
  '/images/slider/2.webp',
  '/images/slider/3.webp',
  '/images/videos/5200-183786525_small.mp4'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - devolver respuesta del cache
        if (response) {
          return response;
        }

        return fetch(event.request).then(function(response) {
          // Verificar si recibimos una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // IMPORTANTE: Clonar la respuesta
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      }
    )
  );
});

// Manejar notificaciones push (para futuras implementaciones)
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'CREINFOR';
  const options = {
    body: event.data.text(),
    icon: '/images/logo.png',
    badge: '/images/favicon.ico'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://www.creinfor.com')
  );
}); 