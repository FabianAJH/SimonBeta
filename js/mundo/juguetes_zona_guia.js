  function zonaSeguraJuguete(w, h) {
    const hw = (w || 12) / 2;
    let minX = OX + 24 + hw;
    let maxX = OX + 74 - hw;
    let minBase = RY + 34;
    let maxBase = Math.min(LH - 12, PISO - 8);

    if (typeof document !== 'undefined' && typeof cv !== 'undefined' && cv && cv.getBoundingClientRect) {
      const rCv = cv.getBoundingClientRect();
      if (rCv.width > 0 && rCv.height > 0) {
        const elLat = document.querySelector('.lateral');
        if (elLat) {
          const rLat = elLat.getBoundingClientRect();
          if (rLat.width > 0 && rLat.left < rCv.right) {
            const latCanvasX = (rLat.left - rCv.left) / rCv.width * LW;
            const safeRight = Math.floor(latCanvasX - hw - 3);
            if (safeRight > minX + 16) maxX = Math.min(maxX, safeRight);
          }
        }
        const elMis = document.querySelector('#t-mis') || document.querySelector('.tareas');
        if (elMis) {
          const rMis = elMis.getBoundingClientRect();
          if (rMis.width > 0 && rMis.right > rCv.left) {
            const misCanvasX = (rMis.right - rCv.left) / rCv.width * LW;
            const safeLeft = Math.ceil(misCanvasX + hw + 3);
            if (safeLeft < maxX - 16) minX = Math.max(minX, safeLeft);
          }
        }
        const elBot = document.querySelector('.botones');
        if (elBot) {
          const rBot = elBot.getBoundingClientRect();
          if (rBot.height > 0) {
            const botCanvasY = (rBot.top - rCv.top) / rCv.height * LH;
            const safeBottom = Math.floor(botCanvasY - 8);
            if (safeBottom > minBase + 20) maxBase = Math.min(maxBase, safeBottom);
          }
        }
      }
    }
    if (minX > maxX) { const mid = (minX + maxX) / 2; minX = mid - 4; maxX = mid + 4; }
    if (minBase > maxBase) { minBase = Math.max(RY + 10, maxBase - 12); }
    return { minX, maxX, minBase, maxBase };
  }
  if (typeof window !== 'undefined') window.zonaSeguraJuguete = zonaSeguraJuguete;

  function posReal(d) {
    if ((d.h || 'sala') === 'estudio' && ITEMS[d.k] && ITEMS[d.k].zona) return estPos(d);
    const sp = sprite('mu_' + d.k, ITEMS[d.k].grid, 0), w = sp.width, h = sp.height, pared = esPared(d.k);
    let cx = lim(LW / 2 + d.x, w / 2 + 2, LW - w / 2 - 2);
    if (pared) { const minCy = Math.min(RY - 59 + 3, 12) + h / 2; let cy = lim(RY + d.y, minCy, RY + 16 - h / 2); if ((d.h || 'sala') === 'cocina') { const q = cocPared(cx, cy, w, h); cx = q[0]; cy = q[1]; } else if ((d.h || 'sala') === 'sala' || (d.h || 'sala') === 'espacial') { const q = salaPared(cx, cy, w, h); cx = q[0]; cy = q[1]; } else if ((d.h || 'sala') === 'juegos') { const q = juegosPared(cx, cy, w, h); cx = q[0]; cy = q[1]; } return { x: Math.round(cx - w / 2), y: Math.round(cy - h / 2), w, h, cx, cy, base: cy + h / 2 }; }
    let base;
    if ((d.h || 'sala') === 'cocina') {   // en la cocina: en una repisa, sobre la barra (entre la estufa y el refri) o en el piso
      const y0 = RY + d.y;
      const sh = y0 < RY - 14 ? repisasCoc(OX, RY, LW).filter(q => w <= q[1] - q[0] && h <= q[3]).map(q => [q, Math.abs(y0 - q[2]) + .6 * Math.max(0, Math.max(q[0] - cx, cx - q[1]))]).sort((u, v) => u[1] - v[1])[0] : null;
      if (sh) { cx = lim(cx, sh[0][0] + w / 2, sh[0][1] - w / 2); base = sh[0][2]; }
      else if (y0 < RY + 18) { const I = [[2, OX - 2], [OX + 34, OX + 89], [OX + 117, LW - 2]].filter(q => q[1] - q[0] >= w), q = I.length ? I.reduce((u, v) => Math.min(Math.abs(cx - u[0]), Math.abs(cx - u[1])) * (cx >= u[0] && cx <= u[1] ? 0 : 1) <= Math.min(Math.abs(cx - v[0]), Math.abs(cx - v[1])) * (cx >= v[0] && cx <= v[1] ? 0 : 1) ? u : v) : [OX + 34, OX + 89]; cx = q[1] - q[0] >= w ? lim(cx, q[0] + w / 2, q[1] - w / 2) : (q[0] + q[1]) / 2; base = RY + 5; }
      else { base = lim(y0, RY + 30, Math.min(LH - 3, PISO)); const q = zonasLibre('cocina', cx, base, w, h); cx = q[0]; base = q[1]; }
    }
    else {
      base = lim(RY + d.y, RY + 30, Math.min(LH - 3, PISO));
      if ((d.h || 'sala') === 'juegos' || (d.h || 'sala') === 'entrada') { const q = zonasLibre(d.h, cx, base, w, h); cx = q[0]; base = q[1]; }
    }
    if (ITEMS[d.k] && ITEMS[d.k].slot === 'juguete') {
      const safe = zonaSeguraJuguete(w, h);
      cx = lim(cx, safe.minX, safe.maxX);
      base = lim(base, safe.minBase, safe.maxBase);
    }
    return { x: Math.round(cx - w / 2), y: Math.round(base - h), w, h, cx, cy: base - h / 2, base };
  }
  function dibujarGuiaJuguete() {
    if (!guia || guia.paso !== 'jugar' || escenaId() !== 'sala') return;
    let tx = 0, ty = 0;
    if (jugFis.activo || jugFis.arr) {
      tx = jugFis.x;
      ty = jugFis.y;
    } else {
      const dj = e.deco && e.deco.find(d => ITEMS[d.k] && ITEMS[d.k].slot === 'juguete' && (d.h || 'sala') === 'sala');
      if (dj) {
        const r = posReal(dj);
        tx = r.cx;
        ty = r.y;
      } else {
        tx = SX + SW + 8;
        ty = SY + SH - 10;
      }
    }
    const bob = Math.round(Math.sin(tk * 0.22) * 3);
    const ay = ty - 14 + bob;

    ctx.fillStyle = '#101428';
    ctx.fillRect(Math.round(tx - 2), Math.round(ay - 8), 5, 1);
    ctx.fillRect(Math.round(tx - 4), Math.round(ay - 3), 1, 3);
    ctx.fillRect(Math.round(tx + 4), Math.round(ay - 3), 1, 3);
    ctx.fillRect(Math.round(tx - 6), Math.round(ay - 1), 1, 3);
    ctx.fillRect(Math.round(tx + 6), Math.round(ay - 1), 1, 3);
    ctx.fillRect(Math.round(tx - 2), Math.round(ay + 4), 5, 1);

    ctx.fillStyle = '#ffd84a';
    ctx.fillRect(Math.round(tx - 1), Math.round(ay - 7), 3, 5);
    ctx.fillRect(Math.round(tx - 3), Math.round(ay - 2), 7, 2);
    ctx.fillRect(Math.round(tx - 5), Math.round(ay), 11, 2);
    ctx.fillRect(Math.round(tx - 3), Math.round(ay + 2), 7, 1);
    ctx.fillRect(Math.round(tx - 1), Math.round(ay + 3), 3, 1);

  }

