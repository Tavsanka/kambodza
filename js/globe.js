/* =====================================================================
   GLOBUS 3D (globe.gl z CDN). Pinezki = kody jak na stemplach, łuki trasy
   w kolejności przelotów/przejazdów, klik = karta miejsca.
   Bez internetu: statyczny tłoczony globus z okładki + lista przystanków.
   ===================================================================== */
(function () {
  'use strict';
  const el = document.getElementById('globe');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P = TRIP.places;

  function fallback() {
    el.classList.add('is-fallback');
    document.getElementById('globe-offline').hidden = false;
    const src = document.querySelector('.emboss__svg');
    el.innerHTML = src ? `<svg viewBox="-112 -112 224 224" style="filter:drop-shadow(2px 3px 2px rgb(0 0 0 / .5))">${src.innerHTML}</svg>` : '';
    window.KGlobe = { resize() {}, update() { const s = document.querySelector('.emboss__svg'); if (s) el.querySelector('svg').innerHTML = s.innerHTML; } };
  }
  if (typeof Globe === 'undefined' || typeof LAND === 'undefined' || /[?&]noglobe\b/.test(location.search)) { fallback(); return; }

  function arcs() {
    const r = K.route(); const out = [];
    for (let i = 1; i < r.length; i++) {
      if (r[i] === r[i - 1]) continue;
      const a = P[r[i - 1]], b = P[r[i]];
      const flight = (r[i - 1] === 'vienna' || r[i] === 'vienna' || (r[i - 1] === 'beijing' && r[i] === 'phnompenh') || (r[i - 1] === 'phnompenh' && r[i] === 'beijing'));
      out.push({ startLat: a.lat, startLng: a.lng, endLat: b.lat, endLng: b.lng, flight, i });
    }
    return out;
  }
  function pins() {
    const seen = new Set();
    return K.route().filter(p => !seen.has(p) && seen.add(p)).map(id => ({ id, lat: P[id].lat, lng: P[id].lng }));
  }
  // Małe przesunięcia etykiet, żeby wyspy i Mur nie nachodziły na siebie
  const NUDGE = { kohrong: [0, -0.3], kohrongsamloem: [-0.35, 0.1], sihanoukville: [0.15, 0.35], greatwall: [0.4, 0], beijing: [-0.2, 0] };

  let g;
  try {
    g = new Globe(el, { animateIn: !reduce })
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true).atmosphereColor('#e8d9b0').atmosphereAltitude(0.16)
      .showGraticules(true)
      .polygonsData(LAND.map(ring => ({ geometry: { type: 'Polygon', coordinates: [ring] } })))
      .polygonCapColor(() => '#2c4a3d').polygonSideColor(() => 'rgba(0,0,0,0)').polygonStrokeColor(() => 'rgba(241,235,223,.18)')
      .polygonAltitude(0.006)
      .arcsData(arcs())
      .arcColor(d => d.flight ? ['#ef7a55', '#f3c3a8'] : ['#f1ebdf', '#ef7a55'])
      .arcStroke(d => d.flight ? 0.45 : 0.7)
      .arcAltitudeAutoScale(d => d.flight ? 0.35 : 0.2)
      .arcDashLength(0.5).arcDashGap(0.12).arcDashInitialGap(d => d.i * 0.35)
      .arcDashAnimateTime(reduce ? 0 : 3200)
      .htmlElementsData(pins())
      .htmlLat(d => d.lat + ((NUDGE[d.id] || [0, 0])[0]))
      .htmlLng(d => d.lng + ((NUDGE[d.id] || [0, 0])[1]))
      .htmlAltitude(0.012)
      .htmlElement(d => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'gpin'; b.tabIndex = -1;
        b.innerHTML = `<b>${K.CODES[d.id]}</b><i></i>`;
        b.title = K.tx(P[d.id].name);
        b.addEventListener('click', ev => { ev.stopPropagation(); window.KPlanner.openPlace(d.id, document.querySelector(`#stops [data-place="${d.id}"]`)); });
        return b;
      });
    const mat = g.globeMaterial();
    if (mat && mat.color) { mat.color.set('#1b3a4a'); if (mat.emissive) mat.emissive.set('#0d1f26'); }
  } catch (e) { console.warn('globe.gl init failed', e); fallback(); return; }

  function resize() {
    const w = el.clientWidth; if (!w) return;
    g.width(w).height(el.clientHeight || w);
  }
  g.pointOfView({ lat: 22, lng: 100, altitude: innerWidth < 700 ? 2.6 : 2.1 });
  const ctr = g.controls && g.controls();
  if (ctr) { ctr.autoRotate = false; ctr.enableZoom = true; ctr.minDistance = 130; ctr.maxDistance = 600; }
  resize();
  addEventListener('resize', resize);

  // Przyciski: kadr Kambodża / cała trasa
  const bar = document.createElement('div'); bar.className = 'globe__bar';
  function barHTML() { return `<button type="button" class="btn" data-pov="kh">${K.lang === 'en' ? 'Cambodia' : 'Kambodża'}</button><button type="button" class="btn" data-pov="all">${K.lang === 'en' ? 'Whole route' : 'Cała trasa'}</button>`; }
  bar.innerHTML = barHTML(); el.parentNode.insertBefore(bar, el.nextSibling);
  el.parentNode.style.position = 'relative';
  bar.addEventListener('click', e => {
    const b = e.target.closest('[data-pov]'); if (!b) return;
    g.pointOfView(b.dataset.pov === 'kh' ? { lat: 11.8, lng: 104, altitude: 0.35 } : { lat: 30, lng: 70, altitude: 2.4 }, reduce ? 0 : 1200);
  });
  // .globe__bar pozycjonujemy względem .globe
  const wrap = document.createElement('div'); wrap.style.position = 'relative';
  el.parentNode.insertBefore(wrap, el); wrap.appendChild(el); wrap.appendChild(bar);

  // Pauza, gdy niewidoczny
  let seen = false;
  new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) { g.resumeAnimation(); if (!seen) { seen = true; g.htmlElementsData([]); g.htmlElementsData(pins()); } }
    else if (seen) g.pauseAnimation();
  })).observe(el);

  window.KGlobe = {
    resize() { requestAnimationFrame(resize); },
    update() { g.arcsData(arcs()); g.htmlElementsData(pins()); bar.innerHTML = barHTML(); },
  };
})();
