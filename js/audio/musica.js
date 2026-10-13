  /* ===================== MÚSICA Y CÁMARA ===================== */
  const MUS_ACORDES = [
    [48, [76, 0, 79, 0, 76, 74, 72, 0]], [45, [72, 0, 76, 0, 81, 0, 79, 76]], [41, [77, 0, 81, 0, 77, 76, 74, 0]], [43, [74, 0, 79, 0, 83, 0, 79, 74]],
    [45, [81, 0, 79, 76, 72, 0, 76, 0]], [41, [77, 0, 74, 77, 81, 0, 77, 0]], [48, [79, 0, 76, 72, 76, 0, 79, 0]], [43, [83, 0, 79, 74, 79, 0, 74, 0]]
  ];
  let mus = null;
  var hz = typeof hz !== 'undefined' ? hz : (n => 440 * Math.pow(2, (n - 69) / 12));
  function notaM(f, dur, t, tipo, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(vol, t); g.gain.setValueAtTime(vol, t + dur * .5); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(mus.g); o.start(t); o.stop(t + dur + .02);
  }
  const TEMAS_MUS = {
    lofi: { lofi: true, ac: MUS_ACORDES, paso: .36, lead: 'sine', vl: .03 },
    dia: { ac: MUS_ACORDES, paso: .27, lead: 'square', vl: .018 },
    parque: { ac: MUS_ACORDES, paso: .21, lead: 'square', vl: .02 },
    noche: { ac: [[48, [72, 0, 0, 0, 76, 0, 0, 0]], [45, [69, 0, 0, 0, 72, 0, 0, 0]], [41, [65, 0, 0, 0, 69, 0, 72, 0]], [43, [67, 0, 0, 0, 71, 0, 74, 0]]], paso: .4, lead: 'triangle', vl: .05 },
    bano: { ac: [[48, [88, 0, 0, 86, 0, 84, 0, 79]], [45, [85, 0, 0, 88, 0, 91, 0, 0]], [50, [86, 0, 0, 84, 0, 81, 0, 77]], [43, [83, 0, 0, 86, 0, 89, 0, 86]], [48, [84, 0, 0, 88, 0, 91, 0, 88]], [45, [88, 0, 85, 0, 81, 0, 85, 0]], [50, [89, 0, 0, 86, 0, 84, 0, 81]], [43, [83, 0, 86, 0, 83, 0, 0, 0]]], paso: .2, lead: 'triangle', vl: .05 },
    cocina: { ac: [[43, [79, 81, 83, 0, 79, 0, 76, 0]], [48, [76, 0, 79, 0, 84, 0, 79, 0]], [50, [78, 0, 81, 78, 86, 0, 81, 0]], [43, [83, 0, 79, 83, 86, 0, 83, 0]]], paso: .2, lead: 'square', vl: .016 },
    chef: { ac: [[48, [79, 0, 76, 79, 84, 0, 79, 76]], [41, [81, 0, 77, 81, 84, 0, 81, 77]], [43, [83, 0, 79, 83, 86, 0, 83, 79]], [48, [84, 0, 79, 76, 72, 0, 76, 79]], [45, [81, 0, 76, 81, 84, 0, 81, 76]], [50, [77, 0, 74, 77, 81, 0, 77, 74]], [43, [79, 0, 83, 86, 83, 0, 79, 74]], [48, [72, 0, 76, 79, 84, 0, 0, 0]]], paso: .15, lead: 'sawtooth', vl: .013 },
    sif: { ac: [[48, [76, 0, 79, 76, 84, 0, 79, 0]], [43, [79, 0, 83, 79, 86, 0, 83, 0]], [45, [81, 0, 84, 81, 88, 0, 84, 0]], [41, [77, 79, 81, 0, 84, 0, 81, 77]], [48, [84, 0, 79, 84, 88, 0, 84, 0]], [43, [83, 86, 0, 83, 91, 0, 86, 0]], [41, [84, 0, 81, 84, 89, 0, 84, 81]], [43, [79, 83, 86, 0, 91, 0, 0, 0]]], paso: .16, lead: 'square', vl: .022 },
    estudio: { lofi: true, ac: MUS_ACORDES, paso: .46, lead: 'sine', vl: .02 },
    juegos: { arcade: true, ac: [[45, [88, 0, 84, 0, 81, 0, 84, 88]], [41, [84, 0, 81, 0, 77, 0, 81, 84]], [48, [91, 0, 88, 0, 84, 0, 88, 91]], [43, [86, 0, 83, 0, 79, 0, 83, 86]]], paso: .13, lead: 'square', vl: .02 },
    entrada: { ac: [[45, [81, 0, 84, 81, 88, 0, 84, 0]], [41, [77, 0, 81, 77, 84, 0, 81, 0]], [48, [79, 0, 84, 79, 88, 0, 84, 79]], [43, [83, 0, 79, 74, 79, 0, 74, 0]]], paso: .24, lead: 'sawtooth', vl: .01 },
    dormir: { ac: [[48, [76, 0, 79, 0, 81, 0, 79, 0]], [41, [77, 0, 81, 0, 84, 0, 81, 0]], [43, [79, 0, 83, 0, 86, 0, 83, 0]], [48, [84, 0, 81, 0, 79, 0, 76, 0]], [45, [81, 0, 84, 0, 81, 0, 79, 0]], [41, [77, 0, 0, 0, 81, 0, 77, 0]], [43, [79, 0, 77, 0, 76, 0, 74, 0]], [48, [72, 0, 0, 0, 0, 0, 0, 0]]], paso: .5, lead: 'sine', vl: .07 },
    calle: { ac: [[45, [76, 0, 74, 0, 72, 0, 69, 0]], [41, [77, 0, 76, 0, 72, 0, 69, 0]], [48, [76, 0, 72, 0, 67, 0, 64, 0]], [40, [71, 0, 68, 0, 64, 0, 0, 0]]], paso: .52, lead: 'triangle', vl: .055 },
    feliz: { ac: [[48, [72, 76, 79, 76, 84, 79, 76, 72]], [43, [71, 74, 79, 74, 83, 79, 74, 71]], [45, [69, 72, 76, 72, 81, 76, 72, 69]], [41, [77, 81, 84, 81, 77, 72, 77, 81]]], paso: .17, lead: 'square', vl: .022 },
    luna: { ac: [[48, [84, 0, 0, 88, 0, 0, 91, 0]], [45, [88, 0, 0, 91, 0, 0, 95, 0]], [41, [84, 0, 0, 89, 0, 0, 93, 0]], [43, [86, 0, 0, 91, 0, 0, 94, 0]]], paso: .42, lead: 'sine', vl: .045 },
    sangre: { ac: [[40, [64, 0, 0, 0, 67, 0, 0, 0]], [41, [65, 0, 0, 0, 68, 0, 0, 0]], [38, [62, 0, 0, 0, 65, 0, 0, 59]], [40, [64, 0, 0, 0, 63, 0, 0, 0]]], paso: .55, lead: 'triangle', vl: .05 },
    alien: { ac: [[46, [82, 0, 84, 0, 86, 0, 88, 0]], [46, [88, 0, 86, 84, 0, 82, 0, 0]], [47, [83, 0, 85, 0, 87, 0, 89, 0]], [47, [89, 0, 87, 0, 85, 83, 0, 0]]], paso: .2, lead: 'sawtooth', vl: .014 },
    tormenta: { ac: [[45, [69, 0, 0, 72, 0, 0, 76, 0]], [41, [65, 0, 0, 69, 0, 0, 72, 0]], [43, [67, 0, 0, 71, 0, 0, 74, 0]], [40, [64, 0, 0, 67, 0, 0, 71, 0]]], paso: .46, lead: 'triangle', vl: .05 },
    // --- 3 canciones nuevas, solo para minijuegos (atrapa_keke/corre_simon/memoria), elegidas al azar al entrar; pensadas para sonar bien distintas entre sí y del resto del juego ---
    mj_turbo: { arcade: true, ac: [[40, [64, 71, 67, 71, 76, 71, 67, 64]], [48, [72, 79, 76, 79, 84, 79, 76, 72]], [43, [67, 74, 71, 74, 79, 74, 71, 67]], [50, [74, 81, 78, 81, 86, 81, 78, 74]]], terceras: [3, 4, 4, 4], paso: .1, lead: 'square', vl: .018 },
    mj_synth: { arcade: true, ac: [[43, [67, 0, 0, 74, 79, 0, 74, 0]], [40, [64, 0, 0, 71, 76, 0, 71, 0]], [48, [72, 0, 0, 79, 84, 0, 79, 0]], [50, [74, 0, 0, 81, 86, 0, 81, 0]]], terceras: [4, 3, 4, 4], paso: .17, lead: 'sawtooth', vl: .015 },
    mj_circo: { arcade: true, ac: [[41, [65, 69, 72, 77, 72, 69, 65, 69]], [38, [62, 65, 69, 74, 69, 65, 62, 65]], [46, [70, 74, 77, 82, 77, 74, 70, 74]], [48, [72, 76, 79, 84, 79, 76, 72, 76]]], terceras: [4, 3, 4, 4], paso: .14, lead: 'triangle', vl: .02 }
  };
  function temaMus() {
    if (typeof mjMusTema !== 'undefined' && mjMusTema) return mjMusTema;   // canción de minijuego asignada al azar (atrapa_keke/corre_simon/memoria); baila con Simon usa su propia música y no pasa por aquí
    if (calle) return 'calle'; if (introActiva) return 'feliz'; if (cg) return 'chef'; if (sifP || sifAm) return 'sif';
    if (bl) return 'sangre';
    if (ov) return ['entra', 'camina', 'casco', 'da', 'premio', 'sale'].includes(ov.f) ? 'alien' : 'luna';
    if (e.dormido) return 'dormir';
    if (e.sangFase === 1 && escenaId() === 'sala') return 'sangre';
    if (lunaDorada()) return 'luna';
    if (escenaId() === 'sala' && !ov && lunaSangreT()) return 'sangre';
    if (clima() === 'tormenta') return 'tormenta';
    const sc = escenaId(); if (sc === 'bano') return 'bano'; if (sc === 'cocina') return 'cocina'; if (sc === 'estudio') return 'estudio'; if (sc === 'juegos') return 'juegos'; if (sc === 'entrada') return 'entrada'; if (sc === 'parque') return 'parque';
    return esNoche() ? 'noche' : 'lofi';
  }
  /* --- lofi: acordes con séptima, piano suave, bajo, bombo flojito, platillo y crujido de vinilo --- */
  const LOFI = [{ r: 48, n: [0, 4, 7, 11] }, { r: 45, n: [0, 3, 7, 10] }, { r: 50, n: [0, 3, 7, 10] }, { r: 43, n: [0, 4, 7, 10] }, { r: 41, n: [0, 4, 7, 11] }, { r: 40, n: [0, 3, 7, 10] }, { r: 50, n: [0, 3, 7, 10] }, { r: 43, n: [0, 4, 7, 10] }];
  let ruidoL = null;
  function notaL(f, dur, t, tipo, vol, atk) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + (atk || .02)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(mus.g); o.start(t); o.stop(t + dur + .05);
  }
  function percL(tipo, t, vol, dur) {
    if (!ruidoL) { ruidoL = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const x = ruidoL.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; }
    const sr = ac.createBufferSource(); sr.buffer = ruidoL; const fl = ac.createBiquadFilter(), g = ac.createGain();
    fl.type = tipo === 'hat' ? 'highpass' : 'bandpass'; fl.frequency.value = tipo === 'hat' ? 7500 : tipo === 'clap' ? 1700 : 4000; fl.Q.value = .7;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    sr.connect(fl); fl.connect(g); g.connect(mus.g); sr.start(t, Math.random() * .5); sr.stop(t + dur + .02);
  }
  function kickL(t, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .12);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .2);
    o.connect(g); g.connect(mus.g); o.start(t); o.stop(t + .25);
  }
  function pasoLofi(p, t0, PS) {
    const i = p % 8, C = LOFI[Math.floor(p / 8) % LOFI.length], t = t0 + (i % 2 ? PS * .2 : 0);   // swing
    if (i === 0) C.n.forEach((n, k) => notaL(hz(C.r + 12 + n), PS * 7, t + k * .012, 'sine', .02, .09));
    if (i === 5) C.n.slice(1).forEach((n, k) => notaL(hz(C.r + 12 + n), PS * 2.5, t + k * .01, 'triangle', .008, .03));
    if (i === 0) notaL(hz(C.r), PS * 3.2, t, 'sine', .1, .02);
    if (i === 5 && (p >> 3) % 2 === 0) notaL(hz(C.r + 7), PS * 2, t, 'sine', .06, .02);
    if ([2, 3, 6, 7].includes(i) && Math.random() < .42) { const n = C.n[Math.floor(Math.random() * 4)] + (Math.random() < .35 ? 12 : 0); notaL(hz(C.r + 24 + n), PS * 2.4, t, 'triangle', .022, .015); }
    if (i === 0 || i === 5) kickL(t, i === 0 ? .2 : .12);
    if (i === 4) percL('clap', t, .05, .14);
    percL('hat', t, (i % 2 ? .012 : .02), .035);
    if (Math.random() < .1) percL('crujido', t + Math.random() * PS, .01, .012);
  }
  function planearMusica() {
    if (!mus) return;
    mus.g.gain.value = e.dormido ? .4 : mus.tn === 'estudio' ? .95 * Math.pow((e.estMus === undefined ? 50 : e.estMus) / 50, 1.4) : .6;
    while (mus.t < ac.currentTime + .5) {
      { const nt = temaMus(); if (nt !== mus.tn) { mus.tn = nt; mus.paso = 0; mus.f.frequency.value = (TEMAS_MUS[nt] || {}).lofi ? 2600 : 18000; } }
      const T = TEMAS_MUS[mus.tn] || TEMAS_MUS.dia, p = mus.paso, ac8 = T.ac[Math.floor(p / 8) % T.ac.length], i = p % 8, t = mus.t, PS = T.paso;
      if (T.lofi) { pasoLofi(p, t, PS); mus.t += PS; mus.paso++; continue; }
      const lead = ac8[1][i], r = ac8[0];
      if (lead) notaM(hz(lead), PS * 1.7, t, T.lead, T.vl);
      const bajo = [r, 0, r + 7, 0, r + 12, 0, r + 7, 0][i];
      if (bajo) notaM(hz(bajo), PS * 1.5, t, 'triangle', .07);
      if (T.arcade) {   // arcade: bajo saltarín, arpegio, bombo, palmada y hi-hat
        if (i % 2) notaM(hz(r + 12), PS * .7, t, 'square', .012);
        const tercera = T.terceras ? T.terceras[Math.floor(p / 8) % T.terceras.length] : (ac8[0] === 45 ? 3 : 4);   // T.terceras: tercera correcta (mayor o menor) por acorde, para que el arpegio no desafine; si no se define, se mantiene el comportamiento de siempre
        if (i % 2) notaM(hz(r + 24 + [0, tercera, 7, 12][(i >> 1) % 4]), PS * .6, t, 'square', .009);
        if (i === 0 || i === 4 || (i === 6 && (p >> 3) % 2)) kickL(t, .09);
        if (i === 2 || i === 6) percL('clap', t, .05, .08);
        percL('hat', t, i % 2 ? .014 : .024, .035);
      }
      if (mus.tn === 'dormir' && i === 0) notaM(hz(r + 36), PS * 3, t, 'sine', .012);   // campanita suave
      if (mus.tn !== 'luna' && mus.tn !== 'sangre' && mus.tn !== 'alien' && mus.tn !== 'noche' && mus.tn !== 'tormenta' && mus.tn !== 'dormir' && mus.tn !== 'calle' && (i === 0 || i === 4)) notaM(hz(r + 24), PS * .6, t, 'square', .006);
      mus.t += PS; mus.paso++;
    }
  }
