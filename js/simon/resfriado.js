  /* ===================== NOTIFICACIONES ===================== */
  // (Lógica, configuración y textos movidos a notificaciones.js para fácil edición)

  /* ===================== RESFRIADO (suave) ===================== */
  const ABRIGOS = ['bufanda', 'bufanda_dorada', 'capa_roja', 'capa_azul', 'sud_navidad']; // (MED_PRECIO definido en config.js)
  const abrigado = () => Object.values(e.ropa).some(k => k && ABRIGOS.includes(k));
  function enfermar() {
    e.enf = ahora(); e.enfAb = 0; e.malS = 0; dx('enf'); notificar('Simon se resfrió. Dale jarabe o abrígalo.');
    toast('Simon se resfrió: dale JARABE (tienda) o ponle bufanda o capa'); sfx.no();
    decir('Sí... ¡achú!', e.traductor ? 'Me siento raro... tengo frío.' : null, 3600); sustoHasta = tk + 6; guardar();
    proxEstornudoT = Date.now() + 60000;
    if (!e.enfVisto) { e.enfVisto = 1; guardar(); setTimeout(introEnf, 4500); }
  }
  function introEnf() {   // primera vez que se resfría: Cortex explica qué pasa y cómo curarlo
    if (!e.enf) { evQuitar('introEnf'); return; }
    if (!eventoLibre(EV_INTD)) { evAgregar('introEnf', 30, () => e.enf && eventoLibre(EV_INTD), introEnf); return; }
    let tienda = false;
    document.body.classList.add('tut');
    cortexCamina(() => dialogo([
      C('Oí estornudar a Simon... ¿se resfrió?'),
      C('Pasa cuando se le descuida por 3 días o más: con hambre, sueño o tristeza.'),
      S(),
      T('Achú... tengo frío.'),
      CT('Hay varias formas de curarlo. La más rápida es el JARABE, que se compra en la tienda.', '#btn-tienda'),
      C('También puedes abrigarlo con una bufanda o una capa, y se le pasará en un ratito.'),
      C('O dejarlo dormir: al despertar ya estará mejor. Y si no haces nada, se cura solo en unas horas.'),
      C('Mientras esté resfriado no podrá jugar. ¡Cuídalo mucho!'),
      { q: 'CORTEX', t: '¿Quieres ir por el jarabe ahora?', op: ['Ver la tienda', 'Más tarde'],
        res: [[{ q: 'TU', t: 'Ver la tienda', fn: () => { tienda = true; } }], [{ q: 'TU', t: 'Más tarde' }]] }
    ], () => { tutRes(null); document.body.classList.remove('tut'); cortexSale(() => { guardar(); if (tienda) { tab = 'extras'; tv = 'cat'; tvPre = true; abrir('tienda'); } }); }), .07);
  }
  function curar(modo) {
    if (!e.enf) return;
    e.enf = 0; e.enfAb = 0; e.malS = 0; e.descuidadoDesde = null; e.abandonoDesde = null;   // al curarse, el conteo de descuido (3 días) vuelve a empezar: si no, se reenferma al instante
    dx('curo'); notificar('Simon se curó del resfriado.'); sfx.regalo(); corazones(3); estrellas(4); gesto('salto'); hablar();
    toast(modo === 'jarabe' ? '¡El jarabe funcionó! Simon se curó' : modo === 'abrigo' ? '¡Abrigadito! Simon se curó' : modo === 'sueno' ? 'Con el sueño se le pasó el resfriado' : 'Simon ya se siente mejor');
    decir('Sí.', e.traductor ? '¡Ya me siento mejor! Gracias.' : null, 3200); guardar();
  }
  function diasDescuidado() {
    if (!e) return 0;
    if (e.abandonoDesde) {
      return Math.max(0, (Date.now() - e.abandonoDesde) / 86400000);
    }
    if (e.descuidadoDesde) {
      return Math.max(0, (Date.now() - e.descuidadoDesde) / 86400000);
    }
    if (typeof ausenciaH === 'number' && ausenciaH >= 72) {
      const tiempoEnCeroHoras = Math.max(0, ausenciaH - 25);
      return tiempoEnCeroHoras / 24;
    }
    return 0;
  }
  function checkEnf() {
    if (!e.intro || introActiva || nivel() < 3) return;
    if (e.enf) {
      if (abrigado()) e.enfAb += e.dormido ? 15 : 5;
      if (e.enfAb >= 600) return curar('abrigo');
      if (ahora() - e.enf > 3 * 3600000) return curar('tiempo');
      return;
    }
    // Seguimiento del estado descuidado
    const mal = (e.hambre < 15 ? 1 : 0) + (e.energia < 15 ? 1 : 0) + (e.feliz < 15 ? 1 : 0);
    const estaDescuidado = mal >= 2 || e.hambre < 6 || e.feliz < 6 || (e.hambre <= 0 && e.feliz <= 0 && e.energia <= 0);
    if (estaDescuidado) {
      if (!e.descuidadoDesde && !e.abandonoDesde) e.descuidadoDesde = Date.now();
    } else {
      e.descuidadoDesde = null;
    }
    // El resfriado solo puede aparecer si el jugador tiene descuidado a Simon 3 días o más
    const cfgEnf = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.resfriado) || {};
    const dMin = cfgEnf.diasDescuidadoMinimos !== undefined ? cfgEnf.diasDescuidadoMinimos : 3;
    const descuidado3Dias = (typeof nivelAbandono === 'function' && nivelAbandono() >= 1) || (diasDescuidado() >= dMin);
    if (descuidado3Dias) {
      enfermar();
    }
  }
  function medClick(a) {
    if (a === 'med_comprar') {
      if (e.monedas < MED_PRECIO) { faltanMon(MED_PRECIO - e.monedas); sfx.no(); return; }
      if ((e.meds || 0) >= 9) { toast('Ya tienes suficientes'); return; }
      e.monedas -= MED_PRECIO; animarMonedas(MED_PRECIO, true); e.meds = (e.meds || 0) + 1; e.st.compras++; sfx.compra(); toast('¡COMPRASTE: JARABE!'); pintar(); guardar(); render();
    } else if (a === 'med_usar') {
      if (!e.enf) { toast('Simon no está resfriado'); sfx.no(); return; }
      if (!(e.meds > 0)) return;
      e.meds--; curar('jarabe'); pintar(); render();
    }
  }
