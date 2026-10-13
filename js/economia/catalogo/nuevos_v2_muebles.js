  /* ===================== NUEVOS ITEMS V2: MUEBLES Y JUGUETES (16 muebles + 2 juguetes, NV30-46) =====================
     Carga después de baratas.js: el precio y nivel que se pasan a registrarMueble()/Jt() ya son los definitivos. */

  // ---------- dibujos de muebles ----------
  function pizarronGrid() {
    const g = Grid(28, 22);
    capa(g, '#3a2410', L => caja(L, 0, 0, 28, 22, R.madera));
    g.rect(2, 2, 24, 16, '#12432a'); g.rect(2, 2, 24, 1, '#1d6a38');
    g.rect(4, 6, 10, 1, '#f4eed8'); g.rect(4, 10, 14, 1, '#f4eed8'); g.rect(4, 13, 7, 1, '#f4eed8');
    g.rect(2, 18, 24, 2, R.madera[2]);
    g.rect(6, 19, 3, 1, '#ffffff'); g.rect(11, 19, 2, 1, '#ffd84a');
    return g;
  }
  function camitaGatosGrid() {
    const g = Grid(26, 16);
    capa(g, '#a04030', L => sombrear(L, elipse(13, 11, 13, 5), 13, 11, 13, 5, ['#ffd0b0', '#ffa060', '#e87a30', '#a04030']));
    capa(g, '#7a2a10', L => sombrear(L, elipse(13, 7, 9, 5), 13, 7, 9, 5, pal4('#ff9ad0')));
    g.rect(9, 5, 8, 2, '#ffd0e4');
    return g;
  }
  function escritorioGamerGrid() {
    const g = Grid(32, 26);
    capa(g, '#1a1a24', L => caja(L, 2, 14, 28, 3, ['#3a3a4e', '#242434', '#14141e', '#0a0a12']));
    g.rect(3, 17, 2, 7, '#14141e'); g.rect(27, 17, 2, 7, '#14141e');
    capa(g, '#0a0a14', L => caja(L, 5, 2, 16, 11, ['#3a3a4e', '#242434', '#14141e', '#0a0a12']));
    g.rect(6, 3, 14, 8, '#0c1a3a'); g.rect(7, 4, 5, 2, '#7af0ff'); g.rect(13, 4, 5, 2, '#ff5ac8');
    g.rect(6, 14, 16, 1, '#0a0a14');
    g.rect(22, 16, 8, 2, '#1a1a24'); g.rect(23, 17, 1, 1, '#ff5ac8'); g.rect(25, 17, 1, 1, '#7af0ff'); g.rect(27, 17, 1, 1, '#ffe45a');
    g.rect(8, 20, 10, 6, '#242434'); g.rect(8, 20, 10, 1, '#5a5a74');
    return g;
  }
  function columpioGrid() {
    const g = Grid(22, 34);
    g.rect(2, 0, 2, 32, '#5a3a20'); g.rect(18, 0, 2, 32, '#5a3a20');
    linea(g, 3, 0, 7, 28, '#8a6a30'); linea(g, 19, 0, 15, 28, '#8a6a30');
    capa(g, '#3a2410', L => caja(L, 4, 28, 14, 3, R.madera));
    return g;
  }
  function cajaMusicaGrid() {
    const g = Grid(20, 22);
    capa(g, '#5a3a20', L => caja(L, 1, 10, 18, 10, R.madera));
    g.rect(2, 11, 16, 1, R.madera[0]);
    capa(g, '#7a1a40', L => sombrear(L, elipse(10, 5, 2.4, 5), 10, 5, 2.4, 5, pal4('#ff9ad0')));
    g.rect(8, 2, 4, 2, '#ffd0e4');
    g.rect(3, 13, 3, 1, '#ffd84a'); g.rect(14, 15, 3, 1, '#ffd84a');
    return g;
  }
  function sofaLGrid() {
    const g = Grid(30, 20);
    capa(g, '#1a1a52', L => { caja(L, 0, 6, 10, 13, R.azul); caja(L, 0, 2, 7, 8, R.azul); caja(L, 8, 9, 22, 9, R.azul); caja(L, 24, 5, 6, 13, R.azul); });
    g.rect(13, 10, 1, 7, R.azul[3]); g.rect(19, 10, 1, 7, R.azul[3]);
    g.rect(1, 18, 3, 2, '#3a2410'); g.rect(25, 18, 3, 2, '#3a2410');
    return g;
  }
  function estanteTrofeosGrid() {
    const g = Grid(30, 18);
    capa(g, '#3a2410', L => caja(L, 0, 13, 30, 3, R.madera));
    g.rect(2, 16, 2, 1, '#3a2410'); g.rect(26, 16, 2, 1, '#3a2410');
    [[5, 5, R.dorado], [14, 7, ['#f0f0f0', '#cfcfcf', '#9a9a9a', '#6a6a6a']], [23, 8, ['#ffc090', '#e8a060', '#b87a40', '#8a5a28']]].forEach(([cx, alto, pal]) => {
      capa(g, mixC(pal[2], -.4), L => sombrear(L, elipse(cx, 13 - alto / 2, 2.6, alto / 2), cx, 13 - alto / 2, 2.6, alto / 2, pal));
      g.rect(cx - 1, 13 - alto - 1, 2, 1, pal[1]);
    });
    g.rect(3, 9, 2, 4, '#2f9a4a'); g.set(4, 8, '#5ccf5a');
    return g;
  }
  function tinaSpaGrid() {
    const g = Grid(26, 16);
    capa(g, '#9a9aa8', L => sombrear(L, (x, y) => y >= 5 && y <= 13 && x >= 1 && x <= 24, 12, 9, 12, 4.5, ['#ffffff', '#f0f0f4', '#d8d8e0', '#aaaab8']));
    g.rect(3, 6, 20, 1, '#bfe6ff'); g.rect(6, 7, 3, 1, '#ffffff'); g.rect(13, 7, 3, 1, '#ffffff'); g.rect(19, 7, 3, 1, '#ffffff');
    g.rect(1, 13, 2, 3, '#6a6a7a'); g.rect(23, 13, 2, 3, '#6a6a7a');
    g.rect(16, 3, 1, 3, '#bdbdbd'); g.set(16, 3, '#ffffff');
    return g;
  }
  function jukeboxGrid(fr) {
    const g = Grid(18, 28);
    capa(g, '#4a0a14', L => sombrear(L, (x, y) => y >= 4 && y <= 26 && Math.abs(x + .5 - 9) <= 8 - (y < 10 ? (10 - y) * .3 : 0), 9, 16, 8, 12, R.rojo));
    g.rect(2, 6, 14, 8, '#0c1a3a');
    const on = !(fr && (fr % 20) >= 10);
    g.rect(3, 7, 4, 3, on ? '#ffe45a' : '#8a6a1a'); g.rect(11, 7, 4, 3, on ? '#7af0ff' : '#2a5a6a');
    g.rect(4, 11, 10, 2, '#1a2a5a');
    g.rect(3, 16, 12, 8, '#2a0408'); g.rect(4, 17, 10, 1, '#ffd84a');
    return g;
  }
  function hamacaGrid() {
    const g = Grid(30, 16);
    g.rect(1, 0, 2, 16, '#5a3a20'); g.rect(27, 0, 2, 16, '#5a3a20');
    linea(g, 3, 0, 9, 9, '#8a6a30'); linea(g, 27, 0, 21, 9, '#8a6a30');
    capa(g, '#7a3a08', L => { for (let y = 9; y <= 13; y++) for (let x = 6; x <= 24; x++) if (Math.abs(y - 9 - 2 * Math.sin((x - 6) / 18 * Math.PI)) < 2) L.set(x, y, (x >> 1) % 2 ? '#ffb040' : '#ff8a20'); });
    return g;
  }
  function camaDoselGrid() {
    const g = Grid(30, 40);
    g.rect(1, 0, 2, 20, '#8a6a30'); g.rect(27, 0, 2, 20, '#8a6a30');
    capa(g, '#d0a8e8', L => { for (let y = 0; y <= 14; y++) for (let x = 2; x <= 27; x++) if (((x * 3 + y * 5) % 11) !== 0) L.set(x, y, y < 3 ? '#f4e8ff' : '#e8d0ff'); });
    capa(g, '#3a2410', L => caja(L, 0, 26, 30, 12, R.madera));
    g.rect(2, 20, 26, 7, '#ffffff'); g.rect(2, 20, 26, 2, '#ffe0f0');
    return g;
  }
  function bicicletaDecoGrid() {
    const g = Grid(26, 20);
    capa(g, '#1a1a24', L => { circ(L, 6, 14, 5, '#3a3a4e'); circ(L, 20, 14, 5, '#3a3a4e'); circ(L, 6, 14, 3, '#1a1a24'); circ(L, 20, 14, 3, '#1a1a24'); });
    linea(g, 6, 14, 13, 6, '#c62828'); linea(g, 13, 6, 20, 14, '#c62828'); linea(g, 13, 6, 13, 14, '#c62828'); linea(g, 6, 14, 20, 14, '#8a1a1a');
    g.rect(11, 4, 5, 2, '#8a1a1a'); g.rect(12, 14, 2, 3, '#3a2410');
    return g;
  }
  function consola8bitGrid() {
    const g = Grid(26, 16);
    capa(g, '#1a1a24', L => caja(L, 0, 0, 26, 12, ['#5a5a74', '#3a3a4e', '#242434', '#14141e']));
    g.rect(2, 2, 10, 7, '#0c1a3a'); [[3, 3], [5, 3], [3, 5], [5, 5]].forEach(([x, y], i) => g.rect(x, y, 1, 1, ['#e8353f', '#ffd84a', '#5ccf5a', '#4f49ea'][i]));
    g.rect(14, 3, 4, 2, '#0a0a14'); g.rect(20, 4, 3, 3, '#0a0a14');
    g.rect(0, 12, 26, 2, '#242434');
    return g;
  }
  function castilloJugueteGrid() {
    const g = Grid(30, 26);
    capa(g, '#8a8aa0', L => caja(L, 2, 10, 26, 14, ['#e8e8f0', '#c8c8dc', '#a8a8c0', '#8a8aa0']));
    [3, 25].forEach(x => capa(g, '#6a6a88', L => caja(L, x, 2, 4, 10, ['#f0f0f8', '#d8d8ec', '#b8b8d0', '#9898b8'])));
    [[4, 1, '#e8353f'], [26, 1, '#4f49ea']].forEach(([x, y, c]) => { g.rect(x, y, 2, 3, c); g.set(x, y - 1, c); });
    g.rect(13, 14, 5, 10, '#2a0408');
    return g;
  }
  function proyectorCineGrid(fr) {
    const g = Grid(24, 16);
    capa(g, '#1a1a24', L => caja(L, 2, 4, 16, 8, ['#4a4a60', '#2a2a3a', '#1a1a28', '#0e0e18']));
    const on = !(fr && (fr % 20) >= 14);
    g.rect(3, 6, 4, 4, on ? '#fff6b0' : '#4a4a40');
    if (on) for (let i = 0; i < 6; i++) g.rect(18 + i, 6 + i, 1, 5 - i, '#fff6b088');
    [[15, 2], [20, 3]].forEach(([cx, cy]) => capa(g, '#3a2a08', L => sombrear(L, elipse(cx, cy, 2.2, 2.2), cx, cy, 2.2, 2.2, R.madera)));
    g.rect(1, 12, 20, 2, '#1a1a24');
    return g;
  }
  function trenJugueteGrid() {
    const g = Grid(30, 16);
    g.rect(1, 13, 28, 1, '#9e9e9e'); g.rect(1, 14, 28, 1, '#6a6a6a');
    [4, 10, 16, 22].forEach(x => g.rect(x, 13, 2, 1, '#333'));
    capa(g, '#8a1a1a', L => caja(L, 2, 6, 9, 7, R.rojo));
    g.rect(3, 4, 4, 3, '#e8353f'); g.rect(3, 4, 4, 1, '#ff9aa2'); g.set(1, 9, '#1a1a1a');
    capa(g, '#a85a10', L => caja(L, 13, 8, 8, 5, ['#ffb040', '#ff8a20', '#c86a10', '#8a4a08']));
    [6, 15, 18, 21].forEach(x => circ(g, x, 13, 2, '#1a1a1a'));
    return g;
  }

  // ---------- juguetes (se agregan al objeto juguetes de juguetes_pufs.js) ----------
  juguetes.varita = () => { const g = Grid(10, 22); g.rect(4, 8, 2, 14, '#8a5a10'); g.rect(4, 8, 1, 14, '#d8a020'); capa(g, '#a86a10', L => estr4(L, 5, 4, 4, '#ffe45a')); g.set(5, 4, '#ffffff'); return g; };
  juguetes.pintura = () => {
    const g = Grid(18, 20);
    linea(g, 2, 18, 9, 4, '#5a3a20'); linea(g, 16, 18, 9, 4, '#5a3a20'); linea(g, 2, 18, 16, 18, '#5a3a20');
    capa(g, '#3a2410', L => sombrear(L, (x, y) => y >= 2 && y <= 12 && Math.abs(x + .5 - 9) <= 7 - Math.abs(y - 7) * .3, 9, 7, 7, 5, ['#f0e2c8', '#e0cfa8', '#c8b088', '#a08860']));
    [[6, 6, '#e8353f'], [9, 8, '#4f49ea'], [12, 6, '#ffd84a'], [8, 4, '#2f9a4a']].forEach(([x, y, c]) => g.rect(x, y, 2, 2, c));
    return g;
  };
  const Jt2 = (k, n, p, nv) => Object.assign({ tipo: 'cuarto', slot: 'juguete', luz: true, tema: 'sala', exclusivo: true, n, p, nv, grid: juguetes[k] });

  // ---------- registro de muebles (decoP = se cuelga en la pared, deco = va en el piso) ----------
  [
    ['pizarron', 'PIZARRON', 'decoP', 315, 30, pizarronGrid, false],
    ['camita_gatos', 'CAMITA DE GATOS', 'deco', 335, 31, camitaGatosGrid, false],
    ['escritorio_gamer', 'ESCRITORIO GAMER', 'deco', 355, 32, escritorioGamerGrid, true],
    ['columpio', 'COLUMPIO', 'deco', 375, 33, columpioGrid, false],
    ['caja_musica', 'CAJA DE MUSICA', 'decoP', 395, 34, cajaMusicaGrid, false],
    ['sofa_l', 'SOFA EN L', 'deco', 415, 35, sofaLGrid, false],
    ['estante_trofeos', 'ESTANTE DE TROFEOS', 'decoP', 435, 36, estanteTrofeosGrid, false],
    ['tina_spa', 'TINA SPA', 'deco', 455, 37, tinaSpaGrid, false],
    ['jukebox', 'JUKEBOX', 'decoP', 495, 39, () => jukeboxGrid(0), true],
    ['hamaca', 'HAMACA', 'deco', 515, 40, hamacaGrid, false],
    ['cama_dosel', 'CAMA CON DOSEL', 'deco', 515, 40, camaDoselGrid, false],
    ['bicicleta_deco', 'BICICLETA DECO', 'decoP', 535, 41, bicicletaDecoGrid, false],
    ['consola_8bit', 'CONSOLA 8-BIT', 'decoP', 570, 43, consola8bitGrid, false],
    ['castillo_juguete', 'CASTILLO DE JUGUETE', 'deco', 590, 44, castilloJugueteGrid, false],
    ['proyector_cine', 'PROYECTOR DE CINE', 'decoP', 610, 45, () => proyectorCineGrid(0), true],
    ['tren_juguete', 'TREN DE JUGUETE', 'deco', 630, 46, trenJugueteGrid, false]
  ].forEach(([id, nombre, slot, precio, nivel, grid, luz]) => registrarMueble({ id, nombre, slot, precio, nivel, tema: 'sala', grid, luz }));

  Object.assign(ITEMS, {
    varita_hada: Jt2('varita', 'VARITA DE HADA', 195, 34),
    kit_pintura: Jt2('pintura', 'KIT DE PINTURA', 275, 42)
  });
  ORDEN.juguetes.push('varita_hada', 'kit_pintura');
