  /* ===================== SONIDOS AMBIENTE (por lugar y hora) ===================== */
  let ambProx = Date.now() + 15000;
  function ambiente() {
    if (e.mudo || document.hidden || modal || mj || rt || !e.intro || Date.now() < ambProx) return;
    if (Math.random() > .5) { ambProx = Date.now() + 8000; return; }
    ambProx = Date.now() + 22000 + Math.random() * 20000;
    const h = new Date(ahora()).getHours(), sc = escenaId(), cl = clima(), noche = h >= 19 || h < 6;
    if (sc === 'cocina') { Math.random() < .5 ? seq([1760, 2349], .09, 'triangle', .035) : seq([220, 262, 247, 330, 294], .08, 'sine', .03); return; }
    if (cl === 'lluvia' || cl === 'tormenta' || cl === 'nieve') return;
    if (noche) { if ((sc === 'entrada' || sc === 'parque') && Math.random() < .6) seq([392, 0, 330, 0, 0, 330], .3, 'sine', .03); return; }   // de noche solo un búho lejano, sin pitidos
    seq([2600, 3100, 2800], .09, 'sine', .014);
  }
