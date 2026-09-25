const CACHE_NAME = 'sifou-v1';
const ASSETS = [
'/Sifou/',
'/Sifou/index.html',
'/Sifou/manifest.json',
'/Sifou/icon-192.png',
'/Sifou/icon-512.png'
];

// تثبيت Service Worker وتخزين الملفات مؤقتاً
self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
);
self.skipWaiting();
});

// تفعيل وحذف النسخ القديمة
self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((keys) =>
Promise.all(
keys.filter((key) => key !== CACHE_NAME)
.map((key) => caches.delete(key))
)
)
);
self.clients.claim();
});

// استراتيجية: الشبكة أولاً، ثم الذاكرة المؤقتة عند الفشل
self.addEventListener('fetch', (event) => {
event.respondWith(
fetch(event.request)
.then((response) => {
const copy = response.clone();
caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
return response;
})
.catch(() => caches.match(event.request))
);
});
