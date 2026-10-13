  /* ===================== ROPA Y ACCESORIOS 2 (más de 70 prendas + PREMIUM) ===================== */
  var ACC2 = {}, SUDP = {};
  const pal4 = b => [mixC(b, .55), b, mixC(b, -.28), mixC(b, -.55)];
  const circ = (L, cx, cy, r, c) => { for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) if ((x + .5 - cx) ** 2 + (y + .5 - cy) ** 2 <= r * r) L.set(x, y, c); };
  const estr4 = (L, cx, cy, r, c) => { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const a = Math.abs(dx), b = Math.abs(dy); if (a + b <= r && (Math.min(a, b) <= 1 || a + b <= r * .55)) L.set(cx + dx, cy + dy, c); } };
  const polyT = pts => (x, y) => { let d = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y + .5) !== (yj > y + .5) && (x + .5) < (xj - xi) * (y + .5 - yi) / (yj - yi) + xi) d = !d; } return d; };
  const espejoX = pts => pts.map(([x, y]) => [SW - x, y]);
  // ---------- sudaderas lisas y estampadas ----------
  [['sud_gris', 'SUDADERA GRIS', '#9aa0b4', 50, 2], ['sud_amarilla', 'SUDADERA AMARILLA', '#ffd23a', 60, 2], ['sud_cafe', 'SUDADERA CAFE', '#9a6a40', 70, 3], ['sud_turquesa', 'SUDADERA TURQUESA', '#2cc8c0', 80, 3],
   ['sud_lila', 'SUDADERA LILA', '#b48cff', 80, 3], ['sud_blanca', 'SUDADERA BLANCA', '#f4f4ff', 90, 4], ['sud_coral', 'SUDADERA CORAL', '#ff7a6a', 90, 4], ['sud_menta', 'SUDADERA MENTA', '#7fe0b0', 90, 5],
   ['sud_oliva', 'SUDADERA OLIVA', '#7a8a3a', 90, 5], ['sud_guinda', 'SUDADERA GUINDA', '#a02050', 100, 5], ['sud_marino', 'SUDADERA MARINO', '#2a3a8a', 110, 6], ['sud_lima', 'SUDADERA LIMA', '#b6e83a', 100, 6]
  ].forEach(([k, n, c, p, nv]) => { SUDS[k] = [pal4(c), mixC(c, -.8), mixC(c, -.5)]; ITEMS[k] = { tipo: 'ropa', slot: 'sudadera', n, p, nv, crop: [0, 44, 56, 34] }; });
  [['sud_keke', 'SUDADERA DE KEKE', 90, 3, ['#f6e2b0', '#ff7ab8', '#7a4a28'], (x, y) => y <= 53 ? 1 : (((x * 7 + y * 13) % 17) === 0 ? 2 : 0)],
   ['sud_lunares', 'SUDADERA DE LUNARES', 110, 4, ['#ffc0d8', '#e8353f'], (x, y) => { const a = ((x + ((y / 6 | 0) % 2) * 4) % 8) - 3.5, b = (y % 6) - 2.5; return a * a + b * b <= 3 ? 1 : 0; }],
   ['sud_marinero', 'SUDADERA MARINERA', 100, 5, ['#f4f4ff', '#2a3a8a'], (x, y) => ((y / 3) | 0) % 2],
   ['sud_lenador', 'SUDADERA DE CUADROS', 120, 6, ['#d8333f', '#2a2a34'], (x, y) => (((x / 5) | 0) + ((y / 5) | 0)) % 2],
   ['sud_bicolor', 'SUDADERA BICOLOR', 130, 7, ['#4f49ea', '#e8353f'], x => x < 28 ? 0 : 1],
   ['sud_camuflaje', 'SUDADERA CAMUFLAJE', 140, 7, ['#6a7a3a', '#3a4a24', '#9a8a5a'], (x, y) => { const v = Math.sin(x * .55) + Math.cos(y * .7) + Math.sin((x + y) * .35); return v > .7 ? 0 : v > -.5 ? 1 : 2; }],
   ['sud_atardecer', 'SUDADERA ATARDECER', 180, 8, ['#ffb040', '#ff6a8a', '#8a4ac8'], (x, y) => y < 52 ? 0 : y < 60 ? 1 : 2],
   ['sud_tiedye', 'SUDADERA TIE-DYE', 200, 9, ['#ff7ab8', '#6ac0f0', '#ffe030', '#b48cff'], (x, y) => ((Math.hypot(x - 28, (y - 56) * 1.3) / 4) | 0) % 4],
   // premium
   ['sud_galaxia', 'SUDADERA GALAXIA', 0, 1, ['#2a1a6a', '#5a2aa8', '#150a40'], (x, y) => { const v = Math.sin(x * .22 + y * .31) + Math.cos(y * .27 - x * .12); return v > .5 ? 1 : v < -.6 ? 2 : 0; }, 23],
   ['sud_realeza', 'SUDADERA REALEZA', 0, 1, ['#6a30b0', '#ffd84a'], (x, y) => (y % 9 < 2 || (x % 14 === 0 && y % 9 < 5)) ? 1 : 0],
   ['sud_holo', 'SUDADERA HOLOGRAFICA', 600, 10, ['#ffb0e0', '#a0f0ff', '#fff6a0', '#d0b0ff'], (x, y) => (((x + y) / 4) | 0) % 4]
  ].forEach(([k, n, p, nv, cs, f, est]) => { const pals = cs.map(pal4); SUDS[k] = [pals[0], mixC(cs[cs.length > 2 ? 2 : 1], -.8), mixC(cs[0], -.5)]; SUDP[k] = { pals: pals.map(P => P.map(c => col(c))), f, est }; ITEMS[k] = { tipo: 'ropa', slot: 'sudadera', n, p, nv, crop: [0, 44, 56, 34] }; });

  // ---------- CARA ----------
  const anillo = (g, cx, cy, rx, ry, c1, c2) => { for (let y = cy - 12; y <= cy + 12; y++) for (let x = cx - 12; x <= cx + 12; x++) { const d = Math.hypot((x + .5 - cx) / rx, (y + .5 - cy) / ry); if (d >= .86 && d <= 1) g.set(x, y, (x < cx && y < cy) ? c2 : c1); } };
  ACC2.rubor = g => { [[11, 42], [45, 42]].forEach(([cx, cy]) => { for (let y = cy - 2; y <= cy + 2; y++) for (let x = cx - 4; x <= cx + 3; x++) { const d = ((x + .5 - cx) / 4) ** 2 + ((y + .5 - cy) / 2.3) ** 2; if (d <= 1 && (d < .55 || (x + y) % 2 === 0)) g.set(x, y, d < .55 ? '#ff8aa6' : '#ffb0c4'); } }); };
  ACC2.pecas = g => { [[9, 40], [12, 41], [10, 43], [14, 43], [47, 40], [44, 41], [46, 43], [42, 43]].forEach(([x, y]) => g.set(x, y, '#b88a6a')); };
  ACC2.bigote = g => { capa(g, '#14080a', L => { sombrear(L, union(elipse(22.5, 41, 5.5, 2.4), elipse(33.5, 41, 5.5, 2.4), elipse(28, 40.5, 3.2, 2.2)), 28, 41, 12, 3, ['#6a4a2c', '#3a2410', '#24160a', '#140c06']); [[17, 40], [16, 39], [39, 40], [40, 39]].forEach(([x, y]) => L.set(x, y, '#3a2410')); }); };
  ACC2.gafas_redondas = g => { [15, 41].forEach(cx => anillo(g, cx, 34, 10.5, 10.5, '#d8a020', '#fff6b0')); g.rect(24, 33, 8, 1, '#d8a020'); g.rect(3, 33, 4, 1, '#d8a020'); g.rect(49, 33, 4, 1, '#d8a020'); };
  ACC2.gafas_nerd = g => { [15, 41].forEach(cx => { for (let y = 27; y <= 41; y++) for (let x = cx - 10; x <= cx + 9; x++) { if ((y === 27 || y === 41) && (x === cx - 10 || x === cx + 9)) continue; if (x >= cx - 8 && x <= cx + 7 && y >= 29 && y <= 39) continue; g.set(x, y, (y === 27 || (x === cx - 10)) ? '#3a3a5a' : '#14142a'); } g.set(cx - 6, 30, '#ffffff'); g.set(cx - 5, 30, '#ffffff'); }); g.rect(24, 31, 8, 2, '#14142a'); g.rect(27, 31, 2, 2, '#f4eed8'); g.rect(3, 31, 5, 2, '#14142a'); g.rect(48, 31, 5, 2, '#14142a'); };
  ACC2.antifaz = g => { for (let y = 25; y <= 43; y++) for (let x = 3; x <= 52; x++) { const e1 = Math.hypot(x + .5 - 15, y + .5 - 34), e2 = Math.hypot(x + .5 - 41, y + .5 - 34); const d = Math.min(e1, e2); if (d < 9.2) continue; if ((y === 25 || y === 43) && (x < 6 || x > 49)) continue; g.set(x, y, d < 10.4 ? '#5a0a14' : y < 30 ? '#ff6a78' : y < 38 ? '#e8353f' : '#b02030'); } };
  ACC2.gafas_3d = g => { [[15, '#e8353f'], [41, '#2ac8e8']].forEach(([cx, c]) => { for (let y = 27; y <= 41; y++) for (let x = cx - 10; x <= cx + 9; x++) { if ((y === 27 || y === 41) && (x === cx - 10 || x === cx + 9)) continue; const borde = y === 27 || y === 41 || x === cx - 10 || x === cx + 9 || y === 28 || y === 40 || x === cx - 9 || x === cx + 8; if (borde) g.set(x, y, '#f4f4ff'); else if ((x + y) % 2 === 0) g.set(x, y, c); } }); g.rect(24, 31, 8, 2, '#f4f4ff'); g.rect(3, 31, 5, 2, '#f4f4ff'); g.rect(48, 31, 5, 2, '#f4f4ff'); };
  ACC2.bigotes_gato = g => { g.rect(27, 40, 3, 2, '#ff8aa6'); g.set(27, 40, '#ffd0dc'); [[9, 44, 0, 41], [9, 46, 0, 46], [9, 48, 1, 51]].forEach(([x0, y0, x1, y1]) => { linea(g, x0, y0, x1, y1, '#262244'); linea(g, SW - 1 - x0, y0, SW - 1 - x1, y1, '#262244'); }); };
  ACC2.parche = g => { capa(g, '#0a0a14', L => sombrear(L, elipse(41, 34, 9.2, 9.2), 41, 34, 9.2, 9.2, ['#5a5a7a', '#2a2a40', '#161626', '#0a0a14'])); linea(g, 4, 24, 32, 28, '#161626'); linea(g, 4, 25, 32, 29, '#161626'); linea(g, 50, 28, 53, 25, '#161626'); };
  ACC2.gafas_estrella = g => { [15, 41].forEach(cx => { const t = (dx, dy) => { const a = Math.abs(dx), b = Math.abs(dy); return a + b <= 12 && (Math.min(a, b) <= 3 || a + b <= 7); }; for (let dy = -12; dy <= 12; dy++) for (let dx = -12; dx <= 12; dx++) { if (!t(dx, dy)) continue; const borde = !t(dx - 1, dy) || !t(dx + 1, dy) || !t(dx, dy - 1) || !t(dx, dy + 1); const x = cx + dx, y = 34 + dy; if (borde) g.set(x, y, dx < 0 && dy < 0 ? '#fff6b0' : '#e8a820'); else if ((x + y) % 2 === 0) g.set(x, y, '#ffe45a'); } }); g.rect(24, 32, 8, 1, '#e8a820'); };
  ACC2.aviador = g => { [15, 41].forEach(cx => { for (let y = 27; y <= 44; y++) for (let x = cx - 10; x <= cx + 10; x++) { const d = Math.hypot((x + .5 - cx) / 10.4, (y + .5 - 34.5) / (y > 34 ? 9.8 : 8.2)); if (d > 1) continue; if (d >= .86) g.set(x, y, (x < cx && y < 34) ? '#fff6b0' : '#d8a020'); else if ((x + y) % 2 === 0) g.set(x, y, y < 34 ? '#58c878' : '#2a8a58'); } }); g.rect(24, 28, 8, 1, '#d8a020'); g.rect(26, 31, 4, 1, '#d8a020'); g.rect(3, 29, 4, 1, '#d8a020'); g.rect(49, 29, 4, 1, '#d8a020'); };
  ACC2.visor_neon = g => { for (let y = 29; y <= 39; y++) for (let x = 3; x <= 52; x++) { if ((y === 29 || y === 39) && (x < 6 || x > 49)) continue; const borde = y === 29 || y === 39 || x === 3 || x === 52; g.set(x, y, borde ? '#7af0ff' : y < 33 ? ((x + y) % 2 ? '#2a5a8a' : '#1a3a6a') : ((x + y) % 2 ? '#1a3a6a' : '#0e2248')); } for (let x = 6; x <= 49; x += 6) g.set(x, 32, '#ffffff'); g.rect(10, 31, 8, 1, '#7af0ff'); g.rect(38, 36, 8, 1, '#ff5ac8'); };
  ACC2.gafas_arcoiris = g => { const RC = ['#ff4a4a', '#ff9a30', '#ffe030', '#58d048', '#48a8f0', '#b060f0']; [15, 41].forEach(cx => { for (let y = 27; y <= 41; y++) for (let x = cx - 10; x <= cx + 9; x++) { if ((y === 27 || y === 41) && (x === cx - 10 || x === cx + 9)) continue; const borde = y === 27 || y === 41 || x === cx - 10 || x === cx + 9; if (borde) g.set(x, y, y < 33 ? '#fff6b0' : '#d8a020'); else if ((x + y) % 2 === 0) g.set(x, y, RC[Math.min(5, ((y - 28) / 2.3) | 0)]); } }); g.rect(24, 30, 8, 2, '#d8a020'); g.rect(3, 31, 5, 2, '#d8a020'); g.rect(48, 31, 5, 2, '#d8a020'); [[8, 28], [46, 29], [24, 27]].forEach(([x, y]) => { g.set(x, y, '#ffffff'); g.set(x, y - 1, '#ffffff'); }); };

  // ---------- CUELLO ----------
  const accMono = (g, rp, out) => capa(g, out, L => {
    const ala = (x, y) => (x >= 19 && x <= 25 && Math.abs(y - 53) <= (26 - x) * .55 + 1.4) || (x >= 30 && x <= 36 && Math.abs(y - 53) <= (x - 29) * .55 + 1.4);
    sombrear(L, ala, 28, 53, 10, 5, rp); L.rect(26, 51, 4, 5, rp[1]); L.rect(26, 51, 4, 1, rp[0]); L.rect(26, 55, 4, 1, rp[2]);
  });
  const accBuf = (g, colorFn, out) => capa(g, out, L => {
    for (let y = 48; y <= 56; y++) for (let x = 11; x <= 45; x++) { const dx = (x + .5 - 28) / 17, dy = (y + .5 - 52) / 4.6; if (dx * dx + dy * dy <= 1) L.set(x, y, colorFn(x, y, Math.floor((x + y) / 3) % 2)); }
    for (let y = 54; y <= 68; y++) for (let x = 37; x <= 42; x++) L.set(x, y, colorFn(x, y, Math.floor(y / 3) % 2));
    [37, 39, 41].forEach(x => { L.set(x, 69, colorFn(x, 69, 0)); L.set(x, 70, colorFn(x, 70, 0)); });
  });
  const accBand = (g, c1, c2, out) => capa(g, out, L => { for (let y = 48; y <= 61; y++) { const half = Math.round(12 * (1 - (y - 48) / 14)) + 1; for (let x = 28 - half; x <= 27 + half; x++) L.set(x, y, (x * 3 + y * 5) % 7 === 0 ? c2 : (y < 51 ? mixC(c1, .25) : c1)); } });
  const arcoCuello = (x, base, k) => base - Math.round(((x - 28) / 12) ** 2 * k);
  ACC2.mono_rosa = g => accMono(g, pal4('#ff7ab8'), '#4a1030');
  ACC2.mono_azul = g => accMono(g, R.azul, TINTA_AZUL);
  ACC2.pajarita = g => capa(g, '#0a0a14', L => { [[20, 26, -1], [30, 36, 1]].forEach(([a, b]) => { for (let x = a; x <= b; x++) { const h = 1 + Math.abs(x - (a + b) / 2 - ((a + b) / 2 > 28 ? -3 : 3)) * .0 + (x < 28 ? (26 - x) * .5 : (x - 29) * .5); for (let y = Math.round(53 - h); y <= Math.round(53 + h); y++) L.set(x, y, (x + y) % 5 === 0 ? '#ffffff' : '#262244'); } }); L.rect(26, 51, 4, 4, '#262244'); L.rect(27, 52, 1, 1, '#6a6a9a'); });
  ACC2.bufanda_verde = g => accBuf(g, (x, y, k) => k ? '#2f9a4a' : '#f4eed8', '#12432a');
  ACC2.bufanda_azul = g => accBuf(g, (x, y, k) => k ? '#4f49ea' : '#d0f0ff', TINTA_AZUL);
  ACC2.bufanda_rosa = g => accBuf(g, (x, y, k) => k ? '#ff7ab8' : '#fff0f6', '#4a1030');
  ACC2.bufanda_arcoiris = g => { const RC = ['#ff4a4a', '#ff9a30', '#ffe030', '#58d048', '#48a8f0', '#b060f0']; accBuf(g, (x, y) => RC[(Math.floor((x + y) / 2.5)) % 6], '#2a1a4a'); };
  ACC2.bandana_roja = g => accBand(g, '#d8333f', '#ffffff', '#4a0a14');
  ACC2.bandana_negra = g => { accBand(g, '#3a3a52', '#e8e8ff', '#0a0a14'); g.rect(26, 53, 4, 3, '#e8e8ff'); g.set(26, 54, '#262244'); g.set(29, 54, '#262244'); g.rect(27, 56, 2, 1, '#e8e8ff'); };
  ACC2.perlas = g => { for (let x = 16; x <= 40; x += 3) { const y = arcoCuello(x, 56, 6); g.rect(x, y, 2, 2, '#ffffff'); g.set(x + 1, y + 1, '#c8d0ea'); } g.rect(27, 58, 3, 3, '#ffffff'); g.set(28, 60, '#c8d0ea'); };
  ACC2.medalla = g => { for (let i = 0; i <= 10; i++) { const c = i % 4 < 2 ? '#e8353f' : '#4b6ae8'; g.set(21 + i, 50 + Math.round(i * .9), c); g.set(22 + i, 50 + Math.round(i * .9), c); g.set(35 - i, 50 + Math.round(i * .9), c); g.set(34 - i, 50 + Math.round(i * .9), c); } capa(g, '#6a4a08', L => sombrear(L, elipse(28, 63, 5, 5), 28, 63, 5, 5, R.dorado)); estr4(g, 28, 63, 3, '#fff6b0'); };
  ACC2.cadena = g => { for (let x = 16; x <= 40; x += 2) { const y = arcoCuello(x, 56, 6); g.rect(x, y, 2, 2, (x / 2) % 2 ? '#ffd84a' : '#d8a020'); g.set(x, y, '#fff6b0'); } capa(g, '#6a4a08', L => { L.rect(24, 60, 8, 7, '#ffd84a'); L.rect(25, 61, 6, 5, '#d8a020'); L.rect(26, 62, 4, 3, '#8a5a10'); L.set(24, 60, '#fff6b0'); }); g.set(28, 63, '#ffe45a'); };
  ACC2.lei = g => { const C = ['#ff4a6a', '#ffd84a', '#ff9a40', '#ff7ab8', '#ffffff']; for (let x = 15; x <= 41; x += 2) { const y = arcoCuello(x, 55, 6); g.rect(x, y + 1, 2, 2, '#2f9a4a'); } for (let i = 0, x = 15; x <= 41; x += 4, i++) { const y = arcoCuello(x, 55, 6), c = C[i % 5]; g.rect(x - 1, y, 3, 3, c); g.set(x, y + 1, '#ffd84a'); g.set(x - 1, y, mixC(c, .4)); } };
  ACC2.campana = g => { for (let x = 15; x <= 41; x++) { const y = arcoCuello(x, 53, 5); g.set(x, y, '#e8353f'); g.set(x, y + 1, '#b02030'); } capa(g, '#6a4a08', L => sombrear(L, elipse(28, 59, 3, 3), 28, 59, 3, 3, R.dorado)); g.rect(27, 60, 3, 1, '#6a4a08'); g.set(28, 62, '#6a4a08'); };
  ACC2.collar_diamante = g => { for (let x = 16; x <= 40; x += 2) { const y = arcoCuello(x, 56, 6); g.rect(x, y, 2, 1, (x / 2) % 2 ? '#e8f4ff' : '#aab4d0'); if (x % 8 === 0) { g.set(x, y + 1, '#7af0ff'); g.set(x + 1, y + 1, '#ffffff'); } } capa(g, '#1a5a8a', L => { for (let y = 58; y <= 67; y++) { const h = y <= 62 ? (y - 57) * 1.1 : (68 - y) * 1.1; for (let x = 28 - Math.round(h); x <= 27 + Math.round(h); x++) L.set(x, y, y < 61 ? (x < 28 ? '#ffffff' : '#bff6ff') : (x < 28 ? '#7af0ff' : '#2aa8d8')); } }); g.set(27, 59, '#ffffff'); g.set(26, 60, '#ffffff'); };

  // ---------- CABEZA (ranura de orejas) ----------
  const audi = (g, banda, copa, out, brillo) => {
    capa(g, '#150f20', L => { for (let y = 0; y <= 34; y++) for (let x = 0; x < SW; x++) { const d = ((x + .5 - 28) / 25) ** 2 + ((y + .5 - 32) / 20) ** 2; if (d > 1.0 && d <= 1.17) L.set(x, y, banda); } });
    [3.5, 52.5].forEach(cx => { capa(g, out, L => sombrear(L, elipse(cx, 37, 3.6, 8), cx, 37, 3.6, 8, copa)); if (brillo) { g.rect(Math.round(cx) - 1, 34, 2, 6, brillo); } });
  };
  const orejaTri = (g, pal, int, tope) => [11, 45].forEach(cx => capa(g, '#150f20', L => {
    sombrear(L, (x, y) => y >= 6 && y <= 18 && Math.abs(x + .5 - cx) <= (y - 5) * .55, cx, 14, 6, 8, pal);
    for (let y = 10; y <= 16; y++) for (let x = cx - 2; x <= cx + 2; x++) if (L.has(x, y) && Math.abs(x + .5 - cx) <= (y - 9) * .3) L.set(x, y, int);
    if (tope) for (let y = 6; y <= 8; y++) for (let x = cx - 3; x <= cx + 3; x++) if (L.has(x, y)) L.set(x, y, tope);
  }));
  const alitas = (g, pal, out, pico) => alasG(g, ALA_P, pal, out, pico ? '#d0a0ff' : '#9ea8cf');
  const cuernoG = (g, pal, out, alto, grosor) => [11, 45].forEach(cx => { const d = cx < 28 ? -1 : 1; capa(g, out, L => sombrear(L, (x, y) => { if (y < 17 - alto || y > 17) return false; const ccx = cx + d * (17 - y) * .3; return Math.abs(x + .5 - ccx) <= grosor * (y - (17 - alto) + 1) / (alto + 1); }, cx, 12, 5, alto / 2 + 1, pal)); });
  ACC2.lazo_cabeza = g => capa(g, '#4a1030', L => { [[41, 15], [50, 15]].forEach(([cx, cy]) => sombrear(L, elipse(cx, cy, 4, 3.4), cx, cy, 4, 3.4, pal4('#ff7ab8'))); L.rect(44, 13, 4, 5, '#d04888'); L.rect(44, 13, 4, 1, '#ffc0e0'); L.rect(42, 18, 2, 3, '#ff7ab8'); L.rect(49, 18, 2, 3, '#ff7ab8'); });
  ACC2.gorro_fiesta = g => capa(g, '#4a1030', L => { for (let y = 2; y <= 19; y++) { const cx = 10 - (19 - y) * .1, hw = Math.min(7, (y - 1) * .42); for (let x = Math.round(cx - hw); x <= Math.round(cx + hw); x++) L.set(x, y, ((x + y) >> 2) % 2 ? '#ffd84a' : (x < cx ? '#ff9ad0' : '#ff5ab0')); } circ(L, 9, 2, 2, '#ffffff'); });
  ACC2.flores = g => { const C = [['#ff7ab8', '#ffe0f0'], ['#ffffff', '#e0e0ff'], ['#b48cff', '#e8d8ff']]; [[6, 25], [8, 19], [12, 15], [50, 25], [48, 19], [43, 15]].forEach(([cx, cy], i) => { const [a, b] = C[i % 3]; g.rect(cx - 1, cy + 3, 3, 1, '#2f9a4a'); [[0, -2], [-2, 0], [2, 0], [0, 2]].forEach(([dx, dy]) => { g.rect(cx + dx - 1, cy + dy - 1, 2, 2, a); g.set(cx + dx - 1, cy + dy - 1, b); }); g.rect(cx - 1, cy - 1, 2, 2, '#ffd84a'); }); };
  ACC2.orejas_perro = g => [8, 48].forEach((cx, i) => capa(g, '#2a1408', L => { sombrear(L, elipse(cx, 24, 4.6, 10), cx, 22, 4.6, 10, pal4('#9a6a40')); for (let y = 20; y <= 30; y++) for (let x = cx - 1; x <= cx + 1; x++) if (L.has(x, y)) L.set(x, y, '#5a3a20'); }));
  ACC2.antenas = g => [[13, 15, 9, 3], [43, 15, 47, 3]].forEach(([x0, y0, x1, y1]) => { linea(g, x0, y0, x1, y1, '#262244'); linea(g, x0 + 1, y0, x1 + 1, y1, '#262244'); capa(g, '#12432a', L => sombrear(L, elipse(x1 + .5, y1, 3, 3), x1 + .5, y1, 3, 3, R.verde)); });
  ACC2.orejas_oso = g => [10, 46].forEach(cx => capa(g, '#3a1a08', L => { sombrear(L, elipse(cx, 16, 5.4, 5.4), cx, 16, 5.4, 5.4, pal4('#a0703c')); circ(L, cx, 17, 2.4, '#f0b090'); }));
  ACC2.cuernitos = g => cuernoG(g, R.rojo, '#4a0a14', 11, 5);
  ACC2.audifonos_rosa = g => audi(g, '#ff9ad0', pal4('#ff5ab0'), '#4a1030', null);
  ACC2.audifonos_gamer = g => audi(g, '#2a2a3a', pal4('#3a3a52'), '#0a0a14', '#7af0ff');
  ACC2.orejas_conejo = g => [12, 44].forEach(cx => capa(g, '#4a3a58', L => { sombrear(L, elipse(cx, 11, 3.6, 8.6), cx, 11, 3.6, 8.6, R.piel); sombrear(L, elipse(cx, 12, 1.7, 5.8), cx, 12, 1.7, 5.8, pal4('#ffa0b6')); }));
  ACC2.estrellas_flot = g => [[5, 8, 4], [51, 6, 4], [3, 20, 3], [53, 19, 3], [11, 3, 3]].forEach(([x, y, r]) => capa(g, '#a86a10', L => { estr4(L, x, y, r, '#ffe45a'); L.set(x, y, '#ffffff'); }));
  ACC2.orejas_zorro = g => orejaTri(g, pal4('#ff8a2a'), '#3a1a08', '#ffffff');
  ACC2.halo = g => { for (let y = 0; y <= 6; y++) for (let x = 10; x <= 46; x++) { const d = ((x + .5 - 28) / 16) ** 2 + ((y + .5 - 3) / 3.4) ** 2; if (d >= .3 && d <= 1) g.set(x, y, y < 2 ? '#ffffff' : y < 4 ? '#e8ecff' : '#aab4d0'); } };
  ACC2.halo_dorado = g => { for (let y = 0; y <= 6; y++) for (let x = 8; x <= 48; x++) { const d = ((x + .5 - 28) / 18) ** 2 + ((y + .5 - 3) / 3.4) ** 2; if (d >= .3 && d <= 1) g.set(x, y, y < 2 ? '#fff6b0' : y < 4 ? '#ffd84a' : '#d8a020'); } [[8, 3], [48, 3], [28, 0], [3, 8], [53, 8]].forEach(([x, y]) => { g.set(x, y, '#ffffff'); g.set(x - 1, y, '#ffe45a'); g.set(x + 1, y, '#ffe45a'); g.set(x, y - 1, '#ffe45a'); g.set(x, y + 1, '#ffe45a'); }); };
  ACC2.alitas_angel = g => alitas(g, R.piel, '#7a86b8', false);
  ACC2.alitas_demonio = g => alitas(g, pal4('#8a3ab8'), '#1a0a28', true);
  ACC2.cuernos_dragon = g => cuernoG(g, R.dorado, '#6a2a08', 16, 6);

  // ---------- ESPALDA ----------
  const accCapaX = (g, ra, oa, borde, ermi) => capa(g, oa, L => {
    sombrear(L, (x, y) => y >= 50 && y <= 76 && Math.abs(x + .5 - 28) <= 15 + (y - 50) * .85, 28, 64, 28, 14, ra);
    for (let x = 0; x < SW; x++) if (L.has(x, 75)) L.set(x, 75, borde);
    if (ermi) for (let y = 50; y <= 55; y++) for (let x = 0; x < SW; x++) if (L.has(x, y)) L.set(x, y, ((x * 5 + y * 3) % 9 === 0) ? '#262244' : '#f4f4ff');
  });
  const alasG = (g, P, pal, out, costilla, tipos) => [0, 1].forEach(s => {
    const pts = s ? espejoX(P) : P, T = polyT(pts), bx = s ? SW - P[0][0] : P[0][0], by = P[0][1];
    capa(g, out, L => {
      sombrear(L, T, s ? SW - 6 : 6, 24, 12, 24, pal);
      P.slice(2, P.length - 1).forEach(([x, y]) => linea(L, bx, by - 2, s ? SW - x : x, y + 2, costilla, T));
      if (tipos === 'mari') for (let i = 0; i < 6; i++) { const x = s ? SW - 3 : 3, y = 8 + i * 5; if (T(x, y)) { L.set(x, y, '#ffffff'); L.set(x + (s ? -1 : 1), y, '#ffffff'); } }
    });
  });
  const ALA_G = [[15, 42], [4, 41], [0, 33], [0, 22], [0, 11], [3, 3], [6, 2], [7, 11], [9, 20], [13, 29]];
  const ALA_P = [[11, 26], [6, 34], [1, 31], [0, 25], [1, 18], [5, 12], [8, 13], [10, 20]];
  ACC2.capa_verde = g => accCapaX(g, R.verde, '#12432a', '#ffd84a');
  ACC2.capa_rosa = g => accCapaX(g, pal4('#ff7ab8'), '#4a1030', '#ffffff');
  ACC2.capa_negra = g => accCapaX(g, pal4('#3a3548'), '#08060c', '#e8353f');
  ACC2.capa_morada = g => accCapaX(g, pal4('#9a5ae8'), '#2a0a5a', '#ffd84a');
  ACC2.capa_real = g => accCapaX(g, [R.rojo[0], '#b0182c', '#780c1c', '#480410'], '#2a0408', '#ffd84a', true);
  ACC2.alas_angel = g => alasG(g, ALA_G, R.piel, '#7a86b8', '#9ea8cf');
  ACC2.alas_murcielago = g => alasG(g, ALA_G, pal4('#6a3aa0'), '#150a28', '#b48cff');
  ACC2.alas_mariposa = g => alasG(g, ALA_G, pal4('#ff7ab8'), '#3a1040', '#6ac0f0', 'mari');
  ACC2.alas_dragon = g => alasG(g, ALA_G, R.rojo, '#2a0408', '#ffd84a');

  // ---------- auras (fr: 0-39, un ciclo completo y sin saltos) ----------
  ACC2.aura_chispa = (g, fr) => {   // nv15, la más sencilla: chispitas doradas que titilan y flotan
    const a = (fr || 0) / 40 * Math.PI * 2;
    [[7, 5], [48, 5], [6, 73], [49, 73]].forEach(([x, y], i) => {
      const t = a + i * 1.6, dy = Math.round(Math.sin(t) * 1.4), br = Math.sin(t * 2) > 0;
      chispa(g, x, y + dy, br ? '#ffd84a' : '#ffb020', br ? '#fff6b0' : '#ffe45a');
    });
  };
  ACC2.aura_viento = (g, fr) => {   // nv20: chispas celestes flotando en varios puntos
    const a = (fr || 0) / 40 * Math.PI * 2;
    [[7, 5], [48, 5], [6, 66], [49, 66]].forEach(([x, y], i) => { const t = a + i * 1.3, dy = Math.round(Math.sin(t) * 1.6), dx = Math.round(Math.cos(t * .7) * 1.2); chispa(g, x + dx, y + dy, '#5ad0e8', '#eafcff'); });
    [[11, 3], [44, 3], [3, 68], [52, 68]].forEach(([x, y], i) => { const t = a + i * 2.1 + 3, dy = Math.round(Math.sin(t) * 1.8); chispa(g, x, y + dy, '#2a9ab8', '#aef0ff'); });
  };
  ACC2.aura_estelar = (g, fr) => {   // nv30: estrellas que titilan de tamaño + chispas moradas flotando
    const a = (fr || 0) / 40 * Math.PI * 2;
    [[7, 5], [48, 5], [6, 66], [49, 66]].forEach(([x, y], i) => { const t = a + i * 1.9, r = 3 + Math.round(Math.sin(t * 2)); estrella4(g, x, y, Math.max(2, r), '#ffd84a', '#ffa820'); });
    [[12, 2], [43, 2], [2, 69], [53, 69]].forEach(([x, y], i) => { const t = a + i * 1.4 + 2, dy = Math.round(Math.sin(t) * 1.5); chispa(g, x, y + dy, '#c898f0', '#f0e0ff'); });
  };
  ACC2.aura_mistica = (g, fr) => {   // premium: arcoiris girando y flotando, la más viva de todas
    const a = (fr || 0) / 40 * Math.PI * 2, RC = ['#ff6a78', '#ffb04a', '#ffe45a', '#6ae87a', '#5ad0e8', '#b088ff'], ci = Math.floor((fr || 0) / 7);
    [[7, 5], [48, 5], [6, 66], [49, 66]].forEach(([x, y], i) => { const t = a + i * 1.1, dx = Math.round(Math.cos(t) * 1.3), dy = Math.round(Math.sin(t) * 1.6), r = 4 + Math.round(Math.sin(t * 2)); estrella4(g, x + dx, y + dy, Math.max(3, r), RC[(i + ci) % 6], '#ffffff'); });
    [[12, 2], [43, 2], [2, 69], [53, 69]].forEach(([x, y], i) => { const t = a + i * 1.6 + 2, dy = Math.round(Math.sin(t) * 1.4); estrella4(g, x, y + dy, 2, RC[(i + 3 + ci) % 6], '#ffffff'); });
    [[2, 15], [53, 15]].forEach(([x, y], i) => { const t = a + i * 2 + 4, dy = Math.round(Math.sin(t) * 1.3); chispa(g, x, y + dy, RC[(i + 2 + ci) % 6], '#ffffff'); });
  };
  ACC2.aura_cortex = (g, fr) => {   // la vende Cortex: partículas de luz orbitando a Simon con halo pulsante
    const f = fr || 0, a = f / 40 * Math.PI * 2;
    // halo izquierdo y derecho que respira
    const hb = .55 + Math.sin(a * 2) * .45;
    const HCOLS = ['#b0e8ff', '#d0f4ff', '#e8fcff'];
    const hpts = [[3, 20], [3, 40], [52, 20], [52, 40], [14, 8], [41, 8], [14, 60], [41, 60]];
    hpts.forEach(([x, y], i) => { if (Math.sin(a + i * .9) > 1 - hb) { g.set(x, y, HCOLS[i % 3]); } });
    // 5 partículas orbitando en elipse alrededor de Simon
    const PCOLS = ['#ffffff', '#b0e8ff', '#ffd0f8', '#d0ffee', '#ffe8b0'];
    for (let i = 0; i < 5; i++) {
      const t = a + i * (Math.PI * 2 / 5), wobble = Math.sin(t * 3) * 1.5;
      const px = Math.round(28 + Math.cos(t) * (22 + wobble)), py = Math.round(34 + Math.sin(t) * (30 + wobble));
      const col = PCOLS[i], pulse = Math.sin(a * 2 + i) > 0;
      g.set(px, py, col);
      if (pulse) { g.set(px - 1, py, col); g.set(px + 1, py, col); g.set(px, py - 1, col); }
    }
    // 3 chispitas extra que flotan arriba y abajo de Simon
    [[28, 2], [10, 14], [45, 14], [10, 54], [45, 54], [28, 68]].forEach(([x, y], i) => {
      const t = a + i * 1.1, dy = Math.round(Math.sin(t * 1.7) * 2);
      if (Math.sin(t * 2.3) > .2) chispa(g, x, y + dy, '#c8f0ff', '#ffffff');
    });
  };
  ACC2.aura_trueno = (g, fr) => {   // easter egg de la tormenta: rayitos que salen y desaparecen alrededor de Simon
    const f = fr || 0;
    [[6, 4], [49, 4], [5, 66], [50, 66], [27, 1], [27, 70]].forEach(([x, y], i) => {
      const ph = (f + i * 7) % 40;
      if (ph < 12) g.paste(FX.rayo(), x - 2, y - 4);
    });
  };
  ACC2.aura_eterna = (g, fr) => {   // la más legendaria: la da la Semilla Eterna — estrellitas doradas orbitando en calma
    const a = (fr || 0) / 40 * Math.PI * 2;
    [[7, 5], [48, 5], [6, 66], [49, 66]].forEach(([x, y], i) => { const t = a + i * 1.6, dx = Math.round(Math.cos(t) * 1.4), dy = Math.round(Math.sin(t) * 1.4), r = 3 + Math.round(Math.sin(t * 2)); estrella4(g, x + dx, y + dy, Math.max(2, r), '#ffd84a', '#fff6d0'); });
    [[12, 2], [43, 2]].forEach(([x, y], i) => { const t = a + i * 2 + 1, dy = Math.round(Math.sin(t) * 1.3); chispa(g, x, y + dy, '#ffe68a', '#ffffff'); });
  };
  // el aura legendaria se dibuja en su propio lienzo, más grande que el cuerpo (56x78), para que las llamas
  // y el anillo de poder salgan de verdad del contorno de Simon en vez de recortarse contra su sprite
  const AURA_W = 96, AURA_H = 116, AURA_OX = 20, AURA_OY = 18;
  function auraLegendGrid(fr) {   // easter egg de la luna azul: corona de energía envolvente + anillo de poder en el piso
    const g = Grid(AURA_W, AURA_H);
    const ph = (fr || 0) / 40 * Math.PI * 2;
    const cx = AURA_OX + 28, cy = AURA_OY + 39, rx = 33, ry = 46, N = 18;
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2;
      const dx = Math.cos(a), dy = Math.sin(a) * 1.05, px = -dy, py = dx;
      const wob = Math.sin(ph * 2.2 + a * 5) * 2.2;
      const len = 8 + Math.sin(ph * 1.5 + a * 3) * 3 + (i % 3 === 0 ? 3 : 0);
      const bx = cx + dx * rx, by = cy + dy * ry;
      for (let s = 0; s < len; s++) {
        const t = s / len;
        const ox = Math.round(bx + dx * s + px * wob * t), oy = Math.round(by + dy * s + py * wob * t);
        g.set(ox, oy, s < 2 ? '#ffffff' : s < 5 ? '#bfe8ff' : s < 8 ? '#4fa8ff' : '#1a5ad0');
        if (t > .3) g.set(ox + (px > 0 ? 1 : -1), oy, s < 4 ? '#bfe8ff' : '#2a68d0');
      }
    }
    for (let i = 0; i < 6; i++) { const a = ph * 1.2 + i * (Math.PI * 2 / 6); chispa(g, Math.round(cx + Math.cos(a) * (rx + 16)), Math.round(cy + Math.sin(a) * (ry + 12) * .95), '#bfe8ff', '#ffffff'); }
    const pulso = .5 + Math.sin(ph * 2) * .5, ery = 7 + pulso * 3;   // anillo de poder en el piso, pulsando
    for (let y = -ery; y <= ery; y++) for (let x = -34; x <= 34; x++) {
      const d = (x * x) / (34 * 34) + (y * y) / (ery * ery);
      if (d <= 1 && d > .55) g.set(Math.round(cx + x), Math.round(AURA_OY + 82 + y), d > .85 ? '#1a5ad0' : '#4fa8ff');
    }
    return g;
  }

  // ---------- catálogo ----------
  const CR = { cara: [4, 22, 48, 24], cuello: [8, 42, 44, 36], orejas: [0, 0, 56, 42], espalda: [0, 40, 56, 38], aura: [0, 0, 56, 78] };
  [['cara', [['rubor', 'RUBOR', 20, 1], ['pecas', 'PECAS', 25, 2], ['gafas_redondas', 'LENTES REDONDOS', 55, 2], ['bigote', 'BIGOTE', 40, 3], ['gafas_nerd', 'GAFAS DE NERD', 60, 3], ['antifaz', 'ANTIFAZ', 70, 3], ['gafas_3d', 'GAFAS 3D', 65, 4], ['bigotes_gato', 'BIGOTES DE GATO', 45, 4], ['parche', 'PARCHE PIRATA', 70, 5], ['gafas_estrella', 'GAFAS DE ESTRELLA', 90, 6], ['aviador', 'AVIADORES', 150, 7], ['visor_neon', 'VISOR NEON', 220, 9]]],
   ['cuello', [['campana', 'CASCABEL', 45, 2], ['mono_rosa', 'MOÑO ROSA', 30, 2], ['mono_azul', 'MOÑO AZUL', 30, 3], ['pajarita', 'PAJARITA', 45, 3], ['bufanda_verde', 'BUFANDA VERDE', 65, 3], ['bufanda_azul', 'BUFANDA AZUL', 65, 4], ['bandana_roja', 'BANDANA ROJA', 50, 4], ['lei', 'COLLAR DE FLORES', 80, 4], ['bufanda_rosa', 'BUFANDA ROSA', 70, 5], ['perlas', 'PERLAS', 110, 5], ['medalla', 'MEDALLA', 130, 6], ['bandana_negra', 'BANDANA NEGRA', 55, 6], ['cadena', 'CADENA DE ORO', 200, 8]]],
   ['orejas', [['lazo_cabeza', 'LAZO', 40, 2], ['gorro_fiesta', 'GORRO DE FIESTA', 50, 3], ['flores', 'DIADEMA DE FLORES', 70, 3], ['orejas_perro', 'OREJAS DE PERRO', 80, 3], ['antenas', 'ANTENAS ALIEN', 80, 4], ['orejas_oso', 'OREJAS DE OSO', 80, 4], ['cuernitos', 'CUERNITOS', 90, 5], ['audifonos_rosa', 'AUDIFONOS ROSA', 110, 5], ['orejas_conejo', 'OREJAS DE CONEJO', 120, 6], ['estrellas_flot', 'ESTRELLAS', 130, 7], ['orejas_zorro', 'OREJAS DE ZORRO', 130, 7], ['halo', 'HALO', 160, 8], ['audifonos_gamer', 'AUDIFONOS GAMER', 180, 8], ['alitas_angel', 'ALITAS DE ANGEL', 200, 9], ['alitas_demonio', 'ALITAS DE DEMONIO', 200, 9]]],
   ['espalda', [['capa_rosa', 'CAPA ROSA', 130, 5], ['capa_verde', 'CAPA VERDE', 130, 6], ['capa_negra', 'CAPA NEGRA', 160, 7], ['capa_morada', 'CAPA MORADA', 160, 8], ['alas_angel', 'ALAS DE ANGEL', 250, 10], ['alas_murcielago', 'ALAS DE MURCIELAGO', 250, 10], ['alas_mariposa', 'ALAS DE MARIPOSA', 300, 12]]],
   ['aura', [['aura_chispa', 'AURA CHISPA', 1000, 15], ['aura_viento', 'AURA DE VIENTO', 1500, 20], ['aura_estelar', 'AURA ESTELAR', 2500, 30]]]
  ].forEach(([slot, ls]) => ls.forEach(([k, n, p, nv]) => { ITEMS[k] = { tipo: 'ropa', slot, n, p, nv, crop: k.startsWith('alas_') ? [0, 0, 56, 48] : CR[slot] }; }));
  // PREMIUM: no se compran con monedas; se consiguen con logros, colecciones completas o con Cortex comerciante
  [['gafas_arcoiris', 'cara', 'GAFAS ARCOIRIS', 'ALBUM COMPLETO'], ['bufanda_arcoiris', 'cuello', 'BUFANDA ARCOIRIS', '50 MISIONES'], ['collar_diamante', 'cuello', 'COLLAR DIAMANTE', 'TODOS SUS SECRETOS'],
   ['halo_dorado', 'orejas', 'HALO DORADO', 'SET ANGEL'], ['cuernos_dragon', 'orejas', 'CUERNOS DE DRAGON', 'SET DRAGON'], ['capa_real', 'espalda', 'CAPA REAL', 'CARIÑO NV50'], ['alas_dragon', 'espalda', 'ALAS DE DRAGON', '30 REGALOS DIARIOS'],
   ['aura_mistica', 'aura', 'AURA MISTICA', 'CARIÑO NV50']
  ].forEach(([k, slot, n, prem]) => { ITEMS[k] = { tipo: 'ropa', slot, n, p: 0, nv: 1, crop: k.startsWith('alas_') ? [0, 0, 56, 48] : CR[slot], regalo: 'logro', prem }; });
  Object.assign(ITEMS.sud_galaxia, { regalo: 'logro', prem: 'CARIÑO NV20' }); Object.assign(ITEMS.sud_realeza, { regalo: 'logro', prem: 'SET REALEZA' });
  Object.assign(ITEMS.sud_holo, { mercader: true, prem: 'SOLO CORTEX' });
  MERC_POOL.push('sud_holo');
  ITEMS.aura_cortex = { tipo: 'ropa', slot: 'aura', n: 'AURA TENUE', p: 333, nv: 1, crop: CR.aura, mercader: true, prem: 'SOLO CORTEX' };
  MERC_POOL.push('aura_cortex');
  // SEMILLA ETERNA: solo la trae Cortex Mercader, muy rara (5% de probabilidad por día) y carísima; una vez comprada, nunca más vuelve a aparecer en su bolsa
  ITEMS.semilla_eterna = { tipo: 'cuarto', n: 'SEMILLA ETERNA', p: 2500, nv: 1, grid: semillaEternaGrid, mercader: true, raro5: true, semillaMerc: 'eterna', prem: 'SOLO CORTEX · MUY RARA' };
  MERC_POOL.push('semilla_eterna');
  const PREM_SETS = [
    { id: 'realeza', n: 'REALEZA', items: ['sud_dorada', 'monodorado', 'bufanda_dorada', 'monoculo', 'collar'], premio: 'sud_realeza' },
    { id: 'angel', n: 'ANGEL', items: ['sud_blanca', 'alitas_angel', 'halo', 'alas_angel'], premio: 'halo_dorado' },
    { id: 'dragon', n: 'DRAGON', items: ['sud_roja', 'cuernitos', 'alas_murcielago', 'capa_negra'], premio: 'cuernos_dragon' }
  ];
  const ROPA_SLOTS = [['todo', 'TODO'], ['sudadera', 'SUDADERAS'], ['cara', 'CARA'], ['cuello', 'CUELLO'], ['orejas', 'CABEZA'], ['espalda', 'ESPALDA'], ['aura', 'AURA'], ['mascota', 'MASCOTAS'], ['prem', 'PREMIUM']];
  // mascotas: se gestionan por separado (e.pets[]), no por slot de ropa, pero se listan como ropa para el UI
  ITEMS.pet_sif = { tipo: 'ropa', slot: 'mascota', n: 'SIF', p: 0, nv: 1, crop: [0, 0, 30, 26], mascota: true, secreto: true };
  ITEMS.ojo_pet = { tipo: 'ropa', slot: 'mascota', n: 'OJO DE CTHULHU', p: 0, nv: 1, crop: [0, 0, 28, 28], mascota: true, secreto: true };
  ORDEN.ropa.push(...Object.keys(ITEMS).filter(k => ITEMS[k].tipo === 'ropa' && !ITEMS[k].secreto && !ITEMS[k].mascota && !ORDEN.ropa.includes(k)));
