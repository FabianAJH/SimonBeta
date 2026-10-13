  /* ===================== ANIMACIÓN ===================== */
  const cv = $('sc'), ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const SALTO = [-6, -12, -16, -12, -6, 0];
  let acar = null, acarT = 0;   // caricias: dedo moviéndose sobre Simon
  let tk = 0, saltoT = -1, bocaT = 0, parpadeoT = 0, gT = -1, gTipo = '';
  let act = null, proxAct = 60;
  const cortex = { p: 0, dir: 0, cb: null };
  const cxb = () => SX + 26;   // borde izquierdo de Cortex: siempre pegado a Simon, sea cual sea el ancho de la pantalla
  let dlg = null, introActiva = false;
  let avEn = false;
  function avisoSueno() { toast('SIMON ESTÁ CANSADO: DÉJALO DORMIR O DALE ALGO DE COMER'); }
  function noEst(msg) {
    const esc0 = escenaId();
    if (esc0 === 'estudio') { decir('Sí... (' + (msg || 'estoy en el estudio') + ')'); sfx.no(); return true; }
    if (esc0 === 'jardin') { toast('EN EL JARDÍN SOLO SE CUIDAN LAS PLANTAS'); sfx.no(); return true; }
    return false;
  }
