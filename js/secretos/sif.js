  /* ===================== SIF: EL PERRITO DEL PARQUE ===================== */
  const SF = () => (e.sif = e.sif || { f: 0, v: 0 });
  const tienePet = k => {
    if (k === 'pet_sif') return !!((e.sif && e.sif.f) || (e.tiene && e.tiene.pet_sif) || (e.pets && e.pets.includes('pet_sif')) || (e.mascotas && e.mascotas.includes('pet_sif')));
    if (k === 'ojo_pet') return !!(e.sangFase === 2 || (e.tiene && e.tiene.ojo_pet) || (e.pets && e.pets.includes('ojo_pet')) || (e.mascotas && e.mascotas.includes('ojo_pet')));
    return !!((e.tiene && e.tiene[k]) || (e.pets && e.pets.includes(k)) || (e.mascotas && e.mascotas.includes(k)));
  };
  const petsActivas = () => {
    if (!e.pets) {
      e.pets = [];
      if (tienePet('pet_sif')) e.pets.push('pet_sif');
      if (tienePet('ojo_pet') && e.ojoOn !== 0) e.pets.push('ojo_pet');
    }
    return e.pets;
  };
  const petActiva = k => petsActivas().includes(k);
  const sifE = c => (petActiva('pet_sif') ? c * .9 : c);   // con Sif de mascota, jugar cansa un 10% menos
  let sifP = null, sifProx = 0, sifAni = 0, sifJ = null, sifJT = 0;
  const sifToy = () => e.deco.find(d => ITEMS[d.k] && ITEMS[d.k].slot === 'juguete' && (d.h || 'sala') === 'sala');
  let sifW = null, sifCar = 0, sifAm = false;
  const sifW0 = () => sifW || (sifW = { x: SX + SW - 4, y: 4, tx: 0, ty: 0, mov: 0, pausa: 0 });
  const sifPos = esc => sifP ? { x: sifP.x, y: 0 } : { x: sifW0().x, y: Math.max(sifW0().y, cortex.p > 0 ? 16 : 0) };
  function sifElige(W) {   // destino al azar en el piso (sin atravesar a Simon)
    const y = Math.random() * 26; let x;
    if (y < 12) { const L = SX - 26, R0 = SX + SW - 8, R1 = LW - 30; const izq = L > 6, der = R1 > R0; if (izq && (!der || Math.random() < .5)) x = 4 + Math.random() * (L - 4); else if (der) x = R0 + Math.random() * (R1 - R0); else x = 4 + Math.random() * (LW - 34); }
    else x = 4 + Math.random() * (LW - 34);
    W.tx = x; W.ty = y; W.mov = 1;
  }
  function sifPaso(W, tx, ty, v) { const dx = tx - W.x, dy = ty - W.y, d = Math.hypot(dx, dy); if (d < 1.5) return true; W.x += dx / d * v; W.y += dy / d * v * .7; return false; }
  function sifJuegoTick() {
    if (!petActiva('pet_sif')) return;
    const esc = escenaId(), W = sifW0();
    W.x = Math.max(2, Math.min(LW - 30, W.x)); W.y = Math.max(0, Math.min(26, W.y));
    const libre = !sifP && !dlg && !modal && !e.dormido && !cortex.p && !cortex.dir && !ban && !cg && !mercPres && !introActiva && !cambiando && esc !== 'estudio' && esc !== 'calle' && (!lugar || lugar === 'parque');
    const dj = libre && esc === 'sala' && !(act && act.tipo === 'pelota') && sifToy();
    if (!libre || (sifJ && !dj)) { sifJ = null; W.mov = 0; return; }
    if (tk < sifCar) { W.mov = 0; return; }
    if (sifJ) {
      const J = sifJ;
      if (J.ph === 'ir') { W.mov = 1; if (sifPaso(W, J.tx, J.ty, 1.6)) { J.ph = 'juega'; J.t = 0; J.cx = W.x; guau(1); } }
      else { W.mov = 1; J.t++; W.x = Math.max(2, Math.min(LW - 30, J.cx + Math.sin(J.t / 6) * 22)); if (J.t > 130) { sifJ = null; sifJT = tk + 300 + Math.random() * 500; W.mov = 0; W.pausa = tk + 40; } }
      return;
    }
    if (dj) { if (!sifJT) sifJT = tk + 150 + Math.random() * 250; if (tk >= sifJT) { const rr = posReal(dj); sifJ = { ph: 'ir', tx: Math.max(2, Math.min(LW - 30, Math.round(rr.x + rr.w / 2 - 14))), ty: Math.max(0, Math.min(26, Math.round(rr.base - (SY + SH)))), t: 0, cx: 0 }; return; } }
    if (W.mov) { if (sifPaso(W, W.tx, W.ty, 1)) { W.mov = 0; W.pausa = tk + 40 + Math.random() * 130; } }
    else if (tk >= W.pausa) { if (Math.random() < .35) W.pausa = tk + 60 + Math.random() * 120; else sifElige(W); }
  }
  function sifGrid(o) {
    o = o || {}; const g = Grid(28, 27), K = '#6a4234', K2 = '#8a5a44', W = '#f6f1ea', Tn = '#dba96c', Nz = '#8c525c', D = '#1c100c';
    ovalG(g, 14, 21, 8, 6, K); ovalG(g, 14, 22, 4, 5, W);
    g.rect(8, 24, 4, 3, W); g.rect(16, 24, 4, 3, W);
    if (o.cola) { g.rect(22, 14, 3, 8, K); g.rect(22, 14, 3, 2, W); } else g.rect(22, 20, 4, 4, K);
    g.rect(4, 1, 5, 7, K); g.rect(5, 2, 3, 4, '#c98a8a'); g.rect(19, 1, 5, 7, K); g.rect(20, 2, 3, 4, '#c98a8a');
    ovalG(g, 14, 10, 9, 7, K);
    g.rect(8, 6, 4, 2, Tn); g.rect(17, 6, 4, 2, Tn); g.rect(6, 10, 3, 3, Tn); g.rect(20, 10, 3, 3, Tn);
    g.rect(13, 3, 3, 9, W); ovalG(g, 14, 14, 5, 3, W);
    if (o.ojos === 'c') { g.rect(9, 9, 3, 1, D); g.rect(18, 9, 3, 1, D); }
    else { g.rect(9, 8, 3, 3, D); g.set(10, 8, '#ffffff'); g.rect(18, 8, 3, 3, '#6cc0ff'); g.set(19, 9, D); g.set(18, 8, '#ffffff'); }
    g.rect(12, 12, 4, 2, Nz); g.set(13, 12, '#c88a94');
    if (o.boca === 'b') { g.rect(12, 15, 4, 3, '#6a2a34'); g.rect(13, 16, 2, 2, '#f07a92'); }
    else { g.set(11, 15, D); g.set(16, 15, D); g.rect(12, 16, 4, 1, D); }
    g.contour(D); return g;
  }
  function sifRuido(dur) { const n = Math.floor(ac.sampleRate * dur), b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b; }
  function guau(n, grave) {   // ladrido: zumbido de garganta + soplido, pasado por dos formantes (boca de perro)
    if (e.mudo || !audio()) return;
    for (let i = 0; i < (n || 1); i++) setTimeout(() => {
      const t = ac.currentTime + .02, dur = .2, m = ac.createGain();
      m.gain.setValueAtTime(.0001, t); m.gain.exponentialRampToValueAtTime(.2, t + .012); m.gain.setValueAtTime(.2, t + .06); m.gain.exponentialRampToValueAtTime(.0001, t + dur); m.connect(ac.destination);
      const o = ac.createOscillator(); o.type = 'sawtooth'; const f0 = grave ? 300 : 420 + Math.random() * 50;
      o.frequency.setValueAtTime(f0 * .8, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.25, t + .03); o.frequency.exponentialRampToValueAtTime(f0 * .5, t + dur);
      const nz = ac.createBufferSource(); nz.buffer = sifRuido(dur); const ng = ac.createGain(); ng.gain.value = .55; nz.connect(ng);
      [[700, 3], [1500, 4], [2600, 5]].forEach(([fq, q], k) => { const b = ac.createBiquadFilter(); b.type = 'bandpass'; b.frequency.setValueAtTime(fq * 1.15, t); b.frequency.exponentialRampToValueAtTime(fq * .8, t + dur); b.Q.value = q; const g = ac.createGain(); g.gain.value = k === 0 ? 1 : k === 1 ? .7 : .25; o.connect(b); ng.connect(b); b.connect(g); g.connect(m); });
      o.start(t); nz.start(t); o.stop(t + dur + .02); nz.stop(t + dur + .02);
    }, i * 260);
    sifAni = tk + 24;
  }
  function sifGime() {   // gemidito feliz al acariciarlo: voz aguda que sube y baja con temblor, y un resoplido suave
    if (e.mudo || !audio()) return;
    const t = ac.currentTime + .02, dur = .55, m = ac.createGain();
    m.gain.setValueAtTime(.0001, t); m.gain.exponentialRampToValueAtTime(.09, t + .06); m.gain.setValueAtTime(.09, t + .3); m.gain.exponentialRampToValueAtTime(.0001, t + dur); m.connect(ac.destination);
    const o = ac.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(560, t); o.frequency.exponentialRampToValueAtTime(1000, t + .2); o.frequency.exponentialRampToValueAtTime(700, t + dur);
    const lf = ac.createOscillator(), lg = ac.createGain(); lf.frequency.value = 13; lg.gain.value = 28; lf.connect(lg); lg.connect(o.frequency);
    const fl = ac.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 2400; o.connect(fl); fl.connect(m);
    o.start(t); lf.start(t); o.stop(t + dur + .02); lf.stop(t + dur + .02);
    const nz = ac.createBufferSource(); nz.buffer = sifRuido(.25); const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = .8; const ng = ac.createGain(); const t2 = t + dur - .05;
    ng.gain.setValueAtTime(.0001, t2); ng.gain.exponentialRampToValueAtTime(.05, t2 + .04); ng.gain.exponentialRampToValueAtTime(.0001, t2 + .22);
    nz.connect(bp); bp.connect(ng); ng.connect(ac.destination); nz.start(t2); nz.stop(t2 + .25);
  }
  function sifJingle() {   // melodía de logro grande: arpegio, ladrido y acorde final
    seq([523, 659, 784, 1047, 784, 1047, 1319, 1568], .085, 'square', .06);
    seq([262, 330, 392, 523, 392, 523, 659, 784], .085, 'triangle', .07);
    setTimeout(() => guau(2), 800);
    seq([1047, 1319, 1568, 2093, 1568, 2093], .11, 'square', .05, .95);
    seq([523, 659, 784, 1047], .5, 'triangle', .08, 1.7);
    setTimeout(() => { if (typeof sfx.regalo === 'function') sfx.regalo(); }, 1900);
  }
  const sifVisible = esc => petActiva('pet_sif') && !sifP && esc !== 'estudio' && esc !== 'bano' && esc !== 'calle' && (!lugar || lugar === 'parque') && !ban && !cg && !introActiva && !(e.dormido && esc !== 'sala');
  function sifDibuja(esc, n) {
    let x, y = 0, est = 'rest';
    if (sifP && (sifP.casa ? (!lugar && esc === 'sala') : esc === 'parque')) { x = sifP.x; est = sifP.estado; }
    else if (sifVisible(esc)) { const P = sifPos(esc); x = P.x; y = P.y; }
    else return;
    const W = sifW0(), J = (!sifP && sifJ && esc === 'sala') ? sifJ : null, car = sifP ? tk < (sifP.petT || 0) : tk < sifCar;
    const mov = est === 'viene' || est === 'va' || (sifP && sifP.wmov && !car) || (!sifP && W.mov && !car && !(J && J.ph === 'juega')), jug = J && J.ph === 'juega';
    const feliz = est === 'quieto' || est === 'come' || est === 'llego' || (est === 'rest' && (tk < sifAni || jug || car || mov));
    const ojos = car ? 'c' : ((e.dormido && est === 'rest') || (tk % 90 < 3) ? 'c' : 'a'), boca = (tk < sifAni || est === 'come') ? 'b' : 'n', cola = (feliz && ((tk >> (car ? 1 : 2)) & 1)) ? 1 : 0;
    const spr = sprite('sif|' + ojos + boca + cola, () => sifGrid({ ojos, boca, cola }), n ? .22 : 0);
    const by = SY + SH + Math.round(y);
    ctx.fillStyle = 'rgba(30,12,40,.30)'; for (let k = -2; k <= 2; k++) { const w = Math.round(12 * Math.sqrt(1 - (k / 2.6) * (k / 2.6))); ctx.fillRect(Math.round(x + 14 - w), by - 2 + k, w * 2, 1); }
    const hop = jug ? Math.round(Math.abs(Math.sin(J.t / 3)) * 3) : car ? Math.round(Math.abs(Math.sin(tk / 2)) * 2) : 0;
    ctx.drawImage(spr, Math.round(x), by - 27 + (mov && (tk >> 1) % 2 ? -1 : 0) - hop);
    if (J && J.ph === 'juega') { const jk = sifToy().k, tj = sprite('tj_' + jk, () => ITEMS[jk].grid(), 0); ctx.drawImage(tj, Math.round(x + 14 - tj.width / 2), by - 3 - tj.height - hop); }
  }
  function sifTick() {
    const S_ = SF(); sifJuegoTick();
    if (sifP) {
      const p = sifP, par = lugar === 'parque';
      if (!p.casa && !par) { sifP = null; return; }
      if (p.estado === 'viene') { p.x -= 1.6; if (p.x <= p.tx) { p.x = p.tx; p.t0 = Date.now(); if (p.casa) { p.estado = 'llego'; sifAmistad(); } else { p.estado = 'quieto'; sifAviso(); } } }
      else if (p.estado === 'quieto') {
        if (Date.now() - p.t0 > 50000 && !dlg && !modal) { p.estado = 'va'; return; }
        if (!dlg && !modal) {
          if (p.wmov) {
            const dx = p.wtx - p.x;
            if (Math.abs(dx) < 1.5) { p.wmov = 0; p.wpausa = tk + 50 + Math.random() * 90; }
            else p.x += Math.sign(dx) * .7;
          }
          else if (tk >= (p.wpausa || 0)) { p.wtx = 4 + Math.random() * (LW - 32); p.wmov = 1; }
        }
      }
      else if (p.estado === 'va') { p.x += 1.8; if (p.x > LW + 4) { sifP = null; sifProx = Date.now() + (20 + Math.random() * 40) * 1000; } }
      return;
    }
    if (lugar !== 'parque') { sifProx = 0; return; }
    if (S_.f || llegada || dlg || modal || ban || cambiando || cortex.p || cortex.dir || mercPres || introActiva || desc) return;
    if (typeof parqueOcupado === 'function' && parqueOcupado('sif')) return;   // un solo evento a la vez en el parque
    if (!sifProx) sifProx = Date.now() + (admin ? 2500 : S_.v ? 6000 + Math.random() * 20000 : 7000);
    if (Date.now() >= sifProx) { sifP = { x: LW + 4, tx: SX + SW + 4, estado: 'viene', t0: 0 }; sifProx = 0; }
  }
  function sifAviso() {
    const S_ = SF(); S_.v++; guardar(); guau(1);
    if (S_.v === 1) { notificar('Un perrito apareció en el parque.'); toast('UN PERRITO... PARECE TENER HAMBRE'); }
  }
  function sifDar() {
    const p = sifP; if (!p || dlg) return; p.t0 = Date.now() + 120000;
    dialogo([{ q: 'TRADUCTOR', t: '¿Dar keke para perros?', op: ['SÍ', 'NO'], res: [[
      { q: 'SIMON', t: 'Sí.', fn: () => { bocaT = 15; gesto(); hablar(); e.sifK--; guardar(); p.estado = 'come'; } }, T('Toma, esto es para ti.'),
      { q: 'PERRO', t: '*mastica el keke y mueve la cola*', fn: () => { sfx.comer(); corazones(5); } },
      { q: 'PERRO', t: '*te mira con ojos de distinto color*' }, S(), T('¿Vienes a casa conmigo?')], []] }],
      () => { if (sifP && sifP.estado === 'come') sifSigue(); else if (sifP) sifP.t0 = Date.now(); });
  }
  function sifSigue() {
    introPend = Date.now() + 20000; sifAm = true;
    irA(() => { lugar = null; llegada = null; e.hab = 'sala'; pintarNav(); sifP = { x: LW + 4, tx: SX + SW - 4, estado: 'viene', casa: true, t0: 0 }; });
  }
  function sifAmistad() {
    const S_ = SF();
    setTimeout(() => dialogo([S(), T('Oye... ¿quieres ser mi amigo?'),
      { q: 'PERRO', t: '¡GUAU!', fn: () => guau(1) },
      { q: 'SIMON', t: '¡Sí!', fn: () => { bocaT = 15; gesto('salto'); hablar(); } }, T('¡Entonces te llamaré Sif!'),
      { q: 'SIF', t: '¡GUAU, GUAU!', fn: () => { guau(2); corazones(6); } },
      { q: 'SIF', t: '', fan: { mudo: true, g: () => sifGrid({ boca: 'b', cola: 1 }), t: 'SIF', d: 'NUEVA MASCOTA. EFECTO: JUGAR TE QUITA 10% MENOS DE ENERGÍA.' }, fn: () => { S_.f = 1; petsActivas().push('pet_sif'); sifP = null; e.st.sifAmigo = 1; guardar(); sifJingle(); } },
      S(), T('Ahora tengo un perro. ¡Qué felicidad!'), T('Con Sif cerca, jugar me cansa un 10% menos.')], () => { introPend = 0; sifAm = false; pintar(); guardar(); }), 700);
  }
  function sifTap(x, y) {
    if (dlg || modal || edit || ban || cg) return false;
    const esc = escenaId(), S_ = SF(); let px, py = 0, tr = false;
    if (sifP && !sifP.casa && sifP.estado === 'quieto' && esc === 'parque') { px = sifP.x; tr = true; }
    else if (!sifP && sifVisible(esc)) { const P = sifPos(esc); px = P.x; py = P.y; } else return false;
    const base = SY + SH + py;
    if (x < px || x > px + 28 || y < base - 29 || y > base + 2) return false;
    sfx.click();
    if (tr) {
      if (e.sifK > 0) { sifDar(); return true; }
      guau(1); sifP.petT = tk + 40; sifP.wmov = 0; sifP.wpausa = tk + 70;   // sin keke: ladra como si lo acariciaran
      for (let i = 0; i < 3; i++) lanzar('corazon', px + 6 + i * 7, base - 30 - i * 3, 0, -1.6, 14 + i * 3);
      sifGime();
      return true;
    }
    if (e.dormido) { toast('SIF TAMBIÉN DUERME'); return true; }
    sifCar = tk + 40; sifW0().mov = 0; sifJ = null; sifW0().pausa = tk + 70;   // caricia: cierra los ojos, mueve la cola y salta contento
    for (let i = 0; i < 3; i++) lanzar('corazon', px + 6 + i * 7, base - 30 - i * 3, 0, -1.6, 14 + i * 3);
    sifGime();
    return true;
  }
  function sifComer() {
    if (!petActiva('pet_sif')) return; if (!(e.sifK > 0)) { toast('NO TIENES KEKES PARA PERRO: COCÍNALOS'); sfx.no(); return; }
    e.sifK--; sifAni = tk + 40; sifCar = tk + 40; cerrar(); guau(1); sfx.comer(); corazones(4); toast('SIF COMIÓ SU KEKE'); guardar(); pintar();
  }

