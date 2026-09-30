/* =====================================================================
   OPOWIEŚĆ: tłoczony globus na okładce, stemple + paszport (ruch popisowy),
   przełącznik języka, dane w opowieści (daty wysp, bilet nocnego autobusu).
   ===================================================================== */
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* -------------------------------------------- tłoczony globus (SVG, bez sieci) */
  const R = 100, DEG = Math.PI / 180;
  function project(lng, lat, lam0, phi0) {
    const l = (lng - lam0) * DEG, p = lat * DEG, p0 = phi0 * DEG;
    const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    const x = R * Math.cos(p) * Math.sin(l);
    const y = -R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l));
    return [x, y, cosc];
  }
  function pathFor(ring, lam0, phi0) {
    let d = '', pen = false;
    for (const [lng, lat] of ring) {
      const [x, y, c] = project(lng, lat, lam0, phi0);
      if (c < 0) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      pen = true;
    }
    return d;
  }
  function gcPoints(a, b, n) { // łuk wielkiego koła a->b ([lng,lat])
    const toV = ([lng, lat]) => [Math.cos(lat * DEG) * Math.cos(lng * DEG), Math.cos(lat * DEG) * Math.sin(lng * DEG), Math.sin(lat * DEG)];
    const A = toV(a), B = toV(b);
    const w = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2])) || 1e-6;
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, s1 = Math.sin((1 - t) * w) / Math.sin(w), s2 = Math.sin(t * w) / Math.sin(w);
      const v = [s1 * A[0] + s2 * B[0], s1 * A[1] + s2 * B[1], s1 * A[2] + s2 * B[2]];
      out.push([Math.atan2(v[1], v[0]) / DEG, Math.asin(v[2]) / DEG]);
    }
    return out;
  }
  const svg = $('.emboss__svg');
  let lastKey = '';
  function drawGlobe(p) {
    if (!svg || typeof LAND === 'undefined') return;
    // Obrót od Europy (lng 20) nad Azję Pd-Wsch. (lng 108), lekko w dół.
    const lam0 = 18 + p * 90, phi0 = 32 - p * 18;
    const key = lam0.toFixed(1) + phi0.toFixed(1);
    if (key === lastKey) return; lastKey = key;
    let land = '';
    for (const ring of LAND) land += pathFor(ring, lam0, phi0);
    let grat = '';
    for (let lng = -180; lng < 180; lng += 20) { const r = []; for (let lat = -80; lat <= 80; lat += 5) r.push([lng, lat]); grat += pathFor(r, lam0, phi0); }
    for (let lat = -60; lat <= 60; lat += 20) { const r = []; for (let lng = -180; lng <= 180; lng += 5) r.push([lng, lat]); grat += pathFor(r, lam0, phi0); }
    const P = TRIP.places;
    const rt = K.route().filter((x, i, a) => i === 0 || x !== a[i - 1]);
    let route = '';
    for (let i = 1; i < rt.length; i++) route += pathFor(gcPoints([P[rt[i - 1]].lng, P[rt[i - 1]].lat], [P[rt[i]].lng, P[rt[i]].lat], 36), lam0, phi0);
    let pins = '';
    Object.keys(P).forEach(k => { const [x, y, c] = project(P[k].lng, P[k].lat, lam0, phi0); if (c > 0.05) pins += `<circle class="pin" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9"/>`; });
    svg.innerHTML = `<circle class="sea" r="${R}"/><path class="grat" d="${grat}"/><path class="land" d="${land}"/><path class="route" d="${route}"/>${pins}<circle class="ring" r="${R + 5}"/>`;
  }
  const cover = $('#cover');
  function coverP() { const v = parseFloat(getComputedStyle(cover).getPropertyValue('--sc-p')); return Number.isFinite(v) ? v : 0; }
  function loop() { drawGlobe(reduce ? 0.55 : coverP()); requestAnimationFrame(loop); }

  /* -------------------------------------------- stemple i paszport */
  const passport = $('#passport'), slotsEl = $('.passport__slots', passport);
  const stamped = new Set();
  function passportName(k) {
    const names = {
      'vie-out': ['Wiedeń', 'Vienna'], 'pek-out': ['Pekin', 'Beijing'],
      'pnh-in': ['Phnom Penh', 'Phnom Penh'], rep: ['Siem Reap', 'Siem Reap'],
      kos: ['Sihanoukville', 'Sihanoukville'], kr: ['Koh Rong', 'Koh Rong'],
      krs: ['Koh Rong Samloem', 'Koh Rong Samloem'], 'pnh-out': ['Phnom Penh', 'Phnom Penh'],
      mut: ['Mutianyu', 'Mutianyu'], 'vie-in': ['Wiedeń', 'Vienna']
    };
    return (names[k] || [k, k])[K.lang === 'en' ? 1 : 0];
  }
  function passportItem(k) {
    const d = K.stampDefs()[k], city = passportName(k);
    return `<li><button type="button" data-go="${d.target}" data-key="${k}" aria-label="${city}: ${d.code}, ${d.top}">${K.stampSVG(k, true)}<span class="passport__city">${city}</span></button></li>`;
  }
  function buildPassport() {
    slotsEl.innerHTML = K.STAMP_ORDER.filter(k => stamped.has(k)).map(passportItem).join('');
    stamped.forEach(k => { const b = $(`[data-key="${k}"]`, slotsEl); if (b) b.classList.add('is-filled'); });
    passport.classList.toggle('is-empty', stamped.size === 0);
  }
  function buildSlots() {
    $$('.stamp-slot').forEach(s => {
      const k = s.getAttribute('data-stamp');
      s.innerHTML = K.stampSVG(k, false);
      if (stamped.has(k)) s.classList.add('is-stamped', 'is-settled');
    });
  }
  function stamp(slot) {
    const k = slot.getAttribute('data-stamp');
    if (stamped.has(k)) return;
    stamped.add(k);
    slot.classList.add('is-stamped');
    const sec = slot.closest('.ch');
    if (sec && !reduce) { sec.classList.remove('thud'); void sec.offsetWidth; sec.classList.add('thud'); }
    slotsEl.insertAdjacentHTML('beforeend', passportItem(k));
    passport.classList.remove('is-empty');
    const b = $(`[data-key="${k}"]`, slotsEl);
    if (b) {
      b.setAttribute('aria-current', String(!!sec && b.getAttribute('data-go') === sec.id));
      setTimeout(() => b.classList.add('is-filled'), reduce ? 0 : 320);
      // Telefon: pasek przewija się poziomo, więc pokazujemy najnowszy stempel.
      if (slotsEl.scrollWidth > slotsEl.clientWidth) slotsEl.scrollTo({ left: slotsEl.scrollWidth, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  // Stempel uderza, gdy jego miejsce mija środek ekranu (w przypiętym Angkorze: gdy tekst jest widoczny).
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const slot = e.target;
      const cue = slot.closest('[data-sc-cue]');
      if (cue && parseFloat(cue.style.opacity || '0') < 0.85) return; // jeszcze za mgłą
      stamp(slot);
    });
  }, { rootMargin: '-38% 0px -38% 0px' });
  function watchSlots() { $$('.stamp-slot').forEach(s => io.observe(s)); }
  // Angkor: stempel czeka aż tekst wyjdzie z mgły (cue >= 0.85)
  function angkorCheck() {
    const copy = $('.ank__copy'); const slot = $('.stamp-slot', copy);
    if (!slot || stamped.has('rep')) return;
    if (parseFloat(copy.style.opacity || '0') >= 0.85) stamp(slot);
  }
  // Wyspy (rail w bok): stemple wbijają się, gdy karta jest w poziomie widoczna
  function railCheck() {
    $$('#ch-isl .card .stamp-slot').forEach(s => {
      const k = s.getAttribute('data-stamp'); if (stamped.has(k)) return;
      const r = s.getBoundingClientRect();
      if (r.left > 0 && r.right < innerWidth * 0.9 && r.top > 0 && r.bottom < innerHeight) stamp(s);
    });
  }

  // Który rozdział jest bieżący (aria-current w paszporcie) + chowanie paszportu w planerze
  const chapters = ['ch-vie', 'ch-pek', 'ch-pnh', 'ch-ank', 'ch-isl', 'ch-pp2', 'ch-wall', 'ch-end'];
  const planner = $('#planner'), corner = $('.corner');
  function track() {
    const mid = innerHeight * 0.5; let cur = null;
    chapters.forEach(id => { const r = document.getElementById(id).getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) cur = id; });
    $$('button', slotsEl).forEach(b => b.setAttribute('aria-current', b.getAttribute('data-go') === cur ? 'true' : 'false'));
    const inPlanner = planner.getBoundingClientRect().top < innerHeight * 0.55;
    passport.classList.toggle('is-away', inPlanner);
    passport.inert = inPlanner;
    corner.classList.toggle('is-planner', inPlanner);
    angkorCheck(); railCheck();
  }
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; track(); }); } }, { passive: true });
  addEventListener('resize', track);

  slotsEl.addEventListener('click', e => {
    const b = e.target.closest('button[data-go]'); if (!b) return;
    const el = document.getElementById(b.getAttribute('data-go'));
    // Przypięte akty: skok na moment, w którym tekst jest widoczny
    let y = el.getBoundingClientRect().top + scrollY;
    if (el.id === 'ch-ank') y += (el.offsetHeight - innerHeight) * 0.62;
    if (el.id === 'ch-isl') y += (el.offsetHeight - innerHeight) * 0.02;
    scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* -------------------------------------------- dane w opowieści */
  function fillStoryData() {
    $$('[data-dates]').forEach(el => { el.textContent = K.placeDatesText(el.getAttribute('data-dates')); });
    // bilet nocnego autobusu z rezerwacji planera
    const tr = K.transfers().find(x => K.isNight(x.key)) || K.transfers().find(x => x.key === 'siemreap>sihanoukville');
    const r = tr ? (K.state.res['tr:' + tr.key] || {}) : {};
    const route = $('.ticket__route');
    if (tr && route) route.innerHTML = `${K.CODES[tr.from.place] || ''} <span aria-hidden="true">·····</span> ${K.CODES[tr.to.place] || ''}`;
    [['no', r.no], ['time', r.time ? (K.dm(tr.date) + ' · ' + r.time) : '']].forEach(([f, v]) => {
      const dd = $(`[data-ticket="${f}"]`);
      if (!dd) return;
      if (v) { dd.textContent = v; dd.removeAttribute('data-i18n'); dd.classList.remove('is-empty'); }
      else { dd.setAttribute('data-i18n', 'bus.todo'); dd.textContent = K.t('bus.todo'); dd.classList.add('is-empty'); }
    });
  }

  /* -------------------------------------------- język */
  function syncLangButtons() { $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === K.lang))); }
  $$('.lang button').forEach(b => b.addEventListener('click', () => K.setLang(b.dataset.lang)));
  K.onLang(() => { syncLangButtons(); buildPassport(); buildSlots(); fillStoryData(); track(); document.title = K.lang === 'en' ? 'Cambodia 2026 · Dominika and Oksana\'s travel journal' : 'Kambodża 2026 · dziennik podróży Dominiki i Oksany'; });
  // Stemple przebudowujemy tylko, gdy zmienią się daty (inaczej animacja odpaliłaby się ponownie).
  let sig = JSON.stringify(K.state.itinerary);
  K.onChange(() => {
    fillStoryData();
    const s = JSON.stringify(K.state.itinerary);
    if (s !== sig) { sig = s; lastKey = ''; buildPassport(); buildSlots(); }
  });

  /* -------------------------------------------- start */
  // indeks kart dla stopniowanego wejścia w pasie wysp
  $$('#ch-isl .card').forEach((c, i) => c.style.setProperty('--i', i + 1));
  document.documentElement.lang = K.lang;
  K.applyI18n(document);
  syncLangButtons(); buildPassport(); buildSlots(); fillStoryData(); watchSlots();
  if (K.lang === 'en') document.title = 'Cambodia 2026 · Dominika and Oksana\'s travel journal';
  ScrollCraft.mount(document.body);
  requestAnimationFrame(loop);
  track();
})();
