  var iv = 'hub', ivCat = 'ropa', ivF = 'todo', isel = null, iSheetH = '';
  var jSel = null;   // índice de la parcela del jardín que se está por sembrar (modal 'jardin')
  const IV_CATS = [['ropa', 'ROPA', 'sud_roja'], ['mue', 'MUEBLES', 'cactus'], ['jug', 'JUGUETES', 'juguete_azul'], ['fon', 'PAREDES Y OBRAS', 'pared_azul'], ['ext', 'EXTRAS', 'fd_bomba'], ['mas', 'MASCOTAS', 'ojo_pet']];
  const habN = id => { const h = HABS.find(x => x.id === id); return h ? h.n : id.toUpperCase(); };
  function invListas() {
    const tiene = k => ITEMS[k] && e.tiene[k];
    const todos = Object.keys(ITEMS).filter(tiene);
    const L = {
      ropa: todos.filter(k => ITEMS[k].tipo === 'ropa'),
      mue: todos.filter(k => esMueble(k) && ITEMS[k].slot !== 'juguete'),
      jug: todos.filter(k => ITEMS[k].slot === 'juguete'),
      fon: todos.filter(k => ITEMS[k].tipo === 'cuarto' && !esMueble(k)),
      com: Object.keys(COMIDAS).filter(k => e.comida[k] > 0),
      ext: [...((e.alv && e.alv.tiene) ? ['trebol4'] : []), ...((e.bombas || 0) > 0 ? ['bomba'] : []), ...((e.meds || 0) > 0 ? ['jarabe'] : [])],
      mas: [...(tienePet('ojo_pet') ? ['ojo_pet'] : []), ...(tienePet('pet_sif') ? ['pet_sif'] : [])]
    };
    const ord = (a, b) => (puesto(b) ? 1 : 0) - (puesto(a) ? 1 : 0) || (ITEMS[a].nv || 1) - (ITEMS[b].nv || 1) || (ITEMS[a].p || 0) - (ITEMS[b].p || 0);
    ['ropa', 'mue', 'jug', 'fon'].forEach(c => L[c].sort(ord));
    return L;
  }
  const ivPrev = k => k === 'ojo_pet' ? 'ojo_pet' : k === 'pet_sif' ? 'pet_sif' : COMIDAS[k] ? 'fd_' + k : k === 'bomba' ? 'fd_bomba' : k === 'jarabe' ? 'fd_jarabe' : k;
  const ivNom = k => k === 'trebol4' ? 'TRÉBOL DE 4 HOJAS' : k === 'ojo_pet' ? 'OJO DE CTHULHU' : k === 'pet_sif' ? 'SIF' : COMIDAS[k] ? COMIDAS[k].n : k === 'bomba' ? 'BOMBA' : k === 'jarabe' ? 'JARABE' : ITEMS[k].n;
  function ivEstado(k) {   // etiqueta de la esquina: dónde está o si está en uso
    if (COMIDAS[k]) return ['n', 'x' + e.comida[k]];
    if (k === 'trebol4') return ['n', 'x1'];
    if (k === 'bomba') return ['n', 'x' + (e.bombas || 0)];
    if (k === 'jarabe') return ['n', 'x' + (e.meds || 0)];
    if (k === 'ojo_pet') return e.ojoOn !== 0 ? ['ok', 'CON SIMON'] : ['n', 'GUARDADO'];
    if (k === 'pet_sif') return petActiva(k) ? ['ok', 'ACTIVA'] : ['n', 'INACTIVA'];
    if (esMueble(k)) {
      if (ITEMS[k].slot === 'juguete') return puesto(k) ? ['ok', 'EN USO'] : null;
      const d = e.deco.find(x => x.k === k); return d ? ['ok', habN(d.h || 'sala')] : ['no', 'SIN COLOCAR'];
    }
    return puesto(k) ? ['ok', PORDEFECTO[ITEMS[k].slot] ? 'PUESTO' : 'PUESTO'] : null;
  }
  function hojaInv(k) {
    const it = ITEMS[k]; let info = '', bt = '';
    if (COMIDAS[k]) {
      const F = COMIDAS[k];
      let stats = [];
      if (F.rand) stats.push('¡EFECTO SORPRESA!');
      else {
        if (F.h > 0) stats.push('COMIDA +' + F.h);
        if (F.e > 0) stats.push('ENERGÍA +' + F.e);
      }
      info = stats.join('<br>') + '<br>TIENES: ' + e.comida[k];
      bt = `<button class="bt ok gran" data-a="f_dar" data-k="${k}">DARLE A SIMON</button>`;
    }
    else if (k === 'trebol4') { info = 'OBJETO DE MISIÓN<br>SE LO LLEVAS AL ALVARIKOKE:<br>TOCA 5 VECES EL ÁRBOL DEL FONDO (DERECHA) EN EL PARQUE'; bt = ''; }
    else if (k === 'bomba') { info = 'TIENES: ' + (e.bombas || 0) + '<br>SE LANZA CON EL BOTÓN DE LA ESCENA'; bt = ''; }
    else if (k === 'ojo_pet') { info = (e.ojoOn !== 0 ? 'SIMON DUERME 10% MÁS RÁPIDO' : 'GUARDADO: NO AYUDA A DORMIR'); bt = `<button class="bt ${e.ojoOn !== 0 ? '' : 'ok'} gran" data-a="ojo_tog">${e.ojoOn !== 0 ? 'QUITAR' : 'SACAR'}</button>`; }
    else if (k === 'pet_sif') { const act = petActiva(k); info = 'MASCOTA · EFECTO: JUGAR CANSA 10% MENOS<br>' + (act ? 'ACTIVA ✓' : 'INACTIVA · ACTIVAS: ' + petsActivas().length + '/3'); bt = `<button class="bt ${act || petsActivas().length < 3 ? 'ok' : 'no'} gran" data-a="vs_pet" data-k="${k}">${act ? 'QUITAR' : 'PONER'}</button>`; }
    else if (k === 'jarabe') { info = 'CURA EL RESFRIADO<br>TIENES: ' + (e.meds || 0); bt = `<button class="bt ${e.enf ? 'ok' : 'no'} gran" ${e.enf ? 'data-a="med_usar"' : ''}>${e.enf ? 'USAR' : 'SOLO SI ESTÁ RESFRIADO'}</button>`; }
    else if (esMueble(k)) {
      const d = e.deco.find(x => x.k === k);
      if (it.slot === 'juguete') { info = 'EL QUE USA AL JUGAR'; bt = puesto(k) ? '<div class="est">EN USO</div>' : `<button class="bt ok gran" data-a="poner" data-k="${k}">USAR</button>`; }
      else if (d) { info = 'EN: ' + habN(d.h || 'sala'); bt = `<button class="bt gran" data-a="quitar" data-k="${k}">QUITAR</button>`; }
      else { info = 'SIN COLOCAR'; bt = `<button class="bt ok gran" data-a="poner" data-k="${k}">COLOCAR</button>`; }
    } else {
      if (puesto(k)) { info = 'PUESTO'; bt = PORDEFECTO[it.slot] ? '<div class="est">PUESTO</div>' : `<button class="bt gran" data-a="quitar" data-k="${k}">QUITAR</button>`; }
      else { info = 'EN EL ARMARIO'; bt = `<button class="bt ok gran" data-a="poner" data-k="${k}">PONER</button>`; }
    }
    return `<div class="th-big"><canvas data-prev="${ivPrev(k)}"></canvas></div><div class="th-n">${ivNom(k)}</div><div class="th-i">${info}</div>${bt}`;
  }
  function renderInv() {
    iSheetH = '';
    const L = invListas(), total = L.ropa.length + L.mue.length + L.jug.length + L.fon.length, nada = e.tiene;
    if (iv === 'hub') {
      $('m-titulo').textContent = 'INVENTARIO';
      const uso = [...L.ropa.filter(k => puesto(k) && !PORDEFECTO[ITEMS[k].slot]), ...L.fon.filter(k => puesto(k) && !PORDEFECTO[ITEMS[k].slot]), ...L.jug.filter(puesto)].slice(0, 8);
      const sinCol = L.mue.filter(k => !e.deco.some(d => d.k === k)).length;
      let h = `<div class="th-top"><span>TIENES ${total} COSAS</span><span class="th-mon">${uso.length} EN USO</span></div>`;
      h += `<div class="th-g2">${IV_CATS.filter(([c]) => c !== 'mas' || L.mas.length).map(([c, n, pv]) => {
        const cant = L[c === 'ropa' ? 'ropa' : c].length, pill = c === 'mue' && sinCol ? `<span class="th-pill">${sinCol} SIN COLOCAR</span>` : '';
        return `<button class="th-t ${cant ? '' : 'lock'}" data-a="iv_cat" data-k="${c}">${pill}<div class="th-pv"><canvas data-prev="${pv}"></canvas></div><b>${n}</b><i>${cant} ${cant === 1 ? 'COSA' : 'COSAS'}</i></button>`;
      }).join('')}</div>`;
      return h;
    }
    const ks0 = L[ivCat], nm = (IV_CATS.find(c => c[0] === ivCat) || IV_CATS[0])[1];
    $('m-titulo').textContent = nm;
    let h = `<div class="th-top"><button class="th-back" data-a="iv_back">&lt; VOLVER</button><span class="th-mon">${ks0.length} ${ks0.length === 1 ? 'COSA' : 'COSAS'}</span></div>`;
    let ks = ks0;
    if (ivCat === 'ropa') {
      h += `<div class="th-chips">${ROPA_SLOTS.filter(([f]) => f !== 'prem').map(([f, t]) => `<button class="${ivF === f ? 'on' : ''}" data-a="iv_f" data-k="${f}">${t}</button>`).join('')}</div>`;
      if (ivF !== 'todo') ks = ks0.filter(k => ITEMS[k].slot === ivF);
    } else if (ivCat === 'mue') {
      const fl = [['todo', 'TODO'], ['sin', 'SIN COLOCAR'], ...HABS.filter(hb => nivel() >= hb.nv).map(hb => [hb.id, hb.n])];
      h += `<div class="th-chips">${fl.map(([f, t]) => `<button class="${ivF === f ? 'on' : ''}" data-a="iv_f" data-k="${f}">${t}</button>`).join('')}</div>`;
      if (ivF === 'sin') ks = ks0.filter(k => !e.deco.some(d => d.k === k));
      else if (ivF !== 'todo') ks = ks0.filter(k => e.deco.some(d => d.k === k && (d.h || 'sala') === ivF));
      h += `<div class="th-nota">Se acomodan con la casita.</div>`;
    } else if (ivCat === 'jug') h += `<div class="th-nota">Solo uno a la vez: el que usa al JUGAR.</div>`;
    if (ivCat === 'ropa') { const vestido = e.ropa.cara || e.ropa.cuello || e.ropa.orejas || e.ropa.espalda || e.ropa.aura || e.ropa.sudadera !== 'sud_azul'; h += `<div style="display:flex;gap:8px;margin:0 0 10px"><button class="bt ok" style="flex:1;padding:10px 0" data-a="iv_vestir">VESTIR A SIMON</button>${vestido ? `<button class="bt" style="flex:1;padding:10px 0" data-a="it_nada">QUITAR TODA LA ROPA</button>` : ''}</div>`; }
    h += ks.length ? `<div class="th-g3">${ks.map(k => { const st = ivEstado(k);
      const dot = (ivCat === 'mue' || ivCat === 'jug') ? `<span class="mue-dot ${(ITEMS[k].slot === 'juguete' ? puesto(k) : e.deco.some(d => d.k === k)) ? 'on' : ''}"></span>` : ''; const ih = (ivCat === 'mue' || ivCat === 'jug') ? iconoHabDe(k) : ''; const hico = ih ? `<span class="mue-hab">${ih}</span>` : '';
      return `<button class="th-c ${st && st[0] === 'no' ? 'lock' : ''} ${isel === k ? 'sel' : ''}" data-a="iv_sel" data-k="${k}">${dot}${hico}${st ? `<span class="${st[0] === 'n' ? 'th-cant' : 'iv-b ' + st[0]}">${st[1]}</span>` : ''}<div class="th-pv"><canvas data-prev="${ivPrev(k)}"></canvas></div><div class="th-nm">${ivNom(k)}</div></button>`; }).join('')}</div>`
      : `<div class="centro" style="font-size:7px;color:#aab4ff;line-height:1.9;margin:24px 0">${ks0.length ? 'No hay nada aquí.' : ivCat === 'com' || ivCat === 'ext' ? 'No tienes nada de esto.<br>Compra en la TIENDA.' : 'Todavía no tienes nada.<br>Mira la TIENDA.'}</div>`;
    if (isel && ks.includes(isel)) iSheetH = hojaInv(isel); else isel = null;
    return h;
  }
  $('b-inv').onclick = () => menuAbrir('inventario');

