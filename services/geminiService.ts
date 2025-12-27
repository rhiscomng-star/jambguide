
import { GoogleGenAI } from "@google/genai";

/**
 * Fetches advice regarding JAMB registration using Gemini AI.
 * Follows @google/genai best practices for initialization and content generation.
 */
export const getJambAdvice = async (userQuery: string) => {
  try {
    // Correct initialization using named parameter and process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: "You are an expert JAMB (Joint Admissions and Matriculation Board) consultant for Nigerian students. You provide detailed steps, deadline warnings, and clarify requirements for NIN, profile codes, and CBT centers. Provide a helpful, encouraging, and accurate answer regarding JAMB 2026 registration procedures in Nigeria. Keep the tone professional and supportive."
      }
    });
    // Use the .text property to access extracted text content
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the guide database. Please check your internet connection.";
  }
};
