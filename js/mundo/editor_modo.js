  const muProtegido = k => !ITEMS[k] || ITEMS[k].fija || ITEMS[k].slot === 'juguete';
  function posEdOverlay() {
    const bf = $('ed-ov-f'), bx = $('ed-ov-x');
    const d = modal === 'editar' && edit && edit.sel != null ? e.deco[edit.sel] : null;
    if (!d || (d.h || 'sala') !== e.hab || !ITEMS[d.k] || muProtegido(d.k)) { bf.classList.remove('on'); bx.classList.remove('on'); return; }
    const sc = cv.getBoundingClientRect(); if (!sc.width) { bf.classList.remove('on'); bx.classList.remove('on'); return; }
    const r = posReal(d), k = sc.width / LW;
    const left = sc.left + r.x * k, top = sc.top + r.y * k, w = r.w * k, h = r.h * k;
    bf.style.left = Math.round(left - 8) + 'px'; bf.style.top = Math.round(top - 8) + 'px';
    bx.style.left = Math.round(left + w - 9) + 'px'; bx.style.top = Math.round(top - 8) + 'px';
    bf.classList.add('on'); bx.classList.add('on');
  }
  $('ed-ov-f').onclick = () => { if (!edit || edit.sel == null) return; const d = e.deco[edit.sel]; if (!d || muProtegido(d.k)) return; d.f = d.f ? 0 : 1; sfx.click(); guardar(); };
  $('ed-ov-x').onclick = () => { if (!edit || edit.sel == null) return; const d = e.deco[edit.sel]; if (!d || muProtegido(d.k)) return; e.deco.splice(edit.sel, 1); edit.sel = null; sfx.click(); guardar(); pintarEdicion(); };
  function entrarEdicion(k) {
    tutRes(null);
    if (lugar || calle || vistaBloq) { toast('Aquí no puedes usar esto'); sfx.no(); return; }
    lugar = null; llegada = null; pintarNav();
    modal = null; { const vs = $('t-sheet'); if (vs) vs.remove(); } $('modal').classList.remove('on', 'sheet'); $('escena').classList.remove('alto'); act = null;
    $('edicion').classList.remove('min'); pintarOjo(); calcPiso();
    const edInp = $('ed-buscar'), edBx = $('ed-buscar-x');
    if (edInp) edInp.value = '';
    if (edBx) edBx.style.display = 'none';
    edit = { sel: null, drag: null, filtro: 'todo', buscar: '' }; modal = 'editar'; document.body.classList.add('editando'); $('edicion').classList.add('on');
    if (k && colocar(k)) edit.sel = e.deco.findIndex(d => d.k === k);
    pintarEdicion(); sfx.click(); navPush();
  }
  const OJO = { a: ['....wwwww....', '..ww.....ww..', '.w...kkk...w.', 'w....kkk....w', '.w...kkk...w.', '..ww.....ww..', '....wwwww....'], c: ['.............', 'w...........w', '.ww.......ww.', '...wwwwwww...', '.w..w.w.w..w.', '.............', '.............'] };
  function pintarOjo2() {
    const m = OJO[$('foco-fv').classList.contains('min') ? 'c' : 'a'], g = Grid(13, 7);
    m.forEach((f, y) => [...f].forEach((ch, x) => { if (ch === 'w') g.set(x, y, '#e8ecff'); else if (ch === 'k') g.set(x, y, '#ffd84a'); }));
    const c = $('ic-eye2').getContext('2d'); c.clearRect(0, 0, 13, 7); c.drawImage(gridCanvas(g), 0, 0);
  }
  function pintarOjo() {
    const cerrado = $('edicion').classList.contains('min'), m = OJO[cerrado ? 'c' : 'a'], g = Grid(13, 7);
    m.forEach((f, y) => [...f].forEach((ch, x) => { if (ch === 'w') g.set(x, y, '#e8ecff'); else if (ch === 'k') g.set(x, y, '#ffd84a'); }));
    const c = $('ic-eye').getContext('2d'); c.clearRect(0, 0, 13, 7); c.drawImage(gridCanvas(g), 0, 0);
  }
  $('foco-e').onclick = () => { $('foco-fv').classList.toggle('min'); sfx.click(); pintarOjo2(); };
  pintarOjo2();
  $('ed-eye').onclick = () => { $('edicion').classList.toggle('min'); sfx.click(); pintarOjo(); };
  $('ed-trash').onclick = () => { sfx.click(); $('ed-confirm').classList.add('on'); };
  $('ed-conf-no').onclick = () => { sfx.click(); $('ed-confirm').classList.remove('on'); };
  $('ed-conf-si').onclick = () => {
    $('ed-confirm').classList.remove('on');
    e.deco = e.deco.filter(d => (d.h || 'sala') !== e.hab || muProtegido(d.k));
    const ps = e.hab === 'sala' ? 'pared' : 'pared_' + e.hab, fs = e.hab === 'sala' ? 'piso' : 'piso_' + e.hab;
    e.cuarto[ps] = DEF_FONDO[ps] || null; e.cuarto[fs] = DEF_FONDO[fs] || null;
    if (edit) edit.sel = null;
    sfx.click(); guardar(); pintar(); pintarEdicion(); toast('Habitación reiniciada');
  };
  const edBx = $('ed-buscar-x');
  $('ed-buscar').oninput = () => {
    if (!edit) return;
    edit.buscar = $('ed-buscar').value;
    if (edBx) edBx.style.display = edit.buscar ? 'flex' : 'none';
    pintarEdLista();
  };
  if (edBx) {
    edBx.onclick = () => {
      if (!edit) return;
      edit.buscar = '';
      $('ed-buscar').value = '';
      edBx.style.display = 'none';
      $('ed-buscar').focus();
      sfx.click();
      pintarEdLista();
    };
  }
  (function () {
    const grip = $('ed-grip'), bd = $('ed-bd'); let gArr = false, gY = 0, gH = 0;
    const MIN_H = 70, maxH = () => Math.max(MIN_H + 40, Math.round(window.innerHeight * .56));
    grip.addEventListener('pointerdown', ev => { gArr = true; gY = ev.clientY; gH = bd.getBoundingClientRect().height; try { grip.setPointerCapture(ev.pointerId); } catch (_) {} ev.preventDefault(); });
    grip.addEventListener('pointermove', ev => { if (!gArr) return; const h = Math.max(MIN_H, Math.min(maxH(), Math.round(gH + (gY - ev.clientY)))); bd.style.height = h + 'px'; bd.style.maxHeight = h + 'px'; });
    const gSuelta = () => { gArr = false; }; grip.addEventListener('pointerup', gSuelta); grip.addEventListener('pointercancel', gSuelta);
  })();
  (function () {
    const grip = $('vs-grip'), vc = $('m-cuerpo'); let gArr = false, gY = 0, gH = 0;
    const MIN_H = 90, maxH = () => Math.max(MIN_H + 60, Math.round(window.innerHeight * .62));
    grip.addEventListener('pointerdown', ev => { gArr = true; gY = ev.clientY; gH = vc.getBoundingClientRect().height; try { grip.setPointerCapture(ev.pointerId); } catch (_) {} ev.preventDefault(); });
    grip.addEventListener('pointermove', ev => {
      if (!gArr) return;
      const h = Math.max(MIN_H, Math.min(maxH(), Math.round(gH + (gY - ev.clientY))));
      vc.style.height = h + 'px'; vc.style.maxHeight = h + 'px';
      const vt = grip.closest('.ventana'); if (vt) vt.style.maxHeight = 'none';
    });
    const gSuelta = () => { gArr = false; }; grip.addEventListener('pointerup', gSuelta); grip.addEventListener('pointercancel', gSuelta);
  })();
  function salirEdicion(hPop = true) { $('edicion').classList.remove('min'); edit = null; modal = null; document.body.classList.remove('editando'); $('edicion').classList.remove('on'); $('ed-ov-f').classList.remove('on'); $('ed-ov-x').classList.remove('on'); pintar(); guardar(); toast('Habitación guardada'); sfx.compra(); setTimeout(saludar, 800); if (celQ.length) setTimeout(celebraCheck, 50); if (hPop) navPop(); }
  function editDown(ev) {
    const p = ptoLog(ev); let hit = -1, mejor = -1e9;
    e.deco.forEach((d, i) => { if (!ITEMS[d.k] || (d.h || 'sala') !== e.hab) return; const r = posReal(d); if (p.x >= r.x - 2 && p.x <= r.x + r.w + 2 && p.y >= r.y - 2 && p.y <= r.y + r.h + 2) { const pr = (muebleDelante(d, r) ? 100000 : 0) + i; if (pr > mejor) { mejor = pr; hit = i; } } });
    if (hit < 0) { edit.sel = null; edit.drag = null; }
    else { edit.sel = hit; const d = e.deco[hit], r = posReal(d); edit.drag = { ox: p.x - r.cx, oy: p.y - (esPared(d.k) ? r.cy : r.base) }; sfx.click(); try { cv.setPointerCapture(ev.pointerId); } catch (_) {} }
    pintarEdicion();
  }
  function editMove(ev) {
    if (!edit || !edit.drag || edit.sel == null) return;
    const pn = $('edicion'); { const bajo = ev.clientY >= pn.getBoundingClientRect().top - 24; pn.classList.toggle('suelto', bajo); document.body.classList.toggle('sueltoUI', bajo); }   // el menú se vuelve invisible al arrastrar hacia su zona
    const p = ptoLog(ev), d = e.deco[edit.sel]; if (d.h === 'estudio' && ITEMS[d.k].zona) { estSnap(d, p); dibujar(); posEdOverlay(); return; } d.x = Math.round(p.x - edit.drag.ox - LW / 2); d.y = Math.round(p.y - edit.drag.oy - RY);
    const r = posReal(d); d.x = Math.round(r.cx - LW / 2); d.y = Math.round((esPared(d.k) ? r.cy : r.base) - RY);
    dibujar(); posEdOverlay();
  }
  const dDelante = d => muebleDelante(d);
  function capaInfo() {
    if (!edit || edit.sel == null) return null; const d = e.deco[edit.sel]; if (!d || (d.h || 'sala') === 'estudio') return null;
    const mis = e.deco.map((x, i) => i).filter(i => ITEMS[e.deco[i].k] && (e.deco[i].h || 'sala') === (d.h || 'sala') && dDelante(e.deco[i]) === dDelante(d));
    return { d, mis, pos: mis.indexOf(edit.sel) + 1 };
  }
  function mover(dir) {
    const I = capaInfo(); if (!I) { sfx.no(); return; }
    if (edit && edit.sel != null && e.deco[edit.sel] && ITEMS[e.deco[edit.sel].k] && ITEMS[e.deco[edit.sel].k].slot === 'juguete' && dir < 0) {
      toast('El juguete siempre se mantiene al frente'); sfx.no(); return;
    }
    const i = edit.sel, ri = posReal(I.d), sol = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
    const cand = I.mis.filter(j => dir > 0 ? j > i : j < i).filter(j => sol(ri, posReal(e.deco[j])));
    if (!cand.length) { sfx.no(); toast(dir > 0 ? 'Nada lo tapa: ya está al frente' : 'Nada lo cubre: ya está al fondo'); return; }
    const j = dir > 0 ? cand[0] : cand[cand.length - 1], [it] = e.deco.splice(i, 1); e.deco.splice(j, 0, it); edit.sel = j;
    sfx.click(); guardar(); pintarEdicion();
  }
  $('ed-adel').onclick = () => mover(1); $('ed-atras').onclick = () => mover(-1);
  function editUp() { $('edicion').classList.remove('suelto'); document.body.classList.remove('sueltoUI'); if (edit && edit.drag) { edit.drag = null; guardar(); } posEdOverlay(); }
  cv.addEventListener('pointermove', ev => { if (ban) banMove(ev); }); cv.addEventListener('pointerup', banUp); cv.addEventListener('pointercancel', banUp);
  cv.addEventListener('pointermove', editMove); cv.addEventListener('pointerup', editUp); cv.addEventListener('pointercancel', editUp);
  $('ed-x').onclick = salirEdicion;
  $('t-mis').onclick = () => { if (dlg || tutMenuBloq('misiones') || guiaBloq('misiones') || modal) return; sfx.click(); abrir('misiones'); };
  $('b-vestir').onclick = () => {
    if (lugar || calle || vistaBloq) { toast('Aquí no puedes usar esto'); sfx.no(); return; }
    menuAbrir('vestir');
  };
