  const lim = (v, a, b) => Math.max(a, Math.min(b, v));
  const esMueble = k => { const it = ITEMS[k]; return !!it && it.tipo === 'cuarto' && ['izq', 'der', 'deco', 'decoP', 'juguete'].includes(it.slot); };
  const esFondo = k => { const it = ITEMS[k]; return !!it && (it.estilo === 'pared' || it.estilo === 'piso'); };   // papel tapiz / piso: se equipan directo, no se arrastran
  const DEF_FONDO = { pared: 'pared_azul' };   // al quitar un papel/piso, vuelve a esto (o a null = diseño original de la habitación)
  // Jardín: aceptan los muebles de jardín (tema 'jardin') y los generales de piso (sin habitación propia, ni exclusivos, ni colgados, ni el juguete). Ningún papel tapiz ni piso.
  const enJardin = k => { const it = ITEMS[k]; if (!it || !esMueble(k)) return false; if (it.tema === 'jardin') return true; return (!it.tema || it.tema === 'todas') && !it.exclusivo && !it.fija && it.slot !== 'decoP' && it.slot !== 'juguete'; };
  const usableAqui = k => { const it = ITEMS[k], t = it.tema; if (esFondo(k)) return !t || t === e.hab; if (it.exclusivo) return t === e.hab; if (e.hab === 'jardin') return enJardin(k); if (t === 'jardin') return e.hab === 'jardin'; if (e.hab === 'estudio') return t === 'estudio'; return (t !== 'estudio' && t !== 'bano') || t === e.hab; };   // ¿se puede usar/colocar en la habitación actual?
  const esPared = k => ITEMS[k].slot === 'decoP';
  // (DECO_MAX definido en config.js)
  const juguetePuesto = () => { const d = e.deco.find(x => ITEMS[x.k] && ITEMS[x.k].slot === 'juguete'); return d ? d.k : 'juguete_pelota'; };
  function estSlotsX(z) { return z === 'col' ? [14, 30, 46, 74, 90, 106] : [16, 36, 60, 84, 104]; }
  function estShelfY(DY) { return DY - 30; }
  function estPos(d) {
    const it = ITEMS[d.k], sp = sprite('mu_' + d.k, it.grid, 0), w = sp.width, h = sp.height, xs = estSlotsX(it.zona), cx = OX + xs[Math.max(0, Math.min(xs.length - 1, d.s | 0))];
    if (it.zona === 'col') { const y = 11; return { x: Math.round(cx - w / 2), y, w, h, cx, cy: y + h / 2, base: y + h }; }
    const base = estShelfY(estDY()); return { x: Math.round(cx - w / 2), y: base - h, w, h, cx, cy: base - h / 2, base };
  }
  function estSlotLibre(z) {
    const usados = e.deco.filter(d => d.h === 'estudio' && ITEMS[d.k] && ITEMS[d.k].zona === z).map(d => d.s), orden = z === 'col' ? [1, 4, 2, 3, 0, 5] : [2, 1, 3, 0, 4];
    return orden.find(i => !usados.includes(i)) ?? -1;
  }
  function estSnap(d, p) {
    const z = ITEMS[d.k].zona, xs = estSlotsX(z); let mejor = 0, md = 1e9;
    xs.forEach((x, i) => { const dd = Math.abs(p.x - (OX + x)); if (dd < md) { md = dd; mejor = i; } });
    if (mejor === d.s) return;
    const otro = e.deco.find(o => o !== d && o.h === 'estudio' && ITEMS[o.k] && ITEMS[o.k].zona === z && o.s === mejor); if (otro) otro.s = d.s;
    d.s = mejor; sfx.click();
  }
  const habNombre = t => (HABS.find(h => h.id === t) || {}).n || String(t).toUpperCase();
  function colocar(k) {
    if (ITEMS[k].tema === 'espacial' && !e.espReparado) { toast('Primero repara la RECÁMARA ESPACIAL'); sfx.no(); return false; }
    if (ITEMS[k].exclusivo && ITEMS[k].tema && ITEMS[k].tema !== e.hab) { toast('Este objeto solo va en: ' + habNombre(ITEMS[k].tema)); sfx.no(); return false; }
    if (ITEMS[k].tema === 'bano' && e.hab !== 'bano') { toast('Este objeto solo va en el BAÑO'); sfx.no(); return false; }
    const esE = ITEMS[k].tema === 'estudio';
    if (esE !== (e.hab === 'estudio')) { toast(esE ? 'Este objeto solo va en el ESTUDIO' : 'El ESTUDIO solo admite objetos de estudio'); sfx.no(); return false; }
    if (ITEMS[k].tema === 'jardin' && e.hab !== 'jardin') { toast('Este objeto solo va en el JARDÍN'); sfx.no(); return false; }
    if (e.hab === 'jardin' && !enJardin(k)) { toast('Esto no se puede poner en el JARDÍN'); sfx.no(); return false; }
    if (esE) {
      const prev = e.deco.find(d => d.k === k); if (prev) { if (prev.h === 'estudio') return false; prev.h = 'estudio'; return true; }
      const sl = estSlotLibre(ITEMS[k].zona); if (sl < 0) { toast(ITEMS[k].zona === 'col' ? 'No hay lugar para colgar más: quita algo' : 'El estante está lleno: quita algo'); sfx.no(); return false; }
      e.deco.push({ k, x: 0, y: 0, f: 0, h: 'estudio', s: sl }); return true;
    }
    if (ITEMS[k].slot === 'juguete') {   // solo hay un juguete a la vez: el nuevo ocupa el lugar del anterior
      const ant = e.deco.find(x => ITEMS[x.k] && ITEMS[x.k].slot === 'juguete');
      const yaEstaba = ant && ant.k === k && (ant.h || 'sala') === 'sala';
      if (ant) { ant.k = k; ant.h = 'sala'; } else e.deco.push({ k, x: -10, y: 77, f: 0, h: 'sala' });
      if (typeof jugFis !== 'undefined') {
        jugFis.k = k;
        if (ITEMS[k] && ITEMS[k].grid) {
          const spj = sprite('tj_' + k, () => ITEMS[k].grid(), 0);
          jugFis.rad = Math.max(5, Math.round(Math.min(spj.width, spj.height) / 2));
        }
      }
      if (yaEstaba) return false;
      return true;
    }
    const aqui = e.deco.filter(d => (d.h || 'sala') === e.hab), previo = e.deco.find(d => d.k === k);
    if (previo && (previo.h || 'sala') === e.hab) return false;
    if (aqui.length >= DECO_MAX) { toast('La habitación está llena'); return false; }
    if (previo) { previo.h = e.hab; return true; }   // ya lo tenías en otra habitación: se viene para acá
    const n = aqui.length, lados = e.hab === 'bano' ? [-8, 20, -28, 38, -46, 0] : [-50, 50, -30, 30, -66, 66], yPiso = e.hab === 'jardin' ? 64 : 56;
    const enBarra = e.hab === 'cocina' && ['tostadora', 'cafetera', 'olla', 'canasta', 'especias', 'florero'].includes(k);
    e.deco.push(esPared(k) ? { k, x: -36 + (n % 3) * 36, y: -34, f: 0, h: e.hab } : { k, x: enBarra ? [-14, 8, 30, -34, 52][n % 5] : lados[n % 6], y: enBarra ? 5 : yPiso, f: 0, h: e.hab });
    return true;
  }
