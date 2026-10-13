  // El navegador no deja sonar nada hasta que el jugador toca la pantalla. Escuchamos varios tipos de gesto
  // (en el celular 'pointerdown' no cuenta, 'touchend' y 'click' sí) hasta que el audio de verdad esté activo.
  const GESTOS_AUDIO = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];
  function destrabarAudio() {
    const a = audio(); if (!a) return;
    const listo = () => {
      if (a.state === 'running') { GESTOS_AUDIO.forEach(g => document.removeEventListener(g, destrabarAudio, true)); musicaOn(); lluviaCheck(); }
      pintarAudioHint();
    };
    if (a.state === 'running') listo(); else { try { a.resume().then(listo, listo); } catch (_) { listo(); } }
  }
  function armarAudio() { GESTOS_AUDIO.forEach(g => document.addEventListener(g, destrabarAudio, true)); }
  function pintarAudioHint() {}
  armarAudio();

