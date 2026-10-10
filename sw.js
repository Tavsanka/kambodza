/* The generated list is deliberately kept in this file for a static deployment. */
const VERSION = '1d10846';
const CACHE = 'kambodza-' + VERSION;
const RUNTIME_CACHE = 'kambodza-ext-' + VERSION;

/*PRECACHE-START*/
const PRECACHE = [
  './',
  './index.html',
  './temples.html',
  './manifest.webmanifest',
  './css/diary.css',
  './css/fixes.css',
  './css/guide.css',
  './css/maps.css',
  './css/nav.css',
  './css/places.css',
  './css/style.css',
  './css/temples.css',
  './js/core.js',
  './js/data.js',
  './js/diary.js',
  './js/globe.js',
  './js/guide.js',
  './js/i18n.js',
  './js/journey-data.js',
  './js/land.js',
  './js/maps.js',
  './js/nav.js',
  './js/photodb.js',
  './js/planner.js',
  './js/practical-data.js',
  './js/pwa.js',
  './js/story-extras.js',
  './js/story.js',
  './js/sync.js',
  './js/temple-credits.js',
  './js/temple-photos.js',
  './js/temples-data.js',
  './js/temples.js',
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
  './assets/photos/krs-mpai-1-s.webp',
  './assets/photos/krs-mpai-1.webp',
  './assets/photos/krs-mpai-2-s.webp',
  './assets/photos/krs-mpai-2.webp',
  './assets/photos/krs-mpai-3-s.webp',
  './assets/photos/krs-mpai-3.webp',
  './assets/photos/krs-mpai-4-s.webp',
  './assets/photos/krs-mpai-4.webp',
  './assets/photos/krs-mpai-5-s.webp',
  './assets/photos/krs-mpai-5.webp',
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
  './assets/photos/sihanoukville-5.webp',
  './assets/temples/angkorthom-1-s.webp',
  './assets/temples/angkorthom-1.webp',
  './assets/temples/angkorthom-2-s.webp',
  './assets/temples/angkorthom-2.webp',
  './assets/temples/angkorthom-3-s.webp',
  './assets/temples/angkorthom-3.webp',
  './assets/temples/angkorthom-4-s.webp',
  './assets/temples/angkorthom-4.webp',
  './assets/temples/angkorwat-1-s.webp',
  './assets/temples/angkorwat-1.webp',
  './assets/temples/angkorwat-2-s.webp',
  './assets/temples/angkorwat-2.webp',
  './assets/temples/angkorwat-3-s.webp',
  './assets/temples/angkorwat-3.webp',
  './assets/temples/angkorwat-4-s.webp',
  './assets/temples/angkorwat-4.webp',
  './assets/temples/angkorwat-5-s.webp',
  './assets/temples/angkorwat-5.webp',
  './assets/temples/banteaysrei-1-s.webp',
  './assets/temples/banteaysrei-1.webp',
  './assets/temples/banteaysrei-2-s.webp',
  './assets/temples/banteaysrei-2.webp',
  './assets/temples/banteaysrei-3-s.webp',
  './assets/temples/banteaysrei-3.webp',
  './assets/temples/baphuon-1-s.webp',
  './assets/temples/baphuon-1.webp',
  './assets/temples/baphuon-2-s.webp',
  './assets/temples/baphuon-2.webp',
  './assets/temples/baphuon-3-s.webp',
  './assets/temples/baphuon-3.webp',
  './assets/temples/baphuon-4-s.webp',
  './assets/temples/baphuon-4.webp',
  './assets/temples/bayon-1-s.webp',
  './assets/temples/bayon-1.webp',
  './assets/temples/bayon-2-s.webp',
  './assets/temples/bayon-2.webp',
  './assets/temples/bayon-3-s.webp',
  './assets/temples/bayon-3.webp',
  './assets/temples/bayon-4-s.webp',
  './assets/temples/bayon-4.webp',
  './assets/temples/bengmealea-1-s.webp',
  './assets/temples/bengmealea-1.webp',
  './assets/temples/bengmealea-2-s.webp',
  './assets/temples/bengmealea-2.webp',
  './assets/temples/bengmealea-3-s.webp',
  './assets/temples/bengmealea-3.webp',
  './assets/temples/eastmebon-1-s.webp',
  './assets/temples/eastmebon-1.webp',
  './assets/temples/eastmebon-2-s.webp',
  './assets/temples/eastmebon-2.webp',
  './assets/temples/eastmebon-3-s.webp',
  './assets/temples/eastmebon-3.webp',
  './assets/temples/neakpean-1-s.webp',
  './assets/temples/neakpean-1.webp',
  './assets/temples/neakpean-2-s.webp',
  './assets/temples/neakpean-2.webp',
  './assets/temples/neakpean-3-s.webp',
  './assets/temples/neakpean-3.webp',
  './assets/temples/preahkhan-1-s.webp',
  './assets/temples/preahkhan-1.webp',
  './assets/temples/preahkhan-2-s.webp',
  './assets/temples/preahkhan-2.webp',
  './assets/temples/preahkhan-3-s.webp',
  './assets/temples/preahkhan-3.webp',
  './assets/temples/preahkhan-4-s.webp',
  './assets/temples/preahkhan-4.webp',
  './assets/temples/prerup-1-s.webp',
  './assets/temples/prerup-1.webp',
  './assets/temples/prerup-2-s.webp',
  './assets/temples/prerup-2.webp',
  './assets/temples/prerup-3-s.webp',
  './assets/temples/prerup-3.webp',
  './assets/temples/prerup-4-s.webp',
  './assets/temples/prerup-4.webp',
  './assets/temples/ritual-1-s.webp',
  './assets/temples/ritual-1.webp',
  './assets/temples/ritual-2-s.webp',
  './assets/temples/ritual-2.webp',
  './assets/temples/ritual-3-s.webp',
  './assets/temples/ritual-3.webp',
  './assets/temples/ritual-4-s.webp',
  './assets/temples/ritual-4.webp',
  './assets/temples/ritual-5-s.webp',
  './assets/temples/ritual-5.webp',
  './assets/temples/ritual-6-s.webp',
  './assets/temples/ritual-6.webp',
  './assets/temples/taprohm-1-s.webp',
  './assets/temples/taprohm-1.webp',
  './assets/temples/taprohm-2-s.webp',
  './assets/temples/taprohm-2.webp',
  './assets/temples/taprohm-3-s.webp',
  './assets/temples/taprohm-3.webp',
  './assets/temples/taprohm-4-s.webp',
  './assets/temples/taprohm-4.webp',
  './assets/temples/tasom-1-s.webp',
  './assets/temples/tasom-1.webp',
  './assets/temples/tasom-2-s.webp',
  './assets/temples/tasom-2.webp',
  './assets/temples/tasom-3-s.webp',
  './assets/temples/tasom-3.webp',
  './assets/temples/tasom-4-s.webp',
  './assets/temples/tasom-4.webp'
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
    await self.skipWaiting();
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

function cacheKey(request) {
  const url = new URL(request.url);
  url.search = '';
  return url.toString();
}

function updateLocal(request, cacheName) {
  return fetch(request).then(response => {
    if (response && response.ok) {
      caches.open(cacheName).then(cache => cache.put(cacheKey(request), response.clone())).catch(() => {});
    }
    return response;
  });
}

// Offline: najpierw dokładnie ta strona (np. temples.html), dopiero potem strona główna.
function navigationFallback(request) {
  return localMatch(request)
    .then(hit => hit || localMatch('./index.html'))
    .then(response => response || Response.error());
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
      navigationFallback(request).then(finish);
    }, 4000);
    fetch(request).then(response => {
      clearTimeout(timer);
      // Zapis pod adresem żądania, nie pod './index.html' (podstrona nie może podmienić strony głównej).
      if (response && response.ok && !response.redirected) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(cacheKey(request), copy)).catch(() => {});
      }
      finish(response);
    }).catch(() => {
      clearTimeout(timer);
      navigationFallback(request).then(finish);
    });
  });
}

function networkFirstLocal(request) {
  return new Promise(resolve => {
    let settled = false;
    const finish = response => {
      if (!settled) {
        settled = true;
        resolve(response);
      }
    };
    const timer = setTimeout(() => {
      localMatch(request).then(response => finish(response || Response.error()));
    }, 4000);
    fetch(request).then(response => {
      clearTimeout(timer);
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(cacheKey(request), copy)).catch(() => {});
      }
      finish(response);
    }).catch(() => {
      clearTimeout(timer);
      localMatch(request).then(response => finish(response || Response.error()));
    });
  });
}

function isFont(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

function isMapLibre(url) {
  return url.hostname === 'unpkg.com' && /maplibre/i.test(url.pathname);
}

function isNetworkFirstLocal(url) {
  return /\.(?:js|css|html)$/.test(url.pathname) || url.pathname.endsWith('/manifest.webmanifest');
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
    if (isNetworkFirstLocal(url)) {
      event.respondWith(networkFirstLocal(request));
      return;
    }
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
