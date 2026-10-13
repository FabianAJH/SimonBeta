  function dibujar() {
    const n = (e.dormido || ov || bl || az || esNoche()) ? 1 : 0;
    ctx.clearRect(0, 0, LW, LH); ojoXY = null;
    const dy = RY - 59;
    const esc = escenaId(); ajustaSY(); fondoEscena(esc, n, dy);
    if (vistaBloq) { dibujarConstruccion(); return; }
    dibujarMuebles(n, 'atras');
    if (n && (esc === 'sala' || esc === 'cocina') && (clima() === 'sol' || ((esc === 'sala' && (lunaDorada() || sangreCielo() || lunaAzulT())) || (esc === 'cocina' && (lunaOroT() || lunaSangreT() || lunaAzulT()))))) { const s = ESTRELLAS[(tk >> 2) % ESTRELLAS.length], sy = s[1] + dy, sx = s[0] + OX; ctx.fillStyle = '#ffffff'; ctx.fillRect(sx, sy, 1, 1); ctx.fillRect(sx - 1, sy, 3, 1); ctx.fillRect(sx, sy - 1, 1, 3); }
    const ojos = (e.dormido || parpadeoT > 0 || acarT > 0) ? 'c' : 'a';
    const boca = e.dormido ? 'n' : bocaT > 10 ? 't' : (bocaT > 0 || acarT > 0) ? 's' : 'n';
    let oy = (saltoT >= 0 ? SALTO[saltoT] : 0) + (!e.dormido && saltoT < 0 && gT < 0 && (tk >> 2) % 2 ? 1 : 0);
        if (!e.dormido && simonLevita()) {
      const cfgL = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.simonLevita) || {};
      const altBase = cfgL.alturaLevitacion !== undefined ? cfgL.alturaLevitacion : 5;
      const velOsc = cfgL.velocidadOscilacion !== undefined ? cfgL.velocidadOscilacion : 11;
      const ampOsc = cfgL.amplitudOscilacion !== undefined ? cfgL.amplitudOscilacion : 2;
      oy -= altBase + Math.round(Math.sin(tk / velOsc) * ampOsc);
    }   // SEMILLA ETERNA + aura puesta: Simon flota con un balanceo suave
    if (esc === 'estudio' && estEstudiando() && !e.dormido && saltoT < 0 && (tk >> 4) % 7 === 6) oy += 1;
    let gx = 0, esx = 1;
    gx += Math.round(-24 * cortex.p);
    if (acarT > 0 && acar) { gx += Math.max(-3, Math.min(3, Math.round((acar.x - (SX + SW / 2)) / 8))); if ((tk >> 1) % 2) oy -= 0; }
    if (tk < sustoHasta) gx += (tk & 1) ? 2 : -2;
    else if (e.enf && !e.dormido) {
      const shiv = tk % 70;
      if (shiv < 18) {
        gx += (tk & 1) ? 1 : -1;
        if (shiv === 8) {
          lanzar('gota', SX + (Math.random() < 0.5 ? 18 : 38), SY + 18, 0, 0.4, 12);
        }
      }
    }
    if (llegada) { gx -= Math.round((1 - Math.min(1, llegada.t / 16)) * 110); oy -= Math.abs(Math.round(Math.sin(llegada.t * .9) * 4)); }
    if (act && act.tipo === 'ventana') { const p = Math.max(0, Math.min(1, act.t / 10, (act.len - act.t) / 10)); gx = Math.round(-14 * p); if (p > 0 && p < 1 && (tk >> 1) % 2) oy -= 2; }
    if (gT >= 0) {
      if (gTipo === 'baile') { gx += Math.round(Math.sin(gT * .9) * 4); oy -= Math.abs(Math.round(Math.sin(gT * .9) * 3)); }
      else if (gTipo === 'robot') { gx += (((gT / 3) | 0) % 2 ? 5 : -5); oy -= gT % 6 < 2 ? 2 : 0; }
      else if (gTipo === 'twist') { esx = Math.cos(gT * 1.1); if (Math.abs(esx) < .12) esx = .12; oy -= Math.abs(Math.round(Math.sin(gT * .8) * 3)); }
      else { esx = Math.cos(gT / GLEN.giro * Math.PI * 2); if (Math.abs(esx) < .12) esx = .12; }
    }
    const simVis = !(e.dormido && esc !== 'sala');
    if (simVis) ojoAtras();
    // sombra en el piso (se achica cuando salta o está en el aire; fija en reposo)
    const aireY = Math.min(0, oy);
    const rx = Math.max(12, 24 + Math.round(aireY / 2));
    ctx.fillStyle = 'rgba(30,12,40,.34)';
    if (simVis && esc !== 'estudio') for (let y = -3; y <= 3; y++) { const w = Math.round(rx * Math.sqrt(1 - (y / 3.6) * (y / 3.6))); ctx.fillRect(SX + 28 + gx - w, SY + SH - 2 + y, w * 2, 1); }
    const est = estFisico();
    const auraFr = e.ropa.aura ? tk % 40 : 0;
    const nSim = (ban && !ban.pov && ban.i >= 3) ? 0 : n;   // dentro de la ducha Simon se ve con luz propia aunque sea de noche
    const spr = (esc === 'estudio' || esc === 'jardin') ? sprite('simon_atras|' + ropaSig() + '|af' + auraFr, () => simonGrid('c', 'n', e.ropa, {}, true, auraFr), nSim ? .22 : 0) : sprite('simon_' + ojos + boca + '|' + ropaSig() + '|' + est.oj + est.fl + est.tri + est.en + est.l + est.ab + '|af' + auraFr, () => simonGrid(ojos, boca, e.ropa, est, false, auraFr), nSim ? .22 : 0);
    const auraLSpr = (e.ropa.aura === 'aura_legend' && simVis && esc !== 'estudio') ? sprite('aura_legend|af' + auraFr, () => auraLegendGrid(auraFr), nSim ? .22 : 0) : null;
    if (!simVis) { /* Simon duerme en la recámara */ }
    else if (esc === 'estudio') { ctx.save(); ctx.translate(SX + 28 + gx, SY + 32 + oy); ctx.scale(EST_K * esx, EST_K); ctx.drawImage(spr, -28, -32); ctx.restore(); }
    else if (esc === 'calle') { if (auraLSpr) ctx.drawImage(auraLSpr, SX + gx - AURA_OX, SY + 6 + oy - AURA_OY); ctx.drawImage(spr, 0, 0, SW, 66, SX + gx, SY + 6 + oy, SW, 66); ctx.drawImage(spr, 0, 66, SW, SH - 66, SX + gx, SY + 72 + oy, SW, SH - 66); }
    else if (esx !== 1) { ctx.save(); ctx.translate(SX + 28 + gx, 0); ctx.scale(esx, 1); if (auraLSpr) ctx.drawImage(auraLSpr, -28 - AURA_OX, SY + oy - AURA_OY); ctx.drawImage(spr, -28, SY + oy); ctx.restore(); }
    else { if (auraLSpr) ctx.drawImage(auraLSpr, SX + gx - AURA_OX, SY + oy - AURA_OY); ctx.drawImage(spr, SX + gx, SY + oy); }
    if (simVis && esc === 'estudio') estudioFrente(n, oy, gx, esx);
    dibujarMuebles(n, 'frente');
    if (simVis) dibujarExtras(oy, gx);
    if (cortex.p > 0) {
      const cx = cxb() + Math.round((1 - cortex.p) * 76) + (bm && bm.fase === 'vuelo' && bm.t > VUELO - 6 ? ((tk & 1) ? 1 : -1) : 0), cy = SY + SH - 76 + ((tk >> 3) % 2);
      ctx.fillStyle = 'rgba(30,12,40,.34)';
      for (let y = -3; y <= 3; y++) { const w = Math.round(17 * Math.sqrt(1 - (y / 3.6) * (y / 3.6))); ctx.fillRect(cx + 30 - w, SY + SH - 2 + y, w * 2, 1); }
      const csp = sprite(cortexClave(), () => cortexG(), n ? .22 : 0);
      if (desc && !bm && !dlg && !mercPres && cortex.p >= 1 && !cortex.dir) { ctx.drawImage(csp, 0, 0, csp.width, 64, cx, cy + 6, csp.width, 64); ctx.drawImage(csp, 0, 70, csp.width, csp.height - 70, cx, cy + 70, csp.width, csp.height - 70); }   // sentado descansando
      else ctx.drawImage(csp, cx, cy);
      if (mercPres && !dlg && cortex.p >= 1) ctx.drawImage(sprite('fx_moneda', FX.moneda, 0), cx + 27, cy - 9 + ((tk >> 2) % 2) * 2);
      dibujarBomba(cx, cy);
    }
    ovFrente(); if (simVis) ojoFrente(); azulFrente(); truenoFrente(); banDibujar();
    sifDibuja(esc, n);
    if ((jugFis.activo || jugFis.arr) && ((esc === 'sala' && !lugar) || lugar === 'parque')) {
      const jk = juguetePuesto();
      jugFis.k = jk;
      const spj = sprite('tj_' + jk, () => ITEMS[jk].grid(), 0);
      const rad = Math.max(5, Math.round(Math.min(spj.width, spj.height) / 2));
      jugFis.rad = rad;
      ctx.fillStyle = 'rgba(30,12,40,.28)';
      const sw = Math.round(rad * 1.5);
      const floorY = Math.min(LH - 4, (typeof PISO !== 'undefined' && PISO < 9000) ? PISO : (LH - 4));
      const distSombra = Math.max(0, floorY - (jugFis.y + rad));
      const factorSombra = Math.max(0.3, 1 - distSombra / 70);
      ctx.fillRect(Math.round(jugFis.x - (sw * factorSombra) / 2), floorY, Math.round(sw * factorSombra), 1);
      ctx.drawImage(spj, Math.round(jugFis.x - spj.width / 2), Math.round(jugFis.y - spj.height / 2));
    }
    if (guia && guia.paso === 'jugar' && esc === 'sala' && !dlg && !modal) {
      dibujarGuiaJuguete();
    }
    if (esc === 'parque' || esc === 'jardin') parqueFX(clima());
    if (typeof alvDibujar === 'function') alvDibujar();   // (se llaman siempre: al salir del parque limpian lo suyo)
    if (typeof chicaDibujar === 'function') chicaDibujar();
    if (esc === 'jardin') reganderaDibujar();
    if (esc === 'calle') calleLluvia();
    if (esc === 'estudio') estudioViñeta();
    cajaDibuja();
    fx.forEach(f => {
      const ox = f.tipo === 'corazon' && (f.t >> 1) % 2 ? 1 : 0;
      ctx.drawImage(sprite('fx_' + f.tipo, FX[f.tipo], 0), Math.round(f.x) + ox, Math.round(f.y));
    });
    azulLuz(); truenoLuz();
  }
  let proxEstornudoT = Date.now() + ((typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.resfriado && CONFIG_EASTEREGGS.resfriado.intervaloEstornudoMs) || 60000);
  function enfTick() {
    if (!e || !e.enf) return;
    if (e.dormido || dlg || modal || introActiva || escenaId() === 'calle') return;
    const msEst = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.resfriado && CONFIG_EASTEREGGS.resfriado.intervaloEstornudoMs) || 60000;
    if (Date.now() >= proxEstornudoT) {
      proxEstornudoT = Date.now() + msEst;
      sustoHasta = tk + 5;
      bocaT = 12;
      decir('¡Achú!', e.traductor ? (Math.random() < 0.5 ? '¡Achú! Qué frío...' : '¡Achú! Mi nariz...') : null, 2400);
      for (let i = 0; i < 5; i++) {
        const vx = (Math.random() - 0.5) * 2.2;
        const vy = -1.2 - Math.random() * 1.5;
        lanzar('gota', SX + 28, SY + 36, vx, vy, 12 + Math.floor(Math.random() * 8));
      }
    }
  }
  function tick() {
    tk++;
    ovTick(); blTick(); azulTick(); truenoTick(); banTick(); sifTick(); enfTick();
    if (tk % 4 === 0) dibujarLlama();
    if (tk % 10 === 0) { guiaTick(); actualizarTareas(); mercTick(); bombaTick(); if (modal === 'misiones' && misEspera() > 0) render(); }
    if (cortex.dir) {
      cortex.p = Math.max(0, Math.min(1, cortex.p + cortex.dir * (cortex.v || .1)));
      if (cortex.dir > 0 && tk % 2 === 0 && !cortex.suave) lanzar('estrella', LW - 58 + Math.random() * 54, SY + 6 + Math.random() * 56, 0, -.5, 7);
      if ((cortex.dir > 0 && cortex.p >= 1) || (cortex.dir < 0 && cortex.p <= 0)) { cortex.dir = 0; const f = cortex.cb; cortex.cb = null; if (f) f(); }
    }
    if (dlg) {
      const L = dlg.l[dlg.i];
      if (dlg.pos < L.t.length) {
        dlg.pos = Math.min(L.t.length, dlg.pos + 3); $('dlg-t').textContent = L.t.slice(0, dlg.pos); if (dlg.pos >= L.t.length && L.op) dlgOps(L);
        if (tk % 2 === 0) sfx.blip(L.q === 'CORTEX' ? 620 : L.q === 'SIMON' ? 880 : 1040);
      }
    }
    if (act) {
      act.t++;
      if (act.t >= act.len) act = null;
      else if (act.tipo === 'bailar') { if (act.t % 12 === 1) { gesto('baile'); estrellas(1); } bocaT = Math.max(bocaT, 3); }
      else if (act.tipo === 'pelota' && act.t % 14 === 1) saltoT = 0;
    } else if (tk >= proxAct && !modal && !dlg && !cortex.p && !introActiva && !e.dormido && saltoT < 0 && gT < 0 && bocaT === 0) iniciarAct();
    if (saltoT >= 0 && ++saltoT >= SALTO.length) saltoT = -1;
    if (gT >= 0 && ++gT >= GLEN[gTipo]) { gT = -1; gTipo = ''; }
    if (bocaT > 0) bocaT--; if (acarT > 0) acarT--;
    if (parpadeoT > 0) parpadeoT--; else if (!e.dormido && Math.random() < .03) parpadeoT = 2;
    if (e.dormido && escenaId() === 'sala' && tk % 14 === 0) lanzar('z', SX + 46, SY + 14, .7, -1.2, 18);
    if (tk % 26 === 0) {   // brillitos flotando alrededor de las macetas alienígenas ya colocadas (mientras vivan), del color de su especie
      const esc0 = escenaId();
      e.deco.forEach(d => { const it = ITEMS[d.k]; if (!it || !it.semilla || (d.h || 'sala') !== esc0 || !macetaViva(d.k)) return;
        const r = posReal(d); lanzar(it.semilla === 'raiz' ? 'cristal' : 'espora', r.cx + (Math.random() - .5) * (r.w * .7), r.y + r.h * .3 + Math.random() * 4, (Math.random() - .5) * .3, -.5 - Math.random() * .3, 22 + Math.random() * 10);
      });
    }
    for (let i = fx.length - 1; i >= 0; i--) {
      const f = fx[i];
      f.t++; f.x += f.vx; f.y += f.vy; if (f.g) f.vy += f.g;
      if (f.t >= f.vida) fx.splice(i, 1);
    }
    if (llegada && ++llegada.t >= 18) { llegada = null; decir('Sí.', e.traductor ? '¡Qué lindo parque!' : null, 3000); hablar(); gesto('salto'); corazones(2); }
    bombaAvanza();
    jugFisTick();
    dibujar();
  }
  function disponer() {
    SX = Math.floor((LW - SW) / 2);                 // Simon centrado a lo ancho
    SYn = Math.round((LH - SH) / 2) + 4; SY = SYn;   // ...y a lo alto
    RY = Math.max(94, Math.round(LH * .55)) - 35;   // la pared ocupa un poco más de la mitad
    OX = Math.round((LW - 120) / 2);                // la decoración queda centrada
  }
  function ajustaSY() { const esc0 = escenaId(); SY = esc0 === 'estudio' ? Math.round(LH * .58) - 32 : esc0 === 'jardin' ? RY + 39 : SYn; }
  function calcPiso() {
    const dk = document.querySelector('.botones'), r = cv.getBoundingClientRect();
    if (!dk || !r.height) return;
    const y = (dk.getBoundingClientRect().top - r.top) / r.height * LH;
    PISO = Math.max(RY + 34, Math.floor(y - 2));
  }
  function ajustar() {
    const esc = $('escena');
    const cw = esc.clientWidth, ch = esc.clientHeight;
    if (!cw || !ch) return;
    const dpr = window.devicePixelRatio || 1;
    const ideal = Math.min(cw / 120, ch / 184);
    let k = Math.floor(ideal * dpr) / dpr;      // escala que cae exacta en pixeles del dispositivo
    if (k < 1) k = Math.max(.5, ideal);
    const W = Math.ceil(cw / k), H = Math.max(184, Math.ceil(ch / k));
    if (W !== LW || H !== LH) { LW = W; LH = H; cv.width = W; cv.height = H; ctx.imageSmoothingEnabled = false; disponer(); }
    const dispW = Math.round(W * k);
    const dispH = Math.round(H * k);
    cv.style.width = dispW + 'px';
    cv.style.height = dispH + 'px';
    calcPiso();
    dibujar();
  }
  function dibujarLogo() {
    const l = $('logo'), c = l.getContext('2d');
    c.clearRect(0, 0, 22, 12);
    c.drawImage(sprite('logo', coronaGrid, 0), 0, 0);
  }

