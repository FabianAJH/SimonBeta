# Estructura del proyecto

```
index.html, sw.js, manifest.json, style.css   ← deben quedarse en la raíz
icon-*.png, icon.svg, si.mp3, PressStart2P.woff2
js/
  nucleo/       base (constantes y estado `e`), seguridad_guardado, respaldo_idb, sanitizar, estado_guardado,
                pixel_art (motor de dibujo), config, bucle_y_dibujo, notificaciones, arranque
  mundo/        escena (sprite_cache, escena_estado, gestos, colocar_muebles, paredes_libres, juguetes_zona_guia,
                dibujar_muebles, juguetes_fisica), cuarto, salas (juegos/cocina/entrada), parque, jardin_dibujo,
                navegacion_mapa, casa y vestidor (editor_lista, editor_modo, iconos_vestir_editar_inv, vestir_acciones,
                ficha_simon, vestir_ventana, inventario_ventana), estudio, clima
  simon/        simon_sprite (cómo se dibuja Simon), vida_propia, resfriado, reacciones_ropa_tormenta, mimos
  economia/     economia_logros, regalo_diario, tienda_equipar, misiones_preguntas, adivinar_silueta,
                misiones_ventana, simon_dice_ventana, respaldo_codigos, ajustes_boton, admin_acceso, ajustes_ventana,
                admin_panel, comida_especial, codigos, racha, mercado, jardin (lógica), refri
    catalogo/   el catálogo de objetos, en el ORDEN en que se registran (importa):
                  base → dibujo_ropa → dibujo_muebles → items_base (aquí nace ITEMS) → jardin_plantas → cuadros →
                  juguetes_pufs → decoracion_por_tema → estudio → temas_y_orden → paredes_pisos_refri →
                  trofeos_camas_closet → ropa → (secretos/catalogo_secretos) → previews → comidas_y_efectos →
                  regalos_de_nivel → recamara_espacial → baratas → nuevos_v2_ropa → nuevos_v2_muebles →
                  nuevos_v2_pisos_paredes → platos_cocina
                  Los tres archivos `nuevos_v2_*` (51 items de tienda, NV30-46 y NV76: ropa, muebles, pisos y
                  paredes) se cargan A PROPÓSITO después de `baratas.js`: así el precio/nivel que registran con
                  `registrarRopa()`/`registrarMueble()` (o el objeto `ITEMS[k]` directo para pisos/paredes) ya
                  es el definitivo de tienda, sin pasar por el ajuste global `P15` (x1.5) ni por la tabla `ECON`
                  de `baratas.js`, que solo corrigen los items anteriores a ellos.
  personajes/   cortex_visitas, tutorial_pantalla, cortex_caja, cortex_siesta, cortex_comerciante y
                cortex_bombas (bombas, explosiones y descanso de Cortex)
  historia/     diálogos, historia e intro
  audio/        audio_base, musica, lluvia, ambiente_estudio, ambiente_lugar, botones_audio, foto
  interfaz/     hablar_y_pintar, sistema_eventos, navegacion_atras, ventana_base, tienda_ventana, clics_ventana,
                acciones_comer_jugar_dormir, botones_principales, toques_escena, audio_destrabar, bucle_y_vuelta
  minijuegos/   00_config (valores por defecto), menu (las tarjetas), cocina, bano, atrapa_keke,
                ritmo, corre_simon, memoria — cada juego es independiente de los demás
  secretos/     TODOS los secretos, un archivo cada uno (el número es el orden de carga):
                  catalogo_secretos.js  → los OBJETOS secretos (casco, gorro, platillo, peluche…). Se carga junto al catálogo, no con los demás
                  config_eastereggs.js  → los parámetros (toques, probabilidades, horas…) de los secretos
                  sif.js                → Sif
                  00_base_cielo.js      → lo compartido: hora/noche, sonidos (retumbo, sonidoUnico) y lunas vistas desde otras ventanas
                  01_luna_dorada.js     → luna dorada → ovni → casco espacial
                  02_estrella_fugaz.js  → 3 deseos → mini platillo volador
                  03_cuadro_cortex_bebe.js → 10 toques al peluche de Cortex → cuadro de Cortex bebé
                  04_peluche_cortex.js  → 3 bombas a Cortex → mini Cortex de peluche
                  05_gorro_chef.js      → 1000 kekes → gorro de chef
                  06_luna_sangre.js     → luna de sangre → Ojo de Cthulhu
                  07_luna_azul.js       → luna azul → aura legendaria
                  08_aura_trueno.js     → tormenta → aura de trueno
                  09_alvarikoke.js      → árbol del parque (5 toques) → alvarikoke → collar de la suerte → trébol diario (3% +1%/día, se pierde si no se recoge) → semilla única (30 días) → aura de trébol. El descuento de Cortex (20% de los días, 10-50%, con la planta colocada) está en personajes/cortex_comerciante.js (`mercDesc`). Parámetros en config_eastereggs.js (`alvarikoke`). Estado: `e.alv`
                  10_chica_sol.js       → 5% de salir en el parque de día → pregunta por la belleza del sol → collar del sol → 7 días seguidos puesto → semilla solar (7 días) → planta: de día +1 felicidad/min y +1 energía/3 min con el juego abierto (`solTick`, cada 5 s en bucle_y_vuelta.js); de noche se apaga. Estado: `e.solar`. Parámetros en config_eastereggs.js (`chicaSol`)
herramientas/   codigos_privados.js + compilar_codigos (.js y .html): genera js/economia/codigos.js
                generar_sw.js: escribe solo la lista de archivos y la versión del caché de sw.js (hash del contenido).
                EJECÚTALO SIEMPRE antes de publicar o empaquetar: `node herramientas/generar_sw.js`
tests/          pruebas automáticas (ver tests/LEEME.md)
```

El ORDEN en que se cargan los archivos importa: está en `index.html` (y repetido en `sw.js`). Lista legible: `js/_orden_de_carga.txt`.
IMPORTANTE: el catálogo registra objetos al cargar y el orden de registro define cómo se listan en las tiendas. Si mueves un archivo del catálogo, corre `npm test` (la prueba 09 lo vigila).

Los secretos se conectan al resto del juego por pocos puntos: `ovTick/blTick/azulTick/truenoTick` (bucle), `ovCielo/…` (dibujo de la ventana), `chefRevisa()` (tienda: al comer keke) y `pelucheBombasLineas()` (despedida de Cortex tras la bomba).

Al agregar o mover un archivo hay que actualizar index.html y sw.js, y luego correr `npm test` dentro de `tests/`.

## Textos guardados sin usar
herramientas/dialogos_sin_usar.js: diálogos que ningún código leía; no se carga, se conservan por si se quieren reutilizar.

## Guardado dañado
Si ninguna copia se puede leer, el texto original se conserva en localStorage como `simon-v1-rescate` y `simon-v1-rescate-bk`, y el juego avisa.
En Ajustes > RESPALDO aparece «RECUPERAR PARTIDA DE RESCATE» (pide confirmar; reemplaza la partida actual) si la copia todavía se puede descifrar
(p. ej. firma alterada). Si está cortada, solo ofrece «DESCARGAR COPIA DE RESCATE».


## Regalos de nivel (NV25-100) y muebles de jardín
- `LVGIFT` (catalogo/baratas.js) dice qué se regala en cada nivel: una clave o una LISTA (NV25, 50, 75 y 100 dan dos: piso/pared + objeto). `regalosDe(n)` la normaliza.
- `catalogo/regalos_de_nivel.js` contiene los 10 muebles (lámpara de lava, máquina de garra, trampolín, globo de nieve, planetario, campamento, terrario, robot Cortex, fuente de los deseos, portal estelar) y los 4 patrones nuevos (piso nubes, pared aurora, piso estanque con koi, pared cósmica).
  Los muebles animados llevan `anim(d, noche)` → `{key, grid}` (cuadro según `tk`, hora o luna) y se dibujan en `dibujar_muebles.js`; la luz nocturna de cada objeto vive en `mundo/luces_muebles.js` (tabla `L` por objeto: silueta teñida, foco en escalones, charco en el piso, haz, partículas; el cuadro de racha y las plantas conservan la suya en `dibujar_muebles.js`); `tap:'fn'` + `tapFn()` es lo que hacen al tocarlos (ver `tapDeco`). Todos los cuadros de un mueble deben medir lo mismo.
- `subirNivel` (economia_logros.js) entrega los regalos y arma la pantalla de felicitaciones con una tarjeta por regalo. `regalosAtrasados()` (se llama al arrancar) entrega en silencio los que falten de niveles ya pasados.
- Jardín: los muebles se guardan en `e.deco` con `h:'jardin'`. `enJardin(k)` (colocar_muebles.js) decide qué entra: tema `'jardin'` + los generales de piso (sin tema o `'todas'`, no exclusivos, no colgados, no el juguete). El estudio sigue admitiendo solo cosas de estudio; paredes y pisos solo van en la recámara.
- Capas de muebles: `muebleDelante(d)` (dibujar_muebles.js) decide si va delante de Simon: sus pies más abajo que los de él, salvo que le tape la CARA (entonces va detrás; el torso y los pies sí se pueden tapar).
- Cosas fijas del cuarto: `zonasProt/zonasLibre` (paredes_libres.js) impiden que un mueble de piso tape la mitad de arriba del arcade, refri, estufa o puerta (la de abajo sí); el mueble se baja o se aparta de lado.
- Jardín: el fondo y las macetas son dos sprites (`jardinGrid` modo 1 y 2). Las macetas se dibujan con `jardinMacetasFrente()` justo después de los muebles de atrás, así siempre quedan encima de ellos pero detrás de Simon.

## Recámara Espacial (hogar de Simon)
- Habitación 'espacial' en `HABS` con `oculta:true` (no sale en las flechas; `HABS_NAV` son las que sí). Se entra tocando el portal estelar (`irEspacial`, navegacion_mapa.js) y se sale por el portal fijo `portal_hogar` (`volverALaTierra`); `e.habAntes` recuerda de qué cuarto vino.
- **Reparación:** hasta pagar 10,000 monedas (`e.espReparado`), tocar el portal estelar solo deja VER el cuarto en ruinas (`vistaBloq='espacial'`, dibujo `espRuinaGrid` + efectos `espRuinaFx`, letrero `#esp-rep` con REPARAR/VOLVER; REPARAR pide un segundo toque). Simon se queda en la Tierra, no se puede decorar (`colocar` y la tienda lo rechazan) y una partida guardada ahí sin reparar vuelve a la Tierra. Al reparar se cobra y Simon entra.
- El cuadro de racha es `tema:'sala'` + `exclusivo`: solo va en la recámara normal (el guardado corrige los que quedaron en otro cuarto). `sanitizar.js` debe listar 'espacial' como habitación válida.
- `catalogo/recamara_espacial.js`: dibujo del cuarto, cielo por fases (`faseEspacial`: noche/amanecer/día/atardecer según `horaR()`), los 5 objetos alien (tema `'espacial'`, exclusivos, nivel 100, de tienda; categoría ESPACIO) y el portal de vuelta (`fija`).
- Pared y piso son fijos; no admite camas ni clóset (exclusivos de la recámara) ni objetos de estudio; los muebles generales sí.
