/* Pamiętnik podróży. Samodzielny moduł, działa także z file://. */
(function () {
  'use strict';

  const root = document.getElementById('diary');

  const T = {
    eyebrow: { pl: 'Po powrocie', en: 'After the trip' },
    title: { pl: 'Pamiętnik', en: 'Journal' },
    intro: { pl: 'Z notatek, zdjęć i drobnych wydatków powstanie tu ciepły album z dni, które warto zachować.', en: 'Notes, photographs and small expenses will grow into a warm album of days worth keeping.' },
    print: { pl: 'Zapisz jako PDF', en: 'Save as PDF' },
    preview: { pl: 'Przed podróżą: to podgląd tego, co się tu pojawi.', en: 'Before the trip: this is a preview of what will appear here.' },
    airD: { pl: 'Dominika, w powietrzu', en: 'Dominika, by air' },
    airO: { pl: 'Oksana, w powietrzu', en: 'Oksana, by air' },
    ground: { pl: 'Po ziemi, około', en: 'By land, approx.' },
    countries: { pl: 'Państwa pod trasą', en: 'Countries below the route' },
    nights: { pl: 'Nocy', en: 'Nights' },
    days: { pl: 'Dni', en: 'Days' },
    spent: { pl: 'Wydatki razem', en: 'Total expenses' },
    nothing: { pl: 'jeszcze nic', en: 'nothing yet' },
    person: { pl: 'na osobę', en: 'per person' },
    expenses: { pl: 'Wydatki tego dnia', en: 'Expenses that day' },
    dayTotal: { pl: 'Razem', en: 'Total' },
    photos: { pl: 'Zdjęcia z tego miejsca', en: 'Photos from this place' },
    close: { pl: 'Zamknij zdjęcie', en: 'Close photograph' },
    empty: { pl: 'Tu wklei się dzień {place}.', en: 'A day in {place} will be pasted here.' },
    photoSlot: { pl: 'miejsce na zdjęcie', en: 'space for a photograph' },
    route: { pl: 'Trasa dnia', en: 'Route of the day' },
    noPhoto: { pl: 'Pocztówka czeka na pierwsze zdjęcie.', en: 'The postcard is waiting for its first photograph.' }
  };
  const tx = key => K.tx(T[key]);
  const esc = value => String(value == null ? '' : value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const safeSrc = value => /^(?:https?:|data:image\/|blob:|\.\.?\/|assets\/)/i.test(String(value || '')) ? String(value) : '';
  const placeName = id => TRIP.places[id] ? K.tx(TRIP.places[id].name) : id;
  let photoReady = false;
  let photoRows = Object.create(null);
  let objectUrls = [];
  let renderToken = 0;
  let timer = 0;

  function haversine(a, b) {
    const rad = n => n * Math.PI / 180;
    const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    const q = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
  }

  function defaultGroundKm(trip) {
    const it = trip.defaultItinerary || { order: [], nights: {} };
    const ids = ['pp1'].concat(it.order || [], ['pp2']);
    let sum = 0;
    for (let i = 1; i < ids.length; i++) {
      const a = trip.places[trip.stays[ids[i - 1]].place];
      const b = trip.places[trip.stays[ids[i]].place];
      if (a && b && Number.isFinite(+a.lat) && Number.isFinite(+a.lng) && Number.isFinite(+b.lat) && Number.isFinite(+b.lng)) sum += haversine(a, b);
    }
    return Math.round(sum);
  }

  function liveGroundKm() {
    return Math.round(K.transfers().reduce((sum, tr) => {
      const a = TRIP.places[tr.from.place], b = TRIP.places[tr.to.place];
      return a && b ? sum + haversine(a, b) : sum;
    }, 0));
  }

  function computeSummary(trip, legs, expenses, rates) {
    legs = legs || {};
    expenses = expenses || [];
    rates = rates || trip.defaultRates || {};
    const air = {};
    (trip.travelers || []).forEach(person => {
      const seen = new Set();
      air[person.id] = (trip.flights || []).filter(f => (f.who || []).includes(person.id)).reduce((sum, f) => {
        const key = `${f.fromCode}-${f.toCode}`;
        if (seen.has(f.id)) return sum;
        seen.add(f.id);
        return sum + Number(legs[key] && legs[key].km || 0);
      }, 0);
    });
    const countryMap = new Map();
    Object.values(legs).forEach(leg => (leg.countries || []).forEach(c => {
      const en = c.en === "People's Republic of China" ? 'China' : c.en;
      const key = en || c.pl;
      if (!countryMap.has(key)) countryMap.set(key, { pl: c.pl === 'Chińska Republika Ludowa' ? 'Chiny' : c.pl, en });
    }));
    const totalEUR = expenses.reduce((sum, e) => sum + Number(e.amount || 0) * Number(rates[e.cur] == null ? 0 : rates[e.cur]), 0);
    const perPerson = {};
    (trip.travelers || []).forEach(p => { perPerson[p.id] = 0; });
    expenses.forEach(e => {
      const eur = Number(e.amount || 0) * Number(rates[e.cur] == null ? 0 : rates[e.cur]);
      const d = e.split === 'custom' ? Math.min(100, Math.max(0, Number(e.shareD) || 0)) / 100 : .5;
      if ('dominika' in perPerson) perPerson.dominika += eur * d;
      if ('oksana' in perPerson) perPerson.oksana += eur * (1 - d);
    });
    const days = Math.max(0, Math.round((new Date(trip.tripEnd + 'T12:00:00Z') - new Date(trip.tripStart + 'T12:00:00Z')) / 864e5) + 1);
    const it = trip.defaultItinerary || {};
    const nights = Object.values(it.nights || {}).reduce((a, n) => a + Number(n || 0), 0) + Object.values(it.transitNights || {}).reduce((a, n) => a + Number(n || 0), 0);
    return { airKm: air, groundKm: defaultGroundKm(trip), countries: Array.from(countryMap.values()), nights, days, totalEUR, perPerson };
  }

  window.Diary = { computeSummary };
  if (!root || !window.K || typeof TRIP === 'undefined') return;

  /* Minimalna kopia wyboru miejsca dnia z planner.js, potrzebna, bo funkcja planera jest prywatna. */
  function dayPlace(day) {
    let place = null;
    TRIP.layovers.forEach(l => { if (l.from.slice(0, 10) === day) place = place || 'beijing'; });
    if (TRIP.layovers[1] && TRIP.layovers[1].from.slice(0, 10) === day) place = 'greatwall';
    K.stays().forEach(s => {
      if (s.checkIn <= day && day < s.checkOut) place = s.place;
      if (s.id === 'pp2' && s.checkOut === day) place = s.place;
    });
    K.transfers().filter(tr => K.isNight(tr.key) && tr.to.checkIn === day).forEach(tr => { place = tr.to.place; });
    return place || 'vienna';
  }

  function dayPoints(day, place) {
    const ids = [];
    (TRIP.flights || []).forEach(f => {
      // Lot liczy się w dniu wylotu; w dniu przylotu pokazujemy tylko miejsce lądowania.
      if (f.dep && f.dep.slice(0, 10) === day) ids.push(f.from, f.to);
      else if (f.arr && f.arr.slice(0, 10) === day) ids.push(f.to);
    });
    K.transfers().forEach(tr => { if (tr.date === day) ids.push(tr.from.place, tr.to.place); });
    if (!ids.length) ids.push(place);
    return ids.filter((id, i) => TRIP.places[id] && ids.indexOf(id) === i);
  }

  // Miejscownik do zdania "Tu wklei się dzień ...".
  const LOC_PL = { vienna: 'w Wiedniu i Brukseli', brussels: 'w Brukseli', beijing: 'w Pekinie', phnompenh: 'w\u00a0Phnom\u00a0Penh', siemreap: 'w\u00a0Siem\u00a0Reap', sihanoukville: 'w Sihanoukville', kohrong: 'na Koh\u00a0Rong', kohrongsamloem: 'na Koh\u00a0Rong\u00a0Samloem', greatwall: 'na Murze Chińskim' };
  const MAPCODE = { vienna: 'VIE', brussels: 'BRU' };
  const km = n => Math.round(n || 0).toLocaleString(K.lang === 'en' ? 'en-GB' : 'pl-PL');
  function dayTitle(day, place) {
    const ids = dayPoints(day, place);
    if (ids.includes('vienna') && ids.includes('brussels') && !ids.includes('phnompenh')) return placeName('vienna') + (K.lang === 'en' ? ' and ' : ' i ') + placeName('brussels');
    return placeName(place);
  }
  function miniMap(day, place) {
    const ids = dayPoints(day, place), pts = ids.map(id => ({ id, p: TRIP.places[id] })).filter(x => Number.isFinite(+x.p.lat) && Number.isFinite(+x.p.lng));
    if (!pts.length) return '';
    let minX = Math.min(...pts.map(x => +x.p.lng)), maxX = Math.max(...pts.map(x => +x.p.lng));
    let minY = Math.min(...pts.map(x => +x.p.lat)), maxY = Math.max(...pts.map(x => +x.p.lat));
    if (minX === maxX) { minX -= 1; maxX += 1; }
    if (minY === maxY) { minY -= 1; maxY += 1; }
    const xy = x => ({ x: 24 + (+x.p.lng - minX) / (maxX - minX) * 252, y: 86 - (+x.p.lat - minY) / (maxY - minY) * 58 });
    const coords = pts.map(xy);
    const line = coords.length > 1 ? `<polyline points="${coords.map(p => `${p.x},${p.y}`).join(' ')}"/>` : '';
    return `<figure class="diary-map"><figcaption>${esc(tx('route'))}</figcaption><svg viewBox="0 0 300 108" role="img" aria-label="${esc(tx('route'))}"><rect x="1" y="1" width="298" height="106" rx="2"/>${line}${pts.map((x, i) => { const p = coords[i]; return `<g transform="translate(${p.x} ${p.y})"><circle r="5"/><text x="${p.x > 200 ? -9 : 9}" y="${coords.slice(0, i).some(q => Math.hypot(p.x - q.x, p.y - q.y) < 40) === (p.y > 60) ? 17 : -9}" text-anchor="${p.x > 200 ? 'end' : 'start'}">${esc(MAPCODE[x.id] || K.CODES[x.id] || placeName(x.id))}</text></g>`; }).join('')}</svg></figure>`;
  }

  function summaryHTML() {
    const s = computeSummary(TRIP, window.JOURNEY_LEGS || {}, K.liveExpenses(), K.state.rates);
    const metric = (label, value, cls) => `<div class="diary-ticket__cell ${cls || ''}"><span>${esc(label)}</span><strong>${value}</strong></div>`;
    const countryNames = s.countries.map(c => K.lang === 'en' ? c.en : c.pl).join(' · ');
    const spending = s.totalEUR ? `${esc(K.money(s.totalEUR))}<small>${TRIP.travelers.map(p => `${esc(p.name)} ${esc(K.money(s.perPerson[p.id] || 0))}`).join(' · ')} ${esc(tx('person'))}</small>` : esc(tx('nothing'));
    return `<div class="diary-ticket" aria-label="${esc(tx('title'))}">
      ${metric(tx('airD'), `${km(s.airKm.dominika)} km`)}${metric(tx('airO'), `${km(s.airKm.oksana)} km`)}
      ${metric(tx('ground'), `${km(liveGroundKm())} km`)}${metric(tx('nights'), String(K.nightsTotal ? K.nightsTotal() : s.nights))}
      ${metric(tx('days'), String(K.dayList().length))}${metric(tx('spent'), spending, 'diary-ticket__cell--money')}
      ${metric(tx('countries'), esc(countryNames), 'diary-ticket__cell--wide')}
    </div>`;
  }

  function postcard(place, index, muted) {
    const p = TRIP.places[place] || {}, ph = (p.photos || []).find(x => safeSrc(x.src));
    const stampKeys = { vienna: 'vie-out', beijing: 'pek-out', phnompenh: 'pnh-in', siemreap: 'rep', sihanoukville: 'kos', kohrong: 'kr', kohrongsamloem: 'krs', greatwall: 'mut' };
    const stampKey = stampKeys[place];
    const stamp = stampKey && K.STAMP_ORDER && K.STAMP_ORDER.includes(stampKey) && K.stampSVG ? `<span class="diary-postcard__stamp">${K.stampSVG(stampKey, true)}</span>` : '';
    if (!ph) return `<figure class="diary-postcard diary-postcard--blank ${muted ? 'is-waiting' : ''}" style="--tilt:${(index % 4 - 1.5) * .7}deg"><div>${esc(tx('noPhoto'))}</div>${stamp}<figcaption>${esc(placeName(place))}</figcaption></figure>`;
    return `<figure class="diary-postcard ${muted ? 'is-waiting' : ''}" style="--tilt:${(index % 4 - 1.5) * .7}deg"><img src="${esc(safeSrc(ph.src))}" alt="${esc(ph.cap ? K.tx(ph.cap) : placeName(place))}" loading="lazy" decoding="async">${stamp}<figcaption>${esc(ph.cap ? K.tx(ph.cap) : placeName(place))}</figcaption></figure>`;
  }

  function userPhotos(place, day, first) {
    const rows = photoRows[place] || [];
    const selected = rows.filter(r => (r.day || r.date) ? (r.day || r.date).slice(0, 10) === day : first);
    if (!selected.length) return '';
    return `<section class="diary-photos"><h4>${esc(tx('photos'))}</h4><div>${selected.map(r => {
      const url = URL.createObjectURL(r.blob); objectUrls.push(url);
      return `<button type="button" data-diary-photo="${esc(url)}" data-alt="${esc(r.caption || placeName(place))}"><img src="${esc(url)}" alt="${esc(r.caption || placeName(place))}" loading="lazy"></button>`;
    }).join('')}</div></section>`;
  }

  function notesHTML(place, first) {
    if (!first) return '';
    const notes = K.liveNotes().filter(n => n.place === place);
    if (!notes.length) return '';
    return `<ul class="diary-notes">${notes.map(n => { const person = K.person(n.who); return `<li style="--person:${esc(person.color || '#4a524b')}"><b>${esc(person.name)}</b><p>${esc(n.text)}</p></li>`; }).join('')}</ul>`;
  }

  function expenseHTML(day) {
    const rows = K.liveExpenses().filter(e => e.day === day);
    if (!rows.length) return '';
    const total = rows.reduce((a, e) => a + K.toEUR(e.amount, e.cur), 0);
    return `<section class="diary-expenses"><h4>${esc(tx('expenses'))}</h4><ul>${rows.map(e => `<li><span>${esc(e.desc || '')}</span><span>${esc(K.money(Number(e.amount), e.cur))}${e.cur !== 'EUR' ? ` <small>(≈ ${esc(K.money(K.toEUR(e.amount, e.cur)))})</small>` : ''}</span></li>`).join('')}</ul><p><b>${esc(tx('dayTotal'))}</b> ${esc(K.money(total))}</p></section>`;
  }

  function dayHTML(day, index, seen) {
    const place = dayPlace(day), first = !seen.has(place); seen.add(place);
    const hasContent = (photoRows[place] || []).some(r => (r.day || r.date) ? (r.day || r.date).slice(0, 10) === day : first) || (first && K.liveNotes().some(n => n.place === place)) || K.liveExpenses().some(e => e.day === day);
    const label = K.fmtDay(day, true), weekday = label.split(' ')[0], date = label.slice(weekday.length).trim();
    return `<li class="diary-day ${hasContent ? 'has-memories' : 'is-empty'}" id="diary-${day}">
      <div class="diary-day__tab"><time datetime="${day}"><strong>${esc(date)}</strong><span>${esc(weekday)}</span></time></div>
      <div class="diary-day__left"><h3>${esc(dayTitle(day, place))}</h3>${miniMap(day, place)}${!hasContent ? `<p class="diary-empty">${esc(tx('empty').replace('{place}', K.lang === 'en' ? placeName(place) : (LOC_PL[place] || 'w drodze')))}</p><span class="diary-photo-slot">${esc(tx('photoSlot'))}</span>` : ''}</div>
      <div class="diary-day__right">${postcard(place, index, !hasContent)}${userPhotos(place, day, first)}${notesHTML(place, first)}${expenseHTML(day)}</div>
    </li>`;
  }

  function clearUrls() { objectUrls.forEach(url => URL.revokeObjectURL(url)); objectUrls = []; }
  function render() {
    clearUrls();
    const seen = new Set();
    const before = new Date().toISOString().slice(0, 10) < TRIP.tripStart;
    root.innerHTML = `<div class="diary__inner"><header class="diary__head"><div><p class="diary__eyebrow">${esc(tx('eyebrow'))}</p><h2 id="diary-h">${esc(tx('title'))}</h2><p>${esc(tx('intro'))}</p></div><button class="diary-print" type="button">${esc(tx('print'))}</button></header>${summaryHTML()}${before ? `<p class="diary-preview">${esc(tx('preview'))}</p>` : ''}<ol class="diary-days">${K.dayList().map((d, i) => dayHTML(d, i, seen)).join('')}</ol></div><dialog class="diary-lightbox" aria-label="${esc(tx('photos'))}"><button type="button" aria-label="${esc(tx('close'))}">×</button><img alt=""></dialog>`;
  }

  async function loadPhotos() {
    if (photoReady || !window.KPhotos) return;
    photoReady = true;
    const places = Array.from(new Set(K.dayList().map(dayPlace)));
    const token = ++renderToken;
    const rows = await Promise.all(places.map(p => KPhotos.list(p).catch(() => [])));
    if (token !== renderToken) return;
    places.forEach((p, i) => { photoRows[p] = rows[i]; });
    render();
  }

  function schedule() { clearTimeout(timer); timer = setTimeout(render, 200); }
  root.addEventListener('click', event => {
    if (event.target.closest('.diary-print')) {
      document.body.classList.add('printing-diary');
      window.print();
      return;
    }
    const thumb = event.target.closest('[data-diary-photo]');
    if (thumb) {
      const dlg = root.querySelector('.diary-lightbox'), img = dlg.querySelector('img');
      img.src = thumb.dataset.diaryPhoto; img.alt = thumb.dataset.alt || '';
      if (dlg.showModal) dlg.showModal();
    }
    if (event.target.closest('.diary-lightbox > button')) event.target.closest('dialog').close();
  });
  window.addEventListener('beforeprint', () => document.body.classList.add('printing-diary'));
  window.addEventListener('afterprint', () => document.body.classList.remove('printing-diary'));
  K.onLang(schedule);
  K.onChange(schedule);
  render();
  window.addEventListener('DOMContentLoaded', schedule, { once: true });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { observer.disconnect(); loadPhotos(); } }, { rootMargin: '800px' });
    observer.observe(root);
  } else loadPhotos();
})();
