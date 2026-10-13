  cv.addEventListener('pointerdown', ev => {
    ajustaSY();
    if (modal && modal !== 'editar' && !['run', 'mem', 'rt'].includes(modal)) {
      cerrar();
      return;
    }
    if (edit) { editDown(ev); return; }
    if (ban) { banDown(ev); return; }
    if (vistaBloq) return;   // viendo una habitación bloqueada ("en obra"): no se puede interactuar con nada ahí, Simon no está presente
    const r = cv.getBoundingClientRect();
    let x = (ev.clientX - r.left) / r.width * LW, y = (ev.clientY - r.top) / r.height * LH;
    if (escenaId() === 'estudio') { x = SX + 28 + (x - SX - 28) / EST_K; y = SY + 32 + (y - SY - 32) / EST_K; }
    const esc = escenaId();
    if (esc === 'sala' && !lugar && !calle && !dlg && !modal && !introActiva && !edit) {   // secretos de la ventana y eventos mágicos (prioridad absoluta sobre Cortex)
      const dy0 = RY - 59;
      if (az && az.f === 'espera' && esferaXY && Math.hypot(x - esferaXY.x, y - esferaXY.y) <= 15) { esferaToca(); return; }
      if (!ov && !bl && !az && ojoXY && (e.sangFase || 0) >= 1 && Math.hypot(x - ojoXY.x, y - ojoXY.y) <= 15) { ojoToca(); return; }
      if (ov && ov.f === 'espera') { const bx = OX + 29, by = dy0 + 49; if (Math.abs(x - bx) <= 16 && y >= by - 24 && y <= by + 8) { ov.f = 'despega'; ov.t = 0; sfx.click(); return; } }
      if (fz) { const q = fzPos(); if (Math.hypot(x - q.x, y - q.y) <= 12) { fzAtrapa(); return; } }
      if (!ov && !az && !e.tiene.casco_espacial && lunaDorada() && Math.hypot(x - (OX + 36), y - (dy0 + 26)) <= 14) { lunaTap(); return; }
      if (!ov && !bl && !az && lunaSangre() && Math.hypot(x - (OX + 36), y - (dy0 + 26)) <= 14) { sangreTap(); return; }
      if (lunaAzul() && Math.hypot(x - (OX + 36), y - (dy0 + 26)) <= 14) { azulTap(); return; }
      if (!ov && !az && !bl && !tr && boltV > 0 && Math.hypot(x - boltX, y - boltY) <= 14) { truenoTap(); return; }
    }
    if (desc && !bm && !dlg && cortex.p >= 1 && x >= cxb() && x <= cxb() + 62 && y >= SY + SH - 76 && y <= SY + SH) { sfx.click(); if (desc.siesta && desc.zzz) siestaToque(); else toast('CORTEX: Shhh... descansando'); return; }
    if (sifTap(x, y)) return;
    if (esc === 'parque' && ((typeof solToca === 'function' && solToca(x, y)) || (typeof alvToca === 'function' && alvToca(x, y)))) return;   // árbol del alvarikoke, la fruta y el trébol de 4 hojas
    if (esc === 'bano' && banoToca(x, y)) return;
    if (esc === 'entrada' && !(x >= SX && x <= SX + SW && y >= SY) && x >= OX + 6 && x <= OX + 48 && y >= RY - 44 && y <= RY + 40) { sfx.click(); abrir('mapa'); return; }
    if (esc === 'estudio' && !dlg && !modal && !estEstudiando() && y >= estDY() - 24 && y <= estDY() + 14 && !(x >= SX && x <= SX + SW && y >= SY)) { if (e.dormido) { decir('Zzz...'); sfx.no(); return; } sfx.click(); abrir('estudio'); return; }
    if (esc === 'juegos' && !dlg && !modal && x >= OX && x <= OX + 38 && y >= RY - 42 && y <= RY + 38 && !(x >= SX + 6 && y >= SY)) { if (e.dormido) { decir('Zzz...'); sfx.no(); return; } sfx.click(); abrir('minijuegos'); return; }
    if (esc === 'juegos' && !dlg && !modal && x >= OX + 78 && x <= OX + 118 && y >= RY - 38 && y <= RY - 2 && !(x >= SX + 6 && y >= SY)) { sfx.click(); abrir('trofeos'); return; }
    if (esc === 'jardin' && !ipf() && !dlg && !modal) {
      const hj = !(x >= SX && x <= SX + SW && y >= SY) && e.deco.find(d => ITEMS[d.k] && ITEMS[d.k].tap && d.h === 'jardin' && (r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)(posReal(d)));   // un mueble de jardín con toque va por delante de las macetas
      if (hj) { if (e.dormido) { decir('Zzz...'); return; } sfx.click(); tapDeco(hj.k); return; }
      if (jardinToca(x, y)) return;
    }
    if (!lugar && !dlg && !modal && esc !== 'estudio' && !(x >= SX && x <= SX + SW && y >= SY)) { const hd = e.deco.find(d => ITEMS[d.k] && ITEMS[d.k].tap && (d.h || 'sala') === e.hab && (r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)(posReal(d))); if (hd) { if (e.dormido && hd.k !== 'racha') { decir('Zzz...'); return; } sfx.click(); tapDeco(hd.k); return; } }
    if (!dlg && !modal && (!introActiva || (guia && guia.paso === 'jugar')) && esc !== 'estudio' && esc !== 'jardin' && !calle) {
      let rj = null;
      if (jugFis.activo) {
        const rad = jugFis.rad || 6;
        rj = { x: jugFis.x - rad - 3, y: jugFis.y - rad - 3, w: rad * 2 + 6, h: rad * 2 + 6 };
      } else if (lugar === 'parque') {
        const jk = juguetePuesto(), tj = sprite('tj_' + jk, () => ITEMS[jk].grid(), 0);
        rj = { x: SX + SW + 6, y: SY + SH - 4 - tj.height, w: tj.width, h: tj.height };
      } else if (!lugar) {
        const dj = e.deco.find(d => ITEMS[d.k] && ITEMS[d.k].slot === 'juguete' && (d.h || 'sala') === e.hab);
        if (dj) rj = posReal(dj);
      }
      const pad = (guia && guia.paso === 'jugar') ? 16 : 4;
      if (rj && x >= rj.x - pad && x <= rj.x + rj.w + pad && y >= rj.y - pad && y <= rj.y + rj.h + pad) {
        if (e.dormido) { decir('Zzz...'); sfx.no(); return; }
        if (typeof noEst === 'function' && noEst('ahora toca estudiar, no jugar')) return;
        if (e.energia < 3) { decir('Sí...', e.traductor ? 'Estoy muy cansado.' : null); hablar(); sfx.no(); avisoSueno(); return; }
        if (e.enf) { decir('Sí... ¡achú!', e.traductor ? 'No me siento bien para jugar.' : null, 3000); sfx.no(); return; }
        const jk = juguetePuesto();
        jugFis.k = jk;
        jugFis.rad = Math.max(5, Math.round(Math.min(rj.w, rj.h) / 2));
        jugFis.x = x;
        jugFis.y = y;
        jugFis.vx = 0;
        jugFis.vy = 0;
        jugFis.arr = true;
        jugFis.activo = true;
        jugFis.id = ev.pointerId;
        jugFis.pts = [{ x, y, t: Date.now() }];
        try { cv.setPointerCapture(ev.pointerId); } catch (_) {}
        return;
      }
    }
    if (esc === 'cocina' && !ipf() && !dlg && !modal && x >= OX && x <= OX + 31 && y >= RY - 10 && y <= RY + 34 && !(x >= SX && x <= SX + SW && y >= SY)) { if (e.dormido) { decir('Zzz...'); return; } sfx.click(); ck = null; if (!e.cocTut) cgTutorial(); else abrir('cocinar'); return; }
    if (esc === 'cocina' && !ipf() && x >= OX + 80 && x <= OX + 118 && y >= RY - 34 && y <= RY + 36) { sfx.click(); refriTap(); return; }
    if (mercPres && !dlg && cortex.p >= 1 && x >= cxb() && x <= cxb() + 62 && y >= SY + SH - 76 && y <= SY + SH) { sfx.click(); abrir('comercio'); return; }
    if (esc === 'sala' && x >= OX + 66 && x <= OX + 104 && y >= RY - 59 + 15 && y <= RY - 59 + 45 && !(x >= SX && x <= SX + SW && y >= SY)) { sfx.click(); abrir('cuadro'); return; }
    if (e.hallazgo && x >= SX + SW - 8 && x <= SX + SW + 14 && y >= SY + 14 && y <= SY + 44) { accion(function recoger() { recogerHallazgo(); }); return; }
    if (x >= SX && x <= SX + SW && y >= SY && y <= SY + SH) {   // acariciar: mover el dedo sobre Simon
      if (guia && guia.paso === 'jugar') {
        jugar();
        return;
      }
      if (introActiva || calle || dlg || ov || bl) return;
      if (e.dormido) { decir('Zzz...'); sfx.no(); return; }
      acar = { x, y, tot: 0, acc: 0, cor: 0, ronr: 0, id: ev.pointerId };
      try { cv.setPointerCapture(ev.pointerId); } catch (_) {}
    }
  });
  function acarMueve(ev) {
    if (jugFis.arr && ev.pointerId === jugFis.id) {
      const r = cv.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width * LW, y = (ev.clientY - r.top) / r.height * LH;
      jugFis.x = Math.max(jugFis.rad + 2, Math.min(LW - jugFis.rad - 2, x));
      jugFis.y = Math.max(jugFis.rad + 14, Math.min(LH - jugFis.rad - 2, y));
      const now = Date.now();
      jugFis.pts.push({ x: jugFis.x, y: jugFis.y, t: now });
      if (jugFis.pts.length > 5) jugFis.pts.shift();
      return;
    }
    if (!acar || ev.pointerId !== acar.id) return;
    const r = cv.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * LW, y = (ev.clientY - r.top) / r.height * LH;
    const d = Math.hypot(x - acar.x, y - acar.y); acar.x = x; acar.y = y;
    if (x < SX - 4 || x > SX + SW + 4 || y < SY - 4 || y > SY + SH + 4 || d > 40) return;   // solo cuenta mientras el dedo pasa por Simon
    acar.tot += d; acar.acc += d; acar.cor += d; if (acar.tot < 5) return;
    act = null; acarT = 8;
    if (tk - acar.ronr > 3) { acar.ronr = tk; sfx.ronr(); }
    if (acar.cor >= 26) { acar.cor = 0; corazones(1); }
    if (acar.acc >= 90) { acar.acc = 0; e.carOk = 1; mimar(true); pintar(); guardar(); }
  }
  function acarSuelta(ev) {
    if (jugFis.arr && (!ev || ev.pointerId === jugFis.id)) {
      jugFis.arr = false;
      const pts = jugFis.pts;
      let vx = 0, vy = 0;
      if (pts && pts.length >= 2) {
        const p1 = pts[pts.length - 1];
        let p0 = pts[0];
        for (let i = pts.length - 2; i >= 0; i--) {
          if (p1.t - pts[i].t >= 25) { p0 = pts[i]; break; }
        }
        const dt = Math.max(16, p1.t - p0.t);
        const impulso = 1.45;
        vx = ((p1.x - p0.x) / dt) * 16 * impulso;
        vy = ((p1.y - p0.y) / dt) * 16 * impulso;
      }
      vx = Math.max(-20, Math.min(20, vx));
      vy = Math.max(-22, Math.min(18, vy));
      if (Math.hypot(vx, vy) < 0.6) {
        const dir = Math.random() < 0.5 ? -1 : 1;
        vx = dir * (3.8 + Math.random() * 3.2);
        vy = -(5.2 + Math.random() * 3.5);
      }
      jugFis.vx = vx;
      jugFis.vy = vy;
      jugFis.activo = true;
      e.feliz = clamp(e.feliz + 25 * ecoMul());
      e.energia = clamp(e.energia - sifE(3));
      e.hambre = clamp(e.hambre - 1);
      e.st.jugar++;
      ganar(0, 0);
      mision('jugar');
      if (lugar === 'parque') e.st.parque++;
      corazones(3);
      responder(null, 'jugar');
      gesto('salto');
      hablar();
      act = null;
      proxAct = tk + 120;
      return;
    }
    if (!acar || (ev && ev.pointerId !== acar.id)) return;
    const toque = acar.tot < 5; acar = null;
    if (toque && escenaId() !== 'estudio') { mimar(false); pintar(); guardar(); }
  }
  cv.addEventListener('pointermove', acarMueve); cv.addEventListener('pointerup', acarSuelta); cv.addEventListener('pointercancel', acarSuelta);
  // deslizar con el dedo (fuera de Simon) para cambiar de habitación
  let deslz = null;
  cv.addEventListener('pointerdown', ev => {
    deslz = null;
    if (edit || ban || calle || introActiva || dlg || modal || cambiando || jugFis.arr) return;
    const r = cv.getBoundingClientRect(); let x = (ev.clientX - r.left) / r.width * LW, y = (ev.clientY - r.top) / r.height * LH;
    if (escenaId() === 'estudio') { x = SX + 28 + (x - SX - 28) / EST_K; y = SY + 32 + (y - SY - 32) / EST_K; }
    if (!vistaBloq && x >= SX - 6 && x <= SX + SW + 6 && y >= SY - 6 && y <= SY + SH + 6) return;   // sobre Simon es una caricia (no aplica viendo una habitación bloqueada: Simon no está ahí)
    deslz = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, t: Date.now(), w: r.width };
  });
  cv.addEventListener('pointerup', ev => {
    const d = deslz; deslz = null; if (!d || ev.pointerId !== d.id || edit || ban || calle || introActiva || dlg || modal || cambiando || acar) return;
    const dx = ev.clientX - d.x, dy = ev.clientY - d.y;
    if (Math.abs(dx) < d.w * .10 || Math.abs(dy) > Math.abs(dx) * .9 || Date.now() - d.t > 1200) return;
    if (dx > 0) { if (lugar) volverACasa(); else irHab(habIdxActual() - 1); }   // deslizar a la derecha = habitación de la izquierda
    else if (!lugar) irHab(habIdxActual() + 1);
  });
  cv.addEventListener('pointercancel', () => { deslz = null; });
