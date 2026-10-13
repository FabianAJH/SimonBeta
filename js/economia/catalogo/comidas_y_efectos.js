  /* ===================== EFECTOS ===================== */
  const CORAZON = [".OO...OO.", "OhhOOOrrO", "OhrrrrrrO", "OrrrrrrrO", ".OrrrrrO.", "..OrrrO..", "...OrO...", "....O...."];
  function pizzaGrid() { return kekeGen({ r: '#e8333f', h: '#ff8a92', w: '#fff6ea', W: '#ffc8d8', y: '#ffd770', Y: '#e8a840', p: '#ff7aa8', o: '#c88a40' }, '#6a3a18'); }   // trozo de keke
  const KEKE_FILAS = ["......rr......", ".....rhrr.....", "..wwwwwwwwww..", ".wwWwwwwwwWww.", ".wwwwwwwwwwww.", ".yyyyyyyyyyyy.", ".yYyyyyyyyyYy.", ".pppppppppppp.", ".yyyyyyyyyyyy.", ".yYyyyyyyyyYy.", ".yyyyyyyyyyyy.", "..oooooooooo..", ".............."];
  function kekeGen(m, borde) { const g = Grid(14, 13); g.art(0, 0, KEKE_FILAS, m); g.contour(borde); return g; }
  const ROSA = ['#ffc0e0', '#ff7ab8', '#d04888', '#802858'];
  const caja = (L, x, y, w, h, r) => sombrear(L, (X, Y) => X >= x && X < x + w && Y >= y && Y < y + h, x + w / 2, y + h / 2, w * .75, h * .75, r);
  const FGRID = {
    bomba() { const g = Grid(13, 14); capa(g, '#08080e', L => sombrear(L, elipse(6, 8.5, 5.6, 5.1), 6, 8.5, 5.6, 5.1, ['#6a6a86', '#3c3c52', '#22222f', '#12121a'])); g.rect(3, 6, 2, 2, '#c8c8e0'); g.set(3, 8, '#9a9ab8'); g.rect(4, 2, 5, 2, '#08080e'); g.rect(5, 2, 3, 1, '#9a9aae'); g.set(7, 1, '#c8884a'); g.set(8, 0, '#c8884a'); g.set(9, 0, '#ffe45a'); g.set(9, 1, '#ff8a20'); g.set(10, 0, '#ff8a20'); return g; },
    manzana() { const g = Grid(13, 14); capa(g, '#5a0a14', L => sombrear(L, elipse(6.5, 8.5, 5.8, 5.4), 6.5, 8.5, 5.8, 5.4, R.rojo)); g.rect(6, 1, 1, 4, '#5a3a1a'); g.rect(7, 2, 3, 2, '#5ccf5a'); g.rect(7, 2, 1, 1, '#b2f088'); return g; },
    galleta() { const g = Grid(13, 13); capa(g, '#5a3410', L => sombrear(L, elipse(6.5, 6.5, 5.8, 5.6), 6.5, 6.5, 5.8, 5.6, ['#f0cf90', '#d9a85a', '#b27a34', '#7a4a18'])); [[4, 4], [8, 5], [5, 8], [8, 9], [7, 3]].forEach(([x, y]) => g.rect(x, y, 2, 1, '#4a2410')); return g; },
    dona() { const g = Grid(15, 13); capa(g, '#5a3410', L => sombrear(L, elipse(7.5, 6.5, 7, 5.8), 7.5, 6.5, 7, 5.8, ['#f0cf90', '#d9a85a', '#b27a34', '#7a4a18'])); capa(g, '#802858', L => sombrear(L, elipse(7.5, 5.5, 6.4, 4.6), 7.5, 5.5, 6.4, 4.6, ROSA)); g.clear(6, 4, 3, 3);
      [[3, 4, '#ffffff'], [10, 3, '#ffe45a'], [11, 6, '#6ac0f0'], [4, 7, '#5ccf5a'], [8, 8, '#ffffff']].forEach(([x, y, c]) => g.rect(x, y, 2, 1, c)); return g; },
    helado() { const g = Grid(12, 20); for (let y = 10; y < 20; y++) { const hw = 5.2 - (y - 10) * .5; for (let x = 0; x < 12; x++) if (Math.abs(x + .5 - 6) <= hw) g.set(x, y, (x + y) % 3 === 0 ? '#b27a34' : '#e0b468'); }
      g.contour('#6a4010'); capa(g, '#802858', L => sombrear(L, elipse(6, 8, 5.2, 4), 6, 8, 5.2, 4, ROSA)); capa(g, '#a89060', L => sombrear(L, elipse(6, 4.5, 4, 3.4), 6, 4.5, 4, 3.4, ['#ffffff', '#fff2d0', '#e8d4a0', '#b8a070'])); g.rect(6, 0, 2, 2, '#e8353f'); g.set(6, 0, '#ff9aa2'); return g; },
    hamburguesa() { const g = Grid(18, 15); capa(g, '#5a2810', L => { sombrear(L, (x, y) => y <= 6 && elipse(9, 6.5, 8.5, 6.5)(x, y), 9, 6.5, 8.5, 6.5, R.barro); sombrear(L, (x, y) => y >= 12 && elipse(9, 11, 8.5, 3.5)(x, y), 9, 11, 8.5, 3.5, R.barro); L.rect(1, 9, 16, 3, '#6a3a18'); L.rect(1, 9, 16, 1, '#8a5a30'); });
      for (let x = 0; x < 18; x++) g.set(x, 7 + (x % 3 === 0 ? 1 : 0), '#5ccf5a'); g.rect(1, 8, 16, 1, '#ffd84a'); [[5, 2], [9, 1], [12, 3], [7, 4]].forEach(([x, y]) => g.rect(x, y, 2, 1, '#fff2d0')); return g; },
    taco() { const g = Grid(18, 13); capa(g, '#7a4a10', L => sombrear(L, (x, y) => y >= 3 && elipse(9, 3, 8.5, 9)(x, y), 9, 6, 8.5, 8, R.amarillo)); capa(g, '#1d6a38', L => sombrear(L, elipse(9, 3, 6.5, 2.6), 9, 3, 6.5, 2.6, R.verde)); [[5, 2], [9, 1], [12, 3]].forEach(([x, y]) => g.rect(x, y, 2, 2, '#e8353f')); g.rect(7, 4, 3, 1, '#8a5a30'); return g; },
    cafe() { const g = Grid(15, 15); [[4, 0], [5, 1], [4, 2], [8, 0], [9, 1], [8, 2]].forEach(([x, y]) => g.set(x, y, '#e8ecff')); capa(g, '#232b63', L => sombrear(L, (x, y) => y >= 5 && y <= 13 && Math.abs(x + .5 - 6.5) <= 5.8 - (y - 5) * .15, 6.5, 9, 6, 5, R.piel)); g.rect(2, 5, 9, 2, '#6a3a18'); g.rect(3, 5, 4, 1, '#8a5a30');
      g.rect(12, 7, 2, 1, '#9ea8cf'); g.rect(13, 8, 1, 3, '#9ea8cf'); g.rect(12, 11, 2, 1, '#9ea8cf'); g.rect(1, 14, 12, 1, '#9ea8cf'); g.rect(6, 9, 1, 3, '#ffd84a'); g.rect(5, 10, 3, 1, '#ffd84a'); return g; },
    sopa() { const g = Grid(18, 13); capa(g, '#241b8c', L => sombrear(L, (x, y) => y >= 5 && y <= 12 && elipse(9, 5, 8.5, 8)(x, y), 9, 6, 8.5, 7, R.azul)); g.rect(1, 5, 16, 1, '#8c88ff');
      capa(g, '#9ea8cf', L => { [[6, 4, 3.5, 3], [10, 3, 3.5, 3], [13, 4.5, 3, 2.5]].forEach(([cx, cy, rx, ry]) => sombrear(L, elipse(cx, cy, rx, ry), cx, cy, rx, ry, R.piel)); }); [[4, 0], [5, 1]].forEach(([x, y]) => g.set(x, y, '#e8ecff')); return g; },
    batido() { const g = Grid(11, 18), C = ['#ff5a5a', '#ffa040', '#ffe45a', '#6adf6a', '#5ab4ff', '#9a6aff']; for (let y = 4; y < 17; y++) { const hw = 4.6 - (y - 4) * .1; for (let x = 0; x < 11; x++) if (Math.abs(x + .5 - 5.5) <= hw) g.set(x, y, C[Math.min(5, Math.floor((y - 4) / 2.2))]); }
      g.contour('#4a5a8a'); g.rect(1, 3, 9, 1, '#ffffff'); g.rect(7, 0, 1, 5, '#ffffff'); g.rect(7, 1, 1, 1, '#e8353f'); g.rect(7, 3, 1, 1, '#e8353f'); g.rect(2, 1, 3, 3, '#e8353f'); g.set(2, 1, '#ff9aa2'); g.rect(2, 16, 7, 1, '#4a5a8a'); return g; },
    chile() { const g = Grid(16, 14); capa(g, '#5a0a14', L => sombrear(L, union(elipse(12, 5, 3.2, 2.6), elipse(9, 7, 3.6, 2.8), elipse(6, 9, 3.4, 2.4), elipse(3.5, 10.5, 2.4, 1.7)), 8, 8, 8, 6, R.rojo)); g.rect(12, 1, 3, 2, '#2f9a4a'); g.rect(13, 0, 2, 1, '#5ccf5a'); g.rect(14, 3, 1, 1, '#2f9a4a'); [[12, 1], [10, 0]].forEach(([x, y]) => g.set(x, y, '#ffb040')); return g; },
    cometa() { const g = Grid(18, 16); capa(g, '#8a5a08', L => sombrear(L, (x, y) => { const dx = x + .5 - 11, dy = y + .5 - 8, r = Math.hypot(dx, dy), a = Math.atan2(dy, dx); return r <= 3.2 + 4.6 * Math.pow(Math.abs(Math.cos(2.5 * (a + Math.PI / 2))), 1.6); }, 11, 8, 8, 8, R.amarillo));
      [[1, 3], [3, 5], [5, 7], [0, 8], [2, 10], [4, 12]].forEach(([x, y]) => { g.set(x, y, '#ffffff'); g.set(x + 1, y, '#aee0ff'); }); return g; },
    kekeoro() { const g = kekeGen({ r: '#e8353f', h: '#ff8a92', w: '#fff2a0', W: '#ffffff', y: '#ffd84a', Y: '#e8a010', p: '#ffb02a', o: '#b87a10' }, '#6a4408'); [[0, 2], [13, 4], [1, 10], [12, 11]].forEach(([x, y]) => { g.set(x, y, '#ffffff'); g.set(x, y - 1, '#fff2a0'); g.set(x, y + 1, '#fff2a0'); g.set(x - 1, y, '#fff2a0'); g.set(x + 1, y, '#fff2a0'); }); return g; },
    misteriosa() { const g = Grid(14, 14); capa(g, '#2a0a5a', L => caja(L, 1, 2, 12, 11, ['#d8b0ff', '#9a5ae8', '#6a30b0', '#401880'])); g.rect(1, 5, 12, 1, '#ffd84a'); g.rect(6, 2, 2, 11, '#ffd84a');
      g.art(4, 6, [".www.", "w...w", "...w.", "..w..", "..w.."], { w: '#ffffff' }); g.set(6, 11, '#ffffff'); g.rect(6, 0, 2, 2, '#ffd84a'); return g; }
  };
  const COMIDAS = {
    kekeoro:     { n: 'KEKE DORADO',        p: 450, nv: 21, h: 50, e: 80,  f: 25, t: '¡EL KEKE LEGENDARIO!', fx: 'gran' },
    cometa:      { n: 'FRUTA COMETA',       p: 240, nv: 16, h: 35, e: 65,  f: 15, t: 'Sabe a mi planeta...' },
    bebida:      { n: 'BEBIDA ENERGÉTICA',  p: 180, nv: 14, h: 0,  e: 100, f: 8,  t: '¡Sí! ¡Siento que puedo con todo!', fx: 'salto' },
    batido:      { n: 'BATIDO ARCOÍRIS',    p: 140, nv: 12, h: 0,  e: 55,  f: 12, t: '¡Estoy sintiendo colores!' },
    chile:       { n: 'CHILE SUPERPICANTE', p: 110, nv: 9,  h: 25, e: 40,  f: 6,  t: '¡PICA, PICA, PICA!', fx: 'baile' },
    misteriosa:  { n: 'CAJA MISTERIOSA',    p: 75,  nv: 8,  rand: true },
    hamburguesa: { n: 'HAMBURGUESA',        p: 85,  nv: 7,  h: 65, e: 0,   f: 8,  t: '¡Qué gigante!' },
    sopa:        { n: 'SOPA DE NUBE',       p: 60,  nv: 6,  h: 45, e: 0,   f: 8,  t: 'Se siente como flotar.' },
    cafe:        { n: 'CAFÉ ESTELAR',       p: 50,  nv: 5,  h: 0,  e: 30,  f: 5,  t: '¡Ya estoy despierto!' },
    taco:        { n: 'TACO',               p: 38,  nv: 4,  h: 32, e: 0,   f: 5,  t: '¡Ándale!' },
    helado:      { n: 'HELADO',             p: 28,  nv: 3,  h: 18, e: 0,   f: 15, t: '¡Qué frío! ¡Qué rico!' },
    dona:        { n: 'DONA',               p: 20,  nv: 2,  h: 20, e: 0,   f: 8,  t: '¡Con chispitas!' },
    manzana:     { n: 'MANZANA',            p: 14,  nv: 1,  h: 14, e: 0,   f: 3,  t: '¡Crujiente!' },
    galleta:     { n: 'GALLETA',            p: 10,  nv: 1,  h: 8,  e: 0,   f: 5,  t: 'Dulce y con chispas.' }
  };
  const SORPRESAS = [{ w: 3, e: 15, t: 'Sabe a... ¿calcetín?' }, { w: 3, e: 30, h: 8, t: '¡Sabe a lluvia!' }, { w: 2, e: 55, t: '¡Ahora puedo ver los sonidos!' }, { w: 1, e: 85, h: 25, f: 25, t: '¡Sabe a mil kekes!', fx: 'gran' }, { w: 2, e: 8, h: 30, f: 15, t: 'Hip... ¡hip!', fx: 'baile' }];
  function zGrid() {
    const g = Grid(8, 7);
    g.art(0, 0, [
      ".wwwwww.",
      ".....ww.",
      "....ww..",
      "...ww...",
      "..ww....",
      ".ww.....",
      ".wwwwww."
    ], { w: '#ffffff' });
    return conBorde(g, '#2a3a8a');
  }
  const FX = {
    corazon:  () => { const g = Grid(9, 8); g.art(0, 0, CORAZON, { O: '#7a1020', r: '#ff4a5c', h: '#ffb6c0' }); return g; },
    estrella: () => { const g = Grid(5, 5); g.art(0, 0, ["..y..", "..y..", "yyWyy", "..y..", "..y.."], { y: '#ffe45a', W: '#ffffff' }); return g; },
    pizza: pizzaGrid,
    z: zGrid,
    moneda: () => { const g = Grid(6, 6); g.art(0, 0, [".OOOO.", "OyhyyO", "OyyyyO", "OyyyyO", "OyyyyO", ".OOOO."], { O: '#8a5a08', y: '#ffd84a', h: '#fff6b0' }); return g; },
    espora: () => { const g = Grid(5, 5); g.art(0, 0, ["..y..", "..y..", "yyWyy", "..y..", "..y.."], { y: '#e8a8d8', W: '#fff0ff' }); return g; },   // brillito lila: flota alrededor de una Flor Espectro ya colocada
    cristal: () => { const g = Grid(5, 5); g.art(0, 0, ["..y..", "..y..", "yyWyy", "..y..", "..y.."], { y: '#6ad0ff', W: '#eaffff' }); return g; }   // brillito celeste: flota alrededor de una Anémona Calma ya colocada
  };
  ['#ff4a5c', '#ffe45a', '#58d048', '#4ab8ff', '#ff7ab8', '#ffffff'].forEach((c, i) => { FX['cf' + i] = () => { const g = Grid(3, 3); g.rect(0, 0, 3, 3, c); return g; }; });
  FX.crema = () => { const g = Grid(4, 4); g.art(0, 0, ['.ww.', 'wwww', 'wwpw', '.ww.'], { w: '#fff6ea', p: '#ffc8d8' }); return g; };
  FX.gota = () => { const g = Grid(3, 4); g.art(0, 0, ['.y.', 'yyy', 'ywy', '.y.'], { y: '#4ab8ff', w: '#dff3ff' }); return g; };
  FX.rayo = () => { const g = Grid(5, 8); ['..y..', '.yy..', 'yy...', '.y...', '.yy..', '..yy.', '...y.', '..y..'].forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'y') g.set(i, j, '#ffe45a'); })); g.set(2, 0, '#fff6b0'); g.set(2, 7, '#fff6b0'); return g; };
  FX.humo = () => { const g = Grid(8, 7); g.art(0, 0, ['..oooo..', '.oGGGGo.', 'oGGgGGGo', 'oGGGGgGo', '.oGGGGo.', '..oooo..'], { o: '#3a3644', G: '#6a6676', g: '#9a96a8' }); return g; };
  FGRID.jarabe = function () {
    const g = Grid(11, 15), col = { k: '#3a1220', g: '#b8d8f0', w: '#ffffff', r: '#e8353f', d: '#a01a2a', l: '#ff8a96', c: '#c89050', C: '#8a5a28', y: '#fff4b0' };
    ['....CCC....', '....ccC....', '...kkkkk...', '...kgggk...', '..kkgggkk..', '.kgggggggk.', '.kwwwwwwwk.', '.kwwrrrwwk.', '.kwrrrrrwk.', '.kwwwrwwwk.', '.kwwrrrwwk.', '.kwwwwwwwk.', '.kgrlrrrdk.', '.kgrrrrrdk.', '..kkkkkkk..']
      .forEach((f, y) => [...f].forEach((ch, x) => { if (col[ch]) g.set(x, y, col[ch]); }));
    return g;
  };
  FGRID.bebida = function () { const g = Grid(10, 15); capa(g, '#0a1a3a', L => { sombrear(L, (x, y) => x >= 1 && x <= 8 && y >= 2 && y <= 13, 4.5, 8, 5, 6, ['#8ad0ff', '#2a90e8', '#1a5ab0', '#0e3478']); L.rect(1, 1, 8, 2, '#c8d0e0'); L.rect(2, 13, 6, 1, '#c8d0e0'); }); g.art(3, 4, ['...yy', '..yy.', '.yyy.', 'yyyyy', '..yy.', '.yy..', 'yy...'], { y: '#ffe45a' }); g.rect(2, 2, 6, 1, '#ffffff'); return g; };
  FGRID.keke = pizzaGrid; Object.keys(FGRID).forEach(k => { FX['c_' + k] = FGRID[k]; });
  function termometroGrid() {
    const g = Grid(8, 18);
    const O = "#232b63", w = "#ffffff", g1 = "#d8e4f8", r = "#ff3a50", rd = "#c0182c", rl = "#ffa0b0", m = "#8a96c0";
    g.rect(2, 0, 4, 1, O);
    for (let y = 1; y <= 12; y++) { g.set(1, y, O); g.set(6, y, O); }
    g.set(0, 13, O); g.set(7, 13, O);
    g.set(0, 14, O); g.set(7, 14, O);
    g.set(0, 15, O); g.set(7, 15, O);
    g.set(1, 16, O); g.set(6, 16, O);
    g.rect(2, 17, 4, 1, O);
    for (let y = 1; y <= 12; y++) {
      g.set(2, y, w);
      g.set(3, y, r);
      g.set(4, y, rd);
      g.set(5, y, (y % 3 === 0) ? m : g1);
    }
    g.set(3, 1, rl);
    g.rect(1, 13, 6, 3, r);
    g.rect(2, 16, 4, 1, r);
    g.set(2, 13, w); g.set(3, 13, rl);
    g.set(5, 14, rd); g.set(5, 15, rd);
    return g;
  }
  function termometroFlotanteGrid(f) {
    const g = Grid(11, 12);
    const O = "#232b63", w = "#ffffff", r = "#ff3a50", rd = "#c0182c", rl = "#ffa0b0", y = "#ffd84a", c = "#4ab8ff", cl = "#dff3ff";
    g.art(0, 0, [
      "..OOOOOOO..",
      ".OwwwwwwwO.",
      "OwwwwwwwwwO",
      "OwwwwwwwwwO",
      "OwwwwwwwwwO",
      "OwwwwwwwwwO",
      "OwwwwwwwwwO",
      "OwwwwwwwwwO",
      ".OwwwwwwwO.",
      "..OwwwwwO..",
      "...OwwO....",
      "....OO....."
    ], { O, w });
    if (f % 2 === 0) {
      g.rect(4, 6, 3, 2, r); g.set(4, 6, rl); g.set(6, 7, rd);
      g.rect(5, 2, 1, 4, r);
      if (f === 2) { g.set(5, 2, y); g.set(3, 2, rl); g.set(7, 2, rl); }
      g.set(3, 3, "#8a96d8"); g.set(3, 5, "#8a96d8");
    } else {
      g.set(5, 2, c);
      g.rect(4, 3, 3, 4, c);
      g.rect(4, 7, 3, 1, c);
      g.set(4, 4, cl); g.set(4, 5, cl);
      g.set(6, 6, "#1e5088");
    }
    return g;
  }

