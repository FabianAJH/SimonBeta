// Fallbacks seguros de configuracion y estado de minijuegos
var MJH = (typeof MJH !== 'undefined') ? MJH : ((typeof window !== 'undefined' && window.MJH) || 176);
var MJ_COSTO = (typeof MJ_COSTO !== 'undefined') ? MJ_COSTO : ((typeof window !== 'undefined' && window.MJ_COSTO) || 5);
var MJ_NV = (typeof MJ_NV !== 'undefined') ? MJ_NV : ((typeof window !== 'undefined' && window.MJ_NV) || 1);
var MJ_MON = (typeof MJ_MON !== 'undefined') ? MJ_MON : ((typeof window !== 'undefined' && window.MJ_MON) || 2);
var RUN_COSTO = (typeof RUN_COSTO !== 'undefined') ? RUN_COSTO : ((typeof window !== 'undefined' && window.RUN_COSTO) || 5);
var RUN_NV = (typeof RUN_NV !== 'undefined') ? RUN_NV : ((typeof window !== 'undefined' && window.RUN_NV) || 1);
var RUN_MON = (typeof RUN_MON !== 'undefined') ? RUN_MON : ((typeof window !== 'undefined' && window.RUN_MON) || 3);
var MEM_COSTO = (typeof MEM_COSTO !== 'undefined') ? MEM_COSTO : ((typeof window !== 'undefined' && window.MEM_COSTO) || 5);
var MEM_NV = (typeof MEM_NV !== 'undefined') ? MEM_NV : ((typeof window !== 'undefined' && window.MEM_NV) || 1);
var MEM_DIV = (typeof MEM_DIV !== 'undefined') ? MEM_DIV : ((typeof window !== 'undefined' && window.MEM_DIV) || 20);
var RT_COSTO = (typeof RT_COSTO !== 'undefined') ? RT_COSTO : ((typeof window !== 'undefined' && window.RT_COSTO) || 5);
var RT_NV = (typeof RT_NV !== 'undefined') ? RT_NV : ((typeof window !== 'undefined' && window.RT_NV) || 1);
var RT_DIV = (typeof RT_DIV !== 'undefined') ? RT_DIV : ((typeof window !== 'undefined' && window.RT_DIV) || 18);
var rt = (typeof rt !== 'undefined') ? rt : null;
var mj = (typeof mj !== 'undefined') ? mj : null;
var run = (typeof run !== 'undefined') ? run : null;
var mem = (typeof mem !== 'undefined') ? mem : null;
var mjMusTema = (typeof mjMusTema !== 'undefined') ? mjMusTema : null;   // id de la canción de fondo asignada al azar al entrar a atrapa_keke/corre_simon/memoria (null = música normal del cuarto); baila con Simon no la usa, tiene su propia música
const MJ_CANCIONES = ['mj_turbo', 'mj_synth', 'mj_circo'];
function mjElegirCancion() { mjMusTema = MJ_CANCIONES[Math.floor(Math.random() * MJ_CANCIONES.length)]; if (typeof musicaOn === 'function') musicaOn(); }
function mjQuitarCancion() { mjMusTema = null; }

/* ==========================================================================
 * MINIJUEGOS — SIMON: TU AMIGO VIRTUAL
 * ==========================================================================
 * Archivos: js/minijuegos/ (un archivo por juego; este solo trae los valores por defecto)
 * Responsabilidad: Los 5 minijuegos interactivos de Simon:
 *  1. COCINA (Estufa cenital, corte de ingredientes, cocción y emplatado)
 *  2. BAÑO (Limpieza táctil en 5 etapas: piojos, shampoo, enjuagues y jabón)
 *  3. ATRAPA EL KEKE (Minijuego del arcade: atrapar comida y esquivar bombas)
 *  4. BAILA CON SIMON (Minijuego de ritmo con 3 carriles y música sincronizada)
 *  5. CORRE, SIMON (Minijuego de saltos y obstáculos en scroll infinito)
 *  6. MEMORIA CON CORTEX (Juego de parejas de cartas con Cortex)
 * ========================================================================== */

