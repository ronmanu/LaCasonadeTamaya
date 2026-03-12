/**
 * @fileoverview Servicio de IA para el Chat del Huésped.
 *
 * Implementa una estrategia de fallback en cascada para garantizar
 * que el chat siempre responda, incluso si un proveedor falla:
 *   1. Google Gemini 1.5 Flash (principal)
 *   2. Groq / Llama 3.3 70B (backup rápido)
 *   3. Google Gemini 1.0 Pro (último recurso)
 *   4. Mensaje estático con teléfono de contacto
 *
 * La base de conocimiento se carga una sola vez desde /hotel_knowledge.md
 * y se cachea en memoria para evitar peticiones repetidas.
 *
 * NOTA DE SEGURIDAD: Las claves de API se exponen al cliente a través
 * del prefijo VITE_. En producción, deberían migrar a Edge Functions
 * para que las claves nunca abandonen el servidor.
 *
 * @module services/aiService
 */

/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Configuración de API Keys ────────────────────────────────
// Se recuperan de las variables de entorno de Vite (.env).
// Si no están definidas, se usa string vacío (evita crashes al inicializar).
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/** Cache en memoria de la base de conocimiento del hotel */
let knowledgeBaseCache: string | null = null;

/**
 * Carga y cachea la base de conocimiento del hotel desde un archivo Markdown.
 *
 * El archivo `hotel_knowledge.md` contiene información sobre habitaciones,
 * servicios, precios, rutas turísticas, etc. Se carga una única vez y se
 * reutiliza en todas las consultas de la sesión del usuario.
 *
 * @returns {Promise<string>} El contenido del archivo de conocimiento,
 *   o un fallback mínimo si no se puede cargar.
 */
async function getKnowledgeBase(): Promise<string> {
  if (knowledgeBaseCache) return knowledgeBaseCache;
  try {
    const response = await fetch('/hotel_knowledge.md');
    if (!response.ok) throw new Error("No se pudo cargar el archivo MD");
    const text = await response.text();
    knowledgeBaseCache = text;
    return text;
  } catch (error) {
    console.error("Error cargando la base de conocimientos:", error);
    return "La Casona de Tamaya es un hotel en Tamajón regentado por Ángel y Yoli.";
  }
}

/**
 * Realiza una consulta a la API de Groq usando el modelo Llama 3.3 70B.
 *
 * Se usa como fallback cuando Gemini no está disponible (errores 404,
 * cuota agotada, etc.). Groq ofrece latencias muy bajas (~200ms).
 *
 * @param {string} question - La pregunta del huésped
 * @param {string} knowledge - Contexto del hotel para dar respuestas precisas
 * @returns {Promise<string>} La respuesta generada por el modelo
 * @throws {Error} Si GROQ_API_KEY no está configurada o la API devuelve error
 */
async function askGroq(question: string, knowledge: string): Promise<string> {
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY no configurada");

  const systemPrompt = `Eres el asistente de "La Casona de Tamaya". Anfitriones: Ángel y Yoli. 
  CONOCIMIENTO: ${knowledge}
  Reglas: Responde siempre en español, tono amable y rural.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.6
    })
  });

  if (!response.ok) {
    const errorDetail = await response.json().catch(() => ({}));
    console.error("DETALLE ERROR GROQ:", errorDetail);
    throw new Error(`Groq API Error: ${response.status} - ${JSON.stringify(errorDetail)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Punto de entrada principal del servicio de IA.
 *
 * Recibe una pregunta del huésped y devuelve una respuesta contextualizada
 * sobre el hotel, sus servicios, la zona, etc.
 *
 * Estrategia de fallback:
 * 1. Gemini 1.5 Flash → rápido y moderno
 * 2. Groq (Llama 3.3) → backup fiable si Gemini falla
 * 3. Gemini 1.0 Pro → última opción automatizada
 * 4. Mensaje estático → si todo falla, ofrece contacto directo
 *
 * @param {string} question - La pregunta formulada por el huésped
 * @returns {Promise<string>} Respuesta en español, tono amable
 *
 * @example
 * const respuesta = await askHotelAI("¿Qué rutas hay cerca?");
 * // → "¡Hola! Tenéis varias rutas preciosas cerca del hotel..."
 */
export async function askHotelAI(question: string): Promise<string> {
  // Cargar la base de conocimiento (cacheada tras la primera carga)
  let knowledge = "";
  try {
    knowledge = await getKnowledgeBase();
    // Limitamos a 12.000 caracteres para no exceder el contexto de los modelos
    knowledge = knowledge.substring(0, 12000);
  } catch (e) {
    knowledge = "Información básica: Hotel Rural en Tamajón, Ángel y Yoli.";
  }

  console.log("Iniciando consulta IA para:", question);

  // ─── INTENTO 1: Gemini 1.5 Flash ───────────────────
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Contexto: ${knowledge}\n\nPregunta: ${question}\nResponde de forma amable.`);
    return result.response.text();
  } catch (geminiError: any) {
    console.warn("Gemini falló, intentando backup Groq...", geminiError.message);

    // ─── INTENTO 2: Groq / Llama 3.3 70B ──────────────
    try {
        if (GROQ_API_KEY && GROQ_API_KEY.startsWith("gsk_")) {
            console.log("Saltando a Groq para asegurar respuesta...");
            return await askGroq(question, knowledge);
        }
    } catch (groqError: any) {
        console.error("ERROR GROQ:", groqError.message);
    }

    // ─── INTENTO 3: Gemini 1.0 Pro (estable) ──────────
    try {
        const modelStable = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const resultStable = await modelStable.generateContent(`Hotel: La Casona de Tamaya. Pregunta: ${question}`);
        return resultStable.response.text();
    } catch (e) {}

    // ─── INTENTO 4: Mensaje estático de emergencia ────
    return "Lo sentimos mucho, pero Ángel y Yoli están actualizando mi sistema ahora mismo. 🔧\n\nPor favor, pregúntanos directamente en recepción o llámanos al +34 681 279 508.";
  }
}
