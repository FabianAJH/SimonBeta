/* ==========================================================================
 * BASE DEL JUEGO — SIMON: TU AMIGO VIRTUAL
 * ==========================================================================
 * Lo primero que se carga del motor: valores por defecto de la configuración,
 * ajuste de pantalla, claves de guardado, medidas de la pantalla (LW, SW, SX…),
 * el estado `e`, y los ayudantes `$` y `clamp`. Todo lo demás depende de esto.
 *
 * El motor está repartido en estos archivos (en este orden):
 *   nucleo/base.js              ← este
 *   nucleo/seguridad_guardado.js  cifrado y firma del guardado
 *   nucleo/respaldo_idb.js        respaldo silencioso en IndexedDB
 *   nucleo/sanitizar.js           limpieza de datos corruptos al cargar
 *   nucleo/estado_guardado.js     estado inicial, guardar y cargar
 *   nucleo/pixel_art.js           motor de pixel art (Grid, capas, sombreado, trazado)
 *   simon/simon_sprite.js         cómo se dibuja Simon
 *   mundo/cuarto.js               fondo de la recámara
 *   mundo/salas.js                sala de juegos, cocina y entrada
 *   mundo/parque.js               el parque (cielo, nubes, efectos)
 *   mundo/jardin_dibujo.js        macetas y plantas del jardín
 *   mundo/navegacion_mapa.js      habitaciones, flechas, mapa e ir de un lugar a otro
 * ========================================================================== */



function hashStr(t) { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  // altura real visible: en algunos celulares 100vh/100dvh incluye la barra del navegador y los botones de abajo quedaban fuera de pantalla
  const fijaAlto = () => { const h = Math.round((window.visualViewport && window.visualViewport.height) || window.innerHeight); if (h > 200) document.documentElement.style.setProperty('--app-h', h + 'px'); };
  fijaAlto(); window.addEventListener('resize', fijaAlto); window.addEventListener('orientationchange', () => setTimeout(fijaAlto, 250));
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fijaAlto);
  const CLAVE = 'simon-v1';
  const CLAVE_BK = 'simon-v1-bk';
  const ESQUEMA = 1;
  let guardaCount = 0;
    const VERSION_JUEGO = 'Beta v.497';

  // (MAX definido en config.js)
  let LW = 120, LH = 184;                 // resolución "real" de la pantalla: se adapta al espacio disponible
  const SW = 56, SH = 78;                 // tamaño del sprite de Simon
  let PISO = 9999;   // hasta dónde puede llegar el piso de los muebles: justo encima del dock de botones
  let SX = 32, SY = 84, SYn = 84, RY = 59, OX = 0;          // dónde está Simon y la altura del riel de la pared (se recalculan)
  // (BAJA definido en config.js)
  // (DICE definido en dialogos.js)

  const $ = id => document.getElementById(id);
  const clamp = v => Math.max(0, Math.min(MAX, v));
  let e;

