  /* ===================== JUGUETES Y PUFS ===================== */
  const arteMapa = (rows, map, w, h) => { const g = Grid(w, h); g.art(0, 0, rows.map(r => r.padEnd(w, '.').slice(0, w)), map); return g; };
  const juguetes = {
    pelota() { const g = Grid(12, 12); capa(g, '#4a0a14', L => sombrear(L, elipse(6, 6, 6, 6), 6, 6, 6, 6, R.rojo)); g.rect(0, 5, 12, 2, '#ffffff'); return g; },
    azul() { const g = Grid(12, 12); capa(g, '#150f55', L => sombrear(L, elipse(6, 6, 6, 6), 6, 6, 6, 6, R.azul)); g.rect(0, 5, 12, 2, '#8c88ff'); return g; },
    playa() {
      const g = Grid(12, 12), C = ['#ff4a5a', '#ffffff', '#ffd84a', '#ffffff', '#3a9aff', '#ffffff'];
      capa(g, '#3a2a4a', L => { for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) if (elipse(6, 6, 6, 6)(x, y)) L.set(x, y, C[Math.floor(((Math.atan2(y + .5 - 6, x + .5 - 6) + Math.PI) / (2 * Math.PI)) * 6) % 6]); });
      g.set(3, 3, '#ffffff'); g.set(4, 2, '#ffffff'); return g;
    },
    patito() { const g = arteMapa(['....yyy.....', '...yyyyy....', '...ykyyy....', '...yyyyoo...', '....yyy.....', '..yyyyyy....', '.yyyyyyyyy.y', 'yyyyyyyyyyyy', 'yhyyyyyyyyy.', '.yyyyyyyyyy.', '..yyyyyyyy..'], { y: '#ffd84a', k: '#1a1020', o: '#ff8a20', h: '#fff6b0' }, 12, 11); g.contour('#8a5a08'); return g; },
    osito() { const g = arteMapa(['.bb......bb.', 'bbbb....bbbb', '.bbbbbbbbbb.', '.bbbbbbbbbb.', '.bkbbbbbbkb.', '.bbbbssbbbb.', '..bbsnnsbb..', '...bbbbbb...', '..bbbbbbbb..', '.bbbbbbbbbb.', '.bbb.bb.bbb.'], { b: '#c8884a', k: '#1a1020', s: '#f0c088', n: '#4a2a10' }, 12, 11); g.contour('#4a2a10'); return g; },
    disco() { const g = Grid(12, 6); capa(g, '#1e5088', L => sombrear(L, elipse(6, 3, 6, 3), 6, 3, 6, 3, ['#d0f0ff', '#6ac0f0', '#3a88c8', '#1e5088'])); g.rect(3, 2, 6, 2, '#3a88c8'); g.rect(4, 2, 4, 1, '#d0f0ff'); return g; },
    dado() { const g = Grid(10, 10); g.rect(0, 0, 10, 10, '#2a2636'); g.rect(1, 1, 8, 8, '#ffffff'); g.rect(1, 8, 8, 1, '#b8c0e8'); g.rect(8, 1, 1, 8, '#b8c0e8'); [[2, 2], [6, 2], [4, 4], [2, 6], [6, 6]].forEach(([x, y]) => g.rect(x, y, 2, 2, '#e8353f')); return g; },
    keke() { const g = pizzaGrid(); return g; }
  };
  const PUF = {
    puf_azul:   [R.azul, '#150f55', '#8c88ff'],
    puf_rojo:   [R.rojo, '#4a0a14', '#ff8a96'],
    puf_verde:  [R.verde, '#12432a', '#8affc0'],
    puf_rosa:   [['#ffc0e0', '#ff7ab8', '#d04888', '#802858'], '#4a1030', '#ffe0f0'],
    puf_morado: [['#d8b0ff', '#9a5ae8', '#6a30b0', '#401880'], '#2a0a5a', '#ecd8ff'],
    puf_dorado: [R.dorado, '#6a4a08', '#fff6b0']
  };
  function pufGrid(k) { const [ra, ol, hi] = PUF[k], g = Grid(24, 17); capa(g, ol, L => sombrear(L, elipse(12, 9, 11, 8), 12, 9, 11, 8, ra)); g.rect(7, 3, 10, 1, hi); return g; }
  const Jt = (k, n, p, nv, extra) => Object.assign({ tipo: 'cuarto', slot: 'juguete', luz: true, tema: 'sala', exclusivo: true, n, p, nv, grid: juguetes[k] }, extra);
  const Pf = (k, n, p, nv) => ({ tipo: 'cuarto', slot: 'deco', n, p, nv, grid: () => pufGrid(k) });
  Object.assign(ITEMS, {
    juguete_pelota: Jt('pelota', 'PELOTA ROJA', 0, 1),
    juguete_azul:   Jt('azul', 'PELOTA AZUL', 30, 1),
    juguete_dado:   Jt('dado', 'DADO GIGANTE', 50, 1),
    juguete_playa:  Jt('playa', 'PELOTA DE PLAYA', 60, 2),
    juguete_disco:  Jt('disco', 'DISCO VOLADOR', 70, 2),
    juguete_patito: Jt('patito', 'PATITO DE GOMA', 80, 2),
    juguete_osito:  Jt('osito', 'OSITO', 90, 3),
    juguete_keke:   Jt('keke', 'KEKE DE PELUCHE', 120, 3),
    puf_azul:   Pf('puf_azul', 'PUF AZUL', 0, 1),
    puf_rojo:   Pf('puf_rojo', 'PUF ROJO', 40, 1),
    puf_verde:  Pf('puf_verde', 'PUF VERDE', 40, 1),
    puf_rosa:   Pf('puf_rosa', 'PUF ROSA', 50, 2),
    puf_morado: Pf('puf_morado', 'PUF MORADO', 60, 2),
    puf_dorado: Pf('puf_dorado', 'PUF DORADO', 140, 4)
  });

