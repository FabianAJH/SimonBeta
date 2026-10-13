  /* ===================== ESTUDIO: cuarto, escritorio y muebles ===================== */
  const EST_T = {
    E: { sky: ['#6ab4f0', '#8ccaf6', '#b0e0fa', '#dcf2ff', '#fff4d8'], wall: '#d9a272', wall2: '#d19a6a', desk: ['#c88850', '#8a5a30', '#e8aa70'], glow: '255,236,170', ga: .05, cup: '#ff8a70', vig: .2, sun: 1, hills: ['#8ac870', '#6ab058'], trees: ['#4a9a50', '#3a8044', '#6ab868'], grass: ['#7ac060', '#5aa048'], fr: '#8a5a34' },
    B: { sky: ['#6a5aa8', '#c8708a', '#f09a6a', '#ffc070', '#ffe4a0'], wall: '#c48860', wall2: '#bc805a', desk: ['#b87848', '#7a4a2a', '#d89a68'], glow: '255,200,120', ga: .12, cup: '#ffd84a', vig: .26, sun: 2, hills: ['#c89a50', '#a07040'], trees: ['#7a7a40', '#5a6038', '#9a9a50'], grass: ['#a8a848', '#808838'], fr: '#7a4a2a' },
    N: { sky: ['#141a48', '#242c68', '#3a3a88', '#7a5090', '#d88a6a'], wall: '#5a3a4c', wall2: '#533446', desk: ['#7a4a38', '#4a2a28', '#9a6a50'], glow: '255,214,140', ga: .2, cup: '#ff8ab0', vig: .34, moon: 1, hills: ['#2a4a58', '#1e3a48'], trees: ['#1a3a48', '#122c3a', '#2a5a60'], grass: ['#2a5a4a', '#1e4a3c'], fr: '#4a2a1e' }
  };
  function estTema() {
    const h = new Date(ahora()).getHours();
    return { k: h >= 20 || h < 6 ? 'N' : h >= 17 ? 'B' : 'E' };
  }
  const EST_K = 2;
  const estDY = () => Math.round(LH * .58) - 24;
  function estudioGrid(W, H, OX, DY, P) {
    const g = Grid(W, H), wx = OX + 5, wt = 5, wb = DY - 3, x0 = wx + 3, x1 = wx + 107, y0 = wt + 3, y1 = wb - 3, sh = (y1 - y0) / 5;
    const ov = (cx, cy, rx, ry, col) => { for (let yy = -ry; yy <= ry; yy++) { const w = Math.round(rx * Math.sqrt(1 - (yy / ry) * (yy / ry))); g.rect(cx - w, cy + yy, w * 2, 1, col); } };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, x % 12 < 6 ? P.wall : P.wall2);
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const f = (y - y0) / sh, b = Math.min(4, Math.floor(f)), fr = f - b; g.set(x, y, P.sky[Math.min(4, b + (fr > .8 && (x + y) % 2 ? 1 : 0))]); }
    const hy = y1 - 30;
    if (P.sun) { const sx = wx + 34, sy = P.sun === 1 ? y0 + 20 : hy - 4; ov(sx, sy, 17, 17, P.sun === 1 ? '#fff0b8' : '#ffd890'); for (let y = -17; y <= 17; y++) for (let x = -17; x <= 17; x++) if (x * x + y * y <= 289 && (x + y) % 2) g.set(sx + x, sy + y, P.sky[P.sun === 1 ? 3 : 2]); ov(sx, sy, 11, 11, P.sun === 1 ? '#fff6c8' : '#ffe0a0'); ov(sx, sy, 8, 8, P.sun === 1 ? '#fffbe8' : '#fff0c0'); }
    if (P.moon) { ov(wx + 84, y0 + 16, 8, 8, '#f8f2d0'); ov(wx + 87, y0 + 14, 7, 7, P.sky[1]); for (let i = 0; i < 22; i++) g.set(x0 + 4 + (i * 41) % 98, y0 + 3 + (i * 29) % 34, '#fff6d8'); }
    for (let x = x0; x < x1; x++) { const h = hy - 6 - Math.round(5 * Math.sin(x / 9 + 1) + 3 * Math.sin(x / 4)); g.rect(x, h, 1, y1 - h, P.hills[0]); const h2 = hy + 3 - Math.round(4 * Math.sin(x / 7 + 3)); g.rect(x, h2, 1, y1 - h2, P.hills[1]); }
    [[wx + 14, hy + 2, 9, 11], [wx + 30, hy + 6, 7, 8], [wx + 92, hy, 15, 18]].forEach(([cx, by, rx, ry]) => { g.rect(cx - 1, by - 2, 3, 12, '#5a3a26'); ov(cx, by - ry + 2, rx, ry, P.trees[0]); ov(cx - 2, by - ry - 1, Math.round(rx * .7), Math.round(ry * .7), P.trees[2]); for (let i = 0; i < 6; i++) g.rect(cx - rx + 3 + (i * 7) % (rx * 2 - 5), by - ry + (i * 5) % ry, 2, 2, P.trees[1]); });
    g.rect(x0, y1 - 15, x1 - x0, 15, P.grass[0]); for (let x = x0; x < x1; x++) if (x % 3 === 0) g.set(x, y1 - 15, P.grass[1]);
    for (let x = x0 + 2; x < x1 - 3; x += 6) { g.rect(x, y1 - 21, 3, 13, '#f6eedc'); g.set(x + 1, y1 - 22, '#f6eedc'); g.rect(x, y1 - 21, 1, 13, '#fffaf0'); }
    g.rect(x0, y1 - 18, x1 - x0, 2, '#e8dcc4'); g.rect(x0, y1 - 11, x1 - x0, 2, '#e8dcc4');
    for (let i = 0; i < 9; i++) ov(x0 + 6 + i * 12, y1 - 6, 8, 5, i % 2 ? P.trees[0] : P.trees[1]);
    const FC = ['#ff7a9a', '#ffd84a', '#ffffff', '#ff9a40', '#c08aff', '#ff5a6a'];
    for (let i = 0; i < 30; i++) { const fx = x0 + 3 + (i * 17) % 100, fy = y1 - 9 + (i * 7) % 8; g.rect(fx, fy, 2, 2, FC[i % 6]); g.set(fx, fy, '#fff8c0'); }
    g.rect(x0, y1 - 1, x1 - x0, 1, P.grass[1]);
    const F = P.fr;
    g.rect(wx, wt, 110, 3, F); g.rect(wx, wt, 3, wb - wt + 2, F); g.rect(wx + 107, wt, 3, wb - wt + 2, F); g.rect(wx + 53, wt, 3, wb - wt, F); g.rect(wx, wt, 110, 1, P.desk[2]);
    g.rect(wx - 2, wb - 1, 114, 5, P.desk[2]); g.rect(wx - 2, wb - 1, 114, 1, '#ffffff'); g.rect(wx - 2, wb + 3, 114, 1, P.desk[1]);
    for (let i = 0; i < W; i++) g.set(i, 1 + Math.round(4 * Math.sin(i / W * Math.PI * 4) + 4), '#3a2418');
    { const sy = estShelfY(DY); g.rect(x0, sy, x1 - x0, 3, P.desk[2]); g.rect(x0, sy + 3, x1 - x0, 1, P.desk[1]); g.rect(x0, sy, x1 - x0, 1, '#ffffff'); g.rect(x0 + 8, sy + 4, 2, 6, P.desk[1]); g.rect(x1 - 10, sy + 4, 2, 6, P.desk[1]); }
    // escritorio (superficie profunda y cosas al doble de tamaño, como Simon)
    g.rect(0, DY, W, 22, P.desk[0]); g.rect(0, DY, W, 2, P.desk[2]); g.rect(0, DY + 9, W, 1, P.desk[1]); g.rect(0, DY + 16, W, 1, P.desk[1]); g.rect(0, DY + 22, W, 5, P.desk[1]); g.rect(0, DY + 27, W, H, P.wall);
    g.rect(OX + 4, DY - 4, 14, 4, '#2a2030'); g.rect(OX + 10, DY - 28, 3, 24, '#2a2030'); g.rect(OX, DY - 40, 22, 14, '#2a2030'); g.rect(OX + 1, DY - 39, 20, 12, '#ffd890'); g.rect(OX + 2, DY - 38, 18, 4, '#fff0c0'); g.rect(OX + 1, DY - 28, 20, 1, '#c89a50');
    g.rect(OX + 22, DY - 14, 14, 14, '#c0603a'); g.rect(OX + 21, DY - 16, 16, 3, '#d8744a'); g.rect(OX + 22, DY - 13, 14, 1, '#e08a5a'); g.rect(OX + 28, DY - 44, 3, 30, '#2f9a4a');
    g.rect(OX + 18, DY - 42, 10, 5, '#4ac07a'); g.rect(OX + 31, DY - 48, 12, 5, '#4ac07a'); g.rect(OX + 20, DY - 30, 8, 4, '#2f9a4a'); g.rect(OX + 31, DY - 34, 10, 4, '#4ac07a'); g.rect(OX + 25, DY - 52, 7, 6, '#4ac07a');
    g.rect(OX + 98, DY - 8, 22, 8, '#8a5ae8'); g.rect(OX + 98, DY - 8, 22, 2, '#b08aff'); g.rect(OX + 100, DY - 16, 20, 8, '#e8556a'); g.rect(OX + 100, DY - 16, 20, 2, '#ff8a9a'); g.rect(OX + 102, DY - 23, 18, 7, '#ffd84a'); g.rect(OX + 102, DY - 23, 18, 2, '#fff0a0');
    g.rect(OX + 104, DY - 37, 12, 14, P.cup); g.rect(OX + 116, DY - 33, 4, 7, P.cup); g.rect(OX + 106, DY - 36, 8, 3, '#4a2a1a');
    // respaldo de la silla (detrás de Simon)
    const cx0 = SX + 28 - 62, ct = SY + 62; g.rect(cx0, ct, 124, H, '#5a3020'); g.rect(cx0 + 2, ct + 2, 120, H, '#8a5238'); g.rect(cx0 + 4, ct + 4, 116, 2, '#b07a58');
    return g;
  }

  function dibujarEstDeco(DY, zona) {
    const sel = edit && edit.sel != null ? e.deco[edit.sel] : null;
    if (sel && sel.h === 'estudio' && ITEMS[sel.k] && ITEMS[sel.k].zona === zona && (tk >> 3) % 2) {   // marcas de los lugares libres mientras arrastras
      ctx.fillStyle = 'rgba(255,255,255,.55)'; estSlotsX(zona).forEach(x => { if (zona === 'col') ctx.fillRect(OX + x - 2, 9, 4, 2); else ctx.fillRect(OX + x - 6, estShelfY(DY) - 2, 12, 2); });
    }
    e.deco.forEach((d, i) => {
      if (d.h !== 'estudio' || !ITEMS[d.k] || ITEMS[d.k].zona !== zona) return;
      const r = estPos(d), sp = sprite('mu_' + d.k, ITEMS[d.k].grid, e.dormido ? .55 : 0), ox = zona === 'col' ? Math.round(Math.sin(tk / 18 + i * 1.7) * 1.4) : 0;
      if (zona === 'est') { ctx.fillStyle = 'rgba(30,12,40,.25)'; ctx.fillRect(r.x + 1, r.base, r.w - 2, 1); }
      if (d.f) { ctx.save(); ctx.translate(r.x + r.w + ox, r.y); ctx.scale(-1, 1); ctx.drawImage(sp, 0, 0); ctx.restore(); } else ctx.drawImage(sp, r.x + ox, r.y);
      if (edit && edit.sel === i) { ctx.fillStyle = (tk >> 2) % 2 ? '#ffe45a' : '#ffffff'; ctx.fillRect(r.x - 2, r.y - 2, r.w + 4, 1); ctx.fillRect(r.x - 2, r.y + r.h + 1, r.w + 4, 1); ctx.fillRect(r.x - 2, r.y - 2, 1, r.h + 4); ctx.fillRect(r.x + r.w + 1, r.y - 2, 1, r.h + 4); }
    });
  }
  function estudioFondo(n) {
    const T = estTema(), P = EST_T[T.k], DY = estDY(), wx = OX + 5, wb = DY - 3, x0 = wx + 3, x1 = wx + 107, y0 = 8, y1 = wb - 3;
    ctx.drawImage(sprite('estudio' + LW + 'x' + LH + '|' + SY + T.k, () => estudioGrid(LW, LH, OX, DY, P), n ? .55 : 0), 0, 0);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
    const AM = estAmbActivo(), IW = x1 - x0, IH = y1 - y0;
    if (T.k !== 'N' && !AM) {
      ctx.fillStyle = T.k === 'E' ? '#ffffff' : '#ffe0c0';
      for (let i = 0; i < 3; i++) { const cx = x0 - 24 + ((tk * .12 + i * 52) % (x1 - x0 + 48)), cy = y0 + 6 + i * 11; ctx.fillRect(cx, cy, 18, 4); ctx.fillRect(cx + 3, cy - 2, 9, 2); ctx.fillRect(cx - 3, cy + 2, 24, 3); }
      for (let i = 0; i < 2; i++) { const bx = Math.round(x0 + 40 + i * 28 + Math.sin(tk / 22 + i * 2) * 26), by = Math.round(y1 - 24 + Math.cos(tk / 13 + i) * 7), a = (tk >> 1) % 2; ctx.fillStyle = i ? '#ffd84a' : '#ff8ad8'; ctx.fillRect(bx - 2, by - (a ? 1 : 0), 2, a ? 3 : 2); ctx.fillRect(bx + 1, by - (a ? 1 : 0), 2, a ? 3 : 2); ctx.fillStyle = '#4a3040'; ctx.fillRect(bx, by, 1, 2); }
    } else if (!AM) {
      for (let i = 0; i < 9; i++) { if (((tk >> 3) + i) % 5 < 3) { const fx = x0 + 6 + (i * 29) % 96, fy = Math.round(y1 - 32 + (i * 13) % 26 + Math.sin(tk / 15 + i) * 2); ctx.fillStyle = 'rgba(255,246,160,.3)'; ctx.fillRect(fx - 1, fy - 1, 4, 4); ctx.fillStyle = '#fff6a0'; ctx.fillRect(fx, fy, 2, 2); } }
      if ((tk >> 3) % 2) { ctx.fillStyle = '#ffffff'; const q = (tk >> 4) % 22; ctx.fillRect(x0 + 3 + (q * 41) % 98, y0 + 3 + (q * 29) % 34, 3, 1); }
    }
    if (AM) {
      const TT = AM === 'tormenta';
      ctx.fillStyle = TT ? 'rgba(40,50,80,.55)' : 'rgba(80,95,130,.4)'; ctx.fillRect(x0, y0, IW, IH);
      const gota = (i, vel, len, col) => { const y = (i * 53 + tk * vel) % (IH + 8) - 4, x = ((i * 37) % IW - Math.floor(y / 5) + IW * 3) % IW; ctx.fillStyle = col; for (let k = 0; k < len; k++) ctx.fillRect(x0 + (x - (k >> 1) + IW) % IW, y0 + y + k, 1, 1); };
      for (let i = 0; i < (TT ? 56 : 38); i++) gota(i, TT ? 4 : 3, 3, 'rgba(205,222,255,.38)');
      for (let i = 0; i < (TT ? 38 : 24); i++) gota(i + 97, TT ? 7 : 5, 6, 'rgba(235,244,255,.7)');
      for (let i = 0; i < 7; i++) { const bx = x0 + 9 + i * 14 + (i * 5) % 7, by = y0 + ((tk * (.12 + (i % 3) * .07)) + i * 31) % IH; ctx.fillStyle = 'rgba(235,245,255,.25)'; ctx.fillRect(bx, by - 9, 1, 8); ctx.fillStyle = 'rgba(245,250,255,.9)'; ctx.fillRect(bx, by, 2, 2); }
      for (let i = 0; i < 8; i++) { const ph = (tk + i * 7) % 20; if (ph < 6) { const sx = x0 + 6 + (i * 41) % (IW - 10), sy = y1 - 2 - (i % 3) * 3; ctx.fillStyle = 'rgba(235,245,255,.7)'; if (ph < 2) ctx.fillRect(sx, sy, 1, 1); else { ctx.fillRect(sx - (ph >> 1), sy, (ph >> 1) * 2 + 1, 1); } } }
    }
    if (estRayo > 0) { ctx.fillStyle = estRayo > 2 ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.3)'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); estRayo--; }
    ctx.restore();
    if (T.k !== 'N' && !AM) { ctx.fillStyle = T.k === 'E' ? 'rgba(255,244,190,.09)' : 'rgba(255,190,110,.11)'; for (let k = 0; k < 3; k++) for (let y = wb + 3; y < DY + 22; y++) { const dx = (y - wb) * .55; ctx.fillRect(Math.round(wx + 14 + dx + k * 36), y, 14, 1); } }
    ctx.fillStyle = 'rgba(' + P.glow + ',' + P.ga + ')'; for (let j = 0; j < 40; j++) ctx.fillRect(OX + 10 - j, Math.min(DY + 20, DY - 26 + j), 20 + j * 2, 1);
    dibujarEstDeco(DY, 'est'); dibujarLibros(DY); dibujarEstDeco(DY, 'col');
    const cols = ['#ff8ab0', '#ffd84a', '#7ae8e0', '#ff9a40', '#c08aff'];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { const xx = 6 + j * 23 + i * 4; if (xx >= LW - 2) continue; const yy = 2 + Math.round(4 * Math.sin(xx / LW * Math.PI * 4) + 4), on = ((tk >> 3) + i + j) % 4 !== 0; ctx.fillStyle = on ? cols[(i + j) % 5] : '#6a4a3a'; ctx.fillRect(xx, yy + 1, 2, 3); if (on) { ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(xx - 1, yy, 4, 5); } }
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(OX + 108 + ((tk >> 3) % 2) * 2, DY - 42 - ((tk >> 2) % 4), 2, 5); ctx.fillRect(OX + 112 - ((tk >> 3) % 2) * 2, DY - 47 - ((tk >> 2) % 4), 2, 4);
  }
  const ESTAUD = () => { const g = Grid(SW, 30); const P = '#ff8ab0'; for (let a = 0; a < 40; a++) { const t = Math.PI + a / 39 * Math.PI, bx = Math.round(28 + 26.5 * Math.cos(t)), by = Math.round(22 + 21.5 * Math.sin(t)); if (a < 10 || a > 29) { g.rect(bx, by, 2, 2, '#1a1030'); } }
    [[3, 22], [53, 22]].forEach(([cx, cy]) => { for (let yy = -9; yy <= 9; yy++) { const w = Math.round(5 * Math.sqrt(1 - (yy / 9) * (yy / 9))); g.rect(cx - w, cy + yy, w * 2, 1, '#1a1030'); } for (let yy = -7; yy <= 7; yy++) { const w = Math.round(3.5 * Math.sqrt(1 - (yy / 7) * (yy / 7))); g.rect(cx - w, cy + yy, w * 2, 1, P); } g.rect(cx - 2, cy - 4, 2, 2, '#ffd0e0'); }); return g; };
  function estudioFrente(n, oy, gx, esx) {
    ctx.save(); ctx.translate(SX + 28 + gx, SY + 32 + oy); ctx.scale(EST_K * esx, EST_K);
    ctx.drawImage(sprite('estaud', ESTAUD, n ? .22 : 0), -28, -22);
    const P = EST_T[estTema().k];
    ctx.fillStyle = 'rgba(' + P.glow + ',.16)'; for (let yy = -16; yy <= 16; yy++) { const w = Math.round(5 * Math.sqrt(1 - (yy / 17) * (yy / 17))); ctx.fillRect(25 - w + 2, yy, w, 1); }
    ctx.restore();
  }
  function estudioViñeta() {
    for (let i = 0; i < 24; i++) { ctx.fillStyle = 'rgba(30,10,0,' + (EST_T[estTema().k].vig * (1 - i / 24)).toFixed(2) + ')'; ctx.fillRect(0, i, LW, 1); ctx.fillRect(0, LH - 1 - i, LW, 1); ctx.fillRect(i, 0, 1, LH); ctx.fillRect(LW - 1 - i, 0, 1, LH); }
  }
  function escritorioGrid() {
    const g = Grid(92, 34);
    g.rect(0, 0, 92, 5, '#e0b070'); g.rect(0, 0, 92, 1, '#fff0c8'); g.rect(0, 4, 92, 1, '#8a5630');
    g.rect(2, 5, 88, 24, '#b87a44'); g.rect(2, 5, 88, 2, '#8a5630');
    g.rect(6, 10, 38, 17, '#c98a52'); g.rect(48, 10, 38, 17, '#c98a52'); g.rect(6, 10, 38, 1, '#e8b078'); g.rect(48, 10, 38, 1, '#e8b078');
    g.rect(22, 17, 6, 2, '#ffd84a'); g.rect(64, 17, 6, 2, '#ffd84a');
    g.rect(2, 29, 88, 1, '#6a4222'); g.rect(2, 29, 7, 5, '#8a5630'); g.rect(83, 29, 7, 5, '#8a5630');
    return g;
  }
  /* ---- objetos EXCLUSIVOS del estudio: estante (deco) y colgantes (decoP) ---- */
  function ovalG(g, cx, cy, rx, ry, c) { for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(1 - (y / ry) * (y / ry))); g.rect(cx - w, cy + y, w * 2, 1, c); } }
  function peluSimonGrid() { const g = Grid(18, 22); ovalG(g, 9, 17, 6, 5, '#4a8ae8'); g.rect(3, 14, 2, 5, '#4a8ae8'); g.rect(13, 14, 2, 5, '#4a8ae8'); ovalG(g, 9, 10, 8, 7, '#f4f6ff'); ovalG(g, 9, 12, 8, 5, '#e4e8fa'); g.rect(4, 8, 3, 4, '#1a1030'); g.rect(11, 8, 3, 4, '#1a1030'); g.set(4, 8, '#8a8ab8'); g.set(11, 8, '#8a8ab8'); g.rect(2, 12, 2, 1, '#ffa0b6'); g.rect(14, 12, 2, 1, '#ffa0b6'); g.rect(8, 13, 2, 1, '#1a1030'); g.rect(5, 3, 8, 2, '#e8556a'); g.rect(6, 1, 2, 3, '#e8556a'); g.rect(8, 0, 2, 4, '#e8556a'); g.rect(10, 1, 2, 3, '#e8556a'); g.contour('#1a1030'); return g; }
  function globoEstGrid() { const g = Grid(16, 22); ovalG(g, 8, 8, 7, 7, '#4a8ae8'); g.rect(4, 4, 4, 3, '#4ac07a'); g.rect(9, 8, 4, 4, '#4ac07a'); g.rect(5, 10, 2, 2, '#4ac07a'); g.rect(3, 5, 1, 3, '#8ac8ff'); g.rect(7, 15, 2, 3, '#8a5630'); g.rect(4, 18, 8, 2, '#8a5630'); g.contour('#2a1a10'); return g; }
  function relojArenaGrid() { const g = Grid(12, 20); for (let y = 0; y < 8; y++) { const w = Math.max(2, Math.floor(10 - y * 1.3)); g.rect(6 - (w >> 1), 2 + y, w, 1, '#cfe8ff'); g.rect(6 - (w >> 1), 17 - y, w, 1, '#cfe8ff'); } g.rect(3, 5, 6, 3, '#ffd84a'); g.rect(5, 9, 2, 2, '#ffd84a'); g.rect(3, 15, 6, 2, '#ffd84a'); g.rect(1, 0, 10, 2, '#8a5630'); g.rect(1, 18, 10, 2, '#8a5630'); g.contour('#2a1a10'); return g; }
  function cactusEstGrid() { const g = Grid(12, 16); g.rect(2, 10, 8, 6, '#c0603a'); g.rect(2, 10, 8, 1, '#e08a5a'); g.rect(4, 2, 4, 9, '#3a9a50'); g.rect(1, 5, 3, 2, '#3a9a50'); g.rect(1, 3, 2, 3, '#3a9a50'); g.rect(8, 6, 3, 2, '#3a9a50'); g.rect(10, 4, 2, 3, '#3a9a50'); g.rect(5, 3, 1, 7, '#5ac870'); g.set(5, 1, '#ff7a9a'); g.contour('#1a4a2a'); return g; }
  function marcoEstGrid() { const g = Grid(16, 18); g.rect(0, 0, 16, 15, '#c98a52'); g.rect(2, 2, 12, 11, '#bfe6ff'); g.rect(9, 3, 3, 3, '#ffe45a'); g.rect(2, 10, 12, 3, '#6cc462'); g.rect(3, 8, 4, 2, '#4ac07a'); g.rect(0, 0, 16, 1, '#e8b078'); g.rect(6, 15, 4, 3, '#8a5630'); g.contour('#2a1a10'); return g; }
  function trofeoEstGrid() { const g = Grid(14, 20); g.rect(3, 1, 8, 7, '#ffd84a'); g.rect(4, 8, 6, 2, '#ffd84a'); g.rect(6, 10, 2, 4, '#e8b020'); g.rect(3, 14, 8, 2, '#8a5630'); g.rect(4, 16, 6, 3, '#c98a52'); g.rect(0, 2, 3, 1, '#ffd84a'); g.rect(0, 2, 1, 4, '#ffd84a'); g.rect(1, 5, 2, 1, '#ffd84a'); g.rect(11, 2, 3, 1, '#ffd84a'); g.rect(13, 2, 1, 4, '#ffd84a'); g.rect(11, 5, 2, 1, '#ffd84a'); g.rect(4, 2, 1, 5, '#fff6a0'); g.set(7, 4, '#e8b020'); g.contour('#2a1a10'); return g; }
  function radioEstGrid() { const g = Grid(20, 16); g.rect(0, 3, 20, 13, '#c0603a'); g.rect(0, 3, 20, 2, '#e08a5a'); g.rect(2, 6, 9, 8, '#6a2a1a'); for (let y = 7; y < 14; y += 2) g.rect(2, y, 9, 1, '#a04a30'); ovalG(g, 15, 9, 3, 3, '#f4ecd8'); g.set(15, 9, '#c0603a'); g.rect(13, 13, 2, 2, '#2a1a10'); g.rect(17, 13, 2, 2, '#2a1a10'); g.rect(16, 0, 1, 3, '#cfcfe0'); g.rect(14, 0, 3, 1, '#cfcfe0'); g.contour('#2a1a10'); return g; }
  function ovniEstGrid() { const g = Grid(20, 14); ovalG(g, 10, 5, 5, 5, '#a8e8ff'); g.rect(9, 4, 3, 3, '#7ae87a'); g.set(9, 5, '#1a1030'); g.set(11, 5, '#1a1030'); g.rect(7, 2, 2, 2, '#e8faff'); ovalG(g, 10, 9, 9, 3, '#b0b8d0'); ovalG(g, 10, 10, 9, 2, '#8890b0'); g.rect(4, 9, 2, 1, '#ffd84a'); g.rect(9, 10, 2, 1, '#ff7ab0'); g.rect(14, 9, 2, 1, '#7ae8e0'); g.contour('#1a1030'); return g; }
  function kekeEstGrid() { const g = Grid(16, 14); g.rect(0, 11, 16, 3, '#f4f6ff'); g.rect(2, 5, 12, 6, '#ffd0a0'); g.rect(2, 4, 12, 2, '#ffffff'); g.rect(2, 8, 12, 1, '#ff9ac0'); g.rect(7, 1, 3, 3, '#e8353f'); g.set(8, 0, '#2f9a4a'); g.contour('#5a3a2a'); return g; }
  function coheteEstGrid() { const g = Grid(10, 22); g.rect(2, 5, 6, 12, '#f4f6ff'); g.rect(3, 2, 4, 3, '#e8556a'); g.rect(4, 0, 2, 2, '#e8556a'); ovalG(g, 5, 9, 2, 2, '#4a8ae8'); g.rect(0, 13, 2, 5, '#e8556a'); g.rect(8, 13, 2, 5, '#e8556a'); g.rect(3, 17, 4, 2, '#ffd84a'); g.rect(4, 19, 2, 2, '#ff9a40'); g.contour('#1a1030'); return g; }
  function atrapaGrid() { const g = Grid(16, 26); g.rect(8, 0, 1, 3, '#f4ecd8'); for (let a = 0; a < 48; a++) { const t = a / 48 * Math.PI * 2; g.set(8 + Math.round(6 * Math.cos(t)), 9 + Math.round(6 * Math.sin(t)), '#c98a52'); } g.rect(3, 9, 11, 1, '#f4ecd8'); g.rect(8, 4, 1, 11, '#f4ecd8'); g.set(8, 9, '#ff7a9a'); g.rect(4, 15, 1, 4, '#f4ecd8'); g.rect(3, 19, 3, 6, '#8ae8e0'); g.rect(8, 15, 1, 6, '#f4ecd8'); g.rect(7, 21, 3, 5, '#ff9ac0'); g.rect(12, 15, 1, 4, '#f4ecd8'); g.rect(11, 19, 3, 6, '#ffd84a'); return g; }
  function estrellasPapelGrid() { const g = Grid(16, 26), S = ['..y..', '.yyy.', 'yyyyy', '.yyy.', '.y.y.']; [[3, 6, '#ffe45a'], [8, 15, '#ff9ac0'], [13, 9, '#8ae8e0']].forEach(([x, l, c]) => { g.rect(x, 0, 1, l, '#f4ecd8'); g.art(x - 2, l, S, { y: c }); }); return g; }
  function grullasGrid() { const g = Grid(18, 26), S = ['..c..', '.ccc.', 'ccccc', '.ccc.', '..c..']; [[3, 5, '#ff7a9a'], [9, 12, '#7ac8ff'], [15, 18, '#ffd84a']].forEach(([x, l, c]) => { g.rect(x, 0, 1, l, '#f4ecd8'); g.art(x - 2, l, S, { c }); g.set(x, l + 2, '#ffffff'); }); return g; }
  function campanasGrid() { const g = Grid(14, 26); g.rect(2, 0, 10, 2, '#c98a52'); [[3, 12], [6, 16], [9, 10], [12, 14]].forEach(([x, l]) => { g.rect(x, 2, 1, 3, '#f4ecd8'); g.rect(x - 1, 5, 2, l - 3, '#cfe0f0'); g.rect(x - 1, 5, 1, l - 3, '#ffffff'); }); g.rect(7, 19, 1, 3, '#f4ecd8'); g.rect(5, 22, 5, 3, '#ff9ac0'); return g; }
  function plantaColGrid() { const g = Grid(16, 26); g.rect(8, 0, 1, 4, '#f4ecd8'); g.rect(4, 4, 8, 6, '#c0603a'); g.rect(4, 4, 8, 1, '#e08a5a'); [[4, 10], [6, 15], [9, 8], [11, 13]].forEach(([x, l]) => { g.rect(x, 10, 1, l, '#3a9a50'); for (let y = 12; y < 10 + l; y += 3) g.set(x + (y % 2 ? 1 : -1), y, '#5ac870'); }); g.rect(3, 3, 10, 1, '#8a5630'); return g; }
  function farolPapelGrid() { const g = Grid(12, 26); g.rect(6, 0, 1, 4, '#f4ecd8'); g.rect(3, 4, 6, 2, '#8a2a1a'); ovalG(g, 6, 12, 5, 6, '#e8353f'); g.rect(6, 6, 1, 12, '#a82030'); g.rect(3, 12, 6, 1, '#ff7a6a'); g.rect(5, 11, 3, 3, '#ffd84a'); g.rect(3, 18, 6, 2, '#8a2a1a'); g.rect(6, 20, 1, 3, '#ffd84a'); g.rect(5, 23, 3, 2, '#ffd84a'); return g; }
  function lunaColGrid() { const g = Grid(14, 28); g.rect(7, 0, 1, 8, '#f4ecd8'); for (let y = 0; y < 16; y++) for (let x = 0; x < 14; x++) { const a = (x - 7) * (x - 7) + (y - 16 + 8) * (y - 16 + 8), b = (x - 10) * (x - 10) + (y - 14 + 8) * (y - 14 + 8); if (a <= 42 && b > 30) g.set(x, y + 8, (x + y) % 5 ? '#ffe45a' : '#fff6a0'); } g.set(11, 12, '#ffffff'); g.set(2, 9, '#ffffff'); return g; }
  Object.assign(nuevosItems, {
    cactus_est: ['CACTUS', 35, 1, 'deco', cactusEstGrid, 'estudio'], marco_est: ['PORTARRETRATO', 45, 1, 'deco', marcoEstGrid, 'estudio'], peluche_simon: ['MINI SIMON DE PELUCHE', 120, 2, 'deco', peluSimonGrid, 'estudio'],
    keke_est: ['REBANADA DE KEKE', 60, 2, 'deco', kekeEstGrid, 'estudio'], reloj_arena: ['RELOJ DE ARENA', 80, 3, 'deco', relojArenaGrid, 'estudio'], globo_est: ['GLOBO TERRÁQUEO', 90, 3, 'deco', globoEstGrid, 'estudio'],
    radio_est: ['RADIO RETRO', 110, 4, 'deco', radioEstGrid, 'estudio'], cohete_est: ['COHETE DE JUGUETE', 70, 4, 'deco', coheteEstGrid, 'estudio'], ovni_est: ['OVNI DE JUGUETE', 140, 5, 'deco', ovniEstGrid, 'estudio'], trofeo_est: ['TROFEO DE ESTUDIO', 100, 6, 'deco', trofeoEstGrid, 'estudio'],
    estrellas_papel: ['ESTRELLAS DE PAPEL', 40, 1, 'decoP', estrellasPapelGrid, 'estudio'], luna_col: ['LUNA COLGANTE', 70, 2, 'decoP', lunaColGrid, 'estudio'], grullas: ['GRULLAS DE PAPEL', 60, 2, 'decoP', grullasGrid, 'estudio'],
    planta_col: ['PLANTA COLGANTE', 55, 3, 'decoP', plantaColGrid, 'estudio'], farol_papel: ['FAROL DE PAPEL', 65, 3, 'decoP', farolPapelGrid, 'estudio'], atrapasuenos: ['ATRAPASUEÑOS', 90, 4, 'decoP', atrapaGrid, 'estudio'], campanillas: ['CAMPANILLAS', 80, 5, 'decoP', campanasGrid, 'estudio']
  });
  function patitoBGrid() { const g = Grid(20, 20); ovalG(g, 9, 14, 8, 5, '#ffd84a'); ovalG(g, 13, 7, 5, 5, '#ffd84a'); g.rect(17, 7, 3, 2, '#ff9a40'); g.set(13, 6, '#1a1030'); g.rect(3, 11, 5, 3, '#f0b820'); g.rect(8, 16, 6, 1, '#f0b820'); g.set(11, 5, '#fff6a0'); g.set(4, 12, '#fff6a0'); g.contour('#7a4a10'); return g; }
  function bancoBGrid() { const g = Grid(18, 22); g.rect(1, 8, 16, 3, '#c98a52'); g.rect(1, 8, 16, 1, '#e8b078'); g.rect(2, 11, 2, 10, '#8a5630'); g.rect(14, 11, 2, 10, '#8a5630'); g.rect(3, 4, 12, 5, '#f4f2ee'); g.rect(3, 4, 12, 1, '#ffffff'); g.rect(3, 6, 12, 1, '#7ac8d8'); g.rect(3, 8, 12, 1, '#d8d4cc'); g.contour('#2a1a10'); return g; }
  function basculaGrid() { const g = Grid(20, 10); g.rect(1, 2, 18, 7, '#e8eef2'); g.rect(1, 2, 18, 1, '#ffffff'); g.rect(1, 8, 18, 1, '#a8b2bc'); g.rect(7, 3, 6, 3, '#2a3a40'); g.rect(8, 4, 1, 1, '#7affb0'); g.rect(10, 4, 2, 1, '#7affb0'); g.rect(3, 4, 2, 3, '#c8d2da'); g.rect(15, 4, 2, 3, '#c8d2da'); g.contour('#3a4a52'); return g; }
  function canastoGrid() { const g = Grid(18, 26); g.rect(2, 6, 14, 18, '#c8a070'); for (let y = 8; y < 24; y += 3) g.rect(2, y, 14, 1, '#a88050'); for (let x = 4; x < 16; x += 4) g.rect(x, 6, 1, 18, '#e0b888'); g.rect(1, 5, 16, 2, '#8a5630'); g.rect(4, 1, 5, 5, '#7ac8d8'); g.rect(9, 2, 5, 4, '#ff9ac0'); g.rect(5, 2, 2, 2, '#ffffff'); g.contour('#3a2410'); return g; }
  function boteBGrid() { const g = Grid(12, 18); g.rect(1, 4, 10, 13, '#cfd8e0'); g.rect(1, 4, 3, 13, '#eef4f8'); g.rect(8, 4, 3, 13, '#a8b4be'); g.rect(0, 2, 12, 3, '#8a96a2'); g.rect(0, 2, 12, 1, '#b4bec8'); g.rect(4, 0, 4, 2, '#8a96a2'); g.rect(5, 9, 2, 5, '#7a8a96'); g.contour('#3a4650'); return g; }
  function helechoGrid() { const g = Grid(20, 28); g.rect(5, 18, 10, 9, '#4a8ab8'); g.rect(5, 18, 10, 1, '#7ac0e8'); g.rect(4, 17, 12, 2, '#3a6a90'); g.rect(6, 22, 8, 1, '#7ac0e8'); [[10, 17, 10, 2], [10, 17, 3, 5], [10, 17, 17, 6], [10, 17, 6, 12], [10, 17, 14, 12]].forEach(([x, y, tx, ty]) => { const n = 16; for (let i = 0; i <= n; i++) { const t = i / n, px = Math.round(x + (tx - x) * t), py = Math.round(y + (ty - y) * t - Math.sin(t * 3.14) * 3); g.set(px, py, '#3a9a50'); g.set(px + 1, py, '#5ac870'); if (i % 3 === 1) { g.set(px - 1, py - 1, '#5ac870'); g.set(px + 2, py + 1, '#3a9a50'); } } }); g.contour('#1a4a2a'); return g; }
  function tinaGrid() { const g = Grid(40, 24); ovalG(g, 20, 17, 19, 6, '#f4f8fa'); g.rect(1, 9, 38, 9, '#f4f8fa'); ovalG(g, 20, 9, 19, 3, '#e8f0f4'); ovalG(g, 20, 10, 17, 2, '#8ad4ee'); g.rect(3, 12, 34, 5, '#e8f0f4'); g.rect(3, 17, 34, 1, '#b4c4cc'); g.rect(5, 21, 3, 3, '#c8a070'); g.rect(32, 21, 3, 3, '#c8a070'); for (let i = 0; i < 6; i++) { circG(g, 8 + i * 6 + (i % 2) * 2, 6 + (i % 3), 2, '#ffffff'); } ovalG(g, 28, 8, 3, 3, '#ffd84a'); g.rect(30, 7, 3, 1, '#ff9a40'); g.contour('#4a6a78'); return g; }
  function cuadroPezGrid() { const g = Grid(18, 16); g.rect(0, 0, 18, 16, '#f4f2ee'); g.rect(1, 1, 16, 14, '#6ac0e8'); g.rect(1, 10, 16, 5, '#3a98c8'); ovalG(g, 8, 7, 4, 3, '#ff9a40'); g.rect(11, 5, 3, 5, '#ff9a40'); g.set(6, 6, '#1a1030'); g.rect(5, 8, 2, 1, '#ffd0a0'); g.set(13, 3, '#ffffff'); g.set(3, 4, '#ffffff'); g.rect(3, 12, 1, 3, '#4ac07a'); g.rect(14, 11, 1, 4, '#4ac07a'); g.contour('#7a5a30'); return g; }
  function toalleroGrid() { const g = Grid(22, 22); g.rect(1, 2, 20, 2, '#8a96a2'); g.rect(1, 2, 20, 1, '#c8d2da'); g.rect(1, 1, 2, 4, '#4a5560'); g.rect(19, 1, 2, 4, '#4a5560'); g.rect(4, 4, 14, 15, '#7ac8d8'); g.rect(4, 4, 14, 1, '#a8e0ea'); g.rect(4, 11, 14, 2, '#ffffff'); g.rect(4, 18, 14, 1, '#4a98a8'); for (let x = 5; x < 18; x += 2) g.set(x, 19, '#4a98a8'); g.contour('#2a4a58'); return g; }
  function relojConchaGrid() { const g = Grid(18, 18); for (let y = 0; y < 18; y++) { const w = Math.round(8 * Math.sqrt(1 - ((y - 9) / 9) * ((y - 9) / 9))); g.rect(9 - w, y, w * 2, 1, '#ffc8d8'); } ovalG(g, 9, 10, 6, 6, '#fffbe8'); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.set(9 + Math.round(5 * Math.sin(a)), 10 - Math.round(5 * Math.cos(a)), '#3a2a3a'); } g.rect(9, 6, 1, 4, '#3a2a3a'); g.rect(9, 10, 3, 1, '#3a2a3a'); for (let i = 0; i < 7; i++) g.set(2 + i * 2, 2 + (i % 2), '#ff8aa8'); g.contour('#7a3a58'); return g; }
  function repisaJabonGrid() { const g = Grid(26, 18); g.rect(0, 13, 26, 3, '#c98a52'); g.rect(0, 13, 26, 1, '#e8b078'); g.rect(3, 16, 2, 2, '#8a5630'); g.rect(21, 16, 2, 2, '#8a5630'); g.rect(2, 7, 5, 6, '#ff9ac0'); g.rect(2, 7, 5, 1, '#ffc8dc'); g.rect(9, 5, 4, 8, '#7ae8c8'); g.rect(10, 3, 2, 2, '#4a8a78'); g.rect(15, 8, 5, 5, '#ffe45a'); g.rect(15, 8, 5, 1, '#fff6a0'); circG(g, 23, 10, 2, '#cfeef7'); g.set(22, 9, '#ffffff'); g.contour('#5a3a2a'); return g; }
  Object.assign(nuevosItems, {
    patito_b: ['PATO DE HULE GIGANTE', 70, 1, 'deco', patitoBGrid, 'bano'], banco_b: ['BANQUITO CON TOALLA', 45, 1, 'deco', bancoBGrid, 'bano'], bote_b: ['BOTE DE BASURA', 35, 1, 'deco', boteBGrid, 'bano'],
    bascula_b: ['BÁSCULA', 55, 2, 'deco', basculaGrid, 'bano'], canasto_b: ['CANASTO DE ROPA', 65, 2, 'deco', canastoGrid, 'bano'], helecho_b: ['HELECHO', 50, 3, 'deco', helechoGrid, 'bano'], tina_b: ['TINA DE PATITOS', 220, 5, 'deco', tinaGrid, 'bano'],
    cuadro_pez: ['CUADRO DEL PEZ', 50, 1, 'decoP', cuadroPezGrid, 'bano'], toallero_b: ['TOALLERO', 60, 2, 'decoP', toalleroGrid, 'bano'], reloj_concha: ['RELOJ DE CONCHA', 70, 3, 'decoP', relojConchaGrid, 'bano'], repisa_jabon: ['REPISA DE JABONES', 80, 4, 'decoP', repisaJabonGrid, 'bano']
  });
