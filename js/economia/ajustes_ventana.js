  function renderCfg() {
    const sw = on => `<span class="cfg-sw ${on ? 'on' : ''}"></span>`, mus = e.musica;
    const fila = (ic, t, sub, acc, extra) => `<button class="cfg-row" data-a="${acc}"><img src="${icU(ic)}"><span class="cfg-tx"><b>${t}</b>${sub ? `<i>${sub}</i>` : ''}</span>${extra}</button>`;
    const sec = (ic, t, cuerpo) => `<div class="cfg-sec"><div class="cfg-h"><img src="${icU(ic)}">${t}</div>${cuerpo}</div>`;
    const fu = e.fuente == null ? 1 : e.fuente, tam = [5, 7, 10];
    let h = sec('usr', 'PERFIL', fila('usr', 'TU NOMBRE', 'Así te llama Simon', 'nom_ed', `<span class="cfg-val">${quitaAc(e.nombre || '---').toUpperCase()}</span>`));
    h += sec('snd', 'AUDIO', fila('snd', 'SONIDO', 'Efectos del juego', 'r_snd', sw(!e.mudo)) + fila('mus', 'MÚSICA', 'Melodía de fondo de cada lugar', 'r_mus', sw(mus)));
    h += sec('txt', 'PANTALLA', `<div class="cfg-tx" style="padding:10px 10px 0;font-size:8px">TAMAÑO DEL TEXTO</div><div class="cfg-seg">${['CHICA', 'NORMAL', 'GRANDE'].map((t, i) => `<button class="${fu === i ? 'on' : ''}" style="font-size:${tam[i]}px" data-a="fs_set" data-k="${i}">${t === 'CHICA' ? 'A' : t === 'NORMAL' ? 'AA' : 'AAA'}</button>`).join('')}</div>`);
    h += sec('bel', 'AVISOS', fila('bel', 'AVISOS AL TELÉFONO', 'Te avisa cuando Simon te necesite', 'nt_tog', sw(e.notifOn)));
    h += sec('ayu', 'AYUDA', fila('ayu', 'VER TUTORIAL', 'Repasa los botones de la pantalla', 'tut_ver', '<span class="cfg-val">›</span>'));
    return h + `<div class="cfg-pie">SIMON: TU AMIGO VIRTUAL<br>VERSIÓN ${VERSION_JUEGO}</div>`;
  }
  function renderLogros() {
    const hechos = LOGROS.filter(l => e.logros[l.id]).length;
    return `<div class="saldo"><span>${hechos}/${LOGROS.length} LISTOS</span><span>CARIÑO NV${nivel()}</span></div>` +
      LOGROS.map(l => {
        const v = Math.min(l.val(), l.meta), ok = !!e.logros[l.id];
        return `<div class="logro ${ok ? 'hecho' : ''}"><div class="ln">${l.n}</div><div class="ld">${l.d}</div><div class="barra"><div style="width:${v / l.meta * 100}%"></div></div><div class="lp">${ok ? 'LISTO' : v + '/' + l.meta} · +${l.r} monedas${l.item ? ' + OBRA' : ''}</div></div>`;
      }).join('');
  }
  function renderAj() {
    if (admin) return renderAjAdm();
    if (!['cfg', 'logros', 'resp', 'cod'].includes(ajTab)) ajTab = 'cfg';
    $('m-titulo').textContent = 'AJUSTES';
    const tabs = `<div class="cfg-tabs">${[['cfg', 'AJUSTES', 'gea'], ['logros', 'LOGROS', 'tro'], ['resp', 'RESPALDO', 'dis'], ['cod', 'CÓDIGOS', 'key']].map(([k, n, ic]) => `<button class="${ajTab === k ? 'on' : ''}" data-a="r_tab" data-k="${k}"><img src="${icU(ic, ajTab === k ? '#ffffff' : '#aab4ff')}">${n}</button>`).join('')}</div>`;
    const cuerpo = ajTab === 'cfg' ? renderCfg() : ajTab === 'logros' ? renderLogros() : ajTab === 'resp' ? renderResp() : renderCod(false);
    $('m-titulo').textContent = 'AJUSTES';
    return tabs + cuerpo;
  }
  function renderAj0() {
    $('m-titulo').textContent = 'AJUSTES';
    const tabs = `<div class="tabs"><button class="tab ${ajTab === 'cod' ? 'on' : ''}" data-a="r_tab" data-k="cod">CÓDIGOS</button><button class="tab ${ajTab === 'resp' ? 'on' : ''}" data-a="r_tab" data-k="resp">RESPALDO</button></div>`;
    if (ajTab === 'resp') return tabs + (admin ? `<div class="centro" style="font-size:8px;line-height:1.9">No se puede respaldar ni restaurar en modo admin.</div>` : renderResp());
    if (admin) return renderAdm();
    return tabs + ((typeof window !== "undefined" && typeof window.renderCod === "function") ? window.renderCod(false) : (typeof renderCod === "function" ? renderCod(false) : ""));
  }
