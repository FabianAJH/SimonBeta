/* ===================== COCINAR: escena vista desde arriba ===================== */
  let ck = null;
  const CG_MODO = { ensalada: { lechuga: 'c', jitomate: 'c' }, hotcakes: { harina: 'f', huevo: 'f', leche: 'f' }, tostada: { pan: 'f', queso: 'cf' }, licuado: { naranja: 'c', leche: 'f' }, tacocasero: { tortilla: 'f', carne: 'cf', jitomate: 'c' }, kekecasero: { harina: 'f', huevo: 'f', azucar: 'f', chocolate: 'c' }, kekeperro: { harina: 'f', huevo: 'f', carne: 'cf' } };
  function ckFaltan(r) { return Object.keys(r.ing).filter(k => ingF(k) < r.ing[k]); }
  function ckGasta(r, extra) {   // usa primero los ingredientes más viejos
    Object.keys(r.ing).forEach(k => { const L = ingL(k).slice().sort((a, b) => a - b), n = r.ing[k] + ((extra && extra[k]) || 0); e.ing[k] = L.slice(n); });
  }
  function renderCocinar() {
    $('m-titulo').textContent = 'COCINAR';
    if (!ck) {
      let h = `<div class="th-nota">Elige qué cocinar. Verás la estufa desde arriba: corta, mueve la sartén y no dejes que se queme.</div>`;
      h += RECETAS.map(r => {
        const falt = ckFaltan(r), bloq = nivel() < r.nv, ok = !falt.length && !bloq;
        return `<div class="ck-r ${ok ? '' : 'no'}"><div class="ck-pv"><canvas data-prev="fd_pl_${r.id}"></canvas></div><div class="ck-tx"><b>${r.n}${r.perro ? ' (' + (e.sifK || 0) + ')' : ''}</b><div class="ck-ing">${Object.keys(r.ing).map(k => `<span class="${ingF(k) >= r.ing[k] ? 'ok' : 'x'}"><canvas data-prev="ig_${k}"></canvas>${r.ing[k] > 1 ? 'x' + r.ing[k] : ''}</span>`).join('')}</div></div>` +
          (bloq ? `<div class="est bloq" style="flex:none">NV${r.nv}</div>` : `<button class="bt ${ok ? 'ok' : 'no'}" style="flex:none;padding:10px 8px" data-a="ck_ir" data-k="${r.id}">${ok ? 'COCINAR' : 'FALTAN'}</button>`) + `</div>`;
      }).join('');
      return h + `<button class="bt gran" style="margin-top:10px;padding:12px 0" data-a="rf_abrir">VER EL REFRI</button>`;
    }
    const r = ck.r, q = ck.quemado || ck.tiempo ? 0 : ck.est;
    return `<div class="ck-res"><div class="ck-big"><canvas data-prev="fd_pl_${r.id}"></canvas></div><div class="th-n">${q ? r.n : ck.tiempo ? '¡SE ACABÓ EL TIEMPO!' : '¡SE QUEMÓ!'}</div>` +
      (q ? `<div class="ck-st">${'★'.repeat(q)}<span>${'★'.repeat(3 - q)}</span></div><div class="th-i">${ck.porc > 1 ? '¡SALIÓ TAN BIEN QUE SOBRÓ UN PLATO!<br>' : ''}${r.perro ? 'GUARDADO PARA EL PERRITO' : 'SE GUARDÓ EN ALIMENTAR'} (x${ck.porc})</div>` : (ck.tiempo ? `<div class="th-i">NO SE PERDIÓ NINGÚN INGREDIENTE.<br>INTÉNTALO DE NUEVO MÁS RÁPIDO.</div>` : `<div class="th-i">SE PERDIERON LOS INGREDIENTES.<br>LA PRÓXIMA ESTARÁ MEJOR.</div>`)) +
      `<button class="bt ok gran" style="padding:12px 0" data-a="ck_fin">OTRA VEZ</button></div>`;
  }
  function ckIr(id) {
    const r = RECETAS.find(x => x.id === id); if (!r) return;
    if (ckFaltan(r).length) { toast('Faltan ingredientes: ' + ckFaltan(r).map(k => ING[k].n.toLowerCase()).join(', ')); sfx.no(); return; }
    sfx.click(); ck = null; modal = null; $('modal').classList.remove('on', 'sheet'); $('escena').classList.remove('alto'); cgIni(r);
  }
  function cgTutorial() {
    const r = RECETAS.find(x => x.id === 'tostada'), n = Date.now(); e.ing = e.ing || {};
    ['pan', 'queso'].forEach(k => { const L = ingL(k); while (L.length < 2) L.push(n); e.ing[k] = L; });
    introPend = 0; ck = null; modal = null; $('modal').classList.remove('on', 'sheet'); $('escena').classList.remove('alto'); cgIni(r, true);
  }
// (cocTutFin removido para quitar dialogos de Cortex del tutorial)
  function introCocina() {
    introPend = 0;
    evQuitar('introC');
    if (typeof toast === 'function') toast('Toca la estufa para cocinar');
  }
  function ckClick(a, k) { if (a === 'ck_ir') ckIr(k); else if (a === 'ck_fin') { ck = null; sfx.click(); render(); } }

  /* ---- la escena: tabla de cortar a la izquierda, estufa a la derecha, plato abajo ---- */
  const CGW = 132, CGH = 168;
  const CG_BOARD = { x: 3, y: 36, w: 55, h: 60 }, CG_STOVE = { x: 62, y: 36, w: 67, h: 84 };
  const CG_BURN = [{ x: 80, y: 56, h: 1.35 }, { x: 111, y: 56, h: 1.35 }, { x: 80, y: 98, h: 1.35 }, { x: 111, y: 98, h: .75 }];
  const cgBurnActivo = i => i === 0 || (i === 2 && !!(typeof e !== 'undefined' && e && e.tiene && e.tiene.sarten2));
  const cgBurnActivos = () => (typeof e !== 'undefined' && e && e.tiene && e.tiene.sarten2) ? [CG_BURN[0], CG_BURN[2]] : [CG_BURN[0]];
  const CG_PLATE = { x: 66, y: 146, rx: 34, ry: 15 };
  const CG_SWEET = [.5, .72];
  let introPend = 0; const ipf = () => introPend > Date.now();   // Cortex está por llegar a explicar algo: nada de menús ni toques a objetos
  let cg = null, cgRaf = 0; const cgSprC = {};
  function cgSpr(k) {
    if (cgSprC[k]) return cgSprC[k];
    const g = (IGRID[k] || IGRID.jitomate)(), c = document.createElement('canvas'); c.width = g.w; c.height = g.h;
    const x = c.getContext('2d'), im = x.createImageData(g.w, g.h); im.data.set(g.d); x.putImageData(im, 0, 0); return (cgSprC[k] = c);
  }
  const cgTmp = document.createElement('canvas'); cgTmp.width = 16; cgTmp.height = 16;
  function cgTint(c) { return c < .3 ? null : c < .5 ? `rgba(240,200,90,${(c - .3) * 1.2})` : c < .75 ? `rgba(225,160,50,${.24 + (c - .5) * .6})` : c < 1 ? `rgba(120,60,20,${.4 + (c - .75) * 1.2})` : 'rgba(20,14,12,.88)'; }
  function cgPieza(ctx, p, x, y, esc, c) {   // dibuja un ingrediente (opcionalmente en tajadas y teñido por cocción)
    const s = cgSpr(p.k), t = cgTmp.getContext('2d'); t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, 16, 16); t.drawImage(s, 0, 0);
    const col = cgTint(c || 0); if (col) { t.globalCompositeOperation = 'source-atop'; t.fillStyle = col; t.fillRect(0, 0, 16, 16); }
    const W = s.width, H = s.height;
    if (p.corte && esc === 1) { const S = [0, 4, 7, 11, W]; for (let i = 0; i < 4; i++) ctx.drawImage(cgTmp, S[i], 0, S[i + 1] - S[i], H, Math.round(x - W / 2 + S[i] + (i - 1.5)), Math.round(y - H / 2), S[i + 1] - S[i], H); }
    else ctx.drawImage(cgTmp, 0, 0, W, H, Math.round(x - W * esc / 2), Math.round(y - H * esc / 2), W * esc, H * esc);
  }
  function cgFlecha(c, x, y) {   // flechita verde: ya está listo para el plato
    const o = Math.round(Math.sin(cg.t * 8) * 1.6), R = (a, b, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(a), Math.round(b + o), w, h); };
    R(x - 4, y - 1, 9, 10, '#0a4a22'); R(x - 2, y, 5, 4, '#3adc6a'); R(x - 3, y + 4, 7, 1, '#3adc6a'); R(x - 2, y + 5, 5, 1, '#3adc6a'); R(x - 1, y + 6, 3, 1, '#3adc6a'); R(x, y + 7, 1, 1, '#3adc6a'); R(x - 2, y, 1, 4, '#9affb4');
  }
  const cgColC = {};
  function cgCol(k) { if (cgColC[k]) return cgColC[k]; const s = cgSpr(k), d = s.getContext('2d').getImageData(Math.floor(s.width / 2), Math.floor(s.height / 2) + 1, 1, 1).data; return (cgColC[k] = 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')'); }
  function cgCortada(c, p, x, y) {   // la pieza en la tabla: se parte en tajadas que se separan con cada corte
    const s = cgSpr(p.k), W = s.width, H = s.height, W2 = W * 2, H2 = H * 2, cuts = p.cuts.slice().sort((a, b) => a - b).map(v => Math.max(-W2 / 2 + 2, Math.min(W2 / 2 - 2, v)));
    const age = p.cutT && p.cutT.length ? cg.t - p.cutT[p.cutT.length - 1] : 9, spread = Math.max(0, 1 - age / .45) * 3.5, sq = age < .14 ? 1 - .14 * (1 - age / .14) : 1, ed = [-W2 / 2, ...cuts, W2 / 2], n = ed.length - 1;
    const jx = age < .1 ? (Math.random() - .5) * 1.4 : 0;
    for (let i = 0; i < n; i++) { const a = ed[i], b = ed[i + 1], sx = Math.max(0, Math.round((a + W2 / 2) / 2)), sw = Math.max(1, Math.min(W - sx, Math.round((b - a) / 2))), off = (i - (n - 1) / 2) * (cuts.length ? .8 + spread : 0); c.drawImage(s, sx, 0, sw, H, Math.round(x + a + off + jx), Math.round(y - H2 / 2 * sq + (1 - sq) * H2 / 2), sw * 2, Math.round(H2 * sq)); }
  }
  function cgIni(r, tut) {
    const mod = CG_MODO[r.id] || {}, piezas = []; let n = 0;
    Object.keys(r.ing).sort((a, b) => tut ? (mod[b] || 'c').length - (mod[a] || 'c').length : 0).forEach(k => { for (let i = 0; i < r.ing[k]; i++) piezas.push(cgNueva(k, mod[k] || 'c', n++)); });
    const veces = e.st.ckN || 0; e.st.ckN = veces + 1; guardar();
    cg = { r, mod, piezas, extra: {}, id: n, pans: e.tiene.sarten2 ? [{ id: 0, x: 96, y: 62, wig: 0, hop: 0 }, { id: 1, x: 96, y: 96, wig: 0, hop: 0 }] : [{ id: 0, x: 96, y: 77, wig: 0, hop: 0 }], ptr: null, drag: null, knife: null, t: 0, ult: performance.now(), msgs: [], part: [], hist: [], flipT: 0, fin: 0, board: null, listoCortar: 0, tut: !!tut, tutI: 2, ayuda: !!tut || veces < 5, volt: 0, limite: tut ? 0 : Math.round((40 + 22 * piezas.length) * (veces < 5 ? 1.3 : 1)), cxT: '', lastTxt: '', lastPanTap: 0 };
    cg.left = cg.limite; $('cg-h').classList.toggle('on', !!cg.limite); $('cg-hb').style.width = '100%'; $('cg-hb').style.background = '#5ac870';
    document.body.classList.add('cocinando'); $('cg').classList.add('on'); $('cg-t').textContent = r.n; cgLayout();
    sfx.click(); cancelAnimationFrame(cgRaf); cgRaf = requestAnimationFrame(cgLoop);
  }

  /* ---- tutorial: solo ayuda visual (sin diálogos de Cortex) ---- */
  function cgNueva(k, modo, id) { return { id, k, modo, loc: 'cesta', corte: false, cuts: [], cq: [], cook: [0, 0], lado: 0, quemada: false, x: 0, y: 0, salto: 0, ok1: false, ok2: false }; }
  function cgAyuda() { cg.idle = 0; }
  function cgLayout() {
    const cv = $('cgc'), a = $('cg'), w = a.clientWidth;
    const h = a.clientHeight - 44, s = Math.max(1, Math.floor(Math.min(w / CGW, h / CGH) * 4) / 4);
    cv.width = CGW; cv.height = CGH; cv.style.width = Math.floor(CGW * s) + 'px'; cv.style.height = Math.floor(CGH * s) + 'px';
  }
  function cgCerrar() { $('cg-cx').classList.remove('on'); cancelAnimationFrame(cgRaf); cgRaf = 0; cg = null; document.body.classList.remove('cocinando'); $('cg').classList.remove('on'); }
  function cgSalir() { sfx.click(); introPend = 0; cgCerrar(); setTimeout(saludar, 300); }
  function cgMsg(t, x, y, c) { cg.msgs.push({ t, x, y, c: c || '#ffffff', v: 0 }); }
  function cgPart(x, y, c, n, vy) { for (let i = 0; i < n; i++) cg.part.push({ x: x + (Math.random() - .5) * 8, y, vx: (Math.random() - .5) * .3, vy: vy || -.5 - Math.random() * .4, c, v: 0 }); }
  function cgPos(ev) { const r = $('cgc').getBoundingClientRect(); return { x: (ev.clientX - r.left) / r.width * CGW, y: (ev.clientY - r.top) / r.height * CGH }; }
  const cgDist = (a, b, c, d) => Math.hypot(a - c, b - d);
  const cgPanDe = p => cg.pans.find(q => q.id === (p.pn || 0)) || cg.pans[0];
  const cgEnFuego = pn => { let m = 0; CG_BURN.forEach((b, i) => { if (cgBurnActivo(i) && cgDist(pn.x, pn.y, b.x, b.y) <= 9.5) m = b.h; }); return m; };
  function cgSlot(p) {   // posición de las piezas que no están en mano
    if (p.loc === 'cesta') { const L = cg.piezas.filter(q => q.loc === 'cesta'), i = L.indexOf(p), n = Math.max(L.length, 1); return { x: CGW / 2 + (i - (n - 1) / 2) * 20, y: 10 }; }
    if (p.loc === 'sarten') { const pn = cgPanDe(p), L = cg.piezas.filter(q => q.loc === 'sarten' && cgPanDe(q) === pn), i = L.indexOf(p); return { x: pn.x + pn.wig + (L.length > 1 ? (i ? 7 : -7) : 0), y: pn.y - p.salto - pn.hop }; }
    if (p.loc === 'plato') { const L = cg.piezas.filter(q => q.loc === 'plato'), i = L.indexOf(p), n = L.length; return { x: CG_PLATE.x + (i - (n - 1) / 2) * Math.min(16, 56 / Math.max(n, 1)), y: CG_PLATE.y - 1 + (i % 2) * 2 }; }
    if (p.loc === 'tabla') return { x: cg.tx, y: CG_BOARD.y + 30 };
    if (p.loc === 'tablaL') return { x: CG_BOARD.x + CG_BOARD.w / 2, y: CG_BOARD.y + CG_BOARD.h - 12 };
    return { x: p.x, y: p.y };
  }
  function cgListaPlato(p) {
    if (p.quemada) return '¡QUEMADO! TÍRALO';
    if (p.modo.includes('c') && !p.corte) return '¡FALTA CORTAR! 🔪';
    if (p.modo.includes('f') && (p.cook[0] < .25 || p.cook[1] < .25)) return '¡FALTA COCINAR! 🔥';
    return null;
  }
  function cgDown(ev) {
    if (!cg || cg.fin || cg.ptr != null) return; ev.preventDefault();
    const m = cgPos(ev); cg.idle = 0; cg.ptr = ev.pointerId; try { $('cgc').setPointerCapture(ev.pointerId); } catch (_) {}
    const P = cg.piezas;
    // 1) piezas
    let hit = null, bd = 99;
    P.forEach(p => { if (p.loc === 'plato') return; const s = p.loc === 'tabla' ? { x: 0, y: 0 } : cgSlot(p); if (p.loc === 'tabla') return; const d = cgDist(m.x, m.y, s.x, s.y); if (d < (p.loc === 'sarten' ? 7 : 9) && d < bd) { hit = p; bd = d; } });
    if (hit) {
      if (hit.quemada) { cgTirar(hit); cg.ptr = null; return; }
      cg.drag = { p: hit, de: hit.loc, ox: 0, oy: 0, sx: m.x, sy: m.y, mov: false }; hit.loc = 'mano'; hit.x = m.x; hit.y = m.y - 4; cg.hist = []; sfx.click(); return;
    }
    // 2) la sartén (aro o mango)
    for (let i = cg.pans.length - 1; i >= 0; i--) { const pn = cg.pans[i];
      if (cgDist(m.x, m.y, pn.x, pn.y) <= 16 || (m.x > pn.x + 12 && m.x < pn.x + 38 && Math.abs(m.y - pn.y) < 7)) {
        cg.drag = { pan: true, pi: i, ox: pn.x - m.x, oy: pn.y - m.y, sx: m.x, sy: m.y, t0: performance.now(), mov: false };
        cg.hist = [{ x: m.x, y: m.y, t: performance.now() }];
        return;
      }
    }
    // 3) el corte sobre la tabla (permite iniciar el trazo sobre toda el área de corte)
    const tb = cg.piezas.find(p => p.loc === 'tabla' && !p.corte);
    if (tb && m.x >= CG_BOARD.x - 4 && m.x <= CG_BOARD.x + CG_BOARD.w + 6 && m.y >= CG_BOARD.y - 4 && m.y <= CG_BOARD.y + CG_BOARD.h + 6) {
      cg.knife = { x0: m.x, y0: m.y, x: m.x, y: m.y, t0: performance.now(), tr: [[m.x, m.y]] };
      return;
    }
    cg.ptr = null;
  }
  function cgMove(ev) {
    if (!cg || ev.pointerId !== cg.ptr) return; const m = cgPos(ev);
    if (cg.knife) {
      cg.knife.x = m.x; cg.knife.y = m.y; cg.knife.tr.push([m.x, m.y]);
      if (cg.knife.tr.length > 24) cg.knife.tr.shift();
      return;
    }
    const d = cg.drag; if (!d) return;
    if (d.pan) {
      const pn = cg.pans[d.pi];
      pn.x = Math.max(78, Math.min(114, m.x + d.ox));
      pn.y = Math.max(54, Math.min(102, m.y + d.oy));
      if (Math.hypot(m.x - d.sx, m.y - d.sy) > 3) d.mov = true;
      const h = cg.hist, now = performance.now();
      h.push({ x: m.x, y: m.y, t: now });
      while (h.length && now - h[0].t > 700) h.shift();
      // sacudida / agite: 2+ cambios de dirección en X o Y, o vaivén rápido
      let revX = 0, dirX = 0, refX = h.length ? h[0].x : 0;
      let revY = 0, dirY = 0, refY = h.length ? h[0].y : 0;
      for (let i = 1; i < h.length; i++) {
        const dx = h[i].x - refX;
        if (Math.abs(dx) >= 2.5) { const nd = dx > 0 ? 1 : -1; if (dirX && nd !== dirX) revX++; dirX = nd; refX = h[i].x; }
        const dy = h[i].y - refY;
        if (Math.abs(dy) >= 2.5) { const nd = dy > 0 ? 1 : -1; if (dirY && nd !== dirY) revY++; dirY = nd; refY = h[i].y; }
      }
      const distStart = Math.hypot(m.x - (h.length ? h[0].x : m.x), m.y - (h.length ? h[0].y : m.y));
      const flick = h.length >= 3 && distStart > 10 && (now - h[0].t < 350);
      if ((revX >= 2 || revY >= 2 || (revX >= 1 && revY >= 1) || (flick && (revX >= 1 || revY >= 1 || distStart > 14))) && now - cg.flipT > 600) {
        cgVoltear(pn);
        cg.hist = [];
        cg.flipT = now;
      }
      return;
    }
    const p = d.p; p.x = m.x; p.y = m.y - 4; if (Math.hypot(m.x - d.sx, m.y - d.sy) > 2) d.mov = true;
  }
  function cgUp(ev) {
    if (!cg || ev.pointerId !== cg.ptr) return; const m = cgPos(ev); cg.ptr = null; cg.idle = 0;
    if (cg.knife) { const k = cg.knife; cg.knife = null; cgCorte(k); return; }
    const d = cg.drag; cg.drag = null; if (!d) return;
    if (d.pan) {
      const pn = cg.pans[d.pi];
      // 1. Snap magnético a la parrilla activa más cercana al soltar (a distancia <= 15px)
      let bestB = null, minD = 99;
      cgBurnActivos().forEach(b => {
        const dist = cgDist(pn.x, pn.y, b.x, b.y);
        if (dist <= 15 && dist < minD) { minD = dist; bestB = b; }
      });
      if (bestB) {
        pn.x = bestB.x; pn.y = bestB.y;
        seq([660, 880], .025, 'sine', .05);
        cgPart(pn.x, pn.y, '#ff9a4a', 4, -.4);
      }
      // 2. Alternativa accesible: toque o doble toque rápido para voltear si toca agitar
      const ahora = performance.now();
      const distMov = Math.hypot(m.x - (d.sx || m.x), m.y - (d.sy || m.y));
      const sug = cgSug();
      if (sug && sug.t === 'agitar' && sug.pi === pn.id) {
        if (distMov < 6 && (ahora - (cg.lastPanTap || 0) < 450 || ahora - d.t0 < 220)) {
          cgVoltear(pn);
          cg.hist = [];
          cg.flipT = ahora;
        }
      }
      cg.lastPanTap = ahora;
      return;
    }
    const p = d.p; let err = null;
    let panD = null, pdm = 99; cg.pans.forEach(q => { const d2 = cgDist(m.x, m.y - 4, q.x, q.y); if (d2 <= 17 && d2 < pdm) { pdm = d2; panD = q; } }); const enSarten = !!panD, enTabla = m.x >= CG_BOARD.x && m.x <= CG_BOARD.x + CG_BOARD.w && m.y >= CG_BOARD.y && m.y <= CG_BOARD.y + CG_BOARD.h;
    const enPlato = ((m.x - CG_PLATE.x) / (CG_PLATE.rx + 4)) ** 2 + ((m.y - CG_PLATE.y) / (CG_PLATE.ry + 6)) ** 2 <= 1;
    if (enPlato) { err = cgListaPlato(p); if (!err) { p.loc = 'plato'; sfx.click(); seq([660, 880], .05, 'triangle', .06); cgPart(p.x, p.y, '#ffe45a', 3, -.4); cgCheck(); cgAyuda(); return; } }
    else if (enSarten) {
      if (!p.modo.includes('f')) err = '¡NO VA A LA SARTÉN!';
      else if (p.modo.includes('c') && !p.corte) err = '¡CÓRTALO PRIMERO! 🔪';
      else if (p.quemada) err = '¡QUEMADO! TÍRALO';
      else if (cg.piezas.filter(q => q.loc === 'sarten' && cgPanDe(q) === panD).length >= 2 && !(d.de === 'sarten' && cgPanDe(p) === panD)) err = 'SARTÉN LLENA';
      else { p.loc = 'sarten'; p.pn = panD.id; sfx.click(); cgAyuda(); return; }
    } else if (enTabla) {
      const otra = cg.piezas.find(q => q.loc === 'tabla' || q.loc === 'tablaL');
      if (d.de === 'sarten') err = 'YA EN COCCIÓN';
      else if (!p.modo.includes('c')) err = '¡NO SE CORTA! AL FUEGO 🔥';
      else if (p.corte && d.de !== 'tabla' && d.de !== 'tablaL') err = 'YA ESTÁ CORTADO';
      else if (otra && otra !== p) err = 'TABLA OCUPADA';
      else { cgATabla(p); sfx.click(); cgAyuda(); return; }
    }
    if (err) { cgMsg(err, Math.max(24, Math.min(CGW - 24, m.x)), m.y - 8, '#ffb0b8'); sfx.no(); }
    // vuelve a donde estaba
    p.loc = d.de === 'mano' ? 'cesta' : d.de; cgAyuda();
  }
  function cgATabla(p) { if (p.corte) { p.loc = 'tablaL'; return; } p.loc = 'tabla'; p.cuts = []; p.cq = []; p.fase = Math.random() * 6; cg.tx = CG_BOARD.x + CG_BOARD.w / 2; }
  const CG_GUIA = [-8, 0, 8];
  function cgCorte(k) {
    const p = cg.piezas.find(q => q.loc === 'tabla' && !q.corte); if (!p) return;
    const cy = CG_BOARD.y + 30;
    const i = p.cuts.length, obj = CG_GUIA[Math.min(2, i)];
    const targetX = cg.tx + obj;

    // 1) Buscamos el punto de corte real en el trazo cruzando la línea horizontal central del alimento (cy)
    let xm = null, minDiff = 999;
    if (k.tr && k.tr.length >= 2) {
      for (let j = 0; j < k.tr.length - 1; j++) {
        const p1 = k.tr[j], p2 = k.tr[j + 1];
        const yMin = Math.min(p1[1], p2[1]), yMax = Math.max(p1[1], p2[1]);
        if (yMin <= cy + 3 && yMax >= cy - 3) {
          const dy = p2[1] - p1[1];
          const t = Math.abs(dy) > 0.001 ? Math.max(0, Math.min(1, (cy - p1[1]) / dy)) : 0.5;
          const crossX = p1[0] + (p2[0] - p1[0]) * t;
          const diff = Math.abs(crossX - targetX);
          if (diff < minDiff) { minDiff = diff; xm = crossX; }
        }
      }
    }
    if (xm == null) xm = (k.x0 + k.x) / 2;

    // 2) Verificamos que haya sido un trazo vertical con suficiente recorrido sobre el alimento
    const allY = (k.tr && k.tr.length) ? k.tr.map(pt => pt[1]) : [k.y0, k.y];
    const topY = Math.min(...allY), botY = Math.max(...allY);
    const recorridoY = botY - topY;

    if (recorridoY < 13 || topY > cy - 2 || botY < cy + 2) {
      cgMsg('X', k.x, k.y, '#ffb0b8'); sfx.no(); return;
    }

    const rel = xm - cg.tx, err = Math.abs(rel - obj);
    if (err > 6.5) {
      cgMsg('TORCIDO', xm, cy - 20, '#ff9aa4');
      sfx.no(); return;
    }

    const q = err <= 2.2 ? 1 : err <= 4.2 ? .7 : .35;
    p.cuts.push(rel); p.cq.push(q); (p.cutT = p.cutT || []).push(cg.t); cg.chop = { x: xm, t: cg.t };
    { const col = cgCol(p.k); for (let j = 0; j < 9; j++) cg.part.push({ x: xm + (Math.random() - .5) * 4, y: cy - 2, vx: (Math.random() - .5) * 1.6, vy: -.4 - Math.random() * .9, g: .07, c: j % 3 ? col : '#ffffff', v: 0 }); }
    seq([220, 110], .025, 'square', .08);
    cgMsg(q === 1 ? '¡PERFECTO!' : q > .5 ? '¡BIEN!' : 'TORCIDO', xm, cy - 20, q === 1 ? '#8aff9a' : q > .5 ? '#ffe45a' : '#ff9aa4');
    seq(q === 1 ? [988, 1319] : q > .5 ? [784, 988] : [300], .04, 'square', .06); cgPart(xm, cy, '#ffffff', 3, -.2);
    if (p.cuts.length >= 3) { p.corte = true; p.loc = 'tablaL'; cgAyuda(); }
  }
  function cgVoltear(pn) {
    const L = cg.piezas.filter(q => q.loc === 'sarten' && cgPanDe(q) === pn); if (!L.length) return;
    cg.volt++; L.forEach(p => { p.lado ^= 1; p.salto = 7; p.ok1 = false; }); sfx.click(); seq([520, 780, 1040], .035, 'triangle', .05); 
  }
  function cgTirar(p) {
    cg.piezas.splice(cg.piezas.indexOf(p), 1); cgPart(p.x || cgPanDe(p).x, cgPanDe(p).y, '#555', 5, -.3);
    const sp = ingF(p.k) - cg.r.ing[p.k] - (cg.extra[p.k] || 0);
    if (sp > 0) { cg.extra[p.k] = (cg.extra[p.k] || 0) + 1; const n = cgNueva(p.k, p.modo, cg.id++); cg.piezas.push(n); sfx.click(); cgAyuda(); }
    else { sfx.no(); cg.fin = 1; setTimeout(() => cgFin(true), 700); }
  }
  function cgCheck() { if (cg.piezas.every(p => p.loc === 'plato')) { cg.fin = 1; setTimeout(() => cgFin(false), cg.tut ? 700 : 800); } }
  function cgFin(quemado, tiempo) {
    if (!cg) return; const r = cg.r, extra = cg.extra, P = cg.piezas; let est = 1, porc = 1;
    if (tiempo) { sfx.no(); seq([300, 220, 160], .12, 'sawtooth', .05); const rr = cg.r; cgCerrar(); ck = { r: rr, fase: 'fin', tiempo: true }; abrir('cocinar'); return; }
    if (cg.tut && !quemado) e.cocTut = 1;
    if (!quemado) {
      const qs = P.map(p => { const a = []; if (p.modo.includes('c')) a.push(p.cq.reduce((s, v) => s + v, 0) / Math.max(1, p.cq.length)); if (p.modo.includes('f')) a.push((1 - Math.min(1, Math.abs(p.cook[0] - .6) / .45) + 1 - Math.min(1, Math.abs(p.cook[1] - .6) / .45)) / 2); return a.reduce((s, v) => s + v, 0) / Math.max(1, a.length); });
      const avg = qs.reduce((s, v) => s + v, 0) / Math.max(1, qs.length); est = avg >= .8 ? 3 : avg >= .55 ? 2 : 1; porc = est === 3 ? 2 : 1;
    }
    ckGasta(r, extra);
    if (quemado) { sfx.no(); seq([220, 165, 110], .12, 'sawtooth', .05); }
    else if (r.perro) { e.sifK = Math.min(99, (e.sifK || 0) + porc); e.st.cocinados = (e.st.cocinados || 0) + 1; ganar(1, 2 + est); sfx.logro(); estrellas(4 + est * 2); }
    else { const id = 'pl_' + r.id; e.comida[id] = Math.min(99, (e.comida[id] || 0) + porc); e.st.cocinados = (e.st.cocinados || 0) + 1; ganar(1, 2 + est); sfx.logro(); estrellas(4 + est * 2); }
    if (cg.tut && !quemado) { toast('¡Tostada lista! Se guardó en ALIMENTAR'); }
    introPend = 0; cgCerrar(); ck = { r, fase: 'fin', est, porc, quemado: !!quemado }; pintar(); guardar(); abrir('cocinar');
  }
  function cgUpdate(dt) {
    cg.t += dt; cg.idle = (cg.idle || 0) + dt; { const sg = cg.ayuda && !cg.drag && !cg.knife && cgSug(); cg.pans.forEach(pn => { const ag = sg && sg.t === 'agitar' && sg.pi === pn.id; pn.wig = ag ? Math.sin(cg.t * 15) * 3 : 0; pn.hop = ag ? Math.abs(Math.sin(cg.t * 7.5)) * 5 : 0; }); }
    // pieza en la tabla: se desliza de lado a lado para que cortar cueste
    const tb = cg.piezas.find(p => p.loc === 'tabla' && !p.corte);
    if (tb) { const sp = 1.7 + .35 * Math.min(4, cg.piezas.filter(q => q.corte || q.loc === 'plato').length); tb.fase += dt * sp; cg.tx = CG_BOARD.x + CG_BOARD.w / 2 + Math.sin(tb.fase) * 11; }
    if (cg.limite && !cg.fin) { const ant = Math.ceil(cg.left); cg.left -= dt; const f = Math.max(0, cg.left / cg.limite); $('cg-hb').style.width = (f * 100) + '%'; $('cg-hb').style.background = f > .5 ? '#5ac870' : f > .25 ? '#ffd84a' : '#ff5a4a'; if (cg.left <= 10 && Math.ceil(cg.left) !== ant && cg.left > 0) seq([880], .04, 'square', .04); if (cg.left <= 0) { cg.fin = 1; cgFin(false, true); return; } }
    // calor
    cg.piezas.forEach(p => {
      if (p.salto > 0) p.salto = Math.max(0, p.salto - dt * 26);
      if (p.loc !== 'sarten' || p.quemada) return; const mult = cgEnFuego(cgPanDe(p));
      if (mult) { const c0 = p.cook[p.lado]; p.cook[p.lado] += dt / 12.5 * mult * (cg.tut ? .6 : 1); const c = p.cook[p.lado];
        if (c0 < .5 && c >= .5) { sfx.click(); seq([880, 1175], .04, 'sine', .05); cgPart(cgSlot(p).x, cgSlot(p).y - 4, '#8aff9a', 4, -.5); }
        if (c0 < .86 && c >= .86) { seq([440, 440], .07, 'square', .06);  }
        if (c > .8 && Math.random() < dt * 6) cgPart(cgSlot(p).x, cgSlot(p).y - 4, '#aaa', 1);
        if (c >= 1) { p.quemada = true; seq([196, 147], .12, 'sawtooth', .06); cgAyuda(); } }
    });
    cg.pans.forEach(pn => { if (cgEnFuego(pn) && Math.random() < dt * 5 && cg.piezas.some(p => p.loc === 'sarten' && cgPanDe(p) === pn)) cgPart(pn.x, pn.y - 6, '#fff', 1, -.35); });
    cg.msgs.forEach(m => m.v += dt); cg.msgs = cg.msgs.filter(m => m.v < 1.3);
    cg.part.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += (p.g || 0); p.v += dt; }); cg.part = cg.part.filter(p => p.v < 1);
  }
  function cgLoop(now) {
    if (!cg) return; const dt = Math.min(.05, (now - cg.ult) / 1000); cg.ult = now; cgUpdate(dt); if (cg) cgDibuja($('cgc').getContext('2d')); cgRaf = requestAnimationFrame(cgLoop);
  }
  function cgSug() {
    const P = cg.piezas, en = P.filter(p => p.loc === 'sarten'), PN = cg.pans, n = q => P.filter(z => z.loc === 'sarten' && cgPanDe(z) === q).length;
    let p = P.find(q => q.quemada); if (p) return { t: 'tirar', p };
    p = P.find(q => q.loc === 'tabla' && !q.corte); if (p) return { t: 'corte', p };
    p = en.find(q => !q.quemada && q.cook[0] >= .45 && q.cook[1] >= .45); if (p) return { t: 'mover', p, a: 'plato' };
    for (const pn of PN) if (en.some(q => cgPanDe(q) === pn && q.cook[q.lado] >= .5 && q.cook[1 - q.lado] < .3)) return { t: 'agitar', pi: pn.id };
    for (const pn of PN) if (n(pn) && !cgEnFuego(pn)) {
      const activos = cgBurnActivos();
      const ocupados = PN.filter(q => q !== pn && cgEnFuego(q)).map(q => activos.find(b => cgDist(q.x, q.y, b.x, b.y) <= 9.5));
      const libres = activos.filter(b => !ocupados.includes(b));
      let b = libres[0] || activos[0];
      libres.forEach(q => { if (cgDist(pn.x, pn.y, q.x, q.y) < cgDist(pn.x, pn.y, b.x, b.y)) b = q; });
      return { t: 'fuego', b, pi: pn.id };
    }
    const libre = PN.filter(q => n(q) < 2).sort((x, y) => (!!cgEnFuego(y) - !!cgEnFuego(x)) || n(y) - n(x))[0];
    p = P.find(q => q.loc === 'tablaL' && q.modo.includes('f')); if (p && libre) return { t: 'mover', p, a: 'sarten', pi: libre.id };
    p = P.find(q => q.loc === 'tablaL' && !q.modo.includes('f')); if (p) return { t: 'mover', p, a: 'plato' };
    p = P.find(q => q.loc === 'cesta'); if (!p) return null;
    if (p.modo.includes('c') && !p.corte) return P.some(q => q.loc === 'tablaL') ? null : { t: 'mover', p, a: 'tabla' };
    if (p.modo.includes('f')) return libre ? { t: 'mover', p, a: 'sarten', pi: libre.id } : null;
    return { t: 'mover', p, a: 'plato' };
  }
  function cgDibuja(c) {
    const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); };
    const circ = (x, y, r, col) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
    c.imageSmoothingEnabled = false;
    // encimera de azulejo visto desde arriba
    for (let y = 0; y < CGH; y += 8) for (let x = 0; x < CGW; x += 8) R(x, y, 8, 8, ((x + y) >> 3) % 2 ? '#d9d2c0' : '#e2dccb');
    // cesta de ingredientes
    R(2, 2, CGW - 4, 32, '#8a5a30'); R(3, 3, CGW - 6, 30, '#c89458'); for (let x = 4; x < CGW - 4; x += 4) R(x, 3, 1, 30, '#b78248'); R(3, 3, CGW - 6, 1, '#e0b078'); R(2, 34, CGW - 4, 1, '#5a3a1a');
    // tabla de cortar
    const B = CG_BOARD; R(B.x - 1, B.y - 1, B.w + 2, B.h + 2, '#5a3a1a'); R(B.x, B.y, B.w, B.h, '#d9a566'); R(B.x, B.y, B.w, 1, '#efc088'); for (let y = B.y + 4; y < B.y + B.h; y += 6) R(B.x + 2, y, B.w - 4, 1, '#c98f50');
    R(B.x + 2, B.y + B.h - 8, 6, 2, '#a8723a'); R(B.x + B.w / 2 - 5, B.y + B.h + 1, 10, 3, '#8a5a30'); c.fillStyle = '#c89458'; circ(B.x + B.w / 2, B.y + B.h + 2, 2, '#8a5a30');
    // estufa
    const S = CG_STOVE; R(S.x - 1, S.y - 1, S.w + 2, S.h + 2, '#3a424c'); R(S.x, S.y, S.w, S.h, '#aab4be'); R(S.x, S.y, S.w, 1, '#e0e8ee'); R(S.x + 3, S.y + 3, S.w - 6, S.h - 6, '#23252d'); R(S.x + 3, S.y + 3, S.w - 6, 1, '#3a3d48');
    const fl = cg ? Math.sin(cg.t * 9) : 0;
    CG_BURN.forEach((b, idx) => {
      const enc = cgBurnActivo(idx);
      circ(b.x, b.y, 11, '#14141a');
      if (enc) {
        // Parrilla encendida (con fuego y chispas activas)
        circ(b.x, b.y, 9, b.h > 1 ? '#7a2a22' : '#6a4a22');
        circ(b.x, b.y, 6, '#23252d');
        c.strokeStyle = b.h > 1 ? '#ff6a40' : '#ffb040'; c.lineWidth = 1;
        c.beginPath(); c.arc(b.x, b.y, 8, 0, 7); c.stroke();
        circ(b.x, b.y, 2, '#3a3d48');
        const n = b.h > 1 ? 12 : 8, bajo = cg.pans.some(q => cgDist(q.x, q.y, b.x, b.y) <= 9.5);
        for (let i = 0; i < n; i++) {
          const a = i / n * 6.283 + cg.t * .6, h = (bajo ? 3.2 : 1.6) * (b.h > 1 ? 1.2 : .8) + Math.sin(cg.t * 11 + i * 2) * .8;
          R(b.x + Math.cos(a) * 9 - 1, b.y + Math.sin(a) * 9 - 1, 2, 2, i % 2 ? '#ffd84a' : '#ff7a2a');
          if (bajo) { circ(b.x + Math.cos(a) * (9 + h * .3), b.y + Math.sin(a) * (9 + h * .3), .9, '#fff2a0'); }
        }
      } else {
        // Parrilla apagada (rejilla de hierro fría sin fuego)
        circ(b.x, b.y, 9, '#262832');
        circ(b.x, b.y, 6, '#181a22');
        c.strokeStyle = '#3a3e4c'; c.lineWidth = 1;
        c.beginPath(); c.arc(b.x, b.y, 8, 0, 7); c.stroke();
        circ(b.x, b.y, 2.5, '#2a2d38');
        R(b.x - 7, b.y, 14, 1, '#323642');
        R(b.x, b.y - 7, 1, 14, '#323642');
      }
    });
    [0, 1, 2, 3].forEach(i => {
      const act = cgBurnActivo(i);
      circ(S.x + 11 + i * 15, S.y + S.h - 1, 2.5, act ? '#5a6270' : '#353a42');
      R(S.x + 11 + i * 15, S.y + S.h - 4, 1, 2, act ? '#ff9a4a' : '#7a828e');
    });
    // plato
    const Pl = CG_PLATE; c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(Pl.x + 2, Pl.y + 3, Pl.rx, Pl.ry, 0, 0, 7); c.fill();
    c.fillStyle = '#c8c4bc'; c.beginPath(); c.ellipse(Pl.x, Pl.y, Pl.rx, Pl.ry, 0, 0, 7); c.fill(); c.fillStyle = '#f6f4f0'; c.beginPath(); c.ellipse(Pl.x, Pl.y - .5, Pl.rx - 1, Pl.ry - 1, 0, 0, 7); c.fill(); c.fillStyle = '#e4e0d8'; c.beginPath(); c.ellipse(Pl.x, Pl.y, Pl.rx - 7, Pl.ry - 4, 0, 0, 7); c.fill();
    // pieza en la tabla (a doble tamaño) con guías de corte
    const tb = cg.piezas.find(p => p.loc === 'tabla' && !p.corte), cy = B.y + 30;
    if (tb) {
      const sp = cgSpr(tb.k), w = sp.width * 2, h = sp.height * 2;
      c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(cg.tx, cy + h / 2 - 1, w / 2 - 1, 3, 0, 0, 7); c.fill();
      cgCortada(c, tb, cg.tx, cy);
      const i = tb.cuts.length;
      CG_GUIA.forEach((g, j) => { if (j < i) return; for (let y = cy - h / 2 - 5; y < cy + h / 2 + 5; y += 3) R(cg.tx + g, y, 1, 2, j === i ? '#ffffff' : 'rgba(255,255,255,.3)'); });
      R(cg.tx + CG_GUIA[Math.min(i, 2)] - 1, cy - h / 2 - 8, 3, 2, '#ffffff');
    }
    if (cg.chop && cg.t - cg.chop.t < .34) { const a = cg.t - cg.chop.t, kx = Math.round(cg.chop.x + (cg.chop.dx || 0)), u = a < .09 ? a / .09 : a < .16 ? 1 : 1 - (a - .16) / .18, ky = Math.round(cy - 30 + u * 40);
      if (a < .1) R(kx, cy - 17, 1, 34, '#ffffff');
      R(kx - 1, ky - 14, 3, 6, '#5a3a1a'); R(kx - 1, ky - 8, 3, 14, '#e8eef4'); R(kx - 1, ky - 8, 1, 14, '#ffffff'); R(kx + 1, ky + 6, 1, 1, '#9aa4b0'); }
    const tl = cg.piezas.find(p => p.loc === 'tablaL'); if (tl) { const s = cgSlot(tl); cgPieza(c, tl, s.x, s.y, 1, 0); if (!tl.modo.includes('f')) cgFlecha(c, s.x, s.y - 14); }
    // sartenes
    cg.pans.forEach(pn => { const enc = cgEnFuego(pn), px = pn.x + pn.wig;
      R(px + 13, pn.y - 3, 25, 6, '#14141a'); R(px + 14, pn.y - 2, 23, 4, '#e8503a'); R(px + 14, pn.y - 2, 23, 1, '#ff9a7a'); R(px + 14, pn.y + 1, 23, 1, '#a82a1a');
      circ(px + 1, pn.y + 3, 16, 'rgba(0,0,0,.35)'); circ(px, pn.y, 16, '#14141a'); circ(px, pn.y, 14.5, '#c8d2dc'); circ(px, pn.y, 12, '#8a98a8'); circ(px, pn.y, 10.5, '#4a5664');
      c.strokeStyle = '#ffffff'; c.lineWidth = 1; c.beginPath(); c.arc(px, pn.y, 13.5, 3.5, 4.8); c.stroke();
      if (enc) { c.strokeStyle = 'rgba(255,120,60,.7)'; c.beginPath(); c.arc(px, pn.y, 17.5, 0, 7); c.stroke(); } });
    let pn = cg.pans[0];
    // piezas
    cg.piezas.forEach(p => {
      if (p.loc === 'tabla' || p.loc === 'tablaL') return; const s = p.loc === 'mano' ? { x: p.x, y: p.y } : cgSlot(p);
      const enSar = p.loc === 'sarten', top = enSar ? p.cook[1 - p.lado] : (p.cook[0] + p.cook[1]) / 2;
      if (p.loc === 'mano') { c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(s.x + 2, s.y + 8, 6, 2, 0, 0, 7); c.fill(); }
      cgPieza(c, p, s.x, s.y, 1, enSar || p.loc === 'plato' || p.loc === 'mano' ? top : 0);
      if (!p.quemada && ((p.loc === 'sarten' && p.cook[0] >= .45 && p.cook[1] >= .45) || (p.loc === 'tablaL' && !p.modo.includes('f')))) cgFlecha(c, s.x, s.y - (enSar ? 23 : 14));
      if (p.quemada) { R(s.x - 1, s.y - 11, 3, 6, '#d02030'); R(s.x - 1, s.y - 4, 3, 2, '#d02030'); }
      if (enSar && !p.quemada) {   // barras de cocción de las dos caras; la de abajo se marca
        [0, 1].forEach(j => { const bx = s.x - 6, by = s.y - 15 + j * 3, v = Math.min(1, p.cook[j]); R(bx - 1, by - 1, 14, 3, '#000'); R(bx, by, 12, 1, '#55505a'); R(bx + 12 * CG_SWEET[0], by, 12 * (CG_SWEET[1] - CG_SWEET[0]), 1, '#3a8a4a'); R(bx, by, Math.round(12 * v), 1, v > CG_SWEET[1] ? '#ff5a4a' : v >= CG_SWEET[0] ? '#8aff9a' : '#ffd84a'); if (j === p.lado) R(bx - 3, by, 1, 1, '#ffffff'); });
      }
    });
    // el cuchillo / rastro de corte
    const kn = cg.knife;
    if (kn) {
      kn.tr.forEach((t, i) => { c.fillStyle = `rgba(255,255,255,${i / kn.tr.length * .6})`; c.fillRect(Math.round(t[0]), Math.round(t[1]), 1.5, 1.5); });
      R(kn.x - 1, kn.y - 7, 3, 10, '#e8eef4');
      R(kn.x - 1, kn.y - 7, 1, 10, '#ffffff');
      R(kn.x - 1, kn.y + 3, 3, 4, '#5a3a1a');
    } else {
      // Solo dibuja cuchillo en la tabla si NO hay alimento esperando corte en la tabla
      if (!cg.piezas.some(p => p.loc === 'tabla')) {
        R(B.x + B.w - 9, B.y + B.h - 24, 2, 11, '#e8eef4');
        R(B.x + B.w - 9, B.y + B.h - 13, 2, 5, '#5a3a1a');
      }
    }

    // ---- guía visual: insignias enmarcadas, líneas de corte y destinos interactivos ----
    const pul = .5 + .5 * Math.sin(cg.t * 5);
    const sug = cg.ayuda ? cgSug() : (cg.piezas.find(q => q.quemada) ? { t: 'tirar', p: cg.piezas.find(q => q.quemada) } : null);
    const badge = (p, x, y) => {
      const needsC = p.modo.includes('c') && !p.corte;
      const needsF = p.modo.includes('f');
      if (!needsC && !needsF) return;
      const w = (needsC && needsF) ? 22 : 13, h = 9;
      const bx = Math.round(x - w / 2), by = Math.round(y);
      // Placa tipo tag con fondo oscuro y borde nítido
      R(bx, by, w, h, 'rgba(16, 18, 28, 0.95)');
      c.strokeStyle = needsC ? (needsF ? '#ffd84a' : '#8aff9a') : '#ff7a2a';
      c.lineWidth = 1;
      c.strokeRect(bx - 0.5, by - 0.5, w + 1, h + 1);

      if (needsC && needsF) {
        // Cuchillo (Paso 1 prioritario)
        const kx = bx + 2;
        R(kx, by + 1, 2, 4, '#e8eef4'); R(kx, by + 1, 1, 4, '#ffffff');
        R(kx, by + 5, 2, 2, '#5a3a1a');
        // Indicador '1º'
        R(kx - 1, by + 1, 1, 4, '#8aff9a');
        // Flecha '>'
        R(bx + 8, by + 3, 3, 1, '#a0b0c4');
        R(bx + 10, by + 2, 1, 3, '#a0b0c4');
        // Fuego (Paso 2)
        const fx = bx + 14;
        R(fx + 1, by + 1, 2, 2, '#ffd84a');
        R(fx, by + 2, 4, 3, '#ff8a2a');
        R(fx + 1, by + 3, 2, 2, '#ffe45a');
        R(fx, by + 5, 4, 2, '#ff4a2a');
      } else if (needsC) {
        const kx = bx + 5;
        R(kx, by + 1, 2, 4, '#e8eef4'); R(kx, by + 1, 1, 4, '#ffffff');
        R(kx, by + 5, 2, 2, '#5a3a1a');
      } else {
        const fx = bx + 4;
        R(fx + 1, by + 1, 2, 2, '#ffd84a');
        R(fx, by + 2, 4, 3, '#ff8a2a');
        R(fx + 1, by + 3, 2, 2, '#ffe45a');
        R(fx, by + 5, 4, 2, '#ff4a2a');
      }
    };

    if (cg.ayuda) {
      cg.piezas.forEach(p => {
        if (p.loc === 'cesta') {
          const s = cgSlot(p);
          // Línea punteada de corte sobre el propio sprite del alimento para que salte a la vista
          if (p.modo.includes('c') && !p.corte) {
            for (let dy = -5; dy <= 5; dy += 3) {
              R(s.x, s.y + dy, 1, 2, '#ffffff');
              R(s.x, s.y + dy + 1, 1, 1, '#14141a');
            }
          }
          // Badge tag enmarcado justo bajo el alimento
          badge(p, s.x, 20);

          // Flecha animada '▼' rebotando sobre el ingrediente que toca mover ahora
          if (sug && sug.p === p && !cg.drag) {
            const bo = Math.round(Math.sin(cg.t * 8) * 1.5);
            R(s.x - 2, s.y - 12 + bo, 5, 2, '#ffd84a');
            R(s.x - 1, s.y - 10 + bo, 3, 2, '#ffd84a');
            R(s.x, s.y - 8 + bo, 1, 2, '#ffd84a');
            c.strokeStyle = 'rgba(255,216,74,' + (.5 + .5 * pul) + ')';
            c.lineWidth = 1; c.beginPath(); c.arc(s.x, s.y, 9.5, 0, 7); c.stroke();
          }
        } else if (p.loc === 'tablaL' && p.modo.includes('f')) {
          const s = cgSlot(p);
          // Badge de fuego para pieza ya cortada en la tabla
          R(s.x - 6, s.y + 7, 12, 8, 'rgba(16, 18, 28, 0.95)');
          c.strokeStyle = '#ff7a2a'; c.lineWidth = 1; c.strokeRect(s.x - 6.5, s.y + 6.5, 13, 9);
          const fx = s.x - 2, by = s.y + 8;
          R(fx + 1, by + 1, 2, 2, '#ffd84a'); R(fx, by + 2, 4, 3, '#ff8a2a'); R(fx + 1, by + 3, 2, 2, '#ffe45a'); R(fx, by + 5, 4, 2, '#ff4a2a');
        }
      });
    }

    // Actualiza texto de ayuda en el encabezado superior (solo durante los primeros 5 cocinados)
    if (cg.ayuda && sug) {
      let sugTxt = '';
      if (sug.t === 'fuego') sugTxt = 'Mueve la sartén al fuego 🔥';
      else if (sug.t === 'agitar') sugTxt = '¡Sacude la sartén para voltear! 🔄';
      else if (sug.t === 'corte') sugTxt = 'Desliza tu dedo hacia abajo para cortar 👆';
      else if (sug.t === 'tirar') sugTxt = 'Se quemó, tócalo para tirarlo';
      else if (sug.t === 'mover') {
        sugTxt = sug.a === 'tabla' ? 'Lleva el ingrediente a la tabla' : (sug.a === 'sarten' ? 'Ponlo en la sartén' : '¡Listo! Llévalo al plato');
      }
      const fullT = cg.r.n + (sugTxt ? ' • ' + sugTxt : '');
      if (cg.lastTxt !== fullT) { cg.lastTxt = fullT; const el = $('cg-t'); if (el) el.textContent = fullT; }
    } else if (!cg.ayuda) {
      if (cg.lastTxt !== cg.r.n) { cg.lastTxt = cg.r.n; const el = $('cg-t'); if (el) el.textContent = cg.r.n; }
    }

    const ring = (kind, col) => { c.strokeStyle = col; c.lineWidth = 1; c.globalAlpha = .35 + .5 * pul;
      if (kind === 'tabla') c.strokeRect(B.x - 2.5, B.y - 2.5, B.w + 5, B.h + 5); else if (kind === 'plato') { c.beginPath(); c.ellipse(Pl.x, Pl.y, Pl.rx + 3, Pl.ry + 3, 0, 0, 7); c.stroke(); } else if (kind === 'sarten') { c.beginPath(); c.arc(pn.x, pn.y, 17.5, 0, 7); c.stroke(); } else { c.beginPath(); c.arc(kind.x, kind.y, 12.5, 0, 7); c.stroke(); } c.globalAlpha = 1; };
    const mano = (x0, y0, x1, y1, col) => {
      for (let i = 1; i < 8; i++) R(x0 + (x1 - x0) * i / 8, y0 + (y1 - y0) * i / 8, 1, 1, 'rgba(255,255,255,.55)');
      const T = (cg.t * .8) % 1.5, u = Math.min(1, T / 1.1), e2 = u * u * (3 - 2 * u), hx = x0 + (x1 - x0) * e2, hy = y0 + (y1 - y0) * e2;
      circ(hx + 1, hy + 2, 4.5, 'rgba(0,0,0,.3)'); circ(hx, hy, 4.5, '#ffffff'); circ(hx, hy, 3, col || '#ffd84a'); if (u < .08 || u >= 1) { c.strokeStyle = '#fff'; c.beginPath(); c.arc(hx, hy, 6 + (T % .2) * 20, 0, 7); c.stroke(); } };

    // Si el jugador está arrastrando una pieza, ilumina el destino correspondiente si la ayuda está activa
    if (cg.ayuda && cg.drag && cg.drag.p) {
      const dp = cg.drag.p;
      if (dp.modo.includes('c') && !dp.corte) {
        // Va a la tabla de cortar
        c.strokeStyle = '#8aff9a'; c.lineWidth = 2; c.strokeRect(B.x - 2, B.y - 2, B.w + 4, B.h + 4);
        c.fillStyle = 'rgba(16, 20, 32, 0.92)'; c.fillRect(B.x + 5, B.y + B.h / 2 - 6, B.w - 10, 12);
        c.strokeStyle = '#8aff9a'; c.lineWidth = 1; c.strokeRect(B.x + 5, B.y + B.h / 2 - 6, B.w - 10, 12);
        c.fillStyle = '#8aff9a'; c.font = '6px monospace'; c.textAlign = 'center';
        c.fillText('¡A LA TABLA! 🔪', B.x + B.w / 2, B.y + B.h / 2 + 2);
      } else if (dp.modo.includes('f') && (!dp.modo.includes('c') || dp.corte)) {
        // Va a la sartén
        const ptarget = cgPanDe(dp) || cg.pans[0];
        c.strokeStyle = '#ff9a4a'; c.lineWidth = 2; c.beginPath(); c.arc(ptarget.x, ptarget.y, 19, 0, 7); c.stroke();
        c.fillStyle = 'rgba(16, 20, 32, 0.92)'; c.fillRect(ptarget.x - 26, ptarget.y - 6, 52, 12);
        c.strokeStyle = '#ff9a4a'; c.lineWidth = 1; c.strokeRect(ptarget.x - 26, ptarget.y - 6, 52, 12);
        c.fillStyle = '#ffd84a'; c.font = '6px monospace'; c.textAlign = 'center';
        c.fillText('¡A LA SARTÉN! 🔥', ptarget.x, ptarget.y + 2);
      } else if (cgListaPlato(dp) === null) {
        // Va al plato
        c.strokeStyle = '#8aff9a'; c.lineWidth = 2; c.beginPath(); c.ellipse(Pl.x, Pl.y, Pl.rx + 4, Pl.ry + 4, 0, 0, 7); c.stroke();
        c.fillStyle = 'rgba(16, 20, 32, 0.92)'; c.fillRect(Pl.x - 24, Pl.y - 6, 48, 12);
        c.strokeStyle = '#8aff9a'; c.lineWidth = 1; c.strokeRect(Pl.x - 24, Pl.y - 6, 48, 12);
        c.fillStyle = '#8aff9a'; c.font = '6px monospace'; c.textAlign = 'center';
        c.fillText('¡AL PLATO! 🍽️', Pl.x, Pl.y + 2);
      }
    }

    if (sug && !cg.drag && !cg.knife) {
      pn = cg.pans.find(q => q.id === sug.pi) || cg.pans[0];
      if (sug.t === 'tirar') {
        const s = cgSlot(sug.p); c.globalAlpha = .5 + .5 * pul; R(s.x - 6, s.y - 6, 12, 12, 'rgba(255,40,50,.35)'); c.globalAlpha = 1; mano(s.x + 6, s.y + 8, s.x, s.y, '#ff5a6a');
      }
      else if (sug.t === 'corte') {
        const g = CG_GUIA[Math.min(2, sug.p.cuts.length)], gx = cg.tx + g;
        ring('tabla', '#ffffff');
        // Línea guía vertical punteada con contraste
        for (let y = cy - 20; y <= cy + 20; y += 4) {
          R(gx, y, 1, 2, (y % 8 === 0) ? '#ffffff' : '#ffd84a');
        }
        // Flechitas indicando sentido hacia abajo
        [-11, 0, 11].forEach(dy => {
          const arrY = cy + dy + Math.round(Math.sin(cg.t * 8) * 1.5);
          R(gx - 1, arrY, 3, 1, '#ffd84a');
          R(gx, arrY + 1, 1, 1, '#ffd84a');
        });
        // Dedo animado deslizando de arriba hacia abajo
        const T = (cg.t * 1.25) % 1.5, u = Math.min(1, T / 1.05);
        const e2 = u * u * (3 - 2 * u), fy = cy - 22 + e2 * 44;
        if (fy > cy - 22) {
          c.fillStyle = 'rgba(255,255,255,.45)';
          c.fillRect(gx, cy - 22, 1, Math.round(fy - (cy - 22)));
        }
        circ(gx + 1, fy + 2, 4.5, 'rgba(0,0,0,.35)');
        circ(gx, fy, 4.5, '#ffffff');
        circ(gx, fy, 3, '#ffd84a');
        if (u < .1 || u >= 1) {
          c.strokeStyle = '#fff'; c.beginPath(); c.arc(gx, cy - 22, 3 + (T % .2) * 15, 0, 7); c.stroke();
        }
        // Badge visual explicativo bajo la tabla
        c.fillStyle = 'rgba(20,20,26,.88)'; c.fillRect(4, 98, 53, 10);
        c.strokeStyle = '#ffffff'; c.lineWidth = 1; c.strokeRect(4, 98, 53, 10);
        c.fillStyle = '#ffd84a'; c.font = '6px monospace'; c.textAlign = 'center';
        c.fillText('👆 DESLIZA', 30, 105);
      }
      else if (sug.t === 'agitar') {
        const hx = pn.x + 24, hy = pn.y;
        const shkX = Math.sin(cg.t * 16) * 5, shkY = Math.cos(cg.t * 12) * 3;
        // Icono animado de voltear sobre la comida
        const ang = cg.t * 6;
        c.strokeStyle = '#ffffff'; c.lineWidth = 1.5; c.beginPath(); c.arc(pn.x, pn.y, 7.5, ang, ang + 4.2); c.stroke();
        const tipX = pn.x + Math.cos(ang + 4.2) * 7.5, tipY = pn.y + Math.sin(ang + 4.2) * 7.5;
        c.fillStyle = '#8aff9a'; c.beginPath(); c.arc(tipX, tipY, 2, 0, 7); c.fill();
        // Aro pulsante azul en la sartén
        c.strokeStyle = 'rgba(154,216,255,' + (.5 + .5 * pul) + ')'; c.lineWidth = 1.5;
        c.beginPath(); c.arc(pn.x, pn.y, 18 + pul * 2, 0, 7); c.stroke();
        // Flechas de vaivén en el mango
        R(hx - 8 + shkX, hy - 7, 16, 1, '#8ad8ff');
        R(hx - 8 + shkX, hy - 9, 2, 5, '#8ad8ff');
        R(hx + 6 + shkX, hy - 9, 2, 5, '#8ad8ff');
        R(hx + 11, hy - 6 + shkY, 1, 12, '#8ad8ff');
        R(hx + 9, hy - 6 + shkY, 5, 2, '#8ad8ff');
        R(hx + 9, hy + 4 + shkY, 5, 2, '#8ad8ff');
        // Mano sacudiendo el mango
        const mx = hx + shkX, my = hy + shkY;
        circ(mx + 1, my + 2, 5, 'rgba(0,0,0,.35)');
        circ(mx, my, 5, '#ffffff');
        circ(mx, my, 3.5, '#9ad8ff');
        // Badge visual explicativo
        c.fillStyle = 'rgba(20,20,26,.88)'; c.fillRect(64, 122, 65, 10);
        c.strokeStyle = '#8ad8ff'; c.lineWidth = 1; c.strokeRect(64, 122, 65, 10);
        c.fillStyle = '#ffffff'; c.font = '6px monospace'; c.textAlign = 'center';
        c.fillText('🔄 ¡SACUDE!', 96, 129);
      }
      else if (sug.t === 'fuego') {
        const b = sug.b;
        // Quemador destino brillando con aros de fuego y partículas
        c.strokeStyle = '#ff5a2a'; c.lineWidth = 1.5; c.beginPath(); c.arc(b.x, b.y, 12 + pul * 3, 0, 7); c.stroke();
        c.strokeStyle = '#ffd84a'; c.lineWidth = 1; c.beginPath(); c.arc(b.x, b.y, 8 + pul * 1.5, 0, 7); c.stroke();
        c.fillStyle = 'rgba(255,120,40,.22)'; c.beginPath(); c.arc(b.x, b.y, 11, 0, 7); c.fill();
        for (let i = 0; i < 3; i++) {
          const fa = i * 2.1 + cg.t * 3;
          R(b.x + Math.cos(fa) * 6, b.y + Math.sin(fa) * 6 - ((cg.t * 14 + i * 4) % 7), 1.5, 1.5, i % 2 ? '#ffd84a' : '#ff7a2a');
        }
        // Sartén brillando en naranja
        c.strokeStyle = '#ff9a4a'; c.lineWidth = 1.5; c.beginPath(); c.arc(pn.x, pn.y, 17.5 + pul * 2, 0, 7); c.stroke();
        // Trayectoria animada de la sartén al quemador
        const pasos = 6;
        for (let i = 1; i < pasos; i++) {
          const u = i / pasos, px = pn.x + (b.x - pn.x) * u, py = pn.y + (b.y - pn.y) * u;
          R(px, py, 1.5, 1.5, 'rgba(255,216,74,.6)');
        }
        const arrU = (cg.t * 1.4) % 1, ax = pn.x + (b.x - pn.x) * arrU, ay = pn.y + (b.y - pn.y) * arrU;
        c.fillStyle = '#ff7a2a'; c.beginPath(); c.arc(ax, ay, 2, 0, 7); c.fill();
        // Mano animada arrastrando la sartén por el mango hacia el fuego
        mano(pn.x + 22, pn.y, b.x + 22, b.y, '#ff9a4a');
        // Badge explicativo
        c.fillStyle = 'rgba(20,20,26,.88)'; c.fillRect(66, 122, 62, 10);
        c.strokeStyle = '#ff7a2a'; c.lineWidth = 1; c.strokeRect(66, 122, 62, 10);
        c.fillStyle = '#ffd84a'; c.font = '6px monospace'; c.textAlign = 'center';
        c.fillText('🔥 AL FUEGO', 97, 129);
      }
      else if (sug.t === 'mover') {
        const s = cgSlot(sug.p), T = sug.a;
        if (sug.p.loc === 'sarten') pn = cgPanDe(sug.p);
        ring(T, T === 'plato' ? '#8aff9a' : '#ffffff');
        const dst = T === 'tabla' ? { x: B.x + B.w / 2, y: B.y + 30 } : T === 'plato' ? { x: Pl.x, y: Pl.y } : { x: pn.x, y: pn.y };
        if (sug.p.loc === 'sarten') { c.globalAlpha = .4 + .5 * pul; c.strokeStyle = '#8aff9a'; c.beginPath(); c.arc(s.x, s.y, 8, 0, 7); c.stroke(); c.globalAlpha = 1; }
        mano(s.x, s.y, dst.x, dst.y, T === 'plato' ? '#8aff9a' : '#ffd84a');
      }
    }
    // partículas y mensajes
    cg.part.forEach(p => { c.globalAlpha = 1 - p.v; R(p.x, p.y, 2, 2, p.c); c.globalAlpha = 1; });
    c.font = '6px monospace'; c.textAlign = 'center';
    cg.msgs.forEach(m => { c.globalAlpha = Math.min(1, 1.3 - m.v); const y = m.y - m.v * 10; c.fillStyle = '#000'; c.fillText(m.t, m.x + 1, y + 1); c.fillStyle = m.c; c.fillText(m.t, m.x, y); c.globalAlpha = 1; });
    // progreso en el plato
    const tot = cg.piezas.length, ok = cg.piezas.filter(p => p.loc === 'plato').length; c.fillStyle = '#fff'; c.fillText(ok + '/' + tot, CG_PLATE.x, CGH - 2);
  }

  
{ const c = $('cgc'); c.addEventListener('pointerdown', cgDown); c.addEventListener('pointermove', cgMove); c.addEventListener('pointerup', cgUp); c.addEventListener('pointercancel', cgUp); $('cg-x').onclick = cgSalir; window.addEventListener('resize', () => { if (cg) cgLayout(); }); }

