  /* === Protección LIGERA del guardado ===
   * OJO, para no engañarnos: esto NO es seguridad real. Sirve para que el guardado no sea texto legible y para
   * detectar datos cortados o dañados, pero:
   *  - la clave (SALT_SECRET) viaja dentro del propio juego: quien lea el código la conoce;
   *  - el «cifrado» es un XOR y la firma un hash de 32 bits (se puede fabricar);
   *  - un guardado en JSON plano también se acepta (compatibilidad con partidas viejas).
   * Evitar trampas de verdad solo es posible validando en un servidor (hoy no hace falta: el juego es local).
   * Lo que SÍ importa aquí es no perder partidas: ver cargar() en estado_guardado.js (copias, rescate). */
  const SALT_SECRET = 'simon_anti_cheat_vault_9z7q_2026';
  function _sumaHex(t) { return hashStr(t).toString(16); }
  const _b64e = t => (typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(t))) : (typeof Buffer !== 'undefined' ? Buffer.from(t, 'utf8').toString('base64') : ''));
  const _b64d = t => (typeof atob === 'function' ? decodeURIComponent(escape(atob(t))) : (typeof Buffer !== 'undefined' ? Buffer.from(t, 'base64').toString('utf8') : ''));

  function _cifrarCadena(txt, salt) {
    const key = _sumaHex(salt + SALT_SECRET);
    const klen = key.length;
    let res = '';
    for (let i = 0; i < txt.length; i++) {
      const c = txt.charCodeAt(i);
      const k = key.charCodeAt(i % klen);
      const v = (c ^ k) ^ ((i * 13) & 0xff);
      res += String.fromCharCode(v);
    }
    return _b64e(res);
  }

  function _descifrarCadena(b64, salt) {
    const raw = _b64d(b64);
    const key = _sumaHex(salt + SALT_SECRET);
    const klen = key.length;
    let res = '';
    for (let i = 0; i < raw.length; i++) {
      const c = raw.charCodeAt(i);
      const k = key.charCodeAt(i % klen);
      const v = (c ^ ((i * 13) & 0xff)) ^ k;
      res += String.fromCharCode(v);
    }
    return res;
  }

  function empaquetarSave(obj) {
    try {
      const json = JSON.stringify(obj);
      const salt = _sumaHex(String(Date.now()) + Math.random().toString(36).slice(2, 8));
      const cifrado = _cifrarCadena(json, salt);
      const firma = _sumaHex('simon_sig|' + salt + '|' + cifrado + '|' + SALT_SECRET);
      return 'SX1.' + salt + '.' + cifrado + '.' + firma;
    } catch (err) {
      console.warn('[Seguridad] Error al empaquetar guardado:', err);
      return JSON.stringify(obj);
    }
  }

  function desempaquetarSave(str) {
    if (!str || typeof str !== 'string') return null;
    const s = str.trim();
    // 1. Retrocompatibilidad total con partidas previas en JSON plano
    if (s.startsWith('{') && s.endsWith('}')) {
      try {
        const d = JSON.parse(s);
        return (d && typeof d === 'object') ? d : null;
      } catch (_) {
        return null;
      }
    }
    // 2. Formato blindado: SX1.<salt>.<cifrado>.<firma>
    const partes = s.split('.');
    if (partes.length === 4 && partes[0] === 'SX1') {
      const [, salt, cifrado, firma] = partes;
      const firmaEsperada = _sumaHex('simon_sig|' + salt + '|' + cifrado + '|' + SALT_SECRET);
      if (firma !== firmaEsperada) {
        console.warn('[Seguridad] Firma inválida o manipulación detectada en el guardado.');
        return null;
      }
      try {
        const json = _descifrarCadena(cifrado, salt);
        const d = JSON.parse(json);
        return (d && typeof d === 'object') ? d : null;
      } catch (err) {
        console.warn('[Seguridad] Error al descifrar guardado:', err);
        return null;
      }
    }
    return null;
  }

  // Solo para RESCATE: lee un guardado firmado aunque la firma no coincida (cortado/alterado), si todavía se puede descifrar y es JSON válido.
  function desempaquetarSaveSinFirma(str) {
    const s = (str || '').trim(), partes = s.split('.');
    if (partes.length === 4 && partes[0] === 'SX1') {
      try { const d = JSON.parse(_descifrarCadena(partes[2], partes[1])); return (d && typeof d === 'object') ? d : null; } catch (_) { return null; }
    }
    return desempaquetarSave(s);
  }

  if (typeof window !== 'undefined') {
    window.empaquetarSave = empaquetarSave;
    window.desempaquetarSave = desempaquetarSave;
    window.desempaquetarSaveSinFirma = desempaquetarSaveSinFirma;
  }

