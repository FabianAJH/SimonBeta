/* ==========================================================================
 * SISTEMA CENTRAL DE SECRETOS Y EASTER EGGS — SIMÓN: TU AMIGO VIRTUAL
 * ==========================================================================
 * Archivo: eastereggs.js
 * Propósito: Centralizar todos los secretos, eventos ocultos y huevos de
 *            pascua del juego en un solo lugar con parámetros configurables
 *            y fáciles de ubicar y modificar.
 * AVISO: los parámetros marcados con «⚠ SIN CONECTAR» todavía no los lee ningún código; cambiarlos no hace nada.
 * ========================================================================== */

const CONFIG_EASTEREGGS = {
  // ------------------------------------------------------------------------
  // 1. LUNA DORADA Y EL OVNI (Casco Espacial)
  // ------------------------------------------------------------------------
  // Aparece los domingos de madrugada. Al tocarla 3 veces, aterriza un
  // platillo volador en la colina de la ventana de la recámara y un alienígena
  // verde baja para regalarle a Simón el Casco Espacial.
  lunaDorada: {
    id: 'lunaDorada',
    nombre: 'Luna Dorada y el OVNI',
    recompensa: 'casco_espacial', // Prenda de cabeza / orejas
    diaSemana: 0,                 // 0 = Domingo
    horaInicio: 0,                // 00:00 hrs
    horaFin: 3,                   // Hasta las 03:00 hrs
    toquesRequeridos: 3,          // Toques en la luna dorada para invocar al OVNI
    tiempoEsperaOvni: 600,        // Ticks (~60s) que espera la nave antes de despegar si no la tocas
    tiempoInactividad: 300,       // Ticks (~30s) sin tocar para reiniciar el conteo // ⚠ SIN CONECTAR: el juego no lee este valor
    diaProhibido: 15,             // El día 15 se reserva exclusivamente para la Luna Azul
    descripcion: 'Toca la luna dorada 3 veces los domingos entre 00:00 y 03:00 en la ventana de la recámara.'
  },

  // ------------------------------------------------------------------------
  // 2. LUNA DE SANGRE Y EL OJO DE CTHULHU (Mascota)
  // ------------------------------------------------------------------------
  // Ocurre aleatoriamente por la noche (1 de cada 10 noches). La luna se
  // tiñe de rojo sangre. Al tocarla 3 veces, un ojo cósmico entra al cuarto.
  // Si le lanzas 5 kekes, se encariña con Simón y se une como mascota.
  lunaSangre: {
    id: 'lunaSangre',
    nombre: 'Luna de Sangre y el Ojo de Cthulhu',
    recompensa: 'ojo_pet',         // Mascota que orbita a Simón
    probabilidad: 0.10,            // 10% de probabilidad por noche
    divisorProbabilidad: 10,       // 1 de cada 10
    horaInicio: 21,                // 21:00 hrs
    horaFin: 6,                    // Hasta las 06:00 hrs
    duracionMinutos: 180,          // 3 horas de duración del evento
    toquesRequeridos: 3,           // Toques a la luna roja para invocar al Ojo
    kekesRequeridos: 5,            // Kekes necesarios para ganarse su cariño
    tiempoEsperaOjo: 600,          // Ticks (~60s) sin interactuar antes de que el ojo se marche // ⚠ SIN CONECTAR: el juego no lee este valor
    bonusDormirVelocidad: 0.10,    // Efecto de la mascota: Simón duerme 10% más rápido // ⚠ SIN CONECTAR: el juego no lee este valor
    descripcion: 'Noches aleatorias (21:00-06:00). Toca la luna roja 3 veces y dale 5 kekes al Ojo.'
  },

  // ------------------------------------------------------------------------
  // 3. LUNA AZUL Y EL AURA LEGENDARIA (Evento Mensual)
  // ------------------------------------------------------------------------
  // Ocurre el día 15 de cada mes a medianoche en punto (solo 1 hora).
  // La luna brilla azul celeste. Al tocarla 5 veces, explota y hace caer
  // una esfera mística que otorga el Aura Legendaria.
  lunaAzul: {
    id: 'lunaAzul',
    nombre: 'Luna Azul y el Aura Legendaria',
    recompensa: 'aura_legend',     // Prenda cosmética de aura
    diaMes: 15,                    // Día 15 de cada mes
    hora: 0,                       // 00:00 a 00:59 hrs
    toquesRequeridos: 5,           // Toques a la luna azul para hacerla explotar
    tiempoEsperaEsfera: 600,       // Ticks (~60s) antes de que la esfera se desvanezca si no se recoge // ⚠ SIN CONECTAR: el juego no lee este valor
    tiempoInactividad: 300,        // Ticks para reiniciar toques si te detienes // ⚠ SIN CONECTAR: el juego no lee este valor
    descripcion: 'El día 15 de cada mes de 00:00 a 00:59. Toca la luna azul 5 veces y recoge la esfera.'
  },

  // ------------------------------------------------------------------------
  // 4. AURA DE TRUENO (Tormenta Eléctrica)
  // ------------------------------------------------------------------------
  // Durante un clima de tormenta, caen rayos visibles en el cristal de
  // la ventana de la recámara. Al tocar 3 rayos antes de que desaparezcan,
  // una centella entra volando, gira alrededor de Simón y otorga el Aura de Trueno.
  auraTrueno: {
    id: 'auraTrueno',
    nombre: 'Aura de Trueno en la Tormenta',
    recompensa: 'aura_trueno',     // Prenda cosmética de aura
    climaRequerido: 'tormenta',    // Clima necesario // ⚠ SIN CONECTAR: el juego no lee este valor
    escenaRequerida: 'sala',       // En la ventana de la recámara // ⚠ SIN CONECTAR: el juego no lee este valor
    rayosRequeridos: 3,            // Rayos que debes tocar en la ventana
    tiempoInactividad: 450,        // Ticks (~45s) de inactividad antes de reiniciar conteo // ⚠ SIN CONECTAR: el juego no lee este valor
    descripcion: 'En días de tormenta, toca 3 rayos que caigan en la ventana de la recámara.'
  },

  // ------------------------------------------------------------------------
  // 5. ESTRELLA FUGAZ Y EL MINI PLATILLO VOLADOR
  // ------------------------------------------------------------------------
  // En noches despejadas en la recámara, cruzan estrellas fugaces.
  // Al tocar una, pides un deseo (1 por noche). Al juntar 3 deseos en noches
  // distintas, cae del cielo el Mini Platillo Volador para decorar la casa.
  estrellaFugaz: {
    id: 'estrellaFugaz',
    nombre: 'Estrella Fugaz y el Mini Platillo Volador',
    recompensa: 'platillo_mini',   // Mueble decorativo
    deseosRequeridos: 3,           // Noches distintas con deseos pedidos
    probabilidad: 0.09,            // Probabilidad de aparición de la estrella cada 15 ticks
    probabilidadAdmin: 0.45,       // Probabilidad forzada en modo admin // ⚠ SIN CONECTAR: el juego no lee este valor
    descripcion: 'Toca una estrella fugaz de noche en la ventana durante 3 noches diferentes.'
  },

  // ------------------------------------------------------------------------
  // 6. EL SECRETO DEL PELUCHE DE CORTEX (Cuadro de Cortex Bebé)
  // ------------------------------------------------------------------------
  // Al colocar el peluche de Cortex en el cuarto y tocarlo 10 veces seguidas
  // rápidamente (menos de 1.6s entre toques), el peluche salta, chilla y
  // revela el Retrato de Cortex Bebé con marco dorado para colgar en la pared.
  pelucheCortex: {
    id: 'pelucheCortex',
    nombre: 'El Secreto del Peluche de Cortex',
    recompensa: 'marco_cortex_bebe', // Obra para el cuadro de la pared
    toquesRequeridos: 10,            // Toques rápidos seguidos
    maxIntervaloMs: 1600,            // Tiempo máximo (1.6s) entre toques para no perder la racha
    descripcion: 'Coloca el peluche de Cortex y tócalo 10 veces rápidamente.'
  },

  // ------------------------------------------------------------------------
  // 7. BOMBAZO A CORTEX (Mini Cortex de Peluche)
  // ------------------------------------------------------------------------
  // Al lanzarle 3 bombas a Cortex cuando viene de visita o se duerme una
  // siesta en la recámara, Cortex se asusta de forma cómica y te regala
  // su propio muñeco de peluche en miniatura.
  bombaCortex: {
    id: 'bombaCortex',
    nombre: 'Bombazos a Cortex y el Mini Cortex',
    recompensa: 'peluche_cortex',  // Peluche decorativo
    bombasRequeridas: 3,           // Bombas que debes explotarle // ⚠ SIN CONECTAR: el juego no lee este valor
    descripcion: 'Lánzale 3 bombas a Cortex cuando venga de visita a descansar en la recámara.'
  },

  // ------------------------------------------------------------------------
  // 8. EL CHEF DE LOS 1000 KEKES (Gorro de Chef)
  // ------------------------------------------------------------------------
  // Darle de comer un total de 1000 kekes a Simón a lo largo de su vida
  // desbloquea con fanfarria el exclusivo Gorro de Chef Keke.
  chefKekes: {
    id: 'chefKekes',
    nombre: 'Chef de los 1000 Kekes',
    recompensa: 'gorro_chef',      // Prenda de cabeza / orejas
    kekesRequeridos: 1000,         // Kekes totales acumulados
    descripcion: 'Alimenta a Simón con un total acumulado de 1000 kekes.'
  },

  // ------------------------------------------------------------------------
  // 9. SIMÓN FLOTA Y LEVITA (Semilla Eterna + Aura)
  // ------------------------------------------------------------------------
  // Cuando cosechas la Semilla Eterna en el jardín y la maceta está viva,
  // si Simón se pone cualquier aura (como el Aura Eterna), Simón flota
  // en el aire y levita sobre el suelo de la casa con un balanceo místico.
  simonLevita: {
    id: 'simonLevita',
    nombre: 'Simón Levita en el Aire',
    semillaRequerida: 'eterna',    // Planta cosechada y viva // ⚠ SIN CONECTAR: el juego no lee este valor
    requiereAura: true,            // Debe llevar un aura puesta // ⚠ SIN CONECTAR: el juego no lee este valor
    alturaLevitacion: 5,           // Píxeles base que se eleva del suelo
    amplitudOscilacion: 2,         // Amplitud del vaivén vertical
    velocidadOscilacion: 11,       // Frecuencia del balanceo
    descripcion: 'Cosecha la Semilla Eterna en el jardín y ponle un aura a Simón para que flote.'
  },

  // ------------------------------------------------------------------------
  // 9b. EL ALVARIKOKE Y EL TRÉBOL DE LA SUERTE
  // ------------------------------------------------------------------------
  // Parque: tocar 5 veces el árbol del fondo (el de la derecha) hace caer al alvarikoke.
  // La primera vez le regala a Simón el Collar de la Suerte. Desde entonces puede salir un trébol de
  // 4 hojas en el parque: probInicial % el primer día y +probSubePorDia % por cada día que no sale.
  // Si ese día no lo recoges, desaparece y la probabilidad vuelve al inicio. Se lo llevas al alvarikoke
  // y te da la Semilla de la Suerte (única; 30 días regándola; nunca se marchita).
  // Planta colocada: descProb % de los días Cortex rebaja UN objeto entre descMin % y descMax %.
  // Al cosecharla: Aura de Trébol.
  alvarikoke: {
    id: 'alvarikoke',
    nombre: 'El Alvarikoke y el Trébol de la Suerte',
    toquesRequeridos: 5,           // Toques al árbol para que caiga el alvarikoke
    probInicial: 3,                // % de que salga el trébol el primer día
    probSubePorDia: 1,             // Cuánto sube ese % cada día que no sale
    descProb: 20,                  // % de los días con descuento en Cortex (con la planta colocada)
    descMin: 10, descMax: 50,      // Rango del descuento (%)
    descripcion: 'Toca 5 veces el árbol del fondo del parque.'
  },

  // ------------------------------------------------------------------------
  // 9c. LA CHICA DEL SOL Y LA FLOR SOLAR
  // ------------------------------------------------------------------------
  // Parque (de día): probAparicion % de que salga una joven pelirroja que camina. Pregunta si el sol no es
  // hermoso; con un SÍ regala el Collar del Sol. Con el collar puesto diasCollar días seguidos sin quitárselo,
  // se cae la Semilla Solar (7 días para crecer, no se marchita). Planta colocada, de día y con el juego abierto:
  // +felicidadPorMin de felicidad por minuto y +1 de energía cada minutosPorEnergia minutos. De noche se apaga.
  chicaSol: {
    id: 'chicaSol',
    nombre: 'La Chica del Sol y la Flor Solar',
    probAparicion: 5,              // % de salir cada vez que se entra al parque
    diasCollar: 7,                 // Días seguidos con el collar puesto
    felicidadPorMin: 1,            // Felicidad que da la planta cada minuto (de día)
    minutosPorEnergia: 3,          // Cada cuántos minutos da +1 de energía
    descripcion: 'Dile que sí, el sol es hermoso.'
  },

  // ------------------------------------------------------------------------
  // 10. EL RESFRIADO POR DESCUIDO
  // ------------------------------------------------------------------------
  // Simón solo se resfría si se le descuida 3 días o más.
  // Mientras esté enfermo estornudará exactamente una vez cada minuto.
  resfriado: {
    id: 'resfriado',
    nombre: 'Resfriado por Descuido Prolongado',
    diasDescuidadoMinimos: 3,      // Días continuos de descuido para enfermar
    nivelCariñoMinimo: 3,          // Nivel mínimo de cariño para que pueda enfermar // ⚠ SIN CONECTAR: el juego no lee este valor
    intervaloEstornudoMs: 60000,   // Estornuda exactamente cada 60 segundos (1 minuto)
    curacionNaturalHoras: 3,       // Se cura solo tras 3 horas naturales // ⚠ SIN CONECTAR: el juego no lee este valor
    puntosCalorAbrigo: 600,        // Calor acumulado por abrigo necesario para sanar // ⚠ SIN CONECTAR: el juego no lee este valor
    precioJarabe: 30,              // Costo del jarabe curativo en la tienda // ⚠ SIN CONECTAR: el juego no lee este valor
    descripcion: 'Solo aparece tras 3 días de descuido continuo. Estornuda 1 vez por minuto.'
  },

  // ------------------------------------------------------------------------
  // 11. SIF: EL PERRO DEL PARQUE (Mascota)
  // ------------------------------------------------------------------------
  // Encontrar al perrito en el parque, darle comida especial y adoptarlo.
  // Otorga la ventaja pasiva de cansar un 10% menos al jugar.
  mascotaSif: {
    id: 'mascotaSif',
    nombre: 'Adopción de Sif el Perro',
    recompensa: 'pet_sif',         // Mascota que acompaña a Simón
    descuentoEnergiaJugar: 0.10,   // Jugar cansa 10% menos // ⚠ SIN CONECTAR: el juego no lee este valor
    lugar: 'parque',               // Dónde se le encuentra
    descripcion: 'Visita el parque, hazte amigo del perrito dándole kekes para perro y adóptalo.'
  },

  // ------------------------------------------------------------------------
  // 12. DIARIO DE SECRETOS DE SIMÓN DICE
  // ------------------------------------------------------------------------
  // 24 preguntas y confesiones íntimas y cómicas de Simón que se desbloquean
  // según su nivel de cariño.
  diarioSecretos: {
    id: 'diarioSecretos',
    nombre: 'Diario de 24 Secretos de Simón Dice',
    totalSecretos: 24, // ⚠ SIN CONECTAR: el juego no lee este valor
    descripcion: 'Pregúntale cosas a Simón en el menú de Simón Dice para llenar su álbum de secretos.'
  }
};

// ==========================================================================
// FUNCIONES DE ACCESO RÁPIDO Y UTILIDADES
// ==========================================================================

/**
 * Obtiene la configuración de un easter egg por su ID.
 * @param {string} id - Identificador del secreto (ej. 'lunaDorada', 'resfriado').
 * @returns {object|null}
 */
function obtenerEasterEgg(id) {
  return CONFIG_EASTEREGGS[id] || null;
}

/**
 * Modifica parámetros de un easter egg en tiempo de ejecución.
 * Ejemplo: modificarEasterEgg('lunaDorada', { toquesRequeridos: 1 });
 * @param {string} id - Identificador del secreto.
 * @param {object} nuevosParametros - Parámetros a sobreescribir.
 */
function modificarEasterEgg(id, nuevosParametros) {
  if (!CONFIG_EASTEREGGS[id]) {
    console.warn('[EasterEggs] No existe el secreto:', id);
    return false;
  }
  Object.assign(CONFIG_EASTEREGGS[id], nuevosParametros);
  console.log('[EasterEggs] Secreto actualizado:', id, CONFIG_EASTEREGGS[id]);
  return true;
}

/**
 * Devuelve un resumen en texto de todos los secretos y sus recompensas.
 */
function listarEasterEggs() {
  return Object.values(CONFIG_EASTEREGGS).map(s => ({
    nombre: s.nombre,
    recompensa: s.recompensa || 'Ventaja/Visual',
    descripcion: s.descripcion
  }));
}

// Exportación global en navegadores y entornos de prueba (Node.js)
if (typeof window !== 'undefined') {
  window.CONFIG_EASTEREGGS = CONFIG_EASTEREGGS;
  window.obtenerEasterEgg = obtenerEasterEgg;
  window.modificarEasterEgg = modificarEasterEgg;
  window.listarEasterEggs = listarEasterEggs;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG_EASTEREGGS,
    obtenerEasterEgg,
    modificarEasterEgg,
    listarEasterEggs
  };
}
