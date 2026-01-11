
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, Flashcard } from "../types";

// Always initialize with direct process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeContent = async (text: string, imageData?: string): Promise<string> => {
  const parts = [];
  if (imageData) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageData.split(',')[1] || imageData
      }
    });
  }
  parts.push({ text: `Please provide a concise, bulleted summary of the following study material. Focus on key concepts and definitions: \n\n${text}` });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
  });

  return response.text || "Failed to generate summary.";
};

export const generateQuiz = async (context: string): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following study context, generate 5 multiple choice questions. Return ONLY a valid JSON array of objects with keys: question, options (array of 4 strings), correctAnswer (matching one of the options), and explanation. \n\nContext: ${context}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
};

export const generateFlashcards = async (context: string): Promise<Flashcard[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following context, generate 6 study flashcards. Return ONLY a valid JSON array of objects with keys: front, back. \n\nContext: ${context}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
          },
          required: ["front", "back"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse flashcards JSON", e);
    return [];
  }
};

export const chatWithTutor = async (history: { role: 'user' | 'model'; text: string }[], message: string, context: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
    config: {
      systemInstruction: `You are Studiq AI, a friendly and helpful study tutor. Use the provided context to answer questions. If the user asks something outside the context, answer generally but try to relate it back to study techniques. Context: ${context}`
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
