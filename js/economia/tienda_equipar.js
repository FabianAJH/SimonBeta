  /* ===================== TIENDA ===================== */
  function equipar(k) { const it = ITEMS[k]; if (esMueble(k)) { if (colocar(k)) toast('Colocado. Muévelo con el botón de la casita'); return; } (it.tipo === 'ropa' ? e.ropa : e.cuarto)[it.slot] = k; if (it.tipo === 'ropa' && ROPA_COM[k]) ropaPend = k; }
  function puesto(k) { const it = ITEMS[k]; if (!it) return false; if (esMueble(k)) return e.deco.some(d => d.k === k); return (it.tipo === 'ropa' ? e.ropa : e.cuarto)[it.slot] === k; }
  const habBloq0 = id => { const h = HABS.find(x => x.id === id); return h && nivel() < h.nv ? h : null; };
  const habBloq = k => { const t = ITEMS[k] && ITEMS[k].tema, h = HABS.find(x => x.id === t); return h && nivel() < h.nv ? h : null; };
  function comprar(k) {
    const it = ITEMS[k]; if (e.tiene[k] || it.regalo) return;
    const hb = habBloq(k); if (hb) { toast(hb.n + ' se desbloquea en cariño NV' + hb.nv); sfx.no(); return; }
    if (nivel() < it.nv) { toast('Necesitas cariño nivel ' + it.nv); sfx.no(); return; }
    const rq = refReq(k); if (rq) { toast('Primero necesitas el ' + ITEMS[rq].n); sfx.no(); return; }
    if (e.monedas < it.p) { faltanMon(it.p - e.monedas); sfx.no(); return; }
    e.monedas -= it.p; animarMonedas(it.p, true); e.tiene[k] = 1; e.st.compras++;
    if (it.semillaMerc) { e.semillas[it.semillaMerc] = (e.semillas[it.semillaMerc] || 0) + 1; sfx.compra(); toast('¡CONSEGUISTE: ' + it.n.toUpperCase() + '!'); gesto('besos'); hablar(); pintar(); guardar(); render(); return; }
    if (!esMueble(k)) equipar(k);
    sfx.compra(); toast('¡COMPRASTE: ' + it.n.toUpperCase() + '!'); if (esMueble(k) && !e.muebleVisto) { e.muebleVisto = 1; guardar(); tutRes('#b-editar'); } gesto('besos'); hablar(); pintar(); guardar(); render();
  }
  function poner(k) {
    if (!e.tiene[k]) return;
    if (esMueble(k) && (lugar || calle || vistaBloq)) { toast('Aquí no puedes usar esto'); sfx.no(); return; }
    if (ITEMS[k].slot === 'juguete') {
      colocar(k);
      if (typeof jugFis !== 'undefined') {
        jugFis.k = k;
        if (ITEMS[k] && ITEMS[k].grid) {
          const spj = sprite('tj_' + k, () => ITEMS[k].grid(), 0);
          jugFis.rad = Math.max(5, Math.round(Math.min(spj.width, spj.height) / 2));
        }
      }
      sfx.click();
      gesto('salto');
      if (e.hab !== 'sala') toast('El juguete se coloca en la RECÁMARA');
      pintar();
      guardar();
      render();
      return;
    }
    if (esMueble(k)) {
      if (modal === 'tienda') {
        const it = ITEMS[k], th = it.tema && it.tema !== 'todas' ? it.tema : e.hab;
        if (th === 'espacial' && !e.espReparado) { toast('Primero repara la RECÁMARA ESPACIAL'); sfx.no(); return; }
        if (th && th !== e.hab && HABS.some(h => h.id === th)) { if (th === 'espacial') e.habAntes = e.hab; e.hab = th; if (th === 'espacial') espacialAsegura(); guardar(); pintarNav(); }
        const ok = colocar(k);
        if (ok) { sfx.click(); toast('Colocado. Muévelo con la casita cuando quieras'); pintar(); guardar(); render(); }
        return;
      }
      if (ITEMS[k].tema === 'bano' && e.hab !== 'bano') { lugar = null; llegada = null; e.hab = 'bano'; guardar(); pintarNav(); toast('Se coloca en el BAÑO'); }
      else if (ITEMS[k].tema === 'espacial' && !e.espReparado) { toast('Primero repara la RECÁMARA ESPACIAL'); sfx.no(); return; }
      else if (ITEMS[k].tema === 'espacial' && e.hab !== 'espacial') { lugar = null; llegada = null; e.habAntes = e.hab; e.hab = 'espacial'; espacialAsegura(); guardar(); pintarNav(); toast('Se coloca en la RECÁMARA ESPACIAL'); }
      else if (ITEMS[k].tema === 'sala' && e.hab !== 'sala' && !(e.hab === 'espacial' && !ITEMS[k].exclusivo)) { lugar = null; llegada = null; e.hab = 'sala'; guardar(); pintarNav(); toast('Se coloca en la RECÁMARA'); }
      const te = ITEMS[k].tema === 'estudio';
      if (te && e.hab !== 'estudio') { lugar = null; llegada = null; e.hab = 'estudio'; guardar(); pintarNav(); toast('Se coloca en el ESTUDIO'); }
      else if (!te && e.hab === 'estudio') { toast('El ESTUDIO solo admite objetos de estudio'); sfx.no(); return; }
      const tj = ITEMS[k].tema === 'jardin';
      if (tj && e.hab !== 'jardin') { lugar = null; llegada = null; e.hab = 'jardin'; guardar(); pintarNav(); toast('Se coloca en el JARDÍN'); }
      else if (!tj && e.hab === 'jardin' && !enJardin(k)) { toast('Esto no se puede poner en el JARDÍN'); sfx.no(); return; }
      entrarEdicion(k);
      return;
    }
    equipar(k); mision('ropa'); sfx.click(); gesto('salto'); pintar(); guardar(); render();
  }
  function quitar(k) { const it = ITEMS[k]; if (it.slot === 'juguete' || it.fija) return; if (esMueble(k)) { e.deco = e.deco.filter(d => d.k !== k); sfx.click(); pintar(); guardar(); render(); return; } if (PORDEFECTO[it.slot]) return; (it.tipo === 'ropa' ? e.ropa : e.cuarto)[it.slot] = null; sfx.click(); pintar(); guardar(); render(); }


