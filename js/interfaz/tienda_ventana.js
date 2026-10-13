  const restriccionHab = k => {   // ¿a qué habitación está realmente restringido este item? null = se puede colocar en cualquier lado
    const it = ITEMS[k]; if (!it) return null; const t = it.tema;
    if (!t || t === 'todas') return null;
    if (!esMueble(k)) return t;   // papel tapiz, pisos, refris y similares (se equipan, no se arrastran) siempre son exclusivos de su habitación
    if (t === 'bano' || t === 'estudio' || t === 'jardin' || t === 'espacial') return t;
    return it.exclusivo ? t : null;
  };
  var esSecreto = (typeof window !== 'undefined' && typeof window.esSecreto === 'function') ? window.esSecreto : (k => {
    if (!k) return false;
    if (typeof ITEMS !== 'undefined' && ITEMS[k]) { if (ITEMS[k].secreto || ITEMS[k].mascota) return true; }
    if (k === 'pet_sif' || k === 'ojo_pet' || k === 'casco_espacial' || k === 'gorro_chef' || k === 'platillo_mini' || k === 'peluche_cortex' || k === 'marco_cortex_bebe' || k === 'aura_legend' || k === 'aura_trueno' || k === 'aura_eterna') return true;
    if (typeof CONFIG_EASTEREGGS !== 'undefined') { for (const s of Object.values(CONFIG_EASTEREGGS)) { if (s && s.recompensa === k) return true; } }
    return false;
  });
  const baseTienda = k => !esSecreto(k) && (tab !== 'cuarto' || !habBloq(k)) && (tab !== 'ropa' || (fRopa === 'todo' ? !ITEMS[k].mascota : (fRopa === 'prem' ? (ITEMS[k].prem && !ITEMS[k].mascota) : ITEMS[k].slot === fRopa))) && (tab !== 'cuarto' || fHab === 'todo' || ((esMueble(k) || ITEMS[k].pat || ITEMS[k].refri || ITEMS[k].util) && (fHab === 'general' ? !restriccionHab(k) : restriccionHab(k) === fHab))) && (tab === 'comida' || k === 'bomba' || k === 'jarabe' || !(ITEMS[k].mercader || ITEMS[k].codigo) || e.tiene[k] || ITEMS[k].prem);
  var tv = 'hub', tvPre = false, tsel = null, tSheetH = '';
  var tBuscar = '';
  const CATS = [['ropa', 'ROPA', 'sud_azul'], ['cuarto', 'MUEBLES', 'silla'], ['comida', 'COMIDA', 'fd_dona'], ['mkt', 'MERCADO', 'ig_jitomate'], ['juguetes', 'JUGUETES', 'juguete_azul'], ['semillas', 'SEMILLAS', 'sm_brote'], ['extras', 'EXTRAS', 'fd_bomba'], ['prem', 'PREMIUM', 'alas_angel']];
  const catDe = k => ['ropa', 'cuarto', 'juguetes'].find(t => ORDEN[t].includes(k));
  const compraOk = k => { const it = ITEMS[k]; return it && !e.tiene[k] && !it.prem && !it.regalo && !esSecreto(k) && it.p > 0 && nivel() >= it.nv && !habBloq(k) && !(it.mercader || it.codigo); };
  // orden de la tienda por categoría: primero lo que se parece (todos los refris juntos, todos los pisos juntos...), luego por cuarto, nivel y precio
  const SLOT_R = ['pared', 'piso', 'alfombra', 'refri', 'sarten2', 'cuadro', 'decoP', 'izq', 'der', 'deco'];
  function ordenT(k) {
    const it = ITEMS[k];
    if (tab === 'ropa') {
      // pestaña ROPA: premium siempre al inicio (sin importar su nivel), luego por nivel ascendente, precio como desempate
      return [it.prem ? 0 : 1, it.nv || 1, it.p || 0];
    }
    const sl = it.slot || '', r = SLOT_R.indexOf(sl.replace(/_.*/, '')), ti = tab === 'cuarto' ? HABS.findIndex(h => h.id === it.tema) : 0;
    // lo aún no desbloqueado (por nivel o por habitación) se manda hasta el fondo, pero conserva el mismo orden entre sí
    const bloqueado = !it.prem && !it.regalo && !e.tiene[k] && (nivel() < (it.nv || 1) || !!habBloq(k));
    return [bloqueado ? 1 : 0, r === -1 ? 99 : r, ti === -1 ? 99 : ti, (it.nv || 1), (it.p || 0)];
  }
  function itemsTiendaBase(t) {
    let base = ORDEN[t].filter(k => baseTienda(k) && !esSecreto(k));
    if ((t === 'ropa' || t === 'cuarto') && tBuscar) {
      const q = quitaAc(tBuscar).trim().toUpperCase();
      if (q) base = base.filter(k => quitaAc(ITEMS[k].n).toUpperCase().includes(q));
    }
    if (t === 'comida') {
      return base.slice().sort((a, b) => (COMIDAS[a].p - COMIDAS[b].p) || (COMIDAS[a].nv - COMIDAS[b].nv));
    }
    return base.map((k, i) => [k, grupoT(k), i]).sort(['cuarto', 'ropa', 'juguetes'].includes(t) ? (x, y) => { const A = ordenT(x[0]), B = ordenT(y[0]); for (let j = 0; j < A.length; j++) if (A[j] !== B[j]) return A[j] - B[j]; return x[2] - y[2]; } : (x, y) => x[1] - y[1] || x[2] - y[2]).map(x => x[0]);
  }
  function renderTiendaCards(base, ct) {
    if (!base.length) return '<div class="centro" style="grid-column:1/-1;font-size:7px;color:#aab4ff;padding:16px 0;line-height:1.8">No hay nada que coincida con eso.</div>';
    const vis = (e.tn || {})[ct] || 1;
    return base.map(k => {
      const pv = tab === 'comida' ? 'fd_' + k : k === 'bomba' ? 'fd_bomba' : k === 'jarabe' ? 'fd_jarabe' : k, nw = tab !== 'comida' && tab !== 'extras' && compraOk(k) && ITEMS[k].nv > vis && ITEMS[k].nv > 1, g = grupoT(k);
      const nCant = tab === 'comida' ? (e.comida[k] || 0) : k === 'bomba' ? (e.bombas || 0) : k === 'jarabe' ? (e.meds || 0) : 0;
      const cant = nCant > 0 ? `<span class="th-cant">x${nCant}</span>` : '';
      const ih = (tab === 'cuarto' || tab === 'juguetes') ? (esFondo(k) ? (temaDe(k) !== 'todas' ? (HAB_ICO[temaDe(k)] || '') : '') : iconoHabDe(k)) : '', hico = ih ? `<span class="mue-hab">${ih}</span>` : '';
      let statTag = '';
      if (tab === 'comida') {
        const F = COMIDAS[k];
        if (F.rand) {
          statTag = `<div style="font-size:5px;color:#ffd84a;margin-top:1px">¡SORPRESA!</div>`;
        } else {
          const partes = [];
          if (F.h > 0) partes.push(`<span style="color:#aab4ff;display:inline-flex;align-items:center;gap:1px"><canvas class="ic-sub" data-prev="ic_ham"></canvas>+${F.h}</span>`);
          if (F.e > 0) partes.push(`<span style="color:#ffe45a">⚡+${F.e}</span>`);
          statTag = `<div style="font-size:5px;margin-top:1px;line-height:1.2">${partes.join(' ')}</div>`;
        }
      }
      return `<button class="th-c ${puesto(k) ? 'puesto' : ''} ${g === 1 ? 'lock' : ''} ${tsel === k ? 'sel' : ''}" data-a="tv_sel" data-k="${k}">${nw ? '<span class="th-nw">NUEVO</span>' : ''}${cant}${hico}<div class="th-pv"><canvas data-prev="${pv}"></canvas></div><div class="th-nm">${tab === 'comida' ? COMIDAS[k].n : k === 'bomba' ? 'BOMBA' : k === 'jarabe' ? 'JARABE' : ITEMS[k].n}</div>${statTag}${pillT(k)}</button>`;
    }).join('');
  }
  function dibujarPrevCanvases(el) {
    if (!el) return;
    el.querySelectorAll('canvas[data-prev]').forEach(c => {
      const g = prevGrid(c.dataset.prev);
      c.width = g.w; c.height = g.h; c.getContext('2d').drawImage(gridCanvas(g), 0, 0);
      const isMerc = !!c.closest('.pv-merc') || !!c.closest('.cuadricula.merc');
      const isCelHab = !!c.closest('.cel-pv-hab');
      const isCelGift = !!c.closest('.cel-pv-gift');
      const isCelIt = !!c.closest('.cel-it');
      const z = isMerc ? Math.max(1, Math.min(Math.floor(116 / g.w), Math.floor(82 / g.h))) :
                isCelHab ? 1 :
                isCelGift ? Math.max(1, Math.min(2, Math.floor(32 / Math.max(g.w, g.h)))) :
                isCelIt ? Math.max(1, Math.floor(22 / Math.max(g.w, g.h))) :
                (c.dataset.prev.startsWith('lg_') || c.dataset.prev.startsWith('hb_')) ? 3 :
                c.dataset.prev.startsWith('juguete_') ? 4 :
                c.dataset.prev.startsWith('fo_') ? 3 :
                c.dataset.prev.startsWith('marco_') ? 2 :
                (c.dataset.prev.startsWith('fd_') || c.dataset.prev.startsWith('mj_')) ? Math.max(2, Math.floor((c.closest('.mini') ? 32 : 54) / Math.max(g.w, g.h))) :
                c.dataset.prev.startsWith('rt_can_') ? Math.max(2, Math.floor(72 / Math.max(g.w, g.h))) :
                c.dataset.prev.startsWith('pen_') ? Math.max(1, Math.floor(30 / Math.max(g.w, g.h))) :
                c.dataset.prev === 'caja' ? 4 :
                c.dataset.prev.startsWith('dib_') ? (c.parentElement.classList.contains('galeria') ? 3 : 8) : 2;
      c.style.width = g.w * z + 'px'; c.style.height = g.h * z + 'px';
    });
  }
  function grupoT(k) {
    if (tab === 'comida') return nivel() >= COMIDAS[k].nv ? 0 : 1;
    if (tab === 'extras') return 0;
    const it = ITEMS[k]; if (e.tiene[k]) return 2; if (it.prem || it.regalo) return 3; return compraOk(k) ? 0 : 1;
  }
  function nuevosCat(c) {
    const vis = (e.tn || {})[c] || 1;
    if (c === 'comida') return Object.keys(COMIDAS).filter(k => COMIDAS[k].p > 0 && COMIDAS[k].nv > vis && COMIDAS[k].nv <= nivel()).length;
    if (c === 'extras' || c === 'mkt' || c === 'semillas') return 0;
    const lista = c === 'prem' ? ORDEN.ropa.filter(k => ITEMS[k].prem && !esSecreto(k)) : ORDEN[c].filter(k => !ITEMS[k].prem && !esSecreto(k));
    return lista.filter(k => compraOk(k) && ITEMS[k].nv > vis).length;
  }
  function pillT(k) {
    if (tab === 'comida') { const F = COMIDAS[k]; if (nivel() < F.nv) return `<span class="pr no">🔒 NV${F.nv}</span>`; return `<span class="pr ${e.monedas >= F.p ? '' : 'no'}">$ ${F.p}</span>`; }
    if (tab === 'extras') return `<span class="pr ${e.monedas >= (k === 'bomba' ? BOMBA_PRECIO : MED_PRECIO) ? '' : 'no'}">$ ${k === 'bomba' ? BOMBA_PRECIO : MED_PRECIO}</span>`;
    const it = ITEMS[k];
    if (puesto(k)) return '<span class="pr puesto">PUESTO</span>';
    if (e.tiene[k]) return '<span class="pr ok">PONER</span>';
    if (it.prem) return '<span class="pr pm">PREMIUM</span>';
    if (it.regalo === 'nivel') return `<span class="pr no">GRATIS NV${it.gnv}</span>`;
    if (it.regalo) return '<span class="pr no">LOGRO</span>';
    if (habBloq(k)) return `<span class="pr no">🔒 NV${habBloq(k).nv}</span>`;
    if (nivel() < it.nv) return `<span class="pr no">🔒 NV${it.nv}</span>`;
    return `<span class="pr ${e.monedas >= it.p ? '' : 'no'}">$ ${it.p}</span>`;
  }
  function premInfo(k) {   // cómo se consigue una prenda premium + cuánto lleva el jugador
    const it = ITEMS[k], lg = LOGROS.find(l => l.item === k), st = PREM_SETS.find(x => x.premio === k);
    if (lg) { const v = Math.min(lg.val(), lg.meta); return `<span style="color:#ffd84a">CÓMO CONSEGUIRLA</span><br>COMPLETA EL LOGRO:<br>«${lg.n.toUpperCase()}»<br>LLEVAS: ${v}/${lg.meta}`; }
    if (st) { const falta = st.items.filter(x => !e.tiene[x]).map(x => ITEMS[x].n); return `<span style="color:#ffd84a">CÓMO CONSEGUIRLA</span><br>JUNTA TODO EL SET ${st.n} (${st.items.length - falta.length}/${st.items.length})<br>${falta.length ? 'TE FALTA: ' + falta.join(', ') : '¡LO TIENES TODO!'}<br>EL PREMIO LLEGA SOLO`; }
    if (it.mercader) return `<span style="color:#ffd84a">CÓMO CONSEGUIRLA</span><br>LA VENDE CORTEX CUANDO VISITA LA CASA<br>PRECIO: $ ${it.p}`;
    return it.prem;
  }
  function hojaTienda(k) {
    let pv, nom, info = '', bt = '';
    if (tab === 'comida') {
      const F = COMIDAS[k]; pv = 'fd_' + k; nom = F.n;
      let stats = [];
      if (F.rand) stats.push('¡EFECTO SORPRESA!');
      else {
        if (F.h > 0) stats.push('COMIDA +' + F.h);
        if (F.e > 0) stats.push('ENERGÍA +' + F.e);
      }
      info = stats.join('<br>') + '<br>TIENES: ' + (e.comida[k] || 0);
      bt = nivel() < F.nv ? `<div class="est bloq">CARIÑO NV${F.nv}</div>` : `<button class="bt ${e.monedas >= F.p ? 'ok' : 'no'} gran" data-a="f_comprar" data-k="${k}">COMPRAR · $ ${F.p}</button>`;
    } else if (k === 'bomba') {
      pv = 'fd_bomba'; nom = 'BOMBA'; info = '¡BOOM!<br>TIENES: ' + (e.bombas || 0); bt = `<button class="bt ${e.monedas >= BOMBA_PRECIO ? 'ok' : 'no'} gran" data-a="b_comprar">COMPRAR · $ ${BOMBA_PRECIO}</button>`;
    } else if (k === 'jarabe') {
      pv = 'fd_jarabe'; nom = 'JARABE'; info = 'CURA EL RESFRIADO<br>TIENES: ' + (e.meds || 0);
      bt = `<button class="bt ${e.monedas >= MED_PRECIO ? 'ok' : 'no'} gran" data-a="med_comprar">COMPRAR · $ ${MED_PRECIO}</button>` + ((e.meds || 0) > 0 ? `<button class="bt ${e.enf ? 'ok' : 'no'} gran" style="margin-top:6px" data-a="med_usar">USAR (${e.meds})</button>` : '');
    } else {
      const it = ITEMS[k]; pv = k; nom = it.n;
      info = it.refri ? 'REFRI NV ' + refriNv(k) + '<br>CABEN ' + (CAP_REFRI[k] || 5) + ' DE CADA INGREDIENTE' : it.util ? 'UNA SARTÉN EXTRA EN LA ESTUFA<br>COCINA DOS COSAS A LA VEZ' : esMueble(k) && it.slot !== 'juguete' && it.tema && it.tema !== 'todas' ? 'IDEAL: ' + (HABS.find(h => h.id === it.tema) || { n: it.tema.toUpperCase() }).n : '';
      if (puesto(k)) bt = PORDEFECTO[it.slot] ? '<div class="est">PUESTO</div>' : `<button class="bt gran" data-a="quitar" data-k="${k}">QUITAR</button>`;
      else if (e.tiene[k]) bt = `<button class="bt ok gran" data-a="poner" data-k="${k}">PONER</button>`;
      else if (it.prem) { info = premInfo(k); bt = ''; }
      else if (it.regalo) bt = '<div class="est">' + (it.regalo === 'nivel' ? 'REGALO AL LLEGAR A CARIÑO NV' + it.gnv : it.regalo === 'logro' ? 'SE GANA CON UN LOGRO' : 'REGALO DIA 7') + '</div>';
      else if (habBloq(k)) bt = `<div class="est bloq">${habBloq(k).n} NV${habBloq(k).nv}</div>`;
      else if (nivel() < it.nv) bt = `<div class="est bloq">CARIÑO NV${it.nv}</div>`;
      else if (refReq(k)) bt = `<div class="est bloq">PRIMERO: ${ITEMS[refReq(k)].n}</div>`;
      else bt = `<button class="bt ${e.monedas >= it.p ? 'ok' : 'no'} gran" data-a="comprar" data-k="${k}">COMPRAR · $ ${it.p}</button>`;
    }
    return `<div class="th-big">${pv ? `<canvas data-prev="${pv}"></canvas>` : '<span style="font-size:30px;color:#ff6a78">+</span>'}</div><div class="th-n">${nom}</div><div class="th-i">${info}</div>${bt}`;
  }
  function renderTienda() {
    tSheetH = '';
    const mon = `<div class="th-mon">$ ${e.monedas}</div>`;
    if (tv === 'hub') {
      $('m-titulo').textContent = 'TIENDA';
      const nv = nivel(), top = Object.keys(ITEMS).filter(k => compraOk(k) && ITEMS[k].nv > 1 && ITEMS[k].nv <= nv && catDe(k)).sort((a, b) => ITEMS[b].nv - ITEMS[a].nv).slice(0, 4);
      let h = `<div class="th-top"><span>CARIÑO NV${nv}</span>${mon}</div>`;
      h += `<div class="th-g2">${CATS.filter(([c]) => (c !== 'mkt' || !habBloq0('cocina')) && (c !== 'semillas' || !habBloq0('jardin'))).map(([c, n, pv]) => { const nw = nuevosCat(c); let sub = '';
        if (c === 'ropa') sub = ORDEN.ropa.filter(k => !(ITEMS[k].prem || esSecreto(k) || ITEMS[k].mascota) && e.tiene[k]).length + '/' + ORDEN.ropa.filter(k => !(ITEMS[k].prem || esSecreto(k) || ITEMS[k].mascota)).length;
        else if (c === 'prem') sub = ORDEN.ropa.filter(k => ITEMS[k].prem && !esSecreto(k) && !ITEMS[k].mascota && e.tiene[k]).length + '/' + ORDEN.ropa.filter(k => ITEMS[k].prem && !esSecreto(k) && !ITEMS[k].mascota).length;
        else if (c === 'cuarto' || c === 'juguetes') sub = ORDEN[c].filter(k => e.tiene[k]).length + '/' + ORDEN[c].length;
        return `<button class="th-t ${c === 'prem' ? 'prem' : ''}" data-a="tv_cat" data-k="${c}">${nw ? `<span class="th-pill">${nw} NUEVO${nw > 1 ? 'S' : ''}</span>` : ''}<div class="th-pv"><canvas data-prev="${pv}"></canvas></div><b>${n}</b>${sub ? `<i>${sub} TUYOS</i>` : ''}</button>`; }).join('')}</div>`;
      if (top.length) h += `<div class="th-ban" style="margin:14px 0 0"><small>★ LO ULTIMO DESBLOQUEADO ★</small><div class="th-r">${top.map(k => `<button data-a="tv_item" data-k="${k}"><canvas data-prev="${k}"></canvas></button>`).join('')}</div></div>`;
      return h;
    }
    const ct = tab === 'ropa' && fRopa === 'prem' ? 'prem' : tab;
    $('m-titulo').textContent = (CATS.find(c => c[0] === ct) || CATS[0])[1];
    let h = `<div class="th-top"><button class="th-back" data-a="tv_back">&lt; VOLVER</button>${mon}</div>`;
    if (tab === 'mkt') return renderMkt(h);
    if (tab === 'semillas') return renderSemillas(h);
    if (tab === 'ropa') { if (fRopa === 'mascota') fRopa = 'todo'; h += `<div class="th-chips">${ROPA_SLOTS.filter(([f]) => f !== 'mascota').map(([f, t]) => `<button class="${fRopa === f ? 'on' : ''}${f === 'prem' ? ' prem' : ''}" data-a="fr" data-k="${f}">${t}</button>`).join('')}</div>`; }
    if (tab === 'cuarto') h += `<div class="th-chips">${[['todo', 'TODO'], ['general', 'GENERAL'], ['estudio', 'ESTUDIO'], ['juegos', 'JUEGOS'], ['sala', 'RECAMARA'], ['bano', 'BAÑO'], ['cocina', 'COCINA'], ['entrada', 'ENTRADA'], ['jardin', 'JARDÍN'], ['espacial', 'ESPACIO']].filter(([f]) => f === 'todo' || f === 'general' || !habBloq0(f)).map(([f, t]) => `<button class="${fHab === f ? 'on' : ''}" data-a="fh" data-k="${f}">${t}</button>`).join('')}</div>`;
    if (tab === 'ropa' || tab === 'cuarto') {
      const ph = tab === 'ropa' ? 'BUSCAR ROPA...' : 'BUSCAR MUEBLE...';
      const val = (tBuscar || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
      h += `<div class="buscar-wrap"><input id="th-buscar" class="th-buscar" type="text" placeholder="${ph}" value="${val}" autocomplete="off"><button id="th-buscar-x" class="buscar-x" data-a="th_buscar_x" aria-label="Borrar búsqueda" style="${val ? 'display:flex' : 'display:none'}">✕</button></div>`;
    }
    const base = itemsTiendaBase(tab);
    h += `<div class="th-nota">${tab === 'juguetes' ? 'Solo uno a la vez: el que usa al JUGAR.' : tab === 'cuarto' ? 'Se colocan con la casita.' : tab === 'comida' ? 'Comida para el hambre y bebidas o platillos especiales para la energía.' : tab === 'ropa' && fRopa === 'prem' ? 'No se compran: se ganan. Toca una para ver cómo.' : ''}</div>`;
    h += `<div class="th-g3" id="th-grid">${renderTiendaCards(base, ct)}</div>`;
    if (tab === 'ropa' && fRopa === 'prem') h += `<div class="centro" style="font-size:8px;color:#ffd84a;margin:14px 0 8px">COLECCIONES</div>` + PREM_SETS.map(s => { const n = s.items.filter(k => e.tiene[k]).length; return `<div class="card" style="margin-bottom:8px;text-align:left;padding:8px"><div class="cn" style="text-align:left">SET ${s.n}: ${n}/${s.items.length}${e.tiene[s.premio] ? ' ✔' : ''}</div><div class="etq" style="margin:4px 0">${s.items.map(k => (e.tiene[k] ? '✔ ' : '· ') + ITEMS[k].n).join('<br>')}</div><div class="prem-premio"><div class="th-pv prem-premio-pv"><canvas data-prev="${s.premio}"></canvas></div><div class="prem-premio-tx"><span class="etq pm" style="margin:0">PREMIO</span><b>${ITEMS[s.premio].n}</b></div></div></div>`; }).join('');
    if (tsel && base.includes(tsel)) tSheetH = hojaTienda(tsel); else tsel = null;
    return h;
  }
