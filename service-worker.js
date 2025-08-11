// Define un nombre y versión para la caché
const CACHE_NAME = 'pagos-andreli-cache-v1';
// Lista de archivos y recursos que se guardarán en la caché
const urlsToCache = [
  '/',
  '/index.html',
  // Asegúrate de tener un ícono con este nombre en tu carpeta
  '/icon-192.png', 
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Evento 'install': Se dispara cuando el Service Worker se instala
self.addEventListener('install', event => {
  // Espera hasta que la promesa se resuelva
  event.waitUntil(
    // Abre la caché con el nombre definido
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta');
        // Agrega todos los archivos de la lista a la caché
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la página solicita un recurso (imágenes, scripts, etc.)
self.addEventListener('fetch', event => {
  // Responde a la solicitud
  event.respondWith(
    // Busca si el recurso solicitado ya está en la caché
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en la caché, lo devuelve desde ahí
        if (response) {
          return response;
        }
        // Si no está en la caché, lo solicita a la red
        return fetch(event.request);
      }
    )
  );
});
