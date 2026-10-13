  /* ===================== MINIJUEGO: CORRE, SIMON (estilo dinosaurio de Chrome) ===================== */
  // (RUN_COSTO, RUN_NV, RUN_MON definidos en config.js)
  const RUN_GY = 132, RUN_GRAV = 520, RUN_SALTO = 190, RUN_SX = 24, RUN_SW = 26, RUN_SH = 36;   // RUN_SW/RUN_SH: mismo tamaño que Atrapa el Keke (antes era más grande y hacía la esquivada de obstáculos más difícil de lo que debería)
  var run = null;
  const runCv = $('run-cv'), runX = runCv.getContext('2d'); runX.imageSmoothingEnabled = false;
  function runPts() { return Math.floor(run.dist / 20) + 5 * run.kekes; }
  function runIniciar() {
    if (e.dormido) { cerrar(); decir('Zzz...'); sfx.no(); return; }
    if (nivel() < RUN_NV) { toast('Se desbloquea en cariño NV' + RUN_NV); sfx.no(); return; }
    if (e.enf) { cerrar(); decir('Sí... ¡achú!', e.traductor ? 'Resfriado no puedo jugar.' : null, 3000); sfx.no(); return; }
    if (e.energia < RUN_COSTO) { cerrar(); decir('Sí...', e.traductor ? 'Estoy muy cansado.' : null); hablar(); sfx.no(); avisoSueno(); return; }
    cerrar(false); modal = 'run'; e.energia = clamp(e.energia - sifE(RUN_COSTO)); pintar(); mjElegirCancion();
    run = { t: 0, dist: 0, kekes: 0, monedas: 0, y: 0, vy: 0, suelo: true, obs: [], items: [], sig: 70, fx: [], fin: false, muerto: 0, ult: performance.now(), raf: 0, saltos: 0 };
    $('run-fin').classList.remove('on'); $('run-tip').style.display = ''; $('run').classList.add('on'); runHud();
    run.raf = requestAnimationFrame(runLoop);
  }
  function runHud() { const p = runPts(); $('run-pts').textContent = p; $('run-mon').textContent = '$' + (run.monedas * RUN_MON); }
  function runSalto() { if (!run || run.fin || run.muerto) return; $('run-tip').style.display = 'none'; if (!run.suelo) return; run.vy = RUN_SALTO; run.suelo = false; run.saltos++; sfx.click(); }
  function runLoop(now) {
    if (!run) return;
    const dt = Math.min(.04, (now - run.ult) / 1000); run.ult = now;
    if (!document.hidden) runUpdate(dt);
    runDibuja();
    run.raf = requestAnimationFrame(runLoop);
  }
  function runUpdate(dt) {
    if (run.fin) return;
    if (run.muerto) { run.muerto += dt; run.fx.forEach(f => f.t += dt); run.fx = run.fx.filter(f => f.t < .5); if (run.muerto > .9) runFin(); return; }
    run.t += dt; const v = Math.min(124, 58 + run.t * 1.75); run.v = v; run.dist += v * dt;
    if (!run.suelo) { run.y += run.vy * dt; run.vy -= RUN_GRAV * dt; if (run.y <= 0) { run.y = 0; run.vy = 0; run.suelo = true; } }
    run.sig -= v * dt;
    if (run.sig <= 0) {
      const pB = Math.min(.34, .12 + run.t * .0035);   // las bombas se vuelven más frecuentes con el tiempo (antes era fijo, no subía la dificultad)
      const r = Math.random(), tipo = r < pB ? 'bomba' : r < pB + (1 - pB) * .47 ? 'bote' : r < pB + (1 - pB) * .76 ? 'caja' : 'pila', dim = { bote: [10, 15], caja: [14, 11], pila: [22, 15], bomba: [12, 12] }[tipo];
      const o = { tipo, x: 100, w: dim[0], h: dim[1] }; run.obs.push(o);
      if (Math.random() < .6) run.items.push({ tipo: Math.random() < .25 ? 'moneda' : 'keke', x: o.x + o.w / 2 - 5, y: 46 + Math.random() * 8, tomado: false });
      run.sig = v * .78 + 34 + Math.random() * 56;
      if (Math.random() < .2) run.items.push({ tipo: Math.random() < .25 ? 'moneda' : 'keke', x: 100 + run.sig / 2, y: 22, tomado: false });
    }
    const hx0 = RUN_SX - 6, hx1 = RUN_SX + 6, hy0 = run.y, hy1 = run.y + 28;   // caja de choque de Simon (más chica que el dibujo, para ser justos)
    run.obs.forEach(o => { o.x -= v * dt; });
    run.obs = run.obs.filter(o => o.x + o.w > -4);
    for (const o of run.obs) { if (hx1 > o.x + 1 && hx0 < o.x + o.w - 1 && hy0 < o.h - 1) { runChoca(o); return; } }
    run.items.forEach(it => { it.x -= v * dt; if (!it.tomado && it.x + 10 > hx0 && it.x < hx1 && it.y + 10 > hy0 && it.y < hy1) { it.tomado = true; if (it.tipo === 'moneda') run.monedas++; else run.kekes++; sfx.moneda(); runHud(); run.fx.push({ k: 'est', x: it.x, y: RUN_GY - it.y - 10, t: 0 }); } });
    run.items = run.items.filter(it => !it.tomado && it.x > -12);
    run.fx.forEach(f => f.t += dt); run.fx = run.fx.filter(f => f.t < .45);
    if (((run.dist / 20) | 0) !== run.pp) { run.pp = (run.dist / 20) | 0; runHud(); }
  }
  function runChoca(o) { run.muerto = .001; run.fx.push({ k: 'boom', x: RUN_SX, y: RUN_GY - run.y - RUN_SH / 2, t: 0 }); sfx.boom ? sfx.boom() : sfx.no(); }
  function runDibuja() {
    const c = runX, W = 96, H = 176, t = run.t, sh = run.muerto && run.muerto < .35 ? Math.round(Math.sin(run.muerto * 90) * 2) : 0;
    c.save(); c.translate(sh, 0);
    ['#1e1448', '#2a1a62', '#3c2078', '#582a88', '#7a3a90', '#a04a90'].forEach((col, i) => { c.fillStyle = col; c.fillRect(-4, Math.round(i * RUN_GY / 6), W + 8, Math.ceil(RUN_GY / 6) + 1); });
    c.fillStyle = '#ffffff'; [[8, 10], [30, 30], [58, 14], [82, 40], [18, 62], [70, 74], [44, 52]].forEach(([x, y], i) => { if (((t * 2 + i) | 0) % 4) c.fillRect(x, y, 1, 1); });
    c.fillStyle = '#ffd1f0'; c.fillRect(70, 14, 12, 12); c.fillStyle = '#f4a8e0'; c.fillRect(72, 16, 3, 3); c.fillRect(77, 21, 3, 2);   // luna
    c.fillStyle = '#4a2a78'; const d1 = (run.dist * .12) % 140; for (let k = -1; k < 2; k++) { const bx = Math.round(k * 70 - d1 + 70); c.fillRect(bx, RUN_GY - 20, 22, 20); c.fillRect(bx + 4, RUN_GY - 28, 8, 8); c.fillRect(bx + 14, RUN_GY - 24, 6, 4); }   // montones de basura al fondo
    c.fillStyle = '#6a4aa0'; c.fillRect(-4, RUN_GY, W + 8, H - RUN_GY); c.fillStyle = '#8a6ac0'; c.fillRect(-4, RUN_GY, W + 8, 2);
    c.fillStyle = '#54388a'; const d2 = Math.round(run.dist % 16); for (let x = -16; x < W + 16; x += 16) { c.fillRect(x - d2, RUN_GY + 8, 6, 2); c.fillRect(x - d2 + 8, RUN_GY + 18, 3, 2); }
    run.obs.forEach(o => {
      const ox = Math.round(o.x), oy = RUN_GY - o.h;
      if (o.tipo === 'bomba') { const sp = sprite('bomba_v', FGRID.bomba, 0); c.drawImage(sp, ox + o.w / 2 - sp.width / 2, RUN_GY - sp.height); c.fillStyle = (t * 12 | 0) % 2 ? '#ffe45a' : '#ff5a28'; c.fillRect(ox + o.w / 2 + 2, RUN_GY - sp.height - 2, 2, 2); }
      else if (o.tipo === 'caja') { c.fillStyle = '#8a5a30'; c.fillRect(ox, oy, o.w, o.h); c.fillStyle = '#c08a50'; c.fillRect(ox, oy, o.w, 2); c.fillStyle = '#5a3a1a'; c.fillRect(ox + o.w / 2 - 1, oy, 2, o.h); }
      else { const n = o.tipo === 'pila' ? 2 : 1; for (let k = 0; k < n; k++) { const bx = ox + k * 12; c.fillStyle = '#aab4c8'; c.fillRect(bx, oy + 3, 10, 12); c.fillStyle = '#6a7490'; c.fillRect(bx + 2, oy + 5, 1, 8); c.fillRect(bx + 5, oy + 5, 1, 8); c.fillRect(bx + 8, oy + 5, 1, 8); c.fillStyle = '#d0d8e8'; c.fillRect(bx - 1, oy + 1, 12, 3); c.fillRect(bx + 3, oy, 4, 2); } }
    });
    run.items.forEach(it => { const sp = it.tipo === 'moneda' ? sprite('fx_moneda', FX.moneda, 0) : sprite('fx_pizza', FX.pizza, 0); c.drawImage(sp, Math.round(it.x), Math.round(RUN_GY - it.y - 10), 10, 10); });
    const boca = run.muerto ? 'n' : 's', sp = sprite('simon_a' + boca + '|' + ropaSig() + '|0000', () => simonGrid('a', boca, e.ropa, {}), 0);
    const rebote = run.suelo && !run.muerto ? ((t * 9 | 0) % 2) : 0, sy = RUN_GY - RUN_SH + 2 - Math.round(run.y) + (rebote ? -1 : 0);
    if (!(run.muerto && (run.muerto * 14 | 0) % 2)) c.drawImage(sp, 0, 0, 56, 78, RUN_SX - RUN_SW / 2, sy, RUN_SW, RUN_SH);
    run.fx.forEach(f => {
      if (f.k === 'boom') { const r = Math.round(4 + f.t * 36); [['#ff6a28', 1], ['#ffd84a', .66], ['#ffffff', .33]].forEach(([col, k]) => { c.fillStyle = col; const R2 = Math.round(r * k); for (let yy = -R2; yy <= R2; yy++) { const w = Math.round(Math.sqrt(R2 * R2 - yy * yy)); c.fillRect(Math.round(f.x) - w, Math.round(f.y) + yy, w * 2, 1); } }); }
      else { const sp2 = sprite('fx_estrella', FX.estrella, 0); c.drawImage(sp2, Math.round(f.x), Math.round(f.y - 8 * f.t * 4)); }
    });
    c.restore();
  }
  function runFin() {
    if (!run || run.fin) return; run.fin = true;
    const pts = runPts(), antes = e.run.rec;
    const bonoNv = run.monedas > 0 ? bonoNivelJuego() : 0, gana = run.monedas * RUN_MON + bonoNv;
    e.st.run++;
    e.feliz = clamp(e.feliz + Math.min(25, 6 + Math.floor(pts / 8))); e.hambre = clamp(e.hambre - 3);
    let nuevo = false; if (pts > antes) { e.run.rec = pts; nuevo = antes > 0; }
    if (gana) ganar(gana, 0, true); ganar(0, 3 + Math.min(8, Math.floor(pts / 30)));
    mision('jugar'); revisar(); pintar(); guardar();
    $('run-res').innerHTML = `PUNTOS: ${pts}<br>KEKES: ${run.kekes}<br>MONEDAS ATRAPADAS: ${run.monedas}<br>RÉCORD: ${e.run.rec}${nuevo ? '<br><span style="color:#ffd84a">¡NUEVO RÉCORD!</span>' : ''}<br>+${gana} MONEDAS`;
    $('run-otra').style.opacity = e.energia >= RUN_COSTO ? 1 : .4;
    $('run-fin').classList.add('on'); if (nuevo && (!celQ || !celQ.length)) sfx.nivel();
  }
  function runSalir() { if (!run) return; if (!run.fin && (run.muerto || run.t > 1)) runFin(); cancelAnimationFrame(run.raf); run = null; mjQuitarCancion(); $('run').classList.remove('on'); $('run-fin').classList.remove('on'); modal = null; pintar(); hablar(); corazones(2); if (typeof celebraCheck === 'function' && celQ && celQ.length) celebraCheck(); if (typeof navPop === 'function') navPop(); }
  runCv.addEventListener('pointerdown', ev => { ev.preventDefault(); runSalto(); });
  document.addEventListener('keydown', ev => { if (!run || run.fin) return; if (ev.key === ' ' || ev.key === 'ArrowUp') { ev.preventDefault(); runSalto(); } });
  $('run-x').onclick = () => { sfx.click(); runSalir(); };
  $('run-sal').onclick = () => { sfx.click(); runSalir(); };
  $('run-otra').onclick = () => { if (e.energia < RUN_COSTO || e.enf) { sfx.no(); return; } sfx.click(); cancelAnimationFrame(run.raf); run = null; $('run').classList.remove('on'); $('run-fin').classList.remove('on'); modal = null; runIniciar(); };
