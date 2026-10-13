  /* ===================== LUNA AZUL: EL AURA LEGENDARIA (easter egg mensual) ===================== */
  let az = null, admAzul = false, azulFlash = 0, esferaXY = null;
  function lunaAzulT() {   // solo el día 15 de cada mes, de 00:00 a 00:59 en punto. Nunca choca con la dorada (domingo) ni la de sangre
    if (admAzul) return true;
    const cfg = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.lunaAzul) || {};
    const dMes = cfg.diaMes !== undefined ? cfg.diaMes : 15;
    const hReq = cfg.hora !== undefined ? cfg.hora : 0;
    const d = new Date(ahora());
    return d.getDate() === dMes && d.getHours() === hReq;
  }
  const lunaAzul = () => escenaId() === 'sala' && !ov && !bl && !az && !e.tiene.aura_legend && lunaAzulT();   // tocable solo si Simon aún no tiene el aura
  function lunaAzulGrid(v) {
    const g = Grid(60, 64), luna = elipse(36, 26, 6, 6), halo = elipse(36, 26, 10, 10);
    for (let y = 14; y < 40; y++) for (let x = 24; x < 49; x++) {
      if (luna(x, y)) g.set(x, y, BAY[y & 3][x & 3] > 9 ? '#eaf6ff' : '#7ac0ff');
      else if (v && halo(x, y) && (x + y) % 2 === 0) g.set(x, y, '#bfe0ff');
    }
    return g;
  }
  function esferaGrid(v) {
    const g = Grid(14, 14), cx = 6.5, cy = 6.5;
    capa(g, '#0a2a6a', L => sombrear(L, elipse(cx, cy, 5.3, 5.3), cx, cy, 5.3, 5.3, ['#eaf6ff', '#6ab0ff', '#2a68e0', '#0a2a8a']));
    if (v) [[0, -7], [5, -5], [7, 0], [5, 5], [0, 7], [-5, 5], [-7, 0], [-5, -5]].forEach(([dx, dy]) => g.set(Math.round(cx + dx), Math.round(cy + dy), '#bfe0ff'));
    g.set(Math.round(cx - 2), Math.round(cy - 2), '#ffffff');
    return g;
  }
  let azulInactT = 0;
  function azulTap() {
    azulInactT = 0;
    if (e.azulD !== hoy()) { e.azulT = 0; e.azulD = hoy(); }   // nueva aparición: reinicia el conteo de toques
    e.azulT = (e.azulT || 0) + 1; azulFlash = 10; const dy0 = RY - 59;
    seq([659, 880, 1047, 1319, 1568].slice(0, Math.min(5, e.azulT)), .07, 'triangle', .08);
    for (let i = 0; i < 5; i++) lanzar('estrella', OX + 31 + Math.random() * 12, dy0 + 20 + Math.random() * 12, (Math.random() - .5) * 1.2, -.4, 8 + i);
    const reqAz = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.lunaAzul && CONFIG_EASTEREGGS.lunaAzul.toquesRequeridos) || 5;
    if (e.azulT >= reqAz) { az = { f: 'explota', t: 0 }; lugar = null; llegada = null; if (e.hab !== 'sala') { e.hab = 'sala'; pintarNav(); } if (e.dormido) { e.dormido = false; sfx.despertar(); } act = null; proxAct = tk + 99999; }
    guardar();
  }
  function azulBrillo() {   // 0..1: qué tan iluminada está la recámara por la luna
    if (e.tiene.aura_legend) return 0;   // ya se obtuvo el aura: el filtro no se queda pegado el resto de la hora
    if (az && az.f === 'explota') return Math.min(1, .8 + az.t / 16 * .2);
    if (az) return 0;
    if (!lunaAzulT()) return 0;
    return Math.min(.8, (e.azulT || 0) * .2);
  }
  function esferaH() { return { x: SX + 44, y: SY + 18 }; }   // dónde se queda flotando la esfera, visible y despejada
  function azulTick() {
    if (azulFlash > 0) azulFlash--;
    if (!az) {
      if (e.azulT > 0 && e.azulT < 5) {
        if (++azulInactT > 300) { e.azulT = 0; azulInactT = 0; guardar(); }
      }
      return;
    }
    if (az.f === 'espera') {
      az.t++;
      if (az.t >= 600) {   // 60s sin tocar: la esfera se desvanece
        if (escenaId() === 'sala') {
          for (let i = 0; i < 8; i++) lanzar('estrella', esferaH().x, esferaH().y, (Math.random() - .5) * 2, (Math.random() - .5) * 2, 8 + i);
        }
        az = null; esferaXY = null; e.azulT = 0; guardar();
        toast('La esfera azul se desvaneció...');
        return;
      }
      return;
    }
    if (escenaId() !== 'sala') return;   // si se va de la sala durante la cinemática, espera
    az.t++;
    if (az.f === 'explota') {
      if (az.t === 1) retumbo();
      if (az.t === 10) seq([1760, 2217, 2793, 3520], .06, 'square', .08);
      if (az.t >= 16) { az.f = 'blanco'; az.t = 0; }
    } else if (az.f === 'blanco') {
      if (az.t >= 9) { az.f = 'cae'; az.t = 0; sfx.click(); }
    } else if (az.f === 'cae') {
      if (az.t >= 28) { az.f = 'espera'; az.t = 0; for (let i = 0; i < 6; i++) lanzar('estrella', esferaH().x, esferaH().y, (Math.random() - .5) * 1.4, -.4, 8 + i); }
    }
  }
  function esferaToca() {
    if (!az || az.f !== 'espera') return;
    az = null; esferaXY = null; e.tiene.aura_legend = 1; e.ropa.aura = 'aura_legend'; e.azulHecho = hoy(); guardar();
    sonidoUnico(); corazones(6); estrellas(10);
    setTimeout(() => fanfare({ g: () => prevGrid('aura_legend'), t: 'AURA LEGENDARIA', d: 'CAYÓ DEL CIELO EN LA LUNA AZUL. SOLO PASA UNA VEZ AL MES', mudo: true }), 500);
  }
  function azulVentana(dy) {   // dentro del cristal: la luna y la esfera mientras cae (detrás de los muebles y de Simon)
    if (!az && lunaAzulT() && !e.tiene.aura_legend) {
      const fu = azulFlash > 0 || (tk >> 3) % 2;
      ctx.drawImage(sprite('luna_az' + (fu ? 1 : 0), () => lunaAzulGrid(fu ? 1 : 0), 0), OX, dy);
    }
    if (az && az.f === 'cae') {
      const wx = OX + 29, wy = dy + 30, H = esferaH(), u = Math.min(1, az.t / 28), ue = u * u;
      const x = Math.round(wx + (H.x - wx) * ue), y = Math.round(wy + (H.y - wy) * ue);
      esferaXY = { x, y };
      const f = (tk >> 2) % 2;
      ctx.drawImage(sprite('esfera_az' + f, () => esferaGrid(f), 0), x - 7, y - 7);
    }
  }
  function azulFrente() {   // la esfera ya posada en la recámara, lista para tocarse
    if (!az || az.f !== 'espera') { if (!az) esferaXY = null; return; }
    const H = esferaH(), y = H.y + Math.round(Math.sin(tk / 9) * 2);
    esferaXY = { x: H.x, y };
    const f = (tk >> 2) % 2;
    ctx.drawImage(sprite('esfera_az' + f, () => esferaGrid(f), 0), H.x - 7, y - 7);
  }
  function azulLuz() {   // la luz azul que va llenando toda la recámara, y el destello blanco de la explosión
    if (escenaId() !== 'sala') return;
    const b = azulBrillo();
    if (b > 0) { ctx.fillStyle = 'rgba(90,170,255,' + (b * .4).toFixed(2) + ')'; ctx.fillRect(0, 0, LW, LH); }
    if (az && az.f === 'blanco') { const u = Math.min(1, az.t / 4); ctx.fillStyle = 'rgba(255,255,255,' + u.toFixed(2) + ')'; ctx.fillRect(0, 0, LW, LH); }
  }
