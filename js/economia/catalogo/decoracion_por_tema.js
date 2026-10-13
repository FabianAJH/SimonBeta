  /* ===================== MÁS DECORACIÓN, POR TEMA ===================== */
  const MAD = R.madera, MET = ['#f4f6fa', '#c8d0dc', '#9aa4b8', '#5a6478'], NEG = ['#6a647c', '#3a3548', '#221f30', '#100e18'];
  function sillonGrid() { const g = Grid(26, 20); capa(g, '#241b8c', L => { caja(L, 3, 1, 20, 10, R.azul); caja(L, 0, 5, 6, 13, R.azul); caja(L, 20, 5, 6, 13, R.azul); caja(L, 4, 9, 18, 9, R.azul); }); g.rect(3, 18, 3, 2, '#3a2410'); g.rect(20, 18, 3, 2, '#3a2410'); return g; }
  function chimeneaGrid() {
    const g = Grid(34, 34); capa(g, '#3a1a10', L => caja(L, 0, 0, 34, 34, ['#e08a70', '#b85a48', '#8a3a30', '#5a2018']));
    for (let r = 0, y = 4; y < 34; y += 4, r++) { g.rect(1, y, 32, 1, '#5a2018'); for (let x = r % 2 ? 3 : 7; x < 33; x += 8) g.rect(x, y + 1, 1, 3, '#5a2018'); }
    g.rect(0, 0, 34, 4, MAD[1]); g.rect(0, 0, 34, 1, MAD[0]); g.rect(0, 3, 34, 1, MAD[3]);
    g.rect(7, 13, 20, 21, '#150a06'); g.rect(8, 14, 18, 20, '#2a1208'); g.rect(10, 31, 14, 3, '#6e4422'); g.rect(10, 31, 14, 1, '#a06a38');
    g.art(11, 20, ['....o...o.....', '...ooo.ooo.o..', '..oooyoooyoo..', '.oooyyyoyyyoo.', '.ooyyyyyyyyoo.', '.oyyyWWyyyyyo.', '..oyyWWWyyyo..'], { o: '#ff6a28', y: '#ffd84a', W: '#fff6c0' });
    return g;
  }
  function pianoGrid() {
    const g = Grid(32, 28); capa(g, '#08060c', L => { caja(L, 0, 0, 32, 22, NEG); L.rect(2, 22, 3, 6, NEG[2]); L.rect(27, 22, 3, 6, NEG[2]); });
    g.rect(3, 3, 26, 5, '#100e18'); g.rect(5, 4, 4, 3, '#f4eed8'); g.rect(11, 4, 4, 3, '#f4eed8'); g.rect(17, 4, 4, 3, '#f4eed8');
    g.rect(2, 13, 28, 7, '#f4eed8'); g.rect(2, 13, 28, 1, '#ffffff'); for (let x = 5; x < 29; x += 3) g.rect(x, 13, 1, 7, '#9ea8cf'); [4, 7, 13, 16, 19, 25].forEach(x => g.rect(x, 13, 2, 4, '#100e18'));
    return g;
  }
  function tocadiscosGrid() {
    const g = Grid(22, 20); capa(g, '#3a2410', L => { caja(L, 0, 9, 22, 6, MAD); L.rect(2, 15, 3, 5, MAD[2]); L.rect(17, 15, 3, 5, MAD[2]); });
    capa(g, '#08060c', L => caja(L, 2, 2, 18, 8, NEG)); g.rect(4, 3, 10, 5, '#08060c'); g.rect(8, 5, 2, 1, '#e8353f'); g.rect(15, 3, 1, 5, '#c0c8d8'); g.rect(14, 3, 3, 1, '#c0c8d8'); g.set(18, 4, '#6ae0f0');
    return g;
  }
  function consolaGrid() {
    const g = Grid(22, 14); capa(g, '#08060c', L => caja(L, 2, 1, 18, 6, NEG)); g.rect(4, 3, 8, 1, '#4b6ae8'); g.set(16, 3, '#5ccf5a');
    capa(g, '#232b63', L => { caja(L, 0, 8, 9, 5, R.azul); caja(L, 12, 8, 9, 5, R.rojo); }); g.rect(2, 10, 3, 1, '#ffffff'); g.set(16, 10, '#ffd84a'); g.set(18, 10, '#ffffff'); return g;
  }
  function plantaGrandeGrid() {
    const g = Grid(24, 36); capa(g, '#5a2810', L => caja(L, 6, 26, 12, 10, R.barro));
    capa(g, '#12432a', L => { [[12, 12, 4, 12], [5, 14, 4.5, 8], [19, 14, 4.5, 8], [8, 6, 4, 6], [16, 6, 4, 6], [12, 20, 8, 5]].forEach(([cx, cy, rx, ry]) => sombrear(L, elipse(cx, cy, rx, ry), cx, cy, rx, ry, R.verde)); });
    g.rect(11, 8, 1, 18, '#1d6a38'); g.rect(8, 27, 8, 1, '#f0a070'); return g;
  }
  function cuadroLunaGrid() { const g = Grid(20, 24); capa(g, '#6a4408', L => caja(L, 0, 0, 20, 24, R.dorado)); g.rect(2, 2, 16, 20, '#161a52'); disco(g, 9, 11, 5, '#fff2b0'); disco(g, 11, 10, 4, '#161a52'); [[4, 5], [14, 6], [5, 17], [15, 16], [16, 12]].forEach(([x, y]) => g.set(x, y, '#ffffff')); return g; }
  function mesaGrid() { const g = Grid(34, 26); capa(g, '#3a2410', L => { caja(L, 0, 13, 34, 4, MAD); L.rect(3, 17, 3, 9, MAD[2]); L.rect(28, 17, 3, 9, MAD[2]); }); g.rect(9, 12, 16, 2, '#f4eed8'); g.paste(pizzaGrid(), 10, 0); g.rect(2, 13, 30, 1, MAD[0]); return g; }
  function sillaGrid() { const g = Grid(14, 26); capa(g, '#3a2410', L => { caja(L, 1, 0, 12, 12, MAD); L.rect(1, 12, 12, 4, MAD[1]); L.rect(1, 16, 2, 10, MAD[2]); L.rect(11, 16, 2, 10, MAD[2]); }); g.rect(3, 2, 8, 7, MAD[2]); g.rect(1, 12, 12, 1, MAD[0]); return g; }
  function canastaGrid() { const g = Grid(20, 16); capa(g, '#3a2410', L => { sombrear(L, (x, y) => y >= 8 && elipse(10, 8, 9, 7)(x, y), 10, 11, 9, 7, MAD); });
    [[5, 6, '#e8353f'], [10, 4, '#ffd84a'], [14, 6, '#5ccf5a'], [8, 7, '#ff9a40']].forEach(([x, y, c]) => { capa(g, '#3a1410', L => sombrear(L, elipse(x, y, 3.2, 3.2), x, y, 3.2, 3.2, [c, c, c, '#5a2a10'])); g.set(x - 1, y - 1, '#ffffff'); });
    for (let x = 2; x < 18; x += 3) g.rect(x, 10, 1, 4, MAD[3]); g.rect(1, 12, 18, 1, MAD[3]); return g; }
  function tostadoraGrid() { const g = Grid(18, 12); capa(g, '#3a4458', L => caja(L, 0, 2, 18, 9, MET)); g.rect(3, 3, 5, 1, '#232b63'); g.rect(10, 3, 5, 1, '#232b63'); g.rect(16, 5, 2, 1, '#e8353f'); g.rect(2, 11, 3, 1, '#232b63'); g.rect(13, 11, 3, 1, '#232b63'); g.rect(6, 6, 6, 2, '#ffd84a'); return g; }
  function cafeteraGrid() { const g = Grid(16, 20); capa(g, '#4a0a14', L => { caja(L, 0, 0, 16, 5, R.rojo); caja(L, 12, 5, 4, 14, R.rojo); caja(L, 0, 17, 16, 3, R.rojo); }); g.rect(2, 6, 9, 10, '#cfe8f0'); g.rect(2, 11, 9, 5, '#4a2a10'); g.rect(3, 7, 2, 4, '#ffffff'); g.rect(13, 8, 2, 2, '#ffd84a'); return g; }
  function ollaGrid() { const g = Grid(20, 20); [[6, 1], [10, 0], [14, 2]].forEach(([x, y]) => { g.rect(x, y, 2, 3, '#e8ecff'); g.rect(x + 1, y + 3, 2, 2, '#c8d0e8'); });
    capa(g, '#2a3040', L => { caja(L, 2, 8, 16, 10, MET); L.rect(0, 9, 3, 2, '#9aa4b8'); L.rect(17, 9, 3, 2, '#9aa4b8'); }); g.rect(2, 7, 16, 2, '#5a6478'); g.rect(5, 11, 2, 5, '#ffffff'); return g; }
  function especiasGrid() { const g = Grid(30, 18); g.rect(0, 15, 30, 3, MAD[2]); g.rect(0, 15, 30, 1, MAD[0]); [['#ff6a8a', 2], ['#ffd84a', 9], ['#5ccf5a', 16], ['#6ac0f0', 23]].forEach(([c, x]) => { g.rect(x, 5, 5, 10, c); g.rect(x, 5, 5, 1, '#ffffff'); g.rect(x + 1, 3, 3, 2, '#8a5630'); g.rect(x + 1, 8, 3, 3, '#f4eed8'); }); return g; }
  function sartenesGrid() { const g = Grid(26, 24); g.rect(0, 0, 26, 2, MAD[2]); g.rect(0, 0, 26, 1, MAD[0]);
    [[7, 2], [19, 2]].forEach(([x, y]) => { g.rect(x, y, 1, 4, '#9aa4b8'); capa(g, '#14141e', L => sombrear(L, elipse(x, y + 9, 6, 6), x, y + 9, 6, 6, NEG)); g.rect(x - 2, y + 7, 2, 1, '#9a96a8'); });
    g.rect(13, 2, 1, 12, '#9aa4b8'); capa(g, '#2a3040', L => sombrear(L, elipse(13, 16, 3, 3), 13, 16, 3, 3, MET)); return g; }
  function hornoGrid() { const g = Grid(30, 28); capa(g, '#3a4458', L => caja(L, 0, 0, 30, 28, MET)); g.rect(2, 2, 26, 5, '#5a6478'); [6, 12, 18, 24].forEach(x => g.rect(x, 4, 2, 2, '#ffd84a')); g.rect(3, 9, 24, 16, '#2a3040'); g.rect(5, 11, 20, 12, '#150a06'); g.rect(6, 12, 18, 10, '#ff9a40'); g.paste(pizzaGrid(), 8, 11); g.rect(3, 9, 24, 1, '#9aa4b8'); return g; }
  function delantalGrid() { const g = Grid(16, 22); g.rect(7, 0, 2, 1, '#ffd84a'); capa(g, '#4a0a14', L => { L.rect(4, 2, 8, 4, R.rojo[1]); caja(L, 2, 6, 12, 15, R.rojo); }); g.rect(4, 12, 8, 5, R.rojo[2]); g.rect(4, 12, 8, 1, R.rojo[0]); g.rect(2, 20, 12, 1, '#ffffff'); return g; }
  function zapateroGrid() { const g = Grid(26, 20); capa(g, '#3a2410', L => { caja(L, 0, 0, 26, 20, MAD); }); g.rect(2, 2, 22, 7, '#3a2410'); g.rect(2, 11, 22, 7, '#3a2410'); g.rect(1, 9, 24, 2, MAD[1]);
    [[4, 3, '#e8353f'], [12, 3, '#4b6ae8'], [19, 3, '#ffd84a'], [4, 12, '#5ccf5a'], [14, 12, '#ff7ab8']].forEach(([x, y, c]) => { g.rect(x, y + 3, 6, 3, c); g.rect(x, y, 3, 3, c); g.rect(x, y + 6, 6, 1, '#f4eed8'); }); return g; }
  function paraguasGrid() { const g = Grid(16, 30); capa(g, '#2a3040', L => caja(L, 2, 18, 12, 12, MET)); g.rect(3, 20, 10, 2, '#5a6478');
    capa(g, '#4a0a14', L => { L.rect(5, 2, 3, 17, R.rojo[1]); L.rect(8, 0, 3, 19, '#4b6ae8'); }); g.set(6, 1, '#ffffff'); g.rect(5, 2, 1, 5, R.rojo[0]); return g; }
  function bancaEntradaGrid() { const g = Grid(32, 20); capa(g, '#3a2410', L => { caja(L, 0, 6, 32, 5, MAD); L.rect(2, 11, 3, 9, MAD[2]); L.rect(27, 11, 3, 9, MAD[2]); L.rect(0, 0, 2, 7, MAD[1]); L.rect(30, 0, 2, 7, MAD[1]); }); capa(g, '#241b8c', L => caja(L, 3, 3, 26, 5, R.azul)); g.rect(3, 4, 26, 1, R.azul[0]); return g; }
  function buzonGrid() { const g = Grid(18, 30); g.rect(7, 12, 4, 18, MAD[2]); g.rect(7, 12, 1, 18, MAD[1]); capa(g, '#4a0a14', L => { caja(L, 1, 2, 16, 10, R.rojo); }); g.rect(3, 6, 12, 2, '#150a06'); g.rect(15, 0, 3, 5, '#ffd84a'); g.rect(15, 0, 1, 5, '#8a5a10'); g.rect(4, 3, 4, 1, R.rojo[0]); return g; }
  function espejoPieGrid() { const g = Grid(18, 36); capa(g, '#6a4408', L => sombrear(L, elipse(9, 15, 8.4, 14.4), 9, 15, 8.4, 14.4, R.dorado)); g.rect(3, 4, 12, 24, '#bfe4ff'); g.rect(3, 4, 12, 8, '#e0f4ff'); g.rect(5, 6, 2, 8, '#ffffff'); g.rect(8, 29, 2, 7, MAD[2]); g.rect(3, 34, 12, 2, MAD[3]); return g; }
  function plantaAltaGrid() { const g = Grid(16, 38); capa(g, '#5a2810', L => caja(L, 3, 30, 10, 8, R.barro)); g.rect(7, 12, 2, 19, '#6a4020');
    capa(g, '#12432a', L => { [[8, 6, 7, 5], [3, 12, 4, 3], [13, 12, 4, 3], [8, 17, 6, 2.5], [4, 22, 3.5, 2.5], [12, 22, 3.5, 2.5]].forEach(([cx, cy, rx, ry]) => sombrear(L, elipse(cx, cy, rx, ry), cx, cy, rx, ry, R.verde)); }); return g; }
  function tapeteBienvenidaGrid() { const g = Grid(32, 9); g.rect(0, 0, 32, 9, '#4a2a10'); g.rect(1, 1, 30, 7, '#c8884a'); g.rect(3, 2, 26, 5, '#8a1c28'); g.rect(4, 3, 24, 3, '#c23a48'); g.art(13, 3, ['.rr.rr.', 'rrrrrrr', '.rrrrr.', '..rrr..'].map(r => r), { r: '#ffd0d8' }); for (let x = 1; x < 31; x += 3) g.set(x, 0, '#f4eed8'); return g; }
  function perchaPared() { const g = Grid(28, 18); g.rect(0, 10, 28, 4, MAD[1]); g.rect(0, 10, 28, 1, MAD[0]); g.rect(0, 13, 28, 1, MAD[3]); [5, 13, 21].forEach(x => { g.rect(x, 14, 2, 3, '#ffd84a'); g.rect(x, 8, 2, 2, '#ffd84a'); });
    g.art(1, 2, ['..rrrr..', '.rrrrrr.', 'rrrrrrrr', 'wwwwwwww'], { r: '#e8353f', w: '#f4eed8' }); g.rect(14, 10, 4, 7, '#3a47a8'); g.rect(14, 10, 1, 7, '#6a78d8'); g.rect(21, 14, 4, 4, '#5ccf5a'); return g; }
  function letreroGrid() { const g = Grid(24, 20); g.rect(5, 0, 1, 5, '#9aa4b8'); g.rect(18, 0, 1, 5, '#9aa4b8'); capa(g, '#3a2410', L => caja(L, 1, 5, 22, 14, MAD)); g.rect(3, 7, 18, 10, MAD[0]); g.art(8, 9, ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'], { r: '#e8353f' }); return g; }
  function farolGrid() { const g = Grid(14, 28); g.rect(6, 12, 2, 16, '#3a3548'); g.rect(3, 26, 8, 2, '#3a3548'); g.rect(4, 1, 6, 2, '#3a3548'); g.rect(5, 0, 4, 1, '#3a3548'); capa(g, '#3a3548', L => L.rect(3, 3, 8, 9, '#ffe9a0')); g.rect(4, 4, 6, 7, '#ffd84a'); g.rect(6, 5, 2, 5, '#fff6c0'); g.rect(3, 12, 8, 1, '#3a3548'); return g; }
  function floreroGrid() { const g = Grid(16, 24); capa(g, '#3a1a6a', L => sombrear(L, (x, y) => y >= 12 && elipse(8, 16, 5.5, 8)(x, y), 8, 16, 5.5, 8, ['#d8b0ff', '#9a5ae8', '#6a30b0', '#401880'])); g.rect(6, 11, 4, 2, '#6a30b0');
    [[8, 3, '#ff6a8a'], [4, 6, '#ffd84a'], [12, 6, '#ffffff'], [8, 8, '#ff9a40']].forEach(([x, y, c]) => { g.rect(x - 1, y - 1, 3, 3, c); g.set(x, y, '#ffe45a'); g.rect(x, y + 2, 1, 9 - y + 2, '#2f9a4a'); }); return g; }
  function solSonrienteGrid() {
    const g = Grid(22, 22), cx = 11, cy = 11;
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4, x1 = cx + Math.cos(a) * 10, y1 = cy + Math.sin(a) * 10;
      const pa = a + .2, pb = a - .2, x0a = cx + Math.cos(pa) * 6.4, y0a = cy + Math.sin(pa) * 6.4, x0b = cx + Math.cos(pb) * 6.4, y0b = cy + Math.sin(pb) * 6.4;
      linea(g, Math.round(x0a), Math.round(y0a), Math.round(x1), Math.round(y1), '#ffd84a');
      linea(g, Math.round(x0b), Math.round(y0b), Math.round(x1), Math.round(y1), '#ffd84a');
    }
    capa(g, '#b86a10', L => sombrear(L, elipse(cx, cy, 6, 6), cx, cy, 6, 6, ['#fff6b0', '#ffd84a', '#ffa820', '#e07a10']));
    g.rect(cx - 3, cy - 2, 1, 2, '#5a3008'); g.rect(cx + 2, cy - 2, 1, 2, '#5a3008');
    for (let x = cx - 2; x <= cx + 2; x++) g.set(x, cy + 2, '#5a3008');
    g.set(cx - 3, cy + 1, '#5a3008'); g.set(cx + 3, cy + 1, '#5a3008');
    return g;
  }
  const nuevosItems = {
    sillon: ['SILLÓN', 120, 2, 'deco', sillonGrid, 'sala'], chimenea: ['CHIMENEA', 240, 3, 'deco', chimeneaGrid, 'sala', 1], piano: ['PIANO', 300, 5, 'deco', pianoGrid, 'sala'],
    tocadiscos: ['TOCADISCOS', 130, 3, 'deco', tocadiscosGrid, 'sala'], consola: ['VIDEOJUEGOS', 90, 2, 'deco', consolaGrid, 'sala'], planta_grande: ['PLANTA GRANDE', 90, 2, 'deco', plantaGrandeGrid, 'sala'], cuadro_luna: ['CUADRO DE LUNA', 70, 1, 'decoP', cuadroLunaGrid, 'sala'],
    mesa: ['MESA', 110, 3, 'deco', mesaGrid, 'cocina'], silla: ['SILLA', 40, 1, 'deco', sillaGrid, 'cocina'], canasta: ['CANASTA DE FRUTAS', 45, 1, 'deco', canastaGrid, 'cocina'], tostadora: ['TOSTADORA', 35, 1, 'deco', tostadoraGrid, 'cocina'],
    cafetera: ['CAFETERA', 55, 2, 'deco', cafeteraGrid, 'cocina'], olla: ['OLLA', 50, 1, 'deco', ollaGrid, 'cocina'], especias: ['ESPECIAS', 60, 2, 'decoP', especiasGrid, 'cocina'], sartenes: ['SARTENES', 60, 2, 'decoP', sartenesGrid, 'cocina'],
    horno: ['HORNO DE KEKE', 180, 4, 'deco', hornoGrid, 'cocina', 1], delantal: ['DELANTAL', 40, 1, 'decoP', delantalGrid, 'cocina'],
    zapatero: ['ZAPATERO', 70, 2, 'deco', zapateroGrid, 'entrada'], paraguas: ['PARAGÜERO', 45, 1, 'deco', paraguasGrid, 'entrada'], banca_entrada: ['BANCA', 90, 3, 'deco', bancaEntradaGrid, 'entrada'], buzon: ['BUZÓN', 60, 2, 'deco', buzonGrid, 'entrada'],
    espejo_pie: ['ESPEJO DE PIE', 110, 3, 'deco', espejoPieGrid, 'entrada'], planta_alta: ['PALMERA', 70, 2, 'deco', plantaAltaGrid, 'entrada'], tapete: ['TAPETE BIENVENIDA', 40, 1, 'deco', tapeteBienvenidaGrid, 'entrada'],
    percha: ['PERCHA', 50, 1, 'decoP', perchaPared, 'entrada'], letrero: ['LETRERO DE CASA', 45, 1, 'decoP', letreroGrid, 'entrada'], farol: ['FAROL', 60, 2, 'deco', farolGrid, 'entrada', 1],
    florero: ['FLORERO', 40, 1, 'deco', floreroGrid, 'todas'], neon_estrella: ['SOL SONRIENTE', 120, 3, 'decoP', solSonrienteGrid, 'todas', 1]
  };

