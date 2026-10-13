/* ===================== MINIJUEGO: ATRAPA EL KEKE ===================== */
  // (MJ_COSTO, MJ_NV, MJH, MJ_MON definidos en config.js)
  var mj = null;
  const mjCv = $('mj-cv'), mjX = mjCv.getContext('2d'); mjCv.height = MJH;
  mjX.imageSmoothingEnabled = false;
  const MJ_SW = 26, MJ_SH = 36;   // tamaño de Simon (antes 36x50 era demasiado grande: la boca ocupaba tanto ancho que esquivar bombas dependía de la suerte y no de la habilidad)
  function mjIniciar() {
    if (e.dormido) { cerrar(); decir('Zzz...'); sfx.no(); return; }
    if (nivel() < MJ_NV) { toast('Se desbloquea en cariño NV' + MJ_NV); sfx.no(); return; }
    if (e.energia < MJ_COSTO) { cerrar(); decir('Sí...', e.traductor ? 'Estoy muy cansado.' : null); hablar(); sfx.no(); avisoSueno(); return; }
    if (e.enf) { cerrar(); decir('Sí... ¡achú!', e.traductor ? 'Resfriado no puedo jugar.' : null, 3000); sfx.no(); return; }
    cerrar(false);
    e.energia = clamp(e.energia - sifE(MJ_COSTO)); pintar(); mjElegirCancion();
    mj = { x: 48, objetivo: 48, vidas: 3, pts: 0, monedas: 0, t: 0, sp: .5, items: [], fx: [], inv: 0, tiembla: 0, ult: performance.now(), raf: 0, fin: false, boca: 0 };
    $('mj-fin').classList.remove('on'); $('mj').classList.add('on'); mjHud();
    mj.raf = requestAnimationFrame(mjLoop);
  }
  function mjHud() { $('mj-pts').textContent = mj.pts; $('mj-mon').textContent = '$' + (mj.monedas * MJ_MON); $('mj-vid').textContent = '♥'.repeat(Math.max(0, mj.vidas)) + '·'.repeat(3 - Math.max(0, mj.vidas)); }
  function mjLoop(now) {
    if (!mj) return;
    const dt = Math.min(.05, (now - mj.ult) / 1000); mj.ult = now;
    if (!mj.fin && !document.hidden) mjUpdate(dt);
    mjDibuja();
    mj.raf = requestAnimationFrame(mjLoop);
  }
  function mjUpdate(dt) {
    mj.t += dt;
    mj.x += (mj.objetivo - mj.x) * Math.min(1, dt * 14);
    if (mj.inv > 0) mj.inv -= dt; if (mj.tiembla > 0) mj.tiembla -= dt; if (mj.boca > 0) mj.boca -= dt;
    mj.sp0 = (mj.sp0 === undefined ? .6 : mj.sp0) - dt;
    if (mj.sp0 <= 0) {                                               // aparece algo nuevo
      mj.sp0 = Math.max(.32, .85 - mj.t * .007);
      const pB = Math.min(.42, .16 + mj.t * .004), r = Math.random(), tipo = r < pB ? 'bomba' : r < pB + .07 ? 'moneda' : 'keke';
      mj.items.push({ tipo, x: 8 + Math.random() * 80, y: -10, v: Math.min(100, 36 + mj.t * .9) * (.85 + Math.random() * .3) });
    }
    const topY = MJH - 14 - MJ_SH, boca = { x0: mj.x - 9, x1: mj.x + 9, y0: topY + 4, y1: topY + 24 };
    mj.items = mj.items.filter(it => {
      it.y += it.v * dt;
      const w = it.tipo === 'moneda' ? 12 : 14;
      if (it.x > boca.x0 - w / 2 && it.x < boca.x1 + w / 2 && it.y + w / 2 > boca.y0 && it.y < boca.y1) {
        if (it.tipo === 'bomba') {
          if (mj.inv <= 0) { mj.vidas--; mj.inv = 1; mj.tiembla = .35; sfx.boom ? sfx.boom() : sfx.no(); mjHud(); mj.fx.push({ k: 'boom', x: it.x, y: it.y, t: 0 }); if (mj.vidas <= 0) mjFin(); return false; }
          return true;
        }
        mj.pts += it.tipo === 'moneda' ? 3 : 1; if (it.tipo === 'moneda') mj.monedas++; mj.boca = .25; sfx.moneda(); mjHud();
        mj.fx.push({ k: 'estrella', x: it.x, y: it.y, t: 0 }); return false;
      }
      if (it.y > MJH - 14) { if (it.tipo === 'bomba') { mj.fx.push({ k: 'boom', x: it.x, y: MJH - 16, t: 0 }); } return false; }
      return true;
    });
    mj.fx.forEach(f => f.t += dt); mj.fx = mj.fx.filter(f => f.t < .45);
  }
  function mjDibuja() {
    const c = mjX, W = 96, H = MJH;
    const tx = mj.tiembla > 0 ? Math.round(Math.sin(mj.t * 90) * 2) : 0;
    c.save(); c.translate(tx, 0);
    const bandas = ['#6cc0ff', '#7ccaff', '#8ad0ff', '#9ad8ff', '#aae0ff', '#bfe8ff'];
    bandas.forEach((col, i) => { c.fillStyle = col; c.fillRect(-4, Math.round(i * MJH / 6), W + 8, Math.ceil(MJH / 6) + 1); });
    c.fillStyle = '#ffe45a'; c.fillRect(76, 12, 10, 10); c.fillStyle = '#fff6b0'; c.fillRect(78, 14, 6, 6);
    [[10, 30, 22], [52, 54, 26], [20, 84, 18]].forEach(([x, y, w], i) => { const dx = Math.round((mj.t * (3 + i)) % (W + 40)) - 20; c.fillStyle = '#ffffff'; c.fillRect((x + dx) % (W + 30) - 20, y, w, 5); c.fillRect((x + dx) % (W + 30) - 16, y - 3, w - 8, 3); });
    c.fillStyle = '#58b848'; c.fillRect(-4, H - 14, W + 8, 14); c.fillStyle = '#48a038'; for (let x = -4; x < W + 4; x += 8) c.fillRect(x + ((x >> 3) % 2) * 4, H - 8, 4, 8); c.fillStyle = '#7ad868'; c.fillRect(-4, H - 14, W + 8, 2);
    mj.items.forEach(it => {
      if (it.tipo === 'bomba') { const sp = sprite('bomba_v', FGRID.bomba, 0); c.drawImage(sp, Math.round(it.x - sp.width / 2), Math.round(it.y - sp.height / 2)); c.fillStyle = (mj.t * 12 | 0) % 2 ? '#ffe45a' : '#ff5a28'; c.fillRect(Math.round(it.x) + 2, Math.round(it.y - sp.height / 2) - 2, 2, 2); }
      else if (it.tipo === 'moneda') { const sp = sprite('fx_moneda', FX.moneda, 0); c.drawImage(sp, Math.round(it.x - 6), Math.round(it.y - 6), 12, 12); }
      else { const sp = sprite('fx_pizza', FX.pizza, 0); c.drawImage(sp, Math.round(it.x - sp.width / 2), Math.round(it.y - sp.height / 2)); }
    });
    const ojos = 'a', boca = mj.boca > 0 ? 's' : mj.vidas <= 1 ? 'n' : 's';
    const sp = sprite('simon_' + ojos + boca + '|' + ropaSig() + '|0000', () => simonGrid(ojos, boca, e.ropa, {}), 0);
    if (!(mj.inv > 0 && (mj.t * 14 | 0) % 2)) c.drawImage(sp, 0, 0, 56, 78, Math.round(mj.x - MJ_SW / 2), MJH - 14 - MJ_SH, MJ_SW, MJ_SH);
    mj.fx.forEach(f => {
      if (f.k === 'boom') { const r = Math.round(4 + f.t * 40); [['#ff6a28', 1], ['#ffd84a', .66], ['#ffffff', .33]].forEach(([col, k]) => { c.fillStyle = col; const R2 = Math.round(r * k); for (let yy = -R2; yy <= R2; yy++) { const w = Math.round(Math.sqrt(R2 * R2 - yy * yy)); c.fillRect(Math.round(f.x) - w, Math.round(f.y) + yy, w * 2, 1); } }); }
      else { const sp2 = sprite('fx_estrella', FX.estrella, 0); c.drawImage(sp2, Math.round(f.x - 2), Math.round(f.y - 8 * f.t * 4)); }
    });
    c.restore();
  }
  function mjFin() {
    if (mj.fin) return; mj.fin = true;
    const pts = mj.pts, antes = e.mj.rec;
    const bonoNv = mj.monedas > 0 ? bonoNivelJuego() : 0, gana = mj.monedas * MJ_MON + bonoNv;
    e.st.mj++;
    e.feliz = clamp(e.feliz + Math.min(30, 8 + Math.floor(pts / 2))); e.hambre = clamp(e.hambre - 3);
    let nuevo = false;
    if (pts > antes) { if (antes > 0) e.mj.rompio = 1; e.mj.rec = pts; nuevo = antes > 0; }
    if (gana) ganar(gana, 0, true); ganar(0, 3 + Math.min(8, Math.floor(pts / 6)));
    mision('jugar'); revisar(); pintar(); guardar();
    $('mj-res').innerHTML = `MONEDAS ATRAPADAS: ${mj.monedas}<br>RÉCORD: ${e.mj.rec}${nuevo ? '<br><span style="color:#ffd84a">¡NUEVO RÉCORD!</span>' : ''}<br>+${gana} MONEDAS`;
    $('mj-otra').style.opacity = e.energia >= MJ_COSTO ? 1 : .4;
    $('mj-fin').classList.add('on'); if (nuevo && (!celQ || !celQ.length)) sfx.nivel();
  }
  function mjSalir() { if (!mj) return; if (!mj.fin) mjFin(); cancelAnimationFrame(mj.raf); mj = null; mjQuitarCancion(); $('mj').classList.remove('on'); $('mj-fin').classList.remove('on'); pintar(); hablar(); corazones(2); if (typeof celebraCheck === 'function' && celQ && celQ.length) celebraCheck(); if (typeof navPop === 'function') navPop(); }
  function mjMueve(ev) { if (!mj || mj.fin) return; const r = mjCv.getBoundingClientRect(); if (!r || !r.width) return; mj.objetivo = Math.max(14, Math.min(82, (ev.clientX - r.left) / r.width * 96)); }
  mjCv.addEventListener('pointerdown', ev => { mjMueve(ev); try { mjCv.setPointerCapture(ev.pointerId); } catch (_) {} });
  mjCv.addEventListener('pointermove', mjMueve);
  document.addEventListener('keydown', ev => { if (!mj || mj.fin) return; if (ev.key === 'ArrowLeft') mj.objetivo = Math.max(14, mj.objetivo - 10); if (ev.key === 'ArrowRight') mj.objetivo = Math.min(82, mj.objetivo + 10); });

  // botones de la pantalla final (antes estaban junto al ritmo)
  $('mj-x').onclick = () => { sfx.click(); mjSalir(); };
  $('mj-sal').onclick = () => { sfx.click(); mjSalir(); };
  $('mj-otra').onclick = () => { if (e.energia < MJ_COSTO) { sfx.no(); return; } sfx.click(); const ya = mj; cancelAnimationFrame(ya.raf); mj = null; $('mj').classList.remove('on'); mjIniciar(); };
