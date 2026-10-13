  /* ===================== SIMON ===================== */
  function dibujarCorona(g) {
    capa(g, ROJO_CORONA, L => {
      const pico = (cx, ap, hw) => (x, y) => y >= ap && y <= 8 && Math.abs(x + .5 - cx) <= hw * (y - ap + 1) / (8 - ap + 1);
      const t = (x, y) => x >= 17 && x <= 38 && ((y >= 8 && y <= 11) || pico(20, 3, 4.5)(x, y) || pico(28, 0, 6.5)(x, y) || pico(36, 3, 4.5)(x, y));
      sombrear(L, t, 28, 6, 11, 8, R.corona);
      // puntas rojas y joyas
      [[27, 0], [28, 0], [27, 1], [28, 1], [19, 3], [20, 3], [19, 4], [20, 4], [35, 3], [36, 3], [35, 4], [36, 4]].forEach(([x, y]) => L.set(x, y, GEMA));
      [[27, 0], [19, 3], [35, 3]].forEach(([x, y]) => L.set(x, y, '#ffb4bc'));
      [19, 23, 27, 31, 35].forEach(x => { L.set(x, 10, GEMA); L.set(x + 1, 10, '#c0222f'); });
    });
  }
  function estFisico() {   // el estado físico real de Simon ahora mismo: ojeras, flacura, tristeza, enfermo, abandono (lo mismo que se usa al dibujarlo en pantalla)
    const est = { oj: !e.dormido && e.energia < 30 ? 1 : 0, fl: e.hambre < 12 ? 2 : e.hambre < 30 ? 1 : 0, tri: e.feliz < 12 ? 2 : e.feliz < 30 ? 1 : 0, en: e.enf ? 1 : 0, l: (tk >> 2) % 3, ab: nivelAbandono() };
    if ((!est.tri || est.tri < 2) && !est.en && !est.ab) est.l = 0;
    if (est.ab === 2) { est.tri = 2; est.oj = 1; est.fl = Math.max(est.fl, 1); }
    else if (est.ab === 1) { est.tri = Math.max(est.tri, 1); est.oj = 1; }
    return est;
  }
  function simonGrid(ojos, boca, ropa, est, atras, auraFr) {
    ropa = ropa || {}; est = est || {};
    const [ra, oa, oa2] = SUDS[ropa.sudadera] || SUDS.sud_azul;
    const g = Grid(SW, SH);
    if (ropa.aura && ropa.aura !== 'aura_legend') accAura(g, ropa.aura, auraFr || 0);   // la legendaria se dibuja aparte, en su propio lienzo más grande (ver auraLegendGrid)
    if (ropa.espalda && !atras) accCapa(g, ropa.espalda);
    // ---- piernas (shorts blancos con corazones) ----
    if (!atras) [[19, 'a'], [37, 'b']].forEach(([cx, k]) => capa(g, TINTA, L => {
      const t = elipse(cx, 70, 8.5, 7.5);
      sombrear(L, t, cx, 70, 8.5, 7.5, R.piel);
      const corazon = [".r.r.", "rrrrr", ".rrr.", "..r.."];
      [[cx - 6, 71], [cx + 1, 73]].forEach(([hx, hy]) => corazon.forEach((row, j) => [...row].forEach((ch, i) => {
        if (ch === 'r' && t(hx + i, hy + j)) L.set(hx + i, hy + j, j === 0 && i === 1 ? '#ff8a96' : '#e8353f');
      })));
    }));
    // ---- sudadera ----
    capa(g, oa, L => {
      const hw = y => 15 + (y - 50) * .12;
      const t = (x, y) => y >= 50 && y <= (atras ? 77 : 69) && Math.abs(x + .5 - 28) <= hw(y);
      sombrear(L, t, 28, 58, 19, 15, ra);
      for (let y = atras ? 75 : 67; y <= (atras ? 77 : 69); y++) for (let x = 0; x < SW; x++) if (t(x, y)) L.set(x, y, x % 2 ? ra[2] : ra[3]);   // resorte
    });
    if (!atras) capa(g, oa2, L => {                                         // bolsillo
      L.rect(19, 60, 18, 7, ra[2]); L.rect(20, 61, 16, 1, ra[1]); L.rect(19, 66, 18, 1, ra[3]);
    });
    if (!atras) [[25, 53, 60], [30, 53, 60]].forEach(([x, y0, y1]) => { for (let y = y0; y <= y1; y++) g.set(x, y, '#e8ecff'); g.set(x, y1 + 1, '#a9b2ff'); });   // cordones
    // ---- brazos ----
    [8, 48].forEach(cx => capa(g, oa, L => {
      sombrear(L, elipse(cx, 58, 5.5, 11), cx, 58, 5.5, 11, ra);
      for (let y = 66; y <= 68; y++) for (let x = cx - 6; x <= cx + 6; x++) if (L.has(x, y)) L.set(x, y, ra[3]);
    }));
    // ---- capucha ----
    capa(g, oa, L => sombrear(L, elipse(28, 52, 17, 6), 28, 52, 17, 6, ra));
    if (atras) { for (let y = 54; y <= 74; y++) g.set(28, y, ra[3]); capa(g, oa, L => sombrear(L, elipse(28, 49, 11, 6), 28, 49, 11, 6, ra)); }
    if (ropa.sudadera === 'sud_arcoiris') {                       // franjas de arcoíris sobre la sudadera
      const RB = [['#ffb0b0', '#ff4a4a', '#c01c2c', '#780c1c'], ['#ffd0a0', '#ff9a30', '#d06a10', '#7a3a08'], ['#fff6a0', '#ffe030', '#d0a810', '#806008'], ['#b8f0a8', '#58d048', '#2a9a30', '#126020'], ['#b0e0ff', '#48a8f0', '#2468c8', '#123888'], ['#d8b8ff', '#9858e8', '#6a30b0', '#401880']];
      const cl = (r, gg, b) => [r, gg, b], base = ra.map(c => col(c));
      for (let y = 44; y <= 69; y++) for (let x = 0; x < SW; x++) {
        const i = (y * SW + x) * 4;
        if (g.d[i + 3] === 0) continue;
        const k = base.findIndex(b => b[0] === g.d[i] && b[1] === g.d[i + 1] && b[2] === g.d[i + 2]); if (k < 0) continue;
        const nc = col(RB[Math.min(5, Math.floor((y - 46) / 4))][k]); g.d[i] = nc[0]; g.d[i + 1] = nc[1]; g.d[i + 2] = nc[2];
      }
    }
    if (SUDP[ropa.sudadera]) {                                      // sudaderas estampadas
      const P = SUDP[ropa.sudadera], base = ra.map(c => col(c));
      for (let y = 44; y <= 69; y++) for (let x = 0; x < SW; x++) {
        const i = (y * SW + x) * 4;
        if (g.d[i + 3] === 0) continue;
        const k = base.findIndex(b => b[0] === g.d[i] && b[1] === g.d[i + 1] && b[2] === g.d[i + 2]); if (k < 0) continue;
        let nc = P.pals[P.f(x, y) % P.pals.length][k];
        if (P.est && (x * 31 + y * 17) % P.est === 0) nc = [255, 255, 255, 255];
        g.d[i] = nc[0]; g.d[i + 1] = nc[1]; g.d[i + 2] = nc[2];
      }
    }
    // ---- cabeza ----
    capa(g, TINTA, L => sombrear(L, elipse(28, 32, 25, 20), 28, 32, 25, 20, R.piel));
    if (!atras && (boca === 's' || boca === 't') && !est.tri) [[13, 44], [38, 44]].forEach(([x, y]) => { for (let j = 0; j < 2; j++) for (let i = 0; i < 5; i++) if (!(j === 1 && (i === 0 || i === 4))) g.set(x + i, y + j, '#ffa0b6'); });   // rubor
    // ---- ojos ----
    if (!atras) [15, 41].forEach(cx => {
      if (ojos === 'a') {
        capa(g, null, L => sombrear(L, elipse(cx, 34, 8.5, 8.5), cx, 34, 8.5, 8.5, R.ojo));
        [[-5, -5], [-4, -5], [-5, -4]].forEach(([dx, dy]) => g.set(cx + dx, 34 + dy, '#8a8ab8'));   // brillito
      } else {
        for (let x = cx - 8; x <= cx + 8; x++) {
          const y = 32 + Math.round(3 * (1 - Math.pow((x - cx) / 8, 2)));
          g.set(x, y, '#0e0e18'); g.set(x, y + 1, '#0e0e18');
        }
      }
    });
    if (est.oj && ojos === 'a') [15, 41].forEach(cx => {          // ojeras: bolsitas moradas pegadas al borde inferior del ojo
      for (let x = cx - 8; x <= cx + 8; x++) {
        const y = Math.round(34 + Math.sqrt(Math.max(0, 10.2 * 10.2 - (x - cx) * (x - cx))));
        if (y >= 40) { g.set(x, y, '#5a3a86'); g.set(x, y + 1, '#8a62b4'); if (Math.abs(x - cx) < 6) g.set(x, y + 2, '#b898d8'); }
      }
    });
    if (est.tri && ojos === 'a') [15, 41].forEach(cx => { g.set(cx - 3, 32, '#ffffff'); g.set(cx - 3, 31, '#ffffff'); g.set(cx - 4, 31, '#c8d0ff'); });   // ojos brillantes de pena
    if (est.tri === 2 && ojos === 'a') [15, 41].forEach(cx => {       // lágrimas que caen por las mejillas
      const f = est.l || 0, d = cx < 28 ? -1 : 1, tx = cx + d * 6;
      for (let y = 42; y <= 52; y++) { g.set(tx + d * (y > 47 ? 1 : 0), y, '#7ac8ff'); if (y % 3 === f) g.set(tx + d * (y > 47 ? 1 : 0), y, '#e0f6ff'); }
      g.set(tx + d * 2, 53 + f, '#7ac8ff'); g.set(tx + d * 2, 54 + f, '#e0f6ff');
      g.set(tx - d, 42, '#7ac8ff'); g.set(tx - 2 * d, 42, '#7ac8ff');
    });
    if (est.fl) {                                                      // mejillas hundidas
      [[9, 1], [47, -1]].forEach(([x0, d]) => { for (let i = 0; i < 8; i++) { g.set(x0 + d * (i >> 1), 38 + i, '#6a6e9c'); g.set(x0 + d * ((i >> 1) + 1), 38 + i, '#9a9ec8'); } });
      g.rect(22, 50, 12, 1, '#9a9ec8');
    }
    // ---- boca ----
    if (!atras) {
    if (boca === 'n' && est.tri) {
      if (est.tri === 2) { g.rect(24, 44, 8, 5, TINTA); g.rect(25, 45, 6, 3, '#1a1630'); g.rect(26, 47, 4, 1, '#e0607a'); }
      else [[23, 47], [24, 46], [25, 45], [26, 45], [27, 45], [28, 45], [29, 45], [30, 45], [31, 46], [32, 47]].forEach(([x, y]) => g.set(x, y, TINTA));
    }
    else if (boca === 'n') g.rect(25, 45, 6, 2, TINTA);
    else if (boca === 't') { capa(g, null, L => { L.rect(24, 43, 8, 6, '#1a1630'); }); g.rect(25, 47, 6, 2, '#e0607a'); g.set(24, 43, TINTA); g.set(31, 43, TINTA); g.set(24, 48, TINTA); g.set(31, 48, TINTA); }
    else [[23, 44], [24, 45], [25, 46], [26, 46], [27, 46], [28, 46], [29, 46], [30, 46], [31, 45], [32, 44]].forEach(([x, y]) => g.set(x, y, TINTA));
    }
    if (est.en) {
      g.rect(27, 39, 3, 2, '#ff6a78'); g.set(27, 39, '#ffc0c8'); const f = est.l || 0; g.rect(28, 41, 1, 1 + f, '#bfe8ff'); g.set(28, 42 + f, '#e8f8ff');
      if (!atras) [[12, 42], [44, 42]].forEach(([cx, cy]) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -2; dx <= 2; dx++) if ((dx + dy) % 2 === 0) g.set(cx + dx, cy + dy, '#ff8aa6'); });
    }
    if (ropa.orejas) accOrejas(g, ropa.orejas);
    if (ropa.cuello) accCuello(g, ropa.cuello);
    if (ropa.cara && !atras) accGafas(g, ropa.cara);
    if (est.en && !atras && ropa.cara && ropa.cara !== 'nariz_payaso' && ropa.cara !== 'casco_espacial') {
      g.rect(27, 39, 3, 2, '#ff6a78'); g.set(27, 39, '#ffc0c8'); const f = est.l || 0; g.rect(28, 41, 1, 1 + f, '#bfe8ff'); g.set(28, 42 + f, '#e8f8ff');
    }
    if (est.fl) {                                                      // hambre: el cuerpo se ve flaquito
      const k0 = est.fl === 2 ? .66 : .8, src = g.d.slice();
      for (let y = 44; y < SH; y++) {
        const k = 1 - (1 - k0) * Math.min(1, (y - 44) / 1);
        for (let x = 0; x < SW; x++) {
          const sx = Math.round(28 + (x - 28) / k), i = (y * SW + x) * 4;
          if (sx >= 0 && sx < SW) { const j = (y * SW + sx) * 4; g.d[i] = src[j]; g.d[i + 1] = src[j + 1]; g.d[i + 2] = src[j + 2]; g.d[i + 3] = src[j + 3]; }
          else g.d[i + 3] = 0;
        }
      }
    }
    // ---- estados de abandono ----
    if (est.ab >= 1 && !atras) {
      // ab1+: manchas de suciedad y desaturación leve
      const manchas = [[10,35],[14,52],[38,48],[44,36],[22,62],[34,60],[8,60],[48,61]];
      manchas.forEach(([mx,my]) => { g.set(mx,my,'#5a5068'); g.set(mx+1,my,'#4a4058'); g.set(mx,my+1,'#6a5878'); });
      // desaturación parcial (todo el sprite un 40% hacia gris)
      for (let i = 0; i < g.d.length; i += 4) {
        if (g.d[i+3] === 0) continue;
        const gr = g.d[i]*0.299 + g.d[i+1]*0.587 + g.d[i+2]*0.114;
        g.d[i]   = Math.round(g.d[i]   * 0.6 + gr * 0.4);
        g.d[i+1] = Math.round(g.d[i+1] * 0.6 + gr * 0.4);
        g.d[i+2] = Math.round(g.d[i+2] * 0.6 + gr * 0.4);
      }
    }
    if (est.ab >= 2 && !atras) {
      // ab2: hollines más grandes, desaturación adicional fuerte, ojeras muy oscuras
      const hollin = [[6,30,'#2a2230'],[48,30,'#2a2230'],[18,25,'#1a1828'],[38,25,'#1a1828'],[12,55,'#2a2230'],[42,55,'#2a2230'],[25,65,'#1a1828'],[20,38,'#2a2230'],[36,38,'#2a2230']];
      hollin.forEach(([hx,hy,hc]) => { for (let dy=0;dy<3;dy++) for (let dx=0;dx<3;dx++) { if(g.d[((hy+dy)*SW+(hx+dx))*4+3]>0) g.set(hx+dx,hy+dy,hc); } });
      // desaturación fuerte adicional (60% más gris)
      for (let i = 0; i < g.d.length; i += 4) {
        if (g.d[i+3] === 0) continue;
        const gr = g.d[i]*0.299 + g.d[i+1]*0.587 + g.d[i+2]*0.114;
        g.d[i]   = Math.round(g.d[i]   * 0.4 + gr * 0.6);
        g.d[i+1] = Math.round(g.d[i+1] * 0.4 + gr * 0.6);
        g.d[i+2] = Math.round(g.d[i+2] * 0.4 + gr * 0.6);
      }
    }
    // ---- corona (la insignia), apoyada sobre la cabeza pelona ----
    if (!sinCorona) { const cg = Grid(SW, SH); dibujarCorona(cg); g.paste(cg, 0, 5); }
    if (atras && ropa.espalda) accCapa(g, ropa.espalda);
    return g;
  }
  function coronaGrid() { const g = Grid(SW, 12); dibujarCorona(g); const o = Grid(22, 12); for (let y = 0; y < 12; y++) for (let x = 0; x < 22; x++) { const a = (y * SW + x + 17) * 4; if (g.d[a + 3]) o.set(x, y, [g.d[a], g.d[a + 1], g.d[a + 2], 255]); } return o; }

