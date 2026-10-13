  /* ===================== CORTEX COMERCIANTE ===================== */
  // (MERC_VENT, MERC_AVISO definidos en config.js)
  let mercPres = false, mercBusy = false, visPend = false;
  const dormCx = () => !!(desc && !mercPres && (desc.zzz || (!bm && !dlg)));
  const tempCx = () => introActiva ? null : temporada();
  const cortexClave = () => mercPres ? 'cortexM' : 'cortex' + (tempCx() || '') + (hollin ? (hollin === 'crema' ? 'C' : 'H') : '') + (dormCx() ? 'Z' : '');
  const cortexG = () => cortexGrid(mercPres, mercPres ? null : tempCx(), hollin, dormCx());
  const mmss = ms => { ms = Math.max(0, Math.ceil(ms / 1000)); return String(Math.floor(ms / 60)).padStart(2, '0') + ':' + String(ms % 60).padStart(2, '0'); };
// (hashStr definido en engine.js)
  // una vez al día, a una hora distinta (entre las 10:00 y las 21:30)
  function mercInfo() {
    const h = hoy();
    if (!e.merc || e.merc.dia !== h) e.merc = { dia: h, compras: {}, aviso: false, adios: false };
    if (admin && admMerc) { const t = ahora(); return { est: t >= admMerc + MERC_VENT ? 'fin' : 'aqui', llega: admMerc, fin: admMerc + MERC_VENT, t }; }
    const [Y, M, D] = h.split('-').map(Number);
    const llega = new Date(Y, M - 1, D, 10, 0, 0).getTime() + (hashStr('cortex' + h) % 691) * 60000, t = ahora();
    const est = t >= llega + MERC_VENT ? 'fin' : t >= llega ? 'aqui' : t >= llega - MERC_AVISO ? 'aviso' : 'espera';
    return { est, llega, fin: llega + MERC_VENT, t };
  }
  function ofertasHoy() {
    const h = hoy();
    const t = temporada(), ok = k => !e.tiene[k] || e.merc.compras[k], ord = (a, b) => hashStr(h + a) - hashStr(h + b);
    const de = Object.keys(ITEMS).filter(k => ITEMS[k].temp && ITEMS[k].temp === t).sort(ord).filter(ok);
    const elegible = k => ok(k) && nivel() >= (ITEMS[k].nv || 1);
    const raro = MERC_POOL.filter(k => ITEMS[k].raro5 && elegible(k) && ((admin && admMercRaro) || (hashStr('r5_' + h + k) % 100) < 5));   // objetos rarísimos: 5% de probabilidad cada día (o siempre, forzado desde el panel admin), aparte pero sin saltarse el cupo normal
    const reg = raro.concat(MERC_POOL.filter(k => !ITEMS[k].raro5).sort(ord).filter(elegible));
    return de.slice(0, 1).concat(reg).slice(0, 3);
  }
  // Trébol de la Suerte (planta colocada): 20% de los días Cortex rebaja UN objeto de su bolsa entre 10% y 50%
  function mercDesc() {
    const h = hoy();
    if (admin && admMercDesc) { const of = ofertasHoy(); return of.length ? { k: of[0], pct: 30 } : null; }   // forzado desde el panel admin: sin necesitar el trébol ni el 20% de probabilidad
    if (typeof macetaGlobal !== 'function' || !macetaGlobal('suerte')) return null;
    const C = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.alvarikoke) || {}, prob = C.descProb || 20, mn = C.descMin || 10, mx = C.descMax || 50;
    if (hashStr('trD' + h) % 100 >= prob) return null;
    const of = ofertasHoy(); if (!of.length) return null;
    return { k: of[hashStr('trI' + h) % of.length], pct: mn + hashStr('trP' + h) % (mx - mn + 1) };
  }
  const precioMerc = k => { const d = mercDesc(); return d && d.k === k ? Math.max(1, Math.round(ITEMS[k].p * (100 - d.pct) / 100)) : ITEMS[k].p; };
  function bolsaGrid(est) {
    const g = Grid(14, 13);
    capa(g, '#2a1408', L => sombrear(L, elipse(7, 8, 5.5, 4.5), 7, 8, 5.5, 4.5, ['#f0c088', '#c8884a', '#8a5424', '#4a2a10']));
    g.rect(5, 2, 4, 2, '#d8a020'); g.rect(4, 1, 2, 2, '#8a5424'); g.rect(8, 1, 2, 2, '#8a5424');
    g.set(6, 8, '#ffd84a'); g.set(7, 8, '#ffd84a'); g.set(6, 7, '#fff6b0');
    if (est === 'fin') for (let y = 0; y < 13; y++) for (let x = 0; x < 14; x++) if (g.has(x, y)) { const i = (y * 14 + x) * 4, v = Math.round((g.d[i] + g.d[i + 1] + g.d[i + 2]) / 3); g.d[i] = g.d[i + 1] = v; g.d[i + 2] = v + 10; }
    return g;
  }
  function presencia() {
    if (!(mercPres || desc) || mercBusy || dlg || cortex.dir || bm) return;
    const sala = escenaId() === 'sala' && !lugar;
    if (!sala) { if (cortex.p) { cortex.p = 0; bombaTick(); } if (desc && ahora() >= desc.fin) finDesc(); }
    else if (!cortex.p && !modal) { cortex.p = 1; bombaTick(); }
  }
  function mercTick() {
    const ch = $('t-cortex'), bt = $('t-bomba');
    if (!e.intro || introActiva) { ch.classList.add('oculto'); if (bt) bt.classList.add('oculto'); return; }
    const I = mercInfo();
    presencia();
    // La bomba solo sale cuando Cortex está de visita en la recámara, NUNCA cuando es comerciante ni cuando no está de visita
    if (bt && (!desc || mercPres || I.est === 'aqui' || (typeof escenaId === 'function' && escenaId() !== 'sala') || lugar)) bt.classList.add('oculto');
    if (desc && !mercPres) {
      ch.classList.remove('oculto', 'gris', 'lista'); $('v-cortex').textContent = mmss(Math.max(0, desc.fin - ahora()));
      dibIcono($('ic-cortex'), 'ic_zz', FX.z); return;
    }
    ch.classList.toggle('oculto', (I.est === 'espera' || I.est === 'fin') && !mercPres);
    ch.classList.toggle('gris', I.est === 'fin' && !mercPres);
    ch.classList.toggle('lista', I.est === 'aqui');
    $('v-cortex').textContent = I.est === 'aviso' ? 'CORTEX ' + fmt(I.llega - I.t) : I.est === 'aqui' ? '¡AQUÍ! ' + mmss(I.fin - I.t) : '';
    dibIcono($('ic-cortex'), 'bolsa' + (I.est === 'fin' ? 'x' : 'o'), () => bolsaGrid(I.est));
    const el = $('mc-t'); if (el) el.textContent = 'QUEDAN ' + mmss(I.fin - I.t);
    if (I.est === 'aviso' && !e.merc.aviso) {
      e.merc.aviso = true; guardar(); sfx.nivel();
      toast('¡Cortex vendrá a comerciar en ' + Math.max(1, Math.round((I.llega - I.t) / 60000)) + ' min!');
    }
    if (I.est === 'aqui' && escenaId() === 'sala' && !cambiando && !lugar && !mercPres && !mercBusy && !dlg && !cortex.dir && !cortex.p && !modal) {
      mercBusy = true; act = null; mercPres = true; notificar('Cortex llegó de comerciante. Se queda 15 minutos.');
      const resto = Math.max(1, Math.round((I.fin - I.t) / 60000)), fresco = I.t - I.llega < 90000;
      cortexEntra(() => { mercBusy = false; dialogo(fresco ? DIALOGOS.comerciante.llegadaFresca() : DIALOGOS.comerciante.llegadaTarde(resto), () => abrir('comercio')); });
    }
    presencia();
    if (I.est === 'aqui' && !mercPres && !e.merc.notif && !(escenaId() === 'sala' && !lugar)) { e.merc.notif = true; notificar('Cortex llegó de comerciante. Te espera en la recámara.'); }
    if (I.est !== 'aqui' && mercPres && !mercBusy && !dlg && !(escenaId() === 'sala' && !lugar)) {
      mercPres = false; cortex.p = 0; cortex.dir = 0; e.merc.adios = true; guardar();
    }
    if (I.est !== 'aqui' && mercPres && !mercBusy && !dlg) {
      mercBusy = true; if (modal) cerrar();
      dialogo(DIALOGOS.comerciante.despedida(), () => cortexSale(() => { mercPres = false; mercBusy = false; e.merc.adios = true; guardar(); }));
    }
  }
  function comprarMerc(k) {
    const I = mercInfo(), it = ITEMS[k];
    if (I.est !== 'aqui' || e.merc.compras[k] || e.tiene[k] || !ofertasHoy().includes(k)) return;
    const pr = precioMerc(k);
    if (e.monedas < pr) { faltanMon(pr - e.monedas); sfx.no(); return; }
    if (!Object.keys(e.merc.compras).length) e.st.tratos++;
    e.monedas -= pr; animarMonedas(pr, true); e.tiene[k] = 1; e.merc.compras[k] = 1; e.st.compras++; equipar(k);
    toast('CORTEX: ¡Buena elección!'); sfx.compra(); gesto('besos'); hablar(); pintar(); guardar(); render();
  }
  $('t-cortex').onclick = () => {
    const I = mercInfo(); sfx.click();
    if (desc && !mercPres) { toast(escenaId() === 'sala' && !lugar ? 'Cortex está descansando' : 'Cortex descansa en la recámara'); return; }
    if (I.est === 'aqui' && mercPres && !dlg) { if (escenaId() === 'sala' && !lugar) abrir('comercio'); else toast('Cortex te espera en la recámara'); }
    else if (I.est === 'aviso') toast('Cortex llega en ' + fmt(I.llega - I.t));
    else if (I.est === 'fin') toast('Cortex volverá mañana, a otra hora.');
  };

