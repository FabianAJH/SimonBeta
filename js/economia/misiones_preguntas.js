  /* ===================== CHARLA, ADIVINAR, MISIONES Y RESPALDO ===================== */
  function sem(t) { let h = 7; for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 2654435761) >>> 0; return () => { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }; }
  function mezclar(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  // (SEC definido en dialogos.js)
  let dv = 'menu', dres = null, ronda = null, rachaAdiv = 0, rsConf = false;
  /* misiones diarias de Cortex */
  // (MIS definido en dialogos.js)
  // (MIS_ESPERA definido en config.js)
  function misionesNuevas(previo) {
    let ids = MIS.map((m, i) => i).filter(i => !previo || !previo.includes(i)); if (ids.length < 3) ids = MIS.map((m, i) => i);
    e.mis = { ids: mezclar(ids, Math.random).slice(0, 3), p: {}, ok: {}, bono: 0, fin: 0 };
  }
  function misionesHoy() {   // las misiones no caducan: se terminan cuando se pueda; al acabarlas hay 24 h de espera
    if (!e.mis || !Array.isArray(e.mis.ids)) misionesNuevas();
    const M = e.mis;
    if (M.bono && !M.fin) M.fin = ahora();
    if (M.bono && ahora() >= M.fin + MIS_ESPERA) { misionesNuevas(M.ids); e.misAviso = 1; }
    return e.mis;
  }
  const misEspera = () => { const M = misionesHoy(); return M.bono ? Math.max(0, M.fin + MIS_ESPERA - ahora()) : 0; };
  function mision(k, n) {
    const M = misionesHoy(); let cambio = false;
    M.ids.forEach(i => {
      const m = MIS[i]; if (m.k !== k || M.ok[i]) return;
      M.p[i] = (M.p[i] || 0) + (n || 1); cambio = true;
      if (M.p[i] >= m.n) { M.ok[i] = 1; e.st.misiones++; const nAntes = nivel(); ganar(m.r, 4, true); toast('MISIÓN LISTA: ' + m.t + ' +' + m.r); if (nivel() === nAntes) sfx.logro(); }
    });
    if (cambio && !M.bono && M.ids.every(i => M.ok[i])) { M.bono = 1; M.fin = ahora(); ganar(22, 10, true); toast('CORTEX: ¡Misiones completas! +22'); notificar('Completaste las misiones de Cortex. Te dará nuevas dentro de 24 horas.'); }
  }
  /* preguntas del día */
  function preguntasHoy() {
    if (!e.preg || e.preg.f !== hoy()) {
      const r = sem('preg' + hoy()), ids = SEC.map((q, i) => i).filter(i => SEC[i][2] <= nivel());
      const nuevas = mezclar(ids.filter(i => !e.sec[i]), r), viejas = mezclar(ids.filter(i => e.sec[i]), r);
      e.preg = { f: hoy(), k: nuevas.concat(viejas).slice(0, 3), h: [] };
    }
    return e.preg;
  }
  function preguntar(i) {
    const P = preguntasHoy(); if (P.h.includes(i)) return;
    P.h.push(i); const nuevo = !e.sec[i]; e.sec[i] = 1; e.st.dice++;
    e.feliz = clamp(e.feliz + 4); if (nuevo) ganar(4, 3, true); mision('preg');
    dres = { i, nuevo }; dv = 'res'; sfx.pregunta(); decir('Sí.', SEC[i][1], 7000); gesto(nuevo ? 'baile' : 'salto'); setTimeout(() => { sfx.respuesta(); hablar(); corazones(nuevo ? 3 : 1); }, 450); pintar(); guardar(); render();
  }
