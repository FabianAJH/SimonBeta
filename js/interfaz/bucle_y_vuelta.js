  // mientras la app está abierta, las barras bajan despacio y se guardan
  let tjUlt = Date.now();
  setInterval(() => {
    { const ahoraT = Date.now(), dtj = Math.min(15000, Math.max(0, ahoraT - tjUlt)); tjUlt = ahoraT; if (!document.hidden && e) e.tJ = (e.tJ || 0) + dtj / 1000; }   // tiempo jugado (solo con la app a la vista)
    const h = 5 / 3600;
    jardinDia(); if (typeof solTick === 'function') solTick();
    e.hambre = clamp(e.hambre - BAJA.hambre * h);
    e.feliz = clamp(e.feliz - BAJA.feliz * h * (macetaGlobal('brote') ? .9 : 1) - (e.limp < 30 ? 2 * h : 0));
    e.limp = clamp(e.limp - limpTasa() * h);
    if (macetaGlobal('dorada')) { e._doradaAcc = (e._doradaAcc || 0) + h; if (e._doradaAcc >= 2) { const nd = Math.floor(e._doradaAcc / 2); e.monedas += nd; e._doradaAcc -= nd * 2; } }
    e.energia = clamp(e.dormido ? e.energia + rDormir() * h : e.energia - BAJA.energia * h);
    if (e.dormido && e.energia >= 100) { e.dormido = false; sfx.despertar(); despertarPremio(); responder(); }
    if (e.energia < 20 && !e.dormido && !avEn && e.intro && !introActiva) { avEn = true; if (!modal && !dlg) avisoSueno(); } if (e.energia >= 40) avEn = false;
    celebraCheck(); notifSync(); checkSuenoNoche(); checkHallazgo(); evProcesar(); checkVisita(); checkKeke(); checkMimos(); checkRopa(); checkSiesta(); checkTutorial(); checkCaja(); checkMem(); checkEnf(); ambiente(); checkNotis(); lluviaCheck(); if ((!e.mudo || e.musica) && (!ac || ac.state !== 'running')) armarAudio(); pintarAudioHint(); pintar(); guardar();
  }, 5000);

  function volver() {
    if (admin) { pintar(); return; }
    cargar(); pintar();
    if (despertoOffline) { despertoOffline = false; despertarPremio(); pintar(); guardar(); }
    if (ausenciaH >= 24) e.proxVisita = 0;
    if (e.intro && !introActiva && !dlg && !modal && infoRegalo()) setTimeout(() => { if (!modal && !dlg && infoRegalo()) abrir('regalo'); }, 500);
    if (ausenciaH >= 1) { resumenAusencia(); prepararSaludo(); setTimeout(saludar, 900); }
    checkHallazgo(); actualizarTareas(); setTimeout(checkVisita, 3000);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { notifSync(true); guardar(); musicaOff(); lluviaOff(); estSndOff(); } else { volver(); armarAudio(); musicaOn(); lluviaCheck(); } });
  window.addEventListener('resize', ajustar);

  // Pre-carga IndexedDB (async) para fallback si localStorage está vacío
  idbGet().then(v => { if (v) { _idbPend = v; if (!e || !e.intro) { try { cargar(); pintar(); guardar(); } catch (_) {} } } });
  try {
    cargar(); pintar(); guardar();
  } catch (err) {
    console.error('[Simon] Error al iniciar estado:', err);
    try { e = BASE(); sanitizar(e); pintar(); guardar(); } catch (_) {}
  }
  try { destrabarAudio(); } catch (_) {}
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { try { ajustar(); } catch (_) {} });
  try { disponer(); } catch (_) {}
  try { dibujarLogo(); } catch (_) {}
  try { ajustar(); } catch (err) { console.error('[Simon] Error en ajustar():', err); }
  if (window.ResizeObserver) new ResizeObserver(() => { try { ajustar(); } catch (_) {} }).observe($('escena'));
  setInterval(tick, 100);

