/* Opcjonalna synchronizacja danych planera, dzialajaca offline-first. */
(function () {
  'use strict';

  const CONFIG_KEY = 'kambodza.sync';
  const META_KEY = 'kambodza.sync.meta';
  const CHECKLIST_PREFIX = 'kambodza.checklist.';
  const DEFAULT_HOST = '100.92.253.48';
  const DEFAULT_URL = 'http://100.92.253.48:8531';
  const root = typeof window !== 'undefined' ? window : globalThis;

  function stable(value) {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
    return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stable(value[k])).join(',') + '}';
  }

  function hash(value) {
    const text = stable(value);
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  }

  function splitState(state, checklists, photos) {
    const out = [];
    const add = (kind, id, data, updated, deleted) => out.push({ kind, id: String(id), data, updated: Number(updated) || 0, deleted: !!deleted });
    ['notes', 'expenses', 'links'].forEach(name => {
      const kind = name.slice(0, -1);
      (state[name] || []).forEach(x => { if (x && x.id) add(kind, x.id, x, x.updated || x.ts); });
    });
    Object.keys(state.res || {}).forEach(id => { const x = state.res[id]; add('res', id, x, x && x.updated); });
    add('wall', 'main', state.wall || {}, state.wall && state.wall.updated);
    add('itinerary', 'main', state.itinerary || {}, state.itinerary && state.itinerary.updated);
    add('rates', 'main', state.rates || {}, state.rates && state.rates.updated);
    Object.keys(checklists || {}).forEach(id => add('checklist', id, checklists[id], 0));
    (state.deleted || []).forEach(id => add('deleted', id, { id: String(id) }, 0, true));
    (photos || []).forEach(p => add('photo', p.id, {
      place: p.place || '', caption: p.caption || '', ts: Number(p.ts) || 0,
      w: Number(p.w) || 0, h: Number(p.h) || 0
    }, p.updated || p.ts));
    return out;
  }

  function diff(items, sent, now) {
    const at = Number(now) || Date.now();
    return items.reduce((out, item) => {
      const key = item.kind + ':' + item.id;
      const h = hash(item.data);
      if (!sent[key] || sent[key].h !== h) {
        out.push(Object.assign({}, item, { h, updated: Math.max(item.updated || 0, at) }));
      }
      return out;
    }, []);
  }

  function findLocal(state, kind, id) {
    const names = { note: 'notes', expense: 'expenses', link: 'links' };
    if (names[kind]) return (state[names[kind]] || []).find(x => String(x.id) === String(id));
    if (kind === 'res') return state.res && state.res[id];
    if (kind === 'wall' || kind === 'itinerary' || kind === 'rates') return state[kind];
    if (kind === 'deleted') return (state.deleted || []).includes(id) ? { id } : null;
    return null;
  }

  function applyRemote(state, meta, items, hooks) {
    let changed = false;
    const sent = meta.sent || (meta.sent = {});
    const names = { note: 'notes', expense: 'expenses', link: 'links' };
    (items || []).forEach(remote => {
      const key = remote.kind + ':' + remote.id;
      const local = findLocal(state, remote.kind, remote.id);
      const localU = Math.max(Number(sent[key] && sent[key].u) || 0, Number(local && (local.updated || local.ts)) || 0);
      if (local && Number(remote.updated) <= localU) return;
      if (remote.kind === 'checklist' || remote.kind === 'photo') {
        if (hooks && hooks[remote.kind]) hooks[remote.kind](remote);
        sent[key] = { h: hash(remote.data), u: Number(remote.updated) || 0 };
        changed = true;
        return;
      }
      if (remote.kind === 'deleted') {
        state.deleted = Array.isArray(state.deleted) ? state.deleted : [];
        if (!state.deleted.includes(remote.id)) state.deleted.push(remote.id);
      } else if (names[remote.kind]) {
        const list = state[names[remote.kind]] || (state[names[remote.kind]] = []);
        const pos = list.findIndex(x => String(x.id) === String(remote.id));
        if (remote.deleted) {
          if (pos >= 0) list.splice(pos, 1);
          state.deleted = Array.isArray(state.deleted) ? state.deleted : [];
          if (!state.deleted.includes(remote.id)) state.deleted.push(remote.id);
        } else if (pos < 0) list.push(remote.data);
        else list[pos] = remote.data;
      } else if (remote.kind === 'res') {
        state.res = state.res || {};
        if (remote.deleted) delete state.res[remote.id]; else state.res[remote.id] = remote.data;
      } else if (['wall', 'itinerary', 'rates'].includes(remote.kind)) {
        if (!remote.deleted) state[remote.kind] = remote.data;
      } else return;
      sent[key] = { h: hash(remote.data), u: Number(remote.updated) || 0 };
      changed = true;
    });
    return changed;
  }

  const pure = { stable, hash, splitState, diff, applyRemote };
  root.KSync = root.KSync || {};
  root.KSync._pure = pure;
  if (typeof document === 'undefined' || !root.K) return;
  let storage;
  try { storage = root.localStorage; storage.getItem(CONFIG_KEY); }
  catch (e) {
    Object.assign(root.KSync, {
      enabled: () => false,
      status: () => ({ state: 'off', last: 0, keyHint: '', url: '' }),
      syncNow: () => Promise.resolve(false), connect: () => false, disconnect() {}, onStatus(fn) {
        if (typeof fn === 'function') fn({ state: 'off', last: 0, keyHint: '', url: '' });
      }
    });
    return;
  }

  let config = readJSON(CONFIG_KEY, null);
  let meta = readJSON(META_KEY, { seq: 0, sent: {} });
  if (!meta || typeof meta !== 'object') meta = { seq: 0, sent: {} };
  if (!meta.sent || typeof meta.sent !== 'object') meta.sent = {};
  let current = { state: 'off', last: 0, keyHint: '', url: '' };
  let applying = false;
  let running = null;
  let timer = null;
  let failures = 0;
  const listeners = [];

  function readJSON(key, fallback) {
    try { const raw = storage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { storage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function validConfig(c) {
    if (!c || typeof c.key !== 'string' || !c.key.trim() || typeof c.url !== 'string' || !c.url) return false;
    try { const u = new URL(c.url); return (u.protocol === 'http:' || u.protocol === 'https:') && !/[\/?#]$/.test(c.key.trim()); }
    catch (e) { return false; }
  }
  function available() { return location.protocol !== 'file:' && validConfig(config); }
  function exposeStatus(state, last) {
    current = {
      state, last: last == null ? current.last : last,
      keyHint: config && config.key ? config.key.slice(0, 4) + '…' : '',
      url: config && config.url ? config.url : ''
    };
    listeners.slice().forEach(fn => { try { fn(Object.assign({}, current)); } catch (e) {} });
  }
  function saveMeta() { writeJSON(META_KEY, meta); }

  function consumeHashConfig() {
    if (!location.hash || !location.hash.includes('trip=')) return false;
    const params = new URLSearchParams(location.hash.slice(1));
    const key = (params.get('trip') || '').trim();
    const url = (params.get('sync') || (location.hostname === DEFAULT_HOST ? DEFAULT_URL : '')).replace(/\/$/, '');
    params.delete('trip'); params.delete('sync');
    const rest = params.toString();
    try { history.replaceState(null, '', location.pathname + location.search + (rest ? '#' + rest : '')); } catch (e) {}
    if (!validConfig({ key, url })) return false;
    const changed = !config || config.key !== key || config.url !== url;
    config = { key, url };
    writeJSON(CONFIG_KEY, config);
    if (changed) { meta = { seq: 0, sent: {} }; saveMeta(); }
    return true;
  }

  function checklistSnapshot() {
    const out = {};
    const ids = root.TRIP && Array.isArray(TRIP.travelers) ? TRIP.travelers.map(x => x.id) : ['dominika', 'oksana'];
    ids.forEach(id => { const value = readJSON(CHECKLIST_PREFIX + id, []); out[id] = Array.isArray(value) ? value : []; });
    return out;
  }
  async function localItems() {
    let photos = [];
    if (root.KPhotos && KPhotos.listAll) photos = await KPhotos.listAll().catch(() => []);
    return splitState(K.state, checklistSnapshot(), photos);
  }
  function endpoint(path) { return config.url.replace(/\/$/, '') + '/api/t/' + encodeURIComponent(config.key) + path; }
  async function request(url, options) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, Object.assign({}, options, { signal: controller.signal }));
      if (!response.ok) throw new Error('http-' + response.status);
      return response;
    } finally { clearTimeout(timeout); }
  }

  async function pull() {
    let since = Number(meta.seq) || 0;
    let any = false;
    do {
      const response = await request(endpoint('/changes?since=' + since));
      const body = await response.json();
      const items = Array.isArray(body.items) ? body.items : [];
      for (const item of items) {
        if (item.kind === 'photo' && (!KPhotos || !KPhotos.get || !KPhotos.putRemote)) continue;
        if (item.kind === 'photo') {
          const existing = await KPhotos.get(item.id);
          if (!existing) {
            const photoResponse = await request(endpoint('/photo/' + encodeURIComponent(item.id) + '?kind=thumb'));
            const blob = await photoResponse.blob();
            await KPhotos.putRemote(Object.assign({ id: item.id, blob }, item.data || {}));
          }
        }
        any = applyRemote(K.state, meta, [item], {
          checklist(remote) {
            writeJSON(CHECKLIST_PREFIX + remote.id, Array.isArray(remote.data) ? remote.data : []);
            root.dispatchEvent(new Event('kambodza:checklist'));
          },
          photo() {}
        }) || any;
      }
      if (body.more && items.length) since = Number(items[items.length - 1].seq) || since;
      else { meta.seq = Number(body.seq) || since; saveMeta(); break; }
    } while (true);
    if (any) { applying = true; try { K.save(); } finally { applying = false; } }
  }

  function canvasBlob(canvas, type) { return new Promise(resolve => canvas.toBlob(resolve, type, .8)); }
  async function thumbnail(blob) {
    const source = await createImageBitmap(blob);
    const scale = Math.min(1, 480 / Math.max(source.width, source.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(source.width * scale));
    canvas.height = Math.max(1, Math.round(source.height * scale));
    canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
    if (source.close) source.close();
    return canvasBlob(canvas, 'image/webp');
  }
  async function uploadPhoto(item) {
    if (!root.KPhotos || !KPhotos.get) return;
    const rec = await KPhotos.get(item.id);
    if (!rec || !(rec.blob instanceof Blob) || rec.remote) return;
    if (rec.blob.size > 12 * 1024 * 1024) throw new Error('photo-too-large');
    const thumb = await thumbnail(rec.blob);
    await request(endpoint('/photo/' + encodeURIComponent(item.id) + '?kind=thumb'), { method: 'PUT', headers: { 'Content-Type': thumb.type }, body: thumb });
    await request(endpoint('/photo/' + encodeURIComponent(item.id) + '?kind=orig'), { method: 'PUT', headers: { 'Content-Type': rec.blob.type }, body: rec.blob });
  }
  async function push() {
    const items = await localItems();
    const changes = diff(items, meta.sent, Date.now());
    if (!changes.length) return false;
    for (const item of changes) if (item.kind === 'photo' && !meta.sent['photo:' + item.id]) await uploadPhoto(item);
    const payload = changes.map(x => ({ kind: x.kind, id: x.id, updated: x.updated, deleted: x.deleted, data: x.data }));
    const response = await request(endpoint('/push'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: payload }) });
    const body = await response.json();
    const rejected = new Set(Array.isArray(body.rejected) ? body.rejected : []);
    changes.forEach(x => {
      if (!rejected.has(x.id)) meta.sent[x.kind + ':' + x.id] = { h: x.h, u: x.updated };
    });
    saveMeta();
    return rejected.size > 0;
  }

  function schedule(delay) {
    clearTimeout(timer);
    if (!available()) return;
    timer = setTimeout(syncNow, delay == null ? 4000 : delay);
  }
  async function cycle() {
    exposeStatus('syncing');
    try {
      await pull();
      const rejected = await push();
      if (rejected) await pull();
      failures = 0;
      exposeStatus('idle', Date.now());
    } catch (e) {
      failures++;
      exposeStatus(navigator.onLine === false ? 'offline' : 'error');
      schedule(Math.min(300000, 5000 * Math.pow(2, Math.min(failures - 1, 6))));
    }
  }
  function syncNow() {
    if (!available()) { exposeStatus(config ? 'offline' : 'off'); return Promise.resolve(false); }
    if (running) return running;
    running = cycle().finally(() => { running = null; });
    return running;
  }
  function parseConnection(value, explicitUrl) {
    let key = String(value || '').trim();
    let url = String(explicitUrl || '').trim();
    if (key.includes('#')) {
      try {
        const parsed = new URL(key, location.href);
        const params = new URLSearchParams(parsed.hash.slice(1));
        key = (params.get('trip') || '').trim();
        url = (params.get('sync') || url || (parsed.hostname === DEFAULT_HOST ? DEFAULT_URL : '')).trim();
      } catch (e) { return null; }
    }
    if (!url) url = config && config.url ? config.url : (location.hostname === DEFAULT_HOST ? DEFAULT_URL : '');
    url = url.replace(/\/$/, '');
    return validConfig({ key, url }) ? { key, url } : null;
  }
  function connect(key, url) {
    const next = parseConnection(key, url);
    if (!next || location.protocol === 'file:') return false;
    const changed = !config || config.key !== next.key || config.url !== next.url;
    config = next; writeJSON(CONFIG_KEY, config);
    if (changed) { meta = { seq: 0, sent: {} }; saveMeta(); }
    exposeStatus('idle'); schedule(0); return true;
  }
  function disconnect() {
    clearTimeout(timer); config = null; meta = { seq: 0, sent: {} };
    try { storage.removeItem(CONFIG_KEY); storage.removeItem(META_KEY); } catch (e) {}
    exposeStatus('off', 0);
  }

  consumeHashConfig();
  exposeStatus(available() ? 'idle' : 'off');
  Object.assign(root.KSync, {
    enabled: available,
    status: () => Object.assign({}, current),
    syncNow, connect, disconnect,
    onStatus(fn) { if (typeof fn === 'function') { listeners.push(fn); fn(Object.assign({}, current)); } },
    _pure: pure
  });
  K.onChange(() => { if (!applying) schedule(4000); });
  root.addEventListener('online', () => schedule(0));
  setInterval(() => { if (document.visibilityState === 'visible') syncNow(); }, 60000);
  setTimeout(() => {
    if (available()) syncNow();
    applying = true; try { K.save(); } finally { applying = false; }
  }, 1000);
})();
