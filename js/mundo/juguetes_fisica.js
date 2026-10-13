    /* ===================== FÍSICA DE JUGUETES (TIPO POU) ===================== */
  const jugFis = {
    activo: false,
    arr: false,
    k: 'juguete_pelota',
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rad: 6,
    pts: [],
    id: null,
    ultimoReboteT: 0
  };
  function jugFisReset() {
    jugFis.activo = false;
    jugFis.arr = false;
    jugFis.vx = 0;
    jugFis.vy = 0;
    jugFis.pts = [];
    jugFis.id = null;
  }
  if (typeof window !== 'undefined') window.jugFisReset = jugFisReset;

  function sonarReboteJuguete(k, vel) {
    if (e.mudo) return;
    if (typeof audio === "function") audio();
    const v = Math.min(0.30, Math.max(0.04, (vel || 3) * 0.024));
    switch (k) {
      case 'juguete_azul':
        seq([480, 320], 0.022, 'triangle', v);
        break;
      case 'juguete_playa':
        seq([220, 160], 0.035, 'sine', v * 1.1);
        break;
      case 'juguete_dado':
        seq([160, 100], 0.02, 'square', v * 0.9);
        break;
      case 'juguete_disco':
        seq([720, 900], 0.02, 'triangle', v * 0.85);
        break;
      case 'juguete_patito':
        seq([920, 1350, 980], 0.025, 'sawtooth', v * 0.8);
        break;
      case 'juguete_osito':
        seq([140, 90], 0.035, 'triangle', v * 1.1);
        break;
      case 'juguete_keke':
        seq([580, 880], 0.028, 'sine', v * 0.9);
        break;
      case 'juguete_pelota':
      default:
        seq([380, 240], 0.025, 'sine', v);
        break;
    }
  }

  function jugPosIni() {
    const jk = juguetePuesto();
    let rj = null;
    if (lugar === 'parque') {
      const tj = sprite('tj_' + jk, () => ITEMS[jk].grid(), 0);
      rj = { x: SX + SW + 6, y: SY + SH - 4 - tj.height, w: tj.width, h: tj.height };
    } else {
      const esc = escenaId();
      const dj = e.deco.find(d => ITEMS[d.k] && ITEMS[d.k].slot === 'juguete' && (d.h || 'sala') === esc);
      if (dj) rj = posReal(dj);
      else {
        const dj0 = e.deco.find(d => ITEMS[d.k] && ITEMS[d.k].slot === 'juguete');
        if (dj0) rj = posReal(dj0);
      }
    }
    if (rj) return { x: rj.x + rj.w / 2, y: rj.y + rj.h / 2, rad: Math.max(5, Math.round(Math.min(rj.w, rj.h) / 2)), k: jk };
    return { x: SX + SW + 10, y: SY + SH - 10, rad: 6, k: jk };
  }

  function jugFisTick() {
    if (!jugFis.activo || jugFis.arr) return;
    const esc = typeof escenaId === 'function' ? escenaId() : 'sala';
    if ((esc !== 'sala' || lugar) && lugar !== 'parque') {
      jugFisReset();
      return;
    }
    const rad = jugFis.rad || 6;
    const minX = rad + 2;
    const maxX = LW - rad - 2;
    const minY = rad + 14;
    const floorLim = (typeof PISO !== 'undefined' && PISO < 9000) ? Math.min(LH - 4, PISO) : (LH - 4);
    const maxY = Math.min(LH - rad - 2, floorLim - rad);

    jugFis.vy += 0.20;
    jugFis.vx *= 0.994;
    jugFis.x += jugFis.vx;
    jugFis.y += jugFis.vy;

    let choco = false;
    let velImpacto = 0;

    if (jugFis.x <= minX) {
      jugFis.x = minX;
      velImpacto = Math.abs(jugFis.vx);
      jugFis.vx = -jugFis.vx * 0.88;
      choco = true;
    } else if (jugFis.x >= maxX) {
      jugFis.x = maxX;
      velImpacto = Math.abs(jugFis.vx);
      jugFis.vx = -jugFis.vx * 0.88;
      choco = true;
    }

    if (jugFis.y <= minY) {
      jugFis.y = minY;
      velImpacto = Math.max(velImpacto, Math.abs(jugFis.vy));
      jugFis.vy = -jugFis.vy * 0.85;
      choco = true;
    } else if (jugFis.y >= maxY) {
      jugFis.y = maxY;
      velImpacto = Math.max(velImpacto, Math.abs(jugFis.vy));
      jugFis.vy = -jugFis.vy * 0.78;
      jugFis.vx *= 0.90;
      choco = true;

      if (Math.abs(jugFis.vy) < 0.32 && Math.abs(jugFis.vx) < 0.25) {
        jugFis.vy = 0;
        jugFis.vx = 0;
        jugFis.activo = false;
      }
    }

    if (choco && velImpacto > 0.35 && (tk - jugFis.ultimoReboteT > 1 || jugFis.ultimoReboteT === 0)) {
      jugFis.ultimoReboteT = tk;
      sonarReboteJuguete(jugFis.k, velImpacto);
    }
  }

  function jugLanzar(vx, vy) {
    const p = jugPosIni();
    jugFis.k = p.k;
    jugFis.rad = p.rad;
    if (!jugFis.activo) {
      jugFis.x = p.x;
      jugFis.y = p.y;
    }
    jugFis.vx = vx;
    jugFis.vy = vy;
    jugFis.activo = true;
    jugFis.arr = false;
  }

  const fx = [];
  function lanzar(tipo, x, y, vx, vy, vida) { fx.push({ tipo, x, y, vx, vy, vida, t: 0 }); }


