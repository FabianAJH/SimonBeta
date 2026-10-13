  /* ===================== PELUCHE DE CORTEX (10 TOQUES) → CUADRO DE CORTEX BEBÉ ===================== */
  // Tocar 10 veces seguidas al mini Cortex de peluche regala el retrato de Cortex bebé.
  let pelT = 0, pelN = 0, pelHop = 0;
  function chirrido(a, b, dur, vol) {   // chillido de juguete: sube rápido y baja
    if (e.mudo || !audio()) return;
    const t = ac.currentTime + .01, o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(a, t); o.frequency.exponentialRampToValueAtTime(b, t + dur * .55); o.frequency.exponentialRampToValueAtTime(a * 1.15, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.linearRampToValueAtTime(.001, t + dur); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + .02);
  }
  function pelucheTap() {
    const cfg = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.pelucheCortex) || {};
    const ventanaMs = cfg.maxIntervaloMs !== undefined ? cfg.maxIntervaloMs : 1600;
    const reqToques = cfg.toquesRequeridos !== undefined ? cfg.toquesRequeridos : 10;
    const ahoraT = Date.now(); pelN = ahoraT - pelT < ventanaMs ? pelN + 1 : 1; pelT = ahoraT;
    pelHop = 10; chirrido(520 + pelN * 45, 1500 + pelN * 70, .14, .09); setTimeout(() => chirrido(900 + pelN * 40, 620 + pelN * 30, .09, .06), 110);
    if (pelN % 3 === 0) lanzar('corazon', SX + 20, SY + 10, 0, -2, 10);
    if (pelN >= reqToques) {
      pelN = 0;
      cuadroBebePremio();
    }
  }
  function cuadroBebePremio() {   // 10 toques seguidos al peluche: el peluche guardaba un secreto
      if (!e.tiene.marco_cortex_bebe) { e.tiene.marco_cortex_bebe = 1; guardar(); estrellas(8); setTimeout(() => fanfare({ g: () => ITEMS.marco_cortex_bebe.grid(), t: 'RETRATO DE CORTEX BEBÉ', d: '¡EL PELUCHE GUARDABA UN SECRETO!' }), 600); }
  }
  function pelucheTick() { if (pelHop > 0) pelHop--; }
