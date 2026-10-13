  /* ===================== EL CUARTO ===================== */
  const ESTRELLAS = [[16, 22], [24, 34], [38, 20], [20, 46], [42, 44], [33, 30], [15, 38], [41, 29]];

  function cieloGrid(noche) {
    const g = Grid(60, 64);
    const X0 = 12, Y0 = 16, X1 = 46, Y1 = 54;
    const c = noche ? ['#0c1038', '#141a50', '#1e2770', '#2a3490'] : ['#62b8ff', '#86cdff', '#aee0ff', '#d4f0ff'];
    for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) {
      const t = (y - Y0) / (Y1 - Y0) * 3 + (BAY[y & 3][x & 3] / 16 - .5) * .8;
      g.set(x, y, c[Math.max(0, Math.min(3, Math.floor(t + .3)))]);
    }
    if (noche) {
      capa(g, null, L => { L.rect(0, 0, 0, 0, '#000'); });
      const luna = elipse(36, 26, 5.5, 5.5), hueco = elipse(38.5, 24, 5, 5);
      for (let y = 18; y < 36; y++) for (let x = 28; x < 46; x++) if (luna(x, y) && !hueco(x, y)) g.set(x, y, BAY[y & 3][x & 3] > 9 ? '#fff7cc' : '#ffefa0');
      ESTRELLAS.forEach(([x, y]) => g.set(x, y, '#a9b4ff'));
      for (let y = 46; y < Y1; y++) for (let x = X0; x < X1; x++) { const h = 49 + Math.round(2 * Math.sin(x / 4)); if (y >= h) g.set(x, y, y > h + 1 ? '#0a1636' : '#10204a'); }
    } else {
      const sol = elipse(21, 26, 5.5, 5.5), halo = elipse(21, 26, 8.5, 8.5);
      for (let y = 16; y < 38; y++) for (let x = 12; x < 32; x++) {
        if (sol(x, y)) g.set(x, y, '#fff8b8');
        else if (halo(x, y) && (x + y) % 2 === 0) g.set(x, y, '#fff2a0');
      }
      [[36, 24, 7, 3], [32, 27, 6, 2], [18, 42, 6, 2], [21, 40, 5, 2]].forEach(([cx, cy, rx, ry]) => {
        const nube = elipse(cx, cy, rx, ry);
        for (let y = cy - ry - 1; y <= cy + ry + 1; y++) for (let x = cx - rx - 1; x <= cx + rx + 1; x++) if (nube(x, y)) g.set(x, y, y > cy ? '#dbe9ff' : '#ffffff');
      });
      for (let y = 44; y < Y1; y++) for (let x = X0; x < X1; x++) { const h = 47 + Math.round(2.5 * Math.sin(x / 5 + 1)); if (y >= h) g.set(x, y, y > h + 2 ? '#4aa04c' : '#6cc462'); }
    }
    return g;
  }

  // marco, cortinas y repisa de la ventana (el vidrio queda transparente para ver el cielo)
  function ventanaGrid() {
    const g = Grid(60, 64);
    g.rect(8, 12, 42, 46, '#5a3418'); g.rect(9, 13, 40, 44, '#c98a52'); g.rect(9, 13, 40, 1, '#e8b078'); g.rect(9, 13, 1, 44, '#e8b078');
    g.rect(28, 16, 2, 38, '#c98a52'); g.rect(12, 34, 34, 2, '#c98a52');
    g.rect(28, 16, 1, 38, '#e8b078'); g.rect(12, 34, 34, 1, '#e8b078');
    g.rect(6, 58, 46, 4, '#e8b078'); g.rect(6, 61, 46, 1, '#a06a38'); g.rect(6, 58, 46, 1, '#fff0d0');   // repisa de la ventana
    // cortinas rojas
    [[3, 10], [45, 10]].forEach(([x0]) => {
      capa(g, '#5a1420', L => {
        for (let y = 11; y <= 57; y++) for (let x = x0; x < x0 + 10; x++) L.set(x, y, ['#e8556a', '#c23a48', '#a82c3a', '#c23a48', '#e8556a'][(x - x0) % 5]);
        L.rect(x0, 39, 10, 3, '#e8c04a');
      });
    });
    g.rect(2, 8, 54, 3, '#5a3418'); g.rect(2, 8, 54, 1, '#c98a52'); g.rect(1, 7, 3, 5, '#e8c04a'); g.rect(55, 7, 3, 5, '#e8c04a');   // barra
    return g;
  }
  // cuadro de la corona, repisa con planta y libros
  function marcoDib(g, ox, oy, arte, mc) {
    g.rect(ox, oy, 38, 30, mc[0]); g.rect(ox + 1, oy + 1, 36, 28, mc[1]); g.rect(ox + 1, oy + 1, 36, 1, mc[2]); g.rect(ox + 1, oy + 1, 1, 28, mc[2]); g.rect(ox + 1, oy + 28, 36, 1, mc[3]); g.rect(ox + 36, oy + 1, 1, 28, mc[3]);
    g.rect(ox + 4, oy + 4, 30, 22, '#f4eed8'); g.rect(ox + 4, oy + 4, 30, 1, '#cfc8a8'); g.rect(ox + 4, oy + 4, 1, 22, '#cfc8a8');
    g.paste(arte, ox + 5, oy + 5);
  }
  function derechaGrid(arte, mc) {
    const g = Grid(120, 96);
    marcoDib(g, 66, 15, arte, mc);
    linea(g, 85, 14, 78, 8, '#7a5a30'); linea(g, 85, 14, 92, 8, '#7a5a30'); g.rect(84, 7, 3, 2, '#c8c8d8');
    return g;
  }
  function banderines(g, W, y0) {
    capa(g, '#3a2030', L => {
      const cols = ['#e8353f', '#e8c04a', '#4b6ae8', '#f4eed8'];
      for (let x = 0; x < W; x++) L.set(x, y0 + Math.round(5 * Math.sin(Math.PI * x / W)), '#6e4422');
      for (let k = 0, x = 4; x < W - 6; x += 9, k++) {
        const base = y0 + Math.round(5 * Math.sin(Math.PI * (x + 3) / W)) + 1;
        for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) if (Math.abs(i - 3) <= 3.4 * (1 - j / 7.5)) L.set(x + i, base + j, j === 0 ? '#ffffff' : cols[k % 4]);
      }
    });
  }
  function cuartoGrid(W, H, RY, rugCy, OX, P) {
    const g = Grid(W, H);
    const dy = RY - 59, FY = RY + 35;
    // ---- pared con rayas ----
    for (let y = 0; y < RY + 5; y++) for (let x = 0; x < W; x++) g.set(x, y, P.sty ? PAT_P[P.sty.pat](x, y, P.sty.col) : x % 12 < 6 ? P.pared[0] : P.pared[1]);
    for (let y = 0; y < 7; y++) for (let x = 0; x < W; x++) if (BAY[y & 3][x & 3] < (7 - y) * 2.4) g.set(x, y, P.pared[7]);   // sombra del techo
    g.rect(0, 0, W, 3, '#f0e6c8'); g.rect(0, 3, W, 1, '#b8a878');                // moldura
    // ---- riel y lambrín ----
    g.rect(0, RY, W, 1, '#fffbe8'); g.rect(0, RY + 1, W, 3, '#f0e6c8'); g.rect(0, RY + 4, W, 1, P.pared[6]);
    g.rect(0, RY + 5, W, 24, P.pared[2]);
    const wp = P.sty && P.sty.wain.length > 2; if (wp) for (let y = RY + 5; y < RY + 29; y++) for (let x = 0; x < W; x++) g.set(x, y, PAT_P[P.sty.pat](x, y, P.sty.wain));
    for (let px = 4; !wp && px < W; px += 29) {
      g.rect(px, RY + 9, 25, 16, P.pared[3]); g.rect(px, RY + 9, 25, 1, P.pared[4]); g.rect(px, RY + 9, 1, 16, P.pared[4]);
      g.rect(px, RY + 24, 25, 1, P.pared[5]); g.rect(px + 24, RY + 9, 1, 16, P.pared[5]);
    }
    // ---- zócalo ----
    g.rect(0, RY + 29, W, 6, '#f0e6c8'); g.rect(0, RY + 29, W, 1, '#fffbe8'); g.rect(0, RY + 33, W, 2, '#b8a878');
    // ---- piso de madera ----
    if (P.fl) { for (let y = FY; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, PAT_F[P.fl.pat](x, y - FY, P.fl.col)); } else {
    for (let y = FY; y < H; y++) { const fila = ((y - FY) / 8) | 0; for (let x = 0; x < W; x++) g.set(x, y, fila % 2 ? '#c58750' : '#cc8f56'); }
    let semilla = 7; const rnd = () => (semilla = (semilla * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let fila = 0; fila * 8 + FY < H; fila++) {
      const y = FY + fila * 8;
      g.rect(0, y, W, 1, '#8a5630'); g.rect(0, y + 1, W, 1, '#dfa66e');
      for (let x = (fila * 13 + 7) % 26; x < W; x += 26) g.rect(x, y + 1, 1, 7, '#8a5630');
      for (let i = 0; i < 9; i++) g.set(Math.floor(rnd() * W), y + 2 + Math.floor(rnd() * 5), rnd() > .5 ? '#b87a46' : '#d9995f');
    }
    }
    // ---- alfombra roja con borde crema ----
    const cx0 = Math.round(W / 2);
    const rugY = rugCy + 4;
    [[54, 17, P.alf[0]], [51, 15, P.alf[1]], [45, 12, P.alf[2]], [42, 10, P.alf[3]]].forEach(([rx, ry, c]) => {
      const t = elipse(cx0, rugY, rx, ry);
      for (let y = rugY - ry; y <= rugY + ry; y++) for (let x = cx0 - rx; x <= cx0 + rx; x++) if (t(x, y)) g.set(x, y, c);
    });
    for (let x = cx0 - 36; x <= cx0 + 36; x += 6) { g.set(x, rugY, '#f4e9c8'); g.set(x + 1, rugY - 1, '#f4e9c8'); g.set(x + 1, rugY + 1, '#f4e9c8'); g.set(x + 2, rugY, '#f4e9c8'); }
    // ---- ventana (izquierda) y cuadro + repisa (derecha) ----
    g.paste(ventanaGrid(), OX, dy);
    g.clear(12 + OX, 16 + dy, 34, 38);
    g.paste(derechaGrid(P.arte, P.mc), OX, dy);
    return g;
  }

