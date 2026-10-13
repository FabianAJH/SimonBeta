  /* ===================== COMIDA ESPECIAL ===================== */
  function comprarComida(k) {
    const F = COMIDAS[k];
    if (nivel() < F.nv) { toast('Necesitas cariño nivel ' + F.nv); sfx.no(); return; }
    if (e.monedas < F.p) { faltanMon(F.p - e.monedas); sfx.no(); return; }
    if ((e.comida[k] || 0) >= 99) { toast('Ya tienes demasiadas'); return; }
    e.monedas -= F.p; animarMonedas(F.p, true); e.comida[k] = (e.comida[k] || 0) + 1; e.st.compras++; sfx.compra(); toast('¡COMPRASTE: ' + F.n.toUpperCase() + '!'); pintar(); guardar(); render();
  }
  function elegirSorpresa() { let t = SORPRESAS.reduce((a, o) => a + o.w, 0) * Math.random(); for (const o of SORPRESAS) { t -= o.w; if (t <= 0) return o; } return SORPRESAS[0]; }
  function darComida(id) {
    if (e.dormido) { decir('Zzz...'); sfx.no(); return; }
    if (id === 'keke') {
      if (!introActiva) {
        if (!e.kk || e.kk.f !== hoy()) e.kk = { f: hoy(), n: 0 };
        if (kekesQuedan() > 0) e.kk.n++;   // gratis: cuenta siempre, aunque Simon ya esté lleno
        else if (e.monedas >= KEKE_P) {
          e.monedas -= KEKE_P;
          animarMonedas(KEKE_P, true);
          sfx.compra();
          pintar();
        }
        else { decir('Sí... (ya no queda keke por hoy)'); sfx.no(); toast('SIN MONEDAS SUFICIENTES (' + KEKE_P + ' MONEDAS)'); return; }
      }
      e.kkTot = (e.kkTot == null ? (e.st.comer || 0) : e.kkTot) + (introActiva ? 0 : 1);
      accion(comer); render();
      chefRevisa();   // gorro de chef a los 1000 kekes (secretos/05_gorro_chef.js)
      return;
    }
    const F = COMIDAS[id]; if (!F || !(e.comida[id] > 0)) return;
    if (e.hambre > 95 && e.energia > 95 && e.feliz > 95) { decir('Sí. (estoy lleno de todo)'); hablar(); sfx.no(); return; }
    act = null; const o = F.rand ? elegirSorpresa() : F, antes = e.energia, antesH = e.hambre;
    e.comida[id]--; if (!e.comida[id]) delete e.comida[id];
    lanzar('c_' + id, SX + 20, SY - 22, 0, 6, 11); sfx.comer();
    e.hambre = clamp(e.hambre + (o.h || 0)); e.energia = clamp(e.energia + (o.e || 0)); e.feliz = clamp(e.feliz + (o.f || 0));
    const h = hoy(); if (e.ultComer !== h) { const dd = e.ultComer ? difDias(e.ultComer, h) : null; e.rachaComer = dd === 1 ? e.rachaComer + 1 : 1; e.ultComer = h; e.mejorComer = Math.max(e.mejorComer || 0, e.rachaComer); }
    e.st.comer++; e.probo[id] = 1; ganar(1, 3); mision('comer'); responder(o.t); corazones(2);
    if (o.fx) gesto(o.fx);
    const ganadoE = Math.round(e.energia - antes);
    const ganadoH = Math.round(e.hambre - antesH);
    if (ganadoE > 0 && ganadoH > 0) toast('COMIDA +' + ganadoH + ' · ENERGÍA +' + ganadoE);
    else if (ganadoE > 0) toast('ENERGÍA +' + ganadoE);
    else if (ganadoH > 0) toast('COMIDA +' + ganadoH);
    if ((o.e || 0) >= 60 && !celQ.length && modal !== 'celebra') { sfx.nivel(); estrellas(5); }
    pintar(); guardar(); render();
  }
  // (KEKE_DIA, KEKE_P definidos en config.js)
  function kekesQuedan() { const k = e.kk && e.kk.f === hoy() ? e.kk.n : 0; return Math.max(0, KEKE_DIA - k); }
  function renderComida() {
    $('m-titulo').textContent = 'ALIMENTAR';
    const ids = Object.keys(COMIDAS).filter(k => e.comida[k] > 0).sort((a, b) => {
      const ca = COMIDAS[a], cb = COMIDAS[b];
      return (cb.nv - ca.nv) || (cb.p - ca.p) || (((cb.e || 0) + (cb.h || 0)) - ((ca.e || 0) + (ca.h || 0)));
    });
    const card = (k, nombre, extra, sub) => `<div class="card"><div class="pv"><canvas data-prev="fd_${k}"></canvas></div><div class="cn">${nombre}</div><div style="font-size:6px;color:#4a5090;line-height:1.4">${sub}</div><button class="bt ok" data-a="f_dar" data-k="${k}">DAR</button></div>`;
    return `<div class="saldo" style="align-items:center;margin-bottom:8px"><div style="display:flex;align-items:center;gap:10px"><span style="display:flex;align-items:center;gap:4px"><canvas data-prev="ic_ham"></canvas>${Math.round(e.hambre)}</span><span style="display:flex;align-items:center;gap:4px"><canvas data-prev="ic_ene"></canvas>${Math.round(e.energia)}</span></div><button class="bt ok" style="padding:4px 8px;font-size:6px;margin:0;line-height:1" data-a="f_ir_tienda">COMPRAR</button></div><div class="cuadricula mini" style="grid-template-columns:repeat(3,1fr);gap:8px 6px">` +
      (() => {
        const kPagando = !introActiva && kekesQuedan() === 0;
        const kPuede = introActiva || kekesQuedan() > 0 || e.monedas >= KEKE_P;
        const kClase = !kPuede ? 'no' : (kPagando ? 'pago' : 'ok');
        const kTxt = !kPagando ? 'DAR' : (e.monedas >= KEKE_P ? '🪙 COMPRAR · ' + KEKE_P : '🪙 SIN MONEDAS');
        const kHam = typeof KEKE_H !== 'undefined' ? KEKE_H : 20;
        return `<div class="card"><div class="pv"><canvas data-prev="fd_keke"></canvas><span class="pv-cant${kPagando ? ' agot' : ''}">x${introActiva ? '∞' : kekesQuedan()}</span></div><div class="cn">KEKE</div><div style="font-size:6px;color:#4a5090;line-height:1.4;display:flex;align-items:center;justify-content:center;gap:3px"><span style="display:inline-flex;align-items:center;gap:1px"><canvas class="ic-sub" data-prev="ic_ham"></canvas>+${kHam}</span> · <span style="color:#a04800">⚡+1</span></div><button class="bt ${kClase}" data-a="f_dar" data-k="keke">${kTxt}</button></div>`;
      })() +
      ((e.meds || 0) > 0 ? `<div class="card"><div class="pv"><canvas data-prev="fd_jarabe"></canvas><span class="pv-cant">x${e.meds}</span></div><div class="cn">JARABE</div><div style="font-size:6px;color:#4a5090;line-height:1.4">${e.enf ? 'CURA RESFRIADO' : 'SOLO SI ESTÁ RESFRIADO'}</div><button class="bt ${e.enf ? 'ok' : 'no'}" data-a="med_usar">USAR</button></div>` : '') +
      ids.map(k => {
        const c = COMIDAS[k];
        let statText = '';
        if (c.rand) statText = '¡SORPRESA!';
        else {
          const p = [];
          if (c.h > 0) p.push(`<span style="display:inline-flex;align-items:center;gap:1px"><canvas class="ic-sub" data-prev="ic_ham"></canvas>+${c.h}</span>`);
          if (c.e > 0) p.push(`<span style="color:#a04800">⚡+${c.e}</span>`);
          statText = p.join(' · ');
        }
        return `<div class="card"><div class="pv"><canvas data-prev="fd_${k}"></canvas><span class="pv-cant">x${e.comida[k]}</span></div><div class="cn">${c.n}</div><div style="font-size:6px;color:#4a5090;line-height:1.4;display:flex;align-items:center;justify-content:center;gap:3px">${statText}</div><button class="bt ok" data-a="f_dar" data-k="${k}">DAR</button></div>`;
      }).join('') +
      (petActiva('pet_sif') ? `<div class="card"><div class="pv"><canvas data-prev="fd_pl_kekeperro"></canvas><span class="pv-cant">x${e.sifK || 0}</span></div><div class="cn">KEKE PARA PERRO</div><div style="font-size:6px;color:#4a5090;line-height:1.4">COMIDA SIF</div><button class="bt ${e.sifK > 0 ? 'ok' : 'no'}" data-a="f_sif">DAR</button></div>` : '') + `</div>` +
      ((ids.length || (e.meds || 0) > 0) ? '' : `<div class="centro" style="font-size:7px;color:#aab4ff;margin-top:12px;line-height:1.9">Toca COMPRAR para conseguir más comida.</div>`);
  }

