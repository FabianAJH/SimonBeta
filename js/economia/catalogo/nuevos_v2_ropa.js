  /* ===================== NUEVOS ITEMS V2: ROPA Y ACCESORIOS (22 prendas, NV30-46 y NV76) =====================
     Este archivo se carga DESPUÉS de baratas.js a propósito: así el precio y el nivel que se registran aquí
     con registrarRopa() son los definitivos (no pasan por ECON ni por el ajuste global x1.5 de baratas.js,
     que ya se aplicó una sola vez a los items anteriores a este archivo). Ver _orden_de_carga.txt. */

  // ---------- sudaderas nuevas (necesitan entrada en SUDS, y SUDP si llevan estampado) ----------
  [
    ['sud_rayas', 'SUDADERA RAYAS', ['#e8353f', '#f4f4ff', '#2cc8c0'], (x, y) => Math.floor(y / 3) % 3],
    ['sud_vaquera', 'JACKET VAQUERA', ['#4a6fa5', '#ffd84a'], (x, y) => (Math.abs(x - 28) <= 1 && y % 7 < 2) ? 1 : 0],
    ['sud_hoodie', 'HOODIE CORAZON', ['#e8457a', '#ffb0cc'], (x, y) => { const hx = x - 28, hy = y - 58; return (hy > -4 && hy < 7 && (Math.hypot(hx + 3, hy + 1) <= 4 || Math.hypot(hx - 3, hy + 1) <= 4 || (hy > -1 && Math.abs(hx) <= (7 - hy) * .65))) ? 1 : 0; }],
    ['sud_milverde', 'SUDADERA CAMUFLAJE', ['#5a6a2a', '#3a4a1a', '#7a8a4a'], (x, y) => { const v = Math.sin(x * .6 + y * .3) + Math.cos(y * .5 - x * .2); return v > .6 ? 0 : v > -.5 ? 1 : 2; }]
  ].forEach(([k, n, cs, f]) => {
    const pals = cs.map(pal4);
    SUDS[k] = [pals[0], mixC(cs[cs.length > 2 ? 2 : 1], -.8), mixC(cs[0], -.5)];
    SUDP[k] = { pals: pals.map(P => P.map(c => col(c))), f };
  });

  // ---------- dibujos nuevos (ACC2) ----------
  ACC2.corbata_roja = g => capa(g, '#4a0a14', L => {
    L.rect(26, 50, 4, 3, R.rojo[1]);
    sombrear(L, (x, y) => y >= 53 && y <= 68 && Math.abs(x + .5 - 28) <= 1.6 + (y - 53) * .22 * (y < 62 ? 1 : -.5) + (y >= 62 ? 3.3 : 0), 28, 60, 5, 9, R.rojo);
  });
  ACC2.coletas_mono = g => [8, 48].forEach(cx => {
    capa(g, '#150f20', L => sombrear(L, elipse(cx, 13, 4.6, 7.4), cx, 13, 4.6, 7.4, R.pelo));
    capa(g, '#4a1030', L => sombrear(L, elipse(cx, 18.5, 3.2, 2.6), cx, 18.5, 3.2, 2.6, pal4('#ff7ab8')));
    g.set(cx, 17, '#ffc0e0');
  });
  ACC2.parche_pirata2 = g => ACC2.parche(g);   // mismo diseño aprobado del parche original, como item nuevo e independiente
  ACC2.capa_estrellas = g => {
    accCapaX(g, ['#6a7ad0', '#2a3a8a', '#1a2560', '#0e1540'], '#0a0e2a', '#ffd84a');
    [[13, 58], [42, 58], [9, 66], [46, 66], [18, 72], [37, 72], [28, 62]].forEach(([x, y]) => estrella4(g, x, y, 1, '#ffd84a', '#fff6b0'));
  };
  ACC2.sombrero_mago = g => {
    capa(g, '#1a0a30', L => sombrear(L, (x, y) => y >= 0 && y <= 14 && Math.abs(x + .5 - 28) <= (14 - y) * .5, 28, 7, 10, 7, pal4('#6a30b0')));
    g.rect(13, 14, 30, 2, '#2a0a5a'); g.rect(13, 14, 30, 1, '#6a30b0');
    [[21, 5], [33, 9], [27, 2]].forEach(([x, y]) => estrella4(g, x, y, 1, '#ffd84a', '#fff6b0'));
  };
  ACC2.lazo_elegante = g => accMono(g, pal4('#6a30b0'), '#2a0a5a');
  // mariposa como mini-sprite propio (cuerpo + 2 pares de alas con forma real + antenas), cacheado por color/estado
  // para no recalcular pixel a pixel cada frame (igual de eficiente que trebolAura en 09_alvarikoke.js)
  const MARIPOSA_CACHE = {};
  function mariposaGrid(c1, c2, abierta) {
    const key = c1 + '|' + c2 + '|' + (abierta ? 1 : 0);
    if (MARIPOSA_CACHE[key]) return MARIPOSA_CACHE[key];
    const w = 9, h = abierta ? 7 : 5, cx = 4, cy = (h - 1) / 2;
    const g = Grid(w, h);
    const rx = abierta ? 3.6 : 1.1, ry = abierta ? 2.6 : 2.2;
    [-1, 1].forEach(s => {
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const dx = (x + .5 - (cx + s * 1.5)) / rx, dy = (y + .5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) g.set(x, y, Math.round(dx * 3 + dy * 2) % 2 ? c2 : c1);
      }
    });
    for (let y = Math.round(cy - 1.5); y <= Math.round(cy + 1.5); y++) g.set(cx, y, '#2a1a3a');
    g.set(cx - 1, Math.round(cy - 2), '#2a1a3a'); g.set(cx + 1, Math.round(cy - 2), '#2a1a3a');
    g.set(cx, Math.round(cy - 1), '#fff6b0');
    MARIPOSA_CACHE[key] = g;
    return g;
  }
  ACC2.aura_mariposas = (g, fr) => {
    const f = fr || 0;
    // 4 mariposas grandes y bien visibles repartidas arriba y a los lados de Simon
    [[28, 1, '#e040fb', '#f3b6ff'], [4, 22, '#f48fb1', '#fde3ec'], [51, 18, '#81d4fa', '#dff6ff'], [7, 62, '#ba68c8', '#f0d6ff']].forEach(([x, y, c1, c2], i) => {
      const t = f / 40 * Math.PI * 2 + i * 1.7;
      const abierta = Math.sin(t) > 0;   // alas bien abiertas vs bien cerradas: diferencia de tamaño clara, no sutil
      const dx = Math.round(Math.cos(t * .4 + i * 2) * 2.4), dy = Math.round(Math.sin(t * .5 + i) * 3);
      const spr = mariposaGrid(c1, c2, abierta);
      g.paste(spr, x + dx - 4, y + dy - Math.floor(spr.h / 2));
    });
  };
  // llamas como mini-sprites con degradado real (rojo/naranja oscuro en la base -> naranja -> amarillo -> casi
  // blanco en la punta), de 3 tamaños, cacheadas por "semilla" de flicker para que el fuego se vea vivo pero
  // sin recalcular cada pixel cada frame
  const FUEGO_PAL = ['#fff7cc', '#ffd54f', '#ff8f00', '#c43e00', '#7a1a00'];
  const LLAMA_CACHE = {};
  function llamaGrid(tam, semilla) {
    const key = tam + '|' + semilla;
    if (LLAMA_CACHE[key]) return LLAMA_CACHE[key];
    const h = tam === 2 ? 11 : tam === 1 ? 8 : 5, w = tam === 2 ? 7 : tam === 1 ? 6 : 5;
    const g = Grid(w, h);
    for (let y = 0; y < h; y++) {
      const t = y / (h - 1);   // 0 = punta (arriba), 1 = base (abajo)
      const bamboleo = Math.sin(semilla + y * 1.3) * .18;
      const halfw = (w / 2) * (.14 + .86 * t) * (1 + bamboleo);
      for (let x = 0; x < w; x++) {
        const dx = Math.abs(x + .5 - w / 2);
        if (dx > halfw) continue;
        const ci = Math.max(0, Math.min(4, Math.round((1 - t) * 4.3 + (dx / Math.max(halfw, .01)) * .9)));
        g.set(x, y, FUEGO_PAL[ci]);
      }
    }
    LLAMA_CACHE[key] = g;
    return g;
  }
  ACC2.aura_fuego = (g, fr) => {
    const f = fr || 0;
    // llamas más grandes y variadas alrededor de los pies/costados, con flicker vivo entre frames
    [[4, 76, 1], [7, 66, 2], [3, 55, 0], [52, 76, 1], [49, 66, 2], [53, 55, 0]].forEach(([x, y, tamBase], i) => {
      const ph = (f + i * 9) % 32, tam = Math.min(2, tamBase + (ph < 16 ? 1 : 0));
      const spr = llamaGrid(tam, Math.floor(f / 3) + i * 5);
      g.paste(spr, x - Math.floor(spr.w / 2), y - spr.h + 2);
    });
    // chispas/brasas que suben flotando
    [[6, 78, 0], [50, 78, 1], [28, 3, 2]].forEach(([x, y0, i]) => {
      const t = (f + i * 13) % 36, yy = y0 - Math.round(t * 1.6);
      if (t >= 30) return;
      const xx = x + Math.round(Math.sin(t * .4 + i) * 1.6);
      g.set(xx, yy, t < 10 ? '#fff7cc' : t < 20 ? '#ffd54f' : '#ff8f00');
    });
  };
  ACC2.bufanda_flecos = g => accBuf(g, (x, y, k) => k ? '#6a1b9a' : '#9c27b0', '#2a0a5a');
  ACC2.pecas_doradas = g => [[9, 40], [12, 41], [10, 43], [14, 43], [47, 40], [44, 41], [46, 43], [42, 43]].forEach(([x, y], i) => g.set(x, y, i % 2 ? '#ffb020' : '#ff9a40'));
  ACC2.antenas_alien = g => [[12, 15, 8, 2], [44, 15, 48, 2]].forEach(([x0, y0, x1, y1]) => {
    linea(g, x0, y0, x1, y1, '#262244'); linea(g, x0 + 1, y0, x1 + 1, y1, '#262244');
    capa(g, '#2a0a5a', L => sombrear(L, elipse(x1 + .5, y1, 3.4, 3.4), x1 + .5, y1, 3.4, 3.4, pal4('#9a5ae8')));
    g.set(Math.round(x1), y1 - 2, '#fff6b0');
  });
  ACC2.gafas_espejo = g => {
    [15, 41].forEach(cx => { for (let y = 27; y <= 41; y++) for (let x = cx - 10; x <= cx + 9; x++) { if ((y === 27 || y === 41) && (x === cx - 10 || x === cx + 9)) continue; const borde = y === 27 || y === 41 || x === cx - 10 || x === cx + 9; if (borde) g.set(x, y, '#8a5a10'); else { const d = (x - cx) + (y - 33); g.set(x, y, d % 3 === 0 ? '#fff6b0' : d % 3 === 1 ? '#ffb020' : '#ff8a2a'); } } });
    g.rect(24, 31, 8, 2, '#8a5a10'); g.rect(3, 31, 5, 2, '#8a5a10'); g.rect(48, 31, 5, 2, '#8a5a10');
  };
  ACC2.corona_flores = g => {
    g.rect(10, 4, 36, 2, '#2f9a4a'); g.rect(10, 4, 36, 1, '#5ccf5a');
    [[14, 3, '#ff7ab8', '#ffe0f0'], [28, 1, '#b48cff', '#e8d8ff'], [42, 3, '#6ac0f0', '#d0f0ff']].forEach(([cx, cy, a, b]) => { [[0, -2], [-2, 0], [2, 0], [0, 2]].forEach(([dx, dy]) => { g.rect(cx + dx - 1, cy + dy - 1, 2, 2, a); g.set(cx + dx - 1, cy + dy - 1, b); }); g.rect(cx - 1, cy - 1, 2, 2, '#ffd84a'); });
  };
  ACC2.bigote_fancy = g => capa(g, '#140c06', L => {
    sombrear(L, union(elipse(20, 41, 6, 2.2), elipse(36, 41, 6, 2.2)), 28, 41, 16, 3, ['#6a4a2c', '#3a2410', '#24160a', '#140c06']);
    [[14, 39], [13, 37], [12, 36], [42, 39], [43, 37], [44, 36]].forEach(([x, y]) => L.set(x, y, '#24160a'));
  });
  ACC2.lagrimas_kawaii = g => [[12, 40], [44, 40]].forEach(([x, y]) => { g.set(x, y, '#64b5f6'); g.set(x, y + 1, '#90caf9'); g.set(x, y + 2, '#e3f2fd'); g.set(x + 1, y + 1, '#bbdefb'); });
  ACC2.casco_vikingo = g => {
    capa(g, '#2a1408', L => sombrear(L, (x, y) => y >= 2 && y <= 14 && Math.abs(x + .5 - 28) <= 20 - (y - 2) * .3, 28, 8, 20, 7, pal4('#8a5a3a')));
    g.rect(8, 13, 40, 2, '#5a3a20');
    [11, 45].forEach(cx => { const d = cx < 28 ? -1 : 1; capa(g, '#efebe9', L => sombrear(L, (x, y) => { if (y < 2 || y > 14) return false; const ccx = cx + d * (14 - y) * .3; return Math.abs(x + .5 - ccx) <= 5 * (y - 1) / 13; }, cx, 8, 6, 7, ['#fffaf0', '#efebe9', '#bcaaa4', '#8d6e63'])); });
  };
  ACC2.capucha_oso = g => {
    const pal = pal4('#a0703c');
    // capucha sólida (no un anillo hueco): una forma de capucha completa que cubre toda la cabeza, con
    // sombreado real de luz arriba-izquierda igual que el resto del juego
    capa(g, '#2a1408', L => sombrear(L, (x, y) => y <= 21 && ((x + .5 - 28) / 25) ** 2 + ((y + .5 - 12) / 14) ** 2 <= 1, 28, 8, 25, 14, pal));
    // textura de peluche/pelaje: motas de distinto tono repartidas en varias capas sobre la forma sólida
    for (let y = 0; y <= 21; y++) for (let x = 2; x <= 54; x++) {
      const d = ((x + .5 - 28) / 25) ** 2 + ((y + .5 - 12) / 14) ** 2;
      if (d > 1) continue;
      if ((x * 7 + y * 11) % 13 === 0) g.set(x, y, pal[(x + y) % 2 ? 0 : 1]);
      if ((x * 5 + y * 9) % 19 === 0) g.set(x, y, pal[3]);
    }
    // ribete/cordón en el borde de la capucha, para que se note que es una prenda y no solo un color plano
    for (let y = 0; y <= 21; y++) for (let x = 0; x < SW; x++) {
      const d = ((x + .5 - 28) / 25) ** 2 + ((y + .5 - 12) / 14) ** 2;
      if (d > .86 && d <= 1.02) g.set(x, y, Math.floor(x / 2) % 2 ? '#f0d0a0' : '#c89a5c');
    }
    // orejas de oso arriba: redondas y bien definidas, con relleno interior más claro (estilo ACC2.orejas_oso)
    [10, 46].forEach(cx => capa(g, '#3a1a08', L => { sombrear(L, elipse(cx, 7, 5.8, 5.6), cx, 7, 5.8, 5.6, pal); circ(L, cx, 8, 2.6, '#f0b090'); }));
  };
  ACC2.peluca_arcoiris = g => {
    // cabello con textura real: mechones ondulados (no bandas rectas), variación clara/oscura por mechón,
    // raíz más oscura cerca del cuero cabelludo y brillo arriba, sobre la misma silueta base de antes
    const RC = ['#ff4a4a', '#ff9a30', '#ffe030', '#58d048', '#48a8f0', '#b060f0'];
    const RCd = RC.map(c => mixC(c, -.35)), RCl = RC.map(c => mixC(c, .3));
    capa(g, '#1a0a28', L => {
      for (let y = 0; y <= 22; y++) for (let x = 2; x <= 54; x++) {
        const d = ((x + .5 - 28) / 27) ** 2 + ((y + .5 - 11) / 15) ** 2;
        if (d > 1 || d <= .08) continue;
        const onda = Math.sin(x * .35 + y * .5) * 2.2 + Math.sin(x * .12 - y * .25) * 1.4;   // serpenteo del mechón
        const idx = (Math.floor(((y + onda) * 1.15) % 18 + 18) % 18 / 3) | 0;
        const veta = Math.floor(x * 3 + y * 2 + onda * 2) % 5;   // volumen: oscuro/claro dentro del mismo color
        let c = RC[idx];
        if (veta === 0) c = RCl[idx]; else if (veta === 4) c = RCd[idx];
        if (y <= 2 + Math.abs(onda) * .3) c = RCd[idx];   // raíz oscura junto al cuero cabelludo
        L.set(x, y, c);
      }
      [[20, 2], [22, 1], [24, 2], [34, 1], [36, 2]].forEach(([x, y]) => L.set(x, y, '#ffffff'));   // brillo
    });
  };

  // ---------- registro final (precio y nivel YA SON los definitivos de tienda) ----------
  [
    ['sud_rayas', 'SUDADERA RAYAS', 'sudadera', 175, 30],
    ['corbata_roja', 'CORBATA ROJA', 'cuello', 185, 31],
    ['coletas_mono', 'COLETAS CON MOÑO', 'orejas', 185, 31],
    ['parche_pirata2', 'PARCHE PIRATA', 'cara', 195, 32],
    ['capa_estrellas', 'CAPA DE ESTRELLAS', 'espalda', 210, 33],
    ['sombrero_mago', 'SOMBRERO DE MAGO', 'orejas', 220, 34],
    ['sud_vaquera', 'JACKET VAQUERA', 'sudadera', 230, 35],
    ['lazo_elegante', 'LAZO ELEGANTE', 'cuello', 240, 36],
    ['aura_mariposas', 'AURA MARIPOSAS', 'aura', 250, 37],
    ['bufanda_flecos', 'BUFANDA CON FLECOS', 'cuello', 250, 37],
    ['pecas_doradas', 'PECAS DORADAS', 'cara', 265, 38],
    ['antenas_alien', 'ANTENAS ALIEN', 'orejas', 265, 38],
    ['gafas_espejo', 'GAFAS ESPEJO', 'cara', 275, 39],
    ['corona_flores', 'CORONA DE FLORES', 'orejas', 285, 40],
    ['bigote_fancy', 'BIGOTE FANCY', 'cara', 295, 41],
    ['lagrimas_kawaii', 'LAGRIMAS KAWAII', 'cara', 305, 42],
    ['sud_hoodie', 'HOODIE CORAZON', 'sudadera', 320, 43],
    ['sud_milverde', 'SUDADERA CAMUFLAJE', 'sudadera', 320, 43],
    ['casco_vikingo', 'CASCO VIKINGO', 'orejas', 330, 44],
    ['capucha_oso', 'CAPUCHA DE OSO', 'orejas', 340, 45],
    ['peluca_arcoiris', 'PELUCA ARCOIRIS', 'orejas', 350, 46],
    ['aura_fuego', 'AURA FUEGO', 'aura', 680, 76]
  ].forEach(([id, nombre, slot, precio, nivel]) => {
    const crop = slot === 'sudadera' ? [0, 44, 56, 34] : null;
    registrarRopa({ id, nombre, slot, precio, nivel, crop });
  });
