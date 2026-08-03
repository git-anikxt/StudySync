import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

console.log(
  "Google Key:",
  process.env.GOOGLE_GENERATIVE_AI_API_KEY?.slice(0, 10)
);

console.log(
  "Groq Key:",
  process.env.GROQ_API_KEY?.slice(0, 10)
);

export const getPrimaryModel =
  () => google("gemini-2.5-flash");

export const getFallbackModel =
  () =>
    groq(
      "llama-3.3-70b-versatile"
    );