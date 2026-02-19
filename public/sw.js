const CACHE_VERSION = 'propvisionai-v2'
const ASSET_CACHE = `assets-${CACHE_VERSION}`

function isFingerprintedAsset(requestUrl) {
  if (requestUrl.origin !== self.location.origin) {
    return false
  }

  // Vite build output: /assets/<name>-<hash>.<ext>
  return /^\/assets\/.+-[A-Za-z0-9_-]{6,}\.[A-Za-z0-9]+$/.test(requestUrl.pathname)
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

// Activate event - remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== ASSET_CACHE) {
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

  const requestUrl = new URL(event.request.url)

  // Never cache document navigations to avoid stale routes/pages.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(fetch(event.request))
    return
  }

  // Cache first only for fingerprinted build assets.
  if (!isFingerprintedAsset(requestUrl)) {
    event.respondWith(fetch(event.request))
    return
  }

  event.respondWith(
    caches.open(ASSET_CACHE).then((cache) => cache.match(event.request).then((response) => {
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
        cache.put(event.request, responseClone)

        return response
      }).catch(() => {
        return new Response('Offline asset unavailable', { status: 503 })
      })
    }))
  )
})
