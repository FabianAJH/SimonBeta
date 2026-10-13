
  const LLAMA = [
    ["....o....", "...oro...", "...orro..", "..orrro.o", ".orryrroo", ".orryyrro", "orryyyyro", "orryywyro", "orryyyyro", ".orryyyro", "..ooooo.."],
    ["....o....", "....oro..", "...orro..", "o.orrro..", "oorrryro.", "orryyrro.", "orryyyyro", "orryywyro", "orryyyyro", ".orryyyro", "..ooooo.."]
  ];
  function llamaGrid(f, apagada) {
    const g = Grid(9, 11);
    g.art(0, 0, LLAMA[f], apagada ? { o: '#3a3e5c', r: '#6a6f94', y: '#8a90b8', w: '#b0b6d8' } : { o: '#8a2008', r: '#ff4a1c', y: '#ffb020', w: '#fff2a0' });
    return g;
  }
  const DIG = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001001001001', '111101111101111', '111101111001111'];
  const LLAMITA = [['...o...', '..oro..', '.orrro.', '.orryro', 'orryyro', 'orrywro', 'orryyro', '.orrro.', '..ooo..'], ['....o..', '..oro..', '.orrro.', '.orryro', 'orryyro', 'orrywro', 'orryyro', '.orrro.', '..ooo..'],
    ['..o....', '..oro..', '.orrro.', '.orryro', 'orryyro', 'orrywro', 'orryyro', '.orrro.', '..ooo..'], ['.......', '...o...', '..oro..', '.orrro.', 'orryyro', 'orrywro', 'orryyro', '.orrro.', '..ooo..']];
  const LLAMA_SEC = [0, 1, 0, 2, 3, 2];
  let rachaModo = 0;   // 0 = racha, 1 = hora, 2 = clima (un toque cambia; al abrir el juego vuelve a la racha)
  const rachaF = () => racha() ? LLAMA_SEC[(tk >> 1) % 6] : 0;
  const horaRacha = () => { const d = new Date(ahora()); return String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0'); };
  function rachaGrid(r, f, modo, hhmm) {
    const g = Grid(23, 13), c = r ? '#ffd84a' : '#8a90b8';
    g.rect(0, 0, 23, 13, '#3a2410'); g.rect(1, 1, 21, 11, '#e8c04a'); g.rect(2, 2, 19, 9, '#1a1f4a');
    if (modo === 2) {   // clima actual con una animación sencilla
      const w = hhmm.w, noche = hhmm.n, F = f & 3, R = (x0, y0, w0, h0, c) => g.rect(x0, y0, w0, h0, c);
      const nube = (cc, c2) => { R(6, 6, 11, 3, cc); R(8, 4, 5, 2, cc); R(12, 5, 4, 1, cc); R(6, 8, 11, 1, c2); };
      if (w === 'sol') {
        if (noche) { R(9, 4, 4, 5, '#f8f2d0'); R(8, 5, 1, 3, '#f8f2d0'); R(11, 3, 2, 7, '#1a1f4a'); R(12, 4, 3, 5, '#1a1f4a'); [[16, 3], [4, 5], [15, 8], [5, 9]].forEach(([x, y], i) => { if ((F + i) % 3) g.set(x, y, '#fff6d8'); }); }
        else { circG(g, 11, 6, 2, '#ffd84a'); R(10, 5, 2, 2, '#fff2a0'); const ry = '#ffb020'; if (F % 2) { [[11, 2], [11, 10], [6, 6], [16, 6]].forEach(([x, y]) => g.set(x, y, ry)); [[8, 3], [14, 3], [8, 9], [14, 9]].forEach(([x, y]) => g.set(x, y, '#ffe27a')); } else { [[11, 3], [11, 9], [7, 6], [15, 6]].forEach(([x, y]) => g.set(x, y, ry)); [[8, 4], [14, 4], [8, 8], [14, 8]].forEach(([x, y]) => g.set(x, y, '#ffe27a')); } }
      } else if (w === 'arcoiris') {
        [['#e8353f', 8], ['#ffb020', 7], ['#5ac870', 6], ['#4ab8ff', 5]].forEach(([c, rx]) => { for (let x = -rx; x <= rx; x++) { const y = Math.round(Math.sqrt(Math.max(0, 1 - (x / rx) * (x / rx))) * (rx * .62)); g.set(11 + x, 9 - y, c); } });
        R(3, 9, 2, 1, '#f4f4ff'); R(17, 9, 3, 1, '#f4f4ff');
      } else {
        const dark = w === 'tormenta', nv = dark ? '#6a6f94' : w === 'nieve' ? '#e6ecf6' : w === 'lluvia' ? '#9aa6c8' : '#c8d0e4';
        nube(nv, dark ? '#4a4e74' : '#8a90b0');
        if (w === 'lluvia') { [8, 11, 14].forEach((x, i) => g.set(x, 9 + ((F + i) % 2), '#4ab8ff')); }
        else if (w === 'tormenta') { if (F % 2 === 0) { g.set(11, 9, '#ffe45a'); g.set(10, 10, '#ffe45a'); g.set(11, 10, '#ffe45a'); } else { g.set(12, 9, '#ffe45a'); g.set(11, 10, '#ffe45a'); } }
        else if (w === 'nieve') { [8, 11, 14].forEach((x, i) => g.set(x + ((F + i) % 2), 9 + ((F + i) % 2), '#ffffff')); }
        else if (noche) { g.set(16, 3, '#fff6d8'); g.set(4, 4, '#fff6d8'); }
      }
      return g;
    }
    if (modo) {
      const hc = '#7ee8ff', put = (ch, x0) => { const m = DIG[+ch]; for (let k = 0; k < 15; k++) if (m[k] === '1') g.set(x0 + (k % 3), 4 + Math.floor(k / 3), hc); };
      put(hhmm[0], 3); put(hhmm[1], 7); put(hhmm[2], 13); put(hhmm[3], 17);
      g.set(11, 5, hc); g.set(11, 7, hc);
      return g;
    }
    g.art(2, 2, LLAMITA[f || 0], r ? { o: '#8a2008', r: '#ff4a1c', y: '#ffb020', w: '#fff2a0' } : { o: '#3a3e5c', r: '#6a6f94', y: '#8a90b8', w: '#b0b6d8' });
    const t = String(Math.min(999, r)), w = t.length * 4 - 1, x0 = 11 + Math.floor((11 - w) / 2);
    [...t].forEach((ch, i) => { const m = DIG[+ch]; for (let k = 0; k < 15; k++) if (m[k] === '1') g.set(x0 + i * 4 + (k % 3), 4 + Math.floor(k / 3), c); });
    return g;
  }
  function racha() { return e.racha > 0 ? e.racha : 0; }
  function dibujarLlama() {
    const r = racha(), c = $('ic-fue').getContext('2d');
    c.clearRect(0, 0, 9, 11);
    c.drawImage(sprite('llama' + (r ? (tk >> 2) % 2 : 0) + (r ? 'a' : 'x'), () => llamaGrid(r ? (tk >> 2) % 2 : 0, !r), 0), 0, 0);
    if (modal === 'simonInfo') { const mc = document.querySelector('#m-cuerpo canvas[data-prev="ic_fuego"]'); if (mc) { const ctx2 = mc.getContext('2d'); ctx2.clearRect(0, 0, 9, 11); ctx2.drawImage(sprite('llama' + (r ? (tk >> 2) % 2 : 0) + (r ? 'a' : 'x'), () => llamaGrid(r ? (tk >> 2) % 2 : 0, !r), 0), 0, 0); } }
  }
