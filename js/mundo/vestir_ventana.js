  var vBuscar = '';
  function renderVestGrid() {
    const ropa = Object.keys(ITEMS).filter(k => ITEMS[k].tipo === 'ropa' && (ITEMS[k].mascota ? tienePet(k) : e.tiene[k])).sort((a, b) => (ITEMS[a].nv || 1) - (ITEMS[b].nv || 1) || (ITEMS[a].p || 0) - (ITEMS[b].p || 0));
    const q = quitaAc(vBuscar || '').trim().toUpperCase();
    let h = '';
    if (vF === 'mascota') {
      const activas = petsActivas();
      let hay = ropa.filter(k => ITEMS[k].slot === 'mascota');
      if (q) hay = hay.filter(k => quitaAc(ITEMS[k].n).toUpperCase().includes(q));
      h += `<div style="font-size:7px;color:#aab4ff;text-align:center;margin-bottom:8px">ACTIVAS: ${activas.length}/3 — toca para poner o quitar</div>`;
      h += hay.length ? `<div class="vs-g">${hay.map(k => `<button class="vs-t ${petActiva(k) ? 'on' : ''}" data-a="vs_pet" data-k="${k}"><div class="vs-pv"><canvas data-prev="${k}"></canvas></div><span>${ITEMS[k].n}</span>${petActiva(k) ? '<span style="font-size:5px;color:#6adf6a">ACTIVA</span>' : (activas.length >= 3 ? '<span style="font-size:5px;color:#ff7a7a">LLENO</span>' : '')}</button>`).join('')}</div>` : `<div class="centro" style="font-size:7px;color:#aab4ff;margin:18px 0">${q ? 'No hay nada que coincida con eso.' : 'Aún no tienes mascotas.'}</div>`;
    } else {
      let ks = vF === 'todo' ? ropa.filter(k => !ITEMS[k].mascota) : ropa.filter(k => ITEMS[k].slot === vF && !ITEMS[k].mascota);
      if (q) ks = ks.filter(k => quitaAc(ITEMS[k].n).toUpperCase().includes(q));
      h += ks.length ? `<div class="vs-g">${ks.map(k => `<button class="vs-t ${e.ropa[ITEMS[k].slot] === k ? 'on' : ''}" data-a="vs_t" data-k="${k}"><div class="vs-pv"><canvas data-prev="${k}"></canvas></div><span>${ITEMS[k].n}</span></button>`).join('')}</div>` : `<div class="centro" style="font-size:7px;color:#aab4ff;margin:18px 0">${q ? 'No hay nada que coincida con eso.' : 'No tienes nada de esto todavía.'}</div>`;
    }
    return h;
  }
  function renderVest() {
    $('m-titulo').textContent = '';
    const cam = vsCambios();
    let h = `<div class="th-chips" style="margin:-6px 0 8px">${ROPA_SLOTS.filter(([f]) => f !== 'prem').map(([f, t]) => `<button class="${vF === f ? 'on' : ''}" data-a="vs_f" data-k="${f}">${t}</button>`).join('')}</div>`;
    const val = (vBuscar || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
    h += `<div class="buscar-wrap"><input id="vs-buscar" class="th-buscar vs-buscar" type="text" placeholder="BUSCAR ROPA..." value="${val}" autocomplete="off"><button id="vs-buscar-x" class="buscar-x" data-a="vs_buscar_x" aria-label="Borrar búsqueda" style="${val ? 'display:flex' : 'display:none'}">✕</button></div>`;
    h += `<div id="vs-grid">${renderVestGrid()}</div>`;
    return h;
  }
