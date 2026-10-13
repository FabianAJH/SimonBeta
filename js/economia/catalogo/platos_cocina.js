  /* ---- platos que cocina Simon: se comen desde ALIMENTAR, pero no se venden ---- */
  const RECETAS = [
    { id: 'ensalada', n: 'ENSALADA FRESCA', ing: { lechuga: 1, jitomate: 1 }, pasos: ['cortar', 'armar'], nv: 1, h: 22, e: 10, f: 6, t: 'Fresca y crujiente.' },
    { id: 'hotcakes', n: 'HOT CAKES', ing: { harina: 1, huevo: 1, leche: 1 }, pasos: ['cocinar', 'armar'], nv: 1, h: 30, e: 18, f: 10, t: 'Esponjosos. Muy esponjosos.' },
    { id: 'tostada', n: 'TOSTADA DE QUESO', ing: { pan: 1, queso: 1 }, pasos: ['cocinar', 'armar'], nv: 2, h: 26, e: 12, f: 8, t: '¡Queso derretido!' },
    { id: 'licuado', n: 'LICUADO DE NARANJA', ing: { naranja: 2, leche: 1 }, pasos: ['cortar', 'armar'], nv: 2, h: 14, e: 26, f: 8, t: 'Naranja con nube.' },
    { id: 'tacocasero', n: 'TACOS CASEROS', ing: { tortilla: 1, carne: 1, jitomate: 1 }, pasos: ['cortar', 'cocinar', 'armar'], nv: 3, h: 36, e: 20, f: 10, t: '¡Ándale! Hechos por mí.' },
    { id: 'kekeperro', n: 'KEKE PARA PERRO', ing: { harina: 1, huevo: 1, carne: 1 }, pasos: ['cortar', 'cocinar', 'armar'], nv: 1, perro: 1, h: 0, e: 0, f: 0, t: 'Para un amigo peludo.' },
    { id: 'kekecasero', n: 'KEKE CASERO', ing: { harina: 1, huevo: 1, azucar: 1, chocolate: 1 }, pasos: ['cortar', 'cocinar', 'armar'], nv: 4, h: 46, e: 34, f: 24, t: 'El mejor keke del universo.' }
  ];
  const PL_GRID = {
    ensalada() { const g = Grid(15, 13); ovalG(g, 7, 6, 6, 4, '#4ab860'); ovalG(g, 7, 5, 4, 2, '#8ae08a'); g.rect(4, 4, 2, 2, '#e8353f'); g.rect(9, 5, 2, 2, '#e8353f'); g.rect(7, 3, 2, 1, '#ffd84a'); g.rect(2, 8, 11, 3, '#f4f2ee'); g.rect(3, 11, 9, 1, '#c8c4bc'); g.rect(2, 8, 11, 1, '#ffffff'); g.contour('#3a4a3a'); return g; },
    hotcakes() { const g = Grid(15, 13); [[9, 11], [6, 9], [3, 7]].forEach(([y, w]) => { ovalG(g, 7, y - 1, 6, 2, '#e0a050'); g.rect(2, y - 1, 11, 1, '#f0c078'); }); g.rect(5, 1, 5, 2, '#ffe45a'); g.rect(4, 3, 7, 2, '#b86a20'); g.set(3, 6, '#b86a20'); g.set(11, 8, '#b86a20'); g.contour('#5a3010'); return g; },
    tostada() { const g = Grid(15, 13); g.rect(2, 3, 11, 8, '#e0a050'); g.rect(1, 4, 13, 6, '#e0a050'); g.rect(3, 4, 9, 6, '#ffd84a'); g.rect(3, 4, 9, 1, '#fff0a0'); g.rect(4, 8, 2, 3, '#e8a820'); g.rect(9, 8, 3, 2, '#e8a820'); g.set(6, 6, '#e8a820'); g.set(10, 5, '#c88810'); g.contour('#6a3a10'); return g; },
    licuado() { const g = Grid(13, 15); g.rect(3, 4, 7, 10, '#ffb040'); g.rect(3, 4, 7, 3, '#fff0d0'); g.rect(4, 8, 5, 2, '#ff9a20'); g.rect(3, 4, 1, 10, '#ffd890'); g.rect(8, 1, 1, 5, '#e8353f'); g.rect(8, 1, 3, 1, '#e8353f'); g.rect(2, 3, 9, 1, '#ffffff'); g.contour('#7a4a10'); return g; },
    tacocasero() { const g = Grid(15, 13); ovalG(g, 7, 8, 7, 5, '#e8c888'); g.rect(0, 8, 15, 5, '#00000000'); g.clear(0, 9, 15, 4); g.rect(3, 4, 3, 2, '#4ab860'); g.rect(6, 3, 3, 2, '#e8353f'); g.rect(9, 4, 3, 2, '#d84a5a'); g.rect(4, 6, 7, 2, '#a8402a'); g.rect(2, 7, 11, 1, '#f4dca0'); g.contour('#7a5020'); return g; },
    kekeperro() { const g = Grid(15, 13); g.rect(1, 5, 13, 7, '#b8804a'); g.rect(1, 5, 13, 1, '#d8a468'); g.rect(1, 10, 13, 2, '#8a5a2c'); g.rect(4, 6, 7, 3, '#f6f1ea'); g.rect(3, 5, 2, 2, '#f6f1ea'); g.rect(3, 8, 2, 2, '#f6f1ea'); g.rect(10, 5, 2, 2, '#f6f1ea'); g.rect(10, 8, 2, 2, '#f6f1ea'); g.contour('#4a2a10'); return g; },
    kekecasero() { const g = Grid(15, 13); g.rect(1, 5, 13, 7, '#6a3a1c'); g.rect(1, 5, 13, 1, '#8a5028'); g.rect(1, 8, 13, 1, '#f4eed8'); g.rect(1, 4, 13, 2, '#f4eed8'); g.rect(2, 3, 11, 2, '#ffffff'); g.rect(6, 0, 3, 3, '#e8353f'); g.set(7, 0, '#3a9a50'); g.rect(1, 11, 13, 1, '#3a1c0a'); g.contour('#2a1208'); return g; }
  };
  ITEMS.sarten2 = { tipo: 'cuarto', slot: 'sarten2', n: 'SEGUNDA SARTÉN', p: 260, nv: 5, tema: 'cocina', util: 1, grid: () => { const g = Grid(20, 12); circG(g, 6, 6, 5, '#14141a'); circG(g, 6, 6, 4, '#c8d2dc'); circG(g, 6, 6, 3, '#4a5664'); g.rect(11, 5, 8, 2, '#e8503a'); g.rect(11, 5, 8, 1, '#ff9a7a'); return g; } };
  PORDEFECTO.sarten2 = 1; ORDEN.cuarto.push('sarten2');
  RECETAS.forEach(r => { const id = 'pl_' + r.id; if (r.perro) { FGRID[id] = PL_GRID[r.id]; FX['c_' + id] = PL_GRID[r.id]; return; } COMIDAS[id] = { n: r.n, p: 0, nv: r.nv, h: r.h, e: r.e, f: r.f, t: r.t, cocina: 1 }; FGRID[id] = PL_GRID[r.id]; FX['c_' + id] = PL_GRID[r.id]; });

