  /* ===================== VIDA PROPIA, TAREAS Y HALLAZGOS ===================== */
  const ahora = () => window.__ahora || Date.now();
  const DIBUJOS = ['sol', 'casa', 'flor', 'luna', 'corazon'];
  // (NOMBRE_DIB definido en dialogos.js)
  function libroGrid(f) {
    const g = Grid(22, 12);
    capa(g, '#150f55', L => {
      L.rect(0, 2, 22, 10, '#2a3c9a'); L.rect(1, 1, 10, 9, '#ffffff'); L.rect(11, 1, 10, 9, '#f0f2fb'); L.rect(10, 1, 2, 9, '#c8c8d8');
      [3, 5, 7].forEach((y, i) => { L.rect(2, y, f ? 5 + (i % 2) * 2 : 7, 1, '#9aa6c8'); L.rect(13, y, f ? 7 : 5 + (i % 2) * 2, 1, '#9aa6c8'); });
    });
    return g;
  }
  function pelotaGrid() {
    const g = Grid(9, 9);
    capa(g, '#4a0a14', L => sombrear(L, elipse(4.5, 4.5, 4.5, 4.5), 4.5, 4.5, 4.5, 4.5, R.rojo));
    g.rect(1, 4, 7, 1, '#ffffff');
    return g;
  }
  function hallGrid(tipo) {
    const g = Grid(11, 11);
    if (tipo === 'moneda') {
      capa(g, '#8a5a08', L => sombrear(L, elipse(5.5, 5.5, 4.8, 4.8), 5.5, 5.5, 4.8, 4.8, R.dorado));
      g.rect(5, 3, 1, 5, '#8a5a08');
    } else {
      capa(g, '#7a6a40', L => { L.rect(1, 1, 9, 9, '#f4eed8'); L.rect(1, 4, 9, 2, '#ff6a8a'); });
      g.rect(1, 5, 9, 1, '#e8353f');
    }
    return g;
  }
  function dibujoGrid(id) {
    const g = Grid(16, 16);
    g.rect(0, 0, 16, 16, '#c8b888'); g.rect(1, 1, 14, 14, '#f4eed8');
    const rell = (t, c) => { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (t(x, y)) g.set(x, y, c); };
    if (id === 'sol') {
      rell(elipse(8, 8, 3.4, 3.4), '#ffd020');
      [[8, 2], [8, 3], [8, 13], [8, 12], [2, 8], [3, 8], [13, 8], [12, 8], [4, 4], [12, 4], [4, 12], [12, 12]].forEach(([x, y]) => g.set(x, y, '#ff8a20'));
    } else if (id === 'casa') {
      g.rect(3, 8, 10, 6, '#e8353f');
      for (let y = 3; y <= 7; y++) { const h = y - 2; g.rect(8 - h, y, h * 2, 1, '#6e4422'); }
      g.rect(7, 11, 3, 3, '#6e4422'); g.rect(4, 10, 2, 2, '#62b8ff'); g.rect(11, 10, 2, 2, '#62b8ff');
    } else if (id === 'flor') {
      g.rect(8, 8, 1, 6, '#2f9a4a'); g.rect(6, 11, 2, 1, '#2f9a4a'); g.rect(9, 12, 2, 1, '#2f9a4a');
      [[8, 3.5], [8, 8.5], [5.5, 6], [10.5, 6]].forEach(([cx, cy]) => rell(elipse(cx, cy, 2, 2), '#ff6a8a'));
      rell(elipse(8, 6, 1.7, 1.7), '#ffd020');
    } else if (id === 'luna') {
      g.rect(2, 2, 12, 12, '#232b63');
      const m = elipse(8, 8, 4, 4), h = elipse(10, 7, 3.4, 3.4);
      rell((x, y) => m(x, y) && !h(x, y), '#ffe45a');
      [[4, 4], [12, 12], [12, 4], [4, 12]].forEach(([x, y]) => g.set(x, y, '#ffffff'));
    } else g.art(3, 4, CORAZON, { O: '#7a1020', r: '#ff4a5c', h: '#ffb6c0' });
    return g;
  }
  const fmt = ms => { ms = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(ms / 3600) + ':' + String(Math.floor(ms % 3600 / 60)).padStart(2, '0') + ':' + String(ms % 60).padStart(2, '0'); };
  const resta = (t, dur) => Math.min(dur, t.ini + dur - ahora());
  const dibIcono = (cv, clave, fn) => {
    if (!cv) return;
    const c = cv.getContext('2d');
    const w = cv.width || 14, h = cv.height || 13;
    c.clearRect(0, 0, w, h);
    const sp = sprite(clave, fn, 0);
    const ox = Math.max(0, Math.floor((w - sp.width) / 2));
    const oy = Math.max(0, Math.floor((h - sp.height) / 2));
    c.drawImage(sp, ox, oy);
  };
  function actualizarTareas() {}
  function checkTareas() {}

  // Simon hace cosas solo
  function iniciarAct() {
    if (escenaId() === 'estudio' || escenaId() === 'jardin') { proxAct = tk + 600; return; }
    const sc = escenaId(), op = sc === 'parque' ? ['pelota', 'pelota', 'mariposa'] : sc === 'sala' ? ['leer', 'ventana', 'pelota'] : sc === 'cocina' ? ['ventana', 'pelota'] : sc === 'estudio' ? ['ventana', 'leer'] : ['pelota'];
    if ((sc === 'sala' || sc === 'cocina' || sc === 'estudio') && clima() !== 'sol') op.push('ventana', 'ventana'); if (e.ropa.orejas) op.push('bailar', 'bailar');
    const t = op[Math.floor(Math.random() * op.length)];
    const len = { leer: 50, ventana: 60, pelota: 42, bailar: 38, mariposa: 50 }[t];
    act = { tipo: t, t: 0, len };
    if (t === 'ventana') { const l = frasesVentana(); setTimeout(() => { if (act && act.tipo === 'ventana') decir(l[Math.floor(Math.random() * l.length)]); }, 1000); }
    if (t === 'mariposa') setTimeout(() => { if (act && act.tipo === 'mariposa') decir('Sí. (una mariposa)'); }, 900);
    proxAct = tk + len + 90 + Math.random() * 120;
  }
  function dibujarExtras(oy, gx) {
    if (e.enf && !e.dormido) {
      const by = Math.round(SY + oy - 7 + Math.sin(tk / 4) * 2);
      const bx = SX + 38 + gx;
      const f = (tk >> 4) % 2;
      ctx.drawImage(sprite('enf_burbuja' + f, () => termometroFlotanteGrid(f), 0), bx, by);
    }
    if (escenaId() === 'jardin') { if (e.hallazgo) ctx.drawImage(sprite('hall_' + e.hallazgo.tipo, () => hallGrid(e.hallazgo.tipo), 0), SX + SW - 2, SY + 24 + Math.round(Math.sin(tk / 3) * 2)); return; }
    if (act && act.tipo === 'leer') { const f = (act.t >> 3) % 2; ctx.drawImage(sprite('libro' + f, () => libroGrid(f), 0), SX + gx + 17, SY + oy + 53); }
    else if (act && act.tipo === 'mariposa') {
      const bx = Math.round(SX + 24 + Math.sin(act.t / 6) * 44), by = Math.round(SY - 4 + Math.cos(act.t / 4) * 10), a = (act.t >> 1) % 2;
      ctx.fillStyle = '#ff8ad8'; ctx.fillRect(bx - 5, by - (a ? 3 : 0), 5, a ? 5 : 3); ctx.fillRect(bx + 1, by - (a ? 3 : 0), 5, a ? 5 : 3);
      ctx.fillStyle = '#ffe0f4'; ctx.fillRect(bx - 4, by - (a ? 2 : 0), 2, 2); ctx.fillRect(bx + 3, by - (a ? 2 : 0), 2, 2); ctx.fillStyle = '#3a2a4a'; ctx.fillRect(bx, by - 1, 1, 5);
    }
    else if (act && act.tipo === 'pelota') {
      const p = act.t / act.len * 2, q = p <= 1 ? p : 2 - p;
      const jk = juguetePuesto(), spj = sprite('tj_' + jk, () => ITEMS[jk].grid(), 0);
      ctx.drawImage(spj, Math.round(SX - 14 + (SW + 22) * q) + 4 - (spj.width >> 1), Math.round(SY + SH - 5 - spj.height - Math.abs(Math.sin(p * Math.PI * 3)) * 24));
    }
    if (e.hallazgo) ctx.drawImage(sprite('hall_' + e.hallazgo.tipo, () => hallGrid(e.hallazgo.tipo), 0), SX + SW - 2, SY + 24 + Math.round(Math.sin(tk / 3) * 2));
  }
  function checkHallazgo() {
    if (e.hallazgo || ahora() < e.proxHallazgo) return;
    const faltan = DIBUJOS.filter(d => !e.dibujos[d]), pool = faltan.length ? faltan : DIBUJOS;
    e.hallazgo = { tipo: Math.random() < .7 ? 'moneda' : 'dibujo', id: pool[Math.floor(Math.random() * pool.length)] };
    if (!e.dormido && !modal) { decir('Sí. (encontré algo)'); sfx.toque(); }
    notificar('Simon encontró algo. ¡Tócalo para recogerlo!');
    guardar();
  }
  function recogerHallazgo() {
    const h = e.hallazgo; if (!h) return;
    e.hallazgo = null; e.proxHallazgo = ahora() + (150 + Math.random() * 180) * 60000;
    if (h.tipo === 'moneda') { const m = 3 + Math.floor(Math.random() * 3); ganar(m, 1, true); decir('Sí. (¡lo encontré para ti!)'); gesto('besos'); hablar(); }
    else { e.dibujos[h.id] = 1; ganar(10, 3, true); dibujoId = h.id; sfx.regalo(); hablar(); abrir('dibujo'); }
  }
  let dibujoId = 'sol';
  // saludo según la hora o la ausencia
  let saludoPend = null;
  // Nivel de abandono: 0=normal, 1=descuidado (3+ días todo en 0), 2=abandono total (7+ días)
  function nivelAbandono() {
    if (e.hambre > 0 || e.feliz > 0 || e.energia > 0 || e.limp > 0) { e.abandonoDesde = null; return 0; }
    if (!e.abandonoDesde) e.abandonoDesde = Date.now();
    const dias = (Date.now() - e.abandonoDesde) / 86400000;
    return dias >= 7 ? 2 : dias >= 3 ? 1 : 0;
  }
  function prepararSaludo() {
    const h = new Date().getHours();
    saludoPend = nivelAbandono() >= 2 ? '...s-sí...' : ausenciaH >= 72 ? 'Sí... (te extrañé mucho)' : ausenciaH >= 24 ? 'Sí... (te extrañé)'
      : h < 6 ? 'Sí... (¿no deberías dormir?)' : h < 12 ? 'Sí. (buenos días)' : h < 19 ? 'Sí. (buenas tardes)' : 'Sí. (buenas noches)';
  }
  function saludar() {
    if (!saludoPend || modal) return;
    if (e.dormido) { saludoPend = null; return; }
    decir(saludoPend); gesto(ausenciaH >= 24 ? 'besos' : null); hablar(); saludoPend = null; proxAct = tk + 60;
  }

