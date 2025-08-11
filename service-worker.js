// Define un nombre y versión para la caché. Si haces cambios importantes, incrementa el número (v2, v3, etc.)
const CACHE_NAME = 'pagos-andreli-cache-v2';
// Lista de archivos y recursos que se guardarán en la caché para que la app funcione sin conexión.
const urlsToCache = [
  '/',
  '/index.html',
  // ¡MUY IMPORTANTE! Asegúrate de tener estos íconos en la misma carpeta que tu index.html
  '/icon-192.png',
  '/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', event => {
  // Espera hasta que la promesa de la caché se resuelva.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta y guardando archivos principales.');
        // Agrega todos los archivos de la lista a la caché. Si uno falla, fallan todos.
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        // Esto es útil para depurar. Si un archivo de la lista no se encuentra, verás un error aquí.
        console.error('Falló el guardado en caché durante la instalación:', error);
      })
  );
});

// Evento 'activate': Se dispara después de la instalación. Es ideal para limpiar cachés antiguas.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Busca todas las cachés que empiecen con 'pagos-andreli-cache-' pero que no sean la actual.
          return cacheName.startsWith('pagos-andreli-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Eliminando caché antigua:', cacheName);
          // Elimina la caché antigua para liberar espacio y evitar conflictos.
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Evento 'fetch': Se dispara cada vez que la página solicita un recurso (imágenes, scripts, etc.)
self.addEventListener('fetch', event => {
  // Responde a la solicitud con una estrategia "Cache first".
  event.respondWith(
    // Busca si el recurso solicitado ya está en la caché.
    caches.match(event.request)
      .then(cachedResponse => {
        // Si el recurso está en la caché, lo devuelve desde ahí. Esto hace que la app cargue rápido.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no está en la caché, lo solicita a la red.
        return fetch(event.request).catch(error => {
            console.log('Error al obtener desde la red:', error);
            // Aquí podrías devolver una página de "sin conexión" si lo deseas.
        });
      })
  );
});
