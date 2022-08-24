const PREFIX = 'V2'; 
const CACHED_FILES = [
    'style.css',
];
self.addEventListener('install',function(event){
    self.skipWaiting();
console.log(PREFIX + ' installer');
event.waitUntil(
    (async()=>{
        const cache = await caches.open(PREFIX);
        await Promise.all([...CACHED_FILES, 'offline.html'].map((path)=>{
            return cache.add(new Request(path));
        }))
    })()
);

});
self.addEventListener('activate',function(event){
    clients.claim();
    event.waitUntil((async()=>{
        const keys = await caches.keys();
       await Promise.all( keys.map(key =>{
        if(!key.includes(PREFIX)){
            return caches.delete(key);
        }
    }));
    })())
    console.log(PREFIX + ' active');
});

self.addEventListener('fetch',function(event){
   console.log(PREFIX + ' Fetching :'+ event.request.url+' Mode '+event.request.mode);
   if(event.request.mode === 'navigate'){
    event.respondWith(
            (async ()=>{
                try{
                const preloadResponse = await event.preloadResponse;
                if(preloadResponse){
                    return preloadResponse;
                }
                return await fetch(event.request);
            }catch(e){
                const cache = await caches.open(PREFIX);
                return await cache.match('offline.html');
            }
           
        })()
    );
   }else if(CACHED_FILES.includes(event.request.url)){
    event.respondWith(caches.match(event.request));
   }
});
