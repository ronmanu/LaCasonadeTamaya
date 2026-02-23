import { Room, Activity, EnvironmentSection, MenuCategory } from './types';

export const BOOKING_URL = "https://www.booking.com/hotel/es/rural-la-casona-de-tamaya-tamajon.html?aid=1365032&label=hotel-rural-la-casona-de-tamaya-8940598&chal_t=1769424374398&force_referer=https%3A%2F%2Fhotelmania.net%2F#availability_target";
export const PHOTOS_URL = "https://photos.app.goo.gl/aDZb5LJTcp0UxtsXJ";

// Imagen principal actualizada: Estilo atardecer en porche de piedra (similar a caption.jpg)
export const HERO_IMAGE = "/images/hero.jpg";

export const HOTEL_CONDITIONS = {
  checkIn: "12:00 - 14:00",
  checkOut: "12:00 - 13:30",
  minAge: 18,
  pets: "No se admiten",
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
  "Guardaequipaje y parking de bicis"
];

export const ROOMS: Room[] = [
  {
    id: 'doble-matrimonio',
    name: 'Doble Rústica',
    description: 'Encanto tradicional con cabecero de madera maciza y vigas vistas. Decoración cálida en tonos ocres y rojizos con suelos de terracota.',
    price: 85,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1560185009-dddeb820c7b7?q=80&w=1000&auto=format&fit=crop',
    features: ['20 m²', 'Cama de Matrimonio', 'Vigas de Madera', 'Baño Privado', 'Vistas al Jardín']
  },
  {
    id: 'doble-twin',
    name: 'Doble Piedra (2 Camas)',
    description: 'Habitación luminosa caracterizada por sus hermosos zócalos de piedra natural en las paredes y decoración alegre.',
    price: 85,
    capacity: 2,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop',
    features: ['20 m²', '2 Camas Individuales', 'Paredes de Piedra', 'Escritorio', 'Mucha luz natural']
  },
  {
    id: 'triple-arte',
    name: 'Triple "El Mural"',
    description: 'Estancia única y especial decorada con murales artísticos pintados a mano que evocan la naturaleza y la fantasía. Ideal para familias.',
    price: 115,
    capacity: 3,
    image: 'https://images.unsplash.com/photo-1616486029423-aaa478965c96?q=80&w=1000&auto=format&fit=crop',
    features: ['1 Cama Doble + 1 Individual', 'Murales Artísticos', 'Ambiente Relajante', 'Baño Completo']
  },
  {
    id: 'cuadruple',
    name: 'Familiar La Casona',
    description: 'Nuestra estancia más amplia. Combina el encanto de la piedra vista con murales suaves y espacio para 4 personas.',
    price: 140,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1512918760532-3ad8386b8398?q=80&w=1000&auto=format&fit=crop',
    features: ['40 m²', '4 Camas', 'Zona de Estar', 'Gran Bañera', 'Ideal Grupos']
  }
];

// Deprecated for simple list, used for compact view. See ENVIRONMENT_INFO for detailed content.
export const ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Ciudad Encantada de Tamajón',
    description: 'Formaciones de piedra caliza moldeadas por el agua y el viento durante siglos. Un paseo mágico a pocos minutos del hotel.',
    image: 'https://picsum.photos/800/500?random=10',
    icon: 'history'
  },
  {
    id: 'act-2',
    title: 'Ruta de la Arquitectura Negra',
    description: 'Descubre los pueblos de pizarra negra: Campillo de Ranas, Majaelrayo y Valverde de los Arroyos.',
    image: 'https://picsum.photos/800/500?random=11',
    icon: 'mountain'
  },
  {
    id: 'act-3',
    title: 'Micología y Senderismo',
    description: 'Entorno ideal para piragüismo y senderismo. En otoño, zona privilegiada para la búsqueda de setas.',
    image: 'https://picsum.photos/800/500?random=12',
    icon: 'mushroom'
  }
];

export const ENVIRONMENT_INFO: EnvironmentSection[] = [
  {
    id: 'tamajon-pueblo',
    title: 'Tamajón: Historia y Piedra',
    subtitle: 'La Pequeña Ciudad Encantada',
    image: '/images/tamajon_ciudad_encantada.jpg', // Foto local de la Ciudad Encantada de Tamajón
    content: [
      "Tamajón no es solo un punto de paso, es un destino en sí mismo. Al norte del pueblo, la naturaleza ha esculpido durante milenios lo que conocemos como la 'Ciudad Encantada'. Un paisaje kárstico donde la piedra caliza cobra vida formando arcos, cuevas y figuras caprichosas entre sabinas centenarias. Es un paseo imprescindible y sencillo, perfecto para perderse y conectar con la quietud de 2026.",
      "Dentro del casco urbano, la historia nos habla a través de la Iglesia de la Asunción, cuyos orígenes románicos del siglo XIII se entrelazan con una magnífica arquitectura renacentista. La luz de la Sierra Norte baña sus muros de piedra dorada, creando un contraste único con las cubiertas de pizarra que anuncian la cercanía de los Pueblos Negros."
    ],
    details: [
      { label: 'Imprescindible', value: 'Ermita de los Enebrales' },
      { label: 'Distancia', value: 'A 1km del hotel' },
      { label: 'Dificultad', value: 'Paseo fácil' }
    ]
  },
  {
    id: 'arquitectura-negra',
    title: 'La Ruta de la Arquitectura Negra',
    subtitle: 'El alma de pizarra de Guadalajara',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop', // Slate village vibe
    content: [
      "Desde La Casona de Tamaya se abren las puertas a uno de los tesoros etnográficos más singulares de Europa. La Arquitectura Negra debe su nombre al uso masivo de la pizarra en muros y cubiertas, mimetizando las aldeas con el paisaje oscuro y abrupto de la sierra.",
      "La ruta serpentea hacia el norte. Campillo de Ranas, con su atmósfera casi mística; Majaelrayo, a los pies del pico Ocejón; y Valverde de los Arroyos, uno de los pueblos más bonitos de España, donde la pizarra se combina con cuarcita dorada. En 2026, estos pueblos mantienen intacta su esencia, ofreciendo un silencio y una estética que parecen detener el tiempo."
    ],
    details: [
      { label: 'Ruta Recomendada', value: 'Tamajón -> Campillo -> Majaelrayo' },
      { label: 'En coche', value: 'Recorrido panorámico de 40 min' }
    ]
  },
  {
    id: 'micologia',
    title: 'Paraíso Micológico',
    subtitle: 'Temporada 2025-2026',
    image: 'https://images.unsplash.com/photo-1604502759828-5777df506822?q=80&w=1200&auto=format&fit=crop', // Mushrooms
    content: [
      "Cuando las lluvias de otoño bañan la Sierra Norte, Tamajón se transforma. Nuestro suelo es uno de los más ricos de Castilla-La Mancha para la micología. Somos puerta de entrada a parques micológicos regulados donde el buscador respetuoso puede encontrar auténticos tesoros.",
      "Níscalos (Lactarius deliciosus) bajo los pinares y el preciado Boletus edulis en los robledales son los protagonistas de nuestras cestas. Para la temporada 2025-2026, recordamos la importancia de obtener el permiso diario (disponible online o en el pueblo) y de usar siempre cesta de mimbre para permitir que las esporas sigan sembrando el futuro de nuestros bosques."
    ],
    details: [
      { label: 'Temporada Alta', value: 'Octubre - Noviembre' },
      { label: 'Permiso', value: 'Obligatorio en zonas acotadas' },
      { label: 'Variedades', value: 'Níscalos, Boletus, Setas de Cardo' }
    ]
  },
  {
    id: 'naturaleza-hayedos',
    title: 'Hayedos y Cumbres',
    subtitle: 'El Ocejón y Tejera Negra',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop', // Forest/Nature
    content: [
      "Para los amantes del senderismo, el Pico Ocejón (2.048m) es el vigía constante de nuestra comarca. Su ascensión es un clásico que recompensa con vistas inigualables de toda la provincia.",
      "A poca distancia, la naturaleza estalla en color, especialmente en otoño. El Hayedo de Tejera Negra, Patrimonio de la Humanidad, ofrece una experiencia cromática inolvidable, aunque requiere reserva previa en temporada alta. Como alternativa más tranquila y cercana, el Hayedo de la Pedrosa en Riofrío de Riaza ofrece un espectáculo similar, íntimo y sobrecogedor."
    ],
    details: [
      { label: 'Pico Ocejón', value: 'Dificultad Media-Alta' },
      { label: 'Hayedo Tejera Negra', value: 'Reserva previa necesaria' }
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
    text: "La cercanía y atención de Rossana y Adrián de 10. Quizás el colchón, pero en general todo bien."
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
  // Habitaciones
  { src: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200", category: "Habitaciones", caption: "Habitación Doble con encanto" },
  { src: "https://images.unsplash.com/photo-1616486029423-aaa478965c96?q=80&w=1200", category: "Habitaciones", caption: "Murales artísticos pintados a mano" },
  { src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200", category: "Habitaciones", caption: "Habitación Twin luminosa" },

  // Jardín y Exteriores (Basado en fotos de rosas, cama elástica, fachada)
  { src: "https://images.unsplash.com/photo-1558293842-c0fd3db86157?q=80&w=1200", category: "Jardín", caption: "Jardines llenos de vida" },
  { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200", category: "Jardín", caption: "Zona de juegos y descanso" },
  { src: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1200", category: "Exteriores", caption: "Porche de piedra tradicional" },

  // Invierno (Basado en fotos de nieve)
  { src: "https://images.unsplash.com/photo-1483323326164-9b8449c25dbf?q=80&w=1200", category: "Invierno", caption: "La Casona bajo la nieve" },
  { src: "https://images.unsplash.com/photo-1518182170546-0766be6f5a56?q=80&w=1200", category: "Invierno", caption: "Tamajón en invierno" },

  // Entorno (Vistas y Paisaje)
  { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200", category: "Entorno", caption: "Vistas al Pico Ocejón" },
  { src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200", category: "Entorno", caption: "Atardecer en la Sierra Norte" },
  { src: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1200", category: "Exteriores", caption: "Atardecer en la terraza" }
];