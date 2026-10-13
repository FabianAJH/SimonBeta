  /* ===================== MINIJUEGO DE RITMO: BAILA CON SIMON ===================== */
  // (RT_COSTO, RT_NV, RT_DIV definidos en config.js)
  var hz = typeof hz !== 'undefined' ? hz : (n => 440 * Math.pow(2, (n - 69) / 12));
  const RT_STEP = .25, RT_PASOS = 144, RT_LEAD = 1.2, RT_V = 100, RT_Y = 150, RT_FIN = RT_LEAD + RT_PASOS * RT_STEP + .8, RT_SW = 26, RT_SH = 36;   // RT_SW/RT_SH: mismo tamaño que Atrapa el Keke
  const RT_ROOTS = [48, 45, 41, 43], RT_TERCIAS = [4, 3, 4, 4], RT_COL = ['#ff4a5c', '#ffd84a', '#4ac8ff'], RT_X = [16, 48, 80];   // RT_TERCIAS: la del acorde en LA (índice 1) es menor (3 semitonos), no mayor — antes sonaba desafinado porque se usaba +4 (tercera mayor) para los 4 acordes por igual, incluido el de LA menor
  var rt = null;
  const rtCv = $('rt-cv'), rtX = rtCv.getContext('2d'); rtCv.height = 176; rtX.imageSmoothingEnabled = false;
  function rtNotas() {
    let sd = hashStr('rt' + hoy()); const rnd = () => { sd = (Math.imul(sd, 1664525) + 1013904223) >>> 0; return sd / 4294967296; };
    const out = []; let lane = 1, prev = -9;
    for (let i = 8; i < RT_PASOS - 4; i++) {
      const dens = .3 + .3 * (i / RT_PASOS), fuerte = i % 4 === 0;
      if (rnd() < (fuerte ? dens + .35 : dens * .7)) {
        const r = rnd(); let l = r < .4 ? lane : r < .72 ? (lane + 1) % 3 : (lane + 2) % 3;
        if (i - prev === 1 && l === lane) l = (l + 1) % 3;
        lane = l; prev = i; out.push({ s: i, tn: RT_LEAD + i * RT_STEP, l, ok: 0 });
      }
    }
    return out;
  }
  const rtReloj = () => (rt && rt.aud ? ac.currentTime : performance.now() / 1000);
  const RT_CANCIONES = [   // catálogo de canciones para bailar; de momento solo una, pero queda listo para sumar más después
    { id: 'original', nombre: 'RITMO CLÁSICO', desc: 'La de siempre. ¡Síguele el paso!' }
  ];
  var rtCancionActual = RT_CANCIONES[0].id;
  function rtPintaMenu() {
    const cu = $('rt-canciones');
    cu.innerHTML = RT_CANCIONES.map(c => `<div class="card"><div class="pv"><canvas data-prev="rt_can_${c.id}"></canvas></div><div class="cn">${c.nombre}</div><div style="font-size:6px;color:#4a5090;line-height:1.4">${c.desc}</div><button class="bt ok rt-can" data-c="${c.id}">JUGAR</button></div>`).join('');
    if (typeof dibujarPrevCanvases === 'function') dibujarPrevCanvases(cu);
    cu.querySelectorAll('.rt-can').forEach(b => b.onclick = () => { sfx.click(); rtEmpezar(b.dataset.c); });
  }
  function rtIniciar() {   // ahora esto solo ABRE el menú para elegir canción; rtEmpezar() es la que arranca el baile
    if (e.dormido) { cerrar(); decir('Zzz...'); sfx.no(); return; }
    if (nivel() < RT_NV) { toast('Se desbloquea en cariño NV' + RT_NV); sfx.no(); return; }
    if (e.enf) { cerrar(); decir('Sí... ¡achú!', e.traductor ? 'Resfriado no puedo bailar.' : null, 3000); sfx.no(); return; }
    if (e.energia < RT_COSTO) { cerrar(); decir('Sí...', e.traductor ? 'Estoy muy cansado.' : null); hablar(); sfx.no(); avisoSueno(); return; }
    cerrar(false); $('rt-fin').classList.remove('on'); rtPintaMenu(); $('rt-menu').classList.add('on'); $('rt').classList.add('on');
  }
  function rtMenuSalir() { $('rt-menu').classList.remove('on'); $('rt').classList.remove('on'); pintar(); hablar(); if (typeof navPop === 'function') navPop(); }
  function rtCerrarVentana() { if (rt) rtSalir(); else rtMenuSalir(); }
  function rtEmpezar(id) {
    if (e.dormido || e.enf || e.energia < RT_COSTO) { rtMenuSalir(); return; }   // por si el estado cambió mientras el menú estaba abierto
    rtCancionActual = id || rtCancionActual;
    $('rt-menu').classList.remove('on');
    e.energia = clamp(e.energia - sifE(RT_COSTO)); pintar(); musicaOff(); lluviaOff();
    const a = !e.mudo && audio();
    rt = { notas: rtNotas(), pts: 0, combo: 0, mejor: 0, per: 0, bien: 0, fall: 0, t: 0, t0: 0, fin: false, raf: 0, aud: !!a, sig: 0, timer: 0, pad: [0, 0, 0], lado: 1, bail: 0, boca: 0 };
    rt.t0 = rtReloj() + .1;
    $('rt-fin').classList.remove('on'); $('rt').classList.add('on'); rtHud(); $('rt-juez').className = '';
    if (rt.aud) { rt.timer = setInterval(rtAgenda, 80); rtAgenda(); }
    rt.raf = requestAnimationFrame(rtLoop);
  }
  function rtHud() { $('rt-pts').textContent = rt.pts; $('rt-combo').textContent = rt.combo >= 2 ? 'x' + rt.combo : ''; }
  function rtJuez(t, col) { const j = $('rt-juez'); j.textContent = t; j.style.color = col; j.className = ''; void j.offsetWidth; j.className = 'on'; }
  function ruidoR(t, dur, vol) {
    try {
      const n = Math.floor(ac.sampleRate * dur), b = ac.createBuffer(1, n, ac.sampleRate), x = b.getChannelData(0);
      for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const sr = ac.createBufferSource(), g = ac.createGain(); sr.buffer = b; g.gain.value = vol; sr.connect(g); g.connect(ac.destination);
      sr.start(Math.max(ac.currentTime, t));
    } catch (_) {}
  }
  function rtPaso(st, t) {
    try {
      const ci = Math.floor(st / 16) % 4, r = RT_ROOTS[ci], ter = RT_TERCIAS[ci];
      if (st % 4 === 0) nota(hz(r), RT_STEP * 3.2, t, 'triangle', .09);
      if (st % 8 === 0) nota(80, .14, t, 'sine', .14);
      if (st % 2 === 0) nota(hz(r + 24 + [0, ter, 7, 12][(st >> 1) % 4]), RT_STEP * 1.6, t, 'square', .012);
      if (st % 4 === 2) ruidoR(t, .03, .05);
    } catch (_) {}
  }
  function rtAgenda() {
    if (!rt || !rt.aud || rt.fin) return;
    const lim = ac.currentTime + .45;
    while (rt.sig < RT_PASOS + 6) {
      const t = rt.t0 + RT_LEAD + rt.sig * RT_STEP; if (t > lim) break;
      if (t >= ac.currentTime - .05) rtPaso(rt.sig, t);
      rt.sig++;
    }
  }
  function rtTap(l) {
    if (!rt || rt.fin) return;
    const now = rt.t; rt.pad[l] = .12;
    let mejor = null, dm = 9;
    rt.notas.forEach(n => { if (n.l === l && !n.ok) { const d = Math.abs(n.tn - now); if (d < dm) { dm = d; mejor = n; } } });
    if (mejor && dm <= .17) {
      mejor.ok = 1; const per = dm <= .08;
      if (per) rt.per++; else rt.bien++;
      rt.combo++; rt.mejor = Math.max(rt.mejor, rt.combo); rt.pts += per ? 3 : 2; if (rt.combo % 10 === 0) { rt.pts += 5; }
      rt.lado = l; rt.bail = .25; rt.boca = .3;
      const st = Math.round((mejor.tn - RT_LEAD) / RT_STEP), ci = Math.floor(st / 16) % 4, rr = RT_ROOTS[ci], ter = RT_TERCIAS[ci];
      seq([hz(rr + 24 + [0, ter, 7][l] + (per ? 12 : 0))], .2, 'square', .05);
      rtJuez(per ? '¡PERFECTO!' : '¡BIEN!', per ? '#ffd84a' : '#9bf0a8');
      if (rt.combo % 10 === 0) { estrellas(0); }
    } else {
      rt.combo = 0; rt.pts = Math.max(0, rt.pts - 1); seq([110], .12, 'square', .03);
    }
    rtHud();
  }
  function rtLoop() {
    if (!rt) return;
    rt.t = rtReloj() - rt.t0;
    if (!rt.fin) {
      rt.notas.forEach(n => { if (!n.ok && rt.t > n.tn + .17) { n.ok = -1; rt.fall++; if (rt.combo >= 3) rtJuez('FALLÓ', '#ff6a78'); rt.combo = 0; rtHud(); } });
      for (let i = 0; i < 3; i++) if (rt.pad[i] > 0) rt.pad[i] -= .016;
      if (rt.bail > 0) rt.bail -= .016; if (rt.boca > 0) rt.boca -= .016;
      if (rt.t >= RT_FIN) rtFin();
    }
    rtDibuja();
    rt.raf = requestAnimationFrame(rtLoop);
  }
  function rtDibuja() {
    const c = rtX, W = 96, H = 176, t = rt.t, beat = Math.max(0, (t - RT_LEAD) / (RT_STEP * 4)), fb = beat - Math.floor(beat);
    c.fillStyle = '#2a1850'; c.fillRect(0, 0, W, H);
    [['#321c62', 0], ['#3a2272', 60]].forEach(([col, y]) => { c.fillStyle = col; c.fillRect(0, y, W, 60); });
    // luces del escenario
    const lc = ['#ff4a5c', '#ffd84a', '#4ac8ff'];
    for (let i = 0; i < 3; i++) { c.globalAlpha = (Math.floor(beat) % 3 === i ? .35 : .1) * (1 - fb * .6); c.fillStyle = lc[i]; c.fillRect(RT_X[i] - 15, 0, 30, RT_Y + 4); }
    c.globalAlpha = 1;
    // pista
    for (let y = 0; y < 4; y++) for (let x = 0; x < 6; x++) { c.fillStyle = (x + y + Math.floor(beat)) % 2 ? '#4a2a88' : '#5a34a0'; c.fillRect(x * 16, RT_Y + 12 + y * 4, 16, 4); }
    // Simon bailando
    const b = Math.abs(Math.sin(Math.max(0, t - RT_LEAD) / (RT_STEP * 4) * Math.PI)) * 3, esp = rt.bail > 0 ? (rt.lado - 1) * 5 : 0;
    const sp = sprite('simon_a' + (rt.boca > 0 ? 's' : 'n') + '|' + ropaSig() + '|0000', () => simonGrid('a', rt.boca > 0 ? 's' : 'n', e.ropa, {}), 0);
    const sw = RT_SW, sh = RT_SH, sx = 48 + esp - sw / 2, sy = 6 - b - (rt.bail > 0 ? 3 : 0);
    c.save(); if (rt.bail > 0 && rt.lado === 2) { c.translate(sx * 2 + sw, 0); c.scale(-1, 1); } c.drawImage(sp, 0, 0, 56, 78, Math.round(sx), Math.round(sy), sw, sh); c.restore();
    // carriles y pads
    for (let i = 0; i < 3; i++) {
      c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(RT_X[i] - 14, 0, 28, RT_Y);
      c.fillStyle = RT_COL[i]; c.globalAlpha = rt.pad[i] > 0 ? 1 : .55; c.fillRect(RT_X[i] - 13, RT_Y, 26, 6); c.globalAlpha = 1;
      c.fillStyle = '#ffffff'; c.fillRect(RT_X[i] - 13, RT_Y, 26, 1);
    }
    rt.notas.forEach(n => {
      if (n.ok) return; const y = RT_Y - (n.tn - t) * RT_V; if (y < -10 || y > RT_Y + 12) return;
      c.fillStyle = '#1a0f33'; c.fillRect(RT_X[n.l] - 12, Math.round(y) - 6, 24, 10);
      c.fillStyle = RT_COL[n.l]; c.fillRect(RT_X[n.l] - 11, Math.round(y) - 5, 22, 8);
      c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(RT_X[n.l] - 11, Math.round(y) - 5, 22, 2);
    });
    $('rt-prog').style.width = Math.max(0, Math.min(1, t / RT_FIN)) * 88 + 'px';
    if (t < RT_LEAD - .1) { c.fillStyle = '#fff'; c.font = '10px PS2P, monospace'; c.fillText(t < .3 ? '¡LISTO!' : '¡A BAILAR!', 14, 96); }
  }
  function rtFin() {
    if (!rt || rt.fin) return; rt.fin = true; clearInterval(rt.timer);
    const tot = rt.notas.length || 1, acc = Math.round((rt.per + rt.bien) / tot * 100);
    const base = Math.floor(rt.pts / RT_DIV), bonoNv = base > 0 ? bonoNivelJuego() : 0, gana = base + bonoNv;
    e.st.rt++;
    e.feliz = clamp(e.feliz + Math.min(30, 10 + Math.floor(acc / 5))); e.hambre = clamp(e.hambre - 3);
    const antes = e.rt.rec; let nuevo = false; if (rt.pts > antes) { e.rt.rec = rt.pts; nuevo = antes > 0; }
    if (gana) ganar(gana, 0, true); ganar(0, 3 + Math.min(8, Math.floor(acc / 12)));
    mision('jugar'); revisar(); pintar(); guardar();
    const nota_ = acc >= 90 ? 'S' : acc >= 75 ? 'A' : acc >= 55 ? 'B' : 'C';
    $('rt-res').innerHTML = `NOTA: ${nota_} (${acc}%)<br>PUNTOS: ${rt.pts}<br>MEJOR COMBO: ${rt.mejor}<br>RÉCORD: ${e.rt.rec}${nuevo ? '<br><span style="color:#ffd84a">¡NUEVO RÉCORD!</span>' : ''}<br>+${gana} MONEDAS`;
    $('rt-otra').style.opacity = e.energia >= RT_COSTO ? 1 : .4;
    $('rt-fin').classList.add('on'); if ((acc >= 75 || nuevo) && (!celQ || !celQ.length)) sfx.nivel(); gesto('baile');
  }
  function rtSalir() { if (!rt) return; if (!rt.fin) rtFin(); cancelAnimationFrame(rt.raf); clearInterval(rt.timer); rt = null; $('rt').classList.remove('on'); $('rt-fin').classList.remove('on'); musicaOn(); pintar(); hablar(); corazones(2); if (typeof celebraCheck === 'function' && celQ && celQ.length) celebraCheck(); if (typeof navPop === 'function') navPop(); }
  rtCv.addEventListener('pointerdown', ev => { if (!rt) return; ev.preventDefault(); const r = rtCv.getBoundingClientRect(); if (!r || !r.width) return; rtTap(Math.max(0, Math.min(2, Math.floor((ev.clientX - r.left) / r.width * 3)))); });
  document.addEventListener('keydown', ev => { if (!rt || rt.fin) return; const m = { ArrowLeft: 0, a: 0, j: 0, ArrowDown: 1, s: 1, k: 1, ArrowRight: 2, d: 2, l: 2 }[ev.key]; if (m !== undefined) rtTap(m); });
  $('rt-x').onclick = () => { sfx.click(); rtCerrarVentana(); };
  $('rt-menu-sal').onclick = () => { sfx.click(); rtMenuSalir(); };
  $('rt-sal').onclick = () => { sfx.click(); rtSalir(); };
  $('rt-otra').onclick = () => { if (e.energia < RT_COSTO || e.enf) { sfx.no(); return; } sfx.click(); const ya = rt; cancelAnimationFrame(ya.raf); clearInterval(ya.timer); rt = null; $('rt').classList.remove('on'); rtEmpezar(rtCancionActual); };
