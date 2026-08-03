import { generateText } from "ai";

import {
  getPrimaryModel,
  getFallbackModel,
} from "./provider";

export const generateWithFallback =
  async (prompt: string) => {
    try {
      const { text } =
        await generateText({
          model:
            getPrimaryModel(),
          prompt,
        });

      const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

try {
  JSON.parse(cleaned);
  return cleaned;
} catch {
  throw new Error("AI returned invalid JSON");
}
    } catch (error) {
  console.error("Gemini Error:", error);
  console.log("Gemini failed. Switching to Groq...");

      const { text } =
        await generateText({
          model:
            getFallbackModel(),
          prompt,
        });

      const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

try {
  JSON.parse(cleaned);
  return cleaned;
} catch {
  throw new Error("AI returned invalid JSON");
}
    }
  };