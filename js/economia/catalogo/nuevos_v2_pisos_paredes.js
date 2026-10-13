  /* ===================== NUEVOS ITEMS V2: PISOS Y PAREDES (11 estilos, NV30-45) =====================
     Reutiliza PAT_P/PAT_F de paredes_pisos_refri.js (agrega los patrones que faltan) y el formato EST_DEF.
     Carga después de baratas.js: precio y nivel ya son los definitivos. */

  // ---------- patrones nuevos ----------
  PAT_F.ajedrez = (x, y, c) => (((x / 8 | 0) + (y / 8 | 0)) % 2) ? c[1] : c[0];
  PAT_F.marmol = (x, y, c) => { const v = Math.sin(x * .25 + y * .12) + Math.sin(x * .07 - y * .3); return Math.abs(v) < .15 ? c[2] : (v > .5 ? c[1] : c[0]); };
  PAT_P.hexagonos = (x, y, c) => { const yy = y % 14, xx = (x + (Math.floor(y / 14) % 2) * 7) % 14; const d = Math.abs(xx - 7) + Math.abs(yy - 7) * .6; return d < 2 ? c[2] : (xx < 7 ? c[0] : c[1]); };
  PAT_P.bambu = (x, y, c) => { const seg = x % 10; if (seg === 0 || seg === 1) return c[2]; if (y % 14 < 2) return c[2]; return (x % 20 < 10) ? c[0] : c[1]; };
  PAT_P.enredadera = (x, y, c) => { const vx = 8 + Math.round(Math.sin(y * .3) * 4), vx2 = 24 + Math.round(Math.sin(y * .3 + 2) * 4); if (Math.abs((x % 32) - vx) < 1.4 || Math.abs((x % 32) - vx2) < 1.4) return c[2]; return (x % 16 < 8) ? c[0] : c[1]; };
  PAT_P.nubes3d = (x, y, c) => { const nube = (cx, cy, r) => Math.hypot(x - cx, (y - cy) * 1.6) < r; if (nube(6, 6, 4) || nube(10, 7, 3) || nube(22, 14, 4) || nube(26, 13, 3) || nube(15, 20, 3.5)) return c[2]; return ((x + y) % 9 === 0) ? c[1] : c[0]; };
  PAT_P.bosque_nocturno = (x, y, c) => { const tx = x % 12, h = 6 + (x * 7) % 6; if (y > 20 - h && Math.abs(tx - 6) < 3 - (20 - y) * .15) return c[2]; return ((x * 5 + y * 3) % 23 === 0) ? c[1] : c[0]; };

  // ---------- catálogo [clave, nombre, precio, nv, habitación, pared|piso, patrón, colores, franja baja (solo pared)] ----------
  const EST_DEF_V2 = [
    ['v2_tablones', 'TABLONES', 230, 30, 'sala', 'piso', 'tablones', ['#e0b888', '#d4aa74', '#8a5a34']],
    ['v2_hexagonos', 'HEXAGONOS', 255, 32, 'sala', 'pared', 'hexagonos', ['#cfe8e0', '#b8dcd0', '#6aa8a0'], ['#8ac8ba', '#5a988a']],
    ['v2_ajedrez', 'PISO AJEDREZ', 270, 33, 'sala', 'piso', 'ajedrez', ['#f0f0f0', '#232323']],
    ['v2_marmol', 'MARMOL', 300, 35, 'sala', 'piso', 'marmol', ['#f4f2f0', '#e2dedc', '#b8b2ae']],
    ['v2_azulejos', 'AZULEJOS', 315, 36, 'sala', 'pared', 'azulejo', ['#bfe0f0', '#9fd0e8', '#2a7a9a'], ['#7ab8d0', '#4a8aa0']],
    ['v2_bambu', 'BAMBU', 340, 38, 'sala', 'pared', 'bambu', ['#dff0d8', '#c8e8ba', '#2f7a3a'], ['#8ac07a', '#4a8a3a']],
    ['v2_ladrillo', 'PARED DE LADRILLO', 355, 39, 'sala', 'pared', 'ladrillo', ['#b0583c', '#9c4a32', '#d8c8b0'], ['#7a3a28', '#6a2e20']],
    ['v2_enredadera', 'ENREDADERA', 385, 41, 'sala', 'pared', 'enredadera', ['#eef4e8', '#dce8d0', '#2f7a3a'], ['#9ac08a', '#5a9a4a']],
    ['v2_nubes3d', 'NUBES 3D', 400, 42, 'sala', 'pared', 'nubes3d', ['#aee0ff', '#8acdf5', '#ffffff'], ['#7ab8e8', '#4a8ac8']],
    ['v2_bosque_noct', 'BOSQUE NOCTURNO', 430, 44, 'sala', 'pared', 'bosque_nocturno', ['#1a2a4a', '#223a5e', '#0a1428'], ['#101c38', '#0a1222']],
    ['v2_cielo_estr', 'CIELO ESTRELLADO', 440, 45, 'sala', 'pared', 'estrellas', ['#1a1848', '#201e58', '#fff6c0'], ['#121040', '#181650']]
  ];
  EST_DEF_V2.forEach(([k, n, p, nv, hab, tipo, pat, col, wain]) => {
    ITEMS[k] = { tipo: 'cuarto', slot: (tipo === 'pared' ? 'pared' : 'piso') + (hab === 'sala' ? '' : '_' + hab), n, p, nv, pat, col, wain, tema: hab, estilo: tipo };
    ORDEN.cuarto.push(k);
  });
