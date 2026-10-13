  /* ===================== DECORAR EL CUARTO ===================== */
  const ptoLog = ev => { const r = cv.getBoundingClientRect(); return { x: (ev.clientX - r.left) / r.width * LW, y: (ev.clientY - r.top) / r.height * LH }; };
  function edTap(el, fn) {   // actúa solo si fue un toque real; si el dedo se movió (deslizando la lista para hacer scroll), no hace nada
    let sx = 0, sy = 0, pid = null, mov = false;
    el.addEventListener('pointerdown', ev => { pid = ev.pointerId; sx = ev.clientX; sy = ev.clientY; mov = false; });
    el.addEventListener('pointermove', ev => { if (ev.pointerId !== pid) return; if (Math.hypot(ev.clientX - sx, ev.clientY - sy) > 9) mov = true; });
    const fin = ev => { if (ev.pointerId !== pid) return; pid = null; if (!mov) { ev.preventDefault(); fn(ev); } };
    el.addEventListener('pointerup', fin); el.addEventListener('pointercancel', () => { pid = null; mov = false; });
  }
  const filtroCat = k => { const it = ITEMS[k]; if (it.slot === 'juguete') return 'juguetes'; return it.semilla ? 'flores' : (it.slot === 'decoP' || it.estilo === 'pared') ? 'pared' : 'piso'; };
  // "único de aquí" = un item que, por su tema, SOLO se puede colocar en la habitación actual (ver restriccionHab en tienda_ventana.js)
  const esUnicoAqui = k => (typeof restriccionHab === 'function' ? restriccionHab(k) : null) === e.hab;
  const FILTRO_NOM = { disp: 'DISPONIBLES', unicos: 'UNICOS', pared: 'PARED', piso: 'PISO', flores: 'FLORES', juguetes: 'JUGUETES' };
  function pintarEdLista() {
    const bd = $('ed-bd'); bd.innerHTML = '';
    let lista = (edit._todos || []).slice();
    if (edit.filtro && edit.filtro !== 'todo') lista = lista.filter(k => edit.filtro === 'disp' ? usableAqui(k) : edit.filtro === 'unicos' ? esUnicoAqui(k) : (filtroCat(k) === edit.filtro && usableAqui(k)));
    if (edit.buscar) { const q = quitaAc(edit.buscar).toUpperCase(); lista = lista.filter(k => quitaAc(ITEMS[k].n).toUpperCase().includes(q)); }
    const edRango = k => {   // paredes primero, luego pisos, luego el resto de items (según la sección que se esté viendo)
      const it = ITEMS[k];
      if (edit.filtro === 'pared') return it.estilo === 'pared' ? 0 : 1;
      if (edit.filtro === 'piso') return it.estilo === 'piso' ? 0 : 1;
      if (edit.filtro === 'juguetes') return it.slot === 'juguete' ? 0 : 1;
      return it.estilo === 'pared' ? 0 : it.estilo === 'piso' ? 1 : (it.slot === 'juguete' ? 3 : 2);
    };
    lista.sort((a, b) => { const ra = edRango(a), rb = edRango(b); return ra !== rb ? ra - rb : ITEMS[a].n.localeCompare(ITEMS[b].n); });
    lista.forEach(k => {
      const g = prevGrid(k), b = document.createElement('button'), c = document.createElement('canvas'), z = Math.max(1, Math.floor(34 / Math.max(g.w, g.h))), nm = document.createElement('div');
      c.width = g.w; c.height = g.h; c.getContext('2d').drawImage(gridCanvas(g), 0, 0); c.style.width = g.w * z + 'px'; c.style.height = g.h * z + 'px';
      nm.textContent = ITEMS[k].n;
      if (esFondo(k)) {
        const slot = ITEMS[k].slot, activo = e.cuarto[slot] === k, t = temaDe(k), aqui = t === 'todas' || t === e.hab;
        const dot = document.createElement('span'); dot.className = 'mue-dot' + (activo ? ' on' : ''); b.appendChild(dot);
        const ih = t !== 'todas' ? (HAB_ICO[t] || '') : ''; if (ih) { const hs = document.createElement('span'); hs.className = 'mue-hab'; hs.textContent = ih; b.appendChild(hs); }
        b.appendChild(c); b.appendChild(nm);
        if (activo) b.classList.add('sel');
        b.onclick = () => {
          if (!aqui) { toast('Esto solo se puede usar en ' + (HABS.find(h => h.id === t) || {}).n); sfx.no(); return; }
          e.cuarto[slot] = activo ? (DEF_FONDO[slot] || null) : k; sfx.click(); guardar(); pintar(); pintarEdLista();
        };
        bd.appendChild(b);
        return;
      }
      const iAqui = e.deco.findIndex(d => d.k === k && (d.h || 'sala') === e.hab), colocado = e.deco.some(d => d.k === k);
      const dot = document.createElement('span'); dot.className = 'mue-dot' + (colocado ? ' on' : ''); b.appendChild(dot);
      const ih = iconoHabDe(k); if (ih) { const hs = document.createElement('span'); hs.className = 'mue-hab'; hs.textContent = ih; b.appendChild(hs); }
      b.appendChild(c); b.appendChild(nm);
      if (iAqui >= 0 && edit.sel === iAqui) b.classList.add('sel');
      if (iAqui >= 0) {
        if (muProtegido(k)) edTap(b, () => { edit.sel = iAqui; sfx.click(); pintarEdicion(); });
        else edTap(b, () => { e.deco.splice(iAqui, 1); edit.sel = null; sfx.click(); guardar(); pintarEdicion(); });   // tocar un item ya colocado aquí lo quita; mover/voltear se hace tocándolo en la escena
      } else {
        const colocarEnPunto = ptEv => {
          if (!colocar(k)) return;
          const j = e.deco.findIndex(d => d.k === k), d = e.deco[j];
          if (ptEv && !(d.h === 'estudio' && ITEMS[k].zona)) {
            const p = ptoLog(ptEv); d.x = Math.round(p.x - LW / 2); d.y = Math.round(p.y - RY);
            const r = posReal(d); d.x = Math.round(r.cx - LW / 2); d.y = Math.round((esPared(k) ? r.cy : r.base) - RY);
          }
          edit.sel = j; sfx.compra(); guardar(); pintarEdicion();
        };
        edTap(b, () => colocarEnPunto(null));
      }
      bd.appendChild(b);
    });
    if (!bd.children.length) {
      const t = document.createElement('div'); t.style.cssText = 'font-size:7px;color:#aab4ff;line-height:1.8';
      t.textContent = (edit.buscar || (edit.filtro && edit.filtro !== 'todo')) ? 'No hay nada que coincida con eso.' : 'Aún no tienes muebles. ¡Visita la TIENDA!';
      bd.appendChild(t);
    }
  }
  function pintarEdicion() {
    { const I = capaInfo(); $('ed-capa-ctrl').classList.toggle('off', !I); $('ed-ci').textContent = I ? I.pos + '/' + I.mis.length : '-'; }
    const todos = Object.keys(ITEMS).filter(k => e.tiene[k] && (esFondo(k) || esMueble(k)));   // incluye muebles y juguetes en TODO
    edit._todos = todos;
    const fi = $('ed-filtros');
    const cats = [['todo', 'TODO', todos.length]];
    Object.keys(FILTRO_NOM).forEach(id => {
      if (id === 'juguetes' && e.hab !== 'sala') return;
      const c = todos.filter(k => id === 'disp' ? usableAqui(k) : id === 'unicos' ? esUnicoAqui(k) : (filtroCat(k) === id && usableAqui(k))).length;
      if (c) cats.push([id, FILTRO_NOM[id], c]);
    });
    if (!cats.some(c => c[0] === edit.filtro)) edit.filtro = 'todo';
    fi.innerHTML = cats.map(([id, n, c]) => `<button class="${edit.filtro === id ? 'on' : ''}" data-fi="${id}">${n} (${c})</button>`).join('');
    fi.querySelectorAll('button').forEach(b => b.onclick = () => { edit.filtro = b.dataset.fi; sfx.click(); fi.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); pintarEdLista(); });
    pintarEdLista();
    posEdOverlay();
  }
