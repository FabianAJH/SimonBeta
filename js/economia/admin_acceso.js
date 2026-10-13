  /* ===================== MODO ADMIN ===================== */
  let ajTab = "cfg";
  var cdMsg = null;
  function ponTag() { $('adm-tag').classList.toggle('on', admin); }
  function activarAdmin() {
    guardar();                                              // lo real queda guardado ANTES de entrar
    admin = true; ajTab = 'ab';
    Object.keys(ITEMS).forEach(k => { if (!ITEMS[k].secreto) e.tiene[k] = 1; }); Object.keys(COMIDAS).forEach(k => { e.comida[k] = 5; }); e.bombas = Math.max(e.bombas || 0, 10);
    e.intro = true; e.traductor = true; e.xp = Math.max(e.xp, xpDe(NMAX)); e.monedas = Math.max(e.monedas, 9999);
    pintar(); ponTag(); sfx.nivel();
  }
  function salirAdmin() {
    admin = false; admMerc = 0; admTemp = null; admClima = null; admHora = null; admLuna = false; admFz = false; admSangre = false; admAzul = false; admMercRaro = false; admMercDesc = false; bl = null; ojoKeke = null; ov = null; az = null; esferaXY = null; tr = null; centellaXY = null; truenoT = 0; boltV = 0; ajTab = 'cfg'; mercPres = false; mercBusy = false;
    cargar(); pintar(); actualizarTareas(); pintarIconos(); ponTag(); cerrar(); toast('MODO ADMIN APAGADO. TODO VOLVIÓ A COMO ESTABA');
  }
  function renderAjAdm() {
    const aud = `<div style="display:flex;gap:8px;margin-bottom:10px"><button class="bt ${e.mudo ? '' : 'ok'}" style="flex:1;padding:12px 0" data-a="r_snd">SONIDO ${e.mudo ? 'OFF' : 'ON'}</button><button class="bt ${e.musica ? 'ok' : ''}" style="flex:1;padding:12px 0" data-a="r_mus">MÚSICA ${e.musica ? 'ON' : 'OFF'}</button></div>`;
    const ntb = `<button class="bt ${e.notifOn ? 'ok' : ''} gran" style="padding:12px 0;margin-bottom:10px" data-a="nt_tog">AVISOS AL TELÉFONO: ${e.notifOn ? 'SÍ' : 'NO'}</button>`;
    const fsb = `<div class="centro" style="font-size:7px;color:#aab4ff;margin:4px 0 6px">TAMAÑO DEL TEXTO</div><div style="display:flex;gap:6px;margin-bottom:10px">${['CHICA', 'NORMAL', 'GRANDE'].map((t, i) => `<button class="bt ${(e.fuente == null ? 1 : e.fuente) === i ? 'ok' : ''}" style="flex:1;padding:12px 0" data-a="fs_set" data-k="${i}">${t}</button>`).join('')}</div>`;
    const nmb = admin ? '' : `<button class="bt gran" style="padding:12px 0;margin-bottom:10px" data-a="nom_ed">TU NOMBRE: ${quitaAc(e.nombre || '---').toUpperCase()}</button>`;
    return aud + fsb + nmb + (admin ? '' : ntb) + renderAj0() + `<button class="bt gran" style="padding:10px 0;margin-top:10px" data-a="tut_ver">VER TUTORIAL DE LA PANTALLA</button><div class="centro" style="font-size:7px;color:#aab4ff;margin-top:14px">SIMON: TU AMIGO VIRTUAL · VERSIÓN ${VERSION_JUEGO}</div>`;
  }
  const IC_PAT = {
    snd: ['...x.....', '..xx..x..', 'xxxx...x.', 'xxxx.x.x.', 'xxxx.x.x.', 'xxxx.x.x.', 'xxxx...x.', '..xx..x..', '...x.....'],
    mus: ['...xxxxxx', '...xxxxxx', '...x....x', '...x....x', '...x....x', '.xxx..xxx', 'xxxx.xxxx', 'xxxx.xxxx', '.xx...xx.'],
    usr: ['...xxx...', '..xxxxx..', '..xxxxx..', '...xxx...', '.........', '.xxxxxxx.', 'xxxxxxxxx', 'xxxxxxxxx', 'xxxxxxxxx'],
    bel: ['....x....', '...xxx...', '..xxxxx..', '..xxxxx..', '..xxxxx..', '.xxxxxxx.', 'xxxxxxxxx', '.........', '....x....'],
    txt: ['...xxx...', '..xx.xx..', '..xx.xx..', '.xx...xx.', '.xxxxxxx.', '.xx...xx.', 'xx.....xx', 'xx.....xx', '.........'],
    ayu: ['..xxxxx..', '.xx...xx.', '.xx...xx.', '.....xx..', '....xx...', '....xx...', '.........', '....xx...', '....xx...'],
    dis: ['xxxxxxxx.', 'x.xxxx.xx', 'x.xxxx.xx', 'x......xx', 'x.xxxxx.x', 'x.x...x.x', 'x.xxxxx.x', 'x.......x', 'xxxxxxxxx'],
    key: ['..xxx....', '.x...x...', '.x...x...', '..xxx....', '...x.....', '...xxx...', '...x.....', '...xx....', '...x.....'],
    gea: ['....x....', '.x.xxx.x.', '..xxxxx..', '.xxx.xxx.', 'xxx...xxx', '.xxx.xxx.', '..xxxxx..', '.x.xxx.x.', '....x....'],
    tro: ['.xxxxx...', 'x.....x..', 'x.....x..', '.xxxxx...', '...x.....', '...x.....', '..xxx....', '..xxx....', '.xxxxx...']
  };
  const IC_CACHE = {};
  function icU(k, col) {   // icono pixel de 9x9 como imagen
    const id = k + (col || ''); if (IC_CACHE[id]) return IC_CACHE[id];
    const c = document.createElement('canvas'); c.width = c.height = 9; const x = c.getContext('2d'); x.fillStyle = col || '#ffd84a';
    IC_PAT[k].forEach((f, y) => [...f].forEach((ch, i) => { if (ch === 'x') x.fillRect(i, y, 1, 1); }));
    return IC_CACHE[id] = c.toDataURL();
  }
