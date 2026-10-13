  // ¿va delante de Simon? Sí si apoya sus pies más abajo que él, SALVO que le tape la cara: entonces se dibuja detrás (el torso y los pies sí se pueden tapar)
  function cubreCara(r) { const x0 = SX + 6, x1 = SX + SW - 6, y0 = SY + 6, y1 = SY + Math.round(SH * .55); return r.x < x1 && r.x + r.w > x0 && r.y < y1 && r.y + r.h > y0; }
  function muebleDelante(d, r) { r = r || posReal(d); return !esPared(d.k) && r.base > SY + SH - 12 && !cubreCara(r); }
  function dibujarMuebles(n, capa) {
    if (escenaId() === 'estudio' || (ban && escenaId() === 'bano')) return;
    e.deco.map((d, i) => [d, i]).sort((a, b) => (ITEMS[a[0].k] && esPared(a[0].k) ? 0 : 1) - (ITEMS[b[0].k] && esPared(b[0].k) ? 0 : 1)).forEach(([d, i]) => {   // lo colgado en la pared siempre queda detrás
      if (!ITEMS[d.k] || (d.h || 'sala') !== escenaId()) return;
      if ((jugFis.activo || jugFis.arr || (act && act.tipo === 'pelota')) && ITEMS[d.k].slot === 'juguete') return;
      if (sifJ && sifJ.ph !== 'ir' && ITEMS[d.k].slot === 'juguete') return;
      const r = posReal(d), pared = esPared(d.k), delante = muebleDelante(d, r) && !(cortex.p > 0);
      if ((capa === 'frente') !== delante) return;
      const hop = d.k === 'peluche_cortex' && pelHop > 0 ? Math.round(Math.abs(Math.sin((10 - pelHop) / 10 * Math.PI * 2)) * 6) : 0;
      const luz = ITEMS[d.k].luz, dim = (n && !luz) ? .55 : 0, an = ITEMS[d.k].anim ? ITEMS[d.k].anim(d, n) : null, sp = an ? sprite(an.key, an.grid, dim) : d.k === 'racha' ? (rachaModo === 2 ? (cw => sprite('mu_rachaW' + cw + (esNoche() ? 'n' : 'd') + ((tk >> 2) & 3), () => rachaGrid(racha(), tk >> 2, 2, { w: cw, n: esNoche() }), dim))(clima()) : rachaModo ? (hh => sprite('mu_rachaH' + hh, () => rachaGrid(racha(), 0, 1, hh), dim))(horaRacha()) : sprite('mu_racha' + racha() + '_' + rachaF(), () => rachaGrid(racha(), rachaF(), 0), dim)) : d.k === 'neon_si' ? (nf => sprite('mu_neon_si_' + nf, () => neonGrid(nf), 0))((tk >> 3) % 16) : ITEMS[d.k].semilla ? (w => { const fr = w ? 0 : tk % 24; return sprite('mu_' + d.k + '_' + w + (w ? '' : '_f' + fr) + ((ITEMS[d.k].semilla === 'solar' && esNoche()) ? 'n' : ''), () => macetaPlantaGrid(ITEMS[d.k].semilla, !!w, fr), (n && w) ? .55 : 0); })(macetaViva(d.k) ? 0 : 1) : sprite('mu_' + d.k, ITEMS[d.k].grid, (n && !luz) ? .55 : 0);
      if (!pared) {
        ctx.fillStyle = 'rgba(30,12,40,.30)';
        for (let j = -2; j <= 2; j++) { const w = Math.round(r.w / 2 * Math.sqrt(1 - (j / 2.8) * (j / 2.8))); ctx.fillRect(Math.round(r.cx - w), Math.round(r.base) + j, w * 2, 1); }
      }
      const dib = (img, dx, dy) => { if (d.f) { ctx.save(); ctx.translate(r.x + r.w + dx, r.y - hop + dy); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0); ctx.restore(); } else ctx.drawImage(img, r.x + dx, r.y - hop + dy); };
      if (n && typeof luzMuebleAntes === 'function') luzMuebleAntes(d, r, sp, dib);   // luz nocturna propia de cada objeto (mundo/luces_muebles.js)
      if (ITEMS[d.k].semilla && n && macetaViva(d.k)) {   // flor bioluminiscente: el núcleo que brilla ilumina a su alrededor de noche
        const S = SEMILLAS[ITEMS[d.k].semilla], cc = col((S && S.col) || '#ffe68a'), cx = r.cx, cy = r.y + Math.round(r.h * .28);
        ctx.fillStyle = 'rgba(' + cc[0] + ',' + cc[1] + ',' + cc[2] + ',.16)';
        for (let j = -13; j <= 13; j++) { const w = Math.round(14 * Math.sqrt(1 - (j / 13) * (j / 13))); ctx.fillRect(Math.round(cx - w), Math.round(cy + j), w * 2, 1); }
      }
      if (d.k === 'racha' && n && racha() > 0) {   // el cuadro de racha ilumina la pared de noche: resplandor plano, no de vela
        const hw = r.w / 2, hh = r.h / 2, cx = r.cx, cy = r.cy;
        [[9, .05], [6, .07], [3, .09], [1, .12]].forEach(([pad, a]) => {
          ctx.fillStyle = 'rgba(255,180,60,' + a + ')';
          ctx.fillRect(Math.round(cx - hw - pad), Math.round(cy - hh - pad), Math.round(r.w + pad * 2), Math.round(r.h + pad * 2));
        });
      }
      if (d.f) { ctx.save(); ctx.translate(r.x + r.w, r.y - hop); ctx.scale(-1, 1); ctx.drawImage(sp, 0, 0); ctx.restore(); }
      else ctx.drawImage(sp, r.x, r.y - hop);
      if (n && typeof luzMuebleDespues === 'function') luzMuebleDespues(d, r);   // partículas y destellos por delante
      if (edit && edit.sel === i) {
        ctx.fillStyle = (tk >> 2) % 2 ? '#ffe45a' : '#ffffff';
        ctx.fillRect(r.x - 2, r.y - 2, r.w + 4, 1); ctx.fillRect(r.x - 2, r.y + r.h + 1, r.w + 4, 1); ctx.fillRect(r.x - 2, r.y - 2, 1, r.h + 4); ctx.fillRect(r.x + r.w + 1, r.y - 2, 1, r.h + 4);
        if (ITEMS[d.k].slot === 'juguete') {
          const safe = zonaSeguraJuguete(r.w, r.h);
          ctx.fillStyle = (tk >> 3) % 2 ? 'rgba(76, 217, 100, 0.45)' : 'rgba(76, 217, 100, 0.25)';
          const zw = safe.maxX - safe.minX + r.w, zh = safe.maxBase - safe.minBase;
          const zx = Math.round(safe.minX - r.w / 2), zy = Math.round(safe.minBase - r.h);
          for (let kx = zx; kx <= zx + zw; kx += 4) { ctx.fillRect(kx, zy, 2, 1); ctx.fillRect(kx, zy + zh, 2, 1); }
          for (let ky = zy; ky <= zy + zh; ky += 4) { ctx.fillRect(zx, ky, 1, 2); ctx.fillRect(zx + zw, ky, 1, 2); }
        }
      }
    });
    if (capa === 'atras' && escenaId() === 'jardin') jardinMacetasFrente();   // las macetas siempre por encima de los muebles
  }
