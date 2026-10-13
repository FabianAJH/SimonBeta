  function renderRefri() {
    const k = e.cuarto.refri, nom = k && ITEMS[k] ? ITEMS[k].n : 'REFRI BASICO', cap = ingCap();
    $('m-titulo').textContent = 'REFRI';
    let h = `<div class="th-top"><span>NV ${refriNv(k)} · ${nom}</span><span>CABEN ${cap} DE CADA UNO</span></div>`;
    h += `<div class="th-g3">${ING_ORD.map(i => {
      const F = ING[i], n = ingN(i), bloq = nivel() < F.nv, lleno = n >= cap, puede = !bloq && !lleno && e.monedas >= F.p;
      return `<div class="th-c ${n ? '' : 'lock'}" style="cursor:default">${n ? `<span class="th-cant">x${n}</span>` : ''}<div class="th-pv"><canvas data-prev="ig_${i}"></canvas></div><div class="th-nm">${F.n}</div><div style="display:flex;align-items:center;justify-content:center;gap:4px;width:100%"><span class="pr ${lleno ? 'ok' : 'no'}" style="padding:2px 4px;font-size:7px;line-height:1">${n}/${cap}</span><button class="bt ${puede ? 'ok' : 'no'}" style="padding:2px 5px;font-size:7px;line-height:1;margin:0;white-space:nowrap" data-a="ig_comprar" data-k="${i}">+$${F.p}</button></div></div>`;
    }).join('')}</div>`;
    h += `<div style="display:flex;gap:8px;margin-top:14px"><button class="bt gran" style="flex:1;padding:12px 0" data-a="rf_mejorar">Mejorar Refri</button><button class="bt ok gran" style="flex:1;padding:12px 0" data-a="ck_abrir">COCINAR</button></div>`;
    return h;
  }
  ORDEN.comida = Object.keys(COMIDAS); ORDEN.extras = ['bomba', 'jarabe']; ORDEN.juguetes = Object.keys(ITEMS).filter(k => ITEMS[k].slot === 'juguete'); ORDEN.cuarto.push(...Object.keys(nuevosItems), 'puf_azul', 'puf_rojo', 'puf_verde', 'puf_rosa', 'puf_morado', 'puf_dorado');

