self.addEventListener('install', function(event){
console.log('sw installed');
event.waitUntil(
    caches.open('static')
    .then(function(cache){
        cache.addAll([
            '/',
            'index.html',
            'play-video.html',
            'app.js',
            'images/icon-img-512.png',
            'images/icon-img-192.png',
            'style.css'
        ]);
    })

);
});

self.addEventListener('activate',function(){
    console.log('sw activated');
});

self.addEventListener('fetch',function(event){
    event.respondWith(
        caches.match(event.request)
        .then(function(res){
            if(res){
                return res;
            }else{
                return fetch(event.request);
            }
        })

    );
});