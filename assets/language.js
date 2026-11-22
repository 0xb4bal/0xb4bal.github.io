/* Static language links work without JavaScript. Remember only an explicit choice. */
(() => {
  'use strict';
  const key = 'iqbal-language';
  const language = document.documentElement.lang === 'ms' ? 'ms' : 'en';
  // Restore a choice on a fresh home visit; explicit deep links keep their language.
  if (language === 'en' && ['/', '/index.html'].includes(location.pathname)) {
    try {
      if (localStorage.getItem(key) === 'ms') {
        location.replace('/ms/' + location.search + location.hash);
      }
    } catch { /* Storage may be unavailable; static language links still work. */ }
  }
  function connectSwitch() {
    document.querySelectorAll('[data-language]').forEach(link => {
      function updateDestination() {
        const url = new URL(link.getAttribute('href'), location.origin);
        url.search = location.search;
        url.hash = location.hash;
        link.href = url.href;
      }
      updateDestination();
      window.addEventListener('hashchange', updateDestination);
      link.addEventListener('click', () => {
        updateDestination();
        try { localStorage.setItem(key, link.dataset.language); } catch {}
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectSwitch);
  else connectSwitch();
})();
