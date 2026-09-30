/* =====================================================================
   PLANER: zakładki, przystanki, noce (edycja + przeciąganie), dzień po
   dniu z rezerwacjami, karta miejsca (dialog), wydatki z rozliczeniem,
   dane (kursy, eksport/import).
   ===================================================================== */
(function () {
  'use strict';
  // Liczebniki: 1 wydatek, 2 wydatki, 5 wydatków / 1 expense, 2 expenses
  const PLURAL = { e: [['wydatek', 'wydatki', 'wydatków'], ['expense', 'expenses']], n: [['notatka', 'notatki', 'notatek'], ['note', 'notes']], r: [['rezerwacja', 'rezerwacje', 'rezerwacji'], ['booking', 'bookings']] };
  function plural(kind, n) {
    const [pl, en] = PLURAL[kind];
    if (K.lang === 'en') return n + ' ' + (n === 1 ? en[0] : en[1]);
    const m10 = n % 10, m100 = n % 100;
    return n + ' ' + (n === 1 ? pl[0] : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) ? pl[1] : pl[2]);
  }
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const t = (k, v) => K.t(k, v);
  const P = TRIP.places;
  const pname = id => K.tx(P[id].name);
  const CATS = ['transport', 'food', 'stay', 'fun', 'other'];
  const safeUrl = u => /^(https?:|photos\/|\.\/|assets\/)/i.test(String(u).trim()) ? String(u).trim() : '';

  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('is-on'), 3200);
  }

  /* ================================================================ zakładki */
  const tabs = $$('.tabs [role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach(tb => {
      const on = tb === tab;
      tb.setAttribute('aria-selected', String(on)); tb.tabIndex = on ? 0 : -1;
      $('#' + tb.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    if (tab.id === 'tab-globe' && window.KGlobe) window.KGlobe.resize();
  }
  tabs.forEach((tb, i) => {
    tb.addEventListener('click', () => selectTab(tb));
    tb.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0; if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); selectTab(tabs[j], true); }
    });
  });

  /* ================================================================ przystanki */
  function renderStops() {
    $('#stops').innerHTML = K.stopsForList().map(s =>
      `<li><button type="button" data-place="${s.place}"><span class="code">${K.CODES[s.place]}</span><span class="nm">${esc(s.name ? K.tx(s.name) : pname(s.place))}</span><span class="dt">${esc(s.when)}</span></button></li>`).join('');
  }
  $('#stops').addEventListener('click', e => { const b = e.target.closest('[data-place]'); if (b) openPlace(b.dataset.place, b); });

  /* ================================================================ noce */
  let dragId = null;
  function renderNights() {
    const st = K.stays(); const total = K.nightsTotal(); const diff = total - TRIP.cambodiaNights;
    const status = diff === 0 ? `<p class="nights__status is-ok">${t('nights.ok')}</p>`
      : `<p class="nights__status is-bad" role="alert">${t(diff < 0 ? 'nights.short' : 'nights.long', { n: Math.abs(diff) })}</p>`;
    const mids = K.state.itinerary.order;
    $('#nights').innerHTML = `
      <div class="nights__head"><h3 class="h3">${t('nights.h')}</h3><button type="button" class="btn btn--ghost" data-act="reset">${t('nights.reset')}</button></div>
      <p class="hint">${t('nights.help')}</p>
      <ol class="nights__list">${st.map(s => {
        const mid = mids.indexOf(s.id); const movable = mid > -1;
        return `<li data-id="${s.id}" ${movable ? 'draggable="true"' : ''}>
          <span class="grip ${movable ? '' : 'is-fixed'}" aria-hidden="true">${movable ? '⋮⋮' : t('fixed')}</span>
          <span class="nm"><b>${esc(pname(s.place))}</b><small>${K.fmtRange(s.checkIn, s.checkOut)}</small></span>
          <span class="ctr"><button type="button" class="btn btn--sq" data-act="minus" aria-label="${t('fewer')}: ${esc(pname(s.place))}" ${s.nights <= 0 ? 'disabled' : ''}>−</button>
            <output aria-live="polite" aria-label="${t('nights.n')}">${s.nights}</output>
            <button type="button" class="btn btn--sq" data-act="plus" aria-label="${t('more')}: ${esc(pname(s.place))}">+</button></span>
          <span class="mv">${movable ? `<button type="button" class="btn btn--sq" data-act="up" aria-label="${t('up')}: ${esc(pname(s.place))}" ${mid === 0 ? 'disabled' : ''}>↑</button>
            <button type="button" class="btn btn--sq" data-act="down" aria-label="${t('down')}: ${esc(pname(s.place))}" ${mid === mids.length - 1 ? 'disabled' : ''}>↓</button>` : ''}</span>
        </li>`; }).join('')}</ol>${status}`;
  }
  const nightsEl = $('#nights');
  nightsEl.addEventListener('click', e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const it = K.state.itinerary; const act = b.dataset.act;
    if (act === 'reset') { it.order = TRIP.defaultItinerary.order.slice(); it.nights = Object.assign({}, TRIP.defaultItinerary.nights); K.save(); return; }
    const id = b.closest('li').dataset.id;
    if (act === 'plus') it.nights[id] = Math.min(14, it.nights[id] + 1);
    if (act === 'minus') it.nights[id] = Math.max(0, it.nights[id] - 1);
    if (act === 'up' || act === 'down') {
      const i = it.order.indexOf(id), j = act === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= it.order.length) return;
      [it.order[i], it.order[j]] = [it.order[j], it.order[i]];
    }
    K.save();
    const again = $(`li[data-id="${id}"] [data-act="${act}"]`, nightsEl);
    (again && !again.disabled ? again : $(`li[data-id="${id}"] button:not([disabled])`, nightsEl))?.focus();
  });
  nightsEl.addEventListener('dragstart', e => { const li = e.target.closest('li[draggable]'); if (!li) return; dragId = li.dataset.id; li.classList.add('is-drag'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); });
  nightsEl.addEventListener('dragend', () => { dragId = null; $$('li', nightsEl).forEach(l => l.classList.remove('is-drag', 'is-over')); });
  nightsEl.addEventListener('dragover', e => { const li = e.target.closest('li[draggable]'); if (!li || !dragId) return; e.preventDefault(); $$('li', nightsEl).forEach(l => l.classList.toggle('is-over', l === li)); });
  nightsEl.addEventListener('drop', e => {
    const li = e.target.closest('li[draggable]'); if (!li || !dragId) return; e.preventDefault();
    const o = K.state.itinerary.order; const from = o.indexOf(dragId), to = o.indexOf(li.dataset.id);
    if (from < 0 || to < 0 || from === to) return;
    o.splice(to, 0, o.splice(from, 1)[0]); K.save();
  });

  /* ================================================================ rezerwacje */
  function resSummary(r) {
    if (!r) return t('res.empty');
    const bits = [r.name, r.no && ('#' + r.no), r.time].filter(Boolean);
    return bits.length ? bits.join(' · ') : t('res.empty');
  }
  function resForm(key, kind, place) {
    const r = K.state.res[key] || {};
    const isTr = kind === 'trans';
    const night = isTr ? K.isNight(key.slice(3)) : false;
    const f = (name, label, type, wide) => `<label class="field ${wide ? 'field--wide' : ''}"><span>${label}</span><input type="${type || 'text'}" name="${name}" value="${esc(r[name] || '')}" ${type === 'url' ? 'inputmode="url" placeholder="https://"' : ''}></label>`;
    return `<details class="res" data-key="${key}">
      <summary>${t(isTr ? 'res.trans' : 'res.stay')}${night ? ` <span class="tag tag--night">${t('nightbus')}</span>` : ''} <span class="sum">${esc(resSummary(K.state.res[key]))}</span></summary>
      <form class="res__grid" data-res="${key}">
        ${f('name', t('res.name'))}${f('no', t('res.no'))}${f('time', t('res.time'), 'time')}
        <label class="field"><span>${t('res.by')}</span><select name="by"><option value=""></option>${TRIP.travelers.map(p => `<option value="${p.id}" ${r.by === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}</select></label>
        ${f('addr', t('res.addr'), 'text', true)}${f('link', t('res.link'), 'url', true)}
        ${isTr ? `<label class="check field--wide"><input type="checkbox" name="night" ${night ? 'checked' : ''}> ${t('res.night')}</label>` : ''}
        <label class="field field--wide"><span>${t('res.notes')}</span><textarea name="notes" rows="2">${esc(r.notes || '')}</textarea></label>
      </form></details>`;
  }
  function wallForm() {
    const saved = K.state.wall || {};
    const hasSaved = Object.keys(saved).some(k => k !== 'updated' && String(saved[k] || '').trim());
    const w = hasSaved ? saved : (TRIP.seed.wall || {});
    const f = (name, label, type) => `<label class="field"><span>${label}</span><input type="${type || 'text'}" name="${name}" value="${esc(w[name] || '')}" ${type === 'number' ? 'step="0.01" min="0" inputmode="decimal"' : ''}></label>`;
    return `<details class="res" open><summary>${t('wallf.h')} <span class="sum">${esc([w.agency, w.section, w.time].filter(Boolean).join(' · ') || t('res.empty'))}</span></summary>
      <form class="res__grid" data-wall>
        ${f('agency', t('wallf.agency'))}${f('section', t('wallf.section'))}${f('meet', t('wallf.meet'))}${f('time', t('wallf.time'), 'time')}${f('service', t('wallf.service'))}${f('bookedBy', t('wallf.booked'))}${f('back', t('wallf.back'))}${f('price', t('wallf.price'), 'number')}
        <label class="field"><span>${t('wallf.cur')}</span><select name="cur">${K.CURS.map(c => `<option ${(w.cur || 'EUR') === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
      </form></details>`;
  }
  // zapisy pól rezerwacji (w planerze i w karcie miejsca)
  function onResInput(e) {
    const form = e.target.closest('form[data-res], form[data-wall]'); if (!form) return;
    const data = {}; new FormData(form).forEach((v, k) => { data[k] = String(v).trim(); });
    if (form.hasAttribute('data-wall')) { K.state.wall = Object.assign({}, data, { updated: Date.now() }); }
    else {
      const key = form.dataset.res; const box = $('[name="night"]', form);
      if (box) data.night = box.checked; else delete data.night;
      K.state.res[key] = Object.assign({}, data, { updated: Date.now() });
      const sum = form.closest('details').querySelector('.sum'); if (sum) sum.textContent = resSummary(K.state.res[key]);
    }
    quietSave();
  }
  let quiet = false;
  function quietSave() { quiet = true; K.save(); quiet = false; clearTimeout(quietSave.t); quietSave.t = setTimeout(() => toast(t('res.saved')), 500); }
  document.addEventListener('input', onResInput);
  document.addEventListener('change', e => { if (e.target.name === 'night' && e.target.closest('form[data-res]')) { onResInput(e); renderDays(); } });

  /* ================================================================ dzień po dniu */
  function renderDays() {
    const st = K.stays(), trs = K.transfers(), F = TRIP.flights;
    const seenPlaces = new Set();
    const openState = new Set($$('#days details[open]').map(d => d.dataset.key));
    const html = K.dayList().map(d => {
      const ev = []; let place = null, leavePlace = null; let blocks = '';
      F.forEach(f => {
        const people = (f.who || []).map(id => K.person(id));
        const isPending = f.id.startsWith('TBC-') || f.flightNo === null;
        const flightName = f.id.startsWith('TBC-') ? t('flight.tbc') : `${f.id} ${f.airline || ''}`.trim();
        people.forEach(person => {
          const assumed = (f.assumedFor || []).includes(person.id) || (f.assumed && people.length === 1);
          const note = assumed ? ` (${t('flight.assumed')})` : '';
          const pending = isPending || assumed ? ` <span class="pill-pending">${t('pending')}</span>` : '';
          if (f.dep && f.dep.slice(0, 10) === d) ev.push({ k: K.hm(f.dep), fl: true, raw: !!pending, v: (f.summary ? `${person.name}: ${K.tx(f.summary)}${note}` : `${person.name}: ${t('dep')} ${f.fromCode} → ${f.toCode} · ${flightName} · ${f.dur}${note}`) + pending });
          if (f.arr && f.arr.slice(0, 10) === d) ev.push({ k: K.hm(f.arr), fl: true, raw: !!pending, v: (f.summary ? `${person.name}: ${K.tx(f.summary)}${note}` : `${person.name}: ${t('arr')} ${f.toCode} (${pname(f.to)}) · ${flightName}${note}`) + pending });
        });
      });
      TRIP.layovers.forEach((l, li) => { if (l.from.slice(0, 10) === d) {
        ev.push({ k: K.hm(l.from), v: `${t('layover')} ${pname('beijing')}: ${K.tx(l.dur)}` }); place = place || 'beijing';
        // przesiadka w drodze tam: plan wyjscia na miasto (szczegoly w karcie Pekinu)
        if (li === 0) ev.push({ k: '', v: `${t('day.pek.walk')} <button type="button" class="linkbtn" data-open="beijing">${t('day.pek.open')}</button>`, raw: true });
      } });
      if (d === TRIP.layovers[1].from.slice(0, 10)) {
        place = 'greatwall';
        if (TRIP.layovers[1].tour) ev.push({ k: '09:00', v: K.tx(TRIP.layovers[1].tour).replace(/^09:00\s*·\s*/, '') });
        ev.push({ k: '', v: K.tx(P.greatwall.why) });
        blocks += wallForm();
      }
      st.forEach(s => {
        if (s.checkIn <= d && d < s.checkOut) {
          place = s.place; const i = Math.round((new Date(d) - new Date(s.checkIn)) / 864e5);
          if (i === 0) ev.push({ k: t('night'), v: K.tx(s.data.arrive) });
          else ev.push({ k: '', v: s.data.days[i - 1] ? K.tx(s.data.days[i - 1]) : t('day.free') });
          if (i === 0) blocks += resForm('st:' + s.id, 'stay', s.place);
        }
        if (s.id === 'pp2' && s.checkOut === d) {
          place = s.place;
          if (s.data.days[0]) ev.push({ k: '', v: K.tx(s.data.days[0]) });
          ev.push({ k: '', v: K.tx(s.data.leave) });
        }
        if (s.checkOut === d && s.id !== 'pp2') { leavePlace = leavePlace || s.place; const li2 = Math.round((new Date(d) - new Date(s.checkIn)) / 864e5); if (s.data.days[li2 - 1]) ev.push({ k: '', v: K.tx(s.data.days[li2 - 1]) }); }
        if (s.checkOut === d && s.id !== 'pp2' && !trs.some(tr => tr.date === d && tr.from.id === s.id && TRIP.transfers[tr.key]?.pending)) ev.push({ k: '', v: K.tx(s.data.leave) });
      });
      trs.forEach(tr => {
        if (tr.date !== d) return;
        const night = K.isNight(tr.key);
        const pending = TRIP.transfers[tr.key]?.pending ? ` <span class="pill-pending">${t('pending')}</span>` : '';
        ev.push({ k: tr.mode === 'ferry' ? t('ferry') : t('bus'), v: `${K.tx(tr.text)}` + (night ? ` <span class="tag tag--night">${t('nightbus')}</span>` : '') + pending, raw: true });
        blocks += resForm('tr:' + tr.key, 'trans', tr.to.place);
      });
      trs.filter(tr => K.isNight(tr.key) && tr.to.checkIn === d).forEach(tr => {
        place = tr.to.place;
        ev.push({ k: t('arr'), v: `${pname(tr.to.place)}. ${K.tx(tr.to.data.arrive)}` });
      });
      if (!place) place = leavePlace || 'vienna';
      const firstPlaceDay = !seenPlaces.has(place);
      seenPlaces.add(place);
      const dayLede = firstPlaceDay && P[place].lede ? `<p class="day__lede">${esc(K.tx(P[place].lede))}</p>` : '';
      const dayTips = firstPlaceDay && P[place].experiences?.length
        ? `<div class="day__tips"><b>${t('day.tips')}</b><ul>${P[place].experiences.slice(0, 3).map(x => `<li>${esc(K.tx(x.t))}</li>`).join('')}</ul></div>` : '';
      ev.forEach((x, i) => { x._order = i; });
      ev.sort((a, b) => {
        const at = /^\d{2}:\d{2}$/.test(a.k) ? a.k : '99:99';
        const bt = /^\d{2}:\d{2}$/.test(b.k) ? b.k : '99:99';
        return at.localeCompare(bt) || a._order - b._order;
      });
      const expN = K.liveExpenses().filter(e => e.day === d).length;
      return `<li class="day" id="day-${d}">
        <div class="day__date"><b>${+d.slice(8)}.${d.slice(5, 7)}</b><span>${K.fmtDay(d, true).split(' ')[0]}</span></div>
        <div class="day__body"><h4>${esc((d === '2026-10-31' || d === '2026-11-12') ? (K.lang === 'en' ? 'Vienna / Brussels' : 'Wiedeń / Bruksela') : pname(place))}</h4>${dayLede}${dayTips}
          <ul class="day__ev">${ev.map(x => `<li><span class="k ${x.fl ? 'is-flight' : ''}">${esc(x.k)}</span><span>${x.raw ? x.v : esc(x.v)}</span></li>`).join('')}</ul>
          ${blocks}
          <div class="day__actions"><button type="button" class="btn" data-open="${place}">${t('day.open')}</button>
            <button type="button" class="btn" data-addexp="${place}" data-day="${d}">${t('place.addexp')}${expN ? ` (${expN})` : ''}</button></div>
        </div></li>`;
    }).join('');
    $('#days').innerHTML = html;
    $$('#days details[data-key]').forEach(dt => { if (openState.has(dt.dataset.key)) dt.open = true; });
  }
  $('#days').addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o) return openPlace(o.dataset.open, o);
    const a = e.target.closest('[data-addexp]'); if (a) startExpense({ place: a.dataset.addexp, day: a.dataset.day });
  });

  /* ================================================================ karta miejsca */
  const dlg = $('#placecard'); let dlgPlace = null, dlgReturn = null, photoRender = 0;
  let photoUrls = [];
  function clearPhotoUrls() { photoUrls.forEach(URL.revokeObjectURL); photoUrls = []; }
  function openPlace(id, from) {
    dlgPlace = id; dlgReturn = from || document.activeElement;
    renderPlace();
    if (!dlg.open) dlg.showModal();
    $('.pc__close', dlg)?.focus();
  }
  dlg.addEventListener('close', () => { photoRender++; clearPhotoUrls(); dlgPlace = null; if (dlgReturn && dlgReturn.focus) dlgReturn.focus(); });
  function updateCardScrollHint() { dlg.classList.toggle('is-at-end', dlg.scrollTop + dlg.clientHeight >= dlg.scrollHeight - 8); }
  dlg.addEventListener('scroll', updateCardScrollHint, { passive: true });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  function recList(arr, showDist) { return arr && arr.length ? `<ul class="recs">${arr.map(r => `<li><b>${esc(K.tx(r.t))}</b>${showDist && r.dist ? `<small class="dist">${esc(K.tx(r.dist))}</small>` : ''}<span>${esc(K.tx(r.d))}</span></li>`).join('')}</ul>` : `<p class="hint">${t('none')}</p>`; }
  function photoCaption(ph) {
    return K.clean(ph.cap ? K.tx(ph.cap) : String(ph.credit || '').replace(/^Wikimedia Commons\s*[\u2014-]\s*/, ''));
  }
  function photoFigure(ph, cls) {
    const cap = photoCaption(ph);
    const src = safeUrl(ph.src);
    const small = ph.small && /\.webp(?:$|\?)/i.test(src) ? src.replace(/\.webp(\?.*)?$/i, '-s.webp$1') : '';
    return `<figure class="pc-fig ${cls || ''}"><img src="${esc(src)}"${small ? ` srcset="${esc(small)} 900w, ${esc(src)} 1600w" sizes="(max-width: 720px) 100vw, 56rem"` : ''} alt="${esc(cap)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.closest('figure').hidden=true"><figcaption>${esc(cap)}</figcaption></figure>`;
  }
  function photoSources(photos) {
    if (!photos.length) return '';
    return `<section class="pc__sources full"><h3>${t('place.sources')}</h3><ol>${photos.map(ph => {
      const cap = photoCaption(ph);
      const by = ph.gen ? t('place.generated') : [ph.author || t('place.commons'), ph.license].filter(Boolean).join(' · ');
      const page = safeUrl(ph.page);
      return `<li>${esc(cap)} · ${page ? `<a href="${esc(page)}" target="_blank" rel="noopener">${esc(by)}</a>` : esc(by)}</li>`;
    }).join('')}</ol></section>`;
  }
  function legacyPhotoFigure(link) {
    const cap = link.label || pname(dlgPlace);
    return `<figure class="pc-userfig"><img src="${esc(safeUrl(link.url))}" alt="${esc(cap)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('figure').hidden=true"><figcaption>${esc(link.label || '')}</figcaption></figure>`;
  }
  function renderStoredPhotos(place, token) {
    const box = $('[data-userphotos]', dlg);
    if (!box || !window.KPhotos) return;
    KPhotos.list(place).then(rows => {
      if (token !== photoRender || place !== dlgPlace || !box.isConnected) return;
      rows.forEach(rec => {
        box.hidden = false;
        const fig = document.createElement('figure'); fig.className = 'pc-userfig'; fig.dataset.photoid = rec.id;
        const img = document.createElement('img'); const url = URL.createObjectURL(rec.blob); photoUrls.push(url);
        img.src = url; img.alt = rec.caption || t('place.userphoto.alt'); img.loading = 'lazy';
        img.addEventListener('error', () => { fig.hidden = true; });
        const caption = document.createElement('figcaption');
        const input = document.createElement('input'); input.type = 'text'; input.value = rec.caption || '';
        input.placeholder = t('place.caption.ph'); input.setAttribute('aria-label', t('place.caption'));
        input.dataset.photocaption = rec.id;
        const del = document.createElement('button'); del.type = 'button'; del.className = 'pc-userfig__delete';
        del.dataset.delphoto = rec.id; del.textContent = t('delete');
        caption.append(input, del); fig.append(img, caption); box.append(fig);
      });
    }).catch(() => {
      if (token === photoRender) $('[data-photo-status]', dlg).textContent = t('place.photo.db.error');
    });
  }
  function renderPlace() {
    const id = dlgPlace; if (!id) return; const p = P[id];
    clearPhotoUrls(); const token = ++photoRender;
    const dates = K.placeDates(id).map(d => K.fmtRange(d.a, d.b) + (d.n != null ? ` (${d.n} ${t('nights.n')})` : d.dur ? ` (${d.dur})` : '')).join(', ');
    const links = K.liveLinks().filter(l => l.place === id);
    const userPhotos = links.filter(l => l.photo && safeUrl(l.url));
    const notes = K.liveNotes().filter(n => n.place === id).sort((a, b) => b.ts - a.ts);
    const exps = K.liveExpenses().filter(e => e.place === id);
    const sum = exps.reduce((a, e) => a + K.toEUR(e.amount, e.cur), 0);
    const stays = K.placeDates(id).filter(d => d.stay);
    const story = K.tx(p.story || p.why).split(/\n\s*\n/).map(x => `<p>${esc(x)}</p>`).join('');
    const placePhotos = (p.photos || []).filter(ph => safeUrl(ph.src));
    let photoIndex = placePhotos.length ? 1 : 0;
    const inlinePhoto = () => photoIndex < placePhotos.length ? photoFigure(placePhotos[photoIndex], `pc-fig--float pc-fig--${photoIndex++ % 2 ? 'right' : 'left'}`) : '';
    const content = [];
    content.push(`<section class="full pc-copy"><h3>${t('place.why')}</h3>${inlinePhoto()}${story}${p.warn ? `<p class="warn"><b>${t('place.warn')}:</b> ${esc(K.tx(p.warn))}</p>` : ''}</section>`);
    if ((p.highlights || []).length) content.push(`<section><h3>${t('place.top')}</h3>${inlinePhoto()}${recList(p.highlights)}</section>`);
    if ((p.experiences || []).length) content.push(`<section><h3>${t('place.exp')}</h3>${inlinePhoto()}${recList(p.experiences)}</section>`);
    if ((p.nearby || []).length) content.push(`<section class="full"><h3>${t('place.near')}</h3>${inlinePhoto()}${recList(p.nearby, true)}</section>`);
    if ((p.urbex || []).length) content.push(`<section><h3>${t('place.urbex')}</h3>${inlinePhoto()}${recList(p.urbex)}</section>`);
    if ((p.wild || []).length) content.push(`<section><h3>${t('place.wild')}</h3>${inlinePhoto()}${recList(p.wild)}</section>`);
    const remaining = placePhotos.slice(photoIndex);
    $('#placecard-body').innerHTML = `<article class="pc">
      <header class="pc__head"><div><h2 id="pc-title">${esc(pname(id))}</h2><p>${esc(K.tx(p.country))} · ${esc(dates)}</p></div>
        <button type="button" class="pc__close" aria-label="${t('close')}"><span class="visually-hidden">${t('close')}</span></button></header>
      ${p.lede ? `<p class="pc__lede">${esc(K.tx(p.lede))}</p>` : ''}
      ${p.mood ? `<p class="pc__mood">${esc(K.tx(p.mood))}</p>` : ''}
      ${placePhotos.length ? photoFigure(placePhotos[0], 'pc-fig--wide') : ''}
      <div class="pc__grid">
        ${content.join('')}
        ${id === 'greatwall' ? `<section class="full">${wallForm()}</section>` : ''}
        ${stays.map(s => `<section class="full">${resForm('st:' + s.stay, 'stay', id)}</section>`).join('')}
        ${remaining.length ? `<section class="pc-contact full">${remaining.map(ph => photoFigure(ph, '')).join('')}</section>` : ''}
        <section class="pc-userphotos full"><h3>${t('place.userphotos')}</h3>
          <label class="pc-upload"><span>${t('place.photo.add')}</span><input class="visually-hidden" type="file" accept="image/*" multiple data-photo-input></label>
          <p class="pc-upload__note">${t('place.photo.private')}</p><p class="pc-photo-status" data-photo-status aria-live="polite"></p>
          <div class="pc-userphotos__grid" data-userphotos ${userPhotos.length ? '' : 'hidden'}>${userPhotos.map(legacyPhotoFigure).join('')}</div>
          <details class="pc-linkdetails"><summary>${t('place.link.toggle')}</summary>
            <form class="field" data-link>
              <label class="field"><span>${t('place.addurl')}</span><input name="url" type="text" inputmode="url" required></label>
              <label class="field"><span>${t('place.addlabel')}</span><input name="label" type="text"></label>
              <label class="check"><input type="checkbox" name="photo"> ${t('place.asphoto')}</label>
              <button class="btn btn--primary" type="submit">${t('place.add')}</button>
            </form>
            <ul class="links">${links.map(l => `<li>${safeUrl(l.url) ? `<a href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener">${esc(l.label || l.url)}</a>` : esc(l.label || l.url)} <button type="button" class="btn btn--ghost" data-dellink="${l.id}">${t('delete')}</button></li>`).join('')}</ul>
          </details>
        </section>
        <section class="full"><h3>${t('place.notes')}</h3>
          <form class="field" data-note>
            <label class="field"><span>${t('place.who')}</span><select name="who">${TRIP.travelers.map(x => `<option value="${x.id}" ${K.me === x.id ? 'selected' : ''}>${x.name}</option>`).join('')}</select></label>
            <label class="field"><span class="visually-hidden">${t('place.notes')}</span><textarea name="text" rows="3" placeholder="${t('place.note.ph')}"></textarea></label>
            <button class="btn btn--primary" type="submit">${t('place.addnote')}</button>
          </form>
          <ul class="notes">${notes.map(n => `<li><header><b>${esc(K.person(n.who).name)}</b><span>${new Date(n.ts).toLocaleString(K.lang === 'en' ? 'en-GB' : 'pl-PL', { dateStyle: 'short', timeStyle: 'short' })} <button type="button" class="btn btn--ghost" data-delnote="${n.id}">${t('delete')}</button></span></header><p>${esc(n.text)}</p></li>`).join('')}</ul>
        </section>
        <section class="full"><h3>${t('place.money')}: ${K.money(sum)}</h3>
          ${exps.length ? `<ul class="recs">${exps.map(e => `<li><b>${esc(e.desc)}</b><span>${K.money(Number(e.amount), e.cur)}${e.cur !== 'EUR' ? ` · ≈ ${K.money(K.toEUR(e.amount, e.cur))}` : ''} · ${esc(K.person(e.payer).name)}${e.day ? ' · ' + K.dm(e.day) : ''}</span></li>`).join('')}</ul>` : ''}
          <p><button type="button" class="btn btn--accent" data-addexp="${id}">${t('place.addexp')}</button></p>
        </section>${photoSources(placePhotos)}
      </div></article>`;
    requestAnimationFrame(updateCardScrollHint);
    renderStoredPhotos(id, token);
  }
  dlg.addEventListener('click', e => {
    if (e.target.closest('.pc__close')) return dlg.close();
    const dp = e.target.closest('[data-delphoto]');
    if (dp) {
      if (confirm(t('place.photo.remove'))) KPhotos.remove(dp.dataset.delphoto).then(renderPlace).catch(() => toast(t('place.photo.db.error')));
      return;
    }
    const dn = e.target.closest('[data-delnote]'); if (dn) { K.state.deleted.push(dn.dataset.delnote); K.save(); return; }
    const dl = e.target.closest('[data-dellink]'); if (dl) { K.state.deleted.push(dl.dataset.dellink); K.save(); return; }
    const ax = e.target.closest('[data-addexp]'); if (ax) { dlg.close(); startExpense({ place: ax.dataset.addexp }); }
  });
  dlg.addEventListener('change', async e => {
    if (e.target.matches('[data-photocaption]')) {
      try { await KPhotos.setCaption(e.target.dataset.photocaption, e.target.value); }
      catch (err) { toast(t('place.photo.db.error')); }
      return;
    }
    if (!e.target.matches('[data-photo-input]')) return;
    const input = e.target; const files = Array.from(input.files || []); if (!files.length) return;
    const place = dlgPlace; const status = $('[data-photo-status]', dlg);
    if (!window.KPhotos) { status.textContent = t('place.photo.db.error'); return; }
    status.textContent = t('place.photo.working'); input.disabled = true;
    let failed = 0;
    for (const file of files) {
      try { await KPhotos.add(place, file); } catch (err) { failed++; }
    }
    input.disabled = false; input.value = '';
    if (place !== dlgPlace) return;
    if (failed === files.length) { status.textContent = t('place.photo.bad'); return; }
    const result = failed ? t('place.photo.somebad', { n: failed }) : t('place.photo.done');
    renderPlace();
    const freshStatus = $('[data-photo-status]', dlg); if (freshStatus) freshStatus.textContent = result;
  });
  dlg.addEventListener('submit', e => {
    e.preventDefault(); const f = e.target; const fd = new FormData(f);
    if (f.hasAttribute('data-note')) {
      const text = String(fd.get('text') || '').trim(); if (!text) return f.querySelector('textarea').focus();
      K.setMe(fd.get('who'));
      K.state.notes.push({ id: K.uid(), place: dlgPlace, who: fd.get('who'), text, ts: Date.now() }); K.save();
      $('[data-note] textarea', dlg)?.focus();
    }
    if (f.hasAttribute('data-link')) {
      const url = String(fd.get('url') || '').trim(); if (!url) return f.querySelector('input').focus();
      K.state.links.push({ id: K.uid(), place: dlgPlace, url, label: String(fd.get('label') || '').trim(), photo: !!fd.get('photo'), ts: Date.now() }); K.save();
    }
  });

  /* ================================================================ wydatki */
  let editing = null; // id
  let currencyManuallyChanged = false;
  const expform = $('#expform');
  const CAMBODIA_PLACES = new Set(['phnompenh', 'siemreap', 'sihanoukville', 'kohrong', 'kohrongsamloem']);
  const CHINA_PLACES = new Set(['beijing', 'greatwall']);
  function placeOptions(sel) {
    const seen = new Set(); const order = K.route().filter(p => !seen.has(p) && seen.add(p));
    return `<option value="">${t('exp.general')}</option>` + order.map(p => `<option value="${p}" ${sel === p ? 'selected' : ''}>${esc(pname(p))}</option>`).join('');
  }
  function dayOptions(sel) { return `<option value="">${t('exp.day.none')}</option>` + K.dayList().map(d => `<option value="${d}" ${sel === d ? 'selected' : ''}>${K.fmtDay(d, true)}</option>`).join(''); }
  function currencyForPlace(place) {
    if (CAMBODIA_PLACES.has(place)) return 'USD';
    if (CHINA_PLACES.has(place)) return 'CNY';
    return lastCur();
  }
  function renderForm(pre) {
    const e = pre || {};
    const split = e.split || 'eq';
    currencyManuallyChanged = !!editing || !!e.cur;
    const currency = e.cur || currencyForPlace(e.place);
    expform.innerHTML = `
      <h3 class="h3">${t(editing ? 'exp.edit' : 'exp.h')}</h3>
      <label class="field"><span>${t('exp.desc')}</span><input name="desc" type="text" value="${esc(e.desc || '')}" placeholder="${t('exp.desc.ph')}" autocomplete="off" aria-describedby="err-desc"><span class="err" id="err-desc" aria-live="polite"></span></label>
      <div class="row2">
        <label class="field"><span>${t('exp.amount')}</span><input name="amount" type="text" inputmode="decimal" value="${esc(e.amount != null ? e.amount : '')}" placeholder="${t('exp.amount.ph')}" aria-describedby="err-amount"><span class="err" id="err-amount" aria-live="polite"></span></label>
        <label class="field"><span>${t('exp.cur')}</span><select name="cur">${K.CURS.map(c => `<option ${currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
      </div>
      <label class="field"><span>${t('exp.cat')}</span><select name="cat">${CATS.map(c => `<option value="${c}" ${(e.cat || 'food') === c ? 'selected' : ''}>${t('cat.' + c)}</option>`).join('')}</select></label>
      <fieldset class="field" style="border:0;padding:0;margin:0"><legend>${t('exp.payer')}</legend>
        <div class="seg">${TRIP.travelers.map(p => `<label><input type="radio" name="payer" value="${p.id}" ${(e.payer || K.me) === p.id ? 'checked' : ''}><span>${p.name}</span></label>`).join('')}</div></fieldset>
      <fieldset class="field" style="border:0;padding:0;margin:0"><legend>${t('exp.split')}</legend>
        <div class="seg"><label><input type="radio" name="split" value="eq" ${split === 'eq' ? 'checked' : ''}><span>${t('exp.split.eq')}</span></label><label><input type="radio" name="split" value="custom" ${split === 'custom' ? 'checked' : ''}><span>${t('exp.split.custom')}</span></label></div></fieldset>
      <label class="field" ${split === 'custom' ? '' : 'hidden'} data-share><span>${t('exp.shareD')}</span><input name="shareD" type="number" min="0" max="100" step="1" inputmode="numeric" value="${esc(e.shareD != null ? e.shareD : 50)}"></label>
      <div class="row2">
        <label class="field"><span>${t('exp.place')}</span><select name="place">${placeOptions(e.place)}</select></label>
        <label class="field"><span>${t('exp.day')}</span><select name="day">${dayOptions(e.day)}</select></label>
      </div>
      <div class="actions"><button class="btn btn--accent" type="submit" disabled>${t('exp.save')}</button>${editing ? `<button class="btn" type="button" data-cancel>${t('exp.cancel')}</button>` : ''}</div>`;
    updateExpenseSubmit();
  }
  function updateExpenseSubmit() {
    const desc = String($('[name="desc"]', expform)?.value || '').trim();
    const amount = parseFloat(String($('[name="amount"]', expform)?.value || '').replace(/\s/g, '').replace(',', '.'));
    const submit = $('[type="submit"]', expform);
    if (submit) submit.disabled = !desc || !(amount > 0);
  }
  function lastCur() { const l = K.liveExpenses().slice(-1)[0]; return l ? l.cur : 'EUR'; }
  expform.addEventListener('change', e => {
    if (e.target.name === 'split') $('[data-share]', expform).hidden = e.target.value !== 'custom';
    if (e.target.name === 'cur') currencyManuallyChanged = true;
    if (e.target.name === 'place' && !currencyManuallyChanged) $('[name="cur"]', expform).value = currencyForPlace(e.target.value);
    updateExpenseSubmit();
  });
  expform.addEventListener('input', updateExpenseSubmit);
  expform.addEventListener('click', e => { if (e.target.closest('[data-cancel]')) { editing = null; renderForm(); } });
  expform.addEventListener('submit', e => {
    e.preventDefault(); const fd = new FormData(expform);
    const desc = String(fd.get('desc') || '').trim();
    const amount = parseFloat(String(fd.get('amount') || '').replace(/\s/g, '').replace(',', '.'));
    let bad = null;
    $('#err-desc').textContent = ''; $('#err-amount').textContent = '';
    $$('[aria-invalid]', expform).forEach(x => x.removeAttribute('aria-invalid'));
    if (!desc) { $('#err-desc').textContent = t('exp.err.desc'); $('[name="desc"]', expform).setAttribute('aria-invalid', 'true'); bad = bad || 'desc'; }
    if (!(amount > 0)) { $('#err-amount').textContent = t('exp.err.amount'); $('[name="amount"]', expform).setAttribute('aria-invalid', 'true'); bad = bad || 'amount'; }
    if (bad) return $(`[name="${bad}"]`, expform).focus();
    const rec = { desc, amount: Math.round(amount * 100) / 100, cur: fd.get('cur'), cat: fd.get('cat'), payer: fd.get('payer'), split: fd.get('split'),
      shareD: fd.get('split') === 'custom' ? Math.min(100, Math.max(0, Number(fd.get('shareD')) || 0)) : 50, place: fd.get('place') || '', day: fd.get('day') || '', updated: Date.now() };
    if (editing) { const i = K.state.expenses.findIndex(x => x.id === editing); if (i > -1) K.state.expenses[i] = Object.assign({}, K.state.expenses[i], rec); }
    else K.state.expenses.push(Object.assign({ id: K.uid(), ts: Date.now() }, rec));
    K.setMe(rec.payer);
    editing = null; K.save(); renderForm(); toast(t('res.saved'));
    $('[name="desc"]', expform).focus();
  });
  function startExpense(pre) {
    editing = null; selectTab($('#tab-money')); renderForm(Object.assign({}, pre));
    $('#planner').scrollIntoView({ block: 'start' });
    setTimeout(() => $('[name="desc"]', expform).focus(), 30);
  }
  let filter = '';
  function renderMoney() {
    const ex = K.liveExpenses();
    const total = ex.reduce((a, e) => a + K.toEUR(e.amount, e.cur), 0);
    const byCat = CATS.map(c => [c, ex.filter(e => e.cat === c).reduce((a, e) => a + K.toEUR(e.amount, e.cur), 0)]);
    const max = Math.max(1, ...byCat.map(x => x[1]));
    const paid = K.IDS.map(id => [id, ex.filter(e => e.payer === id).reduce((a, e) => a + K.toEUR(e.amount, e.cur), 0)]);
    const bal = K.balance(); const eps = 0.005;
    const settle = !ex.length ? t('exp.none') : Math.abs(bal) < eps ? t('exp.even')
      : bal > 0 ? t('exp.owes', { a: 'Oksana', b: K.dative('dominika'), x: K.money(bal) })
      : t('exp.owes', { a: 'Dominika', b: K.dative('oksana'), x: K.money(-bal) });
    let localMoney = $('#local-money');
    if (!localMoney) {
      localMoney = document.createElement('details');
      localMoney.id = 'local-money'; localMoney.className = 'local-money';
      $('#panel-money').insertBefore(localMoney, $('.money', $('#panel-money')));
    }
    localMoney.innerHTML = `<summary>${t('money.local')}</summary><div>${Object.values(TRIP.money).map(x => `<p>${esc(K.tx(x))}</p>`).join('')}</div>`;
    const rateNumber = value => new Intl.NumberFormat(K.lang === 'en' ? 'en-GB' : 'pl-PL', { maximumFractionDigits: 6 }).format(value);
    const ratesLine = t('exp.ratesline', { usd: rateNumber(K.state.rates.USD), cny: rateNumber(K.state.rates.CNY), khr: rateNumber(K.state.rates.KHR * 1000) });
    $('#summary').innerHTML = `
      <div class="settle"><small>${t('exp.settle')}</small>${esc(settle)}<span class="settle__rates">${esc(ratesLine)}</span></div>
      <table class="ledger"><caption>${t('exp.bycat')}</caption><tbody>
        ${byCat.map(([c, v]) => `<tr><th scope="row">${t('cat.' + c)}<span class="bar" style="transform:scaleX(${(v / max).toFixed(3)})" aria-hidden="true"></span></th><td class="num">${K.money(v)}</td></tr>`).join('')}
      </tbody><tfoot><tr><td>${t('exp.total')}</td><td class="num">${K.money(total)}</td></tr></tfoot></table>
      <table class="ledger"><caption>${t('exp.paid')}</caption><tbody>${paid.map(([id, v]) => `<tr><th scope="row">${K.person(id).name}</th><td class="num">${K.money(v)}</td></tr>`).join('')}</tbody></table>`;
    const seen = new Set(); const places = K.route().filter(p => !seen.has(p) && seen.add(p));
    const list = ex.filter(e => filter === '' ? true : filter === '_g' ? !e.place : e.place === filter).sort((a, b) => (b.day || '').localeCompare(a.day || '') || b.ts - a.ts);
    $('#explist').innerHTML = `
      <div class="explist__head"><h3 class="h3">${t('exp.list')}</h3>
        <label class="field"><span>${t('exp.filter')}</span><select id="expfilter"><option value="">${t('exp.all')}</option><option value="_g" ${filter === '_g' ? 'selected' : ''}>${t('exp.general')}</option>${places.map(p => `<option value="${p}" ${filter === p ? 'selected' : ''}>${esc(pname(p))}</option>`).join('')}</select></label></div>
      ${list.length ? `<table class="ledger"><thead><tr><th scope="col">${t('exp.desc')}</th><th scope="col" class="num">${t('exp.amount')}</th><th scope="col"><span class="visually-hidden">${t('edit')}</span></th></tr></thead><tbody>
        ${list.map(e => `<tr><td>${esc(e.desc)}<span class="meta">${t('cat.' + e.cat)} · ${esc(K.person(e.payer).name)} · ${e.split === 'custom' ? `D ${e.shareD}% / O ${100 - e.shareD}%` : '50/50'}${e.place ? ' · ' + esc(pname(e.place)) : ''}${e.day ? ' · ' + K.dm(e.day) : ''}</span></td>
          <td class="num">${K.money(Number(e.amount), e.cur)}${e.cur !== 'EUR' ? `<span class="meta">≈ ${K.money(K.toEUR(e.amount, e.cur))}</span>` : ''}</td>
          <td><div class="act"><button type="button" class="btn" data-edit="${e.id}">${t('edit')}</button><button type="button" class="btn btn--danger" data-del="${e.id}">${t('delete')}</button></div></td></tr>`).join('')}
      </tbody></table>` : `<p class="hint">${t('exp.empty')}</p>`}`;
  }
  $('#explist').addEventListener('change', e => { if (e.target.id === 'expfilter') { filter = e.target.value; renderMoney(); $('#expfilter').focus(); } });
  $('#explist').addEventListener('click', e => {
    const ed = e.target.closest('[data-edit]');
    if (ed) { editing = ed.dataset.edit; renderForm(K.state.expenses.find(x => x.id === editing)); $('[name="desc"]', expform).focus(); return; }
    const dl = e.target.closest('[data-del]');
    if (dl && confirm(t('exp.confirmdel'))) { K.state.deleted.push(dl.dataset.del); if (editing === dl.dataset.del) editing = null; K.save(); renderForm(); }
  });

  /* ================================================================ dane */
  let syncStatusBound = false;
  function syncStatusText(status) {
    if (!status || status.state === 'off') return '';
    if (status.state === 'syncing') return t('sync.syncing');
    if (status.state === 'offline') return t('sync.offline');
    if (status.state === 'error') return t('sync.error');
    if (status.last) return t('sync.synced', { time: new Date(status.last).toLocaleTimeString(K.lang === 'en' ? 'en-GB' : 'pl-PL', { hour: '2-digit', minute: '2-digit' }) });
    return t('sync.idle');
  }
  function updateSyncStatus(status) {
    const el = $('#sync-status');
    if (el) el.textContent = syncStatusText(status || (window.KSync && KSync.status()));
  }
  function renderData() {
    const s = K.state;
    const nres = Object.keys(s.res).filter(k => Object.values(s.res[k] || {}).some(v => v && v !== true && typeof v === 'string')).length;
    const sync = window.KSync && KSync.enabled() ? KSync.status() : null;
    $('#datap').innerHTML = `
      <section><h3 class="h3">${t('sync.shared')}</h3>
        ${sync ? `<p class="hint" id="sync-status" aria-live="polite">${esc(syncStatusText(sync))}</p>
          <p class="hint">${esc(t('sync.key', { key: sync.keyHint }))}</p>
          <button type="button" class="btn btn--primary" id="btn-sync-now">${t('sync.now')}</button>
          <button type="button" class="btn" id="btn-sync-disconnect">${t('sync.disconnect')}</button>` :
          `<p class="hint">${t('sync.description')}</p>
          <label class="field"><span>${t('sync.input')}</span><input id="sync-connect-value" autocomplete="off"></label>
          <button type="button" class="btn btn--primary" id="btn-sync-connect">${t('sync.connect')}</button>
          <p class="hint" id="sync-status" aria-live="polite"></p>`}
      </section>
      <section><h3 class="h3">${t('data.export')}</h3>
        <p class="hint">${t('data.stats', { e: plural('e', K.liveExpenses().length), n: plural('n', K.liveNotes().length), r: plural('r', nres) })}</p>
        <label class="field"><span>${t('data.who')}</span><select id="mesel">${TRIP.travelers.map(p => `<option value="${p.id}" ${K.me === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}</select></label>
        <button type="button" class="btn btn--primary" id="btn-export">${t('data.export')}</button>
      </section>
      <section><h3 class="h3">${t('data.import')}</h3>
        <fieldset class="field" style="border:0;padding:0;margin:0"><legend>${t('data.mode')}</legend>
          <div class="seg"><label><input type="radio" name="imode" value="merge" checked><span>${t('data.merge')}</span></label><label><input type="radio" name="imode" value="replace"><span>${t('data.replace')}</span></label></div></fieldset>
        <label class="btn" for="file-import">${t('data.import')}</label>
        <input type="file" id="file-import" accept="application/json,.json" class="visually-hidden">
        <p class="hint" id="import-msg" aria-live="polite"></p>
        <button type="button" class="btn btn--danger" id="btn-reset">${t('data.reset')}</button>
      </section>
      <section><h3 class="h3">${t('data.rates')}</h3><p class="hint">${t('data.rates.help')}</p>
        <div class="rates">${K.CURS.filter(c => c !== 'EUR').map(c => `<label class="field"><span>1 ${c} =</span><input type="number" step="any" min="0" data-rate="${c}" value="${s.rates[c]}"></label>`).join('')}</div>
      </section>
      ${window.PWA ? `<section class="offline-help"><h3 class="h3">${K.lang === 'en' ? 'Offline on your phone' : 'Bez internetu na telefonie'}</h3>
        ${PWA.installHelpHTML(K.lang)}
        ${PWA.canInstall() ? `<button type="button" class="btn btn--primary" id="btn-install">${K.lang === 'en' ? 'Install the app' : 'Zainstaluj aplikację'}</button>` : ''}
      </section>` : ''}`;
    if (window.KSync && !syncStatusBound) {
      syncStatusBound = true;
      KSync.onStatus(updateSyncStatus);
    }
  }
  $('#datap').addEventListener('click', e => { if (e.target.id === 'btn-install' && window.PWA) PWA.install().then(renderData); });
  $('#datap').addEventListener('change', e => {
    if (e.target.id === 'mesel') K.setMe(e.target.value);
    if (e.target.dataset.rate) { const v = parseFloat(e.target.value); if (v >= 0) { K.state.rates[e.target.dataset.rate] = v; quietSave(); renderMoney(); } }
    if (e.target.id === 'file-import') {
      const file = e.target.files[0]; if (!file) return;
      const mode = ($('input[name="imode"]:checked', $('#datap')) || {}).value || 'merge';
      file.text().then(txt => {
        try { const r = K.importData(JSON.parse(txt), mode); const rr = { e: plural('e', r.e), n: plural('n', r.n) }; $('#import-msg').textContent = t('data.ok', rr); toast(t('data.ok', rr)); }
        catch (err) { $('#import-msg').textContent = t('data.bad'); }
      });
      e.target.value = '';
    }
  });
  $('#datap').addEventListener('click', e => {
    if (e.target.id === 'btn-sync-now' && window.KSync) KSync.syncNow();
    if (e.target.id === 'btn-sync-disconnect' && window.KSync) { KSync.disconnect(); renderData(); }
    if (e.target.id === 'btn-sync-connect' && window.KSync) {
      const input = $('#sync-connect-value');
      if (!KSync.connect(input.value)) $('#sync-status').textContent = t('sync.invalid');
      else renderData();
    }
    if (e.target.id === 'btn-export') {
      const blob = new Blob([JSON.stringify(K.exportData(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `kambodza-2026-${K.me}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }
    if (e.target.id === 'btn-reset' && confirm(t('data.reset.q'))) K.reset();
  });

  /* ================================================================ render */
  function renderAll() {
    renderStops(); renderNights(); renderDays(); renderMoney(); renderData();
    if (dlg.open) renderPlace();
    if (window.KGlobe) window.KGlobe.update();
  }
  K.onChange(() => { if (quiet) { renderStops(); renderNights(); renderMoney(); if (window.KGlobe) window.KGlobe.update(); return; } renderAll(); });
  K.onLang(() => { renderForm(editing ? K.state.expenses.find(x => x.id === editing) : null); renderAll(); });
  window.KPlanner = { openPlace, selectTab };
  renderForm(); renderAll();
})();
