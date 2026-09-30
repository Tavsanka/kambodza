/* Zdjecia prywatne, przechowywane tylko w tej przegladarce. */
(function () {
  'use strict';

  const DB_NAME = 'kambodza-photos';
  const STORE = 'photos';
  const MAX_SIDE = 1600;

  function openDB() {
    if (!window.indexedDB) return Promise.reject(new Error('indexeddb-unavailable'));
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        const store = db.objectStoreNames.contains(STORE)
          ? req.transaction.objectStore(STORE)
          : db.createObjectStore(STORE, { keyPath: 'id' });
        if (!store.indexNames.contains('place')) store.createIndex('place', 'place', { unique: false });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('indexeddb-open-failed'));
      req.onblocked = () => reject(new Error('indexeddb-blocked'));
    });
  }

  function request(mode, run) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      let req, result;
      try { req = run(tx.objectStore(STORE)); }
      catch (err) { db.close(); reject(err); return; }
      req.onsuccess = () => { result = req.result; };
      req.onerror = () => reject(req.error || new Error('indexeddb-request-failed'));
      tx.oncomplete = () => { db.close(); resolve(result); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error('indexeddb-transaction-failed')); };
      tx.onabort = () => { db.close(); reject(tx.error || new Error('indexeddb-transaction-aborted')); };
    }));
  }

  function loadBitmap(file) {
    if (window.createImageBitmap) {
      return createImageBitmap(file, { imageOrientation: 'from-image' })
        .catch(() => createImageBitmap(file));
    }
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('invalid-image')); };
      img.src = url;
    });
  }

  function canvasBlob(canvas, type) {
    return new Promise(resolve => canvas.toBlob(resolve, type, .8));
  }

  async function resize(file) {
    if (!(file instanceof Blob) || !String(file.type || '').startsWith('image/')) throw new Error('invalid-image');
    const source = await loadBitmap(file);
    const sw = source.width || source.naturalWidth;
    const sh = source.height || source.naturalHeight;
    if (!sw || !sh) { if (source.close) source.close(); throw new Error('invalid-image'); }
    const scale = Math.min(1, MAX_SIDE / Math.max(sw, sh));
    const w = Math.max(1, Math.round(sw * scale));
    const h = Math.max(1, Math.round(sh * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) { if (source.close) source.close(); throw new Error('image-processing-failed'); }
    ctx.drawImage(source, 0, 0, w, h);
    if (source.close) source.close();
    let blob = await canvasBlob(canvas, 'image/webp');
    if (!blob || blob.type !== 'image/webp') blob = await canvasBlob(canvas, 'image/jpeg');
    if (!blob) throw new Error('image-processing-failed');
    return { blob, w, h };
  }

  async function add(place, file) {
    const image = await resize(file);
    const rec = {
      id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
      place: String(place || ''), blob: image.blob, caption: '',
      who: window.K ? K.me : '', ts: Date.now(), w: image.w, h: image.h
    };
    await request('readwrite', store => store.add(rec));
    return rec;
  }

  function list(place) {
    return request('readonly', store => store.index('place').getAll(IDBKeyRange.only(String(place || ''))))
      .then(rows => rows.sort((a, b) => a.ts - b.ts));
  }

  function setCaption(id, text) {
    return request('readwrite', store => {
      const get = store.get(id);
      // addEventListener: request() nadpisuje onsuccess, wiec nie uzywamy wlasciwosci
      get.addEventListener('success', () => {
        if (!get.result) return;
        get.result.caption = String(text || '').trim();
        store.put(get.result);
      });
      return get;
    });
  }

  function remove(id) { return request('readwrite', store => store.delete(id)); }
  function count() { return request('readonly', store => store.count()); }

  function get(id) { return request('readonly', store => store.get(String(id || ''))); }

  function listAll() {
    return request('readonly', store => store.getAll())
      .then(rows => rows.sort((a, b) => a.ts - b.ts));
  }

  function putRemote(data) {
    const rec = {
      id: String(data.id || ''), place: String(data.place || ''),
      caption: String(data.caption || ''), ts: Number(data.ts) || Date.now(),
      blob: data.blob, remote: true
    };
    if (data.w != null) rec.w = Number(data.w) || 0;
    if (data.h != null) rec.h = Number(data.h) || 0;
    return request('readwrite', store => store.put(rec)).then(() => rec);
  }

  window.KPhotos = { add, list, setCaption, remove, count, get, listAll, putRemote };
})();
