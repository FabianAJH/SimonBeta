  /* ===================== AMBIENTE DEL ESTUDIO: lluvia, tormenta y café ===================== */
  let es = null, estRayo = 0;
  function estSndOff() {
    if (!es) return; const E = es; es = null; clearInterval(E.timer); clearTimeout(E.tt);
    try { E.g.gain.cancelScheduledValues(ac.currentTime); E.g.gain.setValueAtTime(E.g.gain.value, ac.currentTime); E.g.gain.linearRampToValueAtTime(0, ac.currentTime + .6); } catch (_) {}
    setTimeout(() => { E.nodes.forEach(n => { try { n.stop(); } catch (_) {} }); try { E.g.disconnect(); } catch (_) {} }, 800);
  }
  let estBufs = null;
  function estBuffers() {
    if (estBufs) return estBufs; const sr = ac.sampleRate, n = sr * 5;
    const mk = (kind) => { const b = ac.createBuffer(2, n, sr); for (let c = 0; c < 2; c++) { const x = b.getChannelData(c); let b0 = 0, b1 = 0, b2 = 0, br = 0; for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; if (kind === 'pink') { b0 = .99765 * b0 + w * .099046; b1 = .963 * b1 + w * .2965164; b2 = .57 * b2 + w * 1.0526913; x[i] = (b0 + b1 + b2 + w * .1848) * .22; } else if (kind === 'brown') { br = (br + .02 * w) / 1.02; x[i] = br * 3.2; } else x[i] = w; } } return b; };
    const drop = ac.createBuffer(1, Math.floor(sr * .08), sr); const d = drop.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    estBufs = { pink: mk('pink'), brown: mk('brown'), white: mk('white'), drop }; return estBufs;
  }
  function estAmbActivo() { if (escenaId() !== 'estudio' || !e.estAmb) return ''; return e.est || modal === 'estudio' ? e.estAmb : ''; }
  function estFactor() { const v = e.estVol === undefined ? 50 : e.estVol; return Math.pow(v / 50, 1.6); }
  function estSndApply() { if (!es) return; try { es.g.gain.setTargetAtTime(es.base * estFactor(), ac.currentTime, .1); es.th.gain.value = estFactor(); } catch (_) {} }
  function estSndCheck() {
    if (e.estAmb === 'cafe' || e.estAmb === 'tormenta') e.estAmb = '';
    const tipo = estAmbActivo();
    if (!tipo || e.mudo || document.hidden || rt || !audio()) { estSndOff(); return; }
    if (es && es.tipo === tipo) return;
    estSndOff();
    const B = estBuffers(), nodes = [], g = ac.createGain(); g.gain.value = 0; g.connect(ac.destination);
    const mod = ac.createGain(); mod.gain.value = 1; mod.connect(g);
    const capa = (buf, tipoF, f, q, vol) => { const sr = ac.createBufferSource(); sr.buffer = buf; sr.loop = true; sr.loopStart = Math.random() * 2; const fl = ac.createBiquadFilter(); fl.type = tipoF; fl.frequency.value = f; fl.Q.value = q; const gg = ac.createGain(); gg.gain.value = vol; sr.connect(fl); fl.connect(gg); gg.connect(mod); sr.start(0, Math.random() * 2); nodes.push(sr); return gg; };
    const lfo = (f, prof) => { const o = ac.createOscillator(), lg = ac.createGain(); o.frequency.value = f; lg.gain.value = prof; o.connect(lg); lg.connect(mod.gain); o.start(); nodes.push(o); };
    const th = ac.createGain(); th.connect(ac.destination);
    const E = { tipo, g, th, nodes, timer: 0, tt: 0 }; let vol;
    const gota = (v, grave) => {   // una gotita suelta: golpecito corto de ruido filtrado con posición aleatoria
      const t = ac.currentTime + Math.random() * .08, sr = ac.createBufferSource(); sr.buffer = B.drop; const fl = ac.createBiquadFilter(); fl.type = 'bandpass'; fl.frequency.value = (grave ? 900 : 1800) + Math.random() * (grave ? 2200 : 4800); fl.Q.value = 2 + Math.random() * 6;
      const gg = ac.createGain(); gg.gain.setValueAtTime(v * (.25 + Math.random() * .75), t); gg.gain.exponentialRampToValueAtTime(.0001, t + .025 + Math.random() * .05);
      sr.connect(fl); fl.connect(gg); let sal = gg; if (ac.createStereoPanner) { const pn = ac.createStereoPanner(); pn.pan.value = Math.random() * 1.6 - .8; gg.connect(pn); sal = pn; } sal.connect(g); sr.start(t, Math.random() * .02); sr.stop(t + .1);
      if (Math.random() < .08) { const o = ac.createOscillator(), og = ac.createGain(); o.type = 'sine'; o.frequency.value = 2400 + Math.random() * 2400; og.gain.setValueAtTime(v * .12, t); og.gain.exponentialRampToValueAtTime(.0001, t + .05); o.connect(og); og.connect(g); o.start(t); o.stop(t + .08); }
    };
    if (tipo === 'lluvia' || tipo === 'tormenta') {
      const T = tipo === 'tormenta'; vol = T ? .32 : .34;
      capa(B.pink, 'bandpass', T ? 1500 : 1900, .45, 1);
      capa(B.white, 'highpass', 6200, .4, T ? .1 : .07);
      capa(B.brown, 'lowpass', 320, .6, T ? 1.1 : .55);
      lfo(.07, T ? .18 : .1); lfo(.19, .05);
      E.timer = setInterval(() => { const n = Math.random() < (T ? .8 : .55) ? 1 + (Math.random() < (T ? .6 : .3) ? 1 : 0) : 0; for (let i = 0; i < n; i++) gota(T ? .1 : .085, T); }, 70);
      if (T) {
        if (!ac.__v) ac.__v = 1;
        const trueno = () => {
          if (!es || es !== E) return;
          const t0 = ac.currentTime, crack = Math.random() < .6, dl = crack ? .05 + Math.random() * .5 : 0, dur = 3.2 + Math.random() * 3.2;
          if (crack) { const sr = ac.createBufferSource(); sr.buffer = B.white; const fl = ac.createBiquadFilter(); fl.type = 'bandpass'; fl.frequency.value = 1400; fl.Q.value = .5; const gg = ac.createGain(); gg.gain.setValueAtTime(.0001, t0); gg.gain.exponentialRampToValueAtTime(.3, t0 + .008); gg.gain.exponentialRampToValueAtTime(.0001, t0 + .35); sr.connect(fl); fl.connect(gg); gg.connect(th); sr.start(t0); sr.stop(t0 + .5); estRayo = 5; setTimeout(() => { estRayo = 3; }, 140); setTimeout(() => { estRayo = 4; }, 260); }
          const sr = ac.createBufferSource(); sr.buffer = B.brown; sr.loop = true; const fl = ac.createBiquadFilter(); fl.type = 'lowpass'; fl.Q.value = .8; fl.frequency.setValueAtTime(380, t0 + dl); fl.frequency.exponentialRampToValueAtTime(70, t0 + dl + dur);
          const gg = ac.createGain(); gg.gain.setValueAtTime(.0001, t0 + dl); gg.gain.linearRampToValueAtTime(.7, t0 + dl + .35); gg.gain.setTargetAtTime(.0001, t0 + dl + .6, dur / 4);
          const tr = ac.createOscillator(), tg = ac.createGain(); tr.frequency.value = 5 + Math.random() * 4; tg.gain.value = .25; tr.connect(tg); tg.connect(gg.gain);
          sr.connect(fl); fl.connect(gg); gg.connect(th); sr.start(t0 + dl, Math.random() * 3); tr.start(t0 + dl); sr.stop(t0 + dl + dur + 1); tr.stop(t0 + dl + dur + 1);
          E.tt = setTimeout(trueno, 9000 + Math.random() * 18000);
        };
        E.tt = setTimeout(trueno, 3500 + Math.random() * 4000);
      }
    }
    E.base = vol; E.th.gain.value = estFactor(); g.gain.linearRampToValueAtTime(vol * estFactor(), ac.currentTime + 2); es = E;
  }
