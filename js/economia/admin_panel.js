  function renderAdm() {   // menú del modo admin: pestañas con botones en cuadrícula
    const T = { null: 'AUTO', hal: 'HALLOWEEN', nav: 'NAVIDAD', val: 'SAN VALENTÍN', none: 'NINGUNA' }[admTemp];
    if (!['ab', 'as', 'it', 'am', 'cod'].includes(ajTab)) ajTab = 'ab';
    const tabs = `<div class="tabs t5">${[['ab', '🧡 BARRAS'], ['as', '🔮 SECRETOS'], ['it', '🎁 ÍTEMS'], ['am', '🌎 MUNDO'], ['cod', '🔑 CÓDIGOS']].map(([k, n]) => `<button class="tab ${ajTab === k ? 'on' : ''}" data-a="r_tab" data-k="${k}">${n}</button>`).join('')}</div>`;
    const g = (a, t, c, k) => `<button class="bt ${c || ''}" data-a="${a}" ${k ? `data-k="${k}"` : ''}>${t}</button>`;
    const fila = (id, n) => `<div class="adm-bar"><span>${n} ${Math.round(e[id])}</span>${[0, 25, 50, 100].map(v => g('x_set', v, '', id + ':' + v)).join('')}</div>`;
    let h = `<div class="adm-top"><span>MODO ADMIN · NADA SE GUARDA</span><button class="bt" style="background:#ff7b84" data-a="x_salir">SALIR</button></div>` + tabs;
    if (ajTab === 'ab') {
      h += `<div class="adm-t">💛 BARRAS DE SIMON</div>` + fila('hambre', 'HAMBRE') + fila('energia', 'ENERGÍA') + fila('feliz', 'FELIZ') + fila('limp', 'LIMPIEZA') +
        `<div class="adm-g">${g('x_barras', 'TODAS AL 100%', 'ok')}${g('x_barras0', 'TODAS AL 0')}</div>` +
        `<div class="adm-t">🪙 RECURSOS</div><div class="adm-g">${g('x_mon', '+1000 MONEDAS', 'ok')}${g('x_bomba', '+10 BOMBAS', 'ok')}${g('x_sucio', 'ENSUCIAR A SIMON')}</div>` +
        `<div class="adm-t">🌱 JARDÍN</div><div class="adm-g">${g('x_jardin_full', 'TODO CRECIDO', 'ok')}${g('x_jardin_semillas', '+20 DE CADA SEMILLA', 'ok')}${g('x_jardin_fase', '+1 FASE DE CRECIMIENTO', 'ok')}${g('x_eterna', 'SEMILLA ETERNA LISTA<br>(SIMON LEVITA)', 'ok')}</div>` +
        `<div class="adm-t">🤒 SALUD</div><div class="adm-g">${g('x_enf', e.enf ? 'YA ESTÁ RESFRIADO' : 'DAR RESFRIADO')}${g('x_cura', 'CURAR RESFRIADO', 'ok')}</div>` +
        `<div class="adm-t">💔 ABANDONO (ACTUAL: NIVEL ${nivelAbandono()})</div><div class="adm-g">${g('x_ab0', 'SIN ABANDONO', 'ok')}${g('x_ab1', 'NIVEL 1<br>(DESCUIDADO)')}${g('x_ab2', 'NIVEL 2<br>(ABANDONO TOTAL)')}</div>`;
    } else if (ajTab === 'as') {
      h += `<div class="adm-nota">Cada botón reinicia ese secreto desde cero y te deja a un paso de completarlo.</div>` +
        `<div class="adm-t">🌙 LUNAS Y CLIMA</div><div class="adm-g">${g('x_luna', 'LUNA DORADA<br>→ CASCO ESPACIAL', 'ok')}${g('x_sangre', 'LUNA DE SANGRE<br>→ OJO DE CTHULHU', 'ok')}${g('x_azul', 'LUNA AZUL<br>→ AURA LEGENDARIA', 'ok')}${g('x_trueno', 'TORMENTA CON RAYOS<br>→ AURA DE TRUENO', 'ok')}${g('x_fugaz', 'ESTRELLA FUGAZ<br>→ MINI PLATILLO', 'ok')}</div>` +
        `<div class="adm-t">🧸 CORTEX Y PELUCHE</div><div class="adm-g">${g('x_pel', 'BOMBARDEA A CORTEX 3 VECES<br>→ MINI CORTEX', 'ok')}${g('x_ret', 'TOCA EL PELUCHE 10 VECES<br>→ RETRATO BEBÉ' + (e.tiene.peluche_cortex ? '' : ' (PRIMERO EL DE ARRIBA)'), e.tiene.peluche_cortex ? 'ok' : '')}${g('x_chef', 'KEKE NÚMERO 1000<br>→ GORRO DE CHEF', 'ok')}</div>` +
        `<div class="adm-t">🌳 PARQUE <small>(solo un visitante a la vez)</small></div><div class="adm-g">${g('x_sif', 'PERRITO EN EL PARQUE<br>→ ADOPTAR A SIF', 'ok')}${g('x_nosif', 'OLVIDAR A SIF')}${g('x_alv', 'IR AL ÁRBOL<br>→ ALVARIKOKE · COLLAR SUERTE', 'ok')}${g('x_chica', 'IR AL PARQUE<br>→ CHICA DEL SOL · COLLAR SOL', 'ok')}</div>`;
    } else if (ajTab === 'it') {
      const nv = nivel();
      h += `<div class="adm-t">❤️ CARIÑO: NIVEL ${nv} DE ${NMAX}</div>` +
        `<div class="adm-niv"><input id="adm-niv-in" type="number" min="1" max="${NMAX}" value="${nv}">${g('x_niv_set', 'FIJAR NIVEL', 'ok')}</div>` +
        `<div class="adm-g">${[30, 37, 46, 50, 76, NMAX].map(v => g('x_niv_q', v === NMAX ? 'MÁXIMO' : 'NV' + v, '', v)).join('')}</div>` +
        `<div class="adm-t">🎁 ÍTEMS NUEVOS <small>(NV30-46 y NV76)</small></div><div class="adm-g">${g('x_items_v2', 'DAR ROPA, MUEBLES, PISOS Y PAREDES NUEVOS', 'ok')}</div>` +
        `<div class="adm-t">⭐ COLECCIONES PREMIUM <small>(otorga las 3 piezas y revisa el set)</small></div><div class="adm-g">${PREM_SETS.map(s => g('x_prem', 'SET ' + s.n, e.tiene[s.premio] ? '' : 'ok', s.id)).join('')}</div>`;
    } else if (ajTab === 'am') {
      h += `<div class="adm-t">☀️ AMBIENTE</div><div class="adm-g">${g('x_hora', 'HORA: ' + (admHora == null ? 'AUTO' : admHora >= 19 || admHora < 6 ? 'NOCHE' : 'DÍA'))}${g('x_clima', 'CLIMA: ' + String(admClima || 'AUTO').toUpperCase())}${g('x_temp', 'ÉPOCA: ' + T)}</div>` +
        `<div class="adm-t">🔥 RACHA DE DÍAS SEGUIDOS</div><div class="adm-g">${g('x_racha', 'RACHA: ' + (e.racha || 0) + (e.racha === 1 ? ' DÍA' : ' DÍAS'), 'ok')}</div>` +
        `<div class="adm-t">🪐 RECÁMARA ESPACIAL <small>(hogar de Simon)</small></div><div class="adm-g">${g('x_esp_rep', 'REPARADA<br>(SE PUEDE DECORAR)', e.espReparado ? '' : 'ok')}${g('x_esp_ruina', 'EN RUINAS<br>(SIMON SE QUEDA EN LA TIERRA)', e.espReparado ? '' : '')}</div>` +
        `<div class="adm-t">🦊 CORTEX</div><div class="adm-g">${g('x_merc', 'COMERCIANTE YA', 'ok')}${g('x_nomerc', 'QUITAR COMERCIANTE')}${g('x_visita', 'VISITA DE CORTEX', 'ok')}${g('x_merc_raro', 'OBJETO RARÍSIMO (5%)<br>' + (admMercRaro ? 'FORZADO' : 'NORMAL'), admMercRaro ? 'ok' : '')}${g('x_merc_desc', 'DESCUENTO ALVARIKOKE<br>' + (admMercDesc ? 'FORZADO' : 'NORMAL'), admMercDesc ? 'ok' : '')}</div>` +
        `<div class="adm-t">🔄 REINICIOS</div><div class="adm-g">${g('x_mis', 'MISIONES Y PREGUNTAS')}${g('x_regalo', 'REGALO DIARIO')}</div>`;
    } else h += ((typeof window !== "undefined" && typeof window.renderCod === "function") ? window.renderCod(true) : (typeof renderCod === "function" ? renderCod(true) : ""));
    return h;
  }
  // (renderCod y canjear se ejecutan directamente desde codigos.js)
  function xClick(a, k) {
    sfx.click();
    if (a === 'x_mon') { e.monedas += 1000; pintar(); }
    else if (a === 'x_prem') { const s = PREM_SETS.find(p => p.id === k); if (!s) return; s.items.forEach(it => e.tiene[it] = 1); revisar(); pintar(); toast('SET ' + s.n + ': ITEMS OTORGADOS'); }
    else if (a === 'x_items_v2') {
      const ks = Object.keys(ITEMS).filter(kk => ITEMS[kk].nv && !ITEMS[kk].secreto && !ITEMS[kk].exclusivo && ((ITEMS[kk].nv >= 30 && ITEMS[kk].nv <= 46) || ITEMS[kk].nv === 76));
      ks.forEach(kk => e.tiene[kk] = 1); pintar(); toast('ÍTEMS NUEVOS: ' + ks.length + ' OTORGADOS (RÓPALOS EN VESTIR/TIENDA)');
    }
    else if (a === 'x_niv_q') { const n = Math.max(1, Math.min(NMAX, +k)); e.xp = xpDe(n); pintar(); toast('CARIÑO: NIVEL ' + n); }
    else if (a === 'x_niv_set') {
      const inp = $('adm-niv-in'); let n = inp ? parseInt(inp.value, 10) : NaN;
      if (!n || n < 1) n = 1; if (n > NMAX) n = NMAX;
      e.xp = xpDe(n); pintar(); toast('CARIÑO: NIVEL ' + n);
    }
    else if (a === 'x_set') { const [kk, v] = String(k).split(':'); e[kk] = +v; pintar(); }
    else if (a === 'x_hora') { admHora = admHora == null ? 13 : admHora === 13 ? 23 : null; toast('HORA: ' + (admHora == null ? 'AUTO' : admHora === 13 ? 'DÍA' : 'NOCHE')); }
    else if (a === 'x_luna') { cerrar(); lugar = null; llegada = null; e.hab = 'sala'; pintarNav(); admHora = 1; admLuna = true; admClima = 'sol'; e.tiene.casco_espacial = 0; e.lunaT = 0; ov = null; pintar(); return; }
    else if (a === 'x_sucio') { e.limp = 15; cerrar(); pintar(); }
    else if (a === 'x_sangre') { cerrar(); lugar = null; llegada = null; e.hab = 'sala'; pintarNav(); admHora = 23; admSangre = true; admClima = 'sol'; e.sangFase = 0; e.sangT = 0; e.ojoN = 0; bl = null; ojoKeke = null; pintar(); return; }
    else if (a === 'x_azul') { cerrar(); lugar = null; llegada = null; e.hab = 'sala'; pintarNav(); admHora = 0; admAzul = true; admClima = 'sol'; e.tiene.aura_legend = 0; if (e.ropa.aura === 'aura_legend') e.ropa.aura = null; e.azulT = 0; e.azulD = ''; az = null; esferaXY = null; pintar(); toast('TOCA LA LUNA AZUL 5 VECES'); return; }
    else if (a === 'x_trueno') { cerrar(); lugar = null; llegada = null; e.hab = 'sala'; pintarNav(); admClima = 'tormenta'; e.tiene.aura_trueno = 0; if (e.ropa.aura === 'aura_trueno') e.ropa.aura = null; truenoT = 0; boltV = 0; tr = null; centellaXY = null; pintar(); toast('TOCA 3 RAYOS EN LA VENTANA DURANTE LA TORMENTA'); return; }
    else if (a === 'x_fugaz') { cerrar(); lugar = null; llegada = null; e.hab = 'sala'; pintarNav(); admClima = 'sol'; admHora = 23; e.tiene.platillo_mini = 0; e.fugazD = ['2000-01-01', '2000-01-02']; admFz = true; toast('ATRAPA UNA ESTRELLA FUGAZ EN LA VENTANA'); pintar(); return; }
    else if (a === 'x_pel') { e.tiene.peluche_cortex = 0; e.st.bombas = 2; e.bombas = Math.max(e.bombas || 0, 5); cerrar(); toast('LANZA UNA BOMBA A CORTEX EN SU VISITA'); e.proxVisita = 0; setTimeout(visitaAdm, 700); return; }
    else if (a === 'x_ret') {
      if (!e.tiene.peluche_cortex) { toast('PRIMERO CONSIGUE EL PELUCHE: USA "BOMBARDEA A CORTEX 3 VECES"'); return; }
      e.tiene.marco_cortex_bebe = 0; pelN = 0; pelT = 0; cerrar(); lugar = null; llegada = null; e.hab = 'sala'; pintarNav();
      colocar('peluche_cortex'); pintar(); toast('TOCA EL PELUCHE 10 VECES SEGUIDAS'); return;
    }
    else if (a === 'x_chef') { e.tiene.gorro_chef = 0; e.kkTot = 999; e.kk = { f: hoy(), n: 0 }; cerrar(); toast('DALE UN KEKE A SIMON'); return; }
    else if (a === 'x_bomba') { e.bombas = (e.bombas || 0) + 10; toast('+10 BOMBAS'); }
    else if (a === 'x_enf') { if (e.enf) toast('YA ESTÁ RESFRIADO'); else enfermar(); pintar(); }
    else if (a === 'x_cura') { if (e.enf) curar('jarabe'); else toast('NO ESTÁ RESFRIADO'); pintar(); }
    else if (a === 'x_ab0') { e.hambre = e.energia = e.feliz = e.limp = 100; e.abandonoDesde = null; pintar(); toast('SIN ABANDONO'); }
    else if (a === 'x_ab1') { e.hambre = e.energia = e.feliz = e.limp = 0; e.abandonoDesde = Date.now() - 4 * 86400000; pintar(); toast('DESCUIDADO (4 DÍAS)'); }
    else if (a === 'x_ab2') { e.hambre = e.energia = e.feliz = e.limp = 0; e.abandonoDesde = Date.now() - 8 * 86400000; pintar(); toast('ABANDONO TOTAL (8 DÍAS)'); }
    else if (a === 'x_jardin_semillas') { Object.keys(SEMILLAS).forEach(sk => { e.semillas[sk] = (e.semillas[sk] || 0) + 20; }); pintar(); toast('+20 DE CADA SEMILLA'); }
    else if (a === 'x_jardin_fase') {
      const plots = jardinSync(); let n = 0;
      plots.forEach(p => {
        if (!p.k || p.etapa === 'listo') return;
        const S = SEMILLAS[p.k]; if (!S) return;
        p.dias++; p.regadoHoy = false; p.diaUlt = hoy();
        p.etapa = p.dias >= S.diasCrecer ? 'listo' : 'brote';
        n++;
      });
      pintar();
      toast(n ? 'CRECIMIENTO +1 FASE EN ' + n + (n === 1 ? ' MACETA' : ' MACETAS') : 'NO HAY SEMILLAS CRECIENDO');
      return;
    }
    else if (a === 'x_jardin_full') {
      e.xp = xpDe(NMAX);   // asegura las 6 macetas desbloqueadas
      const plots = jardinSync(), ids = Object.keys(SEMILLAS);
      plots.forEach((p, i) => { const sk = ids[i % ids.length], S = SEMILLAS[sk]; Object.assign(p, { k: sk, etapa: 'listo', dias: S.diasCrecer, diaUlt: hoy(), regadoHoy: true }); });
      cerrar(); lugar = null; llegada = null; e.hab = 'jardin'; pintarNav(); pintar(); toast('JARDÍN: TODO CRECIDO Y LISTO PARA COSECHAR');
      return;
    }
    else if (a === 'x_barras') { e.hambre = e.energia = e.feliz = e.limp = 100; pintar(); }
    else if (a === 'x_barras0') { e.hambre = e.energia = e.feliz = e.limp = 0; pintar(); }
    else if (a === 'x_eterna') {
      const key = cosecharPlanta('eterna');
      colocar(key); e.tiene.aura_eterna = 1; e.ropa.aura = 'aura_eterna';
      pintar(); toast('SEMILLA ETERNA COLOCADA Y VIVA + AURA ETERNA PUESTA: SIMON LEVITA');
    }
    else if (a === 'x_merc') { admMerc = ahora(); e.merc = { dia: hoy(), compras: {}, aviso: true, adios: false }; cerrar(); toast('CORTEX COMERCIANTE LLEGANDO...'); return; }
    else if (a === 'x_nomerc') { admMerc = 0; toast('COMERCIANTE QUITADO'); }
    else if (a === 'x_merc_raro') { admMercRaro = !admMercRaro; if (admMercRaro) { admMerc = ahora(); e.merc = { dia: hoy(), compras: {}, aviso: true, adios: false }; } toast('OBJETO RARÍSIMO (5%): ' + (admMercRaro ? 'FORZADO, ABRE LA BOLSA DE CORTEX' : 'NORMAL')); }
    else if (a === 'x_merc_desc') { admMercDesc = !admMercDesc; if (admMercDesc) { admMerc = ahora(); e.merc = { dia: hoy(), compras: {}, aviso: true, adios: false }; } toast('DESCUENTO ALVARIKOKE: ' + (admMercDesc ? 'FORZADO, ABRE LA BOLSA DE CORTEX' : 'NORMAL')); }
    else if (a === 'x_alv') { e.alv = { st: 0, p: 3, dia: '', hay: false, tiene: 0, noDia: '' }; e.tiene.collar_suerte = 0; if (e.ropa.cuello === 'collar_suerte') e.ropa.cuello = null; e.semillas.suerte = 0; admClima = 'sol'; admHora = 12; cerrar(); if (lugar !== 'parque') irLugar('parque'); toast('TOCA 5 VECES EL ÁRBOL DEL FONDO (DERECHA)'); return; }
    else if (a === 'x_chica') { e.solar = { st: 0, dias: 0, ult: '' }; e.tiene.collar_sol = 0; if (e.ropa.cuello === 'collar_sol') e.ropa.cuello = null; e.semillas.solar = 0; admClima = 'sol'; admHora = 12; cerrar(); if (lugar !== 'parque') irLugar('parque'); setTimeout(() => { if (lugar === 'parque' && !chicaN && typeof chicaSpawn === 'function') chicaSpawn(); }, 1200); toast('TOCA A LA CHICA DEL PARQUE'); return; }
    else if (a === 'x_sif') { const S_ = SF(); S_.f = 0; S_.v = Math.max(S_.v, 1); e.sifK = Math.max(e.sifK || 0, 3); sifP = null; sifProx = Date.now() + 500; cerrar(); if (lugar !== 'parque') irLugar('parque'); toast('TOCA AL PERRITO CON UN KEKE (TIENES 3)'); return; }
    else if (a === 'x_nosif') { e.sif = { f: 0, v: 0 }; e.sifK = 0; sifP = null; sifProx = 0; toast('SIF REINICIADO'); }
    else if (a === 'x_visita') { cerrar(); e.proxVisita = 0; setTimeout(visitaAdm, 700); return; }
    else if (a === 'x_racha') {
      const o = [0, 1, 3, 7, 14, 30, 100], n = o[(o.indexOf(e.racha || 0) + 1) % o.length];
      e.racha = n; e.mejorRacha = Math.max(e.mejorRacha || 0, n); toast('RACHA: ' + n + (n === 1 ? ' DÍA' : ' DÍAS'));
    }
    else if (a === 'x_esp_rep') { e.espReparado = 1; pintar(); toast('RECÁMARA ESPACIAL: REPARADA'); }
    else if (a === 'x_esp_ruina') {
      e.espReparado = 0;
      if (e.hab === 'espacial') { cerrar(); lugar = null; llegada = null; e.hab = (e.habAntes && e.habAntes !== 'espacial') ? e.habAntes : 'sala'; pintarNav(); }
      pintar(); toast('RECÁMARA ESPACIAL: EN RUINAS');
    }
    else if (a === 'x_temp') { const o = [null, 'hal', 'nav', 'val', 'none']; admTemp = o[(o.indexOf(admTemp) + 1) % o.length]; }
    else if (a === 'x_clima') { const o = [null, 'sol', 'nublado', 'lluvia', 'tormenta', 'nieve', 'arcoiris']; admClima = o[(o.indexOf(admClima) + 1) % o.length]; }
    else if (a === 'x_mis') { e.mis = null; e.preg = null; e.adv = { f: '', n: 0 }; toast('MISIONES REINICIADAS'); }
    else if (a === 'x_regalo') { e.ultimoRegalo = ''; toast('REGALO DIARIO REINICIADO'); }
    else if (a === 'x_salir') { salirAdmin(); return; }
    render();
  }
