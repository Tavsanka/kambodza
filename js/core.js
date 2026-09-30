/* =====================================================================
   RDZEŃ: stan (localStorage), język, plan (daty z liczby nocy), waluty.
   Wspólny dla opowieści (story.js), planera (planner.js) i globusa.
   ===================================================================== */
(function () {
  'use strict';
  const KEY = 'kambodza2026.v1';
  const LANG_KEY = 'kambodza2026.lang';
  const ME_KEY = 'kambodza2026.me';
  const IDS = TRIP.travelers.map(t => t.id);

  /* ------------------------------------------------------------- stan */
  function blank() {
    const seed = TRIP.seed || { expenses: [], res: {} };
    return {
      itinerary: JSON.parse(JSON.stringify(TRIP.defaultItinerary)),
      rates: Object.assign({}, TRIP.defaultRates),
      expenses: JSON.parse(JSON.stringify(seed.expenses || [])),
      notes: [],        // {id, place, who, text, ts, updated}
      links: [],        // {id, place, url, label, photo, ts, updated}
      res: JSON.parse(JSON.stringify(seed.res || {})),
      wall: {},         // {agency,section,meet,time,back,price,cur,updated}
      deleted: [],      // id-y usuniętych wpisów (żeby scalanie ich nie wskrzeszało)
    };
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      return sanitize(JSON.parse(raw));
    } catch (e) { return blank(); }
  }
  function sanitize(s) {
    const b = blank();
    if (!s || typeof s !== 'object') return b;
    const out = Object.assign(b, s);
    ['expenses', 'notes', 'links', 'deleted'].forEach(k => { if (!Array.isArray(out[k])) out[k] = []; });
    if (!out.res || typeof out.res !== 'object') out.res = {};
    if (!out.wall || typeof out.wall !== 'object') out.wall = {};
    const it = out.itinerary || {};
    const def = TRIP.defaultItinerary;
    const validOrder = Array.isArray(it.order) && it.order.length === def.order.length && def.order.every(x => it.order.includes(x));
    const order = validOrder ? it.order : def.order.slice();
    const nights = Object.assign({}, def.nights);
    if (validOrder) Object.keys(nights).forEach(k => { const v = it.nights && Number(it.nights[k]); if (Number.isFinite(v) && v >= 0 && v <= 14) nights[k] = Math.round(v); });
    out.itinerary = { order, nights, transitNights: Object.assign({}, def.transitNights || {}) };
    const deleted = new Set(out.deleted);
    (TRIP.seed?.expenses || []).forEach(e => { if (!deleted.has(e.id) && !out.expenses.some(x => x.id === e.id)) out.expenses.push(JSON.parse(JSON.stringify(e))); });
    Object.keys(TRIP.seed?.res || {}).forEach(k => { if (!out.res[k]) out.res[k] = JSON.parse(JSON.stringify(TRIP.seed.res[k])); });
    out.rates = Object.assign({}, TRIP.defaultRates, out.rates || {});
    return out;
  }
  let state = load();
  const listeners = [];
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* tryb prywatny: pracujemy w pamięci */ }
    listeners.forEach(fn => fn(state));
  }
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ------------------------------------------------------------- język */
  let lang = (function () {
    try { const l = localStorage.getItem(LANG_KEY); if (l === 'pl' || l === 'en') return l; } catch (e) {}
    return 'pl';
  })();
  const langListeners = [];
  function t(key, vars) {
    const e = I18N[key];
    let s = e ? e[lang === 'en' ? 1 : 0] : key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return typo(s);
  }
  // Tekst z data.js ({pl,en}). Myślniki typu em zamieniamy na przecinek (zasada: bez em-dash w widocznym tekście).
  function tx(o) {
    if (o == null) return '';
    const s = typeof o === 'string' ? o : (o[lang] || o.pl || '');
    return clean(s);
  }
  function typo(s) {
    const names = /\b(Phnom Penh|Pub Street|Koh Rong Samloem|Koh Rong|Siem Reap|Angkor Wat|Angkor Thom|Ta Prohm|Giant Ibis|Tonlé Sap|Saracen Bay|Air China)\b/g;
    const text = part => {
      let out = part.replace(names, m => m.replace(/ /g, '\u00a0'));
      let prev;
      do {
        prev = out;
        out = out.replace(/(^|[\s(„"'])([aiouwzAIOUWZ])[ \t\r\n]+(?=\S)/g, '$1$2\u00a0');
      } while (out !== prev);
      return out;
    };
    return String(s).split(/(<[^>]*>)/g).map(part => part.startsWith('<') ? part : text(part)).join('');
  }
  function clean(s) { return typo(String(s).replace(/\s+—\s+/g, ', ').replace(/—/g, ', ')); }
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'pl';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    applyI18n(document);
    langListeners.forEach(fn => fn(lang));
  }
  function applyI18n(root) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (!I18N[k]) return;
      if (el.hasAttribute('data-sc-kinetic')) return;
      el.textContent = t(k);
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))));
    root.querySelectorAll('[data-i18n-ph]').forEach(el => el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))));
  }

  /* ------------------------------------------------------------- kto używa */
  let me = (function () { try { const m = localStorage.getItem(ME_KEY); if (IDS.includes(m)) return m; } catch (e) {} return 'dominika'; })();
  function setMe(id) { if (!IDS.includes(id)) return; me = id; try { localStorage.setItem(ME_KEY, id); } catch (e) {} listeners.forEach(fn => fn(state)); }
  const person = id => TRIP.travelers.find(p => p.id === id) || TRIP.travelers[0];
  const other = id => IDS.find(x => x !== id);
  const DATIVE = { dominika: ['Dominice', 'Dominika'], oksana: ['Oksanie', 'Oksana'] };
  const dative = id => DATIVE[id] ? DATIVE[id][lang === 'en' ? 1 : 0] : person(id).name;

  /* ------------------------------------------------------------- daty */
  const pad = n => String(n).padStart(2, '0');
  function addDays(iso, n) { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function dayList() { const out = []; let d = TRIP.tripStart; while (d <= TRIP.tripEnd) { out.push(d); d = addDays(d, 1); } return out; }
  const WD = { pl: ['niedz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
  const MON = { pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
  function fmtDay(iso, withWd) {
    const d = new Date(iso + 'T12:00:00Z');
    const s = d.getUTCDate() + ' ' + MON[lang][d.getUTCMonth()];
    return withWd ? WD[lang][d.getUTCDay()] + ' ' + s : s;
  }
  const dm = iso => { const [, m, d] = iso.split('-'); return +d + '.' + m; };
  const hm = dt => dt.slice(11, 16);
  function fmtRange(a, b) { // "2–5.11"
    if (!b || a === b) return dm(a);
    const [, ma, da] = a.split('-'); const [, mb, db] = b.split('-');
    return ma === mb ? (+da) + '–' + (+db) + '.' + mb : dm(a) + '–' + dm(b);
  }

  /* ------------------------------------------------------------- plan */
  // Kolejność pobytów: pp1, [środek wg order], pp2. Daty liczone z liczby nocy.
  function stays() {
    const it = state.itinerary;
    const ids = ['pp1'].concat(it.order, ['pp2']);
    let cur = TRIP.cambodiaFirstNight;
    return ids.map((id, i) => {
      if (i) {
        const prevPlace = TRIP.stays[ids[i - 1]].place;
        const key = transferKey(prevPlace, TRIP.stays[id].place);
        cur = addDays(cur, Number(it.transitNights?.[key] || 0));
      }
      const n = it.nights[id] || 0;
      const s = { id, place: TRIP.stays[id].place, nights: n, checkIn: cur, checkOut: addDays(cur, n), data: TRIP.stays[id] };
      cur = s.checkOut;
      return s;
    });
  }
  function nightsTotal() {
    const st = stays();
    const transit = st.slice(1).reduce((sum, s, i) => sum + Number(state.itinerary.transitNights?.[transferKey(st[i].place, s.place)] || 0), 0);
    return st.reduce((a, s) => a + s.nights, 0) + transit;
  }
  function transferKey(a, b) { return a + '>' + b; }
  function transfers() {
    const st = stays(); const out = [];
    for (let i = 1; i < st.length; i++) {
      const a = st[i - 1], b = st[i];
      const key = transferKey(a.place, b.place);
      const def = TRIP.transfers[key] || { mode: 'bus', text: { pl: '', en: '' } };
      out.push({ key, from: a, to: b, date: a.checkOut, mode: def.mode, text: def.text });
    }
    return out;
  }
  // Nocny przejazd: domyślnie Siem Reap -> Sihanoukville (brief: "jeden przejazd to autobus NOCNY").
  const NIGHT_DEFAULT = 'siemreap>sihanoukville';
  function isNight(key) { const r = state.res['tr:' + key]; if (r && typeof r.night === 'boolean') return r.night; return key === NIGHT_DEFAULT; }

  // Kiedy jesteśmy w danym miejscu (dla kart, pinezek, stempli).
  function placeDates(place) {
    const f = TRIP.flights;
    if (place === 'vienna') return [{ a: f[0].dep.slice(0, 10) }, { a: f[3].arr.slice(0, 10) }];
    if (place === 'brussels') return [{ a: f[4].dep.slice(0, 10) }, { a: f[5].arr.slice(0, 10) }];
    if (place === 'beijing') return TRIP.layovers.map(l => ({ a: l.from.slice(0, 10), b: l.to.slice(0, 10), dur: tx(l.dur) }));
    if (place === 'greatwall') return [{ a: TRIP.layovers[1].from.slice(0, 10) }];
    return stays().filter(s => s.place === place).map(s => ({ a: s.checkIn, b: s.checkOut, n: s.nights, stay: s.id }));
  }
  function placeDatesText(place) {
    return placeDates(place).map(d => fmtRange(d.a, d.b)).join(', ');
  }
  // Trasa w kolejności (dla globusa): miejsca i łuki
  function route() {
    const r = ['vienna', 'brussels', 'beijing'];
    stays().forEach(s => { if (r[r.length - 1] !== s.place) r.push(s.place); });
    r.push('beijing', 'greatwall', 'beijing', 'vienna', 'brussels');
    return r;
  }
  function stopsForList() {
    const out = [];
    const f = TRIP.flights;
    out.push({ place: 'vienna', name: { pl: 'Wiedeń / Bruksela', en: 'Vienna / Brussels' }, when: dm(f[0].dep.slice(0, 10)) + ' · VIE ' + hm(f[0].dep) + ' / BRU ' + hm(f[4].dep) });
    out.push({ place: 'beijing', when: dm(TRIP.layovers[0].from.slice(0, 10)) + ' · ' + tx(TRIP.layovers[0].dur) });
    stays().forEach(s => out.push({ place: s.place, stay: s.id, when: fmtRange(s.checkIn, s.checkOut) + ' · ' + s.nights + (lang === 'en' ? ' n' : ' n.') }));
    out.push({ place: 'greatwall', when: dm(TRIP.layovers[1].from.slice(0, 10)) + ' · ' + tx(TRIP.layovers[1].dur) });
    out.push({ place: 'vienna', name: { pl: 'Wiedeń / Bruksela', en: 'Vienna / Brussels' }, when: dm(f[3].arr.slice(0, 10)) + ' · VIE ' + hm(f[3].arr) + ' / BRU ' + hm(f[5].arr) });
    return out;
  }
  const CODES = { vienna: 'VIE/BRU', brussels: 'BRU', beijing: 'PEK', phnompenh: 'PNH', siemreap: 'REP', sihanoukville: 'KOS', kohrong: 'KR', kohrongsamloem: 'KRS', greatwall: 'MUT' };

  /* ------------------------------------------------------------- waluty */
  const CURS = Object.keys(TRIP.defaultRates);
  function toEUR(amount, cur) { const r = Number(state.rates[cur]); return Number(amount) * (Number.isFinite(r) ? r : 0); }
  function money(v, cur) {
    cur = cur || 'EUR';
    try { return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'pl-PL', { style: 'currency', currency: cur, maximumFractionDigits: cur === 'KHR' ? 0 : 2 }).format(v); }
    catch (e) { return v.toFixed(2) + ' ' + cur; }
  }
  function shareOf(e, id) { // udział osoby w wydatku (0..1)
    const sD = e.split === 'custom' ? Math.min(100, Math.max(0, Number(e.shareD))) / 100 : 0.5;
    return id === 'dominika' ? sD : 1 - sD;
  }
  function liveExpenses() { const del = new Set(state.deleted); return state.expenses.filter(e => !del.has(e.id)); }
  function liveNotes() { const del = new Set(state.deleted); return state.notes.filter(e => !del.has(e.id)); }
  function liveLinks() { const del = new Set(state.deleted); return state.links.filter(e => !del.has(e.id)); }
  // Saldo: dodatnie = Oksana winna Dominice
  function balance() {
    let net = 0;
    liveExpenses().forEach(e => {
      const eur = toEUR(e.amount, e.cur);
      if (e.payer === 'dominika') net += eur * shareOf(e, 'oksana');
      else net -= eur * shareOf(e, 'dominika');
    });
    return net;
  }

  /* ------------------------------------------------------------- eksport / import */
  function exportData() {
    return { app: 'kambodza-2026-planner', version: 1, exportedBy: me, exportedAt: new Date().toISOString(), data: state };
  }
  function importData(obj, mode) {
    if (!obj || obj.app !== 'kambodza-2026-planner' || !obj.data) throw new Error('bad');
    const inc = sanitize(obj.data);
    if (mode === 'replace') { state = inc; save(); return { e: liveExpenses().length, n: liveNotes().length }; }
    const del = new Set(state.deleted.concat(inc.deleted));
    const mergeList = (a, b) => {
      const m = new Map();
      a.concat(b).forEach(x => { if (!x || !x.id) return; const p = m.get(x.id); if (!p || (x.updated || x.ts || 0) > (p.updated || p.ts || 0)) m.set(x.id, x); });
      return Array.from(m.values()).filter(x => !del.has(x.id));
    };
    state.expenses = mergeList(state.expenses, inc.expenses);
    state.notes = mergeList(state.notes, inc.notes);
    state.links = mergeList(state.links, inc.links);
    Object.keys(inc.res).forEach(k => { const a = state.res[k], b = inc.res[k]; if (!a || (b.updated || 0) > (a.updated || 0)) state.res[k] = b; });
    if (!state.wall.updated || (inc.wall.updated || 0) > state.wall.updated) state.wall = inc.wall;
    state.deleted = Array.from(del);
    save();
    return { e: inc.expenses.filter(x => !del.has(x.id)).length, n: inc.notes.filter(x => !del.has(x.id)).length };
  }

  /* ------------------------------------------------------------- stemple (SVG) */
  // Definicje stempli: kod, górny/dolny napis, data. Kształty różne jak w prawdziwym paszporcie.
  function stampDefs() {
    const f = TRIP.flights; const L = (pl, en) => lang === 'en' ? en : pl;
    const sd = p => { const d = placeDates(p)[0]; return d ? fmtRange(d.a, d.b) : ''; };
    return {
      'vie-out': { shape: 'circle', code: 'VIE', top: L('WIEDEŃ · WYLOT', 'VIENNA · DEPARTED'), bot: f[0].id + ' · ' + dm(f[0].dep.slice(0, 10)) + '.2026', rot: -9, target: 'ch-vie' },
      'pek-out': { shape: 'rect', code: 'PEK', top: L('TRANZYT', 'TRANSIT'), bot: dm(f[1].dep.slice(0, 10)) + ' · ' + f[1].id, rot: 5, target: 'ch-pek' },
      'pnh-in': { shape: 'oval', code: 'PNH', top: L('KAMBODŻA · PRZYLOT', 'CAMBODIA · ARRIVAL'), bot: dm(f[1].arr.slice(0, 10)) + ' · ' + hm(f[1].arr), rot: -4, target: 'ch-pnh' },
      'rep': { shape: 'double', code: 'REP', top: 'SIEM REAP · ANGKOR', bot: sd('siemreap'), rot: 7, target: 'ch-ank' },
      'kos': { shape: 'rect', code: 'KOS', top: 'SIHANOUKVILLE', bot: sd('sihanoukville'), rot: -6, target: 'ch-isl' },
      'kr': { shape: 'circle', code: 'KR', top: 'KOH RONG', bot: sd('kohrong'), rot: 9, target: 'ch-isl' },
      'krs': { shape: 'hex', code: 'KRS', top: 'KOH RONG SAMLOEM', bot: sd('kohrongsamloem'), rot: -3, target: 'ch-isl' },
      'pnh-out': { shape: 'oval', code: 'KTI', top: L('KAMBODŻA · WYLOT', 'CAMBODIA · DEPARTED'), bot: dm(f[2].dep.slice(0, 10)) + ' · ' + hm(f[2].dep) + ' · ' + f[2].id, rot: 3, target: 'ch-pp2' },
      'mut': { shape: 'hex', code: '长城', top: L('MUR CHIŃSKI', 'GREAT WALL'), bot: dm(TRIP.layovers[1].from.slice(0, 10)) + ' · ' + tx(TRIP.layovers[1].dur), rot: -7, target: 'ch-wall' },
      'vie-in': { shape: 'double', code: 'VIE', top: L('WIEDEŃ · POWRÓT', 'VIENNA · ARRIVED'), bot: f[3].id + ' · ' + dm(f[3].arr.slice(0, 10)) + ' · ' + hm(f[3].arr), rot: -5, target: 'ch-end' },
    };
  }
  const STAMP_ORDER = ['vie-out', 'pek-out', 'pnh-in', 'rep', 'kos', 'kr', 'krs', 'pnh-out', 'mut', 'vie-in'];
  let sid = 0;
  function stampSVG(key, mini) {
    const d = stampDefs()[key]; if (!d) return '';
    const id = 'sp' + (++sid);
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    let frame = '', text = '';
    if (d.shape === 'circle' || d.shape === 'double') {
      frame = `<circle class="ln" cx="60" cy="60" r="55" stroke-width="3.2"/>` +
        (d.shape === 'double' ? `<circle class="ln" cx="60" cy="60" r="49" stroke-width="1"/>` : '') +
        `<circle class="ln" cx="60" cy="60" r="34" stroke-width="1.4"/>`;
      text = `<path id="${id}t" d="M 18 60 A 42 42 0 0 1 102 60" fill="none"/><path id="${id}b" d="M 16 60 A 44 44 0 0 0 104 60" fill="none"/>` +
        `<text class="t-sm"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">${esc(d.top)}</textPath></text>` +
        `<text class="t-sm"><textPath href="#${id}b" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">${esc(d.bot)}</textPath></text>` +
        `<text class="t-big" x="60" y="68" text-anchor="middle">${esc(d.code)}</text>`;
    } else if (d.shape === 'oval') {
      frame = `<ellipse class="ln" cx="60" cy="60" rx="57" ry="40" stroke-width="3"/><ellipse class="ln" cx="60" cy="60" rx="50" ry="33" stroke-width="1"/>`;
      text = `<text class="t-sm" x="60" y="42" text-anchor="middle">${esc(d.top)}</text><text class="t-big" x="60" y="69" text-anchor="middle">${esc(d.code)}</text><text class="t-sm" x="60" y="84" text-anchor="middle">${esc(d.bot)}</text>`;
    } else if (d.shape === 'hex') {
      frame = `<polygon class="ln" points="60,6 108,33 108,87 60,114 12,87 12,33" stroke-width="3"/><polygon class="ln" points="60,14 101,37 101,83 60,106 19,83 19,37" stroke-width="1"/>`;
      text = `<text class="t-sm" x="60" y="44" text-anchor="middle">${esc(d.top)}</text><text class="t-big" x="60" y="70" text-anchor="middle">${esc(d.code)}</text><text class="t-sm" x="60" y="86" text-anchor="middle">${esc(d.bot)}</text>`;
    } else {
      frame = `<rect class="ln" x="8" y="22" width="104" height="76" rx="4" stroke-width="3"/><line class="ln" x1="16" y1="46" x2="104" y2="46" stroke-width="1"/><line class="ln" x1="16" y1="78" x2="104" y2="78" stroke-width="1"/>`;
      text = `<text class="t-sm" x="60" y="39" text-anchor="middle">${esc(d.top)}</text><text class="t-big" x="60" y="71" text-anchor="middle">${esc(d.code)}</text><text class="t-sm" x="60" y="91" text-anchor="middle">${esc(d.bot)}</text>`;
    }
    const label = d.code + ', ' + d.top + ', ' + d.bot;
    return `<svg class="stamp" viewBox="0 0 120 120" ${mini ? 'aria-hidden="true"' : `role="img" aria-label="${esc(label)}"`} style="--rot:${d.rot}deg">` +
      `<g opacity=".92">${frame}${text}</g></svg>`;
  }

  window.K = {
    get state() { return state; }, save, uid, t, tx, clean, typo, get lang() { return lang; }, setLang, applyI18n,
    onChange: fn => listeners.push(fn), onLang: fn => langListeners.push(fn),
    get me() { return me; }, setMe, person, other, dative, IDS,
    addDays, dayList, fmtDay, fmtRange, dm, hm,
    stays, nightsTotal, transfers, transferKey, isNight, placeDates, placeDatesText, route, stopsForList, CODES,
    CURS, toEUR, money, shareOf, balance, liveExpenses, liveNotes, liveLinks,
    exportData, importData, reset() { state = blank(); save(); },
    stampDefs, stampSVG, STAMP_ORDER,
  };
})();
