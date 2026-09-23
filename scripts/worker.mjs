import fs from 'node:fs';import path from 'node:path';import {fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../www');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const assets=['./','./index.html','./manifest.webmanifest','./css/app.css',...['js','assets'].flatMap(d=>walk(path.join(root,d)).map(p=>'./'+path.relative(root,p).split(path.sep).join('/')))];
const worker=`/* Tuhu v56. Cache bundled app resources only; never user receipts or third-party map tiles. */
const CACHE='tuhu-v56-shell-1';
const ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('tuhu-v')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function rangeResponse(request){
 const hit=await caches.match(request);if(!hit)return fetch(request);
 const full=await hit.arrayBuffer(),length=full.byteLength;
 const m=/^bytes=(\\d*)-(\\d*)$/.exec(request.headers.get('range')||'');
 if(!m||(!m[1]&&!m[2]))return new Response(full,{headers:hit.headers});
 let start=m[1]?Number(m[1]):Math.max(0,length-Number(m[2]));
 let end=m[1]?(m[2]?Math.min(Number(m[2]),length-1):length-1):length-1;
 if(start>=length||end<start)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+length}});
 const headers=new Headers(hit.headers);headers.set('Accept-Ranges','bytes');headers.set('Content-Range','bytes '+start+'-'+end+'/'+length);headers.set('Content-Length',String(end-start+1));
 return new Response(full.slice(start,end+1),{status:206,headers});
}
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 if(request.headers.has('range')){event.respondWith(rangeResponse(request));return;}
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone());}return response;}).catch(()=>caches.match('./index.html')));return;
 }
 event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
});
`;
fs.writeFileSync(path.join(root,'sw.js'),worker);console.log('Offline app shell: '+assets.length+' local resources.');