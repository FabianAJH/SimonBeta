/* Luz nocturna de los muebles. Cada objeto brilla a su manera (no un círculo genérico):
   - bloom: su propia silueta teñida, reflejada alrededor (aditivo)
   - nucleo: foco de luz en escalones (como el cuadro de racha, pero redondo) [alto relativo, radio, alpha]
   - charco: luz proyectada en el piso bajo el mueble [radio x, alpha]
   - haz: cono de luz hacia abajo (lámparas)
   - parts: partículas que suben/titilan sobre el mueble (se dibujan por delante)
   El cuadro de racha y las plantas conservan su propio resplandor (dibujar_muebles.js). */
(function () {
  const tintes = new WeakMap();
  function tinte(sp, c) {   // silueta del sprite en un solo color (cacheada por sprite)
    const k = c.join(','); let m = tintes.get(sp); if (!m) { m = {}; tintes.set(sp, m); }
    if (!m[k]) { const cv = document.createElement('canvas'); cv.width = sp.width; cv.height = sp.height; const x = cv.getContext('2d'); x.drawImage(sp, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = 'rgb(' + k + ')'; x.fillRect(0, 0, cv.width, cv.height); m[k] = cv; }
    return m[k];
  }
  const rn = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
  const respira = (t, v, a) => 1 + Math.sin(t / v) * a;   // pulso suave
  const rgba = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')';

  const COLS_LAVA = [[255, 110, 200], [74, 240, 208], [255, 176, 74]], COLS_PORTAL = [[106, 74, 240], [232, 168, 32], [208, 40, 56], [58, 154, 240]];
  const L = {
    lampara:        () => ({ col: [255, 226, 120], bloom: .10, haz: [.12, 30, .13], charco: [26, .12], nucleo: [.1, 9, .10] }),
    tele:           () => { const c = [[90, 150, 255], [120, 200, 255], [255, 150, 200], [150, 255, 180]][(tk >> 5) & 3]; return { col: c, bloom: .09 * respira(tk, 5, .35), nucleo: [.4, 16, .06], charco: [24, .09], titila: true }; },
    neon_corazon:   () => ({ col: [255, 90, 160], bloom: .20, nucleo: [.5, 17, .07] }),
    neon_si:        () => ({ col: [255, 130, 200], bloom: .20, nucleo: [.5, 22, .06] }),
    lampara_lava:   () => { const c = COLS_LAVA[(window.tonoLavaHoy || (() => 2))()]; return { col: c, bloom: .14, nucleo: [.45, 14, .09], charco: [14, .10], parts: { n: 5, col: c, sube: 22, ancho: 5, y0: .6, vel: 5 } }; },
    planetario:     () => ({ col: [255, 226, 130], bloom: .06, nucleo: [.4, 16, .05], charco: [26, .08], parts: { n: 12, col: [255, 244, 190], ancho: 26, sube: 0, nube: 22, y0: .4, titila: true } }),
    campamento:     () => { const f = 1 + (rn(tk >> 2, 1) - .5) * .35; return { col: [255, 150, 50], fuego: [.77, .62], nucleo: [.62, 20 * f, .10], charco: [34 * f, .13], parts: { n: 7, col: [255, 190, 90], px: .77, sube: 28, ancho: 5, y0: .55, vel: 3 } }; },
    fuente_deseos:  () => ({ col: [150, 220, 255], bloom: .09, nucleo: [.35, 15, .06], charco: [24, .09], parts: { n: 6, col: [220, 245, 255], sube: 12, ancho: 8, y0: .3, vel: 4, titila: true } }),
    maq_garra:      () => { const c = [[255, 90, 120], [90, 220, 255], [255, 220, 90]][(tk >> 4) % 3]; return { col: c, bloom: .11, nucleo: [.45, 16, .06], charco: [20, .08] }; },
    portal_estelar: () => { const c = COLS_PORTAL[(window.lunaPortal || (() => 0))()]; return { col: c, bloom: .16 * respira(tk, 9, .25), nucleo: [.5, 24, .09], charco: [30, .10], parts: { n: 8, col: c.map(v => Math.min(255, v + 80)), orbita: 18, y0: .5, vel: 2 } }; },
    portal_hogar:   () => ({ col: [58, 190, 200], bloom: .16 * respira(tk, 9, .25), nucleo: [.5, 24, .09], charco: [30, .10], parts: { n: 8, col: [150, 240, 200], orbita: 18, y0: .5, vel: 2 } }),
    cristal_alien:  () => ({ col: [74, 240, 208], bloom: .14 * respira(tk, 11, .3), nucleo: [.4, 15, .08], charco: [20, .10], parts: { n: 6, col: [190, 255, 240], ancho: 12, sube: 20, y0: .5, vel: 4, titila: true } }),
    hongos_alien:   () => ({ col: [232, 74, 184], bloom: .16, nucleo: [.55, 14, .07], charco: [24, .12], parts: { n: 7, col: [255, 170, 230], ancho: 14, sube: 26, y0: .45, vel: 6 } }),
    huevo_alien:    () => { const l = 1 + Math.sin(tk / 14) * .35 + (Math.sin(tk / 4) > .96 ? .3 : 0); return { col: [122, 240, 184], bloom: .12 * l, nucleo: [.5, 13 * l, .07], charco: [18, .09] }; },
    medusa_alien:   () => ({ col: [255, 122, 216], bloom: .15 * respira(tk, 13, .3), nucleo: [.4, 17, .07], charco: [16, .08], parts: { n: 6, col: [255, 200, 240], ancho: 5, sube: 30, y0: .8, vel: 3 } }),
    holomapa_alien: () => ({ col: [106, 160, 255], bloom: .12, nucleo: [.35, 17, .07], charco: [26, .10], barrido: true })
  };

  // ¿este mueble tiene luz propia? (el cuadro de racha y las plantas tienen la suya)
  window.tieneLuz = k => !!L[k];

  // Antes del mueble (detrás): bloom, foco, charco, haz. dib(img, dx, dy) dibuja respetando el volteo
  window.luzMuebleAntes = function (d, r, sp, dib) {
    const f = L[d.k]; if (!f) return; const s = f(), ctx_ = ctx;
    ctx_.save(); ctx_.globalCompositeOperation = 'lighter';
    if (s.bloom) {   // silueta teñida desplazada en anillos: aureola con la forma del objeto
      const t = tinte(sp, s.col);
      [[1, 1], [2, .62], [3, .38], [5, .2]].forEach(([k, m]) => {
        ctx_.globalAlpha = Math.min(1, s.bloom * m * (s.titila ? (rn(tk >> 1, 3) > .15 ? 1 : .4) : 1));
        [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([ox, oy]) => dib(t, ox * k, oy * k));
      });
    }
    ctx_.globalAlpha = 1;
    if (s.charco && !esPared(d.k)) {   // luz en el piso: óvalo plano en escalones
      const [rx, a] = s.charco;
      [[1, .4], [.72, .35], [.45, .35]].forEach(([m, am]) => {
        const w = rx * m, h = Math.max(2, Math.round(w * .22)); ctx_.fillStyle = rgba(s.col, a * am);
        for (let j = -h; j <= h; j++) { const hw = Math.round(w * Math.sqrt(1 - (j / (h + .6)) ** 2)); ctx_.fillRect(Math.round(r.cx - hw), Math.round(r.base - 1 + j), hw * 2, 1); }
      });
    }
    if (s.haz) {   // cono de luz que cae de la lámpara hasta el piso
      const [hy, ancho, a] = s.haz, y0 = r.y + r.h * hy, y1 = r.base;
      for (let y = Math.round(y0); y < y1; y++) { const t = (y - y0) / (y1 - y0), hw = Math.round(5 + t * ancho); ctx_.fillStyle = rgba(s.col, a * (1 - t * .55) * .5); ctx_.fillRect(Math.round(r.cx - hw), y, hw * 2, 1); }
    }
    if (s.nucleo) {   // foco redondo en escalones (3 anillos), no un disco plano
      const [hy, rad, a] = s.nucleo, cx = r.cx, cy = r.y + r.h * hy;
      [[1, .35], [.72, .35], [.46, .4], [.24, .5]].forEach(([m, am]) => {
        const R = rad * m; ctx_.fillStyle = rgba(s.col, a * am);
        for (let j = -Math.round(R); j <= Math.round(R); j++) { const hw = Math.round((R + 2) * Math.sqrt(Math.max(0, 1 - (j / R) ** 2))); ctx_.fillRect(Math.round(cx - hw), Math.round(cy + j), hw * 2, 1); }
      });
    }
    ctx_.restore();
  };

  // Después del mueble (por delante): partículas y destellos
  window.luzMuebleDespues = function (d, r) {
    const f = L[d.k]; if (!f) return; const s = f(), P = s.parts;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (P) for (let i = 0; i < P.n; i++) {
      const sd = i * 7 + d.k.length, fase = (((tk * (P.vel || 3) / 8) + rn(sd, 1) * 100) % 100) / 100;   // 0..1
      let x, y, a = Math.sin(fase * Math.PI);
      const px = r.x + r.w * (P.px != null ? P.px : .5), py = r.y + r.h * (P.y0 != null ? P.y0 : .5);
      if (P.orbita) { const an = tk / (30 / (P.vel || 2)) + i / P.n * 6.283; x = px + Math.cos(an) * P.orbita; y = py + Math.sin(an) * P.orbita * .5; a = .5 + .5 * Math.sin(an * 2); }
      else if (P.nube) { x = px + (rn(sd, 2) - .5) * 2 * P.nube; y = py + (rn(sd, 3) - .5) * P.nube; a = P.titila ? Math.max(0, Math.sin(tk / 7 + i * 2)) : a; }
      else { x = px + (rn(sd, 2) - .5) * 2 * P.ancho + Math.sin(fase * 6 + i) * 1.5; y = py - fase * P.sube; }
      ctx.fillStyle = rgba(P.col, Math.max(0, a) * (P.titila ? (.5 + .5 * Math.sin(tk / 5 + i)) : 1) * .9);
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      if (a > .7) { ctx.fillStyle = rgba(P.col, .25); ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1); ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 3); }
    }
    if (s.fuego) {   // llama del campamento: destello cálido que parpadea
      const x = r.x + r.w * s.fuego[0], y = r.y + r.h * s.fuego[1], a = .18 + rn(tk >> 1, 5) * .16;
      ctx.fillStyle = rgba([255, 200, 90], a); ctx.fillRect(Math.round(x) - 3, Math.round(y) - 2, 7, 5);
      ctx.fillStyle = rgba([255, 240, 170], a); ctx.fillRect(Math.round(x) - 1, Math.round(y) - 3, 3, 3);
    }
    if (s.barrido) {   // holomapa: línea de escaneo que sube y baja
      const y = r.y + 4 + ((tk >> 1) % Math.max(4, r.h - 10)); ctx.fillStyle = rgba([170, 210, 255], .22); ctx.fillRect(Math.round(r.x + 3), y, Math.round(r.w - 6), 1);
    }
    ctx.restore();
  };
})();
