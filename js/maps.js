/* Satelitarny globus okładki i płaska mapa planera. Bez bundlera. */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TXT = {
    pl: { fly: 'Leć', pause: 'Pauza', skip: 'Pomiń', map: 'Mapa', satellite: 'Satelita', layer: 'Warstwa mapy', frame: 'Kadr mapy', offline: 'Mapa wymaga internetu. Lista przystanków nadal działa.', stops: 'Przystanki', cambodia: 'Kambodża', whole: 'Cała trasa', domRoute: 'Dominika · z Wiednia', oksRoute: 'Oksana · z Brukseli', routes: 'Trasy podróżniczek' },
    en: { fly: 'Fly', pause: 'Pause', skip: 'Skip', map: 'Map', satellite: 'Satellite', layer: 'Map layer', frame: 'Map view', offline: 'The map needs an internet connection. The stop list still works.', stops: 'Stops', cambodia: 'Cambodia', whole: 'Whole route', domRoute: 'Dominika · from Vienna', oksRoute: 'Oksana · from Brussels', routes: 'Travellers’ routes' }
  };
  const FALLBACK = { brussels: { name: { pl: 'Bruksela', en: 'Brussels' }, lat: 50.8503, lng: 4.3517 } };
  const SPECIAL = {
    angkor: { name: { pl: 'Angkor Wat', en: 'Angkor Wat' }, lat: 13.4125, lng: 103.8670, zoom: 15.2, date: '2–5.11' },
    saracen: { name: { pl: 'Koh Rong Samloem', en: 'Koh Rong Samloem' }, lat: 10.598, lng: 103.300, zoom: 14.3, date: '6–9.11' },
    greatwall: { name: { pl: 'Mur w Mutianyu', en: 'Mutianyu Great Wall' }, lat: 40.4335, lng: 116.5635, zoom: 16.2, date: '11.11' },
    palace: { name: { pl: 'Pałac Królewski', en: 'Royal Palace' }, lat: 11.5637, lng: 104.9310, zoom: 15.3 },
    port: { name: { pl: 'Port w Sihanoukville', en: 'Sihanoukville port' }, lat: 10.6360, lng: 103.5040, zoom: 13 },
    forbidden: { name: { pl: 'Zakazane Miasto', en: 'Forbidden City' }, lat: 39.9163, lng: 116.3972, zoom: 14.5 }
  };
  const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const LABELS = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
  const ESRI_CREDIT = 'Tiles © Esri · Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community';
  const OFM_CREDIT = 'OpenFreeMap © OpenMapTiles Data from OpenStreetMap';
  const MAP_IDS = ['vienna', 'brussels', 'beijing', 'greatwall', 'phnompenh', 'siemreap', 'sihanoukville', 'kohrong', 'kohrongsamloem'];
  const COVER_STOPS = [
    { id: 'forbidden', date: '1.11' },
    { id: 'palace', date: '1–2.11' },
    { id: 'angkor', date: '2–5.11' },
    { id: 'port', date: '6.11 · 9.11' },
    { id: 'saracen', date: '6–9.11' },
    { id: 'palace', date: '9–11.11' },
    { id: 'forbidden', date: '11.11' },
    { id: 'greatwall', date: '11.11' },
    { id: 'vienna', zoom: 9.5, date: '12.11' }
  ];
  let heroMap = null, plannerMap = null, heroVisible = true, playing = false, step = 0, timer = 0, routeFrame = 0, currentLabelStop = null;
  let plannerMode = 'map', markers = [];

  function lang() { return window.K && K.lang === 'en' ? 'en' : 'pl'; }
  function tx(v) { const s = v ? (typeof v === 'string' ? v : (v[lang()] || v.pl || '')) : ''; return window.K && K.clean ? K.clean(s) : s; }
  function place(id) {
    if (SPECIAL[id]) return SPECIAL[id];
    return (typeof TRIP !== 'undefined' && TRIP.places && TRIP.places[id]) || FALLBACK[id];
  }
  function point(id) { const p = place(id); return [p.lng, p.lat]; }
  function name(id) { return tx(place(id).name); }
  function glOK() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
  function lighten(hex, amount) {
    const n = parseInt(hex.slice(1), 16); const f = c => Math.min(255, ((n >> c) & 255) + amount).toString(16).padStart(2, '0');
    return '#' + f(16) + f(8) + f(0);
  }
  function greatCircle(a, b, count) {
    const rad = Math.PI / 180, deg = 180 / Math.PI;
    const vec = p => [Math.cos(p[1] * rad) * Math.cos(p[0] * rad), Math.cos(p[1] * rad) * Math.sin(p[0] * rad), Math.sin(p[1] * rad)];
    const A = vec(a), B = vec(b); const dot = Math.max(-1, Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
    const omega = Math.acos(dot), sin = Math.sin(omega); const out = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count, x = sin < 1e-8 ? 1 - t : Math.sin((1 - t) * omega) / sin, y = sin < 1e-8 ? t : Math.sin(t * omega) / sin;
      const v = [x * A[0] + y * B[0], x * A[1] + y * B[1], x * A[2] + y * B[2]];
      out.push([Math.atan2(v[1], v[0]) * deg, Math.atan2(v[2], Math.hypot(v[0], v[1])) * deg]);
    }
    return out;
  }
  function joined(ids) {
    let out = [];
    for (let i = 1; i < ids.length; i++) out = out.concat(greatCircle(point(ids[i - 1]), point(ids[i]), 64).slice(i > 1 ? 1 : 0));
    return out;
  }
  function feature(coords) { return { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } }; }
  function satelliteStyle(labels) {
    const sources = { esri: { type: 'raster', tiles: [ESRI], tileSize: 256, maxzoom: 19, attribution: ESRI_CREDIT } };
    const layers = [{ id: 'satellite', type: 'raster', source: 'esri' }];
    if (labels) { sources.labels = { type: 'raster', tiles: [LABELS], tileSize: 256, maxzoom: 19 }; layers.push({ id: 'labels', type: 'raster', source: 'labels', paint: { 'raster-opacity': .92 } }); }
    return { version: 8, sources, layers, glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf' };
  }
  function addRouteLayers(map, animated) {
    const JL = window.JOURNEY_LEGS;
    const dom = JL ? JL['VIE-PEK'].coords.concat(JL['PEK-KTI'].coords.slice(1)) : joined(['vienna', 'beijing', 'phnompenh']);
    const oks = JL ? JL['BRU-PEK'].coords.concat(JL['PEK-KTI'].coords.slice(1)) : joined(['brussels', 'beijing', 'phnompenh']);
    const defs = [
      ['dom', dom, lighten((TRIP.travelers.find(x => x.id === 'dominika') || {}).color || '#1f6b4f', 70)],
      ['oks', oks, lighten((TRIP.travelers.find(x => x.id === 'oksana') || {}).color || '#c2621d', 55)]
    ];
    defs.forEach(([id, coords, color]) => {
      map.addSource('route-' + id + '-overview', { type: 'geojson', data: feature(coords) });
      map.addLayer({ id: 'route-' + id + '-overview', type: 'line', source: 'route-' + id + '-overview', paint: { 'line-color': color, 'line-width': 2.2, 'line-opacity': animated ? .48 : 0 } });
      map.addSource('route-' + id, { type: 'geojson', data: feature(animated ? coords.slice(0, 1) : coords) });
      map.addLayer({ id: 'route-' + id + '-halo', type: 'line', source: 'route-' + id, paint: { 'line-color': 'rgba(0,0,0,.55)', 'line-width': 7.5, 'line-opacity': 1 } });
      map.addLayer({ id: 'route-' + id, type: 'line', source: 'route-' + id, paint: { 'line-color': color, 'line-width': 3.7, 'line-opacity': 1 } });
    });
    return { dom, oks };
  }
  function addCoverMarkers() {
    [['vienna', 'VIE'], ['brussels', 'BRU'], ['beijing', 'PEK'], ['phnompenh', 'KTI']].forEach(([id, code]) => {
      const el = document.createElement('span'); el.className = 'cover-airport-marker'; el.textContent = code; el.setAttribute('aria-label', name(id));
      const coords = id === 'phnompenh' ? [104.92, 11.36] : point(id);
      new maplibregl.Marker({ element: el, anchor: 'center', opacityWhenCovered: '0' }).setLngLat(coords).addTo(heroMap);
    });
  }
  function animateRoutes(routes) {
    if (reduce || !heroMap) return;
    cancelAnimationFrame(routeFrame); const started = performance.now(), duration = 7000;
    function draw(now) {
      if (!heroMap || !playing || !heroVisible) return;
      const p = Math.min(1, (now - started) / duration);
      Object.keys(routes).forEach(id => { const src = heroMap.getSource('route-' + id); const a = routes[id]; if (src) src.setData(feature(a.slice(0, Math.max(2, Math.ceil(a.length * p))))); });
      if (p < 1) routeFrame = requestAnimationFrame(draw);
    }
    routeFrame = requestAnimationFrame(draw);
  }
  function showLabel(stop) {
    currentLabelStop = stop;
    currentHudStep = null;
    const PARENT = { forbidden: 'beijing', palace: 'phnompenh', port: 'sihanoukville', saracen: 'kohrongsamloem', angkor: 'siemreap', greatwall: 'greatwall' };
    const pid = PARENT[stop.id] || stop.id; const p = (typeof TRIP !== 'undefined' && TRIP.places && TRIP.places[pid]) || place(stop.id);
    renderFlightCard({ type: 'stop', date: stop.date || '', title: place(stop.id).name, short: p && p.lede }, '');
    const chips = { forbidden: 'beijing', palace: 'phnompenh', port: 'sihanoukville', saracen: 'saracen', angkor: 'angkor', greatwall: 'greatwall', vienna: 'vienna' };
    $$('#cover-stops button').forEach(b => b.setAttribute('aria-current', String(b.dataset.stop === (chips[stop.id] || stop.id))));
  }
  function fly(stop, automatic) {
    if (!heroMap) return; showLabel(stop);
    const bearings = { forbidden: -12, palace: 9, angkor: 24, port: -18, saracen: 14, greatwall: 31, vienna: -8 };
    document.getElementById('cover').classList.toggle('is-close', (stop.zoom || place(stop.id).zoom || 10) > 8);
    heroMap.flyTo({ center: point(stop.id), zoom: stop.zoom || place(stop.id).zoom || 10, pitch: stop.id === 'vienna' ? 38 : 50, bearing: bearings[stop.id] || 0, duration: reduce ? 0 : (automatic ? 4000 : 2200), curve: 1.6, essential: true });
  }
  /* ================= PODRÓŻ NA GLOBUSIE: samolot/autobus/prom po trasie, państwa pod trasą, pocztówka na przystanku */
  const AP = { VIE: [16.5697, 48.1103], BRU: [4.4844, 50.9010], PEK: [116.5846, 40.0801], KTI: [104.925, 11.360] };
  const G = { PP: [104.9282, 11.5564], KT: [104.888, 12.711], SR: [103.8564, 13.3633], KS: [104.52, 11.45], SHV: [103.5296, 10.6093], PIER: [103.513, 10.612], KRS: [103.300, 10.598] };
  const L2 = (pl, en) => ({ pl, en });
  const JOURNEY = [
    { id: 'fly-eu-pek', chip: ['vienna', 'brussels'], type: 'fly', legs: ['VIE-PEK', 'BRU-PEK'], who: ['dom', 'oks'], date: '31.10', routes: [{ who: 'dom', from: 'VIE', to: 'PEK', no: 'CA844', dep: '18:20', arr: '10:40' }, { who: 'oks', from: 'BRU', to: 'PEK', no: 'CA964', dep: '12:00', arr: '04:45' }], title: L2('Wiedeń i Bruksela → Pekin', 'Vienna & Brussels → Beijing'), dur: 16000 },
    { id: 'land-pek', chip: 'beijing', type: 'land', at: AP.PEK, zoom: 12.6, place: 'beijing', photo: 'assets/photos/beijing-1.webp', date: '1.11', title: L2('Pekin', 'Beijing'), short: L2('Pierwszy oddech Pekinu: hutongi, Wieża Bębna i ciepła herbata.', 'A first breath of Beijing: hutongs, the Drum Tower and hot tea.') },
    { id: 'fly-pek-kti', type: 'fly', legs: ['PEK-KTI'], who: ['both'], date: '1.11', routes: [{ who: 'both', from: 'PEK', to: 'KTI', no: 'CA745' }], title: L2('Razem: Pekin → Phnom Penh', 'Together: Beijing → Phnom Penh'), dur: 10000 },
    { id: 'land-pp', chip: 'phnompenh', type: 'land', at: AP.KTI, zoom: 12.6, place: 'phnompenh', photo: 'assets/photos/phnompenh-1.webp', date: '1–2.11', title: L2('Phnom Penh', 'Phnom Penh'), short: L2('Phnom Penh: rzeka Mekong, Pałac Królewski i pierwsza noc w Kambodży.', 'Phnom Penh: the Mekong, the Royal Palace and our first night in Cambodia.') },
    { id: 'bus-pp-sr', type: 'ground', mode: 'bus', path: [G.PP, G.KT, G.SR], date: '2.11', title: L2('Phnom Penh → Siem Reap', 'Phnom Penh → Siem Reap'), zoom: 7.2, dur: 5500 },
    { id: 'land-sr', chip: 'angkor', type: 'land', at: G.SR, zoom: 11.6, place: 'siemreap', photo: 'assets/photos/siemreap-1.webp', date: '2–5.11', title: L2('Siem Reap i Angkor', 'Siem Reap & Angkor'), short: L2('Siem Reap: świt nad Angkor Wat i korzenie Ta Prohm.', 'Siem Reap: sunrise over Angkor Wat and the roots of Ta Prohm.') },
    { id: 'bus-sr-shv', chip: 'sihanoukville', type: 'ground', mode: 'bus', path: [G.SR, G.KT, G.PP, G.KS, G.SHV], date: '5/6.11', title: L2('Siem Reap → Sihanoukville', 'Siem Reap → Sihanoukville'), zoom: 6.6, dur: 6500 },
    { id: 'boat-shv-krs', type: 'ground', mode: 'boat', path: [G.PIER, G.KRS], date: '6.11', title: L2('Sihanoukville → Koh Rong Samloem', 'Sihanoukville → Koh Rong Samloem'), zoom: 10.2, dur: 3800 },
    { id: 'land-krs', chip: 'saracen', type: 'land', at: G.KRS, zoom: 13.4, place: 'kohrongsamloem', photo: 'assets/photos/kohrongsamloem-1.webp', date: '6–9.11', title: L2('Koh Rong Samloem', 'Koh Rong Samloem'), short: L2("Koh Rong Samloem: zatoka M'Pai Bay, pomost i trzy noce nad morzem.", "Koh Rong Samloem: M'Pai Bay, the jetty and three nights by the sea.") },
    { id: 'bus-krs-pp', type: 'ground', mode: 'bus', path: [G.KRS, G.PIER, G.KS, G.PP], date: '9.11', title: L2('Wyspa → Phnom Penh', 'Island → Phnom Penh'), zoom: 7, dur: 5000 },
    { id: 'fly-kti-pek', type: 'fly', legs: ['KTI-PEK'], who: ['both'], date: '11.11', routes: [{ who: 'both', from: 'KTI', to: 'PEK', no: 'CA746', dep: '00:25', arr: '06:15' }], title: L2('Razem: Phnom Penh → Pekin', 'Together: Phnom Penh → Beijing'), dur: 10000 },
    { id: 'land-wall', chip: 'greatwall', type: 'land', at: AP.PEK, zoom: 12.6, place: 'greatwall', photo: 'assets/photos/greatwall-1.webp', date: '11.11', title: L2('Mur w Mutianyu', 'Mutianyu Great Wall'), short: L2('Dzień na Murze w Mutianyu, zanim polecimy do domu.', 'A day on the Wall at Mutianyu before flying home.') },
    { id: 'fly-home', type: 'fly', legs: ['PEK-VIE', 'PEK-BRU'], who: ['dom', 'oks'], date: '12.11', routes: [{ who: 'dom', from: 'PEK', to: 'VIE', no: 'CA841', dep: '03:00' }, { who: 'oks', from: 'PEK', to: 'BRU', no: 'CA963', dep: '02:30', arr: '06:40' }], title: L2('Powrót do domu', 'Homeward'), dur: 15000 },
    { id: 'end', type: 'end', date: '12.11', title: L2('Koniec podróży', "Journey's end") }
  ];
  const ICON = {
    plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',
    bus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16c0 .9.4 1.7 1 2.2V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.8c.6-.5 1-1.3 1-2.2V6c0-3.5-3.6-4-8-4S4 2.5 4 6zm3.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M18 11H6V6h12z"/></svg>',
    boat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21c-1.4 0-2.8-.5-4-1.3a7 7 0 0 1-8 0C6.8 20.5 5.4 21 4 21H2v2h2c1.4 0 2.7-.3 4-1a8.7 8.7 0 0 0 8 0c1.3.7 2.6 1 4 1h2v-2zM3.9 19H4c1.6 0 3-.9 4-2 1 1.1 2.4 2 4 2s3-.9 4-2c1 1.1 2.4 2 4 2h.1l1.9-6.7a1 1 0 0 0-.7-1.2L20 10.6V6a2 2 0 0 0-2-2h-3V1H9v3H6a2 2 0 0 0-2 2v4.6l-1.3.4a1 1 0 0 0-.6 1.3zM6 6h12v4l-6-2-6 2z"/></svg>'
  };
  let jIdx = 0, jToken = 0, jFrame = 0, vehicles = [], lastCountry = '', lastCountryData = null, currentHudStep = null, jDone = false, landMarker = null, selectedChip = '';
  const CARD_TIME = 2600, CARD_RETURN_TIME = 450;
  const jState = { idx: 0, raw: 0, phase: 'gap', playing: false, placeId: null, stepKey: JOURNEY[0].id, cardLeft: CARD_TIME, country: '' };
  window.__journeyState = jState;
  let heroPadding = { top: 0, right: 0, bottom: 0, left: 0 };
  const easeIO = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const isMobile = () => matchMedia('(max-width: 640px)').matches;
  function wait(ms, token) { return new Promise(res => setTimeout(() => res(token === jToken), ms)); }
  function camera(opts, token) {
    return new Promise(res => {
      if (!heroMap || token !== jToken) return res(false);
      const done = () => res(token === jToken);
      heroMap.once('moveend', done);
      heroMap.flyTo(Object.assign({ essential: true, curve: 1.3 }, opts));
      setTimeout(done, (opts.duration || 0) + 700);
    });
  }
  function densify(path, n) {
    const segs = []; let total = 0;
    for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segs.push(d); total += d; }
    const out = [path[0]];
    for (let i = 1; i < path.length; i++) {
      const k = Math.max(2, Math.round(n * segs[i - 1] / total));
      for (let j = 1; j <= k; j++) { const t = j / k; out.push([path[i - 1][0] + (path[i][0] - path[i - 1][0]) * t, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * t]); }
    }
    return out;
  }
  function at(coords, t) {
    const f = t * (coords.length - 1), i = Math.min(coords.length - 2, Math.floor(f)), r = f - i;
    return [coords[i][0] + (coords[i + 1][0] - coords[i][0]) * r, coords[i][1] + (coords[i + 1][1] - coords[i][1]) * r];
  }
  function legColor(who) { return who === 'oks' ? '#f0995c' : who === 'both' ? '#f3e6c4' : '#65b99b'; }
  function clearVehicles() { vehicles.forEach(v => v.remove()); vehicles = []; }
  function makeVehicle(kind, who) {
    const el = document.createElement('div'); el.className = 'jr-vehicle jr-vehicle--' + kind; el.style.setProperty('--c', legColor(who)); el.innerHTML = ICON[kind] + '<span class="jr-tag"></span>';
    const m = new maplibregl.Marker({ element: el, anchor: 'center', rotationAlignment: 'viewport' }).setLngLat([0, 0]).addTo(heroMap);
    vehicles.push(m); return m;
  }
  function ensureTrail() {
    if (!heroMap || heroMap.getSource('jr-trail')) return;
    const ground = { type: 'FeatureCollection', features: JOURNEY.filter(s => s.type === 'ground').map(s => feature(densify(s.path, 40))) };
    heroMap.addSource('jr-ground', { type: 'geojson', data: ground });
    heroMap.addLayer({ id: 'jr-ground-halo', type: 'line', source: 'jr-ground', paint: { 'line-color': 'rgba(0,0,0,.55)', 'line-width': 6 } });
    heroMap.addLayer({ id: 'jr-ground', type: 'line', source: 'jr-ground', paint: { 'line-color': '#f3e6c4', 'line-width': 2.6, 'line-dasharray': [2, 1.5] } });
    heroMap.addSource('jr-trail', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    heroMap.addLayer({ id: 'jr-trail', type: 'line', source: 'jr-trail', layout: { 'line-cap': 'round' }, paint: { 'line-color': '#fffaf0', 'line-width': 3.2, 'line-opacity': .95 } });
  }
  function setTrail(lines) { const s = heroMap && heroMap.getSource('jr-trail'); if (s) s.setData({ type: 'FeatureCollection', features: lines.map(feature) }); }
  function esc(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function renderFlightCard(step, lede) {
    const box = $('#cover-flight'); if (!box) return;
    const label = k => ({ pl: { arrival: 'Przylot', end: 'Koniec' }, en: { arrival: 'Arrival', end: 'End' } })[lang()][k];
    const kind = step.type === 'land' ? 'land' : step.type === 'ground' ? 'ground' : step.type;
    box.dataset.kind = kind;
    if (kind === 'fly') {
      const routes = step.routes || [];
      const codes = routes.map(r => '<div class="cf-code cf-code--' + r.who + '"><span class="cf-route-dot" aria-hidden="true"></span><strong>' + esc(r.from) + ' <span>→</span> ' + esc(r.to) + '</strong><time>' + esc(step.date || '') + '</time></div>').join('');
      box.innerHTML = '<div class="cf-codes">' + codes + '</div><div class="cf-flight-meta"><div class="cf-progress"><i></i><b>' + ICON.plane + '</b></div><div class="cf-country" aria-live="polite" aria-atomic="true">' + esc(lede || '') + '</div></div>';
    } else if (kind === 'ground') {
      box.innerHTML = '<div class="cf-row"><span class="cf-mode">' + ICON[step.mode] + '</span><h2>' + esc(tx(step.title)) + '</h2><time>' + esc(step.date || '') + '</time></div>';
    } else {
      box.innerHTML = '<div class="cf-heading"><small class="cf-kicker">' + label(kind === 'land' ? 'arrival' : 'end') + ' · ' + esc(step.date || '') + '</small><h2>' + esc(tx(step.title)) + '</h2></div><p class="cf-copy">' + esc(tx(step.short) || lede || '') + '</p>';
    }
  }
  function hud(step, lede) {
    currentLabelStop = null;
    currentHudStep = step;
    renderFlightCard(step, lede);
    requestAnimationFrame(updateHeroPadding);
  }
  function below(name) { return (lang() === 'pl' ? 'Pod nami: ' : 'Below us: ') + name; }
  function photoFor(step) {
    const p = (typeof TRIP !== 'undefined' && TRIP.places && TRIP.places[step.place]) || {};
    const ph = (p.photos || []).find(x => x.src === step.photo) || {};
    return { src: step.photo, cap: tx(ph.cap) || tx(p.name) };
  }
  function postcard(step) {
    const pc = $('#cover-postcard'); if (!pc) return;
    if (!step) { pc.classList.remove('is-on', 'is-returning'); $('#cover-postcard-thread').classList.remove('is-on'); requestAnimationFrame(updateHeroPadding); return; }
    const ph = photoFor(step); const img = $('img', pc);
    if (img.getAttribute('src') !== ph.src) img.src = ph.src;
    img.alt = tx(step.title); $('figcaption strong', pc).textContent = tx(step.title); $('figcaption span', pc).textContent = tx(step.short) || ph.cap;
    pc.style.transition = 'none';
    pc.classList.remove('is-on', 'is-returning');
    positionPostcard(step);
    void pc.offsetWidth;
    pc.style.transition = '';
    requestAnimationFrame(() => requestAnimationFrame(() => pc.classList.add('is-on')));
    requestAnimationFrame(updateHeroPadding);
  }
  function positionPostcard(step) {
    if (!heroMap) return; const cover = $('#cover'), pc = $('#cover-postcard'), thread = $('#cover-postcard-thread');
    const cb = cover.getBoundingClientRect(), mb = $('#cover-map').getBoundingClientRect(), p = heroMap.project(step.at);
    const pin = { x: mb.left - cb.left + p.x, y: mb.top - cb.top + p.y };
    const margin = 12, gap = 28, angle = Math.PI / 60, img = $('img', pc), mobile = isMobile();
    const desiredWidth = mobile ? Math.min(cb.width * .76, 306) : Math.min(448, cb.width * .38);
    pc.style.minWidth = mobile ? '0' : '';
    pc.style.width = Math.min(desiredWidth, cb.width - margin * 2) + 'px';
    img.style.height = '';
    let w = pc.offsetWidth, h = pc.offsetHeight;
    const flight = $('#cover-flight').getBoundingClientRect(), controls = $('.cover-controls').getBoundingClientRect(), stops = $('#cover-stops').getBoundingClientRect(), mast = $('.cover__mast').getBoundingClientRect();
    const topLimit = Math.max(margin, Math.max(flight.bottom, mast.bottom) - cb.top + 10);
    const bottomLimit = Math.min(cb.height - margin, Math.min(controls.top, stops.top) - cb.top - 10);
    const rotatedHeight = () => w * Math.sin(angle) + h * Math.cos(angle);
    const spaceAbove = Math.max(0, pin.y - gap - topLimit), spaceBelow = Math.max(0, bottomLimit - (pin.y + gap));
    const placeAbove = spaceAbove >= spaceBelow, sideHeight = placeAbove ? spaceAbove : spaceBelow;
    if (rotatedHeight() > sideHeight) {
      img.style.height = Math.max(mobile ? 80 : 90, img.offsetHeight - (rotatedHeight() - sideHeight) / Math.cos(angle)) + 'px';
      w = pc.offsetWidth; h = pc.offsetHeight;
    }
    if (mobile && rotatedHeight() > sideHeight) {
      const minWidth = Math.ceil(cb.width * .58);
      let guard = 0;
      while (w - minWidth >= 1 && rotatedHeight() > sideHeight && guard++ < 80) {
        pc.style.width = Math.floor(Math.max(minWidth, w - 4)) + 'px';
        w = pc.offsetWidth; h = pc.offsetHeight;
      }
    }
    let rotatedWidth = w * Math.cos(angle) + h * Math.sin(angle), rotatedH = rotatedHeight();
    let halfW = rotatedWidth / 2, halfH = rotatedH / 2;
    const vertical = mobile || rotatedH <= sideHeight + .5;
    let cx, cy, direction;
    if (vertical) {
      direction = placeAbove ? 'above' : 'below';
      cx = Math.max(margin + halfW, Math.min(cb.width - margin - halfW, pin.x));
      cy = placeAbove ? pin.y - gap - halfH : pin.y + gap + halfH;
      cy = placeAbove
        ? Math.max(topLimit + halfH, Math.min(pin.y - gap - halfH, cy))
        : Math.max(pin.y + gap + halfH, Math.min(bottomLimit - halfH, cy));
    } else {
      const spaceLeft = pin.x - gap - margin, spaceRight = cb.width - margin - (pin.x + gap);
      direction = spaceLeft >= spaceRight ? 'left' : 'right';
      cx = direction === 'left' ? pin.x - gap - halfW : pin.x + gap + halfW;
      cx = Math.max(margin + halfW, Math.min(cb.width - margin - halfW, cx));
      cy = Math.max(topLimit + halfH, Math.min(bottomLimit - halfH, pin.y));
    }
    const place = () => { pc.style.left = (cx - w / 2) + 'px'; pc.style.top = (cy - h / 2) + 'px'; };
    place();
    const pinEl = $('.cover-land-pin');
    if (pinEl) {
      const oldTransform = pc.style.transform, oldTransition = pc.style.transition;
      pc.style.transition = 'none'; pc.style.transform = 'rotate(-3deg)';
      let cardRect = pc.getBoundingClientRect();
      pc.style.transform = oldTransform; pc.style.transition = oldTransition;
      const rawPinRect = pinEl.getBoundingClientRect();
      const pinRect = { left: rawPinRect.left - 6, right: rawPinRect.right + 6, top: rawPinRect.top - 6, bottom: rawPinRect.bottom + 6 };
      const intersects = () => cardRect.right > pinRect.left && cardRect.left < pinRect.right && cardRect.bottom > pinRect.top && cardRect.top < pinRect.bottom;
      if (intersects()) {
        if (direction === 'above') cy -= cardRect.bottom - pinRect.top;
        else if (direction === 'below') cy += pinRect.bottom - cardRect.top;
        else if (direction === 'left') cx -= cardRect.right - pinRect.left;
        else cx += pinRect.right - cardRect.left;
        place();
      }
    }
    rotatedWidth = w * Math.cos(angle) + h * Math.sin(angle); rotatedH = rotatedHeight();
    halfW = rotatedWidth / 2; halfH = rotatedH / 2;
    cx = Math.max(margin + halfW, Math.min(cb.width - margin - halfW, cx));
    cy = Math.max(margin + halfH, Math.min(cb.height - margin - halfH, cy));
    place();
    pc.style.setProperty('--from-x', (pin.x - cx) + 'px'); pc.style.setProperty('--from-y', (pin.y - cy) + 'px');
    const cos = Math.cos(-angle), sin = Math.sin(-angle);
    const corners = [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]].map(([x, y]) => ({ x: cx + x * cos - y * sin, y: cy + x * sin + y * cos }));
    const corner = corners.reduce((nearest, point) => Math.hypot(pin.x - point.x, pin.y - point.y) < Math.hypot(pin.x - nearest.x, pin.y - nearest.y) ? point : nearest);
    thread.setAttribute('viewBox', '0 0 ' + cb.width + ' ' + cb.height); thread.querySelector('line').setAttribute('x1', pin.x); thread.querySelector('line').setAttribute('y1', pin.y); thread.querySelector('line').setAttribute('x2', corner.x); thread.querySelector('line').setAttribute('y2', corner.y);
    setTimeout(() => thread.classList.add('is-on'), reduce ? 0 : 650);
  }
  function updateHeroPadding() {
    if (!heroMap) return heroPadding;
    const cover = $('#cover'); if (!cover) return heroPadding;
    const box = cover.getBoundingClientRect();
    const next = { top: 8, right: 8, bottom: 8, left: 8 };
    ['.cover__mast', '#cover-flight', '.cover-route-legend', '.cover-controls'].forEach(sel => {
      const el = $(sel, cover); if (!el) return;
      const style = getComputedStyle(el); if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
      const wide = r.width > box.width * .55;
      if (wide) {
        if (r.top + r.height / 2 < box.top + box.height / 2) next.top = Math.max(next.top, r.bottom - box.top + 10);
        else next.bottom = Math.max(next.bottom, box.bottom - r.top + 10);
      } else if (r.left + r.width / 2 < box.left + box.width / 2) next.left = Math.max(next.left, r.right - box.left + 10);
      else next.right = Math.max(next.right, box.right - r.left + 10);
    });
    const maxX = Math.max(8, box.width - 96), maxY = Math.max(8, box.height - 96);
    next.left = Math.min(next.left, maxX - 8); next.right = Math.min(next.right, maxX - 8);
    next.top = Math.min(next.top, maxY - 8); next.bottom = Math.min(next.bottom, maxY - 8);
    if (next.left + next.right > maxX) next.right = Math.max(8, maxX - next.left);
    if (next.top + next.bottom > maxY) next.bottom = Math.max(8, maxY - next.top);
    heroPadding = next;
    heroMap.setPadding(heroPadding);
    return heroPadding;
  }
  function refreshJourneyHud() {
    const s = currentHudStep;
    if (!s) return;
    if (s.type === 'end') return hud(s, lang() === 'pl' ? 'Dwie trasy, jedna podróż. Kliknij „Leć”, żeby obejrzeć jeszcze raz.' : 'Two routes, one journey. Press “Fly” to watch again.');
    if (s.type === 'land') {
      hud(s, tx(s.short));
      if ($('#cover-postcard').classList.contains('is-on')) postcard(s);
      return;
    }
    if (s.type === 'ground') return hud(s, '');
    if (s.type === 'fly') hud(s, lastCountryData ? below(lang() === 'pl' ? lastCountryData.pl : lastCountryData.en) : (lang() === 'pl' ? 'Start…' : 'Take-off…'));
  }
  function syncChip(step) {
    let i = JOURNEY.indexOf(step), chip = '';
    while (i >= 0 && !JOURNEY[i].chip) i--;
    if (i >= 0) {
      const own = JOURNEY[i].chip;
      chip = Array.isArray(own) && own.includes(selectedChip) ? selectedChip : (Array.isArray(own) ? own[0] : own);
      if (!Array.isArray(own) || !own.includes(selectedChip)) selectedChip = chip;
    }
    $$('#cover-stops button').forEach(b => b.setAttribute('aria-current', String(b.dataset.stop === chip)));
    const active = $('#cover-stops button[aria-current="true"]'), rail = $('#cover-stops');
    if (active && rail) rail.scrollTo({ left: Math.max(0, active.offsetLeft - (rail.clientWidth - active.offsetWidth) / 2), behavior: reduce ? 'auto' : 'smooth' });
  }
  function animate(step, token, raw0) {
    return new Promise(res => {
      const legs = step.type === 'fly' ? step.legs.map(k => (window.JOURNEY_LEGS || {})[k]).filter(Boolean) : [{ coords: densify(step.path, 160), countries: [] }];
      if (!legs.length) return res(true);
      clearVehicles();
      const kind = step.type === 'fly' ? 'plane' : step.mode;
      const vs = legs.map((_, i) => makeVehicle(kind, step.who ? step.who[i] : 'both'));
      const mob = isMobile();
      const baseZoom = step.type === 'fly' ? (mob ? 2.55 : 3.35) : (step.zoom - (mob ? .6 : 0));
      const t0 = performance.now() - (raw0 || 0) * step.dur; lastCountry = '';
      function frame(now) {
        if (token !== jToken || !heroMap) { return res(false); }
        const raw = Math.min(1, (now - t0) / step.dur), t = easeIO(raw); jState.raw = raw;
        const pos = legs.map(l => at(l.coords, t));
        const ahead = legs.map(l => at(l.coords, Math.min(1, t + .01)));
        const center = pos.length > 1 ? [(pos[0][0] + pos[1][0]) / 2, (pos[0][1] + pos[1][1]) / 2] : pos[0];
        heroMap.jumpTo({ center, zoom: baseZoom - (step.type === 'fly' ? .55 * Math.sin(Math.PI * raw) : 0), pitch: step.type === 'fly' ? 32 : 40, bearing: 0, padding: heroPadding });
        pos.forEach((p, i) => {
          vs[i].setLngLat(p);
          const a = heroMap.project(p), b = heroMap.project(ahead[i]);
          const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
          vs[i].getElement().style.setProperty('--rot', (kind === 'plane' ? ang + 90 : 0) + 'deg');
          vs[i].getElement().classList.toggle('is-flip', kind !== 'plane' && Math.abs(ang) > 90);
        });
        setTrail(legs.map(l => { const n = Math.max(1, Math.floor(t * (l.coords.length - 1))); return l.coords.slice(0, n + 1).concat([at(l.coords, t)]); }));
        const progress = $('#cover-flight .cf-progress'); if (progress) { progress.style.setProperty('--p', (raw * 100) + '%'); const icon = $('b', progress); if (icon) icon.style.left = (raw * 100) + '%'; }
        if (step.type === 'fly') {
          legs.forEach((l, k) => { const f = t * (l.coords.length - 1); const cc = l.countries.find(c => f >= c.from && f <= c.to); const n2 = cc ? (lang() === 'pl' ? cc.pl : cc.en) : ''; const tg = vs[k].getElement().querySelector('.jr-tag'); if (tg && tg.textContent !== n2) { tg.textContent = n2; tg.classList.remove('is-new'); void tg.offsetWidth; tg.classList.add('is-new'); } });
          const c = legs[0].countries.find(c => { const f = t * (legs[0].coords.length - 1); return f >= c.from && f <= c.to; });
          const nm = c ? (lang() === 'pl' ? c.pl : c.en) : '';
          if (nm && nm !== lastCountry) { lastCountry = nm; lastCountryData = c; jState.country = nm; const stamp = $('#cover-flight .cf-country'); if (stamp) { stamp.classList.remove('is-changing'); void stamp.offsetWidth; stamp.textContent = below(nm); stamp.classList.add('is-changing'); } }
        }
        if (raw < 1) jFrame = requestAnimationFrame(frame); else res(true);
      }
      jFrame = requestAnimationFrame(frame);
    });
  }
  function clearLandPin() { if (landMarker) landMarker.remove(); landMarker = null; }
  function showLandPin(step) { clearLandPin(); const el = document.createElement('span'); el.className = 'cover-land-pin'; landMarker = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(step.at).addTo(heroMap); }
  let cardDeadline = 0;
  async function doStep(step, token) {
    const mob = isMobile();
    jState.idx = jIdx; jState.stepKey = step.id; jState.placeId = step.place || null; jState.playing = playing;
    if (step.type !== 'land') clearLandPin();
    lastCountryData = null; syncChip(step);
    document.getElementById('cover').classList.toggle('is-close', step.type === 'land');
    if (step.type === 'fly' || step.type === 'ground') {
      const first = step.type === 'fly' ? (window.JOURNEY_LEGS[step.legs[0]] || {}).coords : step.path;
      const second = step.type === 'fly' && step.legs[1] ? (window.JOURNEY_LEGS[step.legs[1]] || {}).coords : null;
      const start = second ? [(first[0][0] + second[0][0]) / 2, (first[0][1] + second[0][1]) / 2] : first[0];
      const z = step.type === 'fly' ? (mob ? 2.55 : 3.35) : (step.zoom - (mob ? .6 : 0));
      hud(step, step.type === 'fly' ? (lang() === 'pl' ? 'Start…' : 'Take-off…') : '');
      updateHeroPadding();
      if (jState.phase !== 'anim' || !jState.raw) { jState.phase = 'camera'; jState.raw = 0; if (!await camera({ center: start, zoom: z, pitch: step.type === 'fly' ? 32 : 40, bearing: 0, duration: 1600, padding: heroPadding }, token)) return false; }
      jState.phase = 'anim'; if (!await animate(step, token, jState.raw)) return false;
      jState.raw = 0; jState.phase = 'gap'; clearLandPin();
      return true;
    }
    if (step.type === 'land') {
      hud(step, tx(step.short)); showLandPin(step);
      updateHeroPadding();
      if (jState.phase !== 'card') {
        jState.phase = 'camera';
        const landPadding = mob ? Object.assign({}, heroPadding, { top: Math.max(heroPadding.top, Math.round(innerHeight * .42)), bottom: Math.max(heroPadding.bottom, 70) }) : heroPadding;
        if (!await camera({ center: step.at, zoom: step.zoom - (mob ? .5 : 0), pitch: 48, bearing: 0, duration: 2400, curve: 1.2, padding: landPadding }, token)) return false;
        clearVehicles(); if (!await wait(350, token)) return false; jState.cardLeft = CARD_TIME; postcard(step);
      } else if (!$('#cover-postcard').classList.contains('is-on')) postcard(step); else positionPostcard(step);
      jState.phase = 'card'; cardDeadline = performance.now() + jState.cardLeft;
      if (!await wait(jState.cardLeft, token)) { jState.cardLeft = Math.max(0, cardDeadline - performance.now()); return false; }
      jState.cardLeft = 0; $('#cover-postcard-thread').classList.remove('is-on'); $('#cover-postcard').classList.add('is-returning');
      if (!await wait(reduce ? 180 : CARD_RETURN_TIME, token)) return false; postcard(null); clearLandPin(); jState.phase = 'gap';
      return true;
    }
    if (step.type === 'end') {
      clearVehicles(); setTrail([]); dimRoutes(false);
      hud({ type: 'end', date: '12.11', title: L2('Koniec podróży', 'Journey\'s end') }, lang() === 'pl' ? 'Dwie trasy, jedna podróż. Kliknij „Leć”, żeby obejrzeć jeszcze raz.' : 'Two routes, one journey. Press “Fly” to watch again.');
      await camera({ center: mob ? [72, 22] : [58, 30], zoom: mob ? 0.85 : 1.35, pitch: 0, bearing: 0, duration: 2600 }, token);
      jDone = true; jState.phase = 'gap'; return true;
    }
    return true;
  }
  async function runJourney(token) {
    ensureTrail();
    while (token === jToken && playing && heroVisible) {
      const ok = await doStep(JOURNEY[jIdx], token);
      if (!ok || token !== jToken) return;
      if (JOURNEY[jIdx].type === 'end') { jIdx = 0; setPlaying(false); return; }
      jIdx++; jState.idx = jIdx; jState.raw = 0; jState.phase = 'gap';
    }
  }
  function dimRoutes(on) { if (!heroMap) return; ['dom', 'oks'].forEach(id => { try { heroMap.setPaintProperty('route-' + id, 'line-opacity', on ? .38 : 1); heroMap.setPaintProperty('route-' + id + '-halo', 'line-opacity', on ? .25 : 1); } catch (e) {} }); }
  function startJourney() { dimRoutes(true); const token = ++jToken; cancelAnimationFrame(jFrame); runJourney(token); }
  function stopJourney() { if (jState.phase === 'card' && cardDeadline) jState.cardLeft = Math.max(0, cardDeadline - performance.now()); jToken++; cancelAnimationFrame(jFrame); if (heroMap) heroMap.stop(); clearVehicles(); }
  function scheduleNext() { if (playing && heroVisible && !reduce) startJourney(); }
  function setPlaying(on) {
    playing = !!on && !reduce; jState.playing = playing; const b = $('#flight-toggle');
    if (b) { b.textContent = TXT[lang()][playing ? 'pause' : 'fly']; b.setAttribute('aria-pressed', String(playing)); }
    clearTimeout(timer);
    if (playing && heroVisible) { if (jDone) { jDone = false; jIdx = 0; jState.idx = 0; jState.raw = 0; jState.phase = 'gap'; } $('#cover').classList.add('is-flight-started'); startJourney(); }
    else stopJourney();
  }
  function buildHeroChips() {
    const ids = ['vienna', 'brussels', 'beijing', 'phnompenh', 'angkor', 'sihanoukville', 'saracen', 'greatwall'];
    $('#cover-stops').innerHTML = ids.map(id => '<button type="button" data-stop="' + id + '">' + name(id) + '</button>').join('');
    $$('#cover-stops button').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.stop, found = JOURNEY.findIndex(s => s.chip === id || (Array.isArray(s.chip) && s.chip.includes(id)));
      if (found < 0) return; stopJourney(); clearLandPin(); postcard(null); jIdx = found; jDone = false;
      selectedChip = id;
      Object.assign(jState, { idx: found, raw: 0, phase: 'gap', cardLeft: CARD_TIME, country: '', placeId: JOURNEY[found].place || null, stepKey: JOURNEY[found].id });
      $('#cover').classList.add('is-flight-started'); ensureTrail(); dimRoutes(true); setPlaying(true);
    }));
  }
  function heroFallback(reason) {
    $('#cover-map-fallback').hidden = false; $('#cover-map').hidden = true; $('#cover-flight').hidden = true; const ft = $('#flight-toggle'); if (ft) ft.hidden = true;
    console.info('MapLibre hero unavailable:', reason || 'WebGL/CDN');
  }
  function initHero() {
    if (!navigator.onLine) return heroFallback('offline');
    if (!window.maplibregl || !glOK()) return heroFallback('WebGL is unavailable');
    try {
      const mobile = matchMedia('(max-width: 520px)').matches;
      heroMap = new maplibregl.Map({ container: 'cover-map', style: satelliteStyle(true), center: mobile ? [72, 22] : [58, 30], zoom: mobile ? 0.85 : 1.35, pitch: 0, bearing: 0, cooperativeGestures: true, attributionControl: false, renderWorldCopies: false });
      heroMap.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
      heroMap.on('load', () => {
        heroMap.setMaxPitch(60);
        updateHeroPadding();
        try { heroMap.setProjection({ type: 'globe' }); heroMap.setSky({ 'sky-color': '#07100f', 'horizon-color': '#5e827c', 'fog-color': '#152d2b', 'sky-horizon-blend': .35 }); } catch (e) { console.info('Globe atmosphere unavailable:', e.message); }
        const at_ = $('#cover-map .maplibregl-ctrl-attrib'); if (at_) at_.classList.remove('maplibregl-compact-show');
        addRouteLayers(heroMap, false); addCoverMarkers(); ensureTrail(); showLabel({ id: 'vienna', date: '31.10' });
        if (!reduce) { timer = setTimeout(() => { if (heroVisible) setPlaying(true); }, 2500); } else setPlaying(false);
      });
      heroMap.on('error', e => { if (!heroMap.loaded() && e && e.error) console.info('Hero map resource:', e.error.message); });
    } catch (e) { heroFallback(e.message); }
  }
  function routeDataForPlanner(map) { addRouteLayers(map, false); }
  function markerCode(id) { return ({ vienna: 'VIE', brussels: 'BRU', beijing: 'PEK', greatwall: 'MUT', phnompenh: 'PNH', siemreap: 'REP', sihanoukville: 'KOS', kohrong: 'KR', kohrongsamloem: 'KRS' })[id] || id.slice(0, 3).toUpperCase(); }
  function addMarkers() {
    markers.forEach(m => m.remove()); markers = [];
    MAP_IDS.forEach(id => {
      if (!place(id)) return; const el = document.createElement('button'); el.type = 'button';
      el.className = 'retro-pin' + (id === 'kohrong' ? ' retro-pin--proposal' : ''); el.title = name(id); el.setAttribute('aria-label', name(id)); el.innerHTML = '<span>' + markerCode(id) + '</span>';
      el.addEventListener('click', () => { if (window.KPlanner && KPlanner.openPlace && TRIP.places[id]) KPlanner.openPlace(id, el); else { const b = $('#days [data-open="' + id + '"]'); if (b) b.click(); } });
      const anchors = { siemreap: 'bottom', phnompenh: 'top', sihanoukville: 'right', kohrongsamloem: 'left', kohrong: 'left' };
      markers.push(new maplibregl.Marker({ element: el, anchor: anchors[id] || 'bottom' }).setLngLat(point(id)).addTo(plannerMap));
    });
  }
  function plannerStyle() { return plannerMode === 'satellite' ? satelliteStyle(false) : 'https://tiles.openfreemap.org/styles/liberty'; }
  function restorePlannerOverlays() { routeDataForPlanner(plannerMap); addMarkers(); }
  function switchPlanner(mode) {
    plannerMode = mode; $$('.map-switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mapStyle === mode)));
    if (!plannerMap) return; plannerMap.setStyle(plannerStyle()); plannerMap.once('style.load', restorePlannerOverlays);
  }
  function initPlanner() {
    if (plannerMap) return;
    if (!navigator.onLine || !window.maplibregl || !glOK()) { $('#globe-offline').hidden = false; return; }
    try {
      plannerMap = new maplibregl.Map({ container: 'globe', style: plannerStyle(), center: [72, 28], zoom: 2.05, cooperativeGestures: true, attributionControl: false });
      plannerMap.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: OFM_CREDIT }), 'bottom-right');
      plannerMap.addControl(new maplibregl.NavigationControl(), 'top-right');
      const frame = document.createElement('div'); frame.className = 'planner-map-frame';
      frame.setAttribute('role', 'group'); frame.setAttribute('aria-label', TXT[lang()].frame);
      frame.innerHTML = '<button type="button" data-map-frame="kh"></button><button type="button" data-map-frame="all"></button>';
      const frameButtons = $$('button', frame); frameButtons[0].textContent = TXT[lang()].cambodia; frameButtons[1].textContent = TXT[lang()].whole;
      frameButtons.forEach(b => b.setAttribute('aria-pressed', 'false')); $('#globe').parentNode.appendChild(frame);
      function setFrame(key) { frameButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mapFrame === key))); }
      function fitWhole() { plannerMap.fitBounds([[4.3517, 10.55], [116.65, 50.9]], { padding: { top: 70, right: 55, bottom: 55, left: 55 }, duration: reduce ? 0 : 1000 }); setFrame('all'); }
      function fitCambodia() { plannerMap.fitBounds([[102.85, 10.35], [105.25, 13.7]], { padding: 55, duration: reduce ? 0 : 1000 }); setFrame('kh'); }
      frame.addEventListener('click', e => { const b = e.target.closest('[data-map-frame]'); if (b) (b.dataset.mapFrame === 'kh' ? fitCambodia : fitWhole)(); });
      plannerMap.on('load', () => { restorePlannerOverlays(); fitWhole(); const at_ = $('#globe .maplibregl-ctrl-attrib'); if (at_) at_.classList.remove('maplibregl-compact-show'); });
      plannerMap.on('dragstart', e => { if (e.originalEvent) setFrame(null); }); plannerMap.on('zoomstart', e => { if (e.originalEvent) setFrame(null); });
      plannerMap.on('error', e => { if (!plannerMap.loaded() && e && e.error) { $('#globe-offline').hidden = false; console.info('Planner map resource:', e.error.message); } });
      $$('.map-switch button').forEach(b => b.addEventListener('click', () => switchPlanner(b.dataset.mapStyle)));
    } catch (e) { $('#globe-offline').hidden = false; console.info('Planner map unavailable:', e.message); }
  }
  function syncLanguage() {
    const t = TXT[lang()]; const tab = $('#tab-globe'); tab.textContent = t.map;
    $('#flight-skip').textContent = t.skip; $('.map-switch').setAttribute('aria-label', t.layer); const frame = $('.planner-map-frame'); if (frame) frame.setAttribute('aria-label', t.frame);
    const buttons = $$('.map-switch button'); if (buttons[0]) buttons[0].textContent = t.map; if (buttons[1]) buttons[1].textContent = t.satellite;
    $('#globe-offline').textContent = t.offline; $('#cover-stops').setAttribute('aria-label', t.stops);
    const legend = $('.cover-route-legend'); if (legend) { legend.setAttribute('aria-label', t.routes); $('.cover-route-legend__item--dom').textContent = t.domRoute; $('.cover-route-legend__item--oks').textContent = t.oksRoute; }
    const frames = $$('.planner-map-frame button'); if (frames[0]) frames[0].textContent = t.cambodia; if (frames[1]) frames[1].textContent = t.whole;
    buildHeroChips(); const fb = $('#flight-toggle'); if (fb) fb.textContent = TXT[lang()][playing ? 'pause' : 'fly'];
    if (currentHudStep) refreshJourneyHud(); else showLabel(currentLabelStop || { id: 'vienna', date: '31.10' });
    markers.forEach((m, i) => { const el = m.getElement(); const id = MAP_IDS[i]; if (el && id) { el.title = name(id); el.setAttribute('aria-label', name(id)); } });
  }
  function resize() { if (plannerMap) plannerMap.resize(); if (heroMap) { heroMap.resize(); updateHeroPadding(); } }
  function update() { if (plannerMap && plannerMap.loaded()) { addMarkers(); } }

  window.KGlobe = { resize, update };
  buildHeroChips(); syncLanguage();
  $('#flight-toggle').addEventListener('click', () => setPlaying(!playing));
  if (window.K && K.onLang) K.onLang(syncLanguage);
  new MutationObserver(() => { if (document.documentElement.lang !== lang()) syncLanguage(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  new IntersectionObserver(es => es.forEach(e => document.body.classList.toggle('on-cover', e.intersectionRatio > .35)), { threshold: [0, .35, .6, 1] }).observe($('#cover'));
  document.body.classList.add('on-cover');
  new IntersectionObserver(entries => { entries.forEach(e => { heroVisible = e.isIntersecting; if (!heroVisible) { clearTimeout(timer); stopJourney(); } else if (playing) scheduleNext(); }); }, { threshold: .12 }).observe($('#cover'));
  initHero();
  const plannerTarget = $('#globe');
  if ('IntersectionObserver' in window) {
    const plannerObserver = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      plannerObserver.disconnect(); initPlanner();
    }, { rootMargin: '600px 0px' });
    plannerObserver.observe(plannerTarget);
  } else initPlanner();
})();

/* Telefon: karta lotu (i przypieta do niej pocztowka) zawsze tuz pod tytulem okladki,
   niezaleznie od szerokosci ekranu i lamania nadtytulu. CSS czyta --flight-top. */
(function () {
  const cover = document.getElementById('cover');
  const title = cover && cover.querySelector('.cover__title');
  if (!cover || !title) return;
  const mq = window.matchMedia('(max-width: 640px)');
  let raf = 0;
  function place() {
    raf = 0;
    if (!mq.matches) { cover.style.removeProperty('--flight-top'); return; }
    const top = Math.round(title.getBoundingClientRect().bottom - cover.getBoundingClientRect().top + 16);
    cover.style.setProperty('--flight-top', top + 'px');
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(place); };
  window.addEventListener('resize', queue);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
  if ('ResizeObserver' in window) new ResizeObserver(queue).observe(title);
  new MutationObserver(queue).observe(cover, { attributes: true, attributeFilter: ['class'] });
  title.addEventListener('transitionend', queue);
  queue();
})();
