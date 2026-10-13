  const ropaSig = () => [e.ropa.cara, e.ropa.cuello, e.ropa.orejas, e.ropa.espalda, e.ropa.aura, e.ropa.sudadera].join(',') + (sinCorona ? 'N' : '');
  var MINI = (typeof MINI !== 'undefined' && MINI) || {
    keke: ['...r...', '.wwwww.', 'ppppppp', 'yyyyyyy', 'ppppppp', 'yyyyyyy', '.bbbbb.'],
    luna: ['..yyy..', '.yyy...', 'yyy....', 'yyy....', 'yyy....', '.yyy...', '..yyyy.'],
    rayo: ['....w..', '...yw..', '..yyw..', '.yyyyy.', '...yw..', '..yw...', '.y.....'],
    normal: ['.yyyyy.', 'yyyyyyy', 'yykykyy', 'yyyyyyy', 'yyyyyyy', 'yykkkyy', '.yyyyy.'],
    gota: ['.c...c.', 'ww.c...', 'wwwqqqq', 'wwwpppd', 'wwwpppd', 'wwppppd', 'ddddddd']
  };
  const PREV = {};
  function prevGrid(k) {
    if (PREV[k]) return PREV[k];
    const it = ITEMS[k]; let g;
    if (k === 'marco_foto') return marcoGrid(k);
    if (k.startsWith('cl_')) return simonGrid('a', 's', (e.closet || [])[+k.slice(3)] || e.ropa);
    if (k === 'si_card') { const ojos = e.dormido ? 'c' : 'a'; return simonGrid(ojos, 'n', e.ropa, estFisico(), false, e.ropa.aura ? tk % 40 : 0); }
    if (k === 'pet_sif') return sifGrid({ boca: 'b', cola: 1 });
    if (k === 'trebol4') return trebolGrid(0);
    if (k === 'ic_trebol') return trebolMini();
    if (k === 'ic_fuego') return llamaGrid(0, !racha());
    if (k === 'ic_mon') return FX.moneda();
    if (k.startsWith('ic_')) { const COL = { a: '#4ab8ff', r: '#ff4a6a', w: '#ffffff', p: '#ff9ab0', y: '#ffd84a', b: '#a8601c', k: '#232b63', d: '#d8607e', c: '#9ad8ff', q: '#ffd0dc' }; g = Grid(7, 7); g.art(0, 0, { ham: MINI.keke, ene: MINI.rayo, fel: MINI.normal, lim: MINI.gota }[k.slice(3)], COL); return g; }
    if (k.startsWith('fo_')) return fotoGrid(k.slice(3));
    if (k.startsWith('lg_')) return lugarMini(k.slice(3));
    if (k.startsWith('hb_')) return habMini(k.slice(3));
    if (k.startsWith('pen_')) { g = OBJ.find(o => 'pen_' + o.id === k).g(); return g; }
    if (k === 'ojo_pet') return ojoGrid(8, 1, 0, 0, 0);
    if (k.startsWith('ig_')) return IGRID[k.slice(3)]();
    if (k.startsWith('sm_')) return semillaGrid(k.slice(3));
    if (k.startsWith('fd_')) { g = FGRID[k.slice(3)](); return g; }
    if (k.startsWith('mj_')) {   // iconos de los minijuegos
      g = Grid(18, 14); const M = { w: '#f4f4ff', k: '#1a1a2e', r: '#e8353f', b: '#4b6ae8', y: '#ffd84a', g: '#aab4c8', G: '#6a7490', p: '#ff5ac8', c: '#7af0ff', n: '#3a4ac0', N: '#14163a', s: '#ffffff' };
      if (k === 'mj_run') {
        g.rect(0, 13, 18, 1, '#8a6ac0');
        g.art(1, 6, ['.rrrrr.', 'wwwwwww', 'wkkwkkw', 'wkkwkkw', 'wwwwwww', '.wbbbw.', '.b...b.'], M);
        g.art(12, 7, ['.gggg.', 'gggggg', 'gGgGgg', 'gGgGgg', 'gGgGgg', 'gGgGgg'], M); g.rect(12, 6, 6, 1, '#d0d8e8');
        g.art(9, 2, ['.rr.', 'rrrr', '.rr.'], { r: '#ffd84a' }); g.set(0, 8, '#aab4c8'); g.set(1, 8, '#aab4c8'); g.set(0, 10, '#aab4c8');
      } else if (k === 'mj_mem') {
        g.rect(0, 0, 8, 13, M.N); g.rect(1, 1, 6, 11, M.n); g.art(2, 3, ['.yyy.', 'y...y', '...y.', '..y..', '.....', '..y..'], M);
        g.rect(10, 1, 8, 13, M.N); g.rect(11, 2, 6, 11, M.w); g.art(12, 4, ['r.r', 'rrr', '.r.'], M); g.art(12, 8, ['.y.', 'yyy', '.y.'], M);
      } else {
        g.rect(1, 12, 4, 2, M.p); g.rect(7, 12, 4, 2, M.c); g.rect(13, 12, 4, 2, M.y);
        g.rect(5, 1, 1, 8, M.s); g.rect(12, 1, 1, 8, M.s); g.rect(5, 1, 8, 2, M.s); g.rect(2, 7, 4, 3, M.y); g.rect(9, 7, 4, 3, M.y); g.rect(3, 6, 2, 1, M.y); g.rect(10, 6, 2, 1, M.y);
        g.set(15, 3, M.c); g.set(14, 4, M.c); g.set(16, 4, M.c); g.set(15, 5, M.c); g.set(1, 3, M.p); g.set(0, 4, M.p); g.set(2, 4, M.p); g.set(1, 5, M.p);
      }
      return g;
    }
    if (k.startsWith('rt_can_')) {   // tarjetas del menú de canciones de Baila con Simon: mini-escenario con los 3 carriles de colores y notas cayendo
      g = Grid(22, 22);
      ['#2a1850', '#3a2272', '#2a1850'].forEach((col, i) => g.rect(0, i * 8, 22, 8, col));
      [[2, '#ff4a5c', 9], [8, '#ffd84a', 13], [14, '#4ac8ff', 7]].forEach(([x, col, h]) => { g.rect(x, 20 - h, 6, h, col); g.rect(x, 20 - h, 6, 1, '#ffffff'); });
      [[3, '#ff4a5c', 2], [9, '#ffd84a', 0], [15, '#4ac8ff', 4]].forEach(([x, col, y]) => { g.rect(x, y, 4, 3, '#1a0f33'); g.rect(x, y, 3, 2, col); });
      g.rect(0, 20, 22, 2, '#1a0f33');
      return g;
    }
    if (k.startsWith('dib_')) g = dibujoGrid(k.slice(4));
    else if (k === 'caja') g = cajaGrid();
    else if (it.tipo === 'ropa') {
      if (k === 'aura_legend') {
        // componer aura legendaria (96x116) + Simon encima en AURA_OX,AURA_OY
        const aG = auraLegendGrid(20), sG = simonGrid('a', 's', {});
        aG.paste(sG, AURA_OX, AURA_OY);
        g = aG;
      } else {
        g = recorte(simonGrid('a', 's', { [it.slot]: k }), ...it.crop);
      }
    }
    else if (it.pat) g = swatchEst(it);
    else if (it.refri) g = refriPrev(k);
    else if (it.slot === 'pared') g = swatchPared(it.col);
    else if (it.slot === 'alfombra') g = swatchAlf(it.col);
    else g = it.grid();
    return (PREV[k] = g);
  }
