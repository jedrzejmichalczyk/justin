/* Nine scenes, 1200x900. Muted gouache, misty pines, falling snow. */
const SCENES = [];
const sky = (S, a, b, c, o = {}) => S.wash([[0, a], [.55, b], [1, c || b]], { n: 220, bands: [.04, .09], ...o });
const grade = (S, y0, col, a) => { const c = S.c; c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = a; c.fillStyle = col; c.fillRect(0, y0, S.W, S.H - y0); c.restore(); };
const speedLines = (S, list, col = '#FFFFFF') => list.forEach(l => { for (let i = 0; i < 3; i++) S.bristle(l[0] + i * 6, l[1] + i * 5, 0, l[2], 9, col, .6); });
const bgForest = (S, y, fog1 = '#C3D0C3', fog2 = '#AABCAF') => { fogTrees(S, y - 30, -20, 1220, 150, 250, 54, fog1, .9); fogTrees(S, y + 10, -20, 1220, 110, 190, 46, fog2, .95); };
const framePines = (S, o = {}) => { pine(S, 30, 980, 640, { w: 230, ...o }); pine(S, 1175, 980, 580, { w: 210, ...o }); };
const prints = (S, x0, y0, x1, y1, n, sz) => tracks(S, x0, y0, x1, y1, n, sz, '#A9D1C6');

/* 0 - cover */
SCENES.push(S => {
  S.begin();
  sky(S, '#A2AE94', '#B9C3A6', '#CDD2B6');
  S.paint(K.ellipse(880, 250, 110, 110, 16), '#E6E3B8', { alpha: .55, streak: .4, edge: 0, rough: 3 });
  cloud(S, 190, 210, 1.1, '#DDE3CF', .5);
  bgForest(S, 620);
  snowHill(S, [[0, 640], [300, 610], [700, 636], [1200, 606], [1200, 900], [0, 900]], { col: P.snowMid, lines: 5 });
  forest(S, 700, 140, 520, 250, 360, { gap: 90 }); forest(S, 700, 720, 1100, 250, 360, { gap: 90 });
  yeti(S, 175, 846, .72, { face: 'happy', arms: 'down' });
  snowHill(S, [[0, 800], [400, 770], [800, 796], [1200, 770], [1200, 900], [0, 900]], { col: P.snow, shadow: [[0, 860], [600, 846], [1200, 856], [1200, 900], [0, 900]], lines: 8 });
  prints(S, 260, 890, 580, 850, 7, 1.5);
  child(S, 900, 870, 1.15, { face: 'happy', arms: 'worry', flip: true });
  pine(S, 20, 990, 700, { w: 250 }); pine(S, 1185, 990, 620, { w: 230 });
  plane(S, 640, 330, 1.5, -.1);
  speedLines(S, [[80, 320, 200], [40, 380, 170], [140, 450, 150]], '#EDF1E0');
  snowfall(S, 900);
  S.finish();
});

/* 1 - morning, Dusty asleep */
SCENES.push(S => {
  S.begin();
  sky(S, '#C2A9AE', '#DDBBB0', '#EBD0B4');
  S.paint(K.ellipse(330, 560, 130, 130, 18), '#F2D9B2', { alpha: .6, streak: .3, edge: 0, rough: 3 });
  S.paint(K.ellipse(330, 560, 78, 78, 16), '#F8E6BD', { alpha: .9, streak: .4, edge: 0 });
  cloud(S, 900, 200, 1.1, '#EACBC0', .7); cloud(S, 190, 170, .9, '#E6C6BE', .7);
  bgForest(S, 640, '#D2B8B6', '#BEA6AC');
  snowHill(S, [[0, 700], [260, 672], [600, 700], [1000, 668], [1200, 690], [1200, 900], [0, 900]], { col: '#EFE3E0', lines: 5, shadow: [[0, 760], [500, 740], [1200, 750], [1200, 900], [0, 900]] });
  forest(S, 720, 700, 1150, 200, 300, { gap: 110 });
  snowHill(S, [[0, 800], [300, 770], [700, 800], [1200, 774], [1200, 900], [0, 900]], { col: '#F8F2EE', shadow: [[0, 852], [500, 834], [1200, 846], [1200, 900], [0, 900]], lines: 9 });
  cabin(S, 290, 826, 1.05, { doorGlow: true, lit: true }); smoke(S, 366, 600, 7, 1, '#F3E3E0', .7);
  plane(S, 830, 690, 1.3, 0, { eyes: 'closed', cap: false, prop: false, mouth: 'o', blanket: true });
  zed(S, 990, 500, 1.1); zed(S, 1050, 430, 1.5); zed(S, 1120, 340, 1.9);
  prints(S, 470, 884, 650, 842, 6, 1.3);
  framePines(S);
  snowfall(S, 420, .06);
  S.finish();
});

/* 2 - the bell rings */
SCENES.push(S => {
  S.begin();
  sky(S, '#AEC3B9', '#C8D6C6', '#DCE4CD');
  S.paint(K.ellipse(930, 230, 100, 100, 16), '#EEF0C8', { alpha: .6, streak: .3, edge: 0, rough: 3 });
  cloud(S, 210, 170, 1.1, '#E6EEDD', .8); cloud(S, 660, 110, .8, '#E6EEDD', .8);
  bgForest(S, 630);
  snowHill(S, [[0, 704], [260, 676], [640, 704], [1000, 670], [1200, 696], [1200, 900], [0, 900]], { col: P.snowMid, lines: 5 });
  forest(S, 726, 560, 1180, 200, 320, { gap: 100 });
  snowHill(S, [[0, 806], [300, 776], [700, 804], [1200, 778], [1200, 900], [0, 900]], { col: P.snow, shadow: [[0, 856], [500, 838], [1200, 848], [1200, 900], [0, 900]], lines: 9 });
  cabin(S, 1010, 810, .66, { doorGlow: true });
  bellPost(S, 320, 850, 1.4, .3);
  for (let i = 0; i < 3; i++) [-1, 1].forEach(d => S.ink([[320 + d * (112 + i * 8), 600 - i * 28], [320 + d * (146 + i * 16), 588 - i * 42]], { w: 6, color: P.red, alpha: .95 }));
  plane(S, 790, 700, 1.35, 0, { eyes: 'open', look: [-6, -5], cap: true, prop: false, mouth: 'o' });
  sparkle(S, 230, 480, .9, '#FFF'); sparkle(S, 440, 450, .7, '#FFF');
  framePines(S);
  snowfall(S, 480, .07);
  S.finish();
});

/* 3 - flight over forest and fjord */
SCENES.push(S => {
  S.begin();
  sky(S, '#A9C4C0', '#C4D8CE', '#DCE6D2');
  S.paint(K.ellipse(1010, 200, 90, 90, 16), '#F1F1CE', { alpha: .6, streak: .3, edge: 0, rough: 3 });
  cloud(S, 170, 250, 1.2, '#EEF3E4', .85); cloud(S, 800, 120, 1, '#EEF3E4', .85);
  mountain(S, 220, 520, 340, 780, P.mtnFar, {}); mountain(S, 800, 490, 420, 780, P.mtnFar, {});
  S.haze(480, 800, '#DDE6D6', .5);
  bgForest(S, 740, '#B7C9BC', '#A2B8AC');
  S.paint([[0, 770], [200, 750], [560, 764], [900, 748], [1200, 764], [1200, 900], [0, 900]], P.lake, { streak: 1, angle: 0, bl: [80, 200], bw: [12, 28], edge: 0 });
  for (let i = 0; i < 6; i++) S.paint(K.ellipse(S.rnd(500, 1100), S.rnd(800, 870), S.rnd(60, 130), S.rnd(10, 20), 12), '#E6F0EE', { alpha: .85, streak: .5, edge: .2 });
  for (let i = 0; i < 12; i++) { const x = S.rnd(520, 1120), y = S.rnd(780, 880); S.ink([[x, y], [x + S.rnd(40, 100), y]], { w: 2.6, color: P.lakeLight, alpha: .8 }); }
  forest(S, 792, 20, 400, 120, 200, { gap: 70 }); forest(S, 792, 1000, 1180, 120, 200, { gap: 70 });
  snowHill(S, [[0, 800], [260, 776], [520, 820], [640, 900], [0, 900]], { col: P.snow, shadow: [[0, 860], [300, 846], [560, 890], [560, 900], [0, 900]], lines: 5 });
  moose(S, 300, 872, .9, { flip: true });
  plane(S, 700, 330, 1.45, -.2, { eyes: 'open', look: [3, -2] });
  speedLines(S, [[60, 360, 240], [30, 420, 200], [120, 470, 180], [280, 300, 200]], '#F4F8EE');
  birds(S, [[420, 210, 1.2], [470, 180, 1], [520, 224, .9]]);
  pine(S, 1160, 980, 520, { w: 200 });
  snowfall(S, 260, .05);
  S.finish();
});

/* 4 - the little fire */
SCENES.push(S => {
  S.begin();
  sky(S, '#9DA192', '#B6B6A6', '#CDC8B4');
  cloud(S, 950, 170, 1, '#C9CBB8', .6); cloud(S, 400, 130, .8, '#C4C7B4', .6);
  bgForest(S, 640, '#B3BDAE', '#9CAC9F');
  cabin(S, 1030, 720, .5, { doorGlow: false });
  snowHill(S, [[0, 724], [300, 696], [700, 720], [1200, 694], [1200, 900], [0, 900]], { col: P.snowMid, lines: 4 });
  forest(S, 730, 660, 900, 190, 260, { gap: 90 });
  snowHill(S, [[0, 806], [400, 776], [800, 802], [1200, 776], [1200, 900], [0, 900]], { col: P.snow, shadow: [[0, 860], [600, 846], [1200, 856], [1200, 900], [0, 900]], lines: 9 });
  prints(S, 20, 884, 190, 856, 6, 1.6);
  smoke(S, 690, 640, 9, 1.35, '#A9AAA0', .65);
  yeti(S, 300, 848, .78, { face: 'worry', arms: 'worry' });
  child(S, 1010, 870, 1.15, { face: 'worry', arms: 'worry', flip: true });
  fire(S, 690, 836, 1.05);
  plane(S, 190, 210, .55, .12, {}); speedLines(S, [[-10, 190, 150], [10, 235, 120]], '#E8ECDF');
  pine(S, 1175, 980, 560, { w: 210 }); pine(S, 20, 990, 520, { w: 190 });
  snowfall(S, 620, .08);
  S.finish();
});

/* 5 - scooping water */
SCENES.push(S => {
  S.begin();
  S.wash([[0, '#B4CBC6'], [.5, '#CFDCCF'], [.7, '#E4E7CF'], [1, '#E4E7CF']], { n: 200, y1: 560, bands: [.04, .09] });
  S.paint(K.ellipse(930, 370, 100, 100, 16), '#F3F1C8', { alpha: .65, streak: .3, edge: 0, rough: 3 });
  cloud(S, 210, 190, 1.2, '#EEF3E4', .85); cloud(S, 620, 110, .8, '#EEF3E4', .8);
  mountain(S, 200, 470, 340, 570, P.mtnFar, {}); mountain(S, 660, 450, 400, 570, P.mtnFar, {}); mountain(S, 1100, 490, 320, 570, P.mtnMid, {});
  fogTrees(S, 590, -20, 1220, 90, 150, 44, '#A6BBB0', .95);
  S.wash([[0, '#88B0B4'], [.25, '#6F9EA6'], [1, '#456F7B']], { poly: [[0, 572], [1200, 572], [1200, 900], [0, 900]], y0: 572, y1: 900, n: 240, bands: [.1, .2] });
  [[200, 360], [660, 400], [1100, 320]].forEach(m => S.paint([[m[0] - m[1] * .8, 574], [m[0], 574 + 100], [m[0] + m[1] * .8, 574]], '#5C8C97', { smooth: false, alpha: .4, streak: .3, edge: 0, angle: 0 }));
  for (let i = 0; i < 24; i++) S.bristle(930 + S.rnd(-50, 50) * (i / 24 + .3), 600 + i * 11, 0, S.rnd(30, 90), 5, '#F3F1C8', .6);
  for (let i = 0; i < 30; i++) S.bristle(S.rnd(40, 1160), S.rnd(620, 880), 0, S.rnd(30, 90), 4, i % 3 ? '#A9CCCB' : '#365F6E', .5);
  S.bristle(430, 560, .02, 260, 10, '#F4FAFA', .8); S.bristle(380, 572, .05, 240, 8, '#F4FAFA', .65); S.bristle(300, 586, .06, 200, 7, '#F4FAFA', .5);
  const ry = 568; [[70, 14], [120, 24], [180, 38]].forEach(r => S.ink(K.ellipse(560, ry + 6, r[0], r[1], 22), { w: 2.8, color: '#F2FAFA', closed: true, taper: false, alpha: .8 }));
  for (let i = 0; i < 22; i++) droplet(S, 560 + S.rnd(-110, 110), ry - S.rnd(10, 110), S.rnd(.7, 1.4));
  for (let i = 0; i < 12; i++) S.bristle(560 + S.rnd(-50, 50), ry - S.rnd(0, 40), -1.57 + S.rnd(-.9, .9), S.rnd(40, 80), 6, '#F4FAFA', .7);
  plane(S, 570, 440, 1.35, .05, { eyes: 'happy', mouth: 'big' });
  snowHill(S, [[0, 810], [200, 786], [420, 836], [500, 900], [0, 900]], { col: P.snow, shadow: [[0, 866], [300, 856], [460, 900], [0, 900]], lines: 4 });
  snowHill(S, [[1200, 800], [1000, 810], [860, 864], [820, 900], [1200, 900]], { col: P.snow, lines: 3 });
  pine(S, 90, 940, 560, { w: 200 }); pine(S, 1125, 950, 480, { w: 180 });
  snowfall(S, 300, .06);
  S.finish();
});

/* 6 - psssst */
SCENES.push(S => {
  S.begin();
  sky(S, '#AEB9AB', '#C6CEBB', '#DCDFC9');
  cloud(S, 190, 150, 1, '#E9EEDD', .8); cloud(S, 1000, 210, .9, '#E9EEDD', .8);
  bgForest(S, 650);
  snowHill(S, [[0, 744], [300, 718], [700, 744], [1200, 716], [1200, 900], [0, 900]], { col: P.snowMid, lines: 4 });
  forest(S, 740, 500, 900, 190, 260, { gap: 90 });
  snowHill(S, [[0, 812], [400, 784], [800, 808], [1200, 784], [1200, 900], [0, 900]], { col: P.snow, shadow: [[0, 862], [600, 848], [1200, 858], [1200, 900], [0, 900]], lines: 9 });
  fire(S, 700, 832, 1.05, { small: .5, noface: true, glow: .25, nosparks: true });
  S.paint([[590, 392], [614, 392], [700, 560], [762, 780], [640, 790], [610, 600]], '#BFE0E4', { smooth: true, alpha: .55, angle: 1.4, streak: 0, edge: 0, rough: 4 });
  for (let i = 0; i < 170; i++) { const t = S.R(), x = 600 + (700 - 600) * t + S.rnd(-46, 46) * t, yy = 396 + (790 - 396) * t; S.bristle(x, yy, 1.45 + S.rnd(-.25, .25), S.rnd(40, 100), S.rnd(9, 20), i % 3 ? '#F4FAF9' : '#8CC0C6', .55); }
  for (let i = 0; i < 46; i++) { const t = S.R(); droplet(S, 600 + (700 - 600) * t + S.rnd(-80, 80) * t, 410 + (790 - 410) * t, S.rnd(.9, 1.7) * (.7 + t * .3)); }
  [[640, 730, 1.1], [720, 700, 1.3], [780, 760, 1.0], [670, 640, .9], [740, 590, .8], [620, 690, .8]].forEach(p => cloud(S, p[0] - 40, p[1], p[2] * .8, '#FFFFFF', .9));
  yeti(S, 270, 850, .78, { face: 'worry', arms: 'worry' });
  child(S, 1040, 872, 1.15, { face: 'worry', arms: 'worry', flip: true });
  plane(S, 620, 300, 1.35, .3, { eyes: 'happy', mouth: 'big' });
  pine(S, 1180, 980, 520, { w: 200 });
  snowfall(S, 300, .06);
  S.finish();
});

/* 7 - the sun breaks through */
SCENES.push(S => {
  S.begin();
  sky(S, '#C4CD9E', '#DAD9A8', '#E8E2B6');
  S.glow(600, 360, 620, '#FFF4C0', .55, 'screen');
  S.paint(K.ellipse(600, 360, 150, 150, 18), '#FBF1BE', { alpha: .7, streak: .3, edge: 0, rough: 3 });
  S.paint(K.ellipse(600, 360, 96, 96, 16), '#FFF8D2', { alpha: .95, streak: .3, edge: 0 });
  cloud(S, 150, 210, 1.1, '#F1EFCF', .7);
  bgForest(S, 650, '#C6CFAE', '#AEBDA2');
  snowHill(S, [[0, 764], [300, 738], [700, 762], [1200, 736], [1200, 900], [0, 900]], { col: '#F1F2DE', lines: 4 });
  snowHill(S, [[0, 822], [400, 798], [800, 824], [1200, 802], [1200, 900], [0, 900]], { col: '#FBFAEC', shadow: [[0, 872], [600, 858], [1200, 868], [1200, 900], [0, 900]], lines: 9 });
  moose(S, 1010, 834, .6, { flip: false });
  yeti(S, 600, 862, .9, { face: 'happy', arms: 'cheer' });
  child(S, 240, 874, 1.2, { face: 'happy', arms: 'cheer' });
  plane(S, 930, 330, 1.05, -.32, { eyes: 'happy', mouth: 'big' });
  for (let i = 0; i < 24; i++) sparkle(S, S.rnd(80, 1120), S.rnd(120, 640), S.rnd(.3, .7), S.pick(['#FFFFFF', '#F8E08A', '#FFF6D8']));
  pine(S, 40, 980, 640, { w: 230 }); pine(S, 1170, 980, 580, { w: 210 });
  snowfall(S, 260, .05);
  S.finish();
});

/* 8 - night */
SCENES.push(S => {
  S.begin('#E4DDCB');
  S.wash([[0, '#12242F'], [.45, '#1F3B4A'], [1, '#365866']], { n: 240, bands: [.05, .1] });
  for (let i = 0; i < 60; i++) sparkle(S, S.rnd(50, 1150), S.rnd(50, 520), S.rnd(.15, .5), S.pick(['#FFF6D8', '#DDE6FF', '#F8E2A0']));
  S.paint(K.ellipse(190, 170, 62, 62, 16), '#F8EFCF', { alpha: 1, streak: .5, edge: 0, light: .4 });
  S.paint(K.ellipse(218, 152, 58, 58, 16), '#1A3341', { alpha: 1, streak: 0, edge: 0 });
  aurora(S, 40, 1160, 380, 280, '#6BE8B0', '#8FA2F0', 1.3);
  bgForest(S, 700, '#4E7F86', '#3D6C74');
  snowHill(S, [[0, 764], [300, 738], [700, 764], [1200, 736], [1200, 900], [0, 900]], { col: '#DDE9E6', lines: 4 });
  forest(S, 750, 20, 300, 220, 320, { gap: 100 }); forest(S, 750, 700, 1180, 220, 320, { gap: 100 });
  snowHill(S, [[0, 822], [400, 796], [800, 824], [1200, 798], [1200, 900], [0, 900]], { col: '#F2F6F2', shadow: [[0, 872], [600, 858], [1200, 868], [1200, 900], [0, 900]], lines: 9 });
  cabin(S, 950, 830, 1.05, { lit: true, doorGlow: true, wall: P.falu });
  smoke(S, 1026, 606, 7, 1, '#B9C6C6', .5);
  plane(S, 540, 700, 1.3, 0, { eyes: 'closed', cap: false, prop: false, mouth: 'o', blanket: true });
  yeti(S, 770, 848, .3, { face: 'sleep', arms: 'down' });
  grade(S, 380, '#5C7FA6', .72);
  S.glow(918, 764, 200, P.fireY, .4, 'screen'); S.glow(950, 790, 320, P.fire, .12, 'screen'); S.glow(190, 170, 120, '#FFF3C8', .25, 'screen');
  zed(S, 720, 500, 1.1, '#E6F0F0'); zed(S, 780, 430, 1.5, '#E6F0F0'); zed(S, 850, 350, 1.9, '#E6F0F0');
  pine(S, 40, 980, 640, { w: 230, body: '#C5D8DA', hook: '#4E8F93' }); pine(S, 1170, 980, 580, { w: 210, body: '#C5D8DA', hook: '#4E8F93' });
  snowfall(S, 340, .06);
  S.finish();
});
