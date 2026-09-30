(function () {
  'use strict';

  const STORAGE_PREFIX = 'kambodza.checklist.';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tx = value => esc(K.clean(K.tx(value)));
  const rawTx = value => K.clean(K.tx(value));
  const replace = (value, vars) => Object.keys(vars).reduce((text, key) => text.split('{' + key + '}').join(vars[key]), value);

  function readChecks(person) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_PREFIX + person));
      return new Set(Array.isArray(stored) ? stored : []);
    } catch (error) { return new Set(); }
  }

  function writeChecks(person, checks) {
    try { localStorage.setItem(STORAGE_PREFIX + person, JSON.stringify(Array.from(checks))); } catch (error) { /* localStorage może być niedostępny */ }
  }

  function formatDate(iso) {
    const parts = String(iso).split('-');
    return K.lang === 'en' ? `${parts[2]} Sep ${parts[0]}` : `${parts[2]}.${parts[1]}.${parts[0]}`;
  }

  function checklistItems(data) {
    const entries = data.common.items.map(entry => ({ entry, country: null }));
    data.order.forEach(code => {
      const country = data.countries[code];
      if (!country) return;
      country.blocks.forEach(block => block.items.forEach(entry => {
        if (entry.prio === 'pilne' || entry.prio === 'przed') entries.push({ entry, country: code });
      }));
    });
    return entries;
  }

  function priority(data, value) {
    return `<span class="guide__prio guide__prio--${esc(value)}">${tx(data.ui.priorities[value])}</span>`;
  }

  function renderChecklist(data) {
    const person = K.me;
    const checked = readChecks(person);
    const entries = checklistItems(data);
    const done = entries.reduce((sum, item) => sum + (checked.has(item.entry.id) ? 1 : 0), 0);
    const progress = replace(rawTx(data.ui.progress), { done, total: entries.length });
    const people = K.IDS.map(id => `<button type="button" data-guide-person="${esc(id)}" aria-pressed="${id === person}">${esc(K.person(id).name)}</button>`).join('');
    return `<aside class="guide__check" aria-labelledby="guide-check-h">
      <div class="guide__check-head"><div><p class="guide__kicker">${tx(data.common.title)}</p><h3 id="guide-check-h">${tx({ pl: 'Do zrobienia', en: 'To do' })}</h3></div>
        <div class="guide__people" aria-label="${tx({ pl: 'Checklista osoby', en: 'Traveller checklist' })}">${people}</div></div>
      <div class="guide__progress"><progress value="${done}" max="${entries.length}" aria-label="${esc(progress)}"></progress><span>${esc(progress)}</span></div>
      <ul class="guide__check-list">${entries.map(({ entry, country }) => `<li><label>
        <input type="checkbox" data-guide-check="${esc(entry.id)}"${checked.has(entry.id) ? ' checked' : ''}><span class="guide__box" aria-hidden="true"></span>
        <span class="guide__check-copy">${country ? `<span class="guide__country-tag">${tx(data.countries[country].name)}</span>` : ''}${tx(entry.t)}</span>
      </label></li>`).join('')}</ul>
    </aside>`;
  }

  function countrySources(data, country) {
    const keys = [];
    country.blocks.forEach(block => block.items.forEach(entry => (entry.src || []).forEach(key => {
      if (data.sources[key] && !keys.includes(key)) keys.push(key);
    })));
    return keys;
  }

  function renderCountry(data, code) {
    const country = data.countries[code];
    if (!country) return '';
    const sourceKeys = countrySources(data, country);
    const sourceNumber = key => sourceKeys.indexOf(key) + 1;
    const sourceMarks = entry => (entry.src || []).filter(key => sourceNumber(key) > 0).map(key => {
      const number = sourceNumber(key);
      return `<sup class="guide__ref"><a href="#src-${esc(code)}-${number}" aria-label="${tx({ pl: 'Źródło', en: 'Source' })} ${number}">${number}</a></sup>`;
    }).join('');
    const cards = country.blocks.map(block => `<article class="guide-card"><h4>${tx(block.title)}</h4><ul>${block.items.map(entry => `<li>
      <div class="guide-card__meta">${priority(data, entry.prio)}</div><p><strong>${tx(entry.t)}</strong>${sourceMarks(entry)}${entry.d ? ` <span>${tx(entry.d)}</span>` : ''}</p>
    </li>`).join('')}</ul></article>`).join('');
    const sources = sourceKeys.map((key, index) => {
      const source = data.sources[key];
      return `<li id="src-${esc(code)}-${index + 1}"><span>${index + 1}</span> <a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)}</a></li>`;
    }).join('');
    return `<section class="guide__country" aria-labelledby="guide-country-${esc(code)}">
      <header class="guide__country-head"><span class="guide__flag" aria-hidden="true">${esc(country.flag || '')}</span><div><p>${esc(code)}</p><h3 id="guide-country-${esc(code)}">${tx(country.name)} <span>· ${esc(country.currency)}</span></h3></div></header>
      <div class="guide__grid">${cards}</div>
      ${sources ? `<footer class="guide__sources"><h4>${tx(data.ui.sources)}</h4><ol>${sources}</ol></footer>` : ''}
    </section>`;
  }

  function render() {
    const root = document.getElementById('guide');
    if (!root || !window.K || typeof TRIP === 'undefined' || !TRIP.practical) return;
    const data = TRIP.practical;
    const checkedLabel = replace(rawTx(data.ui.checked), { date: formatDate(data.checked) });
    root.innerHTML = `<div class="guide__inner"><header class="guide__head">
      <p class="guide__eyebrow">${tx(data.ui.eyebrow)}</p><h2 id="guide-h">${tx(data.ui.title)}</h2>
      <p class="guide__intro">${tx(data.ui.intro)}</p><p class="guide__checked">${esc(checkedLabel)}</p>
    </header>${renderChecklist(data)}<div class="guide__countries">${data.order.map(code => renderCountry(data, code)).join('')}</div></div>`;
  }

  function onClick(event) {
    const button = event.target.closest('[data-guide-person]');
    if (button && window.K && K.setMe) K.setMe(button.dataset.guidePerson);
  }

  function onChange(event) {
    const input = event.target.closest('[data-guide-check]');
    if (!input) return;
    const checks = readChecks(K.me);
    if (input.checked) checks.add(input.dataset.guideCheck);
    else checks.delete(input.dataset.guideCheck);
    writeChecks(K.me, checks);
    render();
  }

  const root = document.getElementById('guide');
  if (root) { root.addEventListener('click', onClick); root.addEventListener('change', onChange); }
  render();
  if (window.K) { K.onLang(render); K.onChange(render); }
})();
