import { generateWithFallback } from "./generate";

export const generateQuiz = async (
  notes: string
) => {
  const prompt = `
Create 5 multiple-choice questions (MCQs) from these study notes.

Return ONLY valid JSON.

Format:

[
  {
    "question": "...",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Correct Option"
  }
]

Study Notes:

${notes}
`;

  return generateWithFallback(prompt);
};