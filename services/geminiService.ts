
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage, Phase } from '../types';
import { SOCRATIC_SYSTEM_PROMPT } from '../constants';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

function getAi() {
  if (!ai) {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

function getChat() {
    if (!chat) {
        const aiInstance = getAi();
        chat = aiInstance.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: SOCRATIC_SYSTEM_PROMPT,
            },
        });
    }
    return chat;
}


function formatHistoryForApi(history: ChatMessage[]) {
    // Gemini history expects alternating user/model roles.
    // Our 'ai' sender maps to 'model' role.
    return history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content.replace(/<[^>]*>?/gm, '') }] // Strip HTML for the model
    }));
}

export const getNextResponse = async (
  prompt: string,
  history: ChatMessage[],
  currentPhase: Phase,
  analysisData: Record<string, any>,
  uploadedFiles: string[]
): Promise<string> => {
  try {
    const fullPrompt = `
      CONTEXTO ACTUAL:
      - Fase del proceso: ${currentPhase}
      - Archivos subidos: ${uploadedFiles.length > 0 ? uploadedFiles.join(', ') : 'Ninguno'}
      - Datos recolectados hasta ahora: ${JSON.stringify(analysisData, null, 2)}
      
      ÚLTIMO MENSAJE DEL USUARIO:
      "${prompt}"

      INSTRUCCIÓN:
      Basado en el contexto y el último mensaje, genera la siguiente respuesta como el Asistente Socrático. Sigue las reglas de tu identidad y rol.
    `;
    
    const chatInstance = getChat();
    const result = await chatInstance.sendMessage({ message: fullPrompt });
    return result.text ?? "Lo siento, no he podido generar una respuesta en este momento.";
  } catch (error) {
    console.error("Gemini API error in getNextResponse:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
      return "Error de configuración: La clave de API de Gemini no está configurada. Por favor, contacte al administrador.";
    }
    return "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.";
  }
};