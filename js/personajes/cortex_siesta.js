  /* ===================== SIESTA DE CORTEX ===================== */
  function checkSiesta() {
    if (!eventoLibre(EV_SIE)) return;
    if (!e.proxSiesta) { e.proxSiesta = ahora() + (1 + Math.random() * 2) * 3600000; return; }
    const h = new Date(ahora()).getHours();
    if (ahora() < e.proxSiesta || h < 10 || h >= 22 || Math.random() > .25) return;
    iniciarSiesta();
  }
  function iniciarSiesta() {
    e.proxSiesta = ahora() + (3 + Math.random() * 3) * 3600000; act = null; dx('siesta'); notificar('Cortex se quedó dormido en tu recámara.'); guardar();
    cortexEntra(() => dialogo([C('Uf... qué día. Voy a sentarme un ratito aquí.'),
      { q: 'CORTEX', t: '...solo cierro los ojos un segundito...', pre: () => { desc = { fin: ahora() + 150000, siesta: true, zzz: true, toques: 0 }; bm = null; } },
      C('Zzz... zzz...')], () => { pintar(); bombaTick(); decir('Sí.', e.traductor ? 'Shhh... Cortex se durmió.' : null, 3200); hablar(); }));
  }
  function siestaToque() {
    const n = desc.toques++;
    if (n === 0) dialogo([C('Mmm... no, yo no me comí el keke... zzz'), S(), T('Sí se lo comió. ¿Y si lo explotamos?')], bombaTick);
    else if (n === 1) dialogo([C('¡Mamá! ...cinco minutitos más... zzz'), S(), T('Cortex dice cosas raras cuando duerme.')], bombaTick);
    else if (n === 2) dialogo([{ q: 'CORTEX', t: '*abraza a Simon creyendo que es una almohada*', fn: () => { corazones(3); sfx.regalo(); gesto('besos'); } }, S(), T('Me aprieta mucho. Pero está bien.'), C('Qué suave... zzz')], bombaTick);
    else {
      dialogo([{ q: 'CORTEX', t: '¡¿Quién me toca?! ...Ah. Eran ustedes.', pre: () => { desc.zzz = false; bm = { fase: 'adios', t: 0 }; bombaTick(); } }, C('Me quedé dormido... ¿tenía baba en la mejilla?'), S(), T('Un poquito.'), C('Jaja. Gracias por dejarme dormir. Hasta pronto.')], () => cortexSale(finDesc));
    }
  }
  // (LV_MEM definido en dialogos.js)

  // (LV_RESP definido en dialogos.js)
  function checkMem() {
    if (!e.memPend.length || !eventoLibre(EV_MEMR)) return;
    const n = e.memPend.shift(); guardar();
    dialogo([C('¡Me llegó la noticia: Simon subió al nivel ' + n + '!'), C(LV_MEM[n] || 'Cada día que pasa, lo quiero más.'), S(), T(elige(LV_RESP))]);
  }

