const CACHE_VERSION = 'propvisionai-v1'
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/demo-after.jpg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log('[SW] Caching essential files')
      return cache.addAll(CACHE_URLS)
    }).then(() => self.skipWaiting())
  )
})

// Activate event - remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Network first for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Offline fallback for API
          return new Response(JSON.stringify({ offline: true }), {
            headers: { 'Content-Type': 'application/json' },
          })
        })
    )
    return
  }

  // Cache first for assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }

      return fetch(event.request).then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        // Clone response and add to cache
        const responseClone = response.clone()
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(event.request, responseClone)
        })

        return response
      }).catch(() => {
        // Return offline placeholder if no cache
        return new Response('Offline', { status: 503 })
      })
    })
  )
})
