/* Pamiętnik podróży. Samodzielny moduł, działa także z file://. */
(function () {
  'use strict';

  const root = document.getElementById('diary');

  const T = {
    eyebrow: { pl: 'Po powrocie', en: 'After the trip' },
    title: { pl: 'Pamiętnik', en: 'Journal' },
    intro: { pl: 'Z notatek, zdjęć i drobnych wydatków powstanie tu ciepły album z dni, które warto zachować.', en: 'Notes, photographs and small expenses will grow into a warm album of days worth keeping.' },
    print: { pl: 'Zapisz jako PDF', en: 'Save as PDF' },
    printName: { pl: 'Pamiętnik', en: 'Diary' },
    printFormat: { pl: 'A4', en: 'A4' },
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
    photos: { pl: 'Zdjęcia', en: 'Photos' },
    addPhotos: { pl: 'Dodaj zdjęcia', en: 'Add photos' },
    addingPhotos: { pl: 'Dodaję {n} zdjęć…', en: 'Adding {n} photos…' },
    photoError: { pl: 'Nie udało się dodać {n} plików. Wybierz obrazy mniejsze niż 40 MB.', en: 'Could not add {n} files. Choose images smaller than 40 MB.' },
    photoCaption: { pl: 'Podpis zdjęcia', en: 'Photo caption' },
    photoDeleteConfirm: { pl: 'Usunąć to zdjęcie?', en: 'Delete this photo?' },
    ourDay: { pl: 'Nasz dzień', en: 'Our day' },
    saveEntry: { pl: 'Zapisz wpis', en: 'Save entry' },
    edit: { pl: 'Edytuj', en: 'Edit' },
    delete: { pl: 'Usuń', en: 'Delete' },
    entryPlaceholder: { pl: 'Co dziś robiłaś? Co się wydarzyło?', en: 'What did you do today? What happened?' },
    best: { pl: 'Najlepsza chwila dnia', en: 'Best moment of the day' },
    mood: { pl: 'Nastrój dnia', en: 'Mood of the day' },
    placeNotes: { pl: 'Notatki z karty miejsca', en: 'Notes from the place card' },
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
  const editingEntries = new Set();

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
    if (day === TRIP.tripStart || day === TRIP.tripEnd) return 'vienna';
    if (TRIP.layovers[1] && TRIP.layovers[1].from.slice(0, 10) === day) return 'greatwall';
    let place = null, leaving = null;
    K.stays().forEach(s => {
      if (s.checkIn <= day && day < s.checkOut) place = s.place;
      if (s.checkOut === day) leaving = leaving || s.place;
    });
    K.transfers().filter(tr => K.isNight(tr.key) && tr.to.checkIn === day).forEach(tr => { place = tr.to.place; });
    if (place) return place;
    if (leaving) return leaving;
    if (TRIP.layovers.some(l => l.from.slice(0, 10) === day)) return 'beijing';
    return null;
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
    if (day === '2026-11-01') return placeName('beijing') + ' → ' + placeName('phnompenh');
    if (day === '2026-11-11') return placeName('greatwall') + (K.lang === 'en' ? ' / Beijing' : ' / Pekin');
    if (ids.includes('vienna') && ids.includes('brussels') && !ids.includes('phnompenh')) return placeName('vienna') + (K.lang === 'en' ? ' and ' : ' i ') + placeName('brussels');
    return placeName(place);
  }
  // Szacunkowa szerokosc podpisu w jednostkach viewBox (9 px, pogrubione, rozstrzelone): do kotwiczenia przy krawedziach.
  const labelW = s => String(s).length * 6.6;
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
    return `<figure class="diary-map"><figcaption>${esc(tx('route'))}</figcaption><svg viewBox="0 0 300 108" role="img" aria-label="${esc(tx('route'))}"><rect x="1" y="1" width="298" height="106" rx="2"/>${line}${pts.map((x, i) => { const p = coords[i]; const label = MAPCODE[x.id] || K.CODES[x.id] || placeName(x.id); const w = labelW(label); const right = p.x + 9 + w > 294, left = p.x - 9 - w < 6; const anchor = right && !left ? 'end' : (left && !right ? 'start' : (right && left ? 'middle' : (p.x > 200 ? 'end' : 'start'))); const lx = anchor === 'end' ? -9 : anchor === 'start' ? 9 : Math.min(Math.max(0, 6 + w / 2 - p.x), 294 - w / 2 - p.x); let ty = coords.slice(0, i).some(q => Math.hypot(p.x - q.x, p.y - q.y) < 40) === (p.y > 60) ? 17 : -9; if (p.y + ty > 102) ty = -9; if (p.y + ty < 12) ty = 17; return `<g transform="translate(${p.x} ${p.y})"><circle r="5"/><text x="${Math.round(lx)}" y="${ty}" text-anchor="${anchor}">${esc(label)}</text></g>`; }).join('')}</svg></figure>`;
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
    return `<section class="diary-photos"><h4>${esc(tx('photos'))}</h4>${selected.length ? `<div>${selected.map(r => {
      const url = URL.createObjectURL(r.blob); objectUrls.push(url);
      return `<figure><button type="button" data-diary-photo="${esc(url)}" data-alt="${esc(r.caption || placeName(place))}"><img src="${esc(url)}" alt="${esc(r.caption || placeName(place))}" loading="lazy"></button><figcaption><input type="text" value="${esc(r.caption || '')}" placeholder="${esc(tx('photoCaption'))}" aria-label="${esc(tx('photoCaption'))}" data-diary-caption="${esc(r.id)}"><button type="button" data-diary-delete-photo="${esc(r.id)}">${esc(tx('delete'))}</button></figcaption></figure>`;
    }).join('')}</div>` : ''}<label class="diary-photo-add"><span>${esc(tx('addPhotos'))}</span><input class="visually-hidden" type="file" accept="image/*" multiple data-diary-photo-input="${esc(day)}" data-place="${esc(place)}"></label><p class="diary-photo-status" data-diary-photo-status="${esc(day)}" aria-live="polite"></p></section>`;
  }

  function diaryEntryHTML(day) {
    const entries = K.state.diary[day] || {};
    const cards = TRIP.travelers.map(person => {
      const entry = entries[person.id];
      if (!entry || entry.deleted) return '';
      return `<article class="diary-entry" style="--person:${esc(person.color)}"><header><b>${esc(person.name)}</b>${entry.mood ? `<span>${esc(entry.mood)}</span>` : ''}</header><p>${esc(entry.text || '')}</p>${entry.best ? `<p class="diary-entry__best"><b>${esc(tx('best'))}:</b> ${esc(entry.best)}</p>` : ''}${person.id === K.me ? `<p class="diary-entry__actions"><button type="button" data-diary-edit="${esc(day)}">${esc(tx('edit'))}</button><button type="button" data-diary-delete-entry="${esc(day)}">${esc(tx('delete'))}</button></p>` : ''}</article>`;
    }).join('');
    const mine = entries[K.me], editing = !mine || mine.deleted || editingEntries.has(day);
    return `<section class="diary-entries"><h4>${esc(tx('ourDay'))}</h4><div class="diary-entry-list">${cards}</div>${editing ? `<form data-diary-entry="${esc(day)}"><label><span class="visually-hidden">${esc(tx('ourDay'))}</span><textarea name="text" rows="5" placeholder="${esc(tx('entryPlaceholder'))}">${esc(mine && !mine.deleted ? mine.text : '')}</textarea></label><fieldset><legend>${esc(tx('mood'))}</legend>${['😍','😊','😐','😴','🥵','🌧'].map(m => `<label><input type="radio" name="mood" value="${m}" ${mine && mine.mood === m ? 'checked' : ''}><span>${m}</span></label>`).join('')}</fieldset><label><span>${esc(tx('best'))}</span><input type="text" name="best" value="${esc(mine && !mine.deleted ? mine.best || '' : '')}"></label><label><span class="visually-hidden">${esc(K.person(K.me).name)}</span><select name="who">${TRIP.travelers.map(p => `<option value="${p.id}" ${p.id === K.me ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select></label><button type="submit">${esc(tx('saveEntry'))}</button></form>` : ''}</section>`;
  }

  function notesHTML(place, first) {
    if (!first) return '';
    const notes = K.liveNotes().filter(n => n.place === place);
    if (!notes.length) return '';
    return `<section class="diary-place-notes"><h4>${esc(tx('placeNotes'))}</h4><ul class="diary-notes">${notes.map(n => { const person = K.person(n.who); return `<li style="--person:${esc(person.color || '#4a524b')}"><b>${esc(person.name)}</b><p>${esc(n.text)}</p></li>`; }).join('')}</ul></section>`;
  }

  function expenseHTML(day) {
    const rows = K.liveExpenses().filter(e => e.day === day);
    if (!rows.length) return '';
    const total = rows.reduce((a, e) => a + K.toEUR(e.amount, e.cur), 0);
    return `<section class="diary-expenses"><h4>${esc(tx('expenses'))}</h4><ul>${rows.map(e => `<li><span>${esc(e.desc || '')}</span><span>${esc(K.money(Number(e.amount), e.cur))}${e.cur !== 'EUR' ? ` <small>(≈ ${esc(K.money(K.toEUR(e.amount, e.cur)))})</small>` : ''}</span></li>`).join('')}</ul><p><b>${esc(tx('dayTotal'))}</b> ${esc(K.money(total))}</p></section>`;
  }

  function dayHTML(day, index, seen) {
    const place = dayPlace(day), first = !seen.has(place); seen.add(place);
    const hasEntry = Object.values(K.state.diary[day] || {}).some(x => x && !x.deleted);
    const hasContent = hasEntry || (photoRows[place] || []).some(r => (r.day || r.date) ? (r.day || r.date).slice(0, 10) === day : first) || (first && K.liveNotes().some(n => n.place === place)) || K.liveExpenses().some(e => e.day === day);
    const label = K.fmtDay(day, true), weekday = label.split(' ')[0], date = label.slice(weekday.length).trim();
    return `<li class="diary-day ${hasContent ? 'has-memories' : 'is-empty'}" id="diary-${day}">
      <div class="diary-day__tab"><time datetime="${day}"><strong>${esc(date)}</strong><span>${esc(weekday)}</span></time></div>
      <div class="diary-day__left"><h3>${esc(dayTitle(day, place))}</h3>${miniMap(day, place)}${!hasContent ? `<p class="diary-empty">${esc(tx('empty').replace('{place}', K.lang === 'en' ? placeName(place) : (LOC_PL[place] || 'w drodze')))}</p>` : ''}</div>
      <div class="diary-day__right">${postcard(place, index, !hasContent)}</div>
      <div class="diary-day__memories">${diaryEntryHTML(day)}${userPhotos(place, day, first)}${notesHTML(place, first)}${expenseHTML(day)}</div>
    </li>`;
  }

  function clearUrls() { objectUrls.forEach(url => URL.revokeObjectURL(url)); objectUrls = []; }
  function render() {
    clearUrls();
    const seen = new Set();
    const before = new Date().toISOString().slice(0, 10) < TRIP.tripStart;
    root.innerHTML = `<div class="diary__inner"><header class="diary__head"><div><p class="diary__eyebrow">${esc(tx('eyebrow'))}</p><h2 id="diary-h">${esc(tx('title'))}</h2><p>${esc(tx('intro'))}</p></div><button class="diary-print" type="button"><span class="diary-print__seal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 15.5v5h14v-5M12 3v12M8.5 11.5 12 15l3.5-3.5"/><path d="M7 20.5h10"/></svg></span><span class="diary-print__copy"><small class="diary-print__meta">${esc(tx('printName'))}</small><span class="diary-print__label">${esc(tx('print'))}</span></span><span class="diary-print__stub" aria-hidden="true">${esc(tx('printFormat'))}</span></button></header>${summaryHTML()}${before ? `<p class="diary-preview">${esc(tx('preview'))}</p>` : ''}<ol class="diary-days">${K.dayList().map((d, i) => dayHTML(d, i, seen)).join('')}</ol></div><dialog class="diary-lightbox" aria-label="${esc(tx('photos'))}"><button type="button" aria-label="${esc(tx('close'))}">×</button><img alt=""></dialog>`;
  }

  async function loadPhotos() {
    if (!window.KPhotos) return;
    if (photoReady) return;
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
    const edit = event.target.closest('[data-diary-edit]');
    if (edit) { editingEntries.add(edit.dataset.diaryEdit); render(); root.querySelector(`[data-diary-entry="${edit.dataset.diaryEdit}"] textarea`)?.focus(); return; }
    const delEntry = event.target.closest('[data-diary-delete-entry]');
    if (delEntry && confirm(tx('delete') + '?')) {
      const day = delEntry.dataset.diaryDeleteEntry, old = K.state.diary[day] && K.state.diary[day][K.me];
      if (old) K.state.diary[day][K.me] = Object.assign({}, old, { deleted: true, updated: Date.now() });
      editingEntries.delete(day); K.save(); return;
    }
    const delPhoto = event.target.closest('[data-diary-delete-photo]');
    if (delPhoto && confirm(tx('photoDeleteConfirm'))) {
      KPhotos.remove(delPhoto.dataset.diaryDeletePhoto).then(async () => {
        const figure = delPhoto.closest('figure'); if (figure) figure.remove();
        await refreshPhotos();
      }).catch(() => setPhotoStatus(delPhoto.closest('.diary-photos'), tx('photoError').replace('{n}', '1')));
    }
  });
  function setPhotoStatus(scope, text) {
    const status = scope && scope.querySelector('[data-diary-photo-status]');
    if (status) status.textContent = text;
  }
  async function refreshPhotos() {
    if (!window.KPhotos) return;
    const places = Array.from(new Set(K.dayList().map(dayPlace).filter(Boolean)));
    const rows = await Promise.all(places.map(p => KPhotos.list(p).catch(() => [])));
    places.forEach((p, i) => { photoRows[p] = rows[i]; });
    render();
  }
  root.addEventListener('change', async event => {
    const caption = event.target.closest('[data-diary-caption]');
    if (caption) { try { await KPhotos.setCaption(caption.dataset.diaryCaption, caption.value); } catch (e) { setPhotoStatus(caption.closest('.diary-photos'), tx('photoError').replace('{n}', '1')); } return; }
    const input = event.target.closest('[data-diary-photo-input]');
    if (!input) return;
    const files = Array.from(input.files || []); if (!files.length) return;
    const section = input.closest('.diary-photos'), n = files.length;
    setPhotoStatus(section, tx('addingPhotos').replace('{n}', n)); input.disabled = true;
    let failed = 0;
    for (const file of files) {
      try { await KPhotos.add(input.dataset.place, file, { day: input.dataset.diaryPhotoInput, who: K.me }); }
      catch (e) { failed++; }
    }
    input.disabled = false; input.value = '';
    await refreshPhotos();
    if (failed) {
      const fresh = root.querySelector(`[data-diary-photo-input="${input.dataset.diaryPhotoInput}"]`)?.closest('.diary-photos');
      setPhotoStatus(fresh, tx('photoError').replace('{n}', failed));
    }
  });
  root.addEventListener('submit', event => {
    const form = event.target.closest('[data-diary-entry]'); if (!form) return;
    event.preventDefault(); const fd = new FormData(form), who = String(fd.get('who') || K.me), day = form.dataset.diaryEntry;
    const text = String(fd.get('text') || '').trim(), best = String(fd.get('best') || '').trim();
    if (!text && !best && !fd.get('mood')) return form.querySelector('textarea').focus();
    K.setMe(who); K.state.diary[day] = K.state.diary[day] || {};
    K.state.diary[day][who] = { text, mood: String(fd.get('mood') || ''), best, updated: Date.now(), deleted: false };
    editingEntries.delete(day); K.save();
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
