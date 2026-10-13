  /* ===================== TRES BOMBAS A CORTEX → MINI CORTEX DE PELUCHE ===================== */
  // A la tercera bomba, Cortex se despide con un regalo: un peluche suyo. (Se llama desde lineasBomba)
  function pelucheBombasLineas(l, n) {
    if (n >= 3 && !e.tiene.peluche_cortex) l.splice(l.length - 1, 0, C('Espera, Simon. No te vayas todavía.'), C('Tres veces me has explotado y sigues queriéndome igual.'), C('Toma. Hice algo para ti.'),
      { q: 'CORTEX', t: '.', fn: () => { e.tiene.peluche_cortex = 1; equipar('peluche_cortex'); guardar(); }, fan: { g: () => pelucheGrid(), t: 'MINI CORTEX DE PELUCHE', d: 'LO PUEDES COLOCAR EN TU CASA' } },
      C('Es un mini yo de peluche. Cuídalo mucho, ¿sí?'));
  }
