import { GoogleGenAI } from "@google/genai";
import { BOOKING_URL, HOTEL_CONDITIONS, ENVIRONMENT_INFO, RESTAURANT_MENU } from '../constants';

// Intentamos obtener la API Key, pero no fallamos si no existe
const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn("Error al inicializar Gemini, pasando a modo offline.");
  }
}

const TAMAJON_SYSTEM_PROMPT = `
Eres el conserje virtual experto de "La Casona de Tamaya", un hotel rural en Tamajón, Guadalajara, España.
Tu tono es amable, acogedor y conocedor. La dirección es C. Picota, 19222 Tamajón. Tel: 681 27 95 08.

INFORMACIÓN ACTUALIZADA:
- Check-in: ${HOTEL_CONDITIONS.checkIn}.
- Check-out: ${HOTEL_CONDITIONS.checkOut}.
- Mascotas: ${HOTEL_CONDITIONS.pets}.
- Desayuno/Comidas: Tenemos restaurante con carta completa de raciones, carnes y postres caseros.
- Platos destacados: Torreznos crujientes, Huevos rotos con jamón, tarta de queso casera.
- Entorno: Ciudad Encantada, Arquitectura Negra, Hayedo Tejera Negra.

Tus objetivos:
1. Ayudar con dudas de horarios, normas y servicios.
2. Promocionar el restaurante y habitaciones.
3. Si preguntan por reservas, diles que reserven directamente o en Booking: ${BOOKING_URL}

Responde de manera muy breve (máximo 50 palabras) y concisa.
`;

// --- MODO OFFLINE (BÚSQUEDA POR PALABRAS CLAVE) ---
// Esto funciona si el dueño no quiere pagar/configurar la API de Google
const getOfflineAnswer = (question: string): string => {
  const q = question.toLowerCase();

  if (q.includes('reserva') || q.includes('precio') || q.includes('disponib')) {
    return `Para consultar precios y disponibilidad exactos, por favor visita nuestro motor de reservas: ${BOOKING_URL}. O llámanos al 681 27 95 08.`;
  }

  if (q.includes('mascota') || q.includes('perro') || q.includes('gato') || q.includes('animal')) {
    return `Sobre las mascotas: ${HOTEL_CONDITIONS.pets}.`;
  }

  if (q.includes('hora') || q.includes('check') || q.includes('entrada') || q.includes('salida')) {
    return `El horario de Check-in es ${HOTEL_CONDITIONS.checkIn} y el de Check-out es ${HOTEL_CONDITIONS.checkOut}.`;
  }

  if (q.includes('comer') || q.includes('cena') || q.includes('desayuno') || q.includes('restaurante') || q.includes('menu')) {
    const plato = RESTAURANT_MENU[0].items[5].name; // Croquetas de Jamón
    return `¡Tenemos un restaurante fantástico! Te recomendamos probar las ${plato}. Tenemos una amplia carta de raciones, hamburguesas y tostas.`;
  }

  if (q.includes('coche') || q.includes('parking') || q.includes('aparca')) {
    return `El parking es ${HOTEL_CONDITIONS.parking}.`;
  }

  if (q.includes('ubicacion') || q.includes('llegar') || q.includes('donde esta')) {
    return "Estamos en C. Picota, 19222 Tamajón, Guadalajara. A 45km del Hayedo de Tejera Negra.";
  }

  if (q.includes('seta') || q.includes('hongo') || q.includes('niscalo') || q.includes('micolo')) {
    return "¡Estás en el lugar ideal! Tamajón es un paraíso micológico (Níscalos, Boletus). Recuerda que es necesario permiso en temporada.";
  }

  if (q.includes('sitio') || q.includes('ver') || q.includes('turismo') || q.includes('hacer')) {
    return "No te pierdas la Ciudad Encantada (a 1km) ni la ruta de los Pueblos de la Arquitectura Negra. ¡Es precioso!";
  }

  return "Soy un asistente virtual básico. Para esa consulta específica, te recomiendo llamar a recepción al 681 27 95 08.";
};

export const askConcierge = async (question: string): Promise<string> => {
  // 1. Si tenemos API Key, usamos la IA real
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Modelo rápido y económico
        contents: question,
        config: {
          systemInstruction: TAMAJON_SYSTEM_PROMPT,
          maxOutputTokens: 150, // Limitar longitud para ahorrar costes
        }
      });
      return response.text || getOfflineAnswer(question);
    } catch (error) {
      console.error("Gemini API Error, falling back to offline mode:", error);
      return getOfflineAnswer(question);
    }
  }

  // 2. Si NO tenemos API Key, usamos el modo offline gratuito
  // Simulamos un pequeño retraso para que parezca que "piensa"
  await new Promise(resolve => setTimeout(resolve, 600));
  return getOfflineAnswer(question);
};