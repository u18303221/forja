const V='forja-v21',FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request,u=new URL(q.url);if(q.method!=='GET'||u.origin!==location.origin)return;
  const page=q.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname);
  if(page){ // la app: primero internet (siempre la última versión), si no hay, la copia guardada
    e.respondWith(new Promise(res=>{let done=false;const fb=()=>{if(!done){done=true;res(caches.match('index.html').then(h=>h||fetch(q)))}};
      const t=setTimeout(fb,4000);
      fetch(q,{cache:'no-store'}).then(r=>{clearTimeout(t);if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put('index.html',c))}if(!done){done=true;res(r.ok?r:caches.match('index.html').then(h=>h||r))}}).catch(()=>{clearTimeout(t);fb()})}));return}
  const net=fetch(q).then(r=>{if(r.ok){const c=r.clone();e.waitUntil(caches.open(V).then(x=>x.put(q,c)))}return r});
  e.waitUntil(net.catch(()=>{}));
  e.respondWith(caches.match(q,{ignoreSearch:true}).then(hit=>hit||net.catch(()=>caches.match('index.html'))))});
