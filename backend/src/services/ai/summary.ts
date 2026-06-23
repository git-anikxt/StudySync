import { generateWithFallback } from "./generate";

export const generateSummary =
  async (notes: string) => {
    const prompt = `
Summarize these study notes in concise bullet points.

Study Notes:

${notes}
`;

    return generateWithFallback(
      prompt
    );
  };