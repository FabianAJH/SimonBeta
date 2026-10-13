  /* ===================== LUNA DORADA → OVNI → CASCO ESPACIAL ===================== */
  // Domingos 00:00-03:00. 3 toques a la luna: baja un ovni y el amigo verde regala el casco.
  let ov = null, lunaFlash = 0, admLuna = false;
  function lunaVentana() {   // la luna dorada sale los domingos de 00:00 a 03:00, desde un minuto al azar (fijo para ese domingo) hasta las 3am
    if (admLuna) return true;
    const cfg = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.lunaDorada) || {};
    const dTarget = cfg.diaSemana !== undefined ? cfg.diaSemana : 0;
    const dProh = cfg.diaProhibido !== undefined ? cfg.diaProhibido : 15;
    const hMax = cfg.horaFin !== undefined ? cfg.horaFin : 3;
    const d = new Date(ahora()); if (d.getDay() !== dTarget || d.getDate() === dProh) return false;
    const min = d.getHours() * 60 + d.getMinutes(); if (min >= hMax * 60) return false;
    const k = 'luna|' + hoy(); let h = 7; for (let i = 0; i < k.length; i++) h = Math.imul(h ^ k.charCodeAt(i), 2654435761) >>> 0;
    return min >= h % 180;
  }
  const lunaOroT = () => lunaVentana();   // la luna dorada es visible (solo se puede tocar en la recámara)
  const lunaDorada = () => escenaId() === 'sala' && (!!ov || lunaOroT());   // visible siempre; solo es tocable si Simon aún no tiene el casco
  const ovBase = () => RY - 59 + 49;                  // suelo de la colina, visto desde la ventana
  function lunaOroGrid(v) {
    const g = Grid(60, 64), luna = elipse(36, 26, 5.5, 5.5), hueco = elipse(38.5, 24, 5, 5), halo = elipse(36, 26, 9, 9);
    for (let y = 14; y < 40; y++) for (let x = 24; x < 46; x++) {
      if (luna(x, y) && !hueco(x, y)) g.set(x, y, BAY[y & 3][x & 3] > 9 ? '#ffe066' : '#ffc02a');
      else if (v && halo(x, y) && !hueco(x, y) && (x + y) % 2 === 0) g.set(x, y, '#ffd84a');
    }
    return g;
  }
  function cohGrid() {
    const g = Grid(12, 15);
    g.art(0, 0, ['....rr......', '...rrrr.....', '..wwwwww....', '..wwbbww....', '..wbbbbw....', '..wwbbww....', '..wwwwww....', '..wwwwww....', '.rwwwwwwr...', 'rrwwwwwwrr..', 'rr.gggg.rr..', '...gggg.....'].map(r => r.slice(0, 10)), { r: '#e8353f', w: '#f4f6ff', b: '#5ab4ff', g: '#8a94b4' });
    g.rect(2, 2, 1, 6, '#c8d0e8'); g.rect(7, 2, 1, 6, '#aab4d0');
    return g;
  }
  function alienGrid(arriba) {
    const g = Grid(18, 34);
    capa(g, '#14301c', L => {
      sombrear(L, elipse(9, 12, 6.5, 7.5), 9, 10, 6.5, 7.5, ['#b8f8c0', '#6ae878', '#3ab850', '#1e8036']);
      linea(L, 6, 5, 4, 1, '#3ab850'); linea(L, 12, 5, 14, 1, '#3ab850');
    });
    g.rect(3, 0, 2, 2, '#ffe45a'); g.rect(13, 0, 2, 2, '#ffe45a');
    g.rect(5, 10, 3, 5, '#0e1a12'); g.rect(11, 10, 3, 5, '#0e1a12'); g.set(6, 11, '#ffffff'); g.set(12, 11, '#ffffff'); g.rect(8, 17, 2, 1, '#14301c');
    capa(g, '#2a2e48', L => {
      L.rect(5, 20, 8, 8, '#e8ecff'); L.rect(5, 20, 3, 8, '#c8d0f0'); L.rect(5, 25, 8, 1, '#ff5a5a');
      L.rect(6, 28, 3, 4, '#8a94b4'); L.rect(10, 28, 3, 4, '#8a94b4');
      if (arriba) { L.rect(2, 12, 2, 9, '#e8ecff'); L.rect(14, 12, 2, 9, '#e8ecff'); }
      else { L.rect(3, 21, 2, 6, '#e8ecff'); L.rect(13, 21, 2, 6, '#e8ecff'); }
    });
    if (arriba) { g.rect(2, 9, 2, 3, '#5ae06a'); g.rect(14, 9, 2, 3, '#5ae06a'); } else { g.rect(3, 27, 2, 2, '#5ae06a'); g.rect(13, 27, 2, 2, '#5ae06a'); }
    g.rect(5, 32, 4, 2, '#3a4062'); g.rect(10, 32, 4, 2, '#3a4062');
    return g;
  }
  function cascoAlGrid() {
    const g = Grid(20, 18), cx = 10, cy = 9, rx = 9.5, ry = 8.5;
    for (let y = 0; y < 18; y++) for (let x = 0; x < 20; x++) { const d = ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2; if (d <= 1 && d >= .78 && y < 15) g.set(x, y, y < 8 ? '#f4fcff' : '#bfe6ff'); }
    g.rect(2, 4, 3, 1, '#ffffff'); g.rect(2, 5, 1, 2, '#ffffff'); g.rect(1, 14, 18, 3, '#8a94b4'); g.rect(1, 14, 18, 1, '#e4ecff'); g.rect(1, 16, 18, 1, '#4a5478');
    return g;
  }
  function ovStart() {
    if (ov) return;
    lugar = null; llegada = null; if (e.hab !== 'sala') { e.hab = 'sala'; pintarNav(); }
    ov = { f: 'luz', t: 0 }; e.ovniPend = 1; guardar();
  }
  let lunaInactT = 0;
  function lunaTap() {
    lunaInactT = 0;
    e.lunaT = (e.lunaT || 0) + 1; lunaFlash = 8; const dy0 = RY - 59;
    seq([1175, 1568, 2093].slice(0, 1 + (e.lunaT % 3)), .07, 'triangle', .07);
    for (let i = 0; i < 5; i++) lanzar('estrella', OX + 31 + Math.random() * 12, dy0 + 20 + Math.random() * 12, (Math.random() - .5) * 1.2, -.4, 8 + i);
    const req = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.lunaDorada && CONFIG_EASTEREGGS.lunaDorada.toquesRequeridos) || 3;
    if (e.lunaT >= req) ovStart(); else guardar();
  }
  function sonidoAlien() {   // trino de ovni: tono con vibrato muy rápido que sube y baja, más un bip
    if (e.mudo || !audio()) return;
    const t = ac.currentTime + .02, o = ac.createOscillator(), g = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(500, t); o.frequency.exponentialRampToValueAtTime(1500, t + .35); o.frequency.exponentialRampToValueAtTime(380, t + .8);
    l.frequency.value = 22; lg.gain.value = 90; l.connect(lg); lg.connect(o.frequency);
    g.gain.setValueAtTime(.001, t); g.gain.linearRampToValueAtTime(.09, t + .08); g.gain.linearRampToValueAtTime(.001, t + .85);
    o.connect(g); g.connect(ac.destination); o.start(t); l.start(t); o.stop(t + .9); l.stop(t + .9);
    seq([1320, 990, 1480], .09, 'square', .03, .9);
  }
  function ovTick() {
    fugazTick();
    if (lunaFlash > 0) lunaFlash--;
    pelucheTick();
    if (!ov) {
      if (e.lunaT > 0 && e.lunaT < 3) {
        if (++lunaInactT > 300) { e.lunaT = 0; lunaInactT = 0; guardar(); }
      }
      return;
    }
    if (ov.f === 'espera') {
      ov.t++;
      const tMaxOv = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.lunaDorada && CONFIG_EASTEREGGS.lunaDorada.tiempoEsperaOvni) || 600;
      if (ov.t >= tMaxOv) {
        ov.f = 'seVa'; ov.t = 0; e.lunaT = 0; e.ovniPend = 0; guardar();
        toast('El cohete esperó demasiado y despegó...');
      }
      return;
    }
    if (ov.f === 'seVa') {
      ov.t++;
      if (ov.t === 1) seq([262, 330, 392, 523, 660, 880, 1175, 1568], .07, 'sawtooth', .04);
      if (ov.t >= 48) { ov = null; proxAct = tk + 60; guardar(); pintar(); }
      return;
    }
    if (ov.f === 'habla' || ov.f === 'premio') return;
    if (escenaId() !== 'sala') return;                       // si se va de la sala, el evento espera
    ov.t++;
    if (ov.f === 'luz') {
      if (ov.t === 1) { if (e.dormido) { e.dormido = false; sfx.despertar(); } act = null; proxAct = tk + 99999; }
      if (ov.t >= 24) { ov.f = 'baja'; ov.t = 0; seq([1047, 880, 740, 622, 523, 440, 370, 311], .1, 'sawtooth', .035); }
    } else if (ov.f === 'baja') {
      if (ov.t >= 55) { ov.f = 'espera'; ov.t = 0; sfx.click(); for (let i = 0; i < 5; i++) lanzar('estrella', OX + 22 + Math.random() * 16, ovBase() - 4, (Math.random() - .5) * 2, -.3, 6); }
    } else if (ov.f === 'despega') {
      if (ov.t === 12) seq([262, 330, 392, 523, 660, 880, 1175, 1568], .07, 'sawtooth', .04);
      if (ov.t >= 48) {
        ov.f = 'habla';
        dialogo([S(), ...(e.traductor ? [T('Yo llegué en algo así... hace mucho tiempo.'), T('Antes de conocer a Cortex.')] : [])], () => { ov.f = 'entra'; ov.t = 0; });
      }
    } else if (ov.f === 'entra') { if (ov.t === 1) sonidoAlien(); if (ov.t >= 36) { ov.f = 'camina'; ov.t = 0; } }
    else if (ov.f === 'camina') { if (ov.t >= 24) { ov.f = 'casco'; ov.t = 0; seq([784, 988, 1175], .09, 'triangle', .06); } }
    else if (ov.f === 'casco') { if (ov.t >= 30) { ov.f = 'da'; ov.t = 0; } }
    else if (ov.f === 'da') {
      if (ov.t >= 36) {
        ov.f = 'premio'; sfx.logro(); gesto('salto'); corazones(4); estrellas(8);
        e.tiene.casco_espacial = 1; e.ovniPend = 0; guardar();
        setTimeout(() => fanfare({ g: () => prevGrid('casco_espacial'), t: 'CASCO ESPACIAL', d: 'REGALO DEL AMIGO VERDE. PÓNSELO EN VESTIR A SIMON', mudo: true }, () => { if (ov) { ov.f = 'sale'; ov.t = 0; } }), 500);
      }
    } else if (ov.f === 'sale') {
      if (ov.t >= 52) { ov = null; proxAct = tk + 60; guardar(); pintar(); }
    }
  }
  function ovCielo(dy) {   // dentro del cristal de la ventana (se dibuja detrás del marco)
    if (lunaDorada()) {
      const fuerte = lunaFlash > 0 || (ov && ov.f === 'luz');
      ctx.drawImage(sprite('luna_oro' + (fuerte || (tk >> 3) % 2 ? 1 : 0), () => lunaOroGrid(fuerte || (tk >> 3) % 2 ? 1 : 0), 0), OX, dy);
      if ((tk >> 2) % 3 === 0) { const q = [[31, 20], [41, 22], [37, 32], [32, 28]][(tk >> 3) % 4]; ctx.fillStyle = '#fff6b0'; ctx.fillRect(OX + q[0], dy + q[1], 1, 3); ctx.fillRect(OX + q[0] - 1, dy + q[1] + 1, 3, 1); }
    }
    fugazDibujo(dy);
    if (ov && (ov.f === 'baja' || ov.f === 'espera' || ov.f === 'despega' || ov.f === 'seVa')) {
      const base = ovBase(); let y = base - 15, x = OX + 29 - 5, fl = 0;
      if (ov.f === 'baja') { const u = 1 - Math.pow(1 - ov.t / 55, 2); y = Math.round((dy + 8 - 15) + (base - 15 - (dy + 8 - 15)) * u); x += Math.round(Math.sin(ov.t / 4) * (1 - u) * 3); fl = 1 + ((tk >> 1) % 2); }
      else if (ov.f === 'despega' || ov.f === 'seVa') { if (ov.f === 'despega' && ov.t < 14) { x += (tk & 1) ? 1 : -1; fl = 1 + ((tk >> 1) % 2); } else { const w = ov.f === 'seVa' ? ov.t : (ov.t - 14); y = Math.round(base - 15 - w * w * .16); fl = 3; } }
      else if ((tk >> 3) % 2) { ctx.fillStyle = '#ffe45a'; ctx.fillRect(x + 4, y + 6, 2, 2); }
      ctx.drawImage(sprite('ov_coh', cohGrid, 0), x, y);
      if (fl) { ctx.fillStyle = '#ffa030'; ctx.fillRect(x + 3, y + 12, 4, 2 + fl); ctx.fillStyle = '#ffe45a'; ctx.fillRect(x + 4, y + 12, 2, 1 + fl); }
    }
  }
  function ovFrente() {   // el alien verde, delante de todo
    if (!ov || !['entra', 'camina', 'casco', 'da', 'premio', 'sale'].includes(ov.f)) return;
    const dy = RY - 59, pie = SY + SH - 4, ayS = pie - 34, ax0 = SX - 32, ax1 = SX - 20, wx = OX + 29 - 9, wy = dy + 34;
    let ax, ay, arr = 0, cx = 0, cy = 0, ver = true, casco = 1;   // casco: 1 puesto, 0 no, 2 volando
    if (ov.f === 'entra') { const u = ov.t / 36; ax = Math.round(wx + (ax0 - wx) * u); ay = Math.round(wy + (ayS - wy) * u - Math.abs(Math.sin(u * Math.PI * 3)) * 7 * (1 - u * .4)); }
    else if (ov.f === 'camina') { const u = ov.t / 24; ax = Math.round(ax0 + (ax1 - ax0) * u); ay = ayS - (ov.t % 8 < 4 ? 1 : 0); }
    else if (ov.f === 'casco') { ax = ax1; ay = ayS; arr = 1; const u = ov.t / 30; cx = 0; cy = -Math.round(u * 9); casco = u < .15 ? 1 : 2; }
    else if (ov.f === 'da') { ax = ax1; ay = ayS; arr = 1; const u = ov.t / 36; casco = 2; const hx = SX + 28 - 10, hy = SY + 6; const sx = ax1 - 1, sy = ayS + 3 - 9; cx = Math.round(sx + (hx - sx) * u) - (ax1 - 1); cy = Math.round(sy + (hy - sy) * u - Math.sin(u * Math.PI) * 10) - (ayS + 3); if (u > .85) casco = 0; }
    else if (ov.f === 'premio') { ax = ax1; ay = ayS; casco = 0; }
    else { const w = 12; if (ov.t < w) { ax = ax1; ay = ayS - ((ov.t >> 1) % 2 ? 2 : 0); arr = (ov.t >> 1) % 2; casco = 0; } else { const u = (ov.t - w) / (52 - w); ax = Math.round(ax1 + (wx - ax1) * u); ay = Math.round(ayS + (wy - ayS) * u - Math.abs(Math.sin(u * Math.PI * 3)) * 7); casco = 0; if (u > .92) ver = false; } }
    if (!ver) return;
    ctx.fillStyle = 'rgba(30,12,40,.3)'; ctx.fillRect(ax + 3, pie + 1, 12, 2);
    ctx.drawImage(sprite('ov_al' + arr, () => alienGrid(arr), 0), ax, ay);
    const cs = sprite('ov_cas', cascoAlGrid, 0);
    if (casco === 1) ctx.drawImage(cs, ax - 1, ay + 3);
    else if (casco === 2) { ctx.drawImage(cs, ax - 1 + cx, ay + 3 + cy); if ((tk >> 1) % 2) { ctx.fillStyle = '#fff6b0'; ctx.fillRect(ax + 8 + cx, ay + cy - 1, 1, 3); ctx.fillRect(ax + 7 + cx, ay + cy, 3, 1); } }
  }
