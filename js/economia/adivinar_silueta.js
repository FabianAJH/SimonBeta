  /* ¿en qué piensa Simon? Adivina la silueta */
  const OBJ = [
    { id: 'pizza', n: 'KEKE', g: () => FX.pizza() }, { id: 'moneda', n: 'MONEDA', g: () => FX.moneda() }, { id: 'corazon', n: 'CORAZÓN', g: () => FX.corazon() },
    { id: 'pelota', n: 'PELOTA', g: () => pelotaGrid() }, { id: 'libro', n: 'LIBRO', g: () => libroGrid(0) }, { id: 'regalo', n: 'REGALO', g: () => prevGrid('caja') },
    { id: 'planta', n: 'PLANTA', g: () => prevGrid('planta') }, { id: 'guitarra', n: 'GUITARRA', g: () => prevGrid('guitarra') }, { id: 'lampara', n: 'LÁMPARA', g: () => prevGrid('lampara') },
    { id: 'pato', n: 'PATO', g: () => prevGrid('pato') }, { id: 'dino', n: 'DINOSAURIO', g: () => prevGrid('dino') }, { id: 'cohete', n: 'COHETE', g: () => prevGrid('cohete') },
    { id: 'sol', n: 'SOL', g: () => prevGrid('dib_sol') }, { id: 'casa', n: 'CASA', g: () => prevGrid('dib_casa') }, { id: 'flor', n: 'FLOR', g: () => prevGrid('dib_flor') },
    { id: 'luna', n: 'LUNA', g: () => prevGrid('dib_luna') }, { id: 'sombrero', n: 'CORONA', g: () => { const g = Grid(22, 12); g.rect(0, 4, 22, 8, '#e8333f'); g.rect(0, 0, 3, 5, '#e8333f'); g.rect(9, 0, 4, 5, '#e8333f'); g.rect(19, 0, 3, 5, '#e8333f'); g.rect(2, 6, 18, 4, '#1b1f4a'); return g; } },
    { id: 'nube', n: 'NUBE', g: () => { const g = Grid(24, 12); [[6, 7, 6], [12, 5, 7], [18, 7, 6], [12, 8, 9]].forEach(([x, y, r]) => capa(g, null, L => sombrear(L, elipse(x, y, r, r * .8), x, y, r, r * .8, ['#ffffff', '#e8ecff', '#c4cdf0', '#9aa6d8']))); return g; } }
  ];
  let tRonda = null;
  function limpiaT() { if (tRonda) { clearInterval(tRonda); tRonda = null; } }
  function lienzoObj(o, sil, max) {
    const g = o.g(), z = Math.max(2, Math.floor(max / Math.max(g.w, g.h))), c = document.createElement('canvas');
    c.width = g.w * z; c.height = g.h * z; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(gridCanvas(g), 0, 0, c.width, c.height);
    if (sil) { x.globalCompositeOperation = 'source-in'; x.fillStyle = '#1b1f4a'; x.fillRect(0, 0, c.width, c.height); }
    return c;
  }
  function pensar(c, txt, dur) {
    const b = $('burbuja'); b.textContent = ''; if (c) b.appendChild(c); if (txt) b.appendChild(document.createTextNode(txt));
    b.classList.add('on'); clearTimeout(tBurbuja); tBurbuja = setTimeout(() => b.classList.remove('on'), dur || 3000);
  }
  function nivelRonda() { return rachaAdiv < 3 ? { n: 3, seg: 0 } : rachaAdiv < 6 ? { n: 4, seg: 10 } : { n: 6, seg: 7 }; }
  function nuevaRonda() {
    limpiaT();
    const L = nivelRonda(), ult = ronda && ronda.o, cand = OBJ.filter(o => o !== ult), o = cand[Math.floor(Math.random() * cand.length)];
    const otros = mezclar(OBJ.filter(x => x !== o), Math.random).slice(0, L.n - 1);
    ronda = { o, ops: mezclar([o].concat(otros), Math.random), res: null, seg: L.seg, t0: Date.now() };
    dv = 'adiv'; hablar(); sfx.pregunta(); pensar(lienzoObj(o, true, 48), '¿?', 600000); gesto('salto');
    render();
    if (L.seg) tRonda = setInterval(() => {
      const f = 1 - (Date.now() - ronda.t0) / (L.seg * 1000), bar = $('tm-b');
      if (bar) bar.style.width = Math.max(0, f * 100) + '%';
      if (f <= 0) adivinar(null);
    }, 100);
  }
  function adivinar(id) {
    if (!ronda || ronda.res) return; limpiaT();
    if (e.adv.f !== hoy()) e.adv = { f: hoy(), n: 0 };
    const o = ronda.o, ok = id === o.id; let premio = 0, nuevo = false;
    if (ok) {
      rachaAdiv++; e.st.adiv++; e.st.adivMejor = Math.max(e.st.adivMejor || 0, rachaAdiv); mision('adiv');
      if (e.adv.n < 10) { e.adv.n++; premio = 1 + Math.min(rachaAdiv, 3); ganar(premio, 2); }
      if (!e.pens[o.id]) { e.pens[o.id] = 1; nuevo = true; ganar(4, 3, true); }
      sfx.respuesta(); corazones(nuevo ? 4 : 2); gesto(nuevo ? 'baile' : 'salto');
    } else { rachaAdiv = 0; sfx.no(); }
    pensar(lienzoObj(o, false, 48), o.n, 5000); hablar();
    ronda.res = { ok, premio, nuevo, id }; pintar(); guardar(); render();
  }
