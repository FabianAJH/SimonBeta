  /* ===================== RECÁMARA ESPACIAL: el hogar de Simon (se entra por el portal estelar de NV100) ===================== */
  (function () {
  const MET = ['#f4f6fa', '#c8d0dc', '#9aa4b8', '#5a6478'], ORO = ['#fff6b0', '#ffd84a', '#d8a020', '#8a5a08'];
  const PIE = ['#e8ecf4', '#b8c0d0', '#8890a8', '#585e78'];
  const rn = (a, b) => { let h = (Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263)) | 0; h = Math.imul(h ^ (h >>> 15), 2246822519); h = Math.imul(h ^ (h >>> 13), 3266489917); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  const VI = ['#b8a4ff', '#7a5ae0', '#42308c', '#1c1248'], TL = ['#c8fff4', '#4af0d0', '#1a9a9a', '#0a4a5a'], NE = ['#ff9ae0', '#e84ab8', '#982a7c', '#501a44'];
  const mez = (a, b, t) => { const p = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)], A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

  /* ============ SALA: RECÁMARA ESPACIAL ============ */
  function espSalaGrid(W, H, RY) {
    const g = Grid(W, H), FY = RY + 35;
    for (let y = 0; y < RY + 5; y++) for (let x = 0; x < W; x++) {   // pared: casco violeta con venas de energía
      let c = y < 20 ? mez('#1a1248', '#2a1c68', y / 20) : mez('#2a1c68', '#3a2a88', Math.min(1, (y - 20) / 44));
      if ((x % 20 === 10) && y > 6) c = (y * 3 + x) % 11 < 4 ? '#4af0d0' : mez(c, '#4af0d0', .35);
      if (y % 22 === 21) c = mez(c, '#0a0628', .5);
      g.set(x, y, c);
    }
    g.rect(0, 0, W, 3, '#1a1248'); g.rect(0, 3, W, 1, '#4af0d0');   // moldura con luz
    g.rect(0, RY, W, 1, '#a8fff0'); g.rect(0, RY + 1, W, 3, '#3a2a88'); g.rect(0, RY + 4, W, 1, '#1c1248');
    for (let y = RY + 5; y < RY + 29; y++) for (let x = 0; x < W; x++) {   // lambrín: paneles hexagonales
      const hx = (x + ((y >> 3) & 1) * 5) % 10, hy = y % 8; let c = '#2e2070';
      if (hx === 0 || hy === 0) c = '#1c1248'; else if (hx === 1 && hy === 1) c = '#7a5ae0'; else if (hx === 5 && hy === 4) c = '#4af0d0';
      g.set(x, y, c);
    }
    g.rect(0, RY + 29, W, 6, '#1c1248'); g.rect(0, RY + 29, W, 1, '#7a5ae0'); g.rect(0, RY + 32, W, 1, '#4af0d0'); g.rect(0, RY + 33, W, 2, '#0a0628');   // zócalo con tira de luz
    for (let y = FY; y < H; y++) for (let x = 0; x < W; x++) {   // piso: placas metálicas hexagonales
      const f = ((y - FY) / 7) | 0, hx = (x + (f % 2) * 7) % 14, hy = (y - FY) % 7; let c = (f + ((x + (f % 2) * 7) / 14 | 0)) % 2 ? '#2a1c68' : '#32247a';
      if (hx === 0 || hy === 0) c = '#150c3c'; else if (hx === 1 && hy === 1) c = '#5a42b8';
      if (hy === 0 && hx % 14 < 7 && (x / 14 | 0) % 3 === 0) c = '#2ab8b0';
      g.set(x, y, c);
    }
    const cx0 = Math.round(W / 2), rugY = RY + 66;   // alfombra-órbita
    [[54, 17, '#0a0628'], [51, 15, '#42308c'], [45, 12, '#1c1248'], [42, 10, '#2a1c68']].forEach(([rx, ry, c]) => { const t = elipse(cx0, rugY, rx, ry); for (let y = rugY - ry; y <= rugY + ry; y++) for (let x = cx0 - rx; x <= cx0 + rx; x++) if (t(x, y)) g.set(x, y, c); });
    [[-30, 0, '#4af0d0'], [-12, -5, '#e84ab8'], [14, 5, '#ffd84a'], [33, -1, '#9ad8ff']].forEach(([dx, dy, c]) => { g.set(cx0 + dx, rugY + dy, c); g.set(cx0 + dx + 1, rugY + dy, c); });
    for (let t = 0; t < 70; t++) { const a = t / 70 * 6.283; g.set(cx0 + Math.cos(a) * 33, rugY + Math.sin(a) * 7, '#4af0d0'); }
    return g;
  }
  const FASES_CIELO = [   // 0 noche · 1 amanecer · 2 día · 3 atardecer
    { top: '#0a0628', bot: '#5a2a88', est: 40, aur: 1, luna: 1, gig: 0, esp: ['#1a1248', '#0e0a30', '#4af0d0'] },
    { top: '#4a3a9a', bot: '#ffb48a', est: 10, aur: 0, luna: .6, gig: .35, esp: ['#3a2a78', '#2a1c60', '#ff9ac0'] },
    { top: '#3ab8e0', bot: '#d8f8e0', est: 0, aur: 0, luna: 0, gig: .55, esp: ['#6a5ad0', '#4a3ab0', '#bffff0'] },
    { top: '#5a2a88', bot: '#ff7a5a', est: 14, aur: .5, luna: .7, gig: .15, esp: ['#2a1c68', '#1a1248', '#ffb06a'] }
  ];
  function espCieloGrid(fase, fr) {   // el cielo de su planeta, que se ve por la ventana (60x64, ventana en 12,16 de 34x38); cambia con la hora como el de la Tierra
    const g = Grid(60, 64), F = FASES_CIELO[fase] || FASES_CIELO[0];
    for (let y = 0; y < 64; y++) for (let x = 0; x < 60; x++) g.set(x, y, mez(F.top, F.bot, Math.pow(y / 64, 1.3)));
    for (let i = 0; i < F.est; i++) g.set(Math.floor(rn(i, 3) * 60), Math.floor(rn(i, 4) * 40), (i + fr) % 7 === 0 ? '#ffffff' : '#bfe8ff');
    if (F.aur) for (let x = 12; x < 46; x++) { const y = 28 + Math.sin(x * .3) * 3 + Math.sin(x * .13) * 4; for (let k = 0; k < 6; k++) g.set(x, y + k, mez(k < 2 ? '#4affb0' : k < 4 ? mez('#4affb0', '#5a2a88', .5) : mez('#a05af0', '#5a2a88', .5), mez(F.top, F.bot, .5), 1 - F.aur)); }   // aurora
    if (fase === 2) { [[8, 14, 9], [34, 8, 7], [48, 22, 6]].forEach(([cx, cy, w]) => { g.rect(cx, cy, w, 2, '#e8d8ff'); g.rect(cx + 1, cy - 1, w - 3, 1, '#ffffff'); g.rect(cx + 1, cy + 2, w - 2, 1, '#b8a4f0'); }); g.rect(44, 10, 5, 5, '#fff6b0'); g.rect(45, 9, 3, 7, '#fff6b0'); g.rect(43, 11, 7, 3, '#fff6b0'); g.rect(30, 6, 3, 3, '#ff9ae0'); }   // dos soles
    const gx = 34, gy = 42, gr = 12, tint = c => mez(c, mez(F.top, F.bot, .6), F.gig);   // gigante gaseoso con anillo (se desvanece de día)
    for (let y = -gr; y <= gr; y++) for (let x = -gr; x <= gr; x++) if (x * x + y * y <= gr * gr) { const b = ((y + gr) / 3 | 0) % 2; g.set(gx + x, gy + y, tint((x + y) < -6 ? '#ffd8a0' : b ? '#e8905a' : '#c8703a')); if (x + y > 8) g.set(gx + x, gy + y, tint('#7a3a2a')); }
    for (let t = 0; t < 120; t++) { const a = t / 120 * 6.283, px = gx + Math.cos(a) * 20, py = gy + Math.sin(a) * 4 - Math.cos(a) * 2; if (Math.sin(a) > 0 || Math.abs(px - gx) > gr) g.set(px, py, tint('#f4d890')); }
    if (F.luna) { const fm = c => mez(mez(F.top, F.bot, .3), c, F.luna); g.rect(18, 24, 5, 5, fm('#e8e8f8')); g.rect(19, 24, 3, 1, fm('#ffffff')); g.rect(21, 27, 2, 2, fm('#a8a8c8')); g.set(20, 26, fm('#a8a8c8')); g.rect(44, 18, 3, 3, fm('#ff9ae0')); g.set(44, 18, fm('#ffffff')); }
    for (let x = 0; x < 60; x++) { const h = 6 + Math.round(5 * Math.abs(Math.sin(x * .45)) + 4 * Math.abs(Math.sin(x * .17 + 1))); g.rect(x, 64 - h, 1, h, x % 7 < 3 ? F.esp[0] : F.esp[1]); if (x % 7 === 1) g.set(x, 64 - h, F.esp[2]); }   // espinas de cristal en el horizonte
    return g;
  }
  function espVentanaGrid() {   // marco orgánico de metal violeta
    const g = Grid(60, 64);
    capa(g, '#0a0628', L => { L.rect(8, 12, 42, 46, VI[1]); });
    g.rect(9, 13, 40, 44, VI[2]); g.rect(9, 13, 40, 1, VI[0]); g.rect(9, 13, 1, 44, VI[0]);
    g.rect(28, 16, 2, 38, VI[1]); g.rect(12, 34, 34, 2, VI[1]); g.rect(28, 16, 1, 38, VI[0]); g.rect(12, 34, 34, 1, VI[0]);
    g.rect(11, 15, 36, 1, TL[1]); g.rect(11, 55, 36, 1, TL[1]); g.rect(11, 15, 1, 41, TL[1]); g.rect(46, 15, 1, 41, TL[1]);
    [[8, 12], [48, 12], [8, 56], [48, 56]].forEach(([x, y]) => { g.rect(x, y, 3, 3, TL[0]); g.set(x + 1, y + 1, TL[1]); });
    g.rect(6, 58, 46, 4, VI[1]); g.rect(6, 58, 46, 1, TL[0]); g.rect(6, 61, 46, 1, VI[3]);
    for (let x = 9; x < 50; x += 6) g.set(x, 60, TL[1]);
    return g;
  }
  function espDerechaGrid() {   // panel de constelaciones holográfico (66,15 · 38x30)
    const g = Grid(120, 64), x0 = 66, y0 = 15;
    capa(g, '#0a0628', L => L.rect(x0, y0, 38, 30, VI[1]));
    g.rect(x0 + 1, y0 + 1, 36, 28, '#0a0628'); g.rect(x0 + 1, y0 + 1, 36, 1, TL[1]); g.rect(x0 + 1, y0 + 28, 36, 1, TL[2]);
    const P = [[6, 20], [12, 12], [20, 16], [26, 8], [31, 17], [24, 23]];
    for (let i = 0; i < P.length - 1; i++) { const [ax, ay] = P[i], [bx, by] = P[i + 1], n = Math.max(Math.abs(bx - ax), Math.abs(by - ay)); for (let k = 0; k <= n; k++) g.set(x0 + ax + (bx - ax) * k / n, y0 + ay + (by - ay) * k / n, '#2a8a8a'); }
    P.forEach(([x, y]) => { g.set(x0 + x, y0 + y, '#ffffff'); g.set(x0 + x + 1, y0 + y, '#9ad8ff'); g.set(x0 + x, y0 + y + 1, '#9ad8ff'); });
    for (let i = 0; i < 10; i++) g.set(x0 + 3 + Math.floor(rn(i, 9) * 32), y0 + 3 + Math.floor(rn(i, 10) * 22), '#6a8ac8');
    g.rect(x0 + 8, y0 + 31, 22, 2, VI[1]); g.rect(x0 + 8, y0 + 31, 22, 1, VI[0]);
    return g;
  }

  function espSalaCompleta(W, H, RY) {   // pared + piso + marco de la ventana (con hueco para el cielo) + panel de constelaciones
    const g = espSalaGrid(W, H, RY); g.paste(espVentanaGrid(), 0, RY - 59); g.clear(12, 16 + RY - 59, 34, 38); g.paste(espDerechaGrid(), 0, RY - 59); return g;
  }

  /* ============ PORTAL DE VUELTA (el de la Tierra) ============ */
  function portalGrid(fr, tono) {
    const W = 46, H = 56, g = Grid(W, H), cx = 23, cy = 31;
    const TN = [['#08051c', '#2a1a8a', '#6a4af0', '#4af0ff', '#ffffff'], ['#1a1004', '#8a5a08', '#e8a820', '#ffe68a', '#ffffff'], ['#1c0408', '#7a1020', '#d02838', '#ff8a6a', '#ffffff'], ['#04101c', '#104a8a', '#3a9af0', '#9ad8ff', '#ffffff'], ['#04140e', '#0c4a8a', '#2a9a52', '#8ae0ff', '#ffffff']][tono || 0];
    const dentro = (x, y) => { const dx = (x + .5 - cx) / 14, dy = (y + .5 - cy) / 21; return y < cy ? dx * dx + dy * dy <= 1 : Math.abs(dx) <= 1 && y < 52; };
    const borde = (x, y) => { const dx = (x + .5 - cx) / 19, dy = (y + .5 - cy) / 26.5; return y < cy ? dx * dx + dy * dy <= 1 : Math.abs(dx) <= 1 && y < 54; };
    capa(g, '#0c0a1c', L => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (borde(x, y)) L.set(x, y, (x + y) % 9 < 4 ? PIE[2] : PIE[3]); });
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (borde(x, y) && !dentro(x, y)) { const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => dentro(x + a, y + b)); if (near) g.set(x, y, ORO[1]); else if ((x * 3 + y * 5) % 17 === 0) g.set(x, y, TN[3]); }   // marco con runas
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (dentro(x, y)) {
      const dx = x + .5 - cx, dy = (y + .5 - cy) * .72, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
      const s = Math.sin(a * 2 + r * .55 - fr * Math.PI / 2), k = Math.sin(a * 3 - r * .3 + fr * Math.PI / 2 * .5);
      let c = s > .55 ? TN[3] : s > .1 ? TN[2] : s > -.4 ? TN[1] : TN[0];
      if (k > .9 && r > 3) c = TN[2];
      if (r < 3.2) c = TN[4]; else if (r < 5.5) c = TN[3];
      L_(x, y, c);
    }
    function L_(x, y, c) { g.set(x, y, c); }
    for (let i = 0; i < 24; i++) { const x = 10 + Math.floor(rn(i, 5) * 26), y = 8 + Math.floor(rn(i, 9) * 40); if (dentro(x, y) && (Math.abs(x - cx) > 5 || Math.abs(y - cy) > 6)) g.set(x, y, (i + fr) % 4 === 0 ? '#ffffff' : TN[3]); }
    g.rect(cx - 2, 0, 4, 3, ORO[1]); g.rect(cx - 1, 0, 2, 1, ORO[0]); g.rect(cx - 1, 3, 2, 1, ORO[2]);   // clave del arco
    capa(g, '#0c0a1c', L => { L.rect(3, 53, 40, 3, PIE[2]); L.rect(3, 53, 40, 1, PIE[0]); });
    return g;
  }


  /* ============ 5 OBJETOS ALIEN ============ */
  function cristalGrid(fr) {   // cristal flotante sobre un anillo
    const g = Grid(22, 40), cx = 11, o = fr ? 1 : 0, y0 = 4 + o;
    capa(g, '#0a2a38', L => { sombrear(L, (x, y) => y >= 33 && y < 40 && Math.abs(x + .5 - cx) <= 9 - (39 - y) * .05, cx, 36, 9, 4, MET); sombrear(L, (x, y) => y >= 31 && y < 34 && Math.abs(x + .5 - cx) <= 5, cx, 32, 5, 2, MET); });
    g.rect(cx - 6, 36, 12, 1, '#4af0d0'); g.rect(cx - 3, 31, 6, 1, '#4af0d0');
    for (let y = 0; y < 24; y++) { const hw = y < 5 ? y * 1.1 + 1 : y > 17 ? (23 - y) * 1.5 + .5 : 6; for (let x = 0; x < 22; x++) { const dx = x + .5 - cx; if (Math.abs(dx) <= hw) { const t = (dx + hw) / (2 * hw); g.set(x, y0 + y, t < .25 ? TL[0] : t < .55 ? TL[1] : t < .8 ? TL[2] : TL[3]); } } }
    g.rect(cx - 1, y0 + 3, 1, 12, '#ffffff'); g.rect(cx - 3, y0 + 6, 1, 4, TL[0]);
    [[3, 10], [18, 14], [4, 22], [17, 3]].forEach(([x, y], i) => { const on = (i + fr) % 2; g.set(x, y + o * (i % 2 ? -1 : 1), on ? '#ffffff' : '#9ad8ff'); if (on) { g.set(x - 1, y, '#4af0d0'); g.set(x + 1, y, '#4af0d0'); } });
    return g;
  }
  function hongosGrid(fr) {   // racimo de hongos que brillan
    const g = Grid(30, 30), seta = (cx, by, rw, rh, A) => {
      g.rect(cx - 1, by - rh - 4, 3, rh + 5, '#e8e0f8'); g.rect(cx + 1, by - rh - 4, 1, rh + 5, '#a89cc8');
      capa(g, '#1a0a3a', L => sombrear(L, (x, y) => y >= by - rh - 6 && y < by - rh + 2 && Math.abs(x + .5 - cx) <= rw * Math.sqrt(Math.max(0, 1 - Math.pow((y - (by - rh - 1)) / 4.5, 2))), cx, by - rh - 2, rw, 4, A));
      for (let i = 0; i < 4; i++) g.set(cx - rw + 3 + i * Math.max(2, (rw * 2 - 5) / 3 | 0), by - rh - 3 - (i % 2), (i + fr) % 2 ? '#ffffff' : '#fff6b0');
    };
    capa(g, '#0a0a20', L => { L.rect(2, 26, 26, 3, VI[2]); L.rect(4, 25, 22, 1, VI[1]); });
    seta(8, 27, 6, 9, NE); seta(21, 27, 7, 15, TL); seta(14, 27, 4, 4, VI);
    for (let i = 0; i < 6; i++) g.set(3 + i * 5, 27, (i + fr) % 2 ? '#4af0d0' : '#2a8a8a');
    return g;
  }
  function holomapaGrid(fr) {   // mesa con proyector y galaxia que gira
    const g = Grid(30, 34), cx = 15, cy = 12, a0 = fr * 0.9;
    capa(g, '#0a0628', L => { sombrear(L, (x, y) => y >= 24 && y < 34 && Math.abs(x + .5 - cx) <= 12 - (33 - y) * .1, cx, 29, 12, 5, VI); sombrear(L, (x, y) => y >= 20 && y < 25 && Math.abs(x + .5 - cx) <= 4, cx, 22, 4, 3, VI); sombrear(L, elipse(cx, 25, 9, 2.4), cx, 25, 9, 2, MET); });
    g.rect(cx - 5, 25, 10, 1, '#4af0d0');
    for (let k = 0; k < 90; k++) { const t = k / 90, r = 1 + t * 10, a = t * 9 + a0, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * .5; g.set(px, py, t < .25 ? '#ffffff' : t < .6 ? '#9ad8ff' : '#4a6ae8'); }
    for (let k = 0; k < 90; k++) { const t = k / 90, r = 1 + t * 10, a = t * 9 + a0 + 3.14, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * .5; g.set(px, py, t < .25 ? '#ffffff' : t < .6 ? '#ff9ae0' : '#9a3ab8'); }
    g.set(cx, cy, '#ffffff'); g.set(cx - 1, cy, '#fff6b0'); g.set(cx + 1, cy, '#fff6b0');
    for (let i = 0; i < 6; i++) g.set(cx - 11 + Math.floor(rn(i, 2) * 22), 3 + Math.floor(rn(i, 5) * 17), (i + fr) % 2 ? '#bfe8ff' : '#4af0d0');
    return g;
  }
  function huevoGrid(fr) {   // huevo alien con manchas que brillan, en un nido
    const g = Grid(20, 26), cx = 10, w = fr ? 1 : 0;
    capa(g, '#0a2a1a', L => { L.rect(1, 22, 18, 3, '#3a2a58'); L.rect(3, 21, 14, 1, '#52408a'); });
    for (let i = 0; i < 7; i++) { g.set(2 + i * 2 + (i % 2), 21, '#7a5ae0'); }
    capa(g, '#0a3a2a', L => sombrear(L, elipse(cx + w, 12, 7.5, 10.5), cx + w, 12, 7.5, 10.5, ['#d8fff0', '#7af0b8', '#2a9a78', '#0e5a48']));
    [[-3, 6, 2], [2, 10, 3], [-2, 14, 2], [4, 16, 2], [0, 5, 1]].forEach(([dx, y, r], i) => { const on = (i + fr) % 2; for (let yy = -r + 1; yy < r; yy++) for (let xx = -r + 1; xx < r; xx++) if (xx * xx + yy * yy <= r * r - 1) g.set(cx + w + dx + xx, y + yy, on ? '#ff9ae0' : '#c83a98'); g.set(cx + w + dx - 1, y - 1, '#ffffff'); });
    g.set(cx + w - 3, 5, '#ffffff'); g.set(cx + w - 4, 6, '#ffffff');
    return g;
  }
  function medusaGrid(fr) {   // tubo de cristal con una medusa del espacio
    const g = Grid(18, 40), cx = 9, bob = fr ? 1 : 0;
    capa(g, '#0a1a2a', L => { L.rect(3, 0, 12, 3, MET[2]); L.rect(3, 37, 12, 3, MET[2]); });
    g.rect(3, 0, 12, 1, MET[0]); g.rect(3, 37, 12, 1, MET[1]); g.rect(5, 38, 8, 1, '#4af0d0');
    for (let y = 3; y < 37; y++) { g.rect(3, y, 12, 1, mez('#0a2a4a', '#1a5a7a', 1 - y / 37)); g.set(3, y, '#9ad8ff'); g.set(14, y, '#2a6a8a'); }
    for (let y = 4; y < 36; y += 3) g.set(5, y, '#bfe8ff');
    const by = 12 + bob;
    capa(g, '#5a1a5a', L => sombrear(L, (x, y) => y >= by - 5 && y <= by + 2 && Math.pow((x + .5 - cx) / 5.5, 2) + Math.pow((y - by) / (fr ? 4.5 : 5), 2) <= 1, cx, by - 1, 5.5, 5, NE));
    g.rect(cx - 3, by - 3, 2, 1, '#ffffff'); g.set(cx + 1, by - 2, '#ffffff');
    [[-3, 0], [-1, 1], [1, 0], [3, 1]].forEach(([dx, ph], i) => { for (let k = 1; k <= 10; k++) g.set(cx + dx + Math.round(Math.sin(k * .7 + (fr + i) * 1.7) * 1.2), by + 2 + k, k > 7 ? '#a05ae0' : k % 3 === 0 ? '#ffb0f0' : '#ff7ad8'); });
    [[5, 30], [12, 24], [7, 20], [11, 31]].forEach(([x, y], i) => g.set(x, y - (fr ? 1 : 0) * (i % 2 + 1), '#ffffff'));
    return g;
  }


  /* ---------- registro ---------- */
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const fr2 = d => (tk >> d) & 1;
  const OBJ = [   // clave, nombre, precio base (el catálogo lo sube x1.5), cuadro base, animación, extras
    ['cristal_alien', 'CRISTAL FLOTANTE', 2000, () => cristalGrid(0), () => { const f = fr2(4); return { key: 'mu_cristal' + f, grid: () => cristalGrid(f) }; }, { dice: ['Zumba bonito.', 'Flota solito. Qué envidia.', 'Brilla cuando lo miro.'] }],
    ['hongos_alien', 'HONGOS LUMINOSOS', 2400, () => hongosGrid(0), () => { const f = fr2(5); return { key: 'mu_hongos' + f, grid: () => hongosGrid(f) }; }, { dice: ['¿Serán comestibles? Mejor no.', 'Brillan más de noche.', 'Huelen a dulce raro.'] }],
    ['huevo_alien', 'HUEVO ALIEN', 2800, () => huevoGrid(0), () => { const f = (tk % 200) > 190 || fr2(5); return { key: 'mu_huevo' + (f ? 1 : 0), grid: () => huevoGrid(f ? 1 : 0) }; }, { dice: ['Se movió. Juro que se movió.', 'Shhh... está dormido.', 'Cuando nazca será mi hermano.'] }],
    ['medusa_alien', 'MEDUSA EN TUBO', 3200, () => medusaGrid(0), () => { const f = (tk >> 4) % 2; return { key: 'mu_medusa' + f, grid: () => medusaGrid(f) }; }, { dice: ['Hola, medusita.', 'Nada y nada y nada.', 'No tiene prisa.'] }],
    ['holomapa_alien', 'HOLOMAPA', 4000, () => holomapaGrid(0), () => { const f = (tk >> 3) & 3; return { key: 'mu_holo' + f, grid: () => holomapaGrid(f) }; }, { dice: ['Ahí está mi casa... creo.', 'Gira como mi cabeza.', 'Cada puntito es un lugar.'] }]
  ];
  OBJ.forEach(([k, n, p, grid, anim, x]) => {
    ITEMS[k] = { tipo: 'cuarto', slot: 'deco', n, p, nv: 100, grid, anim, tema: 'espacial', exclusivo: true, luz: true, tap: 'fn', tapFn: () => decir(pick(x.dice)) };
    ORDEN.cuarto.push(k);
  });
  // el portal de vuelta: fijo (no se quita ni se voltea, sí se mueve); no se vende. Aparece solo en la Recámara Espacial.
  ITEMS.portal_hogar = { tipo: 'cuarto', slot: 'deco', n: 'PORTAL A LA TIERRA', p: 0, nv: 100, grid: () => portalGrid(0, 4), anim: () => { const f = (tk >> 3) & 3; return { key: 'mu_portalT' + f, grid: () => portalGrid(f, 4) }; }, tema: 'espacial', exclusivo: true, fija: true, luz: true, tap: 'fn', tapFn: () => volverALaTierra() };
  // sprites que dibuja la escena (ver fondoEscena)

  /* ============ LA RECÁMARA EN RUINAS (antes de repararla, 10,000 monedas) ============ */
  const RUINA_CABLES = [[0.56, 0], [0.8, 0]];   // x relativa de los cables colgando; el largo se fija abajo
  const cableLargo = i => 20 + i * 8;
  function espRuinaGrid(W, H, RY) {
    const g = espSalaCompleta(W, H, RY), dy = RY - 59, FY = RY + 35, d = g.d;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3]) {   // todo apagado y grisáceo
      const gr = (d[i] * .3 + d[i + 1] * .5 + d[i + 2] * .2) * .7;
      d[i] = d[i] * .3 + gr * .9; d[i + 1] = d[i + 1] * .3 + gr * .95; d[i + 2] = d[i + 2] * .32 + gr * 1.1;
    }
    const brecha = (cx, cy, rx, ry, sd) => {   // boquete en el casco: se ve el vacío con estrellas
      for (let y = Math.floor(cy - ry - 3); y <= cy + ry + 3; y++) for (let x = Math.floor(cx - rx - 3); x <= cx + rx + 3; x++) {
        const a = Math.atan2((y - cy) / ry, (x - cx) / rx), dd = Math.hypot((x - cx) / rx, (y - cy) / ry), jag = 1 + (rn(Math.round(a * 3) + sd, sd) - .5) * .55;
        if (dd < jag) g.set(x, y, rn(x * 7, y + sd) > .92 ? '#bfe8ff' : '#06031a');
        else if (dd < jag + .3) g.set(x, y, rn(x, y + sd) > .5 ? '#5a566a' : '#2e2a3a');
      }
    };
    const grieta = (x, y, len, sd, dir = 1) => { for (let i = 0; i < len; i++) { g.set(x, y, '#0a0618'); if (rn(i, sd) > .45) g.set(x + dir, y, '#1c1630'); y++; x += rn(i + 9, sd) > .6 ? dir : rn(i + 3, sd) > .8 ? -dir : 0; if (i === (len >> 1) && len > 8) grieta(x, y, len >> 1, sd + 5, -dir); } };
    brecha(Math.round(W * .62), RY - 30, 10, 8, 3); brecha(Math.round(W * .9), RY + 12, 6, 7, 8); brecha(Math.round(W * .74), RY + 24, 5, 3, 13);
    [[.5, RY - 20, 22, 1], [.58, RY - 21, 16, 2], [.7, RY - 26, 19, 3], [.88, RY - 4, 20, 4], [.97, RY + 8, 14, 5], [.2, RY - 2, 10, 6], [.4, RY + 2, 14, 7]].forEach(([fx, y, l, sd]) => grieta(Math.round(W * fx), y, l, sd, sd % 2 ? 1 : -1));
    // vidrio de la ventana hecho añicos: líneas que salen del impacto
    const wx = 29, wy = 16 + dy + 17;
    for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283 + .3, L = 10 + rn(k, 4) * 10; for (let t = 1; t < L; t++) g.set(wx + Math.cos(a) * t, wy + Math.sin(a) * t * 1.1, [226, 242, 255, t < 4 ? 220 : 150]); }
    for (let k = 3; k < 7; k += 3) for (let t = 0; t < 40; t++) { const a = t / 40 * 6.283; g.set(wx + Math.cos(a) * k * 2.2, wy + Math.sin(a) * k * 2.4, [226, 242, 255, 110]); }
    g.rect(wx - 1, wy - 1, 3, 3, [255, 255, 255, 200]);
    for (let i = 0; i < 4; i++) { const sx = 14 + i * 7 + rn(i, 6) * 4, sy = 16 + dy + 38 - 1; g.art(Math.round(sx), sy - 2, ['.#', '##', '#.'].slice(0, 3), { '#': '#cfe8f8' }); }
    // el piso: placas faltantes y huecos
    [[Math.round(W * .26), FY + 18, 12, 3, 1], [Math.round(W * .78), FY + 34, 9, 2.4, 2], [Math.round(W * .55), FY + 8, 6, 1.6, 3]].forEach(([cx, cy, rx, ry, sd]) => {
      for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 2); x <= cx + rx + 2; x++) {
        const dd = Math.hypot((x - cx) / rx, (y - cy) / ry) * (1 + (rn(x + sd, y) - .5) * .3);
        if (dd < 1) g.set(x, y, y > cy ? '#04020e' : '#0a0620'); else if (dd < 1.25) g.set(x, y, '#5a5870');
      }
    });
    const roca = (cx, by, w, h, sd) => { for (let y = 0; y < h; y++) { const hw = Math.round(w / 2 * (1 - (y / h) * .9 * (y < h / 2 ? 0 : 0) ) * Math.sqrt(1 - Math.pow((y - h + 1) / h, 2) * .8)); for (let x = -hw; x <= hw; x++) g.set(cx + x, by - h + 1 + y, y < 2 ? '#a9a6b8' : (x + y + sd) % 5 === 0 ? '#58566a' : x > hw * .3 ? '#4a4858' : '#7a788c'); } };
    const montón = (cx, by, sd) => { roca(cx - 5, by, 9, 5, sd); roca(cx + 4, by, 11, 7, sd + 2); roca(cx, by, 8, 9, sd + 4); for (let i = 0; i < 6; i++) g.set(cx + Math.round((rn(i, sd) - .5) * 24), by + (i % 2), '#6a687a'); };
    montón(Math.round(W * .15), FY + 12, 1); montón(Math.round(W * .83), FY + 22, 5); montón(Math.round(W * .45), FY + 50, 9); roca(Math.round(W * .62), FY + 40, 6, 4, 3);
    // viga caída
    const bx0 = Math.round(W * .94), by0 = RY + 4, bx1 = Math.round(W * .66), by1 = FY + 14;
    for (let t = 0; t <= 60; t++) { const x = Math.round(bx0 + (bx1 - bx0) * t / 60), y = Math.round(by0 + (by1 - by0) * t / 60); g.rect(x - 2, y, 5, 1, '#3c3448'); g.rect(x - 2, y, 1, 1, '#7a7090'); g.rect(x + 2, y, 1, 1, '#1c1828'); if (t % 12 === 6) g.set(x, y, '#9a90b0'); }
    // cables colgando
    RUINA_CABLES.forEach(([fx], i) => { const x = Math.round(W * fx), L = cableLargo(i); for (let y = 0; y < L; y++) { const xx = x + Math.round(Math.sin(y * .22 + i) * 1.4); g.set(xx, y + 3, y % 5 === 0 ? '#5a4a30' : '#1c1620'); g.set(xx + 1, y + 3, '#0a0810'); } });
    // viñeta oscura en las esquinas
    for (let i = 0; i < d.length; i += 4) if (d[i + 3]) { const x = (i >> 2) % W, y = ((i >> 2) / W) | 0, v = Math.max(Math.abs(x - W / 2) / (W / 2), Math.abs(y - H / 2) / (H / 2)); const k = v > .7 ? 1 - (v - .7) * .9 : 1; d[i] *= k; d[i + 1] *= k; d[i + 2] *= k; }
    return g;
  }
  // Efectos vivos de la ruina: chispas en los cables, polvo flotando, parpadeo de luz
  function espRuinaFx() {
    const W = LW, H = LH;
    ctx.save();
    RUINA_CABLES.forEach(([fx], i) => {
      const x = Math.round(W * fx) + Math.round(Math.sin(cableLargo(i) * .22 + i) * 1.4), y = cableLargo(i) + 3, t = (tk + i * 23) % 70;
      if (t < 12) {
        ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(120,240,255,' + (.16 - t * .01).toFixed(3) + ')'; ctx.fillRect(x - 6, y - 5, 13, 10);
        ctx.fillStyle = 'rgba(255,230,140,' + (.25 - t * .015).toFixed(3) + ')'; ctx.fillRect(x - 2, y - 2, 5, 4);
        for (let k = 0; k < 7; k++) { const a = rn(k + i * 9, 5) * 3.14 + .1, v = 1 + rn(k, 6) * 1.6; ctx.fillStyle = k % 2 ? '#ffe68a' : '#8af0ff'; ctx.fillRect(Math.round(x + Math.cos(a) * v * t * .6 * (k % 2 ? 1 : -1)), Math.round(y + Math.sin(a) * v * t * .4 + t * t * .05), 1, 1); }
      }
      ctx.globalCompositeOperation = 'source-over';
    });
    ctx.fillStyle = 'rgba(200,190,220,.5)';
    for (let i = 0; i < 16; i++) { const x = (rn(i, 1) * W + tk * .06 * (1 + rn(i, 2)) + Math.sin(tk / 40 + i) * 3) % W, y = (rn(i, 3) * H * .8 + tk * .03 * (1 + rn(i, 4))) % (H * .8) + 4; ctx.globalAlpha = .25 + .35 * Math.abs(Math.sin(tk / 30 + i)); ctx.fillRect(Math.round(x), Math.round(y), 1, 1); }
    ctx.globalAlpha = 1;
    if ((tk % 120) < 3 || (tk % 97) === 40) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(0, 0, W, H); }   // la luz de emergencia titila
    ctx.restore();
  }
  window.espRuinaGrid = espRuinaGrid; window.espRuinaFx = espRuinaFx;
  window.espCieloGrid = espCieloGrid; window.espSalaCompleta = espSalaCompleta;
  })();
