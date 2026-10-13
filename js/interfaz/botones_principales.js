  $('btn-comer').onclick = () => {
    if (guiaBloq('comida')) return;
    if (noEst('ahora toca estudiar, no comer')) return;
    if (e.dormido) { decir('Zzz...'); sfx.no(); return; }
    menuAbrir('comida');
  };
  if ($('btn-jugar')) $('btn-jugar').onclick = () => { if (guiaBloq('jugar')) return; if (noEst('ahora toca estudiar, no jugar')) return; accion(jugar); };
  $('btn-dormir').onclick = () => {
    if (guia && guia.paso === 'cansado') { if (!guia.cx && !modal && !act) { guia.cx = true; histBebida(); } else sfx.no(); return; }   // en el tutorial, dormir NO lo duerme: dispara la llegada de Cortex con la bebida
    if (guiaBloq('dormir')) return; if (noEst('yo duermo en mi recámara')) return; if (lugar) { decir('Sí. (mejor dormimos en casa)'); sfx.no(); return; } if (!e.dormido && e.hab !== 'sala') { decir('Sí... (yo duermo en mi recámara)'); sfx.no(); return; }
 if (e.dormido && e.hab !== 'sala') { toast('SIMON ESTÁ DURMIENDO EN LA RECÁMARA'); sfx.no(); return; } accion(dormir); };
  $('btn-dice').onclick = () => {
    if (dlg || tutMenuBloq('foto') || guiaBloq('foto')) return;
    if (noEst('ahora toca estudiar, no jugar')) return;
    if (e.dormido) { decir('Zzz...'); sfx.no(); return; }
    menuAbrir('dice');
  };
  function alternaSonido() { e.mudo = !e.mudo; if (!e.mudo) { audio(); sfx.click(); } lluviaCheck(); pintar(); guardar(); }
