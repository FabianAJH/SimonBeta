  const salaParC = {};
  function salaPared(cx, cy, w, h) {   // nada puede tapar la ventana ni el marco de fotos de la sala
    const dy = RY - 59;
    // ventana (izquierda) + marco de fotos/cuadro (derecha, offset 66,15 dentro de derechaGrid pegado en OX,dy; tamaño 38x30)
    const R = [[OX - 1, dy + 6, OX + 61, dy + 65], [OX + 65, dy + 14, OX + 105, dy + 46]];
    const x0 = w / 2 + 2, x1 = LW - w / 2 - 2, y0 = Math.min(RY - 59 + 3, 12) + h / 2, y1 = RY + 16 - h / 2;
    const ok = (x, y) => !R.some(r => x - w / 2 < r[2] && x + w / 2 > r[0] && y - h / 2 < r[3] && y + h / 2 > r[1]);
    cx = lim(cx, x0, x1); cy = lim(cy, y0, y1); if (ok(cx, cy)) return [cx, cy];
    const key = [w, h, Math.round(cx), Math.round(cy), LW, RY].join('|'); if (salaParC[key]) return salaParC[key];
    let best = null, bd = 1e9; for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) { const dd = (x - cx) * (x - cx) + (y - cy) * (y - cy); if (dd < bd && ok(x, y)) { bd = dd; best = [x, y]; } }
    return (salaParC[key] = best || [cx, cy]);
  }
  const juegosParC = {};
  function juegosPared(cx, cy, w, h) {   // nada puede tapar el arcade ni los trofeos de la sala de juegos
    const R = [[OX - 2, RY - 44, OX + 40, RY + 40], [OX + 76, RY - 40, OX + 120, RY]];
    const x0 = w / 2 + 2, x1 = LW - w / 2 - 2, y0 = Math.min(RY - 59 + 3, 12) + h / 2, y1 = RY + 16 - h / 2;
    const ok = (x, y) => !R.some(r => x - w / 2 < r[2] && x + w / 2 > r[0] && y - h / 2 < r[3] && y + h / 2 > r[1]);
    cx = lim(cx, x0, x1); cy = lim(cy, y0, y1); if (ok(cx, cy)) return [cx, cy];
    const key = [w, h, Math.round(cx), Math.round(cy), LW, RY].join('|'); if (juegosParC[key]) return juegosParC[key];
    let best = null, bd = 1e9; for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) { const dd = (x - cx) * (x - cx) + (y - cy) * (y - cy); if (dd < bd && ok(x, y)) { bd = dd; best = [x, y]; } }
    return (juegosParC[key] = best || [cx, cy]);
  }
  const cocParC = {};
  function cocPared(cx, cy, w, h) {   // lo colgado en la cocina no puede tapar repisas, refri, ventana, estufa ni lo que está en las repisas
    const R = repisasCoc(OX, RY, LW).map(q => [q[0] - 1, q[2] - 1, q[1] + 1, q[2] + 8]), rf = (e.cuarto.refri && ITEMS[e.cuarto.refri] && ITEMS[e.cuarto.refri].refri) || {};
    R.push([OX + 90 - (rf.ancho || 0), RY - 31 - (rf.alto || 0), OX + 116 - 6, RY + 60], [OX + 9 + 6, RY - 47, OX + 51, RY + 1], [0, RY - 2, LW, RY + 70]);   // junto a la ventana y al refri se deja pasar un poco para aprovechar la pared de los lados
    e.deco.forEach(o => { if ((o.h || 'sala') !== 'cocina' || !ITEMS[o.k] || esPared(o.k) || ITEMS[o.k].slot === 'juguete') return; const r = posReal(o); if (r.base < RY - 10) R.push([r.x - 1, r.y - 1, r.x + r.w + 1, r.y + r.h + 1]); });
    const x0 = w / 2 + 2, x1 = LW - w / 2 - 2, y0 = Math.min(RY - 59 + 3, 12) + h / 2, y1 = RY - 2 - h / 2, ok = (x, y) => !R.some(r => x - w / 2 < r[2] && x + w / 2 > r[0] && y - h / 2 < r[3] && y + h / 2 > r[1]);
    cx = lim(cx, x0, x1); cy = lim(cy, y0, y1); if (ok(cx, cy)) return [cx, cy];
    const key = [w, h, Math.round(cx), Math.round(cy), LW, RY, R.map(r => r.join()).join(';')].join('|'); if (cocParC[key]) return cocParC[key];
    let best = null, bd = 1e9; for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) { const dd = (x - cx) * (x - cx) + (y - cy) * (y - cy); if (dd < bd && ok(x, y)) { bd = dd; best = [x, y]; } }
    return (cocParC[key] = best || [cx, cy]);
  }
  // Muebles de piso vs. cosas fijas del cuarto (arcade, refri, estufa, puerta): la mitad de abajo SÍ se puede tapar, la de arriba NO.
  // Es decir: el borde de arriba del mueble no puede quedar más arriba de la mitad de la cosa fija. Si queda, se baja el mueble (si hay piso) o se aparta de lado, lo que mueva menos.
  function zonasProt(hab) {   // [x0, x1, arriba, abajo, 'full' = no se puede tapar nada]
    const FY = RY + 35;
    if (hab === 'juegos') { const a = arcPos(); return [[a.x, a.x + 32, a.y, a.y + 72], [OX + 76, OX + 120, RY - 40, RY, 'full']]; }   // arcade, trofeos
    if (hab === 'cocina') { const rf = (e.cuarto.refri && ITEMS[e.cuarto.refri] && ITEMS[e.cuarto.refri].refri) || {}; return [[OX, OX + 31, RY - 8, FY], [OX + 91 - (rf.ancho || 0), OX + 115, RY - 26 - (rf.alto || 0), FY]]; }   // estufa, refri
    if (hab === 'entrada') return [[OX + 8, OX + 46, RY - 40, FY]];   // puerta
    return [];
  }
  function zonasLibre(hab, cx, base, w, h) {
    const Z = zonasProt(hab); if (!Z.length) return [cx, base];
    const maxB = Math.min(LH - 3, PISO), x0 = w / 2 + 2, x1 = LW - w / 2 - 2, tope = z => z[4] === 'full' ? z[3] : (z[2] + z[3]) / 2;
    const choca = (c, b) => Z.some(z => b - h < tope(z) && b > z[2] && c + w / 2 > z[0] && c - w / 2 < z[1]);
    if (!choca(cx, base)) return [cx, base];
    let best = null, bd = 1e9;
    Z.forEach(z => { const b2 = Math.ceil(tope(z) + h); if (b2 <= maxB && b2 >= base && !choca(cx, b2) && b2 - base < bd) { bd = b2 - base; best = [cx, b2]; } });
    Z.forEach(z => [z[0] - w / 2, z[1] + w / 2].forEach(c => { c = lim(Math.round(c), x0, x1); if (!choca(c, base) && Math.abs(c - cx) < bd) { bd = Math.abs(c - cx); best = [c, base]; } }));
    return best || [cx, base];
  }
