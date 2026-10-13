  Object.keys(nuevosItems).forEach(k => { const [n, p, nv, slot, grid, tema, luz] = nuevosItems[k]; ITEMS[k] = { tipo: 'cuarto', slot, n, p, nv, grid, tema }; if (luz) ITEMS[k].luz = true; if (tema === 'estudio') ITEMS[k].zona = slot === 'decoP' ? 'col' : 'est'; });
  Object.assign(ITEMS.sofa, { tema: 'sala' }); ['mesita', 'librero', 'tele', 'acuario', 'baul', 'globo', 'telescopio', 'estante'].forEach(k => { ITEMS[k].tema = 'sala'; });
  ITEMS.cuadro_keke.tema = 'cocina'; ITEMS.espejo.tema = 'entrada';
  const temaDe = k => (ITEMS[k] && ITEMS[k].tema) || 'todas';
  const iconoHabDe = k => { const t = temaDe(k); return (t === 'estudio' || t === 'bano' || t === 'jardin' || (ITEMS[k] && ITEMS[k].exclusivo)) ? (HAB_ICO[t] || '') : ''; };   // estudio, baño y los ítems exclusivos de una habitación (camas, clóset, etc.) restringen dónde se puede colocar (ver colocar())
  const MERC_POOL = ['sud_dorada', 'sud_negra', 'sud_morada', 'monoculo', 'bufanda_dorada', 'pared_noche', 'alf_dorada', 'dino', 'cohete', 'marco_planeta'];
  const ORDEN = {
    ropa: ['sud_azul', 'sud_roja', 'sud_verde', 'sud_naranja', 'sud_rosa', 'sud_celeste', 'gafas', 'gafas_corazon', 'mono', 'corbata', 'bufanda', 'collar', 'audifonos', 'orejas_gato', 'capa_roja', 'capa_azul', 'monodorado', 'sud_calabaza', 'sud_navidad', 'sud_dorada', 'sud_negra', 'sud_morada', 'monoculo', 'bufanda_dorada', 'sud_arcoiris'],
    comida: [],
    cuarto: ['pared_azul', 'pared_rosa', 'pared_verde', 'alf_roja', 'alf_azul', 'alf_verde', 'planta', 'guitarra', 'lampara', 'pato', 'pared_noche', 'alf_dorada', 'dino', 'cohete', 'pared_halloween', 'calabaza', 'arbol', 'neon_si', 'mesita', 'maceta', 'cactus', 'baul', 'sofa', 'librero', 'tele', 'globo', 'acuario', 'telescopio', 'reloj', 'cuadro_keke', 'guirnalda', 'estante', 'neon_corazon', 'espejo']
  };
  ORDEN.cuarto.push('marco_keke', 'marco_cortex', 'marco_planeta', 'marco_boom', 'marco_estrellas');
  const PORDEFECTO = { sudadera: 1, pared: 1, alfombra: 1, cuadro: 1, juguete: 1 };   // estos huecos siempre llevan algo puesto

