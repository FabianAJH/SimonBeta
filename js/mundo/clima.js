

  /* ===================== CLIMA (cosas que solo pasan algunos días) ===================== */
  // El día trae un tipo de clima (sol, lluvia, tormenta, nieve...), pero lluvia, tormenta, nieve y arcoíris
  // solo ocurren en 1 a 3 "ratos" del día, de 10 a 30 minutos cada uno. El resto del día está nublado o con sol.
  function climaDia(h) {
    const r = hashStr('clima' + h) % 100, mes = +h.split('-')[1];
    if ((mes === 12 || mes <= 2) && r < 32) return 'nieve';
    if (r < 46) return 'sol'; if (r < 62) return 'nublado'; if (r < 80) return 'lluvia'; if (r < 87) return 'tormenta'; if (r < 94) return 'arcoiris';
    return 'sol';
  }
  function episodioActivo(h, min) {
    const n = 1 + hashStr('epn' + h) % 3, slot = 1440 / n;
    for (let i = 0; i < n; i++) {
      const dur = 10 + hashStr('epd' + h + i) % 21, ini = Math.floor(i * slot + hashStr('eps' + h + i) % Math.max(1, Math.floor(slot - dur - 5)));
      if (min >= ini && min < ini + dur) return true;
    }
    return false;
  }
  let _cl = { k: '', v: 'sol' };
  function clima() {
    if (admin && admClima) return admClima;
    const h = hoy(), d = new Date(ahora()), min = d.getHours() * 60 + d.getMinutes(), k = h + '|' + min;
    if (_cl.k === k) return _cl.v;
    const base = climaDia(h); let v = base;
    if (base === 'lluvia' || base === 'tormenta' || base === 'nieve' || base === 'arcoiris') v = episodioActivo(h, min) ? base : (base === 'arcoiris' ? 'sol' : 'nublado');
    _cl = { k, v }; return v;
  }
  function cieloClima(noche, cl) {
    const g = Grid(60, 64), X0 = 12, Y0 = 16, X1 = 46, Y1 = 54;
    const fuerte = cl === 'tormenta' || cl === 'lluvia';
    const c = noche ? (fuerte ? ['#080b22', '#0c1130', '#121842', '#1a2258'] : ['#0a0e2a', '#10163c', '#161e50', '#1e2864'])
      : fuerte ? (cl === 'tormenta' ? ['#4a5468', '#5a6680', '#6c7a96', '#8090aa'] : ['#6c7a90', '#7e8ca4', '#92a0b8', '#a8b4c8']) : ['#a8b6cc', '#b8c4d8', '#c8d2e2', '#d8e0ec'];
    for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) {
      const t = (y - Y0) / (Y1 - Y0) * 3 + (BAY[y & 3][x & 3] / 16 - .5) * .8;
      g.set(x, y, c[Math.max(0, Math.min(3, Math.floor(t + .3)))]);
    }
    const nb = noche ? ['#1a2250', '#10163c'] : fuerte ? (cl === 'tormenta' ? ['#5c667c', '#444e64'] : ['#8a98ae', '#6c7a90']) : ['#f4f7fc', '#d4dcea'];
    [[17, 22, 9, 4], [33, 20, 10, 4], [26, 28, 11, 4], [40, 30, 7, 3], [15, 34, 7, 3], [30, 38, 8, 3]].forEach(([cx, cy, rx, ry]) => {
      const nube = elipse(cx, cy, rx, ry);
      for (let y = cy - ry - 1; y <= cy + ry + 1; y++) for (let x = cx - rx - 1; x <= cx + rx + 1; x++) if (x >= X0 && x < X1 && y >= Y0 && y < Y1 && nube(x, y)) g.set(x, y, y > cy ? nb[1] : nb[0]);
    });
    const suelo = cl === 'nieve' ? (noche ? ['#8a96c0', '#a4b0d8'] : ['#e6eeff', '#ffffff']) : noche ? ['#0a1636', '#10204a'] : ['#3f8a44', '#58a55a'];
    for (let y = 44; y < Y1; y++) for (let x = X0; x < X1; x++) { const h = 47 + Math.round(2.5 * Math.sin(x / 5 + 1)); if (y >= h) g.set(x, y, y > h + 2 ? suelo[0] : suelo[1]); }
    return g;
  }
  function cieloArcoiris() {
    const g = cieloGrid(false), C = ['#ff5a5a', '#ffa040', '#ffe45a', '#6adf6a', '#5ab4ff', '#9a6aff'];
    C.forEach((col, i) => { const r = 19 - i * 1.6; for (let a = 0; a <= 180; a += 1.5) { const x = Math.round(29 + Math.cos(a * Math.PI / 180) * r * 1.0), y = Math.round(50 - Math.sin(a * Math.PI / 180) * r); if (x >= 12 && x < 46 && y >= 16 && y < 50) { g.set(x, y, col); g.set(x, y + 1, col); } } });
    return g;
  }
  function cieloDe(n, cl) {
    if (cl === 'sol' || (cl === 'arcoiris' && n)) return sprite('cielo' + n, () => cieloGrid(!!n), 0);
    if (cl === 'arcoiris') return sprite('cielo_arco', cieloArcoiris, 0);
    return sprite('cielo_' + cl + n, () => cieloClima(!!n, cl), 0);
  }
  let rayo = 0;
  function climaFX(cl, n, dy) {
    if (cl !== 'tormenta') { truenoT = 0; if (!tr) boltV = 0; }
    if (cl !== 'lluvia' && cl !== 'tormenta' && cl !== 'nieve') return;
    const X = OX + 12, Y = dy + 16, W = 34, H = 31;      // dentro del vidrio (sin la colina)
    if (cl === 'nieve') {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 22; i++) { const x = (i * 29 + Math.round(2 * Math.sin((tk + i * 7) / 9))) % W, y = (i * 47 + (tk >> 1)) % H; ctx.fillRect(X + x, Y + y, 1, 1); if (i % 4 === 0) ctx.fillRect(X + x + 1, Y + y, 1, 1); }
      return;
    }
    const N = cl === 'tormenta' ? 40 : 26, v = cl === 'tormenta' ? 5 : 4;
    ctx.fillStyle = n ? '#8fb0ff' : '#d8ecff';
    for (let i = 0; i < N; i++) { const x = (i * 37) % W, y = (i * 53 + tk * v) % (H - 3); ctx.fillRect(X + x, Y + y, 1, 3); }
    if (cl === 'tormenta') {
      const c = tk % 100;
      if (c === 0 && Math.random() < .55) {
        rayo = 4; setTimeout(truenoSusto, 500 + Math.random() * 600);
        if (!boltV && truenoDisponible()) { boltV = 16; boltX = X + 6 + Math.random() * (W - 12); boltY = Y + 5 + Math.random() * (H - 14); }
      }
      if (rayo > 0) { ctx.fillStyle = rayo > 2 ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.4)'; ctx.fillRect(X, Y, W, H); rayo--; }
      if (boltV > 0 && !tr) { ctx.drawImage(sprite('fx_rayo', FX.rayo, 0), Math.round(boltX) - 2, Math.round(boltY) - 4); boltV--; }
      if (tr && tr.f === 'entra' && centellaXY) ctx.drawImage(sprite('fx_rayo', FX.rayo, 0), Math.round(centellaXY.x) - 2, Math.round(centellaXY.y) - 4);
    }
  }
  // (TXT_CLIMA y frasesVentana definidos en dialogos.js)


