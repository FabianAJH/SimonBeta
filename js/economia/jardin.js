  // ---- lógica de día: crecimiento de las parcelas y envejecimiento (pausado/activo) de las macetas cosechadas ----
  function jardinDia() {
    const h = hoy(), plots = jardinSync();
    plots.forEach(p => {
      if (!p.k || p.diaUlt === h) return;
      if (p.regadoHoy) p.dias++;
      p.regadoHoy = false; p.diaUlt = h;
      const S = SEMILLAS[p.k];
      if (S && p.dias >= S.diasCrecer) p.etapa = 'listo'; else if (p.dias > 0) p.etapa = 'brote';
    });
    // de todas las macetas colocadas de una misma especie (sin importar la habitación), solo la primera puesta (más antigua) envejece;
    // las demás de esa especie quedan en pausa hasta que esa muera, entonces le toca a la siguiente, y así sucesivamente
    const grupos = {};
    Object.keys(e.macetaVida).forEach(key => {
      const v = e.macetaVida[key]; if (!v || v.diaUlt === h) return;
      if (!e.deco.some(d => d.k === key)) { v.diaUlt = h; return; }   // no está colocada: se pausa en el inventario
      const it = ITEMS[key], esp = (it && it.semilla) || key;
      (grupos[esp] = grupos[esp] || []).push(key);
    });
    const ordenCreacion = k => parseInt((/_(\d+)$/.exec(k) || [0, 0])[1], 10);
    Object.keys(grupos).forEach(esp => {
      const vivas = grupos[esp].filter(k => e.macetaVida[k].dias > 0).sort((a, b) => ordenCreacion(a) - ordenCreacion(b));
      const activa = vivas[0];
      grupos[esp].forEach(k => { const v = e.macetaVida[k]; if (k === activa) v.dias = Math.max(0, v.dias - 1); v.diaUlt = h; });
    });
  }
  function jardinPlantar(id) {
    const plots = jardinSync(), p = jSel != null ? plots[jSel] : null;
    if (!p || p.k || !(e.semillas[id] > 0)) { cerrar(); return; }
    e.semillas[id]--; Object.assign(p, { k: id, etapa: 'semilla', dias: 0, diaUlt: hoy(), regadoHoy: false });
    sfx.click(); jardinFX(jSel, '#8a5630'); cerrar(); toast('Sembraste: ' + SEMILLAS[id].n); jSel = null; guardar(); pintar();
  }
  function jardinFX(i, col) {   // ráfaga de chispitas de tierra/agua sobre la parcela tocada
    const plots = jardinSync(), r = jardinPlotRect(i, plots.length, LW, LH), cx = r.x + r.w / 2, cy = r.y + 4;
    for (let j = 0; j < 5; j++) lanzar(col === '#4ab8ff' ? 'gota' : 'estrella', cx - 4 + Math.random() * 8, cy, (Math.random() - .5) * .6, -1 - Math.random(), 10 + j * 2);
  }

  let regandera = null;   // animación de regadera al regar: { cx, cy, t, dur, gotas[] }
  function reganderaSprite() {
    return sprite('regandera_v2', () => {
      const g = Grid(32, 24);
      // cuerpo trapezoidal: más ancho abajo, más angosto arriba
      g.rect(4, 7, 12, 1, '#7acfff');   // borde superior claro
      g.rect(3, 8, 14, 7, '#3a9ae8');   // cuerpo principal
      g.rect(3, 8, 1, 7, '#6abcf0');    // borde izq claro
      g.rect(3, 14, 14, 1, '#1a68b0');  // borde inferior oscuro
      g.rect(16, 8, 1, 7, '#1a68b0');   // borde der oscuro
      g.rect(4, 9, 4, 5, '#5ab0f0');    // reflejo
      // tapa superior
      g.rect(5, 6, 9, 2, '#2a78c8'); g.rect(6, 5, 7, 1, '#3a8fd8');
      // asa curva arriba (arco de 3 segmentos)
      g.rect(6, 2, 6, 2, '#1a58a8');
      g.set(5, 3, '#1a58a8'); g.set(12, 3, '#1a58a8');
      g.set(4, 4, '#1a58a8'); g.set(13, 4, '#1a58a8');
      g.set(4, 5, '#1a58a8'); g.set(13, 5, '#1a58a8');
      // pitorro largo: sale del frente (derecha), baja en diagonal
      g.rect(17, 9, 3, 2, '#2a78c8');
      g.rect(19, 10, 3, 2, '#2a78c8');
      g.rect(21, 11, 3, 2, '#2a78c8');
      g.rect(23, 12, 3, 2, '#1a68b0');
      // alcachofa: cabeza ovalada al final del pitorro
      g.rect(25, 10, 5, 6, '#1a58a8');
      g.rect(26, 9, 3, 1, '#3a88d8');   // borde superior
      g.rect(25, 15, 5, 1, '#0a3880');  // borde inferior
      g.set(25, 10, '#3a88d8'); g.set(29, 10, '#3a88d8');
      // agujeritos de la alcachofa
      g.set(26, 11, '#5aacf0'); g.set(28, 11, '#5aacf0');
      g.set(27, 13, '#5aacf0'); g.set(26, 14, '#5aacf0'); g.set(28, 14, '#5aacf0');
      return g;
    }, 0);
  }
  function reganderaDibujar() {
    if (!regandera) return;
    regandera.t++;
    const { cx, cy, t, dur, gotas } = regandera;
    if (t > dur) { regandera = null; return; }
    // regadera aparece arriba-derecha de la maceta, inclinada hacia ella
    const rx = cx - 34, ry = cy - 28;
    ctx.drawImage(reganderaSprite(), rx, ry);
    // gotas salen de la alcachofa (esquina inferior-izquierda del sprite) hacia la planta
    const gx = rx + 25, gy = ry + 16;
    if (t < dur - 6 && t % 2 === 0) {
      gotas.push({ x: gx + (Math.random() - .5) * 3, y: gy, vx: -0.3 + (Math.random() - .5) * .3, vy: 0.5 + Math.random() * .4, life: 0, maxLife: 12 + Math.floor(Math.random() * 6) });
    }
    regandera.gotas = gotas.filter(g => g.life < g.maxLife);
    regandera.gotas.forEach(g => {
      g.x += g.vx; g.y += g.vy; g.vy += .12; g.life++;
      ctx.globalAlpha = Math.max(0, 1 - g.life / g.maxLife);
      ctx.fillStyle = '#7ad4ff'; ctx.fillRect(Math.round(g.x), Math.round(g.y), 2, 3);
      ctx.fillStyle = '#c8eeff'; ctx.fillRect(Math.round(g.x), Math.round(g.y), 1, 1);
      ctx.globalAlpha = 1;
    });
  }
  function jardinRegar(i) {
    const plots = jardinSync(), p = plots[i]; if (!p || !p.k || p.etapa === 'listo') return;
    if (p.regadoHoy) { toast('Ya la regué hoy'); return; }
    p.regadoHoy = true; sfx.click(); jardinFX(i, '#4ab8ff'); toast('¡Regada!'); guardar(); pintar();
    sonidoAgua(1.8);   // chorro de agua inmediato al tocar
    // calcular posición de la regadera sobre la maceta
    const r = jardinPlotRect(i, plots.length, LW, LH);
    regandera = { cx: r.x + r.w / 2 + 4, cy: r.y + 4, t: 0, dur: 60, gotas: [] };
  }
  function jardinCosechar(i) {
    const plots = jardinSync(), p = plots[i]; if (!p || p.etapa !== 'listo') return;
    const S = SEMILLAS[p.k], id = p.k, key = cosecharPlanta(id);
    Object.assign(p, { k: null, etapa: null, dias: 0, diaUlt: hoy(), regadoHoy: false });
    sfx.compra(); corazones(3); estrellas(6); toast('¡Cosechaste ' + S.n + '!'); guardar(); pintar(); render();
    if (id === 'suerte' && !e.tiene.aura_trebol) {
      e.tiene.aura_trebol = 1; e.ropa.aura = 'aura_trebol'; guardar();
      sonidoUnico();
      setTimeout(() => fanfare({ g: () => prevGrid('aura_trebol'), t: 'AURA DE TRÉBOL', d: 'EL TRÉBOL DE LA SUERTE FLORECIÓ. EL AURA ES TUYA PARA SIEMPRE.', mudo: true }), 900);
    }
    if (id === 'eterna' && !e.tiene.aura_eterna) {
      e.tiene.aura_eterna = 1; e.ropa.aura = 'aura_eterna'; guardar();
      sonidoUnico();
      setTimeout(() => fanfare({ g: () => prevGrid('aura_eterna'), t: 'AURA ETERNA', d: 'LA SEMILLA ETERNA FLORECIÓ. EL AURA ES TUYA PARA SIEMPRE.', mudo: true }), 900);
    }
  }
  function jardinToca(x, y) {
    const plots = jardinSync(), n = plots.length;
    for (let i = 0; i < n; i++) {
      const r = jardinPlotRect(i, n, LW, LH);
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        const p = plots[i];
        if (!p.k) { sfx.click(); jSel = i; abrir('jardin'); } else if (p.etapa === 'listo') jardinCosechar(i); else jardinRegar(i);
        return true;
      }
    }
    return false;
  }
