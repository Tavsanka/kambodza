(function () {
  'use strict';

  const root = document.documentElement;
  let installPrompt = null;
  let reloadOnControllerChange = false;

  const style = document.createElement('style');
  style.id = 'pwa-style';
  style.textContent = [
    '#pwa-offline,#pwa-update{position:fixed;z-index:10000;left:1rem;bottom:1rem;max-width:calc(100vw - 2rem);box-sizing:border-box;font:inherit;color:#13211b;background:#f1ead9;border:1px solid #13211b33;box-shadow:3px 3px 0 #13211b22;border-radius:999px;padding:.45rem .75rem;line-height:1.25}',
    '#pwa-update{left:50%;bottom:1.25rem;transform:translateX(-50%);border-radius:8px;display:flex;align-items:center;gap:.75rem}',
    '#pwa-update button{font:inherit;color:#f1ead9;background:#13211b;border:0;border-radius:5px;padding:.35rem .65rem;cursor:pointer}',
    '#pwa-offline[hidden],#pwa-update[hidden]{display:none}'
  ].join('');
  document.head.appendChild(style);

  const offline = document.createElement('div');
  offline.id = 'pwa-offline';
  offline.hidden = !navigator.onLine;
  offline.setAttribute('role', 'status');
  document.body.appendChild(offline);

  function english() { return window.K && K.lang === 'en'; }
  function updateOffline(online) {
    root.classList.toggle('is-offline', !online);
    offline.textContent = online ? '' : (english() ? 'offline · plan still works' : 'bez internetu · plan działa');
    offline.hidden = online;
    window.dispatchEvent(new CustomEvent('kambodza:net', { detail: { online } }));
  }
  window.addEventListener('offline', () => updateOffline(false));
  window.addEventListener('online', () => updateOffline(true));
  updateOffline(navigator.onLine);

  function showUpdate(registration) {
    if (document.getElementById('pwa-update')) return;
    const box = document.createElement('div');
    box.id = 'pwa-update';
    box.setAttribute('role', 'status');
    const text = document.createElement('span');
    text.textContent = english() ? 'A new version of the plan is ready.' : 'Jest nowa wersja planu.';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = english() ? 'Refresh' : 'Odśwież';
    button.addEventListener('click', () => {
      reloadOnControllerChange = true;
      if (registration.waiting) registration.waiting.postMessage('SKIP_WAITING');
    });
    box.append(text, button);
    document.body.appendChild(box);
  }

  function watchRegistration(registration) {
    if (registration.waiting) showUpdate(registration);
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(registration);
      });
    });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
  });
  window.PWA = {
    canInstall: () => Boolean(installPrompt),
    install: async () => {
      if (!installPrompt) return false;
      const prompt = installPrompt;
      installPrompt = null;
      await prompt.prompt();
      return (await prompt.userChoice).outcome === 'accepted';
    },
    installHelpHTML: lang => (lang === 'en' ?
      '<p><strong>Android:</strong> Chrome: menu ⋮ → “Add to home screen” / “Install app”.<br><strong>iPhone:</strong> Safari: Share → “Add to Home Screen”.</p><p>After the first opening with internet, the guide, plan, notes and expenses work offline. Maps need internet.</p>' :
      '<p><strong>Android:</strong> Chrome: menu ⋮ → „Dodaj do ekranu głównego” / „Zainstaluj aplikację”.<br><strong>iPhone:</strong> Safari: Udostępnij → „Do ekranu początkowego”.</p><p>Po pierwszym otwarciu z internetem przewodnik, plan, notatki i wydatki działają bez sieci. Mapy potrzebują internetu.</p>')
  };

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloadOnControllerChange) location.reload();
    });
    navigator.serviceWorker.register('sw.js', { scope: './' }).then(watchRegistration).catch(() => {});
  }
}());
