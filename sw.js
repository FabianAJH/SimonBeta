const CACHE = 'simon-72d1bc817f';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './style.css',
  './js/nucleo/config.js',
  './js/nucleo/base.js',
  './js/nucleo/seguridad_guardado.js',
  './js/nucleo/respaldo_idb.js',
  './js/nucleo/sanitizar.js',
  './js/nucleo/estado_guardado.js',
  './js/nucleo/pixel_art.js',
  './js/simon/simon_sprite.js',
  './js/mundo/cuarto.js',
  './js/mundo/salas.js',
  './js/mundo/parque.js',
  './js/mundo/jardin_dibujo.js',
  './js/mundo/navegacion_mapa.js',
  './js/economia/catalogo/base.js',
  './js/economia/catalogo/dibujo_ropa.js',
  './js/economia/catalogo/dibujo_muebles.js',
  './js/economia/catalogo/items_base.js',
  './js/economia/catalogo/jardin_plantas.js',
  './js/economia/catalogo/cuadros.js',
  './js/economia/catalogo/juguetes_pufs.js',
  './js/economia/catalogo/decoracion_por_tema.js',
  './js/economia/catalogo/estudio.js',
  './js/economia/catalogo/temas_y_orden.js',
  './js/economia/catalogo/paredes_pisos_refri.js',
  './js/economia/catalogo/trofeos_camas_closet.js',
  './js/economia/catalogo/ropa.js',
  './js/secretos/catalogo_secretos.js',
  './js/economia/catalogo/previews.js',
  './js/economia/racha.js',
  './js/mundo/clima.js',
  './js/economia/catalogo/comidas_y_efectos.js',
  './js/economia/mercado.js',
  './js/economia/jardin.js',
  './js/economia/refri.js',
  './js/economia/catalogo/regalos_de_nivel.js',
  './js/economia/catalogo/recamara_espacial.js',
  './js/economia/catalogo/baratas.js',
  './js/economia/catalogo/nuevos_v2_ropa.js',
  './js/economia/catalogo/set_espacial.js',
  './js/economia/catalogo/nuevos_v2_muebles.js',
  './js/economia/catalogo/nuevos_v2_pisos_paredes.js',
  './js/economia/catalogo/platos_cocina.js',
  './js/historia/dialogos.js',
  './js/nucleo/notificaciones.js',
  './js/economia/codigos.js',
  './js/secretos/config_eastereggs.js',
  './js/minijuegos/00_config.js',
  './js/minijuegos/cocina.js',
  './js/minijuegos/bano.js',
  './js/personajes/cortex_bombas.js',
  './js/minijuegos/menu.js',
  './js/minijuegos/atrapa_keke.js',
  './js/minijuegos/ritmo.js',
  './js/minijuegos/corre_simon.js',
  './js/minijuegos/memoria.js',
  './js/mundo/sprite_cache.js',
  './js/mundo/escena_estado.js',
  './js/mundo/gestos.js',
  './js/mundo/colocar_muebles.js',
  './js/mundo/paredes_libres.js',
  './js/mundo/juguetes_zona_guia.js',
  './js/mundo/dibujar_muebles.js',
  './js/mundo/luces_muebles.js',
  './js/mundo/juguetes_fisica.js',
  './js/secretos/sif.js',
  './js/nucleo/bucle_y_dibujo.js',
  './js/audio/audio_base.js',
  './js/interfaz/hablar_y_pintar.js',
  './js/interfaz/sistema_eventos.js',
  './js/economia/economia_logros.js',
  './js/simon/vida_propia.js',
  './js/personajes/cortex_visitas.js',
  './js/historia/historia_intro.js',
  './js/secretos/00_base_cielo.js',
  './js/secretos/01_luna_dorada.js',
  './js/secretos/02_estrella_fugaz.js',
  './js/secretos/03_cuadro_cortex_bebe.js',
  './js/secretos/04_peluche_cortex.js',
  './js/secretos/05_gorro_chef.js',
  './js/secretos/06_luna_sangre.js',
  './js/secretos/07_luna_azul.js',
  './js/secretos/08_aura_trueno.js',
  './js/secretos/09_alvarikoke.js',
  './js/secretos/10_chica_sol.js',
  './js/personajes/tutorial_pantalla.js',
  './js/personajes/cortex_caja.js',
  './js/personajes/cortex_siesta.js',
  './js/personajes/cortex_comerciante.js',
  './js/audio/musica.js',
  './js/audio/lluvia.js',
  './js/audio/ambiente_estudio.js',
  './js/audio/ambiente_lugar.js',
  './js/audio/botones_audio.js',
  './js/audio/foto.js',
  './js/economia/regalo_diario.js',
  './js/economia/tienda_equipar.js',
  './js/economia/misiones_preguntas.js',
  './js/economia/adivinar_silueta.js',
  './js/economia/misiones_ventana.js',
  './js/economia/simon_dice_ventana.js',
  './js/economia/respaldo_codigos.js',
  './js/economia/ajustes_boton.js',
  './js/economia/admin_acceso.js',
  './js/economia/ajustes_ventana.js',
  './js/economia/admin_panel.js',
  './js/economia/comida_especial.js',
  './js/mundo/editor_lista.js',
  './js/mundo/editor_modo.js',
  './js/mundo/iconos_vestir_editar_inv.js',
  './js/mundo/vestir_acciones.js',
  './js/mundo/ficha_simon.js',
  './js/mundo/vestir_ventana.js',
  './js/mundo/inventario_ventana.js',
  './js/simon/resfriado.js',
  './js/simon/reacciones_ropa_tormenta.js',
  './js/simon/mimos.js',
  './js/interfaz/navegacion_atras.js',
  './js/interfaz/ventana_base.js',
  './js/interfaz/tienda_ventana.js',
  './js/interfaz/clics_ventana.js',
  './js/interfaz/acciones_comer_jugar_dormir.js',
  './js/interfaz/botones_principales.js',
  './js/interfaz/toques_escena.js',
  './js/interfaz/audio_destrabar.js',
  './js/interfaz/bucle_y_vuelta.js',
  './js/mundo/estudio.js',
  './js/nucleo/arranque.js',
  './si.mp3',
  './PressStart2P.woff2',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CACHE).then(async c => {
      await Promise.all(
        ARCHIVOS.map(url =>
          c.add(url).catch(err => console.warn('[SW] No se pudo cachear:', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', ev => {
  ev.respondWith(
    caches.match(ev.request, { ignoreSearch: true }).then(async r => {
      if (r) return r;
      try {
        const netResp = await fetch(ev.request);
        return netResp;
      } catch (err) {
        if (ev.request.mode === 'navigate') {
          const fallback = await caches.match('./index.html');
          if (fallback) return fallback;
        }
        throw err;
      }
    })
  );
});
