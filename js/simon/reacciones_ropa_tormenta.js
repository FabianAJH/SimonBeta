  /* ===================== REACCIONES DE SIMON: ropa y tormenta ===================== */
  // (ROPA_COM definido en dialogos.js)
  let ropaPend = null, ropaProx = Date.now() + 8 * 60000;
  function comentaRopa(k) { const t = ROPA_COM[k]; if (!t) return; decir('Sí.', e.traductor ? t : null, 3600); hablar(); gesto('salto'); corazones(1); }
  function checkRopa() {
    if (ropaPend) {
      if (!eventoLibre(EV_RPND)) return;
      const k = ropaPend; ropaPend = null; comentaRopa(k); ropaProx = Date.now() + (10 + Math.random() * 10) * 60000; return;
    }
    if (Date.now() < ropaProx || !eventoLibre(EV_ROPA)) return;
    ropaProx = Date.now() + (12 + Math.random() * 18) * 60000;
    const w = Object.values(e.ropa).filter(k => k && ROPA_COM[k]); if (!w.length) return;
    comentaRopa(w[Math.floor(Math.random() * w.length)]);
  }
  // el trueno suena y asusta a Simon solo de vez en cuando (los relámpagos se ven igual)
  let truenoCd = 0;
  function truenoSusto() {
    if (Date.now() < truenoCd || document.hidden) return;
    truenoCd = Date.now() + (150 + Math.random() * 150) * 1000;
    if (!e.mudo) sfx.trueno();
    simonAsusta();
  }
  // (MIEDO definido en dialogos.js)
  function simonAsusta() {
    if (e.dormido || introActiva || Date.now() < sustoCd) return;
    sustoCd = Date.now() + 120000; sustoHasta = tk + 7; dx('susto');
    if (modal || dlg || mj) return;
    gesto('salto'); hablar(); decir('Sí.', e.traductor ? MIEDO[Math.floor(Math.random() * MIEDO.length)] : null, 3000);
  }
  function dx() {}
