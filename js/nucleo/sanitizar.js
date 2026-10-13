  /* === Sanitización post-carga === */
  function sanitizar(d) {
    const b = BASE();
    // Stats numéricos: clamp 0-100
    ['hambre', 'energia', 'feliz', 'limp'].forEach(k => {
      if (typeof d[k] !== 'number' || isNaN(d[k])) d[k] = b[k];
      else d[k] = clamp(d[k]);
    });
    // Numéricos sin rango
    ['monedas', 'xp', 'total', 'racha', 'mejorRacha', 'rachaComer', 'mejorComer', 'bombas', 'enf', 'enfAb', 'malS', 'meds', 'fuente', 'nHam', 'nFel'].forEach(k => {
      if (typeof d[k] !== 'number' || isNaN(d[k])) d[k] = b[k] != null ? b[k] : 0;
    });
    // Booleanos
    ['dormido', 'mudo', 'intro', 'traductor', 'musica', 'avisoMerc'].forEach(k => {
      d[k] = !!d[k];
    });
    // Strings
    ['nombre', 'ultComer', 'ultimoRegalo', 'hab'].forEach(k => {
      if (typeof d[k] !== 'string') d[k] = b[k] || '';
    });
    // Arrays
    ['album', 'notis', 'memPend', 'deco'].forEach(k => {
      if (!Array.isArray(d[k])) d[k] = b[k] || [];
    });
    // Objetos
    ['ropa', 'cuarto', 'tiene', 'st', 'ing', 'sec', 'pens', 'cod', 'comida', 'probo', 'logros', 'dibujos', 'adv', 'mimos', 'mimosDia', 'rt', 'mj', 'mem', 'run', 'eco'].forEach(k => {
      if (!d[k] || typeof d[k] !== 'object' || Array.isArray(d[k])) d[k] = b[k] || {};
    });
    // Hab válido
    if (!['sala', 'bano', 'juegos', 'estudio', 'cocina', 'entrada', 'jardin', 'espacial'].includes(d.hab)) d.hab = 'sala';
    if (!d.jardin || typeof d.jardin !== 'object' || !Array.isArray(d.jardin.plots)) d.jardin = { plots: [] };
    if (!d.semillas || typeof d.semillas !== 'object' || Array.isArray(d.semillas)) d.semillas = {};
    if (!d.macetaVida || typeof d.macetaVida !== 'object' || Array.isArray(d.macetaVida)) d.macetaVida = {};
    if (d.estAmb === 'tormenta' || d.estAmb === 'cafe') d.estAmb = '';
    return d;
  }
