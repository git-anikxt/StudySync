import { generateWithFallback } from "./generate";

export const generateQuiz = async (
  notes: string
) => {
  const prompt = `
Generate exactly 5 MCQs.

Each question must have exactly 4 options.

correctIndex must be between 0 and 3.

Return ONLY valid JSON.

Format:

[
  {
    "question":"...",
    "options":[
      "...",
      "...",
      "...",
      "..."
    ],
    "correctIndex":1
  }
]

Study Notes:

${notes}
`;

  return generateWithFallback(prompt);
};