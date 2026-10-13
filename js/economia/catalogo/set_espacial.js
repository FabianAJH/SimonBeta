  /* ===================== SET ESPACIAL (3 prendas + aura premium de colección) =====================
     Se carga DESPUÉS de baratas.js (y de nuevos_v2_ropa.js) a propósito: igual que ese archivo, así el
     precio y nivel que se registran aquí con registrarRopa() son los definitivos y no sufren el ajuste
     global x1.5 de baratas.js, que ya se aplicó una sola vez a los items anteriores. Ver _orden_de_carga.txt.
     El SET: TRAJE ESPACIAL (sudadera, nueva) + JET-PACK (espalda, nuevo) + CASCO ESPACIAL (orejas, ya
     existente, secreto). Al completarse los 3, se otorga automáticamente AURA ESPACIAL (premio de set,
     no se compra), con un resplandor que traza el contorno real del cuerpo de Simon (no partículas
     sueltas, a diferencia del resto de auras). */

  // ---------- TRAJE ESPACIAL: mono plateado/blanco con panel de pecho cian y costuras metálicas ----------
  (() => {
    const cs = ['#e8edf4', '#4af0d0'];   // plateado/blanco + acento cian espacial (misma paleta de recamara_espacial.js)
    const pals = cs.map(pal4);
    const f = (x, y) => {
      if (Math.abs(x + .5 - 28) <= 2 && y >= 53) return 1;              // franja central cian (cierre/cableado)
      if ((y === 55 || y === 61) && x >= 16 && x <= 40) return 1;        // costuras horizontales metálicas
      return 0;
    };
    SUDS.traje_espacial = [pals[0], mixC(cs[0], -.8), mixC(cs[0], -.5)];
    SUDP.traje_espacial = { pals: pals.map(P => P.map(c => col(c))), f, est: 23 };
  })();

  // ---------- JET-PACK: mochila con dos propulsores y llamita estática de propulsión ----------
  ACC2.jetpack = g => {
    const MET = ['#e4e8f2', '#aab2c0', '#6a7488', '#3a4254'], TUB = ['#c8d8e0', '#8aa0ac', '#4a6068', '#243038'];
    // placa dorsal central
    capa(g, '#2a3040', L => sombrear(L, (x, y) => y >= 50 && y <= 74 && Math.abs(x + .5 - 28) <= 7, 28, 62, 7, 12, MET));
    // dos propulsores cilíndricos a los costados
    [18, 38].forEach(cx => {
      capa(g, '#2a3040', L => sombrear(L, (x, y) => y >= 47 && y <= 73 && Math.abs(x + .5 - cx) <= 5.4, cx, 60, 5.4, 13, TUB));
      for (let y = 50; y <= 70; y += 6) g.rect(cx - 5, y, 11, 1, '#1c2230');                         // anillos de la tobera
      g.rect(cx - 5, 47, 11, 2, '#f4fbff'); g.rect(cx - 5, 47, 11, 1, '#9ad8ff');                    // tapa superior brillante
      // boquilla de la tobera (abertura oscura) + llamita de propulsión estática
      capa(g, '#0a0e18', L => sombrear(L, elipse(cx, 73, 4.6, 2.6), cx, 73, 4.6, 2.6, ['#5a6578', '#2a3040', '#141820', '#060810']));
      [[0, '#fff6a0'], [1, '#ffd84a'], [2, '#4af0d0']].forEach(([d, c]) => g.rect(cx - 3 + d, 76 + d, 6 - d * 2, 2, c));
    });
    // tira de luz cian horizontal que conecta ambos propulsores (detalle espacial)
    g.rect(16, 52, 24, 1, '#4af0d0'); g.rect(16, 52, 1, 1, '#9ad8ff'); g.rect(39, 52, 1, 1, '#9ad8ff');
  };

  // ---------- AURA ESPACIAL: halo de contorno (silueta), no partículas sueltas ----------
  // Se aproxima la silueta de Simon de pie con las mismas 3 formas que usa simonGrid (cabeza/cuerpo,
  // brazos y piernas), se "infla" por capas hacia afuera (igual idea que conBorde/contour en pixel_art.js,
  // pero pintando directo en el lienzo final en vez de crear un grid más grande) y se pinta cada anillo
  // con un color de la paleta espacial, más intenso pegado al cuerpo y más tenue (con trama/dither) hacia
  // afuera. "fr" (0-39) hace que el brillo respire (pulso de intensidad) y rote de tono entre los 3 colores.
  const ESP_PAL = ['#9ad8ff', '#4af0d0', '#7a5ae0'];
  function siluetaSimon(x, y) {
    if (((x + .5 - 28) / 25) ** 2 + ((y + .5 - 32) / 20) ** 2 <= 1) return true;              // cabeza/cuerpo
    if (y >= 50 && y <= 69 && Math.abs(x + .5 - 28) <= 15 + (y - 50) * .12) return true;      // torso (sudadera)
    if ((((x + .5 - 8) / 5.5) ** 2 + ((y + .5 - 58) / 11) ** 2 <= 1) ||
        (((x + .5 - 48) / 5.5) ** 2 + ((y + .5 - 58) / 11) ** 2 <= 1)) return true;           // brazos
    if ((((x + .5 - 19) / 8.5) ** 2 + ((y + .5 - 70) / 7.5) ** 2 <= 1) ||
        (((x + .5 - 37) / 8.5) ** 2 + ((y + .5 - 70) / 7.5) ** 2 <= 1)) return true;           // piernas
    return false;
  }
  function dentro(x, y) { return x >= 0 && y >= 0 && x < SW && y < SH && siluetaSimon(x, y); }
  ACC2.aura_espacial = (g, fr) => {
    const f = fr || 0;
    const pulso = .55 + .45 * Math.sin(f / 40 * Math.PI * 2);       // 0.1 .. 1, el halo "respira"
    const giro = Math.floor(f / 13) % ESP_PAL.length;                // rota el tono base cada ~1/3 de ciclo
    const col1 = ESP_PAL[giro], col2 = ESP_PAL[(giro + 1) % ESP_PAL.length], col3 = ESP_PAL[(giro + 2) % ESP_PAL.length];
    const key = (x, y) => x + ',' + y;
    // anillo 0 (justo pegado al borde del cuerpo): sólido, el más brillante
    const anillo0 = new Set();
    for (let y = -1; y <= SH; y++) for (let x = -1; x <= SW; x++) {
      if (dentro(x, y)) continue;
      if (dentro(x - 1, y) || dentro(x + 1, y) || dentro(x, y - 1) || dentro(x, y + 1)) { anillo0.add(key(x, y)); g.set(x, y, pulso > .35 ? col1 : mixC(col1, -.3)); }
    }
    // anillo 1: un paso más afuera, con trama (dither) para que se vea translúcido, no sólido
    const anillo1 = new Set();
    for (let y = -2; y <= SH + 1; y++) for (let x = -2; x <= SW + 1; x++) {
      if (dentro(x, y) || anillo0.has(key(x, y))) continue;
      if (anillo0.has(key(x - 1, y)) || anillo0.has(key(x + 1, y)) || anillo0.has(key(x, y - 1)) || anillo0.has(key(x, y + 1))) {
        anillo1.add(key(x, y));
        if ((x + y + Math.floor(f / 4)) % 2 === 0 || pulso > .7) g.set(x, y, col2);
      }
    }
    // anillo 2: el más externo, muy tenue, solo 1 de cada 3-4 pixeles (translúcido de verdad)
    for (let y = -3; y <= SH + 2; y++) for (let x = -3; x <= SW + 2; x++) {
      if (dentro(x, y) || anillo0.has(key(x, y)) || anillo1.has(key(x, y))) continue;
      const vecino = anillo1.has(key(x - 1, y)) || anillo1.has(key(x + 1, y)) || anillo1.has(key(x, y - 1)) || anillo1.has(key(x, y + 1));
      if (vecino && (x * 3 + y * 5 + Math.floor(f / 6)) % 4 === 0) g.set(x, y, col3);
    }
  };

  // ---------- registro final de las dos prendas nuevas (precio/nivel definitivos de tienda) ----------
  registrarRopa({ id: 'traje_espacial', nombre: 'TRAJE ESPACIAL', slot: 'sudadera', precio: 365, nivel: 47, crop: [0, 44, 56, 34] });
  registrarRopa({ id: 'jetpack', nombre: 'JET-PACK', slot: 'espalda', precio: 380, nivel: 48 });

  // ---------- AURA ESPACIAL: premio del set, no se compra (mismo patrón que sud_realeza/halo_dorado/cuernos_dragon) ----------
  ITEMS.aura_espacial = { tipo: 'ropa', slot: 'aura', n: 'AURA ESPACIAL', p: 0, nv: 1, crop: CR.aura, regalo: 'logro', prem: 'SET ESPACIAL' };

  // ---------- SET ESPACIAL: traje + jet-pack + casco espacial (secreto, ya existente; solo se referencia su clave) ----------
  PREM_SETS.push({ id: 'espacial', n: 'ESPACIAL', items: ['traje_espacial', 'jetpack', 'casco_espacial'], premio: 'aura_espacial' });
