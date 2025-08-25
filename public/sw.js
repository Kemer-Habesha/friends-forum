const CACHE_NAME = 'friends-forum-v1'
const STATIC_CACHE = 'friends-forum-static-v1'
const DYNAMIC_CACHE = 'friends-forum-dynamic-v1'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service worker activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Handle different types of requests
  if (url.pathname === '/') {
    // Home page - try cache first, then network
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            // Return cached version and update in background
            fetch(request).then((freshResponse) => {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, freshResponse.clone())
              })
            })
            return response
          }
          return fetch(request)
        })
    )
  } else if (url.pathname.startsWith('/_next/') || url.pathname.includes('.')) {
    // Static assets - cache first strategy
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response
          }
          return fetch(request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
        })
    )
  } else {
    // Other pages - network first, fallback to cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(request)
        })
    )
  }
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
              // Handle background sync tasks
        // Background sync functionality can be added here
    )
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from FRIENDS Forum',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  event.waitUntil(
    self.registration.showNotification('FRIENDS Forum', options)
  )
})
