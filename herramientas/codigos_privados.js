/* ==========================================================================
 * ARCHIVO PRIVADO DEL CREADOR: CÓDIGOS EN TEXTO PLANO
 * ==========================================================================
 * Archivo: codigos_privados.js (¡SOLO PARA TI, NO SUBIR AL JUEGO PÚBLICO!)
 *
 * ¿CÓMO FUNCIONA ESTE SISTEMA DE ENCRIPTACIÓN?
 * --------------------------------------------------------------------------
 * 1. Aquí escribes tus códigos en español claro (ej: 'TESORO', 'ARCOIRIS', etc.).
 * 2. Cuando termines de editarlos o agregar nuevos, tienes 2 opciones para encriptar:
 *
 *    - Opción A (Sin consola): Abre 'compilar_codigos.html' con doble clic en tu
 *      navegador y pulsa "GENERAR Y DESCARGAR codigos.js".
 *    - Opción B (Con consola): En tu terminal ejecuta 'node compilar_codigos.js'.
 *
 * 3. Ambos métodos leerán este archivo automáticamente, calcularán los hashes
 *    y generarán el archivo 'codigos.js' protegido para el juego.
 * ========================================================================== */

const MIS_CODIGOS = [
  // ------------------------------------------------------------------------
  // Código: ARCOIRIS (Sudadera Arcoíris exclusiva)
  // ------------------------------------------------------------------------
  {
    codigo: 'ARCOIRIS',
    alias: ['SUDADERAARCOIRIS', 'SUDADERA'],
    tipo: 'prenda',
    descripcion: 'Otorga la exclusiva Sudadera Arcoíris y la equipa de inmediato',
    unSoloUso: true,
    accion: (e) => {
      e.tiene.sud_arcoiris = 1;
      e.ropa.sudadera = 'sud_arcoiris';
      return '¡SUDADERA ARCOÍRIS! Es única y ya la tienes puesta.';
    }
  },

  // ------------------------------------------------------------------------
  // Código: NEON (Decoración Neón Simón para pared)
  // ------------------------------------------------------------------------
  {
    codigo: 'NEON',
    alias: ['NEONSIMON', 'LUZNEON'],
    tipo: 'deco',
    descripcion: 'Otorga el Neón Simón y lo coloca brillando en la pared',
    unSoloUso: true,
    accion: (e) => {
      e.tiene.neon_si = 1;
      if (typeof colocar === 'function') colocar('neon_si');
      return '¡NEÓN SIMON! Ya brilla en tu habitación.';
    }
  },

  // ------------------------------------------------------------------------
  // Código: ESTRELLAS (Cuadro de Obra Estrellas)
  // ------------------------------------------------------------------------
  {
    codigo: 'ESTRELLAS',
    alias: ['OBRAESTRELLAS', 'CUADROESTRELLAS'],
    tipo: 'obra',
    descripcion: 'Otorga el marco con la Obra Estrellas y lo cuelga en la habitación',
    unSoloUso: true,
    accion: (e) => {
      e.tiene.marco_estrellas = 1;
      if (e.cuarto) e.cuarto.cuadro = 'marco_estrellas';
      return '¡OBRA ESTRELLAS! Ya cuelga de tu pared.';
    }
  },

  // ------------------------------------------------------------------------
  // Código: TESORO (Bono de 100 Monedas)
  // ------------------------------------------------------------------------
  {
    codigo: 'TESORO',
    alias: ['MONEDAS', 'MONEDAS100', '100MONEDAS'],
    tipo: 'monedas',
    descripcion: 'Otorga 100 monedas para comprar ropa, comida y muebles',
    unSoloUso: true,
    accion: (e) => {
      e.monedas = (e.monedas || 0) + 100;
      e.total = (e.total || 0) + 100;
      return '¡+100 MONEDAS!';
    }
  },

  // ------------------------------------------------------------------------
  // Código: TIEMPOSIMON (Estadística de Horas Jugadas)
  // ------------------------------------------------------------------------
  {
    codigo: 'TIEMPOSIMON',
    alias: ['TIEMPO', 'HORAS', 'HORASJUGADAS'],
    tipo: 'info',
    descripcion: 'Muestra las horas y minutos que has jugado en esta partida',
    unSoloUso: false, // Se puede consultar siempre
    accion: (e) => {
      const m = Math.floor(((e && e.tJ) || 0) / 60);
      return 'TIEMPO JUGADO: ' + Math.floor(m / 60) + ' H ' + (m % 60) + ' MIN';
    }
  },

  // ------------------------------------------------------------------------
  // Código: SXADMIN-4R7K-M2Q9-ZT58 (Modo Administrador Secreto de Cortex)
  // ------------------------------------------------------------------------
  {
    codigo: 'SXADMIN-4R7K-M2Q9-ZT58',
    alias: ['ADMIN', 'MODOADMIN', 'CORTEXADMIN', 'PANEL'],
    tipo: 'admin',
    descripcion: 'Activa el panel y modo administrador secreto de Cortex',
    unSoloUso: false,
    accion: (e) => {
      if (typeof admin !== 'undefined' && admin) {
        return { ok: true, t: 'YA ESTÁS EN MODO ADMIN' };
      }
      if (typeof activarAdmin === 'function') activarAdmin();
      return { ok: true, t: null };
    }
  },

  // ------------------------------------------------------------------------
  // Código: MI-NUEVO-CODIGO-SECRETO (Reinicio Total de Partida)
  // ------------------------------------------------------------------------
  {
    codigo: 'SIMON-RESET-9Z4K-QX72-WIPE-3B8M',
    alias: [],
    tipo: 'reinicio',
    descripcion: 'Pide confirmación para borrar todo el progreso y reiniciar Simon desde cero',
    unSoloUso: false,
    accion: (e) => {
      if (typeof resetPend !== 'undefined') resetPend = true;
      if (typeof window !== 'undefined') window.resetPend = true;
      return { ok: true, t: null, tipo: 'reinicio' };
    }
  }

  /*
   * ========================================================================
   * EJEMPLO: CÓMO AGREGAR UN NUEVO CÓDIGO
   * ========================================================================
   * Simplemente copia y pega este bloque arriba y edita los valores:
   *
   * {
   *   codigo: 'REGALOCORTEX',         // Palabra que el jugador debe escribir
   *   alias: ['CORTEXREGALO'],        // Opcional: nombres alternativos
   *   tipo: 'monedas',                // Categoría descriptiva
   *   descripcion: 'Regala 250 monedas',
   *   unSoloUso: true,                // true = sólo una vez; false = ilimitado
   *   accion: (e) => {
   *     e.monedas += 250;
   *     e.total = (e.total || 0) + 250;
   *     return '¡+250 MONEDAS DE CORTEX!';
   *   }
   * },
   */
];

// Exportación para navegador y Node.js
if (typeof window !== 'undefined') {
  window.MIS_CODIGOS = MIS_CODIGOS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MIS_CODIGOS };
}
