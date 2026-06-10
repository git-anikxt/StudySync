import { GoogleGenAI } from "@google/genai";

export const generateSummary = async (
  notes: string
) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Summarize these study notes in concise bullet points:

${notes}
`,
  });

  return response.text;
};

export const generateFlashcards = async (
  notes: string
) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Convert these notes into flashcards.

Return ONLY valid JSON.

Format:
[
  {
    "question": "...",
    "answer": "..."
  }
]

Notes:
${notes}
`,
  });

  return response.text;
};