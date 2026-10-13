  /* ===================== SONIDO CHIPTUNE ===================== */
  let ac = null;
  function audio() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) { return null; } }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function nota(f, dur, t, tipo, vol) {
    if (e.mudo || !audio()) return;
    try {
      const o = ac.createOscillator(), g = ac.createGain();
      const a = Math.max(ac.currentTime, t || ac.currentTime);
      o.type = tipo || 'square'; o.frequency.setValueAtTime(f, a);
      g.gain.setValueAtTime(vol || .08, a); g.gain.setValueAtTime(vol || .08, a + dur * .55);
      g.gain.linearRampToValueAtTime(0.0001, a + dur);
      o.connect(g); g.connect(ac.destination);
      o.start(a); o.stop(a + dur + .02);
    } catch (_) {}
  }
  function seq(fs, paso, tipo = 'square', vol = .06, desde = 0) {
    if (e.mudo || !audio()) return;
    const t0 = ac.currentTime + .01 + desde;
    fs.forEach((f, i) => { if (f) nota(f, paso * .95, t0 + i * paso, tipo, vol); });
  }
  function crunch() {
    if (e.mudo || !audio()) return;
    const t0 = ac.currentTime + .01;
    [0, .12, .24].forEach(d => {
      const n = Math.floor(ac.sampleRate * .06), b = ac.createBuffer(1, n, ac.sampleRate), x = b.getChannelData(0);
      for (let i = 0; i < n; i++) x[i] = Math.round((Math.random() * 2 - 1) * (1 - i / n) * 4) / 4;
      const s = ac.createBufferSource(), g = ac.createGain();
      s.buffer = b; g.gain.value = .14; s.connect(g); g.connect(ac.destination); s.start(t0 + d);
    });
  }
  function estornudo() {   // "ah... ah... ¡CHÚ!": dos inhalaciones que suben y un soplido final
    if (e.mudo || !audio()) return;
    const t0 = ac.currentTime + .01;
    [[0, 520, 900], [.26, 600, 1150]].forEach(([d, a, b]) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(a, t0 + d); o.frequency.linearRampToValueAtTime(b, t0 + d + .2);
      g.gain.setValueAtTime(.001, t0 + d); g.gain.linearRampToValueAtTime(.09, t0 + d + .12); g.gain.linearRampToValueAtTime(.001, t0 + d + .22); o.connect(g); g.connect(ac.destination); o.start(t0 + d); o.stop(t0 + d + .24);
    });
    const tc = t0 + .62, n = Math.floor(ac.sampleRate * .22), buf = ac.createBuffer(1, n, ac.sampleRate), x = buf.getChannelData(0);
    for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 1.6);
    const ns = ac.createBufferSource(), ng = ac.createGain(), fl = ac.createBiquadFilter(); fl.type = 'bandpass'; fl.frequency.value = 2600; fl.Q.value = .6;
    ns.buffer = buf; ng.gain.value = .5; ns.connect(fl); fl.connect(ng); ng.connect(ac.destination); ns.start(tc);
    const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.type = 'sawtooth'; o2.frequency.setValueAtTime(700, tc); o2.frequency.exponentialRampToValueAtTime(180, tc + .2);
    g2.gain.setValueAtTime(.08, tc); g2.gain.linearRampToValueAtTime(.001, tc + .22); o2.connect(g2); g2.connect(ac.destination); o2.start(tc); o2.stop(tc + .24);
  }
  const sfx = {
    click:     () => seq([1500], .03, 'square', .04),
    comer:     () => { crunch(); seq([523, 659, 784, 1047], .07, 'square', .05, .36); },
    jugar:     () => seq([392, 523, 659, 784, 659, 784, 1047], .06),
    dormir:    () => seq([784, 659, 523, 392, 330], .13, 'triangle', .12),
    despertar: () => seq([330, 392, 523, 659, 784], .07),
    toque:     () => seq([988, 1319], .05, 'square', .05),
    ronr:      () => seq([330, 392], .07, 'sine', .04),
    trueno:    () => seq([90, 70, 55, 45], .22, 'sawtooth', .09),
    pregunta:  () => seq([1319, 988, 1319, 1568], .07, 'square', .05),
    respuesta: () => seq([523, 523, 523, 659, 784, 1047], .08),
    no:        () => seq([196, 147], .1, 'square', .06),
    blip:      f => seq([f], .035, 'square', .03),
    moneda:    () => seq([988, 1319], .05, 'square', .05),
    compra:    () => seq([1319, 1568, 2093], .06, 'square', .05),
    nivel:     () => seq([523, 659, 784, 1047, 1319, 1047, 1319, 1568], .09),
    logro:     () => { seq([523, 523, 523, 659, 784, 1047], .1, 'square', .06); seq([262, 330, 392, 523], .2, 'triangle', .1); seq([784, 988, 1175, 1568, 1319, 1568, 2093], .09, 'square', .05, .62); },
    regalo:    () => seq([523, 659, 784, 659, 784, 1047, 1319, 1568], .08),
    tic:       () => seq([2200], .02, 'square', .03),
    boom:      () => { crunch(); setTimeout(crunch, 90); seq([160, 120, 90, 62, 45], .1, 'sawtooth', .12); },
    pop:       () => seq([784, 1047, 1319, 1568, 2093], .05, 'square', .05),
    splat:     () => seq([260, 190, 140, 100], .06, 'sawtooth', .07),
    cohete:    () => { seq([500, 700, 900, 1200, 1500], .05, 'sine', .04); setTimeout(() => seq([1800, 1300, 2200, 900], .03, 'square', .03), 280); },
    gigante:   () => { crunch(); setTimeout(crunch, 90); setTimeout(crunch, 200); seq([120, 90, 70, 50, 38, 30], .14, 'sawtooth', .16); }
  };

