  /* ===================== MIMOS: Simon se cansa y luego vuelve a querer ===================== */
  // (MIMO_MAX, MIMO_VUELVE, MIMO_SEG, MIMO_XP_DIA, MIMO_MON_DIA definidos en config.js)
  // (HARTO definido en dialogos.js)
  function mimosAl() { const m = e.mimos, t = Date.now(); m.n = Math.max(0, m.n - (t - (m.t || t)) / (MIMO_SEG * 1000)); m.t = t; return m; }
  function checkMimos() {
    const m = mimosAl();
    if (m.harto && m.n < MIMO_VUELVE) { m.harto = false; if (!modal && !dlg && !e.dormido && !cortex.p) { decir('Sí.', e.traductor ? '¡Ya quiero mimos otra vez!' : null, 3500); hablar(); gesto('salto'); } }
  }
  function mimar(suave) {
    const resp = (txt, causa) => { if (!suave) { responder(txt, causa); return; } decir('Sí.', e.traductor ? (txt ? txt.replace(/[()]/g, '') : traducir(causa || 'otro')) : null); e.st.si++; hablar(); };
    const m = mimosAl();
    if (m.harto && m.n >= MIMO_VUELVE) {
      decir('Sí.', e.traductor ? HARTO[Math.floor(Math.random() * HARTO.length)] : null, 2800); sfx.no(); bocaT = 6; if (suave) acar = null; return;
    }
    m.harto = false; m.n += 1;
    const D = e.mimosDia; if (D.f !== hoy()) { D.f = hoy(); D.xp = 0; D.coins = 0; D.av = 0; }
    const hab = e.feliz < 100; e.feliz = clamp(e.feliz + 2); e.st.toques++; mision('tocar');
    const nAntesAcar = nivel();
    if (D.xp < MIMO_XP_DIA) {
      if (hab) { darXp(1); D.xp++; }
      if (clima() === 'tormenta' && e.st.toques % 3 === 0 && D.xp < MIMO_XP_DIA) { darXp(1); D.xp++; corazones(2); }
    }
    if (e.st.toques % 10 === 0 && D.coins < MIMO_MON_DIA) { ganar(1, 0); D.coins++; }
    if (!suave && nivel() === nAntesAcar) sfx.toque(); corazones(1);
    if (m.n >= MIMO_MAX - .3) { m.harto = true; if (suave) acar = null; responder('(¡ya fueron muchos mimos! Déjame descansar un ratito)'); gesto('salto'); }
    else if (Math.round(m.n) === 6 && m.n < 7) resp('(mmm... me estás dando muchos mimos)');
    else if (D.xp >= MIMO_XP_DIA && !D.av) { D.av = 1; resp('(hoy ya me llenaste de mimos. ¡Gracias!)'); }
    else if (clima() === 'tormenta' && Date.now() < sustoCd - 110000) { resp('(¡Gracias por abrazarme! Ya no tengo tanto miedo)'); corazones(2); }
    else if (nivelAbandono() >= 2) resp('(...s-sí...)');
    else if (e.enf) resp('(achú... tengo frío, ponme una bufanda o dame jarabe)');
    else resp(null, 'tocar');
  }
