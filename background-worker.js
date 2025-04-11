// Service worker for background game processing
const CACHE_NAME = 'cyber-forex-cache-v1';
const BACKGROUND_SYNC_INTERVAL = 30000; // 30 seconds sync interval

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/app.js',
                '/config.js',
                '/sound-manager.js'
            ]);
        })
    );
});

// Background sync mechanism
function backgroundSync() {
    // Send a message to the main thread to update game state
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({
                type: 'BACKGROUND_SYNC',
                timestamp: Date.now()
            });
        });
    });
}

// Set up periodic background sync
setInterval(backgroundSync, BACKGROUND_SYNC_INTERVAL);

self.addEventListener('fetch', (event) => {
    // Optional: Add caching strategy
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});