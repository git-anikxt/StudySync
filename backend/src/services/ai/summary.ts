import { generateWithFallback } from "./generate";

export const generateSummary =
  async (notes: string) => {
    const prompt = `
You are an AI study assistant.

Read the study notes and return ONLY valid JSON.

Do not use markdown.
Do not wrap the JSON in \`\`\`.
Do not add explanations.

Return ONLY valid JSON.

The response MUST start with {
and MUST end with }

Do not write any explanation.
Do not write markdown.
Do not write code fences.

{
  "title":"...",
  "overview":"...",
  "points":[
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}

Study Notes:

${notes}
`;

    return generateWithFallback(
      prompt
    );
  };