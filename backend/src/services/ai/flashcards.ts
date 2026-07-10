import { generateWithFallback } from "./generate";

export const generateFlashcards =
  async (notes: string) => {
    const prompt = `
Create study flashcards.

Generate exactly 10 flashcards.

Return ONLY valid JSON.

[
  {
    "front":"...",
    "back":"..."
  }
]

Study Notes:

${notes}
`;

    return generateWithFallback(
      prompt
    );
  };