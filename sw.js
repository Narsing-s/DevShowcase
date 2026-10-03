const CACHE="devshowcase-v4";
const CORE=["./","./index.html","./manifest.webmanifest"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 const u=new URL(event.request.url);
 if(u.origin!==location.origin)return;
 if(u.pathname.startsWith("/api/")){
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
  return;
 }
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
  const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return response;
 }).catch(()=>cached)));
});