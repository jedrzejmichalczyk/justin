/* Nordic gouache palette, landscape pieces and characters. Uses Kreska.Studio (S). */
const K = Kreska;
const P = {
  ink: '#1D2430', inkSoft: '#46505E', paper: '#EFE8D6',
  snow: '#F8F6EE', snowMid: '#E6EEE6', snowSh: '#BBD6CD', snowDeep: '#7FB0A6',
  fog: '#C2D0C3', fogDeep: '#A9BBAE',
  mtnFar: '#B9C7BC', mtnMid: '#9FB3A9', mtnNear: '#84A099', mtnDeep: '#5F8079',
  spr: '#4A9A94', sprMid: '#79BDB0', sprLight: '#A9D8CB', sprDark: '#2F6F6C', bark: '#5A3E33',
  red: '#CF3A2C', redDeep: '#9E2A24', cream: '#F5EBD0', mus: '#EDB43A', musDeep: '#C48A20',
  falu: '#BE3B2C', faluDeep: '#8A2B26', wood: '#8A5C45',
  fire: '#EC7A2A', fireY: '#F7C650', fireC: '#FFF0C4',
  lake: '#6F9EA6', lakeDeep: '#456F7B', lakeLight: '#A9CCCB',
  glass: '#AECFD6', pink: '#E8888A', lav: '#9A8FC0', night: '#1B3543', nightDeep: '#12242F',
  fur: '#FBFAF1', furWarm: '#EFEBC2', furCool: '#CBD6E0'
};
const mixc = K.mix, TAU = K.TAU;
const lerp2 = (a, b, t) => a + (b - a) * t;
const rnd = (S, a, b) => S.rnd(a, b);

/* ---------- sky helpers ---------- */
function cloud(S, x, y, s, col = '#FBF3E4', a = .93) {
  S.at(x, y, s, 0, () => {
    const parts = [[0, 0, 70, 24], [55, -16, 60, 30], [-50, -6, 50, 20], [110, 2, 55, 20], [30, 10, 90, 18]];
    parts.forEach(p => S.paint(K.ellipse(p[0], p[1], p[2], p[3], 12), col, { alpha: a, angle: 0, spread: .1, streak: .7, edge: 0, rough: 2, bw: [10, 22], light: .2, dark: .12 }));
  });
}
function sun(S, x, y, r, core = '#FBE7A6', ring = '#F6C67A') {
  S.glow(x, y, r * 3.2, ring, .5, 'screen');
  S.paint(K.ellipse(x, y, r * 1.35, r * 1.35, 16), mixc(ring, '#FFFFFF', .25), { alpha: .55, streak: .4, edge: 0, rough: 2.5 });
  S.paint(K.ellipse(x, y, r, r, 16), core, { alpha: .98, streak: .5, edge: 0, angle: 0.2, light: .35 });
}

/* ---------- soft hills (no outline, misty) ---------- */
function mountain(S, x, y, hw, base, col, o = {}) {
  const R = S.R, h = base - y, snowCol = o.snow || P.snow;
  const shL = [x - hw * .55, y + h * (.42 + R() * .08)], shR = [x + hw * .5, y + h * (.4 + R() * .08)];
  S.paint([[x - hw, base + 30], [x - hw * .8, y + h * .72], shL, [x - hw * .22, y + h * .16], [x, y], [x + hw * .15, y + h * .18], shR, [x + hw * .82, y + h * .7], [x + hw, base + 30]], col,
    { smooth: true, rough: 3, angle: -.9, streak: .9, edge: 0, alpha: 1, bl: [40, 110], seg: 5 });
  if (o.snowDepth !== 0) {
    const d = o.snowDepth || .34, zig = [];
    for (let i = 0; i <= 6; i++) zig.push([x - hw * .5 + i * hw * .16, y + h * (d + (i % 2 ? .06 : -.02)) + R() * 6]);
    S.paint([[x, y], [x - hw * .22, y + h * .16], [x - hw * .5, y + h * d * .9], ...zig, [x + hw * .46, y + h * d * .9], [x + hw * .15, y + h * .18]], snowCol, { smooth: true, seg: 4, rough: 2, angle: -.9, streak: .5, edge: 0, alpha: .98 });
  }
}

/* ---------- snow-laden pine with mint hooks ---------- */
function pine(S, x, y, h, o = {}) {
  const R = S.R, far = !!o.far, w = o.w || h * .42, tiers = Math.max(3, Math.round(h / 62)), tierH = h * .9 / tiers;
  const Rp = [[0, -h]], Lp = [];
  for (let k = 0; k < tiers; k++) {
    const yb = -h * .05 - (tiers - 1 - k) * tierH, ww = w * (.3 + .7 * (k + 1) / tiers) * (.92 + R() * .16);
    Rp.push([ww * .5, yb - tierH * .6], [ww, yb], [ww * .4, yb - tierH * .16]);
    Lp.push([-ww * .4, yb - tierH * .16], [-ww, yb], [-ww * .5, yb - tierH * .6]);
  }
  const sil = Rp.concat([[w * .1, -h * .02], [-w * .1, -h * .02]], Lp.reverse()).map(p => [x + p[0], y + p[1]]);
  if (far) { S.paint(sil, o.fogCol || P.fog, { seg: 4, rough: 2, alpha: o.alpha || .9, streak: .5, edge: 0, angle: -1.3, light: .3 }); return; }
  S.paint(sil, o.body || '#E4F0E6', { seg: 4, rough: 2.2, angle: -1.2, spread: .7, streak: 1.1, edge: .18, bl: [20, 60], bw: [5, 12], light: .4, dark: .1, sa: [.25, .5] });
  const lw = Math.max(5, h * .03);
  for (let k = 0; k < tiers; k++) {
    const yb = y - h * .05 - (tiers - 1 - k) * tierH, ww = w * (.3 + .7 * (k + 1) / tiers), cnt = Math.max(3, Math.round(ww / 19));
    [-1, 1].forEach(sd => {
      for (let m = 0; m < cnt; m++) {
        const fx = (m + .4 + R() * .3) / cnt, x0 = x + sd * ww * (.1 + .82 * fx), y0 = yb - tierH * (1.0 - .95 * fx) + tierH * .15 + R() * 4;
        const a = ww / cnt * 1.2, b = tierH * (.3 + R() * .12);
        const col = R() < .55 ? o.hook || P.sprMid : (R() < .5 ? P.spr : P.sprLight);
        S.ink([[x0, y0], [x0 + sd * a * .5, y0 + b * .55], [x0 + sd * a * .98, y0 + b], [x0 + sd * a * 1.12, y0 + b * .62]], { w: lw * (.8 + R() * .5), color: col, alpha: .92, taper: true, jitter: .9, seg: 5 });
        if (R() < .7) { const t = .35 + R() * .5; S.paint(K.ellipse(x0 + sd * a * t, y0 + b * (t * 1.05) - lw * .3, lw * .5, lw * .38, 6), '#FFFFFF', { alpha: .95, streak: 0, edge: 0, rough: .3 }); }
      }
    });
  }
  S.paint(K.ellipse(x, y - h + h * .04, w * .12, h * .035, 8), '#FFFFFF', { alpha: .95, streak: 0, edge: 0 });
}
const spruce = pine;
function forest(S, y, x0, x1, hmin, hmax, o = {}) {
  const n = Math.max(1, Math.floor((x1 - x0) / (o.gap || 60))), xs = [];
  for (let i = 0; i <= n; i++) xs.push(x0 + i * (x1 - x0) / n + S.rnd(-14, 14));
  xs.sort(() => S.R() - .5);
  xs.forEach(x => pine(S, x, y + S.rnd(-(o.jy || 10), o.jy || 10), S.rnd(hmin, hmax), o));
}
/* pale misty back trees */
function fogTrees(S, y, x0, x1, hmin, hmax, gap = 46, col = P.fog, a = .85) {
  const n = Math.floor((x1 - x0) / gap);
  for (let i = 0; i <= n; i++) pine(S, x0 + i * gap + S.rnd(-12, 12), y + S.rnd(-8, 8), S.rnd(hmin, hmax), { far: true, fogCol: col, alpha: a });
}
function snowfall(S, n, bigShare = .1) {
  const c = S.c, R = S.R;
  c.save();
  for (let i = 0; i < n; i++) {
    const big = R() < bigShare, r = big ? 4 + R() * 5 : 1.4 + R() * 2.6, x = R() * S.W, y = R() * S.H;
    c.fillStyle = `rgba(255,255,255,${big ? .92 : .6 + R() * .35})`; c.beginPath(); c.ellipse(x, y, r * 1.35, r * .85, -.55, 0, TAU); c.fill();
  }
  c.restore();
}

/* ---------- snow ground ---------- */
function snowHill(S, pts, o = {}) {
  const c = o.col || P.snow;
  S.paint(pts, c, { smooth: true, rough: 3, angle: -.05, spread: .3, streak: .8, bl: [80, 220], bw: [14, 34], edge: .12, light: .18, dark: .1, ...o.p });
  if (o.shadow) S.paint(o.shadow, P.snowSh, { alpha: .6, angle: -.05, streak: .6, edge: 0, rough: 4 });
  if (o.lines) for (let i = 0; i < o.lines; i++) {
    const bb = K.bbox(pts), x = bb.x + S.R() * bb.w, y = bb.y + bb.h * (.25 + S.R() * .6), l = S.rnd(40, 120);
    S.ink([[x, y], [x + l * .5, y - S.rnd(4, 12)], [x + l, y]], { w: 2.4, color: P.snowDeep, alpha: .5 });
  }
}

/* ---------- red cabin / hangar ---------- */
function cabin(S, x, y, s, o = {}) {
  S.at(x, y, s, 0, () => {
    const wall = o.wall || P.falu, dark = mixc(wall, '#1a1030', .35);
    S.paint([[-110, 0], [-112, -110], [110, -112], [112, 0]], wall, { smooth: false, rough: 2, angle: 1.5, streak: 1, spread: .1, bl: [40, 110], bw: [4, 9], edge: .3 });
    for (let i = -100; i < 110; i += 21) S.ink([[i, -108], [i + 1, -4]], { w: 1.4, color: dark, alpha: .35, smooth: false });
    S.paint([[-124, -104], [0, -196], [124, -106], [120, -92], [0, -178], [-118, -90]], P.snow, { smooth: false, rough: 2, alpha: 1, streak: .3, edge: .2 });
    S.paint([[-118, -96], [0, -186], [118, -98], [112, -90], [0, -170], [-110, -86]], mixc(wall, '#1a1030', .3), { smooth: false, alpha: .0, streak: 0, edge: 0 });
    S.paint([[-128, -104], [-4, -206], [-2, -190], [-118, -92]], P.snow, { smooth: false, alpha: 1, streak: .3, edge: 0 });
    S.paint([[-2, -206], [128, -104], [118, -92], [-2, -190]], P.snowSh, { smooth: false, alpha: .9, streak: .3, edge: 0 });
    S.ink([[-128, -104], [-4, -206], [126, -104]], { w: 3.2, alpha: .8, smooth: false });
    if (o.door !== false) {
      S.paint([[-38, 0], [-38, -72], [38, -72], [38, 0]], o.doorCol || '#2A2440', { smooth: false, streak: .4, edge: 0 });
      if (o.doorGlow) S.glow(0, -36, 70, P.fireY, .55, 'screen');
      S.ink([[-42, 0], [-42, -76], [42, -76], [42, 0]], { w: 5, color: P.cream, alpha: .95, smooth: false });
      S.ink([[0, -76], [0, 0]], { w: 3, color: P.cream, alpha: .9, smooth: false });
    }
    const wcol = o.lit ? P.fireY : P.glass;
    S.shape([[-92, -76], [-92, -50], [-66, -50], [-66, -76]], wcol, { smooth: false, lw: 2.6, streak: .3, mis: [2, 1] });
    if (o.lit) S.glow(-79, -63, 80, P.fireY, .5, 'screen');
    S.ink([[-79, -76], [-79, -50]], { w: 2, alpha: .7, smooth: false }); S.ink([[-92, -63], [-66, -63]], { w: 2, alpha: .7, smooth: false });
    S.paint([[-114, 0], [-114, -110], [-104, -110], [-104, 0]], P.cream, { smooth: false, streak: .2, edge: 0 });
    S.paint([[104, 0], [104, -110], [114, -110], [114, 0]], P.cream, { smooth: false, streak: .2, edge: 0 });
    S.paint([[-114, 6], [114, 6], [110, -6], [-110, -6]], P.snow, { smooth: false, streak: .3, edge: 0 });
    if (o.chimney !== false) { S.shape([[60, -170], [60, -206], [84, -206], [84, -160]], P.faluDeep, { smooth: false, lw: 2.6 }); S.paint(K.ellipse(72, -208, 16, 5, 8), P.snow, { streak: 0, edge: 0 }); }
  });
}
function smoke(S, x, y, n, s = 1, col = '#E8E6EE', a = .55) {
  for (let i = 0; i < n; i++) {
    const t = i / n;
    S.paint(K.ellipse(x + Math.sin(t * 4 + S.seed) * 26 * s + t * 30 * s, y - t * 190 * s, (18 + t * 32) * s, (14 + t * 24) * s, 12), col,
      { alpha: a * (1 - t * .55), streak: .4, edge: 0, rough: 3, angle: -1.2 });
  }
}

/* ---------- ink zeds and sparkles ---------- */
function zed(S, x, y, s, col = P.inkSoft) {
  S.ink([[x - 16 * s, y - 14 * s], [x + 14 * s, y - 15 * s], [x - 14 * s, y + 14 * s], [x + 16 * s, y + 13 * s]], { w: 4.6 * s, color: col, alpha: .9, smooth: false, jitter: 1 });
}
function sparkle(S, x, y, s, col = '#FFF6D8') {
  S.paint([[x, y - 12 * s], [x + 3 * s, y - 3 * s], [x + 12 * s, y], [x + 3 * s, y + 3 * s], [x, y + 12 * s], [x - 3 * s, y + 3 * s], [x - 12 * s, y], [x - 3 * s, y - 3 * s]], col, { smooth: false, rough: .5, streak: 0, edge: 0, alpha: .95 });
}
function birds(S, list, col = P.inkSoft) {
  list.forEach(b => S.ink([[b[0] - 14 * b[2], b[1] + 2], [b[0] - 5 * b[2], b[1] - 8 * b[2]], [b[0], b[1]], [b[0] + 6 * b[2], b[1] - 9 * b[2]], [b[0] + 15 * b[2], b[1] + 2]], { w: 2.8 * b[2], color: col, alpha: .85, taper: true }));
}

/* ---------- THE PLANE (Dusty) ---------- */
function plane(S, x, y, s, rot, o = {}) {
  const { eyes = 'open', cap = true, prop = true, mouth = 'smile', blanket = false, look = [0, 0] } = o;
  S.at(x, y, s, rot, () => {
    const L = P.ink;
    // tail plane + fin
    S.shape([[-112, 4], [-144, 14], [-166, 44], [-146, 50], [-108, 28]], P.redDeep, { lw: 3 });
    S.shape([[-136, -12], [-160, -50], [-166, -100], [-146, -114], [-118, -74], [-92, -36]], P.red, { lw: 3.2, angle: -1.1 });
    S.paint([[-146, -44], [-158, -66], [-146, -84], [-140, -70], [-134, -56]], P.cream, { alpha: .95, streak: .3, edge: 0, rough: 1 });
    // water tank
    S.shape(K.ellipse(-8, 52, 54, 12, 14), P.musDeep, { lw: 2.6 });
    // landing gear
    S.ink([[70, 42], [76, 86]], { w: 7, color: L, taper: false }); S.ink([[-70, 34], [-66, 70]], { w: 6, color: L, taper: false });
    S.shape(K.ellipse(77, 96, 20, 20, 12), '#2B3250', { lw: 3 }); S.paint(K.ellipse(77, 96, 8, 8, 8), P.cream, { streak: 0, edge: 0, rough: .5 });
    S.shape(K.ellipse(-66, 80, 15, 15, 12), '#2B3250', { lw: 3 }); S.paint(K.ellipse(-66, 80, 6, 6, 8), P.cream, { streak: 0, edge: 0, rough: .5 });
    // fuselage
    const fus = [[-156, -6], [-150, -14], [-122, -36], [-62, -54], [0, -60], [62, -58], [108, -44], [132, -18], [134, 10], [116, 38], [72, 54], [10, 60], [-52, 52], [-104, 30], [-142, 6]];
    S.paint(fus, P.cream, { off: [3, 2], rough: 1.6, angle: -.08, streak: 1.2, bw: [10, 22], bl: [60, 170], light: .3, dark: .1, edge: .3 });
    S.clipTo(fus, () => {
      S.paint([[-170, 14], [-100, 26], [-30, 30], [40, 26], [100, 12], [150, 0], [150, 90], [-170, 90]], P.mus, { alpha: 1, angle: -.08, streak: .8, rough: 2 });
      S.paint([[-170, 20], [-100, 33], [-30, 37], [40, 33], [100, 19], [150, 6], [150, 90], [-170, 90]], P.red, { alpha: 1, angle: -.08, streak: 1, rough: 2 });
      S.paint([[96, -70], [88, -20], [90, 30], [102, 78], [160, 78], [160, -70]], P.red, { smooth: false, rough: 1.6, angle: -1.3, streak: .9 });
      S.ink([[96, -60], [90, -20], [92, 30], [104, 70]], { w: 3.4, color: P.redDeep, alpha: .9, taper: false });
      S.hatch([[-170, 30], [150, 30], [150, 90], [-170, 90]], { smooth: false, angle: -.9, gap: 9, color: P.redDeep, alpha: .3 });
      S.hatch([[-170, -80], [30, -80], [-30, 20], [-170, 20]], { smooth: false, angle: 1.0, gap: 13, color: '#8C7FA8', alpha: .12 });
      if (blanket) blanketFill(S);
    });
    for (let i = 0; i < 9; i++) { const rx = -112 + i * 13, ry = 30 - Math.abs(i - 4) * .5 + (i < 3 ? -i * 1.2 : 0); }
    S.ink(fus, { w: 3, closed: true, taper: false, alpha: .92, jitter: 1.7 });
    S.ink([[-124, -12], [-60, -6], [10, -8], [70, -12]], { w: 1.6, color: P.inkSoft, alpha: .4 });
    for (let i = 0; i < 7; i++) S.paint(K.ellipse(-100 + i * 26, 18 + Math.sin(i) * 1.5, 2.2, 2.2, 6), P.ink, { alpha: .55, streak: 0, edge: 0, rough: .4 });
    // fire brigade emblem
    S.paint([[-52, -8], [-66, -26], [-52, -44], [-46, -32], [-38, -26], [-38, -14], [-44, -6]], P.red, { rough: .8, streak: .3, edge: 0, alpha: .95 });
    S.paint([[-51, -12], [-56, -24], [-50, -32], [-45, -22]], P.cream, { rough: .5, streak: 0, edge: 0 });
    // wing
    S.shape([[24, 14], [46, 28], [42, 58], [4, 80], [-34, 88], [-46, 76], [-18, 54], [4, 32]], P.mus, { lw: 3.4, angle: -.7, streak: 1, light: .3 });
    S.ink([[26, 34], [20, 52], [-4, 68], [-32, 78]], { w: 5, color: P.cream, taper: true, alpha: .95, jitter: .8 });
    S.paint([[-26, 84], [-46, 76], [-38, 90], [-32, 92]], P.red, { smooth: false, rough: .8, streak: 0, edge: 0 });
    // canopy + eyes
    const dome = [[2, -44], [4, -76], [30, -100], [64, -108], [98, -98], [116, -70], [114, -40]];
    S.shape(dome, P.glass, { lw: 3.6, angle: -.5, light: .4 });
    S.ink([[16, -84], [30, -98], [52, -104]], { w: 3, color: '#F7FCFF', alpha: .85, taper: true });
    const ey = [[40, -56, 21], [82, -56, 21]];
    ey.forEach((e, i) => {
      S.paint(K.ellipse(e[0], e[1], e[2], e[2], 12), '#FBF6E8', { alpha: 1, streak: 0, edge: .5, rough: .8 });
      S.ink(K.ellipse(e[0], e[1], e[2], e[2], 14), { w: 2.4, closed: true, taper: false, alpha: .85, jitter: .8 });
      if (eyes === 'open') {
        S.paint(K.ellipse(e[0] + 5 + look[0], e[1] + 1 + look[1], 11, 12, 10), P.ink, { alpha: 1, streak: 0, edge: 0, rough: .5 });
        S.paint(K.ellipse(e[0] + 1 + look[0], e[1] - 4 + look[1], 3.6, 3.6, 6), '#FFFFFF', { alpha: 1, streak: 0, edge: 0, rough: .3 });
      } else if (eyes === 'closed') {
        S.paint(K.ellipse(e[0], e[1], e[2] + 2, e[2], 12), mixc(P.glass, P.snowSh, .4), { alpha: .95, streak: 0, edge: 0 });
        S.ink([[e[0] - 15, e[1] - 4], [e[0], e[1] + 8], [e[0] + 15, e[1] - 4]], { w: 3.6, taper: true });
      } else {
        S.paint(K.ellipse(e[0], e[1], e[2], e[2], 12), '#FBF6E8', { alpha: 1, streak: 0, edge: 0 });
        S.ink([[e[0] - 15, e[1] + 6], [e[0], e[1] - 10], [e[0] + 15, e[1] + 6]], { w: 4, taper: true });
      }
    });
    if (eyes !== 'closed') { S.ink([[16, -82], [42, -90], [58, -80]], { w: 3, alpha: .7 }); S.ink([[70, -82], [92, -90], [108, -78]], { w: 3, alpha: .7 }); }
    // mouth + cheek
    S.paint(K.ellipse(98, 22, 12, 7, 8), P.pink, { alpha: .7, streak: 0, edge: 0 });
    if (mouth === 'smile') S.ink([[96, 6], [112, 22], [128, 8]], { w: 4, taper: true });
    else if (mouth === 'big') S.paint([[94, 4], [104, 30], [120, 32], [130, 6]], P.ink, { alpha: 1, streak: 0, edge: 0, rough: .6 });
    else S.paint(K.ellipse(112, 16, 6, 8, 8), P.ink, { alpha: 1, streak: 0, edge: 0 });
    // helmet
    if (cap) {
      S.shape([[26, -96], [34, -122], [62, -138], [92, -128], [100, -100]], P.mus, { lw: 3.4, light: .35 });
      S.shape([[18, -98], [22, -108], [104, -108], [110, -98], [104, -92], [22, -90]], P.musDeep, { lw: 3, streak: .3 });
      S.shape(K.ellipse(63, -117, 9, 9, 8), P.red, { lw: 2, streak: 0 });
      S.paint([[63, -125], [58, -118], [63, -110], [68, -118]], P.cream, { rough: .4, streak: 0, edge: 0 });
    }
    // propeller
    if (prop) {
      S.paint(K.ellipse(142, -2, 12, 62, 16), P.ink, { alpha: .13, streak: 0, edge: 0, rough: 1 });
      S.shape([[138, -66], [150, -60], [152, -2], [140, 4]], mixc(P.wood, P.ink, .2), { lw: 2.4, streak: .3, mis: [1, 1] });
      S.shape([[140, 6], [152, 0], [150, 64], [138, 68]], mixc(P.wood, P.ink, .2), { lw: 2.4, streak: .3, mis: [1, 1] });
    }
    S.shape(K.ellipse(134, -2, 11, 13, 10), P.mus, { lw: 3, streak: .3 });
  });
}
function blanketFill(S) {
  const cols = [P.cream, P.red, P.cream, P.lake, P.cream, P.mus, P.cream];
  const edge = [[-170, -80], [8, -80], [-4, -50], [10, -22], [-2, 8], [10, 36], [-2, 70], [-170, 70]];
  S.paint(edge, P.cream, { smooth: false, rough: 1.2, streak: .3 });
  cols.forEach((c, i) => { if (i % 2) S.paint([[-172, -70 + i * 20], [6, -70 + i * 20], [6, -56 + i * 20], [-172, -56 + i * 20]], c, { smooth: false, rough: 1.3, streak: .3, edge: 0 }); });
  S.ink(edge, { w: 3.2, smooth: false, closed: false, alpha: .8 });
}

/* ---------- FIRE ---------- */
function fire(S, x, y, s, o = {}) {
  const small = o.small || 1;
  S.at(x, y, s, 0, () => {
    S.paint(K.ellipse(0, 6, 90, 16, 12), P.snowSh, { alpha: .55, streak: .2, edge: 0 });
    S.paint(K.ellipse(0, 4, 74, 12, 12), '#3D2A3A', { alpha: .35, streak: 0, edge: 0 });
    S.shape([[-70, -4], [-60, -18], [56, -4], [64, 8], [-56, 12]], P.wood, { lw: 2.6, angle: .1 });
    S.shape([[60, -8], [46, -22], [-52, -2], [-62, 10], [50, 4]], mixc(P.wood, P.ink, .25), { lw: 2.6, angle: -.1 });
    const k = small;
    const sc = q => q.map(p => [p[0] * k, p[1] * k]);
    S.shape(sc([[-46, -6], [-62, -50], [-40, -96], [-44, -140], [-6, -196], [8, -152], [42, -116], [62, -62], [48, -6]]), P.fire, { lw: 3, lc: '#7A2C18', angle: -1.5, light: .3, streak: 1.2, bl: [25, 70] });
    S.paint(sc([[-28, -6], [-34, -40], [-12, -92], [-2, -130], [16, -84], [32, -42], [26, -6]]), P.fireY, { angle: -1.5, streak: 1, bl: [20, 50], edge: 0 });
    S.paint(sc([[-12, -6], [-14, -30], [0, -62], [14, -30], [12, -6]]), P.fireC, { angle: -1.5, streak: .3, edge: 0 });
    if (!o.noface) {
      S.paint(K.ellipse(-9 * k, -34 * k, 4 * k, 5 * k, 6), P.ink, { alpha: .9, streak: 0, edge: 0, rough: .3 });
      S.paint(K.ellipse(11 * k, -34 * k, 4 * k, 5 * k, 6), P.ink, { alpha: .9, streak: 0, edge: 0, rough: .3 });
      S.ink([[-8 * k, -20 * k], [1 * k, -13 * k], [10 * k, -20 * k]], { w: 3 * k, alpha: .85 });
    }
  });
  const ga = o.glow === undefined ? .55 : o.glow;
  S.glow(x, y - 70 * s * small, 320 * s * small, P.fire, ga, 'screen');
  S.glow(x, y - 20 * s, 300 * s * small, '#F29A3A', ga * .7, 'multiply');
  if (!o.nosparks) for (let i = 0; i < 9; i++) sparkle(S, x + S.rnd(-60, 60) * s, y - S.rnd(120, 300) * s * small, S.rnd(.25, .5), i % 2 ? P.fireY : '#FFE1A0');
}

/* ---------- long-strand fur ---------- */
function furFill(S, pts, o = {}) {
  const c = S.c, R = S.R, { top = P.fur, bot = P.furWarm, n = 900, len = [34, 100], lw = [2.6, 6], hem = true, shade = P.furCool, shadeSide = 1 } = o;
  const poly = K.resample(K.catmull(pts, true, 8), 5, true), path = pathOfPoly(poly), bb = K.bbox(poly);
  c.save();
  const g = c.createLinearGradient(0, bb.y, 0, bb.y + bb.h); g.addColorStop(0, K.rgba(top)); g.addColorStop(.55, K.rgba(top)); g.addColorStop(1, K.rgba(bot));
  c.fillStyle = g; c.fill(path); c.clip(path);
  c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = bb.x + R() * bb.w, y = bb.y + R() * bb.h, t = (y - bb.y) / bb.h, side = ((x - bb.x) / bb.w - .5) * shadeSide;
    let col = R() < .5 ? '#FFFFFF' : K.mix(top, bot, clampT(t + (R() - .5) * .5));
    if (side > .12 && R() < .5) col = K.mix(col, shade, .6);
    const L = K.lerp(len[0], len[1], R());
    c.strokeStyle = K.rgba(col, .55 + R() * .4); c.lineWidth = K.lerp(lw[0], lw[1], R());
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + (R() - .5) * 6, y + L / 2, x + (R() - .5) * 8, y + L); c.stroke();
  }
  c.restore();
  if (hem) {
    const bot0 = poly.filter(p => p[1] > bb.y + bb.h * .93);
    for (let i = 0; i < bot0.length; i += 1) {
      const p = bot0[i]; c.strokeStyle = K.rgba(R() < .5 ? bot : '#FFFFFF', .85); c.lineWidth = 3 + R() * 3;
      c.beginPath(); c.moveTo(p[0], p[1] - 8); c.lineTo(p[0] + (R() - .5) * 6, p[1] + 8 + R() * 22); c.stroke();
    }
  }
}
const pathOfPoly = poly => { const p = new Path2D(); p.moveTo(poly[0][0], poly[0][1]); for (let i = 1; i < poly.length; i++) p.lineTo(poly[i][0], poly[i][1]); p.closePath(); return p; };
const clampT = t => Math.max(0, Math.min(1, t));

/* ---------- YETI (tall, shaggy, googly eyes) ---------- */
function yeti(S, x, y, s, o = {}) {
  const { face = 'worry', arms = 'down' } = o, R = S.R;
  S.at(x, y, s, 0, () => {
    S.paint(K.ellipse(0, 8, 200, 20, 14), P.snowSh, { alpha: .6, streak: .2, edge: 0 });
    // feet: black, splayed, clawed
    [-1, 1].forEach(sd => {
      S.paint([[sd * 40, -16], [sd * 120, -22], [sd * 172, -2], [sd * 130, 12], [sd * 50, 8]], '#1E2532', { alpha: 1, rough: 2, streak: .6, edge: 0, angle: 0 });
      for (let t = 0; t < 4; t++) S.ink([[sd * (120 + t * 10), -18 + t * 8], [sd * (168 + t * 8), -6 + t * 12], [sd * (186 + t * 6), 6 + t * 14]], { w: 9, color: '#1E2532', alpha: 1 });
    });
    const arm = (sd, up) => {
      const q = up ? [[sd * 100, -440], [sd * 170, -510], [sd * 206, -620], [sd * 176, -680], [sd * 140, -640], [sd * 130, -550], [sd * 84, -460]]
        : [[sd * 100, -450], [sd * 156, -390], [sd * 184, -220], [sd * 176, -110], [sd * 136, -100], [sd * 124, -230], [sd * 82, -350]];
      furFill(S, q, { n: 260, len: [28, 70], hem: false });
      const hx = sd * (up ? 170 : 152), hy = up ? -650 : -120;
      S.ink(q.concat([q[0]]), { w: 3, color: '#8FA0BE', alpha: .45, closed: false, taper: false, jitter: 2 });
      for (let t = -1; t <= 1; t++) S.ink([[hx + t * 14, hy], [hx + t * 24, hy + (up ? -40 : 44)]], { w: 12, color: '#1E2532', alpha: 1 });
    };
    const armOpts = arms === 'cheer' ? [true, true] : arms === 'worry' ? [false, false] : [false, false];
    // body
    furFill(S, [[-112, -6], [-124, -170], [-120, -340], [-96, -470], [-54, -566], [0, -596], [58, -572], [100, -480], [126, -340], [130, -170], [116, -6]], { n: 1500, len: [46, 120] });
    arm(-1, armOpts[0]); arm(1, armOpts[1]);
    if (arms === 'worry') { // paw on cheek
      furFill(S, [[80, -330], [140, -360], [156, -430], [120, -456], [86, -410]], { n: 120, len: [20, 40], hem: false });
      for (let t = -1; t <= 1; t++) S.ink([[118 + t * 12, -448], [124 + t * 16, -480]], { w: 9, color: '#1E2532', alpha: 1 });
    }
    S.at(0, -62, 1, 0, () => {
    // fringe over forehead
    for (let i = -70; i < 90; i += 9) S.ink([[i, -528 + Math.abs(i) * .05], [i + (R() - .5) * 12, -470 - R() * 24]], { w: 7, color: i % 2 ? '#FFFFFF' : P.furWarm, alpha: .95, taper: true, jitter: .6 });
    // face
    const ex = [[-52, -430], [56, -430]];
    ex.forEach((e, i) => {
      const gaze = face === 'worry' ? [-5, 8] : face === 'happy' ? [3, -3] : [0, 0];
      S.ink(K.ellipse(e[0], e[1], 36, 36, 16), { w: 15, color: '#1E2532', closed: true, taper: false, alpha: 1, jitter: 2.2, passes: 2 });
      S.paint(K.ellipse(e[0], e[1], 30, 30, 14), '#FFFFFF', { alpha: 1, streak: 0, edge: 0, rough: .6 });
      if (face === 'sleep') { S.paint(K.ellipse(e[0], e[1], 30, 30, 14), P.furWarm, { alpha: 1, streak: 0, edge: 0 }); S.ink([[e[0] - 22, e[1] - 4], [e[0], e[1] + 12], [e[0] + 22, e[1] - 4]], { w: 6 }); }
      else { S.paint(K.ellipse(e[0] + gaze[0] + 6, e[1] + gaze[1], 11, 11, 10), '#141922', { alpha: 1, streak: 0, edge: 0, rough: .4 }); S.paint(K.ellipse(e[0] + gaze[0] + 2, e[1] + gaze[1] - 4, 3.4, 3.4, 6), '#fff', { alpha: 1, streak: 0, edge: 0, rough: .2 }); }
    });
    if (face === 'worry') { S.ink([[-96, -486], [-58, -474], [-24, -488]], { w: 7 }); S.ink([[100, -486], [62, -474], [30, -488]], { w: 7 }); }
    S.paint(K.ellipse(2, -364, 72, 46, 14), '#5E6672', { alpha: 1, streak: .8, angle: .1, rough: 1.4, bw: [4, 9], bl: [20, 50], light: .25 });
    S.paint(K.ellipse(-2, -384, 50, 14, 10), '#8A929C', { alpha: .55, streak: 0, edge: 0 });
    S.paint(K.ellipse(-22, -372, 8, 6, 8), '#1E2532', { alpha: 1, streak: 0, edge: 0, rough: .3 }); S.paint(K.ellipse(26, -372, 8, 6, 8), '#1E2532', { alpha: 1, streak: 0, edge: 0, rough: .3 });
    if (face === 'happy') { S.shape([[-46, -354], [-30, -318], [0, -308], [34, -318], [50, -354]], P.pink, { lw: 4, lc: '#1E2532', streak: .3, mis: [1, 1] }); S.paint(K.ellipse(2, -324, 20, 8, 8), '#B0424C', { alpha: .8, streak: 0, edge: 0 }); }
    else if (face === 'sleep') S.ink([[-30, -346], [0, -338], [30, -346]], { w: 6 });
    else S.shape([[-38, -350], [-18, -332], [2, -340], [22, -330], [42, -350]], P.pink, { lw: 4, lc: '#1E2532', streak: .3, mis: [1, 1] });
    });
  });
}

/* ---------- CHILD in a pom-pom hat ---------- */
function child(S, x, y, s, o = {}) {
  const { face = 'worry', arms = 'worry', flip = false, jacket = P.mus, hat = P.red } = o, R = S.R, BR = '#5A3A30';
  S.at(x, y, s, 0, () => {
    S.paint(K.ellipse(0, 6, 76, 10, 12), P.snowSh, { alpha: .6, streak: .2, edge: 0 });
    // boots, legs
    [-1, 1].forEach(sd => {
      S.shape([[sd * 8 - 15, -60], [sd * 8 + 15, -60], [sd * 8 + 16, -8], [sd * 8 + 34, -2], [sd * 8 + 34, 10], [sd * 8 - 15, 10]], sd < 0 ? P.red : P.redDeep, { lw: 2.6, lc: BR, smooth: false, streak: .3 });
      S.shape([[sd * 8 - 14, -118], [sd * 8 + 14, -118], [sd * 8 + 15, -58], [sd * 8 - 15, -58]], '#2A3550', { lw: 2.4, lc: BR, smooth: false, streak: .5 });
    });
    // arms behind
    const armPts = (sd) => arms === 'cheer' ? [[sd * 34, -196], [sd * 68, -240], [sd * 80, -290], [sd * 64, -296], [sd * 48, -246], [sd * 28, -206]]
      : [[sd * 34, -196], [sd * 62, -170], [sd * 52, -226], [sd * 26, -238]];
    // jacket
    S.shape([[-40, -210], [-46, -150], [-40, -108], [40, -108], [46, -150], [40, -210], [22, -228], [-22, -228]], jacket, { lw: 2.8, lc: BR, angle: 1.4, streak: 1, bw: [5, 10], light: .3 });
    S.ink([[0, -226], [0, -110]], { w: 2.6, color: BR, alpha: .8 }); S.ink([[-40, -150], [40, -150]], { w: 2.4, color: BR, alpha: .5 });
    [-1, 1].forEach(sd => {
      S.shape(armPts(sd), jacket, { lw: 2.6, lc: BR, angle: 1.4, streak: .8 });
      const hp = arms === 'cheer' ? [sd * 72, -300] : [sd * 44, -230];
      S.shape(K.ellipse(hp[0], hp[1], 14, 14, 8), P.red, { lw: 2.4, lc: BR, streak: .3 });
    });
    // scarf
    S.shape([[-30, -226], [30, -226], [34, -204], [-34, -204]], P.red, { lw: 2.6, lc: BR, smooth: false, streak: .5 });
    for (let i = -24; i < 30; i += 10) S.ink([[i, -224], [i + 2, -206]], { w: 2.2, color: P.cream, alpha: .8, smooth: false });
    S.shape([[16, -206], [34, -170], [24, -150], [10, -160], [14, -190]], P.red, { lw: 2.4, lc: BR, streak: .3 });
    // head
    S.shape(K.ellipse(0, -262, 34, 36, 14), '#F2C9A4', { lw: 2.6, lc: BR, streak: .5 });
    S.ink([[10, -252], [22, -240], [10, -236]], { w: 3, color: BR }); // nose
    S.paint(K.ellipse(-16, -236, 8, 5, 8), P.pink, { alpha: .5, streak: 0, edge: 0 });
    [-10, 14].forEach(e => {
      if (face === 'happy') S.ink([[e - 5, -248], [e, -255], [e + 5, -248]], { w: 2.8, color: BR });
      else S.paint(K.ellipse(e, -252, 3.2, 3.8, 6), BR, { alpha: 1, streak: 0, edge: 0, rough: .3 });
    });
    if (face === 'worry') { S.ink([[-16, -264], [-6, -267]], { w: 2.6, color: BR }); S.ink([[8, -267], [20, -264]], { w: 2.6, color: BR }); S.ink([[-6, -226], [2, -230], [10, -226]], { w: 2.6, color: BR }); }
    else S.shape([[-8, -232], [0, -224], [10, -232]], '#C0524E', { lw: 2, lc: BR, streak: 0 });
    // hair + hat
    S.paint([[-38, -270], [-46, -240], [-30, -244], [-32, -262]], '#E2B060', { alpha: 1, streak: .3, edge: 0 }); S.paint([[36, -270], [40, -244], [28, -246], [30, -262]], '#E2B060', { alpha: 1, streak: .3, edge: 0 });
    S.shape([[-40, -276], [-36, -312], [-10, -338], [22, -334], [40, -304], [42, -276], [0, -284]], hat, { lw: 2.8, lc: BR, angle: 1.4, streak: 1, bw: [3, 7] });
    for (let i = -34; i < 40; i += 9) S.ink([[i, -278], [i + 1, -322 + Math.abs(i) * .3]], { w: 2, color: '#F0A090', alpha: .6, smooth: false });
    S.shape([[-44, -272], [-42, -286], [44, -288], [46, -272]], hat, { lw: 2.6, lc: BR, smooth: false, streak: .6 });
    S.shape(K.furry(K.ellipse(30, -336, 20, 20, 10), R, 5, 9), '#E0442E', { smooth: false, lw: 2.4, lc: BR, streak: .6 });
  }, flip);
}

/* ---------- MOOSE ---------- */
function moose(S, x, y, s, o = {}) {
  const { col = '#8B644C', alpha = 1, flip = false } = o, dk = K.mix(col, '#1D2430', .3);
  S.at(x, y, s, 0, () => {
    [[-96, 1], [-56, .9], [58, .9], [98, 1]].forEach(([lx, k], i) => S.paint([[lx - 12, -120], [lx + 12, -120], [lx + 8, -14], [lx + 10, 0], [lx - 8, 0], [lx - 8, -14]], i % 3 ? dk : col, { alpha, smooth: false, streak: .5, edge: 0, rough: 1.2 }));
    S.paint([[-140, -160], [-118, -226], [-60, -252], [20, -240], [96, -224], [136, -186], [130, -128], [96, -100], [-92, -104]], col, { alpha, angle: -.1, streak: 1.1, bl: [40, 110], edge: .2 });
    S.paint([[-136, -206], [-108, -274], [-52, -280], [-30, -236]], K.mix(col, '#1D2430', .1), { alpha, streak: .5, edge: 0 });
    S.paint([[-124, -216], [-172, -258], [-214, -240], [-200, -200], [-140, -170]], col, { alpha, streak: .6 });
    S.paint([[-186, -260], [-250, -240], [-286, -190], [-268, -164], [-214, -196], [-180, -206]], K.mix(col, '#3a2a28', .12), { alpha, streak: .5 });
    S.paint(K.ellipse(-274, -180, 20, 16, 8), dk, { alpha, streak: 0, edge: 0 });
    S.paint(K.ellipse(-228, -238, 4.5, 4.5, 6), P.ink, { alpha, streak: 0, edge: 0, rough: .2 });
    S.paint([[-180, -262], [-196, -290], [-176, -282]], col, { alpha, smooth: false, streak: 0, edge: 0 });
    const ant = [[-176, -266], [-190, -320], [-222, -366], [-190, -358], [-204, -404], [-170, -376], [-158, -424], [-142, -374], [-124, -394], [-130, -334], [-148, -290]];
    [ant.map(p => [p[0] + 74, p[1] + 10]), ant].forEach((a, i) => S.paint(a, i ? '#DDCDA6' : '#C4B48E', { alpha, smooth: false, streak: .5, edge: .25, rough: 1.4 }));
  }, flip);
}

/* ---------- BELL POST ---------- */
function bellPost(S, x, y, s, swing = .2) {
  S.at(x, y, s, 0, () => {
    S.shape([[-92, 0], [-92, -260], [-74, -260], [-74, 0]], P.wood, { lw: 3, smooth: false, angle: 1.5, streak: 1, bw: [4, 9] });
    S.shape([[74, 0], [74, -260], [92, -260], [92, 0]], P.wood, { lw: 3, smooth: false, angle: 1.5, streak: 1, bw: [4, 9] });
    S.shape([[-112, -256], [112, -256], [112, -282], [-112, -282]], mixc(P.wood, P.ink, .2), { lw: 3, smooth: false, angle: 0 });
    S.ink([[-92, -190], [-30, -258]], { w: 8, color: P.wood, taper: false }); S.ink([[92, -190], [30, -258]], { w: 8, color: P.wood, taper: false });
    S.paint([[-120, -280], [0, -302], [120, -280], [112, -270], [0, -290], [-112, -270]], P.snow, { smooth: false, streak: .2, edge: 0 });
    S.at(0, -256, 1, swing, () => {
      S.ink([[0, 0], [0, 26]], { w: 4, taper: false });
      S.shape([[-44, 108], [-42, 62], [-24, 32], [0, 24], [24, 32], [42, 62], [44, 108]], P.mus, { lw: 3.4, angle: 1.4, streak: .8, light: .4 });
      S.shape([[-54, 112], [54, 112], [50, 124], [-50, 124]], P.musDeep, { lw: 3, smooth: false });
      S.shape(K.ellipse(0, 140, 10, 10, 8), P.ink, { lw: 0, line: false });
      S.ink([[-22, 50], [-26, 84]], { w: 5, color: '#FFF3C6', alpha: .8 });
    });
  });
}

/* ---------- AURORA / RAINBOW / TRACKS / WATER ---------- */
function aurora(S, x0, x1, yBase, hgt, c1, c2, seed = 0) {
  const c = S.c;
  c.save(); c.globalCompositeOperation = 'screen';
  for (let x = x0; x < x1; x += 5) {
    const t = (x - x0) / (x1 - x0), yb = yBase + Math.sin(t * 5 + seed) * 46 + Math.sin(t * 11 + seed * 2) * 16;
    const h = hgt * (.45 + .55 * Math.abs(S.N(x * .012 + seed))) + 20;
    const g = c.createLinearGradient(x, yb, x, yb - h);
    g.addColorStop(0, K.rgba(c1, 0)); g.addColorStop(.18, K.rgba(c1, .34)); g.addColorStop(.7, K.rgba(c2, .14)); g.addColorStop(1, K.rgba(c2, 0));
    c.strokeStyle = g; c.lineWidth = 7 + S.R() * 8; c.beginPath(); c.moveTo(x, yb); c.lineTo(x + Math.sin(t * 6) * 8, yb - h); c.stroke();
  }
  c.restore();
}
function rainbowUnused(S, cx, cy, r, bandW) {
  const cols = ['#E8877A', '#F0AC5C', '#F5D97A', '#93BD86', '#6FA6C0', '#8E86C2'];
  for (let pass = 0; pass < 2; pass++) cols.forEach((col, i) => {
    const rr = r - i * bandW * .9;
    for (let a = Math.PI; a < TAU; a += .012) {
      const jr = rr + (S.R() - .5) * 4;
      S.bristle(cx + Math.cos(a) * jr, cy + Math.sin(a) * jr, a + Math.PI / 2, 26 + S.R() * 20, bandW * (.9 + S.R() * .3), col, pass ? .12 : .2);
    }
  });
}
function tracks(S, x0, y0, x1, y1, n, size = 1, col = P.snowSh) {
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), x = K.lerp(x0, x1, t) + (i % 2 ? 10 : -10) * size, y = K.lerp(y0, y1, t) + (i % 2 ? 4 : -4);
    S.paint(K.ellipse(x, y, 16 * size * (.6 + t * .5), 8 * size * (.6 + t * .5), 10), col, { alpha: .75, streak: 0, edge: .2, rough: 1 });
  }
}
function droplet(S, x, y, s, col = '#DDF0F7') {
  S.paint([[x, y - 12 * s], [x + 6 * s, y - 2 * s], [x + 7 * s, y + 5 * s], [x, y + 10 * s], [x - 7 * s, y + 5 * s], [x - 6 * s, y - 2 * s]], col, { alpha: .92, rough: .5, streak: 0, edge: .5 });
}
