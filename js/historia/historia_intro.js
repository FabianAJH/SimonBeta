  /* ===================== HISTORIA: EL INICIO DE SIMON ===================== */
  function calleGrid(W, H, RY) {
    const g = Grid(W, H), HY = RY + 8, WT = HY - 34;
    const SK = ['#4a4a82', '#5a5a92', '#6e68a0', '#8478a8', '#a088b0', '#b898b4'], bh = Math.max(6, (WT + 4) / 6);
    for (let y = 0; y < HY; y++) for (let x = 0; x < W; x++) g.set(x, y, SK[Math.min(5, Math.floor(y / bh))]);
    [[0, 16, 20], [16, 12, 12], [28, 18, 26], [46, 14, 14], [60, 20, 22], [80, 12, 10], [92, 18, 28], [110, 20, 16]].forEach(([x, w, h], i) => {
      g.rect(x, WT - h, w, h + 2, '#3a3868');
      for (let wy = WT - h + 3; wy < WT - 2; wy += 5) for (let wx = x + 2; wx < x + w - 2; wx += 5) g.rect(wx, wy, 2, 3, ((wx * 7 + wy * 3 + i) % 5 < 2) ? '#ffd878' : '#2a2850');
    });
    // muro de ladrillos
    for (let y = WT; y < HY + 2; y++) for (let x = 0; x < W; x++) { const r = ((y - WT) / 4) | 0, mort = (y - WT) % 4 === 0 || (x + (r % 2) * 5) % 10 === 0; g.set(x, y, mort ? '#5a3848' : ((x * 7 + y * 13) % 11 === 0 ? '#8a6070' : '#7a5060')); }
    g.rect(0, WT, W, 2, '#9a7080'); g.rect(0, WT + 2, W, 1, '#b08a98');
    g.rect(78, HY - 28, 20, 15, '#4a3040'); g.rect(80, HY - 26, 16, 11, '#1e1a34'); for (let x = 82; x < 96; x += 4) g.rect(x, HY - 26, 1, 11, '#4a3040'); g.rect(80, HY - 26, 16, 2, '#2a2646');
    g.rect(38, HY - 26, 12, 14, '#e8d8a0'); g.rect(38, HY - 26, 12, 1, '#c8b880'); for (let y = HY - 23; y < HY - 14; y += 3) g.rect(40, y, 8, 1, '#8a7a5a');
    g.rect(104, WT + 2, 5, HY - WT, '#5a5a74'); g.rect(104, WT + 2, 1, HY - WT, '#7a7a98'); g.rect(103, HY - 12, 7, 2, '#4a4a64');
    g.rect(0, HY, W, 2, '#4a3040');
    // acera
    for (let y = HY + 2; y < H; y++) for (let x = 0; x < W; x++) {
      const dy = y - HY - 2; let c = dy < 3 ? '#b0aec8' : dy < 4 ? '#9a98b4' : '#8e8caa';
      if (dy >= 4 && ((dy - 4) % 16 === 0 || (x + ((((dy - 4) / 16) | 0) % 2) * 20) % 40 === 0)) c = '#7a7898';
      if (dy >= 4 && (x * 5 + y * 11) % 23 === 0) c = '#9c9ab8';
      g.set(x, y, c);
    }
    [[30, 34, 11, 2], [92, 60, 14, 2]].forEach(([cx, dy, rx, ry]) => { for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x / rx) ** 2 + (y / ry) ** 2 <= 1) g.set(cx + x, HY + dy + y, y === -ry + 0 && x % 3 === 0 ? '#d0e4ff' : '#a8c4e8'); });
    // farol
    g.rect(16, HY - 50, 2, 54, '#26263c'); g.rect(12, HY - 54, 10, 5, '#26263c'); g.rect(13, HY - 49, 8, 2, '#ffe9a0'); g.rect(12, HY - 56, 10, 2, '#3a3a58'); g.rect(14, HY + 2, 6, 3, '#26263c');
    return g;
  }
  function boteGrid() {
    const g = Grid(22, 30), AC = ['#d0d8e8', '#8a94ac', '#5a6480', '#363e58'];
    capa(g, '#14141f', L => sombrear(L, (x, y) => y >= 5 && y <= 29 && Math.abs(x + .5 - 11) <= 9.6 - (y - 5) * .06, 11, 18, 10, 14, AC));
    for (let y = 8; y <= 28; y++) [5, 11, 17].forEach(x => g.set(x, y, '#363e58'));
    capa(g, '#14141f', L => { L.rect(1, 2, 20, 4, AC[1]); L.rect(1, 2, 20, 1, AC[0]); L.rect(1, 5, 20, 1, AC[3]); L.rect(8, 0, 6, 2, AC[2]); L.rect(8, 0, 6, 1, AC[0]); });
    g.rect(3, 1, 4, 1, '#e8e8d0'); g.rect(15, 1, 3, 1, '#ffd84a'); g.set(16, 0, '#ffd84a'); g.rect(18, 2, 2, 1, '#d04a4a');
    return g;
  }
  function bolsasGrid() {
    const g = Grid(30, 22), N = ['#6a6a88', '#3a3a52', '#22222f', '#12121c'], V = ['#6aaa7a', '#2f6a42', '#1f4a2e', '#10281a'];
    capa(g, '#0a0a12', L => sombrear(L, elipse(9, 15, 9, 6.6), 9, 15, 9, 6.6, N));
    capa(g, '#06140c', L => sombrear(L, elipse(21, 16, 8, 5.8), 21, 16, 8, 5.8, V));
    capa(g, '#0a0a12', L => sombrear(L, elipse(14, 8, 6.4, 5.2), 14, 8, 6.4, 5.2, N));
    [[8, 8], [20, 10], [14, 2]].forEach(([x, y]) => { g.rect(x, y, 3, 2, '#12121c'); g.set(x + 1, y - 1, '#12121c'); });
    g.rect(2, 18, 4, 3, '#e8e8d0'); g.set(2, 18, '#fff'); g.rect(25, 19, 3, 2, '#d04a4a'); g.rect(11, 20, 5, 1, '#ffd84a');
    return g;
  }
  function calleFondo() {
    ctx.drawImage(sprite('calle' + LW + 'x' + LH, () => calleGrid(LW, LH, RY), 0), 0, 0);
    const ly = RY + 8 - 49, fl = ((tk >> 3) % 17 === 0) ? .5 : 1;
    for (let k = 0; k < 3; k++) { const r = 16 + k * 9; ctx.fillStyle = 'rgba(255,224,140,' + (.07 * fl).toFixed(3) + ')'; for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); ctx.fillRect(17 - w, ly + y, w * 2, 1); } }
    const bs = sprite('calle_bote', boteGrid, 0), bo = sprite('calle_bolsas', bolsasGrid, 0), base = SY + SH - 3;
    ctx.fillStyle = 'rgba(30,12,40,.34)';
    [[SX + 73, 11], [SX - 15, 13]].forEach(([cx, w]) => { for (let y = -2; y <= 2; y++) { const ww = Math.round(w * Math.sqrt(1 - (y / 2.8) ** 2)); ctx.fillRect(cx - ww, base + y, ww * 2, 1); } });
    ctx.drawImage(bo, SX - 30, base - bo.height + 1); ctx.drawImage(bs, SX + 62, base - bs.height + 1);
  }
  function calleLluvia() {
    ctx.fillStyle = 'rgba(200,214,255,.6)';
    for (let i = 0; i < 40; i++) { const x = (i * 37 + tk * 2) % (LW + 12) - 6, y = (i * 53 + tk * 6) % (LH + 8) - 4; ctx.fillRect(x, y, 1, 3); if (i % 3 === 0) ctx.fillRect(x + 1, y + 3, 1, 1); }
  }
  // ---------- guía interactiva del comienzo ----------
  var guia = null;
  // (GUIA definido en dialogos.js)
  function guiaBloq(tipo) {   // durante el tutorial guiado (comer/jugar/dormir) solo deja usar el botón del paso indicado
    if (!guia || !guia.paso) return false;
    const p = guia.paso;
    if ((p === 'comer' || p === 'bebida') && tipo === 'comida') return false;
    if (p === 'jugar' && tipo === 'jugar') return false;
    if (p === 'cansado' && tipo === 'dormir') return false;
    toast(p === 'jugar' ? 'TOCA O AVIENTA EL JUGUETE DE SIMON EN EL SUELO' : 'PRIMERO: ' + GUIA[p][1]);
    sfx.no();
    return true;
  }
  if (typeof window !== 'undefined') window.guiaBloq = guiaBloq;

  function tutMenuBloq(tipo) {
    if (dlg) return true;
    if ((calle && !e.intro) || !e.nombre) { sfx.no(); return true; }
    return false;
  }
  if (typeof window !== 'undefined') window.tutMenuBloq = tutMenuBloq;

  function menuAbrir(tipo, fnAbrir) {
    if (dlg) return;
    if (tutMenuBloq(tipo)) return;
    if (guiaBloq(tipo)) return;
    if (modal) {
      if (modal === 'editar' || ['run', 'mem', 'rt'].includes(modal)) return;
      if (modal === tipo) { cerrar(); return; }
      cerrar(false);
      sfx.click();
      if (fnAbrir) fnAbrir();
      else abrir(tipo, false);
      return;
    }
    sfx.click();
    if (fnAbrir) fnAbrir();
    else abrir(tipo);
  }
  function guiaPintar() {
    const b = $('guia');
    if (!guia || !guia.paso) { b.classList.remove('on'); tutRes(null); return; }
    const t = GUIA[guia.paso]; b.innerHTML = '<i>' + t[0] + '</i><b>' + t[1] + '</b><small>' + t[2] + '</small>';
    b.classList.add('on'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  }
  function guiaIr(p) {
    e.hist = { comer: 2, jugar: 3, cansado: 4, bebida: 5 }[p]; guardar();
    guia = { paso: p, t0: Date.now(), base: p === 'comer' ? e.st.comer : p === 'jugar' ? e.st.jugar : 0, cx: false };
    if (p === 'jugar') {
      if (e.energia < 8) e.energia = 12;
      const tieneJ = e.deco && e.deco.some(d => ITEMS[d.k] && ITEMS[d.k].slot === 'juguete' && (d.h || 'sala') === 'sala');
      if (!tieneJ) {
        if (!e.deco) e.deco = [];
        e.deco.push({ k: 'juguete_pelota', x: -10, y: 77, f: 0, h: 'sala' });
      }
    }
    sfx.click(); guiaPintar(); guiaMarca();
    if (p === 'cansado') decir('Sí...', null, 3500);
  }
  function guiaMarca() {
    if (!guia) { tutRes(null); return; }
    if (guia.paso === 'cansado') { if (!guia.cx) tutRes('#btn-dormir'); else tutRes(null); return; }
    const p = guia.paso, sel = p === 'jugar' ? null : (modal === 'comida' ? '[data-a="f_dar"][data-k="' + (p === 'bebida' ? 'bebida' : 'keke') + '"]' : '#btn-comer');
    if (!sel) { tutRes(null); return; }
    const el = document.querySelector(sel); if (el && el.classList.contains('resalta') && document.querySelectorAll('.resalta').length === 1) return;
    tutRes(sel);
  }
  function guiaTick() {
    if (!guia) return;
    $('guia').style.visibility = dlg || (modal && modal !== 'comida') ? 'hidden' : 'visible';
    guiaMarca();
    if (dlg || cortex.p || cortex.dir) return;
    const p = guia.paso;
    if (p === 'comer') { const sm = $('guia').querySelector('small'); if (sm) sm.textContent = 'DALE KEKES HASTA LLENAR SU BARRA: ' + Math.round(e.hambre) + '%'; if (e.st.comer > guia.base && e.hambre >= 92) { if (modal) cerrar(); guiaIr('jugar'); } }
    else if (p === 'jugar') { if (e.energia < 5) e.energia = 12; if (e.st.jugar > guia.base) { if (modal) cerrar(); guiaIr('cansado'); } }
    else if (p === 'cansado' && Date.now() - guia.t0 > 4500 && !modal && !act && !guia.cx) { guia.cx = true; histBebida(); }
    else if (p === 'bebida' && (e.comida.bebida || 0) < 3) { if (modal) cerrar(); guia = null; guiaPintar(); histFinal(); }
  }
  function cortexCamina(cb, v) { cortex.suave = true; cortex.v = v || .06; cortex.dir = 1; cortex.cb = () => { cortex.v = 0; if (cb) cb(); }; }
// (SS definido en dialogos.js)
  function histCalle() {
    calle = true; sinCorona = true; document.body.classList.add('calle'); lluviaCheck(); e.hab = 'sala'; lugar = null;
    e.hambre = 0; e.energia = 0; e.feliz = 0; e.limp = 0; e.t = Date.now(); pintarNav(); pintar(); dibujar();
    setTimeout(() => { decir('Sí...', null, 3600); }, 1800);
    setTimeout(() => cortexCamina(() => dialogo([
      C('¿Hay alguien junto a ese bote de basura?'),
      C('¡Oye! ¿Estás bien? Te ves flaquito y con sueño.'),
      SS(),
      C('Solo dices "sí"... pero se nota que estás triste.'),
      C('No puedo dejarte aquí. Yo te saco de esta calle.'),
      C('Ven conmigo y seremos mejores amigos. ¿Qué dices?'),
      { q: 'SIMON', t: '¡Sí!', fn: () => { e.feliz = Math.max(e.feliz, 30); bocaT = 15; gesto('salto'); corazones(4); sfx.regalo(); pintar(); } },
      C('Jaja, otra vez "sí". En mi tierra, "Simon" significa "sí".'),
      C('Ese será tu nombre: Simon. ¡Trato hecho!')
    ], histLlegada), .035), 5400);
  }
  function histLlegada() {
    const f = $('fundido'); f.classList.add('on'); cortex.dir = 0;
    setTimeout(() => { calle = false; cortex.suave = false; cortex.p = 0; document.body.classList.remove('calle'); e.hist = 1; guardar(); pintarNav(); dibujar(); lluviaCheck(); f.classList.remove('on'); setTimeout(histCasa, 800); }, 500);
  }
  function introMueble(k) {   // primera compra de un mueble: solo muestra la flecha al botón de editar casa
    tutRes('#b-editar');
  }
  function histCasa() {
    cortexCamina(() => dialogo([
      C('Bienvenido a tu nueva casa, Simon.'),
      SS(),
      { q: 'SIMON', t: '¡Sí!', fn: () => { bocaT = 15; hablar(); } },
      { q: 'CORTEX', t: 'Toma una corona: símbolo de nuestra amistad.', fn: () => { sinCorona = false; sfx.regalo(); estrellas(12); corazones(5); gesto('salto'); pintar(); } },
      { q: 'SIMON', t: '¡Sí!', fn: () => { bocaT = 15; hablar(); } },
      C('La casa no está terminada. Al subir de nivel, abriré zonas nuevas.'),
      C('Yo no puedo cuidarlo todo el día. Él necesita a alguien como tú.'),
      C('Dime, ¿cómo te llamas?')
    ], () => pedirNombre(() => dialogo([
      C('Mucho gusto, {n}.'),
      S(),
      { q: 'CORTEX', t: '¿Puedes encargarte de Simon, {n}?', op: ['¡Claro!', 'Mmm... ¿yo?'],
        res: [[{ q: 'TU', t: '¡Claro!' }, C('¡Sabía que dirías eso!')],
              [{ q: 'TU', t: 'Mmm... ¿yo?' }, C('Sí, tú. Yo te ayudo.')]] },
      C('Míralo: hambriento, cansado y triste. Atiéndelo, ¡ya vuelvo!')
    ], () => cortexSale(() => guiaIr('comer'))))), .06);
  }
  function histBebida() {
    cortexCamina(() => dialogo([
      C('Uy, Simon está agotado. Dormir para recuperar energía toma su tiempo...'),
      C('Para que no tengas que esperar tanto ahorita, te dejo esto.'),
      { q: 'CORTEX', t: '', fan: { g: () => FGRID.bebida(), t: '¡3 BEBIDAS ENERGETICAS!', d: 'Le devuelven toda la energia.' }, fn: () => { e.comida.bebida = 3; guardar(); } },
      C('Le devuelve la energía al instante, pero no siempre vas a tener bebidas a la mano.'),
      C('Lo normal es dejarlo dormir para que recupere energía. Dale una ahora.')
    ], () => cortexSale(() => guiaIr('bebida'))), .07);
  }
  function histFinal() {
    e.hist = 6; guardar();
    cortexCamina(() => dialogo([
      C('¡Mira, como nuevo!'),
      { q: 'SIMON', t: '¡Sí!', fn: () => { bocaT = 15; gesto('salto'); hablar(); corazones(3); } },
      C('Yo entiendo a Simon sin traductor. Nos conectamos desde el primer momento.'),
      C('Pero los demás no pueden. Por eso construí esto para ti, {n}.'),
      { q: 'CORTEX', t: '', fan: { c: () => sprite('ic_trad', iconoTrad, 0), t: '¡CONSEGUISTE EL TRADUCTOR!', d: 'Ahora entenderas lo que dice Simon.' }, fn: () => { e.traductor = true; guardar(); } },
      C('Pruébalo. Simon, ¿qué piensas de {n}?'),
      S(), T('Te quiero mucho, {n}.'),
      { q: 'SIMON', t: '¡Quiero keke!', fn: () => { bocaT = 15; gesto('salto'); hablar(); } },
      C('Jaja. El keke es su comida favorita.'),
      CT('Aquí ves su hambre, energía, felicidad y limpieza.', '.stats'),
      CT('Este círculo es su cariño. Al llenarlo, subes de nivel.', '.med'),
      CT('Vendré a visitarlos. Y una vez al día, como comerciante.'),
      C('Cuídalo mucho. ¡Y que no pierda la corona!')
    ], () => { tutRes(null); cortexSale(histListo); }), .07);
  }
  function histListo() {
    e.intro = true; e.hist = 7; e.tutUI = 1; introActiva = false; guia = null; guiaPintar();
    e.proxVisita = ahora() + 45 * 60000; e.cajaT = e.caja ? 0 : ahora() + 120000; e.proxSiesta = Math.max(e.proxSiesta || 0, ahora() + 2 * 3600000);
    proxAct = tk + 100; guardar(); pintar();
    setTimeout(() => { if (infoRegalo()) abrir('regalo'); }, 600);
  }
  function iniciarIntro() {
    introActiva = true; act = null; proxAct = tk + 99999;
    const h = e.hist || 0;
    if (h <= 0) { histCalle(); return; }
    calle = false; sinCorona = h <= 1;
    setTimeout(() => { if (h === 1) histCasa(); else if (h === 2) guiaIr('comer'); else if (h === 3) guiaIr('jugar'); else if (h === 4) guiaIr('cansado'); else if (h === 5) guiaIr('bebida'); else histFinal(); }, 900);
  }
  function escenaVisita() {
    const sc = [];
    if (ausenciaH >= 24) return { l: [C('¡Por fin volviste! Simon preguntaba por ti todo el día.'), S(), T('Te extrañé mucho.'),
      { q: 'CORTEX', t: 'Toma, una compensación por la espera: 30 monedas.', fn: () => ganar(30, 3, true) }] };
    const rx = reaccionCortex(); if (rx) return rx;
    const peso = ['saludo', 'charla', 'charla', 'regalo', 'consejo'];
    const k = peso[Math.floor(Math.random() * peso.length)];
    if (k === 'regalo') return { l: [{ q: 'CORTEX', t: 'Te traje algo que encontré en mis viajes.', fn: () => ganar(18 + Math.floor(Math.random() * 20), 3, true) }, S(), T('Gracias, Cortex.'), C('De nada.')] };
    if (k === 'consejo') { let i; do { i = Math.floor(Math.random() * TIPS.length); } while (i === e.ultTip && TIPS.length > 1); e.ultTip = i; return { l: [C('Un consejo de amigo:'), C(TIPS[i]), S(), T('Eso ya lo sabía.')] }; }
    if (k === 'charla') return { l: [C(saludoHora()), S(), C(CHARLAS[Math.floor(Math.random() * CHARLAS.length)])] };
    return { l: [C(saludoHora()), C('¿Cómo está Simon?'), S(), { q: 'TRADUCTOR', t: '«' + traducir('visita') + '»', fn: () => {} }, C('Cuídalo mucho.')] };
  }
  const elige = a => a[Math.floor(Math.random() * a.length)];
  function saludoHora() {
    const h = new Date(ahora()).getHours();
    if (h < 5) return elige(['¿Qué hacen despiertos a esta hora? Yo tampoco podía dormir.', 'Es de madrugada... y aquí estamos, los noctámbulos.']);
    if (h < 12) return elige(['¡Buenos días! Traigo energía y buen humor.', '¡Buen día! ¿Ya desayunó Simon?', 'Buenos días... ¿hay keke para el desayuno?']);
    if (h < 19) return elige(['¡Buenas tardes! Pasaba por aquí.', '¡Hola! Qué buena hora para visitar.', 'Buenas tardes. ¿Hay keke para la merienda?']);
    return elige(['¡Buenas noches! Vengo rapidito.', 'Ya casi es hora de dormir, ¿verdad, Simon?', 'La noche está linda. Perfecta para visitar.']);
  }
  // (ROPA_CORTEX definido en dialogos.js)
  function reaccionCortex() {
    if (e.enf) return { l: [C('¡Achú! Simon, ¿estás resfriado?'), S(), T('Tengo frío y la nariz tapada.'), { q: 'CORTEX', t: 'Toma, jarabe de mi abuela.', fn: () => curar('jarabe') }, C('Abrígalo más, ¿sí?')] };
    if (e.feliz < 15) return { l: [C('¡Simon! ¿Estás llorando?'), S(), T('Necesito un abrazo.'), { q: 'CORTEX', t: '*lo abraza fuerte*', fn: () => { e.feliz = clamp(e.feliz + 30); corazones(5); gesto('besos'); sfx.regalo(); } }, C('Ya, ya. Aquí estoy.')] };
    if (e.hambre < 30) return { l: [C('Se oye su estómago desde la puerta...'), S(), T('¡Quiero keke!'), { q: 'CORTEX', t: 'Traje keke de emergencia.', fn: () => { e.hambre = clamp(e.hambre + 35); gesto('salto'); sfx.regalo(); } }, C('¡Aliméntalo mejor, ¿sí?')] };
    if (e.energia < 25) return { l: [C('Simon, esas ojeras llegan al suelo.'), S(), T('Tengo muchísimo sueño.'), C('Déjalo dormir en su recámara.')] };
    const w = Object.values(e.ropa).filter(k => k && ROPA_CORTEX[k]);
    if (w.length && Math.random() < .45) return { l: [C(ROPA_CORTEX[elige(w)]), S(), T('Gracias. Me siento muy guapo.')] };
    if (e.st.bombas > 0 && ahora() - e.ultBombaT < 48 * 3600000 && Math.random() < .35) return { l: [C(elige(['Todavía me huele la ropa a pólvora...', 'Aún tengo hollín en las orejas de la última vez.', 'Cada vez que entro, reviso el techo por si cae una bomba.'])), S(), T(elige(['Eso fue hace poquito.', 'Qué buenos tiempos.', '¿Quieres que lo repita?'])), C('No. No quiero. ...Bueno, no hoy.')] };
    return null;
  }
  function iniciarVisita() {
    const esc = escenaVisita(); act = null; visPend = false; admVisita = false;
    esc.l.push(C('Me siento a descansar un ratito, ¿sí?'));
    cortexEntra(() => dialogo(esc.l, () => {
      e.proxSiesta = Math.max(e.proxSiesta || 0, ahora() + 2 * 3600000); e.st.visitas++; e.proxVisita = ahora() + (8 + Math.random() * 6) * 3600000; ausenciaH = 0; pintar(); guardar();
      descansoIniciar();
    }));
  }
  let admVisita = false;
  function visitaAdm() {
    if (desc || mercPres || cortex.p || cortex.dir) { toast('CORTEX YA ESTÁ AQUÍ'); return; }
    if (dlg) { admVisita = true; e.proxVisita = 0; toast('CORTEX LLEGA AL TERMINAR EL DIÁLOGO'); return; }
    if (escenaId() === 'sala' && !lugar && !cambiando) { notificar('Cortex vino de visita.'); iniciarVisita(); }
    else { admVisita = true; visPend = true; notificar('Cortex vino de visita. Te espera en la recámara.'); }
  }
  function checkVisita() {
    if (!eventoLibre(EV_VIS) || ahora() < e.proxVisita) return;
    if (!(escenaId() === 'sala' && !lugar)) { if (!visPend) { visPend = true; notificar('Cortex vino de visita. Te espera en la recámara.'); } return; }
    notificar('Cortex vino de visita.'); iniciarVisita();
  }

