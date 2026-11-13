/* B.K. Nanda Kumar, Advocates — site behaviour: disclaimer gate + mobile nav. No dependencies. */
(function () {
  var KEY = 'bkn-disclaimer-accepted';
  var root = document.documentElement;
  var gate = document.getElementById('gate');
  var lastFocus = null;

  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function focusables() {
    return gate.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
  }

  function trap(e) {
    if (e.key !== 'Tab') return;
    var f = focusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openGate() {
    if (!gate) return;
    lastFocus = document.activeElement;
    root.classList.add('show-gate');
    document.body.classList.add('locked');
    gate.removeAttribute('aria-hidden');
    var main = document.getElementById('page');
    if (main) main.setAttribute('inert', '');
    document.addEventListener('keydown', trap);
    var agree = document.getElementById('gate-agree');
    if (agree) agree.focus();
  }

  function closeGate() {
    root.classList.remove('show-gate');
    document.body.classList.remove('locked');
    gate.setAttribute('aria-hidden', 'true');
    var main = document.getElementById('page');
    if (main) main.removeAttribute('inert');
    document.removeEventListener('keydown', trap);
    if (lastFocus && lastFocus.focus && lastFocus !== document.body) lastFocus.focus();
  }

  if (gate) {
    if (root.classList.contains('show-gate')) openGate();
    document.getElementById('gate-agree').addEventListener('click', function () { store('1'); closeGate(); });
    document.getElementById('gate-leave').addEventListener('click', function () {
      if (history.length > 1 && document.referrer) history.back();
      else window.location.href = 'https://www.google.com/';
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-open-gate]'), function (b) {
      b.addEventListener('click', openGate);
    });
  }

  /* mobile nav */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('site-nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); burger.focus();
      }
    });
  }

  /* photos: drop broken images so the monogram plate shows */
  Array.prototype.forEach.call(document.querySelectorAll('.plate img'), function (img) {
    function drop() { var p = img.closest('picture') || img; p.remove(); }
    if (img.complete && img.naturalWidth === 0) drop();
    else img.addEventListener('error', drop);
  });
})();
