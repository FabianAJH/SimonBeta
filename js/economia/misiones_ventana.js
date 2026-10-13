  function iconoMis() {
    const g = Grid(12, 12), m = ['.kkkkkkkkk..', 'kwwwwwwwwwk.', 'kwyywwwwwwk.', 'kwyyywwwwwk.', 'kwwwwwwwwwk.', 'kwkkkkkkwwk.', 'kwwwwwwwwwk.', 'kwkkkkkwwwk.', 'kwwwwwwwwwk.', 'kwwwwwwwwwk.', '.kkkkkkkkk..', '............'];
    m.forEach((f, y) => [...f].forEach((ch, x) => { if (ch === 'k') g.set(x, y, '#232b63'); else if (ch === 'w') g.set(x, y, '#fff2d0'); else if (ch === 'y') g.set(x, y, '#e8353f'); }));
    return g;
  }
  function pintarMis() {
    const ch = $('t-mis'); if (!e.intro || introActiva) { ch.classList.add('oculto'); return; }
    const M = misionesHoy(), ok = M.ids.filter(i => M.ok[i]).length;
    ch.classList.remove('oculto'); ch.classList.toggle('gris', ok === 3);
    $('v-mis').textContent = ok === 3 ? 'MISIÓN OK' : 'MISIÓN ' + ok + '/3';
    ch.querySelectorAll('.pts b').forEach((b, i) => b.classList.toggle('on', i < ok));
    dibIcono($('ic-mis'), 'ic_mis', iconoMis);
  }
  function renderMis() {
    $('m-titulo').textContent = 'MISIONES DE CORTEX';
    const M = misionesHoy();
    return `<div class="centro" style="font-size:8px;line-height:1.9;margin-bottom:10px;color:#aab4ff">Cortex te pide tres cosas. Sin prisa: tu avance no se pierde, puedes terminarlas cuando quieras. ¡Las tres juntas dan +15 de bono!</div>` +
      M.ids.map(i => {
        const m = MIS[i], pr = Math.min(M.p[i] || 0, m.n), ok = !!M.ok[i];
        return `<div class="mi ${ok ? 'ok' : ''}"><span>${m.t}</span><b>${ok ? 'LISTA' : pr + '/' + m.n + ' +' + m.r}</b><i style="width:${pr / m.n * 100}%"></i></div>`;
      }).join('') +
      `<div class="centro" style="font-size:7px;color:#aab4ff;line-height:1.8;margin-top:8px">${M.bono ? 'Cortex te dará misiones nuevas en ' + fmt(misEspera()) + '.' : 'Nuevas misiones en 24 horas.'}</div>` +
      `<button class="bgrande" style="width:100%" data-a="cerrar">OK</button>`;
  }
