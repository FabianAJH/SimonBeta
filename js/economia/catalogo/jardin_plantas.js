  /* ===================== JARDÍN: SEMILLAS Y MACETAS COSECHADAS ===================== */
  // semillas alienígenas de un planeta que Simon no recuerda conscientemente, pero que le hacen cosquillas en la memoria
  const SEMILLAS = {
    brote: { n: 'Flor Espectro', rareza: 'Común', diasCrecer: 2, diasVida: 5, efecto: 'Mientras esté viva (en cualquier cuarto), la felicidad baja más lento.', precio: 40, col: '#caa6e0', planta: plantaEspectro },
    raiz: { n: 'Anémona Calma', rareza: 'Poco común', diasCrecer: 4, diasVida: 7, efecto: 'Mientras esté viva (en cualquier cuarto), la energía se recupera más rápido al dormir.', precio: 90, col: '#6ad0ff', planta: plantaCalma },
    eco: { n: 'Flor de Eco', rareza: 'Rara', diasCrecer: 3, diasVida: 6, efecto: 'Mientras esté viva, comer y jugar con Simon rinden un 10% más.', precio: 150, col: '#9adde4', planta: plantaEco },
    dorada: { n: 'Espora Dorada', rareza: 'Muy rara', diasCrecer: 5, diasVida: 8, efecto: 'Mientras esté viva, suelta monedas poco a poco.', precio: 220, col: '#ffd84a', planta: plantaDorada },
    eterna: { n: 'Flor Eterna', rareza: 'Legendaria', diasCrecer: 7, diasVida: 999999, efecto: 'Nunca se marchita. Al cosecharla te da el Aura Eterna. Con esa aura puesta y la maceta colocada, Simon levita.', precio: 2500, col: '#ffe68a', planta: plantaEterna, exclusivo: true }
  };
  function semillaGrid(id) {   // sobrecito de semillas para la tienda/inventario
    if (id === 'suerte' && typeof semillaSuerteGrid === 'function') return semillaSuerteGrid();
    if (id === 'solar' && typeof semillaSolGrid === 'function') return semillaSolGrid();
    const g = Grid(14, 16), c = SEMILLAS[id].col;
    g.rect(1, 3, 12, 12, '#e8d8a8'); g.rect(1, 3, 12, 1, '#fff2d0'); g.rect(1, 3, 1, 12, '#fff2d0'); g.rect(11, 3, 2, 12, '#b89860'); g.rect(1, 14, 12, 1, '#b89860');
    g.rect(2, 0, 10, 5, '#8a6a3a'); g.rect(3, 1, 8, 3, '#6a4a22');
    g.set(5, 8, c); g.set(8, 9, c); g.set(6, 11, c); g.set(5, 9, mixC(c, -.3)); g.set(8, 10, mixC(c, -.3));
    return g;
  }
  function semillaEternaGrid() {   // sobrecito dorado y oscuro: la semilla que vende Cortex, aparte del catálogo normal de SEMILLAS
    const g = Grid(14, 16), c = '#ffd84a';
    g.rect(1, 3, 12, 12, '#2a1830'); g.rect(1, 3, 12, 1, '#4a2a5a'); g.rect(1, 3, 1, 12, '#4a2a5a'); g.rect(11, 3, 2, 12, '#120a18'); g.rect(1, 14, 12, 1, '#120a18');
    g.rect(2, 0, 10, 5, '#8a6a1a'); g.rect(3, 1, 8, 3, '#5a4210');
    g.set(5, 8, c); g.set(8, 9, c); g.set(6, 11, c); g.set(5, 9, mixC(c, -.3)); g.set(8, 10, mixC(c, -.3));
    return g;
  }
  function macetaPlantaGrid(especie, marchita, fr) {   // maceta cosechada: la MISMA floración adulta grande que se ve creciendo en el jardín (no una versión chiquita), y sigue pulsando una vez colocada
    const g = Grid(32, 40), cx = 16, dy = 29;
    capa(g, '#5a2810', L => caja(L, cx - 5, dy, 10, 8, R.barro));
    if (marchita) {
      g.rect(cx, dy - 10, 1, 10, '#6a6458');
      [[-4, -4], [4, -2], [0, -8]].forEach(([dx, dyf]) => g.set(cx + dx, dy - 10 + dyf, '#9a9488'));
      return g;
    }
    const S0 = SEMILLAS[especie]; (S0 && S0.planta || plantaEspectro)(g, cx, dy, 'listo', fr || 0);
    return g;
  }
  const macetaViva = k => { const v = e.macetaVida[k]; return !!v && v.dias > 0; };
  function registrarMaceta(key, especie) {   // (re)crea el ITEMS[key] de una maceta cosechada: necesario también al cargar la partida, porque ITEMS se arma de nuevo en cada carga de página y estas claves son dinámicas
    const S = SEMILLAS[especie]; if (!S) return;
    ITEMS[key] = { tipo: 'cuarto', slot: 'deco', n: S.n.toUpperCase() + ' (MACETA)', p: 0, nv: 1, grid: () => macetaPlantaGrid(especie, !macetaViva(key)), semilla: especie, tap: 'planta' };
  }
  function cosecharPlanta(id) {   // registra la maceta cosechada como un ítem único (igual que aura_legend / aura_trueno: fuera de la tienda)
    const key = 'maceta_' + id + '_' + Date.now();
    registrarMaceta(key, id);
    e.tiene[key] = 1; e.macetaVida[key] = { dias: SEMILLAS[id].diasVida, diaUlt: null };
    return key;
  }
