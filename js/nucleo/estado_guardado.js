  /* ===================== ESTADO Y GUARDADO ===================== */
  let despertoOffline = false, ausenciaH = 0;
  let guardadoIlegible = false;   // true si había una partida guardada pero ninguna copia se pudo leer (se conserva una copia de rescate)
  let admin = false, admTemp = null, admMerc = 0, admClima = null, admMercRaro = false, admMercDesc = false, edit = null, fHab = 'todo', fRopa = 'todo', hollin = false, desc = null, bm = null, sustoHasta = 0, sustoCd = 0, lugar = null, llegada = null, cambiando = false;   // modo admin: nada se guarda
  const BASE = () => ({
    hambre: (typeof STATS_INI !== 'undefined' ? STATS_INI.hambre : 0), energia: (typeof STATS_INI !== 'undefined' ? STATS_INI.energia : 0), feliz: (typeof STATS_INI !== 'undefined' ? STATS_INI.feliz : 0), limp: (typeof STATS_INI !== 'undefined' ? STATS_INI.limp : 0), dormido: false, mudo: false, t: Date.now(),
    monedas: 20, xp: 0, total: 0, nombre: '',
    racha: 0, mejorRacha: 0, ultimoRegalo: '',
    ultComer: '', rachaComer: 0, mejorComer: 0, ultDice: 0, eIni: 0,
    ropa: { cara: null, cuello: null, orejas: null, espalda: null, aura: null, sudadera: 'sud_azul' },
    fuente: 1, ing: {}, musica: true, ultResp: 0, avisoResp: '', sec: {}, pens: {}, preg: null, mis: null, adv: { f: '', n: 0 }, cod: {}, deco: [{ k: 'puf_azul', x: -45, y: 90, f: 0, h: 'sala' }, { k: 'juguete_pelota', x: -10, y: 77, f: 0, h: 'sala' }], mig2: 1, comida: {}, probo: {}, mimos: { n: 0, t: 0, harto: false }, mimosDia: { f: '', xp: 0, coins: 0, av: 0 }, bombas: 0, memPend: [], notis: [], nHam: 0, nFel: 0, nRegalo: '', nClima: '', enf: 0, enfAb: 0, malS: 0, meds: 0, rt: { rec: 0, dia: '', monHoy: 0 }, proxSiesta: 0, ultBomba: -1, ultBombaT: 0,
    cuarto: { pared: 'pared_azul', alfombra: 'alf_roja', izq: null, der: null, cuadro: 'marco_corona' }, album: [], cuadroFoto: '', hab: 'sala',
    tiene: { sud_azul: 1, pared_azul: 1, alf_roja: 1, marco_corona: 1, puf_azul: 1, juguete_pelota: 1 },
    st: { si: 0, comer: 0, jugar: 0, dice: 0, toques: 0, dormir: 0, compras: 0, pizzas: 0, plantas: 0, visitas: 0, tratos: 0, fotos: 0, adiv: 0, misiones: 0, bombas: 0, parque: 0, mj: 0, rt: 0, mem: 0, run: 0 }, run: { rec: 0, dia: '', monHoy: 0 }, mj: { rec: 0, dia: '', monHoy: 0, rompio: 0 }, mem: { rec: 0, dia: '', monHoy: 0 }, eco: { f: '', c: 0, x: 0, fr: 0, av: 0 },
    intro: false, traductor: false, proxVisita: 0, ultTip: -1, logros: {}, merc: null, avisoMerc: false, planta: null, hallazgo: null, proxHallazgo: Date.now() + 180000, dibujos: {},
    jardin: { plots: [] }, semillas: {}, macetaVida: {}
  });
  // ¿esto parece una partida? Un número que se volvió NaN se guarda como `null` en JSON: no por eso se descarta toda la partida
  // (_aplicarSave ya pone un valor por defecto a las barras que no sean número).
  function _pareceSave(d) { return !!d && typeof d === 'object' && (typeof d.hambre === 'number' || d.hambre === null || typeof d.monedas === 'number'); }
  // Si NINGUNA copia se puede leer, no dejamos que la partida nueva pise lo que había: se guarda aparte, intacto.
  function _rescatarIlegible() {
    try {
      let hubo = false;
      [[CLAVE, CLAVE + '-rescate'], [CLAVE_BK, CLAVE + '-rescate-bk']].forEach(([de, a]) => {
        const raw = localStorage.getItem(de);
        if (raw) { hubo = true; if (localStorage.getItem(a) !== raw) localStorage.setItem(a, raw); }
      });
      if (hubo) { guardadoIlegible = true; console.warn('[Simon] No se pudo leer la partida; copia de rescate en localStorage: ' + CLAVE + '-rescate'); }
    } catch (_) {}
  }
  function _leerLS(clave) {
    try {
      const raw = localStorage.getItem(clave);
      if (!raw) return null;
      const d = desempaquetarSave(raw);
      return _pareceSave(d) ? d : null;
    } catch (_) {
      return null;
    }
  }
  function _aplicarSave(d) {
    try {
      const horas = (typeof d.t === 'number' && !isNaN(d.t) && d.t > 0 && d.t <= Date.now()) ? Math.min(87600, (Date.now() - d.t) / 3600000) : 0, b = BASE();
      // ritmo de sueño con la partida GUARDADA (cama, ojo mascota y planta Calma viva). `e` todavía es el estado anterior, así que se arma uno provisional
      const rd = (() => {
        if (typeof rDormir !== 'function') return 50;
        const prev = e;
        try {
          Object.keys(d.macetaVida || {}).forEach(key => { const m = /^maceta_([a-z]+)_/.exec(key); if (m && typeof registrarMaceta === 'function') registrarMaceta(key, m[1]); });
          e = { deco: Array.isArray(d.deco) ? d.deco.filter(o => o && typeof o === 'object') : [], macetaVida: d.macetaVida || {}, sangFase: d.sangFase, ojoOn: d.ojoOn };
          return rDormir(e.deco, d.sangFase === 2 && d.ojoOn !== 0);
        } catch (_) { return 50; } finally { e = prev; }
      })();
      let sigue = false;
      try { sigue = d.dormido && clamp((d.energia || 0) + rd * horas) < 100; } catch (_) { sigue = false; }
      despertoOffline = !!d.dormido && !sigue; ausenciaH = horas;
      e = Object.assign(b, d, {
        hambre: clamp((typeof d.hambre === 'number' && !isNaN(d.hambre) ? d.hambre : 0) - BAJA.hambre * horas),
        energia: clamp(d.dormido ? (d.energia || 0) + rd * horas : (typeof d.energia === 'number' && !isNaN(d.energia) ? d.energia : 80) - BAJA.energia * horas),
        feliz: clamp((typeof d.feliz === 'number' && !isNaN(d.feliz) ? d.feliz : 0) - BAJA.feliz * horas),
        limp: clamp((typeof d.limp === 'number' && !isNaN(d.limp) ? d.limp : 0) - 4 * horas),
        dormido: !!sigue, mudo: !!d.mudo, t: Date.now()
      });
      e.ropa = Object.assign(BASE().ropa, d.ropa || {});
      e.cuarto = Object.assign(BASE().cuarto, d.cuarto || {});
      e.tiene = Object.assign(BASE().tiene, d.tiene || {});
      e.st = Object.assign(BASE().st, d.st || {}); e.album = Array.isArray(d.album) ? d.album.filter(f => f && f.p && f.i) : [];
      e.mj = Object.assign(BASE().mj, d.mj || {}); e.rt = Object.assign(BASE().rt, d.rt || {}); e.mem = Object.assign(BASE().mem, d.mem || {}); e.run = Object.assign(BASE().run, d.run || {}); e.notis = Array.isArray(d.notis) ? d.notis.slice(0, 40) : []; e.dia = d.dia && d.dia.f ? d.dia : null; e.eco = Object.assign(BASE().eco, d.eco || {});
      e.sec = Object.assign({}, d.sec || {}); e.pens = Object.assign({}, d.pens || {}); e.cod = Object.assign({}, d.cod || {});
      e.deco = Array.isArray(d.deco) ? d.deco.filter(o => o && typeof o === 'object').map(o => Object.assign({}, o)) : []; e.comida = Object.assign({}, d.comida || {}); e.probo = Object.assign({}, d.probo || {}); e.mimos = Object.assign(BASE().mimos, d.mimos || {}); e.mimosDia = Object.assign(BASE().mimosDia, d.mimosDia || {});
      e.adv = Object.assign(BASE().adv, d.adv || {}); e.logros = Object.assign({}, d.logros || {}); e.dibujos = Object.assign({}, d.dibujos || {});
      ['izq', 'der'].forEach(l => { const k = e.cuarto[l]; if (k) { if (!e.deco.some(o => o.k === k)) e.deco.push({ k, x: l === 'izq' ? -50 : 50, y: 55, f: 0 }); e.cuarto[l] = null; } });   // muebles antiguos -> colocación libre
      if (!d.mig2) {   // el puf y el juguete antes eran fijos: ahora son objetos del cuarto
        const pk = d.cuarto && d.cuarto.puf !== undefined ? d.cuarto.puf : 'puf_azul', jk = (d.cuarto && d.cuarto.juguete) || 'juguete_pelota';
        if (pk && ITEMS[pk] && !e.deco.some(x => x.k === pk)) e.deco.push({ k: pk, x: -45, y: 90, f: 0 });
        if (!e.deco.some(x => ITEMS[x.k] && ITEMS[x.k].slot === 'juguete')) e.deco.push({ k: ITEMS[jk] ? jk : 'juguete_pelota', x: 43, y: 92, f: 0 });
        e.mig2 = 1;
      }
      if (!e.deco.some(x => ITEMS[x.k] && ITEMS[x.k].slot === 'juguete')) e.deco.push({ k: 'juguete_pelota', x: 43, y: 92, f: 0 });
      if (!['sala', 'bano', 'juegos', 'estudio', 'cocina', 'entrada', 'jardin', 'espacial'].includes(e.hab)) e.hab = 'sala';
      e.jardin = (d.jardin && Array.isArray(d.jardin.plots)) ? { plots: d.jardin.plots.map(p => Object.assign({ k: null, etapa: null, dias: 0, diaUlt: null, regadoHoy: false }, p)) } : { plots: [] };
      e.semillas = Object.assign({}, d.semillas || {}); e.macetaVida = Object.assign({}, d.macetaVida || {});
      Object.keys(e.macetaVida).forEach(key => { const m = /^maceta_([a-z]+)_/.exec(key); if (m) registrarMaceta(key, m[1]); });
      e.deco.forEach(x => { if (!x.h) x.h = 'sala'; });
      e.deco = e.deco.filter(x => ITEMS[x.k] || (x.h !== 'estudio' && x.h !== 'jardin')); e.deco.forEach(x => { const it = ITEMS[x.k]; if (!it) return; if (it.slot === 'juguete' && x.h !== 'sala') x.h = 'sala'; if (it.tema === 'estudio') { x.h = 'estudio'; if (x.s === undefined) x.s = Math.max(0, typeof estSlotLibre === 'function' ? estSlotLibre(it.zona) : 0); } else if (x.h === 'estudio') x.h = 'sala'; if (it.tema === 'jardin') { x.h = 'jardin'; } else if (x.h === 'jardin') x.h = 'sala'; if (x.k === 'racha') x.h = 'sala'; });   // el cuadro de racha solo vive en la recámara normal
      if (!e.proxHallazgo) e.proxHallazgo = Date.now() + 180000;
      sanitizar(e);
    } catch (err) {
      console.warn('[Simon] Error al aplicar datos guardados:', err);
      e = BASE();
      sanitizar(e);
    }
  }
  let _idbPend = null;   // save recuperado de IndexedDB (async)
  function cargar() {
    despertoOffline = false; ausenciaH = 0;
    try {
      // Intento 1: CLAVE principal
      let d = _leerLS(CLAVE);
      // Intento 2: backup rotativo
      if (!d) { d = _leerLS(CLAVE_BK); if (d) console.log('[Simon] Recuperado desde backup localStorage'); }
      // Intento 3: IndexedDB (si ya se cargó el dato async)
      if (!d && _idbPend) { try { const p = desempaquetarSave(_idbPend); if (_pareceSave(p)) { d = p; console.log('[Simon] Recuperado desde IndexedDB'); } } catch (_) {} }
      if (d) { _aplicarSave(d); return; }
    } catch (err) {
      console.warn('[Simon] Error durante cargar():', err);
    }
    _rescatarIlegible();
    e = BASE();
    sanitizar(e);
  }
  // Guardado automático: se llama en cada acción
  let reseteando = false, resetPend = false;
  function guardar() {
    if (admin || reseteando) return;
    e.t = Date.now();
    const prueba = vSnap ? e.ropa : null; if (prueba) e.ropa = vSnap;   // mientras se prueba ropa, lo guardado sigue siendo el atuendo de antes
    const paquete = empaquetarSave(e);
    try { localStorage.setItem(CLAVE, paquete); } catch (_) {}
    // Backup rotativo cada 10 guardados
    if (++guardaCount >= 10) {
      guardaCount = 0;
      try { localStorage.setItem(CLAVE_BK, paquete); } catch (_) {}
      idbSet(paquete);
    }
    if (prueba) e.ropa = prueba;
  }
  var vSnap = null, vF = 'todo';

