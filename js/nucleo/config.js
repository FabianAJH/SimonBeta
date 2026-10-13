// ==========================================================================
// CONFIGURACION Y BALANCE — SIMON: TU AMIGO VIRTUAL
// ==========================================================================
// Este archivo centraliza TODOS los parametros numericos de juego y balance.
// Puedes ajustar la velocidad de las necesidades, precios, recompensas y
// limites sin tener que buscar en miles de lineas de codigo.
//
// INDICE DE SECCIONES:
//  1. ESTADISTICAS Y DECAIMIENTO (Hambre, energia, felicidad, limpieza)
//  2. LIMITES GENERALES (Nivel maximo, capacidad de cuartos, etc.)
//  3. ECONOMIA Y PROGRESION (Curvas de carino, topes diarios, bonos de nivel)
//  4. PRECIOS Y CONSUMIBLES (Kekes, jarabe, bombas)
//  5. TIEMPOS Y VISITAS DE CORTEX (Comerciante, siesta, descanso)
//  6. MINIJUEGOS (Costos de energia, niveles de desbloqueo, recompensas)
//  7. JARDIN Y CULTIVOS (Capacidad de parcelas, dimensiones de macetas)
//  8. ESTUDIO POMODORO (Valores por defecto de estudio y descanso)
// ==========================================================================

var CONFIG = {
  // 1. ESTADISTICAS Y DECAIMIENTO
  // Valores con los que inicia Simon en una partida nueva (al minimo)
  statsIniciales: {
    hambre:  0,
    energia: 0,
    feliz:   0,
    limp:    0
  },
  // Cuantos puntos pierde Simon por hora en cada necesidad
  ritmoDecaimiento: {
    hambre:  10,  // Puntos que baja el hambre por hora
    energia: 6,   // Puntos que baja la energia por hora
    feliz:   10,  // Puntos que baja la felicidad por hora
    limp:    4,   // Puntos de limpieza que baja por hora en casa
    limpParque: 6 // Puntos de limpieza que baja por hora en el parque
  },
  statsMax: 100,  // Valor maximo para hambre, energia, felicidad y limpieza

  // 2. LIMITES GENERALES
  limites: {
    nivelMax:           100, // Nivel maximo de carino
    mueblesPorCuarto:   18,  // Maximo de muebles colocados por habitacion (DECO_MAX)
    fotosAlbum:         8,   // Maximo de fotos guardadas en el album (ALBUM_MAX)
    bombasInventario:   99,  // Maximo de bombas que se pueden guardar (BOMBA_MAX)
    jarabesInventario:  9,   // Maximo de jarabes en inventario
    comidasInventario:  99,  // Maximo por cada tipo de comida especial
    semillasInventario: 99   // Maximo por tipo de semilla
  },

  // 3. ECONOMIA Y PROGRESION
  // Curvas de carino, limites diarios y premios
  economia: {
    // Monedas maximas que se pueden ganar por dia con acciones normales (comer, jugar, etc.)
    topeMonedasDiario: n => 35 + 2.4 * (n <= 25 ? n : 25 + (n - 25) * 0.4),
    // Carino (XP) diario que rinde al 100%; el exceso rinde solo 25%
    topeXpDiario:      n => 90 + 4.8 * (n <= 25 ? n : 25 + (n - 25) * 0.4),
    // Monedas ganadas al subir de nivel (doble cada 5 niveles, triple cada 25)
    bonoSubirNivel:    n => (25 + 5 * (n <= 25 ? n : 25 + (n - 25) * 0.4)) * (n % 25 === 0 ? 3 : n % 5 === 0 ? 2 : 1),
    // Monedas que da el regalo diario en los dias 1 al 7
    premiosRegaloDiario: [9, 12, 15, 18, 22, 30, 75]
  },

  // 4. PRECIOS Y CONSUMIBLES
  precios: {
    bomba:         60, // Precio de una bomba en la tienda
    jarabe:        40, // Precio del jarabe para el resfriado
    kekeExtra:     25, // Costo de un keke cuando ya no quedan gratis hoy
    kekesGratisDia: 5, // Kekes gratis que Simon recibe al dia
    kekeHambre:    20  // Puntos de comida/hambre que da el keke
  },

  // 5. TIEMPOS Y VISITAS DE CORTEX
  cortex: {
    duracionComerciante: 15 * 60000, // 15 minutos en milisegundos (MERC_VENT)
    avisoComerciante:    60 * 60000, // Avisa 60 minutos antes de llegar (MERC_AVISO)
    duracionDescansoBomba: 120000,   // Tiempo que descansa Cortex tras una bomba (2 min)
    duracionSiesta:        150000    // Duracion de la siesta de Cortex (2.5 min)
  },

  // 6. CARICIAS Y MIMOS
  mimos: {
    maximo:        8,   // Numero de mimos seguidos antes de pedir espacio
    vuelveAQuerer: 3,   // Nivel de mimos al que vuelve a querer caricias
    segundosBaja:  15,  // Segundos que tarda en bajar 1 nivel de mimos
    xpMaximaDia:   20,  // Carino maximo diario ganado solo por caricias
    monedasMaxDia: 5    // Monedas maximas diarias ganadas por caricias
  },

  // 7. MINIJUEGOS
  minijuegos: {
    atrapaElKeke: { costoEnergia: 5, nivelDesbloqueo: 1,  multiplicadorMonedas: 2 },
    memoria:      { costoEnergia: 5, nivelDesbloqueo: 1,  divisorPuntos: 20 },
    correSimon:   { costoEnergia: 5, nivelDesbloqueo: 1,  multiplicadorMonedas: 3 },
    bailaSimon:   { costoEnergia: 5, nivelDesbloqueo: 1,  divisorPuntos: 18 }
  },

  // 8. JARDIN Y CULTIVOS
  jardin: {
    maxParcelas:   6,  // Maximo de parcelas desbloqueables (JARDIN_MAXP)
    anchoMaceta:   16, // Ancho visual en pixeles (JARDIN_POTW)
    altoMaceta:    13  // Alto visual en pixeles (JARDIN_POTH)
  },

  // 9. MISIONES DIARIAS
  misiones: {
    esperaNuevas: 24 * 3600000 // Tiempo de espera tras completar las 3 misiones (24 h)
  },

  // 10. ESTUDIO POMODORO (Valores predeterminados)
  estudioPomodoro: {
    minutosEstudio:  25, // Minutos por sesion de concentracion
    minutosDescanso: 5,  // Minutos de descanso
    sesionesTotales: 4   // Sesiones predeterminadas (0 = infinitas)
  }
};

// --------------------------------------------------------------------------
// ALIAS GLOBALES PARA COMPATIBILIDAD DIRECTA CON EL RESTO DEL CODIGO
// --------------------------------------------------------------------------
var MAX          = CONFIG.statsMax;
var NMAX         = CONFIG.limites.nivelMax;
var BAJA         = CONFIG.ritmoDecaimiento;
var DECO_MAX     = CONFIG.limites.mueblesPorCuarto;
var ALBUM_MAX    = CONFIG.limites.fotosAlbum;
var BOMBA_MAX    = CONFIG.limites.bombasInventario;
var BOMBA_PRECIO = CONFIG.precios.bomba;
var BOMBA_DESC   = CONFIG.cortex.duracionDescansoBomba;
var VUELO        = 14;
var MED_PRECIO   = CONFIG.precios.jarabe;
var KEKE_P       = CONFIG.precios.kekeExtra;
var KEKE_DIA     = CONFIG.precios.kekesGratisDia;
var KEKE_H       = CONFIG.precios.kekeHambre;
var MERC_VENT    = CONFIG.cortex.duracionComerciante;
var MERC_AVISO   = CONFIG.cortex.avisoComerciante;
var MIMO_MAX     = CONFIG.mimos.maximo;
var MIMO_VUELVE  = CONFIG.mimos.vuelveAQuerer;
var MIMO_SEG     = CONFIG.mimos.segundosBaja;
var MIMO_XP_DIA  = CONFIG.mimos.xpMaximaDia;
var MIMO_MON_DIA = CONFIG.mimos.monedasMaxDia;
var JARDIN_MAXP  = CONFIG.jardin.maxParcelas;
var JARDIN_POTW  = CONFIG.jardin.anchoMaceta;
var JARDIN_POTH  = CONFIG.jardin.altoMaceta;
var MIS_ESPERA   = CONFIG.misiones.esperaNuevas;

var MJ_COSTO     = CONFIG.minijuegos.atrapaElKeke.costoEnergia;
var MJ_NV        = CONFIG.minijuegos.atrapaElKeke.nivelDesbloqueo;
var MJ_MON       = CONFIG.minijuegos.atrapaElKeke.multiplicadorMonedas;
var MJH          = 176;

var RUN_COSTO    = CONFIG.minijuegos.correSimon.costoEnergia;
var RUN_NV       = CONFIG.minijuegos.correSimon.nivelDesbloqueo;
var RUN_MON      = CONFIG.minijuegos.correSimon.multiplicadorMonedas;

var MEM_COSTO    = CONFIG.minijuegos.memoria.costoEnergia;
var MEM_NV       = CONFIG.minijuegos.memoria.nivelDesbloqueo;
var MEM_DIV      = CONFIG.minijuegos.memoria.divisorPuntos;

var RT_COSTO     = CONFIG.minijuegos.bailaSimon.costoEnergia;
var RT_NV        = CONFIG.minijuegos.bailaSimon.nivelDesbloqueo;
var RT_DIV       = CONFIG.minijuegos.bailaSimon.divisorPuntos;

// Curvas de economia clasicas
var nEf = n => n <= 25 ? n : 25 + (n - 25) * 0.4;
var XP_F = [0, 0, 0.5, 0.36, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9];
var xpDe0 = n => Math.round(40 * Math.pow(n - 1, 1.95) * (XP_F[n] === undefined ? 1 : XP_F[n]));
var TOPE_XP = CONFIG.economia.topeXpDiario;
var XPT = (() => {
  const t = [0, 0];
  const DT = { 1: 0, 2: 0.1, 3: 0.25, 4: 0.45, 5: 0.75, 6: 1.3, 7: 1.9, 8: 2.6, 9: 3.4, 10: 4.3 };
  for (let n = 2; n <= NMAX; n++) {
    const dias = n <= 10 ? DT[n] - DT[n - 1] : (n <= 25 ? 0.85 : 1) * 0.27 * Math.pow(n, 0.6);
    t[n] = t[n - 1] + Math.round(dias * 1.15 * TOPE_XP(n - 1));
  }
  return t;
})();
var xpDe = n => n <= 1 ? 0 : XPT[Math.min(n, NMAX + 1)] !== undefined ? XPT[n] : XPT[NMAX] + (n - NMAX) * 1e9;

var STATS_INI = CONFIG.statsIniciales;

var ECO = {
  topeMon: CONFIG.economia.topeMonedasDiario,
  topeXp:  CONFIG.economia.topeXpDiario,
  bono:    CONFIG.economia.bonoSubirNivel,
  premios: CONFIG.economia.premiosRegaloDiario
};
var PREMIOS = ECO.premios;

// Exportar globalmente a window para navegadores
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
  window.MAX = MAX;
  window.NMAX = NMAX;
  window.BAJA = BAJA;
  window.DECO_MAX = DECO_MAX;
  window.ALBUM_MAX = ALBUM_MAX;
  window.BOMBA_MAX = BOMBA_MAX;
  window.BOMBA_PRECIO = BOMBA_PRECIO;
  window.BOMBA_DESC = BOMBA_DESC;
  window.VUELO = VUELO;
  window.MED_PRECIO = MED_PRECIO;
  window.KEKE_P = KEKE_P;
  window.KEKE_DIA = KEKE_DIA;
  window.KEKE_H = KEKE_H;
  window.MERC_VENT = MERC_VENT;
  window.MERC_AVISO = MERC_AVISO;
  window.MIMO_MAX = MIMO_MAX;
  window.MIMO_VUELVE = MIMO_VUELVE;
  window.MIMO_SEG = MIMO_SEG;
  window.MIMO_XP_DIA = MIMO_XP_DIA;
  window.MIMO_MON_DIA = MIMO_MON_DIA;
  window.JARDIN_MAXP = JARDIN_MAXP;
  window.JARDIN_POTW = JARDIN_POTW;
  window.JARDIN_POTH = JARDIN_POTH;
  window.MIS_ESPERA = MIS_ESPERA;
  window.MJ_COSTO = MJ_COSTO;
  window.MJ_NV = MJ_NV;
  window.MJ_MON = MJ_MON;
  window.MJH = MJH;
  window.RUN_COSTO = RUN_COSTO;
  window.RUN_NV = RUN_NV;
  window.RUN_MON = RUN_MON;
  window.MEM_COSTO = MEM_COSTO;
  window.MEM_NV = MEM_NV;
  window.MEM_DIV = MEM_DIV;
  window.RT_COSTO = RT_COSTO;
  window.RT_NV = RT_NV;
  window.RT_DIV = RT_DIV;
  window.nEf = nEf;
  window.XP_F = XP_F;
  window.xpDe0 = xpDe0;
  window.TOPE_XP = TOPE_XP;
  window.XPT = XPT;
  window.xpDe = xpDe;
  window.STATS_INI = STATS_INI;
  window.ECO = ECO;
  window.PREMIOS = PREMIOS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG, MAX, NMAX, BAJA, DECO_MAX, ALBUM_MAX, BOMBA_MAX, BOMBA_PRECIO,
    BOMBA_DESC, VUELO, MED_PRECIO, KEKE_P, KEKE_DIA, KEKE_H, MERC_VENT,
    MERC_AVISO, MIMO_MAX, MIMO_VUELVE, MIMO_SEG, MIMO_XP_DIA, MIMO_MON_DIA,
    JARDIN_MAXP, JARDIN_POTW, JARDIN_POTH, MIS_ESPERA, MJ_COSTO, MJ_NV,
    MJ_MON, MJH, RUN_COSTO, RUN_NV, RUN_MON, MEM_COSTO, MEM_NV, MEM_DIV,
    RT_COSTO, RT_NV, RT_DIV, nEf, XP_F, xpDe0, TOPE_XP, XPT, xpDe,
    STATS_INI, ECO, PREMIOS
  };
}
