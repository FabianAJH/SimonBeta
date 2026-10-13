#!/usr/bin/env node
/* GENERA LA LISTA Y LA VERSIÓN DEL CACHÉ DE sw.js  (ya no se toca a mano)
 *
 *   node herramientas/generar_sw.js            → reescribe CACHE y ARCHIVOS en sw.js
 *   node herramientas/generar_sw.js --revisar  → no escribe; sale con error si sw.js está desactualizado
 *
 * - La lista de archivos sale de index.html (todos los <script src> y <link href>) más los archivos fijos
 *   de la raíz (manifest, iconos, sonido, fuente). Así nunca se desincroniza.
 * - La versión del caché es un hash del CONTENIDO de todos esos archivos: si cambias cualquiera, cambia
 *   el nombre del caché y los jugadores reciben la versión nueva. Si no cambias nada, no cambia.
 * Ejecútalo SIEMPRE antes de publicar o empaquetar.                                                   */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const RAIZ = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const locales = [...html.matchAll(/(?:src|href)="([^"#?]+)"/g)].map(m => m[1]).filter(u => !/^(https?:|data:|\/\/)/.test(u));
const fijos = ['manifest.json', 'icon.svg', 'si.mp3', 'PressStart2P.woff2', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
const lista = [];
['index.html', ...locales, ...fijos].forEach(u => { if (!lista.includes(u)) lista.push(u); });
const faltan = lista.filter(u => !fs.existsSync(path.join(RAIZ, u)));
if (faltan.length) { console.error('Archivos nombrados pero que NO existen:', faltan.join(', ')); process.exit(1); }
const h = crypto.createHash('sha1');
lista.forEach(u => { h.update(u + '\0'); h.update(fs.readFileSync(path.join(RAIZ, u))); });
const version = 'simon-' + h.digest('hex').slice(0, 10);
const ARCH = ['./', ...lista.map(u => './' + u)];
const bloque = "const CACHE = '" + version + "';\nconst ARCHIVOS = [\n" + ARCH.map(u => "  '" + u + "'").join(',\n') + "\n];\n";
const swp = path.join(RAIZ, 'sw.js'), sw = fs.readFileSync(swp, 'utf8');
const m = /^const CACHE = [^\n]*\nconst ARCHIVOS = \[[\s\S]*?\n\];\n/.exec(sw);
if (!m) { console.error('No encontré el bloque CACHE/ARCHIVOS al principio de sw.js'); process.exit(1); }
const nuevo = sw.replace(m[0], () => bloque);
if (process.argv.includes('--revisar')) {
  if (nuevo !== sw) { console.error('sw.js está DESACTUALIZADO. Ejecuta: node herramientas/generar_sw.js'); process.exit(1); }
  console.log('sw.js al día (' + version + ', ' + ARCH.length + ' archivos)'); process.exit(0);
}
fs.writeFileSync(swp, nuevo);
console.log(nuevo === sw ? 'sw.js ya estaba al día' : 'sw.js actualizado', '→', version, '(' + ARCH.length + ' archivos)');
