  /* ===================== REGALO DIARIO ===================== */
  // (PREMIOS definido en config.js)
  function infoRegalo() {
    const h = hoy();
    if (e.ultimoRegalo === h) return null;
    let nr = 1, perdida = false;
    if (e.ultimoRegalo) {
      const d = difDias(e.ultimoRegalo, h);
      if (d < 0) return null;
      nr = e.racha + 1;   // la racha nunca se reinicia: si faltas, sigues con el regalo que te toca
    }
    return { nr, dia: ((nr - 1) % 7) + 1, perdida };
  }
  let ultimoPremio = null;
  function abrirRegalo() {
    const info = infoRegalo(); if (!info || ultimoPremio) return;
    e.racha = info.nr; e.mejorRacha = Math.max(e.mejorRacha || 0, e.racha); e.ultimoRegalo = hoy();
    let m = PREMIOS[info.dia - 1], item = null;
    if (info.dia === 7) { if (!e.tiene.monodorado) { e.tiene.monodorado = 1; item = 'monodorado'; } else m += 30; }
    e.monedas += m; e.total += m;
    ultimoPremio = { m, item, dia: info.dia, racha: e.racha };
    const nAntes = nivel();
    darXp(5 + info.dia);
    if (nivel() === nAntes) sfx.regalo();
    gesto('gran'); hablar(); estrellas(6);
    pintar(); guardar(); render();
  }

