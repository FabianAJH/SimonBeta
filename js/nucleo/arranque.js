  function pintarTermometro() {
    const c = $('ic-term');
    if (!c) return;
    try {
      const ctx0 = c.getContext('2d');
      ctx0.clearRect(0, 0, c.width, c.height);
      ctx0.drawImage(gridCanvas(termometroGrid()), 0, 0);
    } catch (_) {}
  }
  const ceBtn = $('chip-enf');
  if (ceBtn) {
    ceBtn.onclick = () => {
      sfx.click();
      if (!e.enf) return;
      if ((e.meds || 0) > 0) {
        e.meds--;
        curar('jarabe');
        toast('¡Le diste jarabe! Simon se curó');
        pintar();
      } else {
        toast('Simon tiene resfriado: dale JARABE (tienda) o abrígalo');
        decir('Sí... ¡achú!', e.traductor ? 'Tengo fiebre y frío... necesito jarabe o abrigo.' : null, 3000);
        hablar();
      }
    };
  }
  try {
    pintarTermometro();
    const ic1 = $('ic-mon').getContext('2d'); ic1.drawImage(sprite('fx_moneda', FX.moneda, 0), 0, 0);
    dibMini('si-h', MINI.keke); dibMini('si-e', MINI.rayo); dibMini('si-l', MINI.gota); pintarCara();
    const ic2 = $('ic-cor').getContext('2d'); ic2.drawImage(sprite('fx_corazon', FX.corazon, 0), 0, 0);
  } catch (err) { console.warn('[Simon] Iconos HUD:', err); }
  if (despertoOffline) { despertoOffline = false; try { despertarPremio(); } catch (_) {} pintar(); guardar(); }
  if (guardadoIlegible) setTimeout(() => { try { toast('NO PUDE LEER TU PARTIDA ANTERIOR. GUARDÉ UNA COPIA'); } catch (_) {} }, 2500);
  if (ausenciaH >= 24) e.proxVisita = 0;
  if (!e.intro) iniciarIntro();
  else {
    try { if (regalosAtrasados()) guardar(); } catch (_) {}   // regalos de nivel que falten (ver economia_logros.js)
    setTimeout(() => { if (!modal && infoRegalo()) abrir('regalo'); }, 900);
    try { resumenAusencia(); prepararSaludo(); setTimeout(saludar, 1600); setTimeout(checkVisita, 4500); } catch (_) {}
    if (!e.avisoMerc) { e.avisoMerc = true; guardar(); setTimeout(() => notificar('Cortex vendrá a venderte cosas una vez al día y te avisará antes de llegar.'), 3000); }
  }
  if (e.hab === 'espacial') { if ((!admin && nivel() < 100) || !e.espReparado) e.hab = (e.habAntes && e.habAntes !== 'espacial' && HABS_NAV.some(h => h.id === e.habAntes) && nivel() >= HABS.find(h => h.id === e.habAntes).nv) ? e.habAntes : 'sala'; else espacialAsegura(); }   // sin reparar, Simon sigue en la Tierra
  if (!admin && nivel() < HABS[0].nv) { if (e.hab === 'estudio') e.hab = 'sala'; e.est = null; }
  try { checkHallazgo(); } catch (_) {}
  try { actualizarTareas(); } catch (_) {}
  try { pintarIconos(); } catch (err) { console.warn('[Simon] pintarIconos:', err); }
  if (e.intro) {
    if (!e.ultResp) { e.ultResp = Date.now(); guardar(); }
    else if (e.intro && nivel() >= 3 && Date.now() - e.ultResp > 10 * 86400000 && Date.now() - (e.recT || 0) > 10 * 86400000) {   // máximo un recordatorio cada 10 días, solo en la campana (un aviso emergente la primera vez)
      e.recT = Date.now(); const primera = !e.recToast; e.recToast = 1; guardar();
      notificar('Hace tiempo que no guardas un respaldo. Hazlo en Ajustes (engranaje) > Respaldo, así no pierdes a Simon si cambias de celular.');
      if (primera) setTimeout(() => toast('Mira la campana: hay un consejo para guardar tu progreso'), 6500);
    }
    setTimeout(() => { const cl = clima(); if (cl !== 'sol' && e.avisoClima !== hoy()) { e.avisoClima = hoy(); guardar(); toast(TXT_CLIMA[cl]); } }, 7500);
    setTimeout(() => { if (!e.avisoDice) { e.avisoDice = 1; guardar(); notificar('SIMON DICE tiene preguntas y misiones.'); } }, 4500);
  }
  window.render = render; window.pintar = pintar; window.guardar = guardar; window.sfx = sfx; window.estrellas = estrellas;
  window.__simon = { mjIniciar, get mj() { return (typeof window !== "undefined" && window.mj) || (typeof mj !== "undefined" ? mj : null); }, runIniciar, runSalto, get run() { return (typeof window !== "undefined" && window.run) || (typeof run !== "undefined" ? run : null); }, memIniciar, memClick, get mem() { return mem; }, get e() { return e; }, mimar, COMIDAS, darComida, entrarEdicion, colocar, get edit() { return edit; }, quiereKeke, clima, FX, mision, preguntar, nuevaRonda, adivinar, crearCodigo, leerCodigo, sanitizar, ESQUEMA, MIS, SEC, get ronda() { return ronda; }, accion, comer, jugar, dormir, dice, ganar, darXp, nivel, abrir, cerrar, infoRegalo, comprar, ITEMS, LOGROS, gesto, sprite, simonGrid, pintar, guardar, get act() { return act; }, get es() { return es; }, estSndCheck, estIniciar, estTick, estFin, get est() { return e.est; }, mercInfo, mercTick, ofertasHoy, get mercPres() { return mercPres; }, iniciarIntro, iniciarVisita, checkVisita, get dlg() { return dlg; }, iniciarAct, checkHallazgo, recogerHallazgo, actualizarTareas, simonAsusta, comentaRopa, equipar, poner, iniciarSiesta, siestaToque, checkMem, checkSiesta, lanzarBomba, reaccionCortex, get desc() { return desc; }, get bm() { return bm; }, get cortexP() { return cortex.p; }, enfermar, curar, checkEnf, diasDescuidado, nivelAbandono, get proxEstornudoT() { return proxEstornudoT; }, set proxEstornudoT(v) { proxEstornudoT = v; }, rtIniciar, rtEmpezar, rtTap, get rt() { return rt; }, temaMus, ambiente, mus: () => mus, dx, eventoLibre, EV_TUT, EV_VIS, EV_SIE, EV_INTD, EV_INTE, EV_MEMR, EV_KEKE, EV_ROPA, EV_RPND, EV_CEL, EV_NOCHE, evAgregar, evQuitar, evTiene, evProcesar, get evPend() { return evPend; }, libreParaTutorial, introMueble, introEnf, irLugar, irHab, cgIni, RECETAS, get lugar() { return lugar; }, get cambiando() { return cambiando; }, get cg() { return cg; }, HABS, get calle() { return calle; }, get vistaBloq() { return vistaBloq; }, pintarNav, get VERSION_JUEGO() { return VERSION_JUEGO; }, get jugFis() { return jugFis; }, sonarReboteJuguete, jugLanzar, zonaSeguraJuguete, jugFisReset };   // ayuda para pruebas
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

