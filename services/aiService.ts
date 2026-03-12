/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";

// CLAVES - Recuperadas de variables de entorno (Vite)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

let knowledgeBaseCache: string | null = null;

async function getKnowledgeBase() {
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
 * CONSULTA A GROQ (Backup)
 * Se usa si Gemini falla. Groq es extremadamente rápido y tiene un tier gratuito excelente.
 */
async function askGroq(question: string, knowledge: string) {
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

export async function askHotelAI(question: string) {
  let knowledge = "";
  try {
    knowledge = await getKnowledgeBase();
    knowledge = knowledge.substring(0, 12000); 
  } catch (e) {
    knowledge = "Información básica: Hotel Rural en Tamajón, Ángel y Yoli.";
  }

  console.log("Iniciando consulta IA para:", question);

  // INTENTO 1: Gemini 1.5 Flash
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Contexto: ${knowledge}\n\nPregunta: ${question}\nResponde de forma amable.`);
    return result.response.text();
  } catch (geminiError: any) {
    console.warn("Gemini falló, intentando backup Groq...", geminiError.message);

    // INTENTO 2: Groq (El salvavidas)
    try {
        if (GROQ_API_KEY && GROQ_API_KEY.startsWith("gsk_")) {
            console.log("Saltando a Groq para asegurar respuesta...");
            return await askGroq(question, knowledge);
        }
    } catch (groqError: any) {
        console.error("ERROR GROQ:", groqError.message);
    }

    // INTENTO 3: Gemini estable (Último recurso)
    try {
        const modelStable = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const resultStable = await modelStable.generateContent(`Hotel: La Casona de Tamaya. Pregunta: ${question}`);
        return resultStable.response.text();
    } catch (e) {}

    return "Lo sentimos mucho, pero Ángel y Yoli están actualizando mi sistema ahora mismo. 🔧\n\nPor favor, pregúntanos directamente en recepción o llámanos al +34 681 279 508.";
  }
}
