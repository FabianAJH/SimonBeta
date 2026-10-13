/* ===================== BAÑO: LIMPIEZA Y MINIJUEGO DE BAÑAR A SIMON ===================== */
  let ban = null;
  const limpTasa = () => lugar === 'parque' ? 6 : (e.hab === 'sala' || e.hab === 'bano') ? 4 : 4;   // puntos de limpieza que baja por hora
  const cabeza = () => ({ cx: SX + 28, cy: SY + 27, rx: 21, ry: 17 });
  const POV_CROP = [4, 6, 48, 46];   // primer plano de frente: la cabeza real de Simon ampliada
  const povK = () => (LW - 8) / POV_CROP[2];
  const povPos = () => ({ x: Math.round((LW - POV_CROP[2] * povK()) / 2), y: Math.round((LH - 26 - POV_CROP[3] * povK()) / 2) });
  const povCab = () => { const P = povPos(), K = povK(); return { cx: P.x + 24 * K, cy: P.y + 28 * K, rx: 22.5 * K, ry: 17 * K }; };
  function circG(g, cx, cy, r, c) { for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); g.rect(cx - w, cy + y, w * 2 + 1, 1, c); } }
  function banoGrid(W, H, RY, OX, S) {   // baño moderno: piedra clara, madera, vidrio y detalles negros mate
    S = S || {}; const g = Grid(W, H), FY = RY + 35;
    for (let y = 0; y < RY + 5; y++) for (let x = 0; x < W; x++) g.set(x, y, S.p ? PAT_P[S.p.pat](x, y, S.p.col) : (x + OX) % 22 === 0 ? '#d8d0c4' : '#e8e2d8');
    g.rect(0, 0, W, 2, '#f6f2ec'); g.rect(0, 2, W, 1, '#c8bfb0');
    g.rect(0, RY, W, 1, '#fbf8f2'); g.rect(0, RY + 1, W, 3, '#f1ece3'); g.rect(0, RY + 4, W, 1, '#9aa6a0');
    for (let y = RY + 5; y < RY + 29; y++) for (let x = 0; x < W; x++) g.set(x, y, S.p ? PAT_P[S.p.pat](x, y, S.p.wain) : ((x + OX) % 16 === 0 || (y - RY) % 12 === 5) ? '#8e9c96' : (((x + OX) / 16 | 0) % 2 ? '#b2c0ba' : '#a8b6b0'));
    g.rect(0, RY + 29, W, 6, '#b8c4be'); g.rect(0, RY + 29, W, 1, '#d8e2dc'); g.rect(0, RY + 33, W, 2, '#6c7a74');
    for (let y = FY; y < H; y++) for (let x = 0; x < W; x++) g.set(x, y, S.f ? PAT_F[S.f.pat](x, y - FY, S.f.col) : ((x + OX) % 20 === 0 || (y - FY) % 14 === 0) ? '#3c4850' : ((((x + OX) / 20 | 0) + ((y - FY) / 14 | 0)) % 2 ? '#5a6872' : '#52606a'));
    // espejo redondo con luz LED
    const mx = OX + 26, my = RY - 28;
    circG(g, mx, my, 17, '#fff0c8'); circG(g, mx, my, 16, '#f6e2a8'); circG(g, mx, my, 14, '#2a2a32'); circG(g, mx, my, 13, '#cfe4ee');
    for (let i = 0; i < 7; i++) { g.set(mx - 7 + i * 2, my - 8 + i * 2, '#ffffff'); g.set(mx - 6 + i * 2, my - 8 + i * 2, '#ffffff'); }
    g.rect(mx - 9, my - 11, 6, 1, '#eaf6fa');
    // mueble flotante de madera con lavabo
    g.rect(OX + 3, RY + 3, 46, 4, '#f8f6f2'); g.rect(OX + 3, RY + 3, 46, 1, '#ffffff'); g.rect(OX + 3, RY + 6, 46, 1, '#c8c4bc');
    g.rect(OX + 4, RY + 7, 44, 14, '#b88a58'); g.rect(OX + 4, RY + 7, 44, 1, '#d8aa78'); g.rect(OX + 4, RY + 20, 44, 1, '#7a5430');
    g.rect(OX + 26, RY + 7, 1, 14, '#7a5430'); g.rect(OX + 10, RY + 12, 10, 1, '#2a2a32'); g.rect(OX + 32, RY + 12, 10, 1, '#2a2a32');
    for (let i = 0; i < 40; i += 2) g.set(OX + 6 + i, RY + 22, '#4a5a62');
    capa(g, '#b8bcc8', L => sombrear(L, elipse(OX + 18, RY - 1, 9, 4), OX + 18, RY - 1, 9, 4, ['#ffffff', '#f2f4f8', '#d4d8e4', '#a8aec0']));
    g.rect(OX + 17, RY - 14, 2, 12, '#2a2a32'); g.rect(OX + 17, RY - 14, 7, 2, '#2a2a32'); g.rect(OX + 23, RY - 12, 1, 3, '#2a2a32');
    g.art(OX + 36, RY - 8, ['..g.g..', '.ggggg.', '.gGgGg.', '..ggg..', '..bbb..', '..bbb..'], { g: '#4aa860', G: '#7ad08a', b: '#8a5a3a' });   // plantita
    g.rect(OX + 41, RY - 3, 4, 6, '#2a2a32'); g.rect(OX + 42, RY - 5, 2, 2, '#2a2a32');   // dispensador de jabón
    // repisas flotantes con toallas y vela
    [[OX + 56, RY - 26], [OX + 56, RY - 10]].forEach(([x, y], i) => { g.rect(x, y, 26, 2, '#b88a58'); g.rect(x, y, 26, 1, '#d8aa78'); });
    g.rect(OX + 58, RY - 36, 10, 10, '#f4f2ee'); g.rect(OX + 58, RY - 36, 10, 2, '#d8d4cc'); g.rect(OX + 58, RY - 31, 10, 1, '#d8d4cc'); g.rect(OX + 69, RY - 33, 9, 7, '#8a96a2'); g.rect(OX + 69, RY - 33, 9, 1, '#a8b2bc');
    g.rect(OX + 60, RY - 17, 6, 7, '#f4eadc'); g.rect(OX + 62, RY - 20, 2, 3, '#ffe28a'); g.set(OX + 62, RY - 21, '#ff9a40'); g.rect(OX + 70, RY - 16, 8, 6, '#e8eef2'); g.rect(OX + 70, RY - 16, 8, 1, '#ffffff');
    // ducha a ras de piso con mampara de vidrio
    const sx0 = OX + 90, sx1 = OX + 126;
    for (let y = RY - 50; y < FY; y++) for (let x = sx0; x < sx1; x++) g.set(x, y, ((x + y) % 11 === 0 || (x + y) % 11 === 1) ? '#ffffff' : (y < RY + 5 ? '#c8e0e8' : '#bcd6de'));
    g.rect(sx0, RY - 50, 2, FY - RY + 50, '#2a2a32'); g.rect(sx0, RY - 51, sx1 - sx0, 2, '#2a2a32'); g.rect(sx1 - 2, RY - 50, 2, FY - RY + 50, '#2a2a32'); g.rect(sx0, FY - 2, sx1 - sx0, 2, '#2a2a32');
    g.rect(sx0 + 14, RY - 50, 1, FY - RY + 50, '#4a4a54');
    g.rect(sx0 - 5, RY - 20, 3, 14, '#2a2a32'); g.rect(sx0 - 4, RY - 19, 1, 12, '#6a6a76');   // manija
    circG(g, sx0 + 22, RY - 42, 6, '#2a2a32'); circG(g, sx0 + 22, RY - 42, 5, '#4a4a54'); for (let i = -3; i <= 3; i += 2) g.set(sx0 + 22 + i, RY - 42, '#9aa0aa'), g.set(sx0 + 22, RY - 42 + i, '#9aa0aa');   // regadera tipo lluvia
    g.rect(sx0 + 22, RY - 50, 1, 8, '#2a2a32');
    // tapete de listones de madera
    g.rect(OX + 28, FY + 6, 64, 10, '#8a6038'); for (let i = 0; i < 64; i += 4) g.rect(OX + 29 + i, FY + 7, 3, 8, i % 8 ? '#c8a070' : '#d8b080');
    return g;
  }
  const mixc = (c, w, t) => { const p = i => parseInt(c.substr(1 + i * 2, 2), 16), q = i => parseInt(t.substr(1 + i * 2, 2), 16); return '#' + [0, 1, 2].map(i => Math.max(0, Math.min(255, Math.round(p(i) + (q(i) - p(i)) * w))).toString(16).padStart(2, '0')).join(''); };
  function azulejoPared(g, W, FY, OX, lx, ly) {   // pared de azulejo biselado con luz suave, cenefa de mosaico y gotitas
    const T = 16, TONOS = ['#e8f4f3', '#dff0f0', '#d6eaec', '#e3f1f0'];
    for (let y = 0; y < FY; y++) for (let x = 0; x < W; x++) {
      const X = x + OX, tx = Math.floor(X / T), ty = Math.floor(y / T), lx0 = X - tx * T, ly0 = y - ty * T;
      let c = TONOS[((tx * 7 + ty * 13 + (tx * ty)) % 4 + 4) % 4];
      if (lx0 === 0 || ly0 === 0) c = '#a9c6cb';
      else if (lx0 === 1 || ly0 === 1) c = '#fafefe';
      else if (lx0 === T - 1 || ly0 === T - 1) c = '#c3d9dd';
      const d = Math.hypot(x - lx, (y - ly) * 1.1) / W;   // luz que cae desde la regadera
      c = mixc(c, Math.max(0, .34 - d * .5), '#ffffff'); c = mixc(c, Math.min(.2, y / FY * .16 + d * .12), '#7fb4c2');
      g.set(x, y, c);
    }
    const my = Math.round(FY * .42) - 4;   // cenefa de mosaico turquesa
    for (let x = 0; x < W; x++) for (let k = 0; k < 6; k++) { const X = x + OX, cx = Math.floor(X / 6), ccol = ['#2f8fa6', '#46b0c0', '#7fd0d8', '#3aa0b4'][(cx * 3 + (k >> 1)) % 4]; g.set(x, my + k, (X % 6 === 0 || k === 0 || k === 5) ? '#1f6f84' : ccol); }
    g.rect(0, my - 1, W, 1, '#fafefe'); g.rect(0, my + 6, W, 1, '#a9c6cb');
    for (let i = 0; i < 18; i++) { const x = (i * 29 + 7) % (W - 8) + 4, y = (i * 47 + 11) % (FY - 14) + 6; if (y > my - 3 && y < my + 8) continue; g.set(x, y, '#ffffff'); g.set(x, y + 1, '#bfe3ee'); g.set(x, y + 2, '#dff3fa'); }
  }
  function duchaGrid(W, H, RY, OX, S) {   // el interior de la regadera: azulejo biselado, vidrio, lluvia y repisita con shampoo
    S = S || {}; const g = Grid(W, H), FY = RY + 35, cx = Math.round(W / 2);
    azulejoPared(g, W, FY, OX, cx, 6);
    for (let y = FY; y < H; y++) for (let x = 0; x < W; x++) {   // piso de pizarra con juntas y reflejo mojado
      const X = x + OX, ty = Math.floor((y - FY) / 14), tx = Math.floor((X + (ty % 2) * 10) / 20), lx0 = (X + (ty % 2) * 10) - tx * 20, ly0 = (y - FY) % 14;
      if (S.f) { g.set(x, y, mixc(PAT_F[S.f.pat](x, y - FY, S.f.col), Math.max(0, .24 - Math.hypot(x - cx, (y - FY) * 2.2) / W * .6), '#bfe6f2')); continue; }
      let c = ((tx * 5 + ty * 3) % 3) === 0 ? '#5e6e78' : ((tx + ty) % 2 ? '#566670' : '#4e5e68');
      if (lx0 === 0 || ly0 === 0) c = '#364048'; else if (ly0 === 1) c = mixc(c, .22, '#ffffff');
      c = mixc(c, Math.max(0, .26 - Math.hypot(x - cx, (y - FY) * 2.2) / W * .7), '#bfe6f2'); g.set(x, y, c);
    }
    g.rect(0, FY - 3, W, 1, '#fafefe'); g.rect(0, FY - 2, W, 3, '#2a2a32');
    const dx0 = Math.round(W * .18); g.rect(dx0, FY + 14, 26, 6, '#2a2f36'); for (let i = 0; i < 6; i++) g.rect(dx0 + 2 + i * 4, FY + 15, 2, 4, '#8a949c');   // coladera
    g.rect(0, 0, 4, FY, '#2a2a32'); g.rect(1, 0, 1, FY, '#7a828c'); g.rect(W - 4, 0, 4, FY, '#2a2a32'); g.rect(W - 3, 0, 1, FY, '#7a828c');   // marco del vidrio
    for (let k = 0; k < 3; k++) { const x = W - 12 - k * 5; for (let y = 8 + k * 6; y < FY - 6; y++) if (((y + k * 4) >> 3) % 2 === 0) g.set(x - (y >> 3), y, '#f4fcff'); }   // brillos del vidrio
    circG(g, cx, 8, 14, '#2a2a32'); circG(g, cx, 8, 12, '#5a5a66'); circG(g, cx - 3, 5, 5, '#6e7280'); for (let j = -9; j <= 9; j += 3) for (let i = -9; i <= 9; i += 3) if (i * i + j * j < 90) g.set(cx + i, 8 + j, '#b4bac4');
    g.rect(cx, 0, 1, 2, '#2a2a32'); g.rect(cx - 2, 20, 5, 1, '#e8f6fc');
    for (let i = 0; i < 36; i++) { const x = cx - 28 + ((i * 37) % 57), y0 = 22 + ((i * 53) % 70); g.rect(x, y0, 1, 8, '#d8f0fa'); g.rect(x, y0 + 8, 1, 3, '#9fd4ec'); }
    g.rect(9, RY - 41, 30, 28, '#8aa6ae'); g.rect(10, RY - 40, 28, 26, '#d6e6ea'); g.rect(12, RY - 38, 24, 22, '#a6bec6'); g.rect(12, RY - 26, 24, 2, '#f2fafc'); g.rect(10, RY - 14, 28, 2, '#6f8a94');   // nicho
    g.rect(15, RY - 36, 6, 10, '#ff9a40'); g.rect(16, RY - 39, 4, 3, '#4b6ae8'); g.rect(26, RY - 38, 6, 12, '#4ab8ff'); g.rect(27, RY - 41, 4, 3, '#ffffff');
    g.rect(W - 23, RY - 41, 16, 24, '#1e1e26'); g.rect(W - 22, RY - 40, 14, 22, '#2e2e38'); circG(g, W - 15, RY - 32, 4, '#aab0ba'); circG(g, W - 15, RY - 32, 2, '#2a2a32'); g.rect(W - 19, RY - 24, 8, 2, '#ff6a58'); g.rect(W - 19, RY - 21, 8, 2, '#4ab8ff');
    return g;
  }
  function povGrid(W, H) {   // pared de la regadera detrás del primer plano, con luz y burbujitas
    const g = Grid(W, H); azulejoPared(g, W, H, 0, Math.round(W / 2), -6);
    for (let i = 0; i < 14; i++) { const x = (i * 41 + 9) % (W - 12) + 6, y = (i * 67 + 13) % (H - 20) + 8, r = 2 + i % 3; circG(g, x, y, r, '#cfeef7'); circG(g, x, y, r - 1, '#f2fbfe'); g.set(x - 1, y - 1, '#ffffff'); }
    return g;
  }
  const BAN_FASES = [
    { f: 'piojos', pov: 1, t: 'PIOJOS', h: 'TOCA CADA PIOJO' }, { f: 'shampoo', pov: 1, t: 'SHAMPOO', h: 'FROTA LA CABEZA' }, { f: 'enjuague', pov: 1, t: 'ENJUAGUE', h: 'PASA EL AGUA POR SU CABEZA' },
    { f: 'jabon', pov: 0, t: 'JABÓN', h: 'TALLA A SIMON' }, { f: 'enjuague', pov: 0, t: 'ENJUAGUE', h: 'QUITA TODA LA ESPUMA' }];
  function banCeldas(f) {
    const L = [];
    if (f === 'shampoo') { const P = povCab(); for (let j = 0; j < 12; j++) for (let i = 0; i < 14; i++) { const x = P.cx - P.rx + 6 + i * (2 * P.rx - 12) / 13, y = P.cy - P.ry + 6 + j * (2 * P.ry - 12) / 11, dx = (x - P.cx) / P.rx, dy = (y - P.cy) / P.ry; if (dx * dx + dy * dy <= .95) L.push({ x, y, ok: 0 }); } }
    else for (let j = 0; j < 5; j++) for (let i = 0; i < 8; i++) L.push({ x: SX + 6 + i * 6.1, y: SY + 45 + j * 5.6, ok: 0 });
    return L;
  }
  function banPov(on) {   // cambio de escena con fundido
    if (ban.pov === on) return; ban.lock = true; const f = $('fundido'); f.classList.add('on');
    setTimeout(() => { if (!ban) return; ban.pov = on; f.classList.remove('on'); setTimeout(() => { if (ban) ban.lock = false; }, 200); }, 220);
  }
  function banStart() {
    if (ban || dlg || modal || introActiva) return;
    if (e.dormido) { decir('Zzz...'); sfx.no(); return; }
    if (e.enf) { decir('Sí... ¡achú!', e.traductor ? 'Resfriado no me baño.' : null, 3000); sfx.no(); return; }
    if (e.limp >= 92) { decir('Sí.', e.traductor ? 'Ya estoy limpio. Brillo de limpio.' : null, 3000); hablar(); sfx.no(); return; }
    act = null; proxAct = tk + 99999;
    const P = povCab(), n = 3 + Math.floor((100 - e.limp) / 20), lice = [];
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * .7; lice.push({ x: P.cx + Math.cos(a) * P.rx * r, y: P.cy + Math.sin(a) * P.ry * r, vivo: true, a: Math.random() * 6.28 }); }
    ban = { sc0: sinCorona, f: 'piojos', i: 0, t: 0, lice, cel: [], foam: [], ptr: null, down: false, l0: e.limp, muertos: 0, snd: 0, pov: false, lock: false, total: 0 };
    vSnap = e.ropa; e.ropa = Object.assign({}, vSnap, { cara: null, orejas: null }); sinCorona = true;   // sin gorros, lentes ni corona mientras se baña (lo guardado no cambia)
    document.body.classList.add('banando'); $('ban').classList.add('on'); banHud(); sfx.click(); chapoteo(.07, .25); banPov(true);
  }
  function banHud() {
    const F = BAN_FASES[ban.i]; let p = 0;
    if (ban.f === 'piojos') p = ban.muertos / ban.lice.length;
    else if (ban.f === 'enjuague') p = 1 - ban.foam.length / Math.max(1, ban.total);
    else if (ban.cel.length) p = ban.cel.filter(c => c.ok).length / ban.cel.length;
    $('ban-t').textContent = (ban.i + 1) + '/' + BAN_FASES.length + ' ' + F.t; $('ban-h').textContent = F.h; $('ban-p').style.width = Math.round(Math.min(1, p) * 100) + '%';
  }
  function banAvanza() {
    sfx.logro(); ban.i++; ban.t = 0; ban.snd = 0; ban.down = false;
    if (ban.i >= BAN_FASES.length) { banFin(); return; }
    const F = BAN_FASES[ban.i]; ban.f = F.f;
    if (ban.f === 'shampoo' || ban.f === 'jabon') ban.cel = banCeldas(ban.f);
    if (ban.f === 'enjuague') { ban.cel = []; ban.total = ban.foam.length; }
    if (!!F.pov !== ban.pov) banPov(!!F.pov);
    banHud();
  }
  function banFin() {
    ban.f = 'fin'; ban.t = 0; $('ban').classList.remove('on');
    const falta = 100 - ban.l0; e.limp = 100; e.feliz = clamp(e.feliz + 8 + Math.round(falta / 8)); e.st.banos = (e.st.banos || 0) + 1;
    ganar(Math.max(2, Math.round(falta / 10)), 2 + Math.round(falta / 25));
    seq([784, 988, 1175, 1568], .09, 'triangle', .06); estrellas(8); corazones(3); guardar(); pintar();
  }
  function banSalir() {
    if (!ban) return; const completo = ban.f === 'fin'; if (vSnap) { e.ropa = vSnap; vSnap = null; } sinCorona = ban.sc0; ban = null; $('fundido').classList.remove('on'); document.body.classList.remove('banando'); $('ban').classList.remove('on'); proxAct = tk + 60; pintar(); guardar();
    if (completo) { decir('Sí.', e.traductor ? '¡Qué rico baño! Huelo a nube.' : null, 3500); hablar(); gesto('salto'); }
  }
  $('ban-x').onclick = () => { sfx.click(); banSalir(); };
  function banPos(ev) { const r = cv.getBoundingClientRect(); return { x: (ev.clientX - r.left) / r.width * LW, y: (ev.clientY - r.top) / r.height * LH }; }
  function banDown(ev) {
    if (ban.lock) return;
    const p = banPos(ev); ban.down = true; ban.ptr = p;
    try { cv.setPointerCapture(ev.pointerId); } catch (_) {}
    if (ban.f === 'piojos') {
      let mj = -1, md = 10; ban.lice.forEach((l, i) => { const d = Math.hypot(l.x - p.x, l.y - p.y); if (l.vivo && d < md) { md = d; mj = i; } });
      if (mj >= 0) { const l = ban.lice[mj]; l.vivo = false; ban.muertos++; seq([1000, 520], .035, 'square', .05); for (let i = 0; i < 4; i++) lanzar('estrella', l.x, l.y, (Math.random() - .5) * 1.6, -.6, 6); banHud(); if (ban.muertos >= ban.lice.length) setTimeout(() => { if (ban && ban.f === 'piojos') banAvanza(); }, 400); }
      else sfx.click();
    } else banAplica();
  }
  function banMove(ev) { if (!ban || !ban.down || ban.lock) return; ban.ptr = banPos(ev); banAplica(); }
  function banUp() { if (ban) { ban.down = false; } }
  function banAplica() {
    const p = ban.ptr; if (!p) return;
    if (ban.f === 'shampoo' || ban.f === 'jabon') {
      const pov = ban.f === 'shampoo'; let nuevo = 0;
      ban.cel.forEach(c => { if (!c.ok && Math.hypot(c.x - p.x, c.y - p.y) < (pov ? 10 : 7)) { c.ok = 1; nuevo++; ban.foam.push({ x: c.x + (Math.random() - .5) * 2, y: c.y + (Math.random() - .5) * 2, r: pov ? 7 + Math.floor(Math.random() * 4) : 3 + Math.floor(Math.random() * 3), hp: 12 }); } });
      if (tk - ban.snd > 2) { ban.snd = tk; if (ban.f === 'jabon') chirrido(1400 + Math.random() * 500, 2000, .05, .025); else chapoteo(.05, .08); }
      if (nuevo) banHud();
      if (ban.cel.filter(c => c.ok).length >= ban.cel.length * .92) { ban.cel.forEach(c => c.ok = 1); banAvanza(); }
    } else if (ban.f === 'enjuague') {
      const antes = ban.foam.length, rad = ban.pov ? 17 : 11; ban.foam.forEach(b => { if (Math.hypot(b.x - p.x, b.y - p.y) < rad) b.hp--; }); ban.foam = ban.foam.filter(b => b.hp > 0);
      if (tk - ban.snd > 2) { ban.snd = tk; chapoteo(.04, .1); }
      if (ban.foam.length !== antes) banHud();
      if (ban.foam.length <= ban.total * .04) { ban.foam = []; banAvanza(); }
    }
  }
  function sonidoAgua(dur) {   // gotitas de agua cayendo una por una
    if (e.mudo || !audio()) return;
    const sr = ac.sampleRate, total = Math.floor(sr * dur);
    // genera una gotita: tono suave que cae en pitch rápidamente (plop)
    function gota(retardo) {
      const gl = Math.floor(sr * .055), gb = ac.createBuffer(1, gl, sr), gx = gb.getChannelData(0);
      const freq0 = 900 + Math.random() * 400, freq1 = 300 + Math.random() * 200;
      for (let i = 0; i < gl; i++) {
        const t = i / sr, env = Math.exp(-t * 38);
        const freq = freq0 + (freq1 - freq0) * (i / gl);
        gx[i] = Math.sin(2 * Math.PI * freq * t) * env * .28
               + (Math.random() * 2 - 1) * env * .06;  // leve click inicial
      }
      const gs = ac.createBufferSource(), gg = ac.createGain();
      gg.gain.value = .7 + Math.random() * .3;
      gs.buffer = gb; gs.connect(gg); gg.connect(ac.destination);
      gs.start(ac.currentTime + retardo);
    }
    // lanzar gotitas a intervalos irregulares durante `dur` segundos
    let t = 0;
    while (t < dur - .06) {
      gota(t);
      t += .08 + Math.random() * .09;
    }
  }
  function chapoteo(vol, dur) {   // ruido de agua / burbujas
    if (e.mudo || !audio()) return;
    const n = Math.floor(ac.sampleRate * dur), b = ac.createBuffer(1, n, ac.sampleRate), x = b.getChannelData(0); for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = b; f.type = 'bandpass'; f.frequency.value = 1500 + Math.random() * 1500; f.Q.value = .8; g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(ac.destination); s.start();
  }
  function banTick() {
    if (!ban) return;
    if (escenaId() !== 'bano') { banSalir(); return; }
    ban.t++;
    if (ban.f === 'piojos' && ban.pov) { const P = povCab(); ban.lice.forEach(l => { if (!l.vivo) return; l.a += (Math.random() - .5) * .9; l.x += Math.cos(l.a) * 1.6; l.y += Math.sin(l.a) * 1.6; const dx = (l.x - P.cx) / (P.rx * .88), dy = (l.y - P.cy) / (P.ry * .88); if (dx * dx + dy * dy > 1) { l.a = Math.atan2(P.cy - l.y, P.cx - l.x) + (Math.random() - .5) * .8; l.x += Math.cos(l.a) * 2; l.y += Math.sin(l.a) * 2; } }); }
    if (ban.f === 'fin' && ban.t >= 18) banSalir();
  }
  const sprBotella = () => sprite('ban_bot', () => { const g = Grid(8, 13); g.rect(2, 0, 4, 2, '#4b6ae8'); g.rect(1, 2, 6, 10, '#ff9a40'); g.rect(1, 2, 1, 10, '#ffc080'); g.rect(2, 5, 4, 4, '#ffffff'); g.rect(3, 6, 2, 2, '#4ab8ff'); g.rect(1, 12, 6, 1, '#a85a10'); return g; }, 0);
  const sprJabon = () => sprite('ban_jab', () => { const g = Grid(11, 7); g.rect(1, 1, 9, 5, '#ff9ac0'); g.rect(1, 1, 9, 1, '#ffd0e4'); g.rect(1, 5, 9, 1, '#d0608c'); g.rect(0, 2, 1, 3, '#ff9ac0'); g.rect(10, 2, 1, 3, '#d0608c'); g.set(3, 3, '#ffffff'); g.set(4, 3, '#ffffff'); return g; }, 0);
  function disco2(x, y, r, c) { ctx.fillStyle = c; for (let j = -r; j <= r; j++) { const w = Math.round(Math.sqrt(r * r - j * j)); ctx.fillRect(Math.round(x - w), Math.round(y + j), w * 2 + 1, 1); } }
  function banDibujar() {
    const esc = escenaId(); if (esc === 'estudio' || esc === 'calle' || introActiva) return;
    if (!ban) {   // suciedad: piojitos y olor cuando la limpieza está baja
      if (e.limp < 45 && !e.dormido) {
        const H = cabeza(), n = e.limp < 25 ? 3 : 1;
        for (let i = 0; i < n; i++) { const a = tk * .05 * (i % 2 ? 1 : -1) + i * 2.3, x = H.cx + Math.cos(a) * H.rx * .6, y = H.cy - 6 + Math.sin(a * 1.3) * H.ry * .5; ctx.fillStyle = '#2a1a10'; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); if ((tk >> 2) % 2) { ctx.fillRect(Math.round(x) - 1, Math.round(y) + 2, 1, 1); ctx.fillRect(Math.round(x) + 2, Math.round(y) + 2, 1, 1); } }
      }
      if (e.limp < 30 && !e.dormido) { ctx.fillStyle = '#8ab04a'; for (let i = 0; i < 3; i++) { const x = SX + 8 + i * 20, ph = (tk >> 2) + i; for (let k = 0; k < 6; k++) ctx.fillRect(x + Math.round(Math.sin((ph + k) * 1.2) * 1.5), SY - 2 - k * 2, 1, 2); } }
      return;
    }
    if (ban.pov) {
      ctx.drawImage(sprite('pov' + LW + 'x' + LH, () => povGrid(LW, LH), 0), 0, 0);
      ctx.fillStyle = 'rgba(20,40,50,.18)'; for (let i = 0; i < 5; i++) { ctx.fillRect(0, 0, 5 - i, LH); ctx.fillRect(LW - 5 + i, 0, 5 - i, LH); }
      const ojos = ban.f === 'piojos' ? 'a' : 'c', P = povPos();
      ctx.drawImage(sprite('povc|' + ojos + '|' + ropaSig(), () => recorte(simonGrid(ojos, 'n', e.ropa, {}), POV_CROP[0], POV_CROP[1], POV_CROP[2], POV_CROP[3]), 0), P.x, P.y, Math.round(POV_CROP[2] * povK()), Math.round(POV_CROP[3] * povK()));
    }
    ban.foam.forEach(b => { disco2(b.x, b.y, b.r, '#cfe8ff'); disco2(b.x - .5, b.y - .5, b.r - 1, '#ffffff'); ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(b.x - b.r / 2), Math.round(b.y - b.r / 2), 1, 1); });
    if (ban.f === 'piojos' && ban.pov) ban.lice.forEach(l => {
      if (!l.vivo) return; const x = Math.round(l.x), y = Math.round(l.y), w = (tk >> 1) % 2, c = Math.cos(l.a) >= 0 ? 1 : -1;
      ctx.fillStyle = '#2a1a10'; ctx.fillRect(x - 3, y - 1, 7, 4); ctx.fillStyle = '#5a3a20'; ctx.fillRect(x - 2, y - 1, 5, 1); ctx.fillStyle = '#2a1a10'; ctx.fillRect(x + 4 * c - (c < 0 ? 1 : 0), y, 2, 2);
      for (let k = 0; k < 3; k++) { ctx.fillRect(x - 2 + k * 2, y - 2 + (w && k % 2 ? 1 : 0), 1, 1); ctx.fillRect(x - 2 + k * 2, y + 3 - (w && k % 2 ? 1 : 0), 1, 1); }
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 4 * c - (c < 0 ? 1 : 0), y, 1, 1);
    });
    const p = ban.ptr;
    if (p && ban.down && !ban.lock) {
      if (ban.f === 'shampoo') { ctx.drawImage(sprBotella(), Math.round(p.x + 4), Math.round(p.y - 16)); ctx.fillStyle = '#ffe0a0'; ctx.fillRect(Math.round(p.x + 5), Math.round(p.y - 3 + ((tk >> 1) % 3)), 1, 2); }
      else if (ban.f === 'jabon') ctx.drawImage(sprJabon(), Math.round(p.x - 5 + Math.sin(tk) * 1), Math.round(p.y - 3));
      else if (ban.f === 'enjuague') {
        {
          const hx = Math.round(p.x), top = ban.pov ? 2 : SY - 14; ctx.fillStyle = '#d0d4e0'; ctx.fillRect(hx - 5, top - 4, 11, 4); ctx.fillStyle = '#8a90a0'; ctx.fillRect(hx - 5, top, 11, 1);
          for (let i = -4; i <= 4; i += 2) for (let y = top + 1 + ((tk + i) % 4); y < p.y + 8; y += 4) { ctx.fillStyle = '#6ac0ff'; ctx.fillRect(hx + i, y, 1, 2); }
        }
      }
    }
    if (ban.f === 'fin') { for (let i = 0; i < 6; i++) { const x = SX + 6 + i * 9, y = SY + 4 + Math.round(Math.sin(tk / 2 + i) * 6) - ban.t; ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y, 2, 2); ctx.fillStyle = '#8ad0ff'; ctx.fillRect(x + 1, y + 1, 1, 1); } }
  }
  function banoToca(x, y) {   // regadera del baño (lavabo sin interacción, solo escenario)
    if (ban || dlg || modal || introActiva || escenaId() !== 'bano' || edit) return false;
    const FY = RY + 35;
    if (x >= OX + 90 && y >= RY - 52 && y <= FY + 6) { sfx.click(); banStart(); return true; }
    return false;
  }
