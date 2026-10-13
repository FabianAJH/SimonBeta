  /* ===================== CATÁLOGO: ROPA Y MUEBLES ===================== */
  R.dorado = ['#fff6b0', '#ffd84a', '#d8a020', '#8a5a10'];
  R.amarillo = ['#fff7a0', '#ffd84a', '#e8a820', '#a86a10'];
  const SUDS = {
    sud_azul:  [R.azul, TINTA_AZUL, '#1d1470'],
    sud_roja:  [R.rojo, '#4a0a14', '#6e1020'],
    sud_verde: [R.verde, '#12432a', '#1d6a38'],
    sud_dorada: [R.dorado, '#6a4a08', '#8a5a10'],
    sud_negra: [['#6a647c', '#3a3548', '#221f30', '#100e18'], '#08060c', '#150f20'],
    sud_morada: [['#d8b0ff', '#9a5ae8', '#6a30b0', '#401880'], '#2a0a5a', '#401880'],
    sud_naranja: [['#ffd8a0', '#ff9a40', '#d86a18', '#8a3a08'], '#4a2008', '#8a3a08'],
    sud_rosa: [['#ffc0e0', '#ff7ab8', '#d04888', '#802858'], '#4a1030', '#802858'],
    sud_celeste: [['#d0f0ff', '#6ac0f0', '#3a88c8', '#1e5088'], '#0e2a50', '#1e5088'],
    sud_calabaza: [['#ffc060', '#ff8a20', '#c85a10', '#6a2a08'], '#3a1a04', '#6a2a08'],
    sud_arcoiris: [['#fefefe', '#dedede', '#b0b0b1', '#808081'], '#2a1a4a', '#2a1a4a'],
    sud_navidad: [['#6adf8a', '#1f9a4a', '#136a30', '#0a4020'], '#06280e', '#136a30']
  };
  function accGafas(g, k) {
    if (ACC2[k]) return ACC2[k](g);
    if (k === 'nariz_payaso') {
      capa(g, '#4a0a14', L => sombrear(L, elipse(28, 40, 3.8, 3.8), 28, 40, 3.8, 3.8, R.rojo));
      g.set(26, 38, '#ffd0d8'); g.set(27, 38, '#ffd0d8'); g.set(26, 39, '#ffd0d8');
      return;
    }
    if (k === 'gafas_corazon') {
      [15, 41].forEach(cx => g.art(cx - 4, 30, CORAZON, { O: '#8a1020', h: '#ffc0cc', r: '#ff4a6a' }));
      g.rect(24, 32, 8, 1, '#8a1020'); g.rect(3, 32, 5, 1, '#8a1020'); g.rect(48, 32, 5, 1, '#8a1020');
      return;
    }
    if (k === 'monoculo') {
      const cx = 41, cy = 34;
      for (let y = cy - 12; y <= cy + 12; y++) for (let x = cx - 12; x <= cx + 12; x++) { const d = Math.hypot(x + .5 - cx, y + .5 - cy); if (d >= 9.2 && d <= 10.6) g.set(x, y, (x < cx && y < cy) ? '#fff6b0' : '#d8a020'); }
      for (let i = 0; i < 14; i++) g.set(48 + Math.round(i * .15), 42 + i, i % 2 ? '#d8a020' : '#fff6b0');
      return;
    }
    [15, 41].forEach(cx => capa(g, '#0a0a18', L => {
      for (let y = 27; y <= 41; y++) for (let x = cx - 10; x <= cx + 9; x++) {
        if ((y === 27 || y === 41) && (x === cx - 10 || x === cx + 9)) continue;
        L.set(x, y, y < 33 ? '#2b2b5a' : y < 38 ? '#1c1c3c' : '#14142a');
      }
    }));
    [15, 41].forEach(cx => [[-7, 29], [-6, 29], [-7, 30], [-3, 29]].forEach(([dx, dy]) => g.set(cx + dx, dy, '#8a8ae0')));
    g.rect(24, 31, 8, 2, '#0a0a18'); g.rect(3, 31, 5, 2, '#0a0a18'); g.rect(48, 31, 5, 2, '#0a0a18');
  }
  function accCuello(g, k) {
    if (ACC2[k]) return ACC2[k](g);
    if (k === 'panuelo') {
      capa(g, '#1a2a6a', L => {
        for (let y = 48; y <= 61; y++) {
          const half = Math.round(12 * (1 - (y - 48) / 14)) + 1;
          for (let x = 28 - half; x <= 27 + half; x++) L.set(x, y, (x * 3 + y * 5) % 7 === 0 ? '#ffffff' : (y < 51 ? '#6a8aff' : '#3a5ae0'));
        }
      });
      return;
    }
    if (k === 'corbata') {
      capa(g, '#4a0a14', L => {
        L.rect(26, 50, 4, 3, R.rojo[1]);
        sombrear(L, (x, y) => y >= 53 && y <= 68 && Math.abs(x + .5 - 28) <= 1.6 + (y - 53) * .22 * (y < 62 ? 1 : -.5) + (y >= 62 ? 3.3 : 0), 28, 60, 5, 9, R.rojo);
      });
      return;
    }
    if (k === 'collar') {
      for (let x = 17; x <= 39; x++) g.set(x, 56 - Math.round(((x - 28) / 11) ** 2 * 6), (x % 2) ? '#ffd84a' : '#d8a020');
      g.rect(27, 57, 3, 3, '#ff4a5a'); g.set(27, 57, '#ffc0cc'); g.set(28, 60, '#8a1020');
      return;
    }
    if (k === 'mono' || k === 'monodorado') {
      const rp = k === 'mono' ? R.rojo : R.dorado, out = k === 'mono' ? '#4a0a14' : '#6a4a08';
      capa(g, out, L => {
        const ala = (x, y) => (x >= 19 && x <= 25 && Math.abs(y - 53) <= (26 - x) * .55 + 1.4) || (x >= 30 && x <= 36 && Math.abs(y - 53) <= (x - 29) * .55 + 1.4);
        sombrear(L, ala, 28, 53, 10, 5, rp);
        L.rect(26, 51, 4, 5, rp[1]); L.rect(26, 51, 4, 1, rp[0]); L.rect(26, 55, 4, 1, rp[2]);
      });
    } else {
      const dor = k === 'bufanda_dorada', c1 = dor ? '#ffd84a' : '#e8353f', c2 = dor ? '#fff6b0' : '#f4eed8';
      capa(g, dor ? '#6a4a08' : '#4a0a14', L => {
        for (let y = 48; y <= 56; y++) for (let x = 11; x <= 45; x++) {
          const dx = (x + .5 - 28) / 17, dy = (y + .5 - 52) / 4.6;
          if (dx * dx + dy * dy <= 1) L.set(x, y, Math.floor((x + y) / 3) % 2 ? c1 : c2);
        }
        for (let y = 54; y <= 68; y++) for (let x = 37; x <= 42; x++) L.set(x, y, Math.floor(y / 3) % 2 ? c1 : c2);
        [37, 39, 41].forEach(x => { L.set(x, 69, c1); L.set(x, 70, c1); });
      });
    }
  }
  function accCapa(g, k) {
    if (ACC2[k]) return ACC2[k](g);
    const [ra, oa] = k === 'capa_azul' ? [R.azul, TINTA_AZUL] : [R.rojo, '#4a0a14'];
    capa(g, oa, L => {
      sombrear(L, (x, y) => y >= 50 && y <= 76 && Math.abs(x + .5 - 28) <= 15 + (y - 50) * .85, 28, 64, 28, 14, ra);
      for (let x = 0; x < SW; x++) if (L.has(x, 75)) L.set(x, 75, '#ffd84a');
    });
  }
  function accOrejas(g, k) {
    if (ACC2[k]) return ACC2[k](g);
    if (k === 'orejas_gato') {
      [11, 45].forEach(cx => capa(g, '#150f20', L => {
        sombrear(L, (x, y) => y >= 6 && y <= 18 && Math.abs(x + .5 - cx) <= (y - 5) * .55, cx, 14, 6, 8, R.pelo);
        for (let y = 10; y <= 16; y++) for (let x = cx - 2; x <= cx + 2; x++) if (L.has(x, y) && Math.abs(x + .5 - cx) <= (y - 9) * .3) L.set(x, y, '#ffa0b6');
      }));
      return;
    }
    capa(g, '#150f20', L => {
      for (let y = 0; y <= 34; y++) for (let x = 0; x < SW; x++) {
        const d = ((x + .5 - 28) / 25) ** 2 + ((y + .5 - 32) / 20) ** 2;
        if (d > 1.0 && d <= 1.17) L.set(x, y, '#3a3a52');
      }
    });
    [3.5, 52.5].forEach(cx => capa(g, '#4a0a14', L => sombrear(L, elipse(cx, 37, 3.6, 8), cx, 37, 3.6, 8, R.rojo)));
  }
  function accAura(g, k, fr) {
    if (ACC2[k]) return ACC2[k](g, fr || 0);
  }
  function chispa(g, cx, cy, c1, c2) {   // una chispita de 5x5 en forma de cruz/diamante
    g.art(cx - 2, cy - 2, ['..c..', '.ccc.', 'cCCCc', '.ccc.', '..c..'], { c: c1, C: c2 });
  }
  function estrella4(g, cx, cy, r, c1, c2) {   // estrellita de 4 picos
    for (let d = 1; d <= r; d++) { g.set(cx - d, cy, d === r ? c1 : c2); g.set(cx + d, cy, d === r ? c1 : c2); g.set(cx, cy - d, d === r ? c1 : c2); g.set(cx, cy + d, d === r ? c1 : c2); }
    g.set(cx, cy, '#ffffff');
  }
