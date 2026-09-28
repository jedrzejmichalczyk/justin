/* KRESKA - a small hand-drawn illustration engine for canvas.
   Gouache fills with visible brush bristles, loose variable-width ink line,
   hatching, stipple, print misregistration, glow, and paper grain. Deterministic per seed. */
const Kreska = (() => {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeNoise(seed) {
    const r = rng(seed), t = new Float32Array(512);
    for (let i = 0; i < 512; i++) t[i] = r() * 2 - 1;
    return x => {
      const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
      return t[i & 511] * (1 - u) + t[(i + 1) & 511] * u;
    };
  }

  /* ---------- colour ---------- */
  function hex(h) {
    if (Array.isArray(h)) return h;
    h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join('');
    const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgba = (c, a = 1) => { const v = hex(c); return `rgba(${v[0] | 0},${v[1] | 0},${v[2] | 0},${a})`; };
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return [lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]; };

  /* ---------- geometry ---------- */
  function catmull(pts, closed = true, seg = 8) {
    const n = pts.length, out = [];
    const get = i => closed ? pts[((i % n) + n) % n] : pts[clamp(i, 0, n - 1)];
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      for (let s = 0; s < seg; s++) {
        const t = s / seg, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    if (!closed) out.push(pts[n - 1]);
    return out;
  }
  function resample(poly, step, closed = false) {
    const pts = closed ? poly.concat([poly[0]]) : poly;
    const out = [pts[0]]; let prev = pts[0], need = step;
    for (let i = 1; i < pts.length; i++) {
      let a = prev; const b = pts[i]; let d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      while (d >= need && d > 0) {
        const t = need / d; a = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        out.push(a); d -= need; need = step;
      }
      need -= d; prev = b;
    }
    if (!closed) out.push(pts[pts.length - 1]);
    return out;
  }
  function length(poly) { let s = 0; for (let i = 1; i < poly.length; i++) s += Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]); return s; }
  function wobble(poly, N, R, amp, scale, closed) {
    const n = poly.length; if (n < 3 || amp <= 0) return poly;
    const out = new Array(n); const L = length(poly) || 1;
    const harm = [], off = R() * 100;
    if (closed) for (let k = 0; k < 4; k++) harm.push([Math.max(1, Math.round(L / scale * (k * 0.9 + 1))), R() * TAU, 1 / (k * 0.8 + 1)]);
    let s = 0;
    for (let i = 0; i < n; i++) {
      const p = poly[i], a = poly[Math.max(0, i - 1)], b = poly[Math.min(n - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      if (i > 0) s += Math.hypot(p[0] - poly[i - 1][0], p[1] - poly[i - 1][1]);
      let d = 0;
      if (closed) { for (const h of harm) d += Math.sin(TAU * h[0] * s / L + h[1]) * h[2]; d *= 0.5; }
      else d = N(s / scale + off) + 0.5 * N(s / scale * 2.7 + off + 31);
      out[i] = [p[0] - ty * d * amp, p[1] + tx * d * amp];
    }
    return out;
  }
  function pathOf(poly, closed = true) {
    const p = new Path2D(); p.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) p.lineTo(poly[i][0], poly[i][1]);
    if (closed) p.closePath(); return p;
  }
  function bbox(poly) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of poly) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function ellipse(cx, cy, rx, ry, n = 14, rot = 0) {
    const o = [], c = Math.cos(rot), s = Math.sin(rot);
    for (let i = 0; i < n; i++) { const a = i / n * TAU, x = Math.cos(a) * rx, y = Math.sin(a) * ry; o.push([cx + x * c - y * s, cy + x * s + y * c]); }
    return o;
  }
  /* jagged fur / needle edge around a closed outline */
  function furry(pts, R, amp = 12, step = 16, seg = 8) {
    const poly = resample(catmull(pts, true, seg), step, true), n = poly.length, out = [];
    for (let i = 0; i < n; i++) {
      const a = poly[(i - 1 + n) % n], p = poly[i], b = poly[(i + 1) % n];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      const d = (i % 2 ? 1 : -0.35) * amp * (0.6 + R() * 0.8);
      out.push([p[0] + ty * d, p[1] - tx * d]);
    }
    return out;
  }

  /* ---------- paper texture (shared) ---------- */
  let paperTex = null;
  function getPaper() {
    if (paperTex) return paperTex;
    const cv = document.createElement('canvas'); cv.width = cv.height = 256;
    const c = cv.getContext('2d'), r = rng(99), img = c.createImageData(256, 256);
    for (let i = 0; i < 256 * 256; i++) { const v = 226 + r() * 29; img.data[i * 4] = v; img.data[i * 4 + 1] = v - 2; img.data[i * 4 + 2] = v - 8; img.data[i * 4 + 3] = 255; }
    c.putImageData(img, 0, 0);
    c.strokeStyle = 'rgba(120,105,80,.07)'; c.lineWidth = 1;
    for (let i = 0; i < 260; i++) { const x = r() * 256, y = r() * 256, a = r() * TAU, l = 6 + r() * 18; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
    paperTex = cv; return cv;
  }

  /* ================= Studio ================= */
  class Studio {
    constructor(cv, W, H, seed, k) {
      this.cv = cv; this.W = W; this.H = H; this.c = cv.getContext('2d');
      if (k) { cv.width = Math.round(W * k); cv.height = Math.round(H * k); this.c.setTransform(k, 0, 0, k, 0, 0); }
      this.R = rng(seed); this.N = makeNoise(seed * 7 + 1); this.seed = seed;
      this.c.lineCap = 'round'; this.c.lineJoin = 'round';
    }
    rnd(a = 0, b = 1) { return a + (b - a) * this.R(); }
    pick(a) { return a[Math.floor(this.R() * a.length)]; }

    /* paper + rough painted frame; everything after is clipped to it */
    begin(paperCol = '#F1E8D6', margin = 30) {
      const c = this.c, W = this.W, H = this.H;
      c.save(); c.fillStyle = paperCol; c.fillRect(0, 0, W, H);
      const pat = c.createPattern(getPaper(), 'repeat'); c.globalCompositeOperation = 'multiply'; c.fillStyle = pat; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over';
      const m = margin, r = 34, pts = [];
      const corner = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const a = a0 + i / 6 * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
      corner(W - m - r, m + r, -Math.PI / 2); corner(W - m - r, H - m - r, 0); corner(m + r, H - m - r, Math.PI / 2); corner(m + r, m + r, Math.PI);
      let poly = resample(pts, 6, true); poly = wobble(poly, this.N, this.R, 3.2, 90, true);
      this.frame = poly; c.save(); c.clip(pathOf(poly));
    }
    finish() {
      const c = this.c, W = this.W, H = this.H, R = this.R;
      // pigment pooled at painted edge
      c.strokeStyle = 'rgba(25,32,60,.16)'; c.lineWidth = 3.5; c.stroke(pathOf(this.frame));
      // dry-brush pinholes
      for (let i = 0; i < 2600; i++) { c.fillStyle = `rgba(246,240,226,${.15 + R() * .35})`; c.beginPath(); c.arc(R() * W, R() * H, .4 + R() * .9, 0, TAU); c.fill(); }
      c.globalCompositeOperation = 'multiply'; c.globalAlpha = .5; c.fillStyle = c.createPattern(getPaper(), 'repeat'); c.fillRect(0, 0, W, H);
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      // soft edge vignette
      const g = c.createRadialGradient(W / 2, H / 2, H * .38, W / 2, H / 2, H * .85); g.addColorStop(0, 'rgba(20,25,50,0)'); g.addColorStop(1, 'rgba(20,25,50,.22)');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.restore(); c.restore();
    }

    bristle(x, y, ang, len, wid, col, alpha) {
      const c = this.c, R = this.R, nb = clamp(Math.round(wid / 2.4), 2, 6);
      const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx, bend = (R() - .5) * len * .14;
      for (let k = 0; k < nb; k++) {
        const off = (k / (nb - 1) - .5) * wid, l = len * (.65 + R() * .35), st = (len - l) * R();
        const sx = x + nx * off + dx * st, sy = y + ny * off + dy * st;
        c.strokeStyle = rgba(col, alpha * (.45 + R() * .65)); c.lineWidth = wid / nb * (.8 + R() * .8);
        c.beginPath(); c.moveTo(sx, sy);
        c.quadraticCurveTo(sx + dx * l / 2 + nx * bend, sy + dy * l / 2 + ny * bend, sx + dx * l, sy + dy * l); c.stroke();
      }
    }

    /* gouache fill with brush streaks and pooled edge */
    paint(pts, color, o = {}) {
      const c = this.c, R = this.R;
      const { smooth = true, rough = 1.6, alpha = .97, off = [0, 0], angle = -.3, spread = .4, streak = 1, light = .28, dark = .26,
        edge = .4, seg = 8, bw = [8, 20], bl = [50, 150], sa = [.2, .42] } = o;
      let poly = smooth ? catmull(pts, true, seg) : pts.slice();
      poly = resample(poly, 4, true); poly = wobble(poly, this.N, R, rough, 60, true);
      const path = pathOf(poly);
      c.save(); c.translate(off[0], off[1]);
      c.fillStyle = rgba(color, alpha); c.fill(path);
      if (streak > 0) {
        c.save(); c.clip(path);
        const bb = bbox(poly), n = clamp(Math.round(bb.w * bb.h / 1500 * streak), 8, 260);
        for (let i = 0; i < n; i++) {
          const col = R() < .5 ? mix(color, '#FFFFFF', light * (.4 + R() * .8)) : mix(color, '#0b1230', dark * (.4 + R() * .8));
          this.bristle(bb.x + R() * bb.w, bb.y + R() * bb.h, angle + (R() - .5) * spread, lerp(bl[0], bl[1], R()), lerp(bw[0], bw[1], R()), col, lerp(sa[0], sa[1], R()));
        }
        c.restore();
      }
      if (edge > 0) { c.lineWidth = 2.4; c.strokeStyle = rgba(mix(color, '#0b1230', .4), edge * .55); c.stroke(path); }
      c.restore();
      return poly;
    }

    /* loose ink line of varying width */
    ink(pts, o = {}) {
      const c = this.c, R = this.R;
      const { w = 3, color = '#1B2236', smooth = true, closed = false, taper = true, alpha = .92, jitter = 1.3, passes = 1, seg = 8, off = [0, 0] } = o;
      let base = smooth ? catmull(pts, closed, seg) : pts.slice();
      base = resample(base, 3, closed);
      if (base.length < 3) return;
      for (let ps = 0; ps < passes; ps++) {
        const poly = wobble(base, this.N, R, jitter, 45, closed), n = poly.length, L = [], Rr = [];
        const ph = R() * 50;
        for (let i = 0; i < n; i++) {
          const a = poly[Math.max(0, i - 1)], b = poly[Math.min(n - 1, i + 1)];
          let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
          const t = i / (n - 1), press = .62 + .38 * this.N(i * .06 + ph);
          const tp = (taper && !closed) ? Math.pow(Math.min(1, t * 9, (1 - t) * 9), .6) : 1;
          const hw = w * press * (.28 + .72 * tp) / 2;
          L.push([poly[i][0] - ty * hw + off[0], poly[i][1] + tx * hw + off[1]]); Rr.push([poly[i][0] + ty * hw + off[0], poly[i][1] - tx * hw + off[1]]);
        }
        c.fillStyle = rgba(color, alpha * (ps ? .6 : 1)); c.beginPath(); c.moveTo(L[0][0], L[0][1]);
        for (let i = 1; i < n; i++) c.lineTo(L[i][0], L[i][1]);
        for (let i = n - 1; i >= 0; i--) c.lineTo(Rr[i][0], Rr[i][1]);
        c.closePath(); c.fill();
      }
    }
    /* filled shape with print misregistration and ink outline */
    shape(pts, color, o = {}) {
      const { line = true, lw = 3.2, lc = '#1B2236', mis = [3, 2], smooth = true, closed = true, la = .9, ...po } = o;
      const poly = this.paint(pts, color, { smooth, off: mis, ...po });
      if (line) this.ink(smooth ? pts : pts.concat([pts[0]]), { w: lw, color: lc, smooth, closed: smooth ? true : false, alpha: la, taper: false, jitter: 1.6, passes: 1 });
      return poly;
    }
    hatch(pts, o = {}) {
      const c = this.c, R = this.R;
      const { angle = .9, gap = 10, w = 1.4, color = '#2C3A72', alpha = .42, smooth = true, skip = .12, wob = 2.5 } = o;
      const poly = smooth ? catmull(pts, true, 8) : pts, path = pathOf(poly), bb = bbox(poly);
      c.save(); c.clip(path);
      const cx = bb.x + bb.w / 2, cy = bb.y + bb.h / 2, rr = Math.hypot(bb.w, bb.h) / 2 + 4, dx = Math.cos(angle), dy = Math.sin(angle), nx = -dy, ny = dx;
      for (let s = -rr; s < rr; s += gap * (.75 + R() * .5)) {
        if (R() < skip) continue;
        const x0 = cx + nx * s - dx * rr, y0 = cy + ny * s - dy * rr, x1 = cx + nx * s + dx * rr, y1 = cy + ny * s + dy * rr;
        c.lineWidth = w * (.7 + R() * .7); c.strokeStyle = rgba(color, alpha * (.6 + R() * .6));
        c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + nx * wob * (R() - .5) * 2, (y0 + y1) / 2 + ny * wob * (R() - .5) * 2, x1, y1); c.stroke();
      }
      c.restore();
    }
    stipple(pts, o = {}) {
      const c = this.c, R = this.R, { n = 80, r = [1, 2.4], color = '#FFFFFF', alpha = .7, smooth = true } = o;
      const poly = smooth ? catmull(pts, true, 6) : pts, bb = bbox(poly);
      c.save(); c.clip(pathOf(poly));
      for (let i = 0; i < n; i++) { c.fillStyle = rgba(color, alpha * (.5 + R() * .6)); c.beginPath(); c.arc(bb.x + R() * bb.w, bb.y + R() * bb.h, lerp(r[0], r[1], R()), 0, TAU); c.fill(); }
      c.restore();
    }
    clipTo(pts, fn, smooth = true) { const c = this.c; c.save(); c.clip(pathOf(smooth ? catmull(pts, true, 8) : pts)); fn(); c.restore(); }

    /* vertical-gradient wash over a polygon (default: whole canvas) with broad brush bands */
    wash(stops, o = {}) {
      const c = this.c, R = this.R, W = this.W, H = this.H;
      const { poly = [[0, 0], [W, 0], [W, H], [0, H]], y0 = 0, y1 = H, angle = 0, n = 220, bands = [.06, .14] } = o;
      c.save(); c.clip(pathOf(poly));
      const g = c.createLinearGradient(0, y0, 0, y1); stops.forEach(s => g.addColorStop(s[0], rgba(s[1]))); c.fillStyle = g; c.fill(pathOf(poly));
      const bb = bbox(poly), colAt = t => { t = clamp(t, 0, 1); for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) { const a = stops[i - 1], b = stops[i]; return mix(a[1], b[1], (t - a[0]) / (b[0] - a[0] || 1)); } return hex(stops[stops.length - 1][1]); };
      for (let i = 0; i < n; i++) {
        const y = bb.y + R() * bb.h, base = colAt((y - y0) / (y1 - y0));
        const col = R() < .5 ? mix(base, '#FFFFFF', .12 + R() * .18) : mix(base, '#1a2050', .08 + R() * .14);
        this.bristle(bb.x - 40 + R() * (bb.w + 80), y, angle + (R() - .5) * .08, 160 + R() * 380, 24 + R() * 60, col, lerp(bands[0], bands[1], R()));
      }
      c.restore();
    }
    glow(x, y, r, color, a = .6, mode = 'screen') {
      const c = this.c, g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(color, a)); g.addColorStop(.45, rgba(color, a * .4)); g.addColorStop(1, rgba(color, 0));
      c.save(); c.globalCompositeOperation = mode; c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
    }
    /* soft transparent bank of mist */
    haze(y0, y1, color, a = .5) {
      const c = this.c, g = c.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, rgba(color, 0)); g.addColorStop(.6, rgba(color, a)); g.addColorStop(1, rgba(color, a * .2));
      c.fillStyle = g; c.fillRect(0, y0, this.W, y1 - y0);
    }
    /* apply local transform then draw */
    at(x, y, s, rot, fn, flip = false) {
      const c = this.c; c.save(); c.translate(x, y); c.rotate(rot || 0); c.scale(flip ? -s : s, s); fn(); c.restore();
    }
  }

  return { Studio, rng, catmull, resample, wobble, ellipse, furry, mix, rgba, hex, clamp, lerp, bbox, TAU };
})();
