(function () {
  var W = 1200, H = 900;
  var book = document.getElementById('book'), pages = [].slice.call(book.querySelectorAll('.page'));
  var prev = document.getElementById('prev'), next = document.getElementById('next'), dotsEl = document.getElementById('dots');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0;

  /* ---- paint scenes lazily: current page first, then its neighbours, then the rest ---- */
  var painted = {}, queue = [];
  function paintScene(i) {
    if (painted[i]) return; painted[i] = true;
    var art = pages[i].querySelector('.art'), cv = art.querySelector('canvas.paint');
    var dpr = Math.min(window.devicePixelRatio || 1, 2), css = art.clientWidth || 600;
    var k = Math.max(.8, Math.min(1.5, dpr * css / W));
    try { SCENES[i](new Kreska.Studio(cv, W, H, 101 + i * 17, k)); } catch (e) { console.error('scene ' + i, e); }
    art.classList.add('ready');
  }
  function schedule() {
    var order = [cur, cur + 1, cur - 1];
    for (var i = 0; i < pages.length; i++) order.push(i);
    queue = order.filter(function (i) { return i >= 0 && i < pages.length && !painted[i]; });
    if (!schedule.busy) pump();
  }
  function pump() {
    var i = queue.shift();
    if (i === undefined) { schedule.busy = false; return; }
    schedule.busy = true;
    setTimeout(function () { paintScene(i); requestAnimationFrame(pump); }, 30);
  }

  /* ---- live layer: drifting snow, fire glow, tap sparkles ---- */
  var GLOWS = { 4: [[.575, .86, .3, '240,140,50']], 6: [[.583, .9, .18, '240,150,60']], 8: [[.765, .85, .3, '250,200,90']] };
  var fx = pages.map(function (p, i) {
    var cv = p.querySelector('canvas.fx'), art = p.querySelector('.art');
    var f = { cv: cv, art: art, ctx: cv.getContext('2d'), flakes: [], sparks: [], i: i, w: 0, h: 0 };
    for (var n = 0; n < 46; n++) f.flakes.push({ x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 3.2, v: .02 + Math.random() * .05, ph: Math.random() * 6.28 });
    art.addEventListener('pointerdown', function (e) {
      var r = art.getBoundingClientRect();
      for (var s = 0; s < 14; s++) { var a = Math.random() * 6.28, sp = 1 + Math.random() * 3; f.sparks.push({ x: e.clientX - r.left, y: e.clientY - r.top, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.2, life: 1, sz: 4 + Math.random() * 6, c: ['255,246,216', '248,200,82', '255,255,255'][s % 3] }); }
    });
    return f;
  });
  function size(f) {
    var w = f.art.clientWidth, h = f.art.clientHeight, d = Math.min(window.devicePixelRatio || 1, 2);
    if (w !== f.w || h !== f.h) { f.w = w; f.h = h; f.cv.width = w * d; f.cv.height = h * d; f.ctx.setTransform(d, 0, 0, d, 0, 0); }
  }
  function star(c, x, y, s) { c.beginPath(); c.moveTo(x, y - s); c.lineTo(x + s * .25, y - s * .25); c.lineTo(x + s, y); c.lineTo(x + s * .25, y + s * .25); c.lineTo(x, y + s); c.lineTo(x - s * .25, y + s * .25); c.lineTo(x - s, y); c.lineTo(x - s * .25, y - s * .25); c.closePath(); c.fill(); }
  var t0 = performance.now();
  function frame(now) {
    var f = fx[cur]; size(f); var c = f.ctx, t = (now - t0) / 1000;
    c.clearRect(0, 0, f.w, f.h);
    (GLOWS[cur] || []).forEach(function (g) {
      var x = g[0] * f.w, y = g[1] * f.h, r = g[2] * f.w * (1 + .05 * Math.sin(t * 9) + .03 * Math.sin(t * 17));
      var gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(' + g[3] + ',.16)'); gr.addColorStop(1, 'rgba(' + g[3] + ',0)');
      c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2);
    });
    f.flakes.forEach(function (p) {
      p.y += p.v * .016; p.x += Math.sin(t * .6 + p.ph) * .00025; if (p.y > 1.02) { p.y = -.02; p.x = Math.random(); }
      c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.ellipse(p.x * f.w, p.y * f.h, p.r * 1.3, p.r * .85, -.5, 0, 6.283); c.fill();
    });
    f.sparks = f.sparks.filter(function (s) { return s.life > 0; });
    f.sparks.forEach(function (s) { s.x += s.vx; s.y += s.vy; s.vy += .08; s.life -= .022; c.fillStyle = 'rgba(' + s.c + ',' + Math.max(0, s.life) + ')'; star(c, s.x, s.y, s.sz * (.5 + s.life * .6)); });
    requestAnimationFrame(frame);
  }
  if (!reduce) requestAnimationFrame(frame);

  /* ---- navigation ---- */
  pages.forEach(function (_, i) {
    var d = document.createElement('button'); d.type = 'button'; d.className = 'dot'; d.setAttribute('aria-label', 'Strona ' + (i + 1));
    d.addEventListener('click', function () { go(i); }); dotsEl.appendChild(d);
  });
  var dots = [].slice.call(dotsEl.children);
  function paintUI() {
    dots.forEach(function (d, i) { if (i === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    prev.disabled = cur === 0; next.disabled = cur === pages.length - 1;
  }
  function go(i) {
    i = Math.max(0, Math.min(pages.length - 1, i));
    book.scrollTo({ left: i * book.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    cur = i; paintUI(); schedule();
  }
  var t;
  book.addEventListener('scroll', function () {
    clearTimeout(t);
    t = setTimeout(function () { var i = Math.round(book.scrollLeft / book.clientWidth); if (i !== cur) { cur = i; paintUI(); schedule(); } }, 60);
  }, { passive: true });
  prev.addEventListener('click', function () { go(cur - 1); });
  next.addEventListener('click', function () { go(cur + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(cur + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
    else if (e.key === 'Home') go(0); else if (e.key === 'End') go(pages.length - 1);
  });
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-next]'); if (el) { go(cur + 1); return; }
    el = e.target.closest && e.target.closest('[data-first]'); if (el) go(0);
  });
  window.addEventListener('resize', function () { book.scrollLeft = cur * book.clientWidth; });
  paintUI();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { });
  paintScene(0); schedule();
})();
