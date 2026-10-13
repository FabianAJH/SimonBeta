  function renderDice() {
    const nv = nivel(), tit = { menu: 'SIMON DICE', preg: 'PREGÚNTALE', res: 'SIMON RESPONDE', adiv: '¿EN QUÉ PIENSA?', diario: 'DIARIO DE SIMON' };
    $('m-titulo').textContent = tit[dv] || 'SIMON DICE';
    const atras = `<button class="bt gran" style="margin-top:6px" data-a="d_menu">ATRÁS</button>`;
    const nsec = Object.keys(e.sec).length;
    if (dv === 'menu') {
      const P = preguntasHoy(), M = misionesHoy();
      return `<div class="saldo"><span>CARIÑO NV${nv}</span><span>SECRETOS ${nsec}/${SEC.length}</span></div>` +
        `<button class="bt ok gran" data-a="d_preg">PREGÚNTALE A SIMON (${P.h.length}/3)</button>` +
        `<button class="bt ok gran" data-a="d_adiv">¿EN QUÉ PIENSA SIMON?</button>` +
        `<button class="bt gran" data-a="d_diario">DIARIO DE SECRETOS</button>`;
    }
    if (dv === 'preg') {
      const P = preguntasHoy();
      return `<div class="centro" style="font-size:8px;margin-bottom:10px;line-height:1.8">Hoy puedes preguntarle tres cosas. Cada secreto nuevo da premio.</div>` +
        P.k.map(i => { const h = P.h.includes(i); return `<button class="bt ${h ? 'no' : 'ok'} gran" ${h ? '' : `data-a="d_ask" data-k="${i}"`} style="line-height:1.6;padding:12px 6px">${h ? '✓ ' : ''}${SEC[i][0]}${!h && !e.sec[i] ? ' ★' : ''}</button>`; }).join('') + atras;
    }
    if (dv === 'res' && dres) {
      return `<div class="centro" style="line-height:1.9"><div style="color:#aab4ff;font-size:8px">${SEC[dres.i][0]}</div><div style="height:8px"></div>` +
        `<div style="font-size:9px;line-height:2">«${SEC[dres.i][1]}»</div>` +
        (dres.nuevo ? `<div class="grande" style="margin-top:12px">¡SECRETO NUEVO! +5</div>` : `<div style="margin-top:12px;color:#aab4ff;font-size:8px">Ya lo sabías, pero se alegra de contarlo.</div>`) + `</div>` +
        `<button class="bt ok gran" style="margin-top:10px" data-a="d_preg">OTRA PREGUNTA</button>` + atras;
    }
    if (dv === 'adiv' && ronda) {
      const r = ronda.res, o = ronda.o, cols = ronda.ops.length > 4 ? 3 : 2;
      const btns = ronda.ops.map(x => `<button class="bt ${r ? (x === o ? 'ok' : 'no') : 'ok'} gran" ${r ? '' : `data-a="d_guess" data-k="${x.id}"`} style="padding:11px 0;margin-bottom:6px;font-size:${cols === 3 ? 7 : 8}px">${x.n}</button>`).join('');
      const lv = nivelRonda();
      return `<div class="saldo"><span>RACHA: ${rachaAdiv}</span><span>PREMIOS HOY: ${Math.min(e.adv.f === hoy() ? e.adv.n : 0, 10)}/10</span></div>` +
        (r ? '' : `<div class="centro" style="font-size:8px;line-height:1.8;margin-bottom:8px;color:#aab4ff">Simon está pensando en algo. ¿En qué?${lv.seg ? '<div class="barra" style="margin-top:6px"><div id="tm-b" style="width:100%"></div></div>' : ''}</div>`) +
        `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:0 6px">` + btns + `</div>` +
        (r ? `<div class="centro" style="margin:2px 0 8px;line-height:1.9"><div class="grande">${r.ok ? '¡SÍ ERA ESO!' + (r.premio ? ' +' + r.premio : '') : r.id ? 'NO ERA ESO' : '¡SE ACABÓ EL TIEMPO!'}</div>${r.nuevo ? '<div style="font-size:8px;color:#ffd84a;margin-top:4px">¡NUEVO EN SU ÁLBUM! +5</div>' : ''}</div><button class="bt ok gran" data-a="d_sig">SIGUIENTE</button>` : '') + atras;
    }
    if (dv === 'diario') {
      const np = Object.keys(e.pens).length;
      return `<div class="saldo"><span>${nsec}/${SEC.length} SECRETOS</span><span>CARIÑO NV${nv}</span></div>` +
        `<div class="centro" style="font-size:8px;color:#ffd84a;margin-bottom:6px">LO QUE IMAGINA SIMON ${np}/${OBJ.length}</div><div class="galeria" style="margin-bottom:12px;flex-wrap:wrap;align-items:center">` + OBJ.map(o => `<canvas data-prev="pen_${o.id}" style="${e.pens[o.id] ? '' : 'filter:brightness(0) opacity(.35)'}"></canvas>`).join('') + `</div>` +
        SEC.map((q, i) => e.sec[i] ? `<div class="logro hecho"><div class="ln">${q[0]}</div><div class="ld">«${q[1]}»</div></div>` : `<div class="logro"><div class="ln">???</div><div class="ld">${q[2] > nv ? 'Cariño NV' + q[2] : 'Pregúntaselo a Simon'}</div></div>`).join('') + atras;
    }
    return '';
  }
  function subeEscena() {
    const es = $('escena'), tenia = es.classList.contains('alto'); es.classList.remove('alto');
    const sc = $('sc').getBoundingClientRect(), ap = $('modal').parentElement.getBoundingClientRect(), z = sc.height / LH;
    const pie = sc.top + (SY + SH) * z, limite = ap.top + ap.height * 0.54 - 8;   // el panel ocupa el 46% de abajo
    es.style.setProperty('--sube', Math.max(0, Math.round(pie - limite)) + 'px');
    if (tenia) es.classList.add('alto');
  }
  function dClick(a, k) {
    sfx.click(); if (a !== 'd_sig' && a !== 'd_guess') { limpiaT(); if (dv === 'adiv') $('burbuja').classList.remove('on'); }
    if (a === 'd_menu') dv = 'menu'; else if (a === 'd_preg') dv = 'preg'; else if (a === 'd_diario') dv = 'diario';
    else if (a === 'd_ask') { preguntar(+k); return; }
    else if (a === 'd_adiv' || a === 'd_sig') { nuevaRonda(); return; }
    else if (a === 'd_guess') { adivinar(k); return; }
    render();
    $('m-cuerpo').scrollTop = 0;
  }
  /* respaldo de progreso */
