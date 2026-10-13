/* ===================== MENÚ DE MINIJUEGOS (las 4 tarjetas de juegos) ===================== */
  function iconoMj() {
    const g = Grid(11, 11), m = ['...........', '..kkkkkkk..', '.kwwwwwwwk.', 'kwwkwwwrwwk', 'kwkkkwwwrwk', 'kwwkwwgwwwk', 'kwwwwwwwwwk', '.kwwwwwwwk.', '..kk...kk..', '...........', '...........'];
    m.forEach((f, y) => [...f].forEach((ch, x) => { if (ch === 'w') g.set(x, y, '#e8ecff'); else if (ch === 'k') g.set(x, y, '#232b63'); else if (ch === 'r') g.set(x, y, '#ff4a5c'); else if (ch === 'g') g.set(x, y, '#58d048'); }));
    return g;
  }
  function renderMj() {
    $('m-titulo').textContent = 'MINIJUEGOS';
    return `<div class="centro" style="font-size:8px;line-height:1.9;color:#aab4ff;margin-bottom:10px">¡Elige un juego!</div><div class="cuadricula">` +
      `<div class="card"><div class="pv"><canvas data-prev="fd_keke"></canvas></div><div class="cn">ATRAPA EL KEKE</div>${nivel() >= MJ_NV ? `<div style="font-size:6px;color:#4a5090;line-height:1.6">RÉCORD: ${e.mj.rec}</div><button class="bt ok" data-a="mj_jugar">JUGAR</button>` : `<div class="est bloq">CARIÑO NV${MJ_NV}</div>`}</div>` +
      `<div class="card"><div class="pv"><canvas data-prev="mj_mem"></canvas></div><div class="cn">MEMORIA CON CORTEX</div>${nivel() >= MEM_NV ? `<div style="font-size:6px;color:#4a5090;line-height:1.6">RÉCORD: ${e.mem.rec}</div><button class="bt ok" data-a="mem_jugar">JUGAR</button>` : `<div class="est bloq">CARIÑO NV${MEM_NV}</div>`}</div>` +
      `<div class="card"><div class="pv"><canvas data-prev="mj_run"></canvas></div><div class="cn">CORRE, SIMON</div>${nivel() >= RUN_NV ? `<div style="font-size:6px;color:#4a5090;line-height:1.6">RÉCORD: ${e.run.rec}</div><button class="bt ok" data-a="run_jugar">JUGAR</button>` : `<div class="est bloq">CARIÑO NV${RUN_NV}</div>`}</div>` +
      `<div class="card"><div class="pv"><canvas data-prev="mj_rt"></canvas></div><div class="cn">BAILA CON SIMON</div>${nivel() >= RT_NV ? `<div style="font-size:6px;color:#4a5090;line-height:1.6">RÉCORD: ${e.rt.rec}</div><button class="bt ok" data-a="rt_jugar">JUGAR</button>` : `<div class="est bloq">CARIÑO NV${RT_NV}</div>`}</div></div>` +
      `<div class="centro" style="font-size:7px;line-height:1.9;color:#aab4ff;margin-top:12px">Cada juego gasta ${MJ_COSTO} de energía.</div>`;
  }
