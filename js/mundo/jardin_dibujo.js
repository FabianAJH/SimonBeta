  /* ===================== EL JARDÍN: POSICIONES, MACETAS Y PLANTAS ===================== */
  function plotsDesbloqueados() { const n = nivel(); return n >= 30 ? 6 : n >= 25 ? 5 : n >= 20 ? 4 : n >= 15 ? 3 : n >= 10 ? 2 : 0; }
  function jardinSync() {   // agrega casillas vacías conforme se desbloquean más (nunca quita las ya existentes)
    e.jardin = e.jardin || { plots: [] }; if (!Array.isArray(e.jardin.plots)) e.jardin.plots = [];
    const n = plotsDesbloqueados();
    while (e.jardin.plots.length < n) e.jardin.plots.push({ k: null, etapa: null, dias: 0, diaUlt: null, regadoHoy: false });
    return e.jardin.plots;
  }
  // primeras 3 macetas: a nivel de piso, sobre el pasto. de la 4a a la 6a: cuelgan de una viga (se arma sola al desbloquear la primera)
  function jardinSlot(i, n, W) {
    const piso = i < 3, cntP = Math.min(n, 3), cntC = Math.max(0, n - 3);
    if (piso) { const esp = 28, total = (cntP - 1) * esp; return { piso: true, cx: Math.round(W / 2 - total / 2 + i * esp), base: RY + 41 }; }
    const j = i - 3, esp = 26, total = (cntC - 1) * esp; return { piso: false, cx: Math.round(W / 2 - total / 2 + j * esp), base: RY - 3 };
  }
  function jardinPlotRect(i, n, W, H) {
    const s = jardinSlot(i, n, W);
    if (s.piso) {
      return { x: s.cx - 20, y: s.base - 48, w: 40, h: 64 };
    } else {
      return { x: s.cx - 20, y: RY - 44, w: 40, h: (s.base - (RY - 44)) + 18 };
    }
  }
  const JARDIN_POTS = [['#e3a86a', '#c47a46', '#f3cf9a'], ['#d98a52', '#b86a3a', '#f0c08a'], ['#cf7a46', '#a85c30', '#e8b888']];
  function florP(g, x, y, petal, centro, grande) {   // florecita de pixeles: chica (4) o grande (8 pétalos)
    (grande ? [[-1, -1], [1, -1], [-1, 1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]] : [[-1, 0], [1, 0], [0, -1], [0, 1]]).forEach(([dx, dy]) => g.set(x + dx, y + dy, petal));
    g.set(x, y, centro);
  }
  function gotaAviso(g, x, y) {   // gota de agua clara (pico arriba, panza redonda abajo, con brillito): avisa que a esta planta ya le toca riego
    [0, 1, 2, 3, 3, 2, 1].forEach((r, j) => { for (let i = -r; i <= r; i++) g.set(x + i, y + j, (j === 4 && i === 0) ? '#eaf9ff' : Math.abs(i) === r ? '#1372b8' : '#4ab8ff'); });
  }
  function bola(L, cx, cy, r, c) { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r + 1) L.set(cx + dx, cy + dy, c); }   // circulito sólido (núcleos, yemas, hojas)
  // FLOR ESPECTRO (semilla "brote"): planta alienígena bioluminiscente — tronco retorcido violeta con ramas que terminan en yemas de color, hojas menta de contraste, y una floración grande en anillos concéntricos con núcleo que pulsa
  function plantaEspectro(g, cx, dy, etapa, fr) {
    if (etapa === 'semilla') { capa(g, '#1a0f28', L => { L.rect(cx - 1, dy - 4, 2, 4, '#caa6e0'); L.set(cx, dy - 5, '#ffffff'); }); return; }
    if (etapa === 'brote') {
      capa(g, '#1a0f28', L => {
        for (let t = 0; t < 9; t++) { const ox = Math.round(Math.sin(t * .4) * 1.5); L.set(cx + ox, dy - 1 - t, '#5a3a7a'); }
        const tx = cx + Math.round(Math.sin(8 * .4) * 1.5), ty = dy - 9;
        bola(L, tx, ty - 1, 2, '#e8a8d8'); L.set(tx, ty - 3, '#ffffff');
      });
      return;
    }
    capa(g, '#1a0f28', L => {   // ===== LISTO: tronco retorcido + ramas con yemas + hojas + flor grande bioluminiscente =====
      const alto = 16, pts = [];
      for (let t = 0; t < alto; t++) { const ox = Math.round(Math.sin(t * .35) * 2.5); pts.push([cx + ox, dy - 1 - t]); L.set(cx + ox, dy - 1 - t, '#3a2050'); L.set(cx + ox + 1, dy - 1 - t, '#4a2a62'); }
      const [topx, topy] = pts[alto - 1], [midx, midy] = pts[Math.floor(alto / 2)];
      linea(L, midx, midy, midx - 7, midy - 5, '#4a2a62'); linea(L, midx - 7, midy - 5, midx - 9, midy - 3, '#4a2a62'); bola(L, midx - 9, midy - 3, 1, '#ff9ad0');
      linea(L, midx + 1, midy - 2, midx + 8, midy - 6, '#4a2a62'); bola(L, midx + 8, midy - 6, 1, '#ffe45a');
      const [l1x, l1y] = pts[4]; linea(L, l1x, l1y, l1x - 6, l1y - 2, '#3a2050'); bola(L, l1x - 8, l1y - 2, 2, '#8ef0b8'); L.set(l1x - 9, l1y - 3, '#c8ffe0');
      const [l2x, l2y] = pts[7]; linea(L, l2x, l2y, l2x + 7, l2y - 1, '#3a2050'); bola(L, l2x + 9, l2y - 1, 2, '#8ef0b8'); L.set(l2x + 10, l2y - 2, '#c8ffe0');
      const fx = topx, fy = topy - 3;
      bola(L, fx, fy, 6, '#e8a8d8'); bola(L, fx, fy, 4, '#9a5ac0'); bola(L, fx, fy, (fr || 0) < 12 ? 2 : 3, '#eaff8a'); L.set(fx, fy, '#ffffff');
      for (let ang = 0; ang < 360; ang += 60) { const a = ang * Math.PI / 180; L.set(fx + Math.round(Math.cos(a) * 5), fy + Math.round(Math.sin(a) * 5), '#c070b0'); }
    });
  }
  // ANÉMONA CALMA (semilla "raiz"): planta alienígena cristalina — tronco azul con ramas que terminan en cristalitos celestes, y un núcleo facetado en anillos concéntricos que pulsa como un corazón de hielo
  function plantaCalma(g, cx, dy, etapa, fr) {
    if (etapa === 'semilla') { capa(g, '#0a1824', L => { bola(L, cx, dy - 4, 2, '#3aa0d8'); L.set(cx, dy - 5, '#eaffff'); }); return; }
    if (etapa === 'brote') {
      capa(g, '#0a1824', L => {
        for (let t = 0; t < 8; t++) L.set(cx, dy - 1 - t, '#2a5a80');
        const ty = dy - 8; bola(L, cx, ty - 1, 2, '#6ad0ff'); L.set(cx, ty - 3, '#eaffff');
      });
      return;
    }
    capa(g, '#0a1824', L => {   // ===== LISTO: tronco cristalino + ramas con cristalitos + núcleo facetado bioluminiscente =====
      const alto = 14, pts = [];
      for (let t = 0; t < alto; t++) { pts.push([cx, dy - 1 - t]); L.set(cx, dy - 1 - t, '#1a3a56'); L.set(cx + 1, dy - 1 - t, '#234a68'); }
      const [topx, topy] = pts[alto - 1], [midx, midy] = pts[Math.floor(alto / 2)];
      linea(L, midx, midy, midx - 6, midy - 4, '#234a68'); bola(L, midx - 7, midy - 5, 1, '#aef2ff');
      linea(L, midx + 1, midy - 2, midx + 7, midy - 5, '#234a68'); bola(L, midx + 8, midy - 6, 1, '#aef2ff');
      const [l1x, l1y] = pts[3]; linea(L, l1x, l1y, l1x - 6, l1y - 1, '#1a3a56'); bola(L, l1x - 8, l1y - 1, 2, '#bfeaff'); L.set(l1x - 9, l1y - 2, '#eaffff');
      const [l2x, l2y] = pts[6]; linea(L, l2x, l2y, l2x + 6, l2y - 1, '#1a3a56'); bola(L, l2x + 8, l2y - 1, 2, '#bfeaff'); L.set(l2x + 9, l2y - 2, '#eaffff');
      const fx = topx, fy = topy - 2;
      bola(L, fx, fy, 6, '#2a7aa8'); bola(L, fx, fy, 4, '#6ad0ff'); bola(L, fx, fy, (fr || 0) < 12 ? 2 : 3, '#eaffff'); L.set(fx, fy, '#ffffff');
      for (let ang = 0; ang < 360; ang += 60) { const a = ang * Math.PI / 180; L.set(fx + Math.round(Math.cos(a) * 5), fy + Math.round(Math.sin(a) * 5), '#8ae0ff'); }
    });
  }
  // ESPORA DORADA: planta alienígena hongo-joya, toda en tonos de oro/ámbar — racimo de esporas doradas orbitando un núcleo cálido
  function plantaDorada(g, cx, dy, etapa, fr) {
    if (etapa === 'semilla') { capa(g, '#2a1808', L => { L.rect(cx - 1, dy - 4, 2, 4, '#c8882a'); L.set(cx, dy - 5, '#ffe45a'); }); return; }
    if (etapa === 'brote') {
      capa(g, '#2a1808', L => {
        for (let t = 0; t < 9; t++) L.set(cx, dy - 1 - t, '#8a5a1a');
        const ty = dy - 9; bola(L, cx, ty - 1, 2, '#ffd84a'); L.set(cx, ty - 3, '#fff6b0');
      });
      return;
    }
    capa(g, '#2a1808', L => {   // ===== LISTO: tronco + ramas con yemas + racimo de esporas doradas orbitando un núcleo cálido =====
      const alto = 15, pts = [];
      for (let t = 0; t < alto; t++) { pts.push([cx, dy - 1 - t]); L.set(cx, dy - 1 - t, t < 5 ? '#5a3a10' : t < 10 ? '#8a5a1a' : '#c8882a'); if (t > 9) L.set(cx + 1, dy - 1 - t, '#ffd84a'); }
      const [topx, topy] = pts[alto - 1], [midx, midy] = pts[Math.floor(alto / 2)];
      linea(L, midx, midy, midx - 8, midy - 6, '#8a5a1a'); bola(L, midx - 9, midy - 7, 2, '#d89a28');
      linea(L, midx + 1, midy - 2, midx + 7, midy - 7, '#8a5a1a'); bola(L, midx + 8, midy - 8, 2, '#ffe68a');
      const [l1x, l1y] = pts[4]; linea(L, l1x, l1y, l1x - 6, l1y - 2, '#5a3a10'); bola(L, l1x - 8, l1y - 2, 1, '#b8841e');
      const [l2x, l2y] = pts[7]; linea(L, l2x, l2y, l2x + 6, l2y - 1, '#5a3a10'); bola(L, l2x + 8, l2y - 1, 1, '#ffe68a');
      const fx = topx, fy = topy - 4;
      const orbit = [[0, -10, '#ffe68a'], [7, -6, '#d89a28'], [-7, -6, '#ffd84a'], [9, 3, '#b8841e'], [-9, 3, '#ffe68a'], [0, 8, '#d89a28'], [5, -1, '#ffd84a'], [-5, -1, '#b8841e']];
      const off = Math.floor((fr || 0) / 8) % 2;
      orbit.forEach(([dx, dyf, col], i) => { bola(L, fx + dx, fy + dyf, 2, (i + off) % 2 === 0 ? col : mixC(col, -.18)); L.set(fx + dx, fy + dyf, '#fff6d0'); });
      const core = (fr || 0) % 20 < 10 ? 3 : 4;
      bola(L, fx, fy, core, '#fff0b0'); bola(L, fx, fy, Math.max(1, core - 2), '#ffffff');
    });
  }
  // FLOR DE ECO: planta alienígena de ondas sonoras, toda en tonos teal/turquesa — anillos de eco expandiéndose en vez de pétalos
  function plantaEco(g, cx, dy, etapa, fr) {
    if (etapa === 'semilla') { capa(g, '#0a1c20', L => { L.rect(cx - 1, dy - 4, 2, 4, '#5a98a0'); L.set(cx, dy - 5, '#eafcff'); }); return; }
    if (etapa === 'brote') {
      capa(g, '#0a1c20', L => {
        for (let t = 0; t < 9; t++) L.set(cx, dy - 1 - t, '#3a6a70');
        const ty = dy - 9; bola(L, cx, ty - 1, 2, '#7ad0d8'); L.set(cx, ty - 3, '#eafcff');
      });
      return;
    }
    capa(g, '#0a1c20', L => {   // ===== LISTO: tronco + ramas con yemas + anillos de eco concéntricos pulsando =====
      const alto = 15, pts = [];
      for (let t = 0; t < alto; t++) { pts.push([cx, dy - 1 - t]); L.set(cx, dy - 1 - t, t < 5 ? '#2a4a50' : t < 10 ? '#3a6a70' : '#6ab0b8'); if (t > 9) L.set(cx + 1, dy - 1 - t, '#bdeef2'); }
      const [topx, topy] = pts[alto - 1], [midx, midy] = pts[Math.floor(alto / 2)];
      linea(L, midx, midy, midx - 7, midy - 4, '#3a6a70'); bola(L, midx - 8, midy - 5, 1, '#aee8ee');
      linea(L, midx + 1, midy - 2, midx + 8, midy - 5, '#3a6a70'); bola(L, midx + 9, midy - 6, 1, '#4ab8c0');
      const [l1x, l1y] = pts[4]; linea(L, l1x, l1y, l1x - 6, l1y - 2, '#2a4a50'); bola(L, l1x - 8, l1y - 2, 2, '#bdeef2');
      const [l2x, l2y] = pts[7]; linea(L, l2x, l2y, l2x + 6, l2y - 1, '#2a4a50'); bola(L, l2x + 8, l2y - 1, 2, '#4ab8c0');
      const fx = topx, fy = topy - 3;
      const pulso = ((fr || 0) % 24) / 24, ringCols = ['#eafcff', '#9adde4', '#4ab8c0', '#2a7a82'];
      for (let ring = 0; ring < 4; ring++) {
        const rad = 2 + ring * 3 + pulso * 3, col = ringCols[ring % ringCols.length];
        for (let ang = 0; ang < 360; ang += 24) { const a = (ang + ring * 15) * Math.PI / 180; L.set(fx + Math.round(Math.cos(a) * rad), fy + Math.round(Math.sin(a) * rad * .7), col); }
      }
      bola(L, fx, fy, 3, '#eafcff'); bola(L, fx, fy, 2, '#ffffff');
      L.set(fx + 9, fy - 2, '#ff9a7a');   // único toque cálido: el "eco" que acaba de salir
    });
  }
  // SEMILLA ETERNA: la más legendaria — tronco con ramas igual que las demás, pero coronada por un pequeño sol con halo completo, toda en tonos dorados
  function plantaEterna(g, cx, dy, etapa, fr) {
    if (etapa === 'semilla') { capa(g, '#1a1404', L => { bola(L, cx, dy - 4, 2, '#e8c868'); L.set(cx, dy - 4, '#ffffff'); }); return; }
    if (etapa === 'brote') {
      capa(g, '#1a1404', L => {
        for (let t = 0; t < 11; t++) L.set(cx, dy - 1 - t, '#c8a040');
        const ty = dy - 11; bola(L, cx, ty - 2, 3, '#ffe88a'); L.set(cx, ty - 2, '#ffffff');
      });
      return;
    }
    capa(g, '#1a1404', L => {   // ===== LISTO: tronco con ramas + un pequeño sol con halo y gemas orbitando =====
      const alto = 12;
      for (let t = 0; t < alto; t++) L.rect(cx - 1, dy - 1 - t, 3, 1, t < 4 ? '#6a5018' : t < 9 ? '#a8822c' : '#e8c868');
      const topy = dy - alto, midy = dy - 1 - Math.floor(alto / 2);
      linea(L, cx, midy, cx - 9, midy - 5, '#a8822c'); bola(L, cx - 10, midy - 6, 2, '#d89a28');
      linea(L, cx + 1, midy - 2, cx + 10, midy - 6, '#a8822c'); bola(L, cx + 11, midy - 7, 2, '#ffe68a');
      const low1y = dy - 1 - 4; linea(L, cx, low1y, cx - 7, low1y - 2, '#6a5018'); bola(L, cx - 9, low1y - 2, 1, '#ffe88a');
      const low2y = dy - 1 - 7; linea(L, cx, low2y, cx + 7, low2y - 1, '#6a5018'); bola(L, cx + 9, low2y - 1, 1, '#b8841e');
      const fx = cx, fy = topy - 9;
      for (let ang = 0; ang < 360; ang += 15) {
        const a = ang * Math.PI / 180;
        linea(L, fx + Math.cos(a) * 7, fy + Math.sin(a) * 7 * .8, fx + Math.cos(a) * 10, fy + Math.sin(a) * 10 * .8, '#ffd84a');
      }
      const core = (fr || 0) % 20 < 10 ? 5 : 6;
      bola(L, fx, fy, core, '#ffe88a'); bola(L, fx, fy, core - 2, '#fff6d0'); bola(L, fx, fy, Math.max(1, core - 4), '#ffffff');
      const haloR = 14, haloCol = (fr || 0) % 40 < 20 ? '#e8c868' : '#ffe68a';
      for (let ang = 0; ang < 360; ang += 8) {
        const a = ang * Math.PI / 180;
        L.set(fx + Math.round(Math.cos(a) * haloR), fy + Math.round(Math.sin(a) * haloR * .55), haloCol);
        L.set(fx + Math.round(Math.cos(a) * (haloR - 1)), fy + Math.round(Math.sin(a) * (haloR - 1) * .55), mixC(haloCol, .25));
      }
      [0, 90, 180, 270].forEach(ang => {
        const a = (ang + ((fr || 0) % 72) * 1.2) * Math.PI / 180;
        bola(L, fx + Math.round(Math.cos(a) * haloR), fy + Math.round(Math.sin(a) * haloR * .55), 1, '#ffffff');
      });
    });
  }
  function jardinMaceta(g, cx, base, p, colgando, pal, fr) {
    const w = JARDIN_POTW, h = JARDIN_POTH, [body, bodyD, rim] = pal;
    if (colgando) { const r0 = RY - 40, r1 = base - h; for (let y = r0; y < r1; y++) g.set(cx, y, '#6e4422'); g.set(cx + 1, r0 + 4, '#5ccf5a'); g.set(cx - 1, r0 + 8, '#5ccf5a'); }
    // cuerpo redondeado: más ancho a la mitad, angosto arriba y abajo (curva con seno)
    for (let yy = 0; yy < h; yy++) {
      const t = yy / (h - 1), bulge = Math.sin(t * Math.PI), ww = Math.round(w * .54 + w * .3 * bulge + w * .1 * (1 - t)), x0 = cx - Math.round(ww / 2);
      g.rect(x0, base - h + yy, ww, 1, t > .72 ? bodyD : body);
      g.set(x0 + 1, base - h + yy, mixC(body, .35));   // brillito vertical del lado izquierdo
    }
    const rimw = Math.round(w * .62);
    g.rect(cx - rimw / 2 - 1, base - h - 2, rimw + 2, 3, rim); g.rect(cx - rimw / 2 - 1, base - h - 2, rimw + 2, 1, mixC(rim, .4));
    const saucerw = Math.round(w * .68);
    g.rect(cx - saucerw / 2, base, saucerw, 2, mixC(rim, -.2));
    const dw = Math.round(w * .46);
    g.rect(cx - dw / 2, base - h + 1, dw, 2, p.regadoHoy ? '#3a2410' : '#5a3818');
    if (!p.k) return;
    const S0 = SEMILLAS[p.k]; (S0 && S0.planta || plantaEspectro)(g, cx, base - h, p.etapa, fr);
    if (p.etapa !== 'listo' && !p.regadoHoy) gotaAviso(g, cx + Math.round(w * .62), base - h - 15);   // gotota clara: avisa que ya le toca agua de nuevo
  }
  function jardinGrid(W, H, RY, cl, plots, fr, noche, modo) {   // modo: 0 = todo · 1 = solo el fondo · 2 = solo las macetas (van encima de los muebles, ver jardinMacetasFrente)
    const g = Grid(W, H), HY = RY + 8, nieve = cl === 'nieve', fuerte = cl === 'lluvia' || cl === 'tormenta';
    if (modo === 2) { const n2 = plots.length; for (let i = 0; i < n2; i++) { const s = jardinSlot(i, n2, W), p = plots[i] || {}; jardinMaceta(g, s.cx, s.base, p, !s.piso, JARDIN_POTS[i % JARDIN_POTS.length], fr); } return g; }
    // ---- cielo de primavera en franjas suaves (reactivo al clima); de noche se deja transparente para que se vea el cielo con la luna ----
    if (!noche) {
      const SKY = nieve ? ['#b8c4d8', '#c8d2e4', '#d8e0ee', '#e6ecf6'] : fuerte ? ['#6c7a90', '#7e8ca4', '#92a0b8', '#a8b4c8'] : ['#bfe3ff', '#cdeeff', '#e6f6ff', '#f6fbe8'];
      for (let i = 0; i < 4; i++) { const y0 = Math.floor(HY * i / 4), y1 = Math.floor(HY * (i + 1) / 4); g.rect(0, y0, W, y1 - y0 + 1, SKY[i]); }
    }
    // ---- pasto base con textura de rayas y una loma lejana para dar profundidad ----
    const GR = nieve ? ['#f4f8ff', '#e2eaf8'] : fuerte ? ['#3a7a44', '#32683c'] : ['#8fd96a', '#6fc458'];
    for (let y = HY; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, ((y - HY) >> 2) % 2 ? GR[0] : GR[1]);
    const lomaC = mixC(GR[0], -.25);
    for (let x = 0; x < W; x++) { const bump = Math.round(3 * Math.sin(x / 9) + 2 * Math.sin(x / 4 + 1)); g.rect(x, HY - 2 + bump, 1, 4 - bump, lomaC); }
    // ---- arbustos floridos a los lados: que se sienta frondoso, como un patio de verdad ----
    const nramp = nieve ? ['#ffffff', '#e6eeff', '#c0d0ec', '#8aa0c8'] : ['#b2f088', '#5ccf5a', '#2f9a4a', '#1d6a38'];
    let sem = 7; const rnd = () => (sem = (sem * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const mata = (cx, baseY, rx, ry, flores) => {
      const cy = baseY - ry * .7;
      capa(g, nieve ? '#5a6a90' : '#12432a', L => sombrear(L, union(elipse(cx, cy, rx, rx * .9), elipse(cx - rx * .5, cy + rx * .25, rx * .65, rx * .55), elipse(cx + rx * .5, cy + rx * .25, rx * .65, rx * .55)), cx, cy, rx, rx, nramp));
      g.rect(cx - 1, baseY - 2, 2, 4, '#6a4020');
      if (flores) for (let i = 0; i < 6; i++) florP(g, cx - rx + Math.floor(rnd() * rx * 2), cy - ry * .6 + Math.floor(rnd() * ry), flores[i % flores.length], '#fff2a0', false);
    };
    const FLORES_MATA = fuerte || nieve ? null : ['#ff9ec4', '#ffe566', '#ffffff'];
    mata(9, HY + 16, 10, 13, FLORES_MATA); mata(W - 9, HY + 18, 11, 14, FLORES_MATA);
    // ---- valla de madera baja en el horizonte, como la del patio de la casa ----
    for (let x = 4; x < W - 4; x += 8) { g.rect(x, HY + 3, 2, 8, '#8a5630'); g.rect(x, HY + 3, 2, 1, '#d8a060'); }
    g.rect(4, HY + 5, W - 8, 1, '#a86a3c'); g.rect(4, HY + 8, W - 8, 1, '#a86a3c');
    // ---- flores silvestres salpicadas por el pasto, y un mechón denso de pasto alto pegado al borde inferior ----
    if (!fuerte && !nieve) { const FP = [['#ff9ec4', '#fff2a0'], ['#ffd27a', '#c0582a'], ['#b79cff', '#fff2a0'], ['#ffffff', '#ffd84a']]; for (let i = 0; i < 20; i++) { const x = Math.floor(rnd() * W), y = HY + 14 + Math.floor(rnd() * (H - HY - 26)), c = FP[i % FP.length]; florP(g, x, y, c[0], c[1], false); } }
    const bladeC = fuerte ? ['#2a5634', '#32683c', '#1d4a2a'] : nieve ? ['#e2eaf8', '#d0dcf0', '#c0ceec'] : ['#4fb85c', '#5ccf5a', '#3a9a4a'];
    for (let x = -1; x < W; x += 2) { const h = 3 + Math.floor(rnd() * 4), lean = rnd() > .5 ? 1 : -1; for (let j = 0; j < h; j++) { const xx = x + Math.round(lean * j * .4); g.set(xx, H - 1 - j, bladeC[j % bladeC.length]); } }
    const n = plots.length, cntC = Math.max(0, n - 3);
    if (cntC > 0) {   // pérgola de madera real: postes clavados en el pasto que sostienen la viga, con tirantes en las esquinas
      const xs = []; for (let i = 3; i < n; i++) xs.push(jardinSlot(i, n, W).cx);
      const x0 = Math.min(...xs) - 14, x1 = Math.max(...xs) + 14, beamY = RY - 43, postBase = HY + 14;
      [x0 - 2, x1].forEach(px => { g.rect(px, beamY, 3, postBase - beamY, '#6e4422'); g.rect(px, beamY, 1, postBase - beamY, '#8a5830'); g.rect(px - 2, postBase - 3, 7, 2, '#5a3a1c'); });
      g.rect(x0 - 4, beamY, (x1 - x0) + 8, 3, '#7a5228'); g.rect(x0 - 4, beamY, (x1 - x0) + 8, 1, '#a9743f');
      for (let k = 0; k < 6; k++) { g.set(x0 - 2 + k, beamY + 3 + k, '#5a3a1c'); g.set(x1 + 2 - k, beamY + 3 + k, '#5a3a1c'); }   // tirantes diagonales
    }
    if (modo !== 1) for (let i = 0; i < n; i++) { const s = jardinSlot(i, n, W), p = plots[i] || {}; jardinMaceta(g, s.cx, s.base, p, !s.piso, JARDIN_POTS[i % JARDIN_POTS.length], fr); }
    return g;
  }
