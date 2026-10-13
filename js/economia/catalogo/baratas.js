  /* ===================== COSAS BARATAS PARA EMPEZAR ===================== */
  function ositoGrid() {
    const g = Grid(14, 14);
    g.art(0, 0, ["..oo......oo..", ".oBBo....oBBo.", ".oBBBoooooBBBo", "..oBBBBBBBBBo.", "..oBeBBBBeBBo.", "..oBBBllBBBBo.", "..oBBlllnlBBo.", "...oBBrrrrBBo.", "..oBBBBBBBBBBo", ".oBBBllllBBBo.", ".oBBBllllBBBo.", ".oBBBBBBBBBBo.", ".oBBoBBBBoBBo.", "..oo.oooo.oo.."],
      { o: '#4a2a10', B: '#b87a44', l: '#e8c090', e: '#1a1020', n: '#3a2010', r: '#e8353f' });
    return g;
  }
  function banderinGrid() {
    const g = Grid(20, 12);
    g.rect(0, 0, 2, 12, '#8a5a30'); g.rect(0, 0, 1, 12, '#c98a52');
    for (let x = 2; x < 20; x++) {
      const h = Math.round(5 * (1 - (x - 2) / 18));
      for (let y = 5 - h; y <= 6 + h; y++) g.set(x, y, y === 5 - h ? '#6aa8ff' : y === 6 + h ? '#0a2a8a' : '#2a62e0');
    }
    g.art(5, 4, ['y.y.y', 'yyyyy', '.yyy.'], { y: '#d4202e' });
    g.set(7, 4, '#ff4a5a');
    return g;
  }
  ITEMS.nariz_payaso = { tipo: 'ropa', slot: 'cara', n: 'NARIZ DE PAYASO', p: 25, nv: 1, crop: [16, 32, 24, 16] };
  ITEMS.panuelo = { tipo: 'ropa', slot: 'cuello', n: 'PAÑUELO AZUL', p: 35, nv: 1, crop: [8, 44, 40, 22] };
  ITEMS.osito = { tipo: 'cuarto', slot: 'deco', n: 'OSITO DE PELUCHE', p: 35, nv: 1, grid: ositoGrid, tema: 'todas' };
  ITEMS.racha = { tipo: 'cuarto', slot: 'decoP', n: 'CUADRO DE RACHA', p: 0, nv: 1, grid: () => rachaGrid(racha(), 0, 0), fija: true, tema: 'sala', exclusivo: true, tap: 'racha', luz: true };
  ITEMS.banderin = { tipo: 'cuarto', slot: 'decoP', n: 'BANDERIN', p: 30, nv: 1, grid: banderinGrid, tema: 'todas' };
  ORDEN.ropa.push('nariz_payaso', 'panuelo'); ORDEN.cuarto.push('osito', 'banderin');
  // Precios y niveles definitivos (balance): [nv, precio]
  const ECON = {"juguete_azul":[1,30],"mono":[1,30],"tostadora":[4,50],"cactus":[1,40],"delantal":[4,55],"florero":[1,40],"gafas":[1,40],"puf_rojo":[2,45],"puf_verde":[2,45],"silla":[4,55],"tapete":[7,75],"canasta":[4,65],"letrero":[7,80],"paraguas":[7,80],"juguete_dado":[3,65],"maceta":[3,65],"olla":[4,70],"percha":[7,90],"reloj":[4,70],"marco_keke":[4,85],"mesita":[4,85],"cuadro_keke":[5,110],"cuadro_luna":[5,110],"corbata":[5,60],"alf_azul":[5,80],"puf_rosa":[6,85],"cafetera":[6,95],"bufanda":[6,100],"buzon":[7,110],"especias":[7,110],"farol":[7,110],"juguete_playa":[7,110],"planta":[8,120],"puf_morado":[8,120],"sartenes":[8,120],"juguete_disco":[8,140],"pared_rosa":[9,150],"planta_alta":[9,150],"zapatero":[9,150],"guirnalda":[10,180],"juguete_patito":[10,180],"sud_roja":[10,180],"baul":[10,200],"consola":[11,215],"estante":[11,215],"lampara":[11,215],"planta_grande":[12,230],"sud_naranja":[12,230],"librero":[12,305],"sillon":[13,320],"sofa":[13,480],"alf_verde":[13,135],"gafas_corazon":[14,170],"pared_verde":[14,195],"sud_verde":[14,225],"banca_entrada":[14,255],"juguete_osito":[15,265],"sud_rosa":[15,265],"espejo":[15,295],"guitarra":[16,310],"espejo_pie":[16,340],"globo":[16,340],"mesa":[17,355],"juguete_keke":[17,390],"marco_cortex":[17,390],"neon_estrella":[18,405],"neon_corazon":[18,440],"tocadiscos":[18,440],"tele":[19,700],"chimenea":[19,840],"audifonos":[19,315],"sud_celeste":[20,330],"capa_roja":[20,475],"puf_dorado":[20,510],"telescopio":[21,605],"horno":[21,680],"acuario":[21,835],"orejas_gato":[22,395],"capa_azul":[22,510],"pato":[22,590],"piano":[23,1220],"collar":[23,490],"monoculo":[3,310],"bufanda_dorada":[4,340],"sud_morada":[5,365],"sud_negra":[7,365],"marco_planeta":[8,390],"sud_calabaza":[1,390],"sud_navidad":[1,390],"calabaza":[1,415],"alf_dorada":[10,470],"pared_halloween":[1,470],"pared_noche":[11,520],"arbol":[1,570],"sud_dorada":[13,570],"dino":[14,650],"cohete":[16,780],
    "sud_gris":[1,35],"sud_amarilla":[2,45],"sud_cafe":[3,55],"sud_turquesa":[4,65],"sud_lila":[6,85],"sud_blanca":[7,95],"sud_coral":[9,115],"sud_menta":[11,135],"sud_oliva":[13,155],"sud_guinda":[15,175],"sud_marino":[17,195],"sud_lima":[19,215],
    "sud_keke":[5,110],"sud_lunares":[8,150],"sud_marinero":[11,195],"sud_lenador":[14,235],"sud_bicolor":[16,260],"sud_camuflaje":[18,290],"sud_atardecer":[21,335],"sud_tiedye":[24,375],
    "rubor":[1,25],"pecas":[2,35],"gafas_redondas":[3,40],"bigote":[4,50],"gafas_nerd":[6,65],"antifaz":[7,75],"gafas_3d":[9,90],"bigotes_gato":[11,105],"parche":[13,120],"gafas_estrella":[15,135],"aviador":[17,150],"visor_neon":[20,170],
    "campana":[1,30],"mono_rosa":[2,35],"mono_azul":[3,45],"pajarita":[4,50],"bufanda_verde":[5,60],"bufanda_azul":[7,75],"bandana_roja":[8,85],"lei":[10,95],"bufanda_rosa":[12,110],"perlas":[14,125],"medalla":[16,140],"bandana_negra":[19,160],"cadena":[22,180],
    "lazo_cabeza":[1,30],"gorro_fiesta":[2,35],"flores":[3,45],"orejas_perro":[4,50],"antenas":[5,60],"orejas_oso":[6,65],"cuernitos":[8,80],"audifonos_rosa":[9,85],"orejas_conejo":[11,100],"estrellas_flot":[13,115],"orejas_zorro":[15,130],"halo":[17,145],"audifonos_gamer":[19,160],"alitas_angel":[21,175],"alitas_demonio":[24,200],
    "capa_rosa":[5,160],"capa_verde":[9,235],"capa_negra":[13,310],"capa_morada":[17,385],"alas_angel":[21,500],"alas_murcielago":[22,520],"alas_mariposa":[25,580]
  };
  const ECON_COM = {"kekeoro":[21,450],"cometa":[16,240],"bebida":[14,180],"batido":[12,140],"chile":[9,110],"misteriosa":[8,75],"hamburguesa":[7,85],"sopa":[6,60],"cafe":[5,50],"taco":[4,38],"helado":[3,28],"dona":[2,20],"manzana":[1,14],"galleta":[1,10]};
  Object.keys(ECON).forEach(k => { if (ITEMS[k]) { ITEMS[k].nv = ECON[k][0]; ITEMS[k].p = ECON[k][1]; } });
  Object.keys(ECON_COM).forEach(k => { if (COMIDAS[k]) { COMIDAS[k].nv = ECON_COM[k][0]; COMIDAS[k].p = ECON_COM[k][1]; } });
  // Todos los precios x1.5: los topes diarios subieron ~1.6x (se juega más al día), así el ritmo de compra por día se mantiene
  const P15 = p => Math.round(p * 1.5 / 5) * 5;
  Object.keys(ITEMS).forEach(k => { if (ITEMS[k].p > 0) ITEMS[k].p = P15(ITEMS[k].p); });
  Object.keys(COMIDAS).forEach(k => { if (COMIDAS[k].p > 0) COMIDAS[k].p = P15(COMIDAS[k].p); });
  // Regalo gratis al subir de nivel. NV2-NV20: uno por nivel. Desde NV25: uno cada 5 niveles (en NV25, 50, 75 y 100 son DOS: un piso/pared y un objeto).
  // Cada valor es una clave o una lista de claves. Los de NV20, NV30 (aura) y NV50 (capa real) son prendas premium.
  const LVGIFT = { 2: 'sud_amarilla', 3: 'p_estrellas', 4: 'sud_blanca', 5: 'cuadro_keke', 6: 'orejas_conejo', 7: 'buzon', 8: 'audifonos_gamer', 9: 'p_bosque', 10: 'sud_roja', 11: 'consola', 12: 'sud_naranja', 13: 'sillon', 14: 'sud_verde', 15: 'espejo', 16: 'espejo_pie', 17: 'juguete_keke', 18: 'neon_corazon', 19: 'chimenea', 20: 'sud_galaxia',
    25: ['f_nubes', 'capa_azul'], 30: 'aura_estelar', 35: 'collar', 40: 'horno', 45: 'piano', 50: ['p_aurora', 'capa_real'], 55: 'lampara_lava', 60: 'maq_garra', 65: 'trampolin', 70: 'globo_nieve', 75: ['f_estanque', 'planetario'], 80: 'campamento', 85: 'terrario', 90: 'robot_cortex', 95: 'fuente_deseos', 100: ['p_cosmos', 'portal_estelar'] };
  const regalosDe = n => [].concat(LVGIFT[n] || []);   // claves que regala el nivel n
  Object.keys(LVGIFT).forEach(n => regalosDe(n).forEach(gk => { const it = ITEMS[gk]; if (!it) return; it.gnv = +n; if (!it.prem) it.regalo = 'nivel'; }));
  ['ropa', 'cuarto', 'juguetes'].forEach(t => ORDEN[t].sort((a, b) => ((ITEMS[a].nv || 1) - (ITEMS[b].nv || 1)) || ((ITEMS[a].p || 0) - (ITEMS[b].p || 0))));
  ORDEN.ropa.sort((a, b) => (!!ITEMS[a].prem) - (!!ITEMS[b].prem));
  ORDEN.comida.sort((a, b) => (COMIDAS[b].nv - COMIDAS[a].nv) || (COMIDAS[b].p - COMIDAS[a].p) || (((COMIDAS[b].e || 0) + (COMIDAS[b].h || 0)) - ((COMIDAS[a].e || 0) + (COMIDAS[a].h || 0))));
