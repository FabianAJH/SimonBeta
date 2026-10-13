  /* ===================== LUNA DE SANGRE Y EL OJO DE CTHULHU ===================== */
  let bl = null, admSangre = false, ojoHap = 0, ojoKeke = null, ojoXY = null, sangFlash = 0;
  function lunaSangreT() {   // cada noche (21:00-06:00) hay 1/10 de probabilidad; si toca, sale a una hora al azar y dura 3 horas. Nunca el sábado en la noche (choca con la dorada) ni el día 15 de 00:00 a 01:00 (choca con la azul)
    if (lunaOroT()) return false;
    if (admSangre) return true;
    const real = new Date(ahora()); if (real.getDate() === 15 && real.getHours() === 0) return false;
    const cfg = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.lunaSangre) || {};
    const hIni = cfg.horaInicio !== undefined ? cfg.horaInicio : 21;
    const hFin = cfg.horaFin !== undefined ? cfg.horaFin : 6;
    const probDiv = cfg.divisorProbabilidad !== undefined ? cfg.divisorProbabilidad : 10;
    const durMin = cfg.duracionMinutos !== undefined ? cfg.duracionMinutos : 180;
    const h = horaR(); if (!(h >= hIni || h < hFin)) return false;
    const d = new Date(ahora()); if (h < hFin) d.setDate(d.getDate() - 1);
    if (d.getDay() === 6) return false;
    const t = (h >= hIni ? h - hIni : h + (24 - hIni)) * 60 + new Date(ahora()).getMinutes();
    const k = 'sangre|' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); let x = 11; for (let i = 0; i < k.length; i++) x = Math.imul(x ^ k.charCodeAt(i), 2654435761) >>> 0;
    if (x % probDiv !== 0) return false;
    const ini = (x >>> 4) % 361;
    return t >= ini && t < ini + durMin;
  }
  const lunaSangre = () => escenaId() === 'sala' && (e.sangFase || 0) === 0 && !ov && lunaSangreT();   // tocable solo si Simon aún no tiene al ojo
  const sangreCielo = () => escenaId() === 'sala' && !ov && (!!bl || e.sangFase === 1 || lunaSangreT());
  function sangreGrid(v) {
    const g = Grid(60, 64), luna = elipse(36, 26, 6, 6), halo = elipse(36, 26, 10, 10), c1 = elipse(34, 24, 1.7, 1.7), c2 = elipse(39, 29, 1.3, 1.3), c3 = elipse(38, 22, 1, 1);
    for (let y = 14; y < 40; y++) for (let x = 24; x < 49; x++) {
      if (luna(x, y)) g.set(x, y, c1(x, y) || c2(x, y) || c3(x, y) ? '#7a0c1c' : BAY[y & 3][x & 3] > 9 ? '#e83a4a' : '#c01c30');
      else if (v && halo(x, y) && (x + y) % 2 === 0) g.set(x, y, '#8a1226');
    }
    return g;
  }
  function ojoGrid(r, ab, ph, mood, lx) {   // ojo con tentáculos; ab = apertura 0..1, mood 1 = corazón en el iris
    const tl = Math.max(3, Math.round(r * .75)), W = 2 * r + 5, H = 2 * r + 5 + tl, cx = W / 2, cy = r + 2.5, ry = r * .9;
    const g = Grid(W, H), sc = elipse(cx, cy, r, ry), bo = elipse(cx, cy, r + 1, ry + 1), ix = cx + lx * r * .22;
    const ir = elipse(ix, cy, r * .56, r * .56), ir2 = elipse(ix, cy, r * .4, r * .4), pu = elipse(ix, cy, Math.max(.6, r * .1), r * .42);
    [-1, 0, 1].forEach(i => { const x0 = Math.round(cx + i * r * .55); for (let k = 0; k < tl; k++) { const x = x0 + Math.round(Math.sin(ph + k * .9 + i * 2) * 1.3), y = Math.floor(cy + ry) + k - 1; g.set(x, y, k > tl - 2 ? '#1f5442' : '#2e8a68'); if (r >= 7) g.set(x + 1, y, '#2e8a68'); } });
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (bo(x, y) && !sc(x, y)) { g.set(x, y, '#4a0a18'); continue; }
      if (!sc(x, y)) continue;
      let c = (x + y) % 7 === 0 && Math.hypot(x - cx, y - cy) > r * .55 ? '#d84050' : '#f6ecec';
      if (y > cy + ry * .55 && c === '#f6ecec') c = '#ddc8cc';
      if (ir(x, y)) c = '#7a0c20'; if (ir2(x, y)) c = '#d02038'; if (pu(x, y)) c = '#12050a';
      if (ab < 1 && y < cy - ry + 2 * ry * (1 - ab)) c = '#5a1424';
      g.set(x, y, c);
    }
    if (mood && r >= 4 && ab > .5) g.art(Math.round(ix) - 2, Math.round(cy) - 2, ['.x.x.', 'xxxxx', '.xxx.', '..x..'], { x: '#ff7090' });
    if (ab > .5) g.set(Math.round(cx - r * .3), Math.round(cy - r * .35), '#ffffff');
    return g;
  }
  function dibOjo(X, Y, r, ab, mood, lx) {
    const ph = (tk >> 2) % 6, a = Math.round(ab * 5) / 5, sp = sprite('ojo|' + [r, a, ph, mood, lx].join('|'), () => ojoGrid(r, a, ph * 1.05, mood, lx), 0);
    ctx.drawImage(sp, Math.round(X - sp.width / 2), Math.round(Y - (r + 2.5)));
  }
  const ojoAct = () => ((e.sangFase === 2 || (e.tiene && e.tiene.ojo_pet)) && petActiva('ojo_pet')) || (e.sangFase === 2 && e.ojoOn !== 0);   // la mascota está con Simon (no guardada)
  const OJO_H = () => ({ x: SX - 9 + Math.round(Math.cos(tk / 13) * 6), y: SY + 20 + Math.round(Math.sin(tk / 13) * 4) });   // a la izquierda de Simon, orbitando suave
  function lanzaKeke() { ojoKeke = { t: 0, len: 14 }; gesto('salto'); }
  let sangInactT = 0;
  function sangreTap() {
    sangInactT = 0;
    e.sangT = (e.sangT || 0) + 1; sangFlash = 8; const dy0 = RY - 59;
    seq([233, 196, 175].slice(0, 1 + (e.sangT % 3)), .09, 'sawtooth', .05);
    for (let i = 0; i < 4; i++) lanzar('corazon', OX + 31 + Math.random() * 12, dy0 + 20 + Math.random() * 12, (Math.random() - .5) * 1.2, -.4, 8 + i);
    const req = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.lunaSangre && CONFIG_EASTEREGGS.lunaSangre.toquesRequeridos) || 3;
    if (e.sangT >= req) sangreStart(); else guardar();
  }
  function sangreStart() {
    if (bl) return; lugar = null; llegada = null; if (e.hab !== 'sala') { e.hab = 'sala'; pintarNav(); }
    if (e.dormido) { e.dormido = false; sfx.despertar(); } act = null; proxAct = tk + 99999;
    bl = { f: 'cambia', t: 0 }; sangInactT = 0; guardar();
  }
  function ojoToca() {
    if (ojoKeke || dlg) return;
    sangInactT = 0;
    if (e.sangFase === 2) { if (!ojoAct()) return; ojoSnd(); ojoHap = 20; if (ojoXY) lanzar('corazon', ojoXY.x, ojoXY.y - 6, 0, -1.5, 10); return; }
    e.ojoN = (e.ojoN || 0) + 1; lanzaKeke(); guardar();
  }
  function ojoFin() {
    e.sangFase = 2; guardar();
    decir('Sí.', null, 2600); hablar(); setTimeout(() => { sonidoUnico(); fanfare({ g: () => ojoGrid(9, 1, 0, 1, 1), t: 'OJO DE CTHULHU', d: 'MASCOTA EXCLUSIVA, ÚNICA EN SU CLASE. SIMON DUERME 10% MÁS RÁPIDO', mudo: true }, () => { corazones(6); estrellas(8); }); }, 900);
  }
  let ojoFuga = null;
  function ojoSeVa() { ojoFuga = null; e.sangFase = 0; e.ojoN = 0; e.sangT = 0; ojoKeke = null; sangInactT = 0; guardar(); }   // amaneció y Simon no lo convenció: el ojo se va; la luna de sangre podrá volver
  function blTick() {
    if (sangFlash > 0) sangFlash--; if (ojoHap > 0) ojoHap--;
    if (!bl && e.sangT > 0 && e.sangT < 3) {
      if (++sangInactT > 300) { e.sangT = 0; sangInactT = 0; guardar(); }
    }
    if (ojoKeke) {
      ojoKeke.t++;
      if (ojoKeke.t === ojoKeke.len) {
        const q = bl || e.sangFase === 1 ? OJO_H() : { x: SX - 9, y: SY + 20 }; ojoHap = 30; sfx.compra(); ojoSnd();
        for (let i = 0; i < 3 + (e.ojoN || 0); i++) lanzar('corazon', q.x - 6 + Math.random() * 12, q.y - 6, (Math.random() - .5), -1.6, 10 + i);
        const reqKekesOjo = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.lunaSangre && CONFIG_EASTEREGGS.lunaSangre.kekesRequeridos) || 5;
        if (!bl && e.sangFase === 1) { if (e.ojoN >= reqKekesOjo) setTimeout(ojoFin, 700); }
      }
      if (ojoKeke.t > ojoKeke.len + 4) ojoKeke = null;
    }
    if (!bl && e.sangFase === 1) {
      if (!ojoFuga && !esNoche()) { if (escenaId() === 'sala') ojoFuga = { t: 0 }; else ojoSeVa(); }
      else if (!ojoFuga && ++sangInactT >= 600) {   // 60s sin interacción con el ojo: se marcha
        if (escenaId() === 'sala') ojoFuga = { t: 0 }; else ojoSeVa();
        toast('El ojo se cansó de esperar y se fue...');
      }
    }
    if (ojoFuga && ++ojoFuga.t > 30) ojoSeVa();
    if (!bl) { if ((e.sangFase === 1 || ojoAct()) && !e.dormido && !modal && !dlg && !mj && !rt && tk % 10 === 0 && Math.random() < .05) ojoSnd(); return; }
    if (escenaId() !== 'sala' || bl.f === 'habla') return;
    bl.t++;
    if (bl.f === 'cambia') { if (bl.t === 1) retumbo(); if (bl.t === 16) ojoSnd(); if (bl.t >= 40) { bl.f = 'acerca'; bl.t = 0; } }
    else if (bl.f === 'acerca') { if (bl.t === 30) retumbo(); if (bl.t >= 90) { bl.f = 'entra'; bl.t = 0; seq([300, 420, 560, 760], .07, 'sine', .05); } }
    else if (bl.f === 'entra') { if (bl.t >= 50) { bl.f = 'lanza'; bl.t = 0; lanzaKeke(); } }
    else if (bl.f === 'lanza') {
      if (bl.t >= 40) {
        bl.f = 'habla';
        dialogo([S(), T('Le encantó el keke... Entonces no puede ser malo.')], () => { bl = null; e.sangFase = 1; e.ojoN = 0; proxAct = tk + 60; guardar(); pintar(); });
      }
    }
  }
  function sangreCieloDib(dy) {   // dentro del cristal de la ventana
    if (!sangreCielo()) return;
    ctx.fillStyle = 'rgba(110,0,24,.30)'; ctx.fillRect(OX, dy, 60, 64);
    const WX = OX + 29, WY = dy + 30;
    if ((!bl && e.sangFase !== 1) || (bl && bl.t < 10 && bl.f === 'cambia')) {
      const fu = sangFlash > 0 || (tk >> 3) % 2; ctx.drawImage(sprite('luna_sg' + (fu ? 1 : 0), () => sangreGrid(fu ? 1 : 0), 0), OX, dy);
    }
    if (bl && bl.f === 'cambia' && bl.t >= 10) { dibOjo(OX + 36, dy + 26, 6, Math.min(1, (bl.t - 10) / 24), 0, 0); }
    if (bl && bl.f === 'acerca') { const u = bl.t / 90, ue = u * u * (3 - 2 * u); dibOjo(OX + 36 + (WX - OX - 36) * ue, dy + 26 + (WY - dy - 26) * ue, Math.round(6 + ue * 4), 1, 0, (tk >> 4) % 2 ? 1 : -1); }
  }
  function ojoAtras() {   // mascota orbitando: mitad de atrás (detrás de Simon)
    ojoOrbita(false);
  }
  function ojoOrbita(fr) {
    if (!ojoAct() || bl) return; const esc = escenaId(); if (esc === 'estudio' || esc === 'bano' || esc === 'calle' || introActiva) return;
    const a = tk * (e.dormido ? .02 : .06), s = Math.sin(a), front = s > 0; if (front !== fr) return;
    const x = SX - 9 + Math.cos(a) * 8, y = SY + 22 + s * 6 + Math.sin(tk / 7) * 1.5;
    ojoXY = ojoXY || { x, y }; if (fr) ojoXY = { x, y };
    dibOjo(x, y, front ? 4 : 3, e.dormido ? .2 : (tk % 70 < 3 ? .2 : 1), ojoHap > 0 ? 1 : 0, 1);
  }
  function ojoFrente() {   // el ojo visitante (antes de ser mascota), el keke y la entrada por la ventana
    const esc = escenaId(); if (esc !== 'sala' || introActiva) { ojoOrbita(true); return; }
    const H = OJO_H(), mood = ojoHap > 0 ? 1 : 0, ab = tk % 70 < 3 ? .2 : 1;
    if (bl && bl.f === 'entra') { const dy = RY - 59, WX = OX + 29, WY = dy + 30, u = bl.t / 50, ue = u * u * (3 - 2 * u); dibOjo(WX + (H.x - WX) * ue, WY + (H.y - WY) * ue + Math.sin(u * 9) * 3, Math.max(7, 10 - Math.round(u * 3)), 1, 0, 1); }
    else if (!bl && e.sangFase === 1 && ojoFuga) { const u = ojoFuga.t / 30, dy = RY - 59; dibOjo(H.x + (OX + 29 - H.x) * u, H.y + (dy + 30 - H.y) * u - Math.sin(u * Math.PI) * 8, Math.max(4, 7 - Math.round(u * 3)), 1, 0, 1); }
    else if ((bl && (bl.f === 'lanza' || bl.f === 'habla')) || (!bl && e.sangFase === 1)) { ojoXY = { x: H.x, y: H.y }; dibOjo(H.x, H.y, 7, ab, mood, 1); }
    else ojoOrbita(true);
    if (ojoKeke && ojoKeke.t < ojoKeke.len) {
      const u = ojoKeke.t / ojoKeke.len, k0 = { x: SX + 8, y: SY + 34 }, q = bl || e.sangFase === 1 ? H : { x: SX - 9, y: SY + 20 };
      ctx.drawImage(sprite('fd_keke', FGRID.keke, 0), Math.round(k0.x + (q.x - k0.x) * u - 4), Math.round(k0.y + (q.y - k0.y) * u - Math.sin(u * Math.PI) * 14 - 4));
    }
  }
