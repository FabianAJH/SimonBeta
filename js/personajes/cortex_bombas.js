  /* ===================== CORTEX: BOMBAS, EXPLOSIONES Y DESCANSO ===================== */
  // (BOMBA_PRECIO, BOMBA_DESC, BOMBA_MAX, VUELO definidos en config.js)
  // (FRASES_BOMBA definido en dialogos.js)
  // (TRAD_BOMBA definido en dialogos.js)
  // (HITOS_BOMBA definido en dialogos.js)
  // (FR_TIPO definido en dialogos.js)
  // (TR_TIPO definido en dialogos.js)
  function lineasBomba() {
    const n = e.st.bombas, tipo = (bm && bm.tipo) || 'clasica'; let i = 0, fr;
    if (FR_TIPO[tipo]) fr = elige(FR_TIPO[tipo]);
    else { do { i = Math.floor(Math.random() * FRASES_BOMBA.length); } while (i === e.ultBomba); e.ultBomba = i; fr = FRASES_BOMBA[i]; }
    e.ultBombaT = ahora();
    const sies = desc && desc.siesta && desc.dormiaAlBoom;
    const l = [];
    if (sies) l.push(C('¡¡AAAAH!! ¡¡Estaba durmiendo!!'));
    l.push(C(fr), S(), T(elige(TR_TIPO[tipo] || TRAD_BOMBA)));
    if (HITOS_BOMBA[n]) l.push(C(HITOS_BOMBA[n]));
    else if (Math.random() < .3) l.push(C('Van ' + n + ' veces que me explotas. Llevo la cuenta, ¿eh?'));
    l.push(C('...Ay, Simon. Ven acá, cabezón.'),
      { q: 'CORTEX', t: '*le acaricia la cabeza con cariño*', fn: () => { corazones(4); gesto('besos'); sfx.regalo(); } },
      C('Nos vemos pronto. Guarda las bombas un ratito, ¿sí?'));
    pelucheBombasLineas(l, n);   // 3 bombas: Cortex regala su peluche (secretos/04_peluche_cortex.js)
    return l;
  }
  function descansoIniciar() { desc = { fin: ahora() + BOMBA_DESC }; bm = null; bombaTick(); }
  function finDesc() { hollin = false; desc = null; bm = null; pintar(); guardar(); bombaTick(); }
  function bombaTick() {
    const bt = $('t-bomba'), ch = $('t-cortex');
    const esComerciante = (typeof mercPres !== 'undefined' && mercPres) || (typeof mercInfo === 'function' && mercInfo().est === 'aqui');
    const enSala = typeof escenaId === 'function' ? (escenaId() === 'sala' && !lugar) : true;
    if (!desc || esComerciante || !enSala) { if (bt) bt.classList.add('oculto'); if (!desc) return; }
    if (desc && ahora() >= desc.fin) { finDesc(); return; }
    const aqui = cortex.p >= 1 && !cortex.dir;
    if (aqui && enSala && !bm && !esComerciante) {
      ch.classList.remove('oculto', 'gris', 'lista'); $('v-cortex').textContent = mmss(Math.max(0, desc.fin - ahora()));
      dibIcono($('ic-cortex'), 'ic_zz', FX.z);
    }
    // El botón de tirar la bomba SOLO debe salir cuando Cortex está de visita en la recámara, NUNCA cuando es comerciante ni cuando no está
    const ver = aqui && enSala && !bm && !dlg && !modal && !esComerciante && !!desc;
    if (bt) {
      bt.classList.toggle('oculto', !ver);
      if (ver) { $('v-bomba').textContent = 'x' + (e.bombas || 0); bt.classList.toggle('gris', !(e.bombas > 0)); dibIcono($('ic-bomba'), 'ic_bomba', FGRID.bomba); }
    }
    if (aqui && !bm && !dlg && !modal && ahora() >= desc.fin) {
      bm = { fase: 'adios', t: 0 };
      if (desc.siesta && desc.zzz) dialogo([{ q: 'CORTEX', t: '¡Mmh! ...¿Me quedé dormido? ¿Cuánto tiempo pasó?', pre: () => { desc.zzz = false; } }, S(), T('Roncabas muy bonito.'), C('Jaja. Gracias por dejarme dormir, Simon. Hasta pronto.')], () => cortexSale(finDesc));
      else dialogo([C('Ya descansé. ¡Gracias por la compañía!'), C('Bueno, ya me voy, Simon.')], () => cortexSale(finDesc));
    }
  }
  function lanzarBomba() {
    const esComerciante = (typeof mercPres !== 'undefined' && mercPres) || (typeof mercInfo === 'function' && mercInfo().est === 'aqui');
    const enSala = typeof escenaId === 'function' ? (escenaId() === 'sala' && !lugar) : true;
    if (!desc || esComerciante || !enSala || bm || dlg || modal || cortex.p < 1 || cortex.dir) return;
    sfx.click();
    if (e.dormido) { decir('Zzz...'); sfx.no(); return; }
    if (!(e.bombas > 0)) { toast('NO TIENES BOMBAS: TIENDA > EXTRAS'); sfx.no(); return; }
    e.bombas--; act = null; bm = { fase: 'vuelo', t: 0, tipo: elegirBomba() };
    decir('Sí.', e.traductor ? '¡Esto va a ser divertido!' : null, 2600); hablar(); gesto('salto'); guardar(); bombaTick();
  }
  const BOMBAS_T = [['clasica', 38, 'CLÁSICA'], ['confeti', 18, 'CONFETI'], ['fuegos', 16, 'FUEGOS ARTIFICIALES'], ['pastel', 14, 'PASTEL'], ['monedas', 8, 'MONEDAS'], ['gigante', 6, 'GIGANTE']];
  function elegirBomba() {
    const tira = () => { let r = Math.random() * 100; for (const [id, w] of BOMBAS_T) { if ((r -= w) < 0) return id; } return 'clasica'; };
    let t = tira(); if (t === e.ultBombaTipo) t = tira();
    e.ultBombaTipo = t; return t;
  }
  function chispas(x, y, n, vel, g, vida, tipos) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = vel * (.4 + Math.random() * .6); fx.push({ tipo: tipos ? tipos[Math.floor(Math.random() * tipos.length)] : 'cf' + Math.floor(Math.random() * 6), x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .5, vida: vida + Math.floor(Math.random() * 8), t: 0, g }); } }
  function explotar() {
    const tipo = bm.tipo || 'clasica';
    bm.fase = 'boom'; bm.t = 0; bm.dur = tipo === 'fuegos' ? 32 : tipo === 'gigante' ? 20 : 16; hollin = (tipo === 'clasica' || tipo === 'gigante') ? true : tipo === 'pastel' ? 'crema' : false;
    if (!e.bombasVistas) e.bombasVistas = {};
    if (!e.bombasVistas[tipo]) { e.bombasVistas[tipo] = 1; if (tipo !== 'clasica') notificar('¡Nuevo tipo de bomba: ' + BOMBAS_T.find(b => b[0] === tipo)[2] + '! Ya has visto ' + Object.keys(e.bombasVistas).length + ' de ' + BOMBAS_T.length + '.'); } if (desc) { desc.dormiaAlBoom = !!desc.zzz; desc.zzz = false; }
    $('flash').classList.remove('on'); void $('flash').offsetWidth; $('flash').classList.add('on');
    const es = $('escena'); es.classList.remove('sacude'); void es.offsetWidth; es.classList.add('sacude'); setTimeout(() => es.classList.remove('sacude'), 700);
    const tx = cxb() + 30, ty = SY + SH - 34;
    if (tipo === 'clasica' || tipo === 'gigante') {
      const gg = tipo === 'gigante'; gg ? sfx.gigante() : sfx.boom();
      for (let i = 0; i < (gg ? 26 : 9); i++) { const a = Math.random() * 6.28, v = (gg ? 1.6 : 1) + Math.random() * (gg ? 3.4 : 2.2); lanzar(i % 3 ? 'estrella' : 'humo', tx + Math.cos(a) * 6, ty + Math.sin(a) * 6, Math.cos(a) * v, Math.sin(a) * v - .6, 12 + (i % 4) * 3); }
      if (gg) { es.classList.remove('sacude'); void es.offsetWidth; es.classList.add('sacude'); setTimeout(() => es.classList.remove('sacude'), 1100); }
    } else if (tipo === 'confeti') { sfx.pop(); chispas(tx, ty - 8, 44, 3.2, .09, 34); }
    else if (tipo === 'fuegos') { sfx.cohete(); chispas(tx, ty - 30, 16, 2.4, .05, 24); }
    else if (tipo === 'pastel') { sfx.splat(); chispas(tx, ty - 6, 22, 2.6, .12, 26, ['crema']); }
    else if (tipo === 'monedas') { sfx.moneda(); setTimeout(() => sfx.moneda(), 140); setTimeout(() => sfx.moneda(), 300); chispas(tx, ty - 24, 14, 1.8, .16, 40, ['moneda']); }
    e.st.bombas++; ganar(8 + ({ monedas: 15, gigante: 12, fuegos: 4, confeti: 4 }[tipo] || 0), 4, true); gesto('baile'); hablar(); decir('Sí.', e.traductor ? ({ confeti: '¡¡FIESTA!!', fuegos: '¡Qué bonito!', pastel: '¡¡SPLAT!!', monedas: '¡¡Dinero!!', gigante: '¡¡BOOOOOM!!' }[tipo] || '¡¡BOOM!!') : null, 3000); pintar(); guardar();
  }
  function bombaAvanza() {
    if (desc && !bm && !dlg && cortex.p >= 1 && tk % 16 === 0) lanzar('z', cxb() + 34, SY + SH - 70, .4, -1, 16);
    if (hollin === true && cortex.p > 0 && tk % 9 === 0) lanzar('humo', cxb() + 26 + Math.random() * 8, SY + SH - 62, .1, -.9, 14);
    if (!bm || bm.fase === 'adios') return;
    bm.t++;
    if (bm.fase === 'vuelo') { if (bm.t % 2 === 0) sfx.tic(); if (bm.t >= VUELO) explotar(); }
    if (bm.fase === 'boom' && bm.tipo === 'fuegos' && [3, 8, 13, 18, 23, 27].includes(bm.t)) { sfx.cohete(); const tx = cxb() + 30, ty = SY + SH - 34; chispas(tx + (Math.random() * 70 - 35), ty - 52 - Math.random() * 34, 18, 2.6, .05, 24, ['cf' + (bm.t % 6), 'cf' + ((bm.t + 2) % 6), 'cf5']); }
    if (bm.fase === 'boom' && bm.t >= (bm.dur || 16)) {
      bm.fase = 'habla';
      dialogo(lineasBomba(), () => cortexSale(finDesc));
    }
  }
  function dibujarBomba(cx, cy) {
    if (!bm) return;
    const tx = cx + 30, ty = cy + 40;
    if (bm.fase === 'vuelo') {
      const q = bm.t / VUELO, x = SX - 24 + 46 + (tx - (SX - 24 + 46)) * q, y = SY + 22 + (ty - (SY + 22)) * q - Math.sin(Math.PI * q) * 36;
      ctx.drawImage(sprite('bomba_v', FGRID.bomba, 0), Math.round(x - 6), Math.round(y - 7));
      ctx.fillStyle = tk % 2 ? '#ffe45a' : '#ff5a28'; ctx.fillRect(Math.round(x) + 3, Math.round(y) - 8, 2, 2);
    } else if (bm.fase === 'boom' && bm.t <= (bm.tipo === 'gigante' ? 16 : 12) && !['confeti', 'fuegos'].includes(bm.tipo)) {
      const gg = bm.tipo === 'gigante', cr = bm.tipo === 'pastel', mo = bm.tipo === 'monedas', M = gg ? 1.8 : cr || mo ? .7 : 1;
      const r = (bm.t < 5 ? 6 + bm.t * 5 : Math.max(2, 31 - (bm.t - 5) * 4)) * M;
      (cr ? [['#ffc8d8', 1], ['#fff6ea', .68], ['#ffffff', .34]] : mo ? [['#e8a820', 1], ['#ffd84a', .68], ['#fff6b0', .34]] : [['#ff6a28', 1], ['#ffd84a', .68], ['#ffffff', .34]]).forEach(([c, k]) => {
        ctx.fillStyle = c; const R2 = Math.round(r * k);
        for (let yy = -R2; yy <= R2; yy++) { const w = Math.round(Math.sqrt(R2 * R2 - yy * yy)); ctx.fillRect(tx - w, ty + yy, w * 2, 1); }
      });
    }
  }
  function cardBomba() {
    const n = e.bombas || 0;
    return `<div class="card"><div class="pv"><canvas data-prev="fd_bomba"></canvas></div><div class="cn">BOMBA</div><div style="font-size:6px;color:#4a5090;line-height:1.5">¡BOOM!</div><button class="bt ${e.monedas >= BOMBA_PRECIO ? 'ok' : 'no'}" data-a="b_comprar">$ ${BOMBA_PRECIO}</button><div style="font-size:6px;color:#4a5090">TIENES: ${n}</div></div>`;
  }
  function comprarBomba() {
    if (e.monedas < BOMBA_PRECIO) { faltanMon(BOMBA_PRECIO - e.monedas); sfx.no(); return; }
    if ((e.bombas || 0) >= BOMBA_MAX) { toast('Ya tienes demasiadas'); return; }
    e.monedas -= BOMBA_PRECIO; if (typeof animarMonedas === 'function') animarMonedas(BOMBA_PRECIO, true); e.bombas = (e.bombas || 0) + 1; e.st.compras++; sfx.compra(); toast('¡COMPRASTE: BOMBA!'); pintar(); guardar(); render();
  }
  $('t-bomba').onclick = lanzarBomba;
