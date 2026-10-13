  /* ===================== MOTOR DE PIXEL ART ===================== */
  const COL = new Map();
  function col(c) {
    if (typeof c !== 'string') return c;
    let p = COL.get(c);
    if (!p) { p = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 255]; COL.set(c, p); }
    return p;
  }
  // Una rejilla de pixeles a todo color (RGBA)
  function Grid(w, h) {
    const d = new Uint8ClampedArray(w * h * 4);
    const g = {
      w, h, d,
      set(x, y, c) {
        x = Math.floor(x); y = Math.floor(y);
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const p = col(c), i = (y * w + x) * 4;
        d[i] = p[0]; d[i + 1] = p[1]; d[i + 2] = p[2]; d[i + 3] = p[3];
      },
      has(x, y) { return x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0; },
      clear(x, y, rw, rh) { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) { const X = x + i, Y = y + j; if (X >= 0 && Y >= 0 && X < w && Y < h) d[(Y * w + X) * 4 + 3] = 0; } },
      rect(x, y, rw, rh, c) { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) g.set(x + i, y + j, c); },
      art(x, y, rows, map) { rows.forEach((r, j) => [...r].forEach((ch, i) => { if (map[ch]) g.set(x + i, y + j, map[ch]); })); },
      paste(o, ox = 0, oy = 0) {
        for (let y = 0; y < o.h; y++) for (let x = 0; x < o.w; x++) {
          const a = (y * o.w + x) * 4;
          if (o.d[a + 3] > 0) g.set(x + ox, y + oy, [o.d[a], o.d[a + 1], o.d[a + 2], 255]);
        }
      },
      // pinta de un color los pixeles del borde de lo dibujado (contorno)
      contour(c) {
        const b = [];
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
          if (g.has(x, y) && (!g.has(x - 1, y) || !g.has(x + 1, y) || !g.has(x, y - 1) || !g.has(x, y + 1))) b.push([x, y]);
        b.forEach(([x, y]) => g.set(x, y, c));
      }
    };
    return g;
  }
  // Agrega un contorno por fuera (la imagen crece 1 pixel por lado)
  function conBorde(g, c) {
    const o = Grid(g.w + 2, g.h + 2); o.paste(g, 1, 1);
    const b = [];
    for (let y = 0; y < o.h; y++) for (let x = 0; x < o.w; x++)
      if (!o.has(x, y) && (o.has(x - 1, y) || o.has(x + 1, y) || o.has(x, y - 1) || o.has(x, y + 1))) b.push([x, y]);
    b.forEach(([x, y]) => o.set(x, y, c));
    return o;
  }
  // Una "capa": se dibuja aparte, se le pone contorno y luego se pega encima
  function capa(g, contorno, dibujar) {
    const L = Grid(g.w, g.h);
    dibujar(L);
    if (contorno) L.contour(contorno);
    g.paste(L);
  }

  // Sombreado con luz desde arriba-izquierda y tramado (dithering) como en los juegos de GBA
  const BAY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  function sombrear(L, test, cx, cy, rx, ry, rampa) {
    for (let y = 0; y < L.h; y++) for (let x = 0; x < L.w; x++) {
      if (!test(x, y)) continue;
      let nx = (x + .5 - cx) / rx, ny = (y + .5 - cy) / ry, r2 = nx * nx + ny * ny;
      if (r2 > 1) { const n = Math.sqrt(r2); nx /= n; ny /= n; r2 = 1; }
      const nz = Math.sqrt(1 - r2);
      const d = -.5 * nx - .55 * ny + .67 * nz + (BAY[y & 3][x & 3] / 16 - .47) * .24;
      L.set(x, y, rampa[d > .78 ? 0 : d > .3 ? 1 : d > -.1 ? 2 : 3]);
    }
  }
  const elipse = (cx, cy, rx, ry) => (x, y) => { const dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry; return dx * dx + dy * dy <= 1; };
  const union = (...f) => (x, y) => f.some(fn => fn(x, y));
  function linea(L, x0, y0, x1, y1, c, test) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
      if (!test || test(x, y)) L.set(x, y, c);
    }
  }

  // Rampas de color: [luz, base, sombra, sombra profunda]
  const R = {
    piel:   ['#ffffff', '#f0f2fb', '#ccd3ea', '#9ea8cf'],
    azul:   ['#8c88ff', '#4f49ea', '#352bc4', '#241b8c'],
    rojo:   ['#ff9aa2', '#e8353f', '#b02030', '#6e1020'],
    pelo:   ['#5d5776', '#37324d', '#221f32', '#131222'],
    corona: ['#4d4d60', '#2b2b38', '#191922', '#0d0d13'],
    ojo:    ['#3b3b58', '#1a1a2a', '#0e0e18', '#08080e'],
    verde:  ['#b2f088', '#5ccf5a', '#2f9a4a', '#1d6a38'],
    barro:  ['#f0a070', '#d8743c', '#b05428', '#7a3818'],
    madera: ['#e8b078', '#c98a52', '#a06a38', '#6e4422']
  };
  const TINTA = '#262244', TINTA_AZUL = '#150f55', ROJO_CORONA = '#d4202e', GEMA = '#ff4a5a';

