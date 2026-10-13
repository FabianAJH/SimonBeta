function esSecreto(k) {
  if (!k) return false;
  if (typeof ITEMS !== 'undefined' && ITEMS[k]) {
    if (ITEMS[k].secreto || ITEMS[k].mascota) return true;
  }
  if (k === 'pet_sif' || k === 'ojo_pet' || k === 'casco_espacial' || k === 'gorro_chef' ||
      k === 'platillo_mini' || k === 'peluche_cortex' || k === 'marco_cortex_bebe' ||
      k === 'aura_legend' || k === 'aura_trueno' || k === 'aura_eterna') {
    return true;
  }
  if (typeof CONFIG_EASTEREGGS !== 'undefined') {
    for (const s of Object.values(CONFIG_EASTEREGGS)) {
      if (s && s.recompensa === k) return true;
    }
  }
  return false;
}
if (typeof window !== 'undefined') {
  window.esSecreto = esSecreto;
}

/* ==========================================================================
 * CATÁLOGO DE ITEMS, ROPA Y DECORACIÓN — SIMON: TU AMIGO VIRTUAL
 * ==========================================================================
 * Archivo: items.js
 * Responsabilidad: Catálogo completo de prendas, accesorios, muebles,
 *                  plantas/semillas, cuadros, recetas de cocina e ingredientes.
 *
 * ÍNDICE DE SECCIONES:
 *  0. AYUDANTES PARA CREAR CONTENIDO (registrarRopa, registrarMueble, registrarComida)
 *  1. CATÁLOGO BASE DE ROPA Y MUEBLES (Sudaderas clásicas, accesorios iniciales)
 *  2. JARDÍN: SEMILLAS Y MACETAS (Especies alienígenas y cosechas)
 *  3. CUADROS Y OBRAS DE ARTE (Retratos, fotos de la cámara y marcos)
 *  4. JUGUETES Y PUFS (Pelotas, peluches, dados y asientos)
 *  5. DECORACIÓN TEMÁTICA (Muebles de sala, cocina, baño, estudio, entrada)
 *  6. ESTILOS DE PARED, PISO Y REFRIGERADORES (Patrones, texturas y capacidades)
 *  7. TROFEOS, CAMAS Y CLÓSET (Beneficios de descanso y atuendos guardados)
 *  8. ROPA Y ACCESORIOS AVANZADOS + PREMIUM (Más de 70 prendas exclusivas)
 *  9. OBJETOS SECRETOS (Casco espacial, gorro de chef, mini platillo, etc.)
 * 10. CLIMA Y EFECTOS VISUALES (Llama de racha, ciclos climáticos)
 * 11. COMIDAS ESPECIALES Y CONSUMIBLES (Menú de la tienda y alimentos)
 * 12. MERCADO E INGREDIENTES DE COCINA (Frutas, verduras, carnes y lácteos)
 * 13. RECETAS DE COCINA (Platillos preparables en la estufa)
 * ========================================================================== */

// ==========================================================================
// AYUDANTES PARA CREAR CONTENIDO FÁCILMENTE
// ==========================================================================
function registrarRopa({ id, nombre, slot, precio = 0, nivel = 1, crop = null, regalo = false, mercader = false, prem = null, secreto = false, comentario = null }) {
  const item = { tipo: 'ropa', slot, n: nombre, p: precio, nv: nivel };
  if (crop) item.crop = crop;
  else if (typeof CR !== 'undefined' && CR[slot]) item.crop = CR[slot];
  if (regalo) item.regalo = regalo;
  if (mercader) item.mercader = true;
  if (prem) item.prem = prem;
  if (secreto) item.secreto = true;
  ITEMS[id] = item;
  if (typeof ORDEN !== 'undefined' && ORDEN.ropa && !ORDEN.ropa.includes(id) && !secreto) {
    ORDEN.ropa.push(id);
  }
  if (comentario && typeof ROPA_COM !== 'undefined') {
    ROPA_COM[id] = comentario;
  }
  return item;
}

function registrarMueble({ id, nombre, slot = 'deco', precio = 0, nivel = 1, tema = 'todas', grid = null, luz = false, tap = null, exclusivo = false, cama = null }) {
  const item = { tipo: 'cuarto', slot, n: nombre, p: precio, nv: nivel, tema };
  if (grid) item.grid = grid;
  if (luz) item.luz = true;
  if (tap) item.tap = tap;
  if (exclusivo) item.exclusivo = true;
  if (cama) item.cama = cama;
  ITEMS[id] = item;
  if (typeof ORDEN !== 'undefined' && ORDEN.cuarto && !ORDEN.cuarto.includes(id)) {
    ORDEN.cuarto.push(id);
  }
  return item;
}

function registrarComida({ id, nombre, precio = 15, nivel = 1, hambre = 10, energia = 0, feliz = 5, texto = '¡Rico!', rand = false, fx = null }) {
  const item = { n: nombre, p: precio, nv: nivel, h: hambre, e: energia, f: feliz, t: texto };
  if (rand) item.rand = true;
  if (fx) item.fx = fx;
  COMIDAS[id] = item;
  if (typeof ORDEN !== 'undefined' && ORDEN.comida && !ORDEN.comida.includes(id)) {
    ORDEN.comida.push(id);
  }
  return item;
}

