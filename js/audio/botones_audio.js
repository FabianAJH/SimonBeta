  function musicaOff() { if (!mus) return; clearInterval(mus.timer); try { mus.g.disconnect(); mus.f.disconnect(); } catch (_) {} mus = null; }
  function musicaOn() {
    if (!e.musica || document.hidden) { musicaOff(); return; }
    if (mus || !audio()) return;
    mus = { g: ac.createGain(), f: ac.createBiquadFilter(), paso: 0, t: ac.currentTime + .15, timer: 0, tn: '' };
    mus.f.type = 'lowpass'; mus.f.frequency.value = 18000; mus.g.connect(mus.f); mus.f.connect(ac.destination);
    planearMusica(); mus.timer = setInterval(planearMusica, 150);
  }
  function iconoCam() {
    const g = Grid(13, 11);
    g.rect(0, 3, 13, 8, '#e8ecff'); g.rect(0, 3, 13, 1, '#ffffff'); g.rect(4, 1, 5, 2, '#e8ecff'); g.rect(0, 10, 13, 1, '#8a94d8');
    capa(g, null, L => sombrear(L, elipse(6.5, 7, 3.2, 3.2), 6.5, 7, 3.2, 3.2, ['#8a94d8', '#3a47a8', '#232b63', '#0f1230']));
    g.set(5, 6, '#e8ecff'); g.rect(10, 4, 2, 1, '#ff4a5a');
    return g;
  }
  const ICB = {
    comer: ['....rr......','...rhr......','.wwwwwwwwww.','wwWwwwwwWwww','wwwwwwwwwwww','yyyyyyyyyyyy','yYyyyyyyyyYy','pppppppppppp','yyyyyyyyyyyy','yYyyyyyyyyYy','oooooooooooo','............'],
    luna: ['....yyyy....','..yyYYyy....','.yyY........','.yY.........','yyY.....z...','yyY.........','yyY.........','yyYY........','.yyYY....z..','.yyyYYYYY...','..yyyyyyy...','....yyyy....'],
    jugar: ['....kkkk....','..kkrrrrkk..','.krrwwrrrrk.','.krwrrrrrrk.','kkkkkkkkkkkk','kwwwwwwwwwwk','kwwwwwwwwwwk','kkkkkkkkkkkk','.krrrrrrrrk.','.krrrrrrrrk.','..kkrrrrkk..','....kkkk....'],
    tienda: ['....ddd.....','...dyyyd....','....ddd.....','..dyyyyyd...','.dyyYyyyyd..','dyyyYYyyyyd.','dyyyyYyyyyd.','dyyyYYyyyyd.','dyyyyYyyyyd.','.dyyyyyyyd..','..ddddddd...','............'],
    dice: ['....r..r....','...rrrrrr...','..kkkkkkkk..','.kwwwwwwwwk.','kwqwqwwqwqwk','kwqqqwwqqqwk','kwqqqwwqqqwk','kpwwkwwkwwpk','.kwwwkkwwwk.','..kwwwwwwk..','...kkkkkk...','............'],
    logros: ['yyyyyyyyyyyy','yYyyyyyyyyYy','yYyyyyyyyyYy','.yYyyyyyyYy.','..yYyyyyYy..','...yyyyyy...','....yYYy....','.....yy.....','.....yy.....','....yyyy....','...yYYYYy...','...yyyyyy...'],
    inv: ['............','...kkkkk....','..kwwwwwk...','..kwkkkwk...','.kwwwwwwwk..','kwwwkkkwwwk.','kwwkyyykwwk.','kwwwwwwwwwk.','kwwwkkkwwwk.','kwwwwwwwwwk.','.kwwwwwwwk..','..kkkkkkk...']
  };
  const ICPAL = { p:'#ff7aa8', o:'#c88a40', W:'#ffd0dc', h:'#ff8a92', r:'#e8333f', R:'#ff8a92', w:'#ffffff', g:'#3fb55a', D:'#8a1620', y:'#ffd23a', Y:'#c98a10', z:'#fff6b0', k:'#1b1f4a', d:'#6a3a10', q:'#0e0e18' };
  function iconoBtn(k, dormido) {
    const m = ICB[k], g = Grid(12, 12);
    m.forEach((fila, y) => [...fila].forEach((ch, x) => { if (ch !== '.') g.set(x, y, ICPAL[ch]); }));
    if (k === 'jugar') { g.rect(3, 5, 1, 1, '#e8333f'); g.rect(8, 5, 1, 1, '#ffd23a'); g.rect(9, 6, 1, 1, '#3fb55a'); }
    return g;
  }
  function pintarIconosBtn() {
    pintarIconosBtn.d = e.dormido;
    [['comer', 'ib-comer', 'comer'], ['dormir', 'ib-dormir', 'luna'], ['tienda', 'ib-tienda', 'tienda'], ['dice', 'ib-dice', 'dice'], ['inv', 'ib-inv', 'inv']].forEach(([n, id, k]) => {
      const el = $(id); if (!el) return; const c = el.getContext('2d'); c.clearRect(0, 0, 12, 12); c.drawImage(sprite('ib_' + k, () => iconoBtn(k), 0), 0, 0);
    });
  }
  function pintarIconos() {
    pintarIconosBtn();
    [['ic-not', 'notic', iconoNot, 11, 11], ['ic-cam', 'cam', iconoCam, 13, 11], ['ic-aju', 'aju', iconoAju, 11, 11], ['ic-edi', 'edi', iconoEdi, 11, 11], ['ic-ves', 'ves', iconoVes, 11, 11]].forEach(([id, k, fn, w, h]) => {
      const c = $(id).getContext('2d'); c.clearRect(0, 0, w, h); delete gridCache[k]; delete canvasCache[k + '|0']; c.drawImage(sprite(k, fn, 0), 0, 0);
    });
  }
  function alternaMusica() { e.musica = !e.musica; if (e.musica) { audio(); musicaOn(); sfx.click(); } else musicaOff(); guardar(); }
