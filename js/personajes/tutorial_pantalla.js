/* ===================== TUTORIAL DE LA PANTALLA (Cortex explica los botones) ===================== */
  let tfT = 0;
  function tutFlechas() {   // flecha roja junto a cada elemento resaltado
    document.querySelectorAll('.tflecha').forEach(x => x.remove());
    document.querySelectorAll('.resalta').forEach(el => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      const abajoLibre = r.bottom + 34 < innerHeight && r.top < innerHeight * .45, f = document.createElement('div');
      f.className = 'tflecha' + (abajoLibre ? ' arr' : ''); f.innerHTML = '<i></i>';
      f.style.left = Math.round(r.left + r.width / 2 - 11) + 'px'; f.style.top = Math.round(abajoLibre ? r.bottom + 4 : r.top - 30) + 'px';
      document.body.appendChild(f);
    });
  }
  function tutRes(sel) {
    document.querySelectorAll('.resalta').forEach(x => x.classList.remove('resalta')); if (sel) document.querySelectorAll(sel).forEach(x => x.classList.add('resalta'));
    clearInterval(tfT); tutFlechas(); if (sel) tfT = setInterval(tutFlechas, 400);
  }
// (CT definido en dialogos.js)
  function libreParaTutorial() { return eventoLibre(EV_TUT); }
  function iniciarTutorial() {
    act = null; document.body.classList.add('tut');
    cortexEntra(() => dialogo([
      CT('Te explico rapidito qué es cada cosa.'),
      CT('Este círculo es el cariño: al llenarlo, subes de nivel.', '.med'),
      CT('Estas barras son su hambre, energía, felicidad y limpieza.', '.stats'),
      CT('Tus monedas, la campana de avisos y los ajustes. Ahí también están tus logros.', '.der2'),
      CT('Este botón abre tu Inventario.', '#b-inv'),
      CT('La cámara toma fotos y la casita mueve los muebles.', '#b-foto, #b-editar'),
      CT('Aquí están mis misiones.', '#t-mis'),
      CT('Abajo siguen las acciones de siempre: alimentar, dormir, jugar, la tienda y Simon dice. Los minijuegos están en la máquina arcade de la sala de juegos.', '.botones'),
      CT('¡Eso es todo! Puedes repetirlo en Ajustes.')
    ], () => { tutRes(null); document.body.classList.remove('tut'); e.cajaT = e.caja ? 0 : ahora() + 120000; e.proxVisita = Math.max(e.proxVisita || 0, ahora() + 30 * 60000); e.proxSiesta = Math.max(e.proxSiesta || 0, ahora() + 2 * 3600000); guardar(); cortexSale(() => { pintar(); saludar && setTimeout(saludar, 600); }); }));
  }
