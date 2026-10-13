  /* ===== MINI-EVENTO DE LA PRIMERA SESIÓN: la caja misteriosa de Cortex ===== */
  var cajaA = null;
  function cajaIni(f, extra) { cajaA = Object.assign({ f, t0: Date.now() }, extra || {}); }
  function cajaDibuja() {
    const a = cajaA; if (!a) return;
    const t = (Date.now() - a.t0) / 1000, bx = cxb() + 4, base = SY + SH - 4;
    let dx = 0, dy = 0, lid = 0;
    if (a.f === 'trae') dy = t < .5 ? -Math.round(Math.pow(1 - t / .5, 2) * 34) : (t < .8 ? -Math.round(Math.sin((t - .5) / .3 * Math.PI) * 3) : 0);
    else if (t < 1) { const w = Math.sin(t * 38); dx = Math.round(w * (1 + t * 2)); dy = t > .5 && w > 0 ? -1 : 0; }
    else lid = Math.min(16, Math.round((t - 1) * 70));
    ctx.fillStyle = 'rgba(30,12,40,.34)';
    for (let y = -2; y <= 2; y++) { const w = Math.round(10 * Math.sqrt(1 - (y / 2.6) * (y / 2.6))); ctx.fillRect(bx - w, base + y, w * 2, 1); }
    const x = bx + dx - 9, y = base + dy;
    ctx.fillStyle = '#2a0a5a'; ctx.fillRect(x, y - 14, 18, 14);
    ctx.fillStyle = '#7a3ad0'; ctx.fillRect(x + 1, y - 13, 16, 12); ctx.fillStyle = '#9a5ae8'; ctx.fillRect(x + 1, y - 13, 3, 12); ctx.fillStyle = '#5a28a0'; ctx.fillRect(x + 14, y - 13, 3, 12);
    ctx.fillStyle = '#ffd84a'; ctx.fillRect(x + 8, y - 13, 2, 12);
    if (lid > 0) { ctx.fillStyle = '#12062a'; ctx.fillRect(x + 1, y - 14, 16, 2); }
    const ly = y - 18 - lid, lx = x - 1 + Math.round(lid / 3);
    ctx.fillStyle = '#2a0a5a'; ctx.fillRect(lx, ly, 20, 5); ctx.fillStyle = '#b070f0'; ctx.fillRect(lx + 1, ly + 1, 18, 3); ctx.fillStyle = '#d8aaff'; ctx.fillRect(lx + 1, ly + 1, 18, 1);
    ctx.fillStyle = '#ffd84a'; ctx.fillRect(lx + 9, ly, 2, 5);
    if (!lid) { ctx.fillRect(lx + 5, ly - 3, 4, 3); ctx.fillRect(lx + 11, ly - 3, 4, 3); ctx.fillRect(lx + 9, ly - 2, 2, 2); }
    if (a.f === 'trae' && t > .6 && ((t * 5) | 0) % 2) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 17, y - 22, 1, 3); ctx.fillRect(x + 16, y - 21, 3, 1); }
    if (a.f === 'abre' && t >= 1) {
      const u = t - 1, cy = y - 14;
      if (u < 1.1) { const f = u < .6 ? 1 : 1 - (u - .6) / .5; for (let k = 0; k < 9; k++) { const ang = -Math.PI * (.05 + k * .112), len = Math.min(34, u * 70) * f; ctx.fillStyle = k % 2 ? '#ffffff' : '#ffe45a'; for (let r = 6; r < len; r += 2) ctx.fillRect(Math.round(bx + Math.cos(ang) * r), Math.round(cy + Math.sin(ang) * r * .8), 2, 1); } }
      if (u < .18) { ctx.fillStyle = 'rgba(255,255,255,' + (.5 * (1 - u / .18)).toFixed(2) + ')'; ctx.fillRect(0, 0, LW, LH); }
      if (u > .25) {
        const p = Math.min(1, (u - .25) / .7), ry = y - 16 - Math.round(p * 11) + (p >= 1 ? Math.round(Math.sin(t * 5) * 1) : 0);
        const cmx = a.gafas ? bx - 9 : bx - 3;
        ctx.drawImage(sprite('fx_moneda', FX.moneda, 0), cmx, ry);
        if (a.gafas) { const gx0 = bx + 1, gy = ry + 1; ctx.fillStyle = '#ffe45a'; ctx.fillRect(gx0 - 1, gy - 1, 12, 5); ctx.fillStyle = '#0a0a18'; ctx.fillRect(gx0, gy, 4, 3); ctx.fillRect(gx0 + 6, gy, 4, 3); ctx.fillRect(gx0 + 4, gy, 2, 1); ctx.fillStyle = '#8a8ae0'; ctx.fillRect(gx0, gy, 1, 1); ctx.fillRect(gx0 + 6, gy, 1, 1); }
        if (p >= 1 && (tk >> 2) % 2) { ctx.fillStyle = '#ffffff'; ctx.fillRect(bx, ry - 5, 1, 3); ctx.fillRect(bx - 1, ry - 4, 3, 1); }
      }
    }
  }
  function cajaFin() { cajaA = null; e.caja = 1; guardar(); cortexSale(() => { pintar(); setTimeout(saludar, 600); if (celQ.length) celebraCheck(); }); }
  function iniciarCaja() {
    e.caja = 1; act = null; guardar(); if (modal) cerrar();
    const trae = !e.tiene.gafas;
    cortexEntra(() => dialogo([
      { q: 'CORTEX', t: '¡Simon! Mira lo que encontré donde te encontré a ti.', pre: () => { cajaIni('trae'); sfx.click(); } },
      S(), T('¿Una caja? ¿Para mí?'),
      C('Es tuya. Ábrela.'),
      { q: 'CORTEX', t: '*Simon sacude la caja, la abre...*', fn: () => { cajaIni('abre', { gafas: trae }); gesto('salto'); setTimeout(() => { sfx.regalo(); estrellas(14); corazones(4); }, 1000); } },
      { q: 'CORTEX', t: trae ? '¡Gafas de sol y 25 monedas!' : '¡25 monedas!', fn: () => { if (trae) { e.tiene.gafas = 1; toast('¡Conseguiste las GAFAS DE SOL!'); } ganar(25, 12, true); } },
      S(), T('¡Me encanta! No explotó... todavía.'),
      C('Jaja. Nos vemos pronto.')
    ], cajaFin));
  }
  function checkCaja() {
    if (e.caja || !e.cajaT || escenaId() !== 'sala' || !libreParaTutorial() || ahora() < e.cajaT) return;
    iniciarCaja();
  }

  function checkTutorial() {
    if (e.tutUI || !libreParaTutorial()) return;
    if (!e.tutT) { e.tutT = ahora() + 8000; return; }
    if (ahora() < e.tutT) return;
    e.tutUI = 1; guardar(); iniciarTutorial();
  }

