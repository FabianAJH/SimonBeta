  function despertarPremio() { const ct = camaDe(e.deco); if (ct) { e.feliz = clamp(e.feliz + 4 * ct); toast('Despertó de mejor humor gracias a su cama'); } e.st.dormir++; mision('dormir'); ganar(2, 2); if (e.enf) curar('sueno'); }
  function comer() {
    lanzar('pizza', SX + 21, SY - 22, 0, 6, 11); sfx.comer();
    const h = hoy();
    if (e.ultComer !== h) {
      const d = e.ultComer ? difDias(e.ultComer, h) : null;
      e.rachaComer = d === 1 ? e.rachaComer + 1 : 1; e.ultComer = h; e.mejorComer = Math.max(e.mejorComer || 0, e.rachaComer);
    }
    e.energia = clamp(e.energia + 1);
    if (e.hambre > 95) { responder('(ya comí, pero siempre hay lugar para keke)'); e.feliz = clamp(e.feliz + 2 * ecoMul()); return; }
    const kHam = typeof KEKE_H !== 'undefined' ? KEKE_H : 20;
    e.hambre = clamp(e.hambre + kHam * ecoMul()); e.feliz = clamp(e.feliz + 4 * ecoMul()); e.st.comer++; ganar(1, 3); mision('comer'); responder(null, 'comer');
  }
  function jugar() {
    const enParque = lugar === 'parque';
    if (e.energia < 3) { decir('Sí...', e.traductor ? 'Estoy muy cansado.' : null); hablar(); sfx.no(); avisoSueno(); return; }
    if (e.enf) { decir('Sí... ¡achú!', e.traductor ? 'No me siento bien para jugar.' : null, 3000); sfx.no(); return; }
    e.feliz = clamp(e.feliz + 25 * ecoMul());
    e.energia = clamp(e.energia - sifE(3));
    e.hambre = clamp(e.hambre - 1);
    e.st.jugar++;
    ganar(0, 0);
    mision('jugar');
    if (enParque) { e.st.parque++; }
    corazones(3);
    responder(null, 'jugar');
    gesto('salto');
    hablar();
    act = { tipo: 'pelota', t: 0, len: 42 };
    proxAct = tk + 120;
    const dir = Math.random() < 0.5 ? -1 : 1;
    jugLanzar(dir * (4.2 + Math.random() * 3.5), -(6.5 + Math.random() * 3.5));
  }
  // Si se hizo de madrugada (3 a 8 am) y Simon tiene menos de la mitad de energía, se duerme solo (una vez por noche)
  function checkSuenoNoche() {
    const h = horaR();
    if (h < 3 || h >= 8 || e.energia >= 50 || e.sNoche === hoy() || escenaId() !== 'sala') return;
    if (!eventoLibre(EV_NOCHE)) return;
    e.sNoche = hoy(); e.dormido = true; e.eIni = e.energia; act = null;
    decir('Sí... zzz'); hablar();
    sfx.dormir(); notificar('Simon estaba muy cansado y se durmió solo.'); guardar(); pintar();
  }
  function dormir() {
    e.dormido = !e.dormido;
    if (e.dormido) { e.eIni = e.energia; decir('Sí... zzz'); hablar(); sfx.dormir(); }
    else { sfx.despertar(); if (e.energia - (e.eIni || e.energia) >= 8) despertarPremio(); responder(); }
  }
  function dice() {
    const frase = DICE[Math.floor(Math.random() * DICE.length)];
    decir('Simon dice: ' + frase); sfx.pregunta();
    setTimeout(() => {
      if (e.dormido) return;
      e.feliz = clamp(e.feliz + 8);
      if (Date.now() - (e.ultDice || 0) > 30000) { e.ultDice = Date.now(); e.st.dice++; ganar(1, 2); }
      sfx.respuesta(); corazones(2); estrellas(4); responder(null, 'dice'); pintar(); guardar();
    }, 2300);
  }

