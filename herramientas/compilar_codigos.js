#!/usr/bin/env node
/* ==========================================================================
 * COMPILADOR Y ENCRIPTADOR DE CÓDIGOS — SIMON: TU AMIGO VIRTUAL
 * ==========================================================================
 * Archivo: compilar_codigos.js
 *
 * USO:
 *   node compilar_codigos.js
 * ========================================================================== */

const fs = require('fs');
const path = require('path');

function suma(t) {
  let h = 2166136261;
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

const normCod = t => (t || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, '');

const hCod = t => suma('simon|' + normCod(t));

const rutaPrivada = path.join(__dirname, 'codigos_privados.js');
if (!fs.existsSync(rutaPrivada)) {
  console.error('[ERROR] No se encontró el archivo codigos_privados.js');
  process.exit(1);
}

const { MIS_CODIGOS } = require(rutaPrivada);

if (!Array.isArray(MIS_CODIGOS) || !MIS_CODIGOS.length) {
  console.error('[ERROR] MIS_CODIGOS está vacío o no es un arreglo válido.');
  process.exit(1);
}

console.log(`[Compilador] Procesando ${MIS_CODIGOS.length} códigos secretos...`);

const itemsCompilados = MIS_CODIGOS.map(c => {
  const hashPrincipal = hCod(c.codigo);
  const aliasHashes = (c.alias || []).map(a => hCod(a));
  const fnStr = c.accion.toString();

  return `  {
    hash: '${hashPrincipal}',
    aliasHashes: ${JSON.stringify(aliasHashes)},
    tipo: '${c.tipo || "item"}',
    unSoloUso: ${c.unSoloUso !== false},
    accion: ${fnStr}
  }`;
}).join(',\n\n');

const salidaJs = "/* ==========================================================================\n * SISTEMA Y DEFINICI\u00d3N DE C\u00d3DIGOS (COMPILADO / ENCRIPTADO) \u2014 SIMON\n * ==========================================================================\n * Archivo generado autom\u00e1ticamente por compilar_codigos.js.\n * \u00a1NO EDITES DIRECTAMENTE ESTE ARCHIVO!\n *\n * Para editar o agregar c\u00f3digos:\n *  1. Modifica 'codigos_privados.js' (donde est\u00e1n en texto plano).\n *  2. Ejecuta 'node compilar_codigos.js' (o usa compilar_codigos.html).\n * ========================================================================== */\n\nfunction suma(t) {\n  let h = 2166136261;\n  for (let i = 0; i < t.length; i++) {\n    h ^= t.charCodeAt(i);\n    h = Math.imul(h, 16777619);\n  }\n  return (h >>> 0).toString(16);\n}\n\nconst normCod = t => (t || '')\n  .normalize('NFD')\n  .replace(/[\\u0300-\\u036f]/g, '')\n  .toUpperCase()\n  .replace(/[^A-Z0-9]/g, '');\n\nconst hCod = t => suma('simon|' + normCod(t));\n\nasync function esReset(v) {\n  try {\n    const c = buscarCodigo(normCod(v), hCod(v));\n    return !!(c && c.tipo === 'reinicio');\n  } catch (_) {\n    return false;\n  }\n}\n\nfunction reiniciarTodo() {\n  if (typeof reseteando !== 'undefined') reseteando = true;\n  try { localStorage.removeItem(typeof CLAVE !== 'undefined' ? CLAVE : 'simon-v1'); } catch (_) {}\n  try { localStorage.removeItem(typeof CLAVE_BK !== 'undefined' ? CLAVE_BK : 'simon-v1-bk'); } catch (_) {}\n  if (typeof idbClear === 'function') idbClear();\n  try {\n    if (typeof window !== 'undefined' && window.caches) {\n      caches.keys().then(ks => ks.forEach(k => {\n        if (!k.startsWith('simon-')) caches.delete(k);\n      }));\n    }\n  } catch (_) {}\n  setTimeout(() => location.reload(), 150);\n}\n\nconst LISTA_CODIGOS = [\n" + "\n" + itemsCompilados + "\n" + "];\n\nconst CODIGOS = {};\nfunction sincronizarDiccionarioCodigos() {\n  LISTA_CODIGOS.forEach(c => {\n    const wrap = { n: c.tipo, f: () => c.accion(e), def: c };\n    if (c.hash) CODIGOS[c.hash] = wrap;\n    if (c.aliasHashes) c.aliasHashes.forEach(h => { CODIGOS[h] = wrap; });\n    if (c.codigo) CODIGOS[normCod(c.codigo)] = wrap;\n  });\n}\nsincronizarDiccionarioCodigos();\n\nvar cdMsg = null;\nif (typeof resetPend === 'undefined') {\n  window.resetPend = false;\n}\n\nfunction buscarCodigo(limpio, h) {\n  for (const c of LISTA_CODIGOS) {\n    if (c.hash && (c.hash === h || c.hash === limpio.toLowerCase())) return c;\n    if (c.aliasHashes && c.aliasHashes.includes(h)) return c;\n    if (c.codigo && (normCod(c.codigo) === limpio || hCod(c.codigo) === h)) return c;\n  }\n  return null;\n}\n\nfunction canjearCodigo(v) {\n  const limpio = normCod(v);\n  const h = hCod(v);\n\n  if (!limpio) return { ok: false, t: 'ESCRIBE UN C\u00d3DIGO' };\n\n  // 1. Buscar en la lista compilada (\u00a1\u00daNICA fuente de la verdad!)\n  const c = buscarCodigo(limpio, h);\n  if (!c) return { ok: false, t: 'C\u00d3DIGO NO V\u00c1LIDO' };\n\n  // 2. Si es c\u00f3digo de administrador\n  if (c.tipo === 'admin') {\n    if (typeof admin !== 'undefined' && admin) {\n      return { ok: true, t: 'YA EST\u00c1S EN MODO ADMIN', tipo: 'admin' };\n    }\n    if (typeof activarAdmin === 'function') activarAdmin();\n    return { ok: true, t: null, tipo: 'admin' };\n  }\n\n  // 3. Si es c\u00f3digo de reinicio total\n  if (c.tipo === 'reinicio') {\n    return { ok: true, t: null, tipo: 'reinicio' };\n  }\n\n  // 4. Si es c\u00f3digo de informaci\u00f3n (tiempo jugado, etc.)\n  if (c.tipo === 'info') {\n    const resInfo = typeof c.accion === 'function' ? c.accion(e) : 'INFO';\n    return { ok: true, t: typeof resInfo === 'string' ? resInfo : (resInfo && resInfo.t ? resInfo.t : 'INFO'), tipo: 'info' };\n  }\n\n  // 5. C\u00f3digos de un solo uso\n  if (c.unSoloUso !== false && e && e.cod) {\n    if ((c.hash && e.cod[c.hash]) || e.cod[h] || (c.codigo && e.cod[c.codigo])) {\n      return { ok: false, t: 'YA USASTE ESTE C\u00d3DIGO' };\n    }\n  }\n\n  if (c.unSoloUso !== false && e) {\n    if (!e.cod) e.cod = {};\n    if (c.hash) e.cod[c.hash] = 1;\n    if (c.codigo) e.cod[c.codigo] = 1;\n    e.cod[h] = 1;\n  }\n\n  const res = typeof c.accion === 'function' ? c.accion(e) : (typeof c.f === 'function' ? c.f() : '\u00a1C\u00d3DIGO CANJEADO!');\n  let msg = '\u00a1C\u00d3DIGO CANJEADO!';\n  if (typeof res === 'string') msg = res;\n  else if (res && typeof res.t === 'string') msg = res.t;\n\n  if (typeof guardar === 'function') guardar();\n  if (typeof pintar === 'function') pintar();\n\n  return { ok: true, t: msg, tipo: c.tipo, hash: c.hash || h };\n}\n\nfunction canjear() {\n  const inp = (typeof $ === 'function') ? $('cd-in') : (typeof document !== 'undefined' ? document.getElementById('cd-in') : null);\n  const v = inp ? inp.value : '';\n  const limpio = normCod(v);\n  const h = hCod(v);\n\n  const fnRender = (typeof window !== 'undefined' && typeof window.render === 'function') ? window.render : (typeof render === 'function' ? render : null);\n  const fnSfx = (typeof window !== 'undefined' && window.sfx) ? window.sfx : (typeof sfx !== 'undefined' ? sfx : null);\n\n  if (!limpio) {\n    cdMsg = { ok: false, t: 'ESCRIBE UN C\u00d3DIGO' };\n    if (fnSfx && fnSfx.no) fnSfx.no();\n    if (fnRender) fnRender();\n    return;\n  }\n\n  const c = buscarCodigo(limpio, h);\n  if (!c) {\n    cdMsg = { ok: false, t: 'C\u00d3DIGO NO V\u00c1LIDO' };\n    if (fnSfx && fnSfx.no) fnSfx.no();\n    if (fnRender) fnRender();\n    return;\n  }\n\n  if (c.tipo === 'reinicio') {\n    if (typeof resetPend !== 'undefined') resetPend = true;\n    if (typeof window !== 'undefined') window.resetPend = true;\n    if (fnSfx && fnSfx.no) fnSfx.no();\n    if (fnRender) fnRender();\n    return;\n  }\n\n  ejecutarCanjeNormal(v, h);\n}\n\nfunction ejecutarCanjeNormal(v, h) {\n  const res = canjearCodigo(v);\n  const fnRender = (typeof window !== 'undefined' && typeof window.render === 'function') ? window.render : (typeof render === 'function' ? render : null);\n  const fnSfx = (typeof window !== 'undefined' && window.sfx) ? window.sfx : (typeof sfx !== 'undefined' ? sfx : null);\n  const fnEstrellas = (typeof window !== 'undefined' && typeof window.estrellas === 'function') ? window.estrellas : (typeof estrellas === 'function' ? estrellas : null);\n\n  if (res.ok) {\n    if (res.tipo === 'reinicio') {\n      if (typeof resetPend !== 'undefined') resetPend = true;\n      if (typeof window !== 'undefined') window.resetPend = true;\n      if (fnSfx && fnSfx.no) fnSfx.no();\n      if (fnRender) fnRender();\n      return;\n    }\n    cdMsg = res.t ? { ok: true, t: res.t } : null;\n    if (res.tipo !== 'admin') {\n      if (fnSfx && fnSfx.logro) fnSfx.logro();\n      if (fnEstrellas) fnEstrellas(6);\n    }\n  } else {\n    cdMsg = { ok: false, t: res.t };\n    if (fnSfx && fnSfx.no) fnSfx.no();\n  }\n  if (fnRender) fnRender();\n}\n\nfunction renderCod(soloEntrada) {\n  if (typeof resetPend !== 'undefined' && resetPend) {\n    return '<div class=\"centro\" style=\"font-size:9px;line-height:2;margin:10px 0;color:#ff8a92\">\u00a1ADVERTENCIA!<br><br>Vas a BORRAR TODO tu progreso: monedas, cari\u00f1o, ropa, muebles, logros y diario.<br><br>Simon empezar\u00e1 desde cero y NO se puede deshacer.</div>' +\n      '<button class=\"bt gran\" style=\"background:#ff7b84\" data-a=\"c_reset_ok\">S\u00cd, BORRAR TODO</button><button class=\"bt ok gran\" data-a=\"c_reset_no\">CANCELAR</button>';\n  }\n  var pad = soloEntrada ? 14 : 4;\n  var subtit = soloEntrada ? 'C\u00d3DIGOS NORMALES' : 'Escribe un c\u00f3digo y gana premios.';\n  var msgHtml = (typeof cdMsg !== 'undefined' && cdMsg)\n    ? '<div class=\"centro\" style=\"font-size:8px;line-height:1.9;margin-top:6px;color:' + (cdMsg.ok ? '#bff0c8' : '#ff8a92') + '\">' + cdMsg.t + '</div>'\n    : '';\n  return '<div class=\"centro\" style=\"font-size:8px;line-height:1.9;margin:' + pad + 'px 0 10px\">' + subtit + '</div>' +\n    '<input class=\"cod\" id=\"cd-in\" maxlength=\"40\" autocomplete=\"off\" autocapitalize=\"characters\" spellcheck=\"false\" placeholder=\"ESCRIBE TU C\u00d3DIGO\">' +\n    '<button class=\"bt ok gran\" data-a=\"c_canjear\">CANJEAR</button>' +\n    msgHtml;\n}\n\nif (typeof window !== 'undefined') {\n  window.suma = suma;\n  window.normCod = normCod;\n  window.hCod = hCod;\n  window.esReset = esReset;\n  window.reiniciarTodo = reiniciarTodo;\n  window.LISTA_CODIGOS = LISTA_CODIGOS;\n  window.CODIGOS = CODIGOS;\n  window.sincronizarDiccionarioCodigos = sincronizarDiccionarioCodigos;\n  window.cdMsg = cdMsg;\n  window.resetPend = resetPend;\n  window.buscarCodigo = buscarCodigo;\n  window.canjearCodigo = canjearCodigo;\n  window.canjear = canjear;\n  window.renderCod = renderCod;\n}\n";

fs.writeFileSync(path.join(__dirname, '..', 'js', 'economia', 'codigos.js'), salidaJs);
console.log('[Compilador] Generado exitosamente: js/economia/codigos.js');

const rutaOutput = path.join(__dirname, 'artifacts', 'file_generation', 'ttl=63d', 'output');
if (fs.existsSync(rutaOutput)) {
  fs.writeFileSync(path.join(rutaOutput, 'codigos.js'), salidaJs);
  console.log('[Compilador] Copiado a carpeta output: ' + path.join(rutaOutput, 'codigos.js'));
}

console.log('\n[✓] ¡CÓDIGOS ENCRIPTADOS CORRECTAMENTE!');
