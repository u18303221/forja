const V='forja-v5',FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  const net=fetch(e.request).then(r=>{if(r.ok){const c=r.clone();e.waitUntil(caches.open(V).then(x=>x.put(e.request,c)))}return r});
  e.waitUntil(net.catch(()=>{}));
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||net.catch(()=>caches.match('index.html'))))});
