import { generateWithFallback } from "./generate";

export const generateFlashcards =
  async (notes: string) => {
    const prompt = `
Create flashcards from these study notes.

Return ONLY valid JSON.

Format:

[
  {
    "question": "...",
    "answer": "..."
  }
]

Study Notes:

${notes}
`;

    return generateWithFallback(
      prompt
    );
  };