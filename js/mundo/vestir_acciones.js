  /* ===================== VESTIR A SIMON (probar ropa y guardar) ===================== */
  const vsCambios = () => !!vSnap && Object.keys(e.ropa).some(sl => (e.ropa[sl] || null) !== (vSnap[sl] || null));
  function vsCancel() {
    if (!vSnap) return; const hubo = vsCambios();
    Object.keys(vSnap).forEach(sl => { e.ropa[sl] = vSnap[sl]; }); Object.keys(e.ropa).forEach(sl => { if (!(sl in vSnap)) e.ropa[sl] = null; });
    vSnap = null; pintar(); if (hubo) toast('SIN CAMBIOS: SIMON VUELVE A SU ATUENDO');
  }
  function vsGuardar() {
    const ant = vSnap, nuevos = Object.keys(e.ropa).filter(sl => e.ropa[sl] && e.ropa[sl] !== (ant[sl] || null)).map(sl => e.ropa[sl]);
    vSnap = null;
    if (nuevos.length) { mision('ropa'); const k = nuevos.find(x => ROPA_COM[x]); if (k) ropaPend = k; sfx.regalo(); gesto('besos'); corazones(3); toast('¡LISTO! SIMON SE VE GENIAL'); } else sfx.click();
    pintar(); guardar(); cerrar();
  }
