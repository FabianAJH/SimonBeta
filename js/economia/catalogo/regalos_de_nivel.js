  /* ===================== REGALOS DE NIVEL 25-100: MUEBLES, PISOS Y PAREDES ===================== */
  // Un regalo gratis cada 5 niveles (ver LVGIFT en baratas.js). Todo es decorativo: sin ventajas de juego.
  // Los muebles animados cambian de cuadro según el reloj (ver ITEMS[k].anim en dibujar_muebles.js).
  (function () {
  const MET = ['#f4f6fa', '#c8d0dc', '#9aa4b8', '#5a6478'], ORO = ['#fff6b0', '#ffd84a', '#d8a020', '#8a5a08'];
  const PIE = ['#e8ecf4', '#b8c0d0', '#8890a8', '#585e78'];
  const rn = (a, b) => { let h = (Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263)) | 0; h = Math.imul(h ^ (h >>> 15), 2246822519); h = Math.imul(h ^ (h >>> 13), 3266489917); h ^= h >>> 16; return (h >>> 0) / 4294967296; };

  /* ---------- 55: LÁMPARA DE LAVA ---------- */
  function lavaGrid(fr, tono) {
    const g = Grid(14, 32), T = [['#3a1a6a', '#ff6ac8', '#ffc0ee', '#6a3aa8'], ['#0e3a5a', '#4af0d0', '#c0fff4', '#1a6a8a'], ['#5a1a1a', '#ffb04a', '#ffe8a8', '#8a3a1a']][tono || 0];
    const hw = y => 2.6 + (y - 4) * 0.16;
    capa(g, '#1a1030', L => {   // vidrio con líquido
      for (let y = 4; y < 25; y++) { const h = hw(y); for (let x = 0; x < 14; x++) if (Math.abs(x + .5 - 7) <= h) { const k = (y - 4) / 20; L.set(x, y, k > .75 ? T[3] : T[0]); } }
      // burbujas de lava (se mueven con el cuadro)
      [[0, 0, 3.2, 2.2], [2, 1.7, 2.8, 1.8], [1, 3.1, 2.2, 1.4]].forEach(([ph, off, rx, ry], i) => {
        const t = (fr + off) * Math.PI / 2 * (i % 2 ? 1 : -1), cy = 14 + Math.sin(t + i) * (5.5 - i), cx = 7 + Math.sin(t * .5 + i * 2) * 1.4;
        for (let y = 4; y < 25; y++) for (let x = 0; x < 14; x++) { const dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry; if (dx * dx + dy * dy <= 1 && Math.abs(x + .5 - 7) <= hw(y) - .2) L.set(x, y, dx + dy < -.5 ? T[2] : T[1]); }
      });
      for (let y = 21; y < 25; y++) { const h = hw(y); for (let x = 0; x < 14; x++) if (Math.abs(x + .5 - 7) <= h && (x + y + fr) % 3 === 0) L.set(x, y, T[1]); }   // base caliente
    });
    for (let y = 6; y < 22; y++) g.set(Math.round(7 - hw(y) + 1), y, '#ffffff');   // brillo del vidrio
    capa(g, '#2a2010', L => {   // tapa y base
      sombrear(L, (x, y) => y >= 0 && y < 4 && Math.abs(x + .5 - 7) <= 2.2 + y * .15, 7, 2, 3.2, 3, ORO);
      sombrear(L, (x, y) => y >= 24 && y < 32 && Math.abs(x + .5 - 7) <= 4 + (y - 24) * .38, 7, 28, 6, 5, ORO);
    });
    g.set(7, 28, '#5a3a08'); g.rect(6, 29, 3, 1, '#5a3a08');
    return g;
  }

  /* ---------- 60: MÁQUINA DE GARRA (peluches) ---------- */
  function garraGrid(fr) {
    const g = Grid(26, 38), P = ['#ff9ad0', '#e8509c', '#a02e70', '#5a1840'];
    capa(g, '#2a0a20', L => { sombrear(L, (x, y) => y >= 0 && y < 38 && x >= 0 && x < 26, 13, 19, 14, 22, P); });
    g.rect(2, 1, 22, 5, '#12082a'); g.rect(3, 2, 20, 3, '#ffd84a');   // marquesina con luces
    for (let i = 0; i < 10; i++) g.set(4 + i * 2, 3, (i + fr) % 2 ? '#e8353f' : '#ffffff');
    g.rect(2, 7, 22, 20, '#6a2a50'); g.rect(3, 8, 20, 18, '#d8f2ff'); g.rect(3, 8, 20, 4, '#eefaff');   // cristal
    g.rect(3, 22, 20, 4, '#8a4a70'); g.rect(3, 22, 20, 1, '#b86a98');   // piso de peluches
    // peluches: keke, estrella, mini robot, bolita
    capa(g, '#7a3a08', L => { sombrear(L, elipse(7, 20, 3.4, 3.2), 7, 20, 3.4, 3.2, ['#fff0a0', '#ffd84a', '#ffa820', '#e07a10']); });
    g.set(6, 19, '#3a2008'); g.set(8, 19, '#3a2008'); g.rect(6, 21, 3, 1, '#3a2008');
    capa(g, '#8a6a08', L => L.art(11, 19, ['..y..', '.yyy.', 'yyyyy', '.yyy.', '.y.y.'], { y: '#ffe45a' }));
    capa(g, '#2a1408', L => { sombrear(L, (x, y) => x >= 17 && x < 22 && y >= 18 && y < 23, 19.5, 20.5, 3, 3, ['#f0c088', '#c8884a', '#8a5424', '#4a2a10']); }); g.rect(18, 20, 3, 1, '#e8353f');
    capa(g, '#12186a', L => sombrear(L, elipse(14, 22.5, 2.4, 2.4), 14, 22.5, 2.4, 2.4, R.azul));
    // garra: riel, cable y pinzas (se mueve)
    const cx = fr % 2 ? 15 : 10, dy = fr % 2 ? 4 : 0;
    g.rect(4, 9, 18, 1, '#8890a8'); g.rect(cx - 1, 9, 3, 2, '#c8d0dc');
    g.rect(cx, 11, 1, 3 + dy, '#5a6478');
    const gy = 14 + dy; g.rect(cx - 1, gy, 3, 2, '#c8d0dc'); [[-3, 0], [3, 0]].forEach(([dx]) => { g.rect(cx + dx, gy + 1, 1, 3, '#9aa4b8'); g.set(cx + dx + (dx < 0 ? 1 : -1), gy + 4, '#9aa4b8'); }); g.rect(cx - 2, gy + 1, 1, 1, '#9aa4b8'); g.rect(cx + 2, gy + 1, 1, 1, '#9aa4b8');
    g.set(5, 9, '#ffffff'); g.rect(4, 8, 1, 17, '#ffffff'); g.rect(4, 8, 1, 3, '#ffffff');   // brillo del cristal
    g.rect(2, 28, 22, 6, '#a02e70'); g.rect(2, 28, 22, 1, '#ff9ad0');   // panel de mando
    g.rect(5, 30, 1, 2, '#c0c8d8'); capa(g, null, L => { }); g.rect(4, 29, 3, 2, '#e8353f'); g.set(4, 29, '#ff9aa2');
    g.rect(10, 30, 3, 2, '#ffd84a'); g.rect(14, 30, 3, 2, '#4af0ff');
    g.rect(18, 29, 5, 4, '#12082a'); g.rect(19, 30, 3, 1, '#ffd84a');   // ranura de monedas
    g.rect(6, 34, 14, 3, '#12082a'); g.rect(7, 35, 12, 1, '#3a2048');   // buzón de premios
    g.rect(2, 37, 22, 1, '#5a1840');
    return g;
  }

  /* ---------- 65: TRAMPOLÍN ---------- */
  function trampolinGrid(fr) {
    const g = Grid(40, 20), s = fr ? 1 : 0;
    [[5, 0], [14, 0], [25, 0], [34, 0]].forEach(([x]) => { g.rect(x, 13, 2, 7, '#5a6478'); g.rect(x, 13, 1, 7, '#9aa4b8'); g.rect(x - 1, 19, 4, 1, '#3a4258'); });
    capa(g, '#5a0a18', L => sombrear(L, elipse(20, 11 + s, 19, 6), 20, 11 + s, 19, 6, R.rojo));
    capa(g, '#12186a', L => sombrear(L, elipse(20, 10 + s * 2, 15.5, 4 - s * .3), 20, 10 + s * 2, 15.5, 4, R.azul));
    for (let x = 7; x < 34; x += 3) g.set(x, 14 + s, (x / 3 | 0) % 2 ? '#c8d0dc' : '#5a6478');   // resortes
    g.rect(14, 8 + s * 2, 12, 1, '#8c88ff'); g.rect(17, 7 + s * 2, 6, 1, '#b0aeff');
    return g;
  }

  /* ---------- 70: GLOBO DE NIEVE GIGANTE ---------- */
  function globoNieveGrid(fr) {
    const g = Grid(28, 32);
    capa(g, '#2a1a40', L => sombrear(L, (x, y) => y >= 25 && y < 32 && x >= 4 && x < 24, 14, 28, 11, 5, R.madera));
    g.rect(5, 25, 18, 1, '#ffd84a'); g.rect(5, 30, 18, 1, '#d8a020');
    capa(g, '#5a7ab8', L => sombrear(L, elipse(14, 13.5, 13, 13), 14, 13.5, 13, 13, ['#f4fbff', '#cfe6ff', '#a0c4ee', '#7a9cd0']));
    const inB = (x, y) => elipse(14, 13.5, 11.8, 11.8)(x, y);
    for (let y = 17; y < 26; y++) for (let x = 0; x < 28; x++) if (inB(x, y) && elipse(14, 31, 14, 12.5)(x, y)) g.set(x, y, y < 19 ? '#ffffff' : '#e8f0fb');   // nieve del suelo
    g.rect(9, 16, 7, 5, '#e8353f'); g.rect(9, 16, 7, 1, '#ff9aa2'); g.rect(10, 12, 5, 4, '#a8603a'); for (let i = 0; i < 4; i++) g.rect(10 + i, 11 - i % 2 + (i > 1 ? 0 : 0), 1, 1, '#ffffff');
    g.rect(9, 17, 7, 1, '#ffffff'); g.rect(12, 18, 2, 3, '#ffd84a');   // casita con luz
    g.rect(10, 11, 5, 1, '#e8353f'); g.rect(11, 10, 3, 1, '#e8353f'); g.rect(12, 9, 1, 1, '#e8353f');
    [[19, 20], [20, 18], [20, 16]].forEach(([x, y], i) => g.rect(x, y, 1 + (i === 0 ? 0 : 0), 1, '#2f9a4a')); g.rect(19, 15, 3, 1, '#2f9a4a'); g.rect(18, 17, 5, 1, '#1d6a38'); g.rect(17, 19, 7, 1, '#2f9a4a'); g.rect(20, 14, 1, 1, '#2f9a4a'); g.rect(20, 20, 1, 2, '#6e4422');
    for (let i = 0; i < 16; i++) { const x = 4 + Math.floor(rn(i, 3) * 20), y = 3 + Math.floor((rn(i, 7) * 22 + fr * 3 * (1 + i % 2)) % 20); if (inB(x, y)) g.set(x, y, '#ffffff'); }   // nieve cayendo
    g.rect(7, 5, 2, 1, '#ffffff'); g.rect(6, 6, 1, 2, '#ffffff');   // brillo del vidrio
    return g;
  }

  /* ---------- 75: PLANETARIO (esfera de estrellas con anillo dorado) ---------- */
  function planetarioGrid(fr) {
    const g = Grid(32, 36), N = ['#6a7ae0', '#3a46a8', '#232a78', '#10143c'], cx = 16, cy = 15, R0 = 9.5;
    const anillo = (frente, grosor) => { for (let t = 0; t < 200; t++) { const a = t / 200 * 6.283, s = Math.sin(a); if ((s > 0) !== frente) continue; const x = cx + Math.cos(a) * 14.5, y = cy + s * 4.2 - Math.cos(a) * 1.6; for (let q = 0; q < grosor; q++) g.set(x, y + q, q === 0 ? ORO[0] : q === grosor - 1 ? ORO[3] : ORO[1]); } };
    capa(g, '#0c0a24', L => {   // pie: columna y base
      sombrear(L, (x, y) => y >= 27 && y < 36 && Math.abs(x + .5 - cx) <= 10 - (35 - y) * .06, cx, 31, 10, 5, MET);
      sombrear(L, (x, y) => y >= 23 && y < 28 && Math.abs(x + .5 - cx) <= 2.4, cx, 25, 3, 4, MET);
    });
    g.rect(cx - 6, 32, 12, 1, '#5a6478'); g.rect(cx - 2, 33, 4, 1, '#ffd84a');
    anillo(false, 1);   // mitad trasera del anillo, detrás de la esfera
    capa(g, '#0c0a24', L => sombrear(L, elipse(cx, cy, R0, R0), cx, cy, R0, R0, N));
    // agujeros de estrellas: la luz de adentro se asoma por la esfera (parpadean)
    for (let i = 0; i < 22; i++) { const a = rn(i, 7) * 6.283, r = Math.sqrt(rn(i, 8)) * (R0 - 1.8), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; g.set(x, y, (i + fr) % 5 === 0 ? '#ffffff' : (i + fr) % 3 === 0 ? '#ffe68a' : '#ffd84a'); if ((i + fr) % 7 === 0) { g.set(x + 1, y, '#9a8a5a'); g.set(x, y + 1, '#9a8a5a'); } }
    g.set(cx + 5, cy - 6, '#fffbd0'); g.set(cx + 6, cy - 7, '#ffffff');   // brillo del cristal
    anillo(true, 2);   // mitad delantera del anillo, cruza por delante
    return g;
  }

  /* ---------- 80: CAMPAMENTO ---------- */
  function campamentoGrid(fr) {
    const g = Grid(44, 30);
    capa(g, '#3a1a08', L => { for (let y = 5; y < 26; y++) { const hw = (y - 4) * .95; for (let x = 0; x < 28; x++) if (Math.abs(x + .5 - 14) <= hw) L.set(x, y, x + .5 < 14 ? (y % 6 < 3 ? '#ff9a3a' : '#f08428') : (y % 6 < 3 ? '#c85a10' : '#b04c0a')); } });
    capa(g, '#2a1004', L => { for (let y = 12; y < 26; y++) { const hw = (y - 11) * .5; for (let x = 0; x < 28; x++) if (Math.abs(x + .5 - 14) <= hw) L.set(x, y, '#3a1a0c'); } });
    g.rect(14, 16, 1, 10, '#241008'); g.rect(13, 2, 1, 5, '#6e4422'); g.rect(14, 2, 5, 3, '#e8353f'); g.rect(14, 2, 5, 1, '#ff9aa2');
    g.rect(0, 26, 44, 1, '#2f9a4a'); g.rect(0, 27, 44, 3, '#1d6a38'); for (let x = 1; x < 44; x += 4) g.set(x, 26, '#5ccf5a');
    for (let t = 0; t < 7; t++) { const a = t / 7 * 6.283; capa(g, '#2a2830', L => L.rect(Math.round(34 + Math.cos(a) * 6), Math.round(26 + Math.sin(a) * 2), 3, 2, t % 2 ? '#8890a8' : '#9aa4b8')); }
    capa(g, '#2a1408', L => { linea(L, 30, 27, 38, 24, '#a06a38'); linea(L, 30, 24, 38, 27, '#8a5a30'); linea(L, 30, 28, 38, 25, '#a06a38'); });
    const F = fr % 2 ? ['...o...', '..ooo..', '.oooyo.', 'ooyyyoo', 'oyyWyyo', '.yyWyy.'] : ['..o....', '..oo...', '.ooyoo.', 'ooyyyoo', 'oyyWyyo', '.yyWyy.'];
    g.art(31, 17, F, { o: '#ff6a28', y: '#ffd84a', W: '#fff6c0' });
    [[30, 13], [39, 11], [35, 8]].forEach(([x, y], i) => { if ((i + fr) % 2) g.set(x, y, '#ffe68a'); });
    return g;
  }

  /* ---------- 85: TERRARIO JURÁSICO ---------- */
  function terrarioGrid(fr) {
    const g = Grid(32, 28);
    g.rect(0, 0, 32, 3, '#3a3548'); g.rect(0, 0, 32, 1, '#6a647c'); g.rect(6, 3, 20, 1, '#ffe68a'); g.rect(8, 4, 16, 1, '#fff6c0');
    g.rect(1, 3, 30, 20, '#9ad8ff'); g.rect(2, 4, 28, 18, '#cdeefa'); g.rect(2, 4, 28, 6, '#e0f6ff');
    g.rect(2, 17, 28, 5, '#6e4422'); g.rect(2, 17, 28, 1, '#8a5a30'); for (let x = 3; x < 30; x += 3) g.set(x, 19 + (x % 2), '#4a2a10');
    [[5, 17, 9], [27, 17, 8], [22, 17, 6]].forEach(([x, y, h]) => { g.rect(x, y - h, 1, h, '#1d6a38'); for (let i = 0; i < h; i += 2) { g.rect(x - 2 - (i % 4 ? 0 : 1), y - h + i + 1, 2, 1, '#2f9a4a'); g.rect(x + 1, y - h + i + 1, 2 + (i % 4 ? 0 : 1), 1, '#5ccf5a'); } });
    capa(g, '#12432a', L => {   // braquiosaurio
      sombrear(L, elipse(15, 15, 6, 3.2), 15, 15, 6, 3.2, R.verde);
      const hy = fr % 2 ? 6 : 7; L.rect(10, 9, 2, 6, '#5ccf5a'); L.rect(9, hy + 1, 3, 3, '#5ccf5a'); L.rect(8, hy, 3, 2, '#b2f088'); L.rect(10, 12, 1, 3, '#2f9a4a');
      L.rect(12, 17, 2, 2, '#2f9a4a'); L.rect(17, 17, 2, 2, '#2f9a4a'); L.rect(20, 15, 3, 1, '#2f9a4a'); L.rect(22, 14, 2, 1, '#2f9a4a');
    });
    g.set(9, (fr % 2 ? 6 : 7) + 1, '#0e0e18'); [[13, 13], [16, 12], [18, 14]].forEach(([x, y]) => g.set(x, y, '#2f9a4a'));
    [[8, 5], [24, 8], [14, 6]].forEach(([x, y], i) => g.set(x, y - ((fr + i) % 2), '#ffffff'));   // vapor
    g.rect(0, 22, 32, 6, '#3a3548'); g.rect(0, 22, 32, 1, '#6a647c'); g.rect(13, 24, 6, 2, '#ffd84a'); g.rect(14, 24, 4, 1, '#fff6b0');
    return g;
  }

  /* ---------- 90: ROBOT CORTEX ---------- */
  function robotCortexGrid(fr) {
    const g = Grid(24, 28), BR = ['#f0c088', '#c8884a', '#8a5424', '#4a2a10'], NA = ['#ffc060', '#ff8a20', '#c85a10', '#6a2a08'], NE = ['#4a4458', '#2a2636', '#171420', '#0c0a12'];
    capa(g, '#e03040', L => [-1, 1].forEach(sg => { for (let t = 0; t < 8; t++) { L.rect(Math.round(12 + sg * (6 + t * .8)) - 1, 9 + t, 2, 2, NE[2]); } }));
    capa(g, '#2a0610', L => { L.rect(7, 21, 4, 4, '#d02838'); L.rect(13, 21, 4, 4, '#d02838'); });
    [9, 15].forEach(cx => { capa(g, '#2a2636', L => sombrear(L, elipse(cx, 25.5, 3.6, 2), cx, 25.5, 3.6, 2, R.piel)); g.rect(cx - 3, 25, 6, 1, '#e8353f'); });
    capa(g, '#4a2a10', L => caja(L, 7, 13, 10, 8, NA));
    g.rect(10, 15, 4, 1, '#fff0a0'); g.rect(11, 17, 2, 2, '#e8353f');   // pecho
    capa(g, '#2a1408', L => caja(L, 4, 3, 16, 10, BR));
    g.rect(11, 0, 2, 3, '#8890a8'); capa(g, '#4a0810', L => sombrear(L, elipse(12, 0.5, 2, 1.6), 12, 0.5, 2, 1.6, ['#ff7080', '#d02030', '#8a1020', '#4a0810']));
    if (fr % 2) g.set(12, 0, '#ffffff');
    g.rect(6, 6, 12, 4, '#171420'); g.rect(7, 7, 4, 2, fr % 2 === 0 ? '#ff4a5a' : '#d02030'); g.rect(13, 7, 4, 2, fr % 2 === 0 ? '#ff4a5a' : '#d02030'); g.set(7, 7, '#ffd0d4'); g.set(13, 7, '#ffd0d4');
    g.rect(9, 11, 6, 1, '#4a2a10'); g.set(8, 11, '#4a2a10'); g.set(15, 11, '#4a2a10');
    g.rect(2, 14, 3, 5, '#8890a8'); g.rect(19, 14, 3, 5, '#8890a8'); g.rect(2, 14, 3, 1, '#c8d0dc'); g.rect(19, 14, 3, 1, '#c8d0dc');   // brazos
    return g;
  }

  /* ---------- 95: FUENTE DE LOS DESEOS ---------- */
  function fuenteGrid(fr) {
    const g = Grid(38, 38), AG = ['#e8f8ff', '#7ac4ff', '#3a9ae8', '#2268c0'];
    capa(g, '#2a2c48', L => { sombrear(L, elipse(19, 31, 18.5, 6), 19, 31, 18.5, 6, PIE); });
    g.rect(2, 29, 34, 1, '#2268c0'); capa(g, null, L => { }); 
    for (let y = 26; y < 34; y++) for (let x = 0; x < 38; x++) if (elipse(19, 30.5, 15, 3.8)(x, y)) g.set(x, y, (x + y + fr) % 7 === 0 ? AG[0] : y < 29 ? AG[1] : AG[2]);
    [[10, 31], [15, 32], [24, 32], [28, 30], [21, 31]].forEach(([x, y], i) => { g.set(x, y, ORO[1]); if ((i + fr) % 3 === 0) g.set(x, y - 1, '#ffffff'); });   // monedas en el fondo
    capa(g, '#2a2c48', L => { sombrear(L, (x, y) => y >= 13 && y < 28 && x >= 16 && x < 22, 19, 20, 4, 8, PIE); sombrear(L, elipse(19, 14.5, 10, 3.5), 19, 14.5, 10, 3.5, PIE); });
    for (let y = 11; y < 18; y++) for (let x = 0; x < 38; x++) if (elipse(19, 13.6, 8, 2.2)(x, y)) g.set(x, y, (x + fr) % 5 === 0 ? AG[0] : AG[1]);
    g.rect(18, 6, 2, 8, '#8890a8');
    capa(g, '#c88a10', L => { L.art(15, 0, ['..y..', '..y..', 'yyyyy', '.yyy.', '.y.y.'], { y: ORO[1] }); }); g.set(17, 2, ORO[0]);
    const ch = fr % 2 ? [[19, 8, 15, 11], [19, 8, 23, 11]] : [[19, 7, 14, 12], [19, 7, 24, 12]];
    ch.forEach(([x0, y0, x1, y1]) => { for (let t = 0; t <= 6; t++) { const k = t / 6; g.set(Math.round(x0 + (x1 - x0) * k), Math.round(y0 + (y1 - y0) * k + Math.sin(k * 3.14) * -2), AG[0]); } });
    [[6, 24], [31, 23], [18, 20]].forEach(([x, y], i) => { if ((i + fr) % 2) { g.set(x, y, '#ffffff'); g.set(x - 1, y, AG[0]); g.set(x + 1, y, AG[0]); g.set(x, y - 1, AG[0]); g.set(x, y + 1, AG[0]); } });   // destellos
    return g;
  }

  /* ---------- 100: PORTAL ESTELAR ---------- */
  function portalGrid(fr, tono) {
    const W = 46, H = 56, g = Grid(W, H), cx = 23, cy = 31;
    const TN = [['#08051c', '#2a1a8a', '#6a4af0', '#4af0ff', '#ffffff'], ['#1a1004', '#8a5a08', '#e8a820', '#ffe68a', '#ffffff'], ['#1c0408', '#7a1020', '#d02838', '#ff8a6a', '#ffffff'], ['#04101c', '#104a8a', '#3a9af0', '#9ad8ff', '#ffffff']][tono || 0];
    const dentro = (x, y) => { const dx = (x + .5 - cx) / 14, dy = (y + .5 - cy) / 21; return y < cy ? dx * dx + dy * dy <= 1 : Math.abs(dx) <= 1 && y < 52; };
    const borde = (x, y) => { const dx = (x + .5 - cx) / 19, dy = (y + .5 - cy) / 26.5; return y < cy ? dx * dx + dy * dy <= 1 : Math.abs(dx) <= 1 && y < 54; };
    capa(g, '#0c0a1c', L => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (borde(x, y)) L.set(x, y, (x + y) % 9 < 4 ? PIE[2] : PIE[3]); });
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (borde(x, y) && !dentro(x, y)) { const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => dentro(x + a, y + b)); if (near) g.set(x, y, ORO[1]); else if ((x * 3 + y * 5) % 17 === 0) g.set(x, y, TN[3]); }   // marco con runas
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (dentro(x, y)) {
      const dx = x + .5 - cx, dy = (y + .5 - cy) * .72, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
      const s = Math.sin(a * 2 + r * .55 - fr * Math.PI / 2), k = Math.sin(a * 3 - r * .3 + fr * Math.PI / 2 * .5);
      let c = s > .55 ? TN[3] : s > .1 ? TN[2] : s > -.4 ? TN[1] : TN[0];
      if (k > .9 && r > 3) c = TN[2];
      if (r < 3.2) c = TN[4]; else if (r < 5.5) c = TN[3];
      L_(x, y, c);
    }
    function L_(x, y, c) { g.set(x, y, c); }
    for (let i = 0; i < 24; i++) { const x = 10 + Math.floor(rn(i, 5) * 26), y = 8 + Math.floor(rn(i, 9) * 40); if (dentro(x, y) && (Math.abs(x - cx) > 5 || Math.abs(y - cy) > 6)) g.set(x, y, (i + fr) % 4 === 0 ? '#ffffff' : TN[3]); }
    g.rect(cx - 2, 0, 4, 3, ORO[1]); g.rect(cx - 1, 0, 2, 1, ORO[0]); g.rect(cx - 1, 3, 2, 1, ORO[2]);   // clave del arco
    capa(g, '#0c0a1c', L => { L.rect(3, 53, 40, 3, PIE[2]); L.rect(3, 53, 40, 1, PIE[0]); });
    return g;
  }


  const rgb = c => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const hex = a => '#' + ((1 << 24) | (Math.max(0, Math.min(255, Math.round(a[0]))) << 16) | (Math.max(0, Math.min(255, Math.round(a[1]))) << 8) | Math.max(0, Math.min(255, Math.round(a[2])))).toString(16).slice(1);
  const mez = (a, b, t) => { const A = rgb(a), B = rgb(b); t = Math.max(0, Math.min(1, t)); return hex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]); };
  const hh = (a, b, s) => { let h = (Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul((s || 0) + 1, 2246822519)) | 0; h = Math.imul(h ^ (h >>> 15), 2246822519); h = Math.imul(h ^ (h >>> 13), 3266489917); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  const suave = t => t * t * (3 - 2 * t);
  const ruido = (x, y, s) => { const xi = Math.floor(x), yi = Math.floor(y), fx = suave(x - xi), fy = suave(y - yi); const a = hh(xi, yi, s), b = hh(xi + 1, yi, s), c = hh(xi, yi + 1, s), d = hh(xi + 1, yi + 1, s); return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fy; };
  const dent = (v, n) => { const q = Math.round(v * n) / n; return q; };   // pocos tonos: se ve como pixel art

  const PP = {
    // c = [cielo alto, cielo bajo, verde aurora, violeta aurora]
    aurora: (x, y, c) => {
      if (c.length < 4) c = [c[0], c[1], c[2], c[2]];
      let col = mez(c[0], c[1], Math.min(1, y / 70));
      [[22, 0.085, 0, 9, c[2]], [34, 0.06, 2.1, 7, c[3]], [14, 0.11, 4.0, 5, c[2]]].forEach(([yc, f, ph, th, ac], i) => {
        const cy = yc + Math.sin(x * f + ph) * 7 + Math.sin(x * f * 2.3 + ph) * 2.5, d = (y - cy) / th;
        if (d > -1 && d < 1.6) { const k = d < 0 ? 1 + d : Math.max(0, 1 - d / 1.6) ** 1.6; col = mez(col, ac, dent(k * (i === 2 ? .55 : .85), 5)); }
        if (d > -0.15 && d < .2 && Math.sin(x * .7 + ph) > .4) col = mez(col, '#d8fff0', .45);
      });
      const s = hh(x, y, 11); if (s > .985 && y < 66) col = '#ffffff'; else if (s > .968 && y < 66) col = mez(col, '#bfe8ff', .55);
      return col;
    },
    // c = [violeta profundo, nebulosa, magenta, cian]
    cosmos: (x, y, c) => {
      if (c.length < 4) c = [c[0], c[1], c[2], c[2]];
      const n = ruido(x * .05, y * .06, 3) * .6 + ruido(x * .11, y * .12, 5) * .3 + ruido(x * .23, y * .25, 8) * .1;
      let col = n > .66 ? mez(c[2], c[3], (n - .66) * 4) : n > .5 ? mez(c[1], c[2], (n - .5) * 6) : mez(c[0], c[1], dent(n * 1.5, 4));
      const s = hh(x, y, 21); if (s > .993) col = "#ffffff"; else if (s > .985) col = mez(col, "#ffe8a8", .7); else if (s > .975) col = mez(col, '#9ad8ff', .55);
      const cx = x % 120, px = 88, py = 24;   // planeta con anillos (se repite cada 120 px)
      const dx = cx - px, dy = y - py;
      const anillo = Math.abs((dx * dx) / 380 + (dy * dy) / 26 - 1) < .16 && dx * dx / 380 + dy * dy / 26 > 0;
      if (dx * dx + dy * dy <= 100) { const k = (-.5 * dx - .55 * dy) / 10, b = 2 + Math.floor(dy / 3.2); col = k > .35 ? '#ffe0a8' : (b % 2 ? '#e8a058' : '#d4884a'); if (k < -.35) col = '#8a4a30'; if (k < -.7) col = '#5a2a28'; if (dy > 2 && anillo && dx * dx / 380 + dy * dy / 26 < 1.1) col = '#f4d890'; }
      else if (anillo) col = (dy < 0 && Math.abs(dx) < 11) ? col : '#f4d890';
      const mx = cx - 22, my = y - 44; if (mx * mx + my * my <= 12) col = (mx + my < -1) ? '#f0f0f8' : '#a8a8c0';
      return col;
    }
  };
  const PF = {
    // c = [cielo, cielo claro, nube blanca]
    nubes: (x, y, c) => {
      let col = (x + y) % 2 === 0 && (y % 6 < 3) ? c[1] : c[0]; col = mez(c[0], c[1], dent(ruido(x * .08, y * .1, 4), 3) * .7);
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
        const ci = Math.floor(x / 30) + i, cj = Math.floor(y / 14) + j, cx = ci * 30 + 6 + hh(ci, cj, 1) * 18, cy = cj * 14 + 4 + hh(ci, cj, 2) * 6, s = .8 + hh(ci, cj, 3) * .6;
        if (hh(ci, cj, 4) < .2) continue;
        const e1 = ((x - cx) / (9 * s)) ** 2 + ((y - cy) / (3.2 * s)) ** 2, e2 = ((x - cx + 5 * s) / (5.5 * s)) ** 2 + ((y - cy + 2 * s) / (3 * s)) ** 2, e3 = ((x - cx - 4 * s) / (6 * s)) ** 2 + ((y - cy + 1.5 * s) / (3.2 * s)) ** 2;
        if (e1 <= 1 || e2 <= 1 || e3 <= 1) { const alto = e2 <= 1 || e3 <= 1; col = (y > cy + 1.2 * s) ? '#dcecff' : alto && y < cy - 1 ? '#ffffff' : c[2]; }
      }
      return col;
    },
    // c = [agua profunda, agua media, brillo, nenúfar]
    estanque: (x, y, c) => {
      const o = Math.sin(x * .22 + y * .35) + Math.sin(x * .13 - y * .28 + 1.7);
      let col = o > 1.3 ? c[1] : o > .3 ? mez(c[0], c[1], .5) : c[0];
      if (o > 1.7 && hh(x, y, 5) > .4) col = c[2];
      const A = 64, B = 30, ci = Math.floor(x / A), cj = Math.floor(y / B);
      for (let i = -1; i <= 1; i++) {   // carpa koi
        const qi = ci + i, fx = qi * A + 14 + hh(qi, cj, 7) * 30, fy = cj * B + 10 + hh(qi, cj, 8) * 10, dir = hh(qi, cj, 9) > .5 ? 1 : -1;
        if (hh(qi, cj, 10) < .35) continue;
        const dx = (x - fx) * dir, dy = y - fy;
        if ((dx / 7) ** 2 + (dy / 2.6) ** 2 <= 1) col = (Math.floor(dx / 3) + qi) % 2 ? '#ff8a2a' : '#fff4e8';
        else if (dx < -6 && dx > -11 && Math.abs(dy) < 3 - (-dx - 6) * .5) col = '#ff9a40';
        else if (dx > 4 && dx < 6 && Math.abs(dy) < 1.3) col = '#ff6a28';
        if (dx > 4 && dx < 5.5 && dy > -1 && dy < 0) col = '#10143c';
        const sx = (x - fx - 2 * dir) / 8, sy = (y - fy - 2.5) / 3; if (sx * sx + sy * sy <= 1 && sy > .2 && (dx / 7) ** 2 + (dy / 2.6) ** 2 > 1) col = mez(col, '#0a1e3a', .45);
      }
      const px = ci * A + 42 + hh(ci, cj, 12) * 12, py = cj * B + 18 + hh(ci, cj, 13) * 6, d2 = ((x - px) / 5.5) ** 2 + ((y - py) / 2.4) ** 2;   // nenúfar
      if (d2 <= 1) { col = d2 < .15 ? '#ff9ac8' : (x - px > 4 && Math.abs(y - py) < 1) ? c[0] : c[3]; if (d2 < .7 && d2 >= .15 && hh(x, y, 3) > .85) col = '#8ae88a'; }
      return col;
    }
  };

  /* ---------- registro: muebles ---------- */
  const luna = () => (typeof lunaOroT === 'function' && lunaOroT()) ? 1 : (typeof lunaSangreT === 'function' && lunaSangreT()) ? 2 : (typeof lunaAzulT === 'function' && lunaAzulT()) ? 3 : 0;   // portal: dorada / sangre / azul
  let trampT = 0, nieveT = 0;   // cuadros de "rebote" del trampolín y de "agitado" del globo tras tocarlos
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const tonoLava = () => { const h = new Date().getHours(); return h >= 6 && h < 14 ? 0 : h >= 14 && h < 22 ? 1 : 2; };   // rosa de día, turquesa de tarde, naranja de noche
  window.tonoLavaHoy = tonoLava; window.lunaPortal = luna;   // los usa mundo/luces_muebles.js
  const M = [   // clave, nombre, nivel, tema, cuadro base, animación, extras
    ['lampara_lava', 'LÁMPARA DE LAVA', 55, 'todas', () => lavaGrid(0, 0), () => { const t = tonoLava(), f = (tk >> 4) & 3; return { key: 'mu_lava' + t + f, grid: () => lavaGrid(f, t) }; }, { luz: true, dice: ['Mira cómo flota...', 'Es hipnotizante.', 'Blup, blup.'] }],
    ['maq_garra', 'MÁQUINA DE GARRA', 60, 'juegos', () => garraGrid(0), () => { const f = (tk >> 5) & 1; return { key: 'mu_garra' + f, grid: () => garraGrid(f) }; }, { luz: true, dice: ['¡Casi lo agarro!', 'Uno más y me llevo el peluche.', 'La garra siempre se resbala...'] }],
    ['trampolin', 'TRAMPOLÍN', 65, 'jardin', () => trampolinGrid(0), () => { const f = tk < trampT ? 1 : 0; return { key: 'mu_tramp' + f, grid: () => trampolinGrid(f) }; }, { fn: () => { trampT = tk + 14; if (typeof gesto === 'function') { gesto('salto'); setTimeout(() => gesto('salto'), 420); } decir(pick(['¡Boing!', '¡Más alto!', '¡Wiii!'])); } }],
    ['globo_nieve', 'GLOBO DE NIEVE GIGANTE', 70, 'todas', () => globoNieveGrid(0), () => { const f = tk < nieveT ? (tk >> 1) & 3 : (tk >> 4) & 3; return { key: 'mu_globo' + f, grid: () => globoNieveGrid(f) }; }, { fn: () => { nieveT = tk + 60; decir(pick(['¡Nieva adentro!', 'Qué bonito...', 'Lo agité muy fuerte.'])); } }],
    ['planetario', 'PLANETARIO', 75, 'todas', () => planetarioGrid(0), () => { const f = (tk >> 4) % 8; return { key: 'mu_plan' + f, grid: () => planetarioGrid(f) }; }, { luz: true, dice: ['Cada puntito es una estrella.', 'Ahí vivo yo... creo.', 'Me gusta mirarlo de noche.'] }],
    ['campamento', 'CAMPAMENTO', 80, 'jardin', () => campamentoGrid(0), () => { const f = (tk >> 3) & 1; return { key: 'mu_camp' + f, grid: () => campamentoGrid(f) }; }, { dice: ['Huele a malvaviscos.', 'Cuéntame una historia de miedo.', 'Qué calentito.'] }],
    ['terrario', 'TERRARIO JURÁSICO', 85, 'todas', () => terrarioGrid(0), () => { const f = (tk >> 5) & 1; return { key: 'mu_terra' + f, grid: () => terrarioGrid(f) }; }, { dice: ['¡Roaaar chiquito!', 'Es un dinosaurio en miniatura.', 'No lo despiertes.'] }],
    ['robot_cortex', 'ROBOT CORTEX', 90, 'todas', () => robotCortexGrid(0), () => { const f = (tk % 150) < 6 ? 1 : 0; return { key: 'mu_robot' + f, grid: () => robotCortexGrid(f) }; }, { dice: ['*bip bip* Hola, Simon.', 'Cortex dice que no lo toques.', '*bzzz* Calculando cariño...'] }],
    ['fuente_deseos', 'FUENTE DE LOS DESEOS', 95, 'jardin', () => fuenteGrid(0), () => { const f = (tk >> 3) & 1; return { key: 'mu_fuente' + f, grid: () => fuenteGrid(f) }; }, { fn: () => { decir(pick(['Pido un deseo... ¡shhh!', '*lanza una moneda*', 'Deseo... más keke.', 'Deseo que Cortex sea feliz.'])); if (typeof estrellas === 'function') estrellas(8); if (typeof corazones === 'function') corazones(2); } }],
    ['portal_estelar', 'PORTAL ESTELAR', 100, 'todas', () => portalGrid(0, 0), () => { const t = luna(), f = (tk >> 3) & 3; return { key: 'mu_portal' + t + f, grid: () => portalGrid(f, t) }; }, { luz: true, fn: () => { if (typeof irEspacial === 'function') irEspacial(); } }]
  ];
  M.forEach(([k, n, nv, tema, grid, anim, x]) => {
    ITEMS[k] = Object.assign({ tipo: 'cuarto', slot: 'deco', n, p: 0, nv, grid, tema, anim, regalo: 'nivel', val: nv * 15, tap: 'fn' }, x.luz ? { luz: true } : {});
    ITEMS[k].tapFn = x.fn || (() => decir(pick(x.dice)));
    ORDEN.cuarto.push(k);
  });

  /* ---------- registro: pisos y paredes ---------- */
  Object.assign(PAT_P, { aurora: PP.aurora, cosmos: PP.cosmos }); Object.assign(PAT_F, { nubes: PF.nubes, estanque: PF.estanque });
  [   // clave, nombre, nivel, tipo, patrón, colores, franja baja
    ['f_nubes', 'NUBES', 25, 'piso', 'nubes', ['#8cc4ff', '#b4dcff', '#ffffff']],
    ['p_aurora', 'AURORA BOREAL', 50, 'pared', 'aurora', ['#040a22', '#0c1c46', '#4affb0', '#a05af0'], ['#070f30', '#0a1840', '#3a8a9a']],
    ['f_estanque', 'ESTANQUE CON KOI', 75, 'piso', 'estanque', ['#143c66', '#1f5a8c', '#9ad8ff', '#3a9a52']],
    ['p_cosmos', 'CÓSMICA', 100, 'pared', 'cosmos', ['#0a0824', '#2a1468', '#a02a9a', '#3ac8ff'], ['#0a0824', '#160e44', '#3a1a7a']]
  ].forEach(([k, n, nv, tipo, pat, col, wain]) => {
    ITEMS[k] = { tipo: 'cuarto', slot: tipo, n, p: 0, nv, pat, col, wain, tema: 'sala', estilo: tipo, regalo: 'nivel', val: nv * 8 };
    ORDEN.cuarto.push(k);
  });
  })();
