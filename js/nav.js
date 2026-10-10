(function () {
  'use strict';

  if (!window.K) return;

  const isTemples = document.body.classList.contains('tpl-body');
  const copy = {
    pl: {
      menu: 'Menu', close: 'Zamknij menu', language: 'Język', journey: 'Podróż',
      items: [
        ['Start', 'Globus i przelot'], ['Opowieść', 'Dziesięć rozdziałów podróży'],
        ['Świątynie', 'Trzy dni w Angkorze'], ['Praktycznie', 'Wizy, aplikacje, pieniądze'],
        ['Planer', 'Mapa, dzień po dniu, wydatki'], ['Pamiętnik', 'Zdjęcia i notatki z drogi']
      ]
    },
    en: {
      menu: 'Menu', close: 'Close menu', language: 'Language', journey: 'Journey',
      items: [
        ['Start', 'Globe and flight'], ['Story', 'Ten chapters of the trip'],
        ['Temples', 'Three days in Angkor'], ['Practical', 'Visas, apps, money'],
        ['Planner', 'Map, day by day, spending'], ['Diary', 'Photos and notes from the road']
      ]
    }
  };
  const definitions = [
    { key: 'cover', hash: 'cover' }, { key: 'story', hash: 'ch-vie' },
    { key: 'temples', page: 'temples.html' }, { key: 'guide', hash: 'guide' },
    { key: 'planner', hash: 'planner' }, { key: 'diary', hash: 'diary' }
  ];

  const trigger = document.createElement('button');
  trigger.className = 'site-nav__trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'site-nav-dialog');
  trigger.innerHTML = '<span class="site-nav__hamburger" aria-hidden="true"><i></i><i></i><i></i></span><span class="site-nav__trigger-label">Menu</span>';

  const dialog = document.createElement('dialog');
  dialog.className = 'site-nav';
  dialog.id = 'site-nav-dialog';
  dialog.setAttribute('aria-labelledby', 'site-nav-title');
  dialog.innerHTML = '<div class="site-nav__sheet"><header><p id="site-nav-title">Menu</p><button class="site-nav__close" type="button">×</button></header><nav aria-label="Menu"><ul></ul></nav><footer><span class="site-nav__language"></span><div class="site-nav__languages"><button type="button" data-lang="pl">PL</button><span aria-hidden="true">·</span><button type="button" data-lang="en">EN</button></div></footer></div>';
  document.body.append(trigger, dialog);

  const list = dialog.querySelector('ul');
  const closeButton = dialog.querySelector('.site-nav__close');
  let current = isTemples ? 'temples' : 'cover';

  function hrefFor(item) {
    if (item.page) return item.page;
    if (isTemples) return item.hash === 'cover' ? 'index.html' : `index.html#${item.hash}`;
    return `#${item.hash}`;
  }

  function render() {
    const text = copy[K.lang] || copy.pl;
    trigger.setAttribute('aria-label', text.menu);
    trigger.querySelector('.site-nav__trigger-label').textContent = text.menu;
    dialog.querySelector('#site-nav-title').textContent = text.menu;
    closeButton.setAttribute('aria-label', text.close);
    dialog.querySelector('.site-nav__language').textContent = text.language;
    const journey = document.querySelector('[data-nav-journey]');
    if (journey) journey.textContent = `← ${text.journey}`;
    list.innerHTML = definitions.map((item, index) => `<li><a href="${hrefFor(item)}" data-nav-key="${item.key}"><strong>${text.items[index][0]}</strong><small>${text.items[index][1]}</small></a></li>`).join('');
    dialog.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === K.lang)));
    markCurrent();
  }

  function markCurrent() {
    dialog.querySelectorAll('[data-nav-key]').forEach(link => {
      const active = link.dataset.navKey === current;
      if (active) link.setAttribute('aria-current', isTemples ? 'page' : 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  trigger.addEventListener('click', () => {
    render();
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
  closeButton.addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus({ preventScroll: true });
  });
  dialog.querySelector('.site-nav__languages').addEventListener('click', event => {
    const button = event.target.closest('button[data-lang]');
    if (button) K.setLang(button.dataset.lang);
  });
  list.addEventListener('click', event => {
    const link = event.target.closest('a[data-nav-key]');
    if (!link) return;
    if (isTemples || link.dataset.navKey === 'temples') {
      if (isTemples && link.dataset.navKey === 'temples') event.preventDefault();
      close();
      return;
    }
    const item = definitions.find(entry => entry.key === link.dataset.navKey);
    const target = item && document.getElementById(item.hash);
    if (!target) return;
    event.preventDefault();
    close();
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', item.hash === 'cover' ? `${location.pathname}${location.search}` : `#${item.hash}`);
  });

  if (!isTemples && 'IntersectionObserver' in window) {
    const sections = definitions.filter(item => item.hash).map(item => ({ item, element: document.getElementById(item.hash) })).filter(entry => entry.element);
    const visible = new Map();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      const best = sections.filter(entry => visible.get(entry.element.id) > 0).sort((a, b) => (visible.get(b.element.id) || 0) - (visible.get(a.element.id) || 0))[0];
      if (best) { current = best.item.key; markCurrent(); }
    }, { rootMargin: '-28% 0px -52% 0px', threshold: [0, .01, .25, .5, .75, 1] });
    sections.forEach(entry => observer.observe(entry.element));
  }

  K.onLang(render);
  render();
})();
