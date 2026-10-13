  /* ===================== EL ALVARIKOKE Y EL TRÉBOL DE LA SUERTE =====================
     Parque: tocar 5 veces el árbol del fondo (el de la derecha) hace caer al alvarikoke, una fruta con vida.
       Primera vez: pregunta por un trébol de 4 hojas, y como Simon no ha visto ninguno le regala el COLLAR DE LA SUERTE.
       Después, cada día puede salir un TRÉBOL DE 4 HOJAS en el parque (3% el primer día y +1% por cada día que no sale).
       Si ese día no lo recoges, se pierde y la probabilidad vuelve a 3%. Recogido, va a EXTRAS.
       Se lo llevas al alvarikoke (otros 5 toques al árbol) y te da la SEMILLA DE LA SUERTE (única, 30 días, nunca se marchita).
       La planta colocada: Cortex a veces te hace un descuento. Al cosecharla: AURA DE TRÉBOL.
     Estado en e.alv: { st: 0 sin conocer · 1 collar dado · 2 semilla dada, p: % de hoy, dia, hay: trébol en el parque hoy, tiene: trébol en el inventario, noDia: día en que le dijiste que no } */
(function () {
  const ALVC = () => (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.alvarikoke) || {};
  const ALV_TOQUES = () => ALVC().toquesRequeridos || 5, ALV_P0 = () => ALVC().probInicial || 3, ALV_SUBE = () => ALVC().probSubePorDia || 1;
  const alv = () => { const d = { st: 0, p: ALV_P0(), dia: '', hay: false, tiene: 0, noDia: '' }; if (!e.alv || typeof e.alv !== 'object') e.alv = d; else Object.keys(d).forEach(k => { if (e.alv[k] === undefined) e.alv[k] = d[k]; }); return e.alv; };
  const diasEntre = (a, b) => { const p = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d) / 864e5; }; return Math.round(p(b) - p(a)); };

  /* ---------- dibujo ---------- */
  function alvGrid(fr, triste) {   // el alvarikoke: fruta redonda con palitos de stickman gorditos y cara expresiva
    const g = Grid(22, 28), K = '#3a2418', K2 = '#4a3020';
    const miembro = (x0, y0, x1, y1, grosor) => {   // "palito" engrosado: línea central + una paralela, con la puntita redondeada
      linea(g, x0, y0, x1, y1, K);
      const dx = x1 - x0, dy = y1 - y0;
      if (Math.abs(dx) >= Math.abs(dy)) linea(g, x0, y0 + 1, x1, y1 + 1, K2); else linea(g, x0 + 1, y0, x1 + 1, y1, K2);
      bola(g, x1, y1, grosor, K);   // mano/pie: bolita sólida en la punta en vez de una esquina picuda
    };
    (fr ? [[5, 14, 1, 11], [16, 14, 21, 9]] : [[5, 14, 1, 17], [16, 14, 21, 17]]).forEach(([x0, y0, x1, y1]) => miembro(x0, y0, x1, y1, 1));   // brazos
    const pa = fr ? [[8, 21, 6, 27], [14, 21, 15, 27]] : [[8, 21, 7, 27], [14, 21, 14, 27]];
    pa.forEach(([x0, y0, x1, y1]) => miembro(x0, y0, x1, y1, 1.1));   // piernitas, un pelín más gorditas que los brazos
    capa(g, '#5a2410', L => sombrear(L, elipse(11, 14, 8, 8.5), 11, 14, 8, 8.5, ['#ffd4a8', '#ff9a5a', '#e0602a', '#a83a18']));
    [[7, 8], [8, 7], [8, 8], [9, 7]].forEach(([x, y]) => g.set(x, y, '#ffe8c8'));   // brillo satinado arriba a la izquierda de la fruta
    // tallito curvo con dos hojitas de dos tonos y una venita central
    g.rect(11, 4, 1, 3, '#6a4020'); g.set(12, 3, '#6a4020');
    bola(g, 9, 3, 2.1, '#2f9a4a'); bola(g, 14, 2, 1.8, '#4ab860');
    g.set(9, 3, '#4ab860'); g.set(14, 2, '#6ad070'); g.set(8, 2, '#6ad070');
    const ey = 12;   // ---- ojos redondos con brillo (antes eran rectángulos planos) ----
    [8, 14].forEach(ex => { capa(g, K, L => { bola(L, ex, ey + 1, 1.3, K); }); g.set(ex - 1, ey, '#ffffff'); });
    if (triste) {
      g.art(9, 17, ['...kkk.', '..k...k'], { k: K });
      [[7, 14], [13, 14]].forEach(([x, y]) => { g.set(x, y, '#7ad4ff'); g.set(x, y + 1, '#9ae0ff'); g.set(x, y + 2, '#bdeeff'); });   // lagrimitas con degradado
      g.rect(7, ey - 2, 3, 1, K); g.rect(14, ey - 2, 3, 1, K);
    }
    else { linea(g, 9, 17, 12, 18, K); linea(g, 12, 18, 15, 17, K); g.set(10, 17, K); g.set(13, 17, K); g.rect(10, 18, 4, 1, '#7a2a1a'); }   // sonrisa curva con un toque de "boca abierta" rosada
    [[5, 15], [6, 16], [16, 15], [17, 16]].forEach(([x, y]) => g.set(x, y, '#ff8a8a'));   // cachetes redonditos (antes 2 pixeles planos)
    g.set(6, 15, '#ffaaaa'); g.set(16, 16, '#ffaaaa');
    return g;
  }
  function trebolGrid(fr) {   // trébol de 4 hojas con los bordes dorados
    const g = Grid(13, 15), cx = 6, cy = 6;
    capa(g, '#e8b82a', L => {
      [[-2, -2], [2, -2], [-2, 2], [2, 2]].forEach(([dx, dy]) => { bola(L, cx + dx, cy + dy, 2, '#3ac860'); });
    });
    [[-2, -3], [2, -3], [-3, 1], [3, 1]].forEach(([dx, dy]) => g.set(cx + dx, cy + dy, '#9af0a8'));   // brillos de las hojas
    g.rect(cx - 1, cy - 1, 3, 3, '#2a9a4a'); g.set(cx, cy, '#ffe68a');
    for (let y = 9; y < 14; y++) g.set(cx + (y > 11 ? 1 : 0), y, '#2a8a40');   // tallito
    if ((fr || 0) % 24 < 8) { g.set(1, 1, '#fff6b0'); g.set(0, 1, '#ffe45a'); g.set(2, 1, '#ffe45a'); g.set(1, 0, '#ffe45a'); g.set(1, 2, '#ffe45a'); }
    return g;
  }
  const trebolPeq = (() => { let c = null; return () => c || (c = (() => { const g = Grid(9, 9); capa(g, '#e8b82a', L => { [[-2, -2], [2, -2], [-2, 2], [2, 2]].forEach(([dx, dy]) => bola(L, 4 + dx, 4 + dy, 1, '#3ac860')); L.rect(3, 3, 3, 3, '#3ac860'); }); g.set(4, 4, '#ffe68a'); return g; })()); })();
  const trebolAura = (() => { let c = null; return () => c || (c = (() => { const g = Grid(12, 12); capa(g, '#e8b82a', L => { [[-3, -3], [3, -3], [-3, 3], [3, 3]].forEach(([dx, dy]) => bola(L, 5 + dx + 1, 5 + dy + 1, 2, '#3ac860')); L.rect(4, 4, 4, 4, '#3ac860'); }); g.set(5, 5, '#ffe68a'); g.set(6, 6, '#ffe68a'); g.set(3, 2, '#9af0a8'); g.set(8, 2, '#9af0a8'); return g; })()); })();
  function trebolMini() { const g = Grid(7, 7); [[1, 1], [4, 1], [1, 4], [4, 4]].forEach(([x, y]) => g.rect(x, y, 2, 2, '#3ac860')); g.rect(2, 2, 3, 3, '#3ac860'); g.set(3, 3, '#ffe68a'); g.contour('#e8b82a'); return g; }
  function plantaSuerte(g, cx, dy, etapa, fr) {   // la planta única: trébol de 4 hojas con bordes dorados
    if (etapa === 'semilla') { capa(g, '#7a5a08', L => { bola(L, cx, dy - 3, 2, '#ffd84a'); L.set(cx, dy - 4, '#ffffff'); }); return; }
    if (etapa === 'brote') { capa(g, '#e8b82a', L => { for (let t = 0; t < 8; t++) L.set(cx, dy - 1 - t, '#2a9a4a'); bola(L, cx - 3, dy - 9, 2, '#3ac860'); bola(L, cx + 3, dy - 9, 2, '#3ac860'); }); return; }
    const fy = dy - 16, f = (fr || 0) % 24;
    for (let t = 0; t < 14; t++) g.set(cx + (t > 8 ? 1 : 0), dy - 1 - t, t < 4 ? '#1d6a38' : '#2a9a4a');   // tallo
    capa(g, '#e8b82a', L => {   // hojas grandes con borde dorado
      [[-3, -3], [3, -3], [-3, 3], [3, 3]].forEach(([dx, dyy]) => bola(L, cx + dx, fy + dyy, 3, '#3ac860'));
      L.rect(cx - 2, fy - 2, 5, 5, '#3ac860');
    });
    [[-4, -4], [3, -4], [-4, 2], [4, 3]].forEach(([dx, dyy]) => g.set(cx + dx, fy + dyy, '#9af0a8'));
    g.rect(cx - 1, fy - 1, 3, 3, '#2a9a4a'); g.set(cx, fy, '#ffe68a');
    [[-8, -7], [8, -6], [-9, 3], [9, 4], [0, -10]].forEach(([dx, dyy], i) => { const ph = (f + i * 5) % 24; if (ph < 8) { g.set(cx + dx, fy + dyy, '#ffffff'); g.set(cx + dx - 1, fy + dyy, '#ffe45a'); g.set(cx + dx + 1, fy + dyy, '#ffe45a'); g.set(cx + dx, fy + dyy - 1, '#ffe45a'); g.set(cx + dx, fy + dyy + 1, '#ffe45a'); } });
  }
  function semillaSuerteGrid() {   // sobrecito verde con el trébol de bordes dorados
    const g = Grid(14, 16);
    g.rect(1, 3, 12, 12, '#1d5a34'); g.rect(1, 3, 12, 1, '#2f9a4a'); g.rect(1, 3, 1, 12, '#2f9a4a'); g.rect(11, 3, 2, 12, '#0e3a20'); g.rect(1, 14, 12, 1, '#0e3a20');
    g.rect(2, 0, 10, 5, '#d8a020'); g.rect(3, 1, 8, 3, '#8a6a10');
    [[4, 7], [7, 7], [4, 10], [7, 10]].forEach(([x, y]) => g.rect(x, y, 3, 3, '#3ac860')); g.rect(6, 9, 2, 2, '#ffe68a');
    g.rect(3, 6, 8, 1, '#ffd84a'); g.rect(3, 13, 8, 1, '#ffd84a');
    return g;
  }
  window.semillaSuerteGrid = semillaSuerteGrid; window.plantaSuerte = plantaSuerte; window.trebolMini = trebolMini; window.trebolGrid = trebolGrid; window.alvGrid = alvGrid;

  /* ---------- objetos: collar, aura, semilla ---------- */
  ITEMS.collar_suerte = { tipo: 'ropa', slot: 'cuello', n: 'COLLAR DE LA SUERTE', p: 0, nv: 1, crop: [8, 42, 44, 36], secreto: true, codigo: true };
  ITEMS.aura_trebol = { tipo: 'ropa', slot: 'aura', n: 'AURA DE TRÉBOL', p: 0, nv: 1, crop: [0, 0, 56, 78], secreto: true, codigo: true };
  ACC2.collar_suerte = g => {
    for (let x = 16; x <= 40; x += 2) { const y = arcoCuello(x, 56, 6); g.rect(x, y, 2, 1, (x / 2) % 2 ? '#ffd84a' : '#d8a020'); g.set(x, y, '#fff6b0'); }
    const T = trebolPeq(); g.paste(T, 24, 59); g.set(28, 68, '#2a8a40');
  };
  ACC2.aura_trebol = (g, fr) => {   // hojitas de trébol dorado cayendo despacio alrededor de Simon
    const f = fr || 0, T = trebolAura();
    [[1, 0], [44, 7], [8, 5], [38, 2], [0, 9], [46, 3], [22, 11]].forEach(([x0, off], i) => {
      const y = Math.round(((f / 40) * 70 + i * 12 + off * 3) % 70), x = x0 + Math.round(Math.sin(f / 40 * Math.PI * 2 + i * 1.7) * 2);
      g.paste(T, x, y);
    });
    [[12, 2], [43, 4], [4, 40], [51, 36]].forEach(([x, y], i) => { if ((f + i * 9) % 40 < 8) g.set(x, y, '#fff6b0'); });
  };
  SEMILLAS.suerte = { n: 'Trébol de la Suerte', rareza: 'Única', diasCrecer: 30, diasVida: 999999, efecto: 'Nunca se marchita. Colocada, a veces Cortex te hace un descuento (se nota con un trébol). Al cosecharla te da el Aura de Trébol.', precio: 0, col: '#ffd84a', planta: plantaSuerte, exclusivo: true };

  /* ---------- estado y probabilidad diaria ---------- */
  function alvDia() {   // tira el dado de cada día que pasó: si salió y nadie lo recogió, se perdió y la probabilidad vuelve a empezar
    const a = alv(); if (a.st !== 1 || a.tiene) return a;
    const h = hoy(); if (a.dia === h) return a;
    let n = a.dia ? Math.min(400, diasEntre(a.dia, h)) : 1; if (n <= 0) { a.dia = h; return a; }
    for (let i = 0; i < n; i++) { if (a.hay) { a.hay = false; a.p = ALV_P0(); } if (Math.random() * 100 < a.p) a.hay = true; else a.p = Math.min(100, a.p + ALV_SUBE()); }
    a.dia = h; guardar(); return a;
  }
  const trebolHoy = () => { const a = alv(); return a.st === 1 && !a.tiene && a.hay && a.dia === hoy(); };
  function trebolPos() {   // lugar fijo del día, siempre del lado IZQUIERDO del parque, sobre el pasto (fuera del camino)
    const h = hashStr('tp' + alv().dia), HY = RY + 8, y = HY + 16 + ((h >>> 3) % 46);
    const hw = 6 + (y - HY) * .42, xmax = Math.max(14, Math.floor(LW / 2 - hw - 8));   // el camino se ensancha hacia abajo
    return { x: 10 + ((h >>> 9) % Math.max(4, xmax - 9)), y };
  }

  /* ---------- escena del parque ---------- */
  let alvF = null, alvTq = { n: 0, t: 0 }, alvHojas = [];
  const arbolX = () => Math.round(LW * .74), arbolHY = () => RY + 8;
  function alvHojasSoltar(n) { const cx = arbolX(), hy = arbolHY(); for (let i = 0; i < n; i++) alvHojas.push({ x: cx + (Math.random() - .5) * 20, y: hy - 22 + Math.random() * 10, vx: (Math.random() - .5) * .5, vy: .3 + Math.random() * .5, t: 0, c: ['#4ab860', '#2f9a4a', '#6ad070'][i % 3] }); }
  function alvLlamar() {
    const a = alv();
    if (a.st >= 2) { toast('EL ÁRBOL YA NO TIENE NADA'); return; }
    if (a.st === 1 && a.noDia === hoy()) { toast('EL ALVARIKOKE SIGUE BUSCANDO. LLÁMALO MAÑANA'); sfx.no(); return; }
    const hy = arbolHY(); alvF = { x: arbolX() - 3, yg: hy + 24, y0: hy - 20, t: 0, ph: 'cae', dir: 1, triste: false }; sfx.pop(); alvHojasSoltar(10);
  }
  function alvToca(x, y) {
    if (lugar !== 'parque' || dlg || modal || ban || edit) return false;
    alvDia();
    if (trebolHoy()) { const p = trebolPos(); if (Math.abs(x - p.x) <= 10 && Math.abs(y - p.y) <= 11) { trebolRecoger(); return true; } }
    if (alvF && alvF.ph === 'espera') { if (x >= alvF.x - 3 && x <= alvF.x + 26 && y >= alvF.yg - 30 && y <= alvF.yg + 2) { alvHabla(); return true; } }
    const tx = arbolX(), hy = arbolHY();
    if (x >= tx - 14 && x <= tx + 14 && y >= hy - 32 && y <= hy + 3) {
      if (alvF || (typeof parqueOcupado === 'function' && parqueOcupado('alv'))) return true;   // un solo evento a la vez
      const ahora = Date.now(); if (ahora - alvTq.t > 2200) alvTq.n = 0; alvTq.t = ahora; alvTq.n++;
      sfx.click(); alvHojasSoltar(4);
      if (alvTq.n >= ALV_TOQUES()) { alvTq.n = 0; alvLlamar(); }
      return true;
    }
    return false;
  }
  function alvDibujar() {
    if (lugar !== 'parque') { alvF = null; return; }
    alvDia();
    if (trebolHoy()) {   // el trébol, con un destello
      const p = trebolPos(), sp = sprite('trebolP' + ((tk >> 3) % 3), () => trebolGrid((tk >> 3) % 3 * 8), 0);
      ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(p.x - 4, p.y + 8, 9, 1);
      ctx.drawImage(sp, p.x - 6, p.y - 7);
      if (esNoche()) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,230,120,.10)'; ctx.fillRect(p.x - 8, p.y - 6, 17, 15); ctx.restore(); }
    }
    if (alvF) {
      const f = alvF; f.t++;
      let y = f.yg;
      if (f.ph === 'cae') { const t = f.t; if (t <= 20) y = f.y0 + (f.yg - f.y0) * (t / 20) ** 2; else if (t <= 27) y = f.yg - Math.round(Math.sin((t - 20) / 7 * Math.PI) * 6); else if (t <= 32) y = f.yg - Math.round(Math.sin((t - 27) / 5 * Math.PI) * 2); else { f.ph = 'espera'; f.t = 0; } }
      else if (f.ph === 'espera') { y = f.yg - ((f.t >> 4) % 2); if (f.t > 1500) { f.ph = 'va'; f.t = 0; } }
      else if (f.ph === 'va') { f.x += f.triste ? .45 : .9; y = f.yg - ((f.t >> 2) % 2); if (f.x > LW + 6) { alvF = null; return; } }
      const sp = sprite('alv' + ((f.ph === 'va' ? (tk >> 2) : 0) % 2) + (f.triste ? 't' : ''), () => alvGrid((f.ph === 'va' ? (tk >> 2) : 0) % 2, f.triste), 0);
      ctx.fillStyle = 'rgba(30,12,40,.28)'; ctx.fillRect(Math.round(f.x) + 3, f.yg + 1, 16, 1);
      ctx.drawImage(sp, Math.round(f.x), Math.round(y) - 27);
      if (f.ph === 'espera' && (tk >> 3) % 2) { ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(f.x) + 24, Math.round(y) - 26, 1, 3); ctx.fillRect(Math.round(f.x) + 23, Math.round(y) - 25, 3, 1); }   // destello: toca al alvarikoke
    }
    alvHojas = alvHojas.filter(h => h.t < 40);
    alvHojas.forEach(h => { h.t++; h.x += h.vx + Math.sin(h.t / 5) * .3; h.y += h.vy; ctx.globalAlpha = Math.max(0, 1 - h.t / 40); ctx.fillStyle = h.c; ctx.fillRect(Math.round(h.x), Math.round(h.y), 2, 1); ctx.fillRect(Math.round(h.x) + 1, Math.round(h.y) + 1, 1, 1); ctx.globalAlpha = 1; });
  }
  function alvVa(triste) { if (alvF) { alvF.ph = 'va'; alvF.t = 0; alvF.triste = !!triste; } }

  /* ---------- el trébol ---------- */
  function trebolRecoger() {
    const a = alv(); if (!trebolHoy()) return;
    a.tiene = 1; a.hay = false; a.p = ALV_P0(); guardar(); estrellas(10); sfx.regalo();
    fanfare({ g: () => trebolGrid(0), t: '¡TRÉBOL DE 4 HOJAS!', d: 'LO GUARDASTE EN EXTRAS. ¡LLÉVASELO AL ALVARIKOKE! (5 TOQUES AL ÁRBOL)', mudo: true }, () => { pintar(); });
  }

  /* ---------- diálogos ---------- */
  const A = t => ({ q: 'ALVARIKOKE', t }), TT = t => ({ q: 'TRADUCTOR', t: '«' + t + '»' });
  function darCollar() { e.tiene.collar_suerte = 1; e.ropa.cuello = 'collar_suerte'; const a = alv(); a.st = 1; a.p = ALV_P0(); a.dia = hoy(); a.hay = false; guardar(); pintar(); }
  function darSemilla() { const a = alv(); a.tiene = 0; a.st = 2; e.semillas.suerte = (e.semillas.suerte || 0) + 1; guardar(); pintar(); }
  function alvHabla() {
    const a = alv(); if (!alvF || dlg) return; sfx.click();
    if (a.st === 0) {
      dialogo([
        A('¡Auch! ¡Me caí del árbol otra vez!'), A('¡Hola! Soy un alvarikoke. Sí, camino. Sí, hablo. No, no me comas.'),
        { q: 'ALVARIKOKE', t: 'Oye... ¿no habrás visto por ahí un trébol de 4 hojas?', op: ['NO, NO HE VISTO NINGUNO', 'NO SÉ NI QUÉ ES ESO'], res: [[TT('No he visto ninguno.'), A('Ya veo... nadie ha visto uno.')], [TT('¿Qué es un trébol?'), A('Una plantita con 4 hojitas. Da suerte. Pero ya veo que tú no has visto ninguna...')]] },
        A('Bueno... te regalo este collar.'), { q: 'ALVARIKOKE', t: 'No es lo mismo, pero tal vez te traiga suerte.' },
        { q: 'ALVARIKOKE', t: '', fan: { g: () => prevGrid('collar_suerte'), t: 'COLLAR DE LA SUERTE', d: 'TRÉBOL DORADO. YA LO TIENE PUESTO.' }, fn: darCollar },
        A('Si ves un trébol de 4 hojas, ¡dímelo! Toca el árbol 5 veces y bajo.'), A('¡Adiós, Simon!')
      ], () => alvVa(false));
    } else if (a.st === 1) {
      const si = !!a.tiene;
      dialogo([
        A('¡Hola otra vez, Simon!'),
        { q: 'ALVARIKOKE', t: '¿Encontraste un trébol de 4 hojas?', op: si ? ['SÍ, AQUÍ ESTÁ', 'TODAVÍA NO'] : ['TODAVÍA NO'],
          res: si ? [[TT('¡Encontré uno!'), A('¡¿QUÉ?! ¡¿Un trébol de 4 hojas?! ¡Dámelo, dámelo!'), TT('*se lo da*'), A('¡Es hermoso! ¡Gracias, gracias, gracias!'), A('Toma, esto es para ti: una semilla de la suerte.'),
            { q: 'ALVARIKOKE', t: '', fan: { g: () => semillaSuerteGrid(), t: 'SEMILLA DE LA SUERTE', d: 'UNA SOLA EN EL MUNDO. SIÉMBRALA EN EL JARDÍN: TARDA 30 DÍAS.' }, fn: darSemilla }, A('Riégala todos los días y nunca se marchitará. ¡Adiós, Simon!')], [TT('Todavía no.'), A('Oh... *snif*'), A('Seguiré buscando. Llámame mañana otra vez.')]]
            : [[TT('Todavía no.'), A('Oh... *snif*'), A('Seguiré buscando. Llámame mañana otra vez.')]] }
      ], () => { if (alv().st === 2) alvVa(false); else { alv().noDia = hoy(); guardar(); alvVa(true); } });
    } else alvVa(false);
  }
  Object.defineProperty(window, 'alvF', { get: () => alvF, set: v => { alvF = v; }, configurable: true }); Object.defineProperty(window, 'alvTq', { get: () => alvTq, configurable: true });   // (las pruebas los leen)
  window.trebolHoy = trebolHoy; window.trebolPos = trebolPos; window.alvVa = alvVa; window.trebolRecoger = trebolRecoger;
  window.alvToca = alvToca; window.alvDibujar = alvDibujar; window.alvDia = alvDia; window.alvEstado = alv;
})();
