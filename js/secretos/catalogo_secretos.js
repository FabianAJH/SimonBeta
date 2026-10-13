  /* ===================== SECRETOS (huevos de pascua): objetos que no están en la tienda ===================== */
  // casco espacial: domo de cristal alrededor de la cabeza + aro metálico en el cuello
  ACC2.casco_espacial = g => {
    const cx = 28, cy = 31, rx = 26, ry = 27;
    for (let y = 1; y <= 57; y++) for (let x = 0; x <= 55; x++) {
      const d = ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2;
      if (d <= 1 && d >= .88) g.set(x, y, y < 28 ? '#f4fcff' : '#bfe6ff');
      else if (d < .88 && d > .6 && x < cx - 8 && y < cy - 4 && (x + y) % 4 === 0) g.set(x, y, '#e6f6ff');
    }
    [[9, 17], [10, 15], [12, 13], [15, 11], [19, 9]].forEach(([x, y]) => g.rect(x, y, 3, 2, '#ffffff'));
    g.rect(8, 52, 40, 5, '#8a94b4'); g.rect(8, 52, 40, 1, '#e4ecff'); g.rect(8, 56, 40, 1, '#4a5478'); g.rect(7, 53, 1, 3, '#4a5478'); g.rect(48, 53, 1, 3, '#4a5478');
    [[13, '#ff5a5a'], [21, '#ffd84a'], [29, '#6adf6a'], [37, '#5ab4ff']].forEach(([x, c]) => { g.rect(x, 53, 3, 3, c); g.rect(x, 53, 3, 1, '#ffffff'); });
  };
  // gorro de chef ladeado, con un keke en la cinta
  ACC2.gorro_chef = g => capa(g, '#5a5a78', L => {
    [[12, 9, 6], [20, 7, 6], [7, 12, 5], [17, 12, 6]].forEach(([cx, cy, r]) => sombrear(L, elipse(cx, cy, r, r), cx, cy - 1, r, r, ['#ffffff', '#f4f6ff', '#d8def0', '#aab4d0']));
    L.rect(6, 15, 17, 5, '#f4f6ff'); L.rect(6, 15, 17, 1, '#ffffff'); L.rect(6, 19, 17, 1, '#aab4d0');
    L.rect(13, 16, 4, 3, '#ffd84a'); L.rect(13, 16, 4, 1, '#fff6b0'); L.rect(14, 15, 2, 1, '#ff5a8a');
  });
  ITEMS.casco_espacial = { tipo: 'ropa', slot: 'orejas', n: 'CASCO ESPACIAL', p: 0, nv: 1, crop: [0, 0, 56, 60], codigo: true, secreto: true };
  ITEMS.gorro_chef = { tipo: 'ropa', slot: 'orejas', n: 'GORRO DE CHEF KEKE', p: 0, nv: 1, crop: CR.orejas, codigo: true, secreto: true };
  function platilloGrid() {
    const g = Grid(22, 15);
    capa(g, '#2a4a6a', L => sombrear(L, elipse(11, 5.5, 5, 5), 11, 4, 5, 5, ['#e8fbff', '#b8f0ff', '#7ad0f0', '#4a98c8']));
    capa(g, '#2a2a40', L => sombrear(L, elipse(11, 10, 10.5, 3.6), 11, 8.5, 10.5, 3.6, ['#e4e8f8', '#b4bcd4', '#7a84a4', '#4a5272']));
    g.rect(8, 3, 6, 4, '#5ae06a'); g.rect(8, 3, 6, 1, '#a8f4b0'); g.rect(9, 4, 1, 2, '#12301a'); g.rect(12, 4, 1, 2, '#12301a');
    [[4, '#ff5a5a'], [9, '#ffd84a'], [14, '#6adf6a'], [18, '#5ab4ff']].forEach(([x, c]) => { g.rect(x, 10, 2, 2, c); g.set(x, 10, '#ffffff'); });
    g.rect(5, 13, 2, 2, '#4a5272'); g.rect(15, 13, 2, 2, '#4a5272'); g.rect(10, 13, 2, 1, '#4a5272');
    return g;
  }
  function pelucheGrid() {   // mini Cortex: cabezón blanco, pelo negro con mechas rojas, ojos rojos, alas de fuego, chaqueta naranja
    const g = Grid(22, 27);
    capa(g, '#e8353f', L => { [[5, 10, 0, 4], [5, 13, 0, 11], [5, 16, 1, 18], [16, 10, 21, 4], [16, 13, 21, 11], [16, 16, 20, 18]].forEach(([x0, y0, x1, y1]) => { linea(L, x0, y0, x1, y1, '#1c1824'); linea(L, x0, y0 + 1, x1, y1 + 1, '#1c1824'); }); });
    capa(g, '#3a3e66', L => sombrear(L, elipse(11, 12, 8.6, 7.6), 11, 10, 8.6, 7.6, ['#ffffff', '#eef0ff', '#c8cce8', '#9ea4c8']));
    capa(g, '#0a0810', L => { L.rect(5, 4, 12, 3, '#1c1824'); L.rect(4, 6, 14, 2, '#1c1824'); L.rect(3, 7, 3, 4, '#1c1824'); L.rect(17, 7, 3, 3, '#1c1824'); L.rect(6, 8, 7, 1, '#1c1824'); L.rect(6, 9, 3, 1, '#1c1824'); [[7, 3], [10, 2], [14, 3], [16, 4]].forEach(([x, y]) => L.set(x, y, '#1c1824')); });
    g.rect(8, 5, 1, 3, '#e8353f'); g.rect(13, 6, 1, 3, '#e8353f'); g.rect(10, 8, 1, 1, '#e8353f');
    g.rect(8, 0, 1, 2, '#e8353f'); g.rect(10, 0, 1, 3, '#e8353f'); g.rect(12, 0, 1, 2, '#e8353f'); g.rect(8, 2, 5, 1, '#e8353f');
    g.rect(6, 11, 3, 4, '#d0202e'); g.rect(13, 11, 3, 4, '#d0202e'); g.set(6, 11, '#ffffff'); g.set(7, 11, '#ffffff'); g.set(13, 11, '#ffffff'); g.set(14, 11, '#ffffff'); g.set(7, 14, '#6a0a14'); g.set(14, 14, '#6a0a14');
    g.rect(4, 15, 2, 1, '#ff9ab0'); g.rect(16, 15, 2, 1, '#ff9ab0'); g.rect(9, 16, 4, 2, '#3a0a14'); g.rect(10, 17, 2, 1, '#ff6a8a');
    capa(g, '#3a2a10', L => { L.rect(6, 20, 10, 5, '#ff9a20'); L.rect(6, 20, 10, 1, '#ffc060'); L.rect(9, 20, 4, 5, '#1c1824'); L.rect(2, 21, 3, 4, '#f4f6ff'); L.rect(17, 21, 3, 4, '#f4f6ff'); });
    g.rect(10, 22, 2, 2, '#ff8a20'); g.rect(6, 25, 4, 2, '#c82a36'); g.rect(12, 25, 4, 2, '#c82a36'); g.rect(6, 25, 4, 1, '#ff6a78'); g.rect(12, 25, 4, 1, '#ff6a78');
    return g;
  }
  function arteCortexBebe() {
    const g = Grid(28, 20); g.rect(0, 0, 28, 20, '#ffe6ee'); [[3, 4], [24, 3], [5, 15], [23, 16]].forEach(([x, y]) => { g.set(x, y, '#ffb8d0'); g.set(x + 1, y, '#ffb8d0'); g.set(x, y + 1, '#ffb8d0'); });
    g.rect(0, 17, 28, 3, '#c8d8ff');
    disco(g, 14, 12, 7, '#f4d2c0'); disco(g, 14, 12, 6, '#ffe6d6');
    g.rect(13, 2, 3, 3, '#1c1824'); g.rect(11, 3, 2, 2, '#1c1824'); g.rect(16, 3, 2, 2, '#1c1824'); g.rect(15, 1, 1, 3, '#e8353f'); g.rect(10, 5, 9, 1, '#1c1824');
    g.rect(10, 11, 2, 3, '#e8353f'); g.rect(17, 11, 2, 3, '#e8353f'); g.set(10, 11, '#ffffff'); g.set(17, 11, '#ffffff');
    g.rect(9, 14, 2, 1, '#ff9ab0'); g.rect(18, 14, 2, 1, '#ff9ab0'); g.rect(13, 15, 3, 1, '#c8707a');
    g.rect(8, 17, 12, 3, '#e8353f'); g.rect(13, 16, 3, 1, '#f4d2c0');
    g.rect(21, 4, 4, 2, '#ffd84a'); g.rect(21, 3, 1, 1, '#ffd84a'); g.rect(23, 3, 1, 1, '#ffd84a');
    return g;
  }
  ITEMS.platillo_mini = { tipo: 'cuarto', slot: 'deco', n: 'MINI PLATILLO', p: 0, nv: 1, grid: platilloGrid, codigo: true, secreto: true };
  ITEMS.peluche_cortex = { tipo: 'cuarto', slot: 'deco', n: 'MINI CORTEX', p: 0, nv: 1, grid: pelucheGrid, codigo: true, secreto: true, tap: 'peluche' };
  ITEMS.marco_cortex_bebe = { tipo: 'cuarto', slot: 'cuadro', n: 'OBRA: CORTEX BEBÉ', p: 0, nv: 1, grid: () => marcoGrid('marco_cortex_bebe'), arte: arteCortexBebe, mc: ORO, codigo: true, secreto: true };
  ITEMS.aura_legend = { tipo: 'ropa', slot: 'aura', n: 'AURA LEGENDARIA', p: 0, nv: 1, crop: CR.aura, codigo: true, secreto: true };
  ITEMS.aura_trueno = { tipo: 'ropa', slot: 'aura', n: 'AURA DE TRUENO', p: 0, nv: 1, crop: CR.aura, secreto: true };
  ITEMS.aura_eterna = { tipo: 'ropa', slot: 'aura', n: 'AURA ETERNA', p: 0, nv: 1, crop: CR.aura, codigo: true, secreto: true };   // premio único de cosechar la Semilla Eterna
