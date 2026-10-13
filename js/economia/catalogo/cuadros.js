  /* ===================== CUADROS: OBRAS Y FOTOS ===================== */
  const ORO = ['#6e4422', '#e8c04a', '#fff0a0', '#b08a20'], MFOTO = ['#2a2a3a', '#f0eee6', '#ffffff', '#b8b4a8']; // (ALBUM_MAX definido en config.js)
  const disco = (g, cx, cy, r, c) => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * .4) g.set(cx + x, cy + y, c); };
  function arteCorona() { const g = Grid(28, 20); g.rect(0, 0, 28, 20, '#f4eed8'); g.paste(coronaGrid(), 3, 4); return g; }
  function arteKeke() { const g = Grid(28, 20); g.rect(0, 0, 28, 20, '#ffe6b8'); g.rect(0, 16, 28, 4, '#e8b078'); g.rect(0, 16, 28, 1, '#c88a40'); g.paste(pizzaGrid(), 7, 2); [[3, 3], [23, 5], [5, 11], [24, 12]].forEach(([x, y]) => { g.set(x, y, '#ffffff'); g.set(x - 1, y, '#ffd84a'); g.set(x + 1, y, '#ffd84a'); g.set(x, y - 1, '#ffd84a'); g.set(x, y + 1, '#ffd84a'); }); return g; }
  function arteCortex() {
    const g = Grid(28, 20); g.rect(0, 0, 28, 20, '#5a1a2a'); for (let y = 0; y < 20; y += 4) g.rect(0, y, 28, 1, '#6a2234');
    const cx = 14, cy = 11.5;
    for (let y = 3; y < 20; y++) for (let x = 4; x < 25; x++) {
      const dx = (x + .5 - cx) / 8.6, dy = (y + .5 - cy) / 8; if (dx * dx + dy * dy > 1) continue;
      g.set(x, y, dx > .55 || dy > .65 ? '#b8c0e8' : '#f0f2fb');
      const h = (x + .5 - cx) / 9.4, v = (y + .5 - cy) / 8.8;
      if (h * h + v * v <= 1 && (y <= 8 || (y <= 11 && (x < 8 || x > 20)))) g.set(x, y, '#0c0a12');
    }
    [[11, 5], [12, 6], [19, 5], [8, 7], [20, 8]].forEach(([x, y]) => g.set(x, y, '#e03040'));
    [10, 17].forEach(x => { g.rect(x, 10, 3, 4, '#d02030'); g.rect(x + 1, 11, 1, 3, '#1a0a10'); g.set(x, 10, '#ffffff'); });
    g.rect(7, 14, 2, 1, '#ffa0b6'); g.rect(20, 14, 2, 1, '#ffa0b6'); g.rect(12, 15, 5, 1, '#4a1020'); g.rect(13, 16, 3, 1, '#4a1020');
    g.rect(9, 2, 10, 1, '#e03040'); g.rect(9, 1, 10, 1, '#2a2636'); [9, 13, 18].forEach(x => { g.set(x, 0, '#2a2636'); });
    return g;
  }
  function arteBoom() {
    const g = Grid(28, 20); g.rect(0, 0, 28, 20, '#2a2636');
    for (let a = 0; a < 10; a++) for (let t = 0; t < 10; t++) g.set(Math.round(14 + Math.cos(a * .628) * t * 1.3), Math.round(10 + Math.sin(a * .628) * t * .95), t > 6 ? '#ff6a28' : '#ffa030');
    disco(g, 14, 10, 6, '#ff6a28'); disco(g, 14, 10, 4, '#ffd84a'); disco(g, 14, 10, 2, '#ffffff');
    [[2, 2], [25, 3], [3, 17], [24, 17], [8, 1], [20, 18]].forEach(([x, y]) => g.rect(x, y, 2, 1, '#6a6676'));
    return g;
  }
  function arteEstrellas() {
    const g = Grid(28, 20), B = ['#0e0e3a', '#161a52', '#232b63', '#2e3a7a'];
    for (let y = 0; y < 20; y++) g.rect(0, y, 28, 1, B[Math.min(3, Math.floor(y / 5))]);
    [[3, 3], [8, 7], [12, 2], [6, 14], [14, 11], [18, 15], [24, 11], [2, 9], [10, 17], [22, 17], [16, 6]].forEach(([x, y], i) => { g.set(x, y, '#ffffff'); if (i % 3 === 0) { g.set(x - 1, y, '#aab4ff'); g.set(x + 1, y, '#aab4ff'); g.set(x, y - 1, '#aab4ff'); g.set(x, y + 1, '#aab4ff'); } });
    disco(g, 21, 6, 4, '#fff2b0'); disco(g, 23, 5, 3, '#161a52');
    for (let t = 0; t < 7; t++) g.set(7 + t, 3 + Math.floor(t * .6), t > 4 ? '#ffd84a' : '#fff6c0');
    return g;
  }
  function arteFotoVacia() { const g = Grid(28, 20); g.rect(0, 0, 28, 20, '#8a90b8'); g.rect(8, 7, 12, 9, '#232b63'); g.rect(11, 5, 6, 2, '#232b63'); g.rect(12, 9, 4, 4, '#ffffff'); g.rect(13, 10, 2, 2, '#232b63'); g.set(18, 9, '#ffd84a'); return g; }
  function fotoGrid(id) {
    const f = e.album.find(a => a.id === id); if (!f) return arteFotoVacia();
    const pal = f.p.match(/.{3}/g).map(h => '#' + [...h].map(c => c + c).join('')), g = Grid(28, 20);
    for (let i = 0; i < 560; i++) { const c = pal[parseInt(f.i[i], 16)]; if (c) g.set(i % 28, Math.floor(i / 28), c); }
    return g;
  }
  const fotoActual = () => e.album.find(a => a.id === e.cuadroFoto) || e.album[0] || null;
  function arteDe(k) { if (k === 'marco_foto') { const f = fotoActual(); return f ? fotoGrid(f.id) : arteFotoVacia(); } return (ITEMS[k] || ITEMS.marco_corona).arte(); }
  const cuadroArte = () => arteDe(e.cuarto.cuadro);
  const cuadroMc = () => e.cuarto.cuadro === 'marco_foto' ? MFOTO : (ITEMS[e.cuarto.cuadro] || ITEMS.marco_corona).mc;
  function marcoGrid(k) { const g = Grid(38, 30); marcoDib(g, 0, 0, arteDe(k), k === 'marco_foto' ? MFOTO : ITEMS[k].mc); return g; }
  // foto -> pixel art de 28x20 con paleta de hasta 16 colores, se cuelga sola en el cuadro
  function pixelarFoto() {
    try {
      const w = LW, h = Math.round(LW * 20 / 28), sy = Math.max(0, Math.min(LH - h, SY - 4));
      const t = document.createElement('canvas'); t.width = 28; t.height = 20; const x = t.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(cv, 0, sy, w, h, 0, 0, 28, 20);
      const d = x.getImageData(0, 0, 28, 20).data, cuenta = {}, cols = [];
      for (let i = 0; i < 560; i++) { const k = ((d[i * 4] >> 4) << 8) | ((d[i * 4 + 1] >> 4) << 4) | (d[i * 4 + 2] >> 4); cols.push(k); cuenta[k] = (cuenta[k] || 0) + 1; }
      const dist = (a, b) => { const r = (a >> 8) - (b >> 8), g = ((a >> 4) & 15) - ((b >> 4) & 15), bl = (a & 15) - (b & 15); return r * r + g * g + bl * bl; };
      const orden = Object.keys(cuenta).map(Number).sort((a, b) => cuenta[b] - cuenta[a]), pal = [];
      for (const c of orden) { if (pal.length >= 16) break; if (pal.every(p => dist(c, p) >= 10)) pal.push(c); }
      for (const c of orden) { if (pal.length >= 16) break; if (!pal.includes(c)) pal.push(c); }
      let idx = ''; cols.forEach(k => { let m = 0, bd = 1e9; pal.forEach((p, j) => { const q = dist(k, p); if (q < bd) { bd = q; m = j; } }); idx += m.toString(16); });
      const f = { id: Date.now().toString(36), f: hoy(), p: pal.map(k => k.toString(16).padStart(3, '0')).join(''), i: idx };
      e.album.unshift(f);
      while (e.album.length > ALBUM_MAX) { let j = e.album.length - 1; while (j > 0 && e.album[j].id === e.cuadroFoto) j--; e.album.splice(j, 1); }
      e.cuadroFoto = f.id; e.cuarto.cuadro = 'marco_foto';
      toast('Foto colgada en tu cuadro');
    } catch (_) {}
  }
  function renderCuadro() {
    $('m-titulo').textContent = 'TU CUADRO';
    const act = e.cuarto.cuadro, obras = Object.keys(ITEMS).filter(k => ITEMS[k].slot === 'cuadro' && e.tiene[k]);
    const fecha = f => f.split('-').slice(1).reverse().join('/');
    let h = `<div class="centro" style="font-size:8px;color:#ffd84a;margin-bottom:8px">MIS FOTOS ${e.album.length}/${ALBUM_MAX}</div>`;
    if (!e.album.length) h += `<div class="centro" style="font-size:7px;line-height:1.9;color:#aab4ff">Tus fotos quedan aquí. La última se cuelga sola.</div>`;
    else h += `<div class="galeria rej">` + e.album.map(f => `<button class="foto ${act === 'marco_foto' && fotoActual() && fotoActual().id === f.id ? 'on' : ''}" data-a="q_foto" data-k="${f.id}"><canvas data-prev="fo_${f.id}"></canvas><span>${fecha(f.f)}</span></button>`).join('') + `</div>`;
    h += `<div class="centro" style="font-size:8px;color:#ffd84a;margin:14px 0 8px">MIS OBRAS ${obras.length}</div><div class="galeria rej">` +
      obras.map(k => `<button class="foto ${act === k ? 'on' : ''}" data-a="q_obra" data-k="${k}"><canvas data-prev="${k}"></canvas><span>${ITEMS[k].n.replace('OBRA: ', '')}</span></button>`).join('') + `</div>` +
      `<div class="centro" style="font-size:7px;line-height:1.9;color:#aab4ff;margin-top:12px">Más obras: tienda, logros y códigos.</div><button class="bgrande" data-a="cerrar">OK</button>`;
    return h;
  }
  function qClick(a, k) {
    if (a === 'q_foto') { if (!e.album.some(f => f.id === k)) return; e.cuadroFoto = k; e.cuarto.cuadro = 'marco_foto'; }
    else if (a === 'q_obra') { if (!e.tiene[k] || !ITEMS[k] || ITEMS[k].slot !== 'cuadro') return; e.cuarto.cuadro = k; }
    sfx.click(); pintar(); guardar(); render();
  }
  Object.assign(ITEMS, {
    marco_corona:   { tipo: 'cuarto', slot: 'cuadro', n: 'OBRA: CORONA',    p: 0,   nv: 1, grid: () => marcoGrid('marco_corona'),   arte: arteCorona,   mc: ORO },
    marco_keke:     { tipo: 'cuarto', slot: 'cuadro', n: 'OBRA: KEKE',      p: 60,  nv: 1, grid: () => marcoGrid('marco_keke'),     arte: arteKeke,     mc: ['#4a2a10', '#a86a30', '#d8a060', '#6a3a14'] },
    marco_cortex:   { tipo: 'cuarto', slot: 'cuadro', n: 'OBRA: CORTEX',    p: 120, nv: 3, grid: () => marcoGrid('marco_cortex'),   arte: arteCortex,   mc: ['#08060c', '#3a3548', '#6a647c', '#150f20'] },
    marco_planeta:  { tipo: 'cuarto', slot: 'cuadro', n: 'OBRA: SU PLANETA', p: 150, nv: 1, grid: () => marcoGrid('marco_planeta'), arte: artePlaneta,  mc: ['#3a3a5a', '#c8c8e0', '#f0f0ff', '#8a8aa8'], mercader: true },
    marco_boom:     { tipo: 'cuarto', slot: 'cuadro', n: 'OBRA: BOOM',      p: 0,   nv: 1, grid: () => marcoGrid('marco_boom'),     arte: arteBoom,     mc: ['#4a0a14', '#d02838', '#ff6a78', '#8a1424'], regalo: 'logro' },
    marco_estrellas: { tipo: 'cuarto', slot: 'cuadro', n: 'OBRA: ESTRELLAS', p: 0,  nv: 1, grid: () => marcoGrid('marco_estrellas'), arte: arteEstrellas, mc: ['#0e0e3a', '#3a47a8', '#7a88e8', '#232b63'], codigo: true }
  });
  function artePlaneta() {
    const g = Grid(28, 20), C = ['#2a1a5a', '#4a2a7a', '#8a3a98', '#c05ab8'];
    for (let y = 0; y < 14; y++) g.rect(0, y, 28, 1, C[Math.min(3, Math.floor(y / 3.6))]);
    disco(g, 20, 5, 3, '#f0e8ff'); disco(g, 8, 8, 2, '#ffd0f0'); g.set(19, 4, '#ffffff');
    [[3, 2], [13, 3], [25, 9], [16, 9], [1, 6]].forEach(([x, y]) => g.set(x, y, '#ffffff'));
    [[4, 5, '#ffd84a'], [11, 6, '#4ac8ff'], [15, 4, '#ff6a8a'], [23, 8, '#ffd84a'], [6, 10, '#ff6a8a'], [18, 11, '#4ac8ff'], [26, 3, '#ff6a8a'], [10, 11, '#ffd84a']].forEach(([x, y, c]) => g.set(x, y, c));
    for (let x = 0; x < 28; x++) { const h = 14 + Math.round(Math.sin(x / 4) * 1.4); g.rect(x, h, 1, 20 - h, '#2f9a8a'); g.rect(x, h + 3, 1, 20, '#1e6a62'); }
    [[5, 11], [6, 9], [7, 11]].forEach(([x, y]) => g.rect(x, y, 1, 14 - y, '#8affd8'));
    return g;
  }
