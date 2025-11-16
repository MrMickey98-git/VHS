
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A check to ensure the API key is available.
  // In a real deployed environment, this would be set.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateVHSTitle(prompt: string): Promise<string> {
  if (!API_KEY) {
    return `A Film About: ${prompt}`;
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a creative, cheesy, retro VHS tape title for a video about: "${prompt}". The year is 1988. The title should be short and punchy. Respond with ONLY the title itself, without any quotation marks, labels, or extra text.`,
    });
    
    const title = response.text.trim().replace(/"/g, ''); // Clean up potential quotes
    return title || `Adventures in ${prompt}`; // Fallback title
  } catch (error) {
    console.error("Error generating title with Gemini:", error);
    // Provide a fallback title on error
    return `Retro Memories: ${prompt}`;
  }
}
