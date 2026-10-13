  /* ===================== VENTANAS ===================== */
  let modal = null, tab = 'ropa';
  function abrir(t, hPush = true) { if (ipf()) return; if (tutMenuBloq(t) && !admin) return; if (guiaBloq(t) && !admin) return; if (vistaBloq) { salirVistaBloq(); pintarNav(); } const yaEstabaAbierto = !!modal; modal = t; if (t === 'tienda') { if (!tvPre) tv = 'hub'; tvPre = false; tsel = null; tBuscar = ''; } if (t === 'inventario') { iv = 'hub'; isel = null; } if (t === 'vestir') { vSnap = Object.assign({}, e.ropa); vF = 'todo'; vBuscar = ''; } if (t === 'resp') cdMsg = null; const hoja = t === 'dice' || t === 'comida' || t === 'misiones' || t === 'vestir'; $('modal').classList.toggle('sheet', hoja); if (hoja) subeEscena(); $('escena').classList.toggle('alto', hoja); if (t === 'dice') { dv = 'menu'; ronda = null; } rsConf = false; if (t === 'regalo') ultimoPremio = null; $('modal').classList.add('on'); render(); if (hPush && !yaEstabaAbierto) navPush(); }
  // (Listeners cgc movidos a minijuegos.js)

  function cerrar(hPop = true) { if (modal === 'celebra') celCur = null; if (modal === 'jardin') jSel = null; if (modal === 'cocinar') ck = null; if (modal === 'vestir' && vSnap) vsCancel(); try { setTimeout(estSndCheck, 0); } catch (_) {} resetPend = false; limpiaT(); if (modal === 'dice') $('burbuja').classList.remove('on'); tBuscar = ''; vBuscar = ''; modal = null; $('modal').classList.remove('on', 'sheet'); $('escena').classList.remove('alto'); setTimeout(saludar, 500); setTimeout(checkVisita, 3500); if (celQ.length) setTimeout(celebraCheck, 50); if (hPop) navPop(); }
  function render() {
    if (!modal) return;
    const cu = $('m-cuerpo'), sc = cu.scrollTop;
    let h = '';
    $('m-x').style.display = (modal === 'regalo' && !ultimoPremio) ? 'none' : '';
    if (modal === 'regalo') {
      $('m-titulo').textContent = 'REGALO DIARIO';
      if (ultimoPremio) {
        const u = ultimoPremio;
        h = `<div class="centro"><div class="grande">+${u.m} MONEDAS</div>` +
          (u.item ? `<div class="grande">¡${ITEMS[u.item].n}!</div><div>Regalo especial del día 7. Ya está en tu tienda.</div>` : '') +
          `<div style="margin-top:10px">Racha: ${u.racha} ${u.racha === 1 ? 'día' : 'días'}</div>` +
          `<div style="margin-top:8px;color:#aab4ff">Vuelve mañana: el premio mejora cada día.</div>` +
          `<button class="bgrande" data-a="cerrar">¡GRACIAS!</button></div>`;
      } else {
        const i = infoRegalo();
        h = `<div class="centro">` +
          (i.nr > 1 ? `<div>CORTEX: ¡Llevas ${i.nr - 1} ${i.nr - 1 === 1 ? 'regalo' : 'regalos'} de racha!</div>` : `<div>CORTEX: ¡Simon te manda un regalo!</div>`) +
          `<div class="dias">` + PREMIOS.map((p, j) => `<div class="dia ${j + 1 < i.dia ? 'hecho' : j + 1 === i.dia ? 'hoy' : ''} ${j === 6 ? 'esp' : ''}"><b>${j + 1}</b>${j + 1 < i.dia ? 'OK' : '+' + p}</div>`).join('') + `</div>` +
          `<canvas class="caja" data-prev="caja"></canvas>` +
          `<div style="margin-top:8px">${i.dia === 7 ? 'Día 7: ¡regalo ESPECIAL!' : 'Día ' + i.dia + ' de 7'}</div>` +
          `<button class="bgrande" data-a="abrirreg">ABRIR REGALO</button>` +
          `<div style="margin-top:12px;color:#aab4ff;font-size:7px">Si faltas un día, no pasa nada.</div></div>`;
      }
    } else if (modal === 'dibujo') {
      $('m-titulo').textContent = 'SIMON TE DIBUJÓ ALGO';
      h = `<div class="centro"><canvas data-prev="dib_${dibujoId}"></canvas><div style="margin-top:10px">Simon te dibujó ${NOMBRE_DIB[dibujoId]}.</div><div class="grande">+15 MONEDAS</div>` +
        `<div class="galeria">` + DIBUJOS.map(d => `<canvas data-prev="dib_${d}" style="opacity:${e.dibujos[d] ? 1 : .22}"></canvas>`).join('') + `</div>` +
        `<div style="margin-top:8px;color:#aab4ff">Dibujos: ${Object.keys(e.dibujos).length}/5</div><button class="bgrande" data-a="cerrar">¡SÍ!</button></div>`;
    } else if (modal === 'foto') {
      $('m-titulo').textContent = 'TU FOTO';
      h = `<div class="centro"><img src="${fotoURL}" alt="foto de Simon" style="max-width:100%;max-height:50vh;border:3px solid var(--linea);image-rendering:pixelated"><div style="display:flex;gap:8px;margin-top:14px"><button class="bt ok" style="flex:1" data-a="compartir">COMPARTIR</button><button class="bt" style="flex:1" data-a="guardar">GUARDAR</button></div></div>`;
    } else if (modal === 'comercio') {
      const I = mercInfo(), of = ofertasHoy();
      $('m-titulo').textContent = 'CORTEX COMERCIANTE';
      if (I.est !== 'aqui') h = `<div class="centro">Cortex ya se fue.<br><br>Vuelve mañana.</div><div class="centro"><button class="bgrande" data-a="cerrar">OK</button></div>`;
      else h = `<div class="saldo"><span>MONEDAS: ${e.monedas}</span><span id="mc-t">QUEDAN ${mmss(I.fin - I.t)}</span></div>` +
        `<div class="centro" style="margin-bottom:10px;color:#aab4ff;font-size:7px">Cosas de mis viajes. ¡Solo hoy!</div>` +
        ((d => d ? `<div class="centro" style="margin-bottom:10px;color:#6ad070;font-size:7px;line-height:1.8">¡DESCUENTO DE HOY POR TU TRÉBOL DE LA SUERTE!</div>` : '')(mercDesc())) +
        (of.length ? `<div class="cuadricula merc">` + of.map(k => {
          const it = ITEMS[k], hecho = e.merc.compras[k];
          const dsc = mercDesc(), esD = !!(dsc && dsc.k === k), pr = precioMerc(k);
          const b = hecho ? '<div class="est">COMPRADO</div>' : `<button class="bt ${e.monedas >= pr ? 'ok' : 'no'}" data-a="mcomprar" data-k="${k}">$ ${pr}</button>`;
          const tag = esD && !hecho ? `<div class="merc-desc"><canvas data-prev="ic_trebol"></canvas>-${dsc.pct}%<s>$ ${it.p}</s></div>` : '';
          return `<div class="card card-merc ${hecho ? 'eq' : ''}">${tag}<div class="pv pv-merc"><canvas data-prev="${k}"></canvas></div><div class="cn">${it.n}</div>${b}</div>`;
        }).join('') + `</div>` : `<div class="centro">${MERC_POOL.every(k => e.tiene[k]) ? 'Ya tienes todo lo que traje. ¡Eres mi mejor cliente!' : 'Todavía no tengo nada para ti. ¡Quiere más a Simon y volveré con cosas nuevas!'}</div>`);
    } else if (modal === 'tienda') { h = renderTienda();
    } else if (modal === 'inventario') { h = renderInv();
    } else if (modal === 'notis') { h = renderNotis();
    } else if (modal === 'estudio') { h = renderEst();
    } else if (modal === 'celebra') { h = renderCel();
    } else if (modal === 'trofeos') { h = renderTrof();
    } else if (modal === 'simonInfo') { h = renderSimonInfo();
    } else if (modal === 'stats') { h = renderStats();
    } else if (modal === 'vestir') { h = renderVest();
    } else if (modal === 'closet') { h = renderCloset();
    } else if (modal === 'minijuegos') { h = renderMj();
    } else if (modal === 'mapa') { h = renderMapa();
    } else if (modal === 'cuadro') { h = renderCuadro();
    } else if (modal === 'misiones') { h = renderMis();
    } else if (modal === 'cocinar') { h = renderCocinar();
    } else if (modal === 'refri') { h = renderRefri();
    } else if (modal === 'jardin') { h = renderJardinElegir();
    } else if (modal === 'comida') { h = renderComida();
    } else if (modal === 'dice') { h = renderDice();
    } else if (modal === 'resp') { h = renderAj();
    }
    cu.innerHTML = h;
    { const s1 = $('vt-s1'), s2 = $('vt-s2'); s1.innerHTML = ''; s2.innerHTML = ''; const primero = cu.firstElementChild; if (primero && primero.classList.contains('th-top')) { const hijos = [...primero.children]; hijos.forEach((hj, i) => (i < hijos.length - 1 ? s1 : s2).appendChild(hj)); primero.remove(); } }
    { const ven = document.querySelector('#modal .ventana'); if (ven) ven.classList.toggle('sinbarra', modal === 'vestir'); }
    { const mx = $('m-x'); mx.classList.toggle('ok', modal === 'vestir'); mx.textContent = modal === 'vestir' ? '✓' : 'X'; mx.setAttribute('aria-label', modal === 'vestir' ? 'Guardar' : 'Cerrar'); mx.onclick = modal === 'vestir' ? vsGuardar : cerrar; }
    $('vs-trash').onclick = () => { sfx.click(); Object.assign(e.ropa, BASE().ropa); pintar(); render(); };
    if (modal === 'vestir') { $('vs-grip').style.display = 'flex'; }
    else { $('vs-grip').style.display = 'none'; cu.style.height = ''; cu.style.maxHeight = ''; const vt = document.querySelector('#modal .ventana'); if (vt) vt.style.maxHeight = ''; }
    { const vs = $('t-sheet'); if (vs) vs.remove(); const sh = modal === 'tienda' ? tSheetH : modal === 'inventario' ? iSheetH : ''; if (sh) { const d = document.createElement('div'); d.id = 't-sheet'; d.innerHTML = sh; cu.parentElement.appendChild(d); d.addEventListener('click', mClick); } }
    dibujarPrevCanvases(cu);
    if ($('t-sheet')) dibujarPrevCanvases($('t-sheet'));
    cu.scrollTop = sc;
    if (guia && modal === 'comida') requestAnimationFrame(guiaMarca);   // actualizar flecha tutorial al instante
  }
