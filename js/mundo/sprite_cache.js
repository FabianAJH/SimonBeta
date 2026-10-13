/* ===================== PINTADO Y CACHÉ ===================== */
  const NOCHE = [22, 28, 78];
  const gridCache = {}, canvasCache = {};
  function sprite(clave, construir, noche) {
    const k = clave + '|' + noche;
    if (canvasCache[k]) return canvasCache[k];
    const g = gridCache[clave] || (gridCache[clave] = construir());
    const cv = document.createElement('canvas');
    cv.width = g.w; cv.height = g.h;
    const cx = cv.getContext('2d'), im = cx.createImageData(g.w, g.h), d = g.d, o = im.data;
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3];
      if (!a) continue;
      o[i] = d[i] + (NOCHE[0] - d[i]) * noche; o[i + 1] = d[i + 1] + (NOCHE[1] - d[i + 1]) * noche; o[i + 2] = d[i + 2] + (NOCHE[2] - d[i + 2]) * noche; o[i + 3] = a;
    }
    cx.putImageData(im, 0, 0);
    return (canvasCache[k] = cv);
  }

