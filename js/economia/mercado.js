  /* ===================== MERCADO E INGREDIENTES ===================== */
  const ING = {
    jitomate: { n: 'JITOMATE', p: 6, nv: 1 }, lechuga: { n: 'LECHUGA', p: 6, nv: 1 }, huevo: { n: 'HUEVO', p: 8, nv: 1 }, harina: { n: 'HARINA', p: 8, nv: 1 },
    leche: { n: 'LECHE', p: 10, nv: 1 }, pan: { n: 'PAN', p: 8, nv: 1 }, azucar: { n: 'AZUCAR', p: 9, nv: 1 }, queso: { n: 'QUESO', p: 14, nv: 2 },
    tortilla: { n: 'TORTILLA', p: 10, nv: 2 }, naranja: { n: 'NARANJA', p: 12, nv: 2 }, carne: { n: 'CARNE', p: 20, nv: 3 }, chocolate: { n: 'CHOCOLATE', p: 18, nv: 4 }
  };
  const ING_ORD = Object.keys(ING);
  const CAP_REFRI = { refri_menta: 8, refri_retro: 8, refri_keke: 10, refri_acero: 12, refri_negro: 14, refri_doble: 20, refri_dorado: 20 };
  const ingCap = () => CAP_REFRI[e.cuarto.refri] || 5;
  const REF_CAD = ['refri_menta', 'refri_retro', 'refri_keke', 'refri_acero', 'refri_negro', 'refri_doble'];
  const refriNv = k => !k ? 1 : k === 'refri_dorado' ? 7 : REF_CAD.indexOf(k) + 2;
  const refReq = k => { const i = REF_CAD.indexOf(k); return i > 0 && !e.tiene[REF_CAD[i - 1]] ? REF_CAD[i - 1] : null; };
  function ingL(k) { e.ing = e.ing || {}; const v = e.ing[k]; if (typeof v === 'number') e.ing[k] = Array.from({ length: v }, () => Date.now()); else if (!Array.isArray(v)) e.ing[k] = []; return e.ing[k]; }
  const ingN = k => ingL(k).length;   // total guardados: no caducan, se quedan para siempre hasta que se usan
  const ingF = k => ingN(k);   // todo lo guardado cuenta como disponible
  const IGRID = {
    jitomate() { const g = Grid(14, 14); ovalG(g, 7, 8, 6, 5, '#e8353f'); ovalG(g, 7, 7, 5, 3, '#ff6a60'); g.rect(4, 3, 6, 2, '#3a9a50'); g.rect(6, 1, 2, 3, '#2a7a3a'); g.rect(3, 4, 2, 1, '#5ac870'); g.rect(9, 4, 2, 1, '#5ac870'); g.set(4, 6, '#ffffff'); g.contour('#7a1018'); return g; },
    lechuga() { const g = Grid(14, 14); ovalG(g, 7, 8, 6, 5, '#4ab860'); ovalG(g, 7, 7, 4, 3, '#8ae08a'); g.rect(6, 4, 1, 8, '#2a8a40'); g.rect(3, 7, 3, 1, '#2a8a40'); g.rect(9, 8, 3, 1, '#2a8a40'); g.rect(5, 5, 2, 1, '#c8f4b0'); g.contour('#1a5a2a'); return g; },
    huevo() { const g = Grid(14, 14); ovalG(g, 7, 8, 4, 5, '#f4e8d0'); ovalG(g, 7, 7, 3, 3, '#fff8ea'); g.rect(5, 5, 1, 2, '#ffffff'); g.rect(5, 11, 5, 1, '#d8c8a8'); g.contour('#8a6a3a'); return g; },
    harina() { const g = Grid(14, 14); g.rect(3, 3, 8, 10, '#f4f2ee'); g.rect(3, 3, 8, 2, '#d8d4cc'); g.rect(4, 7, 6, 3, '#e8b050'); g.rect(5, 8, 4, 1, '#fff'); g.rect(3, 12, 8, 1, '#c8c4bc'); g.set(2, 4, '#f4f2ee'); g.contour('#5a5a62'); return g; },
    leche() { const g = Grid(14, 14); g.rect(4, 4, 6, 9, '#ffffff'); g.rect(4, 2, 6, 3, '#4ab8ff'); g.rect(5, 1, 4, 1, '#4ab8ff'); g.rect(5, 7, 4, 3, '#8ad0ff'); g.rect(4, 4, 1, 9, '#e8f0f8'); g.rect(9, 5, 1, 8, '#c8d4e0'); g.contour('#2a5a8a'); return g; },
    pan() { const g = Grid(14, 14); ovalG(g, 7, 8, 6, 4, '#c8803a'); ovalG(g, 7, 7, 5, 3, '#e0a050'); g.rect(4, 6, 1, 3, '#f0c078'); g.rect(7, 5, 1, 3, '#f0c078'); g.rect(10, 6, 1, 3, '#f0c078'); g.rect(3, 11, 8, 1, '#8a5020'); g.contour('#5a3010'); return g; },
    azucar() { const g = Grid(14, 14); g.rect(3, 5, 8, 8, '#fafaff'); g.rect(3, 3, 8, 3, '#c8d4f0'); g.rect(4, 8, 6, 3, '#ff9ac0'); g.rect(5, 9, 4, 1, '#fff'); g.set(1, 3, '#fff'); g.set(12, 6, '#fff'); g.set(2, 10, '#ffd84a'); g.contour('#5a6090'); return g; },
    queso() { const g = Grid(14, 14); g.art(1, 3, ['.......yyyyy', '....yyyyyyyy', '.yyyyyyyyyyy', 'yyyyyyyyyyyy', 'YYYYYYYYYYYY', 'YYYYYYYYYYYY'], { y: '#ffd84a', Y: '#e8a820' }); g.set(4, 6, '#e8a820'); g.set(8, 5, '#e8a820'); g.set(9, 7, '#c88810'); g.rect(6, 9, 2, 1, '#f4c030'); g.contour('#7a5010'); return g; },
    tortilla() { const g = Grid(14, 14); ovalG(g, 7, 7, 6, 6, '#e8c888'); ovalG(g, 7, 7, 5, 5, '#f4dca0'); [[4, 5], [8, 4], [9, 8], [5, 9], [7, 7]].forEach(([x, y]) => g.set(x, y, '#c89850')); g.contour('#8a6030'); return g; },
    naranja() { const g = Grid(14, 14); ovalG(g, 7, 8, 5, 5, '#ff9a30'); ovalG(g, 7, 7, 4, 3, '#ffb858'); g.rect(6, 2, 2, 2, '#5a3a1a'); g.rect(8, 2, 3, 2, '#3a9a50'); g.set(5, 6, '#ffe0a0'); g.contour('#8a4010'); return g; },
    carne() { const g = Grid(14, 14); ovalG(g, 7, 8, 6, 4, '#d84a5a'); ovalG(g, 7, 7, 5, 3, '#f06a78'); g.rect(4, 6, 6, 1, '#fff0f0'); g.rect(6, 9, 4, 1, '#fff0f0'); g.rect(10, 3, 3, 2, '#f4eed8'); g.rect(12, 2, 2, 2, '#f4eed8'); g.contour('#6a1020'); return g; },
    chocolate() { const g = Grid(14, 14); g.rect(2, 3, 10, 9, '#6a3a1c'); for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) { g.rect(3 + x * 3, 4 + y * 3, 2, 2, '#8a5028'); g.set(3 + x * 3, 4 + y * 3, '#a86a3c'); } g.rect(2, 12, 10, 1, '#3a1c0a'); g.rect(1, 2, 4, 3, '#ffd84a'); g.contour('#2a1208'); return g; }
  };
  function comprarIng(k) {
    const F = ING[k]; if (!F) return;
    if (nivel() < F.nv) { toast('Necesitas cariño nivel ' + F.nv); sfx.no(); return; }
    if (ingN(k) >= ingCap()) { toast('Tu refri ya no tiene lugar para más ' + F.n.toLowerCase() + (CAP_REFRI[e.cuarto.refri] ? '' : '. Un refri más grande guarda más')); sfx.no(); return; }
    if (e.monedas < F.p) { faltanMon(F.p - e.monedas); sfx.no(); return; }
    e.monedas -= F.p; if (typeof animarMonedas === 'function') animarMonedas(F.p, true); ingL(k).push(Date.now()); e.st.compras++; sfx.compra(); toast('¡COMPRASTE: ' + F.n + '! (' + ingN(k) + '/' + ingCap() + ')'); pintar(); guardar(); render();
  }
  function renderMkt(h) {
    const cap = ingCap();
    h += `<div class="th-nota">Ingredientes para cocinar. Se guardan en el REFRI (caben ${cap} de cada uno) y no se echan a perder.</div><div class="th-g3">${ING_ORD.map(k => {
      const F = ING[k], bloq = nivel() < F.nv, n = ingN(k), nf = ingF(k);
      return `<button class="th-c ${bloq ? 'lock' : ''} ${tsel === k ? 'sel' : ''}" data-a="tv_sel" data-k="${k}">${n > 0 ? `<span class="th-cant">x${nf}</span>` : ''}<div class="th-pv"><canvas data-prev="ig_${k}"></canvas></div><div class="th-nm">${F.n}</div>${bloq ? `<span class="pr no">🔒 NV${F.nv}</span>` : `<span class="pr ${e.monedas >= F.p && n < cap ? '' : 'no'}">$ ${F.p}</span>`}</button>`;
    }).join('')}</div>`;
    if (tsel && ING[tsel]) {
      const F = ING[tsel], n = ingN(tsel);
      tSheetH = `<div class="th-big"><canvas data-prev="ig_${tsel}"></canvas></div><div class="th-n">${F.n}</div><div class="th-i">INGREDIENTE: NO SE COME,<br>SE USA PARA COCINAR<br>EN EL REFRI: ${n}/${cap}<br>NO SE ECHA A PERDER</div>` +
        (nivel() < F.nv ? `<div class="est bloq">CARIÑO NV${F.nv}</div>` : n >= cap ? '<div class="est">REFRI LLENO</div>' : `<button class="bt ${e.monedas >= F.p ? 'ok' : 'no'} gran" data-a="ig_comprar" data-k="${tsel}">COMPRAR · $ ${F.p}</button>`);
    } else tsel = null;
    return h;
  }
  function comprarSemilla(id) {
    const S = SEMILLAS[id]; if (!S || S.exclusivo) return;
    const hb = habBloq0('jardin'); if (hb) { toast(hb.n + ' se desbloquea en cariño NV' + hb.nv); sfx.no(); return; }
    if (e.monedas < S.precio) { faltanMon(S.precio - e.monedas); sfx.no(); return; }
    if ((e.semillas[id] || 0) >= 99) { toast('Ya tienes demasiadas'); return; }
    e.monedas -= S.precio; if (typeof animarMonedas === 'function') animarMonedas(S.precio, true); e.semillas[id] = (e.semillas[id] || 0) + 1; e.st.compras++; sfx.compra(); toast('¡COMPRASTE: ' + S.n.toUpperCase() + '!'); pintar(); guardar(); render();
  }
  function renderSemillas(h) {
    h += `<div class="th-nota">Semillas que Simon trajo sin saber de dónde. Se siembran en el JARDÍN (cariño NV10).</div><div class="th-g3">${Object.keys(SEMILLAS).filter(k => !SEMILLAS[k].exclusivo).map(k => {
      const S = SEMILLAS[k], n = e.semillas[k] || 0;
      return `<button class="th-c ${tsel === k ? 'sel' : ''}" data-a="tv_sel" data-k="${k}">${n > 0 ? `<span class="th-cant">x${n}</span>` : ''}<div class="th-pv"><canvas data-prev="sm_${k}"></canvas></div><div class="th-nm">${S.n}</div><span class="pr ${e.monedas >= S.precio ? '' : 'no'}">$ ${S.precio}</span></button>`;
    }).join('')}</div>`;
    if (tsel && SEMILLAS[tsel]) {
      const S = SEMILLAS[tsel];
      tSheetH = `<div class="th-big"><canvas data-prev="sm_${tsel}"></canvas></div><div class="th-n">${S.n}</div><div class="th-i">${S.rareza.toUpperCase()}<br>${S.efecto}<br>TARDA ${S.diasCrecer} ${S.diasCrecer === 1 ? 'DÍA' : 'DÍAS'} EN CRECER<br>DURA ${S.diasVida} DÍAS EN SU MACETA<br>TIENES: ${e.semillas[tsel] || 0}</div>` +
        `<button class="bt ${e.monedas >= S.precio ? 'ok' : 'no'} gran" data-a="j_comprar" data-k="${tsel}">COMPRAR · $ ${S.precio}</button>`;
    } else tsel = null;
    return h;
  }
  function renderJardinElegir() {
    $('m-titulo').textContent = 'SEMBRAR';
    const ids = Object.keys(SEMILLAS).filter(k => (e.semillas[k] || 0) > 0);
    if (!ids.length) return `<div class="centro" style="font-size:8px;line-height:1.9">No tienes semillas todavía.<br>Cómpralas en la TIENDA, pestaña SEMILLAS.</div><div class="centro"><button class="bgrande ok" data-a="j_ir_tienda">IR A LA TIENDA</button></div>`;
    return `<div class="centro" style="font-size:8px;line-height:1.9;color:#aab4ff;margin-bottom:8px">¿Qué semilla siembras?</div><div class="cuadricula">` +
      ids.map(k => { const S = SEMILLAS[k]; return `<div class="card"><div class="pv"><canvas data-prev="sm_${k}"></canvas></div><div class="cn">${S.n}</div><div style="font-size:6px;color:#4a5090">x${e.semillas[k]}</div><button class="bt ok" data-a="j_plantar" data-k="${k}">SEMBRAR</button></div>`; }).join('') +
      `</div>`;
  }
