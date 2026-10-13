  /* ===================== MINIJUEGO: MEMORIA CON CORTEX ===================== */
  // (MEM_COSTO, MEM_NV, MEM_DIV definidos en config.js)
  const MEM_RONDAS = [{ p: 6, c: 3, prev: 2600, par: 28, max: 5 }, { p: 8, c: 4, prev: 2400, par: 42, max: 7 }, { p: 10, c: 4, prev: 2200, par: 60, max: 9 }];
  var mem = null;
  function memDi(t, cls) { $('mem-cx').textContent = t; }
  function memRetrato() {
    const c = $('mem-p'), px = c.getContext('2d'); px.imageSmoothingEnabled = false; px.clearRect(0, 0, 76, 80);
    const kc = 'cortex'; sprite(kc, () => cortexGrid(false, null, false, false), 0); px.drawImage(gridCanvas(recorte(gridCache[kc], 7, 0, 46, 49)), 0, 0, 76, 80);
  }
  function memT(fn, ms) { const id = setTimeout(() => { if (mem) fn(); }, ms); mem.to.push(id); }
  function memIniciar() {
    if (e.dormido) { cerrar(); decir('Zzz...'); sfx.no(); return; }
    if (nivel() < MEM_NV) { toast('Se desbloquea en cariño NV' + MEM_NV); sfx.no(); return; }
    if (e.enf) { cerrar(); decir('Sí... ¡achú!', e.traductor ? 'Resfriado no puedo jugar.' : null, 3000); sfx.no(); return; }
    if (e.energia < MEM_COSTO) { cerrar(); decir('Sí...', e.traductor ? 'Estoy muy cansado.' : null); hablar(); sfx.no(); avisoSueno(); return; }
    cerrar(false); modal = 'mem'; e.energia = clamp(e.energia - sifE(MEM_COSTO)); pintar(); mjElegirCancion();
    mem = { ronda: 0, pts: 0, fallos: 0, combo: 0, mejorCombo: 0, rondasOk: 0, fin: false, to: [], cartas: [], a: null, lock: true, consec: 0, rf: 0, pistas: 0, t0: 0, perdio: false };
    $('mem-fin').classList.remove('on'); $('mem').classList.add('on'); memRetrato(); memRonda(); if (typeof navPush === 'function') navPush();
  }
  function memHud() { $('mem-r').textContent = 'RONDA ' + (mem.ronda + 1) + '/' + MEM_RONDAS.length; $('mem-pts').textContent = 'PTS ' + mem.pts; $('mem-f').textContent = 'FALLOS ' + mem.rf + '/' + MEM_RONDAS[mem.ronda].max; }
  function memRonda() {
    const R = MEM_RONDAS[mem.ronda], objs = mezclar(OBJ.slice(), Math.random).slice(0, R.p);
    mem.cartas = mezclar(objs.concat(objs), Math.random).map(o => ({ o, ok: false })); mem.a = null; mem.lock = true; mem.consec = 0; mem.rf = 0; mem.pistas = 0;
    const g = $('mem-grid'); g.innerHTML = ''; g.style.setProperty('--c', R.c);
    mem.cartas.forEach((c, i) => { const b = document.createElement('button'); b.className = 'mc up'; b.dataset.i = i; b.innerHTML = '<span class="q">?</span>'; b.appendChild(lienzoObj(c.o, false, 48)); g.appendChild(b); });
    memHud(); memDi(mem.ronda === 0 ? '¡Memoriza las cartas, Simon! Después se voltean.' : '¡Más cartas! Memoriza bien.');
    memT(() => { g.querySelectorAll('.mc').forEach(b => b.classList.remove('up')); mem.lock = false; mem.t0 = Date.now(); memDi('¡Ahora tú! Busca las parejas.'); sfx.click(); }, R.prev);
  }
  function memCarta(i) { return $('mem-grid').children[i]; }
  function memClick(i) {
    if (!mem || mem.lock || mem.fin) return; const c = mem.cartas[i]; if (!c || c.ok || mem.a === i) return;
    memCarta(i).classList.add('up'); sfx.click();
    if (mem.a == null) { mem.a = i; return; }
    const j = mem.a; mem.a = null; mem.lock = true;
    if (mem.cartas[j].o.id === c.o.id) {
      mem.cartas[j].ok = c.ok = true; mem.combo++; mem.mejorCombo = Math.max(mem.mejorCombo, mem.combo); mem.consec = 0;
      mem.pts += 10 + Math.min(10, (mem.combo - 1) * 2);
      [i, j].forEach(k => { memCarta(k).classList.remove('up'); memCarta(k).classList.add('up', 'ok'); }); sfx.moneda(); memHud();
      memDi(mem.combo >= 3 ? '¡Racha de ' + mem.combo + '! ¡Increíble!' : elige(['¡Esa es!', '¡Pareja!', '¡Qué memoria, Simon!', '¡Bien hecho!']));
      if (mem.cartas.every(x => x.ok)) memT(memRondaFin, 700); else memT(() => { mem.lock = false; }, 250);
    } else {
      mem.fallos++; mem.rf++; mem.combo = 0; mem.consec++; sfx.no(); memHud(); const resta = MEM_RONDAS[mem.ronda].max - mem.rf; memDi(resta <= 0 ? '¡Ay no! Ya no quedan intentos...' : resta === 1 ? '¡Cuidado! Te queda 1 intento.' : elige(['Uy, casi.', 'Esa no era.', 'Mmm... concéntrate.', 'Casi, casi. Otra vez.']));
      memT(() => {
        memCarta(i).classList.remove('up'); memCarta(j).classList.remove('up');
        if (mem.rf >= MEM_RONDAS[mem.ronda].max) { mem.perdio = true; memT(memFin, 600); return; }
        if (mem.consec >= 3 && mem.pistas < 1) {   // Cortex ayuda: enseña una pareja un momento
          const libres = mem.cartas.map((x, k) => k).filter(k => !mem.cartas[k].ok), k1 = libres[Math.floor(Math.random() * libres.length)];
          mem.pistas++; mem.consec = 0; memDi('Mmm... creo que vi algo ahí.'); memCarta(k1).classList.add('up');   // pista sutil: solo destella UNA carta
          memT(() => { memCarta(k1).classList.remove('up'); mem.lock = false; }, 650);
        } else mem.lock = false;
      }, 800);
    }
  }
  function memRondaFin() {
    const R = MEM_RONDAS[mem.ronda], t = (Date.now() - mem.t0) / 1000, bono = Math.max(0, 20 - mem.rf * 3) + Math.min(15, Math.max(0, Math.floor(R.par - t)));
    mem.pts += bono; mem.rondasOk++; memHud(); sfx.nivel();
    if (mem.ronda < MEM_RONDAS.length - 1) { memDi('¡Ronda superada! +' + bono + ' de bono. Vamos con más cartas.'); mem.ronda++; memT(memRonda, 1800); }
    else { memDi('¡Las superaste todas! +' + bono + ' de bono. ¡Eres un crack, Simon!'); memT(memFin, 1500); }
  }
  function memFin() {
    if (!mem || mem.fin) return; if (mem.perdio) memDi('Casi lo logras, Simon. ¡Otra vez!'); mem.fin = true; mem.to.forEach(clearTimeout); mem.lock = true;
    const base = Math.floor(mem.pts / MEM_DIV), bonoNv = base > 0 ? bonoNivelJuego() : 0, gana = base + bonoNv;
    e.st.mem++;
    e.feliz = clamp(e.feliz + Math.min(25, 8 + Math.floor(mem.pts / 20))); e.hambre = clamp(e.hambre - 3);
    const antes = e.mem.rec; let nuevo = false; if (mem.pts > antes) { e.mem.rec = mem.pts; nuevo = antes > 0; }
    if (gana) ganar(gana, 0, true); ganar(0, 3 + Math.min(6, Math.floor(mem.pts / 40)));
    mision('jugar'); revisar(); pintar(); guardar();
    $('mem-res').innerHTML = `${mem.perdio ? '<span style="color:#ff8a8a">SIN INTENTOS</span><br>' : ''}RONDAS: ${mem.rondasOk}/${MEM_RONDAS.length}<br>PUNTOS: ${mem.pts}<br>FALLOS: ${mem.fallos}<br>MEJOR RACHA: ${mem.mejorCombo}<br>RÉCORD: ${e.mem.rec}${nuevo ? '<br><span style="color:#ffd84a">¡NUEVO RÉCORD!</span>' : ''}<br>+${gana} MONEDAS`;
    $('mem-otra').style.opacity = e.energia >= MEM_COSTO ? 1 : .4;
    $('mem-fin').classList.add('on'); if ((mem.rondasOk >= 2 || nuevo) && (!celQ || !celQ.length)) sfx.nivel();
  }
  function memSalir() {
    if (!mem) return; if (!mem.fin && mem.pts > 0) memFin(); mem.to.forEach(clearTimeout); mem = null; mjQuitarCancion();
    $('mem').classList.remove('on'); $('mem-fin').classList.remove('on'); modal = null; pintar(); hablar(); corazones(2); setTimeout(saludar, 500); if (typeof navPop === 'function') navPop(); if (typeof celebraCheck === 'function' && celQ && celQ.length) celebraCheck();
  }
  $('mem-grid').addEventListener('pointerdown', ev => { const b = ev.target.closest('.mc'); if (!b || !mem) return; ev.preventDefault(); memClick(+b.dataset.i); });
  $('mem-x').onclick = () => { sfx.click(); memSalir(); };
  $('mem-sal').onclick = () => { sfx.click(); memSalir(); };
  $('mem-otra').onclick = () => { if (e.energia < MEM_COSTO || e.enf) { sfx.no(); return; } sfx.click(); mem.to.forEach(clearTimeout); mem = null; $('mem').classList.remove('on'); $('mem-fin').classList.remove('on'); modal = null; memIniciar(); };

