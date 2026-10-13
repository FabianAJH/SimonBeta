  function renderSimonInfo() {
    $('m-titulo').textContent = 'SIMON';
    const n = nivel(), xpA = xpDe(n), xpB = n >= NMAX ? xpA + 1 : xpDe(n + 1);
    const barra = (v, c) => `<div class="barra" style="margin-top:3px"><div style="width:${Math.max(0, Math.min(100, v))}%;background:${c}"></div></div>`;
    const hp = v => `<div class="hp"><div class="hpf ${v > 50 ? 'ok' : v > 25 ? 'medio' : 'bajo'}" style="width:${Math.max(4, v)}%"></div></div>`;
    const tarjeta = `<div class="card si-card">` +
      `<div class="si-pv"><canvas data-prev="si_card"></canvas></div>` +
      `<div class="cn">SIMON</div>` +
      `<div style="font-size:6px;color:#4a5090;margin-top:-4px">NV ${n}${n >= NMAX ? ' MAX' : ''}</div>` +
      `</div>`;
    const mascotas = [];
    if (petActiva('pet_sif')) mascotas.push(['pet_sif', 'SIF']);
    if (ojoAct()) mascotas.push(['ojo_pet', 'OJO']);
    const pets = mascotas.length ? `<div class="mini-pet-row">` + mascotas.map(([k, nm]) => `<div class="mini-pet" title="${nm}"><canvas data-prev="${k}"></canvas></div>`).join('') + `</div>` : '';
    const izq = `<div style="display:flex;flex-direction:column;gap:6px">${tarjeta}${pets}</div>`;
    let info = `<div style="display:flex;justify-content:space-between;align-items:center;color:#aab4ff;font-size:7px"><span>NIVEL ${n}${n >= NMAX ? ' · MÁXIMO' : ''}</span>${n < NMAX ? `<span style="font-size:6px;color:#ffd84a">${e.xp - xpA}/${xpB - xpA} XP</span>` : ''}</div>` +
      (n < NMAX ? barra((e.xp - xpA) / (xpB - xpA) * 100, '#ffd84a') : '') +
      `<div class="saldo" style="margin-top:8px"><span style="display:flex;align-items:center;gap:4px"><canvas data-prev="ic_mon"></canvas>${e.monedas}</span><span style="display:flex;align-items:center;gap:4px"><canvas data-prev="ic_fuego"></canvas>${racha()}</span></div>`;
    info += [
      ['ic_ham', 'HAMBRE', e.hambre], ['ic_ene', 'ENERGÍA', e.energia], ['ic_fel', 'FELICIDAD', e.feliz], ['ic_lim', 'LIMPIEZA', e.limp]
    ].map(([ic, nm, v]) => `<div class="si-stat"><canvas data-prev="${ic}"></canvas>${hp(v)}<span class="sl">${Math.round(v)}%</span></div>`).join('');
    let h = `<div style="display:flex;align-items:flex-start;gap:10px">${izq}<div style="flex:1;min-width:0">${info}</div></div>`;
    const buffs = [];
    if (e.enf) buffs.push(['fd_jarabe', 'RESFRIADO', 'Simon tiene fiebre y frío. Dale jarabe o abrígalo con bufanda/capa.']);
    Object.keys(SEMILLAS).forEach(k => { if (macetaGlobal(k)) buffs.push(['sm_' + k, SEMILLAS[k].n, SEMILLAS[k].efecto]); });
    if (petActiva('pet_sif')) buffs.push(['pet_sif', 'SIF', 'Jugar con Simon le quita 10% menos de energía.']);
    if (ojoAct()) buffs.push(['ojo_pet', 'OJO', 'Simon duerme 10% más rápido.']);
    if (simonLevita()) buffs.push(['aura_eterna', 'LEVITANDO', 'Aura puesta + Semilla Eterna viva: Simon flota.']);
    h += `<div style="margin-top:14px;font-size:7px;color:#aab4ff">VENTAJAS ACTIVAS</div>`;
    h += buffs.length ? buffs.map(([ic, bn, bd]) => `<div class="buff-row"><div class="buff-ic"><canvas data-prev="${ic}"></canvas></div><div class="buff-tx"><b>${bn}</b><span>${bd}</span></div></div>`).join('') :
      `<div class="centro" style="font-size:7px;color:#aab4ff;margin:8px 0">Ninguna por ahora. Las plantas y mascotas de Simon dan ventajas.</div>`;
    const M = misionesHoy(), ok = M.ids.filter(i => M.ok[i]).length;
    h += `<div style="margin-top:12px;font-size:7px;color:#aab4ff">MISIONES DE HOY: ${ok}/${M.ids.length}</div>`;
    h += `<div style="margin-top:14px"><button class="bt ok" style="width:100%" data-a="vs_open">VESTIR A SIMON</button></div>`;
    return h;
  }
  function renderStats() {
    $('m-titulo').textContent = 'BARRAS DE ESTADO';
    const hp = v => {
      const cls = v > 50 ? 'ok' : v > 25 ? 'medio' : 'bajo';
      return `<div class="hp" style="height:8px;margin:4px 0 6px"><div class="hpf ${cls}" style="width:${Math.max(4, Math.min(100, v))}%"></div></div>`;
    };
    const lista = [
      {
        id: 'hambre',
        ic: 'ic_ham',
        nom: 'HAMBRE',
        v: e.hambre,
        que: 'Qué tan lleno está Simon.',
        sube: 'Come kekes o comida (botón Alimentar).',
        baja: 'Con el tiempo y al jugar.'
      },
      {
        id: 'energia',
        ic: 'ic_ene',
        nom: 'ENERGÍA',
        v: e.energia,
        que: 'Sus fuerzas para jugar y estudiar.',
        sube: 'Durmiendo en la recámara o con bebidas.',
        baja: 'Al estar despierto y jugar minijuegos.'
      },
      {
        id: 'feliz',
        ic: 'ic_fel',
        nom: 'FELICIDAD',
        v: e.feliz,
        que: 'El buen humor y ánimo de Simon.',
        sube: 'Acariciándolo, con juguetes y minijuegos.',
        baja: 'Con el tiempo si pasa tiempo solo.'
      },
      {
        id: 'limp',
        ic: 'ic_lim',
        nom: 'LIMPIEZA',
        v: e.limp,
        que: 'Su higiene y aseo personal.',
        sube: 'Bañándolo con jabón y agua en el baño.',
        baja: 'Con el tiempo y al jugar.'
      }
    ];

    let h = `<div style="text-align:center;font-size:7px;color:#aab4ff;margin-bottom:10px;line-height:1.5">Mantén sus 4 barras altas para que Simon esté feliz y gane más cariño.</div>`;
    h += `<div style="display:flex;flex-direction:column;gap:8px">` + lista.map(s => {
      const pct = Math.round(s.v);
      return `<div class="card" style="padding:8px 10px;text-align:left;background:#151838;box-shadow:0 0 0 2px var(--linea)">` +
        `<div style="display:flex;justify-content:space-between;align-items:center">` +
          `<div style="display:flex;align-items:center;gap:6px">` +
            `<canvas data-prev="${s.ic}" style="width:16px;height:16px"></canvas>` +
            `<span style="font-size:8px;color:#fff;font-weight:bold">${s.nom}</span>` +
          `</div>` +
          `<span style="font-size:7px;color:#ffd84a">${pct}%</span>` +
        `</div>` +
        hp(s.v) +
        `<div style="font-size:6px;color:#aab4ff;margin-bottom:4px;line-height:1.4">${s.que}</div>` +
        `<div style="font-size:6px;line-height:1.5;color:#9bf0a8"><b style="color:#6adf6a">▲ SUBE:</b> ${s.sube}</div>` +
        `<div style="font-size:6px;line-height:1.5;color:#ffb0b0"><b style="color:#ff6a6a">▼ BAJA:</b> ${s.baja}</div>` +
      `</div>`;
    }).join('') + `</div>`;
    h += `<div style="margin-top:12px"><button class="bgrande" data-a="cerrar">ENTENDIDO</button></div>`;
    return h;
  }

