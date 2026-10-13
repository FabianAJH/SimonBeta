(function () {
  /* ===================== LA CHICA DEL SOL Y LA FLOR SOLAR =====================
     Parque (de día): 5% de que salga una joven pelirroja que solo camina. Al tocarla pregunta si el sol no es hermoso.
       Si dices que NO: "Algún día verás su belleza" y se va; puede volver a salir (y pregunta si ya lograste ver su belleza).
       Si dices que SÍ: se pone feliz y te regala el COLLAR DEL SOL (ya no vuelve a salir).
     Con el collar puesto 7 días seguidos sin quitártelo, el último día se le cae la SEMILLA SOLAR (7 días para crecer, nunca se marchita).
     La planta colocada: de día y mientras juegas, +1 de felicidad por minuto y +1 de energía cada 3 minutos. De noche se apaga (solo un ligero brillo).
     Estado en e.solar: { st: 0 sin conocer · 1 dijo que no · 2 collar dado · 3 semilla dada, dias: días seguidos con el collar, ult: último día contado } */
  const SC = () => (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.chicaSol) || {};
  const PROB = () => (SC().probAparicion != null ? SC().probAparicion : 5), DIAS = () => SC().diasCollar || 7, FEL_MIN = () => SC().felicidadPorMin || 1, ENE_MIN = () => SC().minutosPorEnergia || 3;
  const sol = () => { const d = { st: 0, dias: 0, ult: '' }; if (!e.solar || typeof e.solar !== 'object') e.solar = d; else Object.keys(d).forEach(k => { if (e.solar[k] === undefined) e.solar[k] = d[k]; }); return e.solar; };
  const diasEntre = (a, b) => { const p = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d) / 864e5; }; return Math.round(p(b) - p(a)); };

  /* ---------- dibujo ---------- */
  function chicaGrid(fr, abierta) {   // Meji: adulta bajita y delgada, casi del tamaño de Simon. Cabello naranja muy rizado, piel blanca con pecas, playera roja con rosas rosas, falda de mezclilla, zapatitos rojos brillantes
    const W = 40, H = 76, g = Grid(W, H), K = '#2a1408';
    const PEL = ['#ffd9a8', '#fbae5a', '#dc7a22', '#a04e10'], PIEL = ['#fffaf5', '#ffeadd', '#f7d0ba', '#e6ae94'], RJ = ['#ff6a70', '#e8353f', '#b01c2c'];
    const curl = (x, y, d, h) => g.art(x, y, ['.dd.', 'd..d', 'd.dd', '.dd.'], { d }) || g.set(x + 1, y, h);
    // ---- melena de atrás: nube de rizos que cae hasta los hombros ----
    capa(g, '#6a300a', L => sombrear(L, union(elipse(20, 17, 17.5, 15.5), elipse(6.5, 32, 6, 11), elipse(33.5, 32, 6, 11), elipse(8, 44, 4.5, 5), elipse(32, 44, 4.5, 5)), 20, 17, 18, 16, PEL));
    [[4, 12], [9, 6], [16, 3], [24, 3], [30, 6], [33, 12], [2, 22], [34, 22], [3, 31], [33, 31], [4, 39], [32, 39], [6, 45], [30, 45], [11, 2], [27, 1]].forEach(([x, y], i) => curl(x, y, i % 2 ? PEL[3] : PEL[2], PEL[0]));
    // ---- brazos delgados ----
    [[11, fr ? 1 : 0], [27, fr ? 0 : 1]].forEach(([x, o]) => { g.rect(x, 36 + o, 3, 13, PIEL[1]); g.rect(x, 36 + o, 1, 13, PIEL[0]); g.rect(x + 2, 36 + o, 1, 13, PIEL[2]); g.rect(x, 49 + o, 3, 3, PIEL[1]); g.set(x + 2, 51 + o, PIEL[2]); });
    // ---- piernas y zapatitos rojos brillantes ----
    [15 - (fr ? 1 : 0), 22 + (fr ? 1 : 0)].forEach(x => {
      g.rect(x, 59, 4, 11, PIEL[1]); g.rect(x, 59, 1, 11, PIEL[0]); g.rect(x + 3, 59, 1, 11, PIEL[2]);
      g.rect(x, 66, 4, 1, '#ffffff'); g.rect(x, 67, 4, 1, '#ffd0d8');   // calcetín corto
      capa(g, '#5a0a18', L => { L.rect(x - 1, 69, 7, 5, '#e8183a'); L.rect(x - 1, 69, 7, 1, '#ff9aa8'); L.rect(x, 70, 3, 1, '#ff5a6e'); L.rect(x - 1, 73, 7, 1, '#8a0a20'); L.set(x + 1, 70, '#ffffff'); L.set(x + 2, 71, '#ff9aa8'); });
    });
    // ---- falda roja ----
    for (let y = 51; y < 61; y++) { const hw = 7 + Math.floor((y - 51) * .5); g.rect(20 - hw, y, hw * 2, 1, y === 51 ? RJ[2] : y === 60 ? RJ[0] : (y % 3 === 0 ? RJ[0] : RJ[1])); g.set(20 - hw, y, RJ[0]); g.set(19 + hw, y, RJ[2]); }
    g.rect(16, 54, 1, 6, RJ[2]); g.rect(24, 54, 1, 6, RJ[2]); g.rect(20, 55, 1, 5, RJ[2]);   // pliegues
    // ---- playera roja con rosas rosas ----
    for (let y = 33; y < 52; y++) { const hw = y < 36 ? 7 : 6 + (y < 44 ? 0 : 0); g.rect(20 - hw, y, hw * 2, 1, RJ[1]); g.set(20 - hw, y, RJ[0]); g.set(19 + hw, y, RJ[2]); }
    g.rect(14, 51, 12, 1, RJ[2]); g.rect(13, 33, 14, 1, RJ[0]);
    [[10, 34], [26, 34]].forEach(([x, y], k) => { g.rect(x, y, 5, 8, RJ[1]); g.rect(x, y, 5, 1, RJ[0]); g.rect(x + (k ? 4 : 0), y, 1, 8, RJ[2]); g.rect(x, y + 7, 5, 1, RJ[2]); });   // mangas cortitas
    g.rect(17, 33, 7, 1, PIEL[1]); g.rect(18, 34, 5, 1, PIEL[1]); g.rect(19, 35, 3, 1, PIEL[2]);   // escote redondo
    const rosa = (x, y) => g.art(x, y, ['.pp.', 'pPpp', 'ppPp', '.pp.'], { p: '#ff9ac8', P: '#d8508a' }) || g.set(x + 1, y + 1, '#ffd0e8');
    [[14, 38], [21, 40], [16, 45], [22, 46], [11, 36]].forEach(([x, y]) => rosa(x, y));
    [[19, 43], [13, 42]].forEach(([x, y]) => { g.set(x, y, '#2f9a4a'); g.set(x + 1, y + 1, '#2f9a4a'); });   // hojitas
    // ---- cuello ----
    g.rect(18, 29, 4, 5, PIEL[1]); g.rect(21, 29, 1, 5, PIEL[2]);
    // ---- cara ----
    capa(g, '#b5704e', L => sombrear(L, elipse(20, 19, 10.5, 10.5), 20, 19, 10.5, 10.5, PIEL));
    // ---- rostro: cejas, ojos grandes brillantes, nariz, cachetes, pecas, sonrisa ----
    [[14, 15], [15, 14], [16, 14], [24, 14], [25, 14], [26, 15]].forEach(([x, y]) => g.set(x, y, '#b8641c'));
    [14, 23].forEach((x, k) => {
      g.art(x, 16, ['.kk.', 'kmmk', k ? 'kmwk' : 'kwmk', 'kmmk', '.kk.'], { k: K, m: '#7a4420', w: '#ffffff' });
      g.set(k ? x + 4 : x - 1, 16, K); g.set(x + (k ? 3 : 0), 21, '#a06a4a');
    });
    g.rect(12, 22, 3, 2, '#ffa5b0'); g.rect(26, 22, 3, 2, '#ffa5b0'); g.set(11, 22, '#ffd0d8'); g.set(29, 22, '#ffd0d8');
    [[13, 22], [15, 23], [17, 23], [19, 23], [21, 23], [23, 23], [25, 22], [27, 23], [12, 24], [28, 24]].forEach(([x, y]) => g.set(x, y, '#d8905e'));
    g.set(20, 21, '#e8a58a'); g.set(19, 22, '#f0b8a0');
    if (abierta) { g.rect(18, 25, 5, 3, '#8a1a2a'); g.rect(19, 27, 3, 1, '#ff7a8a'); g.rect(18, 25, 5, 1, '#fffaf5'); }
    else { g.art(18, 25, ['k...k', '.kkk.'], { k: '#b8445a' }); g.set(20, 27, '#ff9aa8'); }
    // ---- flequillo y rizos que enmarcan la cara ----
    capa(g, '#6a300a', L => {
      [[11, 8, 3, 1], [15, 6, 3, 2], [20, 5, 3, 1], [25, 6, 3, 2], [29, 8, 3, 1], [12, 11, 2, 2], [28, 11, 2, 2]].forEach(([x, y, r, c]) => bola(L, x, y, r, PEL[c]));
      [[8, 17, 3, 1], [8, 23, 3, 2], [32, 17, 3, 1], [32, 23, 3, 2], [9, 29, 2, 1], [31, 29, 2, 2]].forEach(([x, y, r, c]) => bola(L, x, y, r, PEL[c]));
    });
    [[10, 7], [16, 4], [21, 4], [26, 5], [8, 16], [32, 16], [8, 22], [32, 22]].forEach(([x, y]) => { g.set(x, y, PEL[0]); g.set(x + 1, y, PEL[0]); g.set(x, y + 1, PEL[3]); });   // brillos y sombras de rizos
    g.art(27, 4, ['.pp.', 'pPpp', '.pp.'], { p: '#ff9ac8', P: '#d8508a' });   // pasador de rosita
    return g;
  }
  window.chicaGrid = chicaGrid;
  const sunPix = (g, x, y, r, on, fr, rayos) => {   // el sol: disco con rayos que respiran (apagado = gris cálido sin rayos)
    const C = on ? { d: '#ffd23a', c: '#fff2a0', r: '#ffa81c', o: '#a85a08' } : { d: '#8a7c5c', c: '#d8b860', r: '#6a5e46', o: '#3a3220' };
    if (on) for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, len = r + 2 + (((fr || 0) + i * 3) % 12 < 6 ? 1 : 0), dx = Math.cos(a), dy = Math.sin(a); for (let t = r + 1; t <= len + 1; t++) g.set(Math.round(x + dx * t), Math.round(y + dy * t), C.r); }
    capa(g, C.o, L => { bola(L, x, y, r, C.d); bola(L, x, y, Math.max(1, r - 2), C.c); });
    if (!on) g.set(x, y, '#ffe9a0');   // el rescoldo: ligero brillo
  };
  function plantaSolar(g, cx, dy, etapa, fr) {   // su flor es un sol; ramas con soles chiquitos. De noche se apaga
    const on = !esNoche(), f = fr || 0;
    if (etapa === 'semilla') { capa(g, '#7a4a08', L => { bola(L, cx, dy - 3, 2, '#ffd23a'); L.set(cx, dy - 4, '#ffffff'); }); return; }
    if (etapa === 'brote') { for (let t = 0; t < 8; t++) g.set(cx, dy - 1 - t, '#4aa850'); sunPix(g, cx, dy - 11, 2, on, f); return; }
    const stem = on ? ['#2a7a3a', '#4aa850'] : ['#1d4a2a', '#2f6a3a'];
    for (let t = 0; t < 15; t++) { g.set(cx, dy - 1 - t, stem[t < 6 ? 0 : 1]); g.set(cx + 1, dy - 1 - t, stem[0]); }
    const top = dy - 20;
    linea(g, cx, dy - 7, cx - 9, dy - 14, stem[1]); linea(g, cx + 1, dy - 9, cx + 10, dy - 16, stem[1]);
    g.set(cx - 5, dy - 8, stem[1]); g.set(cx - 6, dy - 9, stem[1]); g.set(cx + 5, dy - 5, stem[1]); g.set(cx + 6, dy - 5, stem[1]);   // hojitas
    sunPix(g, cx - 10, dy - 15, 2, on, f + 4); sunPix(g, cx + 11, dy - 17, 2, on, f + 8);   // soles pequeños en las ramas
    sunPix(g, cx, top, 5, on, f);   // el sol grande
    if (on) [[-8, -6], [8, -9], [0, -14], [-13, -10]].forEach(([dx, dyy], i) => { if ((f + i * 6) % 24 < 6) g.set(cx + dx, top + dyy, '#fff6b0'); });
  }
  function semillaSolGrid() {   // sobrecito amarillo con un solecito
    const g = Grid(14, 16);
    g.rect(1, 3, 12, 12, '#ffc83a'); g.rect(1, 3, 12, 1, '#fff2a0'); g.rect(1, 3, 1, 12, '#fff2a0'); g.rect(11, 3, 2, 12, '#d8901a'); g.rect(1, 14, 12, 1, '#d8901a');
    g.rect(2, 0, 10, 5, '#d8601a'); g.rect(3, 1, 8, 3, '#8a3a08');
    g.rect(5, 8, 4, 4, '#ff7a1c'); g.rect(6, 9, 2, 2, '#fff2a0'); [[7, 6], [7, 13], [3, 10], [10, 10]].forEach(([x, y]) => g.set(x, y, '#ff7a1c'));
    return g;
  }
  window.plantaSolar = plantaSolar; window.semillaSolGrid = semillaSolGrid;

  /* ---------- objetos ---------- */
  ITEMS.collar_sol = { tipo: 'ropa', slot: 'cuello', n: 'COLLAR DEL SOL', p: 0, nv: 1, crop: [8, 42, 44, 36], secreto: true, codigo: true };
  ACC2.collar_sol = g => {
    for (let x = 16; x <= 40; x += 2) { const y = arcoCuello(x, 56, 6); g.rect(x, y, 2, 1, (x / 2) % 2 ? '#ffd84a' : '#d8a020'); g.set(x, y, '#fff6b0'); }
    [[28, 58], [28, 69], [23, 63], [33, 63], [24, 59], [32, 59], [24, 67], [32, 67]].forEach(([x, y]) => g.set(x, y, '#ff9a1c'));   // rayitos
    capa(g, '#a85a08', L => { bola(L, 28, 63, 3, '#ffd23a'); bola(L, 28, 63, 1, '#fff2a0'); });
  };
  SEMILLAS.solar = { n: 'Flor Solar', rareza: 'Única', diasCrecer: 7, diasVida: 999999, efecto: 'Nunca se marchita. De día y mientras juegas: +1 de felicidad por minuto y +1 de energía cada 3 minutos. De noche se apaga.', precio: 0, col: '#ffc83a', planta: plantaSolar, exclusivo: true };
  if (typeof ROPA_COM !== 'undefined') Object.assign(ROPA_COM, { collar_sol: 'Un solecito en el cuello. Qué calentito.', collar_suerte: 'Con este collar siento que algo bueno viene. Sí.', aura_trebol: 'Me caen tréboles. Qué suerte.' });

  /* ---------- la chica en el parque ---------- */
  let chN = null, chEnParque = false;
  const hy = () => RY + 8;
  /* en el parque solo puede pasar UN evento a la vez (perrito, alvarikoke o Meji); los demás esperan */
  window.parqueOcupado = quien => (quien !== 'sif' && typeof sifP !== 'undefined' && !!sifP) || (quien !== 'alv' && !!window.alvF) || (quien !== 'chica' && !!chN);
  function chicaSpawn() {
    const dir = Math.random() < .5 ? 1 : -1;
    chN = { x: dir > 0 ? -12 : LW + 12, y: SY + SH + 10 + Math.round(Math.random() * 14), dir, t: 0, ph: 'camina' };
  }
  function chicaDibujar() {
    if (lugar !== 'parque') { chN = null; chEnParque = false; return; }
    if (!chEnParque) { chEnParque = true; const s = sol(); if (s.st < 2 && !esNoche() && !dlg && !parqueOcupado('chica') && Math.random() * 100 < PROB()) chicaSpawn(); }
    const c = chN; if (!c) return; c.t++;
    if (c.ph === 'camina') { c.x += c.dir * .4; if (c.x > LW - 14) c.dir = -1; else if (c.x < 14 && c.t > 40) c.dir = 1; if (c.t > 1600 || esNoche()) { c.ph = 'va'; c.dir = c.x < LW / 2 ? -1 : 1; } }
    else if (c.ph === 'va') { c.x += c.dir * .55; if (c.x < -14 || c.x > LW + 14) { chN = null; return; } }
    const mov = c.ph !== 'habla', fr = mov ? (c.t >> 3) & 1 : 0;
    const bob = mov && fr ? -1 : 0;
    const sp = sprite('chica' + fr, () => chicaGrid(fr), 0);
    ctx.fillStyle = 'rgba(30,12,40,.28)'; ctx.fillRect(Math.round(c.x) - 10, c.y + 1, 21, 1);
    if (c.dir < 0 && mov) { ctx.save(); ctx.translate(Math.round(c.x) + 20, c.y - 74 + bob); ctx.scale(-1, 1); ctx.drawImage(sp, 0, 0); ctx.restore(); }
    else ctx.drawImage(sp, Math.round(c.x) - 20, c.y - 74 + bob);
  }
  function solToca(x, y) {
    if (lugar !== 'parque' || dlg || modal || ban || edit || !chN || chN.ph === 'va') return false;
    if (Math.abs(x - chN.x) <= 14 && y >= chN.y - 76 && y <= chN.y + 3) { chicaHabla(); return true; }
    return false;
  }
  const J = t => ({ q: 'CHICA', t }), M = t => ({ q: 'MEJI', t }), TT = t => ({ q: 'TRADUCTOR', t: '«' + t + '»' });
  function darCollarSol() { e.tiene.collar_sol = 1; e.ropa.cuello = 'collar_sol'; const s = sol(); s.st = 2; s.dias = 1; s.ult = hoy(); guardar(); pintar(); }
  function chicaHabla() {
    const s = sol(), c = chN; if (!c || dlg) return; sfx.click(); c.ph = 'habla'; c.dir = 1;
    const feliz = [TT('¡Sí, es hermoso!'), J('¡Qué felicidad! ¡Sabía que podías verlo!'), J('Ah, casi lo olvido... ¡me llamo Meji!'), TT('Mucho gusto, Meji.'), M('¡Igualmente! Mira, te hice este collar con un sol.'),
      { q: 'CHICA', t: '', fan: { g: () => prevGrid('collar_sol'), t: 'COLLAR DEL SOL', d: 'UN SOLECITO PARA EL CUELLO. YA LO TIENE PUESTO.' }, fn: darCollarSol },
      M('Si lo usas mucho tiempo, tal vez te dé algo.'), M('¡No te lo quites! ¡Adiós!')];
    const no = [TT('No lo creo.'), J('Algún día verás su belleza.')];
    const pregunta = s.st === 1 ? J('¿Lograste ver la belleza del sol?') : J('¡Hola! ...¿No crees que el sol es hermoso?');
    pregunta.op = s.st === 1 ? ['SÍ, YA LA VI', 'TODAVÍA NO'] : ['SÍ, ES HERMOSO', 'NO, NADA'];
    pregunta.res = [feliz, no];
    dialogo(s.st === 1 ? [pregunta] : [J('...'), pregunta], () => {
      if (sol().st >= 2) { c.ph = 'va'; c.dir = 1; } else { sol().st = 1; guardar(); c.ph = 'va'; c.dir = c.x < LW / 2 ? -1 : 1; }
    });
  }
  window.solToca = solToca; window.chicaDibujar = chicaDibujar;
  Object.defineProperty(window, 'chicaN', { get: () => chN, set: v => { chN = v; }, configurable: true }); window.chicaSpawn = chicaSpawn; window.solEstado = sol;

  /* ---------- collar 7 días seguidos, semilla y efecto de la planta ---------- */
  let solUlt = Date.now();
  function solSemilla() {
    const s = sol(); if (s.st !== 2) return;
    s.st = 3; e.semillas.solar = (e.semillas.solar || 0) + 1; guardar(); pintar();
    dialogo([TT('El collar... parece que tenía algo dentro. ¡Se cayó!'), { q: 'TRADUCTOR', t: '', fan: { g: () => semillaSolGrid(), t: 'SEMILLA SOLAR', d: 'SIÉMBRALA EN EL JARDÍN: TARDA 7 DÍAS EN CRECER.' } }], () => {});
  }
  function solTick() {
    const ahora = Date.now(), dt = Math.min(15000, Math.max(0, ahora - solUlt)) / 1000; solUlt = ahora;
    if (!e || !e.intro) return;
    const s = sol();
    if (s.st === 2) {
      const eq = e.ropa.cuello === 'collar_sol', h = hoy();
      if (!eq) { if (s.dias || s.ult) { s.dias = 0; s.ult = ''; guardar(); } }   // se lo quitó: empieza de cero
      else if (!s.ult) { s.dias = 1; s.ult = h; guardar(); }
      else if (s.ult !== h) { s.dias = Math.min(DIAS(), s.dias + Math.max(1, diasEntre(s.ult, h))); s.ult = h; guardar(); }
      if (eq && s.dias >= DIAS() && !dlg && !modal && !fanOn && !introActiva && !vistaBloq) solSemilla();
    }
    if (!document.hidden && !esNoche() && typeof macetaGlobal === 'function' && macetaGlobal('solar')) {   // la flor solar: solo de día y con el juego abierto
      e.feliz = clamp(e.feliz + dt * FEL_MIN() / 60); e.energia = clamp(e.energia + dt / (ENE_MIN() * 60));
    }
  }
  window.solTick = solTick;
})();
