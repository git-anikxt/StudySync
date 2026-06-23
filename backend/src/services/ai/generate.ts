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

      return text;
    } catch (error) {
      console.log(
        "Gemini failed. Switching to Groq..."
      );

      const { text } =
        await generateText({
          model:
            getFallbackModel(),
          prompt,
        });

      return text;
    }
  };