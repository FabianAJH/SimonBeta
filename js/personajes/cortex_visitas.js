  /* ===================== CORTEX, TRADUCTOR Y VISITAS ===================== */
  // Cortex: mismo estilo que Simon (cabezón, sombreado, contorno), con tu look: pelo negro con mechas rojas, chaleco rojo, alas y la corona de siempre
  const temporada = () => { if (admin && admTemp) return admTemp === 'none' ? null : admTemp; const d = new Date(ahora()), m = d.getMonth() + 1, dd = d.getDate(); return (m === 10 || (m === 11 && dd <= 2)) ? 'hal' : (m === 12 || (m === 1 && dd <= 6)) ? 'nav' : (m === 2 && dd >= 7 && dd <= 14) ? 'val' : null; };
  function cortexGrid(merc, temp, hol, dor) {
    const g = Grid(52, 76), al = Grid(60, 76);
    const BRONCE = ['#f0c088', '#c8884a', '#8a5424', '#4a2a10'], NARANJA = ['#ffc060', '#ff8a20', '#c85a10', '#6a2a08'], ROSA = ['#ffc0e0', '#ff7ab8', '#d04888', '#802858'];
    const NEGRO = ['#4a4458', '#2a2636', '#171420', '#0c0a12'], ROJOP = ['#ff6a78', '#d02838', '#8a1424', '#4a0a14'], OJO = ['#ff7080', '#d02030', '#8a1020', '#4a0810'];
    // alas: negras con borde rojo
    capa(al, '#e03040', L => [-1, 1].forEach(sg => [[28, 8, 11], [29, 24, 11], [27, 40, 9], [22, 54, 7]].forEach(([dx, ty, w]) => {
      const bx = 30 + sg * 12, by = 52, tx = 30 + sg * dx, n = Math.max(Math.abs(tx - bx), Math.abs(ty - by));
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = bx + (tx - bx) * t, y = by + (ty - by) * t, r = (1 - t) * w / 2 + .6;
        for (let yy = -Math.ceil(r); yy <= Math.ceil(r); yy++) for (let xx = -Math.ceil(r); xx <= Math.ceil(r); xx++) if (xx * xx + yy * yy <= r * r) L.set(Math.round(x + xx), Math.round(y + yy), NEGRO[2]);
      }
    })));
    if (merc) {   // comerciante: mochila y manta enrollada
      capa(g, '#2a1408', L => sombrear(L, elipse(26, 47, 23, 9), 26, 47, 23, 9, BRONCE));
      capa(g, '#4a2a10', L => { L.rect(2, 36, 48, 5, '#e0cc98'); [6, 12, 18, 24, 30, 36, 42, 47].forEach(x => L.rect(x, 36, 1, 5, '#a88858')); L.rect(2, 36, 48, 1, '#f4e8c0'); });
    }
    // piernas: pantalón rojo ancho con franjas negras
    [[10, 24], [28, 42]].forEach(([x0, x1]) => capa(g, '#2a0610', L => {
      sombrear(L, (x, y) => y >= 59 && y <= 73 && x >= x0 - (y - 59) * .1 && x <= x1 + (y - 59) * .1, (x0 + x1 + 1) / 2, 66, 8, 9, ROJOP);
      [64, 69].forEach(y => L.rect(x0 - 1, y, x1 - x0 + 3, 1, NEGRO[2]));
    }));
    // tenis blancos con raya roja
    [17.5, 34.5].forEach(cx => { capa(g, '#2a2636', L => sombrear(L, elipse(cx, 73.5, 9, 3), cx, 73.5, 9, 3, R.piel)); g.rect(Math.round(cx) - 6, 73, 12, 1, '#e8353f'); });
    // camisa blanca con un detalle chico
    capa(g, '#aab0c8', L => { L.rect(17, 45, 18, 16, '#f4f6fb'); L.rect(17, 45, 18, 2, '#e4e8f4'); });
    // emblema: un rombo rojo chico en el pecho (o el de temporada)
    if (!merc && temp === 'hal') g.art(21, 50, [".....g.....", ".ooooooooo.", "oookooookoo", "ooooooooooo", "ookokokokoo", ".ooooooooo."], { o: '#ff8a20', k: '#1a1020', g: '#2f9a4a' });
    else if (!merc && temp === 'nav') { g.art(21, 50, [".....y.....", "....ggg....", "...ggrgg...", "..gggggyg..", ".ggygggggg.", ".....b....."], { y: '#ffe45a', g: '#2fb85a', r: '#ff4a5a', b: '#8a5424' }); }
    else if (!merc && temp === 'val') { g.art(21, 50, [".rrr...rrr.", "rrrrrrrrrrr", "rrrrrrrrrrr", ".rrrrrrrrr.", "..rrrrrrr..", ".....r....."], { r: '#ff5a8a' }); g.set(22, 51, '#ffc0d8'); }
    else { g.set(25, 51, '#ff6a78'); g.set(26, 51, '#ff6a78'); [[25, 50], [26, 50], [24, 51], [27, 51], [25, 52], [26, 52]].forEach(([x, y]) => g.set(x, y, '#d02838')); }
    g.rect(17, 58, 18, 1, '#c8ccdc');
    // chaleco rojo acolchado
    const VEST = merc ? BRONCE : temp === 'hal' ? NARANJA : temp === 'val' ? ROSA : ROJOP;
    [[8, 16], [36, 44]].forEach(([a, b]) => capa(g, merc ? '#2a1408' : temp === 'hal' ? '#3a1a04' : temp === 'val' ? '#4a1030' : '#3a0610', L => {
      sombrear(L, (x, y) => x >= a && x <= b && y >= 44 && y <= 62, (a + b + 1) / 2, 53, 5, 12, VEST);
      [49, 54, 59].forEach(y => L.rect(a, y, b - a + 1, 1, VEST[3]));
      if (!merc && temp === 'nav') L.rect(a, 60, b - a + 1, 2, '#ffffff');
    }));
    if (merc) {
      [[12, 14], [38, 40]].forEach(([a]) => { g.rect(a, 44, 3, 15, '#6a3a14'); g.rect(a, 44, 1, 15, '#8a5424'); g.rect(a, 50, 3, 3, '#ffd84a'); g.set(a + 1, 51, '#8a5a10'); });
      capa(g, '#2a1408', L => sombrear(L, elipse(37.5, 62, 4, 3.6), 37.5, 62, 4, 3.6, BRONCE));
      g.rect(36, 57, 3, 2, '#d8a020'); g.set(37, 62, '#ffd84a'); g.set(38, 62, '#ffd84a'); g.set(37, 61, '#fff6b0');
    }
    // mangas blancas con tribales y manos
    [[1, 7], [45, 51]].forEach(([a, b]) => {
      capa(g, '#2a2636', L => {
        L.rect(a, 46, b - a + 1, 16, '#ececf2');
        for (let y = 47; y < 62; y += 2) for (let x = a; x <= b; x++) if ((x + y / 2) % 3 === 0) L.set(x, y, '#16121e');
      });
      capa(g, TINTA, L => L.rect(a + 1, 62, b - a - 1, 3, R.piel[1]));
    });
    // cuello de pelo
    if (merc) { g.rect(19, 45, 14, 3, '#ffd84a'); g.rect(19, 46, 14, 1, '#d8a020'); [20, 24, 28, 32].forEach(x => g.set(x, 48, '#ffd84a')); }
    else if (temp === 'hal') { g.rect(19, 45, 14, 3, '#7a3ac8'); g.rect(19, 46, 14, 1, '#4a1a88'); [20, 24, 28, 32].forEach(x => g.set(x, 48, '#7a3ac8')); }
    else if (temp === 'nav') { g.rect(18, 45, 16, 3, '#ffffff'); g.rect(18, 47, 16, 1, '#d8dcec'); [19, 22, 25, 28, 31].forEach(x => g.set(x, 48, '#ffffff')); }
    else if (temp === 'val') { g.rect(19, 45, 14, 3, '#ff7ab8'); g.rect(19, 46, 14, 1, '#d04888'); }
    else { g.rect(19, 45, 14, 2, '#f0f2fb'); g.rect(19, 46, 14, 1, '#b8c0e8'); g.rect(24, 47, 4, 1, '#b8c0e8'); }
    // cabeza grande y pálida
    capa(g, TINTA, L => sombrear(L, elipse(26, 30, 21, 16), 26, 30, 21, 16, R.piel));
    // pelo negro corto y despeinado, flequillo ladeado que deja ver la frente, con un toque de mechas rojas
    capa(g, '#08060c', L => {
      const dom = elipse(26, 22, 22, 12), sal = [0, 2, 1, 3, 0, 2, 1, 3];
      const borde = x => 19 + Math.max(0, Math.min(4, Math.round((x - 12) / 28 * 4))) + sal[x % 8] * (x > 14 ? .6 : .3);
      sombrear(L, (x, y) => dom(x, y) && (y <= 19 || (x >= 8 && x <= 44 && y <= borde(x))), 26, 20, 22, 12, NEGRO);
      L.rect(6, 20, 3, 6, NEGRO[1]); L.rect(43, 20, 3, 6, NEGRO[1]);
      [[11, 11], [15, 9], [20, 8], [32, 8], [37, 9], [41, 11]].forEach(([x, y]) => L.rect(x, y, 4, 3, NEGRO[1]));
      [[30, 11], [31, 12], [31, 13], [36, 14], [37, 15], [21, 19], [21, 20], [34, 20], [35, 21], [39, 21], [15, 14], [16, 15]]
        .forEach(([x, y]) => { if (L.has(x, y)) { L.set(x, y, '#e03040'); L.set(x, y + 1, '#e03040'); } });
    });
    // ojos grandes y amables, sonrisa abierta y mejillas rosadas
    [17, 35].forEach(cx => {
      if (dor) { g.rect(cx - 4, 33, 2, 1, '#2a1018'); g.rect(cx - 2, 34, 5, 1, '#2a1018'); g.rect(cx + 3, 33, 2, 1, '#2a1018'); g.rect(cx - 4, 35, 1, 1, '#2a1018'); g.rect(cx + 4, 35, 1, 1, '#2a1018'); return; }
      capa(g, null, L => sombrear(L, elipse(cx, 33, 4.4, 4.8), cx, 33, 4.4, 4.8, OJO));
      g.rect(cx - 1, 32, 3, 4, '#1a0a10');
      g.rect(cx - 3, 29, 2, 2, '#ffffff'); g.set(cx + 1, 36, '#ffd0d6');
    });
    for (let y = 40; y <= 43; y++) for (let x = 22 + (y - 40); x <= 30 - (y - 40); x++) g.set(x, y, y === 40 ? TINTA : '#4a1020');
    g.rect(25, 42, 3, 1, '#e0607a'); g.rect(25, 43, 3, 1, TINTA);
    g.rect(10, 38, 5, 3, '#ffa0b6'); g.rect(37, 38, 5, 3, '#ffa0b6');
    // la corona, igual que la de Simon
    const cg = Grid(SW, SH); dibujarCorona(cg);
    for (let y = 0; y < 12; y++) for (let x = 17; x < 39; x++) { const a = (y * SW + x) * 4; if (cg.d[a + 3]) g.set(x - 2, y + 2, [cg.d[a], cg.d[a + 1], cg.d[a + 2], 255]); }
    const out = Grid(60, 76); out.paste(al); out.paste(g, 4, 0);
    if (hol === 'crema') cremar(out); else if (hol) hollinar(out);
    return out;
  }
  // crema: manchones de betún sobre Cortex (bomba pastel)
  function cremar(o) {
    [[18, 26, 4], [38, 22, 5], [30, 13, 3], [24, 40, 4], [44, 35, 3], [30, 52, 5], [14, 47, 3], [48, 49, 4], [10, 31, 3], [34, 30, 3]].forEach(([cx, cy, r]) => {
      for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) {
        if (x < 0 || y < 0 || x >= o.w || y >= o.h) continue; const i = (y * o.w + x) * 4; if (!o.d[i + 3]) continue;
        const d2 = (x - cx) ** 2 + (y - cy) ** 2; if (d2 <= r * r) o.set(x, y, d2 > (r - 1) * (r - 1) ? '#ffc8d8' : '#fff6ea');
      }
      for (let k = 0; k < r + 2; k++) { const i = ((cy + r + k) * o.w + cx) * 4; if (cy + r + k < o.h && o.d[i + 3]) o.set(cx, cy + r + k, '#fff6ea'); }
    });
  }
  // hollín: cara y ropa ennegrecidas (los ojos quedan blancos) y pelo parado
  function hollinar(o) {
    for (let y = 0; y < o.h; y++) for (let x = 0; x < o.w; x++) {
      const i = (y * o.w + x) * 4; if (!o.d[i + 3]) continue;
      const r = o.d[i], gg = o.d[i + 1], b = o.d[i + 2], blanco = r > 235 && gg > 235 && b > 235;
      const cara = ((x - 30) / 22) ** 2 + ((y - 30) / 17) ** 2 <= 1;
      if (cara) { if (blanco) continue; if (r > 140 && gg > 100 && b > 80) { const v = Math.round(40 + (r + gg + b) / 3 * .2); o.d[i] = v; o.d[i + 1] = v - 2; o.d[i + 2] = v + 6; } }
      else { o.d[i] = Math.round(r * .62); o.d[i + 1] = Math.round(gg * .62); o.d[i + 2] = Math.round(b * .66); }
    }
    const pico = (bx, by, dx, len) => { for (let k = 0; k < len; k++) { const cx = bx + dx * k / len, w = k < len * .4 ? 3 : k < len * .75 ? 2 : 1, px = Math.round(cx - w / 2); o.rect(px, by - k, w, 1, '#0c0a12'); o.set(px, by - k, '#3a3446'); } };
    [[12, 17, -4, 10], [17, 12, -3, 11], [8, 22, -5, 8], [43, 12, 3, 11], [48, 17, 4, 10], [52, 22, 5, 8], [21, 9, -1, 6], [39, 9, 1, 6]].forEach(a => pico(...a));
  }
  // (CHARLAS definido en dialogos.js)
  // (TIPS definido en dialogos.js)
  // (TRAD definido en dialogos.js)
  function traducir(c) {
    const n = [];
    if (e.hambre < 30) n.push('¡Quiero keke!');
    if (e.energia < 25) n.push('Tengo sueño...');
    if (e.feliz < 30) n.push('Estoy triste. ¿Jugamos?');
    if (n.length && c !== 'comer' && c !== 'jugar' && c !== 'dice') return n[0];
    const l = TRAD[c] || TRAD.otro; return l[Math.floor(Math.random() * l.length)].replace('{n}', e.nombre || 'amigo');
  }
  // cuadro de diálogo estilo RPG
  function iconoTrad() {
    const g = Grid(12, 13), col = { k: '#232b63', w: '#cfd6ff', g: '#4cd964', d: '#1d7236', r: '#e8353f', y: '#ffd84a', b: '#5b6cf0' };
    ['.........y..', '.........k..', '.kkkkkkkkkk.', 'kwwwwwwwwwwk', 'kwkkkkkkkkwk', 'kwkggggggkwk', 'kwkgdgdgdkwk', 'kwkggggggkwk', 'kwkkkkkkkkwk', 'kwwwwwwwwwwk', 'kwrwwyywwbwk', 'kwwwwwwwwwwk', '.kkkkkkkkkk.']
      .forEach((f, y) => [...f].forEach((ch, x) => { if (col[ch]) g.set(x, y, col[ch]); }));
    return g;
  }
  const estAhora = () => ({ oj: !e.dormido && e.energia < 30 ? 1 : 0, fl: e.hambre < 12 ? 2 : e.hambre < 30 ? 1 : 0, tri: e.feliz < 12 ? 2 : e.feliz < 30 ? 1 : 0, en: e.enf ? 1 : 0, l: 0 });
  function dialogo(lineas, fin) {
    dlg = { l: lineas, i: 0, pos: 0, fin }; $('dlg').classList.add('on'); lineaDlg();
  }
  function lineaDlg() {
    const L = dlg.l[dlg.i]; dlg.pos = 0; dlg.opOn = false; $('dlg-op').style.display = 'none'; $('dlg-f').style.display = ''; if (L.pre) L.pre();
    if (L.t && L.t.includes('{n}')) L.t = L.t.replace(/\{n\}/g, nombreJ());
    if (L.fan) { $('dlg').classList.remove('on'); if (L.fn) L.fn(); fanfare(L.fan, () => { if (!dlg) return; $('dlg').classList.add('on'); sigDlg(); }); return; }
    $('dlg-n').textContent = L.q === 'TU' ? quitaAc(nombreJ()).toUpperCase() : L.q; $('dlg-n').className = L.q; $('dlg-t').textContent = '';
    const pc = $('dlg-p'), px = pc.getContext('2d'); px.imageSmoothingEnabled = false; px.clearRect(0, 0, 76, 80);
    let con = false;
    if (L.q === 'CORTEX') { const kc = cortexClave(); sprite(kc, () => cortexG(), 0); px.drawImage(gridCanvas(recorte(gridCache[kc], 7, 0, 46, 49)), 0, 0, 76, 80); con = true; }
    else if (L.q === 'SIMON') { const es = estAhora(); px.drawImage(gridCanvas(recorte(simonGrid('a', (es.tri && !/^[¡]/.test(L.t)) ? 'n' : 's', e.ropa, es, false, e.ropa.aura ? tk % 40 : 0), 3, 0, 50, 53)), 0, 0, 76, 80); con = true; }
    else if (L.q === 'SIF' || L.q === 'PERRO') { px.drawImage(gridCanvas(sifGrid({ boca: 'b', cola: 0 })), 0, 0, 76, 80); con = true; }
    else if (L.q === 'ALVARIKOKE' && typeof alvGrid === 'function') { px.drawImage(gridCanvas(alvGrid(0, false)), 8, 1, 60, 78); con = true; }
    else if ((L.q === 'CHICA' || L.q === 'MEJI') && typeof chicaGrid === 'function') { px.drawImage(gridCanvas(recorte(chicaGrid(0), 0, 0, 40, 46)), 8, 2, 60, 69); con = true; }
    else if (L.q === 'TRADUCTOR') { px.drawImage(sprite('ic_trad', iconoTrad, 0), 16, 15, 44, 48); con = true; }
    pc.style.background = L.q === 'TRADUCTOR' ? '#1d5a34' : '';
    $('dlg-t').className = L.q === 'TRADUCTOR' ? 'trd' : '';
    $('dlg-box').classList.toggle('conp', con);
    if (L.fn) L.fn();
  }
  function dlgOps(L) {
    if (dlg.opOn) return; dlg.opOn = true; const c = $('dlg-op'); c.innerHTML = ''; c.style.display = 'flex'; $('dlg-f').style.display = 'none';
    L.op.forEach((t, k) => {
      const b = document.createElement('button'); b.className = 'bt ok'; b.textContent = t;
      b.addEventListener('pointerdown', ev => { ev.stopPropagation(); ev.preventDefault(); if (!dlg || !dlg.opOn) return; audio(); sfx.click(); const r = (L.res && L.res[k]) || []; dlg.l.splice(dlg.i + 1, 0, ...r); L.op = null; dlg.opOn = false; c.style.display = 'none'; avanzarDlg(); });
      c.appendChild(b);
    });
  }
  function avanzarDlg() {
    if (!dlg) return;
    const L = dlg.l[dlg.i];
    if (dlg.pos < L.t.length) { dlg.pos = L.t.length; $('dlg-t').textContent = L.t; if (L.op) dlgOps(L); return; }
    if (L.op) { if (!dlg.opOn) dlgOps(L); return; }
    sfx.click();
    sigDlg();
  }
  function sigDlg() { if (++dlg.i >= dlg.l.length) { const f = dlg.fin; dlg = null; $('dlg').classList.remove('on'); if (f) f(); if (celQ.length) celebraCheck(); } else lineaDlg(); }
  const nombreJ = () => e.nombre || 'amigo';
  const quitaAc = t => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  var fanOn = false;
  function fanfare(o, cb) {
    if (fanOn) return; fanOn = true;
    const F = $('fanfare'), src = o.c ? o.c() : gridCanvas(o.g()), cv = $('fan-c'); cv.width = src.width; cv.height = src.height; const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.clearRect(0, 0, cv.width, cv.height); x.drawImage(src, 0, 0);
    $('fan-t').textContent = ''; $('fan-d').textContent = ''; $('fan-ok').classList.remove('on');
    F.classList.remove('on'); void F.offsetWidth; F.classList.add('on');
    let listo = false; const tm = [];
    if (!o.mudo) tm.push(setTimeout(() => sfx.regalo(), 250));
    tm.push(setTimeout(() => { estrellas(16); }, 1150));
    tm.push(setTimeout(() => { let i = 0; const t = o.t; const iv = setInterval(() => { $('fan-t').textContent = t.slice(0, ++i); if (i >= t.length) { clearInterval(iv); $('fan-d').textContent = o.d || ''; tm.push(setTimeout(() => { listo = true; $('fan-ok').classList.add('on'); }, 600)); } }, 45); tm.push(iv); }, 1700));
    const cierra = ev => { if (ev) { ev.preventDefault(); ev.stopPropagation(); } if (!listo) return; F.removeEventListener('pointerdown', cierra); F.classList.remove('on'); fanOn = false; audio(); sfx.click(); tm.forEach(t => { clearTimeout(t); clearInterval(t); }); if (cb) cb(); };
    F.addEventListener('pointerdown', cierra);
  }
  function pedirNombre(cb, edicion) {
    const N = $('nombre'), I = $('nom-i'), S2 = $('nom-s'); N.classList.add('on'); I.value = edicion ? (e.nombre || '') : ''; S2.textContent = 'HASTA 10 LETRAS'; S2.classList.remove('mal');
    $('nom-t').textContent = edicion ? 'CAMBIA TU NOMBRE' : '¿COMO TE LLAMAS?'; $('nom-x').style.display = edicion ? '' : 'none';
    setTimeout(() => I.focus(), 200);
    const fin = () => { N.classList.remove('on'); $('nom-ok').onclick = null; $('nom-x').onclick = null; I.onkeydown = null; I.blur(); };
    const ok = () => { const v = I.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9 ]/g, '').trim().replace(/\s+/g, ' ');
      if (!v) { sfx.no(); S2.textContent = 'ESCRIBE UN NOMBRE'; S2.classList.add('mal'); return; }
      e.nombre = v.charAt(0).toUpperCase() + v.slice(1); guardar(); audio(); sfx.regalo(); fin(); if (cb) cb(); };
    $('nom-ok').onclick = ok; $('nom-x').onclick = () => { sfx.click(); fin(); if (cb) cb(); }; I.onkeydown = ev => { if (ev.key === 'Enter') ok(); };
  }
  $('dlg').addEventListener('pointerdown', ev => { ev.preventDefault(); audio(); avanzarDlg(); });
// (C definido en dialogos.js)
// (S definido en dialogos.js)
// (T definido en dialogos.js)
  function cortexEntra(cb) {
    cortex.suave = false; cortex.v = 0; cortex.dir = 1;
    cortex.cb = () => {
      if (modal) cerrar();
      const S_ = SF();
      if (S_.f && !S_.cx && !sifP) { S_.cx = 1; guardar(); dialogo([C('Oye, Simon... ¿y ese perrito?'), C('Se parece muchísimo a un mejor amigo que tuve.'), C('Fue quien me salvó de la tristeza cuando más lo necesitaba.'), S(), T('Qué bonito, Cortex.'), C('Cuídalo mucho. Los amigos así no se encuentran todos los días.')], () => { if (cb) cb(); }); return; }
      if (cb) cb();
    };
    sfx.nivel();
  }
  function cortexSale(cb, v) { cortex.v = v || 0; cortex.dir = -1; cortex.cb = cb; }

