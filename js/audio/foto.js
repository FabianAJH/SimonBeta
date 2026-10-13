  let fotoURL = null, fotoBlob = null;
  function tomarFoto() {
    dibujar();
    const S = 4, pad = 12, pie = 52, W2 = LW * S + pad * 2, H2 = LH * S + pad + pie;
    const c = document.createElement('canvas'); c.width = W2; c.height = H2;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    x.fillStyle = '#f6f2e6'; x.fillRect(0, 0, W2, H2);
    x.drawImage(cv, pad, pad, LW * S, LH * S);
    x.strokeStyle = '#1a1f4a'; x.lineWidth = 3; x.strokeRect(pad - 1.5, pad - 1.5, LW * S + 3, LH * S + 3);
    x.drawImage(gridCanvas(coronaGrid()), pad + 4, LH * S + pad + 14, 66, 36);
    x.fillStyle = '#1a1f4a'; x.textBaseline = 'middle';
    const nom = (e.nombre || '').trim();
    const txtFoto = nom ? ('SIMON DE ' + nom.toUpperCase()) : 'SIMON';
    let fSize = 18;
    x.font = fSize + 'px PS2P, monospace';
    const maxW = W2 - (pad + 78) - 135;
    while (x.measureText && x.measureText(txtFoto).width > maxW && fSize > 9) {
      fSize--;
      x.font = fSize + 'px PS2P, monospace';
    }
    x.fillText(txtFoto, pad + 78, LH * S + pad + 30);
    x.textAlign = 'right'; x.font = '10px PS2P, monospace'; x.fillText(hoy().split('-').reverse().join('/'), W2 - pad - 6, LH * S + pad + 26);
    x.font = '8px PS2P, monospace'; x.fillText('CARIÑO NV' + nivel(), W2 - pad - 6, LH * S + pad + 42);
    $('flash').classList.remove('on'); void $('flash').offsetWidth; $('flash').classList.add('on');
    seq([2400, 1200], .03, 'square', .05);
    e.st.fotos++; mision('foto'); pixelarFoto(); if (clima() === 'arcoiris' && e.fotoArco !== hoy()) { e.fotoArco = hoy(); ganar(8, 2, true); toast('¡FOTO CON ARCOÍRIS! +8'); } guardar();
    c.toBlob(b => { fotoBlob = b; if (fotoURL) URL.revokeObjectURL(fotoURL); fotoURL = URL.createObjectURL(b); setTimeout(() => abrir('foto'), 250); }, 'image/png');
  }
  function guardarFoto() {
    if (!fotoURL) return;
    const nom = (e.nombre || '').trim(), pref = nom ? ('simon-de-' + nom.toLowerCase().replace(/\s+/g, '-')) : 'simon';
    const a = document.createElement('a'); a.href = fotoURL; a.download = pref + '-' + hoy() + '.png'; document.body.appendChild(a); a.click(); a.remove();
    toast('Foto guardada');
  }
  async function compartirFoto() {
    if (!fotoBlob) return;
    const nom = (e.nombre || '').trim(), tit = nom ? ('Simon de ' + nom) : 'Simon';
    const f = new File([fotoBlob], 'simon.png', { type: 'image/png' });
    try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: tit, text: '¡Mira a ' + tit + '!' }); return; } } catch (_) { return; }
    guardarFoto(); toast('Tu navegador no comparte directo: se guardó la foto');
  }
  $('b-foto').onclick = () => {
    if (dlg || tutMenuBloq('foto') || guiaBloq('foto')) return;
    if (modal) {
      if (modal === 'editar' || ['run', 'mem', 'rt'].includes(modal)) return;
      cerrar();
    }
    tomarFoto();
  };

