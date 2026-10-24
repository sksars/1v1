'use strict';
const CACHE = '1v1-virtual-studio-offline-v23';
const CORE = ['./', './index.html', './virtual_studio.glb', './human_body_idle_animated.glb', './player_rig.glb', './player_animated.glb', './AssaultRifle_1.obj', './AssaultRifle_1.mtl', './player_animations.js'];
const LIBS = [
  'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/MTLLoader.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/SkeletonUtils.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js',
  'https://cdn.jsdelivr.net/npm/firebase@9.23.0/firebase-app-compat.js',
  'https://cdn.jsdelivr.net/npm/firebase@9.23.0/firebase-database-compat.js'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(LIBS.map(async url => {
      try {
        const response = await fetch(url, { mode: 'no-cors', cache: 'reload' });
        if (response && (response.ok || response.type === 'opaque')) await cache.put(url, response);
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('1v1-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin || LIBS.includes(request.url)) {
    event.respondWith((async () => {
      const cached = await caches.match(request, { ignoreSearch: false });
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.type === 'opaque')) {
          const cache = await caches.open(CACHE);
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (error) {
        if (request.mode === 'navigate') {
          const page = await caches.match('./index.html');
          if (page) return page;
        }
        throw error;
      }
    })());
  }
});
