// RAAS - Roots AI Agriculture Solutions - Advanced Service Worker
// Version 1.0.0
// Implements: Offline support, Smart caching, Background sync, Push notifications

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `raas-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `raas-data-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `raas-images-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/favicon.svg'
];

// API endpoints to cache with network-first strategy
const API_ENDPOINTS = [
  '/api/auth/me',
  '/api/farms',
  '/api/crops',
  '/api/weather',
  '/api/notifications'
];

// Maximum cache sizes
const MAX_IMAGE_CACHE_SIZE = 50;
const MAX_DATA_CACHE_SIZE = 100;
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { credentials: 'same-origin' })));
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== DATA_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle API requests with Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle image requests with Cache First strategy
  if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE_NAME));
    return;
  }

  // Handle navigation requests with Network First strategy
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request, true));
    return;
  }

  // Handle other requests with Cache First strategy
  event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
});

// Network First Strategy - Try network, fallback to cache
async function networkFirstStrategy(request, isNavigation = false) {
  const cache = await caches.open(isNavigation ? CACHE_NAME : DATA_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Only cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      // Clone the response before caching
      cache.put(request, networkResponse.clone());
      
      // Manage cache size for data cache
      if (!isNavigation) {
        await manageCacheSize(DATA_CACHE_NAME, MAX_DATA_CACHE_SIZE);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network request failed, trying cache:', request.url);
    
    // Try to get from cache
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If navigation and no cache, return offline page
    if (isNavigation) {
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'No network connection and no cached data available' 
      }),
      { 
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({ 'Content-Type': 'application/json' })
      }
    );
  }
}

// Cache First Strategy - Try cache, fallback to network
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cached response is expired
    const cacheTime = cachedResponse.headers.get('sw-cache-time');
    if (cacheTime) {
      const age = Date.now() - parseInt(cacheTime, 10);
      if (age > CACHE_EXPIRY_TIME) {
        // Cache expired, try to update in background
        updateCache(request, cache, cacheName);
      }
    }
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // Add cache time header
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-cache-time', Date.now().toString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse);
      
      // Manage cache size
      await manageCacheSize(cacheName, 
        cacheName === IMAGE_CACHE_NAME ? MAX_IMAGE_CACHE_SIZE : MAX_DATA_CACHE_SIZE
      );
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // Return offline fallback for images
    if (cacheName === IMAGE_CACHE_NAME) {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#999" text-anchor="middle" dy=".3em">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Update cache in background
async function updateCache(request, cache, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const headers = new Headers(networkResponse.headers);
      headers.append('sw-cache-time', Date.now().toString());
      
      const modifiedResponse = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: headers
      });
      
      await cache.put(request, modifiedResponse);
      await manageCacheSize(cacheName, 
        cacheName === IMAGE_CACHE_NAME ? MAX_IMAGE_CACHE_SIZE : MAX_DATA_CACHE_SIZE
      );
    }
  } catch (error) {
    console.log('[Service Worker] Background update failed:', error);
  }
}

// Manage cache size by removing oldest entries
async function manageCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // Delete oldest entries
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Background Sync - sync data when online
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncPendingData());
  }
  
  if (event.tag === 'sync-images') {
    event.waitUntil(syncPendingImages());
  }
});

// Sync pending data when back online
async function syncPendingData() {
  console.log('[Service Worker] Syncing pending data...');
  
  try {
    // Get pending requests from IndexedDB or localStorage
    const pendingRequests = await getPendingRequests();
    
    for (const request of pendingRequests) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });
        
        // Remove from pending queue
        await removePendingRequest(request.id);
      } catch (error) {
        console.error('[Service Worker] Failed to sync request:', error);
      }
    }
    
    // Notify clients that sync is complete
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// Sync pending images
async function syncPendingImages() {
  console.log('[Service Worker] Syncing pending images...');
  // Implementation for image sync
}

// Helper functions for pending requests (placeholder implementations)
async function getPendingRequests() {
  // TODO: Implement with IndexedDB
  return [];
}

async function removePendingRequest(id) {
  // TODO: Implement with IndexedDB
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'RAAS';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/badge-72x72.svg',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    vibrate: [200, 100, 200],
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Message handler for communication with app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-data') {
    event.waitUntil(updateCachedData());
  }
});

async function updateCachedData() {
  console.log('[Service Worker] Updating cached data...');
  // Refresh important cached data
  const cache = await caches.open(DATA_CACHE_NAME);
  
  const urlsToUpdate = [
    '/api/weather',
    '/api/notifications',
    '/api/schemes'
  ];
  
  for (const url of urlsToUpdate) {
    try {
      const response = await fetch(url);
      if (response && response.status === 200) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.error('[Service Worker] Failed to update:', url);
    }
  }
}

console.log('[Service Worker] Loaded successfully');
