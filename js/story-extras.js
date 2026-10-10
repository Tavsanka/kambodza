/* Przewodnik w opowieści: jeden dyskretny przycisk w kolumnie tekstu rozdziału.
   Pełne treści (po co jechać, do przeżycia, w okolicy, urbex, dzikie) są w karcie miejsca.
   NIE wstawiamy dużych bloków do rozdziałów: animacje scrollcraft liczą postęp względem
   wysokości sekcji, więc każdy dodatkowy blok opóźnia odsłanianie zdjęć. */
(function () {
  'use strict';

  const MAP = [
    { host: '#ch-pek .spread__text', id: 'beijing' },
    { host: '#ch-pnh .night__copy', id: 'phnompenh' },
    { host: '#ch-int .quiet', id: 'siemreap' },
    { host: '#ch-isl .isl__lead', id: 'kohrongsamloem' },
    { host: '#ch-isl .card--b', id: 'kohrong' },
    { host: '#ch-pp2 .pp2', id: 'phnompenh' },
    { host: '#ch-wall .wall__text', id: 'greatwall' }
  ];
  const LABEL = { pl: 'Przewodnik', en: 'Guide' };

  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lang = () => (window.K && K.lang === 'en') ? 'en' : 'pl';
  const tx = v => (v == null ? '' : (typeof v === 'string' ? v : (v[lang()] || v.pl || '')));

  function build() {
    document.querySelectorAll('[data-guide-open]').forEach(n => n.remove());
    if (typeof TRIP === 'undefined' || !TRIP.places) return;
    MAP.forEach(({ host, id }) => {
      const el = document.querySelector(host); const place = TRIP.places[id];
      if (!el || !place) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'guide-link'; b.dataset.guideOpen = id;
      b.innerHTML = `<span class="guide-link__k">${LABEL[lang()]}</span> ${esc(tx(place.name))} <span aria-hidden="true">→</span>`;
      const stamp = el.querySelector('.stamp-slot');
      if (stamp && stamp.parentNode === el) el.insertBefore(b, stamp); else el.appendChild(b);
    });
    // Przelicz pozycje sekcji (na telefonie zdarzenie resize bywa ignorowane).
    if (window.ScrollCraft && ScrollCraft.instances) ScrollCraft.instances.forEach(i => i.layout && i.layout());
  }

  function open(id, btn) {
    if (window.KPlanner && typeof KPlanner.openPlace === 'function') return KPlanner.openPlace(id, btn);
    const o = Array.from(document.querySelectorAll('[data-open]')).find(c => c.dataset.open === id);
    if (o) o.click();
  }

  function init() {
    build();
    document.addEventListener('click', e => { const b = e.target.closest('[data-guide-open]'); if (b) open(b.dataset.guideOpen, b); });
    if (window.K && typeof K.onLang === 'function') K.onLang(build);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
