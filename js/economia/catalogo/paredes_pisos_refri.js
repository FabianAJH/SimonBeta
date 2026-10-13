  /* ===================== ESTILOS DE PARED, PISO Y REFRI ===================== */
  function mixC(c, k) { const n = parseInt(c.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))); return '#' + ((1 << 24) | (f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).slice(1); }
  var PAT_P = {   // pared: (x, y, colores) -> color
    liso: (x, y, c) => c[0],
    rayas: (x, y, c) => (x % 12 < 6 ? c[0] : c[1]),
    puntos: (x, y, c) => ((x % 10) < 2 && (y % 10) < 2) ? c[2] : (x % 20 < 10 ? c[0] : c[1]),
    estrellas: (x, y, c) => { const h = (x * 7 + y * 13) % 97; return h === 3 ? c[2] : (h === 41 && x % 2 === 0) ? mixC(c[2], -.45) : (x % 12 < 6 ? c[0] : c[1]); },
    madera: (x, y, c) => (x % 6 === 0 ? mixC(c[1], -.35) : (((y / 10) | 0) + ((x / 6) | 0)) % 3 ? c[0] : c[1]),
    ladrillo: (x, y, c) => { const r = (y / 4) | 0; if (y % 4 === 0 || (x + (r % 2) * 5) % 10 === 0) return c[2]; return (x * 3 + y * 5) % 11 === 0 ? c[1] : c[0]; },
    azulejo: (x, y, c) => (x % 8 === 0 || y % 8 === 0) ? c[2] : (x % 8 === 1 && y % 8 === 1) ? mixC(c[0], .5) : c[0],
    hojas: (x, y, c) => { const cx = x % 10, cy = y % 10; return (Math.abs(cx - 4) + Math.abs(cy - 4) <= 1) ? c[2] : (x % 20 < 10 ? c[0] : c[1]); }
  };
  var PAT_F = {   // piso: (x, y desde el piso, colores) -> color
    tablones: (x, y, c) => { const f = (y / 8) | 0; if (y % 8 === 0 || (x + (f * 13 + 7) % 26) % 26 === 0) return c[2]; return f % 2 ? c[1] : c[0]; },
    parquet: (x, y, c) => { if (x % 11 === 0 || y % 11 === 0) return c[2]; return (((x / 11) | 0) + ((y / 11) | 0)) % 2 ? c[1] : c[0]; },
    mosaico: (x, y, c) => { if (x % 10 === 0 || y % 10 === 0) return c[2]; return (((x / 10) | 0) + ((y / 10) | 0)) % 2 ? c[1] : c[0]; },
    losa: (x, y, c) => { const r = (y / 16) | 0; if (y % 16 === 0 || (x + (r % 2) * 8) % 16 === 0) return c[2]; return (x * 5 + y * 3) % 17 === 0 ? c[1] : c[0]; }
  };
  var EST_DEF = [   // [clave, nombre, precio, nv, habitación, 'pared'|'piso', patrón, colores, franja baja]
    ['p_estrellas', 'CIELO ESTRELLADO', 80, 3, 'sala', 'pared', 'estrellas', ['#222a68', '#283276', '#fff0a0'], ['#181e54', '#1e2662']],
    ['p_ladrillo', 'LADRILLO ROJO', 120, 5, 'sala', 'pared', 'ladrillo', ['#b0583c', '#9c4a32', '#d8c8b0'], ['#7a3a28', '#6a2e20', '#b8a890']],
    ['p_cabana', 'CABAÑA CÁLIDA', 150, 6, 'sala', 'pared', 'madera', ['#b8804e', '#ac764a'], ['#80522e', '#744a28']],
    ['p_bosque', 'TAPIZ BOSQUE', 220, 9, 'sala', 'pared', 'hojas', ['#68b074', '#60a66c', '#86c88a'], ['#3e7c54', '#468660']],
    ['f_oscuro', 'MADERA OSCURA', 70, 3, 'sala', 'piso', 'tablones', ['#68422f', '#5a3a2c', '#34221e']],
    ['f_gris', 'CONCRETO PULIDO', 100, 4, 'sala', 'piso', 'losa', ['#9aa0ae', '#8c92a0', '#6e7482']],
    ['f_parquet', 'PARQUET CLARO', 130, 6, 'sala', 'piso', 'parquet', ['#ecd096', '#e2c48a', '#c4a068']],
    ['f_mosaico', 'MOSAICO CREMA', 190, 9, 'sala', 'piso', 'mosaico', ['#eeeade', '#cecabe', '#aaa698']],
    ['p_circuitos', 'CIRCUITOS', 60, 2, 'juegos', 'pared', 'puntos', ['#10234a', '#0e1e40', '#4ae8ff'], ['#0a1632', '#0e1e44']],
    ['p_galaxia', 'GALAXIA', 110, 4, 'juegos', 'pared', 'estrellas', ['#14123a', '#1a1646', '#ffffff'], ['#0e0c2a', '#14123a']],
    ['p_arcade', 'LADRILLO ARCADE', 150, 6, 'juegos', 'pared', 'ladrillo', ['#4a2a6e', '#3e2260', '#241040'], ['#321a50', '#2a1442', '#180a30']],
    ['p_pixel', 'ARCOÍRIS PIXEL', 200, 8, 'juegos', 'pared', 'rayas', ['#e84aa8', '#4a9ae8'], ['#a8307a', '#3070b0']],
    ['f_damero', 'DAMERO CLÁSICO', 60, 2, 'juegos', 'piso', 'mosaico', ['#f0f0f8', '#2a2a3a', '#8a8a98']],
    ['f_neon', 'TABLERO NEÓN', 100, 4, 'juegos', 'piso', 'mosaico', ['#1a1236', '#2a2058', '#ff5ac8']],
    ['f_arcmad', 'MADERA ARCADE', 130, 6, 'juegos', 'piso', 'tablones', ['#7a4a2a', '#6a3e22', '#3a2010']],
    ['f_violeta', 'LOSA VIOLETA', 170, 8, 'juegos', 'piso', 'losa', ['#5a3a9a', '#4e3088', '#2e1a58']],
    ['p_menta', 'MENTA SUAVE', 70, 4, 'cocina', 'pared', 'rayas', ['#cdeed8', '#c2e6cf'], ['#eef8f2', '#fff', '#b8d8c4']],
    ['p_cerezo', 'RAYAS CEREZA', 110, 6, 'cocina', 'pared', 'rayas', ['#fff0e8', '#f8d8cc'], ['#ffe4e0', '#fff', '#e8b0a8']],
    ['p_ladcafe', 'LADRILLO CAFÉ', 150, 8, 'cocina', 'pared', 'ladrillo', ['#a8643c', '#945632', '#e0d0b8'], ['#f4ead8', '#fff', '#c0b090']],
    ['p_marino', 'AZUL MARINO', 190, 10, 'cocina', 'pared', 'puntos', ['#2a4a7a', '#264472', '#c8dcf8'], ['#d8e8f8', '#fff', '#8aa8d0']],
    ['f_damnegro', 'DAMERO NEGRO', 80, 5, 'cocina', 'piso', 'mosaico', ['#f0f0f0', '#2a2a34', '#8a8a98']],
    ['f_cmad', 'MADERA CLARA', 110, 6, 'cocina', 'piso', 'tablones', ['#d8aa72', '#cc9c64', '#8a5c34']],
    ['f_terracota', 'LOSA TERRACOTA', 150, 8, 'cocina', 'piso', 'losa', ['#c4704a', '#b86442', '#8a4630']],
    ['f_cverde', 'MOSAICO VERDE', 190, 10, 'cocina', 'piso', 'mosaico', ['#cfe8d4', '#8cc4a0', '#6a9a7e']],
    ['p_beige', 'BEIGE ELEGANTE', 100, 7, 'entrada', 'pared', 'rayas', ['#efe4cc', '#e6d8bc'], ['#c8b48c', '#d8c8a0']],
    ['p_puerto', 'AZUL PUERTO', 140, 8, 'entrada', 'pared', 'rayas', ['#a8c0e0', '#9cb4d8'], ['#6a88b8', '#7a98c8']],
    ['p_rustica', 'MADERA RÚSTICA', 180, 10, 'entrada', 'pared', 'madera', ['#a87a50', '#9c7048'], ['#6a4a2c', '#5e4026']],
    ['p_ladent', 'LADRILLO BLANCO', 220, 12, 'entrada', 'pared', 'ladrillo', ['#e8e4dc', '#dcd8d0', '#a8a49c'], ['#c8c4bc', '#bcb8b0', '#908c84']],
    ['f_roble', 'MADERA ROBLE', 100, 7, 'entrada', 'piso', 'tablones', ['#b88a58', '#ac7e4e', '#6a4a2a']],
    ['f_piedra', 'PIEDRA OSCURA', 150, 9, 'entrada', 'piso', 'losa', ['#6a6670', '#5e5a64', '#403c46']],
    ['f_marmol', 'MÁRMOL', 230, 12, 'entrada', 'piso', 'mosaico', ['#f0eef0', '#d8d4dc', '#b0aab4']],
    ['p_b_menta', 'AZULEJO MENTA', 60, 1, 'bano', 'pared', 'azulejo', ['#cdeede', '#c0e6d2', '#8cc0a6'], ['#a0d4bc', '#ffffff', '#6aa890']],
    ['p_b_rosa', 'ALGODÓN ROSA', 80, 2, 'bano', 'pared', 'rayas', ['#ffe6ee', '#fad4e0'], ['#f4b8cc', '#ffffff', '#d890a8']],
    ['p_b_oceano', 'OCÉANO', 110, 4, 'bano', 'pared', 'puntos', ['#3a78b4', '#3470a8', '#bfe6ff'], ['#26588c', '#ffffff', '#7ab0d8']],
    ['p_b_madera', 'SPA DE MADERA', 140, 5, 'bano', 'pared', 'madera', ['#c89868', '#bc8c5e'], ['#8a6038', '#7e5630']],
    ['p_b_negro', 'MÁRMOL NEGRO', 160, 6, 'bano', 'pared', 'azulejo', ['#30323a', '#2a2c34', '#52566a'], ['#1c1e24', '#ffffff', '#3c404c']],
    ['f_b_blanco', 'MOSAICO BLANCO', 60, 1, 'bano', 'piso', 'mosaico', ['#f2f6f8', '#dce6ea', '#b4c4cc']],
    ['f_b_arena', 'LOSA ARENA', 90, 2, 'bano', 'piso', 'losa', ['#d8c8a8', '#ccbc9c', '#a89874']],
    ['f_b_rio', 'PIEDRA DE RÍO', 130, 4, 'bano', 'piso', 'losa', ['#8a9aa0', '#7a8a90', '#56666c']],
    ['f_b_tarima', 'TARIMA SPA', 150, 5, 'bano', 'piso', 'tablones', ['#c49a68', '#b88e5e', '#7a5a34']],
    ['f_b_turquesa', 'MOSAICO TURQUESA', 170, 6, 'bano', 'piso', 'mosaico', ['#7fd0d8', '#46b0c0', '#2f8fa6']]
  ];
  EST_DEF.forEach(([k, n, p, nv, hab, tipo, pat, col, wain]) => {
    ITEMS[k] = { tipo: 'cuarto', slot: (tipo === 'pared' ? 'pared' : 'piso') + (hab === 'sala' ? '' : '_' + hab), n, p, nv, pat, col, wain, tema: hab, estilo: tipo };
    ORDEN.cuarto.push(k);
  });
  // pared/piso elegidos para una habitación (null = el diseño original)
  function estSty(hab) { const ps = hab === 'sala' ? 'pared' : 'pared_' + hab, fs = hab === 'sala' ? 'piso' : 'piso_' + hab, p = ITEMS[e.cuarto[ps]], f = ITEMS[e.cuarto[fs]]; return { p: p && p.pat ? p : null, f: f && f.pat ? f : null, k: (p && p.pat ? e.cuarto[ps] : '') + '|' + (f && f.pat ? e.cuarto[fs] : '') }; }
  function estPal(it) { const c = it.col, w = it.wain; return [c[0], c[1], w[0], w[1], mixC(w[1], .3), mixC(w[1], -.35), mixC(w[0], -.2), mixC(c[0], -.35)]; }
  function swatchEst(it) {
    const g = Grid(44, 30);
    if (it.estilo === 'piso') { for (let y = 0; y < 30; y++) for (let x = 0; x < 44; x++) g.set(x, y, PAT_F[it.pat](x, y, it.col)); return g; }
    for (let y = 0; y < 30; y++) for (let x = 0; x < 44; x++) g.set(x, y, y < 18 ? PAT_P[it.pat](x, y, it.col) : it.wain.length > 2 ? PAT_P[it.pat](x, y, it.wain) : it.wain[0]);
    g.rect(0, 16, 44, 1, '#fffbe8'); g.rect(0, 17, 44, 2, '#f0e6c8');
    if (it.wain.length < 3) for (let px = 3; px < 44; px += 14) { g.rect(px, 22, 10, 7, it.wain[1]); g.rect(px, 22, 10, 1, mixC(it.wain[1], .3)); }
    return g;
  }
  // ---- refrigeradores ----
  var REFRIS = {
    refri_menta:  { n: 'REFRI MENTA', p: 90, nv: 4, o: { cuerpo: '#a8e6cf', borde: '#3a6a58', luz: '#d8fff0', sombra: '#6aa890', mango: '#e8f4f0', deco: 'corazon' }, snack: ['manzana', 'galleta'] },
    refri_retro:  { n: 'REFRI RETRO ROSA', p: 150, nv: 5, o: { cuerpo: '#ff9ac0', borde: '#6a2a4a', luz: '#ffd0e4', sombra: '#c8648e', mango: '#f0f0f8', retro: 1, deco: 'badge' }, snack: ['manzana', 'galleta'] },
    refri_keke:   { n: 'REFRI KEKE', p: 170, nv: 6, o: { cuerpo: '#fff2d0', borde: '#8a5630', luz: '#ffffff', sombra: '#d8c090', mango: '#e8353f', deco: 'keke' }, snack: ['dona', 'taco'] },
    refri_acero:  { n: 'REFRI DE ACERO', p: 220, nv: 7, o: { cuerpo: '#b8c0cc', borde: '#3a4250', luz: '#e8eef6', sombra: '#8890a0', mango: '#4a5260', deco: 'panel' }, snack: ['galleta', 'dona'] },
    refri_negro:  { n: 'REFRI NEGRO MATE', p: 280, nv: 8, o: { cuerpo: '#2e2e3a', borde: '#12121a', luz: '#52526a', sombra: '#1a1a24', mango: '#c0c8d8', deco: 'led' }, snack: ['dona', 'helado'] },
    refri_doble:  { n: 'REFRI DOBLE PUERTA', p: 380, nv: 10, o: { cuerpo: '#c8d0dc', borde: '#3a4250', luz: '#f0f4fa', sombra: '#8890a0', mango: '#4a5260', deco: 'panel', ancho: 6, alto: 6, doble: 1 }, snack: ['helado', 'taco'] },
    refri_dorado: { n: 'REFRI DORADO', p: 520, nv: 1, mercader: true, o: { cuerpo: '#e8c048', borde: '#7a5010', luz: '#fff0a0', sombra: '#b08828', mango: '#7a5010', deco: 'gema' }, snack: ['hamburguesa', 'batido'] }
  };
  Object.keys(REFRIS).forEach(k => { const d = REFRIS[k]; ITEMS[k] = { tipo: 'cuarto', slot: 'refri', n: d.n, p: d.p, nv: d.nv, refri: d.o, snack: d.snack, tema: 'cocina', estilo: 'refri' }; if (d.mercader) ITEMS[k].mercader = true; ORDEN.cuarto.push(k); });
  MERC_POOL.push('refri_dorado');
  function refriDibuja(g, fx, RY, FY, k) {
    const o = ITEMS[k].refri, top = RY - 26 - (o.alto || 0), w = 24 + (o.ancho || 0), x0 = fx - (o.ancho || 0), h = FY - top, sep = RY + 6;
    g.rect(x0, top, w, h, o.borde); g.rect(x0 + 1, top + 1, w - 2, h - 2, o.cuerpo); g.rect(x0 + 1, top + 1, w - 2, 1, o.luz); g.rect(x0 + 1, top + 1, 1, h - 2, o.luz); g.rect(x0 + w - 2, top + 1, 1, h - 2, o.sombra);
    if (o.retro) { g.clear(x0, top, 2, 1); g.clear(x0, top + 1, 1, 1); g.clear(x0 + w - 2, top, 2, 1); g.clear(x0 + w - 1, top + 1, 1, 1); g.rect(x0 + 2, top + 1, w - 4, 1, o.luz); }
    g.rect(x0 + 1, sep, w - 2, 1, o.sombra);
    if (o.doble) { g.rect(x0 + (w >> 1), top + 1, 1, h - 2, o.borde); g.rect(x0 + (w >> 1) - 4, top + 10, 2, 14, o.mango); g.rect(x0 + (w >> 1) + 2, top + 10, 2, 14, o.mango); }
    else { g.rect(x0 + w - 6, top + 6, 2, 12, o.mango); g.rect(x0 + w - 6, sep + 4, 2, 14, o.mango); }
    const cx = x0 + 4, cy = RY - 14;
    if (o.deco === 'corazon') g.art(cx + 1, cy, ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'], { r: '#ff4a5c' });
    else if (o.deco === 'badge') { g.rect(cx + 2, cy + 2, 8, 4, '#e8e8f0'); g.rect(cx + 3, cy + 3, 6, 2, o.sombra); }
    else if (o.deco === 'keke') g.paste(pizzaGrid(), cx - 1, cy - 2);
    else if (o.deco === 'panel') { g.rect(cx, cy, 7, 10, '#232b3a'); g.rect(cx + 1, cy + 1, 5, 3, '#6ae0f0'); g.rect(cx + 2, cy + 6, 3, 3, '#9aa4b8'); }
    else if (o.deco === 'led') { g.rect(cx, cy, 8, 5, '#0a0a12'); g.rect(cx + 1, cy + 1, 6, 1, '#4af0ff'); g.rect(cx + 1, cy + 3, 3, 1, '#4af0ff'); }
    else if (o.deco === 'gema') { g.rect(cx + 2, cy + 1, 6, 6, '#7a5010'); g.rect(cx + 3, cy + 2, 4, 4, '#ff4a8a'); g.rect(cx + 3, cy + 2, 2, 1, '#ffb0d0'); }
    g.rect(x0 + 4, RY + 14, 8, 6, '#ffd84a'); g.rect(x0 + 4, RY + 14, 8, 1, '#fff6b0');
  }
  function refriTap() { abrir('refri'); }
  function refriPrev(k) { const g = Grid(36, 70); refriDibuja(g, 6, 32, 67, k); return g; }
  const paleta = () => { const pi = ITEMS[e.cuarto.pared] || ITEMS.pared_azul, st = estSty('sala'); return { pared: pi.pat ? estPal(pi) : pi.col, sty: pi.pat ? pi : null, fl: st.f, alf: (ITEMS[e.cuarto.alfombra] || ITEMS.alf_roja).col, arte: cuadroArte(), mc: cuadroMc() }; };
  const cuadroClave = () => e.cuarto.cuadro + (e.cuarto.cuadro === 'marco_foto' ? ':' + e.cuadroFoto + e.album.length : '');

