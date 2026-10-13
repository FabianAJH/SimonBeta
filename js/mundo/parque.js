  /* ===================== EL PARQUE ===================== */
  function parqueGrid(W, H, RY, cl) {
    const g = Grid(W, H), HY = RY + 8, nieve = cl === 'nieve', fuerte = cl === 'lluvia' || cl === 'tormenta';
    const V = nieve ? ['#cfdaf2', '#e6eeff', '#f4f8ff'] : fuerte ? ['#3f7a52', '#34683f', '#2a5634'] : ['#6cc070', '#52aa58', '#3f9248'];
    const GR = nieve ? ['#f4f8ff', '#e2eaf8'] : fuerte ? ['#3a7a44', '#32683c'] : ['#58b45c', '#4ca452'];
    for (let x = 0; x < W; x++) {
      const h1 = HY - 15 + Math.round(5 * Math.sin(x / 11 + 1) + 3 * Math.sin(x / 5)), h2 = HY - 7 + Math.round(4 * Math.sin(x / 8 + 3));
      for (let y = h1; y < HY + 4; y++) g.set(x, y, V[0]);
      for (let y = h2; y < HY + 4; y++) g.set(x, y, V[1]);
    }
    for (let y = HY + 4; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, ((y - HY) >> 3) % 2 ? GR[0] : GR[1]);
    // camino
    for (let y = HY + 6; y < H; y++) { const hw = 6 + (y - HY) * .42; for (let x = 0; x < W; x++) { const d = Math.abs(x + .5 - W / 2); if (d <= hw) g.set(x, y, d > hw - 1.5 ? '#c8a870' : (x + y) % 7 === 0 ? '#d4b87c' : '#e0c48c'); } }
    // arboles
    const arbol = (cx, base, rx, ry, tr) => {
      g.rect(cx - tr, base - ry, tr * 2, ry + 2, '#6a4020'); g.rect(cx - tr, base - ry, 1, ry + 2, '#8a5830');
      const ramp = nieve ? ['#ffffff', '#e6eeff', '#c0d0ec', '#8aa0c8'] : R.verde, cy = base - ry - rx * .6;
      capa(g, nieve ? '#5a6a90' : '#12432a', L => sombrear(L, union(elipse(cx, cy, rx, rx * .95), elipse(cx - rx * .5, cy + rx * .3, rx * .7, rx * .6), elipse(cx + rx * .5, cy + rx * .3, rx * .7, rx * .6)), cx, cy, rx, rx, ramp));
    };
    arbol(Math.round(W * .3), HY - 1, 9, 10, 2); arbol(Math.round(W * .74), HY - 1, 8, 9, 2);
    arbol(8, HY + 12, 15, 24, 4); arbol(W - 9, HY + 14, 16, 26, 4);
    // cerca
    for (let x = 26; x < W - 26; x += 8) { g.rect(x, HY + 3, 2, 8, '#8a5630'); g.rect(x, HY + 3, 2, 1, '#d8a060'); }
    g.rect(26, HY + 5, W - 52, 1, '#a86a3c'); g.rect(26, HY + 8, W - 52, 1, '#a86a3c');
    // banca
    const bx = W - 46, by = HY + 20;
    g.rect(bx, by, 26, 3, '#a86a3c'); g.rect(bx, by, 26, 1, '#d8a060'); g.rect(bx, by - 8, 26, 2, '#a86a3c'); g.rect(bx, by - 8, 26, 1, '#d8a060'); g.rect(bx + 2, by - 8, 2, 8, '#6e4422'); g.rect(bx + 22, by - 8, 2, 8, '#6e4422'); g.rect(bx + 2, by + 3, 2, 6, '#4a2a10'); g.rect(bx + 22, by + 3, 2, 6, '#4a2a10');
    // flores y pasto
    let sem = 11; const rnd = () => (sem = (sem * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let i = 0; i < 46; i++) {
      const x = Math.floor(rnd() * W), y = HY + 12 + Math.floor(rnd() * (H - HY - 14)), d = Math.abs(x + .5 - W / 2), hw = 6 + (y - HY) * .42;
      if (d <= hw + 2 || (x > bx - 2 && x < bx + 28 && y > by - 10 && y < by + 10)) continue;
      if (nieve) { g.set(x, y, '#c0cce8'); continue; }
      if (i % 3 === 0) { const c = ['#ff6a8a', '#ffd84a', '#ffffff', '#b890ff'][i % 4]; g.set(x, y, c); g.set(x, y - 1, '#2f8038'); }
      else { g.set(x, y, fuerte ? '#2a5634' : '#3f8a44'); g.set(x + 1, y - 1, fuerte ? '#2a5634' : '#3f8a44'); }
    }
    return g;
  }
  /* ---- JARDÍN: macetas lindas en primer plano (piso + colgando de una viga), cielo despejado y pasto; Simon se ve de espaldas, chiquito, abajo ---- */
  // (JARDIN_MAXP, JARDIN_POTW, JARDIN_POTH definidos en config.js)
  function cieloParque(cl, noche) {
    const HY = RY + 12, fuerte = cl === 'lluvia' || cl === 'tormenta';
    const C = cl === 'nieve' ? ['#b8c4d8', '#c8d2e4', '#d8e0ee', '#e6ecf6'] : fuerte ? (cl === 'tormenta' ? ['#4a5468', '#5a6680', '#6c7a96', '#8090aa'] : ['#6c7a90', '#7e8ca4', '#92a0b8', '#a8b4c8']) : cl === 'nublado' ? ['#9aa8bc', '#aab6c8', '#bcc6d6', '#ccd4e0'] : ['#5ab4ff', '#76c4ff', '#9ad4ff', '#bde6ff'];
    for (let i = 0; i < 4; i++) { ctx.fillStyle = C[i]; const y0 = Math.floor(HY * i / 4), y1 = Math.floor(HY * (i + 1) / 4); ctx.fillRect(0, y0, LW, y1 - y0 + 1); }
    if (noche) {
      ctx.fillStyle = 'rgba(8,12,48,.82)'; ctx.fillRect(0, 0, LW, HY + 1);
      if (!fuerte && cl !== 'nublado' && cl !== 'nieve') {
        for (let i = 0; i < 26; i++) { const sx = (i * 41 + 7) % LW, sy = (i * 23 + 5) % (HY - 6); if ((i + (tk >> 3)) % 5) { ctx.fillStyle = '#a9b4ff'; ctx.fillRect(sx, sy, 1, 1); } }
        const lx0 = LW - 24, ly0 = 20, oroP = lunaOroT(), sgP = !oroP && lunaSangreT(), azP = !oroP && !sgP && lunaAzulT();
        if (oroP || sgP) { ctx.fillStyle = oroP ? '#ffd84a' : '#e83a4a'; for (let j = -7; j <= 7; j++) { const w = Math.round(Math.sqrt(49 - j * j)); ctx.fillRect(lx0 - w, ly0 + j, w * 2, 1); } ctx.fillStyle = oroP ? '#ffc02a' : '#8a1226'; ctx.fillRect(lx0 - 3, ly0 - 2, 2, 2); ctx.fillRect(lx0 + 2, ly0 + 2, 3, 2); if ((tk >> 3) % 2) { ctx.fillStyle = oroP ? '#fff6b0' : '#ff8a96'; ctx.fillRect(lx0 - 1, ly0 - 11, 2, 3); ctx.fillRect(lx0 - 1, ly0 + 9, 2, 3); } }
        else if (azP) { ctx.fillStyle = '#7ac0ff'; for (let j = -7; j <= 7; j++) { const w = Math.round(Math.sqrt(49 - j * j)); ctx.fillRect(lx0 - w, ly0 + j, w * 2, 1); } ctx.fillStyle = '#3a78d0'; ctx.fillRect(lx0 - 3, ly0 - 2, 2, 2); ctx.fillRect(lx0 + 2, ly0 + 2, 3, 2); if ((tk >> 3) % 2) { ctx.fillStyle = '#eaf6ff'; ctx.fillRect(lx0 - 1, ly0 - 11, 2, 3); ctx.fillRect(lx0 - 1, ly0 + 9, 2, 3); } }
        else { const lx = lx0, ly = ly0; ctx.fillStyle = '#fff7cc'; for (let j = -7; j <= 7; j++) { const w = Math.round(Math.sqrt(49 - j * j)), w2 = Math.round(Math.sqrt(36 - (j + 2) * (j + 2))); ctx.fillRect(lx - w, ly + j, Math.max(0, w - Math.max(0, w2 - 3)), 1); } }
      }
    }
    if (!noche && (cl === 'sol' || cl === 'arcoiris')) {
      const x = LW - 24, y = 20; ctx.fillStyle = '#fff2a0'; for (let j = -8; j <= 8; j++) { const w = Math.round(Math.sqrt(64 - j * j)); ctx.fillRect(x - w, y + j, w * 2, 1); }
      ctx.fillStyle = '#ffe45a'; for (let j = -6; j <= 6; j++) { const w = Math.round(Math.sqrt(36 - j * j)); ctx.fillRect(x - w, y + j, w * 2, 1); }
      if ((tk >> 3) % 2) { ctx.fillStyle = '#fff2a0'; ctx.fillRect(x - 1, y - 12, 2, 3); ctx.fillRect(x - 1, y + 10, 2, 3); ctx.fillRect(x - 12, y - 1, 3, 2); ctx.fillRect(x + 10, y - 1, 3, 2); }
    }
    if (!noche && cl === 'arcoiris') ['#ff5a5a', '#ffa040', '#ffe45a', '#6adf6a', '#5ab4ff', '#9a6aff'].forEach((col, i) => { ctx.fillStyle = col; const r = 46 - i * 2.4; for (let a = 0; a <= 180; a += 2) ctx.fillRect(Math.round(LW * .36 + Math.cos(a * Math.PI / 180) * r * 1.3), Math.round(HY - 4 - Math.sin(a * Math.PI / 180) * r), 2, 2); });
    const tono = cl === 'nublado' || fuerte ? 1 : 0, N = tono ? 5 : 3, nube = sprite('nubeP' + tono, () => nubeGrid(tono), noche ? .55 : 0);
    for (let i = 0; i < N; i++) ctx.drawImage(nube, Math.round(((tk / 7 + i * (LW + 30) / N) % (LW + 40)) - 34), 8 + (i * 17) % 38);
  }
  function nubeGrid(tono) {
    const g = Grid(30, 11), c = tono ? ['#e4eaf4', '#a8b4c8'] : ['#ffffff', '#d8e4f4'];
    [[9, 6, 8, 4], [18, 5, 9, 5], [24, 7, 6, 3], [14, 8, 11, 3]].forEach(([cx, cy, rx, ry]) => { const f = elipse(cx, cy, rx, ry); for (let y = 0; y < 11; y++) for (let x = 0; x < 30; x++) if (f(x, y)) g.set(x, y, y > cy + 1 ? c[1] : c[0]); });
    return g;
  }
  function parqueFX(cl) {
    // mariposas
    const col = [['#ff8ad8', '#ffe0f4'], ['#ffd84a', '#fff6b0']];
    if (!esNoche() && (cl === 'sol' || cl === 'arcoiris' || cl === 'nublado')) for (let i = 0; i < 2; i++) {
      const x = Math.round(LW / 2 + Math.sin(tk / 17 + i * 2.6) * LW * .36), y = Math.round(SY + 8 + i * 22 + Math.cos(tk / 11 + i) * 14), a = (tk >> 1) % 2;
      ctx.fillStyle = col[i][0]; ctx.fillRect(x - 3, y - (a ? 2 : 0), 3, a ? 3 : 2); ctx.fillRect(x + 1, y - (a ? 2 : 0), 3, a ? 3 : 2); ctx.fillStyle = '#3a2a4a'; ctx.fillRect(x, y, 1, 3);
    }
    if (cl === 'nieve') { ctx.fillStyle = '#ffffff'; for (let i = 0; i < 40; i++) { const x = (i * 29 + Math.round(3 * Math.sin((tk + i * 7) / 9))) % LW, y = (i * 47 + (tk >> 1)) % LH; ctx.fillRect(x, y, 1, 1); if (i % 4 === 0) ctx.fillRect(x + 1, y, 1, 1); } return; }
    if (cl !== 'lluvia' && cl !== 'tormenta') return;
    const N = cl === 'tormenta' ? 70 : 46, v = cl === 'tormenta' ? 5 : 4; ctx.fillStyle = '#d8ecff';
    for (let i = 0; i < N; i++) { const x = (i * 37) % LW, y = (i * 53 + tk * v) % (LH - 3); ctx.fillRect(x, y, 1, 3); }
    if (cl === 'tormenta') {
      if (tk % 100 === 0 && Math.random() < .55) { rayo = 4; setTimeout(truenoSusto, 500 + Math.random() * 600); }
      if (rayo > 0) { ctx.fillStyle = rayo > 2 ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.35)'; ctx.fillRect(0, 0, LW, LH); rayo--; }
    }
  }
