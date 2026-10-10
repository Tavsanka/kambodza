/* Renderer podstrony o swiatyniach (temples.html).
   Czyta TRIP.temples, TRIP.templePhotos, TRIP.templeCredits. PL/EN przez window.K. */
(function () {
  'use strict';

  const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tx = v => esc(K.clean(K.tx(v)));
  const raw = v => K.clean(K.tx(v));
  const el = id => document.getElementById(id);

  const D = () => TRIP.temples;
  const photos = group => (TRIP.templePhotos && TRIP.templePhotos[group]) || [];

  function figure(p, cls) {
    if (!p) return '';
    const base = 'assets/temples/' + p.key;
    return `<figure class="tpl-fig ${cls || ''}">
      <img src="${base}.webp" srcset="${base}-s.webp 640w, ${base}.webp 1280w"
        sizes="(max-width: 700px) 100vw, 60vw"
        alt="${tx(p.cap)}" loading="lazy" decoding="async">
      <figcaption>${tx(p.cap)}</figcaption>
    </figure>`;
  }

  function sourceLinks(stop) {
    const list = (stop.src || []).map(key => {
      const s = D().sources[key];
      return s ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>` : '';
    }).filter(Boolean);
    if (!list.length) return '';
    return `<p class="tpl-stop__src"><span>${tx(D().ui.sourcesLabel)}:</span> ${list.join(' · ')}</p>`;
  }

  /* Karta swiatyni: tekst i zdjecia przeplatane, nie wszystkie na dole. */
  function stopCard(stop) {
    const ph = photos(stop.id);
    const hero = ph[0];
    const rest = ph.slice(1);
    const ui = D().ui;
    return `<article class="tpl-stop" id="t-${esc(stop.id)}" aria-labelledby="t-h-${esc(stop.id)}">
      <div class="tpl-stop__head">
        <p class="tpl-stop__num"><span>${stop.n}</span></p>
        <div>
          <h3 id="t-h-${esc(stop.id)}">${tx(stop.name)}</h3>
          <p class="tpl-stop__theme">${tx(stop.theme)}</p>
        </div>
      </div>

      ${figure(hero, 'tpl-fig--hero')}

      <div class="tpl-stop__body">
        <div class="tpl-stop__block">
          <h4>${tx(ui.factsLabel)}</h4>
          <p>${tx(stop.facts)}</p>
        </div>

        <blockquote class="tpl-intent">
          <p class="tpl-intent__label">${tx(ui.intentionLabel)}</p>
          <p class="tpl-intent__text">${tx(stop.intention)}</p>
          <p class="tpl-intent__why">${tx(stop.why)}</p>
        </blockquote>

        ${rest[0] ? figure(rest[0], 'tpl-fig--wide') : ''}

        <div class="tpl-stop__block">
          <h4>${tx(ui.doLabel)}</h4>
          <p>${tx(stop.todo)}</p>
        </div>

        ${rest.length > 1 ? `<div class="tpl-stop__gallery">${rest.slice(1).map(p => figure(p)).join('')}</div>` : ''}
        ${sourceLinks(stop)}
      </div>
    </article>`;
  }

  function renderDays() {
    const root = el('t-days');
    if (!root) return;
    root.innerHTML = D().arc.map(day => {
      const stops = D().stops.filter(s => s.day === day.d);
      return `<section class="tpl-day" id="t-day-${day.d}" aria-labelledby="t-day-h-${day.d}">
        <div class="tpl-wrap">
          <header class="tpl-day__head">
            <p class="tpl-day__date">${tx(day.date)}</p>
            <h2 id="t-day-h-${day.d}">${tx(day.t)}</h2>
            <p class="tpl-day__sub">${tx(day.s)}</p>
          </header>
          <div class="tpl-day__stops">${stops.map(stopCard).join('')}</div>
        </div>
      </section>`;
    }).join('');
  }

  function renderWishes() {
    const root = el('t-wishes-list');
    if (!root) return;
    root.innerHTML = D().wishes.map(w => `<li>
      <p class="tpl-wish__where">${tx(w.t)}</p>
      <p class="tpl-wish__text">${tx(w.w)}</p>
    </li>`).join('');
  }

  function renderRituals() {
    const grid = el('t-rituals-grid');
    if (grid) {
      grid.innerHTML = D().rituals.map(r => `<article class="tpl-card">
        <h3>${tx(r.t)}</h3><p>${tx(r.d)}</p>
      </article>`).join('');
    }
    const shots = el('t-rituals-shots');
    if (shots) shots.innerHTML = photos('ritual').map(p => figure(p)).join('');
  }

  function renderRules() {
    const root = el('t-rules-list');
    if (!root) return;
    root.innerHTML = D().etiquette.map(r => `<li>
      <p class="tpl-rule__t">${tx(r.t)}</p><p class="tpl-rule__d">${tx(r.d)}</p>
    </li>`).join('');
  }

  function renderBeyond() {
    const root = el('t-beyond-grid');
    if (!root) return;
    root.innerHTML = D().beyond.map(b => `<article class="tpl-card tpl-card--wide">
      <h3>${tx(b.t)}</h3><p>${tx(b.d)}</p>${sourceLinks(b)}
    </article>`).join('');
  }

  function renderPractical() {
    const root = el('t-practical-grid');
    if (root) {
      root.innerHTML = D().practical.map(p => `<article class="tpl-card">
        <h3>${tx(p.t)}</h3><p>${tx(p.d)}</p>
      </article>`).join('');
    }
    const note = el('t-note');
    if (note) {
      const parts = String(D().checked).split('-');
      const date = K.lang === 'en' ? `${parts[2]}.${parts[1]}.${parts[0]}` : `${parts[2]}.${parts[1]}.${parts[0]}`;
      note.textContent = raw(D().ui.note).split('{date}').join(date);
    }
  }

  function renderFooter() {
    const src = el('t-sources');
    if (src) {
      const used = [];
      D().stops.forEach(s => (s.src || []).forEach(k => used.includes(k) || used.push(k)));
      D().beyond.forEach(s => (s.src || []).forEach(k => used.includes(k) || used.push(k)));
      src.innerHTML = used.map(k => {
        const s = D().sources[k];
        return s ? `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>` : '';
      }).join('');
    }
    const cr = el('t-credits');
    if (cr && TRIP.templeCredits) {
      cr.innerHTML = TRIP.templeCredits.map(c => `<li>${esc(c.author)}${c.lic ? ', ' + esc(c.lic) : ''}${c.page ? ` <a href="${esc(c.page)}" target="_blank" rel="noopener">Commons</a>` : ''}</li>`).join('');
    }
  }

  function applyText() {
    const ui = D().ui;
    document.querySelectorAll('[data-t]').forEach(node => {
      const key = node.dataset.t;
      if (ui[key]) node.textContent = raw(ui[key]);
    });
    document.querySelectorAll('[data-tday]').forEach(node => {
      const day = D().arc.find(a => String(a.d) === node.dataset.tday);
      if (day) node.textContent = raw(day.date) + ': ' + raw(day.t);
    });
    const skip = document.querySelector('.skip');
    if (skip && ui.skipLabel) skip.textContent = raw(ui.skipLabel);
    const dayNav = document.querySelector('.tpl-hero__nav');
    if (dayNav && ui.daysLabel) dayNav.setAttribute('aria-label', raw(ui.daysLabel));
    const description = document.querySelector('meta[name="description"]');
    if (description && ui.metaDescription) description.setAttribute('content', raw(ui.metaDescription));
    document.title = raw(ui.title) + ' · ' + raw(ui.eyebrow);
  }

  function render() {
    if (typeof TRIP === 'undefined' || !TRIP.temples || !window.K) return;
    document.documentElement.lang = K.lang;
    applyText();
    renderWishes();
    renderDays();
    renderRituals();
    renderRules();
    renderBeyond();
    renderPractical();
    renderFooter();
  }

  render();
  if (window.K && K.onLang) K.onLang(render);
})();
