  /* ===================== SALAS: JUEGOS, COCINA Y ENTRADA ===================== */
  const arcPos = () => ({ x: OX + 2, y: RY + 35 - 72, w: 32, h: 72 });
  function juegosGrid(W, H, RY, OX, S) {
    S = S || {}; const g = Grid(W, H), FY = RY + 35;
    for (let y = 0; y < FY; y++) for (let x = 0; x < W; x++) g.set(x, y, S.p ? PAT_P[S.p.pat](x, y, S.p.col) : (x % 14 < 7) ? '#3a2a6e' : '#34265f');
    if (!S.p) for (let y = 0; y < FY; y += 12) g.rect(0, y, W, 1, '#2a1e52');
    g.rect(0, 0, W, 3, '#1e1640'); g.rect(0, 3, W, 1, '#6a4ad8');
    [[44, 20], [66, 11], [74, 40], [118, 14], [58, 70], [100, 30], [44, 60]].forEach(([x, y]) => { g.set(OX + x, y, '#8a7ae8'); g.set(OX + x - 1, y, '#5a4aa8'); g.set(OX + x + 1, y, '#5a4aa8'); g.set(OX + x, y - 1, '#5a4aa8'); g.set(OX + x, y + 1, '#5a4aa8'); });
    // repisa con trofeos (derecha)
    g.rect(OX + 78, RY - 6, 40, 2, '#6a4a2a'); g.rect(OX + 78, RY - 6, 40, 1, '#8a6a3a');
    g.rect(OX + 78, RY - 25, 40, 2, '#6a4a2a'); g.rect(OX + 78, RY - 25, 40, 1, '#8a6a3a');
    // piso
    for (let y = FY; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, S.f ? PAT_F[S.f.pat](x, y - FY, S.f.col) : (((x / 8) | 0) + ((y - FY) / 8 | 0)) % 2 ? '#2a2058' : '#3a2c78');
    g.rect(0, FY, W, 2, '#ff5ac8'); g.rect(0, FY + 2, W, 1, '#7a2a78');
    // puf rosa (derecha)
    g.rect(OX + 92, FY + 5, 22, 4, '#a82a78'); g.rect(OX + 90, FY - 2, 26, 8, '#e84aa8'); g.rect(OX + 92, FY - 4, 22, 3, '#ff7ac8'); g.rect(OX + 96, FY - 3, 8, 1, '#ffb0e0');
    // máquina arcade grande
    const a = arcPos(), x = a.x, y = a.y, K = '#14163a';
    g.rect(x, y, 32, 72, K); g.rect(x + 1, y + 1, 30, 70, '#3a3ac0'); g.rect(x + 1, y + 1, 3, 70, '#5a5ae8'); g.rect(x + 28, y + 1, 3, 70, '#2a2a8a');
    g.rect(x + 3, y + 2, 26, 9, '#ff3a8a'); g.rect(x + 3, y + 2, 26, 1, '#ff8ac0'); g.rect(x + 3, y + 10, 26, 1, '#a0185a');
    for (let i = 0; i < 7; i++) g.rect(x + 5 + i * 3 + (i % 2), y + 5, 2, 2, '#ffe45a');
    g.rect(x + 3, y + 13, 26, 34, '#6a6ad8'); g.rect(x + 4, y + 14, 24, 32, '#04041a');
    g.rect(x + 3, y + 49, 26, 10, '#2a2a70'); g.rect(x + 3, y + 49, 26, 1, '#4a4aa8'); g.rect(x + 3, y + 58, 26, 1, '#14143c');
    g.rect(x + 8, y + 53, 2, 5, '#9aa4b8'); g.rect(x + 6, y + 50, 6, 4, '#ff3a3a'); g.rect(x + 7, y + 50, 2, 1, '#ff9a9a');
    g.rect(x + 17, y + 52, 4, 4, '#ffd84a'); g.rect(x + 23, y + 52, 4, 4, '#4adfff');
    g.rect(x + 3, y + 61, 26, 9, '#2c2c9c'); g.rect(x + 11, y + 63, 10, 6, '#14143c'); g.rect(x + 15, y + 64, 2, 4, '#ffd84a');
    g.rect(x + 2, y + 70, 28, 2, K);
    return g;
  }
  function arcadeVivo() {   // pantalla animada y flechita parpadeante
    const a = arcPos(), t = tk >> 2, ax = a.x + 4, ay = a.y + 14;
    ctx.fillStyle = '#04041a'; ctx.fillRect(ax, ay, 24, 32);
    ctx.fillStyle = '#ffffff'; [[3, 4], [18, 9], [10, 20], [20, 27], [5, 15]].forEach(([x, y], i) => { if ((t + i) % 3) ctx.fillRect(ax + x, ay + y, 1, 1); });
    const nx = Math.round(8 + Math.sin(t / 2) * 8), inv = (t >> 1) % 2;
    ctx.fillStyle = '#5aff7a'; [[1, 0], [5, 0], [2, 1], [4, 1], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [0, 3], [1, 3], [3, 3], [5, 3], [6, 3], [1, 4 + inv], [5, 4 + inv]].forEach(([dx, dy]) => ctx.fillRect(ax + nx + dx, ay + 4 + dy, 1, 1));
    ctx.fillStyle = '#ff9a3a'; const nx2 = Math.round(8 + Math.sin(t / 2 + 2) * 8); [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [3, 2]].forEach(([dx, dy]) => ctx.fillRect(ax + nx2 + dx, ay + 14 + dy, 1, 1));
    ctx.fillStyle = '#ffe45a'; const nave = Math.round(10 + Math.sin(t / 3 + 1) * 8); ctx.fillRect(ax + nave + 2, ay + 28, 3, 1); ctx.fillRect(ax + nave + 3, ay + 27, 1, 1);
    if (t % 5 < 3) { ctx.fillStyle = '#ff5a5a'; ctx.fillRect(ax + nave + 3, ay + 23 - (t % 5) * 3, 1, 2); }
    if ((tk >> 3) % 2 && !dlg && !modal) { ctx.fillStyle = '#ffe45a'; ctx.fillRect(a.x + 11, a.y - 7, 10, 1); ctx.fillRect(a.x + 12, a.y - 6, 8, 1); ctx.fillRect(a.x + 13, a.y - 5, 6, 1); ctx.fillRect(a.x + 14, a.y - 4, 4, 1); ctx.fillRect(a.x + 15, a.y - 3, 2, 1); }
  }
  const repisasCoc = (OX, RY, W) => {   // x0, x1, base, alto máximo: solo las dos repisas inferiores para dejar la pared libre
    return [[OX + 52, OX + 82, RY - 40, RY - 46], [OX + 88, OX + 118, RY - 40, RY - 46]];
  };
  function cocinaGrid(W, H, RY, OX, S) {   // cocina moderna: azulejo metro blanco, muebles blancos con cubierta de madera, campana y ventana de madera
    S = S || {}; const g = Grid(W, H), dy = RY - 59, FY = RY + 35, M = '#c8a070';
    for (let y = 0; y < RY + 5; y++) for (let x = 0; x < W; x++) g.set(x, y, S.p ? PAT_P[S.p.pat](x, y, S.p.col) : '#f2f0ea');
    if (!S.p) for (let y = 22; y < RY + 4; y++) for (let x = 0; x < W; x++) { const r = ((y - 22) / 6) | 0, xo = (x + (r % 2) * 6) % 12; g.set(x, y, (y - 22) % 6 === 5 || xo === 11 ? '#d8d4ca' : (xo === 0 || (y - 22) % 6 === 0) ? '#ffffff' : '#fbfaf6'); }
    g.rect(0, 0, W, 3, '#e0dcd0'); g.rect(0, 3, W, 1, '#b8b2a2');
    if (S.p) for (let y = RY - 4; y < FY; y++) for (let x = 0; x < W; x++) g.set(x, y, PAT_P.azulejo(x, y, S.p.wain));
    // piso de tarima clara
    for (let y = FY; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, S.f ? PAT_F[S.f.pat](x, y - FY, S.f.col) : PAT_F.tablones(x, y - FY, ['#e8d0a8', '#e0c898', '#c8a878']));
    g.rect(0, FY, W, 3, '#f4f2ec'); g.rect(0, FY + 3, W, 1, '#b8b2a2');
    // mueble bajo blanco con cubierta de madera
    g.rect(0, RY + 3, W, 4, M); g.rect(0, RY + 3, W, 1, '#e8c898'); g.rect(0, RY + 6, W, 1, '#8a6a44');
    g.rect(0, RY + 7, W, FY - RY - 7, '#e8e6e0');
    for (let x = 0; x < W; x += 30) { g.rect(x + 1, RY + 9, 28, FY - RY - 12, '#fafaf8'); g.rect(x + 1, RY + 9, 28, 1, '#ffffff'); g.rect(x + 1, RY + FY - RY - 4, 28, 1, '#d0ccc2'); g.rect(x + 12, RY + 11, 6, 1, '#8a8478'); }
    g.rect(0, FY - 3, W, 3, '#b8b4aa');
    // ventana con marco de madera (el cielo se dibuja detrás)
    g.rect(OX + 9, dy + 13, 40, 44, '#6a5440'); g.rect(OX + 9, dy + 13, 40, 1, '#8a6e56'); g.clear(12 + OX, 16 + dy, 34, 38);
    g.rect(OX + 28, dy + 16, 2, 38, '#6a5440'); g.rect(OX + 12, dy + 34, 34, 2, '#6a5440');
    g.rect(OX + 6, dy + 57, 46, 3, '#f4f0e6'); g.rect(OX + 6, dy + 57, 46, 1, '#ffffff'); g.rect(OX + 6, dy + 59, 46, 1, '#c8c2b4');
    // lavabo de acero con grifo alto (junto a la estufa)
    const lx = OX + 36;
    g.rect(lx, RY + 2, 17, 2, '#8a98a4'); g.rect(lx, RY + 1, 17, 1, '#c8d4dc'); g.rect(lx + 7, RY - 9, 2, 9, '#a8b4c0'); g.rect(lx + 7, RY - 10, 7, 2, '#a8b4c0'); g.rect(lx + 13, RY - 8, 1, 2, '#7ac8ff');
    // bomba de kekes (dispensador de keke)
    { const bx = OX + 62, by = RY - 16;
      g.rect(bx + 1, by, 6, 1, '#e8333f');       // tapa
      g.rect(bx, by + 1, 8, 10, '#ff7a8a');       // cuerpo rosado
      g.rect(bx, by + 1, 8, 1, '#ffaaaa');        // brillo
      g.rect(bx + 1, by + 11, 6, 2, '#c84a5a');   // base más oscura
      g.rect(bx + 2, by + 3, 4, 6, '#fff6ea');    // etiqueta blanca
      // keke mini en la etiqueta
      g.set(bx + 3, by + 4, '#e8333f'); g.set(bx + 4, by + 4, '#e8333f');
      g.set(bx + 2, by + 5, '#ffd084'); g.set(bx + 3, by + 5, '#ffd084'); g.set(bx + 4, by + 5, '#ffd084'); g.set(bx + 5, by + 5, '#ffd084');
      g.set(bx + 2, by + 6, '#c88a40'); g.set(bx + 3, by + 6, '#c88a40'); g.set(bx + 4, by + 6, '#c88a40'); g.set(bx + 5, by + 6, '#c88a40');
      g.rect(bx + 3, by - 2, 2, 2, '#c84a5a');    // pitón del dispensador
    }
    // ESTUFA de cocina: tablero con perillas, hornillas, sartén y horno con ventana
    const sx = OX + 1, FYc = RY + 35;
    g.rect(sx, RY - 7, 29, 5, '#5a626c'); g.rect(sx + 1, RY - 6, 27, 3, '#9aa4ae'); g.rect(sx + 1, RY - 6, 27, 1, '#d8e0e6');
    [4, 10, 16, 22].forEach(d => { g.rect(sx + d, RY - 5, 3, 2, '#2a2a30'); g.set(sx + d + 1, RY - 5, '#ffffff'); });
    g.rect(sx - 1, RY - 2, 31, 4, '#2a2c34'); g.rect(sx - 1, RY - 2, 31, 1, '#4a4e5a');
    [[3, '#ff6a40'], [17, '#ffb040']].forEach(([d, c2]) => { g.rect(sx + d, RY, 9, 2, '#14141a'); g.rect(sx + d + 1, RY, 7, 1, c2); });
    g.rect(sx + 3, RY - 7 + 0, 0, 0, '#000'); g.rect(sx + 2, RY - 4, 11, 3, '#1a1a20'); g.rect(sx + 3, RY - 4, 9, 1, '#4a4a56'); g.rect(sx + 13, RY - 3, 7, 1, '#2a2a30');
    g.rect(sx - 1, RY + 2, 31, FYc - RY - 5, '#8a949e'); g.rect(sx, RY + 3, 29, FYc - RY - 7, '#b8c2cc'); g.rect(sx, RY + 3, 29, 1, '#e8eef2');
    g.rect(sx + 3, RY + 8, 23, 15, '#4a525c'); g.rect(sx + 4, RY + 9, 21, 13, '#1c2028'); g.rect(sx + 5, RY + 10, 8, 2, '#3a4250'); g.rect(sx + 5, RY + 13, 3, 6, '#2a3040');
    g.rect(sx + 4, RY + 5, 21, 2, '#6a727c'); g.rect(sx + 4, RY + 5, 21, 1, '#d0d8de');
    g.rect(sx + 4, RY + 26, 21, 1, '#8a949e'); g.rect(sx + 2, FYc - 4, 25, 2, '#6a727c');
    // refri
    const fx = OX + 91;
    if (e.cuarto.refri && ITEMS[e.cuarto.refri]) refriDibuja(g, fx, RY, FY, e.cuarto.refri); else {
    g.rect(fx, RY - 26, 24, FY - RY + 25, '#5a6672'); g.rect(fx + 1, RY - 25, 22, FY - RY + 23, '#c8d0d8'); g.rect(fx + 1, RY - 25, 22, 1, '#eef4f8'); g.rect(fx + 1, RY - 25, 2, FY - RY + 23, '#e0e8f0'); g.rect(fx + 22, RY - 25, 1, FY - RY + 23, '#9aa6b2');
    g.rect(fx + 1, RY + 6, 22, 2, '#8a96a2'); g.rect(fx + 19, RY - 20, 2, 12, '#6a7682'); g.rect(fx + 19, RY + 10, 2, 14, '#6a7682'); g.rect(fx + 5, RY - 19, 8, 3, '#4ab8ff');
    g.art(fx + 5, RY - 10, ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'], { r: '#ff4a5c' });
    g.rect(fx + 4, RY + 14, 8, 6, '#ffd84a'); g.rect(fx + 4, RY + 14, 8, 1, '#fff6b0');
    }
    // repisas de madera vacías: ahí se colocan los objetos que el jugador quiera
    repisasCoc(OX, RY, W).forEach(([x0, x1, by]) => { const w = x1 - x0; g.rect(x0, by, w, 2, M); g.rect(x0, by, w, 1, '#e8c898'); g.rect(x0, by + 2, w, 1, '#8a6a44'); g.rect(x0 + 3, by + 3, 2, 4, '#8a6a44'); g.rect(x1 - 5, by + 3, 2, 4, '#8a6a44'); });
    return g;
  }
  function entradaGrid(W, H, RY, OX, S) {
    S = S || {}; const g = Grid(W, H), FY = RY + 35;
    for (let y = 0; y < RY + 5; y++) for (let x = 0; x < W; x++) g.set(x, y, S.p ? PAT_P[S.p.pat](x, y, S.p.col) : x % 12 < 6 ? '#a8d0a8' : '#9cc49c');
    g.rect(0, 0, W, 3, '#f0e6c8'); g.rect(0, 3, W, 1, '#b8a878');
    banderines(g, W, 6);
    g.rect(0, RY, W, 1, '#fffbe8'); g.rect(0, RY + 1, W, 3, '#f0e6c8'); g.rect(0, RY + 4, W, 1, '#6a9a74'); g.rect(0, RY + 5, W, 24, S.p ? S.p.wain[0] : '#7aaa84');
    if (S.p && S.p.wain.length > 2) { for (let y = RY + 5; y < RY + 29; y++) for (let x = 0; x < W; x++) g.set(x, y, PAT_P[S.p.pat](x, y, S.p.wain)); }
    else for (let px = 4; px < W; px += 29) { g.rect(px, RY + 9, 25, 16, S.p ? S.p.wain[1] : '#8cba94'); g.rect(px, RY + 9, 25, 1, S.p ? mixC(S.p.wain[1], .3) : '#a8d0b0'); g.rect(px, RY + 24, 25, 1, S.p ? mixC(S.p.wain[1], -.35) : '#5a8a64'); }
    g.rect(0, RY + 29, W, 6, '#f0e6c8'); g.rect(0, RY + 29, W, 1, '#fffbe8'); g.rect(0, RY + 33, W, 2, '#b8a878');
    for (let y = FY; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, S.f ? PAT_F[S.f.pat](x, y - FY, S.f.col) : (((x / 12) | 0) + ((y - FY) / 6 | 0)) % 2 ? '#a89a88' : '#b8aa98');
    if (!S.f) for (let y = FY; y < H; y += 6) g.rect(0, y, W, 1, '#7a6e60');
    // puerta
    const dx = OX + 8, dt = RY - 40, dh = FY - dt - 1;
    g.rect(dx, dt, 38, dh + 1, '#4a2a10'); g.rect(dx + 2, dt + 2, 34, dh - 1, '#6e4422');
    g.rect(dx + 4, dt + 4, 30, dh - 5, '#a86a3c'); g.rect(dx + 4, dt + 4, 30, 1, '#d8a060'); g.rect(dx + 4, dt + 4, 1, dh - 5, '#d8a060'); g.rect(dx + 33, dt + 4, 1, dh - 5, '#7a4a24');
    [[8, 8], [21, 8]].forEach(([ox, oy]) => { g.rect(dx + ox, dt + oy, 13, 22, '#5a3a1c'); g.rect(dx + ox + 1, dt + oy + 1, 11, 20, '#bfe4ff'); g.rect(dx + ox + 1, dt + oy + 1, 11, 6, '#e0f4ff'); g.rect(dx + ox + 6, dt + oy + 1, 1, 20, '#5a3a1c'); g.rect(dx + ox + 1, dt + oy + 10, 11, 1, '#5a3a1c'); });
    [[8, 34], [21, 34]].forEach(([ox, oy]) => { g.rect(dx + ox, dt + oy, 13, dh - oy - 10, '#8a5430'); g.rect(dx + ox, dt + oy, 13, 1, '#6a3a1c'); g.rect(dx + ox + 12, dt + oy, 1, dh - oy - 10, '#d8a060'); g.rect(dx + ox, dt + dh - 11, 13, 1, '#d8a060'); });
    g.rect(dx + 29, dt + 38, 3, 3, '#ffd84a'); g.set(dx + 29, dt + 38, '#fff6b0');
    // tapete
    g.rect(OX + 6, FY + 6, 40, 9, '#8a1c28'); g.rect(OX + 7, FY + 7, 38, 7, '#c23a48'); g.rect(OX + 10, FY + 10, 32, 1, '#f4eed8');
    // perchero, sombrero y bufanda
    const px = OX + 100;
    g.rect(px, RY - 22, 2, FY - RY + 20, '#6e4422'); g.rect(px - 5, FY - 3, 12, 3, '#4a2a10'); g.rect(px - 4, RY - 24, 10, 2, '#6e4422');
    g.rect(px - 7, RY - 18, 6, 2, '#8a5630'); g.rect(px + 3, RY - 14, 7, 2, '#8a5630');
    g.art(px - 10, RY - 16, ['..rrrr..', '.rrrrrr.', 'rrrrrrrr', 'wwwwwwww'], { r: '#e8353f', w: '#f4eed8' });
    g.rect(px + 5, RY - 12, 4, 14, '#3a47a8'); g.rect(px + 5, RY - 12, 1, 14, '#6a78d8'); g.rect(px + 4, RY + 1, 6, 3, '#ffd84a');
    g.rect(px - 7, RY + 22, 11, 14, '#5a3a1c'); g.rect(px - 6, RY + 23, 9, 12, '#7a5a30'); g.rect(px + 1, RY + 10, 2, 13, '#232b63');
    // cuadrito con la corona
    g.rect(OX + 84, RY - 44, 28, 18, '#6e4422'); g.rect(OX + 85, RY - 43, 26, 16, '#e8c04a'); g.rect(OX + 87, RY - 41, 22, 12, '#f4eed8'); g.paste(coronaGrid(), OX + 87, RY - 41);
    return g;
  }
