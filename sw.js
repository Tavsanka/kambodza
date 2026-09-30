/* The generated list is deliberately kept in this file for a static deployment. */
const VERSION = 'f47ce6c';
const CACHE = 'kambodza-' + VERSION;
const RUNTIME_CACHE = 'kambodza-ext-' + VERSION;

/*PRECACHE-START*/
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/diary.css',
  './css/fixes.css',
  './css/guide.css',
  './css/maps.css',
  './css/places.css',
  './css/style.css',
  './js/core.js',
  './js/data.js',
  './js/diary.js',
  './js/globe.js',
  './js/guide.js',
  './js/i18n.js',
  './js/journey-data.js',
  './js/land.js',
  './js/maps.js',
  './js/photodb.js',
  './js/planner.js',
  './js/practical-data.js',
  './js/pwa.js',
  './js/story-extras.js',
  './js/story.js',
  './js/sync.js',
  './vendor/scrollcraft.css',
  './vendor/scrollcraft.js',
  './assets/bayon-s.webp',
  './assets/bayon.webp',
  './assets/beijing-hutong.webp',
  './assets/greatwall-s.webp',
  './assets/greatwall.webp',
  './assets/kr-plankton.webp',
  './assets/krs-hammock.webp',
  './assets/leaves-s.webp',
  './assets/leaves.webp',
  './assets/mist-s.webp',
  './assets/mist.webp',
  './assets/pp-night-s.webp',
  './assets/pp-night.webp',
  './assets/shv-ferry.webp',
  './assets/vienna-cafe-s.webp',
  './assets/vienna-cafe.webp',
  './assets/vienna-window-s.webp',
  './assets/vienna-window.webp',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512-maskable.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon.svg',
  './assets/photos/beijing-1-s.webp',
  './assets/photos/beijing-1.webp',
  './assets/photos/beijing-2-s.webp',
  './assets/photos/beijing-2.webp',
  './assets/photos/beijing-3-s.webp',
  './assets/photos/beijing-3.webp',
  './assets/photos/beijing-4-s.webp',
  './assets/photos/beijing-4.webp',
  './assets/photos/beijing-5-s.webp',
  './assets/photos/beijing-5.webp',
  './assets/photos/beijing-6-s.webp',
  './assets/photos/beijing-6.webp',
  './assets/photos/beijing-7-s.webp',
  './assets/photos/beijing-7.webp',
  './assets/photos/greatwall-1-s.webp',
  './assets/photos/greatwall-1.webp',
  './assets/photos/greatwall-2-s.webp',
  './assets/photos/greatwall-2.webp',
  './assets/photos/greatwall-3-s.webp',
  './assets/photos/greatwall-3.webp',
  './assets/photos/greatwall-4-s.webp',
  './assets/photos/greatwall-4.webp',
  './assets/photos/greatwall-5-s.webp',
  './assets/photos/greatwall-5.webp',
  './assets/photos/kohrong-1-s.webp',
  './assets/photos/kohrong-1.webp',
  './assets/photos/kohrong-2-s.webp',
  './assets/photos/kohrong-2.webp',
  './assets/photos/kohrong-g1-s.webp',
  './assets/photos/kohrong-g1.webp',
  './assets/photos/kohrong-g2.webp',
  './assets/photos/kohrongsamloem-1-s.webp',
  './assets/photos/kohrongsamloem-1.webp',
  './assets/photos/kohrongsamloem-2-s.webp',
  './assets/photos/kohrongsamloem-2.webp',
  './assets/photos/kohrongsamloem-3-s.webp',
  './assets/photos/kohrongsamloem-3.webp',
  './assets/photos/kohrongsamloem-4-s.webp',
  './assets/photos/kohrongsamloem-4.webp',
  './assets/photos/phnompenh-1-s.webp',
  './assets/photos/phnompenh-1.webp',
  './assets/photos/phnompenh-2-s.webp',
  './assets/photos/phnompenh-2.webp',
  './assets/photos/phnompenh-3-s.webp',
  './assets/photos/phnompenh-3.webp',
  './assets/photos/phnompenh-4-s.webp',
  './assets/photos/phnompenh-4.webp',
  './assets/photos/phnompenh-5-s.webp',
  './assets/photos/phnompenh-5.webp',
  './assets/photos/siemreap-1-s.webp',
  './assets/photos/siemreap-1.webp',
  './assets/photos/siemreap-2-s.webp',
  './assets/photos/siemreap-2.webp',
  './assets/photos/siemreap-3-s.webp',
  './assets/photos/siemreap-3.webp',
  './assets/photos/siemreap-4-s.webp',
  './assets/photos/siemreap-4.webp',
  './assets/photos/siemreap-5-s.webp',
  './assets/photos/siemreap-5.webp',
  './assets/photos/sihanoukville-1-s.webp',
  './assets/photos/sihanoukville-1.webp',
  './assets/photos/sihanoukville-2-s.webp',
  './assets/photos/sihanoukville-2.webp',
  './assets/photos/sihanoukville-3-s.webp',
  './assets/photos/sihanoukville-3.webp',
  './assets/photos/sihanoukville-4-s.webp',
  './assets/photos/sihanoukville-4.webp',
  './assets/photos/sihanoukville-5-s.webp',
  './assets/photos/sihanoukville-5.webp'
];
/*PRECACHE-END*/

const PHOTOS = PRECACHE.filter(path => path.startsWith('./assets/photos/'));
const CORE = PRECACHE.filter(path => !path.startsWith('./assets/photos/'));

function log(message, error) {
  console.warn('[kambodza SW] ' + message, error || '');
}

async function cacheOne(cache, url) {
  try {
    await cache.add(url);
  } catch (error) {
    log('Nie udało się zapisać ' + url, error);
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map(url => cacheOne(cache, url)));
    // Bez skipWaiting: nowa wersja czeka, aż użytkowniczka kliknie "Odśwież" (js/pwa.js).
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith('kambodza-') && name !== CACHE && name !== RUNTIME_CACHE)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
  // Fonty Google do pamięci od razu (inaczej offline zostałby font zastępczy).
  caches.open(RUNTIME_CACHE).then(async cache => {
    const cssUrl = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..800,0..100;1,9..144,300..800,0..100&display=swap';
    if (await cache.match(cssUrl)) return;
    const res = await fetch(cssUrl, { mode: 'cors' });
    if (!res.ok) return;
    await cache.put(cssUrl, res.clone());
    const fonts = ((await res.text()).match(/https:\/\/fonts\.gstatic\.com\/[^)'"]+/g) || []);
    for (const f of new Set(fonts)) { try { const r = await fetch(f, { mode: 'cors' }); if (r.ok) await cache.put(f, r); } catch (e) {} }
  }).catch(() => {});
  // Zdjęcia kart w tle, po cichu: nie blokują aktywacji.
  caches.open(CACHE).then(async cache => {
    for (const url of PHOTOS) { if (!(await cache.match(url))) await cacheOne(cache, url); }
  }).catch(() => {});
});

function localMatch(request) {
  return caches.match(request, { ignoreSearch: true });
}

function updateLocal(request, cacheName) {
  return fetch(request).then(response => {
    if (response && response.ok) {
      caches.open(cacheName).then(cache => cache.put(request, response.clone())).catch(() => {});
    }
    return response;
  });
}

function networkFirstNavigation(request) {
  return new Promise(resolve => {
    let settled = false;
    const finish = response => {
      if (!settled) {
        settled = true;
        resolve(response);
      }
    };
    const timer = setTimeout(() => {
      localMatch('./index.html').then(response => finish(response || Response.error()));
    }, 3000);
    fetch(request).then(response => {
      clearTimeout(timer);
      if (response && response.ok) {
        caches.open(CACHE).then(cache => cache.put('./index.html', response.clone())).catch(() => {});
      }
      finish(response);
    }).catch(() => {
      clearTimeout(timer);
      localMatch('./index.html').then(response => finish(response || Response.error()));
    });
  });
}

function isFont(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

function isMapLibre(url) {
  return url.hostname === 'unpkg.com' && /maplibre/i.test(url.pathname);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).pathname.includes('/api/')) return;

  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isFont(url) || isMapLibre(url)) {
    event.respondWith(caches.open(RUNTIME_CACHE).then(async cache => {
      const hit = await cache.match(request, { ignoreSearch: true });
      if (hit) return hit;
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.type === 'opaque')) await cache.put(request, response.clone());
        return response;
      } catch (error) {
        return Response.error();
      }
    }));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(localMatch(request).then(hit => {
      const refresh = updateLocal(request, CACHE).catch(() => null);
      return hit || refresh.then(response => response || Response.error());
    }));
    return;
  }

  event.respondWith(fetch(request).catch(() => Response.error()));
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
