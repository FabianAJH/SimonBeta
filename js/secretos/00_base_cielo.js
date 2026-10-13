  /* ===================== BASE COMPARTIDA DE LOS SECRETOS DEL CIELO ===================== */
  // Lo que usan varios secretos a la vez: hora/noche, sonidos y las lunas vistas desde otras ventanas.
  // Se carga ANTES que los demás archivos de secretos/.
  let admHora = null;   // hora falsa del panel de administrador (null = hora real)
  const horaR = () => admHora != null ? admHora : new Date(ahora()).getHours();
  const esNoche = () => { const h = horaR(); return h >= 19 || h < 6; };      // ciclo día/noche con la hora real
  const ventNoche = () => escenaId() === 'sala' && (!!ov || (esNoche() && clima() === 'sol'));   // la ventana muestra la luna
  function ojoSnd() {   // el sonido propio del ojo: un "blup" húmedo y un "wuuu" tembloroso
    if (e.mudo || !audio()) return;
    const t = ac.currentTime + .02;
    const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(820, t + .09);
    g.gain.setValueAtTime(.001, t); g.gain.linearRampToValueAtTime(.07, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + .14); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + .16);
    const o2 = ac.createOscillator(), g2 = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain(); o2.type = 'triangle'; o2.frequency.setValueAtTime(540, t + .16); o2.frequency.exponentialRampToValueAtTime(250, t + .55);
    l.frequency.value = 16; lg.gain.value = 40; l.connect(lg); lg.connect(o2.frequency);
    g2.gain.setValueAtTime(.001, t + .16); g2.gain.linearRampToValueAtTime(.05, t + .22); g2.gain.exponentialRampToValueAtTime(.001, t + .6); o2.connect(g2); g2.connect(ac.destination); o2.start(t + .16); l.start(t + .16); o2.stop(t + .62); l.stop(t + .62);
  }
  function retumbo() {
    if (e.mudo || !audio()) return; const t = ac.currentTime + .02, o = ac.createOscillator(), g = ac.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(80, t); o.frequency.exponentialRampToValueAtTime(38, t + 1.2);
    g.gain.setValueAtTime(.001, t); g.gain.linearRampToValueAtTime(.09, t + .2); g.gain.exponentialRampToValueAtTime(.001, t + 1.3); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 1.35);
  }
  function sonidoUnico() {   // el sonido de haber conseguido algo único: estruendo grave, arpegio brillante, el "wuuu" del ojo y un acorde final
    if (e.mudo || !audio()) return;
    retumbo(); seq([523, 659, 784, 1047, 1319, 1568, 2093], .085, 'triangle', .07, .25);
    setTimeout(ojoSnd, 950); seq([1047, 1319, 1568, 2093], .5, 'sine', .05, 1.35); seq([262, 392], .9, 'sawtooth', .025, 1.35); seq([2093, 2637, 3136, 4186], .07, 'square', .02, 1.9);
  }
  function lunasSolo(dy) {   // otras ventanas: la luna dorada, roja o azul solo se ve, no se puede tocar
    if (lunaOroT()) { const f = (tk >> 3) % 2; ctx.drawImage(sprite('luna_oro' + f, () => lunaOroGrid(f), 0), OX, dy); }
    else if (lunaSangreT()) { ctx.fillStyle = 'rgba(110,0,24,.30)'; ctx.fillRect(OX, dy, 60, 64); const f = (tk >> 3) % 2; ctx.drawImage(sprite('luna_sg' + f, () => sangreGrid(f), 0), OX, dy); }
    else if (lunaAzulT() && !az) { const f = (tk >> 3) % 2; ctx.drawImage(sprite('luna_az' + f, () => lunaAzulGrid(f), 0), OX, dy); }
  }
