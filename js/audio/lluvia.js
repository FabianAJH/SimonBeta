  /* ===================== SONIDO DE LLUVIA, TORMENTA Y NIEVE ===================== */
  let llu = null, ruidoBuf = null;
  function lluviaOff() {
    if (!llu) return; const L = llu; llu = null;
    try { L.g.gain.cancelScheduledValues(ac.currentTime); L.g.gain.setValueAtTime(L.g.gain.value, ac.currentTime); L.g.gain.linearRampToValueAtTime(0, ac.currentTime + .5); } catch (_) {}
    setTimeout(() => { L.nodes.forEach(n => { try { n.stop(); } catch (_) {} }); try { L.g.disconnect(); } catch (_) {} }, 700);
  }
  const hayVentana = () => calle || lugar === 'parque' || ['sala', 'cocina', 'estudio'].includes(e.hab);   // el clima solo se oye afuera o en cuartos con ventana
  function lluviaCheck() {
    estSndCheck(); if (es) { lluviaOff(); return; }
    const c = calle ? 'lluvia' : clima(), quiere = !e.mudo && !document.hidden && !rt && hayVentana() && ['lluvia', 'tormenta', 'nieve', 'cafe'].includes(c) && audio();
    if (!quiere) { lluviaOff(); return; }
    const vol = (c === 'cafe' ? .035 : c === 'lluvia' ? .03 : c === 'tormenta' ? .05 : .012) * (e.dormido ? .6 : 1);
    if (llu && llu.modo === c) { try { llu.g.gain.setTargetAtTime(vol, ac.currentTime, .5); } catch (_) {} return; }
    lluviaOff();
    if (!ruidoBuf) { const n = ac.sampleRate * 2; ruidoBuf = ac.createBuffer(1, n, ac.sampleRate); const x = ruidoBuf.getChannelData(0); for (let i = 0; i < n; i++) x[i] = Math.random() * 2 - 1; }
    const g = ac.createGain(); g.gain.value = 0; g.connect(ac.destination); const nodes = [];
    const mk = (tipo, f, q, vol) => { const sr = ac.createBufferSource(); sr.buffer = ruidoBuf; sr.loop = true; sr.loopStart = Math.random(); const fl = ac.createBiquadFilter(); fl.type = tipo; fl.frequency.value = f; fl.Q.value = q; const gg = ac.createGain(); gg.gain.value = vol; sr.connect(fl); fl.connect(gg); gg.connect(g); sr.start(); nodes.push(sr); return gg; };
    if (c === 'lluvia' || c === 'tormenta') { mk('bandpass', 2600, .6, 1); mk('highpass', 5200, .5, .35); }
    if (c === 'cafe') { mk('bandpass', 620, .5, 1.3); mk('lowpass', 1500, .4, .6); }
    if (c === 'tormenta' || c === 'nieve') {   // viento que sube y baja despacio
      const w = mk('lowpass', c === 'nieve' ? 520 : 420, .7, .6), lfo = ac.createOscillator(), lg = ac.createGain();
      lfo.frequency.value = .12; lg.gain.value = .5; lfo.connect(lg); lg.connect(w.gain); lfo.start(); nodes.push(lfo);
    }
    g.gain.linearRampToValueAtTime(vol, ac.currentTime + 1.5);
    llu = { g, nodes, modo: c };
  }
