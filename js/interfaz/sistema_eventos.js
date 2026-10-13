  /* ===================== SISTEMA CENTRAL DE EVENTOS ===================== */
  // Comprueba si el juego está libre para un evento según las condiciones requeridas (o = objeto con flags)
  function eventoLibre(o) {
    if (o.ban && ban) return false;
    if (o.cg && cg) return false;
    if (o.ipf && (typeof ipf === 'function' ? ipf() : false)) return false;
    if (o.camb && cambiando) return false;
    if (o.needI && !e.intro) return false;
    if (o.iA && introActiva) return false;
    if (o.dlg && dlg) return false;
    if (o.mod && modal) return false;
    if (o.celMod && modal && (modal === 'celebra' || modal === 'resp' || modal === 'editar')) return false;
    if (o.dorm && e.dormido) return false;
    if (o.cxP && cortex.p) return false;
    if (o.cxD && cortex.dir) return false;
    if (o.mP && mercPres) return false;
    if (o.mB && mercBusy) return false;
    if (o.desc && desc) return false;
    if (o.bm && bm) return false;
    if (o.mj && mj) return false;
    if (o.ed && edit) return false;
    if (o.sal && saludoPend) return false;
    if (o.cel && celCur) return false;
    if (o.mAq && !admVisita && mercInfo().est === 'aqui') return false;
    if (o.rt && rt) return false;
    if (o.run && run) return false;
    if (o.mem && mem) return false;
    if (o.sala && (escenaId() !== 'sala' || lugar)) return false;
    if (o.noE && escenaId() === 'estudio') return false;
    if (o.noL && lugar) return false;
    if (o.noC && (calle || escenaId() === 'calle')) return false;
    if (o.eE && estEstudiando()) return false;
    return true;
  }
  // Condiciones de bloqueo para cada tipo de evento (reproducen EXACTAMENTE las comprobaciones originales)
  const EV_TUT   = { ban:1, cg:1, ipf:1, camb:1, needI:1, iA:1, dlg:1, mod:1, dorm:1, cxP:1, cxD:1, mP:1, mB:1, desc:1, bm:1, mj:1, ed:1, sal:1, mAq:1, sala:1 };
  const EV_VIS   = { ban:1, cg:1, ipf:1, camb:1, needI:1, iA:1, dlg:1, mod:1, dorm:1, cxP:1, cxD:1, mP:1, mB:1, desc:1, bm:1, sal:1, mAq:1 };
  const EV_SIE   = { needI:1, iA:1, camb:1, dlg:1, mod:1, dorm:1, cxP:1, cxD:1, mP:1, mB:1, desc:1, bm:1, mj:1, ed:1, sal:1, mAq:1, sala:1 };
  const EV_INTD  = { iA:1, dlg:1, mod:1, cxP:1, cxD:1, mP:1, mB:1, cel:1, ed:1, desc:1, bm:1, mj:1 };
  const EV_INTE  = { dlg:1, mod:1, cxP:1, cxD:1, mP:1, mB:1, iA:1, cel:1 };
  const EV_MEMR  = { iA:1, dlg:1, mod:1, cxP:1, cxD:1, mP:1, mj:1, dorm:1, ed:1, sal:1, noE:1 };
  const EV_KEKE  = { iA:1, dlg:1, mod:1, dorm:1, cxP:1, cxD:1, mP:1, noE:1 };
  const EV_ROPA  = { iA:1, dlg:1, mod:1, dorm:1, cxP:1, cxD:1, mP:1, mj:1 };
  const EV_RPND  = { iA:1, dlg:1, mod:1, dorm:1, cxP:1, cxD:1, mj:1, noE:1 };
  const EV_CEL   = { iA:1, dlg:1, celMod:1, mj:1, rt:1, run:1, mem:1, ed:1, mB:1 };
  const EV_NOCHE = { needI:1, iA:1, ban:1, cg:1, ipf:1, camb:1, dlg:1, mod:1, dorm:1, cxP:1, cxD:1, mP:1, mB:1, desc:1, bm:1, mj:1, ed:1, rt:1, run:1, mem:1, noE:1, noC:1, noL:1, eE:1, sala:1 };

  // Cola de eventos pendientes: reemplaza los bucles de setTimeout/retry
  let evPend = [];
  function evAgregar(id, pri, check, run) {
    if (evPend.some(p => p.id === id)) return false;
    evPend.push({ id, pri, check, run });
    evPend.sort((a, b) => a.pri - b.pri);
    return true;
  }
  function evQuitar(id) { evPend = evPend.filter(p => p.id !== id); }
  function evTiene(id) { return evPend.some(p => p.id === id); }
  function evProcesar() {
    for (let i = 0; i < evPend.length; i++) {
      if (evPend[i].check()) { const p = evPend.splice(i, 1)[0]; p.run(); return; }
    }
  }

  let proxKeke = Date.now() + 70000;
  function quiereKeke() { decir('¡Quiero keke!', null, 3200); hablar(); gesto('salto'); sfx.pregunta(); }
  function checkKeke() {
    if (Date.now() < proxKeke || !eventoLibre(EV_KEKE)) return;
    const hambre = e.hambre < 55;
    if (hambre || Math.random() < .5) quiereKeke();
    proxKeke = Date.now() + (hambre ? 150 + Math.random() * 200 : 480 + Math.random() * 600) * 1000;
  }
  function accion(fn) {
    act = null;
    if (e.dormido && fn.name !== 'dormir') { decir('Zzz...'); sfx.no(); return; }
    fn(); pintar(); guardar();
  }

