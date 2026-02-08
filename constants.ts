import { Room, Activity, EnvironmentSection } from './types';

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
    image: 'https://images.unsplash.com/photo-1533036437199-a477373f15a6?q=80&w=1200&auto=format&fit=crop', // Landscape with rocks/history vibe
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

export const MENU_HIGHLIGHTS = [
  { name: 'Cabrito Asado de la Sierra', price: '22€', desc: 'Especialidad de la casa, cocinado en horno de leña.' },
  { name: 'Judiones de la Granja', price: '14€', desc: 'Plato de cuchara tradicional para recuperar fuerzas.' },
  { name: 'Menús Dietéticos', price: 'Consultar', desc: 'Preparamos menús para dietas especiales bajo petición.' },
  { name: 'Tarta de Queso con Miel', price: '6.50€', desc: 'Casera y cremosa con miel de la Alcarria.' }
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