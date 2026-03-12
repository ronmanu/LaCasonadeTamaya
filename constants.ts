import { Room, Activity, EnvironmentSection, MenuCategory } from './types';

export const BOOKING_URL = "https://www.booking.com/hotel/es/rural-la-casona-de-tamaya-tamajon.html?aid=1365032&label=hotel-rural-la-casona-de-tamaya-8940598&chal_t=1769424374398&force_referer=https%3A%2F%2Fhotelmania.net%2F#availability_target";
export const PHOTOS_URL = "https://photos.app.goo.gl/aDZb5LJTcp0UxtsXJ";

// Imagen principal actualizada: Estilo atardecer en porche de piedra (similar a caption.webp)
export const HERO_IMAGE = "/images/hero.webp";

export const HOTEL_CONDITIONS = {
  checkIn: "14:00 - 15:00",
  checkOut: "12:00 - 13:00",
  minAge: 18,
  pets: "Sí se aceptan",
  smoking: "Prohibido fumar en todo el establecimiento",
  parking: "Privado y Gratuito (no es necesario reservar)",
  accessibility: "Acceso a pisos superiores solo mediante escaleras"
};

export const HOTEL_SERVICES = [
  "WiFi Gratuito (8.5 puntuación)",
  "Parking privado gratis",
  "Aire acondicionado / Calefacción",
  "Jardín y Terraza amueblada",
  "Menús dietéticos (bajo petición)",
  "Habitaciones familiares",
  "Guardaequipaje y parking de bicis",
  "Televisión en habitaciones"
];

export const ROOMS: Room[] = [
  {
    id: 'hab-1',
    name: 'Habitación 1 - Doble "Azul y Sol"',
    description: 'Encanto rústico con paredes amarillas y un mural artístico que evoca la luz y el cielo.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_1.webp',
    features: ['Matrimonio', 'Decoración rústica', 'Mural artístico', 'Baño Privado']
  },
  {
    id: 'hab-2',
    name: 'Habitación 2 - Doble Rústica',
    description: 'Nuestra habitación más emblemática, con mural de flores amarillas sobre fondo azul cielo.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_2.webp',
    features: ['Matrimonio', 'Techo de Madera', 'Flores Silvestres', 'Terrazo/Terracota']
  },
  {
    id: 'hab-3',
    name: 'Habitación 3 - Doble "El Árbol"',
    description: 'Ambiente sereno en tonos neutros presidido por una obra que representa la sabiduría de la naturaleza.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_3.webp',
    features: ['Matrimonio', 'Ambiente Sereno', 'Vistas Exterior', 'Malla Wi-Fi']
  },
  {
    id: 'hab-4',
    name: 'Habitación 4 - Doble "Danza"',
    description: 'Decoración vibrante con murales de suaves figuras danzantes en tonos turquesa y tierra.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_4.webp',
    features: ['Matrimonio', 'Paredes Turquesa', 'Mural Artístico', 'Confort Rústico']
  },
  {
    id: 'hab-5',
    name: 'Habitación 5 - Doble Piedra (2 Camas)',
    description: 'La esencia de la montaña con paredes que combinan la calidez de la pintura y la solidez de la piedra.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_5.webp',
    features: ['2 Camas Individuales', 'Detalle en Piedra', 'Mural de Amapolas', 'Escritorio rústico']
  },
  {
    id: 'hab-6',
    name: 'Habitación 6 - Doble "La Luna"',
    description: 'Estancia íntima con un mural onírico de una figura bajo la luna en tonos rosa y cereza.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_6.webp',
    features: ['Matrimonio', 'Mural Onírico', 'Iluminación Cálida', 'Cama de Hierro/Madera']
  },
  {
    id: 'hab-7',
    name: 'Habitación 7 - Doble "Las Ninfas"',
    description: 'Murales que fluyen entre figuras y naturaleza en una estancia con dos camas individuales.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_7.webp',
    features: ['2 Camas Individuales', 'Mural de Figuras', 'Decoración Natural', 'Baño Completo']
  },
  {
    id: 'hab-8',
    name: 'Habitación 8 - Doble Rústica (2 Camas)',
    description: 'Sencillez y confort rústico con mobiliario de madera tradicional y ambiente acogedor.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_8.webp',
    features: ['2 Camas Individuales', 'Estilo Tradicional', 'Mucha Luz', 'Ideal Parejas/Amigos']
  },
  {
    id: 'hab-9',
    name: 'Habitación 9 - Doble "Damas del Campo"',
    description: 'Habitación con dos camas individuales y un gran mural que representa figuras en el campo.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_9.webp',
    features: ['2 Camas Individuales', 'Mural Gran Formato', 'Vigas a la Vista', 'Televisión']
  },
  {
    id: 'hab-10',
    name: 'Habitación 10 - Doble Rústica "Botánica"',
    description: 'Amplia y luminosa, con dos camas individuales y decoración inspirada en la flora local.',
    price: 85,
    capacity: 2,
    image: '/images/habitacion_10.webp',
    features: ['2 Camas Individuales', 'Techo de Madera', 'Toallas Incluidas', 'Suelos de Barro']
  },
  {
    id: 'hab-11',
    name: 'Habitación 11 - Familiar "La Casona"',
    description: 'Nuestra suite más espaciosa, ideal para familias o grupos pequeños con gran capacidad.',
    price: 140,
    capacity: 4,
    image: '/images/habitacion_11.webp',
    features: ['Cama Matrimonio + 2 Indiv.', 'Espacio Extra', 'Ideal Familias', 'Vistas de Ensueño']
  }
];

// Deprecated for simple list, used for compact view. See ENVIRONMENT_INFO for detailed content.
export const ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Ciudad Encantada de Tamajón',
    description: 'Formaciones de piedra caliza moldeadas por el agua y el viento durante siglos. Un paseo mágico a pocos minutos del hotel.',
    image: '/images/tamajon_ciudad_encantada.webp',
    icon: 'history'
  },
  {
    id: 'act-2',
    title: 'Ruta de la Arquitectura Negra',
    description: 'Descubre los pueblos de pizarra negra: Campillo de Ranas, Majaelrayo y Valverde de los Arroyos.',
    image: '/images/pueblo_negro.webp',
    icon: 'mountain'
  },
  {
    id: 'act-3',
    title: 'Micología y Senderismo',
    description: 'Entorno ideal para piragüismo y senderismo. En otoño, zona privilegiada para la búsqueda de setas.',
    image: '/images/setas_entorno.webp',
    icon: 'mushroom'
  }
];

export const ENVIRONMENT_INFO: EnvironmentSection[] = [
  {
    id: 'tamajon-pueblo',
    title: 'Tamajón: Historia y Piedra',
    subtitle: 'La Pequeña Ciudad Encantada',
    image: '/images/tamajon_ciudad_encantada.webp',
    category: 'culture',
    duration: '1-2 horas',
    content: [
      "Tamajón no es solo un punto de paso, es un destino en sí mismo. Al norte del pueblo, la naturaleza ha esculpido durante milenios lo que conocemos como la 'Ciudad Encantada'. Un paisaje kárstico donde la piedra caliza cobra vida formando arcos, cuevas y figuras caprichosas entre sabinas centenarias.",
      "Dentro del casco urbano, la historia nos habla a través de la Iglesia de la Asunción, cuyos orígenes románicos del siglo XIII se entrelazan con una magnífica arquitectura renacentista. La luz de la Sierra Norte baña sus muros de piedra dorada, creando un contraste único."
    ],
    details: [
      { label: 'Imprescindible', value: 'Ermita de los Enebrales' },
      { label: 'Distancia', value: 'A 1km del hotel' },
      { label: 'Dificultad', value: 'Paseo fácil' }
    ]
  },
  {
    id: 'ermita-atardecer',
    title: 'Nuestro Rincón Favorito',
    subtitle: 'Atardecer en la Ermita',
    image: '/images/ermita.webp',
    category: 'nature',
    isRecommended: true,
    duration: '45 min',
    content: [
      "Si nos pides una sola recomendación, es esta: camina hasta la Ermita de los Enebrales al caer la tarde. Es el lugar donde el silencio de la sierra se hace más profundo y la luz del atardecer tiñe la piedra de un naranja irreal.",
      "Es un paseo llano y sencillo de apenas 15 minutos desde el hotel, ideal para despejar la mente antes de la cena y disfrutar de una de las mejores panorámicas de la zona bajo la sombra de sabinas milenarias."
    ],
    details: [
      { label: 'Experiencia', value: 'Mágica y Tranquila' },
      { label: 'Momento', value: 'Puesta de sol' },
      { label: 'Recomendado', value: 'Por Ángel y Yoli' }
    ]
  },
  {
    id: 'arquitectura-negra',
    title: 'Ruta de la Arquitectura Negra',
    subtitle: 'El alma de pizarra de Guadalajara',
    image: '/images/pueblo_negro.webp',
    category: 'culture',
    isRecommended: true,
    duration: 'Día completo',
    content: [
      "Un recorrido por los pueblos de pizarra que parecen fundirse con la montaña. Campillo de Ranas, Majaelrayo y Valverde de los Arroyos son paradas obligatorias para entender la vida en la sierra.",
      "La ruta desde Tamajón ofrece paisajes cambiantes, desde los robledales hasta los picos de pizarra. Es un viaje al pasado a través de construcciones únicas en España, donde cada piedra cuenta una historia de resistencia y adaptación."
    ],
    details: [
      { label: 'Ruta Especial', value: 'Tamajón -> Campillo -> Valverde' },
      { label: 'En coche', value: '45 min de trayecto' },
      { label: 'Consejo', value: 'Llevar cámara y calzado cómodo' }
    ]
  },
  {
    id: 'cascada-aljibe',
    title: 'Aventura Natural',
    subtitle: 'Pozas del Aljibe',
    image: '/images/paisaje_nevado.webp',
    category: 'adventure',
    duration: '3-4 horas',
    content: [
      "Para los que buscan algo más de acción, la ruta a las Pozas del Aljibe es espectacular. Se trata de una doble cascada de agua cristalina que forma dos grandes charcas naturales en un entorno salvaje.",
      "Es una ruta de senderismo de dificultad media que recompensa con uno de los saltos de agua más bellos de la provincia de Guadalajara. Perfecta para amantes de la fotografía de naturaleza y el aire puro."
    ],
    details: [
      { label: 'Tipo', value: 'Senderismo / Naturaleza' },
      { label: 'Distancia', value: '8km ida y vuelta' },
      { label: 'Agua', value: 'Cristalina y Helada' }
    ]
  },
  {
    id: 'micologia',
    title: 'Paraíso Micológico',
    subtitle: 'Níscalos y Boletus',
    image: '/images/setas_entorno.webp',
    category: 'nature',
    duration: 'Toda la mañana',
    content: [
      "Tamajón es la puerta de entrada a uno de los parques micológicos más ricos de Castilla-La Mancha. Níscalos en los pinares y Boletus en los robledales son el tesoro que muchos buscan en otoño.",
      "Recordamos siempre la importancia de recolectar con respeto, usando cesta de mimbre para soltar esporas y obteniendo el permiso necesario en el pueblo."
    ],
    details: [
      { label: 'Temporada', value: 'Octubre - Noviembre' },
      { label: 'Variedades', value: 'Níscalos, Boletus, Setas de Cardo' }
    ]
  }
];

export const RESTAURANT_MENU: MenuCategory[] = [
  {
    title: "Raciones y Tapas",
    items: [
      { name: "Finger de Pollo", price: "9.50€", desc: "Tiras de pollo crujiente con salsa miel y mostaza." },
      { name: "Alitas de pollo", price: "8.50€", desc: "Alitas de pollo marinadas y fritas al estilo tradicional." },
      { name: "Patatas Bravas", price: "7.00€", desc: "Con nuestra salsa brava casera picante." },
      { name: "Patatas dos salsas", price: "7.50€", desc: "Bravas y alioli suave." },
      { name: "Huevos rotos con Jamón", price: "12.00€", desc: "Patatas artesanas, huevos de corral y jamón ibérico." },
      { name: "Croquetas de Jamón", price: "10.00€", desc: "Ración de 8 unidades de pura cremosidad casera." },
      { name: "Morcilla", price: "9.00€", desc: "De Burgos, a la plancha con pimientos." },
      { name: "Calamares", price: "11.00€", desc: "A la romana con un toque de limón." },
      { name: "Tabla de Quesos", price: "16.00€", desc: "Variedad de quesos de la zona y nacionales." },
      { name: "Ración de Jamón", price: "18.00€", desc: "Jamón ibérico de cebo de campo cortado al momento." },
      { name: "Torreznos", price: "8.00€", desc: "De Soria, extra crujientes." },
      { name: "Callos", price: "11.00€", desc: "Receta tradicional de la sierra." },
      { name: "Tortilla de patata", price: "8.50€", desc: "Hecha al momento, con o sin cebolla." },
      { name: "Ensaladilla Rusa", price: "8.00€", desc: "Clásica con ventresca de atún." },
      { name: "Pimientos de Padrón", price: "7.50€", desc: "Unos pican y otros no." },
      { name: "Chopitos o Rabas", price: "11.50€", desc: "Fritura andaluza de calidad." },
      { name: "Oreja a la plancha", price: "9.50€", desc: "Con un toque de ajo y perejil." }
    ]
  },
  {
    title: "Ensaladas",
    items: [
      { name: "Ensalada Mixta tradicional", price: "9.00€", desc: "Lechuga, tomate, cebolla, huevo, atún y aceitunas." },
      { name: "Ensalada César con pollo y picatostes", price: "11.50€", desc: "Con nuestra salsa César especial." },
      { name: "Tomate de temporada con ventresca", price: "13.00€", desc: "Tomates de la zona con ventresca de calidad." }
    ]
  },
  {
    title: "Hamburguesas",
    items: [
      { name: "De la casa", price: "13.50€", desc: "Ternera, huevo frito, bacon, queso, cebolla y lechuga." },
      { name: "Clásica", price: "11.00€", desc: "Ternera, queso cheddar, lechuga y tomate." },
      { name: "De Pollo Crujiente", price: "11.50€", desc: "Pollo empanado, queso, lechuga y mayonesa." },
      { name: "Vegana / Vegetariana", price: "12.50€", desc: "Hamburguesa vegetal con aguacate y brotes tiernos." }
    ]
  },
  {
    title: "Sándwiches",
    items: [
      { name: "Vegetal", price: "7.50€", desc: "Lechuga, tomate, huevo, espárragos y mayonesa." },
      { name: "Mixto", price: "5.50€", desc: "Jamón york y queso fundido." },
      { name: "Mixto con Huevo", price: "6.50€", desc: "El clásico con huevo a la plancha." },
      { name: "Sándwich Club", price: "12.00€", desc: "Tres pisos con pollo, bacon, queso, lechuga y tomate." },
      { name: "Sándwich Cubano", price: "11.50€", desc: "Cerdo asado, jamón, queso, mostaza y pepinillo." }
    ]
  },
  {
    title: "Tostas",
    items: [
      { name: "Solomillo Brie", price: "9.50€", desc: "Solomillo de cerdo con queso brie fundido." },
      { name: "Solomillo Cabrales", price: "9.50€", desc: "Para los amantes del queso fuerte." },
      { name: "Salmón y Queso Philadelphia", price: "9.00€", desc: "Un clásico ligero y sabroso." },
      { name: "Queso de cabra con cebolla caramelizada", price: "8.50€", desc: "Con un toque de reducción de módena." },
      { name: "Jamón ibérico con tomate triturado", price: "10.00€" },
      { name: "Gulas con gambas al ajillo", price: "9.50€" }
    ]
  },
  {
    title: "Postres",
    items: [
      { name: "Tarta de Queso casera", price: "6.50€", desc: "Nuestra famosa tarta horneada." },
      { name: "Tarta de Chocolate", price: "6.00€" },
      { name: "Flan de huevo", price: "5.00€", desc: "Receta de la abuela." },
      { name: "Helados variados", price: "4.50€" }
    ]
  }
];

export const REVIEWS = [
  {
    author: "Rocio",
    date: "Enero 2025",
    score: 9.0,
    text: "La cercanía y atención de Ángel y Yoli de 10. Se nota que Ángel es del pueblo de toda la vida. Fantástico."
  },
  {
    author: "Juan",
    date: "Enero 2026",
    score: 9.0,
    text: "Habitaciones limpias y sitio para guardar las bicis. Fantástico."
  },
  {
    author: "Stefi",
    date: "Diciembre 2024",
    score: 9.0,
    text: "La ubicación es muy buena para hacer la ruta de los Pueblos. Es tranquilo y el servicio muy atento y amable."
  },
  {
    author: "Ivan",
    date: "Julio 2025",
    score: 9.0,
    text: "La tranquilidad y la comodidad de la cama."
  }
];

export const GALLERY_IMAGES = [
  // Habitaciones - Fotos reales
  { src: "/images/habitacion_1.webp", category: "Habitaciones", caption: "Habitación 1 - Doble \"Azul y Sol\"" },
  { src: "/images/habitacion_2.webp", category: "Habitaciones", caption: "Habitación 2 - Doble Rústica" },
  { src: "/images/habitacion_3.webp", category: "Habitaciones", caption: "Habitación 3 - Doble Matrimonio - \"El Árbol\"" },
  { src: "/images/habitacion_4.webp", category: "Habitaciones", caption: "Habitación 4 - Doble Matrimonio - \"Danza\"" },
  { src: "/images/habitacion_5.webp", category: "Habitaciones", caption: "Habitación 5 - Doble Piedra (2 Camas)" },
  { src: "/images/habitacion_6.webp", category: "Habitaciones", caption: "Habitación 6 - Doble \"La Luna\"" },
  { src: "/images/habitacion_7.webp", category: "Habitaciones", caption: "Habitación 7 - Doble \"Las Ninfas\" (2 Camas)" },
  { src: "/images/habitacion_8.webp", category: "Habitaciones", caption: "Habitación 8 - Doble Rústica (2 Camas)" },
  { src: "/images/habitacion_9.webp", category: "Habitaciones", caption: "Habitación 9 - Doble \"Damas del Campo\"" },
  { src: "/images/habitacion_10.webp", category: "Habitaciones", caption: "Habitación 10 - Doble Rústica \"Botánica\"" },
  { src: "/images/habitacion_11.webp", category: "Habitaciones", caption: "Habitación 11 - Familiar \"La Casona\"" },

  // Jardín - Fotos reales
  { src: "/images/jardin_rosas.webp", category: "Jardín", caption: "Jardín de rosas de La Casona" },
  { src: "/images/ext_galeria_1.webp", category: "Jardín", caption: "Vistas del jardín de La Casona" },
  { src: "/images/ext_galeria_2.webp", category: "Jardín", caption: "Rincones del jardín" },
  { src: "/images/ext_galeria_3.webp", category: "Jardín", caption: "Fachada desde el jardín" },
  { src: "/images/ext_galeria_4.webp", category: "Jardín", caption: "Terraza del jardín" },
  { src: "/images/ext_galeria_5.webp", category: "Jardín", caption: "Espacios exteriores ajardinados" },
  { src: "/images/terraza_atardecer.webp", category: "Jardín", caption: "Atardecer en la terraza del jardín" },

  // Restaurante e Interiores - Fotos reales
  { src: "/images/barra_bar.webp", category: "Restaurante", caption: "Barra del bar con encanto rústico" },
  { src: "/images/salon_principal.webp", category: "Restaurante", caption: "Comedor principal con manteles de cuadros" },
  { src: "/images/salon_principal_2.webp", category: "Restaurante", caption: "Vista del salón comedor" },
  { src: "/images/salon_privado.webp", category: "Restaurante", caption: "Salón privado para 10 personas" },
  { src: "/images/recibidor.webp", category: "Interiores", caption: "Recibidor con decoración tradicional" },
  { src: "/images/recibidor_2.webp", category: "Interiores", caption: "Hall de entrada" },
  { src: "/images/pasillo.webp", category: "Interiores", caption: "Pasillo con vigas de madera" },
  { src: "/images/cuarto_estar.webp", category: "Interiores", caption: "Cuarto de estar" },

  // Invierno - Fotos Reales
  { src: "/images/casona_nieve.webp", category: "Invierno", caption: "La Casona bajo la nieve" },
  { src: "/images/tamajon_invierno.webp", category: "Invierno", caption: "Tamajón en invierno" },
  { src: "/images/tamajon_iglesia_nieve.webp", category: "Invierno", caption: "Iglesia de Tamajón nevada" },
  { src: "/images/paisaje_nevado.webp", category: "Invierno", caption: "Paisaje nevado en los alrededores" },
  { src: "/images/ermita_nieve.webp", category: "Invierno", caption: "Ermita de los Enebrales en invierno" },

  // Entorno
  { src: "/images/tamajon_iglesia.webp", category: "Exteriores", caption: "Iglesia de la Asunción de Tamajón" },
  { src: "/images/ermita.webp", category: "Exteriores", caption: "Ermita de los Enebrales" },
  { src: "/images/Alojamiento-rural-El-Carabo-en-Valverde-de-los-Arroyos-Ruta-de-los-pueblos-negros-de-Guadalajara-min.webp", category: "Exteriores", caption: "Arquitectura tradicional en Valverde de los Arroyos" },
  { src: "/images/arquitectura_negra.webp", category: "Exteriores", caption: "Detalle de arquitectura negra" },
  { src: "/images/Camino-a-la-Chorrera-en-Valverde-de-los-Arroyos-en-Ruta-de-los-pueblos-negros-de-Guadalajara-min.webp", category: "Exteriores", caption: "Camino a la Chorrera de Despeñalagua" },
  { src: "/images/Campillejo-Ruta-de-los-pueblos-negros-de-Guadalajra-min.webp", category: "Exteriores", caption: "Pueblo de Campillejo" },
  { src: "/images/Cesta-floral-con-el-contraste-de-la-pizarra-negra-Ruta-de-los-pueblos-negros-de-Guadalajara-min.webp", category: "Exteriores", caption: "Contrastes cromáticos en la pizarra" },
  { src: "/images/cipat-tamajon.jpg.webp", category: "Exteriores", caption: "CIPAT Tamajón" },
  { src: "/images/Hayedo-de-Tejera-Negra-Ruta-pueblos-negros-de-Guadalajara-min.webp", category: "Exteriores", caption: "Hayedo de Tejera Negra" },
  { src: "/images/iglesia-asuncion-tamajon.jpg.webp", category: "Exteriores", caption: "Iglesia de la Asunción" },
  { src: "/images/Iglesia-de-Campillejo-Ruta-de-los-pueblos-negros-de-Guadalajra-min.webp", category: "Exteriores", caption: "Iglesia de Campillejo" },
  { src: "/images/palacio-mendoza-tamajon.jpg.webp", category: "Exteriores", caption: "Palacio de los Mendoza, Tamajón" },
  { src: "/images/Plaza-Central-de-Majaelrayo-Ruta-de-los-pueblos-negros-de-Guadalajara-min.webp", category: "Exteriores", caption: "Plaza de Majaelrayo" },
  { src: "/images/Plaza-central-de-Valverde-de-los-Arroyos-Ruta-de-los-pueblos-negros-de-Guadalajara-min.webp", category: "Exteriores", caption: "Plaza de Valverde de los Arroyos" },
  { src: "/images/Plaza-del-reloj-solar-de-Campillo-de-Ranas-Ruta-de-los-pueblos-negros-de-Guadalajara-min.webp", category: "Exteriores", caption: "Plaza del Reloj Solar, Campillo de Ranas" }
];
