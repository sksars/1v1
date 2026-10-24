const CACHE='1v1-virtual-studio-offline-v1';
const CORE=['./','./index.html','./virtual_studio.glb','./human_body_idle_animated.glb','./player_rig.glb'];
const LIBS=[
 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js',
 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/SkeletonUtils.js',
 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js',
 'https://cdn.jsdelivr.net/npm/firebase@9.23.0/firebase-app-compat.js',
 'https://cdn.jsdelivr.net/npm/firebase@9.23.0/firebase-database-compat.js'
];
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await Promise.all(CORE.map(u=>c.add(u).catch(()=>{})));await Promise.all(LIBS.map(async u=>{try{const r=await fetch(u,{mode:'cors',cache:'reload'});if(r.ok)await c.put(u,r)}catch(e){}}));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;event.respondWith((async()=>{const c=await caches.open(CACHE);const key=req.url;const cached=await c.match(key);if(cached)return cached;try{const r=await fetch(req);if(r.ok&&(new URL(req.url).origin===self.location.origin||/cdn\.jsdelivr\.net|gstatic\.com/.test(new URL(req.url).hostname)))c.put(key,r.clone()).catch(()=>{});return r}catch(e){if(req.mode==='navigate')return (await c.match('./index.html'))||Response.error();return Response.error()}})())});
