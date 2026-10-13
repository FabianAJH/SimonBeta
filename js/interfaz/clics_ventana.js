  function mClick(ev) {
    const b = ev.target.closest('[data-a]'); if (!b) return;
    let a = b.dataset.a; const k = b.dataset.k;
    if (a === 'tv_sel') { const pr = ev.target.closest('.pr'); if (pr && pr.textContent.trim().startsWith('$')) a = k === 'bomba' ? 'b_comprar' : k === 'jarabe' ? 'med_comprar' : tab === 'comida' ? 'f_comprar' : tab === 'mkt' ? 'ig_comprar' : tab === 'semillas' ? 'j_comprar' : 'comprar'; else if (pr && pr.textContent.trim() === 'PONER') a = 'poner'; else if (pr && pr.textContent.trim() === 'QUITAR') a = 'quitar'; else if (pr && pr.textContent.trim() === 'PUESTO') { const it = ITEMS[k]; if (it && !PORDEFECTO[it.slot]) a = 'quitar'; } }   // tocar el precio = comprar, tocar PONER/QUITAR = equipar/quitar
    if (a === 'tv_cat') { sfx.click(); if (k === 'prem') { tab = 'ropa'; fRopa = 'prem'; } else { tab = k; if (k === 'ropa' && (fRopa === 'prem' || fRopa === 'mascota')) fRopa = 'todo'; } tv = 'cat'; tsel = null; tBuscar = ''; e.tn = e.tn || {}; e.tn[k] = nivel(); guardar(); render(); $('m-cuerpo').scrollTop = 0; return; } else if (a === 'tv_back') { sfx.click(); tv = 'hub'; tsel = null; tBuscar = ''; render(); return; } else if (a === 'tv_sel') { sfx.click(); tsel = tsel === k ? null : k; render(); return; } else if (a === 'tv_item') { sfx.click(); tab = catDe(k); fRopa = 'todo'; fHab = 'todo'; tv = 'cat'; tsel = k; tBuscar = ''; render(); return; } else if (a === 'fr') { fRopa = k; tsel = null; sfx.click(); render(); } else if (a === 'fh') { fHab = k; tsel = null; sfx.click(); render(); } else if (a === 'th_buscar_x') {
      tBuscar = '';
      const inp = $('th-buscar');
      if (inp) { inp.value = ''; inp.focus(); }
      b.style.display = 'none';
      sfx.click();
      const gr = $('th-grid');
      if (gr && modal === 'tienda') {
        const ct = tab === 'ropa' && fRopa === 'prem' ? 'prem' : tab;
        const base = itemsTiendaBase(tab);
        gr.innerHTML = renderTiendaCards(base, ct);
        dibujarPrevCanvases(gr);
      }
      return;
    } else if (a === 'vs_buscar_x') {
      vBuscar = '';
      const inp = $('vs-buscar');
      if (inp) { inp.value = ''; inp.focus(); }
      b.style.display = 'none';
      sfx.click();
      const gr = $('vs-grid');
      if (gr && modal === 'vestir') {
        gr.innerHTML = renderVestGrid();
        dibujarPrevCanvases(gr);
      }
      return;
    } else if (a === 'comprar') comprar(k); else if (a === 'poner') poner(k);
    else if (a === 'ojo_tog') {
      e.ojoOn = e.ojoOn === 0 ? 1 : 0;
      const arr = petsActivas();
      if (e.ojoOn) {
        if (!arr.includes('ojo_pet') && arr.length < 3) arr.push('ojo_pet');
        if (typeof ojoSnd === 'function') ojoSnd();
      } else {
        const idx = arr.indexOf('ojo_pet');
        if (idx >= 0) arr.splice(idx, 1);
      }
      sfx.click(); guardar(); render();
    }
    else if (a.startsWith('ck_') && a !== 'ck_abrir') ckClick(a, k); else if (a === 'ck_abrir') { ck = null; sfx.click(); abrir('cocinar'); } else if (a === 'rf_abrir') { sfx.click(); abrir('refri'); } else if (a === 'rf_mejorar') { sfx.click(); tab = 'cuarto'; fHab = 'cocina'; tv = 'cat'; tvPre = true; abrir('tienda'); }
    else if (a === 'ig_comprar') comprarIng(k); else if (a === 'rf_ir') { tab = 'mkt'; tv = 'cat'; tvPre = true; tsel = null; sfx.click(); abrir('tienda'); }
    else if (a === 'j_ir_tienda') { jSel = null; tab = 'semillas'; tv = 'cat'; tvPre = true; tsel = null; sfx.click(); abrir('tienda'); }
    else if (a === 'f_ir_tienda') { tab = 'comida'; tv = 'cat'; tvPre = true; tsel = null; sfx.click(); abrir('tienda'); }
    else if (a === 'quitar') quitar(k); else if (a === 'mcomprar') comprarMerc(k); else if (a === 'compartir') compartirFoto(); else if (a === 'guardar') guardarFoto(); else if (a === 'abrirreg') abrirRegalo(); else if (a === 'cerrar') cerrar();
    else if (a.startsWith('q_')) qClick(a, k); else if (a === 'm_ir') irLugar(k); else if (['mj_jugar', 'run_jugar', 'rt_jugar', 'mem_jugar'].includes(a) && noEst('ahora toca estudiar, no jugar')) { return; } else if (a === 'nt_tog') { notifToggle(); return; } else if (a === 'fs_set') { e.fuente = +k; sfx.click(); guardar(); pintar(); render(); return; } else if (a === 'nom_ed') { sfx.click(); pedirNombre(() => render(), true); return; } else if (a === 'tr_rec') { trofReclamar(); return; } else if (a.startsWith('cel_')) { celClick(a, k); return; } else if (a.startsWith('cl_')) { closetClick(a, k); return; } else if (a === 'mj_jugar') mjIniciar(); else if (a === 'run_jugar') runIniciar(); else if (a === 'rt_jugar') rtIniciar(); else if (a === 'mem_jugar') memIniciar(); else if (a.startsWith('est_')) estClick(a, k); else if (a.startsWith('med_')) medClick(a); else if (a === 'not_borrar') { e.notis = []; notiNuevas = 0; sfx.click(); pintarNotis(); guardar(); render(); } else if (a === 'vs_open') { sfx.click(); abrir('vestir'); } else if (a === 'vs_f') { sfx.click(); vF = k; render(); } else if (a === 'vs_pet') {
      const arr = petsActivas();
      if (arr.includes(k)) {
        arr.splice(arr.indexOf(k), 1);
        if (k === 'ojo_pet') e.ojoOn = 0;
        sfx.click();
      } else if (arr.length < 3) {
        arr.push(k);
        if (k === 'ojo_pet') { e.ojoOn = 1; if (typeof ojoSnd === 'function') ojoSnd(); }
        sfx.click();
      } else {
        toast('MÁXIMO 3 MASCOTAS ACTIVAS');
        sfx.no();
        return;
      }
      guardar(); pintar(); render();
    } else if (a === 'vs_t') { const it = ITEMS[k], sl = it.slot; if (e.ropa[sl] === k) { if (PORDEFECTO[sl]) { sfx.no(); return; } e.ropa[sl] = null; } else e.ropa[sl] = k; sfx.click(); pintar(); render(); } else if (a === 'vs_nada') { sfx.click(); Object.assign(e.ropa, BASE().ropa); pintar(); render(); } else if (a === 'vs_x') { sfx.click(); cerrar(); } else if (a === 'vs_ok') { vsGuardar(); } else if (a === 'iv_cat') { sfx.click(); ivCat = k; ivF = 'todo'; iv = 'cat'; isel = null; render(); $('m-cuerpo').scrollTop = 0; } else if (a === 'iv_back') { sfx.click(); iv = 'hub'; isel = null; render(); } else if (a === 'iv_f') { sfx.click(); ivF = k; isel = null; render(); } else if (a === 'iv_sel') { sfx.click(); isel = isel === k ? null : k; render(); } else if (a === 'iv_item') { sfx.click(); const c = ['ropa', 'mue', 'jug', 'fon'].find(c => invListas()[c].includes(k)); if (c) { ivCat = c; ivF = 'todo'; iv = 'cat'; isel = k; render(); } } else if (a === 'it_nada') { e.ropa = Object.assign(e.ropa, BASE().ropa); sfx.click(); gesto('salto'); pintar(); guardar(); render(); } else if (a === 'iv_vestir') { sfx.click(); abrir('vestir'); } else if (a.startsWith('d_')) dClick(a, k); else if (a.startsWith('r_')) rClick(a, b); else if (a === 'tut_ver') { cerrar(); setTimeout(() => { if (libreParaTutorial()) iniciarTutorial(); else toast('Inténtalo cuando Simon esté despierto y sin visitas'); }, 600); } else if (a === 'c_canjear') ((typeof window !== "undefined" && typeof window.canjear === "function") ? window.canjear : canjear)(); else if (a === 'c_reset_no') { resetPend = false; cdMsg = null; sfx.click(); render(); } else if (a === 'c_reset_ok') reiniciarTodo(); else if (a === 'f_dar') darComida(k); else if (a === 'f_sif') sifComer(); else if (a === 'f_comprar') comprarComida(k); else if (a === 'j_comprar') comprarSemilla(k); else if (a === 'j_plantar') jardinPlantar(k); else if (a === 'b_comprar') comprarBomba(); else if (a.startsWith('x_')) xClick(a, k);
  }
  $('m-cuerpo').addEventListener('click', mClick);
  $('m-cuerpo').addEventListener('input', ev => {
    if (ev.target && ev.target.id === 'th-buscar') {
      tBuscar = ev.target.value;
      const bx = $('th-buscar-x');
      if (bx) bx.style.display = tBuscar ? 'flex' : 'none';
      const gr = $('th-grid');
      if (gr && modal === 'tienda') {
        const ct = tab === 'ropa' && fRopa === 'prem' ? 'prem' : tab;
        const base = itemsTiendaBase(tab);
        gr.innerHTML = renderTiendaCards(base, ct);
        dibujarPrevCanvases(gr);
        const sh = $('t-sheet');
        if (sh && tsel && !base.includes(tsel)) { sh.remove(); tsel = null; }
      }
    } else if (ev.target && ev.target.id === 'vs-buscar') {
      vBuscar = ev.target.value;
      const bx = $('vs-buscar-x');
      if (bx) bx.style.display = vBuscar ? 'flex' : 'none';
      const gr = $('vs-grid');
      if (gr && modal === 'vestir') {
        gr.innerHTML = renderVestGrid();
        dibujarPrevCanvases(gr);
      }
    }
  });
  $('m-cuerpo').addEventListener('keydown', ev => {
    if (ev.target && (ev.target.id === 'th-buscar' || ev.target.id === 'vs-buscar') && ev.key === 'Enter') ev.target.blur();
  });
  $('vt-s1').addEventListener('click', mClick); $('vt-s2').addEventListener('click', mClick);
  $('m-x').onclick = cerrar;
  $('modal').addEventListener('pointerdown', ev => {
    if (ev.target === $('modal')) {
      if (modal === 'regalo' && !ultimoPremio) return;
      if (modal === 'celebra') return;
      cerrar();
    }
  });
  $('btn-tienda').onclick = () => menuAbrir('tienda');
  $('chip-mon').onclick = () => menuAbrir('tienda');
  $('chip-fue').onclick = () => { const r = racha(); toast(r ? 'RACHA: ' + r + (r === 1 ? ' DÍA' : ' DÍAS') + '. ¡VUELVE MAÑANA!' : 'SIN RACHA. ¡ABRE TU REGALO PARA EMPEZAR!'); };
  $('chip-niv').onclick = () => menuAbrir('simonInfo');
  const abrirStatsMenu = ev => {
    if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();
    menuAbrir('stats');
  };
  const elSecStats = $('sec-stats') || (typeof document !== 'undefined' && document.querySelector && document.querySelector('.stats'));
  if (elSecStats) elSecStats.onclick = abrirStatsMenu;
  ['si-h', 'si-e', 'si-f', 'si-l', 's-hambre', 's-energia', 's-feliz', 's-limp', 'stat_s-hambre', 'stat_s-energia', 'stat_s-feliz', 'stat_s-limp'].forEach(id => {
    const el = $(id);
    if (el) el.onclick = abrirStatsMenu;
  });
  if (typeof document !== 'undefined' && document.querySelectorAll) {
    try {
      document.querySelectorAll('.stats, .stats .stat, .stats .hp, .stats .hpf, .stats .sic').forEach(el => {
        el.onclick = abrirStatsMenu;
      });
    } catch (_) {}
  }

