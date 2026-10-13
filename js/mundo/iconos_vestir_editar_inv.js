  function iconoVes() {
    const g = Grid(11, 11), m = [
      '....ww.....',
      '...w..w....',
      '......w....',
      '.....w.....',
      '.....w.....',
      '....www....',
      '...w...w...',
      '..w.....w..',
      '.w.......w.',
      'wwwwwwwwwww',
      '...........'
    ];
    m.forEach((f, y) => [...f].forEach((ch, x) => {
      if (ch === 'w') g.set(x, y, '#e8ecff');
    }));
    return g;
  }
  $('b-editar').onclick = () => {
    tutRes(null);
    if (dlg || tutMenuBloq()) return;
    if (lugar || calle || vistaBloq) { toast('Aquí no puedes usar esto'); sfx.no(); return; }
    if (guiaBloq()) return;
    if (modal && modal !== 'editar') {
      if (['run', 'mem', 'rt'].includes(modal)) return;
      cerrar();
    }
    entrarEdicion();
  };
  function iconoEdi() {
    const g = Grid(11, 11), m = ['.....w.....', '....www....', '...wwwww...', '..wwwwwww..', '.wwwwwwwww.', 'wwwwwwwwwww', '.wwwwwwwww.', '.wwwkkkwww.', '.wwwkkkwww.', '.wwwkkkwww.', '...........'];
    m.forEach((f, y) => [...f].forEach((ch, x) => { if (ch === 'w') g.set(x, y, '#e8ecff'); else if (ch === 'k') g.set(x, y, '#232b63'); }));
    return g;
  }

  // (Sección de MINIJUEGOS ARCADE movida a minijuegos.js)

/* ===================== INVENTARIO ===================== */
