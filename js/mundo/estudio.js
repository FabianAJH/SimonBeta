  /* ===================== ESTUDIO: POMODORO CON SIMON (sin premios) ===================== */
    function estEstudiando() { return !!(e && e.est && e.est.fase === 'estudio'); }
  function estFmt(ms) { const t = Math.max(0, Math.ceil(ms / 1000)), m = Math.floor(t / 60), s = t % 60; return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'); }
  const ESTIC = () => { const g = Grid(12, 12); g.rect(1, 2, 10, 8, '#232b63'); g.rect(2, 3, 4, 6, '#ffffff'); g.rect(6, 3, 4, 6, '#e8ecff'); g.rect(5, 3, 2, 6, '#8a96ff'); g.rect(3, 4, 2, 1, '#9aa4d8'); g.rect(7, 4, 2, 1, '#9aa4d8'); g.rect(3, 6, 2, 1, '#9aa4d8'); g.rect(7, 6, 2, 1, '#9aa4d8'); return g; };
  try { $('ic-est').getContext('2d').drawImage(gridCanvas(ESTIC()), 0, 0); } catch (_) {}
  const estCfg = () => Object.assign({ min: (typeof CONFIG !== 'undefined' && CONFIG.estudioPomodoro) ? CONFIG.estudioPomodoro.minutosEstudio : 25, br: (typeof CONFIG !== 'undefined' && CONFIG.estudioPomodoro) ? CONFIG.estudioPomodoro.minutosDescanso : 5, ses: (typeof CONFIG !== 'undefined' && CONFIG.estudioPomodoro) ? CONFIG.estudioPomodoro.sesionesTotales : 4 }, e.estCfg);
  function renderEst() {
    $('m-titulo').textContent = 'ESTUDIAR CON SIMON';
    const s = e.est, c = estCfg();
    if (s && s.fase !== 'estudio') {
      return `<div class="centro" style="line-height:2"><div style="font-size:8px;color:#aab4ff">DESCANSO · SESIÓN ${e.estN || 0} ${s.tot > 0 ? 'DE ' + s.tot : ''}</div><div style="font-size:26px;margin:12px 0" id="est-rest">${estFmt(s.fin - Date.now())}</div>` +
        `<div style="font-size:7px;color:#aab4ff">Estírate y toma agua. La siguiente sesión empieza sola.</div><button class="bgrande" data-a="est_salta">SALTAR DESCANSO</button><button class="bt" style="width:100%;padding:12px 0;margin-top:8px" data-a="est_fin">TERMINAR</button></div>`;
    }
    const fila = (t, v, k) => `<div class="saldo"><span>${t}</span><span></span></div><div class="tabs fh"><button class="tab" data-a="est_st" data-k="${k}-">−</button><button class="tab on" style="flex:2" disabled>${v}</button><button class="tab" data-a="est_st" data-k="${k}+">+</button></div>`;
    return `<div class="centro" style="font-size:7px;line-height:2;color:#aab4ff;margin-bottom:8px">Simon estudia contigo. Sin premios: solo compañía.</div>` +
      `<div class="centro" style="font-size:7px;line-height:1.9;color:#8a96ff;margin-bottom:8px">TOTAL ESTUDIADO: ${Math.floor((e.estMin || 0) / 60)} H ${(e.estMin || 0) % 60} MIN · ${e.estNT || 0} SESIONES</div>` +
      fila('ESTUDIO', c.min + ' MIN', 'min') + fila('DESCANSO', c.br + ' MIN', 'br') + fila('SESIONES', c.ses ? c.ses : 'INFINITAS', 'ses') +
      `<div class="saldo"><span>MÚSICA LO-FI</span><span id="est-mv">${e.estMus === undefined ? 50 : e.estMus}%</span></div><input type="range" min="0" max="100" step="1" value="${e.estMus === undefined ? 50 : e.estMus}" data-a="est_mus" style="width:100%;height:28px;accent-color:#ff5a6a">` +
      `<div class="saldo"><span>AMBIENTE</span><span></span></div><div class="tabs fh">${[['', 'NINGUNO'], ['lluvia', 'LLUVIA']].map(([v, t]) => `<button class="tab ${(e.estAmb || '') === v ? 'on' : ''}" data-a="est_amb" data-k="${v}">${t}</button>`).join('')}</div>` + (e.estAmb ? `<div class="saldo"><span>VOLUMEN</span><span id="est-vv">${e.estVol === undefined ? 50 : e.estVol}%</span></div><input type="range" min="0" max="100" step="1" value="${e.estVol === undefined ? 50 : e.estVol}" data-a="est_vol" style="width:100%;height:28px;accent-color:#ff5a6a">` : '') +
      `<div class="centro" style="font-size:6px;line-height:2;color:#7a84c8;margin:8px 0">${c.ses ? c.ses + ' × ' + c.min + ' min con ' + c.br + ' min de descanso.' : 'Sesiones sin fin: seguirán hasta que tú toques TERMINAR.'} El tiempo sigue corriendo aunque salgas de la app.</div>` +
      `<div class="saldo"><span>LIBROS EN EL ESCRITORIO</span><span>${Math.min(EST_CAP, e.estLib || 0)}/${EST_CAP}</span></div>` + (e.estLib ? `<button class="bt" style="width:100%;padding:10px 0;margin-bottom:6px" data-a="est_libros">${estConfL ? '¿SEGURO? TIRAR LIBROS' : 'TIRAR LIBROS'}</button>` : '') +
      `<button class="bgrande" data-a="est_go">EMPEZAR</button>`;
  }
  let estConfL = 0;
  function estClick(a, k) {
    if (a === 'est_libros') { if (!estConfL) { estConfL = 1; sfx.click(); render(); return; } estConfL = 0; e.estLib = 0; estLibAnim = 0; guardar(); toast('Libros tirados: escritorio limpio'); render(); estPintar(); return; }
    if (a === 'est_st') {
      const c = estCfg(), w = k.slice(0, -1), d = k.slice(-1) === '+' ? 1 : -1;
      if (w === 'min') c.min = Math.max(5, Math.min(120, c.min + 5 * d));
      else if (w === 'br') { const L = [1, 2, 3, 5, 10, 15, 20, 30]; let x = L.findIndex(v => v >= c.br); if (x < 0) x = L.length - 1; c.br = L[Math.max(0, Math.min(L.length - 1, x + d))]; }
      else { let v = c.ses + d; if (v < 0) v = 12; if (v > 12) v = 0; c.ses = v; }
      e.estCfg = c; sfx.click(); guardar(); render();
    }
    else if (a === 'est_amb') { e.estAmb = k; sfx.click(); guardar(); render(); lluviaCheck(); }
    else if (a === 'est_go') estIniciar();
    else if (a === 'est_salta') { const s = e.est; e.est = Object.assign({}, s, { fase: 'estudio', fin: Date.now() + s.min * 60000 }); guardar(); cerrar(); estPintar(); }
    else if (a === 'est_fin') { e.est = null; guardar(); cerrar(); estPintar(); lluviaCheck(); }
  }

  var EST_CAP = 42, EST_ORD = [0, 5, 1, 4, 2, 3], EST_LC = ['#e8556a', '#4a8ae8', '#ffd84a', '#4ac07a', '#b06ae8', '#ff9a40', '#ff7ab0', '#3ac0c8'];
  var estLibAnim = 0;
  function dibujarLibros(DY) {
    const n = Math.min(EST_CAP, e.estLib || 0);
    for (let i = 0; i < n; i++) {
      const col = EST_ORD[i % 6], capa = Math.floor(i / 6), w = 14 + (i * 7) % 7, cx = OX + 10 + col * 20 + ((i * 5) % 5) - 2, x = cx - (w >> 1);
      let y = DY + 6 - (capa + 1) * 8;
      const nuevo = i === n - 1 && estLibAnim && Date.now() - estLibAnim < 700; if (nuevo) y -= Math.round((1 - (Date.now() - estLibAnim) / 700) * 40); else if (i === n - 1 && estLibAnim && Date.now() - estLibAnim < 1200 && (tk >> 1) % 2) { ctx.fillStyle = '#fff6a0'; ctx.fillRect(x + w - 2, y - 4, 1, 3); ctx.fillRect(x + 2, y - 3, 1, 2); }
      const c = EST_LC[(i * 3 + capa) % 8];
      ctx.fillStyle = '#2a1a30'; ctx.fillRect(x - 1, y - 1, w + 2, 10);
      ctx.fillStyle = c; ctx.fillRect(x, y, w, 8); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(x, y, w, 1); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x, y + 7, w, 1);
      ctx.fillStyle = '#f4ecd8'; ctx.fillRect(x + w - 3, y + 1, 3, 6); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(x + 2, y + 3, 5, 1); ctx.fillRect(x + 2, y + 5, 3, 1);
    }
  }
  var basSure = 0;
  function estBasura() {
    if (!basSure) { basSure = 1; ['v-basura'].forEach(id => { $(id).textContent = '¿SEGURO? OTRA VEZ'; }); setTimeout(() => { basSure = 0; estPintar(); }, 3000); sfx.click(); return; }
    basSure = 0; e.estLib = 0; estLibAnim = 0; guardar(); sfx.crunch ? sfx.crunch() : sfx.click(); toast('Libros tirados: escritorio limpio'); estPintar();
  }
  try { const g = Grid(12, 12); g.rect(2, 3, 8, 1, '#ffffff'); g.rect(4, 1, 4, 2, '#ffffff'); g.rect(3, 4, 6, 8, '#ffffff'); g.rect(4, 5, 1, 6, '#8a2a3a'); g.rect(7, 5, 1, 6, '#8a2a3a'); const cv0 = gridCanvas(g); $('ic-bas').getContext('2d').drawImage(cv0, 0, 0); $('ic-bas2').getContext('2d').drawImage(cv0, 0, 0); } catch (_) {}
  $('t-basura').onclick = estBasura; $('foco-b').onclick = estBasura;
  let wl = null;
  function estWake(on) { try { if (on && navigator.wakeLock && !wl) navigator.wakeLock.request('screen').then(l => { wl = l; l.addEventListener('release', () => { wl = null; }); }).catch(() => {}); else if (!on && wl) { wl.release(); wl = null; } } catch (_) {} }
  function estIniciar() {
    if (e.dormido) { cerrar(); decir('Zzz...'); sfx.no(); return; }
    const c = estCfg(); e.estN = 0;
    e.est = { fase: 'estudio', ini: Date.now(), fin: Date.now() + c.min * 60000, min: c.min, br: c.br, tot: c.ses };
    try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch (_) {}
    cerrar(); guardar(); sfx.respuesta(); decir('Sí. (a estudiar)', e.traductor ? 'Vamos a concentrarnos.' : null);
    estPintar(); estTick();
  }
  // (estAviso definido en notificaciones.js)
  function estFin() {
    let s = e.est; const now = Date.now(); if (!s) return;
    while (s && now >= s.fin) {
      if (s.fase === 'estudio') {
        e.estN = (e.estN || 0) + 1; e.estNT = (e.estNT || 0) + 1; e.estMin = (e.estMin || 0) + (s.min || 0); e.estUlt = s.fin; if ((e.estLib || 0) < EST_CAP) { e.estLib = (e.estLib || 0) + 1; if (!document.hidden) estLibAnim = Date.now(); }
        if (s.tot > 0 && e.estN >= s.tot) { s = null; break; }
        s = Object.assign({}, s, { fase: 'descanso', fin: s.fin + (s.br || 5) * 60000 });
      } else s = Object.assign({}, s, { fase: 'estudio', fin: s.fin + s.min * 60000 });
    }
    e.est = s;
    if (modal === 'enfoque') modal = null;
    if (!s) { estAviso('¡Terminaste todas tus sesiones de estudio!'); if (!document.hidden) { gesto('baile'); estrellas(14); corazones(4); decir('¡Sí! (¡terminamos todo!)', e.traductor ? 'Lo logramos. Buen trabajo.' : null); } else toast('Terminaste tus sesiones de estudio'); }
    else if (s.fase === 'descanso') { estAviso('¡Sesión terminada! Toca descansar ' + (s.br || 5) + ' min.'); if (!document.hidden) { gesto('baile'); estrellas(8); corazones(3); decir('¡Sí! (descanso)', e.traductor ? 'Buen trabajo. A descansar.' : null); } }
    else { if (modal === 'estudio') cerrar(); estAviso('Se acabó el descanso: a estudiar.'); if (!document.hidden) { toast('Descanso terminado: ¡a estudiar!'); gesto('salto'); } }
    guardar(); estPintar(); lluviaCheck(); try { musicaOn(); } catch (_) {}
  }
  let estC = 0, estSure = 0;
  function estPintar() {
    const on = estEstudiando(), b = $('t-estudio');
    document.body.classList.toggle('enfoque', on);
    if (!on) { estWake(false); if (modal === 'enfoque') modal = null; }
    const aqui = escenaId() === 'estudio' && !e.dormido && !on && !edit;
    b.classList.toggle('oculto', !aqui);
    $('t-basura').classList.toggle('oculto', !(aqui && (e.estLib || 0) > 0)); $('foco-b').classList.toggle('oculto', !(on && (e.estLib || 0) > 0)); $('foco-a').classList.toggle('oculto', !(on && admin)); if (!basSure) $('v-basura').textContent = 'TIRAR LIBROS';
    if (aqui) $('v-estudio').textContent = e.est ? 'SALTAR' : 'ESTUDIAR';
    const dsc = !!e.est && e.est.fase !== 'estudio' && escenaId() === 'estudio' && !e.dormido && !edit; $('est-top').classList.toggle('on', dsc); if (dsc) $('est-top-t').textContent = estFmt(e.est.fin - Date.now());
    if (on) {
      const s = e.est, nn = e.estN || 0;
      $('foco-t').textContent = estFmt(s.fin - Date.now()); $('foco-l').textContent = 'ESTUDIANDO CON SIMON';
      $('foco-p').textContent = s.tot > 0 && s.tot <= 8 ? Array.from({ length: s.tot }, (_, i) => i < nn ? '●' : i === nn ? '◐' : '○').join(' ') : 'SESIÓN ' + (nn + 1) + (s.tot > 0 ? ' DE ' + s.tot : ' · ∞');
      document.querySelectorAll('#foco input').forEach(i => { if (document.activeElement !== i) i.value = i.dataset.a === 'est_vol' ? (e.estVol === undefined ? 50 : e.estVol) : (e.estMus === undefined ? 50 : e.estMus); }); $('fv-amb').style.display = e.estAmb ? '' : 'none';
      if (!estSure) { $('foco-x').textContent = 'TERMINAR'; $('foco-x').classList.remove('sure'); }
    }
  }
  function estTick() {
    estC++;
    if (!e || !e.intro) return;
    try { estSndCheck(); } catch (_) {}
    if (e.est && Date.now() >= e.est.fin) { estFin(); return; }
    if (estEstudiando()) {
      if (!modal && !dlg) modal = 'enfoque';
      if (escenaId() !== 'estudio' && nivel() >= 2) { lugar = null; llegada = null; e.hab = 'estudio'; pintarNav(); }
      if (!document.hidden) estWake(true);
      if (estC % 10 === 0) lluviaCheck();
    } else if (e.est && !document.hidden && !dlg && !modal && !e.dormido && escenaId() === 'estudio' && estC % 24 === 0) gesto('salto');
    if (estC % 2 === 0) estPintar();
    if (modal === 'estudio' && e.est && $('est-rest')) $('est-rest').textContent = estFmt(e.est.fin - Date.now());
  }
  function estSlider(ev) {
    const t = ev.target, a = t && t.dataset && t.dataset.a; if (a !== 'est_vol' && a !== 'est_mus') return;
    if (a === 'est_vol') { e.estVol = +t.value; const v = $('est-vv'); if (v) v.textContent = t.value + '%'; estSndApply(); }
    else { e.estMus = +t.value; const v = $('est-mv'); if (v) v.textContent = t.value + '%'; }
    document.querySelectorAll('#foco [data-a="' + a + '"]').forEach(i => { if (i !== t) i.value = t.value; }); guardar();
  }
  $('m-cuerpo').addEventListener('input', estSlider); $('foco').addEventListener('input', estSlider);
  $('t-estudio').onclick = () => { if (e.dormido) { decir('Zzz...'); sfx.no(); return; } sfx.click(); abrir('estudio'); };
  $('foco-a').onclick = () => { if (admin && e.est) { e.est.fin = Date.now(); estFin(); } };
  $('foco-x').onclick = () => {
    if (!estSure) { estSure = 1; $('foco-x').textContent = '¿SEGURO? TOCA OTRA VEZ'; $('foco-x').classList.add('sure'); setTimeout(() => { estSure = 0; estPintar(); }, 3000); return; }
    estSure = 0; e.est = null; if (modal === 'enfoque') modal = null; guardar(); estPintar(); lluviaCheck(); sfx.click(); decir('Sí. (otro día)', e.traductor ? 'Está bien, descansemos.' : null);
  };
  setInterval(estTick, 500);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(estTick, 50); });
