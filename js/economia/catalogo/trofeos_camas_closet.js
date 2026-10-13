  /* ===================== TROFEOS, CAMAS Y CLÓSET ===================== */
  var TROFEOS = [
    { id: 'keke', n: 'ATRAPA EL KEKE', v: () => e.mj.rec, t: [20, 45, 80], u: 'PUNTOS' },
    { id: 'run', n: 'CORRE, SIMON', v: () => e.run.rec, t: [40, 100, 200], u: 'PUNTOS' },
    { id: 'mem', n: 'MEMORIA CON CORTEX', v: () => e.mem.rec, t: [60, 150, 300], u: 'PUNTOS' },
    { id: 'rt', n: 'BAILA CON SIMON', v: () => e.rt.rec, t: [60, 130, 200], u: 'PUNTOS' },
    { id: 'jug', n: 'AMIGO DEL JUEGO', v: () => (e.st.mj || 0) + (e.st.run || 0) + (e.st.rt || 0) + (e.st.mem || 0), t: [10, 50, 150], u: 'PARTIDAS' },
    { id: 'cons', n: 'CONSTANCIA', v: () => e.mejorRacha || 0, t: [3, 7, 30], u: 'DÍAS SEGUIDOS CON REGALO' }
  ];
  var TROF_PREMIO = [20, 50, 120], TROF_NOM = ['SIN TROFEO', 'BRONCE', 'PLATA', 'ORO'];
  function trofNivel(t) { const v = t.v() || 0; return v >= t.t[2] ? 3 : v >= t.t[1] ? 2 : v >= t.t[0] ? 1 : 0; }
  function trofPend() { let n = 0; TROFEOS.forEach(t => { const nv = trofNivel(t), r = (e.trof || {})[t.id] || 0; for (let i = r; i < nv; i++) n += TROF_PREMIO[i]; }); return n; }
  function trofeosVivo() {
    const pend = (tk >> 3) % 2;
    TROFEOS.forEach((t, i) => {
      const nv = trofNivel(t), x = OX + [82, 94, 106][i % 3], base = i < 3 ? RY - 26 : RY - 7, y = base - 10;
      const C = nv === 3 ? ['#ffd84a', '#e0a820', '#8a5a1a'] : nv === 2 ? ['#e0e8f8', '#9aa4c0', '#5a6480'] : nv === 1 ? ['#e0985e', '#a8602e', '#6a3a18'] : ['#3e3e56', '#2e2e44', '#22222e'];
      ctx.fillStyle = C[0]; ctx.fillRect(x, y, 8, 5); ctx.fillRect(x - 1, y + 1, 1, 2); ctx.fillRect(x + 8, y + 1, 1, 2);
      ctx.fillStyle = C[1]; ctx.fillRect(x + 1, y + 5, 6, 2); ctx.fillRect(x + 3, y + 7, 2, 2);
      ctx.fillStyle = C[2]; ctx.fillRect(x + 1, y + 9, 6, 1);
      if (nv) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(x + 1, y + 1, 1, 3); }
      if (nv > ((e.trof || {})[t.id] || 0) && pend) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 9, y - 2, 1, 3); ctx.fillRect(x + 8, y - 1, 3, 1); }
    });
  }
  function renderTrof() {
    $('m-titulo').textContent = 'SALÓN DE TROFEOS';
    const p = trofPend();
    let h = `<div class="centro" style="font-size:7px;line-height:1.9;color:#aab4ff;margin-bottom:10px">Cada trofeo sube de bronce a plata y oro.</div>`;
    TROFEOS.forEach(t => {
      const nv = trofNivel(t), v = t.v() || 0, sig = nv < 3 ? `SIGUIENTE (${TROF_NOM[nv + 1]}): ${t.t[nv]}` : '¡TROFEO DE ORO!';
      h += `<div class="saldo"><span>${t.n}</span><span style="color:${['#6a6a88', '#e0985e', '#e0e8f8', '#ffd84a'][nv]}">${TROF_NOM[nv]}</span></div><div style="font-size:6px;color:#aab4ff;line-height:1.8;margin:2px 0 10px">${t.u}: ${v} · ${sig}</div>`;
    });
    h += p ? `<button class="bgrande" data-a="tr_rec">RECLAMAR +${p} MONEDAS</button>` : `<div class="centro" style="font-size:7px;line-height:1.9;color:#8a96ff;margin-top:6px">Nada por reclamar.</div>`;
    return h;
  }
  function trofReclamar() {
    const p = trofPend(); if (!p) return;
    e.trof = e.trof || {}; TROFEOS.forEach(t => { e.trof[t.id] = trofNivel(t); });
    e.monedas += p; e.total = (e.total || 0) + p; sfx.compra(); estrellas(8); pintar(); guardar(); render();
  }
  // ---- camas: dormir más rápido y despertar de mejor humor ----
  function camaGrid(t) {
    const P = [
      { m: '#8a5a38', m2: '#5a3a24', s: '#e8ecff', c: '#4b6ae8', c2: '#8aa0ff' },
      { m: '#d8ecff', m2: '#9ac0e8', s: '#ffffff', c: '#a8d0ff', c2: '#ffffff' },
      { m: '#e8353f', m2: '#9a1c28', s: '#f4f4ff', c: '#232b63', c2: '#ffd84a' },
      { m: '#ffd84a', m2: '#a87810', s: '#fff6ea', c: '#7a3ab8', c2: '#ffd84a' }][t - 1];
    const g = Grid(40, 26), R = (x, y, w, h, c) => g.rect(x + 1, y + 3, w, h, c);
    R(0, 8, 38, 4, P.m); R(0, 2, 4, 18, P.m); R(0, 2, 4, 1, mixC(P.m, .4)); R(34, 6, 4, 14, P.m); R(0, 17, 38, 3, P.m2); R(1, 20, 3, 2, P.m2); R(34, 20, 3, 2, P.m2);
    R(4, 6, 30, 9, P.s); R(5, 6, 9, 5, '#ffffff'); R(5, 6, 9, 1, '#d8dcf0'); R(14, 9, 20, 6, P.c); R(14, 9, 20, 1, P.c2);
    if (t === 2) { [[18, 11], [24, 12], [29, 10]].forEach(([x, y]) => { R(x, y, 4, 2, '#ffffff'); R(x + 1, y - 1, 2, 1, '#ffffff'); }); }
    if (t === 3) { [[17, 10], [22, 12], [27, 10], [31, 13]].forEach(([x, y]) => R(x, y, 1, 1, '#ffd84a')); R(1, -1, 2, 3, '#f4f4ff'); R(1, 0, 2, 1, '#e8353f'); }
    if (t === 4) { R(0, 0, 4, 2, '#ff4a8a'); R(1, -1, 2, 1, '#ffd84a'); [[16, 11], [21, 12], [26, 10], [30, 12]].forEach(([x, y]) => R(x, y, 1, 1, '#fff6b0')); R(34, 4, 4, 2, '#ffd84a'); }
    g.contour('#241a30'); return g;
  }
  [['cama1', 'CAMA SENCILLA', 90, 2], ['cama2', 'CAMA DE NUBES', 180, 5], ['cama3', 'CAMA COHETE', 320, 8], ['cama4', 'CAMA REAL', 600, 12]].forEach(([k, n, p, nv], i) => {
    ITEMS[k] = { tipo: 'cuarto', slot: 'izq', n, p, nv, grid: () => camaGrid(i + 1), tema: 'sala', exclusivo: true, cama: i + 1 }; ORDEN.cuarto.push(k);
  });
  function camaDe(deco) { let t = 0; (deco || []).forEach(d => { const it = ITEMS[d.k]; if (it && it.cama && (d.h || 'sala') === 'sala') t = Math.max(t, it.cama); }); return t; }
  const macetaGlobal = especie => ((e && e.deco) || []).some(d => ITEMS[d.k] && ITEMS[d.k].semilla === especie && macetaViva(d.k));   // efecto de la planta: ya no importa en qué cuarto esté colocada, solo que esté viva
  const ecoMul = () => macetaGlobal('eco') ? 1.1 : 1;   // Flor de Eco: comer y jugar rinden un 10% más
  const simonLevita = () => !!e.ropa.aura && macetaGlobal('eterna');   // Semilla Eterna + cualquier aura puesta: Simon levita (puramente visual)
  function rDormir(deco, ojo) { return 50 * (1 + .2 * camaDe(deco || (e && e.deco))) * ((ojo === undefined ? (e.sangFase === 2 && e.ojoOn !== 0) : ojo) ? 1.1 : 1) * (macetaGlobal('raiz') ? 1.15 : 1); }   // el ojo mascota: duerme 10% más rápido; la ANÉMONA CALMA viva (en cualquier cuarto): 15% más rápido
  // ---- clóset: guarda 3 atuendos ----
  function closetGrid() {
    const g = Grid(20, 36), R = (x, y, w, h, c) => g.rect(x + 1, y + 1, w, h, c);
    R(0, 0, 18, 32, '#5a3820'); R(1, 1, 16, 30, '#a8683c'); R(8, 1, 2, 30, '#5a3820'); R(2, 2, 6, 28, '#b87a48'); R(11, 2, 5, 28, '#b87a48'); R(2, 2, 6, 1, '#d8a070'); R(11, 2, 5, 1, '#d8a070');
    R(6, 14, 1, 3, '#ffd84a'); R(11, 14, 1, 3, '#ffd84a'); R(0, 32, 3, 2, '#3a2412'); R(15, 32, 3, 2, '#3a2412'); R(2, 0, 14, 1, '#d8a070');
    g.contour('#241810'); return g;
  }
  ITEMS.closet = { tipo: 'cuarto', slot: 'der', n: 'CLÓSET', p: 150, nv: 3, grid: closetGrid, tema: 'sala', exclusivo: true, tap: 'closet' }; ORDEN.cuarto.push('closet');
  ITEMS.buzon.tap = 'notis';
  function renderCloset() {
    $('m-titulo').textContent = 'CLÓSET';
    if (!e.closet) e.closet = [null, null, null];
    let h = `<div class="centro" style="font-size:7px;line-height:1.9;color:#aab4ff;margin-bottom:10px">Guarda tu atuendo actual.</div><div class="cuadricula">`;
    for (let i = 0; i < 3; i++) { const c = e.closet[i]; h += `<div class="card"><div class="pv">${c ? `<canvas data-prev="cl_${i}"></canvas>` : '<div style="font-size:7px;color:#4a5090;padding:10px 0">VACÍO</div>'}</div><div class="cn">ATUENDO ${i + 1}</div>${c ? `<button class="bt ok" data-a="cl_pon" data-k="${i}">PONER</button>` : ''}<button class="bt" data-a="cl_guarda" data-k="${i}">GUARDAR AQUÍ</button></div>`; }
    return h + '</div>';
  }
  function closetClick(a, k) {
    if (!e.closet) e.closet = [null, null, null]; k = +k;
    if (a === 'cl_guarda') { e.closet[k] = Object.assign({}, e.ropa); toast('Atuendo ' + (k + 1) + ' guardado'); sfx.compra(); }
    else if (a === 'cl_pon') { const c = e.closet[k]; if (!c) return; const B = BASE().ropa; Object.keys(e.ropa).forEach(sl => { const v = c[sl]; e.ropa[sl] = (v && e.tiene[v]) ? v : (B[sl] === undefined ? null : B[sl]); }); sfx.click(); gesto('salto'); pintar(); }
    guardar(); render();
  }
  function tapDeco(k) { const t = ITEMS[k].tap; if (t === 'racha') { rachaModo = (rachaModo + 1) % 3; } else if (t === 'notis') { const f = $('b-noti').onclick; if (f) f(); } else if (t === 'peluche') pelucheTap(); else if (t === 'planta') mostrarInfoPlanta(k); else if (t === 'fn') ITEMS[k].tapFn(k); else abrir(t); }
  let plantaInfoT = null;
  function mostrarInfoPlanta(k) {   // muestra, justo debajo de la maceta, cuántos días de vida le quedan antes de marchitarse
    const d = e.deco.find(x => x.k === k && (x.h || 'sala') === e.hab); const el = $('planta-info'); if (!d || !el) return;
    const r = posReal(d), sc = cv.getBoundingClientRect(); if (!sc.width) return;
    const kf = sc.width / LW, v = e.macetaVida[k], S = SEMILLAS[ITEMS[k].semilla];
    const txt = !v ? '' : v.dias <= 0 ? 'SE MARCHITÓ' : (S && S.diasVida >= 999999) ? 'NUNCA SE MARCHITA' : (v.dias === 1 ? 'QUEDA 1 DÍA DE VIDA' : 'QUEDAN ' + v.dias + ' DÍAS DE VIDA');
    if (!txt) return;
    el.textContent = txt;
    el.style.left = Math.round(sc.left + (r.x + r.w / 2) * kf) + 'px'; el.style.top = Math.round(sc.top + r.y * kf + r.h * kf + 4) + 'px';
    el.classList.add('on'); clearTimeout(plantaInfoT); plantaInfoT = setTimeout(() => el.classList.remove('on'), 2600);
  }
