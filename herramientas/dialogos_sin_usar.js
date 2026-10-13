/* TEXTOS GUARDADOS QUE EL JUEGO NO LEE.
   Salieron de js/historia/dialogos.js porque ninguna parte del juego los consultaba (el juego usa textos
   propios en cada archivo). Este archivo NO se carga. Si algún día se quiere centralizar los diálogos,
   aquí están intactos (usan C, S, T, CT, SS de dialogos.js). */

// ==========================================================================
// 2. CORTEX VISITAS (Saludos por hora, charlas, consejos y reacciones)
// ==========================================================================
// Saludos según la hora del día en que Cortex llega de visita
const SALUDOS_HORA = {
  madrugada: [
    '¿Qué hacen despiertos a esta hora? Yo tampoco podía dormir.',
    'Es de madrugada... y aquí estamos, los noctámbulos.'
  ],
  manana: [
    '¡Buenos días! Traigo energía y buen humor.',
    '¡Buen día! ¿Ya desayunó Simon?',
    'Buenos días... ¿hay keke para el desayuno?'
  ],
  tarde: [
    '¡Buenas tardes! Pasaba por aquí.',
    '¡Hola! Qué buena hora para visitar.',
    'Buenas tardes. ¿Hay keke para la merienda?'
  ],
  noche: [
    '¡Buenas noches! Vengo rapidito.',
    'Ya casi es hora de dormir, ¿verdad, Simon?',
    'La noche está linda. Perfecta para visitar.'
  ]
};

const DIALOGOS_VISITAS = {
  avisoLlegada: 'Cortex vino de visita.',
  avisoEsperaRecamara: 'Cortex vino de visita. Te espera en la recámara.',
  fraseDescanso: () => C('Me siento a descansar un ratito, ¿sí?'),
  despedidaNormal: () => [
    C('Ya descansé. ¡Gracias por la compañía!'),
    C('Bueno, ya me voy, Simon.')
  ],
  ausenciaLarga: () => [
    C('¡Por fin volviste! Simon preguntaba por ti todo el día.'),
    S(),
    T('Te extrañé mucho.'),
    { q: 'CORTEX', t: 'Toma, una compensación por la espera: 30 monedas.', fn: () => { if (typeof ganar === 'function') ganar(30, 3, true); } }
  ],
  simonEnfermo: () => [
    C('¡Achú! Simon, ¿estás resfriado?'),
    S(),
    T('Tengo frío y la nariz tapada.'),
    { q: 'CORTEX', t: 'Toma, jarabe de mi abuela.', fn: () => { if (typeof curar === 'function') curar('jarabe'); } },
    C('Abrígalo más, ¿sí?')
  ],
  simonTriste: () => [
    C('¡Simon! ¿Estás llorando?'),
    S(),
    T('Necesito un abrazo.'),
    { q: 'CORTEX', t: '*lo abraza fuerte*', fn: () => { if (typeof e !== 'undefined') e.feliz = clamp(e.feliz + 30); if (typeof corazones === 'function') corazones(5); if (typeof gesto === 'function') gesto('besos'); if (typeof sfx !== 'undefined') sfx.regalo(); } },
    C('Ya, ya. Aquí estoy.')
  ],
  simonHambriento: () => [
    C('Se oye su estómago desde la puerta...'),
    S(),
    T('¡Quiero keke!'),
    { q: 'CORTEX', t: 'Traje keke de emergencia.', fn: () => { if (typeof e !== 'undefined') e.hambre = clamp(e.hambre + 35); if (typeof gesto === 'function') gesto('salto'); if (typeof sfx !== 'undefined') sfx.regalo(); } },
    C('¡Aliméntalo mejor, ¿sí?')
  ],
  simonCansado: () => [
    C('Simon, esas ojeras llegan al suelo.'),
    S(),
    T('Tengo muchísimo sueño.'),
    C('Déjalo dormir en su recámara.')
  ],
  regaloMonedas: () => [
    { q: 'CORTEX', t: 'Te traje algo que encontré en mis viajes.', fn: () => { if (typeof ganar === 'function') ganar(18 + Math.floor(Math.random() * 20), 3, true); } },
    S(),
    T('Gracias, Cortex.'),
    C('De nada.')
  ],
  charla: (saludo, frase) => [
    C(saludo),
    S(),
    C(frase)
  ],
  saludoGeneral: (saludo, fraseTraducida) => [
    C(saludo),
    C('¿Cómo está Simon?'),
    S(),
    { q: 'TRADUCTOR', t: '«' + fraseTraducida + '»', fn: () => {} },
    C('Cuídalo mucho.')
  ],
  reaccionRopa: (comentario) => [
    C(comentario),
    S(),
    T('Gracias. Me siento muy guapo.')
  ],
  reaccionBombasRecientes: (fraseCx, fraseSi) => [
    C(fraseCx),
    S(),
    T(fraseSi),
    C('No. No quiero. ...Bueno, no hoy.')
  ]
};

// ==========================================================================
// 3. CORTEX SIESTA (Dormirse, toques sonámbulo y despertar)
// ==========================================================================
const DIALOGOS_SIESTA = {
  iniciar: () => [
    C('Uf... qué día. Voy a sentarme un ratito aquí.'),
    { q: 'CORTEX', t: '...solo cierro los ojos un segundito...', pre: () => { if (typeof desc !== 'undefined') desc = { fin: ahora() + 150000, siesta: true, zzz: true, toques: 0 }; if (typeof bm !== 'undefined') bm = null; } },
    C('Zzz... zzz...')
  ],
  // Diálogos progresivos cuando el jugador toca a Cortex mientras duerme
  toque0: () => [
    C('Mmm... no, yo no me comí el keke... zzz'),
    S(),
    T('Sí se lo comió. ¿Y si lo explotamos?')
  ],
  toque1: () => [
    C('¡Mamá! ...cinco minutitos más... zzz'),
    S(),
    T('Cortex dice cosas raras cuando duerme.')
  ],
  toque2: () => [
    { q: 'CORTEX', t: '*abraza a Simon creyendo que es una almohada*', fn: () => { if (typeof corazones === 'function') corazones(3); if (typeof sfx !== 'undefined') sfx.regalo(); if (typeof gesto === 'function') gesto('besos'); } },
    S(),
    T('Me aprieta mucho. Pero está bien.'),
    C('Qué suave... zzz')
  ],
  toqueDespertarMolesto: () => [
    { q: 'CORTEX', t: '¡¿Quién me toca?! ...Ah. Eran ustedes.', pre: () => { if (typeof desc !== 'undefined') desc.zzz = false; if (typeof bm !== 'undefined') bm = { fase: 'adios', t: 0 }; if (typeof bombaTick === 'function') bombaTick(); } },
    C('Me quedé dormido... ¿tenía baba en la mejilla?'),
    S(),
    T('Un poquito.'),
    C('Jaja. Gracias por dejarme dormir. Hasta pronto.')
  ],
  despertarNatural: () => [
    { q: 'CORTEX', t: '¡Mmh! ...¿Me quedé dormido? ¿Cuánto tiempo pasó?', pre: () => { if (typeof desc !== 'undefined') desc.zzz = false; } },
    S(),
    T('Roncabas muy bonito.'),
    C('Jaja. Gracias por dejarme dormir, Simon. Hasta pronto.')
  ]
};

const DIALOGOS_BOMBAS = {
  siestaInterrumpida: '¡¡AAAAH!! ¡¡Estaba durmiendo!!',
  despedidaAfectuosa: () => [
    C('...Ay, Simon. Ven acá, cabezón.'),
    { q: 'CORTEX', t: '*le acaricia la cabeza con cariño*', fn: () => { if (typeof corazones === 'function') corazones(4); if (typeof gesto === 'function') gesto('besos'); if (typeof sfx !== 'undefined') sfx.regalo(); } },
    C('Nos vemos pronto. Guarda las bombas un ratito, ¿sí?')
  ],
  regaloPelucheBomba3: () => [
    C('Espera, Simon. No te vayas todavía.'),
    C('Tres veces me has explotado y sigues queriéndome igual.'),
    C('Toma. Hice algo para ti.'),
    { q: 'CORTEX', t: '.', fn: () => { if (typeof e !== 'undefined') { e.tiene.peluche_cortex = 1; if (typeof equipar === 'function') equipar('peluche_cortex'); if (typeof guardar === 'function') guardar(); } }, fan: { g: () => (typeof pelucheGrid === 'function' ? pelucheGrid() : null), t: 'MINI CORTEX DE PELUCHE', d: 'LO PUEDES COLOCAR EN TU CASA' } },
    C('Es un mini yo de peluche. Cuídalo mucho, ¿sí?')
  ]
};

// ==========================================================================
// 5. HISTORIA PRINCIPAL / INTRO (Calle, bienvenida a casa, tutoriales de inicio)
// ==========================================================================
const DIALOGOS_HISTORIA = {
  // Escena inicial bajo la lluvia en la calle
  calle: () => [
    C('¿Hay alguien junto a ese bote de basura?'),
    C('¡Oye! ¿Estás bien? Te ves flaquito y con sueño.'),
    SS(),
    C('Solo dices "sí"... pero se nota que estás triste.'),
    C('No puedo dejarte aquí. Yo te saco de esta calle.'),
    C('Ven conmigo y seremos mejores amigos. ¿Qué dices?'),
    { q: 'SIMON', t: '¡Sí!', fn: () => { if (typeof e !== 'undefined') e.feliz = Math.max(e.feliz, 30); if (typeof bocaT !== 'undefined') bocaT = 15; if (typeof gesto === 'function') gesto('salto'); if (typeof corazones === 'function') corazones(4); if (typeof sfx !== 'undefined') sfx.regalo(); if (typeof pintar === 'function') pintar(); } },
    C('Jaja, otra vez "sí". En mi tierra, "Simon" significa "sí".'),
    C('Ese será tu nombre: Simon. ¡Trato hecho!')
  ],
  // Llegada a casa y entrega de la corona
  casa1: () => [
    C('Bienvenido a tu nueva casa, Simon.'),
    SS(),
    { q: 'SIMON', t: '¡Sí!', fn: () => { if (typeof bocaT !== 'undefined') bocaT = 15; if (typeof hablar === 'function') hablar(); } },
    { q: 'CORTEX', t: 'Toma una corona: símbolo de nuestra amistad.', fn: () => { if (typeof sinCorona !== 'undefined') sinCorona = false; if (typeof sfx !== 'undefined') sfx.regalo(); if (typeof estrellas === 'function') estrellas(12); if (typeof corazones === 'function') corazones(5); if (typeof gesto === 'function') gesto('salto'); if (typeof pintar === 'function') pintar(); } },
    { q: 'SIMON', t: '¡Sí!', fn: () => { if (typeof bocaT !== 'undefined') bocaT = 15; if (typeof hablar === 'function') hablar(); } },
    C('La casa no está terminada. Al subir de nivel, abriré zonas nuevas.'),
    C('Yo no puedo cuidarlo todo el día. Él necesita a alguien como tú.'),
    C('Dime, ¿cómo te llamas?')
  ],
  // Tras ingresar el nombre del jugador
  casa2: () => [
    C('Mucho gusto, {n}.'),
    S(),
    { q: 'CORTEX', t: '¿Puedes encargarte de Simon, {n}?', op: ['¡Claro!', 'Mmm... ¿yo?'],
      res: [
        [{ q: 'TU', t: '¡Claro!' }, C('¡Sabía que dirías eso!')],
        [{ q: 'TU', t: 'Mmm... ¿yo?' }, C('Sí, tú. Yo te ayudo.')]
      ]
    },
    C('Míralo: hambriento, cansado y triste. Atiéndelo, ¡ya vuelvo!')
  ],
  // Entrega de bebidas energéticas cuando Simon está agotado en el tutorial
  bebida: () => [
    C('Uy, Simon está agotado. Dormir para recuperar energía toma su tiempo...'),
    C('Para que no tengas que esperar tanto ahorita, te dejo esto.'),
    { q: 'CORTEX', t: '', fan: { g: () => (typeof FGRID !== 'undefined' ? FGRID.bebida() : null), t: '¡3 BEBIDAS ENERGETICAS!', d: 'Le devuelven toda la energia.' }, fn: () => { if (typeof e !== 'undefined') { e.comida.bebida = 3; if (typeof guardar === 'function') guardar(); } } },
    C('Le devuelve la energía al instante, pero no siempre vas a tener bebidas a la mano.'),
    C('Lo normal es dejarlo dormir para que recupere energía. Dale una ahora.')
  ],
  // Entrega del traductor y explicación final del HUD
  final: () => [
    C('¡Mira, como nuevo!'),
    { q: 'SIMON', t: '¡Sí!', fn: () => { if (typeof bocaT !== 'undefined') bocaT = 15; if (typeof gesto === 'function') gesto('salto'); if (typeof hablar === 'function') hablar(); if (typeof corazones === 'function') corazones(3); } },
    C('Yo entiendo a Simon sin traductor. Nos conectamos desde el primer momento.'),
    C('Pero los demás no pueden. Por eso construí esto para ti, {n}.'),
    { q: 'CORTEX', t: '', fan: { c: () => (typeof sprite === 'function' && typeof iconoTrad === 'function' ? sprite('ic_trad', iconoTrad, 0) : null), t: '¡CONSEGUISTE EL TRADUCTOR!', d: 'Ahora entenderas lo que dice Simon.' }, fn: () => { if (typeof e !== 'undefined') { e.traductor = true; if (typeof guardar === 'function') guardar(); } } },
    C('Pruébalo. Simon, ¿qué piensas de {n}?'),
    S(),
    T('Te quiero mucho, {n}.'),
    { q: 'SIMON', t: '¡Quiero keke!', fn: () => { if (typeof bocaT !== 'undefined') bocaT = 15; if (typeof gesto === 'function') gesto('salto'); if (typeof hablar === 'function') hablar(); } },
    C('Jaja. El keke es su comida favorita.'),
    CT('Aquí ves su hambre, energía, felicidad y limpieza.', '.stats'),
    CT('Este círculo es su cariño. Al llenarlo, subes de nivel.', '.med'),
    CT('Vendré a visitarlos. Y una vez al día, como comerciante.'),
    C('Cuídalo mucho. ¡Y que no pierda la corona!')
  ]
};

const DIALOGOS_TUTORIALES = {
  cocinaIntro: () => [
    C('¡Esta es la COCINA! Compra ingredientes en el MERCADO y guárdalos en el REFRI.'),
    C('Toca la estufa. Hagamos una tostada juntos, ¡yo te guío!')
  ],
  cocinaFin: (r, est, porc) => [
    C('¡Muy bien! Mira lo que preparaste.'),
    { q: 'CORTEX', t: '', fan: { g: () => (typeof FGRID !== 'undefined' ? FGRID['pl_' + r.id]() : null), t: r.n, d: (est === 3 ? '¡PERFECTA! ' : est === 2 ? 'BIEN HECHA. ' : '') + 'SE GUARDÓ EN ALIMENTAR (x' + porc + ')' } },
    C('Se guarda en ALIMENTAR. Ojo: si algo se quema, pierdes los ingredientes. ¡Buen provecho, chef!')
  ],
  primerMueble: (cbProbar) => [
    C('Vi que compraste tu primer mueble. ¡Buena elección!'),
    C('Los muebles ya no se colocan solos: ve a tu inventario y toca COLOCAR.'),
    CT('Una vez colocado, se acomoda con este botón de la casita.', '#b-editar'),
    CT('Ahí arrastras cada mueble con el dedo hasta dejarlo donde quieras.', '#b-editar'),
    C('Tócalo para elegirlo: puedes girarlo, quitarlo o guardarlo otra vez.'),
    C('Cada habitación tiene sus propios muebles. Los de estudio solo van en el ESTUDIO.'),
    { q: 'CORTEX', t: 'Hoy mismo puedes acomodarlo. ¿Probamos?', op: ['¡Probar!', 'Más tarde'],
      res: [
        [{ q: 'TU', t: '¡Probar!', fn: cbProbar }],
        [{ q: 'TU', t: 'Más tarde' }]
      ]
    }
  ],
  estudioIntro: (cbTienda) => [
    C('Este es el ESTUDIO. Aquí Simon te acompaña mientras estudias.'),
    C('Toca el escritorio para empezar una sesión.'),
    { q: 'CORTEX', t: 'Y puedes personalizarlo con muebles de la tienda.', op: ['Ver la tienda', 'Más tarde'],
      res: [
        [{ q: 'TU', t: 'Ver la tienda', fn: cbTienda }],
        [{ q: 'TU', t: 'Más tarde' }]
      ]
    }
  ],
  primerResfriado: (cbTienda) => [
    C('Oí estornudar a Simon... ¿se resfrió?'),
    C('Pasa cuando se le descuida mucho: con hambre, sueño o tristeza al mismo tiempo.'),
    S(),
    T('Achú... tengo frío.'),
    CT('Hay varias formas de curarlo. La más rápida es el JARABE, que se compra en la tienda.', '#btn-tienda'),
    C('También puedes abrigarlo con una bufanda o una capa, y se le pasará en un ratito.'),
    C('O dejarlo dormir: al despertar ya estará mejor. Y si no haces nada, se cura solo en unas horas.'),
    C('Mientras esté resfriado no podrá jugar. ¡Cuídalo mucho!'),
    { q: 'CORTEX', t: '¿Quieres ir por el jarabe ahora?', op: ['Ver la tienda', 'Más tarde'],
      res: [
        [{ q: 'TU', t: 'Ver la tienda', fn: cbTienda }],
        [{ q: 'TU', t: 'Más tarde' }]
      ]
    }
  ],
  tutorialPantalla: () => [
    CT('Te explico rapidito qué es cada cosa.'),
    CT('Este círculo es el cariño: al llenarlo, subes de nivel.', '.med'),
    CT('Estas barras son su hambre, energía, felicidad y limpieza.', '.stats'),
    CT('Tus monedas, la campana de avisos y los ajustes. Ahí también están tus logros.', '.der2'),
    CT('Este botón abre tu Inventario.', '#b-inv'),
    CT('La cámara toma fotos y la casita mueve los muebles.', '#b-foto, #b-editar'),
    CT('Aquí están mis misiones.', '#t-mis'),
    CT('Abajo siguen las acciones de siempre: alimentar, dormir, la tienda y Simon dice. Los minijuegos están en la máquina arcade de la sala de juegos.', '.botones'),
    CT('¡Eso es todo! Puedes repetirlo en Ajustes.')
  ],
  cajaMisteriosa: (traeGafas, fnAbrir, fnPremio) => [
    { q: 'CORTEX', t: '¡Simon! Mira lo que encontré donde te encontré a ti.', pre: fnAbrir },
    S(),
    T('¿Una caja? ¿Para mí?'),
    C('Es tuya. Ábrela.'),
    { q: 'CORTEX', t: '*Simon sacude la caja, la abre...*', fn: fnPremio },
    { q: 'CORTEX', t: traeGafas ? '¡Gafas de sol y 25 monedas!' : '¡25 monedas!' },
    S(),
    T('¡Me encanta! No explotó... todavía.'),
    C('Jaja. Nos vemos pronto.')
  ]
};

// ==========================================================================
// 7. EL PERRITO SIF (Encuentro en el parque, darle keke, adopción)
// ==========================================================================
const DIALOGOS_SIF = {
  darKeke: (fnCome) => [
    { q: 'TRADUCTOR', t: '¿Dar keke para perros?', op: ['SÍ', 'NO'], res: [
      [
        { q: 'SIMON', t: 'Sí.', fn: fnCome },
        T('Toma, esto es para ti.'),
        { q: 'PERRO', t: '*mastica el keke y mueve la cola*', fn: () => { if (typeof sfx !== 'undefined') sfx.comer(); if (typeof corazones === 'function') corazones(5); } },
        { q: 'PERRO', t: '*te mira con ojos de distinto color*' },
        S(),
        T('¿Vienes a casa conmigo?')
      ],
      []
    ] }
  ],
  adopcion: (fnFanfare) => [
    S(),
    T('Oye... ¿quieres ser mi amigo?'),
    { q: 'PERRO', t: '¡GUAU!', fn: () => { if (typeof guau === 'function') guau(1); } },
    { q: 'SIMON', t: '¡Sí!', fn: () => { if (typeof bocaT !== 'undefined') bocaT = 15; if (typeof gesto === 'function') gesto('salto'); if (typeof hablar === 'function') hablar(); } },
    T('¡Entonces te llamaré Sif!'),
    { q: 'SIF', t: '¡GUAU, GUAU!', fn: () => { if (typeof guau === 'function') guau(2); if (typeof corazones === 'function') corazones(6); } },
    { q: 'SIF', t: '', fan: { mudo: true, g: () => (typeof sifGrid === 'function' ? sifGrid({ boca: 'b', cola: 1 }) : null), t: 'SIF', d: 'NUEVA MASCOTA. EFECTO: JUGAR TE QUITA 10% MENOS DE ENERGÍA.' }, fn: fnFanfare },
    S(),
    T('Ahora tengo un perro. ¡Qué felicidad!'),
    T('Con Sif cerca, jugar me cansa un 10% menos.')
  ],
  cortexReaccionaSif: () => [
    C('Oye, Simon... ¿y ese perrito?'),
    C('Se parece muchísimo a un mejor amigo que tuve.'),
    C('Fue quien me salvó de la tristeza cuando más lo necesitaba.'),
    S(),
    T('Qué bonito, Cortex.'),
    C('Cuídalo mucho. Los amigos así no se encuentran todos los días.')
  ]
};

// ==========================================================================
// 12. EVENTOS SECRETOS (OVNI y nave espacial, Ojo de Cthulhu)
// ==========================================================================
const DIALOGOS_SECRETOS = {
  ovniSimonRecuerda: () => [
    S(),
    T('Yo llegué en algo así... hace mucho tiempo.'),
    T('Antes de conocer a Cortex.')
  ],
  cthulhuAcepta: () => [
    S(),
    T('Le encantó el keke... Entonces no puede ser malo.')
  ]
};
