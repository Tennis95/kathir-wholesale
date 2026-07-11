// Service Worker for KATHIR LTD PWA
const CACHE_NAME = 'kathir-v2';
const RUNTIME_CACHE = 'kathir-runtime-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/categories',
  '/checkout',
  '/contact',
  '/faqs',
  '/account',
  '/offline.html',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Cache addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API calls with network-first strategy
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return (
              response ||
              new Response('Offline - API unavailable', {
                status: 503,
                statusText: 'Service Unavailable',
              })
            );
          });
        })
    );
    return;
  }

  // Handle document requests with network-first strategy
  // (always serve the latest page; fall back to cache only when offline)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline.html') || new Response('Offline');
          });
        })
    );
    return;
  }

  // Handle image and font requests with cache-first strategy
  if (
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#f0f0f0" width="100" height="100"/><text x="50" y="50" font-size="12" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
                {
                  headers: { 'Content-Type': 'image/svg+xml' },
                }
              );
            }
            return new Response('Offline');
          });
      })
    );
    return;
  }

  // Default: network-first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          return response || new Response('Offline');
        });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Focus or open window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle notification dismissal
self.addEventListener('notificationclose', (event) => {
  console.log('Notification dismissed:', event.notification.tag);
});

// Background sync for cart and orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncCart() {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const cartData = await cache.match('/cart-data');

    if (cartData) {
      const data = await cartData.json();
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Clear synced data
        await cache.delete('/cart-data');
      }
    }
  } catch (error) {
    console.error('Cart sync failed:', error);
    throw error; // Retry
  }
}

async function syncOrders() {
  try {
    const response = await fetch('/api/orders/sync');
    if (response.ok) {
      const orders = await response.json();

      // Show notification for new orders
      if (orders.length > 0) {
        self.registration.showNotification('Order Update', {
          body: `You have ${orders.length} new order(s)!`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'order-sync',
        });
      }
    }
  } catch (error) {
    console.error('Order sync failed:', error);
  }
}
