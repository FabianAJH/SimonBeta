  /* ===================== ESTRELLA FUGAZ → MINI PLATILLO VOLADOR ===================== */
  // De noche con cielo despejado. Tres deseos (tres noches distintas) regalan el mini platillo.
  let fz = null, admFz = false;
  const fzPos = () => { const u = fz.t / fz.len; return { x: OX + 43 + (16 - 43) * u, y: RY - 59 + 19 + (38 - 19) * u }; };
  function fzAtrapa() {
    const q = fzPos(); fz = null; const h = hoy(); e.fugazD = e.fugazD || [];
    for (let i = 0; i < 8; i++) lanzar('estrella', q.x - 3 + Math.random() * 6, q.y - 3 + Math.random() * 6, (Math.random() - .5) * 2, (Math.random() - .5) * 2, 8 + i);
    seq([1568, 2093, 2637], .06, 'triangle', .07);
    if (e.fugazD.includes(h)) { toast('Otra estrella... ya pediste tu deseo de esta noche'); return; }
    e.fugazD.push(h);
    const reqDes = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.estrellaFugaz && CONFIG_EASTEREGGS.estrellaFugaz.deseosRequeridos) || 3;
    if (e.fugazD.length >= reqDes && !e.tiene.platillo_mini) {
      e.tiene.platillo_mini = 1; colocar('platillo_mini'); guardar();
      setTimeout(() => fanfare({ g: () => platilloGrid(), t: 'MINI PLATILLO VOLADOR', d: '¡CAYÓ DEL CIELO TRAS TRES DESEOS!' }), 500);
    } else { toast('¡Una estrella fugaz! Pides un deseo...'); guardar(); }
  }
  function fugazTick() {
    const probFz = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.estrellaFugaz && CONFIG_EASTEREGGS.estrellaFugaz.probabilidad) || 0.09;
    if (!ov && !fz && ventNoche() && !e.tiene.platillo_mini && tk % 15 === 0 && Math.random() < (admFz ? .45 : probFz)) fz = { t: 0, len: 16 };
    if (fz && ++fz.t > fz.len) fz = null;
  }
  function fugazDibujo(dy) {   // la estrella fugaz cruzando el cristal de la ventana
    if (fz) {
      const q = fzPos(), C = ['#ffffff', '#fff6a8', '#ffe066', '#c8b050', '#8a7a40', '#5a5030'];
      for (let i = 5; i >= 0; i--) { const u = Math.max(0, fz.t - i * .9) / fz.len, x = OX + 43 + (16 - 43) * u, y = dy + 19 + (38 - 19) * u; ctx.fillStyle = C[i]; ctx.fillRect(Math.round(x), Math.round(y), i < 2 ? 2 : 1, i < 2 ? 2 : 1); }
    }
  }
