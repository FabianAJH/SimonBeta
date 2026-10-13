  /* ===================== NAVEGACIÓN ATRÁS / ESCAPE ===================== */
  let navDepth = 0;

  function navPush(tipo, data = {}) {
    navDepth++;
    const stateObj = Object.assign({ simonDepth: navDepth }, data);
    if (tipo === 'lugar' || (!tipo && typeof lugar !== 'undefined' && lugar && !modal)) {
      stateObj.simonLugar = data.lugar || lugar;
    } else if (tipo === 'modal' || (!tipo && typeof modal !== 'undefined' && modal)) {
      stateObj.simonModal = data.modal || modal;
      if (typeof lugar !== 'undefined' && lugar) stateObj.simonLugar = lugar;
    } else if (tipo === 'editar' || (!tipo && typeof modal !== 'undefined' && modal === 'editar')) {
      stateObj.simonEditar = true;
    } else {
      stateObj.simonOverlay = true;
    }
    try {
      if (typeof history !== 'undefined' && history.pushState) {
        history.pushState(stateObj, '');
      }
    } catch (_) {}
  }
  if (typeof window !== 'undefined') {
    window.navPush = navPush;
    window.getNavDepth = () => navDepth;
    window.setNavDepth = (d) => { navDepth = d; };
  }

  function navPop() {
    if (navDepth <= 0) return;
    navDepth--;
    try {
      if (typeof history !== 'undefined' && history.back) {
        history.back();
      }
    } catch (_) {}
  }
  if (typeof window !== 'undefined') window.navPop = navPop;

  function retroceder(esPopstate = false) {
    // 1. Si hay un diálogo de nombre cancelable
    const nomBx = $('nombre');
    if (nomBx && nomBx.classList && nomBx.classList.contains('on') && $('nom-x') && $('nom-x').style.display !== 'none') {
      if ($('nom-x').onclick) $('nom-x').onclick();
      else nomBx.classList.remove('on');
      return true;
    }
    // 2. Si hay un modal abierto (incluyendo modo edición)
    if (typeof modal !== 'undefined' && modal) {
      if (modal === 'editar') {
        salirEdicion(!esPopstate);
        return true;
      }
      cerrar(!esPopstate);
      return true;
    }
    // 3. Si está en modo bañar a Simón
    if (typeof ban !== 'undefined' && ban) {
      if (typeof banSalir === 'function') banSalir();
      return true;
    }
    // 4. Si está en minijuego de cocina
    if (typeof cg !== 'undefined' && cg) {
      if (typeof cgSalir === 'function') cgSalir();
      return true;
    }
    // 5. Si está en minijuegos arcade
    if (typeof mj !== 'undefined' && mj) {
      if (typeof mjSalir === 'function') mjSalir();
      return true;
    }
    if (typeof run !== 'undefined' && run) {
      if (typeof runSalir === 'function') runSalir();
      return true;
    }
    if (typeof rt !== 'undefined' && rt) {
      if (typeof rtSalir === 'function') rtSalir();
      return true;
    }
    if (typeof mem !== 'undefined' && mem) {
      if (typeof memSalir === 'function') memSalir();
      return true;
    }
    // 6. Si está en un lugar exterior (ej: parque), volver a casa
    if (typeof lugar !== 'undefined' && lugar) {
      if (typeof volverACasa === 'function') volverACasa(!esPopstate);
      return true;
    }
    return false;
  }
  if (typeof window !== 'undefined') window.retroceder = retroceder;

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('popstate', ev => {
      navDepth = Math.max(0, navDepth - 1);
      const st = ev && ev.state;

      // Si el historial nos regresó al estado del lugar exterior (ej: parque):
      if (st && st.simonLugar) {
        // Si había un modal abierto sobre el parque, cerrarlo sin tocar historial
        if (typeof modal !== 'undefined' && modal) {
          if (modal === 'editar') salirEdicion(false);
          else cerrar(false);
        }
        // Asegurar que seguimos en el lugar correspondiente sin ir a casa
        if (typeof lugar !== 'undefined' && lugar !== st.simonLugar) {
          lugar = st.simonLugar;
        }
        return;
      }

      // Si no es estado de lugar exterior (se hizo pop hacia home o estado base):
      // 1. Si hay un modal abierto, cerrarlo
      if (typeof modal !== 'undefined' && modal) {
        if (modal === 'editar') salirEdicion(false);
        else cerrar(false);
        return;
      }
      // 2. Si estábamos en un lugar exterior (ej: parque), volver a casa
      if (typeof lugar !== 'undefined' && lugar) {
        if (typeof volverACasa === 'function') volverACasa(false);
        return;
      }
      // 3. Otros overlays o acciones
      retroceder(true);
    });

    window.addEventListener('keydown', ev => {
      if (ev.key === 'Escape' || ev.keyCode === 27) {
        if (retroceder(false)) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      }
    });
  }

