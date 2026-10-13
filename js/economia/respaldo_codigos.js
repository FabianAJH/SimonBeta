  const b64e = t => btoa(unescape(encodeURIComponent(t))), b64d = t => decodeURIComponent(escape(atob(t)));
  function crearCodigo() {
    e.ultResp = Date.now();
    guardar();
    if (typeof empaquetarSave === 'function') {
      return 'SIMON3.' + empaquetarSave(e);
    }
    const j = JSON.stringify(e);
    return 'SIMON2.' + ESQUEMA + '.' + b64e(j) + '.' + suma(j);
  }
  function leerCodigo(t) {
    t = (t || '').replace(/\s+/g, '');
    // 1. Formato blindado SIMON3.{SX1...}
    if (t.startsWith('SIMON3.')) {
      const rest = t.slice(7);
      const d = (typeof desempaquetarSave === 'function') ? desempaquetarSave(rest) : null;
      return d && typeof d.hambre === 'number' && d.ropa && d.cuarto ? sanitizar(d) : null;
    }
    // 2. Formato SIMON2.{esquema}.{b64}.{checksum} (retrocompatible)
    let m = /^SIMON2\.(\d+)\.([A-Za-z0-9+/=]+)\.([0-9a-f]+)$/.exec(t);
    if (m) { try { const j = b64d(m[2]); if (suma(j) !== m[3]) return null; const d = JSON.parse(j); return d && typeof d.hambre === 'number' && d.ropa && d.cuarto ? sanitizar(d) : null; } catch (_) { return null; } }
    // 3. Formato SIMON1.{b64}.{checksum} (retrocompatible)
    m = /^SIMON1\.([A-Za-z0-9+/=]+)\.([0-9a-f]+)$/.exec(t);
    if (m) { try { const j = b64d(m[1]); if (suma(j) !== m[2]) return null; const d = JSON.parse(j); return d && typeof d.hambre === 'number' && d.ropa && d.cuarto ? sanitizar(d) : null; } catch (_) { return null; } }
    return null;
  }
  // ---- copia de rescate (la deja cargar() cuando ninguna copia del guardado se pudo leer) ----
  const RESCATE_CLAVES = () => [CLAVE + '-rescate', CLAVE + '-rescate-bk'];
  const hayRescate = () => { try { return RESCATE_CLAVES().some(k => localStorage.getItem(k)); } catch (_) { return false; } };
  function leerRescate() {   // primera copia de rescate que todavía se pueda recuperar (aunque la firma no coincida)
    for (const k of RESCATE_CLAVES()) {
      try {
        const raw = localStorage.getItem(k); if (!raw) continue;
        const d = desempaquetarSaveSinFirma(raw);
        if (_pareceSave(d)) return sanitizar(d);
      } catch (_) {}
    }
    return null;
  }
  function aplicarRestauracion(d) {   // escribe la partida `d` como la actual y la carga (usado por el código de respaldo y por el rescate)
    d.t = Date.now();
    const rj = (typeof empaquetarSave === 'function') ? empaquetarSave(d) : JSON.stringify(d);
    try { localStorage.setItem(CLAVE, rj); } catch (_) {}
    try { localStorage.setItem(CLAVE_BK, rj); } catch (_) {}
    idbSet(rj);
    cargar(); e.ultResp = Date.now(); guardar(); pintar(); actualizarTareas(); pintarIconos(); cerrar(); sfx.logro();
  }
  let rcConf = false;
  let codigoAct = '';
  function renderResp() {
    $('m-titulo').textContent = 'RESPALDO';
    codigoAct = crearCodigo(); rcConf = false;
    let resc = '';
    if (hayRescate()) {
      const rec = !!leerRescate();
      resc = `<div class="centro" style="font-size:8px;line-height:1.9;color:#ffb36b;margin-bottom:6px">${rec ? 'ENCONTRÉ UNA PARTIDA DE RESCATE: el juego no pudo leer tu progreso anterior, pero se guardó una copia.' : 'HAY UNA COPIA DE RESCATE, PERO ESTÁ DAÑADA y no se puede recuperar sola. Descárgala por si se puede arreglar a mano.'}</div>` +
        (rec ? `<button class="bt gran" data-a="r_rescate">RECUPERAR PARTIDA DE RESCATE</button>` : '') +
        `<button class="bt" style="width:100%;padding:12px 0;margin-top:6px" data-a="r_rescate_archivo">DESCARGAR COPIA DE RESCATE</button><div style="height:14px"></div>`;
    }
    return resc + `<div class="centro" style="font-size:8px;line-height:1.8;margin-bottom:10px">Tu progreso se guarda de forma local. Si borras el juego tu partida se borrará, por eso debes guardar este código para recuperarla.</div>` +
      `<textarea class="cod" id="rs-out" readonly>${codigoAct}</textarea>` +
      `<div style="display:flex;gap:8px"><button class="bt ok" style="flex:1;padding:12px 0" data-a="r_copiar">COPIAR</button><button class="bt" style="flex:1;padding:12px 0" data-a="r_archivo">ARCHIVO</button></div>` +
      `<div class="centro" style="margin:18px 0 8px;font-size:8px;color:#ffd84a">RESTAURAR</div>` +
      `<textarea class="cod" id="rs-in" placeholder="Pega aquí tu código SIMON1 o SIMON2..."></textarea>` +
      `<button class="bt gran" data-a="r_restaurar">RESTAURAR PROGRESO</button>` +
      (() => {
        const dias = e.ultResp ? Math.floor((Date.now() - e.ultResp) / 86400000) : -1;
        const col = dias < 0 ? '#aab4ff' : dias <= 3 ? '#7fff7f' : dias <= 7 ? '#ffd84a' : '#ff6b6b';
        const txt = dias < 0 ? 'Nunca' : dias === 0 ? 'Hoy' : dias === 1 ? 'Ayer' : `Hace ${dias} días`;
        return `<div class="centro" style="font-size:7px;color:#aab4ff;line-height:1.9">Restaurar reemplaza tu progreso actual.<br><span style="color:${col}">Último respaldo: ${txt}</span></div>`;
      })();
  }
  function rClick(a, b) {
    if (a === 'r_snd') { alternaSonido(); render(); return; }
    if (a === 'r_mus') { alternaMusica(); render(); return; }
    if (a === 'r_tab') { ajTab = b.dataset.k; cdMsg = null; sfx.click(); render(); return; }
    if (a === 'r_copiar') {
      const t = $('rs-out'); t.select(); t.setSelectionRange(0, 1e9);
      const bien = () => toast('CÓDIGO COPIADO'), plan = () => { let ok = false; try { ok = document.execCommand('copy'); } catch (_) {} toast(ok ? 'CÓDIGO COPIADO' : 'SELECCIÓNALO Y COPIA'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(bien, plan); else plan();
      sfx.click();
    } else if (a === 'r_archivo') {
      const blob = new Blob([$('rs-out').value], { type: 'text/plain' }), u = URL.createObjectURL(blob), l = document.createElement('a');
      l.href = u; l.download = 'simon-respaldo.txt'; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 3000); sfx.click(); toast('ARCHIVO GUARDADO');
    } else if (a === 'r_restaurar') {
      if (admin) { toast('NO DISPONIBLE EN ADMIN'); return; }
      const d = leerCodigo($('rs-in').value);
      if (!d) { toast('CÓDIGO NO VÁLIDO'); sfx.no(); rsConf = false; b.textContent = 'RESTAURAR PROGRESO'; return; }
      if (!rsConf) { rsConf = true; b.textContent = 'TOCA OTRA VEZ PARA CONFIRMAR'; sfx.pregunta(); return; }
      rsConf = false; aplicarRestauracion(d); toast('PROGRESO RESTAURADO');
    } else if (a === 'r_rescate') {
      if (admin) { toast('NO DISPONIBLE EN ADMIN'); return; }
      const d = leerRescate();
      if (!d) { toast('NO SE PUDO LEER LA COPIA'); sfx.no(); rcConf = false; b.textContent = 'RECUPERAR PARTIDA DE RESCATE'; return; }
      if (!rcConf) { rcConf = true; b.textContent = 'TOCA OTRA VEZ: REEMPLAZA LA PARTIDA ACTUAL'; sfx.pregunta(); return; }
      rcConf = false; aplicarRestauracion(d);
      try { RESCATE_CLAVES().forEach(k => localStorage.removeItem(k)); } catch (_) {}
      toast('PARTIDA DE RESCATE RECUPERADA');
    } else if (a === 'r_rescate_archivo') {
      const txt = RESCATE_CLAVES().map(k => k + '\n' + (localStorage.getItem(k) || '(vacío)')).join('\n\n');
      const blob = new Blob([txt], { type: 'text/plain' }), u = URL.createObjectURL(blob), l = document.createElement('a');
      l.href = u; l.download = 'simon-rescate.txt'; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 3000); sfx.click(); toast('ARCHIVO GUARDADO');
    }
  }
