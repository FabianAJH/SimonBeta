
  function plantaGrid() {
    const g = Grid(22, 44);
    capa(g, '#12432a', L => { [[11, 16, 3, 10], [6, 22, 4, 6], [16, 22, 4, 6], [11, 8, 3, 6], [7, 13, 3, 5], [15, 13, 3, 5]].forEach(([cx, cy, rx, ry]) => sombrear(L, elipse(cx, cy, rx, ry), cx, cy, rx, ry, R.verde)); });
    capa(g, '#5a2810', L => { sombrear(L, (x, y) => y >= 30 && y <= 43 && Math.abs(x + .5 - 11) <= 8 - (y - 30) * .3, 11, 37, 9, 8, R.barro); L.rect(2, 29, 18, 3, R.barro[0]); });
    return g;
  }
  function guitarraGrid() {
    const g = Grid(18, 44);
    capa(g, '#3a1a08', L => {
      L.rect(8, 4, 3, 22, '#6e4422'); L.rect(7, 0, 5, 6, '#a06a38');
      const cuerpo = union(elipse(9, 35, 8, 7), elipse(9, 25, 5.5, 5));
      sombrear(L, cuerpo, 9, 32, 8, 10, R.madera);
    });
    capa(g, null, L => sombrear(L, elipse(9, 32, 2.6, 2.6), 9, 32, 2.6, 2.6, ['#3a2010', '#2a1408', '#1a0c04', '#100802']));
    g.rect(9, 6, 1, 25, '#f4eed8'); g.rect(6, 40, 6, 1, '#3a1a08'); g.set(8, 1, '#ffd84a'); g.set(10, 3, '#ffd84a');
    return g;
  }
  function neonGrid(fr) {   // fr: fotograma de la animación (respiración + parpadeo real de neón)
    fr = fr || 0;
    const apagado = fr === 15, destello = fr === 7, haloA = (fr >> 1) % 2;   // cada 16 cuadros el tubo "tartamudea" un instante
    const borde = apagado ? '#a02a5e' : '#ff4a9a';
    const haloInt = apagado ? '#2a1040' : haloA ? '#ffc0de' : '#ff9ac8';
    const haloExt = apagado ? '#180a30' : haloA ? '#e04a86' : '#c01c6a';
    const letraC = apagado ? '#6a4a68' : destello ? '#ffffff' : '#fff6fa';
    const estrellaC = apagado ? '#8a6a1a' : destello ? '#fffbd0' : '#ffe45a';
    const g = Grid(28, 26), S = ['###', '#..', '###', '..#', '###'], I = ['###', '.#.', '.#.', '.#.', '###'];
    capa(g, apagado ? '#3a0a28' : '#5a0a3a', L => { L.rect(1, 1, 26, 21, '#1a1040'); L.rect(2, 2, 24, 1, '#2a1a66'); });
    g.rect(1, 1, 26, 1, borde); g.rect(1, 21, 26, 1, borde); g.rect(1, 1, 1, 21, borde); g.rect(26, 1, 1, 21, borde);
    g.rect(2, 2, 24, 1, haloInt); g.rect(2, 20, 24, 1, haloExt);
    const letra = (m, x0, y0, c) => m.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '#') g.rect(x0 + i * 2, y0 + j * 2, 2, 2, c); }));
    letra(S, 6, 7, letraC); letra(I, 16, 7, letraC); g.rect(18, 4, 2, 2, estrellaC);
    [4, 20].forEach(x => g.rect(x, 22, 2, 4, '#5a4a8a'));
    return g;
  }

  function sofaGrid() { const g = Grid(36, 20); capa(g, '#4a0a14', L => { caja(L, 3, 1, 30, 10, R.rojo); caja(L, 0, 5, 7, 13, R.rojo); caja(L, 29, 5, 7, 13, R.rojo); caja(L, 5, 9, 26, 9, R.rojo); }); g.rect(18, 10, 1, 8, R.rojo[3]); g.rect(4, 18, 3, 2, '#3a2410'); g.rect(29, 18, 3, 2, '#3a2410'); return g; }
  function mesitaGrid() { const g = Grid(22, 24); capa(g, '#3a2410', L => { caja(L, 1, 13, 20, 4, R.madera); L.rect(3, 17, 3, 7, R.madera[2]); L.rect(16, 17, 3, 7, R.madera[2]); });
    capa(g, '#241b8c', L => sombrear(L, elipse(11, 10, 3.4, 3.8), 11, 10, 3.4, 3.8, R.azul)); g.rect(11, 3, 1, 4, '#2f9a4a'); g.rect(9, 1, 5, 3, '#ff7ab8'); g.rect(11, 2, 1, 1, '#ffd84a'); return g; }
  function libreroGrid() { const g = Grid(20, 34), C = ['#e8353f', '#4f49ea', '#5ccf5a', '#ffd84a', '#ff7ab8', '#ff9a40'];
    capa(g, '#3a2410', L => caja(L, 0, 0, 20, 34, R.madera)); g.rect(2, 2, 16, 30, '#3a2410');
    [1, 12, 23].forEach((y, r) => { let x = 3; for (let i = 0; i < 6 && x < 17; i++) { const w = 2 + ((i + r) % 2), h = 6 + ((i * 3 + r) % 4); g.rect(x, y + 9 - h + 1, w, h, C[(i + r * 2) % 6]); x += w; } g.rect(2, y + 10, 16, 2, R.madera[1]); });
    return g; }
  function cactusGrid() { const g = Grid(16, 22); capa(g, '#5a2810', L => caja(L, 3, 15, 10, 7, R.barro)); capa(g, '#12432a', L => { [[8, 9, 3, 7.5], [3.5, 10, 1.8, 3.5], [12.5, 8, 1.8, 4]].forEach(([cx, cy, rx, ry]) => sombrear(L, elipse(cx, cy, rx, ry), cx, cy, rx, ry, R.verde)); }); g.rect(7, 0, 3, 2, '#ff7ab8'); g.set(8, 0, '#ffd84a'); return g; }
  function teleGrid() { const g = Grid(24, 22), B = ['#ffe45a', '#6ae0f0', '#6adf6a', '#ff7ae0', '#ff5a5a', '#5a7aff'];
    capa(g, '#0e0e18', L => caja(L, 0, 2, 24, 16, ['#6a6a82', '#3a3a4e', '#242434', '#14141e'])); g.rect(2, 4, 20, 12, '#0c1a3a'); B.forEach((c, i) => g.rect(2 + i * 3 + (i > 4 ? 2 : 0), 4, 3, 8, c)); g.rect(2, 12, 20, 4, '#1a2a5a'); g.rect(19, 13, 2, 1, '#ffffff');
    g.rect(5, 18, 3, 3, '#14141e'); g.rect(16, 18, 3, 3, '#14141e'); g.rect(9, 1, 1, 1, '#9a9ab0'); g.rect(8, 0, 1, 1, '#9a9ab0'); g.rect(14, 1, 1, 1, '#9a9ab0'); g.rect(15, 0, 1, 1, '#9a9ab0'); return g; }
  function acuarioGrid() { const g = Grid(26, 20); g.rect(0, 0, 26, 16, '#9ad8ff'); g.rect(1, 1, 24, 14, '#3a9ae8'); g.rect(1, 1, 24, 2, '#7ac4ff'); g.rect(1, 12, 24, 3, '#e8d098');
    [[6, 8, '#ff9a40'], [17, 5, '#ffe45a']].forEach(([x, y, c]) => { g.rect(x, y, 4, 2, c); g.rect(x - 2, y - 1, 2, 4, c); g.set(x + 3, y, '#1a1a2a'); }); [[20, 6], [20, 9], [4, 12], [11, 9]].forEach(([x, y]) => g.rect(x, y, 1, 4 + (x % 3), '#2f9a4a')); [[14, 3], [15, 5]].forEach(([x, y]) => g.set(x, y, '#e8f6ff'));
    g.rect(0, 16, 26, 4, '#3a3a4e'); g.rect(0, 16, 26, 1, '#6a6a82'); return g; }
  function baulGrid() { const g = Grid(22, 16); capa(g, '#3a2410', L => { caja(L, 0, 6, 22, 10, R.madera); sombrear(L, (x, y) => y <= 7 && elipse(11, 7, 11, 7)(x, y), 11, 7, 11, 7, R.madera); }); g.rect(0, 8, 22, 1, '#d8a020'); g.rect(0, 13, 22, 1, '#d8a020'); g.rect(10, 7, 3, 5, '#ffd84a'); g.rect(11, 9, 1, 2, '#6a4408'); return g; }
  function globoGrid() { const g = Grid(16, 22); capa(g, '#12186a', L => sombrear(L, elipse(8, 8, 7, 7), 8, 8, 7, 7, R.azul)); [[5, 5, 3, 3], [9, 8, 3, 4], [4, 9, 2, 2]].forEach(([x, y, w, h]) => g.rect(x, y, w, h, '#5ccf5a')); g.rect(7, 15, 2, 3, '#a06a38'); g.rect(4, 18, 8, 2, '#6e4422'); g.rect(4, 18, 8, 1, '#a06a38'); g.rect(1, 3, 1, 10, '#d8a020'); return g; }
  function telescopioGrid() { const g = Grid(22, 28); [[11, 14, 4, 27], [11, 14, 18, 27], [11, 14, 11, 27]].forEach(([x0, y0, x1, y1]) => { for (let t = 0; t <= 13; t++) g.set(Math.round(x0 + (x1 - x0) * t / 13), Math.round(y0 + (y1 - y0) * t / 13), '#6e4422'); });
    capa(g, '#232b63', L => { for (let t = 0; t < 15; t++) { const x = 2 + t, y = 12 - Math.floor(t * .6); L.rect(x, y, 3, 4, t < 4 ? '#d8a020' : t < 11 ? R.azul[1] : R.azul[2]); } }); g.rect(2, 9, 3, 7, '#ffd84a'); g.rect(10, 12, 3, 3, '#9ea8cf'); return g; }
  function macetaFlorGrid() { const g = Grid(18, 18); capa(g, '#5a2810', L => caja(L, 4, 11, 10, 7, R.barro)); [[4, 6], [9, 3], [14, 7]].forEach(([x, y], i) => { g.rect(x, y + 3, 1, 8, '#2f9a4a'); const c = ['#ff7ab8', '#ffd84a', '#ff5a5a'][i]; g.rect(x - 1, y - 1, 3, 3, c); g.rect(x, y, 1, 1, i === 1 ? '#ff9a40' : '#ffe45a'); }); g.rect(5, 12, 2, 1, '#5ccf5a'); return g; }
  function relojGrid() { const g = Grid(18, 18); capa(g, '#3a2410', L => sombrear(L, elipse(9, 9, 8.5, 8.5), 9, 9, 8.5, 8.5, R.madera)); capa(g, '#9ea8cf', L => sombrear(L, elipse(9, 9, 6.6, 6.6), 9, 9, 6.6, 6.6, R.piel)); [[9, 4], [14, 9], [9, 14], [4, 9]].forEach(([x, y]) => g.rect(x, y, 1, 1, '#241b8c')); g.rect(9, 6, 1, 4, '#1a1a2a'); g.rect(10, 9, 3, 1, '#1a1a2a'); g.set(9, 9, '#e8353f'); return g; }
  function cuadroKekeGrid() { const g = Grid(20, 24); capa(g, '#6a4408', L => caja(L, 0, 0, 20, 24, R.dorado || R.madera)); g.rect(2, 2, 16, 20, '#fff2d0'); g.paste(pizzaGrid(), 3, 6); g.rect(4, 17, 12, 1, '#c88a40'); g.rect(6, 4, 8, 1, '#c88a40'); return g; }
  function guirnaldaGrid() { const g = Grid(40, 12); for (let x = 0; x < 40; x++) g.set(x, 2 + Math.round(2.2 * Math.sin(x / 40 * Math.PI)), '#6a4408');
    [[4, '#ffe45a'], [12, '#ff7ab8'], [20, '#6ae0f0'], [28, '#ffe45a'], [36, '#ff7ab8']].forEach(([x, c]) => { const y = 5 + Math.round(2.2 * Math.sin(x / 40 * Math.PI)); g.rect(x - 1, y, 3, 3, c); g.rect(x, y - 1, 1, 5, c); g.rect(x - 2, y + 1, 5, 1, c); g.set(x, y + 1, '#ffffff'); }); return g; }
  function estanteGrid() { const g = Grid(30, 16); capa(g, '#3a2410', L => caja(L, 0, 12, 30, 4, R.madera)); g.rect(3, 15, 2, 1, '#3a2410');
    capa(g, '#5a2810', L => caja(L, 3, 7, 6, 5, R.barro)); g.rect(5, 2, 2, 5, '#2f9a4a'); g.rect(4, 3, 1, 2, '#5ccf5a'); g.rect(7, 4, 1, 2, '#5ccf5a');
    g.rect(13, 6, 8, 2, '#e8353f'); g.rect(14, 8, 7, 2, '#4f49ea'); g.rect(13, 10, 8, 2, '#ffd84a'); capa(g, '#6a4408', L => sombrear(L, elipse(26, 9, 2.5, 2.5), 26, 9, 2.5, 2.5, R.dorado || R.amarillo)); g.rect(25, 3, 3, 1, '#ffd84a'); g.rect(26, 4, 1, 3, '#ffd84a'); return g; }
  function neonCorazonGrid() { const g = Grid(18, 17); g.rect(0, 0, 18, 17, '#ff4a9a'); g.rect(1, 1, 16, 15, '#1a1040'); g.art(2, 3, ["..OOO...OOO..", ".OhhhO.OhhhO.", "OhhrrrOrrrrrO", "OhrrrrrrrrrrO", "OrrrrrrrrrrrO", ".OrrrrrrrrrO.", "..OrrrrrrrO..", "...OrrrrrO...", "....OrrrO....", ".....OrO....."], { O: '#ff4a9a', h: '#ffffff', r: '#ff9ac8' }); return g; }
  function espejoGrid() { const g = Grid(14, 24); capa(g, '#6a4408', L => sombrear(L, elipse(7, 12, 6.8, 11.8), 7, 12, 6.8, 11.8, R.dorado || R.amarillo)); capa(g, '#7a9ac8', L => sombrear(L, elipse(7, 12, 5, 10), 7, 12, 5, 10, ['#f4faff', '#cfe6ff', '#a8caf0', '#7aa0d0'])); g.rect(4, 5, 1, 4, '#ffffff'); g.rect(5, 4, 1, 2, '#ffffff'); g.rect(9, 15, 1, 3, '#ffffff'); return g; }
  function lamparaGrid() {
    const g = Grid(20, 52);
    capa(g, '#5a4410', L => { L.rect(9, 16, 2, 32, '#d8a020'); L.rect(9, 16, 1, 32, '#ffd84a'); L.rect(5, 47, 10, 3, '#8a6a30'); L.rect(5, 47, 10, 1, '#b8903a'); });
    capa(g, '#7a5a10', L => sombrear(L, (x, y) => y >= 1 && y <= 16 && Math.abs(x + .5 - 10) <= 4 + (y - 1) * .38, 10, 9, 9, 8, R.amarillo));
    return g;
  }
  function patoGrid() {
    const g = Grid(26, 26);
    capa(g, '#7a4a10', L => {
      sombrear(L, union(elipse(11, 17, 10, 7), elipse(18, 8, 5.5, 5.5)), 13, 13, 12, 13, R.amarillo);
      L.rect(22, 9, 4, 2, '#ee7a20'); L.rect(22, 9, 4, 1, '#ffa040');
    });
    g.set(19, 7, '#1a1a2a'); g.set(19, 6, '#1a1a2a');
    g.rect(5, 15, 7, 1, '#e8a820'); g.rect(6, 16, 5, 1, '#e8a820');
    return g;
  }
  function swatchPared(c) {
    const g = Grid(44, 30);
    for (let y = 0; y < 30; y++) for (let x = 0; x < 44; x++) g.set(x, y, y < 18 ? (x % 12 < 6 ? c[0] : c[1]) : c[2]);
    g.rect(0, 16, 44, 1, '#fffbe8'); g.rect(0, 17, 44, 2, '#f0e6c8'); g.rect(0, 19, 44, 1, c[6]);
    for (let px = 3; px < 44; px += 14) { g.rect(px, 22, 10, 7, c[3]); g.rect(px, 22, 10, 1, c[4]); g.rect(px, 28, 10, 1, c[5]); }
    return g;
  }
  function swatchAlf(c) {
    const g = Grid(44, 30);
    for (let y = 0; y < 30; y++) for (let x = 0; x < 44; x++) g.set(x, y, Math.floor(y / 8) % 2 ? '#c58750' : '#cc8f56');
    [[20, 13, c[0]], [18, 11, c[1]], [14, 8, c[2]], [12, 6, c[3]]].forEach(([rx, ry, col]) => { const t = elipse(22, 15, rx, ry); for (let y = 0; y < 30; y++) for (let x = 0; x < 44; x++) if (t(x, y)) g.set(x, y, col); });
    return g;
  }
  function cajaGrid() {
    const g = Grid(26, 26);
    capa(g, TINTA, L => {
      sombrear(L, (x, y) => x >= 3 && x <= 22 && y >= 12 && y <= 24, 12, 18, 11, 8, R.rojo);
      sombrear(L, (x, y) => x >= 1 && x <= 24 && y >= 7 && y <= 12, 12, 9, 13, 5, R.rojo);
      L.rect(11, 7, 4, 18, '#ffd84a'); L.rect(11, 7, 1, 18, '#fff6b0');
      sombrear(L, elipse(8, 5, 5, 3.5), 8, 5, 5, 3.5, R.dorado); sombrear(L, elipse(17, 5, 5, 3.5), 17, 5, 5, 3.5, R.dorado);
    });
    g.rect(11, 3, 4, 5, '#d8a020');
    return g;
  }
  function calabazaGrid() {
    const NA = ['#ffc060', '#ff8a20', '#c85a10', '#6a2a08'];
    const g = Grid(22, 20);
    capa(g, '#6a2a08', L => { sombrear(L, elipse(11, 12, 10, 7.5), 11, 12, 10, 7.5, NA); [6, 11, 16].forEach(x => { for (let y = 6; y <= 18; y++) if (L.has(x, y)) L.set(x, y, NA[2]); }); });
    g.rect(10, 3, 3, 4, '#2f9a4a'); g.rect(10, 3, 1, 4, '#5ccf5a'); g.rect(13, 4, 2, 1, '#2f9a4a');
    [[6, 9], [14, 9]].forEach(([x, y]) => { g.rect(x, y, 3, 3, '#ffe45a'); g.set(x + 1, y, '#ffe45a'); });
    [[7, 14], [9, 15], [11, 14], [13, 15], [15, 14]].forEach(([x, y]) => g.rect(x, y, 2, 2, '#ffe45a'));
    return g;
  }
  function arbolGrid() {
    const g = Grid(26, 46);
    g.rect(11, 38, 4, 7, '#6e4422'); g.rect(11, 38, 1, 7, '#a06a38');
    [[12, 14, 8, 16], [14, 22, 10, 12], [18, 32, 12, 10]].forEach(([cy, y0, w, h]) => capa(g, '#06280e', L => sombrear(L, (x, y) => y >= y0 && y <= y0 + h && Math.abs(x + .5 - 13) <= w * (y - y0 + 1) / (h + 1) + 1, 13, y0 + h / 2, w + 2, h / 2 + 2, R.verde)));
    [[10, 22, '#ff4a5a'], [16, 20, '#ffd84a'], [8, 31, '#62b8ff'], [15, 30, '#ff4a5a'], [19, 35, '#ffd84a'], [7, 38, '#ffd84a'], [13, 27, '#62b8ff']].forEach(([x, y, c]) => g.rect(x, y, 2, 2, c));
    g.art(10, 1, ["..y..", "yyyyy", ".yyy.", "yy.yy"], { y: '#ffe45a' });
    return g;
  }
  function dinoGrid() {
    const g = Grid(26, 22);
    capa(g, '#7a3a10', L => [[6, 5], [10, 3], [14, 4], [17, 6]].forEach(([x, y]) => { L.rect(x, y, 3, 5, '#ff8a3a'); L.rect(x, y, 3, 1, '#ffc070'); }));
    capa(g, '#12432a', L => { sombrear(L, union(elipse(11, 14, 10, 6.5), elipse(20, 9, 4.8, 4.2)), 13, 12, 13, 9, R.verde); L.rect(5, 19, 4, 3, R.verde[2]); L.rect(14, 19, 4, 3, R.verde[2]); });
    g.set(21, 8, '#1a1a2a'); g.set(22, 8, '#1a1a2a'); g.rect(20, 11, 4, 1, '#ffffff'); g.rect(6, 15, 8, 1, R.verde[0]);
    return g;
  }
  function coheteGrid() {
    const g = Grid(18, 46);
    capa(g, '#4a0a14', L => { [[0, 5], [13, 5]].forEach(([x]) => { for (let y = 30; y <= 43; y++) for (let k = 0; k < 5; k++) { const lado = x === 0 ? 4 - k : k; if (lado <= (y - 28) * .6) L.set(x + k, y, R.rojo[y > 38 ? 2 : 1]); } }); });
    capa(g, '#2a2c4a', L => sombrear(L, elipse(9, 24, 6.8, 18), 9, 24, 6.8, 18, R.piel));
    capa(g, '#4a0a14', L => sombrear(L, (x, y) => y <= 14 && elipse(9, 24, 6.8, 18)(x, y), 9, 12, 7, 10, R.rojo));
    capa(g, '#1a2a5a', L => sombrear(L, elipse(9, 24, 3.2, 3.2), 9, 24, 3.2, 3.2, ['#d4f0ff', '#62b8ff', '#3a78d8', '#1e4a98']));
    g.rect(5, 36, 9, 2, '#e8353f'); g.rect(8, 42, 3, 3, '#ffb030'); g.rect(9, 44, 1, 2, '#ffe45a');
    return g;
  }
  function recorte(g, x, y, w, h) {
    const o = Grid(w, h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const a = ((y + j) * g.w + x + i) * 4;
      if (g.d[a + 3]) o.set(i, j, [g.d[a], g.d[a + 1], g.d[a + 2], 255]);
    }
    return o;
  }
  function gridCanvas(g) {
    const c = document.createElement('canvas'); c.width = g.w; c.height = g.h;
    const x = c.getContext('2d'), im = x.createImageData(g.w, g.h); im.data.set(g.d); x.putImageData(im, 0, 0);
    return c;
  }
