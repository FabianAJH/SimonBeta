  const GLEN = { baile: 14, giro: 10, robot: 16, twist: 12 };
  const GESTOS = [
    { nv: 1, id: 'salto', n: 'SALTITO' }, { nv: 3, id: 'baile', n: 'BAILE' }, { nv: 5, id: 'giro', n: 'GIRO' },
    { nv: 8, id: 'besos', n: 'BESOS' }, { nv: 12, id: 'gran', n: 'GRAN SHOW' }, { nv: 16, id: 'robot', n: 'ROBOT' }, { nv: 20, id: 'twist', n: 'TWIST' }
  ];
  function gesto(id) {
    if (!id) { const ok = GESTOS.filter(g => g.nv <= nivel()); id = ok[Math.floor(Math.random() * ok.length)].id; }
    gT = -1; gTipo = '';
    if (id === 'baile') { gTipo = 'baile'; gT = 0; saltoT = -1; }
    else if (id === 'giro') { gTipo = 'giro'; gT = 0; saltoT = 0; }
    else if (id === 'robot') { gTipo = 'robot'; gT = 0; saltoT = -1; }
    else if (id === 'twist') { gTipo = 'twist'; gT = 0; saltoT = -1; }
    else if (id === 'besos') { saltoT = 0; corazones(5); }
    else if (id === 'gran') { gTipo = 'giro'; gT = 0; saltoT = 0; corazones(4); estrellas(8); }
    else saltoT = 0;
  }
