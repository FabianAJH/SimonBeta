  /* ===================== INTERFAZ ===================== */

  var MINI = {
    keke: ['...r...', '.wwwww.', 'ppppppp', 'yyyyyyy', 'ppppppp', 'yyyyyyy', '.bbbbb.'],
    luna: ['..yyy..', '.yyy...', 'yyy....', 'yyy....', 'yyy....', '.yyy...', '..yyyy.'],
    rayo: ['....w..', '...yw..', '..yyw..', '.yyyyy.', '...yw..', '..yw...', '.y.....'],
    feliz: ['.yyyyy.', 'yyyyyyy', 'yykykyy', 'yyyyyyy', 'ykyyyky', 'yykkkyy', '.yyyyy.'],
    normal: ['.yyyyy.', 'yyyyyyy', 'yykykyy', 'yyyyyyy', 'yyyyyyy', 'yykkkyy', '.yyyyy.'],
    triste: ['.yyyyy.', 'yyyyyyy', 'yykykyy', 'yyyyyyy', 'yykkkyy', 'ykyyyky', '.yyyyy.'],
    gota: ['.c...c.', 'ww.c...', 'wwwqqqq', 'wwwpppd', 'wwwpppd', 'wwppppd', 'ddddddd'],   // barra de jabón rosa con espuma y burbujitas
    llora: ['.yyyyy.', 'yyyyyyy', 'yykykyy', 'yybybyy', 'yybybyy', 'yykkkyy', '.ykyyky']
  };
  function dibMini(id, m) {
    const c = $(id).getContext('2d'), col = { a: '#4ab8ff', r: '#ff4a6a', w: '#ffffff', p: '#ff9ab0', y: '#ffd84a', b: '#a8601c', k: '#232b63', d: '#d8607e', c: '#9ad8ff', q: '#ffd0dc' };
    if (id === 'si-h') col.y = '#ffd070';
    if (id === 'si-f') col.b = '#4ab8ff';
    c.clearRect(0, 0, 7, 7);
    m.forEach((f, y) => [...f].forEach((ch, x) => { if (col[ch]) { c.fillStyle = col[ch]; c.fillRect(x, y, 1, 1); } }));
  }
  function pintarCara() {
    const st = e.feliz > 70 ? 'feliz' : e.feliz > 45 ? 'normal' : e.feliz > 20 ? 'triste' : 'llora';
    if (pintarCara.s !== st) { pintarCara.s = st; dibMini('si-f', MINI[st]); }
  }
  function asegurarRacha() {
    if (!e || !Array.isArray(e.deco)) return;
    e.deco.forEach(d => { if (ITEMS[d.k] && ITEMS[d.k].slot === 'juguete') d.h = 'sala'; });
    const r = e.deco.find(d => d.k === 'racha');
    if (!r) e.deco.push({ k: 'racha', x: -31, y: -61, f: 0, h: 'sala' });
    else if ((r.x === -60 && r.y === -52) || (r.x === 70 && r.y === -48) || (r.x === 21 && r.y === -5) || (r.x === 23 && r.y === -5) || (r.x === 23 && r.y === -8) || (r.x === -30 && r.y === -53)) { r.x = -31; r.y = -61; }
    const tj = e.deco.find(d => ITEMS[d.k] && ITEMS[d.k].slot === 'juguete');
    if (!tj) e.deco.push({ k: 'juguete_pelota', x: -10, y: 77, f: 0, h: 'sala' });
  }
  function pintar() {
    document.documentElement.style.setProperty('--ft', [1, 1.2, 1.4][e.fuente == null ? 1 : e.fuente] || 1.2);
    asegurarRacha(); revisar(); pintarNav(); pintarCara();
    ['hambre', 'energia', 'feliz', 'limp'].forEach(k => {
      const s = $('s-' + k);
      if (!s) return;
      s.style.width = Math.max(4, e[k]) + '%';
      s.className = 'hpf ' + (e[k] > 50 ? 'ok' : e[k] > 25 ? 'medio' : 'bajo');
      const box = s.closest ? s.closest('.stat') : (s.parentElement && s.parentElement.parentElement);
      if (box && box.classList) box.classList.toggle('critico', e[k] <= 15);
    });
    $('l-dormir').textContent = e.dormido ? 'Despertar' : 'Dormir'; if (e.dormido !== pintarIconosBtn.d) { pintarIconosBtn(); }
    const n = nivel();
    $('v-mon').textContent = e.monedas;
    $('v-niv').textContent = 'NV' + n;
    checkTareas();
    const chEnf = $('chip-enf'); if (chEnf) chEnf.classList.toggle('oculto', !e.enf);
    $('v-fue').textContent = racha(); $('chip-fue').classList.toggle('apagada', !racha());
    { const cn = $('chip-niv'), mx = nivel() >= NMAX; cn.style.setProperty('--p', Math.round(progreso() * 100) + '%'); cn.classList.toggle('max', mx);
      if (cn._n && nivel() > cn._n) { cn.classList.remove('sube'); void cn.offsetWidth; cn.classList.add('sube'); } cn._n = nivel(); }
    pintarMis();
  }
  let tBurbuja;
  // coloca el globo justo encima de la cabeza de Simon y apunta la colita hacia ella
  function posBurbuja() {
    const b = $('burbuja'); if (!b.classList.contains('on')) return;
    const es = $('escena').getBoundingClientRect(), sc = $('sc').getBoundingClientRect(); if (!sc.width) return;
    const k = sc.width / LW, hx = sc.left - es.left + (SX + SW / 2) * k, hy = sc.top - es.top + (SY + 3) * k, bw = b.offsetWidth, bh = b.offsetHeight;
    const L = Math.max(bw / 2 + 8, Math.min(es.width - bw / 2 - 8, hx)), T = Math.max(8, hy - bh - 14);
    b.style.left = Math.round(L) + 'px'; b.style.top = Math.round(T) + 'px';
    b.style.setProperty('--tx', Math.round(Math.max(16, Math.min(bw - 16, hx - (L - bw / 2)))) + 'px');
  }
  setInterval(() => { posBurbuja(); if (modal === 'editar') posEdOverlay(); }, 60);
  function decir(txt, tr, dur) {
    if (escenaId() === 'jardin') return;   // en el jardín Simon no habla: es momento de estar con las plantas
    if (e && e.dormido && escenaId() !== 'sala') { if (/zzz/i.test(txt)) toast('SIMON ESTÁ DURMIENDO'); return; }
    const b = $('burbuja');
    if (!tr && e && e.traductor) { const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(txt); if (m) { txt = m[1]; tr = m[2].charAt(0).toUpperCase() + m[2].slice(1) + (/[.!?…]$/.test(m[2]) ? '' : '.'); } }
    if (!(e && e.traductor)) {   // sin traductor Simon solo dice "Sí" (o ronca): nada de frases ni explicaciones entre paréntesis
      tr = null; txt = String(txt).replace(/\s*\([^)]*\)\s*$/, '');
      if (!/^[¡¿]?(s[ií]|zzz)(?![a-záéíóúñ])/i.test(txt)) txt = 'Sí.';
    }
    b.textContent = txt; if (/ach[úu]/i.test(txt)) estornudo();
    if (tr) { const sp = document.createElement('div'); sp.className = 'tr'; const ic = document.createElement('canvas'); ic.width = 12; ic.height = 13; ic.getContext('2d').drawImage(sprite('ic_trad', iconoTrad, 0), 0, 0); const bd = document.createElement('div'); bd.className = 'ti'; bd.appendChild(ic); const cu = document.createElement('div'); cu.className = 'tt'; const lb = document.createElement('small'); lb.textContent = 'TRADUCTOR'; const tx = document.createElement('span'); tx.textContent = '«' + tr + '»'; cu.appendChild(lb); cu.appendChild(tx); sp.appendChild(bd); sp.appendChild(cu); b.appendChild(sp); }
    b.classList.add('on'); posBurbuja();
    clearTimeout(tBurbuja);
    tBurbuja = setTimeout(() => b.classList.remove('on'), dur || (tr ? 3600 : 2400));
  }
  // Voz de Simon: siempre el mismo "sí"
  const vozSi = new Audio('si.mp3');
  vozSi.preload = 'auto';
  function hablar() {
    if (escenaId() === 'jardin') return;   // en el jardín Simon no habla
    bocaT = 15;
    if (e.mudo || document.hidden) return;
    try {
      vozSi.currentTime = 0;
      const p = vozSi.play();
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  }
  function corazones(n) { for (let i = 0; i < n; i++) lanzar('corazon', SX + 14 + i * 12 + Math.random() * 3, SY + 8 - i * 4, 0, -2, 12 + i * 2); }
  function estrellas(n) { for (let i = 0; i < n; i++) lanzar('estrella', SX - 2 + Math.random() * 56, SY + 4 + Math.random() * 40, 0, -.5, 8 + i * 2); }
  function responder(extra, causa) {
    decir('Sí.', e.traductor ? (extra ? extra.replace(/[()]/g, '') : traducir(causa || 'otro')) : null);
    e.st.si++; gesto(); hablar();
  }
