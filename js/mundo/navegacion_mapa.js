  /* ===================== HABITACIONES Y LUGARES ===================== */
  const HABS = [{ id: 'estudio', n: 'ESTUDIO', nv: 2 }, { id: 'juegos', n: 'SALA DE JUEGOS', nv: 2 }, { id: 'sala', n: 'RECÁMARA', nv: 1 }, { id: 'bano', n: 'BAÑO', nv: 1 }, { id: 'cocina', n: 'COCINA', nv: 4 }, { id: 'entrada', n: 'ENTRADA', nv: 7 }, { id: 'jardin', n: 'JARDÍN', nv: 10 }, { id: 'espacial', n: 'RECÁMARA ESPACIAL', nv: 100, oculta: true }];   // 'oculta': no sale en las flechas; se entra por el portal estelar
  const HABS_NAV = HABS.filter(h => !h.oculta);
  const LUGARES = [{ id: 'parque', n: 'PARQUE', nv: 10 }];
  let calle = false, sinCorona = false;
  const escenaId = () => calle ? 'calle' : (lugar || vistaBloq || e.hab);
  /* ---- SALA DE JUEGOS: máquina arcade (acceso a los minijuegos). Va a la izquierda: Cortex llega por la derecha y no la tapa ---- */
  function habMini(id) {
    const g = Grid(48, 32);
    const pared = { estudio: '#5a7ac0', juegos: '#3a2a6e', cocina: '#e8d8a8', entrada: '#c8a878', sala: '#d89870' }[id] || '#8a7ac0';
    g.rect(0, 0, 48, 32, pared); g.rect(0, 22, 48, 10, mixC(pared, .6)); g.rect(0, 21, 48, 1, mixC(pared, .4));
    if (id === 'estudio') {
      g.rect(8, 16, 24, 3, '#a06a34'); g.rect(9, 19, 2, 8, '#7a4a20'); g.rect(29, 19, 2, 8, '#7a4a20');
      g.rect(11, 12, 4, 4, '#ff6a8a'); g.rect(15, 11, 3, 5, '#6ad0ff'); g.rect(18, 13, 3, 3, '#ffd84a');
      g.rect(25, 9, 5, 7, '#2a2a44'); g.rect(26, 10, 3, 4, '#8ce8ff'); g.rect(26, 16, 3, 1, '#2a2a44');
      g.rect(36, 18, 5, 3, '#c04a4a'); g.rect(38, 8, 1, 10, '#6a6a7a'); g.rect(35, 6, 7, 3, '#ffe45a');
      g.rect(5, 4, 8, 6, '#ffe8a8'); g.rect(6, 5, 6, 4, '#8ccfff');
    } else if (id === 'juegos') {
      g.rect(16, 4, 16, 26, '#d03a5a'); g.rect(18, 6, 12, 9, '#101830'); g.rect(19, 7, 10, 7, '#3ae0a0'); g.rect(22, 9, 2, 2, '#fff'); g.rect(26, 11, 2, 2, '#ffd84a');
      g.rect(18, 18, 12, 4, '#7a1a34'); g.rect(20, 19, 2, 2, '#ffd84a'); g.rect(25, 19, 2, 2, '#6ad0ff'); g.rect(28, 19, 1, 2, '#6aff8a');
      g.rect(16, 4, 16, 1, '#ff7a94'); g.rect(6, 6, 2, 2, '#ffd84a'); g.rect(40, 10, 2, 2, '#6ad0ff'); g.rect(10, 14, 2, 2, '#ff6a8a');
    } else if (id === 'cocina') {
      g.rect(6, 4, 14, 26, '#e8f0f4'); g.rect(6, 15, 14, 1, '#8a9aa4'); g.rect(17, 7, 1, 5, '#8a9aa4'); g.rect(17, 18, 1, 6, '#8a9aa4');
      g.rect(24, 17, 20, 13, '#a07a4a'); g.rect(24, 15, 20, 3, '#d8d8e0'); g.rect(30, 8, 8, 6, '#ffffff'); g.rect(31, 9, 6, 4, '#ffd84a');
      g.rect(26, 22, 7, 5, '#7a5a30'); g.rect(35, 22, 7, 5, '#7a5a30');
    } else if (id === 'entrada') {
      g.rect(16, 3, 16, 27, '#7a4a2a'); g.rect(18, 5, 12, 11, '#9a6a3a'); g.rect(18, 18, 12, 10, '#9a6a3a'); g.rect(28, 17, 2, 2, '#ffd84a');
      g.rect(14, 26, 20, 4, '#c04a4a'); g.rect(15, 27, 18, 2, '#e07a7a'); g.rect(4, 8, 6, 8, '#6ad0ff'); g.rect(38, 14, 5, 8, '#6cc070');
    } else {
      g.rect(8, 14, 26, 8, '#6a4aa0'); g.rect(8, 10, 26, 5, '#8a6ac0'); g.rect(36, 6, 8, 12, '#ffe8a8');
    }
    return g;
  }
  function lugarMini(id) {
    const g = Grid(48, 32);
    g.rect(0, 0, 48, 32, '#8ccfff'); g.rect(0, 0, 48, 8, '#6ec0ff');
    disco(g, 38, 7, 4, '#ffe45a');
    for (let x = 0; x < 48; x++) { const h = 15 + Math.round(3 * Math.sin(x / 6)); g.rect(x, h, 1, 32 - h, '#6cc070'); g.rect(x, h + 7, 1, 25, '#52aa58'); }
    g.rect(10, 12, 2, 8, '#6a4020'); capa(g, '#12432a', L => sombrear(L, elipse(11, 9, 6, 6), 11, 9, 6, 6, R.verde));
    for (let y = 20; y < 32; y++) { const hw = 3 + (y - 20) * .5; for (let x = 0; x < 48; x++) if (Math.abs(x + .5 - 30) <= hw) g.set(x, y, '#e0c48c'); }
    [[4, 26, '#ff6a8a'], [40, 24, '#ffd84a'], [16, 28, '#ffffff'], [44, 29, '#b890ff']].forEach(([x, y, c]) => g.set(x, y, c));
    return g;
  }
  function fondoEscena(esc, n, dy) {
    const cl = ((esc === 'sala' && (lunaDorada() || sangreCielo() || lunaAzulT())) || (esc === 'cocina' && (lunaOroT() || lunaSangreT() || lunaAzulT()))) ? (sangreCielo() && ((bl && ['entra', 'lanza', 'habla'].includes(bl.f)) || (!bl && e.sangFase === 1)) ? 'nublado' : 'sol') : clima();
    if (esc === 'sala' || esc === 'cocina') { ctx.drawImage(cieloDe(n, cl), OX, dy); climaFX(cl, n, dy); }
    if (esc === 'sala') { ovCielo(dy); sangreCieloDib(dy); azulVentana(dy); }
    else if (esc === 'cocina') lunasSolo(dy);
    if (esc === 'sala') ctx.drawImage(sprite('cuarto' + LW + 'x' + LH + e.cuarto.pared + e.cuarto.alfombra + (e.cuarto.piso || '') + cuadroClave(), () => cuartoGrid(LW, LH, RY, SY + SH - 11, OX, paleta()), n ? .55 : 0), 0, 0);
    else if (esc === 'juegos') { ctx.drawImage(sprite('juegos' + LW + 'x' + LH + estSty('juegos').k, () => juegosGrid(LW, LH, RY, OX, estSty('juegos')), n ? .55 : 0), 0, 0); arcadeVivo(); trofeosVivo(); }
    else if (esc === 'estudio') estudioFondo(n);
    else if (esc === 'cocina') { ctx.drawImage(sprite('cocina' + LW + 'x' + LH + estSty('cocina').k + (e.cuarto.refri || ''), () => cocinaGrid(LW, LH, RY, OX, estSty('cocina')), n ? .55 : 0), 0, 0); if (!dlg && !modal && !cg && (tk >> 3) % 2) { ctx.fillStyle = '#ffe45a'; for (let j = 0; j < 4; j++) { ctx.fillRect(OX + 12 + j, RY - 20 + j, 8 - j * 2, 1); ctx.fillRect(OX + 100 + j, RY - 38 + j, 8 - j * 2, 1); } } }
    else if (esc === 'bano') { if (ban && !ban.pov && ban.i >= 3) ctx.drawImage(sprite('ducha' + LW + 'x' + LH + estSty('bano').k, () => duchaGrid(LW, LH, RY, OX, estSty('bano')), 0), 0, 0); else { ctx.drawImage(sprite('bano' + LW + 'x' + LH + estSty('bano').k, () => banoGrid(LW, LH, RY, OX, estSty('bano')), n ? .55 : 0), 0, 0); if (!dlg && !modal && !ban && (tk >> 3) % 2) { ctx.fillStyle = '#ffe45a'; for (let j = 0; j < 4; j++) ctx.fillRect(OX + 109 + j, RY - 52 + j, 8 - j * 2, 1); } } }
    else if (esc === 'entrada') {
      ctx.drawImage(sprite('entrada' + LW + 'x' + LH + estSty('entrada').k, () => entradaGrid(LW, LH, RY, OX, estSty('entrada')), n ? .55 : 0), 0, 0);
      if (!dlg && !modal && (tk >> 3) % 2) { ctx.fillStyle = '#ffe45a'; for (let j = 0; j < 4; j++) ctx.fillRect(OX + 25 + j, RY - 49 + j, 8 - j * 2, 1); }
    } else if (esc === 'calle') calleFondo();
    else if (esc === 'jardin') {
      const pn = esNoche(); cieloParque(cl, pn); jardinDia();
      const plots = jardinSync();
      ctx.drawImage(sprite('jardinF' + LW + 'x' + LH + cl + '|' + plots.length + (pn ? '_n' : ''), () => jardinGrid(LW, LH, RY, cl, plots, 0, pn, 1), pn ? .55 : 0), 0, 0);   // solo el fondo: las macetas se dibujan después de los muebles
    }
    else if (esc === 'espacial') {
      const fs = faseEspacial(), fr = (tk >> 4) & 1;
      ctx.drawImage(sprite('espCielo' + fs + fr, () => espCieloGrid(fs, fr), 0), OX, dy);   // el cielo de su planeta, por la ventana
      if (!e.espReparado) ctx.drawImage(sprite('espRuina' + LW + 'x' + LH, () => espRuinaGrid(LW, LH, RY), n ? .55 : 0), 0, 0);   // sin reparar: destruida
      else ctx.drawImage(sprite('espacial' + LW + 'x' + LH, () => espSalaCompleta(LW, LH, RY), n ? .55 : 0), 0, 0);
    }
    else {
      const pn = esNoche(); cieloParque(cl, pn);
      ctx.drawImage(sprite('parque' + LW + 'x' + LH + cl, () => parqueGrid(LW, LH, RY, cl), pn ? .55 : 0), 0, 0);
      if ((typeof jugFis === 'undefined' || (!jugFis.activo && !jugFis.arr)) && (!act || act.tipo !== 'pelota')) { const jk = juguetePuesto(), tj = sprite('tj_' + jk, () => ITEMS[jk].grid(), 0); ctx.drawImage(tj, SX + SW + 6, SY + SH - 4 - tj.height); }
    }
  }
  function jardinMacetasFrente() {   // las macetas (y su brillo nocturno) van por encima de todos los muebles del jardín, pero detrás de Simon
    const pn = esNoche(), cl = clima(), plots = jardinSync(), hayListo = plots.some(p => p.etapa === 'listo'), fr = hayListo ? tk % 24 : 0;
    const pk = plots.map(p => p.k + '_' + p.etapa + '_' + (p.regadoHoy ? 1 : 0)).join('|') + (hayListo ? '_f' + fr : '') + (pn ? '_n' : '');
    ctx.drawImage(sprite('jardinM' + LW + 'x' + LH + cl + '|' + pk, () => jardinGrid(LW, LH, RY, cl, plots, fr, pn, 2), pn ? .55 : 0), 0, 0);
    if (pn) {   // las plantas ya florecidas (listas) son bioluminiscentes: iluminan de noche, las que aún crecen no
      const np = plots.length;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';   // aditivo: devuelve el brillo real de la flor bajo el oscurecido nocturno, no solo un halo encima
      plots.forEach((p, i) => {
        if (!p.k || p.etapa !== 'listo') return;
        const S = SEMILLAS[p.k]; if (!S) return;
        const s = jardinSlot(i, np, LW), cc = col(S.col), fx = s.cx, fy = s.base - JARDIN_POTH - 19;
        ctx.fillStyle = 'rgba(' + cc[0] + ',' + cc[1] + ',' + cc[2] + ',.4)';
        for (let j = -11; j <= 11; j++) { const w = Math.round(12 * Math.sqrt(1 - (j / 11) * (j / 11))); ctx.fillRect(Math.round(fx - w), Math.round(fy + j), w * 2, 1); }
      });
      ctx.restore();
    }
  }
  // navegación: flechas laterales, fundido y mapa
  const flechaGrid = dir => { const g = Grid(8, 11); for (let y = 0; y < 11; y++) { const a = y <= 5 ? y : 10 - y; for (let x = 0; x <= a + 1; x++) g.set(dir < 0 ? 7 - x : x, y, '#ffffff'); } g.contour('#232b63'); return g; };
  const HAB_ICO = { estudio: '📖', juegos: '🎮', sala: '🛏️', bano: '🛁', cocina: '🍳', entrada: '🚪', jardin: '🌷', espacial: '🪐' };
  function pintarNav() {
    const bVes = $('b-vestir');
    if (bVes) {
      const fuera = !!(lugar || calle || vistaBloq);
      bVes.classList.toggle('bloq', fuera);
      bVes.setAttribute('aria-disabled', fuera ? 'true' : 'false');
      bVes.title = fuera ? 'Aquí no puedes usar esto' : 'Vestir a Simon';
    }
    const bEd = $('b-editar');
    if (bEd) {
      const fuera = !!(lugar || calle || vistaBloq);
      bEd.classList.toggle('bloq', fuera);
      bEd.setAttribute('aria-disabled', fuera ? 'true' : 'false');
      bEd.title = fuera ? 'Aquí no puedes usar esto' : 'Mover muebles';
    }
    const tag = $('lugar-tag'), tagT = $('lugar-tag-t'), icT = $('ic-lugartag'), l = $('fl-izq'), r = $('fl-der'), idx = habIdxActual();
    tagT.textContent = lugar ? LUGARES.find(x => x.id === lugar).n : HABS[idx].n;
    icT.textContent = lugar ? '' : (HAB_ICO[HABS[idx].id] || '');
    const flecha = (b, d, txt, bloq) => { b.classList.remove('oculto'); b.classList.toggle('bloq', !!bloq); $('tx-' + b.id).textContent = txt || ''; dibIcono($('ic-' + b.id), 'ic_' + b.id, () => flechaGrid(d)); };
    if (lugar) { flecha(l, -1, 'CASA', false); r.classList.add('oculto'); return; }
    if (HABS[idx].oculta) { l.classList.add('oculto'); r.classList.add('oculto'); return; }   // la Recámara Espacial no tiene flechas: se sale por su portal
    if (idx > 0) flecha(l, -1, '', nivel() < HABS[idx - 1].nv); else l.classList.add('oculto');
    if (idx < HABS_NAV.length - 1) flecha(r, 1, '', nivel() < HABS[idx + 1].nv); else r.classList.add('oculto');
  }
  function puedeMoverse() {
    if (sifP && sifP.casa) return false;
    if (dlg || ban || (modal && modal !== 'editar') || cambiando) return false;
    if ((cortex.p && !mercPres && !desc) || cortex.dir || mercBusy || bm) { toast('Cortex está de visita'); return false; }
    return true;
  }
  function irA(fn) {
    if (typeof jugFisReset === 'function') jugFisReset(); else if (typeof jugFis !== 'undefined') { jugFis.activo = false; jugFis.arr = false; jugFis.vx = 0; jugFis.vy = 0; }
    cambiando = true; const f = $('fundido'); f.classList.add('on');
    setTimeout(() => { fn(); act = null; proxAct = tk + 70; presencia(); if (edit) { edit.sel = null; edit.drag = null; pintarEdicion(); } dibujar(); pintarNav(); lluviaCheck(); f.classList.remove('on'); setTimeout(() => { cambiando = false; evProcesar(); }, 200); }, 200);
  }
  let vistaBloq = null;   // id de la habitación bloqueada que se está mirando (Simon no está ahí; es solo vista "en obra")
  function mostrarHabLetrero(h) { $('hab-prev-nom').textContent = h.n; $('hab-prev-msg').textContent = 'SE DESBLOQUEA EN CARIÑO NV' + h.nv; $('hab-prev').classList.add('on'); }
  function ocultarHabLetrero() { $('hab-prev').classList.remove('on'); const r = $('esp-rep'); if (r) { r.classList.remove('on'); repConf = false; } }
  function salirVistaBloq() { if (vistaBloq) { vistaBloq = null; ocultarHabLetrero(); } }
  const habIdxActual = () => HABS.findIndex(h => h.id === (vistaBloq || e.hab));
  function obraGrid(W, H, frame) {
    const g = Grid(W, H);
    // ---- velo de polvo sobre toda la habitación ----
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, [24, 18, 10, 150]);
    // ---- cinta de precaución (franjas diagonales) arriba y abajo ----
    const cinta = (y0, h) => { for (let x = -h; x < W + h; x++) { const f = Math.floor((x + y0) / 7); g.set(x, y0, f % 2 === 0 ? '#ffd84a' : '#19141f'); for (let j = 1; j < h; j++) g.set(x + j, y0 + j, f % 2 === 0 ? '#ffd84a' : '#19141f'); } };
    cinta(3, 7); cinta(H - 10, 7);
    // ---- torres de andamio metálico con 4 postes y tablones ----
    const px = [8, Math.round(W * .33), Math.round(W * .67), W - 11];
    const topY = 18, botY = H - 16;
    px.forEach(x => { g.rect(x, topY, 3, botY - topY, '#b8bcc8'); g.rect(x, topY, 1, botY - topY, '#e8ecf4'); g.rect(x + 2, topY, 1, botY - topY, '#767a8c'); });
    const bays = [[px[0], px[1]], [px[1], px[2]], [px[2], px[3]]];
    const franjas = [[topY + 4, Math.round((botY - topY) / 2) + topY - 4], [Math.round((botY - topY) / 2) + topY + 4, botY - 6]];
    franjas.forEach(([y0, y1]) => bays.forEach(([xa, xb]) => { linea(g, xa + 2, y0, xb, y1, '#767a8c'); linea(g, xb, y0, xa + 2, y1, '#767a8c'); }));
    // tablones horizontales (plataformas) a dos alturas
    [topY + 2, Math.round((botY - topY) / 2) + topY].forEach(py => { g.rect(px[0] - 2, py, px[3] - px[0] + 7, 4, '#a9702c'); g.rect(px[0] - 2, py, px[3] - px[0] + 7, 1, '#d89a50'); g.rect(px[0] - 2, py + 3, px[3] - px[0] + 7, 1, '#6a4418'); });
    // foco colgante desde el tablón de arriba, oscilando un poco
    { const bx = Math.round(W / 2) + (frame % 20 < 10 ? 0 : 1), by0 = topY + 6;
      g.rect(bx, by0, 1, 7, '#2a2a34'); const glow = (frame >> 2) % 3 === 0;
      g.set(bx - 1, by0 + 7, glow ? '#fff3b0' : '#ffe45a'); g.set(bx, by0 + 7, glow ? '#fff8d0' : '#ffd84a'); g.set(bx + 1, by0 + 7, glow ? '#fff3b0' : '#ffe45a'); g.set(bx, by0 + 8, glow ? '#ffe45a' : '#c89a2a');
    }
    // ---- escalera recargada en la esquina izquierda ----
    { const lx = 12, ly0 = botY, ly1 = botY - 46;
      linea(g, lx, ly0, lx + 10, ly1, '#c88a40'); linea(g, lx + 7, ly0, lx + 17, ly1, '#c88a40');
      for (let s = 1; s < 8; s++) { const t = s / 8, xa = lx + 10 * t, xb = lx + 7 + 10 * t, y = ly0 + (ly1 - ly0) * t; linea(g, xa, y, xb, y, '#8a5a28'); }
    }
    // ---- carretilla con tierra, abajo a la derecha ----
    { const wx = W - 34, wy = botY - 2;
      g.rect(wx + 3, wy - 10, 16, 7, '#d8862a'); g.rect(wx + 3, wy - 10, 16, 1, '#f0a850');
      g.rect(wx, wy - 3, 7, 3, '#6a4418'); g.rect(wx + 19, wy - 3, 7, 3, '#6a4418');
      for (let i = 0; i < 9; i++) g.set(wx + 5 + (i % 5) * 2, wy - 11 - (i % 3), i % 2 ? '#5a3c1e' : '#3a2810');
      const ecx = wx + 1, ecy = wy + 1; for (let yy = -3; yy <= 3; yy++) for (let xx = -3; xx <= 3; xx++) if (xx * xx + yy * yy <= 9) g.set(ecx + xx, ecy + yy, '#2a2a34');
      g.set(ecx - 1, ecy - 1, '#5a5a6c');
    }
    // ---- pila de ladrillos y bote de pintura, abajo a la izquierda ----
    { const bx = 20, by = botY - 1;
      [[0, 0], [5, 0], [10, 0], [2, -4], [7, -4], [0, -8], [5, -8]].forEach(([dx, dy]) => g.rect(bx + dx, by + dy - 3, 5, 4, (dx + dy) % 3 === 0 ? '#b8482e' : '#9e3c26'));
    }
    { const pxx = W / 2 - 24, py = botY - 9;
      g.rect(pxx, py, 9, 9, '#3a5aa8'); g.rect(pxx, py, 9, 1, '#6a8ad8'); g.rect(pxx, py - 3, 9, 3, '#dfe6f4'); g.rect(pxx + 3, py - 5, 3, 2, '#8a92a0');
    }
    // ---- caballete de madera con tabla, centro-derecha abajo ----
    { const sx = W / 2 + 14, sy = botY - 2;
      linea(g, sx - 6, sy, sx - 1, sy - 9, '#8a5a28'); linea(g, sx + 6, sy, sx + 1, sy - 9, '#8a5a28');
      linea(g, sx - 14, sy, sx - 9, sy - 9, '#8a5a28'); linea(g, sx + 14, sy, sx + 9, sy - 9, '#8a5a28');
      g.rect(sx - 16, sy - 11, 32, 3, '#c9975a'); g.rect(sx - 16, sy - 11, 32, 1, '#e8c088');
    }
    // ---- letrero de madera con triángulo de advertencia, arriba ----
    { const tx = Math.round(W / 2 - 9), ty = topY - 14;
      for (let r = 0; r < 14; r++) { const w = Math.round(r * 14 / 13); g.rect(tx + 9 - w, ty + r, w * 2, 1, '#ffd84a'); }
      for (let r = 3; r < 12; r++) { const w = Math.max(1, Math.round((r - 2) * 9 / 9)); g.rect(tx + 9 - w + 1, ty + r, Math.max(1, w * 2 - 2), 1, '#19141f'); }
      g.rect(tx + 8, ty + 5, 2, 5, '#ffd84a'); g.rect(tx + 8, ty + 12, 2, 2, '#ffd84a');
    }
    // ---- motas de polvo flotando ----
    const motas = [[20, 60], [40, 100], [78, 45], [95, 90], [55, 130], [100, 60], [30, 150], [66, 70]];
    motas.forEach(([x, y], i) => { const tw = (frame + i * 5) % 40; if (tw < 26) g.set(x, y - (tw >> 3), tw < 6 || tw > 20 ? '#8a8270' : '#d8cfb0'); });
    return g;
  }
  function dibujarConstruccion() {
    if (vistaBloq === 'espacial') { espRuinaFx(); return; }   // la Recámara Espacial sin reparar se ve en ruinas, con chispas y polvo
    const frame = tk % 40;
    ctx.drawImage(sprite('obra' + LW + 'x' + LH + '_' + frame, () => obraGrid(LW, LH, frame), 0), 0, 0);
  }
  function irHab(i) {
    if (typeof guiaBloq === "function" && guiaBloq("nav")) return;
    if (modal && modal !== 'editar' && !['run', 'mem', 'rt'].includes(modal)) cerrar();
    if (!puedeMoverse()) return;
    const h = HABS[i]; if (!h) return;
    if (nivel() < h.nv) { sfx.no(); irA(() => { vistaBloq = h.id; mostrarHabLetrero(h); }); return; }
    if (typeof jugFisReset === 'function') jugFisReset();
    sfx.click(); irA(() => { vistaBloq = null; ocultarHabLetrero(); e.hab = h.id; guardar(); }); if (h.id === 'cocina' && !e.cocVisto) { e.cocVisto = 1; setTimeout(introCocina, 1100); } if (h.id === 'estudio' && !e.estVisto) { e.estVisto = 1; } if (h.id === 'juegos' && !e.arcVisto) { e.arcVisto = 1; setTimeout(() => toast('Toca la máquina arcade para jugar'), 900); } if (h.id === 'jardin' && !e.jardinVisto) { e.jardinVisto = 1; setTimeout(() => toast('Toca una parcela vacía para sembrar una semilla'), 900); }
  }
  // ---- Recámara Espacial: el hogar de Simon. Se entra tocando el portal estelar (NV100) y se sale por el portal fijo de allá ----
  function espacialAsegura() { if (!e.deco.some(d => d.k === 'portal_hogar')) e.deco.push({ k: 'portal_hogar', x: -40, y: 56, f: 0, h: 'espacial' }); e.tiene.portal_hogar = 1; }
  const ESP_COSTO = 10000;
  let repConf = false;   // primer toque de REPARAR pide confirmar
  function pintarRepLetrero() {
    $('esp-rep-msg').textContent = 'EL HOGAR DE SIMON ESTÁ DESTRUIDO. SIMON SE QUEDA EN LA TIERRA HASTA QUE LO REPARES.';
    const b = $('esp-rep-ok'); b.textContent = repConf ? '¿SEGURO? ' + ESP_COSTO.toLocaleString('en-US') : 'REPARAR · ' + ESP_COSTO.toLocaleString('en-US');
    b.classList.toggle('conf', repConf);
  }
  function irEspacial() {
    if (!admin && nivel() < 100) return;
    if (e.hab === 'espacial' || lugar || calle || vistaBloq) return;
    if (!puedeMoverse()) return;
    sfx.compra(); estrellas(10); const antes = e.hab;
    if (!e.espReparado) {   // sin reparar: se puede ir a verla (en ruinas), pero Simon se queda en la Tierra
      irA(() => { vistaBloq = 'espacial'; repConf = false; pintarRepLetrero(); $('esp-rep').classList.add('on'); pintarNav(); });
      setTimeout(() => toast('LA RECÁMARA ESPACIAL ESTÁ EN RUINAS'), 700);
      return;
    }
    irA(() => { e.habAntes = antes; e.hab = 'espacial'; espacialAsegura(); guardar(); });
    setTimeout(() => toast('RECÁMARA ESPACIAL'), 700);
  }
  function repararEspacial() {
    if (vistaBloq !== 'espacial' || e.espReparado) return;
    if (!repConf) { repConf = true; pintarRepLetrero(); sfx.click(); return; }
    if (e.monedas < ESP_COSTO) { repConf = false; pintarRepLetrero(); toast('FALTAN ' + (ESP_COSTO - e.monedas).toLocaleString('en-US') + ' MONEDAS'); sfx.no(); return; }
    e.monedas -= ESP_COSTO; if (typeof animarMonedas === 'function') animarMonedas(ESP_COSTO, true);
    e.espReparado = 1; sfx.compra(); estrellas(16);
    irA(() => { vistaBloq = null; ocultarHabLetrero(); e.habAntes = e.hab; e.hab = 'espacial'; espacialAsegura(); guardar(); pintarNav(); });
    setTimeout(() => toast('¡RECÁMARA ESPACIAL REPARADA!'), 700);
  }
  function salirRuina() { if (vistaBloq !== 'espacial') return; sfx.click(); irA(() => { vistaBloq = null; ocultarHabLetrero(); pintarNav(); }); }
  { const ok = $('esp-rep-ok'), no = $('esp-rep-x'); if (ok) ok.onclick = repararEspacial; if (no) no.onclick = salirRuina; }
  function volverALaTierra() {
    if (e.hab !== 'espacial' || !puedeMoverse()) return;
    const ok = id => HABS_NAV.some(h => h.id === id) && nivel() >= HABS.find(h => h.id === id).nv;
    const h = ok(e.habAntes) ? e.habAntes : 'sala';
    sfx.compra(); estrellas(10);
    irA(() => { e.hab = h; guardar(); });
  }
  function faseEspacial() { const h = horaR(); return (h >= 19 || h < 6) ? 0 : h < 8 ? 1 : h < 17 ? 2 : 3; }   // noche · amanecer · día · atardecer del planeta de Simon
  function irLugar(id) {
    const l = LUGARES.find(x => x.id === id); if (!l || nivel() < l.nv) return;
    if (e.dormido) { toast('SIMON ESTÁ DURMIENDO'); sfx.no(); return; }
    if (id === 'parque' && nivelAbandono() >= 2) { toast('SIMON ESTÁ MUY DÉBIL...'); sfx.no(); return; }
    if (typeof jugFisReset === 'function') jugFisReset();
    cerrar(); cambiando = true;
    setTimeout(() => { cambiando = false; irA(() => { lugar = id; llegada = { t: 0 }; if (typeof navPush === 'function') navPush(); }); }, 60);
  }
  function volverACasa(hPop = true) { if (!puedeMoverse()) return; if (typeof jugFisReset === 'function') jugFisReset(); sfx.click(); irA(() => { lugar = null; llegada = null; if (hPop && typeof navPop === 'function') navPop(); }); setTimeout(() => { decir('Sí.', e.traductor ? 'Qué rico el parque. Ahora a casa.' : null, 2800); hablar(); }, 700); }
  $('fl-izq').onclick = () => { if (lugar) volverACasa(); else irHab(habIdxActual() - 1); };
  $('fl-der').onclick = () => irHab(habIdxActual() + 1);
  function renderMapa() {
    $('m-titulo').textContent = 'MAPA';
    return `<div class="centro" style="font-size:8px;line-height:1.9;color:#aab4ff;margin-bottom:10px">¿A dónde vamos hoy?</div><div class="cuadricula">` +
      LUGARES.map(l => `<div class="card"><div class="pv"><canvas data-prev="lg_${l.id}"></canvas></div><div class="cn">${l.n}</div>` + (nivel() >= l.nv ? `<button class="bt ok" data-a="m_ir" data-k="${l.id}">IR</button>` : `<div class="est bloq">CARIÑO NV${l.nv}</div>`) + `</div>`).join('') +
      `</div><div class="centro" style="font-size:7px;line-height:1.9;color:#aab4ff;margin-top:12px">Más lugares pronto.</div>`;
  }

