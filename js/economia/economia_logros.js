  /* ===================== MONEDAS, CARIÑO Y LOGROS ===================== */
  const hoy = () => window.__fecha || (d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'))(new Date(ahora()));
  const difDias = (a, b) => { const A = a.split('-').map(Number), B = b.split('-').map(Number); return Math.round((Date.UTC(B[0], B[1] - 1, B[2]) - Date.UTC(A[0], A[1] - 1, A[2])) / 86400000); };
  /* ===================== ECONOMÍA Y PROGRESIÓN (todo el balance vive aquí) =====================
     Meta: nivel máximo 100 (la historia y el contenido nuevo irán llenando los niveles 26+; hoy hay regalos gratis cada 5 niveles hasta NV100 y objetos de tienda hasta NV25). Llegar a NV100 toma ~9 meses a tope y ~1 año a ritmo regular.
     Tiempo de juego diario para llegar a TODOS los topes: ~20-25 min al inicio, ~35 min hacia NV25, ~60 min hacia NV50 y ~90 min en NV100 (tras NV25 los topes crecen a 40%).
     Días por nivel (jugador dedicado): NV2 en minutos · NV5 en la primera partida (día 1) · NV10 día 4 · NV25 día ~23 · NV50 día ~83 · NV75 día ~164 · NV100 día ~263. Un jugador regular (60%) tarda ~35% más.
     Ingreso diario (todo incluido): NV1 ~150 monedas · NV10 ~265 · NV25 ~410 · NV100 ~700. Cada nivel da monedas (bono) y un REGALO GRATIS (LVGIFT: uno por nivel hasta NV20 y uno cada 5 niveles después); los múltiplos de 5 dan doble bono y los de 25 triple.
     El catálogo actual (~55 mil monedas) se compra hacia el día ~100: los niveles 26+ necesitan contenido nuevo. Los topes diarios evitan "granjear" en una tarde.
     Para agregar contenido nuevo: ponle nv (nivel de cariño) y precio con ECON_P(nv) como guía (el precio crece ~1.6x respecto al ingreso por nivel). */
  // (NMAX definido en config.js)
  // (nEf, XP_F, xpDe0, TOPE_XP, XPT, xpDe, ECO definidos en config.js)

  function nivel() { let n = 1; while (n < NMAX && e.xp >= xpDe(n + 1)) n++; return n; }
  const bonoNivelJuego = () => { const n = nivel(); return n >= 90 ? 3 : n >= 60 ? 2 : n >= 30 ? 1 : 0; };
  function progreso() { const n = nivel(); return n >= NMAX ? 1 : (e.xp - xpDe(n)) / (xpDe(n + 1) - xpDe(n)); }
  const toastQ = []; let toastOn = false;
  function toast(t) {
    if (toastOn) { if (!toastQ.includes(t)) { toastQ.push(t); while (toastQ.length > 2) toastQ.shift(); } return; }
    toastOn = true; toastMuestra(t);
  }
  let tipMon = 0;
  function faltanMon(n) {   // no alcanzan las monedas: avisa cuántas faltan y cómo conseguirlas
    const T = ['Cumple las misiones del día para ganar monedas', 'Juega en el arcade: cada partida da monedas', 'Reclama tus trofeos y logros: dan monedas', 'Entra cada día por tu regalo diario', 'Subir de nivel también te da monedas'];
    toast('Te faltan ' + n + ' monedas'); toast(T[tipMon++ % T.length]);
  }
  function toastMuestra(t) {
    const d = document.createElement('div'); d.className = 'toast'; d.textContent = t;
    const c = $('toasts'); c.appendChild(d);
    // si hay un diálogo abierto, los avisos van justo encima de su cuadro
    const bx = $('dlg').classList.contains('on') ? $('dlg-box').getBoundingClientRect() : null, pr = c.parentElement.getBoundingClientRect();
    c.style.bottom = bx && bx.height ? Math.max(132, Math.round(pr.bottom - bx.top + 6)) + 'px' : '';
    while (c.children.length > 1) c.firstChild.remove();
    setTimeout(() => d.remove(), 2400);
    setTimeout(() => { if (toastQ.length) toastMuestra(toastQ.shift()); else toastOn = false; }, 2500);
  }
  function darXp(x) {
    const antes = nivel(); e.xp += x;
    // Durante el tutorial, no subir de nivel 1 — NV2 llega con el regalo diario
    if (introActiva) { const tope = xpDe(2) - 1; if (e.xp > tope) e.xp = tope; }
    const ahora = nivel();
    for (let n = antes + 1; n <= ahora; n++) subirNivel(n);
  }
  var celQ = [], celCur = null;
  function subirNivel(n) {
    const bono = Math.round(ECO.bono(n)); e.monedas += bono; e.total += bono;
    e.energia = clamp(e.energia + 25);
    e.feliz = clamp(e.feliz + 50);
    const gifts = []; let gcomp = 0;   // regalos del nivel (1 o 2); si ya tenías uno, te pagan la mitad de su valor
    regalosDe(n).forEach(gk => { if (!ITEMS[gk]) return; if (e.tiene[gk]) { const c = Math.round((ITEMS[gk].val || ITEMS[gk].p || 200) * .5); gcomp += c; e.monedas += c; e.total += c; } else { e.tiene[gk] = 1; gifts.push(gk); } });
    const gift = gifts[0] || null;
    const g = GESTOS.find(g => g.nv === n), zonas = HABS.filter(h => h.nv === n && n > 1 && !h.oculta), lg = LUGARES.find(l => l.nv === n);
    const nuevos = Object.keys(ITEMS).filter(k => ITEMS[k].nv === n && !ITEMS[k].regalo && !ITEMS[k].mercader && ITEMS[k].p > 0 && !habBloq(k));
    zonas.forEach(z => Object.keys(ITEMS).forEach(k => { if (ITEMS[k].tema === z.id && ITEMS[k].nv < n && !ITEMS[k].regalo && !ITEMS[k].mercader && ITEMS[k].p > 0 && !nuevos.includes(k)) nuevos.push(k); }));
    const ropa = nuevos.some(k => ITEMS[k].tipo === 'ropa'), deco = nuevos.some(k => ITEMS[k].tipo === 'cuarto'), comida = Object.keys(COMIDAS).some(k => COMIDAS[k].nv === n && COMIDAS[k].p > 0);
    { const pt = []; if (g) pt.push('gesto ' + g.n); zonas.forEach(z => pt.push(z.id === 'entrada' ? 'zona ENTRADA' : 'habitación ' + z.n)); if (lg) pt.push('lugar ' + lg.n); if (ropa) pt.push('ropa nueva'); if (deco) pt.push('decoración nueva'); if (comida) pt.push('comida nueva'); gifts.forEach(k => pt.push('regalo ' + ITEMS[k].n)); notificar('¡Cariño NV' + n + '!' + (pt.length ? ' Nuevo: ' + pt.join(' · ') + '.' : '') + ' +' + bono + ' monedas.'); }
    if (n >= 2 && e.intro) e.memPend.push(n);
    celQ.push({ n, bono, gift, gifts, gcomp, g, zonas, lg, ropa, deco, comida, items: nuevos.slice(), foods: Object.keys(COMIDAS).filter(k => COMIDAS[k].nv === n && COMIDAS[k].p > 0) });
    celebraCheck();
  }
  function regalosAtrasados() {   // entrega en silencio los regalos de niveles ya alcanzados que falten (partidas de prueba o guardados anteriores a un cambio de LVGIFT)
    let n = 0; const lv = nivel();
    Object.keys(LVGIFT).forEach(l => { if (+l <= lv) regalosDe(l).forEach(gk => { if (ITEMS[gk] && !e.tiene[gk]) { e.tiene[gk] = 1; n++; } }); });
    return n;
  }
  function celebraCheck() {
    if (!celQ.length || !eventoLibre(EV_CEL)) return;
    celCur = celQ.shift(); abrir('celebra'); sfx.logro();
    if (celCur.zonas.length || celCur.lg) setTimeout(() => estrellas(12), 450);
    estrellas(14); corazones(5); gesto(celCur.g ? celCur.g.id : 'baile');
    [300, 700, 1100].forEach(t => setTimeout(() => { if (modal === 'celebra') estrellas(8); }, t));
  }
  function renderCel() {
    const c = celCur; if (!c) return '';
    $('m-titulo').textContent = '¡FELICIDADES!';
    let d = 0; const dl = () => `style="animation-delay:${(d += .12).toFixed(2)}s"`;
    const conf = Array.from({ length: 14 }, (_, i) => `<i style="left:${((i * 37 + 7) % 100)}%;background:${['#ff5a7a', '#ffd84a', '#6ad0ff', '#7aff9a', '#c89aff'][i % 5]};animation-delay:${((i * 0.23) % 2.0).toFixed(2)}s;animation-duration:${(2.0 + (i % 4) * .4).toFixed(1)}s"></i>`).join('');
    let h = `<div class="cel-wrap"><div class="cel-rayos"></div><div class="cel-conf">${conf}</div>` +
      `<div class="cel-head">` +
        `<div class="cel-medalla"><div class="cel-med-t">NV</div><div class="cel-med-n">${c.n}</div></div>` +
        `<div class="cel-info"><div class="cel-sube">¡SUBISTE DE NIVEL!</div><div class="cel-chips-row"><span class="cel-chip">🪙 +${c.bono} MONEDAS</span><span class="cel-chip cel-stat">⚡+25% ❤️+50%</span></div></div>` +
      `</div></div>`;

    let hayDes = false;
    if (c.gifts && c.gifts.length) {
      hayDes = true;
      c.gifts.forEach(gk => {
        const it = ITEMS[gk], tipo = it.estilo === 'pared' ? 'PARED' : it.estilo === 'piso' ? 'PISO' : '';
        h += `<div class="cel-card cel-gift" ${dl()}>` +
          `<div class="cel-pv cel-pv-gift"><canvas data-prev="${gk}"></canvas></div>` +
          `<div class="cel-card-info"><div class="cel-tag gold">★ REGALO DE NIVEL ★</div><div class="cel-nom">${tipo ? tipo + ': ' : ''}${it.n}</div></div>` +
        `</div>`;
      });
    }
    if (c.gcomp) {
      hayDes = true;
      h += `<div class="cel-badge-comp" ${dl()}><span>🪙 YA TENÍAS EL REGALO:</span> <b>+${c.gcomp} MONEDAS</b></div>`;
    }

    c.zonas.forEach(z => {
      hayDes = true;
      h += `<div class="cel-card cel-hab" ${dl()}>` +
        `<div class="cel-pv cel-pv-hab"><canvas data-prev="hb_${z.id}"></canvas></div>` +
        `<div class="cel-card-info"><div class="cel-tag blue">★ ${z.id === 'entrada' ? 'NUEVA ZONA' : 'NUEVA HABITACIÓN'} ★</div><div class="cel-nom">${z.n}</div></div>` +
      `</div>`;
    });

    if (c.lg) {
      hayDes = true;
      h += `<div class="cel-card cel-lugar" ${dl()}>` +
        `<div class="cel-pv cel-pv-hab"><canvas data-prev="lg_${c.lg.id}"></canvas></div>` +
        `<div class="cel-card-info"><div class="cel-tag green">★ NUEVO LUGAR EN EL MAPA ★</div><div class="cel-nom">${c.lg.n}</div></div>` +
      `</div>`;
    }

    const its = c.items.filter(k => k !== undefined), fds = c.foods;
    if (its.length || fds.length) {
      hayDes = true;
      const tot = its.length + fds.length, vis = [...fds.map(k => 'fd_' + k), ...its].slice(0, 7);
      h += `<div class="cel-tienda" ${dl()}>` +
        `<div class="cel-tienda-top"><span class="cel-tag cyan">🛒 NUEVO EN LA TIENDA</span><span class="cel-cnt">+${tot} ${tot === 1 ? 'ARTÍCULO' : 'ARTÍCULOS'}</span></div>` +
        `<div class="cel-its">${vis.map(k => `<div class="cel-it"><canvas data-prev="${k}"></canvas></div>`).join('')}${tot > 7 ? `<div class="cel-it mas">+${tot - 7}</div>` : ''}</div>` +
      `</div>`;
    }

    if (c.g) {
      hayDes = true;
      h += `<div class="cel-gesto" ${dl()}><span class="cel-g-ico">✨</span><span>NUEVO GESTO: <b>${c.g.n}</b></span></div>`;
    }

    if (!hayDes) {
      h += `<div class="cel-vacio" ${dl()}>❤️ ¡SIMÓN TE QUIERE CADA DÍA MÁS!</div>`;
    }

    h += `<button class="bt ok gran cel-btn" data-a="cel_ok">¡GENIAL!</button>`;
    return h;
  }
  function celClick(a, k) {
    if (a === 'cel_ok') { cerrar(); celCur = null; setTimeout(celebraCheck, 400); return; }
    if (a === 'cel_ir') { cerrar(); celCur = null; sfx.click(); if (k === 'mapa') { abrir('mapa'); return; } setTimeout(() => irHab(HABS.findIndex(h => h.id === k)), 300); setTimeout(celebraCheck, 1500); return; }
    if (a === 'cel_tienda') { celCur = null; tab = k; fHab = 'todo'; tv = 'cat'; tvPre = true; sfx.click(); abrir('tienda'); }
  }
  function ecoDia() { const E = e.eco; if (E.f !== hoy()) { E.f = hoy(); E.c = 0; E.x = 0; E.fr = 0; E.av = 0; } return E; }
  function animarMonedas(cant, esGasto) {
    if (!cant || cant <= 0) return;
    const chip = $('chip-mon');
    if (!chip) return;
    chip.classList.remove('pulso', 'pulso-rojo');
    void chip.offsetWidth;
    chip.classList.add(esGasto ? 'pulso-rojo' : 'pulso');
    if (typeof document !== 'undefined' && document.createElement) {
      try {
        const span = document.createElement('span');
        span.className = 'flotante-mon' + (esGasto ? ' gasto' : '');
        span.textContent = (esGasto ? '-' : '+') + cant;
        chip.appendChild(span);
        setTimeout(() => { try { span.remove(); } catch (_) {} }, 950);
      } catch (_) {}
    }
  }
  if (typeof window !== 'undefined') window.animarMonedas = animarMonedas;

  function animarXp(cant) {
    if (!cant || cant <= 0) return;
    const chip = $('chip-niv');
    if (!chip) return;
    if (typeof document !== 'undefined' && document.createElement) {
      try {
        const span = document.createElement('span');
        span.className = 'flotante-xp';
        span.textContent = '+' + cant + ' XP';
        chip.appendChild(span);
        setTimeout(() => { try { span.remove(); } catch (_) {} }, 950);
      } catch (_) {}
    }
  }
  if (typeof window !== 'undefined') window.animarXp = animarXp;

  // libre = true: recompensas fijas del día (misiones, planta, regalos, hallazgos...) que no cuentan para el tope diario
  function ganar(m, x, libre) {
    if (!libre) {
      const E = ecoDia(), n = nivel();
      if (m) { const tope = Math.floor(ECO.topeMon(n)); m = Math.max(0, Math.min(m, tope - E.c)); E.c += m; }
      if (x) {
        const hueco = Math.max(0, ECO.topeXp(n) - E.x), pleno = Math.min(x, hueco), resto = x - pleno; E.x += x;
        E.fr += resto * .25; const ex = Math.floor(E.fr); E.fr -= ex; x = pleno + ex;
        if (E.x >= ECO.topeXp(n) && !E.av) { E.av = 1; toast('CORTEX: Simon ya tuvo mucho cariño hoy. ¡Mañana habrá más!'); }
      }
    }
    const nAntes = nivel();
    if (x) {
      animarXp(x);
      darXp(x);
    }
    if (m) {
      e.monedas += m; e.total += m;
      if (nivel() === nAntes) sfx.moneda();
      lanzar('moneda', SX + 24 + Math.random() * 8, SY + 10, 0, -2.5, 10);
      animarMonedas(m, false);
    }
  }
  const LOGROS = [
    { id: 'rt10', n: 'Baila 10 veces', d: 'Minijuego de ritmo', meta: 10, r: 40, val: () => e.st.rt },
    { id: 'si100',  n: 'Dile sí 100 veces',          d: 'Simon te responde "sí"',  meta: 100, r: 30,  val: () => e.st.si },
    { id: 'si500',  n: 'Dile sí 500 veces',          d: 'Sí, sí y más sí',         meta: 500, r: 80,  val: () => e.st.si },
    { id: 'comer7', n: 'Alimentarlo 7 días seguidos', d: 'Un día sin comer reinicia', meta: 7, r: 60,  val: () => e.mejorComer },
    { id: 'comer50',n: 'Dale de comer 50 veces',     d: 'Keke para todos',        meta: 50,  r: 40,  val: () => e.st.comer },
    { id: 'jugar30',n: 'Juega 30 veces con él',      d: 'Diversión sin fin',       meta: 30,  r: 40,  val: () => e.st.jugar },
    { id: 'dice20', n: 'Escucha 20 "Simon dice"',    d: 'Sus ideas locas',         meta: 20,  r: 40,  val: () => e.st.dice },
    { id: 'toca100',n: 'Acaricialo 100 veces',       d: 'Toca a Simon',            meta: 100, r: 50,  val: () => e.st.toques },
    { id: 'dormir10',n:'Duérmelo 10 veces',          d: 'Duerme bien, Simon',      meta: 10,  r: 30,  val: () => e.st.dormir },
    { id: 'racha7', n: 'Reclama 7 regalos diarios', d: 'Un regalo por día',     meta: 7,   r: 100, val: () => e.mejorRacha },
    { id: 'nivel5', n: 'Llega al cariño nivel 5',    d: 'Simon te quiere mucho',   meta: 5,   r: 40, val: () => nivel() },
    { id: 'nivel10', n: 'Llega al cariño nivel 10', d: 'Ya son mejores amigos',   meta: 10,  r: 100, val: () => nivel() },
    { id: 'nivel15', n: 'Llega al cariño nivel 15', d: 'Familia de otro planeta', meta: 15,  r: 150, val: () => nivel() },
    { id: 'nivel20', n: 'Llega al cariño nivel 20', d: 'Inseparables',            meta: 20,  r: 250, item: 'sud_galaxia', val: () => nivel() },
    { id: 'nivel25', n: 'Llega al cariño nivel 25', d: 'Cariño legendario',       meta: 25,  r: 400, val: () => nivel() },
    { id: 'nivel50', n: 'Llega al cariño nivel 50', d: 'Media vida juntos',       meta: 50,  r: 800, item: 'aura_mistica', val: () => nivel() },
    { id: 'nivel75', n: 'Llega al cariño nivel 75', d: 'Amigos para siempre',     meta: 75,  r: 1200, val: () => nivel() },
    { id: 'nivel100', n: 'Llega al cariño nivel 100', d: 'Cariño infinito',       meta: 100, r: 2000, val: () => nivel() },
    { id: 'compra5',n: 'Compra 5 cosas',             d: 'Ropa y muebles',          meta: 5,   r: 50,  val: () => e.st.compras },
    { id: 'ricos',  n: 'Gana 500 monedas en total',  d: 'Simon es rico',           meta: 500, r: 50,  val: () => e.total },
    { id: 'foto1', n: 'Toma tu primera foto', d: 'Usa el botón de cámara', meta: 1, r: 20, val: () => e.st.fotos },
    { id: 'foto5', n: 'Toma 5 fotos', d: 'Compártelas con tus amigos', meta: 5, r: 40, val: () => e.st.fotos },
    { id: 'chef8', n: 'Prueba 8 comidas distintas', d: 'Comida especial de la tienda', meta: 8, r: 60, val: () => Object.keys(e.probo).length },
    { id: 'deco6', n: 'Pon 6 cosas en tu habitación', d: 'Muebles y decoración', meta: 6, r: 60, val: () => e.deco.filter(d => d.k !== 'puf_azul' && d.k !== 'racha' && !String(d.k).startsWith('juguete_')).length },
    { id: 'sec12', n: 'Descubre 12 secretos de Simon', d: 'Pregúntale cosas', meta: 12, r: 80, val: () => Object.keys(e.sec).length },
    { id: 'sec24', n: 'Descubre todos sus secretos', d: 'Diario completo', meta: 24, r: 200, item: 'collar_diamante', val: () => Object.keys(e.sec).length },
    { id: 'racha30', n: 'Reclama 30 regalos diarios', d: 'Constancia de campeón', meta: 30, r: 200, item: 'alas_dragon', val: () => e.mejorRacha },
    { id: 'mis50', n: 'Completa 50 misiones de Cortex', d: 'Su mejor ayudante', meta: 50, r: 150, item: 'bufanda_arcoiris', val: () => e.st.misiones },
    { id: 'compra25', n: 'Compra 25 cosas', d: 'Ropa y muebles', meta: 25, r: 100, val: () => e.st.compras },
    { id: 'adiv10', n: 'Adivina 10 veces en qué piensa Simon', d: 'Ve sus pensamientos', meta: 10, r: 50, val: () => e.st.adiv },
    { id: 'album18', n: 'Completa el álbum de Simon', d: 'Todo lo que imagina', meta: 18, r: 150, item: 'gafas_arcoiris', val: () => Object.keys(e.pens).length },
    { id: 'mis10', n: 'Completa 10 misiones de Cortex', d: 'Tres nuevas cada día', meta: 10, r: 60, val: () => e.st.misiones },
    { id: 'bomba10', n: 'Explota a Cortex 10 veces', d: 'A Simon le encanta', meta: 10, r: 80, item: 'marco_boom', val: () => e.st.bombas },
    { id: 'parque5', n: 'Juega 5 veces en el parque', d: 'Sal por la puerta de la entrada', meta: 5, r: 60, val: () => e.st.parque },
    { id: 'merc3', n: 'Comercia con Cortex 3 veces', d: 'Viene una vez al día',  meta: 3,   r: 60,  val: () => e.st.tratos },
    { id: 'bano3', n: 'Báñalo 3 veces', d: 'Toca la regadera del baño', meta: 3, r: 40, val: () => e.st.banos || 0 },
    { id: 'visitas3', n: 'Recibe 3 visitas de Cortex', d: 'Viene de vez en cuando', meta: 3, r: 60, val: () => e.st.visitas },
    { id: 'mjrec', n: 'Supera tu récord en Atrapa el keke', d: 'Juega en MINIJUEGOS', meta: 1, r: 50, val: () => e.mj.rompio },
    { id: 'mj25', n: 'Consigue 25 puntos atrapando keke', d: 'Esquiva las bombas', meta: 25, r: 60, val: () => e.mj.rec },
    { id: 'dibu5',  n: 'Junta los 5 dibujos de Simon', d: 'Los encuentra solo',    meta: 5,   r: 80,  val: () => Object.keys(e.dibujos).length }
  ];
  LOGROS.forEach(l => { if (!['nivel50', 'nivel75', 'nivel100'].includes(l.id)) l.r = Math.round(l.r * 1.5 / 5) * 5; });
  function revisar() {
    PREM_SETS.forEach(s => { if (!e.tiene[s.premio] && s.items.every(k => e.tiene[k])) { e.tiene[s.premio] = 1; toast('¡SET ' + s.n + ' COMPLETO! ' + ITEMS[s.premio].n); sfx.logro(); setTimeout(() => { sfx.regalo(); estrellas(12); }, 400); notificar('Set ' + s.n + ' completo: ' + ITEMS[s.premio].n); } });
    LOGROS.forEach(l => {
      if (e.logros[l.id] || l.val() < l.meta) return;
      e.logros[l.id] = 1; e.monedas += l.r; e.total += l.r;
      toast('¡LOGRO! ' + l.n + ' +' + l.r); if (!l.id.startsWith('nivel')) sfx.logro(); notificar('Logro: ' + l.n + ' (+' + l.r + ' monedas)');
      if (l.item && !e.tiene[l.item]) { e.tiene[l.item] = 1; if (ITEMS[l.item].tipo === 'ropa') { toast('¡PRENDA PREMIUM: ' + ITEMS[l.item].n + '!'); setTimeout(() => { sfx.regalo(); estrellas(10); }, 400); } else toast('¡Nueva obra para tu cuadro: ' + ITEMS[l.item].n.replace('OBRA: ', '') + '!'); }
    });
  }

