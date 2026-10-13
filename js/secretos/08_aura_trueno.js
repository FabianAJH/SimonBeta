  /* ===================== EASTER EGG: AURA DE TRUENO (tormenta) ===================== */
  // Durante una tormenta caen rayos tocables en la ventana. Al tocar 3, una centella entra volando,
  // da una vuelta alrededor de Simon y explota en varios rayos: así se desbloquea el AURA DE TRUENO.
  let tr = null, truenoT = 0, boltV = 0, boltX = 0, boltY = 0, centellaXY = null;
  function truenoDisponible() {   // puede aparecer/tocarse un rayo ahora mismo
    return escenaId() === 'sala' && !lugar && !calle && !dlg && !modal && !introActiva && !tr && !ov && !az && !bl && !e.tiene.aura_trueno;
  }
  let truenoInactT = 0;
  function truenoTap() {
    truenoInactT = 0;
    boltV = 0; truenoT++; sfx.click();
    seq([880, 1175, 1480].slice(0, Math.min(3, truenoT)), .06, 'square', .08);
    for (let i = 0; i < 5; i++) lanzar('estrella', boltX, boltY, (Math.random() - .5) * 1.4, -.5, 8 + i);
    const reqTr = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.auraTrueno && CONFIG_EASTEREGGS.auraTrueno.rayosRequeridos) || 3;
    if (truenoT >= reqTr) {
      tr = { f: 'entra', t: 0 }; centellaXY = { x: boltX, y: boltY };
      lugar = null; llegada = null; if (e.hab !== 'sala') { e.hab = 'sala'; pintarNav(); }
      if (e.dormido) { e.dormido = false; sfx.despertar(); }
      act = null; proxAct = tk + 99999;
    }
    guardar();
  }
  function truenoTick() {
    if (!tr) {
      if (truenoT > 0) {
        if (++truenoInactT > 450 || clima() !== 'tormenta') { truenoT = 0; truenoInactT = 0; guardar(); }
      }
      return;
    }
    if (escenaId() !== 'sala') return;   // si se va de la sala, el evento espera
    tr.t++;
    const dy0 = RY - 59, wx = OX + 29, wy = dy0 + 26, Hx = SX + 28, Hy = SY + 26;
    if (tr.f === 'entra') {
      const u = Math.min(1, tr.t / 12), ue = u * u;
      centellaXY = { x: Math.round(wx + (Hx - wx) * ue), y: Math.round(wy + (Hy - wy) * ue) };
      if (tr.t >= 12) { tr.f = 'vuelta'; tr.t = 0; }
    } else if (tr.f === 'vuelta') {
      const dur = 22, ang = (tr.t / dur) * Math.PI * 2 * 1.4;
      centellaXY = { x: Math.round(Hx + Math.cos(ang) * 17), y: Math.round(Hy + Math.sin(ang) * 11) };
      if (tr.t % 3 === 0) lanzar('rayo', centellaXY.x, centellaXY.y, 0, 0, 5);
      if (tr.t >= dur) { tr.f = 'explota'; tr.t = 0; }
    } else if (tr.f === 'explota') {
      if (tr.t === 1) { retumbo(); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; lanzar('rayo', Hx, Hy, Math.cos(a) * (1.4 + Math.random()), Math.sin(a) * (1.4 + Math.random()) - .5, 10 + Math.floor(Math.random() * 6)); } }
      if (tr.t === 2) seq([1760, 2217, 2793, 3520], .06, 'square', .08);
      if (tr.t >= 16) truenoDesbloquear();
    }
  }
  function truenoFrente() {   // la centella dando vueltas alrededor de Simon, ya dentro del cuarto
    if (!tr || tr.f !== 'vuelta' || !centellaXY) return;
    ctx.drawImage(sprite('fx_rayo', FX.rayo, 0), Math.round(centellaXY.x) - 2, Math.round(centellaXY.y) - 4);
  }
  function truenoLuz() {   // destello blanco de la explosión
    if (escenaId() !== 'sala' || !tr || tr.f !== 'explota') return;
    const u = tr.t <= 3 ? tr.t / 3 : Math.max(0, 1 - (tr.t - 3) / 10);
    if (u > 0) { ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, u).toFixed(2) + ')'; ctx.fillRect(0, 0, LW, LH); }
  }
  function truenoDesbloquear() {
    tr = null; centellaXY = null; truenoT = 0; boltV = 0;
    e.tiene.aura_trueno = 1; e.ropa.aura = 'aura_trueno'; e.truenoHecho = hoy(); guardar();
    sonidoUnico(); corazones(6); estrellas(10);
    setTimeout(() => fanfare({ g: () => prevGrid('aura_trueno'), t: 'AURA DE TRUENO', d: 'LA CENTELLA ENTRÓ POR LA VENTANA EN MEDIO DE LA TORMENTA', mudo: true }), 500);
  }
