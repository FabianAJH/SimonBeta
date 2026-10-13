  /* ===================== 1000 KEKES COMIDOS → GORRO DE CHEF ===================== */
  // Al keke número 1000 Simon recibe el gorro. chefRevisa() se llama desde darComida (tienda).
  function chefPremio() {
    if (e.tiene.gorro_chef) return; cerrar(); e.tiene.gorro_chef = 1; guardar();
    fanfare({ g: () => prevGrid('gorro_chef'), t: 'GORRO DE CHEF KEKE', d: '¡1000 KEKES! PÓNSELO EN VESTIR A SIMON' }, () => decir('Sí.', e.traductor ? '¡Mil kekes! ¡Ya soy chef de verdad!' : null, 4000));
  }
  function chefRevisa() {   // se llama cada vez que Simon se come un keke
    const reqKekesChef = (typeof CONFIG_EASTEREGGS !== 'undefined' && CONFIG_EASTEREGGS.chefKekes && CONFIG_EASTEREGGS.chefKekes.kekesRequeridos) || 1000;
    if ((e.kkTot || 0) >= reqKekesChef && !e.tiene.gorro_chef) setTimeout(chefPremio, 900);
  }
