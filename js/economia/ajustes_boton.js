  function iconoAju() {
    const g = Grid(11, 11);
    // sliders de ajuste: 3 líneas con perilla amarilla en distinta posición
    // línea 1 (fila 1-2): perilla en x=3
    // línea 2 (fila 4-5): perilla en x=7
    // línea 3 (fila 7-8): perilla en x=5
    for (let x = 0; x < 11; x++) {
      if (x < 2 || x > 4) g.set(x, 1, '#e8ecff');
      if (x < 2 || x > 4) g.set(x, 2, '#e8ecff');
      if (x < 6 || x > 8) g.set(x, 4, '#e8ecff');
      if (x < 6 || x > 8) g.set(x, 5, '#e8ecff');
      if (x < 4 || x > 6) g.set(x, 7, '#e8ecff');
      if (x < 4 || x > 6) g.set(x, 8, '#e8ecff');
    }
    // perillas amarillas
    [[2,1],[3,1],[4,1],[2,2],[3,2],[4,2]].forEach(([x,y]) => g.set(x, y, '#ffd84a'));
    [[6,4],[7,4],[8,4],[6,5],[7,5],[8,5]].forEach(([x,y]) => g.set(x, y, '#ffd84a'));
    [[4,7],[5,7],[6,7],[4,8],[5,8],[6,8]].forEach(([x,y]) => g.set(x, y, '#ffd84a'));
    return g;
  }
  $('b-ajustes').onclick = () => menuAbrir('resp', () => { if (!admin) ajTab = 'cfg'; abrir('resp'); });


  /* ===================== CÓDIGOS ===================== */
  // (Lógica, lista de códigos y canje movidos a codigos.js para fácil visualización y edición)

